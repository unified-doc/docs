import { throttle } from 'lodash';
import React, { createElement, useCallback, useMemo, useState } from 'react';
import highlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import { saveFile } from 'unified-doc-dom';
import unifiedDoc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { Box, Flex, IconDropdown, Icon, Pre, Text, TextInput } from '.';

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

export default function Doc({ content, filename, onClose = undefined }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(previewTypes.COMPILED);

  const doc = useMemo(() => {
    return unifiedDoc({
      compiler: [[rehype2react, { createElement }]],
      content,
      filename,
      marks: results,
      postPlugins: [highlight],
      searchOptions: {
        minQueryLength: 2,
        snippetOffsetPadding: 50,
      },
    });
  }, [content, filename, results]);

  const docContents = useMemo(() => {
    switch (selectedPreview) {
      case previewTypes.HAST:
        return <Pre>{JSON.stringify(doc.parse(), null, 2)}</Pre>;
      case previewTypes.TEXT_CONTENT:
        return <Pre>{doc.textContent()}</Pre>;
      case previewTypes.COMPILED:
      default:
        return doc.compile().result;
    }
  }, [doc, selectedPreview]);

  const previewItems = Object.values(previewTypes).map((previewType) => {
    return {
      active: previewType === selectedPreview,
      label: previewType,
      onClick: () => {
        setSelectedPreview(previewType);
        setQuery('');
        setResults([]);
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

  const search = useCallback(
    // @ts-ignore
    throttle((updatedQuery) => {
      const updatedResults = doc.search(updatedQuery).map((result) => ({
        ...result,
        id: uuidv4(),
      }));
      setResults(updatedResults);
    }, 2000),
    [],
  );

  return (
    <Flex
      flexDirection="column"
      p={4}
      space={2}
      sx={{ borderRadius: 'l', boxShadow: 'doc', width: '100%' }}>
      <Flex alignItems="center" justifyContent="space-between" space={3}>
        <Box sx={{ flex: '1 1 auto' }}>
          <TextInput
            id="search"
            placeholder={`search in "${filename}"...`}
            value={query}
            onChange={(updatedQuery) => {
              setSelectedPreview(previewTypes.COMPILED);
              setQuery(updatedQuery);
              // @ts-ignore
              search(updatedQuery);
            }}
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
      {results.length > 0 && (
        <>
          <Text color="secondary" variant="small">
            {results.length} results found
          </Text>
          <Flex
            flexDirection="column"
            space={1}
            sx={{ maxHeight: 200, overflow: 'auto' }}>
            {results.map((result) => {
              const { id, snippet } = result;
              const [left, matched, right] = snippet;
              return (
                <Text
                  key={id}
                  as="a"
                  href={`#${id}`}
                  sx={{
                    flex: '0 0 auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  variant="small">
                  …{left}
                  <Box as="strong" color="text">
                    {matched}
                  </Box>
                  {right}…
                </Text>
              );
            })}
          </Flex>
        </>
      )}
      <Box py={2} />
      {docContents}
    </Flex>
  );
}
