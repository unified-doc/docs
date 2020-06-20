export default {
  dest: 'dist',
  ignore: ['readme.md', 'todos.md'],
  menu: [
    'Home',
    { name: 'doc', menu: ['Overview', 'Attributes', 'API', 'Options'] },
    { name: 'Demos', menu: ['Overview'] },
    'Packages',
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
  };

  return {
    fonts: {
      body: 'Inter',
      heading: 'Inter',
      monospace: 'courier',
    },
    buttons,
    text,
    styles: {
      root,
    },
  };
}
