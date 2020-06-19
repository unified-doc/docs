import aliceContent from 'raw-loader!./alice-in-wonderland.html';
import readmeContent from 'raw-loader!./readme.txt'; // docz mutates .md files, so naming this with a .txt extension

export const alice = {
  content: aliceContent,
  name: 'alice-in-wonderland.html',
};

export const readme = {
  content: readmeContent,
  name: 'readme.md',
};
