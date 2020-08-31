import { useStaticQuery, graphql } from 'gatsby';
import React, {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import rehype2react from 'rehype-react';
import Doc from 'unified-doc';
import { registerMarks, selectText } from 'unified-doc-dom';
import { v4 as uuidv4 } from 'uuid';

import { Box, Card, Flex } from '~/ui';

import Bookmarks from './bookmarks';

function createBookmark({ start, end, type, value = undefined }) {
  return {
    id: uuidv4(),
    start,
    end,
    classNames: [type],
    data: {
      createdAt: new Date(),
      type,
      value,
    },
  };
}

function extract(data) {
  const { text } = data.githubData.data.aliceHtml.file;
  const startIndex = text.indexOf('<h1');
  const content = text.slice(startIndex);
  return {
    filename: 'alice.html',
    content,
  };
}

export default function EbookExample() {
  const data = useStaticQuery(graphql`
    query GetAliceHtml {
      githubData {
        id
        data {
          aliceHtml {
            file {
              text
            }
          }
        }
      }
    }
  `);

  const { content, filename } = extract(data);

  const docRef = useRef(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkStyle, setBookmarkStyle] = useState('quote');

  // memoize doc instance
  const doc = useMemo(() => {
    return Doc({
      compiler: [[rehype2react, { createElement }]],
      content,
      filename,
      marks: bookmarks,
      sanitizeSchema: {
        attributes: {
          '*': ['className', 'style'],
          mark: ['dataMarkId', 'id'],
        },
        clobberPrefix: '',
      },
    });
  }, [bookmarks, content, filename]);

  // add selectText effect
  useEffect(() => {
    function callback(selectedText) {
      const { start, end, value } = selectedText;
      const shouldAddBookmark = window.confirm(
        `Do you want to add the following to your bookmarks as a ${bookmarkStyle}?

        ${value}
        `,
      );
      if (shouldAddBookmark) {
        setBookmarks((previousBookmarks) => [
          ...previousBookmarks,
          createBookmark({
            start,
            end,
            type: bookmarkStyle,
            value,
          }),
        ]);
      }
    }
    return selectText(docRef.current, { callback });
  }, [bookmarkStyle]);

  // register mark callbacks and add tooltips
  useEffect(() => {
    const callbacks = {
      onClick: (_event, bookmark) => {
        const shouldRemoveBookmark = window.confirm('Remove bookmark?');
        if (shouldRemoveBookmark) {
          setBookmarks((previousBookmarks) =>
            previousBookmarks.filter(
              (_bookmark) => _bookmark.id !== bookmark.id,
            ),
          );
        }
      },
    };
    return registerMarks(docRef.current, bookmarks, callbacks);
  }, [bookmarks]);

  return (
    <Flex flexDirection="column" space={3}>
      <Bookmarks bookmarks={bookmarks} docRef={docRef} />
      <Box ref={docRef}>
        <Card variant="doc">{doc.compile().result}</Card>
      </Box>
    </Flex>
  );
}
