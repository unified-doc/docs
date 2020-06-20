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

const center = {
  ...stretch,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
};

export default {
  center,
  stretch,
  keyframes: {
    fade,
  },
};
