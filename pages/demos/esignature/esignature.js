import React, { createElement, useEffect, useRef, useState } from 'react';
import rehype2react from 'rehype-react';
import unifiedDoc from 'unified-doc';
import 'unified-doc-dom/lib/highlight.css';

import { downloadFile } from '~/pages/utils';
import { Button, Card, FlexLayout, TextInput } from '~/ui';

import './esignature.css';

const content = `
<h1>Contract</h1>
Use the sidebar to sign the contract.

When all fields are signed, you can download the final contract as a HTML document!

<h2>{{company1}}</h2>
<h3>Signers</h3>
<ul>
  <li>Signature: {{signer1}}</li>
  <li>Signature: {{signer2}}</li>
</ul>

<h2>{{company2}}</h2>
<ul>
  <li>Signature: {{signer1}}</li>
  <li>Signature: {{signer2}}</li>
</ul>
`;

const annotations = [
  {
    id: 'contract',
    start: 0,
    end: 9,
  },
  {
    id: 'company1',
    start: 133,
    end: 145,
    classNames: ['company-1'],
    data: {
      type: 'company',
      index: 1,
    },
  },
  {
    id: 'signer1',
    start: 168,
    end: 179,
    classNames: ['company-1'],
    data: {
      type: 'signer',
      index: 1,
    },
  },
  {
    id: 'signer2',
    start: 193,
    end: 204,
    classNames: ['company-1'],
    data: {
      type: 'signer',
      index: 2,
    },
  },
  {
    id: 'company2',
    start: 207,
    end: 219,
    classNames: ['company-2'],
    data: {
      type: 'company',
      index: 2,
    },
  },
  {
    id: 'signer3',
    start: 234,
    end: 245,
    classNames: ['company-2'],
    data: {
      type: 'signer',
      index: 3,
    },
  },
  {
    id: 'signer4',
    start: 259,
    end: 270,
    classNames: ['company-2'],
    data: {
      type: 'signer',
      index: 4,
    },
  },
];

function initializeContract(annotations) {
  return annotations
    .filter(annotation => ['company', 'signer'].includes(annotation.data?.type))
    .reduce((contract, annotation) => {
      const { id, data } = annotation;
      const { type, index } = data;
      return {
        ...contract,
        [id]: {
          id,
          label: `${type} ${index}`,
          value: '',
        },
      };
    }, {});
}

function validateContract(contract) {
  return Object.values(contract).every(field => field.value);
}

export default function ESignature() {
  const docRef = useRef(null);
  const [contract, setContract] = useState(initializeContract(annotations));

  useEffect(() => {
    Object.values(contract).forEach(field => {
      const { id, value } = field;
      const element = document.getElementById(id);
      element.textContent = value || `{{${element.dataset.annotationId}}}`;
    });
  }, [contract]);

  const doc = unifiedDoc({
    annotations,
    compiler: [rehype2react, { createElement }],
    content,
    filename: 'contract.html',
  });

  // @ts-ignore: fix vfile typing;
  const { result } = doc.compile();

  function handleDownload() {
    const signedDocContent = docRef.current.outerHTML;
    // https://developer.mozilla.org/en-US/docs/Web/API/StyleSheetList
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('');
      })
      .filter(Boolean)
      .join('\n');

    const signedHtml = `<html><head><style>${styles}</style></head><body>${signedDocContent}</body></html>`;

    downloadFile({
      name: 'contract-signed.html',
      content: signedHtml,
      type: 'text/html',
    });
  }

  return (
    <FlexLayout space={3}>
      <Card sx={{ flex: '1 1 auto' }}>
        <div ref={docRef}>{result}</div>
      </Card>
      <Card sx={{ flex: '0 0 40%' }}>
        <FlexLayout flexDirection="column" space={3}>
          {Object.values(contract).map(field => {
            const { id, label, value } = field;
            return (
              <TextInput
                key={id}
                id={id}
                label={label}
                value={value}
                onChange={value => {
                  setContract({
                    ...contract,
                    [id]: {
                      ...contract[id],
                      value,
                    },
                  });
                }}
              />
            );
          })}
          <Button
            disabled={!validateContract(contract)}
            variant="primary"
            onClick={handleDownload}>
            Download Signed Contract
          </Button>
        </FlexLayout>
      </Card>
    </FlexLayout>
  );
}
