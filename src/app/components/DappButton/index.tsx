import React, { useState } from 'react';
import { Button } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { usePortal } from 'utils/hooks/usePortal';
import styled from 'styled-components';
import { translations } from 'locales/i18n';
import imgSuccess from 'images/success.png';
import { ButtonProps } from '@cfxjs/react-ui/dist/button/button';
import { formatAddress } from 'utils';
import { TXN_ACTION } from 'utils/constants';
import { AddressContainer } from 'sirius-next/packages/common/dist/components/AddressContainer';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import { ConnectButton, useCheckHook } from '../../components/ConnectWallet';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';

interface DappButtonProps {
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
  htmlType?: React.ButtonHTMLAttributes<any>['type'];
  txnAction?: number | string;
}
type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof ButtonProps>;
export declare type Props = DappButtonProps & NativeAttrs;
const DappButton = ({
  btnClassName,
  btnDisabled,
  contractAddress,
  data,
  connectText,
  submitText,
  successCallback,
  failCallback,
  closeModalCallback,
  txnAction = TXN_ACTION.default,
  ...props
}: Props) => {
  const { addRecord } = useTxnHistory();
  const { t } = useTranslation();
  // cip-37 compatible
  const { accounts, sendTransaction } = usePortal();
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const { isValid } = useCheckHook();

  let text = connectText
    ? connectText
    : t(translations.general.connnectWalletSubmit);

  if (accounts[0]) {
    text = submitText ? submitText : t(translations.general.submit);
  }

  const onClickHandler = () => {
    if (!btnDisabled) {
      const txParams = {
        from: formatAddress(accounts[0]),
        // txn may create contract, need params 'to' to be undefined
        to: contractAddress ? formatAddress(contractAddress) : undefined,
        data,
      };
      //loading
      setModalShow(true);

      sendTransaction(txParams)
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
          setTxHash(txHash);
        })
        .catch(error => {
          console.log('DappButton react error: ', error);
          setErrorMessage(
            error.code ? `${error.code} - ${error.message}` : error.message,
          );
          //rejected alert
          failCallback && failCallback(error.message);
          setModalType('error');
        })
        .finally(() => {
          trackEvent({
            category: ScanEvent.wallet.category,
            action:
              ScanEvent.wallet.action.txnAction[txnAction] ||
              ScanEvent.wallet.action.txnActionUnknown,
          });
        });
    }
  };
  const closeHandler = () => {
    // reset modal state
    setModalShow(false);
    setTxHash('');
    setModalType('');
    setErrorMessage('');
    closeModalCallback && closeModalCallback();
  };

  const btnComp = (
    <BtnContainer>
      <ConnectButton>
        <Button
          {...props}
          variant="solid"
          color="primary"
          // invalid connect wallet button will ignore disabled status, guide user to connect wallet or fixed connect error
          className={`${btnClassName} btnInnerClass ${
            isValid && btnDisabled ? 'disabled' : null
          }`}
          disabled={isValid && btnDisabled}
          onClick={onClickHandler}
        >
          {text}
        </Button>
      </ConnectButton>
      {isValid && (
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
      {btnComp}
      <TxnStatusModal
        show={modalShow}
        status={modalType}
        onClose={closeHandler}
        hash={txHash}
        errorMessage={errorMessage}
      />
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
    font-size: 14px;
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
  btnClassName: '',
  btnDisabled: false,
  // btnText: '',
  connectText: '',
  submitText: '',
};

export default DappButton;
