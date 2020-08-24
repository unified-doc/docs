import { Link } from 'gatsby';
import React from 'react';

import { Box, Flex, Logo, Text } from '.';

const gitHubLink = 'https://github.com/unified-doc';

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
      space={3}
      sx={{ maxWidth: 840, minHeight: '100vh' }}>
      <Flex
        alignItems={['flex-start', 'center']}
        flexDirection={['column', 'row']}
        justifyContent="space-between"
        py={3}
        space={3}>
        <Logo />
        <Flex alignItems="center" py={2} space={3}>
          <Link to="/demos">Demos</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/specs">Specs</Link>
          <a href={gitHubLink}>GitHub</a>
        </Flex>
      </Flex>
      <Flex flexDirection="column" space={2}>
        {title && <h2>{title}</h2>}
        {description}
      </Flex>
      <Box sx={{ flex: '1 1 auto' }}>{children}</Box>
      <Flex mt={6} py={3}>
        <Text color="secondary" variant="small">
          © 2020 unified-doc
        </Text>
      </Flex>
    </Flex>
  );
}
