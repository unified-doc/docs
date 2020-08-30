import { globalHistory } from '@reach/router';
import { Link } from 'gatsby';
import React from 'react';

// hacky and specific humanize method
function humanize(string) {
  const humanized = string.replace(/-/g, ' ').replace('api', 'API');
  return humanized.charAt(0).toUpperCase() + humanized.slice(1);
}

export default function NavCrumbs() {
  let route = '';
  const crumbs = globalHistory.location.pathname
    .split('/')
    .filter((path) => path)
    .reduce((acc, path) => {
      const label = humanize(path);
      route += `/${path}`;
      return [...acc, { label, route }];
    }, []);

  return (
    crumbs.length > 0 && (
      <h2>
        {crumbs.map((crumb, i) => {
          const { label, route } = crumb;
          const Content =
            i < crumbs.length - 1 ? (
              <>
                <Link to={route}>{label}</Link>/
              </>
            ) : (
              label
            );
          return <React.Fragment key={route}>{Content}</React.Fragment>;
        })}
      </h2>
    )
  );
}
