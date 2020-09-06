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

async function getPdfDoc(content) {
  return pdfjs.getDocument(content).promise;
}

export async function getPageCount(content) {
  const doc = await pdfjs.getDocument(content).promise;
  return doc.numPages;
}

export default async function parser(content, pageNumber, options) {
  const { scale = 1 } = options;
  const doc = await getPdfDoc(content);
  const html = await renderPage(doc, { pageNumber, scale });
  return {
    content: html,
    filename: `page-${pageNumber}.html`,
  };
}
