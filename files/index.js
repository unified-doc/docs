import aliceContent from 'raw-loader!./alice-in-wonderland';
import htmlIpsumContent from 'raw-loader!./html-ipsum';
import markdownIpsumContent from 'raw-loader!./markdown-ipsum';

export const alice = {
  content: aliceContent,
  filename: 'alice-in-wonderland.html',
};

export const markdownIpsum = {
  content: markdownIpsumContent,
  filename: 'markdown-ipsum.md',
};

export const htmlIpsum = {
  content: htmlIpsumContent,
  filename: 'html-ipsum.html',
};
