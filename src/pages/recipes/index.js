import { Link } from 'gatsby';
import React from 'react';

import { Flex, Layout, SummaryItem } from '~/ui';

const links = [
  {
    title: 'Search',
    description:
      'Easily implement interactive search + results.  Customize search algorithms',
    to: './search',
  },
];

export default function Recipes() {
  return (
    <Layout title="Recipes">
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
