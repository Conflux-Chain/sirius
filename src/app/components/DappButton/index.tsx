import React, { useState } from 'react';
import { Button, Tooltip, Modal } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { usePortal } from 'utils/hooks/usePortal';
import styled from 'styled-components/macro';
import { translations } from '../../../locales/i18n';
import imgSuccess from 'images/success.png';
import imgSuccessBig from 'images/success_big.png';
import imgRejected from 'images/rejected.png';
import { getEllipsStr } from '../../../utils';
import Loading from '../../components/Loading';
import { ButtonProps } from '@cfxjs/react-ui/dist/button/button';
import { formatAddress } from '../../../utils/cfx';
import { TxnAction } from '../../../utils/constants';
import { AddressContainer } from '../AddressContainer';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import { ConnectButton } from '../../components/ConnectWallet';
interface DappButtonProps {
  hoverText?: string;
  btnClassName?: string;
  btnDisabled?: boolean;
  // btnText?: string;
  data?: string;
  contractAddress: string;
  connectText?: string;
  submitText?: string;
  successCallback?: (hash: string) => void;
  failCallback?: (message: string) => void;
  closeModalCallback?: () => void;
  shownAddress?: boolean;
  htmlType?: React.ButtonHTMLAttributes<any>['type'];
  txnAction?: number | string;
}
type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof ButtonProps>;
export declare type Props = DappButtonProps & NativeAttrs;
const DappButton = ({
  hoverText,
  btnClassName,
  btnDisabled,
  contractAddress,
  data,
  connectText,
  submitText,
  successCallback,
  failCallback,
  closeModalCallback,
  shownAddress,
  txnAction = TxnAction.default,
  ...props
}: Props) => {
  const { addRecord } = useTxnHistory();
  const { t } = useTranslation();
  // TODO cip-37 portal multi version
  const { accounts, confluxJS } = usePortal();
  const [modalShown, setModalShown] = useState(false);
  const [modalType, setModalType] = useState('');
  const [txHash, setTxHash] = useState('');
  let text = connectText
    ? connectText
    : t(translations.general.connnectWalletSubmit);
  if (accounts[0]) {
    text = submitText ? submitText : t(translations.general.submit);
  }
  const onClickHandler = () => {
    if (accounts[0]) {
      if (!btnDisabled) {
        const txParams = {
          from: formatAddress(accounts[0]),
          to: formatAddress(contractAddress),
          data,
        };
        //loading
        setModalType('loading');
        setModalShown(true);

        confluxJS
          .sendTransaction(txParams)
          .then(txHash => {
            addRecord({
              hash: txHash,
              info: JSON.stringify({
                code: txnAction,
                description: t(
                  translations.connectWallet.notify.action[txnAction],
                ),
                hash: txHash,
              }),
            });

            //success alert
            successCallback && successCallback(txHash);
            setModalType('success');
            setTxHash(txHash);
          })
          .catch(error => {
            //rejected alert
            failCallback && failCallback(error.message);
            setModalType('fail');
          });
      }
    }
  };
  const closeHandler = () => {
    setModalShown(false);
    closeModalCallback && closeModalCallback();
  };

  const btnComp = (
    <BtnContainer>
      <ConnectButton>
        <Button
          {...props}
          variant="solid"
          color="primary"
          className={`${btnClassName} btnInnerClass ${
            btnDisabled ? 'disabled' : null
          }`}
          disabled={btnDisabled}
          onClick={onClickHandler}
        >
          {text}
        </Button>
      </ConnectButton>
      {shownAddress && (
        <>
          <img
            src={imgSuccess}
            alt="success"
            className={`successImg ${accounts[0] ? 'shown' : 'hidden'}`}
          />
          <span
            className={`accountAddress ${accounts[0] ? 'shown' : 'hidden'}`}
          >
            <AddressContainer value={accounts[0]} />
          </span>
        </>
      )}
    </BtnContainer>
  );
  return (
    <>
      {hoverText ? (
        <Tooltip text={hoverText} placement="top-start">
          {btnComp}
        </Tooltip>
      ) : (
        <>{btnComp}</>
      )}
      <Modal
        closable
        open={modalShown}
        onClose={closeHandler}
        wrapClassName="dappButtonModalContainer"
      >
        <Modal.Content className="contentContainer">
          {modalType === 'loading' && (
            <>
              <Loading></Loading>
              <div className="loadingText">
                {t(translations.general.loading)}
              </div>
              <div className="confirmText">
                {t(translations.general.waitForConfirm)}
              </div>
            </>
          )}
          {modalType === 'success' && (
            <>
              <img src={imgSuccessBig} alt="success" className="statusImg" />
              <div className="submitted">
                {t(translations.sponsor.submitted)}.
              </div>
              <div className="txContainer">
                <span className="label">{t(translations.sponsor.txHash)}:</span>
                <a
                  href={`/transaction/${txHash}`}
                  target="_blank"
                  className="content"
                  rel="noopener noreferrer"
                >
                  {getEllipsStr(txHash, 8, 0)}
                </a>
              </div>
            </>
          )}
          {modalType === 'fail' && (
            <>
              <img src={imgRejected} alt="rejected" className="statusImg" />
              <div className="submitted">
                {t(translations.general.txRejected)}
              </div>
            </>
          )}
        </Modal.Content>
      </Modal>
    </>
  );
};
const BtnContainer = styled.div`
  display: flex;
  align-items: center;
  .successImg {
    margin-left: 0.5714rem;
    width: 1.1429rem;
  }
  .shown {
    display: initial;
  }
  .hidden {
    display: none;
  }
  .accountAddress {
    margin-left: 0.5714rem;
    color: #97a3b4;
    font-size: 1.1429rem;
  }
  .btnInnerClass.btn {
    height: 30px;
    line-height: 30px;
    min-width: initial;
  }
  .disabled.btn {
    color: #fff;
  }
`;
DappButton.defaultProps = {
  hoverText: '',
  btnClassName: '',
  btnDisabled: false,
  // btnText: '',
  connectText: '',
  submitText: '',
  shownAddress: true,
};

export default DappButton;
