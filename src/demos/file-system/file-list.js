import React from 'react';

import { Box, Flex, Icon, Text } from '../../components';

function Row({ children }) {
  return (
    <Flex alignItems="center" space={3}>
      {children}
    </Flex>
  );
}

function FileNameColumn({ children }) {
  return (
    <Flex alignItems="center" space={3} sx={{ flex: '1 1 auto' }}>
      {children}
    </Flex>
  );
}

function ExtensionColumn({ children }) {
  return <Box sx={{ flex: '0 0 auto', width: '50px' }}>{children}</Box>;
}

function LastModifiedColumn({ children }) {
  return <Box sx={{ flex: '0 0 auto', width: '100px' }}>{children}</Box>;
}

export default function FileList({ files, onSelectFile }) {
  return (
    <Flex flexDirection="column" p={4} space={2} sx={{ boxShadow: 'card' }}>
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
