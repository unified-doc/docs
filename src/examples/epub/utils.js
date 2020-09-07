import toHtml from 'hast-util-to-html';
import find from 'unist-util-find';
import findAllAfter from 'unist-util-find-all-after';
import visit from 'unist-util-visit';

export function getPackagePath(xast) {
  const rootFileNode = find(xast, { name: 'rootfile' });
  return rootFileNode.attributes['full-path'];
}

export function getManifest(xast) {
  const manifest = {};
  const manifestNode = find(xast, { name: 'manifest' });
  const itemNodes = findAllAfter(manifestNode, 0, { name: 'item' });

  itemNodes.forEach((itemNode) => {
    // @ts-ignore;
    const { id, href, 'media-type': mediaType } = itemNode.attributes;
    if (id) {
      manifest[id] = {
        href: resolveAssetPath(href),
        mediaType,
      };
    }
  });

  return manifest;
}

export function getMetadata(xast) {
  const metadata = {};
  const metadataNode = find(xast, { name: 'metadata' });
  const elementNodes = findAllAfter(metadataNode, 0, 'element');

  elementNodes.forEach((itemNode) => {
    const { children, name } = itemNode;
    const child = children[0];
    if (name && child) {
      const { type, value } = child;
      if (type === 'text') {
        metadata[name] = value;
      }
    }
  });

  return metadata;
}

export function getSpine(xast) {
  const spineNode = find(xast, { name: 'spine' });
  const itemRefNodes = findAllAfter(spineNode, 0, { name: 'itemref' });

  return itemRefNodes.map((itemRefNode) => {
    // @ts-ignore
    return itemRefNode.attributes.idref;
  });
}

// TODO: figure out hwo to implement this formally
export function resolveAssetPath(path) {
  return path;
}

export function getResolvedAssetIds(hast, manifest) {
  const assetIds = [];
  const reverseManifest = Object.keys(manifest).reduce((acc, key) => {
    acc[manifest[key].href] = key;
    return acc;
  }, {});

  visit(hast, (node) => {
    // @ts-ignore
    const { href, src } = node.properties || {};
    const hrefAssetId = reverseManifest[resolveAssetPath(href)];
    if (hrefAssetId) {
      assetIds.push(hrefAssetId);
    }
    const srcAssetId = reverseManifest[resolveAssetPath(src)];
    if (srcAssetId) {
      assetIds.push(srcAssetId);
    }
  });

  return assetIds;
}

export function attachAssets(hast, assets) {
  return toHtml(hast);
}
