import React from 'react';

import { Box } from '~/ui';

export default function FlexLayout({
  alignItems = undefined,
  children,
  flexDirection = undefined,
  flexWrap = undefined,
  justifyContent = undefined,
  space = 0,
  sx = undefined,
  ...rest
}) {
  const marginDirection = flexDirection === 'column' ? 'mb' : 'mr';

  return (
    <Box
      sx={{
        ...sx,
        alignItems,
        display: 'flex',
        flexDirection,
        flexWrap,
        justifyContent,
        '> :not(:last-child)': {
          [marginDirection]: space,
        },
      }}
      {...rest}>
      {children}
    </Box>
  );
}
