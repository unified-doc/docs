import React from 'react';

import { Layout, Text } from '../components';

export default function Roadmap() {
  return (
    <Layout
      description={
        <Text>Initiatives and projects planned in the near future.</Text>
      }
      title="Roadmap">
      <ul>
        <li>
          Implement <code>unified-doc-parse-lowlight</code>. This is a simple +
          low-effort project that can easily make any code file renderable
          through <code>lowlight</code>. <code>unified-doc-parse-json</code>
          explored this approach prematurely and the project will be deprecated
          in the near future once this simple parser is officially supported!
        </li>
        <li>
          Implement <code>unified-doc-parse-csv</code> to render csv as HTML
          tables.
        </li>
        <li>
          Export to <code>.md</code> and <code>.xml</code>.
        </li>
        <li>
          Work on unofficial <code>docx</code> and <code>pdf</code> parsers
          until the <code>unified</code> ecosystem ships formal parsers for
          corresponding syntax trees.
        </li>
        <li>
          Spec out <code>.uni</code> content mime type with the{' '}
          <code>unified</code> community.
        </li>
        <li>
          Work on <code>unified-doc-cli</code> to expose{' '}
          <code>unified-doc</code> APIs conveniently in a CLI.
        </li>
        <li>
          Create better file examples for the official docs.
        </li>
      </ul>
    </Layout>
  );
}
