import { useStaticQuery, graphql } from 'gatsby';
import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import { v4 as uuidv4 } from 'uuid';

import Archive from '~/archive';
import { Card, DocPreview, FileInput, Flex, Icon, Text } from '~/ui';

import parser, { getPageCount } from './parse-pdf';

const FIRST_PAGE_NUMBER = 1;
const PAGE_SIZE = 1;

async function getPage({ content, filename, pageCount, pageNumber }) {
  const archiveOptions = {
    content,
    filename,
    pageCount,
    parser,
  };
  const docOptions = {
    compiler: [[rehype2react, { createElement }]],
    sanitizeSchema: null,
  };
  const archive = Archive(archiveOptions, docOptions);
  const result = await archive.parse({ pageNumber, pageSize: PAGE_SIZE });

  return result.pages[0];
}

export default function PdfExample() {
  const data = useStaticQuery(graphql`
    query PdfFileQuery {
      file(base: { eq: "doc.pdf" }) {
        publicURL
      }
    }
  `);
  const samplePdfUrl = data.file.publicURL;

  const [page, setPage] = useState(null);
  const [pageCount, setPageCount] = useState(FIRST_PAGE_NUMBER);
  const [pdf, setPdf] = useState(null);
  const [id, setId] = useState(null);

  async function updatePage(updatedPdf, updatedPageNumber = FIRST_PAGE_NUMBER) {
    const filename = pdf?.name || 'sample';
    const content =
      updatedPdf instanceof File ? await updatedPdf.arrayBuffer() : updatedPdf;
    const updatedPageCount = await getPageCount(content);
    const updatedPage = await getPage({
      content,
      filename,
      pageCount: updatedPageCount,
      pageNumber: updatedPageNumber,
    });
    setPdf(updatedPdf);
    setPage(updatedPage);
    setPageCount(updatedPageCount);
    setId(uuidv4());
  }

  function previousPage() {
    const { pageNumber } = page;
    const updatedPageNumber = Math.max(pageNumber - 1, FIRST_PAGE_NUMBER);
    updatePage(pdf, updatedPageNumber);
  }

  function nextPage() {
    const { pageNumber } = page;
    const updatedPageNumber = Math.min(pageNumber + 1, pageCount);
    updatePage(pdf, updatedPageNumber);
  }

  let docPreview;
  let pagination;
  if (page) {
    const { doc, pageNumber } = page;
    const { content, name } = doc.file();
    docPreview = <DocPreview content={content} filename={name} id={id} />;
    pagination = (
      <Flex alignItems="center" justifyContent="center" space={3}>
        <Icon
          disabled={pageNumber <= FIRST_PAGE_NUMBER}
          icon="back"
          onClick={previousPage}
        />
        <Text variant="small">Page {pageNumber}</Text>
        <Icon
          disabled={pageNumber >= pageCount}
          icon="next"
          onClick={nextPage}
        />
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" space={3}>
      <Card>
        <Flex flexDirection="column" space={3}>
          <Flex alignItems="center" justifyContent="space-between" space={3}>
            <FileInput
              accept="application/pdf"
              id="update-pdf"
              label="Upload PDF"
              onChange={updatePage}
            />
            <Icon
              icon="doc"
              label="View Sample PDF"
              onClick={() => updatePage(samplePdfUrl)}
            />
          </Flex>
          {pagination}
        </Flex>
      </Card>
      {docPreview}
    </Flex>
  );
}
