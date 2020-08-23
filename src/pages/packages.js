import { graphql } from 'gatsby';
import React from 'react';

import ReadmePreview from '../components/readme-preview';

export default function Packages({ data }) {
  const repos = data.githubData.data.allRepos.repos
    .filter(({ repo }) => repo.name.startsWith('unified-doc'))
    .sort((a, b) => (a.repo.name > b.repo.name ? 1 : -1));

  return (
    <div>
      <h1>Packages</h1>
      <div>
        The following packages exist in the <code>unified-doc</code> ecosystem.
      </div>
      {repos.map(({ repo }) => (
        <Repo key={repo.name} repo={repo} />
      ))}
    </div>
  );
}

function Repo({ repo }) {
  const {
    description,
    forkCount,
    licenseInfo,
    name,
    readme,
    stargazers,
    updatedAt,
    url,
  } = repo;
  const packages =
    repo.packages?.entries.map((entry) => ({
      name: entry.name,
      readme: entry.package.files.find((file) => file.name === 'readme.md').file
        .text,
    })) || [];

  return (
    <section>
      <h2>{name}</h2>
      {description}
      {licenseInfo?.name}
      Fork: {forkCount}
      Stars: {stargazers?.totalCount}
      {updatedAt}
      {url}
      {packages.map(({ name, readme }) => (
        <Package key={name} name={name} readme={readme} />
      ))}
    </section>
  );
}

function Package({ name, readme }) {
  return (
    <div>
      <h3>{name}</h3>
      <ReadmePreview readme={readme} />
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
