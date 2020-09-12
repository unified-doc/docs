const remarkSlug = require('remark-slug');

require('dotenv').config();

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        defaultLayouts: {
          default: require.resolve('./src/ui/layout.js'),
        },
        extensions: ['.md', '.mdx'],
        remarkPlugins: [remarkSlug],
      },
    },
    'gatsby-plugin-theme-ui',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'files',
        path: './src/files/',
      },
    },
    {
      resolve: 'gatsby-source-github-api',
      options: {
        token: process.env.GITHUB_API_TOKEN,
        variables: {},
        graphQLQuery: `
          query {
            exampleCodeFiles: repository(name: "highlight.js", owner: "highlightjs") {
              folder: object(expression: "master:test/detect") {
                ... on Tree {
                  languages: entries {
                    name
                    test: object {
                      ... on Tree {
                        files: entries {
                          file: object {
                            ... on Blob {
                              byteSize
                              text
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            exampleCsvFile: repository(name: "noodles", owner: "chrisrzhou") {
              file: object(expression: "main:logs.csv") {
                ... on Blob {
                  byteSize
                  text
                }
              }
            }
            exampleHtmlFile: repository(name: "Alice-s-Adventures-in-Wonderland-HTML-Edition_928", owner: "GITenberg") {
              file: object(expression: "master:928-h/928-h.htm") {
                ... on Blob {
                  byteSize
                  text
                }
              }
            }
            exampleMarkdownFile: repository(name: "unist", owner: "syntax-tree") {
              file: object(expression: "main:readme.md") {
                ... on Blob {
                  byteSize
                  text
                }
              }
            }
            repos: search(query: "user:unified-doc", type: REPOSITORY, first: 100) {
              edges {
                node {
                  ... on Repository {
                    description
                    licenseInfo {
                      name
                    }
                    name
                    packages: object(expression: "main:packages") {
                      ... on Tree {
                        entries {
                          name
                          package: object {
                            ... on Tree {
                              files: entries {
                                name
                                file: object {
                                  ... on Blob {
                                    byteSize
                                    text
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    readme: object(expression: "main:readme.md") {
                      ... on Blob {
                        byteSize
                        text
                      }
                    }
                    stargazers {
                      totalCount
                    }
                    updatedAt
                    url
                  }
                }
              }
            }
            unifiedDocSpec: repository(owner: "unified-doc", name: "unified-doc") {
              name
              file: object(expression: "main:spec.md") {
                ... on Blob {
                  byteSize
                  text
                }
              }
            }
            unifiedDocDomSpec: repository(owner: "unified-doc", name: "unified-doc-dom") {
              name
              file: object(expression: "main:spec.md") {
                ... on Blob {
                  byteSize
                  text
                }
              }
            }
          }
        `,
      },
    },
  ],
};
