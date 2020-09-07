import { useStaticQuery, graphql } from 'gatsby';
import JSZipUtils from 'jszip-utils';
import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import Doc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { Card, DocPreview, FileInput, Flex, Icon, Text } from '~/ui';

import Parser from './parse-epub';

const FIRST_PAGE_NUMBER = 1;

async function getPage({ content, pageNumber }) {
  const parser = Parser(content);
  await parser.load();
  const result = await parser.parse(pageNumber);
  const pageCount = parser.getPageCount();

  const doc = Doc({
    content: result.content,
    filename: result.filename,
    compiler: [[rehype2react, { createElement }]],
    sanitizeSchema: null,
  });

  return {
    doc,
    pageCount,
    pageNumber,
  };
}

export default function EpubExample() {
  const data = useStaticQuery(graphql`
    query EpubFileQuery {
      file(base: { eq: "doc.epub" }) {
        publicURL
      }
    }
  `);
  const sampleEpubUrl = data.file.publicURL;

  const [page, setPage] = useState(null);
  const [epub, setEpub] = useState(null);
  const [id, setId] = useState(null);

  async function updatePage(
    updatedEpub,
    updatedPageNumber = FIRST_PAGE_NUMBER,
  ) {
    const content =
      updatedEpub instanceof File
        ? await updatedEpub.arrayBuffer()
        : updatedEpub;
    const updatedPage = await getPage({
      content,
      pageNumber: updatedPageNumber,
    });
    setEpub(updatedEpub);
    setPage(updatedPage);
    setId(uuidv4());
  }

  function previousPage() {
    const { pageNumber } = page;
    const updatedPageNumber = Math.max(pageNumber - 1, FIRST_PAGE_NUMBER);
    updatePage(epub, updatedPageNumber);
  }

  function nextPage() {
    const { pageCount, pageNumber } = page;
    const updatedPageNumber = Math.min(pageNumber + 1, pageCount);
    updatePage(epub, updatedPageNumber);
  }

  let docPreview;
  let pagination;
  if (page) {
    const { doc, pageCount, pageNumber } = page;
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
              accept="application/epub+zip"
              id="update-epub"
              label="Upload EPUB"
              onChange={updatePage}
            />
            <Icon
              icon="doc"
              label="View Sample EPUB"
              onClick={() => {
                JSZipUtils.getBinaryContent(sampleEpubUrl, (_err, data) => {
                  updatePage(new File([data], 'sample.epub'));
                });
              }}
            />
          </Flex>
          {pagination}
        </Flex>
      </Card>
      {docPreview}
    </Flex>
  );
}
