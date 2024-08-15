import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { translations } from 'locales/i18n';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { abi as governanceAbi } from '../../../utils/contract/governance.json';
import { CFX, CONTRACTS } from '../../../utils/constants';
import { BlockNumberCalculator } from './BlockNumberCalculator';
import { getPosStatus } from 'utils/rpcRequest';
import { useParams, useLocation } from 'react-router-dom';
import qs from 'query-string';

const governanceContract = CFX.Contract({
  abi: governanceAbi,
  address: CONTRACTS.governance,
});

const getPosBlockNumber = async () => {
  const status = await getPosStatus();
  return String(status.latestCommitted);
};

export function BlocknumberCalc() {
  const { t } = useTranslation();
  const { block: routeBlockNumber = '' } = useParams<{
    block?: string;
  }>();
  const { search } = useLocation();
  const { posBlockNumber, blockNumber } = useMemo(() => qs.parse(search), [
    search,
  ]);

  return (
    <>
      <Helmet>
        <title>{t(translations.header.blocknumberCalc)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.blocknumberCalc.title)}</PageHeader>
      <ContentWrapper>
        <BlockNumberCalculator
          getBlockNumber={governanceContract.getBlockNumber}
          title="PoW"
          blockInterval={0.5}
          routeBlockNumber={(blockNumber as string) ?? routeBlockNumber}
          maxBlocknumber={100000000000}
        />
        <BlockNumberCalculator
          getBlockNumber={getPosBlockNumber}
          title="PoS"
          blockInterval={30}
          routeBlockNumber={posBlockNumber as string}
          maxBlocknumber={2000000000}
        />
      </ContentWrapper>
    </>
  );
}

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 40px;
  & > div {
    width: 50%;
  }
  ${media.s} {
    flex-direction: column;
    & > div {
      width: 100%;
    }
  }
`;
