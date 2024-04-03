import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import styled from 'styled-components';
import { DappButton } from '../../components/DappButton/Loadable';
import { TXN_ACTION } from 'utils/constants';
import { ContractInfo } from './ContractInfo';
import { Remark } from '../../components/Remark';

export function ContractDeployment() {
  const { t } = useTranslation();
  const [contractInfo, setContractInfo] = useState({ bytecode: '' });

  const txData = contractInfo.bytecode;

  const handleContractInfoChange = info => {
    setContractInfo(info);
  };

  return (
    <>
      <Helmet>
        <title>{t(translations.contractDeployment.title)}</title>
        <meta
          name="description"
          content={t(translations.contractDeployment.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.contractDeployment.title)}</PageHeader>
      <StyledContractInfoWrapper>
        <ContractInfo onChange={handleContractInfoChange}></ContractInfo>
      </StyledContractInfoWrapper>
      <StyledButtonWrapper>
        <DappButton
          contractAddress=""
          data={txData}
          btnDisabled={!contractInfo.bytecode}
          txnAction={TXN_ACTION.contractDeplpy}
        ></DappButton>
      </StyledButtonWrapper>
      <StyledRemarkWrapper>
        <Remark
          items={[
            t(translations.contractDeployment.notice.first),
            t(translations.contractDeployment.notice.second),
            t(translations.contractDeployment.notice.third),
          ]}
        ></Remark>
      </StyledRemarkWrapper>
    </>
  );
}

const StyledButtonWrapper = styled.div`
  margin: 1.7143rem 0;
`;

const StyledRemarkWrapper = styled.div`
  margin-bottom: 1.7143rem;
`;

const StyledContractInfoWrapper = styled.div`
  margin-top: -28px;
`;
