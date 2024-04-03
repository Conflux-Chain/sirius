import React, { useEffect, useState } from 'react';
import { Modal } from '@cfxjs/antd';
import styled from 'styled-components';
import Loading from 'app/components/Loading';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { getEllipsStr } from 'sirius-next/packages/common/dist/utils';
import { getTransactionLoop } from 'sirius-next/packages/common/dist/utils/hooks/useGetTxnStatus';
import lodash from 'lodash';

import imgSuccessBig from 'images/success_big.png';
import imgRejected from 'images/rejected.png';

interface StatusModalProps {
  status: string;
  onClose?: () => void;
  show: boolean;
  loadingText?: React.ReactNode;
  successText?: React.ReactNode;
  errorText?: React.ReactNode;
}
interface TxnStatusModalProps {
  status?: string;
  onClose?: () => void;
  hash: string;
  show: boolean;
  onTxSuccess?: (receipt: any) => void;
  onTxError?: (receipt: any) => void;
  loadingText?: React.ReactNode;
  successText?: React.ReactNode;
  errorText?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

export const StatusModal = ({
  status,
  onClose,
  show,
  loadingText,
  successText,
  errorText,
}: StatusModalProps) => {
  const { t } = useTranslation();

  let body: React.ReactNode = null;

  if (status === 'loading') {
    body = (
      <>
        <Loading></Loading>
        <div className="loadingText">{t(translations.general.loading)}</div>
        <div className="statusText">{loadingText}</div>
      </>
    );
  } else if (status === 'success') {
    body = (
      <>
        <img src={imgSuccessBig} alt="success" className="statusImg" />
        <div className="statusText">{successText}</div>
      </>
    );
  } else if (status === 'error') {
    body = (
      <>
        <img src={imgRejected} alt="rejected" className="statusImg" />
        <div className="statusText">{errorText}</div>
      </>
    );
  }

  return (
    <Modal
      closable
      visible={show}
      onCancel={onClose}
      footer={null}
      width="400px"
      maskClosable={false}
      centered
    >
      <StyledStatusModalWrapper>{body}</StyledStatusModalWrapper>
    </Modal>
  );
};
StatusModal.defaultProps = {
  status: 'loading',
  onClose: () => {},
  show: false,
  loadingText: 'loading',
  successText: 'success',
  errorText: 'error',
  errorMessage: '',
};

// compatible with outer status and inner tx status, if no outer status, then will loop tx status
export const TxnStatusModal = ({
  status: oStatus,
  onClose,
  hash = '',
  show = false,
  onTxSuccess,
  onTxError,
  errorMessage,
}: TxnStatusModalProps) => {
  const { t } = useTranslation();
  const [iStatus, setIStatus] = useState('');

  useEffect(() => {
    if (show && !oStatus && hash) {
      let timeout;
      getTransactionLoop(hash, {
        callback(receipt) {
          const status = receipt?.status;
          if (!lodash.isNil(status)) {
            if (status === 0) {
              setIStatus('success');
              timeout = setTimeout(() => {
                onTxSuccess && onTxSuccess(receipt);
              }, 1000);
            } else {
              setIStatus('error');
              timeout = setTimeout(() => {
                onTxError && onTxError(receipt);
              }, 1000);
            }
          }
        },
      });
      return () => {
        clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, show, oStatus]);

  useEffect(() => {
    if (show) {
      setIStatus('loading');
    } else {
      setIStatus('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const status = oStatus || iStatus;

  const loadingText = (
    <StyledTxnStatusModalWrapper>
      {t(translations.general.waitForConfirm)}
    </StyledTxnStatusModalWrapper>
  );
  const successText = (
    <StyledTxnStatusModalWrapper>
      <div className="txContainer">
        <span className="label">{t(translations.sponsor.txHash)}: </span>
        <a
          href={`/transaction/${hash}`}
          target="_blank"
          className="content"
          rel="noopener noreferrer"
        >
          {getEllipsStr(hash, 8, 0)}
        </a>
      </div>
    </StyledTxnStatusModalWrapper>
  );
  const errorText = (
    <StyledTxnStatusModalWrapper>
      <div className="submitted">{t(translations.general.txRejected)}</div>
      <div className="error-message">{errorMessage}</div>
    </StyledTxnStatusModalWrapper>
  );

  return (
    <StatusModal
      status={status}
      onClose={onClose}
      show={show}
      loadingText={loadingText}
      successText={successText}
      errorText={errorText}
    />
  );
};
TxnStatusModal.defaultProps = {
  hash: '',
  show: false,
  status: '',
};

const StyledStatusModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.1429rem;

  .loadingText {
    color: #2f3b3f;
    font-size: 1.1429rem;
    font-weight: 500;
    margin-top: 0.7857rem;
  }

  .statusText {
    margin-top: 0.8571rem;
    color: #adb2bf;
    font-size: 1rem;
  }

  .statusImg {
    width: 4rem;
  }
`;

const StyledTxnStatusModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .error-message {
    max-height: 11.4286rem;
    overflow: auto;
    padding: 0.7143rem;
    margin-top: 0.7143rem;
    background-color: var(--theme-color-gray0);
  }

  .submitted {
    margin-top: 0.9286rem;
    font-size: 1rem;
    color: #282d30;
  }
  .txContainer {
    margin-top: 0.8571rem;
  }
  .label {
    color: #a4a8b6;
    line-height: 1.2857rem;
    font-size: 1rem;
  }
  .content {
    color: #1e3de4;
  }
`;
