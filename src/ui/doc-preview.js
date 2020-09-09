import { throttle } from 'lodash';
import React, {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import rehypeHighlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import {
  highlight,
  registerMarks,
  saveFile,
  selectText,
} from 'unified-doc-dom';
import Doc, { extensionTypes } from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { GITHUB_URL } from '~/constants/links';
import {
  Box,
  Card,
  Flex,
  IconDropdown,
  HelpIcon,
  Icon,
  Snippet,
  Text,
  TextInput,
} from '~/ui';

const saveFormats = [
  {
    extension: null,
    label: 'Original',
  },
  {
    extension: extensionTypes.HTML,
    label: 'HTML (+marks)',
  },
  {
    extension: extensionTypes.MARKDOWN,
    label: 'Markdown',
  },
  {
    extension: extensionTypes.TEXT,
    label: 'Text content',
  },
];

const previewTypes = {
  COMPILED: 'Compiled',
  TEXT_CONTENT: 'Text content',
  HAST: 'Hast',
};

const TOOLTIP =
  'Search and navigate to matching results.  Bookmark any selected text.  Preview or save the document in various formats (search results and bookmarks included).';

export default function DocPreview({
  content,
  filename,
  id = undefined,
  onBack = undefined,
}) {
  const docRef = useRef(null);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(previewTypes.COMPILED);

  const isCompiledPreview = selectedPreview === previewTypes.COMPILED;

  // a controlled way to reset bookmarks/results
  useEffect(() => {
    if (id) {
      setBookmarks([]);
      setResults([]);
    }
  }, [id]);

  // initialize and memoize doc objects
  const marks = useMemo(() => [...results, ...bookmarks], [results, bookmarks]);
  const doc = useMemo(() => {
    return Doc({
      compiler: [[rehype2react, { createElement }]],
      content,
      filename,
      marks,
      prePlugins: [[rehypeHighlight, { ignoreMissing: true }]],
      sanitizeSchema: null,
      searchOptions: {
        minQueryLength: 2,
        snippetOffsetPadding: 30,
      },
    });
  }, [content, filename, marks]);
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

  // add selectText effect
  useEffect(() => {
    function callback(selectedText) {
      const { start, end, value } = selectedText;
      if (isCompiledPreview && end > start) {
        const shouldAddBookmark = window.confirm(
          `Do you want to add the following bookmark?

        ${value}
        `,
        );
        if (shouldAddBookmark) {
          setBookmarks((previousBookmarks) => [
            ...previousBookmarks,
            {
              id: uuidv4(),
              classNames: ['bookmark'],
              start,
              end,
              data: {
                type: 'bookmark',
                value,
              },
            },
          ]);
        }
      }
    }
    return selectText(docRef.current, { callback });
  }, [isCompiledPreview]);

  // registerMarks
  useEffect(() => {
    const callbacks = {
      onClick: (event, mark) => {
        if (mark.data.type === 'bookmark') {
          event.stopPropagation();
          const shouldRemoveBookmark = window.confirm('Remove bookmark?');
          if (shouldRemoveBookmark) {
            setBookmarks((previousBookmarks) =>
              previousBookmarks.filter((bookmark) => bookmark.id !== mark.id),
            );
          }
        }
      },
    };
    return registerMarks(docRef.current, marks, callbacks);
  }, [marks]);

  // implement search using doc.search()
  const search = useCallback(
    throttle((updatedQuery) => {
      const updatedResults = doc.search(updatedQuery).map((result) => ({
        ...result,
        id: uuidv4(),
        data: {
          type: 'result',
        },
      }));
      setResults(updatedResults);
      setShowResults(true);
    }, 1000),
    [id],
  );

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
  const saveItems = saveFormats.map((saveFormat) => ({
    label: saveFormat.label,
    onClick: () => saveFile(doc.file(saveFormat.extension)),
  }));

  // custom unified-doc mark styles
  const compiledStyle = {
    '[data-mark-id]': {
      backgroundColor: 'primary',
      color: 'background',
      // scrollMarginTop accounts for some sticky headers and scrolls marks to the middle of the viewport height.
      scrollMarginTop: '50vh',
    },
    '[data-mark-id].bookmark': {
      backgroundColor: 'orange',
    },
  };
  const nonCompiledStyle = {
    fontFamily: 'monospace',
    fontSize: 0,
    whiteSpace: 'pre-wrap',
  };
  const docStyle = isCompiledPreview ? compiledStyle : nonCompiledStyle;

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
          <Flex alignItems="center">
            <IconDropdown
              enableResponsiveLabelHide
              icon="eye"
              label={`Preview (${selectedPreview})`}
              items={previewItems}
            />
            <IconDropdown
              enableResponsiveLabelHide
              icon="save"
              label="Save as"
              items={saveItems}
            />
            <Box ml={2}>
              <HelpIcon tooltip={TOOLTIP} />
            </Box>
          </Flex>
        </Flex>
        <TextInput
          id="search"
          placeholder={`search in "${filename}"…`}
          value={query}
          onChange={(updatedQuery) => {
            setSelectedPreview(previewTypes.COMPILED);
            setQuery(updatedQuery);
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
      <Text color="light" variant="small">
        This document is rendered with <a href={GITHUB_URL}>unified-doc.</a>
      </Text>
      <Box ref={docRef} py={4} sx={docStyle}>
        {docContents}
      </Box>
    </Card>
  );
}
