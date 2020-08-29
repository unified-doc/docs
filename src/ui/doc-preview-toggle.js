import React, { useState } from 'react';

import { DocPreview, Icon } from '~/ui';

export default function DocPreviewToggle({ content, filename }) {
  const [shown, setShown] = useState(false);
  if (shown) {
    return (
      <DocPreview
        content={content}
        filename={filename}
        onBack={() => setShown(false)}
      />
    );
  }
  return <Icon icon="doc" label={filename} onClick={() => setShown(true)} />;
}
