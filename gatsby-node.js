const path = require('path');

exports.onCreateWebpackConfig = ({ actions, loaders, stage }) => {
  // absolute imports alised to '~'
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
  });

  // https://www.gatsbyjs.com/docs/debugging-html-builds/#fixing-third-party-modules
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /pdfjs-dist/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
