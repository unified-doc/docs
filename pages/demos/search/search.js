import React, { createElement, useEffect, useRef, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';
import { highlight, selectText } from 'unified-doc-dom';
import { v4 as uuidv4 } from 'uuid';
import 'unified-doc-dom/lib/highlight.css';

import { alice } from '~/files';
import {
  Button,
  Card,
  Checkbox,
  FlexLayout,
  NumberInput,
  Text,
  TextInput,
} from '~/ui';

export default function Search() {
  const docRef = useRef();
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [minQueryLength, setMinQueryLength] = useState(5);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [snippetOffsetPadding, setSnippetOffsetPadding] = useState(100);

  useEffect(() => {
    function callback(selectedText) {
      console.log(selectedText);
    }
    return selectText(docRef.current, { callback });
  });

  const doc = unifiedDoc({
    annotations: results,
    compiler: [rehype2react, { createElement }],
    content: alice.content.slice(0, 50000),
    filename: alice.filename,
    searchOptions: {
      minQueryLength,
      snippetOffsetPadding,
    },
  });

  function clearSearch() {
    setQuery('');
    setResults([]);
  }

  function search(value) {
    const results = doc.search(value, { nocase: !isCaseSensitive }).map(result => ({
      ...result,
      id: uuidv4(),
    }));
    setQuery(value);
    setResults(results);
  }

  // @ts-ignore: fix vfile typing;
  const { result } = doc.compile();

  return (
    <FlexLayout space={3}>
      <Card sx={{ flex: '1 1 auto' }}>
        <div ref={docRef}>{result}</div>
      </Card>
      <FlexLayout flexDirection="column" space={3} sx={{ flex: '0 0 40%' }}>
        <Card>
          <FlexLayout flexDirection="column" space={3}>
            <NumberInput
              id="snippetOffsetPadding"
              label="Snippet Offset"
              value={snippetOffsetPadding}
              onChange={value => {
                setSnippetOffsetPadding(value);
                clearSearch();
              }}
            />
            <NumberInput
              id="minQueryLength"
              label="Min Query Length (min: 3)"
              min={3}
              value={minQueryLength}
              onChange={value => {
                setMinQueryLength(value);
                clearSearch();
              }}
            />
            <Checkbox
              id="isCaseSensitive"
              label="Case Sensitive"
              value={isCaseSensitive}
              onChange={value => {
                setIsCaseSensitive(value);
                clearSearch();
              }}
            />
          </FlexLayout>
        </Card>
        <Card>
          <FlexLayout flexDirection="column" space={3}>
            <TextInput
              id="search"
              label="Search"
              placeholder="e.g. 'alice', 'rabbit', 'alice*rabbit'"
              value={query}
              onChange={search}
            />
            {query.length > 0 && query.length < minQueryLength && (
              <Text variant="info">
                enter at least {minQueryLength} characters in your search query
              </Text>
            )}
            {query.length > 0 &&
              query.length >= minQueryLength &&
              results.length === 0 && (
                <Text variant="info">No results found.</Text>
              )}
            {results.length > 0 && (
              <>
                <Button variant="secondary" onClick={clearSearch}>
                  Clear
                </Button>
                <Text variant="info">{results.length} matches found.</Text>
              </>
            )}
            {results.map(result => {
              const { id, snippet } = result;
              const [left, matched, right] = snippet;
              return (
                <Card
                  key={id}
                  as="a"
                  href={`#${id}`}
                  sx={{
                    cursor: 'pointer',
                    fontSize: 1,
                    textDecoration: 'none',
                    ':hover': {
                      opacity: 0.5,
                    },
                  }}
                  onClick={() => highlight(docRef.current, id)}>
                  <Text variant="muted">
                    …{left}
                    <Text as="span" sx={{ color: 'primary' }}>
                      <strong>{matched}</strong>
                    </Text>
                    {right}…
                  </Text>
                </Card>
              );
            })}
          </FlexLayout>
        </Card>
      </FlexLayout>
    </FlexLayout>
  );
}
