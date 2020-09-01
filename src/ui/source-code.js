import React from 'react';

import { DOCS_SRC_URL } from '~/constants/links';
import { Icon } from '~/ui';

export default function SourceCode({ source }) {
  return (
    <Icon icon="code" href={`${DOCS_SRC_URL}/${source}`} label="Source Code" />
  );
}
