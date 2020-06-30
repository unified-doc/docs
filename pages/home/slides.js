import { Link } from 'gatsby';
import React, { createElement, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';

import { downloadFile } from '~/pages/utils';
import { Box, Button, Card, FlexLayout, Text, TextInput } from '~/ui';

const annotations = [
  { id: 'a', start: 0, end: 5 },
  {
    id: 'b',
    start: 12,
    end: 16,
    style: { background: 'blue', color: 'white' },
  },
];

const htmlContent =
  '<blockquote>some <strong>strong</strong> text in a blockquote</blockquote>';
const htmlDoc = unifiedDoc({
  compiler: [rehype2react, { createElement }],
  content: htmlContent,
  filename: 'doc.html',
});
// @ts-ignore: fix vfile typing
const htmlCompiled = htmlDoc.compile().result;
const htmlCompiledWithAnnotations = unifiedDoc({
  annotations,
  compiler: [rehype2react, { createElement }],
  content: htmlContent,
  filename: 'doc.html',
  // @ts-ignore: fix vfile typing
}).compile().result;

const markdownContent = '> some **strong** text in a blockquote</blockquote>';
const markdownDoc = unifiedDoc({
  compiler: [rehype2react, { createElement }],
  content: markdownContent,
  filename: 'doc.md',
});
// @ts-ignore: fix vfile typing
const markdownCompiled = markdownDoc.compile().result;
const markdownCompiledWithAnnotations = unifiedDoc({
  annotations,
  compiler: [rehype2react, { createElement }],
  content: htmlContent,
  filename: 'doc.html',
  // @ts-ignore: fix vfile typing
}).compile().result;

function DocumentSearchSlide() {
  const [query, setQuery] = useState('');
  const htmlResults = htmlDoc.search(query);
  const markdownResults = htmlDoc.search(query);

  function renderResults(results) {
    if (results.length === 0) {
      return null;
    }
    return (
      <FlexLayout flexDirection="column" space={1}>
        <h4>Search results</h4>
        {results.map((result, i) => {
          const { snippet } = result;
          const [left, match, right] = snippet;
          return (
            <Text key={i.toString()} variant="info">
              {left}
              <Box as="strong" color="primary">
                {match}
              </Box>
              {right}
            </Text>
          );
        })}
      </FlexLayout>
    );
  }

  return (
    <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
      <Text variant="muted">
        It is easy to search and return results using the{' '}
        <code>doc.search()</code> method. Searching on the{' '}
        <code>textContent</code> is simple and intuitive to implement, and
        allows us to ignore custom markup based on the source content type.
        Custom search algorithms that implement the unified search interface can
        be attached to the <code>doc</code>.
      </Text>
      <FlexLayout space={3}>
        <Card sx={{ flex: '1 1 50%' }}>
          <h4>.html</h4>
          {htmlCompiled}
          {renderResults(htmlResults)}
        </Card>
        <Card sx={{ flex: '1 1 50%' }}>
          <h4>.md</h4>
          {markdownCompiled}
          {renderResults(markdownResults)}
        </Card>
      </FlexLayout>
      <TextInput
        id="search"
        label="search"
        placeholder="e.g. 'text' or 'some*text'"
        value={query}
        onChange={setQuery}
      />
    </FlexLayout>
  );
}

export default [
  {
    name: 'Welcome',
    title: <code>unified-doc</code>,
    render: () => (
      <Box>
        <Text variant="muted">unified document APIs.</Text>
        <Text mt={5} variant="info">
          <strong>Note:</strong> use the mouse or arrow keys to navigate this
          presentation
        </Text>
      </Box>
    ),
  },
  {
    name: 'Definitions',
    title: 'Definitions',
    render: () => (
      <Text variant="muted">
        <p>
          <code>knowledge</code>: refers to abstract human information that is
          acquired and shared among humans.
        </p>
        <p>
          <code>content</code>: represents the physical materialization of{' '}
          <code>knowledge</code>
        </p>
        <p>
          <code>document</code>: an abstraction that manages{' '}
          <code>content</code>
        </p>
        <p>
          <code>doc</code>: an instance of <code>unified-doc</code> representing
          a <code>document</code>
        </p>
      </Text>
    ),
  },
  {
    name: 'unified',
    title: <code>unified</code>,
    render: () => (
      <Text variant="muted">
        <p>
          The{' '}
          <code>
            <a href="https://unifiedjs.com/" rel="noreferrer" target="_blank">
              unified
            </a>
          </code>{' '}
          ecosystem supports representing content as structured data. This
          provides a scalable way to parse, transform, and render any content
          type.
        </p>
        <p>
          <code>unified-doc</code> is built on top of <code>unified</code>, and
          offers a unified set of APIs to work with documents of any content
          type.
        </p>
      </Text>
    ),
  },
  {
    name: 'document-overview',
    title: 'Document: Overview',
    render: () => (
      <Text variant="muted">
        <p>
          Content is managed in a <code>document</code>. There are many types of
          documents e.g. <code>.txt</code>, <code>.html</code>, <code>.md</code>
          , <code>.pdf</code>, <code>.docx</code>. Rendering, searching,
          annotating, and exporting files are common document workflows. While
          many software exist to implement these workflows, they are usually not
          interoperable across document types and programs. Various software
          sometimes transform content in ways that are destructive and removes
          semantic structure of the content.
        </p>
        <p>
          <code>unified-doc</code> provides ways to manage documents with
          unified APIs that preserve the semantic structure of the source
          content. These APIs work in a unified way for supported content types,
          and can be readily applied to future unsupported content types once
          integrated.
        </p>
        <p>
          <Text variant="info">
            The next few slides will give an overview on how this works.
          </Text>
        </p>
      </Text>
    ),
  },
  {
    name: 'document-content',
    title: 'Document: Content',
    render: () => (
      <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
        <Text variant="muted">
          Document content can exist in various formats. The following
          represents how the string content of two example <code>.html</code>{' '}
          and <code>.md</code> would look like:
        </Text>
        <FlexLayout space={3}>
          <Card sx={{ flex: '1 1 50%' }}>
            <h4>.html</h4>
            <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {htmlContent}
            </Box>
          </Card>
          <Card sx={{ flex: '1 1 50%' }}>
            <h4>.md</h4>
            <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {markdownContent}
            </Box>
          </Card>
        </FlexLayout>
      </FlexLayout>
    ),
  },
  {
    name: 'document-instance',
    title: 'Document: Instance',
    render: () => (
      <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
        <Text variant="muted">
          It would be nice if we can organize content and associated APIs in a{' '}
          <code>doc</code> instance. This is initialized in{' '}
          <code>unified-doc</code> in a very simple and intuitive way:
        </Text>
        <FlexLayout space={3}>
          <Card sx={{ flex: '1 1 50%' }}>
            <h4>.html</h4>
            <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {`const doc = unifiedDoc({\n\tcontent: "${htmlContent}",\n\tfilename: 'doc.html'\n});`}
            </Box>
          </Card>
          <Card sx={{ flex: '1 1 50%' }}>
            <h4>.md</h4>
            <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {`const doc = unifiedDoc({\n\tcontent: "${markdownContent}", \n\tfilename: 'doc.md'\n});`}
            </Box>
          </Card>
        </FlexLayout>
        <Text variant="muted">
          The <code>doc</code> instance exposes a unified set of APIs that works
          on any supported content type that is successfully initialized e.g.{' '}
          <code>doc.compile()</code>, <code>doc.file()</code>,{' '}
          <code>doc.parse()</code>, <code>doc.search()</code>,{' '}
          <code>doc.textContent()</code>.
        </Text>
      </FlexLayout>
    ),
  },
  {
    name: 'document-render',
    title: 'Document: Render',
    render: () => {
      return (
        <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
          <Text variant="muted">
            It is easy to compile and render the <code>doc</code> as HTML with
            the <code>doc.compile()</code> method.
          </Text>
          <FlexLayout space={3}>
            <Card sx={{ flex: '1 1 50%' }}>
              <h4>.html</h4>
              {htmlCompiled}
            </Card>
            <Card sx={{ flex: '1 1 50%' }}>
              <h4>.md</h4>
              {markdownCompiled}
            </Card>
          </FlexLayout>
        </FlexLayout>
      );
    },
  },
  {
    name: 'document-customize',
    title: 'Document: Customize',
    render: () => {
      return (
        <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
          <Text variant="muted">
            It is easy to customize the document with CSS and other web
            technologies without affecting the content and layout of the
            document.
          </Text>
          <FlexLayout space={3}>
            <Card sx={{ flex: '1 1 50%' }}>
              <h4>.html</h4>
              <Box
                sx={{
                  background: 'black',
                  color: 'white',
                  fontFamily: 'impact',
                }}>
                {htmlCompiled}
              </Box>
            </Card>
            <Card sx={{ flex: '1 1 50%' }}>
              <h4>.md</h4>
              <Box
                sx={{
                  background: 'black',
                  color: 'white',
                  flex: '1 1 50%',
                  fontFamily: 'impact',
                }}>
                {markdownCompiled}
              </Box>
            </Card>
          </FlexLayout>
        </FlexLayout>
      );
    },
  },
  {
    name: 'document-text-content',
    title: 'Document: Text Content',
    render: () => (
      <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
        <Text variant="muted">
          It is easy to extract the pure text content of the document (ignoring
          markup related to the content type) using the{' '}
          <code>doc.textContent()</code> method.
        </Text>
        <FlexLayout space={3}>
          <Card sx={{ flex: '1 1 50%' }}>
            <h4>.html</h4>
            <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {htmlDoc.textContent()}
            </Box>
          </Card>
          <Card sx={{ flex: '1 1 50%' }}>
            <h4>.md</h4>
            <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {markdownDoc.textContent()}
            </Box>
          </Card>
        </FlexLayout>
        <Text variant="muted">
          The <code>textContent</code> provides a simple and intuitive way to
          implement other document workflows such as searching and annotations,
          which are explored in the next few slides.
        </Text>
      </FlexLayout>
    ),
  },
  {
    name: 'document-search',
    title: 'Document: Search',
    render: () => <DocumentSearchSlide />,
  },
  {
    name: 'annotations',
    title: 'Document: Annotations',
    render: () => (
      <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
        <Text variant="muted">
          It is easy to annotate documents and visually mark them without
          affecting the overall semantic layout of the document. Annotating
          documents involve a simple specification of offsets relative to the{' '}
          <code>textContent</code> of the document.
        </Text>
        <FlexLayout space={3}>
          <Card sx={{ flex: '1 1 50%' }}>
            <h4>.html</h4>
            {htmlCompiledWithAnnotations}
          </Card>
          <Card sx={{ flex: '1 1 50%' }}>
            <h4>.md</h4>
            {markdownCompiledWithAnnotations}
          </Card>
        </FlexLayout>
        <Card sx={{ flex: '1 1 50%' }}>
          <h4>Annotations</h4>
          <pre>{JSON.stringify(annotations, null, 2)}</pre>
        </Card>
      </FlexLayout>
    ),
  },
  {
    name: 'document-export',
    title: 'Document: Export',
    render: () => {
      function handleDownloadFile(docType, extension) {
        const doc = docType === 'markdown' ? markdownDoc : htmlDoc;
        downloadFile(doc.file(extension));
      }
      return (
        <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
          <Text variant="muted">
            It is easy to export the document in various supported format using
            the file data returned by the <code>doc.file()</code> method.
          </Text>
          <FlexLayout space={3}>
            <Card sx={{ flex: '1 1 50%' }}>
              <FlexLayout flexDirection="column" space={4}>
                <h4>.html</h4>
                <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {htmlContent}
                </Box>
                <FlexLayout space={3}>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadFile('html')}>
                    source
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadFile('html', '.txt')}>
                    .txt
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadFile('html', '.html')}>
                    .html
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadFile('html', '.uni')}>
                    .uni
                  </Button>
                </FlexLayout>
              </FlexLayout>
            </Card>
            <Card sx={{ flex: '1 1 50%' }}>
              <FlexLayout flexDirection="column" space={4}>
                <h4>.md</h4>
                <Box as="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {markdownContent}
                </Box>
                <FlexLayout space={3}>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadFile('markdown')}>
                    source
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadFile('markdown', '.txt')}>
                    .txt
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadFile('markdown', '.html')}>
                    .html
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownloadFile('markdown', '.uni')}>
                    .uni
                  </Button>
                </FlexLayout>
              </FlexLayout>
            </Card>
          </FlexLayout>
        </FlexLayout>
      );
    },
  },
  {
    name: 'simple',
    title: 'Simple',
    render: () => (
      <Text variant="muted">
        Keeping the <code>unified-doc</code> API simple, intuitive, and
        constrained will always take priority before introducing new API
        methods. The <Link to="/spec">Spec</Link> documentation covers the goals
        and design of <code>unified-doc</code> in more detail.
      </Text>
    ),
  },
  {
    name: 'scalable',
    title: 'Scalable',
    render: () => (
      <FlexLayout flexDirection="column" space={4} sx={{ width: '100%' }}>
        <Text variant="muted">
          <p>
            <code>unified-doc</code> provides a scalable way to implement and
            extend document APIs with new content types.
          </p>
          <p>
            When new API methods are introduced, all content types benefit from
            them. Supporting a new content type is as simple as implementing the
            corresponding parser. Implementing a parser is not usually an easy
            task, but your contribution is greatly appreciated in the{' '}
            <code>unified</code> community!
          </p>
        </Text>
      </FlexLayout>
    ),
  },
  {
    name: 'demos',
    title: 'Demos',
    render: () => (
      <Text variant="muted">
        Explore interactive <Link to="/demos">demos</Link> built with{' '}
        <code>unified-doc</code>
      </Text>
    ),
  },
];
