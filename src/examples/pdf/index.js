import React from 'react';

import DocSet from './doc-set';
import fromPdf from './from-pdf';

export default function PdfExample() {
  const pdf = 'adfadf';
  const docs = DocSet(fromPdf(pdf));
  console.log(docs);
  return <div>In progress</div>;
}
