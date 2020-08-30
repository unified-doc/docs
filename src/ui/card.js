import React from 'react';
import { Card as ThemeUiCard } from 'theme-ui';

export default function Card({ children, variant = 'card' }) {
  return (
    <ThemeUiCard p={4} variant={variant}>
      {children}
    </ThemeUiCard>
  );
}
