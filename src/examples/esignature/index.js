import React, {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import rehype2react from 'rehype-react';
import Doc from 'unified-doc';
import { highlight, registerMarks, saveFile } from 'unified-doc-dom';
import { v4 as uuidv4 } from 'uuid';

import { Box, Card, Flex, Icon, Text, TextInput } from '~/ui';

import { SIGNATURE_PLACEHOLDER, content } from './content';

const filename = 'unsigned-document.md';
const DATA_SIGNED_DATE_ATTRIBUTE = 'data-signed-date';

// get marks by easily searching on the signature placeholder in the document
const initialSignatures = Doc({ content, filename })
  .search(SIGNATURE_PLACEHOLDER)
  .map((result) => {
    const { start, end } = result;
    return {
      id: uuidv4(),
      classNames: ['unsigned'],
      start,
      end,
      data: {
        signed: null,
      },
    };
  });

function getNextSignature(signatures) {
  return signatures.find((signature) => !signature.data.signed);
}

export default function ESignatureExample() {
  const docRef = useRef(null);
  const [name, setName] = useState('');
  const [signatures, setSignatures] = useState(initialSignatures);

  const signed = signatures.filter((signature) => signature.data.signed);
  const signCount = signed.length;
  const signatureCount = signatures.length;
  const nextSignature = getNextSignature(signatures);
  const disabled = !name;

  const signStyle = {
    border: 'border',
    color: 'text',
    cursor: 'pointer',
    position: 'relative',
    px: 2,
    py: 1,
    fontWeight: 'bold',
    ':hover': {
      opacity: 0.7,
    },
  };

  const docStyle = {
    '.unsigned': {
      ...signStyle,
      backgroundColor: '#ffe084',
      opacity: disabled ? 0.3 : undefined,
      pointerEvents: disabled ? 'none' : undefined,
      textDecoration: disabled ? undefined : 'underline',
    },
    '.signed': {
      ...signStyle,
      backgroundColor: 'muted',
      '::after': {
        content: `attr(${DATA_SIGNED_DATE_ATTRIBUTE})`,
        color: 'light',
        fontSize: '8px',
        fontWeight: 'normal',
        left: 0,
        position: 'absolute',
        top: '100%',
        width: 'max-content',
      },
    },
  };

  const doc = useMemo(() => {
    return Doc({
      compiler: [[rehype2react, { createElement }]],
      content,
      marks: signatures,
      filename: 'unsigned-document.md',
      sanitizeSchema: {
        attributes: {
          '*': ['className', 'style'],
          mark: ['dataMarkId', 'id'],
        },
        clobberPrefix: '',
      },
    });
  }, [signatures]);

  // register marks with callbacks
  useEffect(() => {
    function update(signature) {
      const updatedSignatures = signatures.map((previousSignature) => {
        const { id, data } = previousSignature;
        const { signed } = data;
        if (signature.id === id) {
          return {
            ...previousSignature,
            classNames: [signed ? 'unsigned' : 'signed'],
            data: {
              ...data,
              name,
              signed: signed ? null : new Date(),
            },
          };
        }
        return previousSignature;
      });
      setSignatures(updatedSignatures);
    }

    const callbacks = {
      onClick: (_event, signature) => update(signature),
    };
    return registerMarks(docRef.current, signatures, callbacks);
  }, [name, signatures]);

  // convert all marks into signature nodes
  useEffect(() => {
    signatures.forEach((signature) => {
      const { data, id } = signature;
      const { name, signed } = data;
      const signatureElement = document.querySelector(`[data-mark-id='${id}']`);
      if (signed) {
        signatureElement.innerHTML = name;
        signatureElement.setAttribute(DATA_SIGNED_DATE_ATTRIBUTE, signed);
      } else {
        signatureElement.innerHTML = 'Sign';
        signatureElement.removeAttribute(DATA_SIGNED_DATE_ATTRIBUTE);
      }
    });
  }, [signatures]);

  function next() {
    if (nextSignature) {
      highlight(docRef.current, nextSignature.id);
    }
  }

  function reset() {
    setSignatures(initialSignatures);
  }

  function save() {
    const fileData = doc.file('.html');
    const stem = fileData.stem + '.signed';
    const name = stem + fileData.extension;
    const content = docRef.current.innerHTML;
    saveFile({
      ...fileData,
      content,
      name,
      stem,
    });
  }

  return (
    <Card variant="doc">
      <Flex flexDirection="column" space={3}>
        <TextInput
          id="legal-name"
          label="Legal Name"
          value={name}
          onChange={setName}
        />
        {disabled && (
          <Text variant="small">
            Please fill in the name of the signer to place signatures
          </Text>
        )}
        {!disabled && (
          <Flex alignItems="center" justifyContent="space-between">
            {signCount > 0 ? (
              <Icon icon="trash" label="Reset signatures" onClick={reset} />
            ) : (
              <div />
            )}
            {nextSignature ? (
              <Icon
                href={`#${nextSignature.id}`}
                icon="pen"
                label={`Sign (${signCount}/${signatureCount})`}
                onClick={next}
              />
            ) : (
              <Icon
                icon="save"
                label="Download signed document"
                onClick={save}
              />
            )}
          </Flex>
        )}
      </Flex>
      <Box ref={docRef} sx={docStyle}>
        {doc.compile().result}
      </Box>
    </Card>
  );
}
