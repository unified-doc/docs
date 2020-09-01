import { diffChars } from 'diff';
import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { Box, Card, Flex, Textarea } from '~/ui';

import { markdownContent, htmlContent } from './content';

function diffContents(content1, content2) {
  const marks = [];
  let content = '';
  let start = 0;
  let end = 0;

  const diff = diffChars(content1, content2);

  diff.forEach((part) => {
    const { added, count, removed, value } = part;
    content += value;
    end += count;
    if (added || removed) {
      marks.push({
        classNames: [added ? 'diff-added' : 'diff-removed'],
        id: uuidv4(),
        start,
        end,
        value,
      });
    }
    start = end;
  });

  return { marks, content };
}

export default function DiffExample() {
  const [content1, setContent1] = useState(markdownContent);
  const [content2, setContent2] = useState(htmlContent);

  // apply diff algorithms
  const { marks, content } = diffContents(content1, content2);

  // construct the diffed doc
  const doc = unifiedDoc({
    compiler: [[rehype2react, { createElement }]],
    content,
    filename: 'diff.txt',
    sanitizeSchema: {
      attributes: {
        '*': ['className', 'style'],
        mark: ['dataMarkId', 'id'],
      },
      clobberPrefix: '',
    },
    marks,
  });

  const diffStyles = {
    '.diff-added': {
      background: '#acf2bd',
      color: 'black',
    },
    '.diff-removed': {
      background: '#fdb8c0',
      color: 'black',
    },
  };

  return (
    <Flex flexDirection="column" space={3}>
      <Flex space={3} sx={{ maxHeight: 400 }}>
        <Textarea
          flex="1 1 auto"
          label="Content 1"
          id="content-1"
          value={content1}
          onChange={setContent1}
        />
        <Textarea
          flex="1 1 auto"
          label="Content 2"
          id="content-2"
          value={content2}
          onChange={setContent2}
        />
      </Flex>
      <Box sx={diffStyles}>
        <Card variant="doc">{doc.compile().result}</Card>
      </Box>
    </Flex>
  );
}
