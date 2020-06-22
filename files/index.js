import aliceContent from 'raw-loader!./alice-in-wonderland';
import htmlIpsumContent from 'raw-loader!./html-ipsum';

export const alice = {
  content: aliceContent,
  filename: 'alice-in-wonderland.html',
};

export const htmlIpsum = {
  content: htmlIpsumContent,
  filename: 'html-ipsum.html',
};
