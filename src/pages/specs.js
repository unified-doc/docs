import { graphql } from 'gatsby';
import { orderBy } from 'lodash';
import React from 'react';

import { DocPreviewToggle, Flex, Layout, SummaryItem } from '~/ui';

export default function Specs({ data }) {
  const specs = extract(data);
  return (
    <Layout
      description={
        <div>
          Specs for how <code>unified-doc</code> projects are designed and
          implemented.
        </div>
      }
      title="Specs">
      <Flex flexDirection="column" space={5}>
        {specs.map((spec) => {
          const { name, text } = spec;
          return (
            <SummaryItem
              key={name}
              extra={<DocPreviewToggle content={text} filename="spec.md" />}
              title={name}
            />
          );
        })}
      </Flex>
    </Layout>
  );
}

function extract(data) {
  const specs = Object.values(data.githubData.data).map((node) => ({
    name: node.name,
    text: node.spec.text,
  }));
  return orderBy(specs, ['name'], ['asc']);
}

export const query = graphql`
  query allSpecs {
    githubData {
      id
      data {
        unifiedDocSpec {
          name
          spec {
            text
          }
        }
        unifiedDocDomSpec {
          name
          spec {
            text
          }
        }
      }
    }
  }
`;
