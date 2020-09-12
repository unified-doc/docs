import { MDXProvider } from '@mdx-js/react';
import { preToCodeBlock } from 'mdx-utils';
import React, { useEffect, useRef, useState } from 'react';

import { Box, CodeBlock, Flex, Footer, Nav, NavCrumbs, Toc } from '~/ui';

const components = {
  pre: (preProps) => {
    const codeProps = preToCodeBlock(preProps);
    return codeProps ? <CodeBlock {...codeProps} /> : <pre {...preProps} />;
  },
};

const tocHeadings = ['h3'];

export default function Layout({ children }) {
  const pageRef = useRef(null);
  const [tocItems, setTocItems] = useState([]);

  useEffect(() => {
    const element = pageRef.current;
    if (element) {
      const updatedTocItems = Array.from(element.querySelectorAll(tocHeadings))
        .filter((h) => h.id)
        .map((h) => ({
          href: `#${h.id}`,
          label: h.textContent,
        }));
      setTocItems(updatedTocItems);
    }
  }, []);

  return (
    <MDXProvider components={components}>
      <div ref={pageRef}>
        <Flex
          flexDirection="column"
          mx="auto"
          px={4}
          space={4}
          sx={{ maxWidth: 840, minHeight: '100vh' }}>
          <Nav />
          <NavCrumbs />
          <Box sx={{ flex: '1 1 auto' }}>
            <Toc items={tocItems} />
            {children}
          </Box>
          <Footer />
        </Flex>
      </div>
    </MDXProvider>
  );
}
