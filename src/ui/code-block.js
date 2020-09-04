import { mdx } from '@mdx-js/react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import github from 'prism-react-renderer/themes/github';
import React, { createElement } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import { Card, Box, Flex, Text, theme } from '~/ui';

// TODO: this is a hack, not sure how else to auto-pass libraries into MDX scope
import rehypePrism from '@mapbox/rehype-prism';
import rehypeHighlight from 'rehype-highlight';
import rehype2react from 'rehype-react';
import Doc from 'unified-doc';
import visit from 'unist-util-visit';
const scope = {
  mdx,
  createElement,
  rehype2react,
  rehypeHighlight,
  rehypePrism,
  Doc,
  visit,
};

// https://mdxjs.com/guides/live-code
export default function CodeBlock({ codeString, className, live, render }) {
  const language = className.replace(/language-/, '');

  let content;

  const Code = (
    <Box>
      <Text variant="small">Code</Text>
      <Highlight
        {...defaultProps}
        code={codeString}
        language={language}
        theme={github}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Box
            as="pre"
            className={className}
            p={2}
            sx={{ ...style, overflow: 'auto' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </Box>
        )}
      </Highlight>
    </Box>
  );

  if (live || render) {
    content = (
      <LiveProvider
        code={codeString}
        scope={scope}
        transformCode={(code) => '/** @jsx mdx */' + code}>
        <Flex flexDirection="column" sx={{ fontFamily: 'body' }}>
          {render && Code}
          {live && (
            <>
              <LiveError />
              <Text variant="small">Live Code Editor</Text>
              <LiveEditor
                style={{
                  fontFamily: theme.fonts.monospace,
                  fontSize: theme.fontSizes[1],
                }}
                theme={github}
              />
            </>
          )}
          <Text mt={3} variant="small">
            Preview
          </Text>
          <Card>
            <LivePreview />
          </Card>
        </Flex>
      </LiveProvider>
    );
  } else {
    content = Code;
  }

  return <Box py={3}>{content}</Box>;
}
