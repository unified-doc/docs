import React from 'react';
import { Input as UIInput } from 'theme-ui';

import { Label } from '.';

export default function TextInput({
  id,
  value,
  onChange = undefined,
  label = undefined,
  placeholder = undefined,
  onFocus = undefined,
}) {
  const input = (
    <UIInput
      id={id}
      placeholder={placeholder}
      sx={{ border: 'border' }}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
    />
  );

  if (label) {
    return <Label htmlFor={id}>{label}</Label>;
  }

  return input;
}
