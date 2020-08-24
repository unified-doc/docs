import { graphql } from 'gatsby';
import { orderBy } from 'lodash';
import moment from 'moment';
import React from 'react';

import {
  DocPreview,
  Flex,
  Icon,
  Layout,
  SummaryItem,
  Text,
} from '../components';

export default function Packages({ data }) {
  const repos = extract(data);
  return (
    <Layout
      description={
        <div>
          The following packages form the <code>unified-doc</code> ecosystem.
        </div>
      }
      title="Packages">
      <Flex flexDirection="column" space={5}>
        {repos.map((repo) => (
          <Repo key={repo.name} repo={repo} />
        ))}
      </Flex>
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
    <Flex flexDirection="column" space={2}>
      <Flex
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
        justifyContent="space-between"
        space={2}>
        <h2>{name}</h2>
        <Flex alignItems="center" space={4}>
          <Icon href={url} icon="github" />
          <Icon href={url} icon="star" label={stars} />
          <Icon
            icon="license"
            href={`${url}/blob/main/license`}
            label={license}
          />
          <Text color="secondary" variant="small">
            updated {moment(updatedAt).fromNow()}
          </Text>
        </Flex>
      </Flex>
      <Text>{description}</Text>
      {readme && <DocPreview content={readme} filename="readme.md" />}
      {packages.map((pkg) => {
        return (
          <SummaryItem
            key={pkg.name}
            extra={<DocPreview content={pkg.readme} filename="readme.md" />}
            title={pkg.name}
          />
        );
      })}
    </Flex>
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
  query allPackages {
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
