import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import 'styles/antd.custom.css';
import styled from 'styled-components/macro';
import { DappButton } from '../../components/DappButton/Loadable';
import { TxnAction } from 'utils/constants';
import { ContractInfo } from './ContractInfo';

export function ContractDeployment() {
  const { t } = useTranslation();
  const [contractInfo, setContractInfo] = useState({ bytecode: '' });

  const txData = contractInfo.bytecode;

  const handleContractInfoChange = info => {
    setContractInfo(info);
  };

  // const handleSuccess = txnHash => {};

  return (
    <>
      <Helmet>
        <title>{t(translations.contractDeployment.title)}</title>
        <meta
          name="description"
          content={t(translations.contractDeployment.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.contractDeployment.tip)}>
        {t(translations.contractDeployment.title)}
      </PageHeader>
      <ContractInfo onChange={handleContractInfoChange}></ContractInfo>
      <StyledButtonWrapper>
        <DappButton
          contractAddress=""
          data={txData}
          btnDisabled={!contractInfo.bytecode}
          txnAction={TxnAction.contractDeplpy}
          // successCallback={handleSuccess}
        ></DappButton>
      </StyledButtonWrapper>
    </>
  );
}

const StyledButtonWrapper = styled.div`
  padding: 24px 0;
`;
