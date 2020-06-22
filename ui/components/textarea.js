import React from 'react';
import { Textarea as ThemeUITextarea } from 'theme-ui';

import { Label } from '~/ui';

export default function Textarea({ id, label, rows = 16, value, onChange }) {
  return (
    <Label htmlFor={id} direction="column">
      {label}
      <ThemeUITextarea
        id={id}
        rows={rows}
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </Label>
  );
}
