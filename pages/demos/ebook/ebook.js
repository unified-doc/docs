import React, { createElement, useEffect, useRef, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';
import { highlight, selectText } from 'unified-doc-dom';
import { v4 as uuidv4 } from 'uuid';
import 'unified-doc-dom/lib/highlight.css';

import { alice } from '~/files';
import { Box, Button, Card, FlexLayout, Select } from '~/ui';

import './ebook.css';

const bookmarkStyles = [
  { label: 'default', value: 'bookmark-default' },
  { label: 'important', value: 'bookmark-important' },
  { label: 'quote', value: 'bookmark-quote' },
  { label: 'redline', value: 'bookmark-redline' },
];

function Bookmarks({
  bookmarks,
  onClearBookmarks,
  onClickBookmark,
  onRemoveBookmark,
}) {
  return (
    <FlexLayout flexDirection="column" space={2}>
      {bookmarks.length > 0 && (
        <Button variant="secondary" onClick={onClearBookmarks}>
          Clear all
        </Button>
      )}
      {bookmarks.map(bookmark => {
        const { id, value, classNames = [] } = bookmark;
        return (
          <FlexLayout
            key={id}
            alignItems="center"
            justifyContent="space-between"
            space={2}>
            <Box
              as="mark"
              className={classNames.join(' ')}
              sx={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onClick={() => onClickBookmark(bookmark)}>
              <Box
                as="a"
                href={`#${id}`}
                sx={{
                  color: 'unset',
                  textDecoration: 'none',
                }}>
                {value}
              </Box>
            </Box>
            <Box
              sx={{
                color: 'muted',
                cursor: 'pointer',
                flex: '0 0 auto',
              }}
              onClick={event => onRemoveBookmark(bookmark, event)}>
              ×
            </Box>
          </FlexLayout>
        );
      })}
    </FlexLayout>
  );
}

export default function Ebook() {
  const docRef = useRef();
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkStyle, setBookmarkCategory] = useState('bookmark-default');

  useEffect(() => {
    function callback(selectedText) {
      const shouldAdd = window.confirm(
        `Are you sure you want to add the following bookmark?\n"${selectedText.value}"`,
      );
      if (shouldAdd) {
        const newBookmark = {
          ...selectedText,
          classNames: [bookmarkStyle],
          id: uuidv4(),
          data: {
            value: selectedText.value,
          },
        };
        setBookmarks([...bookmarks, newBookmark]);
      }
    }
    return selectText(docRef.current, { callback });
  }, [bookmarks, bookmarkStyle]);

  function handleClearBoomarks() {
    setBookmarks([]);
  }

  function handleClickBookmark(bookmark) {
    highlight(docRef.current, bookmark.id);
  }

  function handleRemoveBookmark(bookmarkToRemove, event) {
    event.stopPropagation();
    const shouldRemove = window.confirm(
      `Are you sure you want to remove the following bookmark?\n"${bookmarkToRemove.data.value}"`,
    );
    if (shouldRemove) {
      setBookmarks(bookmarks.filter(({ id }) => id !== bookmarkToRemove.id));
    }
  }

  const doc = unifiedDoc({
    annotations: bookmarks,
    annotationCallbacks: {
      onClick: handleRemoveBookmark,
    },
    compiler: [rehype2react, { createElement }],
    content: alice.content.slice(0, 50000),
    filename: alice.filename,
  });

  // @ts-ignore: fix vfile typing;
  const { result } = doc.compile();

  return (
    <FlexLayout space={3}>
      <Card sx={{ flex: '1 1 auto' }}>
        <div ref={docRef}>{result}</div>
      </Card>
      <Card sx={{ flex: '0 0 40%' }}>
        <FlexLayout flexDirection="column" space={3}>
          <h3>Bookmarks</h3>
          <Select
            id="bookmark-style"
            label="Bookmark Style"
            options={bookmarkStyles}
            value={bookmarkStyle}
            onChange={setBookmarkCategory}
          />
          <Bookmarks
            bookmarks={bookmarks}
            onClearBookmarks={handleClearBoomarks}
            onClickBookmark={handleClickBookmark}
            onRemoveBookmark={handleRemoveBookmark}
          />
        </FlexLayout>
      </Card>
    </FlexLayout>
  );
}
