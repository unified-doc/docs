import Doc from 'unified-doc';

export default function Archive(options = {}, docOptions = {}) {
  const { content, pageCount, parser } = options;

  /** parse content into { content, pageName } */
  async function parse(paginationOptions = {}, parserOptions = {}) {
    const { pageNumber = 1, pageSize = 1 } = paginationOptions;
    const pageIndex = pageNumber - 1;

    async function createPage({ content, pageNumber }) {
      const docData = await parser(content, pageNumber, parserOptions);
      const doc = Doc({ ...docOptions, ...docData });
      return { doc, pageNumber };
    }

    const pageNumbers = Array.from({ length: pageCount })
      .map((_, i) => i + 1)
      .slice(pageIndex, pageIndex + pageSize);
    const pages = await Promise.all(
      pageNumbers.map((pageNumber) => {
        return createPage({ content, pageNumber });
      }),
    );

    return {
      pages,
      pageCount,
      pageNumber,
      pageSize,
    };
  }

  return {
    parse,
  };
}
