import { useStaticQuery, graphql } from 'gatsby';
import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import Doc from 'unified-doc';

import { Box, Card, DocPreview, FileInput, Flex, Icon } from '~/ui';

import parsePdf from './parse-pdf';

function rename(filename, extension) {
  const doc = Doc({ content: '', filename });
  return doc.file().stem + extension;
}

export default function DocPreviewExample() {
  const data = useStaticQuery(graphql`
    query PdfFileQuery {
      file(base: { eq: "doc.pdf" }) {
        publicURL
      }
    }
  `);

  const samplePdfUrl = data.file.publicURL;

  const [doc, setDoc] = useState(null);

  async function updatePdfFile(pdfFile) {
    const html = await parsePdf(pdfFile);
    const doc = Doc({
      compiler: [[rehype2react, { createElement }]],
      content: html,
      filename: rename(pdfFile?.name || 'sample', '.html'),
      sanitizeSchema: null,
    });
    setDoc(doc);
  }

  return (
    <Flex flexDirection="column" space={3}>
      <Card>
        <Flex alignItems="center" justifyContent="space-between" space={3}>
          <FileInput
            accept="application/pdf"
            id="update-pdf"
            label="Upload PDF"
            onChange={updatePdfFile}
          />
          <Icon
            icon="doc"
            label="View Sample PDF"
            onClick={() => {
              updatePdfFile(samplePdfUrl);
            }}
          />
        </Flex>
      </Card>
      {doc && (
        <Box
          sx={{
            '.textLayer': {
              opacity: 1,
              '& ::selection': {
                background: 'rgba(0, 0, 255, 0.1)',
              },
            },
          }}>
          <DocPreview content={doc.file().content} filename={doc.file().name} />
        </Box>
      )}
    </Flex>
  );
}
