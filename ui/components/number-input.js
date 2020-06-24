import React from 'react';
import { Input as ThemeUIInput } from 'theme-ui';

import { Label } from '~/ui';

export default function NumberInput({
  id,
  label,
  placeholder = null,
  value,
  onChange,
  ...rest
}) {
  return (
    <Label htmlFor={id}>
      {label}
      <ThemeUIInput
        id={id}
        placeholder={placeholder}
        type="number"
        value={value}
        onChange={event => onChange(Number(event.target.value))}
        {...rest}
      />
    </Label>
  );
}
