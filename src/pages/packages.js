import { graphql } from 'gatsby';
import React from 'react';

export default function Packages({ data }) {
  return (
    <div>
      <div>Packages</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export const query = graphql`
  query MyQuery {
    githubData {
      data {
        allRepos {
          repos {
            repo {
              description
              forkCount
              licenseInfo {
                name
              }
              packages {
                entries {
                  name
                  package {
                    files {
                      name
                      file {
                        text
                      }
                    }
                  }
                }
              }
              name
              readme {
                text
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
  }
`;
