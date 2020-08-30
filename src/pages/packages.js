import { graphql } from 'gatsby';
import { orderBy } from 'lodash';
import moment from 'moment';
import React from 'react';

import { Box, DocPreviewToggle, Flex, Icon, Layout, Text } from '~/ui';

export default function Packages({ data }) {
  const repos = extract(data);
  return (
    <Layout>
      The following packages form the <code>unified-doc</code> ecosystem.
      {repos.map((repo) => (
        <Repo key={repo.name} repo={repo} />
      ))}
    </Layout>
  );
}

function Repo({ repo }) {
  const {
    description,
    license,
    name,
    packages,
    readme,
    stars,
    updatedAt,
    url,
  } = repo;
  return (
    <Box>
      <h2>{name}</h2>
      <Flex flexDirection="column" space={2}>
        <Text variant="small">{description}</Text>
        <Flex alignItems="center" space={4}>
          <Icon href={url} icon="github" />
          <Icon href={url} icon="star" label={stars} />
          <Icon
            enableResponsiveLabelHide
            icon="license"
            href={`${url}/blob/main/license`}
            label={license}
          />
          <Text variant="small">updated {moment(updatedAt).fromNow()}</Text>
        </Flex>
        {readme && <DocPreviewToggle content={readme} filename="readme.md" />}
      </Flex>
      {packages.map((pkg) => {
        return (
          <Box key={pkg.name}>
            <h3>{pkg.name}</h3>
            <DocPreviewToggle content={pkg.readme} filename="readme.md" />
          </Box>
        );
      })}
      <br />
    </Box>
  );
}

function extract(data) {
  const { edges } = data.githubData.data.repos;
  const repos = edges
    .filter((edge) => {
      return edge.node.name.startsWith('unified-doc');
    })
    .map((edge) => {
      const { node } = edge;
      const packages = (node.packages?.entries || []).map((entry) => ({
        name: entry.name,
        readme: entry.package.files.find((file) => file.name === 'readme.md')
          .file.text,
      }));
      return {
        name: node.name,
        description: node.description,
        license: node.licenseInfo?.name || 'None',
        readme: node.readme?.text,
        packages: orderBy(packages, ['name'], ['asc']),
        stars: node.stargazers?.totalCount || 0,
        updatedAt: node.updatedAt,
        url: node.url,
      };
    });
  return orderBy(repos, ['name'], ['asc']);
}

export const query = graphql`
  query GetAllPackages {
    githubData {
      data {
        repos {
          edges {
            node {
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
