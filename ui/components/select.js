import React from 'react';
import { Select as ThemeUISelect } from 'theme-ui';

import { Label } from '~/ui';

export default function Select({
  id,
  label,
  options,
  value,
  width = '160px',
  onChange,
}) {
  return (
    <Label htmlFor={id}>
      {label}
      <ThemeUISelect
        id={id}
        sx={{
          borderColor: 'muted',
          borderStyle: 'solid',
          borderWidth: '1px',
          fontSize: 1,
          width,
        }}
        value={value}
        onChange={event => onChange(event.target.value)}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </ThemeUISelect>
    </Label>
  );
}
