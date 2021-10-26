import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/constants';
import BigNumber from 'bignumber.js';
import { usePortal } from 'utils/hooks/usePortal';
import clsx from 'clsx';
import { Row, Col, Spin } from '@cfxjs/antd';
import { StyledLink } from 'app/components/StyledComponent';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Notice } from './Notice';
import { InfoCard } from './InfoCard';
import { StakeAndSignCard } from './StakeAndSignCard';
import { WithdrawCFXCard } from './WithdrawCFXCard';
import {
  fcExchangeInterestContract,
  AccountInfoType,
  TotalInfoType,
  Tip,
} from './Common';

export function FCCFX() {
  const { accounts } = usePortal();
  const { t, i18n } = useTranslation();
  const iszh = i18n.language.includes('zh');
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(() => {
    try {
      return !JSON.parse(
        localStorage.getItem(LOCALSTORAGE_KEYS_MAP.fccfxNotice) as string,
      );
    } catch (e) {
      return true;
    }
  });

  const [totalInfo, setTotalInfo] = useState<TotalInfoType>({
    balanceOfCfx: new BigNumber(0),
    fcMiningAPY: new BigNumber(0),
    fcSigned: new BigNumber(0),
    fcSignedHistory: new BigNumber(0),
  });

  const [accountInfo, setAccountInfo] = useState<AccountInfoType>({
    fcSigned: new BigNumber(0),
    fcUnsigned: new BigNumber(0),
    fcSignedHistory: new BigNumber(0),
    cfxWithdrawed: new BigNumber(0),
    isNFTActive: false,
    NFTId: '0',
    pendingProfit: new BigNumber(0),
    pendingProfitLegacy: new BigNumber(0),
    availableFc: new BigNumber(0),
    cfxUnsigned: new BigNumber(0),
    availableToWithdraw: new BigNumber(0),
  });

  const hasPendingProfitLegacy =
    accounts.length && !accountInfo.pendingProfitLegacy.eq(0);
  const remarkLink = iszh
    ? 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/articles/4408240776347-FC-%E5%85%91%E6%8D%A2-CFX-%E8%A7%84%E5%88%99%E8%AF%B4%E6%98%8E'
    : 'https://confluxscansupportcenter.zendesk.com/hc/en-us/articles/4408240776347-FC-to-CFX-None-reversible-Rules';

  useEffect(() => {
    if (accounts.length) {
      setLoading(true);

      fcExchangeInterestContract
        .summary(accounts[0])
        .then(
          data => {
            const [contractSummary, accountSummary] = data;

            const unsignedFC = new BigNumber(
              accountSummary.stakeInfo.amount,
            ).minus(accountSummary.accountInfo.amount);

            const unsignedCFX = new BigNumber(
              accountSummary.accountInfo.amount,
            ).minus(accountSummary.stakeInfo.amount);

            setAccountInfo({
              ...accountInfo,
              fcSigned: new BigNumber(accountSummary.accountInfo.amount),
              fcUnsigned: unsignedFC.lt(0) ? new BigNumber(0) : unsignedFC,
              cfxWithdrawed: new BigNumber(
                accountSummary.accountInfo.accProfit,
              ),
              fcSignedHistory: new BigNumber(
                accountSummary.stakeInfo.accumulateAmount,
              ),
              isNFTActive: accountSummary.stakeInfo.nftGranted,
              NFTId: accountSummary.stakeInfo.grantedTokenId.toString(),
              pendingProfit: new BigNumber(accountSummary.pendingProfit),
              pendingProfitLegacy: new BigNumber(
                accountSummary.pendingProfitLegacy,
              ),
              availableFc: new BigNumber(accountSummary.fcBalance),
              cfxUnsigned: unsignedCFX.gt(0) ? unsignedCFX : new BigNumber(0),
              availableToWithdraw: new BigNumber(
                accountSummary.stakeInfo.amount,
              ),
            });

            setTotalInfo({
              ...totalInfo,
              balanceOfCfx: new BigNumber(contractSummary.stakedCfx),
              fcMiningAPY: new BigNumber(contractSummary.apy),
              fcSigned: new BigNumber(contractSummary.stakedFc),
              fcSignedHistory: new BigNumber(contractSummary.fcBalance),
            });
          },
          e => console.log(e),
        )
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  const handleNoticeClose = () => {
    setIsModalVisible(false);
    localStorage.setItem(LOCALSTORAGE_KEYS_MAP.fccfxNotice, 'true');
  };

  return (
    <StyledFCCFXWrapper>
      <Helmet>
        <title>{t(translations.fccfx.title)}</title>
        <meta name="description" content={t(translations.fccfx.title)} />
      </Helmet>
      <PageHeader>{t(translations.fccfx.title)}</PageHeader>
      <div className="fccfx-body">
        <StyledLink
          className="fccfx-rule-link"
          href={remarkLink}
          target="_blank"
        >
          {t(translations.fccfx.rulesLink)}
        </StyledLink>
        <Spin spinning={loading}>
          <InfoCard totalInfo={totalInfo} accountInfo={accountInfo}></InfoCard>
        </Spin>
        <div
          className={clsx('fccfx-mask', {
            disabled: hasPendingProfitLegacy,
          })}
        >
          <Row gutter={24}>
            <Col flex="auto">
              <Row gutter={24}>
                <Col span={12}>
                  <Spin spinning={loading}>
                    <StakeAndSignCard info={accountInfo} />
                  </Spin>
                </Col>
                <Col span={12}>
                  <Spin spinning={loading}>
                    <WithdrawCFXCard info={accountInfo} />
                  </Spin>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Tip hidden={!hasPendingProfitLegacy} size={14}>
          {t(translations.fccfx.tip.legacyProfit)}
        </Tip>
      </div>

      <Notice show={isModalVisible} onClose={handleNoticeClose} />
    </StyledFCCFXWrapper>
  );
}

const StyledFCCFXWrapper = styled.div`
  padding-bottom: 20px;
  overflow: hidden;

  .fccfx-mask.disabled {
    filter: blur(5px);
    cursor: inherit;
    pointer-events: none;
    margin-bottom: 20px;
  }

  .card.sirius-card.fccfx-card {
    padding: 32px 24px;
  }

  .fccfx-body {
    position: relative;
  }

  .fccfx-rule-link {
    position: absolute;
    right: 0;
    top: -40px;
  }

  .fccfx-card-container-1 {
    padding-bottom: 32px;
  }
`;
