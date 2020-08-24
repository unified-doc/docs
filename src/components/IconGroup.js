import React, { useState } from 'react';

import Flex from './Flex';
import Icon from './Icon';
import Text from './Text';

export default function IconGroup({ icon, icons, label }) {
  const [shown, setShown] = useState(false);
  return (
    <Flex
      alignItems="center"
      px={3}
      py={1}
      space={3}
      sx={{
        bg: shown ? 'muted' : undefined,
        borderRadius: 'm',
      }}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}>
      <Icon icon={icon} label={label} />
      {shown &&
        icons.map(({ active, label, onClick }) => (
          <Text
            key={label}
            as="a"
            href="#"
            sx={{
              color: active ? 'primary' : undefined,
            }}
            variant="small"
            onClick={onClick}>
            {label}
          </Text>
        ))}
    </Flex>
  );
}
