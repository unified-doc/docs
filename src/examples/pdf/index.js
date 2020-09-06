import { useStaticQuery, graphql } from 'gatsby';
import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import Doc from 'unified-doc';

import { Card, DocPreview, FileInput, Flex, Icon } from '~/ui';

import parsePdf, { getPdfDoc } from './parse-pdf';

function changeExtension(filename, extension) {
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

  // TODO: organize in unified-doc-pages, hardcode viewing last page for testing pagination
  async function updatePdfData(pdfData) {
    const pdfDoc = await getPdfDoc(pdfData);
    const lastPageNumber = pdfDoc.numPages;
    const pages = await parsePdf(pdfData, { pageNumber: lastPageNumber });
    const doc = Doc({
      compiler: [[rehype2react, { createElement }]],
      content: pages[lastPageNumber - 1],
      filename: changeExtension(pdfData?.name || 'sample', '.html'),
      sanitizeSchema: null,
    });
    setDoc(doc);
  }

  let docPreview;
  if (doc) {
    const { content, name } = doc.file();
    docPreview = <DocPreview content={content} filename={name} />;
  }

  return (
    <Flex flexDirection="column" space={3}>
      <Card>
        <Flex alignItems="center" justifyContent="space-between" space={3}>
          <FileInput
            accept="application/pdf"
            id="update-pdf"
            label="Upload PDF"
            onChange={updatePdfData}
          />
          <Icon
            icon="doc"
            label="View Sample PDF"
            onClick={() => updatePdfData(samplePdfUrl)}
          />
        </Flex>
      </Card>
      {docPreview}
    </Flex>
  );
}
