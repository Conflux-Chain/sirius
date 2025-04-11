import React, { useState, useRef, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/theme-github';
import { useMessages } from '@cfxjs/react-ui';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FileUpload } from '@cfxjs/sirius-next-common/dist/components/FileUpload';
import { translations } from 'locales/i18n';
import { StyledCard as Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { isHex } from 'utils';
import imgInfo from 'images/info.svg';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';

const AceEditorStyle = {
  width: '100%',
  height: '200px',
  backgroundColor: '#F8F9FB',
  opacity: 0.62,
};

// @TODO checkBytecode and addOx should be recheck later, user experience and code is confused
const checkBytecode = bytecode => {
  return isHex(bytecode, false) && bytecode !== '0';
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
  const [constructorArguments, setConstructorArguments] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
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
    } else {
      setBytecode('');
    }
  };

  const handleImport = () => {
    inputRef.current?.click();
  };

  const handleFileChange = file => {
    try {
      let data = JSON.parse(file);
      let bytecode =
        data.bytecode?.object || data.bytecode || data.data?.bytecode?.object;

      if (checkBytecode(bytecode)) {
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
    } = { bytecode: '' };

    if (checkBytecode(bytecode)) {
      info.bytecode = bytecode;
    }

    if (constructorArguments && isHex(constructorArguments, false)) {
      info.bytecode = info.bytecode + constructorArguments;
    }

    onChange(info);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bytecode, constructorArguments]);

  const handleConstructorArgumentsInputChange = data => {
    setConstructorArguments(data);
    if (!isHex(data, false)) {
      setMessage({
        text: t(translations.general.invalidBytecode),
        color: 'error',
      });
    }
  };

  return (
    <>
      <FileUpload
        accept=".json"
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

          <StyledLabelWrapper>
            <div>
              constructor arguments{' '}
              <Tooltip title={t(translations.contractDeployment.tip)}>
                <img src={imgInfo} alt="?" width="14px" />
              </Tooltip>
            </div>
            <div>
              <Link href="https://abi.hashex.org" target={'_blank'}>
                ABI Encoder Tool
              </Link>
            </div>
          </StyledLabelWrapper>
          <AceEditor
            mode="text"
            style={{ ...AceEditorStyle, height: '150px' }}
            theme="github"
            name="UNIQUE_ID_OF_DIV"
            setOptions={{
              wrap: true,
              indentedSoftWrap: false,
            }}
            fontSize="1rem"
            showGutter={false}
            showPrintMargin={false}
            onChange={handleConstructorArgumentsInputChange}
            value={constructorArguments}
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
  display: flex;
  justify-content: space-between;
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
