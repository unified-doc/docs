import React from 'react';

import { Box } from '~/ui';

export default function Card({ children, sx = {}, ...rest }) {
  return (
    <Box
      px={4}
      py={3}
      sx={{
        ...sx,
        borderRadius: '4px',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
      }}
      {...rest}>
      {children}
    </Box>
  );
}
