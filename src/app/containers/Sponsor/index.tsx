import React, { useEffect, useState, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { Search as SearchComp } from 'app/components/Search/Loadable';
import { DappButton } from 'app/components/DappButton/Loadable';
import {
  isCurrentNetworkAddress,
  fromDripToGdrip,
  fromDripToCfx,
  getAddressInputPlaceholder,
  formatAddress,
  processSponsorStorage,
  formatNumber,
} from 'utils';
import { usePortal } from 'utils/hooks/usePortal';
import { useParams } from 'react-router-dom';
import imgWarning from 'images/warning.png';
import { AddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer';
import { TXN_ACTION, CONTRACTS } from 'utils/constants';
import { Remark } from '@cfxjs/sirius-next-common/dist/components/Remark';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { reqContractList, reqContract } from 'utils/httpRequest';
import Faucet from 'utils/sponsorFaucet/faucet';
import { getSponsorInfo as rpcGetSponsorInfo } from 'utils/rpcRequest';
import SponsorStorage from 'app/components/SponsorStorage/Loadable';
import ENV_CONFIG from 'env';

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

const getCFXAmount = (value: string | number, zeroUnit = '') => {
  // cfx
  if (String(value).length > 15) {
    return {
      amount: fromDripToCfx(value),
      unit: 'CFX',
    };
  }

  // Gdrip
  if (String(value).length > 6) {
    return {
      amount: fromDripToGdrip(value),
      unit: 'Gdrip',
    };
  }

  if (String(value) === '0') {
    return {
      amount: '0',
      unit: zeroUnit,
    };
  }

  // Drip
  return {
    amount: value,
    unit: 'Drip',
  };
};

export function Sponsor() {
  const faucet = new Faucet(
    ENV_CONFIG.ENV_RPC_SERVER,
    CONTRACTS.faucet,
    CONTRACTS.faucetLast,
  );
  const { t } = useTranslation();
  const { contractAddress } = useParams<RouteParams>();
  const [storageSponsorAddress, setStorageSponsorAddress] = useState('');
  const [storageSponsorAddressAlias, setStorageSponsorAddressAlias] = useState(
    '',
  );
  const [currentStorageFee, setCurrentStorageFee] = useState(defaultStr);
  const [providedStorageFee, setProvidedStorageFee] = useState(defaultStr);
  const [avialStorageFee, setAvialStorageFee] = useState(defaultStr);
  const [gasFeeAddress, setGasFeeAddress] = useState('');
  const [gasFeeAddressAlias, setGasFeeAddressAlias] = useState('');
  const [currentGasFee, setCurrentGasFee] = useState(defaultStr);
  const [providedGasFee, setProvidedGasFee] = useState(defaultStr);
  const [avialGasFee, setAvialGasFee] = useState(defaultStr);
  const [upperBound, setUpperBound] = useState(defaultStr);
  const [isUpperBoundFromFoundation, setIsUpperBoundFromFoundation] = useState(
    false,
  );
  const [gasBound, setGasBound] = useState(defaultStr);
  const [storageBound, setStorageBound] = useState(defaultStr);
  const [loading, setLoading] = useState(false);
  const [canApply, setCanApply] = useState(false);
  const [isFlag, setIsFlag] = useState(false);
  const [inputAddressVal, setInputAddressVal] = useState('');
  const [errorMsgForApply, setErrorMsgForApply] = useState('');
  const [txData, setTxData] = useState('');
  const { accounts } = usePortal();
  const [storageSponsorInfo, setStorageSponsorInfo] = useState({
    storageQuota: {
      storageCollateral: '0',
      storagePoint: '0',
    },
    storageUsed: {
      storageCollateral: '0',
      storagePoint: '0',
    },
  });

  const addressInputPlaceholder = useMemo(() => {
    return getAddressInputPlaceholder();
  }, []);

  const getSponsorFromSDK = address => {
    rpcGetSponsorInfo(address).then(
      resp => {
        const sponsorGasBound = resp.sponsorGasBound.toString();
        const sponsorForGas = formatAddress(resp.sponsorForGas);

        setUpperBound(sponsorGasBound);
        if (
          sponsorForGas === CONTRACTS.faucet ||
          sponsorForGas === CONTRACTS.faucetLast
        ) {
          setIsUpperBoundFromFoundation(true);
        }
      },
      e => console.log,
    );
  };

  const getSponsorInfo = async _address => {
    setLoading(true);
    // cip-37 compatible
    const address = formatAddress(_address);
    const sponsorInfo = await rpcGetSponsorInfo(address);
    reqContract({ address }).then(data => {
      setStorageSponsorInfo(data.collateralForStorageInfo);
    });
    const { flag } = await fetchIsAppliable(address);

    setIsFlag(flag);
    if (flag) {
      const { data } = await faucet.apply(address);
      setTxData(data);
    }
    const faucetParams: any = await faucet.getFaucetParams(address);
    const amountAccumulated = await faucet.getAmountAccumulated(address);
    getSponsorFromSDK(address);
    if (sponsorInfo && faucetParams && amountAccumulated) {
      setLoading(false);
      const sponsorInfoSponsorForGas = formatAddress(sponsorInfo.sponsorForGas);
      const sponsorInfoSponsorForCollateral = formatAddress(
        sponsorInfo.sponsorForCollateral,
      );
      // get address name
      reqContractList({
        addressArray: [
          sponsorInfoSponsorForCollateral, // note, this is an uppercase address with verbose
          sponsorInfoSponsorForGas, // note, this is an uppercase address with verbose
        ],
        fields: ['iconUrl'],
      })
        .then(res => {
          if (res && res.list) {
            if (res.list.length === 1) {
              // compatibility for /v1/token?addressArray=[] two address key with one address info issue
              setStorageSponsorAddressAlias(res.list[0].name || '');
              setGasFeeAddressAlias(res.list[0].name || '');
            } else {
              setStorageSponsorAddressAlias(res.list[0].name || '');
              setGasFeeAddressAlias(res.list[1].name || '');
            }
          }
        })
        .catch(e => {
          console.error(e);
        })
        .finally(() => {
          setStorageSponsorAddress(sponsorInfoSponsorForCollateral); // should be transform to uppercase address
          setGasFeeAddress(sponsorInfoSponsorForGas); // should be transform to uppercase address
        });
      setCurrentStorageFee(
        new BigNumber(sponsorInfo.sponsorBalanceForCollateral).toFixed(),
      );
      setCurrentGasFee(
        new BigNumber(sponsorInfo.sponsorBalanceForGas).toFixed(),
      );
      setProvidedStorageFee(
        new BigNumber(
          amountAccumulated.collateral_amount_accumulated,
        ).toFixed(),
      );
      // setUpperBound(faucetParams.upper_bound);

      setGasBound(faucetParams.gas_bound);
      setStorageBound(faucetParams.collateral_bound);

      const remainStorageFeeBigNumber = new BigNumber(
        faucetParams.collateral_total_limit,
      ).minus(amountAccumulated.collateral_amount_accumulated);

      setAvialStorageFee(
        remainStorageFeeBigNumber.gt(0)
          ? remainStorageFeeBigNumber.toFixed()
          : '0',
      );
      setProvidedGasFee(
        new BigNumber(amountAccumulated.gas_amount_accumulated).toFixed(),
      );

      const remainGasFeeBigNumber = new BigNumber(
        faucetParams.gas_total_limit,
      ).minus(amountAccumulated.gas_amount_accumulated);

      setAvialGasFee(
        remainGasFeeBigNumber.gt(0) ? remainGasFeeBigNumber.toFixed() : '0',
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
    if (inputAddressVal) {
      if (errorMsgForApply) {
        setErrorMsgForApply('');
      }
      // cip-37
      if (isCurrentNetworkAddress(inputAddressVal)) {
        getSponsorInfo(inputAddressVal);
      } else {
        resetParams();

        setErrorMsgForApply(
          t(translations.general.errors.address, {
            network: t(
              translations.general.networks[
                ENV_CONFIG.ENV_NETWORK_TYPE.toLowerCase()
              ],
            ),
          }),
        );
      }
    } else {
      resetParams();
      setCanApply(true);
      setErrorMsgForApply('');
    }
  };

  const searchClear = () => {
    resetParams();
    setCanApply(true);
    setErrorMsgForApply('');
    setInputAddressVal('');
  };
  const fetchIsAppliable = async (_address: string) => {
    // cip-37 compatible
    const address = formatAddress(_address);
    const { flag, message } = await faucet.checkAppliable(address);

    if (!flag) {
      if (
        [
          'ERROR_GAS_SPONSORED_FUND_UNUSED',
          'ERROR_GAS_OVER_GAS_TOTAL_LIMIT',
          'ERROR_COLLATERAL_SPONSORED_FUND_UNUSED',
          'ERROR_COLLATERAL_OVER_COLLATERAL_TOTAL_LIMIT',
        ].some(m => message.indexOf(m) > -1)
      ) {
        setErrorMsgForApply(errReachToMax);
      } else if (
        [
          'ERROR_GAS_FAUCET_OUT_OF_MONEY',
          'ERROR_COLLATERAL_FAUCET_OUT_OF_MONEY',
        ].some(m => message.indexOf(m) > -1)
      ) {
        setErrorMsgForApply(errInsufficientFee);
      } else if (
        message.indexOf('ERROR_GAS_CANNOT_REPLACE_THIRD_PARTY_SPONSOR') > -1
      ) {
        setErrorMsgForApply(errReplaceThird);
      } else if (message.indexOf('ERROR_ADDRESS_IS_NOT_CONTRACT') > -1) {
        setErrorMsgForApply(errContractNotFound);
      } else if (
        message.indexOf('ERROR_COLLATERAL_CANNOT_REPLACE_THIRD_PARTY_SPONSOR') >
        -1
      ) {
        setErrorMsgForApply(errCannotReplaced);
      } else if (
        message.indexOf('ERROR_COLLATERAL_CANNOT_REPLACE_OLD_FAUCET') > -1
      ) {
        setErrorMsgForApply(errUpgraded);
      } else {
        setErrorMsgForApply(message);
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
    if (isCurrentNetworkAddress(contractAddress)) {
      getSponsorInfo(contractAddress);
    } else {
      resetParams();

      setErrorMsgForApply(
        t(translations.general.errors.address, {
          network: t(
            translations.general.networks[
              ENV_CONFIG.ENV_NETWORK_TYPE.toLowerCase()
            ],
          ),
        }),
      );
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
    if (isCurrentNetworkAddress(inputAddressVal)) {
      getSponsorInfo(inputAddressVal);
    } else {
      resetParams();

      setErrorMsgForApply(
        t(translations.general.errors.address, {
          network: t(
            translations.general.networks[
              ENV_CONFIG.ENV_NETWORK_TYPE.toLowerCase()
            ],
          ),
        }),
      );
    }
  };

  // const currentStorageFeeAmount = getCFXAmount(currentStorageFee, 'CFX');
  const providedStorageFeeAmount = getCFXAmount(providedStorageFee, 'CFX');
  const avialStorageFeeAmount = getCFXAmount(avialStorageFee, 'CFX');

  const currentGasFeeAmount = getCFXAmount(currentGasFee, 'GDrip');
  const providedGasFeeAmount = getCFXAmount(providedGasFee, 'GDrip');
  const avialGasFeeAmount = getCFXAmount(avialGasFee, 'GDrip');

  const upperBoundAmount = getCFXAmount(upperBound, 'GDrip');

  const storageBoundAmount = getCFXAmount(storageBound, 'CFX');
  const gasBoundAmount = getCFXAmount(gasBound, 'GDrip');

  const total = useMemo(
    () =>
      processSponsorStorage(
        storageSponsorInfo?.storageQuota?.storagePoint,
        new BigNumber(storageSponsorInfo?.storageQuota?.storageCollateral)
          .div(1e18)
          .toString(),
      ).total,
    [storageSponsorInfo],
  );

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
            placeholderText={addressInputPlaceholder}
            onEnterPress={searchClick}
            onClear={searchClear}
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
              <SkeletonContainer shown={loading}>
                {storageSponsorAddress ? (
                  errorMsgForApply !== errContractNotFound ? (
                    <AddressContainer
                      value={storageSponsorAddress}
                      alias={storageSponsorAddressAlias}
                    />
                  ) : (
                    '--'
                  )
                ) : (
                  ''
                )}
              </SkeletonContainer>
            </div>
            <div className="currentLabel">
              {t(translations.sponsor.currentAvialStorageQuota)}
            </div>
            <div className="currentFeeContainer">
              <SkeletonContainer shown={loading}>
                {currentStorageFee !== defaultStr ? (
                  <SponsorStorage
                    storageQuota={{
                      point: storageSponsorInfo.storageQuota.storagePoint,
                      collateral: new BigNumber(
                        storageSponsorInfo?.storageQuota?.storageCollateral,
                      )
                        .div(1e18)
                        .toString(),
                    }}
                  >
                    <span className="fee">
                      {formatNumber(total, {
                        withUnit: false,
                      })}
                    </span>
                    <span className="unit">KB</span>
                  </SponsorStorage>
                ) : (
                  defaultStr
                )}
              </SkeletonContainer>
            </div>
            <div className="feeContainer storage">
              <div className="line"></div>
              <div className="item">
                <div className="label">
                  {t(translations.sponsor.providedStorage)}
                </div>
                <div className="innterItem">
                  <SkeletonContainer shown={loading}>
                    {providedStorageFee !== defaultStr ? (
                      <>
                        <span>{providedStorageFeeAmount.amount}</span>
                        <span className="unit">
                          {providedStorageFeeAmount.unit}
                        </span>
                      </>
                    ) : (
                      defaultStr
                    )}
                  </SkeletonContainer>
                </div>
              </div>
              <div className="item">
                <div className="label">
                  {t(translations.sponsor.availStorage)}
                </div>
                <div className="innterItem">
                  <SkeletonContainer shown={loading}>
                    {avialStorageFee !== defaultStr ? (
                      <>
                        <span className="fee">
                          {avialStorageFeeAmount.amount}
                        </span>
                        <span className="unit">
                          {avialStorageFeeAmount.unit}
                        </span>
                      </>
                    ) : (
                      defaultStr
                    )}
                    &nbsp;&nbsp;
                    <span className="secondFee">
                      {storageBound !== defaultStr
                        ? storageBoundAmount.amount
                        : defaultStr}
                    </span>
                    <span className="secondUnit">
                      {storageBoundAmount.unit}/
                      {t(translations.sponsor.applicationUnit)}
                    </span>
                  </SkeletonContainer>
                </div>
              </div>
            </div>
          </div>
          <div className="innerContainer">
            <div className="sponsorAddress">
              <span className="label">
                {t(translations.sponsor.gasFeeSponsor)}&nbsp;&nbsp;
              </span>
              <SkeletonContainer shown={loading}>
                {gasFeeAddress ? (
                  errorMsgForApply !== errContractNotFound ? (
                    <AddressContainer
                      value={gasFeeAddress}
                      alias={gasFeeAddressAlias}
                    />
                  ) : (
                    '--'
                  )
                ) : (
                  ''
                )}
              </SkeletonContainer>
            </div>
            <div className="currentLabel">
              {t(translations.sponsor.currentAvialGasFee)}
            </div>
            <div className="currentFeeContainer">
              <SkeletonContainer shown={loading}>
                {currentGasFee !== defaultStr ? (
                  <>
                    <span className="fee">{currentGasFeeAmount.amount}</span>
                    <span className="unit">{currentGasFeeAmount.unit}</span>
                  </>
                ) : (
                  defaultStr
                )}
              </SkeletonContainer>
            </div>
            <div className="upperBoundContainer">
              <SkeletonContainer shown={loading}>
                <span className="label">
                  {t(translations.sponsor.upperBound)}:&nbsp;
                </span>
                {upperBound !== defaultStr ? (
                  // <span className="fee">{fromDripToGdrip(upperBound)}</span>
                  <span className="fee">{upperBoundAmount.amount}</span>
                ) : (
                  defaultStr
                )}
                &nbsp;
                <span className="unit">
                  {upperBoundAmount.unit}/{t(translations.sponsor.tx)}
                </span>
                {/* <span className="unit">Gdrip/{t(translations.sponsor.tx)}</span> */}
                {isUpperBoundFromFoundation ? (
                  <span>{t(translations.sponsor.byFoundation)}</span>
                ) : null}
              </SkeletonContainer>
            </div>
            <div className="feeContainer gas">
              <div className="line"></div>
              <div className="item">
                <div className="label">
                  {t(translations.sponsor.providedGas)}
                </div>
                <div className="innterItem">
                  <SkeletonContainer shown={loading}>
                    {providedGasFee !== defaultStr ? (
                      <>
                        <span>{providedGasFeeAmount.amount}</span>
                        <span className="unit">
                          {providedGasFeeAmount.unit}
                        </span>
                      </>
                    ) : (
                      defaultStr
                    )}
                  </SkeletonContainer>
                </div>
              </div>
              <div className="item">
                <div className="label">{t(translations.sponsor.availGas)}</div>
                <div className="innterItem">
                  <SkeletonContainer shown={loading}>
                    {avialGasFee !== defaultStr ? (
                      <>
                        <span className="fee">{avialGasFeeAmount.amount}</span>
                        <span className="unit">{avialGasFeeAmount.unit}</span>
                      </>
                    ) : (
                      defaultStr
                    )}
                    &nbsp;&nbsp;
                    <span className="secondFee">
                      {gasBound !== defaultStr ? (
                        <span>{gasBoundAmount.amount}</span>
                      ) : (
                        defaultStr
                      )}
                    </span>
                    <span className="secondUnit">
                      {gasBoundAmount.unit}/
                      {t(translations.sponsor.applicationUnit)}
                    </span>
                  </SkeletonContainer>
                </div>
              </div>
            </div>
          </div>
        </BlockContainer>
        <ApplyContainer>
          <DappButton
            contractAddress={CONTRACTS.faucet}
            data={txData}
            btnDisabled={!canApply}
            connectText={t('sponsor.connectToApply')}
            submitText={t('general.apply')}
            failCallback={failCallback}
            closeModalCallback={closeModalCallback}
            txnAction={TXN_ACTION.sponsorApplication}
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
            <span
              dangerouslySetInnerHTML={{
                __html: t(translations.sponsor.noticeSecond),
              }}
            ></span>,
            t(translations.sponsor.noticeThird),
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
  margin-top: -0.7143rem;
  margin-bottom: 0.5714rem;
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
