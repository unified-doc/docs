import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { htmlIpsum as initialFile } from '~/files';
import { Button, FileInput, FlexLayout, TextInput } from '~/ui';

import './doc.css';

const viewOptions = {
  HTML: 'html',
  STRING: 'string',
  TEXT: 'text',
  HAST: 'hast',
};

export default function Home() {
  const [file, setFile] = useState(initialFile);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedViewOption, setSelectedViewOption] = useState(
    viewOptions.HTML,
  );

  const annotations = results.map(result => ({
    ...result,
  }));

  const doc = unifiedDoc({
    annotations,
    compiler: [rehype2react, { createElement }],
    filename: file.filename,
    content: file.content,
    searchOptions: { snippetOffsetPadding: 10 },
  });

  async function uploadFile(file) {
    const content = await file.text();
    setFile({ filename: file.filename, content });
  }

  function clearSearch() {
    setQuery('');
    setResults([]);
  }

  function search(value) {
    const results = doc.search(value, { minMatchCharLength: 3 });
    setQuery(value);
    setResults(results.map(result => ({ ...result, id: uuidv4() })));
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
      <FileInput id="upload-file" label="upload file" onChange={uploadFile} />
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
      <TextInput
        id="search"
        label="Search"
        placeholder="search"
        value={query}
        onChange={search}
      />
      {results.map(result => {
        const { id, snippet } = result;
        const [left, matched, right] = snippet;
        return (
          <div key={id}>
            {left}
            <strong>{matched}</strong>
            {right}
          </div>
        );
      })}
      <Button onClick={clearSearch}>Clear</Button>
      {rendered}
    </FlexLayout>
  );
}
