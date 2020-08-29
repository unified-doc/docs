import axios from 'axios';
import fs from 'fs';

// all content and datasets belong and are credited to their sources.
const sources = [
  // html
  {
    folder: 'alice',
    name: 'chapter-1.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-I.html',
  },
  {
    folder: 'alice',
    name: 'chapter-2.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-II.html',
  },
  {
    folder: 'alice',
    name: 'chapter-3.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-III.html',
  },
  {
    folder: 'alice',
    name: 'chapter-4.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-IV.html',
  },
  {
    folder: 'alice',
    name: 'chapter-5.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-V.html',
  },
  {
    folder: 'alice',
    name: 'chapter-6.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-VI.html',
  },
  {
    folder: 'alice',
    name: 'chapter-7.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-VII.html',
  },
  {
    folder: 'alice',
    name: 'chapter-8.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-VIII.html',
  },
  {
    folder: 'alice',
    name: 'chapter-9.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-IX.html',
  },
  {
    folder: 'alice',
    name: 'chapter-10.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-X.html',
  },
  {
    folder: 'alice',
    name: 'chapter-11.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-XI.html',
  },
  {
    folder: 'alice',
    name: 'chapter-12.html',
    url: 'https://www.cs.cmu.edu/~rgs/alice-XII.html',
  },
  // markdown
  {
    folder: 'hast',
    name: 'readme.md',
    url: 'https://raw.githubusercontent.com/syntax-tree/hast/main/readme.md',
  },
  {
    folder: 'unist',
    name: 'readme.md',
    url: 'https://raw.githubusercontent.com/syntax-tree/unist/main/readme.md',
  },
  {
    folder: 'mdast',
    name: 'readme.md',
    url: 'https://raw.githubusercontent.com/syntax-tree/mdast/main/readme.md',
  },
  {
    folder: 'xast',
    name: 'readme.md',
    url: 'https://raw.githubusercontent.com/syntax-tree/xast/main/readme.md',
  },
  {
    folder: 'nlcst',
    name: 'readme.md',
    url: 'https://raw.githubusercontent.com/syntax-tree/nlcst/main/readme.md',
  },
  // csv
  {
    folder: 'covid',
    name: 'nytimes.csv',
    url:
      'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv',
  },
  {
    folder: 'covid',
    name: 'csse.csv',
    url:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/who_covid_19_situation_reports/who_covid_19_sit_rep_time_series/who_covid_19_sit_rep_time_series.csv',
  },
  // json
  {
    folder: 'unified-doc',
    name: 'package.json',
    url:
      'https://raw.githubusercontent.com/unified-doc/unified-doc/main/package.json',
  },
  {
    folder: 'unified-doc-dom',
    name: 'package.json',
    url:
      'https://raw.githubusercontent.com/unified-doc/unified-doc-dom/main/package.json',
  },
  // pdf
  {
    folder: 'pdfjs',
    name: 'annotation-text-link-popup.pdf',
    url:
      'https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/annotation-link-text-popup.pdf',
  },
  {
    folder: 'pdfjs',
    name: 'annotation-text-widget.pdf',
    url:
      'https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/annotation-text-widget.pdf',
  },
  // docx
  {
    folder: 'mammoth',
    name: 'simple-list.docx',
    url:
      'https://raw.githubusercontent.com/mwilliamson/mammoth.js/master/test/test-data/simple-list.docx',
  },
  {
    folder: 'mammoth',
    name: 'tables.docx',
    url:
      'https://raw.githubusercontent.com/mwilliamson/mammoth.js/master/test/test-data/tables.docx',
  },
];

// the eventual goal would be to use pipeline based on unified-doc-cli
async function crawl() {
  const files = sources.map(async (source) => {
    const { folder, name, url } = source;

    let content = '';
    try {
      const response = await axios.get(url);
      content = response.data;
    } catch {
      console.error(`Unable to fetch content from ${url}.`);
      // swallow exception
    }
    return {
      content,
      folder,
      lastModified: Date.now(),
      name,
      url,
    };
  });
  fs.writeFile(
    './src/data/files.json',
    JSON.stringify(await Promise.all(files), null, 2),
    (err) => {
      if (err) {
        throw err;
      }
      console.log('Files successfully written!');
    },
  );
}

crawl();
