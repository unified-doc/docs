import React from 'react';
import { Label as ThemeUILabel } from 'theme-ui';

import { Flex } from '~/ui';

export default function Label({
  children,
  htmlFor,
  direction = 'column',
  flex = '0 0 content',
}) {
  return (
    <Flex
      as={ThemeUILabel}
      alignItems={direction === 'row' ? 'center' : 'flex-start'}
      color="secondary"
      flex={flex}
      flexDirection={direction}
      htmlFor={htmlFor}
      sx={{
        fontSize: 0,
        textTransform: 'uppercase',
      }}>
      {children}
    </Flex>
  );
}
