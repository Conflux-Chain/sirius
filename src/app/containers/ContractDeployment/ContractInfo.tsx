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

export const checkAbi = abi => {
  let valid = true;
  try {
    abi && JSON.parse(abi);
  } catch (e) {
    valid = false;
  }
  return valid;
};

// @TODO checkBytecode and addOx should be recheck later, user experience and code is confused
const checkBytecode = bytecode => {
  const reg = /^(0x)?[0-9a-fA-F]+$/;
  return reg.test(bytecode) && bytecode !== '0';
};

// add 0x for common
const addOx = bytecode => {
  if (!(bytecode.startsWith('0') || bytecode.startsWith('0x'))) {
    return `0x${bytecode}`;
  }
  return bytecode;
};

// @TODO may intergration with contract registration later
export const ContractInfo = ({ onChange }) => {
  const [bytecode, setBytecode] = useState('');
  const [ABI, setABI] = useState('');
  const inputRef = createRef<any>();
  const [, setMessage] = useMessages();
  const { t } = useTranslation();

  const textOfInvalidJsonFile = t(translations.general.invalidJsonFile);

  const handleBytecodeChange = code => {
    if (code) {
      let bytecode = '';

      try {
        if (code.startsWith('[') || code.startsWith('{')) {
          // handle copied bytecode from Remix
          const json = JSON.parse(code.trim());
          bytecode = json.object;
        } else {
          bytecode = code.trim();
        }
      } catch (e) {
        // other bytecode string, may from ConfluxStudio or CFXTruffle
        bytecode = code.trim();
      }
      if (!checkBytecode(bytecode)) {
        setMessage({
          text: t(translations.general.invalidBytecode),
          color: 'error',
        });
      }
      setBytecode(addOx(bytecode));
    }
  };
  const handleABIChange = code => {
    if (!checkAbi(code)) {
      setMessage({
        text: t(translations.general.invalidABI),
        color: 'error',
      });
    }
    setABI(code);
  };

  const handleImport = () => {
    inputRef.current.click();
  };

  const handleFileChange = data => {
    try {
      const abi = JSON.stringify(data.abi, null, '\t');
      let bytecode = data.bytecode || data.data?.bytecode?.object;

      if (checkAbi(abi) && checkBytecode(bytecode)) {
        setABI(abi);
        setBytecode(addOx(bytecode));
      } else {
        throw new Error(textOfInvalidJsonFile);
      }
    } catch (e) {
      setMessage({
        text: textOfInvalidJsonFile,
        color: 'error',
      });
    }
  };

  const handleFileError = () => {
    setMessage({
      text: textOfInvalidJsonFile,
      color: 'error',
    });
  };

  useEffect(() => {
    let info: {
      bytecode: string;
      abi: string;
    } = { bytecode: '', abi: '' };
    if (checkBytecode(bytecode) && checkAbi(ABI)) {
      info.bytecode = bytecode;
      info.abi = ABI;
    }

    onChange(info);
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
            mode="text"
            style={AceEditorStyle}
            theme="github"
            name="UNIQUE_ID_OF_DIV"
            setOptions={{
              wrap: true,
              indentedSoftWrap: false,
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
    padding-bottom: 1.2857rem;
  }

  .link {
    color: #1e3de4;
    font-weight: 500;
    line-height: 1.2857rem;
    text-align: right;
    padding-bottom: 0.8571rem;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const StyledLabelWrapper = styled.div<{
  required?: boolean;
}>`
  font-size: 1rem;
  font-weight: 500;
  color: #0b132e;
  line-height: 1.2857rem;
  padding: 0.8571rem 0;
  border-bottom: 0.0714rem solid #e8e9ea;

  &::before {
    content: '*';
    color: #ff5599;
    display: ${props => (props.required ? 'auto' : 'none')};
  }
`;
