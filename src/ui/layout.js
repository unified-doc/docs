import { MDXProvider } from '@mdx-js/react';
import { Link } from 'gatsby';
import { preToCodeBlock } from 'mdx-utils';
import React from 'react';

import { GITHUB_URL } from '~/constants/links';
import { Box, CodeBlock, Flex, Logo, ResponsiveFlex, Text } from '~/ui';

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
        <ResponsiveFlex
          alignItems="baseline"
          justifyContent="space-between"
          py={3}
          space={4}>
          <Logo />
          <Flex flex="1 1 auto" justifyContent="space-between" space={3}>
            <Flex space={3}>
              <Link to="/packages">Packages</Link>
              <Link to="/examples">Examples</Link>
            </Flex>
            <Flex space={3}>
              <Link to="/about">About</Link>
              <Link to="/specs">Specs</Link>
              <a href={GITHUB_URL}>GitHub</a>
            </Flex>
          </Flex>
        </ResponsiveFlex>
        <Box sx={{ flex: '1 1 auto' }}>{children}</Box>
        <Flex mt={6} py={3}>
          <Text color="light" variant="small">
            © 2020 <a href={GITHUB_URL}>unified-doc</a>
          </Text>
        </Flex>
      </Flex>
    </MDXProvider>
  );
}
