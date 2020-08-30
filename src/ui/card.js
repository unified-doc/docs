import React from 'react';

import { Box } from '~/ui';

export default function Card({ children, sx = {}, ...rest }) {
  return (
    <Box
      p={4}
      sx={{
        ...sx,
        borderRadius: 'm',
        boxShadow: 'card',
      }}
      {...rest}>
      {children}
    </Box>
  );
}
