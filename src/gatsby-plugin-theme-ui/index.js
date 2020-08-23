import 'microtip/microtip.css';

const colors = {
  background: '#ffffff',
  link: '#999999',
  muted: '#e9e9e9',
  primary: '#111111',
  secondary: '#8f8f8f',
  light: '#bbbbbb',
};

const fonts = {
  body: 'Roboto',
  heading: 'Roboto',
  monospace: 'Roboto Mono',
};

const fontSizes = [10, 14, 16, 20, 24, 32, 48, 64, 72];

const fontWeights = {
  body: 400,
  heading: 700,
  bold: 700,
};

const lineHeights = {
  body: 1.5,
  heading: 1.125,
};

const radii = {
  s: '4px',
  m: '8px',
  l: '16px',
};

const shadows = {
  doc: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
};

const space = [0, 4, 8, 16, 32, 64, 128, 256, 512];

const styles = {
  root: {
    fontFamily: 'body',
    maxWidth: 840,
    mx: 'auto',
    p: 4,
    a: {
      color: 'secondary',
      textDecoration: 'none',
      ':focus, :hover': {
        color: 'light',
      },
    },
    code: {
      backgroundColor: 'muted',
      borderRadius: 's',
      fontFamily: 'monospace',
      px: 1,
    },
  },
};

export default {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  shadows,
  space,
  styles,
  text: {
    small: {
      fontSize: 0,
    },
  },
};
