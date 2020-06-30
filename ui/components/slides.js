import React, { useCallback, useEffect, useState } from 'react';

import { Box, FlexLayout, styles } from '~/ui';

function Navigator({ currentSlideNumber, slides, onSelectSlide }) {
  return (
    <FlexLayout
      bg="background"
      flexWrap="wrap"
      py={3}
      space={2}
      sx={{ position: 'sticky', top: 0 }}>
      {slides.map((slide, slideNumber) => (
        <Box
          key={slide.name}
          py={2}
          sx={{
            cursor: 'pointer',
            flex: '1 1 auto',
            opacity: 0.2,
          }}
          onClick={event => {
            event.stopPropagation();
            onSelectSlide(slideNumber);
          }}>
          <Box
            bg={currentSlideNumber >= slideNumber ? 'primary' : 'muted'}
            sx={{
              height: '6px',
              ':hover': {
                opacity: 0.5,
              },
            }}
          />
        </Box>
      ))}
    </FlexLayout>
  );
}

function Slide({ slide }) {
  if (!slide) {
    return null;
  }

  const { title, render } = slide;

  return (
    <FlexLayout
      flexDirection="column"
      space={4}
      sx={{
        animation: `${styles.keyframes.fade} 1s ease`,
      }}>
      {title && <h1>{title}</h1>}
      {render()}
    </FlexLayout>
  );
}

export default function Slides({ initialSlideNumber = 0, slides = [] }) {
  const [slideNumber, setSlideNumber] = useState(initialSlideNumber);
  const slidesCount = slides.length;

  const nextSlide = useCallback(() => {
    if (slideNumber < slidesCount - 1) {
      setSlideNumber(slideNumber + 1);
    }
  }, [slideNumber, slidesCount]);

  const previousSlide = useCallback(() => {
    if (slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
    }
  }, [slideNumber]);

  useEffect(() => {
    function keydown(event) {
      const slideKeys = ['ArrowDown', 'ArrowRight', 'ArrowLeft', 'ArrowUp'];
      if (slideKeys.includes(event.key) && event.target.nodeName !== 'INPUT') {
        event.preventDefault();
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            nextSlide();
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            previousSlide();
            break;
          default:
            break;
        }
      }
    }

    document.addEventListener('keydown', keydown);

    return () => {
      document.removeEventListener('keydown', keydown);
    };
  }, [nextSlide, previousSlide]);

  return (
    <FlexLayout
      flexDirection="column"
      space={4}
      sx={styles.stretch}
      onClick={event => {
        if (!['INPUT', 'BUTTON'].includes(event.target.nodeName)) {
          nextSlide();
        }
      }}
      onContextMenu={event => {
        event.preventDefault();
        previousSlide();
      }}>
      <Navigator
        currentSlideNumber={slideNumber}
        slides={slides}
        onSelectSlide={setSlideNumber}
      />
      <Slide key={slideNumber} slide={slides[slideNumber]} />
    </FlexLayout>
  );
}
