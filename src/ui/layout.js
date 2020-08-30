import { MDXProvider } from '@mdx-js/react';
import { preToCodeBlock } from 'mdx-utils';
import React from 'react';

import { Box, CodeBlock, Flex, Footer, Nav, NavCrumbs } from '~/ui';

const components = {
  pre: (preProps) => {
    const codeProps = preToCodeBlock(preProps);
    return codeProps ? <CodeBlock {...codeProps} /> : <pre {...preProps} />;
  },
};

export default function Layout({ children }) {
  return (
    <MDXProvider components={components}>
      <Flex
        flexDirection="column"
        mx="auto"
        px={4}
        space={4}
        sx={{ maxWidth: 840, minHeight: '100vh' }}>
        <Nav />
        <NavCrumbs />
        <Box sx={{ flex: '1 1 auto' }}>{children}</Box>
        <Footer />
      </Flex>
    </MDXProvider>
  );
}
