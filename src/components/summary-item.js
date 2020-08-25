import React from 'react';

import { Flex, Text } from '.';

export default function SummaryItem({ title, extra }) {
  return (
    <Flex alignItems="flex-start" flexDirection="column" space={2}>
      <Text as="h3">{title}</Text>
      {extra}
    </Flex>
  );
}
