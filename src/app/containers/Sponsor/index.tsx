import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components/macro';
import { media } from '../../../styles/media';
import { cfx, faucet, faucetAddress, formatAddress } from '../../../utils/cfx';
import SkelontonContainer from '../../components/SkeletonContainer';
import { Text } from '../../components/Text/Loadable';
import { Search as SearchComp } from '../../components/Search/Loadable';
import { DappButton } from '../../components/DappButton/Loadable';
import { isAddress, fromDripToGdrip, fromDripToCfx } from '../../../utils';
import { usePortal } from 'utils/hooks/usePortal';
import { useParams } from 'react-router-dom';
import imgWarning from 'images/warning.png';
import { AddressContainer } from '../../components/AddressContainer';
import { TxnAction } from '../../../utils/constants';
import { Remark } from '../../components/Remark';
import { PageHeader } from '../../components/PageHeader/Loadable';

interface RouteParams {
  contractAddress: string;
}

const defaultStr = '--';
const errReachToMax = 'errReachToMax';
const errInsufficientFee = 'errInsufficientFee';
const errReplaceThird = 'errReplaceThird';
const errContractNotFound = 'errContractNotFound';
const errCannotReplaced = 'errCannotReplaced';
const errUpgraded = 'errUpgraded';
export function Sponsor() {
  const { t } = useTranslation();
  const { contractAddress } = useParams<RouteParams>();
  const [storageSponsorAddress, setStorageSponsorAddress] = useState('');
  const [currentStorageFee, setCurrentStorageFee] = useState(defaultStr);
  const [providedStorageFee, setProvidedStorageFee] = useState(defaultStr);
  const [avialStorageFee, setAvialStorageFee] = useState(defaultStr);
  const [gasFeeAddress, setGasFeeAddress] = useState('');
  const [currentGasFee, setCurrentGasFee] = useState(defaultStr);
  const [providedGasFee, setProvidedGasFee] = useState(defaultStr);
  const [avialGasFee, setAvialGasFee] = useState(defaultStr);
  const [upperBound, setUpperBound] = useState(defaultStr);
  const [gasBound, setGasBound] = useState(defaultStr);
  const [storageBound, setStorageBound] = useState(defaultStr);
  const [loading, setLoading] = useState(false);
  const [canApply, setCanApply] = useState(false);
  const [isFlag, setIsFlag] = useState(false);
  const [inputAddressVal, setInputAddressVal] = useState('');
  const [errorMsgForApply, setErrorMsgForApply] = useState('');
  const [txData, setTxData] = useState('');
  const { accounts } = usePortal();
  const getSponsorInfo = async _address => {
    setLoading(true);
    // cip-37 compatible
    const address = formatAddress(_address, { hex: false });
    const sponsorInfo = await cfx.provider.call('cfx_getSponsorInfo', address);
    const { flag } = await fetchIsAppliable(address);
    setIsFlag(flag);
    if (flag) {
      const { data } = await faucet.apply(address);
      setTxData(data);
    }
    const faucetParams = await faucet.getFaucetParams(address);
    const amountAccumulated = await faucet.getAmountAccumulated(address);
    if (sponsorInfo && faucetParams && amountAccumulated) {
      setLoading(false);
      setStorageSponsorAddress(sponsorInfo.sponsorForCollateral);
      setGasFeeAddress(sponsorInfo.sponsorForGas);
      setCurrentStorageFee(sponsorInfo.sponsorBalanceForCollateral);
      setCurrentGasFee(sponsorInfo.sponsorBalanceForGas);
      setProvidedStorageFee(amountAccumulated.collateral_amount_accumulated);
      setUpperBound(faucetParams.upper_bound);
      setGasBound(faucetParams.gas_bound);
      setStorageBound(faucetParams.collateral_bound);
      setAvialStorageFee(
        new BigNumber(Number(faucetParams.collateral_total_limit))
          .minus(
            new BigNumber(
              Number(amountAccumulated.collateral_amount_accumulated),
            ),
          )
          .toFixed(),
      );
      setProvidedGasFee(amountAccumulated.gas_amount_accumulated);
      setAvialGasFee(
        new BigNumber(Number(faucetParams.gas_total_limit))
          .minus(Number(amountAccumulated.gas_amount_accumulated))
          .toFixed(),
      );
    }
  };
  const resetParams = () => {
    setStorageSponsorAddress('');
    setCurrentStorageFee(defaultStr);
    setProvidedStorageFee(defaultStr);
    setAvialStorageFee(defaultStr);
    setGasFeeAddress('');
    setCurrentGasFee(defaultStr);
    setProvidedGasFee(defaultStr);
    setAvialGasFee(defaultStr);
    setUpperBound(defaultStr);
    setGasBound(defaultStr);
    setStorageBound(defaultStr);
    setCanApply(false);
  };
  const addressInputChanger = val => {
    setInputAddressVal(val);
  };

  const searchClick = async () => {
    // cip-37
    if (isAddress(inputAddressVal)) {
      getSponsorInfo(inputAddressVal);
    } else {
      resetParams();
    }
  };
  const fetchIsAppliable = async (_address: string) => {
    // cip-37 compatible
    const address = formatAddress(_address);
    const { flag, message } = await faucet.checkAppliable(address);
    if (!flag) {
      //can not apply sponsor this contract
      switch (message) {
        case 'ERROR_GAS_SPONSORED_FUND_UNUSED':
        case 'ERROR_GAS_OVER_GAS_TOTAL_LIMIT':
        case 'ERROR_COLLATERAL_SPONSORED_FUND_UNUSED':
        case 'ERROR_COLLATERAL_OVER_COLLATERAL_TOTAL_LIMIT':
          setErrorMsgForApply(errReachToMax);
          break;
        case 'ERROR_GAS_FAUCET_OUT_OF_MONEY':
        case 'ERROR_COLLATERAL_FAUCET_OUT_OF_MONEY':
          setErrorMsgForApply(errInsufficientFee);
          break;
        case 'ERROR_GAS_CANNOT_REPLACE_THIRD_PARTY_SPONSOR':
          setErrorMsgForApply(errReplaceThird);
          break;
        case 'ERROR_ADDRESS_IS_NOT_CONTRACT':
          setErrorMsgForApply(errContractNotFound);
          break;
        case 'ERROR_COLLATERAL_CANNOT_REPLACE_THIRD_PARTY_SPONSOR':
          setErrorMsgForApply(errCannotReplaced);
          break;
        case 'ERROR_COLLATERAL_CANNOT_REPLACE_OLD_FAUCET':
          setErrorMsgForApply(errUpgraded);
          break;
        default:
          setErrorMsgForApply('');
          break;
      }
      setCanApply(false);
    } else {
      setCanApply(true);
      setErrorMsgForApply('');
    }
    return { flag, message };
  };

  useEffect(() => {
    setInputAddressVal(contractAddress);
    if (isAddress(contractAddress)) {
      getSponsorInfo(contractAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress]);
  useEffect(() => {
    if (!accounts[0]) {
      setCanApply(true);
      if (errorMsgForApply) {
        setErrorMsgForApply('');
      }
    } else {
      if (!isFlag) {
        setCanApply(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts[0]]);
  const failCallback = message => {
    setCanApply(false);
  };
  const closeModalCallback = () => {
    if (isAddress(inputAddressVal)) {
      getSponsorInfo(inputAddressVal);
    }
  };
  return (
    <>
      <Helmet>
        <title>{t(translations.header.contract)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <Wrapper>
        <PageHeader>{t(translations.sponsor.title)}</PageHeader>
        <SearchContainer>
          <SearchComp
            outerClassname="outerContainer"
            inputClassname="sponsor-search"
            iconColor="#74798C"
            placeholderText={t(translations.sponsor.searchAddress)}
            onEnterPress={searchClick}
            onChange={addressInputChanger}
            val={inputAddressVal}
          ></SearchComp>
        </SearchContainer>
        <BlockContainer>
          <div className="innerContainer">
            <div className="sponsorAddress">
              <span className="label">
                {t(translations.sponsor.storageSponsor)}&nbsp;&nbsp;
              </span>
              <SkelontonContainer shown={loading}>
                {storageSponsorAddress ? (
                  <AddressContainer value={storageSponsorAddress} />
                ) : (
                  ''
                )}
              </SkelontonContainer>
            </div>
            <div className="currentLabel">
              {t(translations.sponsor.currentAvialStorageFee)}
            </div>
            <div className="currentFeeContainer">
              <SkelontonContainer shown={loading}>
                <span className="fee">
                  {currentStorageFee !== defaultStr
                    ? fromDripToCfx(currentStorageFee)
                    : defaultStr}
                </span>
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
                    <span>
                      {providedStorageFee !== defaultStr
                        ? fromDripToCfx(providedStorageFee)
                        : defaultStr}
                    </span>
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
                    <span className="fee">
                      {avialStorageFee !== defaultStr
                        ? fromDripToCfx(avialStorageFee)
                        : defaultStr}
                    </span>
                    <span className="unit">CFX</span>{/* prettier-ignore */}
                    <span className="secondFee">{storageBound !== defaultStr? fromDripToCfx(storageBound): defaultStr}</span>
                    <span className="secondUnit">
                      CFX/{t(translations.sponsor.applicationUnit)}
                    </span>
                  </SkelontonContainer>
                </div>
              </div>
            </div>
          </div>
          <div className="innerContainer">
            <div className="sponsorAddress">
              <span className="label">
                {t(translations.sponsor.gasFeeSponsor)}&nbsp;&nbsp;
              </span>
              <SkelontonContainer shown={loading}>
                {gasFeeAddress ? (
                  <AddressContainer value={gasFeeAddress} />
                ) : (
                  ''
                )}
              </SkelontonContainer>
            </div>
            <div className="currentLabel">
              {t(translations.sponsor.currentAvialGasFee)}
            </div>
            <div className="currentFeeContainer">
              <SkelontonContainer shown={loading}>
                <span className="fee">
                  {currentGasFee !== defaultStr
                    ? fromDripToCfx(currentGasFee)
                    : defaultStr}
                </span>
                <span className="unit">CFX</span>
              </SkelontonContainer>
            </div>
            <div className="upperBoundContainer">
              <SkelontonContainer shown={loading}>
                <span className="label">
                  {t(translations.sponsor.upperBound)}:&nbsp;
                </span>
                <Text
                  className="fee"
                  hoverValue={fromDripToGdrip(upperBound, true)}
                >
                  {upperBound !== defaultStr
                    ? fromDripToGdrip(upperBound)
                    : defaultStr}
                </Text>
                &nbsp;
                <span className="unit">Gdrip/{t(translations.sponsor.tx)}</span>
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
                    <span>
                      {providedGasFee !== defaultStr
                        ? fromDripToCfx(providedGasFee)
                        : defaultStr}
                    </span>
                    <span className="unit">CFX</span>
                  </SkelontonContainer>
                </div>
              </div>
              <div className="item">
                <div className="label">{t(translations.sponsor.availGas)}</div>
                <div className="innterItem">
                  <SkelontonContainer shown={loading}>
                    <span className="fee">
                      {avialGasFee !== defaultStr
                        ? fromDripToCfx(avialGasFee)
                        : defaultStr}
                    </span>
                    {/* prettier-ignore */}
                    <span className="unit">CFX</span>
                    <span className="secondFee">
                      {gasBound !== defaultStr
                        ? fromDripToCfx(gasBound)
                        : defaultStr}
                    </span>
                    {/* prettier-ignore */}
                    <span className="secondUnit">
                      CFX/{t(translations.sponsor.applicationUnit)}
                    </span>
                  </SkelontonContainer>
                </div>
              </div>
            </div>
          </div>
        </BlockContainer>
        <ApplyContainer>
          <DappButton
            contractAddress={faucetAddress}
            data={txData}
            btnDisabled={!canApply}
            connectText={t('sponsor.connectToApply')}
            submitText={t('general.apply')}
            failCallback={failCallback}
            closeModalCallback={closeModalCallback}
            txnAction={TxnAction.sponsorApplication}
          ></DappButton>
        </ApplyContainer>

        <ErrorMsgContainer className={`${errorMsgForApply ? '' : 'hidden'}`}>
          <img src={imgWarning} alt="warning" className="icon" />
          <span className="text">
            {[
              errReachToMax,
              errInsufficientFee,
              errReplaceThird,
              errContractNotFound,
              errCannotReplaced,
              errUpgraded,
            ].indexOf(errorMsgForApply) !== -1
              ? t(translations.sponsor[errorMsgForApply])
              : errorMsgForApply}
          </span>
        </ErrorMsgContainer>
        <Remark
          items={[
            t(translations.sponsor.noticeFirst),
            t(translations.sponsor.noticeSecond),
            <span>
              {t(translations.sponsor.noticeFourthOne)}
              &nbsp;
              <a
                href="https://portal.conflux-chain.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://portal.conflux-chain.org/
              </a>
              &nbsp; {t(translations.sponsor.noticeFourthTwo)}
            </span>,
          ]}
        ></Remark>
      </Wrapper>
    </>
  );
}
const Wrapper = styled.div`
  padding-bottom: 1.7143rem;

  .modalContainer {
    display: flex;
    justify-content: center;
  }
  .btn.searchBtn {
    height: 2.1429rem;
    line-height: 2.1429rem;
    width: 6rem;
    min-width: initial;
  }
  .btn.applyBtn {
    height: 2.1429rem;
    line-height: 2.1429rem;
  }
  .shown {
    display: initial;
  }
  .hidden {
    display: none;
  }
`;

const SearchContainer = styled.div`
  display: inline-block;
  width: 36rem;
  .outerContainer {
    flex-grow: 1;
    .sponsor-search.input-container {
      height: 2.28rem;
      .input-wrapper {
        border-radius: 1.14rem;
        background: rgba(0, 84, 254, 0.04);
        input {
          color: #74798c;
          ::placeholder {
            font-size: 12px;
            color: rgba(116, 121, 140, 0.6);
          }
        }
        &.hover {
          border: none;
          input {
            color: #74798c;
          }
        }
        &.focus {
          border: none;
          input {
            color: #74798c;
          }
        }
      }
    }
  }
  ${media.m} {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
  }
`;
const BlockContainer = styled.div`
  display: flex;
  background: #f5f6fa;
  margin-top: 1.7143rem;
  ${media.m} {
    flex-direction: column;
  }
  .innerContainer {
    flex: 1;
    box-sizing: border-box;
    flex-basis: 36rem;
    flex-grow: 0;
    flex-shrink: 0;
    box-sizing: content-box;
    background: #ffffff;
    box-shadow: 12px 8px 24px -12px rgba(20, 27, 50, 0.12);
    border-radius: 5px;
    padding: 1.7143rem 1.1429rem 1.1429rem 1.1429rem;
    ${media.l} {
      flex-basis: 32rem;
    }
    ${media.m} {
      flex-basis: initial;
    }
    .sponsorAddress {
      display: flex;
      align-items: center;
      .label {
        font-size: 0.8571rem;
        font-weight: 500;
        color: #97a3b4;
      }
      .address {
        font-size: 0.7143rem;
        font-weight: normal;
        color: #1e3de4;
        margin-left: 0.5714rem;
      }
    }
    .currentLabel {
      margin-top: 0.7143rem;
      font-size: 20px;
      font-weight: 500;
      color: #1a1a1a;
    }
    .currentFeeContainer {
      margin-top: 0.5714rem;
      .fee {
        font-weight: bold;
        color: #1e3de4;
        font-size: 1.7143rem;
        line-height: 1.7143rem;
      }
      .unit {
        margin-left: 0.2857rem;
        font-weight: 500;
        color: #74798c;
        font-size: 0.8571rem;
      }
    }
    .upperBoundContainer {
      margin-top: 0.8571rem;
      color: #97a3b4;
      font-size: 0.7143rem;
    }
    .feeContainer {
      margin-top: 1.9286rem;
      .line {
        height: 1px;
        background-color: #f1f1f1;
      }
      .item {
        margin-top: 1.0714rem;
        .label {
          font-size: 0.7143rem;
          font-weight: 500;
          color: #97a3b4;
        }
        .innterItem {
          font-size: 0.8571rem;
          color: #002e74;
          margin-top: 0.3571rem;
          .fee {
            color: #1e3de4;
          }
          .unit {
            margin-left: 0.1429rem;
          }
          .secondFee {
            margin-left: 1.4286rem;
            font-size: 0.7143rem;
            color: #97a3b4;
          }
          .secondUnit {
            margin-left: 0.1429rem;
            font-size: 0.7143rem;
            color: #97a3b4;
          }
        }
        &:last-child {
          margin-top: 0.8571rem;
        }
      }
      &.storage {
        margin-top: 4.1429rem;
      }
      &.gas {
        margin-top: 2.2857rem;
      }
    }
    &:last-child {
      margin-left: 1.1429rem;
      ${media.m} {
        margin-left: 0px;
        margin-top: 1.3333rem;
      }
    }
  }
`;
const ApplyContainer = styled.div`
  margin: 1.7143rem 0;
`;
const ErrorMsgContainer = styled.div`
  margin-top: 0.5714rem;
  line-height: 1.5714rem;
  display: flex;
  align-items: center;
  .icon {
    width: 1rem;
  }
  .text {
    margin-left: 0.2857rem;
    font-size: 1rem;
    font-weight: normal;
    color: #fa953c;
  }
`;
