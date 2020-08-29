import React from 'react';
import { Input as ThemeUiInput } from 'theme-ui';

import { Label } from '~/ui';

export default function TextInput({
  id,
  value,
  flex = undefined,
  label = undefined,
  placeholder = undefined,
  onChange = undefined,
  onFocus = undefined,
}) {
  return (
    <Label flex={flex} htmlFor={id}>
      {label}
      <ThemeUiInput
        id={id}
        placeholder={placeholder}
        sx={{ border: 'border' }}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
      />
    </Label>
  );
}
