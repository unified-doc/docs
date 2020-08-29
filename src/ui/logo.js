import { Link } from 'gatsby';
import React from 'react';

import { Box, Text } from '~/ui';

export default function Logo() {
  return (
    <Text
      as={Link}
      to="/"
      sx={{
        fontSize: 3,
        ':hover': {
          color: 'primary',
        },
      }}>
      <Box as="span" color="primary">
        uni
      </Box>
      fied-doc
    </Text>
  );
}
