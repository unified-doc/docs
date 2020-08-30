import React, { useState } from 'react';
import { fromFile } from 'unified-doc-dom';

import { GITHUB_URL } from '~/constants/links';
import { Checkbox, FileInput, Flex, Icon, Text, TextInput } from '~/ui';

function Row({ children }) {
  return (
    <Flex alignItems="center" space={3}>
      {children}
    </Flex>
  );
}

function FileNameColumn({ children }) {
  return (
    <Flex alignItems="center" flex="1 1 auto" space={3}>
      {children}
    </Flex>
  );
}

function ExtensionColumn({ children }) {
  return <Flex flex="0 0 100px">{children}</Flex>;
}

function ByteSizeColumn({ children }) {
  return <Flex flex="0 0 80px">{children}</Flex>;
}

export default function FileList({ files, onSelectFile }) {
  const [showExtension, setShowExtension] = useState(true);
  const [query, setQuery] = useState('');

  return (
    <Flex
      flex="1 1 auto"
      flexDirection="column"
      p={4}
      sx={{ boxShadow: 'card' }}>
      <Text color="light" variant="small">
        <a href={GITHUB_URL}>unified-doc</a> supports rendering{' '}
        <code>.html</code>, <code>.md</code> and most non-markup (i.e. code)
        documents. All content used below are openly-sourced from various
        GitHub.
      </Text>
      <Flex
        bg="background"
        flexDirection="column"
        py={4}
        space={2}
        sx={{ position: 'sticky', top: 0 }}>
        <FileInput
          id="upload"
          label="Upload and view file"
          onChange={async (file) => {
            onSelectFile(await fromFile(file));
          }}
        />
        <Flex alignItems="center" space={4}>
          <TextInput
            id="search"
            flex="1 1 auto"
            placeholder="search files…"
            value={query}
            onChange={setQuery}
          />
          <Checkbox
            id="extension"
            label="Show extension"
            value={showExtension}
            onChange={setShowExtension}
          />
        </Flex>
      </Flex>
      <Flex flexDirection="column" space={2}>
        <Row>
          <FileNameColumn>
            <Text as="strong" variant="small">
              File
            </Text>
          </FileNameColumn>
          {showExtension && (
            <ExtensionColumn>
              <Text as="strong" variant="small">
                Extension
              </Text>
            </ExtensionColumn>
          )}
          <ByteSizeColumn>
            <Text as="strong" variant="small">
              Size
            </Text>
          </ByteSizeColumn>
        </Row>
        {files
          .filter((file) => !query || file.name.match(query, 'gi'))
          .map((file) => {
            const { byteSize, extension, name, stem } = file;
            return (
              <Text
                key={name}
                variant="link"
                onClick={() => onSelectFile(file)}>
                <Row>
                  <FileNameColumn>
                    <Icon icon="file" />
                    {showExtension ? name : stem}
                  </FileNameColumn>
                  {showExtension && (
                    <ExtensionColumn>{extension}</ExtensionColumn>
                  )}
                  <ByteSizeColumn>
                    {(byteSize / 1000).toFixed(2)} KB
                  </ByteSizeColumn>
                </Row>
              </Text>
            );
          })}
      </Flex>
    </Flex>
  );
}
