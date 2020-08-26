import React from 'react';

import { Flex } from '.';

export default function ResponsiveFlex(props) {
  return (
    <Flex
      {...props}
      flexDirection={['column', 'row']}
      alignItems={['flex-start', 'center']}
      space={[2, props.space]}
    />
  );
}
