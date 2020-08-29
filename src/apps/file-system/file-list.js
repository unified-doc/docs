import React from 'react';

import { Flex, Icon, Text } from '~/ui';

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
  return (
    <Flex
      flex="1 1 auto"
      flexDirection="column"
      p={4}
      space={2}
      sx={{ boxShadow: 'card' }}>
      <Text color="light" pb={4} variant="small">All content below is openly-sourced from GitHub projects.</Text>
      <Row>
        <FileNameColumn>
          <Text as="strong" variant="small">
            File
          </Text>
        </FileNameColumn>
        <ExtensionColumn>
          <Text as="strong" variant="small">
            Extension
          </Text>
        </ExtensionColumn>
        <ByteSizeColumn>
          <Text as="strong" variant="small">
            Size
          </Text>
        </ByteSizeColumn>
      </Row>
      {files.map((file) => {
        const { byteSize, extension, name, stem } = file;
        return (
          <Text key={name} variant="link" onClick={() => onSelectFile(file)}>
            <Row>
              <FileNameColumn>
                <Icon icon="file" />
                {name}
              </FileNameColumn>
              <ExtensionColumn>{extension}</ExtensionColumn>
              <ByteSizeColumn>{(byteSize / 1000).toFixed(2)} KB</ByteSizeColumn>
            </Row>
          </Text>
        );
      })}
    </Flex>
  );
}
