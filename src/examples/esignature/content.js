export const SIGNATURE_PLACEHOLDER = '{{SIGNATURE}}';

export const content = `
# The First ESigned ${'`'}md${'`'} Document

With [**unified-doc**](https://github.com/unified-doc), we now have the ability to esign markdown documents (or *any* document format that **unified-doc** supports).  With this approach, we *no longer* have to:
- write custom programs per document type to implement esignature features on different documents.
- build complex pipelines to convert between document formats to collect esignatures in a non-native document format.
- integrate with third-party vendor solutions that maybe limiting, expensive, and just cumbersome at times.

If you think this is cool and would like to see how we generate a signed document with minimal effort, please sign here: ${SIGNATURE_PLACEHOLDER} as well as the following places in the document below.

## ${SIGNATURE_PLACEHOLDER} in a header.

> You can also ${SIGNATURE_PLACEHOLDER} within a blockquote.

- and ${SIGNATURE_PLACEHOLDER} in list items.
- it's that easy!
`;
