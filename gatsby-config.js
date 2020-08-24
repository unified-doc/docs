require('dotenv').config();

module.exports = {
  plugins: [
    'gatsby-plugin-theme-ui',
    {
      resolve: 'gatsby-source-github-api',
      options: {
        token: process.env.GITHUB_API_TOKEN,
        variables: {},
        graphQLQuery: `
          query {
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
              spec: object(expression: "main:spec.md") {
                ... on Blob {
                  text
                }
              }
            }
            unifiedDocDomSpec: repository(owner: "unified-doc", name: "unified-doc-dom") {
              name
              spec: object(expression: "main:spec.md") {
                ... on Blob {
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
