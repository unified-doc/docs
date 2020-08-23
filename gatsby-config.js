require('dotenv').config();

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-github-api',
      options: {
        token: process.env.GITHUB_API_TOKEN,
        variables: {},
        graphQLQuery: `
          query {
            allRepos: search(query: "user:unified-doc", type: REPOSITORY, first: 100) {
              repos: edges {
                repo: node {
                  ... on Repository {
                    description
                    forkCount
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
          }
        `,
      },
    },
  ],
};
