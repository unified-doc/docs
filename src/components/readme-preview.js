import React, { useState } from 'react';

import { DocPreview, Icon } from '.';

export default function ReadmePreview({ readme }) {
  const [shown, setShown] = useState(false);
  if (shown) {
    return (
      <DocPreview
        content={readme}
        filename="readme.md"
        onClose={() => setShown(false)}
      />
    );
  }
  return (
    <Icon icon="readme" label="readme.md" onClick={() => setShown(true)} />
  );
}
