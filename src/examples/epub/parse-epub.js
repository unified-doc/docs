import fromParse5 from 'hast-util-from-parse5';
import parse5 from 'parse5';
import JSZip from 'jszip';
import fromXml from 'xast-util-from-xml';

import {
  attachAssets,
  getManifest,
  getMetadata,
  getPackagePath,
  getSpine,
  getResolvedAssetIds,
} from './utils';

export default function Parser(content, options = {}) {
  const zip = new JSZip();

  let basePath = '';
  let manifest = {};
  let metadata = {};
  let spine = [];

  async function load() {
    await zip.loadAsync(content);

    const containerXml = await zip
      .file('META-INF/container.xml')
      .async('string');
    const packagePath = getPackagePath(fromXml(containerXml));
    const packageXml = await zip.file(packagePath).async('string');
    const packageXast = fromXml(packageXml);

    basePath = packagePath.match(/(.*)content.opf/)[1] || '';
    manifest = getManifest(packageXast);
    metadata = getMetadata(packageXast);
    spine = getSpine(packageXast);
  }

  async function getAsset(id) {
    const item = manifest[id];
    const { href, mediaType } = item;
    const path = `${basePath}${href}`;

    let data;
    switch (mediaType) {
      case 'text/css':
      case 'application/xhtml+xml': {
        data = await zip.file(path).async('string');
        break;
      }
      default: {
        data = await zip.file(path).async('base64');
        data = `data:${mediaType};base64,${data}`;
      }
    }

    return { id, data, href, mediaType };
  }

  async function parse(pageNumber) {
    const contentId = spine[pageNumber - 1];
    const contentItem = await getAsset(contentId);

    const hast = fromParse5(parse5.parse(contentItem.data));
    const resolvedAssetIds = getResolvedAssetIds(hast, manifest);
    const resolvedAssets = await Promise.all(resolvedAssetIds.map(getAsset));
    const assets = resolvedAssets.reduce((acc, asset) => {
      acc[asset.href] = asset;
      return acc;
    }, {});
    const content = attachAssets(hast, assets);
    return {
      content,
      // TODO: figure out how to extract content page/section title
      filename: `Page ${pageNumber}.html`,
    };
  }

  function getPageCount() {
    return spine.length;
  }

  return {
    getPageCount,
    load,
    parse,
  };
}
