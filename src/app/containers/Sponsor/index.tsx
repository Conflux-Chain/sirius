import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components/macro';
import { media, useBreakpoint } from '../../../styles/media';
import { Input, Button, Modal } from '@cfxjs/react-ui';
import iconSuccess from './../../../images/success.png';
import iconSuccessBig from './../../../images/success_big.png';
import iconWarning from './../../../images/warning.png';
import { cfx, faucet, faucetAddress } from '../../../utils/cfx';
import { util as cfxUtil } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import SkelontonContainer from '../../components/SkeletonContainer';
import { isCfxAddress, getEllipsisAddress } from '../../../utils';
import { useConfluxPortal } from '@cfxjs/react-hooks';
import { useParams } from 'react-router-dom';
interface RouteParams {
  contractAddress: string;
}
export function Sponsor(props) {
  const { t } = useTranslation();
  const { contractAddress } = useParams<RouteParams>();
  const [storageSponsorAddress, setStorageSponsorAddress] = useState('');
  const [currentStorageFee, setCurrentStorageFee] = useState('--');
  const [providedStorageFee, setProvidedStorageFee] = useState('--');
  const [avialStorageFee, setAvialStorageFee] = useState('--');
  const [gasFeeAddress, setGasFeeAddress] = useState('');
  const [currentGasFee, setCurrentGasFee] = useState('--');
  const [providedGasFee, setProvidedGasFee] = useState('--');
  const [avialGasFee, setAvialGasFee] = useState('--');
  const [upperBound, setUpperBound] = useState('--');
  const [gasBound, setGasBound] = useState('--');
  const [storageBound, setStorageBound] = useState('--');
  const [loading, setLoading] = useState(false);
  const [canApply, setCanApply] = useState(false);
  const [applyText, setApplyText] = useState('');
  const [inputAddressVal, setInputAddressVal] = useState('');
  const [shownDialog, setShownDialog] = useState(false);
  const [errorMsgForApply, setErrorMsgForApply] = useState('');
  const [txHash, setTxHash] = useState('');
  const {
    portalInstalled,
    address,
    login,
    conflux,
    confluxJS,
  } = useConfluxPortal();
  console.log(conflux);
  console.log('portalInstalled', portalInstalled);
  console.log('portalAddress', address);
  const getSponsorInfo = useCallback(async address => {
    setLoading(true);
    const sponsorInfo = await cfx.provider.call('cfx_getSponsorInfo', address);
    console.log('sponsorInfo', sponsorInfo);
    await fetchIsAppliable(address);
    const faucetParams = await faucet.getFaucetParams();
    console.log('faucetParams', faucetParams);
    const amountAccumulated = await faucet.getAmountAccumulated(address);
    setLoading(false);
    if (sponsorInfo && faucetParams && amountAccumulated) {
      setStorageSponsorAddress(
        getEllipsisAddress(sponsorInfo.sponsorForCollateral, 12, 4),
      );
      setGasFeeAddress(getEllipsisAddress(sponsorInfo.sponsorForGas, 12, 4));
      setCurrentStorageFee(
        getDecimalFromDrip(sponsorInfo.sponsorBalanceForCollateral),
      );
      setCurrentGasFee(getDecimalFromDrip(sponsorInfo.sponsorBalanceForGas));
      setProvidedStorageFee(
        getDecimalFromDrip(amountAccumulated.collateral_amount_accumulated),
      );
      setUpperBound(
        cfxUtil.unit.fromDripToGDrip(parseInt(faucetParams.upper_bound, 16)),
      );
      setGasBound(getDecimalFromDrip(faucetParams.gas_bound));
      setStorageBound(getDecimalFromDrip(faucetParams.collateral_bound));
      setAvialStorageFee(
        getDecimalFromDrip(
          (
            Number(faucetParams.collateral_total_limit) -
            Number(amountAccumulated.collateral_amount_accumulated)
          ).toString(),
        ),
      );
      setProvidedGasFee(
        getDecimalFromDrip(amountAccumulated.gas_amount_accumulated),
      );
      setAvialGasFee(
        getDecimalFromDrip(
          (
            Number(faucetParams.gas_total_limit) -
            Number(amountAccumulated.gas_amount_accumulated)
          ).toString(),
        ),
      );
    }
  });
  const addressInputChanger = e => {
    setInputAddressVal(e.target.value);
  };
  const gasCosumeForTest = async address => {
    const res = await faucet.gasCosumeForTest(
      '0xe2e4e3d32ee07f9de5541530ebf6f69081568ee98fad807971396e31e7334781',
      address,
      1000,
      0.001,
    );
    console.log('==res==', res);
  };
  // gasCosumeForTest('0x8421c48c2b7780b9a8c8995898a1e330aa88cdcc')
  const searchClick = async () => {
    if (!isCfxAddress(inputAddressVal)) {
      return;
    }
    getSponsorInfo(inputAddressVal);
  };
  const fetchIsAppliable = async address => {
    const { flag, message } = await faucet.isAppliable(address);
    console.log('flag', flag);
    console.log('message', message);
    if (!flag) {
      //can not apply sponsor this contract
      switch (message) {
        case 'ERROR_GAS_SPONSORED_FUND_UNUSED':
        case 'ERROR_GAS_OVER_GAS_TOTAL_LIMIT':
        case 'ERROR_COLLATERAL_SPONSORED_FUND_UNUSED':
        case 'ERROR_COLLATERAL_OVER_COLLATERAL_TOTAL_LIMIT':
          setErrorMsgForApply(t(translations.sponsor.errReachToMax));
          break;
        case 'ERROR_GAS_FAUCET_OUT_OF_MONEY':
        case 'ERROR_COLLATERAL_FAUCET_OUT_OF_MONEY':
          setErrorMsgForApply(t(translations.sponsor.errInsufficientFee));
          break;
        case 'ERROR_GAS_CANNOT_REPLACE_THIRD_PARTY_SPONSOR':
          setErrorMsgForApply(t(translations.sponsor.errReplaceThird));
          break;
        default:
          setErrorMsgForApply('');
          break;
      }
      if (!portalInstalled) {
        setCanApply(true);
      } else {
        setCanApply(false);
      }
    } else {
      setCanApply(true);
    }
    return { flag, message };
  };

  const applyToTx = async address => {
    const { flag } = await fetchIsAppliable(address);
    console.log('applyAddress', address);
    if (flag) {
      const { data } = await faucet.apply(address);
      console.log('data', data);
      const transactionParameters = {
        data,
        to: faucetAddress,
      };
      console.log(transactionParameters);
      console.log('address', address);
      const txHash = await confluxJS.sendTransaction({
        from: address,
        to: faucetAddress,
        data,
      });
      console.log('txHash', txHash);
      return txHash;
    }
  };
  const applyClick = async () => {
    if (!portalInstalled) {
      useConfluxPortal.openHomePage();
    } else {
      if (address) {
        //Portal has already installed and the portal has already got the account
        if (isCfxAddress(inputAddressVal)) {
          const txHash = await applyToTx(inputAddressVal);
          setTxHash(txHash);
        }
      } else {
        login();
      }
    }
  };
  const closeDialog = () => {
    setShownDialog(false);
  };

  const getDecimalFromDrip = (dripStr: string) => {
    if (dripStr) {
      return cfxUtil.unit.fromDripToCFX(parseInt(dripStr, 16));
    }
    return '';
  };

  useEffect(() => {
    if (portalInstalled) {
      setApplyText(t(translations.general.apply));
    } else {
      setCanApply(true);
      setApplyText(t(translations.sponsor.connectToApply));
    }
  }, [portalInstalled, t]);

  useEffect(() => {
    if (contractAddress) {
      setInputAddressVal(contractAddress);
      getSponsorInfo(contractAddress);
    }
  }, [contractAddress, getSponsorInfo]);

  return (
    <>
      <Helmet>
        <title>{t(translations.metadata.title)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <Wrapper>
        <Header>{t(translations.sponsor.title)}</Header>
        <SearchContainer>
          <Input
            className="inputComp"
            onChange={addressInputChanger}
            value={inputAddressVal}
          ></Input>
          <Button
            variant="solid"
            color="primary"
            className="searchBtn"
            onClick={searchClick}
          >
            {t(translations.general.search)}
          </Button>
        </SearchContainer>
        <BlockContainer>
          <div className="innerContainer">
            <div className="sponsorAddress">
              <span className="label">
                {t(translations.sponsor.storageSponsor)}
              </span>
              <SkelontonContainer shown={loading}>
                <span className="address">{storageSponsorAddress}</span>
              </SkelontonContainer>
            </div>
            <div className="currentLabel">
              {t(translations.sponsor.currentAvialStorageFee)}
            </div>
            <div className="currentFeeContainer">
              <SkelontonContainer shown={loading}>
                <span className="fee">{currentStorageFee}</span>
                <span className="unit">CFX</span>
              </SkelontonContainer>
            </div>
            <div className="feeContainer storage">
              <div className="line"></div>
              <div className="item">
                <div className="label">
                  {t(translations.sponsor.providedStorage)}
                </div>
                <div className="innterItem">
                  <SkelontonContainer shown={loading}>
                    <span>{providedStorageFee}</span>
                    <span className="unit">CFX</span>
                  </SkelontonContainer>
                </div>
              </div>
              <div className="item">
                <div className="label">
                  {t(translations.sponsor.availStorage)}
                </div>
                <div className="innterItem">
                  <SkelontonContainer shown={loading}>
                    <span className="fee">{avialStorageFee}</span>
                    <span className="unit">CFX</span>
                    <span className="secondFee">{storageBound}</span>
                    <span className="secondUnit">CFX/application</span>
                  </SkelontonContainer>
                </div>
              </div>
            </div>
          </div>
          <div className="innerContainer">
            <div className="sponsorAddress">
              <span className="label">
                {t(translations.sponsor.gasFeeSponsor)}
              </span>
              <SkelontonContainer shown={loading}>
                <span className="address">{gasFeeAddress}</span>
              </SkelontonContainer>
            </div>
            <div className="currentLabel">
              {t(translations.sponsor.currentAvialGasFee)}
            </div>
            <div className="currentFeeContainer">
              <SkelontonContainer shown={loading}>
                <span className="fee">{currentGasFee}</span>
                <span className="unit">CFX</span>
              </SkelontonContainer>
            </div>
            <div className="upperBoundContainer">
              <SkelontonContainer shown={loading}>
                <span className="label">
                  {t(translations.sponsor.upperBound)}:&nbsp;
                </span>
                <span className="fee">{upperBound}</span>&nbsp;
                <span className="unit">Gdrip/tx</span>
              </SkelontonContainer>
            </div>
            <div className="feeContainer gas">
              <div className="line"></div>
              <div className="item">
                <div className="label">
                  {t(translations.sponsor.providedGas)}
                </div>
                <div className="innterItem">
                  <SkelontonContainer shown={loading}>
                    <span>{providedGasFee}</span>
                    <span className="unit">CFX</span>
                  </SkelontonContainer>
                </div>
              </div>
              <div className="item">
                <div className="label">{t(translations.sponsor.availGas)}</div>
                <div className="innterItem">
                  <SkelontonContainer shown={loading}>
                    <span className="fee">{avialGasFee}</span>
                    <span className="unit">CFX</span>
                    <span className="secondFee">{gasBound}</span>
                    <span className="secondUnit">CFX/application</span>
                  </SkelontonContainer>
                </div>
              </div>
            </div>
          </div>
        </BlockContainer>
        <ApplyContainer>
          <Button
            variant="solid"
            color="primary"
            className="applyBtn"
            disabled={!canApply}
            onClick={applyClick}
          >
            {applyText}
          </Button>
          <img
            src={iconSuccess}
            alt="success"
            className={`successImg ${address ? 'shown' : 'hidden'}`}
          />
          <span className={`accountAddress ${address ? 'shown' : 'hidden'}`}>
            {getEllipsisAddress(address, 6, 4)}
          </span>
        </ApplyContainer>
        <ErrorMsgContainer className={`${errorMsgForApply ? '' : 'hidden'}`}>
          <img src={iconWarning} alt="warning" className="icon" />
          <span className="text">{errorMsgForApply}</span>
        </ErrorMsgContainer>
        <NoticeContainer>
          <div className="title">{t(translations.sponsor.notice)}:</div>
          <div className="content">
            <div>1. {t(translations.sponsor.noticeFirst)}</div>
            <div>2. {t(translations.sponsor.noticeSecond)}</div>
            <div>
              3. {t(translations.sponsor.noticeThirdOne)} &nbsp;
              <a href="https://portal.conflux-chain.org/" target="_blank">
                https://portal.conflux-chain.org/
              </a>
              &nbsp; {t(translations.sponsor.noticeThirdTwo)}.
            </div>
          </div>
        </NoticeContainer>
        <Modal
          closable
          open={shownDialog}
          onClose={closeDialog}
          wrapClassName="transactionModalContainer"
        >
          <Modal.Content>
            <div className="contentContainer">
              <img src={iconSuccessBig} alt="success" className="successImg" />
              <div className="submitted">
                {t(translations.sponsor.submitted)}.
              </div>
              <div>
                <span className="label">{t(translations.sponsor.txHash)}:</span>
                <a
                  href={`https://testnet.confluxscan.io/transactionsdetail/${txHash}`}
                  target="_blank"
                  className="content"
                >
                  {getEllipsisAddress(txHash, 12, 0)}
                </a>
              </div>
            </div>
          </Modal.Content>
        </Modal>
      </Wrapper>
    </>
  );
}
const Wrapper = styled.div`
  padding-bottom: 50px;
  .modalContainer {
    display: flex;
    justify-content: center;
  }
  .btn.searchBtn {
    height: 30px;
    line-height: 30px;
    width: 84px;
    min-width: initial;
  }
  .btn.applyBtn {
    height: 30px;
    line-height: 30px;
  }
  .shown {
    display: initial;
  }
  .hidden {
    display: none;
  }
`;
const Header = styled.div`
  color: #0f1327;
  font-weight: bold;
  padding-top: 32px;
  margin-bottom: 24px;
  font-size: 24px;
  ${media.s} {
    padding-top: 1rem;
    margin-bottom: 1.6667rem;
    font-size: 1.5rem;
  }
`;
const SearchContainer = styled.div`
  background: #ffffff;
  box-shadow: 12px 8px 24px -12px rgba(20, 27, 50, 0.12);
  border-radius: 5px;
  padding: 8px 16px;
  display: inline-block;
  .input-container.inputComp {
    width: 488px;
    height: 1.5714rem;
  }
  .inputComp {
    .input-wrapper {
      margin: 0;
      height: 1.5714rem;
      line-height: initial;
      border: none;
      color: #97a3b4;
    }
  }
`;
const BlockContainer = styled.div`
  display: flex;
  background: #f5f6fa;
  margin-top: 24px;
  .innerContainer {
    flex: 1;
    box-sizing: border-box;
    flex-basis: 368px;
    flex-grow: 0;
    flex-shrink: 0;
    box-sizing: content-box;
    background: #ffffff;
    box-shadow: 12px 8px 24px -12px rgba(20, 27, 50, 0.12);
    border-radius: 5px;
    padding: 24px 16px 16px 16px;
    .sponsorAddress {
      display: flex;
      align-items: center;
      .label {
        font-size: 12px;
        font-weight: 500;
        color: #97a3b4;
      }
      .address {
        font-size: 10px;
        font-weight: normal;
        color: #0054fe;
        margin-left: 8px;
      }
    }
    .currentLabel {
      margin-top: 10px;
      font-size: 20px;
      font-weight: 500;
      color: #0f1327;
    }
    .currentFeeContainer {
      margin-top: 8px;
      .fee {
        font-weight: bold;
        color: #0054fe;
        font-size: 24px;
        line-height: 24px;
      }
      .unit {
        margin-left: 4px;
        font-weight: 500;
        color: #74798c;
        font-size: 12px;
      }
    }
    .upperBoundContainer {
      margin-top: 12px;
      color: #97a3b4;
      font-size: 10px;
    }
    .feeContainer {
      margin-top: 27px;
      .line {
        height: 1px;
        background-color: #f1f1f1;
      }
      .item {
        margin-top: 15px;
        .label {
          font-size: 10px;
          font-weight: 500;
          color: #97a3b4;
        }
        .innterItem {
          font-size: 12px;
          color: #002e74;
          margin-top: 5px;
          .fee {
            color: #0054fe;
          }
          .unit {
            margin-left: 2px;
          }
          .secondFee {
            margin-left: 20px;
            font-size: 10px;
            color: #97a3b4;
          }
          .secondUnit {
            margin-left: 2px;
            font-size: 10px;
            color: #97a3b4;
          }
        }
        &:last-child {
          margin-top: 12px;
        }
      }
      &.storage {
        margin-top: 58px;
      }
      &.gas {
        margin-top: 32px;
      }
    }
    &:last-child {
      margin-left: 16px;
    }
  }
`;
const ApplyContainer = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  .successImg {
    margin-left: 8px;
    width: 16px;
  }
  .accountAddress {
    margin-left: 5px;
    color: #97a3b4;
    font-size: 16px;
  }
`;
const ErrorMsgContainer = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  .icon {
    width: 14px;
  }
  .text {
    margin-left: 4px;
    font-size: 14px;
    font-weight: normal;
    color: #fa953c;
  }
`;
const NoticeContainer = styled.div`
  margin-top: 46px;
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #0f1327;
  }
  .content {
    margin-top: 12px;
    font-weight: normal;
    color: #7e8598;
    line-height: 22px;
    font-size: 14px;
  }
`;
