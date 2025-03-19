import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { ActionField } from './ActionField';
import {
  CardTip,
  TitleTip,
  fcExchangeInterestContract,
  fcContract,
  AccountInfoType,
} from './Common';
import { usePortal } from 'utils/hooks/usePortal';
import { TXN_ACTION } from 'utils/constants';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { StyledTitle200F1327 } from 'app/components/StyledComponent';
import { formatBalance } from 'utils';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { confirm } from '@cfxjs/sirius-next-common/dist/components/Modal';
import ENV_CONFIG from 'env';

export const StakeAndSignCard = ({ info }: { info: AccountInfoType }) => {
  const [globalData, setGlobalData] = useGlobalData();
  const { t } = useTranslation();
  const { accounts } = usePortal();
  const [stakedFC, setStakedFC] = useState('');
  const { addRecord } = useTxnHistory();
  const [txnStatusModal, setTxnStatusModal] = useState({
    show: false,
    hash: '',
    status: '',
    errorMessage: '',
  });

  const unsignedFC = formatBalance(
    info.fcUnsigned,
    18,
    false,
    {
      withUnit: false,
    },
    '0.001',
  );

  const exchangeHandler = async () => {
    setTxnStatusModal({
      ...txnStatusModal,
      show: true,
    });

    try {
      const value = SDK.Drip.fromCFX(stakedFC);
      const hash = await fcContract
        .send(
          ENV_CONFIG.ENV_FC_EXCHANGE_ADDRESS,
          value,
          SDK.format.hexAddress(accounts[0]),
        )
        .sendTransaction({
          from: accounts[0],
        });

      setTxnStatusModal({
        ...txnStatusModal,
        show: true,
        hash: hash,
      });

      const code = TXN_ACTION.fccfxStakeToEarnCFX;

      addRecord({
        hash,
        info: JSON.stringify({
          code: code,
          description: '',
          hash,
          value: stakedFC,
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

      return e;
    }
  };

  const handleStakeInputChange = value => {
    setStakedFC(value);
  };

  const handleStakeButtonClick = () => {
    confirm({
      children: t(translations.fccfx.tip.beforeExchangeInModal),
      okText: t(translations.fccfx.buttonOk),
      cancelText: t(translations.fccfx.buttonCancel),
      closable: true,
      onOk: exchangeHandler,
    });
  };

  const handleSignButtonClick = async () => {
    setTxnStatusModal({
      ...txnStatusModal,
      show: true,
    });

    try {
      const hash = await fcExchangeInterestContract
        .registerOrWithdraw()
        .sendTransaction({
          from: accounts[0],
        });

      setTxnStatusModal({
        ...txnStatusModal,
        show: true,
        hash: hash,
      });

      const code = TXN_ACTION.fccfxSignToEarnAPY;

      addRecord({
        hash,
        info: JSON.stringify({
          code: code,
          description: '',
          hash,
          value: unsignedFC,
        }),
      });

      return hash;
    } catch (e) {
      console.log('sign FC error: ', e);

      setTxnStatusModal({
        ...txnStatusModal,
        show: true,
        status: 'error',
        errorMessage: e.code ? `${e.code} - ${e.message}` : e.message,
      });

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
    <StyledStakeAndSignWrapper>
      <Card className="fccfx-card">
        <StyledTitle200F1327>
          {t(translations.fccfx.titleStakeAndSign)}

          <TitleTip tip={t(translations.fccfx.tip.exchangeTitle)} />
        </StyledTitle200F1327>

        <ActionField
          title={t(translations.fccfx.titleStakeFCToEarnCFX)}
          buttonText={t(translations.fccfx.buttonStake)}
          value={stakedFC}
          balance={info.availableFc}
          tokenType="fc"
          onInputChange={handleStakeInputChange}
          onButtonClick={handleStakeButtonClick}
          tip={t(translations.fccfx.availableBalance)}
          style={{ marginTop: '10px' }}
        />

        <ActionField
          title={t(translations.fccfx.titleSignToEarnAPY)}
          buttonText={t(translations.fccfx.buttonSign)}
          value={info.fcUnsigned.dividedBy(10 ** 18).toString()}
          tokenType="fc"
          onButtonClick={handleSignButtonClick}
          readonly
          showBalance={false}
          inactiveButtonDisabled
        />
      </Card>

      <CardTip
        tip={t(translations.fccfx.tip.unsignedFC, {
          value: unsignedFC,
        })}
        show={info.fcUnsigned.gt(0)}
      />

      <TxnStatusModal
        show={txnStatusModal.show}
        status={txnStatusModal.status}
        onClose={handleTxnStatusClose}
        hash={txnStatusModal.hash}
        onTxSuccess={handleTxSuccess}
        errorMessage={txnStatusModal.errorMessage}
      />
    </StyledStakeAndSignWrapper>
  );
};

const StyledStakeAndSignWrapper = styled.div``;
