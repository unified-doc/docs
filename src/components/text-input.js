import React from 'react';
import { Input as UIInput } from 'theme-ui';

import { Label } from '.';

export default function TextInput({
  id,
  label = undefined,
  placeholder = undefined,
  value,
  onChange,
}) {
  const input = (
    <UIInput
      id={id}
      placeholder={placeholder}
      sx={{ border: 'border' }}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );

  if (label) {
    return <Label htmlFor={id}>{label}</Label>;
  }

  return input;
}
