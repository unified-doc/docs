import React, { useState } from 'react';

import DocPreview from './doc-preview';
import Flex from './flex';
import Icon from './icon';

export default function ReadmePreview({ readme }) {
  const [shown, setShown] = useState(false);
  if (shown) {
    return (
      <Flex flexDirection="column" space={3}>
        <DocPreview
          content={readme}
          filename="readme.md"
          onClose={() => setShown(false)}
        />
      </Flex>
    );
  }
  return (
    <Icon icon="readme" label="readme.md" onClick={() => setShown(true)} />
  );
}
