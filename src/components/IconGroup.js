import React, { useState } from 'react';

import Box from './Box';
import Flex from './Flex';
import Icon from './Icon';
import Text from './Text';

export default function IconGroup({ icon, icons, label }) {
  const [shown, setShown] = useState(false);

  return (
    <Box
      onMouseOver={() => setShown(true)}
      onMouseLeave={() => setShown(false)}>
      <Flex
        alignItems="center"
        px={3}
        py={1}
        sx={{
          bg: shown ? 'muted' : undefined,
          borderRadius: 'm',
          position: 'relative',
        }}>
        <Icon icon={icon} />
        <Text variant="link">{label}</Text>
        <Flex
          bg="white"
          flexDirection="column"
          px={3}
          py={3}
          space={3}
          sx={{
            position: 'absolute',
            right: 0,
            top: '100%',
            textAlign: 'right',
          }}>
          {shown &&
            icons.map(({ active, label, onClick }) => (
              <Text
                key={label}
                sx={{
                  color: active ? 'primary' : undefined,
                }}
                variant="link"
                onClick={onClick}>
                {label}
              </Text>
            ))}
        </Flex>
      </Flex>
    </Box>
  );
}
