import { Link } from 'gatsby';
import React from 'react';

import { Flex, Layout, SummaryItem } from '../../components';

const links = [
  {
    title: 'Diff',
    description: 'Compare and diff two contents',
    to: './diff',
  },
  {
    title: 'Ebook',
    description: 'Create and manage bookmarks in an ebook',
    to: './ebook',
  },
  {
    title: 'Esignature',
    description: 'Create placeholders to mark and sign documents',
    to: './esignature',
  },
  {
    title: 'File system',
    description: 'A recreation of a file-system on the web',
    to: './file-system',
  },
  {
    title: 'Search',
    description: 'Easily search documents and navigate to results',
    to: './search',
  },
];

export default function Demos() {
  return (
    <Layout title="Demos">
      <Flex flexDirection="column" space={5}>
        {links.map((link) => {
          const { description, to, title } = link;
          return (
            <SummaryItem
              key={to}
              extra={<div>{description}</div>}
              title={<Link to={to}>{title}</Link>}
            />
          );
        })}
      </Flex>
    </Layout>
  );
}
