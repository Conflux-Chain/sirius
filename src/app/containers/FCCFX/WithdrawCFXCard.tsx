import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StyledCard as Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { ActionField } from './ActionField';
import {
  TitleTip,
  fcExchangeContract,
  fcExchangeInterestContract,
  AccountInfoType,
  Tip,
} from './Common';
import { formatBalance } from 'utils';
import { usePortal } from 'utils/hooks/usePortal';
import { TXN_ACTION } from 'utils/constants';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { StyledTitle200F1327 } from 'app/components/StyledComponent';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { confirm } from '@cfxjs/sirius-next-common/dist/components/Modal';

export const WithdrawCFXCard = ({ info }: { info: AccountInfoType }) => {
  const [globalData, setGlobalData] = useGlobalData();
  const { addRecord } = useTxnHistory();
  const { accounts } = usePortal();
  const { t } = useTranslation();
  const [withdrawCFX, setWithdrawCFX] = useState('');
  const [txnStatusModal, setTxnStatusModal] = useState({
    show: false,
    hash: '',
    status: '',
    errorMessage: '',
  });

  const unsignedCFX = formatBalance(
    info.cfxUnsigned,
    18,
    false,
    {
      withUnit: false,
    },
    '0.001',
  );

  const handleWithdrawInputChange = async value => {
    setWithdrawCFX(value);
  };

  const withdrawHandler = async () => {
    setTxnStatusModal({
      ...txnStatusModal,
      show: true,
    });

    try {
      const hash = await fcExchangeContract
        .withdraw(SDK.Drip.fromCFX(withdrawCFX))
        .sendTransaction({
          from: accounts[0],
        });

      setTxnStatusModal({
        ...txnStatusModal,
        show: true,
        hash: hash,
      });

      const code = TXN_ACTION.fccfxWithdrawCFX;

      addRecord({
        hash,
        info: JSON.stringify({
          code: code,
          description: '',
          hash,
          value: withdrawCFX,
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

  const handleWithdrawButtonClick = () => {
    confirm({
      children: t(translations.fccfx.tip.beforeWithdrawInModal),
      okText: t(translations.fccfx.buttonOk),
      cancelText: t(translations.fccfx.buttonCancel),
      closable: true,
      onOk: withdrawHandler,
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

      const code = TXN_ACTION.fccfxSignToSyncInterest;

      addRecord({
        hash,
        info: JSON.stringify({
          code: code,
          description: '',
          hash,
          value: unsignedCFX,
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
    <StyledWithdrawCFXWrapper>
      <Card className="fccfx-card">
        <div className="fccfx-withdraw-titleContainer">
          <StyledTitle200F1327>
            {t(translations.fccfx.titleWithdrawCFX)}

            <TitleTip tip={t(translations.fccfx.tip.withdrawTitle)} />
          </StyledTitle200F1327>
          <Tip style={{ marginLeft: '20px' }}>
            {t(translations.fccfx.tip.beforeWithdraw)}
          </Tip>
        </div>

        <ActionField
          title={t(translations.fccfx.titleWithdrawCapital)}
          buttonText={t(translations.fccfx.buttonWithdraw)}
          value={withdrawCFX}
          balance={info.availableToWithdraw}
          tokenType="cfx"
          onInputChange={handleWithdrawInputChange}
          onButtonClick={handleWithdrawButtonClick}
          tip={t(translations.fccfx.availableBalance)}
          style={{ marginTop: '10px' }}
        />

        <ActionField
          title={t(translations.fccfx.titleSignToSyncInterest)}
          buttonText={t(translations.fccfx.buttonAnnounce)}
          value={info.cfxUnsigned.dividedBy(10 ** 18).toString()}
          tokenType="cfx"
          onButtonClick={handleSignButtonClick}
          readonly
          showBalance={false}
          inactiveButtonDisabled
        />
      </Card>

      <TxnStatusModal
        show={txnStatusModal.show}
        status={txnStatusModal.status}
        onClose={handleTxnStatusClose}
        hash={txnStatusModal.hash}
        onTxSuccess={handleTxSuccess}
        errorMessage={txnStatusModal.errorMessage}
      />
    </StyledWithdrawCFXWrapper>
  );
};

const StyledWithdrawCFXWrapper = styled.div`
  .fccfx-withdraw-titleContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
