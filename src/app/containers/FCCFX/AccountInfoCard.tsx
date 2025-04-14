import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Row, Col } from '@cfxjs/sirius-next-common/dist/components/Grid';
import Button from '@cfxjs/sirius-next-common/dist/components/Button';
import {
  StyledTitle1474798C,
  StyledTitle200F1327,
} from 'app/components/StyledComponent';
import { formatBalance } from 'utils';
import { ConnectButton } from 'app/components/ConnectWallet';
import { AccountInfoType, InfoItemType } from './Common';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import { usePortal } from 'utils/hooks/usePortal';
import { fcExchangeContract, fcExchangeInterestContract } from './Common';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { TXN_ACTION } from 'utils/constants';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { InfoIconWithTooltip } from '@cfxjs/sirius-next-common/dist/components/InfoIconWithTooltip';
import { MyNFTCard } from './MyNFTCard';

// token decimal
const MAX_DECIMALS = 18;
const MODULE = 10 ** MAX_DECIMALS;

export function AccountInfoCard({ info }: { info: AccountInfoType }) {
  const [globalData, setGlobalData] = useGlobalData();
  const { t } = useTranslation();
  const { addRecord } = useTxnHistory();
  const { accounts } = usePortal();
  const [loading, setLoading] = useState(false);
  const [txnStatusModal, setTxnStatusModal] = useState({
    show: false,
    hash: '',
    status: '',
    errorMessage: '',
  });

  const hasPendingProfitLegacy = !info.pendingProfitLegacy.eq(0);
  const hasUnsignedFC = info.fcUnsigned.gt(0);
  const hasInterests =
    info.pendingProfit.gt(0) || info.pendingProfitLegacy.gt(0);

  const data: Array<InfoItemType> = [
    {
      key: 'fcSigned',
      title: t(translations.fccfx.titleFCStaked),
      value: info.fcSigned,
      span: 9,
      tip: (
        <InfoIconWithTooltip
          info={t(translations.fccfx.tip.signed)}
        ></InfoIconWithTooltip>
      ),
    },
    {
      key: 'fcUnsigned',
      title: t(translations.fccfx.titleFCUnsigned),
      value: info.fcUnsigned,
      span: 7,
      tip: (
        <InfoIconWithTooltip
          info={t(translations.fccfx.tip.unsigned)}
        ></InfoIconWithTooltip>
      ),
    },
    {
      key: 'fcSignedHistory',
      title: t(translations.fccfx.titleFCStakedHistory),
      value: info.fcSignedHistory,
      span: 8,
    },
    {
      key: 'cfxWithdrawed',
      title: t(translations.fccfx.titleCFXWithdrawed),
      value: info.cfxWithdrawed,
      unit: 'CFX',
      span: 9,
    },
    {
      key: 'availableProfit',
      title: hasPendingProfitLegacy
        ? t(translations.fccfx.titleRemainingInterests)
        : t(translations.fccfx.titleAvailableProfit),
      value: !info.pendingProfitLegacy.eq(0)
        ? info.pendingProfitLegacy
        : info.pendingProfit,
      span: 7,
      unit: 'CFX',
    },
  ];

  const handleWithdrawProfit = async () => {
    setTxnStatusModal({
      ...txnStatusModal,
      show: true,
    });

    setLoading(true);

    try {
      let hash;

      if (hasPendingProfitLegacy) {
        hash = await fcExchangeContract
          .withdraw(SDK.Drip.fromCFX(0))
          .sendTransaction({
            from: accounts[0],
          });
      } else {
        hash = await fcExchangeInterestContract
          .registerOrWithdraw()
          .sendTransaction({
            from: accounts[0],
          });
      }

      setTxnStatusModal({
        ...txnStatusModal,
        show: true,
        hash: hash,
      });

      setLoading(false);

      const code = TXN_ACTION.fccfxWithdrawProfit;

      addRecord({
        hash,
        info: JSON.stringify({
          code: code,
          description: '',
          hash,
          value: formatBalance(
            data[4]?.value || 0,
            18,
            false,
            {
              withUnit: false,
            },
            '0.001',
          ),
        }),
      });

      return hash;
    } catch (e) {
      console.log('handleWithdraw error: ', e);

      setTxnStatusModal({
        ...txnStatusModal,
        show: true,
        status: 'error',
        errorMessage: e.code ? `${e.code} - ${e.message}` : e.message,
      });

      setLoading(false);

      return e;
    }
  };

  const handleTxnStatusClose = () => {
    // reset tx status modal state
    setTxnStatusModal({
      show: false,
      status: '',
      hash: '',
      errorMessage: '',
    });
  };

  const handleTxSuccess = () => {
    // force to refresh project
    setGlobalData({
      ...globalData,
      random: Math.random(),
    });
  };

  return (
    <StyledTotalInfoWrapper>
      <StyledTitle200F1327>
        {t(translations.fccfx.titleAccountInfo)}
      </StyledTitle200F1327>
      <Row>
        <Col span="5">
          <MyNFTCard id={info.NFTId} isActive={info.isNFTActive} />
        </Col>
        <Col span="19">
          <Row>
            {data.map((c, index) => (
              <Col
                span={c.span}
                className={`fccfx-accountInfo-item fccfx-accountInfo-item-${index} ${
                  index === 1 && c.value.div(MODULE).gte('0.001')
                    ? 'warning'
                    : ''
                }`}
                key={index}
              >
                <StyledTitle1474798C className={`fccfx-accountInfo-title`}>
                  <span>{c.title}</span> {c.tip}
                </StyledTitle1474798C>
                <span className="fccfx-accountInfo-number">
                  {accounts.length
                    ? formatBalance(
                        c.value,
                        18,
                        false,
                        {
                          withUnit: false,
                        },
                        '0.001',
                      )
                    : '--'}{' '}
                  {c.unit}
                </span>
              </Col>
            ))}
            <Col span={8}>
              <ConnectButton>
                <Button
                  color="primary"
                  type="action"
                  className="fccfx-accountInfo-withdrawButton"
                  onClick={handleWithdrawProfit}
                  loading={loading}
                  disabled={!(hasUnsignedFC || hasInterests)}
                >
                  {t(translations.fccfx.buttonWithdrawInterest)}
                </Button>
              </ConnectButton>
            </Col>
          </Row>
        </Col>
      </Row>

      <TxnStatusModal
        show={txnStatusModal.show}
        status={txnStatusModal.status}
        onClose={handleTxnStatusClose}
        hash={txnStatusModal.hash}
        onTxSuccess={handleTxSuccess}
        errorMessage={txnStatusModal.errorMessage}
      />
    </StyledTotalInfoWrapper>
  );
}

const StyledTotalInfoWrapper = styled.div`
  .fccfx-accountInfo-title {
    & > span {
      margin-right: 5px;
    }
  }
  .fccfx-accountInfo-item {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .fccfx-accountInfo-item-0,
  .fccfx-accountInfo-item-1,
  .fccfx-accountInfo-item-2 {
    margin: 13px 0;
  }

  .fccfx-accountInfo-number {
    font-size: 16px;
    color: #282d30;
    line-height: 24px;
  }

  .fccfx-accountInfo-item-1.warning {
    .fccfx-accountInfo-number {
      color: #fa953c;
    }
  }

  .fccfx-accountInfo-item-4 {
    .fccfx-accountInfo-number {
      color: #1e3de4;
      font-weight: bold;
    }
  }

  .fccfx-accountInfo-withdrawButton {
    min-width: 124px;
    margin-top: 12px;
  }
`;
