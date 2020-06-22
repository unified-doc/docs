import { diffChars } from 'diff';
import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { htmlIpsum, markdownIpsum } from '~/files';
import { Box, Card, FlexLayout, Textarea } from '~/ui';

import './diff.css';

function diffContents(content1, content2) {
  const annotations = [];
  let content = '';
  let start = 0;
  let end = 0;

  const diff = diffChars(content1, content2);

  diff.forEach(part => {
    const { added, count, removed, value } = part;
    content += value;
    end += count;
    if (added || removed) {
      annotations.push({
        classNames: [added ? 'diff-added' : 'diff-removed'],
        id: uuidv4(),
        start,
        end,
        value,
      });
    }
    start = end;
  });

  return { annotations, content };
}

export default function DiffDemo() {
  const [content1, setContent1] = useState(markdownIpsum.content);
  const [content2, setContent2] = useState(htmlIpsum.content);

  // apply diff algorithms
  const { annotations, content } = diffContents(content1, content2);

  // construct the diffed doc
  const docDiff = unifiedDoc({
    annotations,
    compiler: [rehype2react, { createElement }],
    content,
    filename: 'diff.txt',
  });

  // @ts-ignore: fix when Vfile typing is fixed
  const { result } = docDiff.compile();

  return (
    <FlexLayout space={4}>
      <Card sx={{ flex: '0 0 40%' }}>
        <FlexLayout flexDirection="column" space={6}>
          <Textarea
            label="Content 1"
            id="content-1"
            value={content1}
            onChange={setContent1}
          />
          <Textarea
            label="Content 2"
            id="content-2"
            value={content2}
            onChange={setContent2}
          />
        </FlexLayout>
      </Card>
      <Card sx={{ flex: '1 1 auto' }}>
        <FlexLayout flexDirection="column">
          <h4>Diff</h4>
          <Box as="prep" sx={{ whiteSpace: 'pre-line' }}>
            {result}
          </Box>
        </FlexLayout>
      </Card>
    </FlexLayout>
  );
}
