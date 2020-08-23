import React from 'react';
import highlight from 'rehype-highlight';
import { DocProvider, useDoc } from 'unified-doc-react';
import { saveFile } from 'unified-doc-dom';

import Flex from './flex';
import Icon from './icon';

function Doc() {
  const doc = useDoc();
  const compiled = doc.compile().result;

  return (
    <Flex
      flexDirection="column"
      px={4}
      py={3}
      space={4}
      sx={{ borderRadius: 'l', boxShadow: 'doc' }}>
      <Flex justifyContent="flex-end" space={3}>
        <Icon
          icon="save"
          label="source"
          tooltip="Save original"
          onClick={() => saveFile(doc.file())}
        />
        <Icon
          icon="save"
          label="html"
          tooltip="Save as HTML"
          onClick={() => saveFile(doc.file('.html'))}
        />
        <Icon
          icon="save"
          label="text"
          tooltip="Save text content"
          onClick={() => saveFile(doc.file('.txt'))}
        />
      </Flex>
      {compiled}
    </Flex>
  );
}

export default function WithProvider({ content, filename }) {
  const options = {
    content,
    filename,
    postPlugins: [highlight],
  };
  return (
    <DocProvider options={options}>
      <Doc />
    </DocProvider>
  );
}
