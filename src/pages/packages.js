import { graphql } from 'gatsby';
import moment from 'moment';
import React from 'react';

import Flex from '../components/flex';
import Icon from '../components/icon';
import Layout from '../components/layout';
import Text from '../components/text';
import ReadmePreview from '../components/readme-preview';

export default function Packages({ data }) {
  const repos = data.githubData.data.allRepos.repos
    .filter(({ repo }) => repo.name.startsWith('unified-doc'))
    .sort((a, b) => (a.repo.name > b.repo.name ? 1 : -1));

  return (
    <Layout
      description={
        <div>
          The following packages form the <code>unified-doc</code> ecosystem.
        </div>
      }
      title="Packages">
      {repos.map(({ repo }) => (
        <Repo key={repo.name} repo={repo} />
      ))}
    </Layout>
  );
}

function Repo({ repo }) {
  const {
    description,
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
    <div>
      <h2>{name}</h2>
      <Flex flexDirection="column" space={3}>
        <Text>{description}</Text>
        <Flex alignItems="center" space={4}>
          <Icon href={url} icon="github" />
          {stargazers && (
            <Icon href={url} icon="star" label={stargazers.totalCount} />
          )}
          {licenseInfo && (
            <Icon
              icon="license"
              href={`${url}/blob/main/license`}
              label={licenseInfo.name}
            />
          )}
          <Text color="secondary" variant="small">
            updated {moment(updatedAt).fromNow()}
          </Text>
        </Flex>
        {readme && <ReadmePreview readme={readme.text} />}
        {packages.map(({ name, readme }) => (
          <Package key={name} name={name} readme={readme} />
        ))}
      </Flex>
    </div>
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
