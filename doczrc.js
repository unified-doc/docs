const buttonStyle = {
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

const themeConfig = {
  primary: {
    ...buttonStyle,
    bg: 'primary',
    color: 'background',
  },
  secondary: {
    ...buttonStyle,
    bg: 'background',
    color: 'primary',
  },
};

export default {
  ignore: ['readme.md'],
  menu: ['Home', 'Doc', 'Demos', 'Packages'],
  public: 'public',
  title: 'unified-doc',
  themeConfig,
  typescript: true,
};
