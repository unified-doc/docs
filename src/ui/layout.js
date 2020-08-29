import { Link } from 'gatsby';
import React from 'react';

import { GITHUB_URL } from '~/constants/links';
import { Box, Flex, Logo, ResponsiveFlex, Text } from '~/ui';

export default function Layout({ children }) {
  return (
    <Flex
      flexDirection="column"
      mx="auto"
      px={4}
      space={5}
      sx={{ maxWidth: 840, minHeight: '100vh' }}>
      <ResponsiveFlex
        alignItems="baseline"
        justifyContent="space-between"
        py={3}
        space={4}>
        <Logo />
        <Flex flex="1 1 auto" justifyContent="space-between" py={2} space={3}>
          <Flex space={3}>
            <Link to="/packages">Packages</Link>
            <Link to="/examples">Examples</Link>
          </Flex>
          <Flex space={3}>
            <Link to="/specs">Specs</Link>
            <Link to="/roadmap">Roadmap</Link>
            <a href={GITHUB_URL}>GitHub</a>
          </Flex>
        </Flex>
      </ResponsiveFlex>
      <Box sx={{ flex: '1 1 auto' }}>{children}</Box>
      <Flex mt={6} py={3}>
        <Text variant="small">© 2020 unified-doc</Text>
      </Flex>
    </Flex>
  );
}
