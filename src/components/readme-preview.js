import React from 'react';

import Doc from './doc';

export default function ReadmePreview({ readme }) {
  return <Doc content={readme} filename="readme.md" />;
}
