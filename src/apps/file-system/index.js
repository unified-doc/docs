import moment from 'moment';
import React, { useState } from 'react';
import Doc from 'unified-doc';

import initialFiles from '~/data/files.json';
import { DocPreview } from '~/ui';

import FileList from './file-list';

export default function FileSystem() {
  const [files] = useState(extract(initialFiles));
  const [selectedFile, setSelectedFile] = useState(null);
  if (selectedFile) {
    return (
      <DocPreview
        content={selectedFile.doc.file().content}
        filename={selectedFile.name}
        onBack={() => setSelectedFile(null)}
      />
    );
  }
  return <FileList files={files} onSelectFile={setSelectedFile} />;
}

function extract(files) {
  return files.map((file) => {
    const { folder, lastModified, name } = file;
    // TODO: hack for unsupported extension.  will be formally supported in the nera future!
    const content = name.endsWith('.json')
      ? JSON.stringify(file.content, null, 2)
      : file.content;
    return {
      name,
      lastModified: moment(lastModified).fromNow(),
      folder,
      doc: Doc({
        content,
        filename: name,
      }),
    };
  });
}
