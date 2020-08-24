import React, { useState } from 'react';

import { Box, Flex, Icon, Text } from '.';

const p = 3;

export default function IconDropdown({ icon, items, label }) {
  const [shown, setShown] = useState(false);

  return (
    <Box
      onMouseOver={() => setShown(true)}
      onMouseLeave={() => setShown(false)}>
      <Flex
        alignItems="center"
        px={p}
        py={1}
        sx={{
          bg: shown ? 'muted' : undefined,
          borderRadius: 'm',
          position: 'relative',
        }}>
        <Icon icon={icon} />
        <Text variant="link">{label}</Text>
        <Flex
          bg="background"
          flexDirection="column"
          px={p}
          py={p}
          space={p}
          sx={{
            position: 'absolute',
            right: 0,
            top: '100%',
            textAlign: 'right',
          }}>
          {shown &&
            items.map((item) => {
              const { active, label, onClick } = item;
              return (
                <Text
                  key={label}
                  sx={{ color: active ? 'primary' : undefined }}
                  variant="link"
                  onClick={onClick}>
                  {label}
                </Text>
              );
            })}
        </Flex>
      </Flex>
    </Box>
  );
}
