import React from 'react';
import { Input as ThemeUIInput } from 'theme-ui';

import { Label } from '~/ui';

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
      <ThemeUIInput
        id={id}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </Label>
  );
}
