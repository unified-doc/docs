import { Link } from 'gatsby';
import React from 'react';

import { GITHUB_URL } from '~/constants/links';
import { Flex, Logo, ResponsiveFlex } from '~/ui';

export default function Nav() {
  return (
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
          <Link to="/recipes">Recipes</Link>
        </Flex>
        <Flex space={3}>
          <Link to="/about">About</Link>
          <Link to="/specs">Specs</Link>
          <a href={GITHUB_URL}>GitHub</a>
        </Flex>
      </Flex>
    </ResponsiveFlex>
  );
}
