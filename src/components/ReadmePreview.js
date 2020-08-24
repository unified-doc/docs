import React from 'react';

import Doc from './Doc';

export default function ReadmePreview({ readme }) {
  return <Doc content={readme} filename="readme.md" />;
}
