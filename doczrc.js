export default {
  dest: 'dist',
  ignore: ['readme.md'],
  menu: ['Home', 'Doc', 'Demos', 'Packages'],
  public: 'public',
  title: 'unified-doc',
  themeConfig: getThemeConfig(),
  typescript: true,
};

// abstracting this in a method since docz doesn't support importing modules in doczrc.js
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
      textDecoration: 'underline',
    },
  };

  return {
    buttons,
    text,
    styles: {
      root,
    },
  };
}
