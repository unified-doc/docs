import { useStaticQuery, graphql } from 'gatsby';
import React, { useMemo, useState } from 'react';
import Doc from 'unified-doc';

import { DocPreview } from '~/ui';

import FileList from './file-list';

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
  const {
    exampleCodeFiles,
    exampleHtmlFile,
    exampleMarkdownFiles,
  } = data.githubData.data;
  if (exampleHtmlFile.file) {
    const { byteSize, text } = exampleHtmlFile.file;
    const filename = `alice.html`;
    const startIndex = text.indexOf('<h1');
    const file = {
      byteSize,
      text: text.slice(startIndex),
    };
    files.push(createFile(file, filename, 'html'));
  }
  exampleMarkdownFiles.edges.forEach((edge) => {
    const { name, file } = edge.node;
    if (file) {
      const filename = `${name}.md`;
      files.push(createFile(file, filename, 'md'));
    }
  });
  exampleCodeFiles.folder.languages.forEach((language) => {
    const file = (language.test.files || [])[0]?.file;
    if (file && file.text) {
      const filename = `code.${language.name}`;
      files.push(createFile(file, filename, 'code'));
    }
  });
  return files;
}

export default function FileSystemExample() {
  const data = useStaticQuery(graphql`
    query GetAllFiles {
      githubData {
        id
        data {
          exampleCodeFiles {
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
          exampleHtmlFile {
            file {
              byteSize
              text
            }
          }
          exampleMarkdownFiles {
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

  const files = useMemo(() => extract(data), [data]);
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
