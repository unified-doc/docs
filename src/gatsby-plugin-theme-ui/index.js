import 'microtip/microtip.css';

const colors = {
  background: '#ffffff',
  light: '#e9e9e9',
  muted: '#f6f6f6',
  primary: '#2e8fff',
  secondary: '#999999',
  text: '#111111',
};

const borders = {
  border: `1px solid ${colors.secondary}`,
};

const fonts = {
  body: 'Roboto',
  heading: 'Roboto',
  monospace: 'Roboto Mono',
};

const fontSizes = [12, 14, 16, 20, 24, 32, 48, 64, 72];

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
      cursor: 'pointer',
      textDecoration: 'none',
      ':focus, :hover': {
        opacity: 0.7,
      },
    },
    code: {
      backgroundColor: 'light',
      borderRadius: 's',
      fontFamily: 'monospace',
      px: 1,
    },
    '[disabled]': {
      opacity: 0.3,
      pointerEvents: 'none',
    },
  },
};

export default {
  borders,
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
    link: {
      fontSize: 0,
      ...styles.root.a,
    },
    small: {
      fontSize: 0,
    },
  },
};
