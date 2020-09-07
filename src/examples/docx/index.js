import { useStaticQuery, graphql } from 'gatsby';
import React from 'react';

import { Card, FileInput, Flex, Icon } from '~/ui';

import Parser from './parse-docx';

export default function DocxExample() {
  const data = useStaticQuery(graphql`
    query DocxFileQuery {
      file(base: { eq: "doc.docx" }) {
        publicURL
      }
    }
  `);
  const sampleDocxUrl = data.file.publicURL;
  console.log('to be implemented', sampleDocxUrl, Parser);

  return (
    <Flex flexDirection="column" space={3}>
      <Card>
        <Flex flexDirection="column" space={3}>
          <Flex alignItems="center" justifyContent="space-between" space={3}>
            <FileInput
              accept="application/vnd.openxmlformats-officedocument.wordprocessing"
              id="update-docx"
              label="Upload docx"
              onChange={() => console.log('to be implemented')}
            />
            <Icon
              icon="doc"
              label="View Sample DOCX"
              onClick={() => console.log('to be implemented')}
            />
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
