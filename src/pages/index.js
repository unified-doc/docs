import React from 'react';

import FileSystem from '~/apps/file-system';
import { UNIFIED_URL } from '~/constants/links';
import { Flex, Layout, Text } from '~/ui';

export default function Index() {
  const description = (
    <Flex flexDirection="column" space={3}>
      <Text as="h2">
        A <a href={UNIFIED_URL}>unified</a> way to work with all kinds of
        documents
      </Text>
      <Text>
        Render, search, mark, annotate, convert, and save documents with a
        simple unified API.
      </Text>
      <Flex flexDirection="column" space={2}>
        <Text variant="small">
          Currently supporting: <code>.html</code>, <code>.md</code>,{' '}
          <code>.txt</code>, <code>.json</code>
        </Text>
        <Text variant="small">
          Coming soon: <code>.csv</code>, <code>.xml</code>, <code>.yml</code>,{' '}
          <code>.docx</code>, <code>.pdf</code>, + any code language supported
          by <code>highlight.js</code>!
        </Text>
      </Flex>
    </Flex>
  );
  return (
    <Layout description={description}>
      <FileSystem />
    </Layout>
  );
}
