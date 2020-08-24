import React, { useState } from 'react';

import { Doc, Icon } from '.';

export default function DocPreview({ content, filename }) {
  const [shown, setShown] = useState(false);
  if (shown) {
    return (
      <Doc
        content={content}
        filename={filename}
        onClose={() => setShown(false)}
      />
    );
  }
  return <Icon icon="doc" label={filename} onClick={() => setShown(true)} />;
}
