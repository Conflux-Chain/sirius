import React from 'react';
import { Modal } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import Loading from 'app/components/Loading';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { getEllipsStr } from 'utils';

import imgSuccessBig from 'images/success_big.png';
import imgRejected from 'images/rejected.png';

interface Props {
  status: string;
  onClose?: () => void;
  hash: string;
  show: boolean;
}

export const TxnStatusModal = ({ status, onClose, hash, show }: Props) => {
  const { t } = useTranslation();

  let body: React.ReactNode = null;

  if (status === 'loading') {
    body = (
      <>
        <Loading></Loading>
        <div className="loadingText">{t(translations.general.loading)}</div>
        <div className="confirmText">
          {t(translations.general.waitForConfirm)}
        </div>
      </>
    );
  } else if (status === 'success') {
    body = (
      <>
        <img src={imgSuccessBig} alt="success" className="statusImg" />
        <div className="submitted">{t(translations.sponsor.submitted)}.</div>
        <div className="txContainer">
          <span className="label">{t(translations.sponsor.txHash)}:</span>
          <a
            href={`/transaction/${hash}`}
            target="_blank"
            className="content"
            rel="noopener noreferrer"
          >
            {getEllipsStr(hash, 8, 0)}
          </a>
        </div>
      </>
    );
  } else if (status === 'error') {
    body = (
      <>
        <img src={imgRejected} alt="rejected" className="statusImg" />
        <div className="submitted">{t(translations.general.txRejected)}</div>
      </>
    );
  }

  return (
    <Modal closable open={show} onClose={onClose}>
      <StyledModalWrapper>
        <Modal.Content className="contentContainer">{body}</Modal.Content>
      </StyledModalWrapper>
    </Modal>
  );
};

TxnStatusModal.defaultProps = {
  hash: '',
  show: false,
  status: 'loading',
};

const StyledModalWrapper = styled.div`
  .contentContainer.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 2.1429rem;
  }
  .loadingText {
    color: #2f3b3f;
    font-size: 1.1429rem;
    font-weight: 500;
    margin-top: 0.7857rem;
  }
  .confirmText {
    margin-top: 0.8571rem;
    color: #adb2bf;
    font-size: 1rem;
  }
  .statusImg {
    width: 4rem;
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
