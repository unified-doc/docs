import React from 'react';
import { Input as ThemeUiInput } from 'theme-ui';

import { Label } from '~/ui';

export default function FileInput({ id, label, onChange }) {
  return (
    <Label htmlFor={id}>
      {label}
      <ThemeUiInput
        id={id}
        sx={{ border: 'border' }}
        type="file"
        onChange={(event) => onChange(event.target.files[0])}
      />
    </Label>
  );
}
