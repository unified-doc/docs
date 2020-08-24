import React, { createElement, useState } from 'react';
import highlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import { saveFile } from 'unified-doc-dom';
import unifiedDoc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { Box, Flex, IconDropdown, Icon, Pre, TextInput } from '.';

const extensionTypes = {
  SOURCE: {
    extension: null,
    label: 'Original',
  },
  HTML: {
    extension: '.html',
    label: 'HTML',
  },
  TEXT: {
    extension: '.txt',
    label: 'Text content',
  },
};

const previewTypes = {
  COMPILED: 'Compiled',
  TEXT_CONTENT: 'Text content',
  HAST: 'Hast',
};

export default function DocPreview({ content, filename, onClose = undefined }) {
  const [query, setQuery] = useState('');
  const [marks, setMarks] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(previewTypes.COMPILED);

  const doc = unifiedDoc({
    compiler: [[rehype2react, { createElement }]],
    content,
    filename,
    marks,
    postPlugins: [highlight],
  });

  function search(updatedQuery) {
    const updatedMarks = doc.search(updatedQuery).map((result) => ({
      ...result,
      id: uuidv4(),
    }));
    setSelectedPreview(previewTypes.COMPILED);
    setQuery(updatedQuery);
    setMarks(updatedMarks);
  }

  const previewItems = Object.values(previewTypes).map((previewType) => {
    return {
      active: previewType === selectedPreview,
      label: previewType,
      onClick: () => {
        setSelectedPreview(previewType);
        setQuery('');
        setMarks([]);
      },
    };
  });

  const saveItems = Object.values(extensionTypes).map((extensionType) => {
    const { extension, label } = extensionType;
    return {
      label,
      onClick: () => saveFile(doc.file(extension)),
    };
  });

  let contents;
  switch (selectedPreview) {
    case previewTypes.HAST:
      contents = <Pre>{JSON.stringify(doc.parse(), null, 2)}</Pre>;
      break;
    case previewTypes.TEXT_CONTENT:
      contents = <Pre>{doc.textContent()}</Pre>;
      break;
    case previewTypes.COMPILED:
    default:
      contents = doc.compile().result;
  }

  return (
    <Flex
      flexDirection="column"
      p={4}
      space={3}
      sx={{ borderRadius: 'l', boxShadow: 'doc' }}>
      <Flex alignItems="center" justifyContent="space-between" space={3}>
        <Box sx={{ flex: '1 1 auto' }}>
          <TextInput
            id="search"
            placeholder={`search in "${filename}"...`}
            value={query}
            onChange={search}
          />
        </Box>
        <Flex alignItems="center">
          <IconDropdown
            icon="eye"
            label={`Preview (${selectedPreview})`}
            items={previewItems}
          />
          <IconDropdown icon="save" label="Download" items={saveItems} />
          {onClose && (
            <Box ml={3}>
              <Icon icon="close" onClick={onClose} />
            </Box>
          )}
        </Flex>
      </Flex>
      {contents}
    </Flex>
  );
}
