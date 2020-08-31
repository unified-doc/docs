import { useStaticQuery, graphql } from 'gatsby';
import React from 'react';

import { DocPreview } from '~/ui';

function extract(data) {
  const { file, name } = data.githubData.data.unifiedDocSpec;
  return {
    filename: `${name}.md`,
    content: file.text,
  };
}

export default function DocPreviewExample() {
  const data = useStaticQuery(graphql`
    query GetUnifiedDocSpec {
      githubData {
        id
        data {
          unifiedDocSpec {
            name
            file {
              text
            }
          }
        }
      }
    }
  `);

  const { content, filename } = extract(data);

  return <DocPreview content={content} filename={filename} />;
}
