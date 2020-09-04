import React from 'react';
import { highlight } from 'unified-doc-dom';

import { Box, Card, Flex, Icon, Snippet, Text } from '~/ui';

export default function Bookmarks({
  bookmarks,
  categories,
  docRef,
  selectedCategory,
  onRemoveBookmark,
  onSelectCategory,
}) {
  return (
    <Card bg="background" sx={{ position: 'sticky', top: 0 }}>
      <Flex alignItems="center" space={4}>
        <h4>Bookmark style</h4>
        {categories.map((category) => (
          <Box
            key={category}
            className={category}
            py={1}
            px={3}
            sx={{
              border: selectedCategory === category ? 'active' : 'border',
              borderWidth: 2,
              borderRadius: 'm',
              cursor: 'pointer',
            }}
            onClick={() => onSelectCategory(category)}>
            {category}
          </Box>
        ))}
      </Flex>
      {bookmarks.length === 0 && (
        <Text variant="small">
          Select some text in the document to add bookmarks!
        </Text>
      )}
      <Flex
        flexDirection="column"
        space={1}
        sx={{ maxHeight: 200, overflow: 'auto' }}>
        {bookmarks.map((bookmark) => {
          const { classNames, data, id } = bookmark;
          return (
            <Flex
              key={id}
              alignItems="center"
              justifyContent="space-between"
              space={4}>
              <Snippet
                id={id}
                onClick={() => {
                  highlight(docRef.current, id);
                }}>
                <Box
                  className={classNames[0]}
                  sx={{ display: 'inline', flex: '1 1 auto' }}>
                  {data.value}
                </Box>
              </Snippet>
              <Icon icon="trash" onClick={() => onRemoveBookmark(bookmark)} />
            </Flex>
          );
        })}
      </Flex>
    </Card>
  );
}
