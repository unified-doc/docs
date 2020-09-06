import dedent from 'dedent';
import pdfjs from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer.js';

if (pdfjs.GlobalWorkerOptions !== undefined) {
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

async function cleanup(elements) {
  elements.forEach((element) => element.remove());
}

function toHtml(container, canvas) {
  const { height, width } = canvas;
  return dedent`
    <html>
      <head>
        <style>
          .textLayer {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            line-height: 1.0;
          }
          .textLayer > span {
            color: transparent;
            position: absolute;
            white-space: pre;
            cursor: text;
            transform-origin: 0% 0%;
          }
        </style>
      </head>
      <body>
        <div style="position: relative">
          <img src=${canvas.toDataURL()} style="width:${width}px; height: ${height}px" />
          ${container.innerHTML}
        </div>
      </body>
    </html>
  `;
}

async function renderPage(doc, options) {
  const { pageNumber, scale } = options;
  const container = document.createElement('div');
  const canvas = document.createElement('canvas');
  container.setAttribute('style', 'position: relative');

  // render page
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvasContext = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext, viewport }).promise;

  // render text layer
  const textContent = await page.getTextContent();
  const textLayerDiv = document.createElement('div');
  textLayerDiv.setAttribute('class', 'textLayer');
  container.append(textLayerDiv);
  const textLayer = new TextLayerBuilder({
    textLayerDiv,
    pageIndex: page.pageIndex,
    viewport,
  });
  textLayer.setTextContent(textContent);
  await textLayer.render();

  await cleanup([container, canvas]);

  return toHtml(container, canvas);
}

export async function getPdfDoc(data) {
  const contents = data instanceof File ? await data.arrayBuffer() : data;
  return pdfjs.getDocument(contents).promise;
}

export default async function parsePdf(file, options = {}) {
  const { pageNumber = null, scale = 1 } = options;

  const doc = await getPdfDoc(file);
  let pages = Array.from({ length: doc.numPages }).fill('');

  if (pageNumber === null) {
    pages = await Promise.all(
      pages.map((_, i) => {
        return renderPage(doc, { pageNumber: i + 1, scale });
      }),
    );
  } else {
    const content = await renderPage(doc, { pageNumber, scale });
    pages[pageNumber - 1] = content;
  }

  return pages;
}
