import { useStaticQuery, graphql } from 'gatsby';
import moment from 'moment';
import React, { useState } from 'react';
import Doc from 'unified-doc';

import { DocPreview } from '~/ui';

import FileList from './file-list';

export default function FileSystem() {
  const data = useStaticQuery(graphql`
    query getCodeFiles {
      githubData {
        id
        data {
          aliceHtml {
            file {
              byteSize
              text
            }
          }
          codeFiles {
            folder {
              languages {
                name
                test {
                  files {
                    file {
                      byteSize
                      text
                    }
                  }
                }
              }
            }
          }
          syntaxTreeReadmes {
            edges {
              node {
                name
                file {
                  byteSize
                  text
                }
              }
            }
          }
        }
      }
    }
  `);

  const [files] = useState(extract(data));
  const [selectedFile, setSelectedFile] = useState(null);

  if (selectedFile) {
    return (
      <DocPreview
        content={selectedFile.content}
        filename={selectedFile.name}
        onBack={() => setSelectedFile(null)}
      />
    );
  }

  return <FileList files={files} onSelectFile={setSelectedFile} />;
}

function extract(data) {
  function createFile(blob, filename, type) {
    const { byteSize, text: content } = blob;
    const doc = Doc({ content, filename });
    const { extension, stem } = doc.file();
    return {
      byteSize,
      content,
      extension,
      name: filename,
      stem,
      type,
    };
  }

  const files = [];
  const { aliceHtml, codeFiles, syntaxTreeReadmes } = data.githubData.data;
  if (aliceHtml.file) {
    const filename = `alice.html`;
    files.push(createFile(aliceHtml.file, filename, 'html'));
  }
  syntaxTreeReadmes.edges.forEach((edge) => {
    const { name, file } = edge.node;
    if (file) {
      const filename = `${name}.md`;
      files.push(createFile(file, filename, 'md'));
    }
  });
  codeFiles.folder.languages.forEach((language) => {
    const file = (language.test.files || [])[0]?.file;
    if (file && file.text) {
      const filename = `code.${language.name}`;
      files.push(createFile(file, filename, 'code'));
    }
  });
  return files;
}
