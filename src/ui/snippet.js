import React from 'react';

import { Text } from '~/ui';

export default function Snippet({ children, id, onClick }) {
  return (
    <Text
      as="a"
      href={`#${id}`}
      sx={{
        display: 'inline-block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
      }}
      variant="small"
      onClick={onClick}>
      …{children}…
    </Text>
  );
}
