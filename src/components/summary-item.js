import React from 'react';

import { Flex } from '.';

export default function SummaryItem({ title, extra }) {
  return (
    <Flex alignItems="flex-start" flexDirection="column" space={2}>
      <h3>{title}</h3>
      {extra}
    </Flex>
  );
}
