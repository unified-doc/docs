import { useStaticQuery, graphql } from 'gatsby';
import JSZipUtils from 'jszip-utils';
import mammoth from 'mammoth';
import React, { useState } from 'react';
import Doc from 'unified-doc';
import { v4 as uuidv4 } from 'uuid';

import { Card, DocPreview, FileInput, Flex, Icon } from '~/ui';

function rename(filename, extension) {
  const doc = Doc({ content: '', filename });
  return doc.file().stem + extension;
}

export default function DocxExample() {
  const data = useStaticQuery(graphql`
    query DocxFileQuery {
      file(base: { eq: "doc.docx" }) {
        publicURL
      }
    }
  `);
  const sampleDocxUrl = data.file.publicURL;
  const [docData, setDocData] = useState(null);
  const [id, setId] = useState(uuidv4());

  async function updateDocData(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    setDocData({
      content: result.value,
      filename: rename(file.name, '.html'),
    });
    setId(uuidv4());
  }

  let docPreview;
  if (docData) {
    const { content, filename } = docData;
    docPreview = <DocPreview content={content} filename={filename} id={id} />;
  }

  return (
    <Flex flexDirection="column" space={3}>
      <Card>
        <Flex flexDirection="column" space={3}>
          <Flex alignItems="center" justifyContent="space-between" space={3}>
            <FileInput
              accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              id="update-docx"
              label="Upload docx"
              onChange={updateDocData}
            />
            <Icon
              icon="doc"
              label="View Sample DOCX"
              onClick={() => {
                JSZipUtils.getBinaryContent(sampleDocxUrl, (_err, data) => {
                  updateDocData(new File([data], 'sample.docx'));
                });
              }}
            />
          </Flex>
        </Flex>
      </Card>
      {docPreview}
    </Flex>
  );
}
