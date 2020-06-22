import _ from 'lodash';
import React, { createElement, useCallback, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { alice } from '~/files';
import { Button, Card, FlexLayout, Text, TextInput } from '~/ui';

const minMatchCharLength = 3;
const snippetOffsetPadding = 30;

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const doc = unifiedDoc({
    annotations: results,
    compiler: [rehype2react, { createElement }],
    content: alice.content.slice(0, 10000),
    filename: alice.filename,
    searchOptions: {
      minMatchCharLength,
      snippetOffsetPadding,
    },
  });

  function clear() {
    setQuery('');
    setResults([]);
  }

  function search(value) {
    const results = doc.search(value).map(result => ({
      ...result,
      id: uuidv4(),
    }));
    setResults(results);
  }

  const debouncedSearch = useCallback(_.debounce(search, 300), []);

  // @ts-ignore: fix vfile typing;
  const { result } = doc.compile();

  // TODO: Configure common search options, toggle between search algorithms

  return (
    <FlexLayout space={3}>
      <Card sx={{ flex: '1 1 auto' }}>{result}</Card>
      <Card sx={{ flex: '0 0 40%' }}>
        <FlexLayout flexDirection="column" space={3}>
          <TextInput
            id="search"
            label="Search"
            placeholder="search (e.g. 'alice', 'rabbit', 'wonder', 'tea')"
            value={query}
            onChange={value => {
              setQuery(value);
              debouncedSearch(value);
            }}
          />
          {query.length > 0 && query.length < minMatchCharLength && (
            <Text variant="info">
              enter at least {minMatchCharLength} characters in your search
              query
            </Text>
          )}
          {query.length > 0 && query.length >= minMatchCharLength && results.length === 0 && (
            <Text variant="info">
              No results found.
            </Text>
          )}
          {results.length > 0 && (
            <Button variant="secondary" onClick={clear}>
              Clear
            </Button>
          )}
          {results.map(result => {
            const { id, snippet } = result;
            const [left, matched, right] = result.snippet;
            return (
              <Card
                key={result.id}
                as="a"
                href={`#${id}`}
                sx={{
                  cursor: 'pointer',
                  fontSize: 1,
                  textDecoration: 'none',
                  ':hover': {
                    opacity: 0.7,
                  },
                }}>
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
  );
}
