import React from 'react';

import { Flex } from '~/ui';

export default function ResponsiveFlex(props) {
  return (
    <Flex
      {...props}
      flexDirection={['column', 'row']}
      alignItems={['flex-start', props.alignItems]}
    />
  );
}
