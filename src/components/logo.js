import { Link } from 'gatsby';
import React from 'react';

import Box from './box';
import Text from './text';

export default function Logo() {
  return (
    <Text as={Link} to="/" sx={{ fontSize: 3 }}>
      <Box sx={{ color: 'primary', display: 'inline' }}>uni</Box>fied-doc
    </Text>
  );
}
