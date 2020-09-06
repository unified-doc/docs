import React from 'react';

import { Box, Icon } from '~/ui';

export default function HelpIcon({
  tooltip,
  position = 'top',
  size = 'medium',
}) {
  return (
    <Box
      aria-label={tooltip}
      data-microtip-position={position}
      data-microtip-size={size}
      role="tooltip">
      <Icon href="#" icon="help" label="Help" />
    </Box>
  );
}
