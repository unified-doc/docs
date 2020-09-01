import { throttle } from 'lodash';
import React, {
  createElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import rehypeHighlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import { highlight, saveFile } from 'unified-doc-dom';
import Doc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { GITHUB_URL } from '~/constants/links';
import {
  Box,
  Card,
  Flex,
  IconDropdown,
  Icon,
  Snippet,
  Text,
  TextInput,
} from '~/ui';

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

export default function DocPreview({ content, filename, onBack = undefined }) {
  const docRef = useRef(null);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(previewTypes.COMPILED);

  // initialize a doc instance!
  const doc = useMemo(() => {
    return Doc({
      compiler: [[rehype2react, { createElement }]],
      content,
      filename,
      marks: results,
      prePlugins: [[rehypeHighlight, { ignoreMissing: true }]],
      sanitizeSchema: {
        attributes: {
          '*': ['className', 'style'],
          mark: ['dataMarkId', 'id'],
        },
        clobberPrefix: '',
      },
      searchOptions: {
        minQueryLength: 2,
        snippetOffsetPadding: 30,
      },
    });
  }, [content, filename, results]);

  // memoize doc and file
  const docContents = useMemo(() => {
    switch (selectedPreview) {
      case previewTypes.HAST:
        return JSON.stringify(doc.parse(), null, 2);
      case previewTypes.TEXT_CONTENT:
        return doc.textContent();
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

  // implement save/export via doc.file() method
  const saveItems = Object.values(extensionTypes).map((extensionType) => {
    const { extension, label } = extensionType;
    return {
      label,
      onClick: () => saveFile(doc.file(extension)),
    };
  });

  // implement search using doc.search()
  const search = useCallback(
    // @ts-ignore
    throttle((updatedQuery) => {
      const updatedResults = doc.search(updatedQuery).map((result) => ({
        ...result,
        id: uuidv4(),
      }));
      setResults(updatedResults);
      setShowResults(true);
    }, 1000),
    [],
  );

  const docStyles =
    selectedPreview === previewTypes.COMPILED
      ? undefined
      : {
          fontFamily: 'monospace',
          fontSize: 0,
          whiteSpace: 'pre-wrap',
        };

  return (
    <Card variant="doc">
      <Flex
        flexDirection="column"
        py={4}
        space={3}
        sx={{
          backgroundColor: 'background',
          position: 'sticky',
          top: 0,
        }}>
        <Flex alignItems="center" justifyContent="space-between">
          {onBack ? (
            <Icon icon="back" label="Go back" onClick={onBack} />
          ) : (
            <div />
          )}
          <Flex>
            <IconDropdown
              enableResponsiveLabelHide
              icon="eye"
              label={`Preview (${selectedPreview})`}
              items={previewItems}
            />
            <IconDropdown
              enableResponsiveLabelHide
              icon="save"
              label="Download"
              items={saveItems}
            />
          </Flex>
        </Flex>
        <TextInput
          id="search"
          placeholder={`search in "${filename}"…`}
          value={query}
          onChange={(updatedQuery) => {
            setSelectedPreview(previewTypes.COMPILED);
            setQuery(updatedQuery);
            // @ts-ignore
            search(updatedQuery);
          }}
          onFocus={() => setShowResults(true)}
        />
        {showResults && results.length > 0 && (
          <>
            <Text variant="small">{results.length} results found</Text>
            <Flex
              flexDirection="column"
              space={1}
              sx={{ maxHeight: 200, overflow: 'auto' }}>
              {results.map((result) => {
                const { id, snippet } = result;
                const [left, matched, right] = snippet;
                return (
                  <Flex key={id} flex="0 0 auto">
                    <Snippet
                      id={id}
                      onClick={() => {
                        setShowResults(false);
                        highlight(docRef.current, id);
                      }}>
                      {left}
                      <Box as="strong" bg="primary" color="background">
                        {matched}
                      </Box>
                      {right}
                    </Snippet>
                  </Flex>
                );
              })}
            </Flex>
          </>
        )}
      </Flex>
      <Flex
        flexDirection="column"
        pb={4}
        space={1}
        sx={{ borderBottom: 'muted' }}>
        <Text color="light" variant="small">
          This document is rendered by <a href={GITHUB_URL}>unified-doc.</a>
        </Text>
      </Flex>
      <Box ref={docRef} py={4} sx={docStyles}>
        {docContents}
      </Box>
    </Card>
  );
}
