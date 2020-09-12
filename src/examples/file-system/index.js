import { useStaticQuery, graphql } from 'gatsby';
import React, { useMemo, useState } from 'react';
import Doc from 'unified-doc';

import { DocPreview } from '~/ui';

import FileList from './file-list';

function extract(data) {
  function createFile(file) {
    const { byteSize, name, content } = file;
    const doc = Doc({ content, filename: name });
    const { extension, stem } = doc.file();
    return {
      byteSize,
      content,
      extension,
      name,
      stem,
    };
  }

  const files = [];
  const {
    exampleCodeFiles,
    exampleCsvFile,
    exampleHtmlFile,
    exampleMarkdownFile,
  } = data.githubData.data;
  // add example html file
  if (exampleHtmlFile) {
    const { byteSize, text } = exampleHtmlFile.file;
    const startIndex = text.indexOf('<h1');
    files.push(
      createFile({
        byteSize,
        content: text.slice(startIndex),
        name: 'doc.html',
      }),
    );
  }
  // add example markdown file
  if (exampleMarkdownFile) {
    const { byteSize, text } = exampleMarkdownFile.file;
    files.push(
      createFile({
        byteSize,
        content: text,
        name: 'doc.md',
      }),
    );
  }
  // add example csv file
  if (exampleCsvFile) {
    const { byteSize, text } = exampleCsvFile.file;
    files.push(
      createFile({
        byteSize,
        content: text,
        name: 'doc.csv',
      }),
    );
  }
  // add example code files
  exampleCodeFiles.folder.languages.forEach((language) => {
    const file = (language.test.files || [])[0]?.file;
    if (file && file.text) {
      const { byteSize, text } = file;
      files.push(
        createFile({
          byteSize,
          content: text,
          name: `code.${language.name}`,
        }),
      );
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
          exampleCsvFile {
            file {
              byteSize
              text
            }
          }
          exampleHtmlFile {
            file {
              byteSize
              text
            }
          }
          exampleMarkdownFile {
            file {
              byteSize
              text
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
