import React from 'react';
import { highlight } from 'unified-doc-dom';

import { Card, Snippet, Text } from '~/ui';

export default function Bookmarks({ bookmarks, docRef }) {
  return (
    <Card bg="background" sx={{ position: 'sticky', top: 0 }} variant="card">
      <h4>Bookmarks</h4>
      {bookmarks.length === 0 && (
        <Text variant="small">
          Select some text in the document to add bookmarks!
        </Text>
      )}
      {bookmarks.map((bookmark) => {
        const { data, id } = bookmark;
        return (
          <Snippet
            key={id}
            id={id}
            onClick={() => {
              highlight(docRef.current, id);
            }}>
            …{data.value}…
          </Snippet>
        );
      })}
    </Card>
  );
}
