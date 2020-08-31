import React from 'react';
import { highlight } from 'unified-doc-dom';

import { Card, Snippet } from '~/ui';

export default function Bookmarks({ bookmarks, docRef }) {
  return (
    <Card bg="background" sx={{ position: 'sticky', top: 0 }} variant="card">
      <h4>Bookmarks</h4>
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
