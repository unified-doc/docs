import { keyframes } from '@emotion/core';

const fade = keyframes`
0% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

const stretch = {
  height: '100%',
  width: '100%',
};

export default {
  stretch,
  keyframes: {
    fade,
  },
};
