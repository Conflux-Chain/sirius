import React, { useCallback, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import styled from 'styled-components';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { formatABI } from '@cfxjs/sirius-next-common/dist/utils';
import { packContractABI } from '@cfxjs/sirius-next-common/dist/utils/contractManagerTool';
import { AceEditor } from '@cfxjs/sirius-next-common/dist/components/AceEditor';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { DappButton } from 'app/components/DappButton/Loadable';
import { TXN_ACTION, CONTRACTS } from 'utils/constants';
import { useMessages } from '@cfxjs/react-ui';
import { debounce } from 'lodash';

const AceEditorStyle = {
  minHeight: '28.5714rem',
  marginBottom: '24px',
};

export const ABIVerification = () => {
  const { t } = useTranslation();
  const [, setMessage] = useMessages();
  const [txData, setTxData] = useState('');
  const [abi, setAbi] = useState('');

  const getTxData = useCallback(
    debounce((_abi: string) => {
      const abi = _abi.trim();
      if (!abi) return;
      try {
        const formattedAbi = formatABI(abi, {
          allowTypes: ['function'],
          nameRequired: true,
        }) as string[];
        // encode tx data
        const data = packContractABI({
          abi: formattedAbi,
        });
        setTxData(data[0]);
      } catch (error) {
        const errorMessage = error?.message ?? '';
        const text = errorMessage.includes('abi is empty')
          ? t(translations.abiVerification.error.abiEmpty)
          : errorMessage.includes('name is required')
          ? t(translations.abiVerification.error.nameRequired)
          : errorMessage.includes('type is not allowed')
          ? t(translations.abiVerification.error.typeNotAllowed)
          : t(translations.abiVerification.error.decodeError, {
              error: error.message,
            });
        setMessage({
          text,
          color: 'error',
        });
        setTxData('');
      }
    }, 500),
    [],
  );

  const handleABIChange = (_abi: string) => {
    setAbi(_abi);
    getTxData(_abi);
  };
  return (
    <StyledABIVerificationWrapper>
      <Helmet>
        <title>{t(translations.abiVerification.title)}</title>
        <meta
          name="description"
          content={t(translations.abiVerification.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.abiVerification.subtitle)}>
        {t(translations.abiVerification.title)}
      </PageHeader>
      <Card className="abi-verification-form-container">
        <AceEditor
          style={AceEditorStyle}
          mode="json"
          theme="tomorrow"
          name="abi_json"
          setOptions={{
            wrap: true,
            indentedSoftWrap: false,
          }}
          height="28rem"
          fontSize="1rem"
          showGutter={false}
          showPrintMargin={false}
          onChange={handleABIChange}
          value={abi}
          placeholder={t(translations.abiVerification.placeholder.abi)}
        />
        <DappButton
          contractAddress={CONTRACTS.announcement}
          data={txData}
          btnDisabled={!txData}
          txnAction={TXN_ACTION.abiVerification}
          successCallback={() => {
            setAbi('');
            setTxData('');
          }}
        ></DappButton>
      </Card>
    </StyledABIVerificationWrapper>
  );
};

const StyledABIVerificationWrapper = styled.div`
  .card.abi-verification-form-container {
    padding: 0.8571rem 1.4286rem 1.2857rem 1.4286rem;
  }
  .ace_placeholder {
    white-space: normal;
  }
`;
