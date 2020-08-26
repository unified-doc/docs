import { Link } from 'gatsby';
import React from 'react';

import { GITHUB_URL } from '../links';
import { Box, Flex, Logo, ResponsiveFlex, Text } from '.';

export default function Layout({
  children,
  description = undefined,
  title = undefined,
}) {
  return (
    <Flex
      flexDirection="column"
      mx="auto"
      px={4}
      space={5}
      sx={{ maxWidth: 840, minHeight: '100vh' }}>
      <ResponsiveFlex justifyContent="space-between" py={3} space={3}>
        <Logo />
        <Flex alignItems="center" py={2} space={3}>
          <Link to="/demos">Demos</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/specs">Specs</Link>
          <Link to="/roadmap">Roadmap</Link>
          <a href={GITHUB_URL}>GitHub</a>
        </Flex>
      </ResponsiveFlex>
      <Flex flexDirection="column" space={2}>
        {title && <Text as="h2">{title}</Text>}
        {description}
      </Flex>
      <Box sx={{ flex: '1 1 auto' }}>{children}</Box>
      <Flex mt={6} py={3}>
        <Text variant="small">© 2020 unified-doc</Text>
      </Flex>
    </Flex>
  );
}
