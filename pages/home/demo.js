import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { htmlIpsum as initialFile } from '~/files';
import { Button, FlexLayout, Input } from '~/ui';

import './doc.css';

const viewOptions = {
  HTML: 'html',
  STRING: 'string',
  TEXT: 'text',
  HAST: 'hast',
};

export default function Home() {
  const [file, setFile] = useState(initialFile);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedViewOption, setSelectedViewOption] = useState(
    viewOptions.HTML,
  );

  const annotations = searchResults.map(searchResult => ({
    ...searchResult,
  }));

  const doc = unifiedDoc({
    annotations,
    compiler: [rehype2react, { createElement }],
    filename: file.filename,
    content: file.content,
    searchOptions: { snippetOffsetPadding: 10 },
  });

  async function handleUploadFile(event) {
    const file = event.target.files[0];
    const content = await file.text();
    setFile({ filename: file.filename, content });
  }

  function handleClearSearch() {
    setSearchQuery('');
    setSearchResults([]);
  }

  function handleSearch(event) {
    const query = event.target.value;
    const searchResults = doc.search(query, { minMatchCharLength: 3 });
    setSearchQuery(query);
    setSearchResults(
      searchResults.map(searchResult => ({ ...searchResult, id: uuidv4() })),
    );
  }

  const compiled = doc.compile();
  const hast = doc.parse();
  const text = doc.text();
  const string = doc.string();

  let rendered;
  switch (selectedViewOption) {
    case viewOptions.STRING:
      rendered = <pre>{string}</pre>;
      break;
    case viewOptions.TEXT:
      rendered = <pre>{text}</pre>;
      break;
    case viewOptions.HAST:
      rendered = <pre>{JSON.stringify(hast, null, 2)}</pre>;
      break;
    case viewOptions.HTML:
    default:
      // @ts-ignore: TODO: fix when vfile typing is fixed.
      rendered = <div className="doc">{compiled.result}</div>;
      break;
  }

  return (
    <FlexLayout alignItems="flex-start" flexDirection="column" space={4}>
      <div>
        Render, search, annotate, transform, and output files for any document
        with supported content types.
      </div>
      <Input type="file" onChange={handleUploadFile} />
      <FlexLayout space={2}>
        {Object.values(viewOptions).map(viewOption => (
          <Button
            key={viewOption}
            variant={
              viewOption === selectedViewOption ? 'primary' : 'secondary'
            }
            onClick={() => setSelectedViewOption(viewOption)}>
            {viewOption}
          </Button>
        ))}
      </FlexLayout>
      <Input value={searchQuery} onChange={handleSearch} />
      {searchResults.map(searchResult => {
        const { id, snippet } = searchResult;
        const [left, matched, right] = snippet;
        return (
          <div key={id}>
            {left}
            <strong>{matched}</strong>
            {right}
          </div>
        );
      })}
      <Button onClick={handleClearSearch}>Clear</Button>
      {rendered}
    </FlexLayout>
  );
}
