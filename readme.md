# 📄 docs
progressive docs for [**unified-doc**][unified-doc].

---

This is a progressive documentation site for the [**unified-doc**][unified-doc] project.  In addition to authored content, the site uses openly-sourced data from the following Github projects:
- [`syntax-tree`][syntax-tree]
- [`highlightjs/highlight.js`][highlightjs]
- [`GITenberg/Alice-s-Adventures-in-Wonderland-HTML-Edition_928`][gitenberg]

Documents used in the site are rendered with `unified-doc`, and we hope you enjoy this project and its quest to improve sharing and acquisition of human knowledge.

### Motivation

Vast amounts of human knowledge is stored digitally in different document formats.  It is cheap to create, store, render, and manage content for the same document format, but much harder to perform the same operations for content across different formats.  Some form of [unified][unified] bridge is required to significantly lower the friction when working across different formats, resulting in improved sharing of human knowledge.

Instead of implementing custom programs per format to parse/render/search/annotate/export content, `unified-doc` implements a set of unified document APIs for supported content types.  This allows extension of existing APIs to newly introduced content types, and for supported content types to benefit from future API methods.

With `unified-doc`, we can easily
- compile and render any content to HTML.
- format and style the document.
- mark or annotate the document.
- search on the document's text content.
- export the document in a variety of file formats.
- preserve the semantic structure of the source content.
- retrieve useful representations of the document (e.g. source, html, text, syntax tree).
- enrich the document through an ecosystem of plugins.
- evolve with interoperable web technologies.

### Document formats

`unified-doc` currently supports, and will eventually support, the following document formats (and relating [mime types][]):

#### Non-markup formats
Non-markup docments are trivially rendered into a code block that can be easily highlighted by JS syntax highlighting libraries e.g. `.txt`, `.json`, `.js`, `.css`, `.sh`, `.py`, `.r`, `.cpp` etc).

#### Markup formats
Markup formats are supported by implementing parsers that parse the respective source content into unified [hast][] syntax tree.  The [unified][] community is largely credited for implementation of such parsers.
- [x] `.html`
- [x] `.md`
- [ ] `.csv`
- [ ] `.docx`
- [ ] `.epub`
- [ ] `.mathml`
- [ ] `.pdf`
- [ ] `.rtf`
- [ ] `.tex`
- [ ] `.xml`

### Roadmap
- Finish the site!
- Work on "unofficial" `.csv`, `docx`, `epub`, `mathml`, `pdf`, `rtf`, `tex` parsers until the `unified` ecosystem ships formal parsers for the corresponding syntax trees.
- Work on `unified-doc-cli` that exposes `unified-doc` APIS conveniently in the CLI.
- Spec the `.uni` content type (`text/uni` mime type) with the `unified` community.


## Development
This progressive documentation is:
- built with `gatsby`.
- implemented with the `unified-doc` interface.
- linted with `xo` + `prettier` + `tsc`.

Project scripts:
```sh
# install dependencies and bootstrap with gatsby
npm run bootstrap

# build the docs with gatsby
npm run build

# clean all docs
npm run clean

# lint all packages with xo + prettier + tsc
npm run lint

# run the docs locally with gatsby
npm run docs
```

<!-- Definitions -->
[gitenberg]: https://github.com/GITenberg/Alice-s-Adventures-in-Wonderland-HTML-Edition_928
[hast]: https://github.com/syntax-tree/hast
[highlightjs]: https://github.com/highlightjs/highlight.js
[mime types]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
[syntax-tree]: https://github.com/syntax-tree
[unified]: https://github.com/unifiedjs
[unified-doc]: https://github.com/unified-doc/unified-doc
