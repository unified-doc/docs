import React from 'react';
import { Label as ThemeUILabel } from 'theme-ui';

import { Flex } from '~/ui';

export default function Label({ children, direction = 'column', htmlFor }) {
  return (
    <Flex
      as={ThemeUILabel}
      alignItems={direction === 'row' ? 'center' : 'flex-start'}
      flex="0 0 content"
      flexDirection={direction}
      htmlFor={htmlFor}
      sx={{
        fontSize: 1,
        fontWeight: 'bold',
        textTransform: 'uppercase',
      }}>
      {children}
    </Flex>
  );
}
