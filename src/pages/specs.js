import { graphql } from 'gatsby';
import { orderBy } from 'lodash';
import React from 'react';

import { Box, DocPreviewToggle, Layout } from '~/ui';

function extract(data) {
  const specs = Object.values(data.githubData.data).map((node) => ({
    byteSize: node.file.byteSize,
    name: node.name,
    text: node.file.text,
  }));
  return orderBy(specs, ['name'], ['asc']);
}

export default function Specs({ data }) {
  const specs = extract(data);
  return (
    <Layout>
      Specs for how <code>unified-doc</code> projects are designed and
      implemented.
      {specs.map((spec) => {
        const { name, text } = spec;
        return (
          <Box key={name}>
            <h3>{name}</h3>
            <DocPreviewToggle content={text} filename="spec.md" />
          </Box>
        );
      })}
    </Layout>
  );
}

export const query = graphql`
  query GetAllSpecs {
    githubData {
      id
      data {
        unifiedDocSpec {
          name
          file {
            byteSize
            text
          }
        }
        unifiedDocDomSpec {
          name
          file {
            byteSize
            text
          }
        }
      }
    }
  }
`;
