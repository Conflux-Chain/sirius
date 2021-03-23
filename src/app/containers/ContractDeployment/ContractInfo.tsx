import React, { useState, createRef, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-github';
import { useMessages } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { JSONFileUpload } from '../../components/JSONFileUpload';
import { translations } from 'locales/i18n';
import { Card } from '../../components/Card';

const AceEditorStyle = {
  width: '100%',
  height: '200px',
  backgroundColor: '#F8F9FB',
  opacity: 0.62,
};

const checkAbi = abi => {
  return abi && typeof abi === 'object';
};
const checkBytecode = bytecode => {
  return (
    bytecode &&
    typeof bytecode === 'string' &&
    (bytecode.startsWith('0x6080') || bytecode.startsWith('6080'))
  );
};

// @TODO may intergration with contract registration later
export const ContractInfo = ({ onChange }) => {
  const [bytecode, setBytecode] = useState('');
  const [ABI, setABI] = useState('');
  const inputRef = createRef<any>();
  const [, setMessage] = useMessages();
  const { t } = useTranslation();

  const invalidJsonFile = t(translations.general.invalidJsonFile);

  const handleBytecodeChange = code => {
    if (code) {
      let bytecode = '';

      try {
        // handle copied bytecode from Remix
        const json = JSON.parse(code.trim());

        if (checkBytecode(json.object)) {
          bytecode = json.object;
        } else {
          setMessage({
            text: invalidJsonFile,
            color: 'error',
          });
        }
      } catch (e) {
        // other bytecode string, may from ConfluxStudio or CFXTruffle
        bytecode = code.trim();
      }
      setBytecode(`0x${bytecode}`);
    }
  };
  const handleABIChange = code => {
    setABI(code);
  };

  const handleImport = () => {
    inputRef.current.click();
  };

  const handleFileChange = data => {
    try {
      const abi = data.abi;
      let bytecode = data.bytecode || data.data?.bytecode?.object;
      bytecode =
        bytecode && bytecode.startsWith('0x') ? bytecode : `0x${bytecode}`;

      if (checkAbi(abi) && checkBytecode(bytecode)) {
        setABI(JSON.stringify(abi, null, '\t'));
        setBytecode(bytecode);
      } else {
        throw new Error(invalidJsonFile);
      }
    } catch (e) {
      setMessage({
        text: invalidJsonFile,
        color: 'error',
      });
    }
  };

  const handleFileError = () => {
    setMessage({
      text: invalidJsonFile,
      color: 'error',
    });
  };

  useEffect(() => {
    onChange({
      abi: ABI,
      bytecode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ABI, bytecode]);

  return (
    <>
      <JSONFileUpload
        ref={inputRef}
        onChange={handleFileChange}
        onError={handleFileError}
      />
      <StyledContentWrapper>
        <div className="link" onClick={handleImport}>
          {t(translations.general.importJsonFile)}
        </div>
        <Card className="contract-info-card">
          <StyledLabelWrapper required>bytecode</StyledLabelWrapper>
          <AceEditor
            mode="json"
            style={AceEditorStyle}
            theme="github"
            name="UNIQUE_ID_OF_DIV"
            setOptions={{
              wrap: true,
            }}
            fontSize="1rem"
            showGutter={false}
            showPrintMargin={false}
            onChange={handleBytecodeChange}
            value={bytecode}
          />
          <StyledLabelWrapper>ABI</StyledLabelWrapper>
          <AceEditor
            style={AceEditorStyle}
            mode="json"
            theme="github"
            name="UNIQUE_ID_OF_DIV"
            setOptions={{
              wrap: true,
            }}
            fontSize="1rem"
            showGutter={false}
            showPrintMargin={false}
            onChange={handleABIChange}
            value={ABI}
          />
        </Card>
      </StyledContentWrapper>
    </>
  );
};

const StyledContentWrapper = styled.div`
  position: relative;

  .card.contract-info-card {
    padding-bottom: 18px;
  }

  .link {
    color: #1e3de4;
    font-weight: 500;
    line-height: 18px;
    text-align: right;
    padding-bottom: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const StyledLabelWrapper = styled.div<{
  required?: boolean;
}>`
  font-size: 14px;
  font-weight: 500;
  color: #0b132e;
  line-height: 18px;
  padding: 12px 0;
  border-bottom: 1px solid #e8e9ea;

  &::before {
    content: '*';
    color: #ff5599;
    display: ${props => (props.required ? 'auto' : 'none')};
  }
`;
