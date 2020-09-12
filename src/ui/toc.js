import React from 'react';

export default function Toc({ items }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h3>Table of Contents</h3>
      <ul>
        {items.map((item) => {
          const { href, label } = item;
          return (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
