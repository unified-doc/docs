import React from 'react';

import { Box, Text } from '~/ui';

import Demo from './demo';

export default [
  {
    name: 'Welcome',
    title: <code>unified-doc</code>,
    render: () => (
      <Box>
        <Text variant="muted">unified document APIs.</Text>
        <Text mt={5} variant="info">
          Use the mouse or arrow keys to navigate this presentation
        </Text>
      </Box>
    ),
  },
  {
    name: 'Definitions',
    title: 'Definitions',
    render: () => (
      <Text variant="muted">
        Important definitions and terms used throughout the project
      </Text>
    ),
  },
  {
    name: 'Definitions / knowledge',
    render: () => (
      <Text variant="muted">
        <code>knowledge</code>: refers to abstract human information that is
        acquired and shared among humans
      </Text>
    ),
  },
  {
    name: 'Definitions / content',
    render: () => (
      <Text variant="muted">
        <code>content</code>: represents the physical materialization of{' '}
        <code>knowledge</code>
      </Text>
    ),
  },
  {
    name: 'Definitions / document',
    render: () => (
      <Text variant="muted">
        <code>document</code>: an abstraction that manages <code>content</code>
      </Text>
    ),
  },
  {
    name: 'Definitions / doc',
    render: () => (
      <Text variant="muted">
        <code>doc</code>: an instance of <code>unified-doc</code> representing a{' '}
        <code>document</code>
      </Text>
    ),
  },
  {
    name: 'doc',
    title: <code>doc</code>,
    render: () => (
      <Text variant="muted">
        <code>doc</code> attribtues and methods
      </Text>
    ),
  },
  {
    name: 'Demo',
    title: 'Demo',
    render: () => (
      <Text variant="muted">
        Interactive demo showcasing <code>unified-doc</code> features
      </Text>
    ),
  },
  {
    name: 'Demo / App',
    isCentered: false,
    render: Demo,
  },
];
