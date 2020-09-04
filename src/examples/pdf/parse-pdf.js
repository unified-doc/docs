import pdfjs from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer.js';

import 'pdfjs-dist/web/pdf_viewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

async function renderTextLayers(div, page, viewport) {
  const textContent = await page.getTextContent();
  const textLayerDiv = document.createElement('div');
  textLayerDiv.setAttribute('class', 'textLayer');
  div.append(textLayerDiv);
  // Create new instance of TextLayerBuilder class
  const textLayer = new pdfjsViewer.TextLayerBuilder({
    textLayerDiv,
    pageIndex: page.pageIndex,
    viewport,
  });
  textLayer.setTextContent(textContent);
  textLayer.render();
}

async function getTextContent(div) {
  return div.innerHTML;
}

async function toHtml(div, canvas) {
  const dataURL = canvas.toDataURL();
  const { height, width } = canvas;

  const html = `
    <html>
      <head></head>
      <body>
        <div style="position: relative">
          <img src=${dataURL} style="width:${width}px; height: ${height}px" />
          ${div.innerHTML}
        </div>
      </body>
    </html>
  `;

  return html;
}

export default async function parsePdf(pdfFile) {
  const pdfContents =
    typeof pdfFile === 'string' ? pdfFile : await pdfFile.arrayBuffer();
  // @ts-ignore
  const doc = await pdfjs.getDocument(pdfContents).promise;
  const container = document.createElement('div');

  const page = await doc.getPage(1);
  const scale = 1.15;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');

  async function cleanup() {
    canvas.remove();
  }

  const div = document.createElement('div');
  div.setAttribute('style', 'position: relative');
  container.append(div);
  div.append(canvas);

  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport,
  };

  await page.render(renderContext).promise;

  await renderTextLayers(div, page, viewport);

  await cleanup();

  return toHtml(div, canvas);
}
