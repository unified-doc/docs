import React, { useState } from 'react';

import { Box, Flex, Icon, Text } from '~/ui';

const p = 3;

export default function IconDropdown({
  icon,
  items,
  label,
  enableResponsiveLabelHide = false,
}) {
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
          width: 'max-content',
        }}>
        <Icon
          enableResponsiveLabelHide={enableResponsiveLabelHide}
          icon={icon}
          label={label}
        />
        {shown && (
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
            {items.map((item) => {
              const { active, label, onClick } = item;
              return (
                <Text
                  key={label}
                  color={active ? 'primary' : undefined}
                  variant="link"
                  onClick={onClick}>
                  {label}
                </Text>
              );
            })}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
