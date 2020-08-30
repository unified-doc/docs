import React from 'react';

import { GITHUB_URL } from '~/constants/links';
import { Flex, Text } from '~/ui';

export default function Footer() {
  return (
    <Flex mt={6} py={3}>
      <Text color="light" variant="small">
        © 2020 <a href={GITHUB_URL}>unified-doc</a>
      </Text>
    </Flex>
  );
}
