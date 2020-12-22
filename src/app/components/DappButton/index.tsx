import React, { useState } from 'react';
import { Button, Tooltip, Modal } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { useConfluxPortal } from '@cfxjs/react-hooks';
import styled from 'styled-components/macro';
import { translations } from '../../../locales/i18n';
import imgSuccess from 'images/success.png';
import imgSuccessBig from 'images/success_big.png';
import imgRejected from 'images/rejected.png';
import { getEllipsStr } from '../../../utils';
import Loading from '../../components/Loading';
interface DappButtonProps {
  hoverText?: string;
  btnClassName?: string;
  btnDisabled?: boolean;
  btnText?: string;
  data?: string;
  contractAddress: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof DappButtonProps>;
export declare type Props = DappButtonProps & NativeAttrs;
const DappButton = ({
  hoverText,
  btnClassName,
  btnDisabled,
  contractAddress,
  data,
}: Props) => {
  const { t } = useTranslation();
  const { portalInstalled, address, login, confluxJS } = useConfluxPortal();
  const [modalShown, setModalShown] = useState(false);
  const [modalContent, setModalContent] = useState();
  const [txHash, setTxHash] = useState('');
  let text = t(translations.general.connnectWalletSubmit);
  if (portalInstalled && address) {
    text = t(translations.general.submit);
  }
  const loadingModalContent = (
    <>
      <Loading></Loading>
      <div className="loadingText">{t(translations.general.loading)}</div>
      <div className="confirmText">
        {t(translations.general.waitForConfirm)}
      </div>
    </>
  );
  const successModalContent = (
    <>
      <img src={imgSuccessBig} alt="success" className="statusImg" />
      <div className="submitted">{t(translations.sponsor.submitted)}.</div>
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
  );

  const failureModalContent = (
    <>
      <img src={imgRejected} alt="rejected" className="statusImg" />
      <div className="submitted">{t(translations.general.txRejected)}</div>
    </>
  );

  const onClickHandler = () => {
    if (!portalInstalled) {
      useConfluxPortal.openHomePage();
    } else {
      if (address) {
        if (!btnDisabled) {
          const txParams = {
            from: address,
            to: contractAddress,
            data,
          };
          //loading
          setModalContent(loadingModalContent as any);
          setModalShown(true);
          confluxJS
            .sendTransaction(txParams)
            .then(txHash => {
              //success alert
              setTxHash(txHash);
              setModalContent(successModalContent as any);
            })
            .catch(error => {
              //rejected alert
              setModalContent(failureModalContent as any);
            });
        }
      } else {
        login();
      }
    }
  };
  const closeHandler = () => {
    setModalShown(false);
  };

  const btnComp = (
    <BtnContainer>
      <Button
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
      <img
        src={imgSuccess}
        alt="success"
        className={`successImg ${address ? 'shown' : 'hidden'}`}
      />
      <span className={`accountAddress ${address ? 'shown' : 'hidden'}`}>
        {getEllipsStr(address, 6, 4)}
      </span>
    </BtnContainer>
  );
  return (
    <>
      {hoverText ? (
        <Tooltip text={hoverText}>{btnComp}</Tooltip>
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
          {modalContent}
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
  btnText: '',
};

export default DappButton;
