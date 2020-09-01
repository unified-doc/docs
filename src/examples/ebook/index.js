import { useStaticQuery, graphql } from 'gatsby';
import moment from 'moment';
import React, {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import rehype2react from 'rehype-react';
import tippy from 'tippy.js';
import Doc from 'unified-doc';
import { registerMarks, selectText } from 'unified-doc-dom';
import { v4 as uuidv4 } from 'uuid';

import { Box, Card, Flex } from '~/ui';

import Bookmarks from './bookmarks';

const categoryTypes = {
  QUOTE: 'quote',
  HIGHLIGHT: 'highlight',
  IMPORTANT: 'important',
};

const docStyle = {
  [`.${categoryTypes.QUOTE}`]: {
    backgroundColor: 'muted',
    color: 'secondary',
    fontStyle: 'italic',
  },
  [`.${categoryTypes.HIGHLIGHT}`]: {
    background: 'yellow',
    color: 'text',
  },
  [`.${categoryTypes.IMPORTANT}`]: {
    background: 'orange',
    color: 'text',
    fontWeight: 'bold',
  },
};

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
  const tooltipRef = useRef(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [category, setCategory] = useState(categoryTypes.HIGHLIGHT);

  function removeBookmark(bookmarkToRemove) {
    const shouldRemoveBookmark = window.confirm('Remove bookmark?');
    if (shouldRemoveBookmark) {
      setBookmarks((previousBookmarks) =>
        previousBookmarks.filter(
          (bookmark) => bookmark.id !== bookmarkToRemove.id,
        ),
      );
    }
  }

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
        `Do you want to add the following to your bookmarks as a ${category}?

        ${value}
        `,
      );
      if (shouldAddBookmark) {
        setBookmarks((previousBookmarks) => [
          ...previousBookmarks,
          createBookmark({
            start,
            end,
            type: category,
            value,
          }),
        ]);
      }
    }
    return selectText(docRef.current, { callback });
  }, [category]);

  // register mark callbacks and add tooltips
  useEffect(() => {
    const callbacks = {
      onClick: (_event, bookmark) => removeBookmark(bookmark),
      onMouseEnter: (event, bookmark) => {
        const { createdAt, type, value } = bookmark.data;
        const content = `This ${type} bookmark was created ${moment(
          createdAt,
        ).fromNow()}:<br /><br />"${value.slice(
          0,
          50,
        )}…"<br /><br />Click to remove this bookmark.`;
        tooltipRef.current = tippy(event.target, {
          allowHTML: true,
          content,
        });
      },
      onMouseLeave: () => {
        tooltipRef.current.hide();
      },
    };
    return registerMarks(docRef.current, bookmarks, callbacks);
  }, [bookmarks]);

  return (
    <Flex flexDirection="column" space={3} sx={docStyle}>
      <Bookmarks
        bookmarks={bookmarks}
        categories={Object.values(categoryTypes)}
        docRef={docRef}
        selectedCategory={category}
        onRemoveBookmark={removeBookmark}
        onSelectCategory={setCategory}
      />
      <Box ref={docRef}>
        <Card variant="doc">{doc.compile().result}</Card>
      </Box>
    </Flex>
  );
}
