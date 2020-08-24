import React from 'react';
import { Input as UIInput } from 'theme-ui';

import Label from './label';

export default function TextInput({
  id,
  label,
  placeholder = null,
  value,
  onChange,
}) {
  return (
    <Label htmlFor={id}>
      {label}
      <UIInput
        id={id}
        placeholder={placeholder}
        sx={{ border: 'border' }}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Label>
  );
}
