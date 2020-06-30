import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';

import * as files from '~/files';
import { downloadFile } from '~/pages/utils';
import { Box, Button, Card, Checkbox, FlexLayout, Select, Text } from '~/ui';

const docs = Object.values(files).map(file =>
  unifiedDoc({
    compiler: [rehype2react, { createElement }],
    content: file.content,
    filename: file.filename,
  }),
);

const previewTypeOptions = [
  { label: 'compiled', value: 'compiled' },
  { label: 'file content', value: 'fileContent' },
  { label: 'text content', value: 'textContent' },
];

function Icon({ contents, filename, isSelected, onClick }) {
  const unit = 30;
  const scaleFactor = 5;
  return (
    <FlexLayout
      alignItems="center"
      bg={isSelected ? 'muted' : undefined}
      flexDirection="column"
      mb={2}
      p={2}
      space={1}
      sx={{
        cursor: 'pointer',
        ':hover': {
          opacity: 0.7,
        },
      }}
      onClick={onClick}>
      <Card
        bg="background"
        p={2}
        sx={{
          cursor: 'pointer',
          ':hover': {
            opacity: 0.7,
          },
        }}>
        <Box
          sx={{
            boxSizing: 'border-box',
            height: 4 * unit,
            overflow: 'hidden',
            width: 3 * unit,
          }}>
          <Box
            sx={{
              transform: `scale(${1 / scaleFactor})`,
              transformOrigin: 'top left',
              width: 3 * scaleFactor * unit,
            }}>
            {contents}
          </Box>
        </Box>
      </Card>
      <Text sx={{ fontSize: '10px' }}>{filename}</Text>
    </FlexLayout>
  );
}

function Preview({ doc }) {
  const [previewType, setPreviewType] = useState('compiled');
  const fileData = doc.file();
  const estimatedFileSizeKb =
    new TextEncoder().encode(fileData.content).length / 1000;

  let preview;
  switch (previewType) {
    case 'fileContent':
      preview = (
        <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {fileData.content}
        </Box>
      );
      break;
    case 'textContent':
      preview = (
        <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {doc.textContent()}
        </Box>
      );
      break;
    case 'compiled':
    default:
      preview = doc.compile().result;
  }

  return (
    <Card sx={{ flex: '0 0 600px' }}>
      <FlexLayout flexDirection="column" space={3}>
        <FlexLayout flexDirection="column" space={2}>
          <h4>{fileData.name}</h4>
          <Text variant="info">
            {fileData.extension.slice(1).toUpperCase()} File -{' '}
            {estimatedFileSizeKb.toFixed(2)}KB
          </Text>
          <FlexLayout space={3}>
            <Button variant="secondary" onClick={() => downloadFile(fileData)}>
              source
            </Button>
            <Button
              variant="secondary"
              onClick={() => downloadFile(doc.file('.txt'))}>
              .txt
            </Button>
            <Button
              variant="secondary"
              onClick={() => downloadFile(doc.file('.html'))}>
              .html
            </Button>
            <Button
              variant="secondary"
              onClick={() => downloadFile(doc.file('.uni'))}>
              .uni
            </Button>
          </FlexLayout>
          <hr />
        </FlexLayout>
        <Select
          id="preview"
          label="Preview"
          value={previewType}
          options={previewTypeOptions}
          onChange={setPreviewType}
        />
        <Card>{preview}</Card>
      </FlexLayout>
    </Card>
  );
}

export default function Files() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [shouldHideExtension, setShouldHideExtension] = useState(false);

  return (
    <FlexLayout flexDirection="column" space={3}>
      <FlexLayout space={4} sx={{ flex: '1 1 auto' }}>
        <Card>
          <FlexLayout flexDirection="column" space={3}>
            <Checkbox
              id="hide-extension"
              label="Hide extension"
              value={shouldHideExtension}
              onChange={setShouldHideExtension}
            />
            <FlexLayout flexWrap="wrap" space={4}>
              {docs.map(doc => {
                // @ts-ignore: fix vfile typing
                const contents = doc.compile().result;
                const fileData = doc.file();
                const filename = shouldHideExtension
                  ? fileData.stem
                  : fileData.name;
                return (
                  <Icon
                    key={filename}
                    contents={contents}
                    filename={filename}
                    isSelected={
                      selectedDoc && selectedDoc?.file().name === fileData.name
                    }
                    onClick={() => setSelectedDoc(doc)}
                  />
                );
              })}
            </FlexLayout>
          </FlexLayout>
        </Card>
        {selectedDoc && <Preview doc={selectedDoc} />}
      </FlexLayout>
    </FlexLayout>
  );
}
