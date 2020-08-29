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
  return <Flex flex="0 0 50px">{children}</Flex>;
}

function LastModifiedColumn({ children }) {
  return <Flex flex="0 0 100px">{children}</Flex>;
}

export default function FileList({ files, onSelectFile }) {
  return (
    <Flex
      flex="1 1 auto"
      flexDirection="column"
      p={4}
      space={2}
      sx={{ boxShadow: 'card' }}>
      <Row>
        <FileNameColumn>
          <Text as="strong" variant="small">
            File
          </Text>
        </FileNameColumn>
        <ExtensionColumn>
          <Text as="strong" variant="small">
            Type
          </Text>
        </ExtensionColumn>
        <LastModifiedColumn>
          <Text as="strong" variant="small">
            Last modified
          </Text>
        </LastModifiedColumn>
      </Row>
      {files.map((file) => {
        const { doc, folder, lastModified, name } = file;
        const filename = `${folder}/${name}`;
        return (
          <Text
            key={filename}
            variant="link"
            onClick={() => onSelectFile(file)}>
            <Row>
              <FileNameColumn>
                <Icon icon="file" />
                {filename}
              </FileNameColumn>
              <ExtensionColumn>{doc.file().extension}</ExtensionColumn>
              <LastModifiedColumn>{lastModified}</LastModifiedColumn>
            </Row>
          </Text>
        );
      })}
    </Flex>
  );
}
