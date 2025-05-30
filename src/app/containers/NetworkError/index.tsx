/**
 *
 * NetworkError
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { getNetwork, gotoNetwork } from '@cfxjs/sirius-next-common/dist/utils';
import { translations } from 'locales/i18n';
import imgNetworkError from 'images/changeNetwork.png';
import { useParams } from 'react-router-dom';
import { IS_CORESPACE, IS_TESTNET } from 'env';
import { useGlobalData } from 'utils/hooks/useGlobal';

interface RouteParams {
  network: string;
}

// only in testnet or mainnet environment will come to this page
export function NetworkError() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const [globalData] = useGlobalData();
  const { networks } = globalData;
  const {
    network = IS_CORESPACE && IS_TESTNET ? 'Hydra' : 'Core (Testnet)',
  } = useParams<RouteParams>();

  return (
    <PageWrapper>
      <LeftImage
        alt={t(translations.networkError.title)}
        src={imgNetworkError}
      />
      <RightWrap>
        <ErrorTitle>{t(translations.networkError.title)}</ErrorTitle>
        <ErrorLabel>
          {t(translations.networkError.label, { network })}
        </ErrorLabel>
        <GoTo
          href="#"
          onClick={e => {
            e.preventDefault();
            const networkId = IS_CORESPACE && IS_TESTNET ? 1029 : 1;
            const network = getNetwork(networks, networkId);
            gotoNetwork(network.url);
          }}
        >
          {t(translations.networkError.btn, { network })}
        </GoTo>
      </RightWrap>
    </PageWrapper>
  );
}

// wrapper
const PageWrapper = styled.div`
  display: flex;
  position: absolute;
  height: calc(100% - 8rem);
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  width: 100%;

  ${media.s} {
    height: calc(100% - 116px);
    width: calc(100% - 32px);
    align-items: inherit;
    align-content: center;
  }
`;

// img
const LeftImage = styled.img`
  margin-right: 7rem;
  margin-left: 1rem;
  max-width: 234px;

  ${media.s} {
    margin-right: 0;
    max-width: 80%;
  }
`;
const RightWrap = styled.div`
  display: flex;
  flex-direction: column;
  ${media.m} {
    padding: 1rem;
    align-items: center;
    text-align: center;
  }
`;

const ErrorTitle = styled.span`
  display: inline-block;
  font-size: 1.5714rem;
  line-height: 2rem;
  color: #424242;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ErrorLabel = styled.span`
  display: inline-block;
  color: #4b4b4b;
  opacity: 0.4;
  font-weight: 500;
  line-height: 1.2857rem;
  margin-bottom: 1rem;
  max-width: 540px;
`;

const GoTo = styled.a`
  min-width: 18rem;
  width: fit-content;
  padding: 0 2rem;
  height: 3.5714rem;
  background-color: #fff;
  border-radius: 2.8571rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #545454;
  font-size: 1.1429rem;
  margin-top: 2rem;
`;
