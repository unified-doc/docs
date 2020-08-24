import React, { createElement, useState } from 'react';
import highlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import { saveFile } from 'unified-doc-dom';
import unifiedDoc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import Box from './box';
import Flex from './flex';
import IconGroup from './icon-group';
import Icon from './icon';
import Pre from './pre';
import TextInput from './text-input';

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
  const [selectedPreviewType, setSelectedPreviewType] = useState(
    previewTypes.COMPILED,
  );

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
    setSelectedPreviewType(previewTypes.COMPILED);
    setQuery(updatedQuery);
    setMarks(updatedMarks);
  }

  const previewIcons = Object.values(previewTypes).map((previewType) => {
    return {
      active: previewType === selectedPreviewType,
      label: previewType,
      onClick: () => {
        setSelectedPreviewType(previewType);
        setQuery('');
        setMarks([]);
      },
    };
  });
  const saveIcons = Object.values(extensionTypes).map((extensionType) => {
    return {
      label: extensionType.label,
      onClick: () => saveFile(doc.file(extensionType.extension)),
    };
  });

  let contents;
  switch (selectedPreviewType) {
    case previewTypes.HAST:
      contents = <Pre>{JSON.stringify(doc.parse(), null, 2)}</Pre>;
      break;
    case previewTypes.TEXT_CONTENT:
      contents = <Pre>{doc.textContent()}</Pre>;
      break;
    case previewTypes.COMPILED:
    default:
      contents = doc.compile().result;
      break;
  }

  return (
    <Flex
      flexDirection="column"
      p={4}
      space={4}
      sx={{ borderRadius: 'l', boxShadow: 'doc' }}>
      <Flex alignItems="center" justifyContent="space-between" space={4}>
        <Box sx={{ flex: '1 1 auto' }}>
          <TextInput
            id="search"
            label=""
            placeholder={`search in "${filename}"...`}
            value={query}
            onChange={search}
          />
        </Box>
        <Flex alignItems="center">
          <IconGroup
            icon="eye"
            label={`Preview (${selectedPreviewType})`}
            icons={previewIcons}
          />
          <IconGroup icon="save" label="Download" icons={saveIcons} />
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
