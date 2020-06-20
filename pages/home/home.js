import React from 'react';

import { FlexLayout, Slides } from '~/ui';

import slides from './slides';

const headerHeight = '80px';
const containerMargin = '32px';

export default function Home() {
  return (
    <FlexLayout
      alignItems="flex-start"
      flexDirection="column"
      p={4}
      space={4}
      sx={{ height: `calc(100vh - 2 * ${containerMargin} - ${headerHeight})` }}>
      <Slides slides={slides} />
    </FlexLayout>
  );
}
