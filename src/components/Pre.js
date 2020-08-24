import React from 'react';

import Box from './Box';

export default function Pre(props) {
  return <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }} {...props} />;
}
