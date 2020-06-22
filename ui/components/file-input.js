import React from 'react';
import { Input as ThemeUIInput } from 'theme-ui';

import { Label } from '~/ui';

export default function FileInput({ id, label, onChange }) {
  return (
    <Label htmlFor={id}>
      {label}
      <ThemeUIInput
        id={id}
        type="file"
        onChange={event => {
          const file = event.target.files[0];
          onChange(file);
        }}
      />
    </Label>
  );
}
