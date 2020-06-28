export default {
  dest: 'dist',
  ignore: ['readme.md', 'todos.md'],
  menu: [
    'Home',
    { name: 'Demos', menu: ['Overview'] },
    { name: 'Doc API', menu: ['Overview', 'Methods', 'Options'] },
    'DOM API',
    'CLI API',
    'Wrappers',
    'Recipes',
    'Packages',
    'Spec',
    'Roadmap',
  ],
  public: 'public',
  title: 'unified-doc',
  themeConfig: getThemeConfig(),
  typescript: true,
};

// organizing this in a method instead of a module because doczrc.js does not support importing from modules
function getThemeConfig() {
  const button = {
    borderColor: 'primary',
    borderStyle: 'solid',
    borderWidth: 1,
    cursor: 'pointer',
    fontSize: 2,
    px: 2,
    py: 1,
    ':hover': {
      opacity: 0.8,
    },
    ':disabled': {
      opacity: 0.3,
      pointerEvents: 'none',
    },
  };

  const buttons = {
    primary: {
      ...button,
      bg: 'primary',
      color: 'background',
    },
    secondary: {
      ...button,
      bg: 'background',
      color: 'primary',
    },
  };

  const colors = {
    muted: 'rgba(128, 128, 128, 0.7)',
  };

  const fonts = {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
    monospace: 'courier',
  };

  const h = {
    mb: 4,
    position: 'relative',
    '::after': {
      content: '""',
      borderBottomColor: 'muted',
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      bottom: '-10px',
      position: 'absolute',
      left: 0,
      right: 0,
    },
  };

  const text = {
    muted: {
      color: 'muted',
    },
    info: {
      color: 'muted',
      fontSize: 1,
      fontStyle: 'italic',
    },
  };

  const root = {
    code: {
      fontFamily: 'monospace',
      fontWeight: 'bold',
    },
    h1: h,
    h2: h,
    pre: {
      fontSize: 2,
    },
  };

  return {
    buttons,
    colors,
    fonts,
    text,
    styles: {
      root,
    },
  };
}
