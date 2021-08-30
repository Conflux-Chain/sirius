/**
 *
 * Contract Detail
 *
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useRouteMatch } from 'react-router-dom';
import { media } from '../../../styles/media';
import { Input, useMessages } from '@cfxjs/react-ui';
import { defaultContractIcon, defaultTokenIcon } from '../../../constants';
import {
  byteToKb,
  isContractAddress,
  isInnerContractAddress,
  tranferToLowerCase,
  validURL,
} from '../../../utils';
import {
  reqContract,
  reqContractNameTag,
  reqToken,
} from '../../../utils/httpRequest';
import SkelontonContainer from '../SkeletonContainer';
import imgRemove from 'images/contract/remove.svg';
import imgUpload from 'images/contract/upload.svg';
import imgWarning from 'images/warning.png';
import { usePortal } from 'utils/hooks/usePortal';
import { DappButton } from '../DappButton/Loadable';
import { packContractAndToken } from '../../../utils/contractManagerTool';
import {
  contractManagerAddress,
  formatAddress,
  isConfluxTestNet,
} from '../../../utils/cfx';
import { TxnAction } from '../../../utils/constants';
import { PageHeader } from '../PageHeader/Loadable';
import { CheckCircleIcon } from 'app/containers/AddressContractDetail/ContractContent';
import { Text } from 'app/components/Text/Loadable';

interface Props {
  contractDetail: any;
  type: string;
  address?: string;
  loading?: boolean;
}

interface RequestBody {
  [key: string]: any;
}
const MAXSIZEFORICON = 30; //kb
const fieldsContract = [
  'address',
  'type',
  'name',
  'website',
  'token',
  'icon',
  'typeCode',
];
export const ContractOrTokenInfo = ({
  contractDetail,
  type,
  address,
  loading,
}: Props) => {
  const routeMatch = useRouteMatch();
  const updateInfoType = routeMatch.path.startsWith('/contract-info/')
    ? 'contract'
    : 'token';
  const { t, i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';
  const { accounts } = usePortal();
  const [, setMessage] = useMessages();
  const [addressVal, setAddressVal] = useState('');
  const [contractName, setContractName] = useState(() => {
    return updateInfoType === 'token' ? Math.random().toString().substr(2) : ''; // maybe there is not contract name when update token info
  });
  const [site, setSite] = useState('');
  const [contractImgSrc, setContractImgSrc] = useState('');
  const [tokenImgSrc, setTokenImgSrc] = useState('');
  const [btnShouldClick, setBtnShouldClick] = useState(true);
  // const [addressDisabled, setAddressDisabled] = useState(true);
  const [errorMsgForAddress, setErrorMsgForAddress] = useState('');
  const [errorMsgForName, setErrorMsgForName] = useState('');
  const [warningMsgTimesForName, setWarningMsgTimesForName] = useState(0);
  const [errorMsgForSite, setErrorMsgForSite] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [isAddressError, setIsAddressError] = useState(true);
  const [isAdminError, setIsAdminError] = useState(true);
  const [isErc20Error, setIsErc20Error] = useState(true);
  const [isNameError, setIsNameError] = useState(true);
  const [isSiteError, setIsSiteError] = useState(false);
  const [txData, setTxData] = useState('');
  const fileContractInputRef = React.createRef<any>();
  const fileTokenInputRef = React.createRef<any>();
  const inputStyle = { margin: '0 0.2857rem' };
  const displayNone = {
    display: 'none',
  };
  const title =
    updateInfoType === 'token'
      ? t(translations.contract.updateToken)
      : t(translations.contract.updateContract);

  const addressInputChanger = e => {
    setAddressVal(e.target.value);
  };

  const nameInputChanger = e => {
    const value = e.target.value;
    setContractName(value);
    checkContractName(value);
  };

  const siteInputChanger = e => {
    setSite(e.target.value);
  };

  useEffect(() => {
    setContractImgSrc(contractDetail.icon || '');
    setTokenImgSrc(contractDetail.token && contractDetail.token.icon);
    if (updateInfoType === 'contract') {
      setContractName(contractDetail.name || '');
    }
    setSite(contractDetail.website || '');
    switch (type) {
      case 'create':
        setAddressVal(address || '');
        // setAddressDisabled(false);
        break;
      case 'edit':
        setAddressVal(formatAddress(contractDetail.address));
        // setAddressDisabled(true);
        checkAdminThenToken(contractDetail.token && contractDetail.token.icon);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address,
    contractDetail.address,
    contractDetail.icon,
    contractDetail.name,
    contractDetail.tokenIcon,
    contractDetail.website,
    contractDetail.token,
    t,
    type,
  ]);
  useEffect(
    () => {
      let isSubmitable = false;
      if (accounts[0]) {
        if (
          !isAddressError &&
          !isAdminError &&
          !isErc20Error &&
          !isNameError &&
          !isSiteError
        ) {
          isSubmitable = true;
          setTxData(getTxData());
        } else {
          setTxData('');
        }
      } else {
        setTxData('');
        isSubmitable = true;
      }
      setBtnShouldClick(isSubmitable);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      type,
      addressVal,
      contractName,
      site,
      tokenImgSrc,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      accounts[0],
      isAddressError,
      isAdminError,
      isErc20Error,
      isNameError,
      isSiteError,
    ],
  );

  const addressOnBlur = () => {
    checkAdminThenToken(tokenImgSrc);
  };

  function checkContractName(name) {
    if (name) {
      if (name.length > 35) {
        setIsNameError(true);
        setErrorMsgForName('contract.invalidNameTag');
      } else {
        setIsNameError(false);
        setErrorMsgForName('');
      }
    } else {
      setIsNameError(true);
      setErrorMsgForName('contract.requiredNameTag');
    }
  }

  function checkContractNameDuplicated(value) {
    if (value) {
      // check contract name tag is registered
      reqContractNameTag(value)
        .then(res => {
          if (res && res.registered > 0) {
            setWarningMsgTimesForName(res.registered);
          } else {
            setWarningMsgTimesForName(0);
          }
        })
        .catch(e => {
          console.error(e);
          setWarningMsgTimesForName(0);
        });
    } else {
      setWarningMsgTimesForName(0);
    }
  }

  useEffect(() => {
    checkAdminThenToken(tokenImgSrc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressVal]);

  const nameOnBlur = e => {
    const value = e.target.value;
    checkContractName(value);
    checkContractNameDuplicated(value);
    setContractName(value);
  };

  const siteOnBlur = () => {
    checkSite();
  };
  useEffect(() => {
    checkSite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site]);
  useEffect(() => {
    if (accounts[0]) {
      checkAdminThenToken(tokenImgSrc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts[0]]);
  const uploadContractIcon = () => {
    fileContractInputRef.current.click();
  };
  const removeContractIcon = () => {
    setContractImgSrc('');
  };
  const removeTokenIcon = () => {
    setTokenImgSrc('');
    setIsErc20Error(false);
    if (warningMessage === 'contract.errorTokenICon') {
      setWarningMessage('');
    }
  };

  const uploadTokenIcon = () => {
    fileTokenInputRef.current.click();
  };

  const handleContractIconChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      if (byteToKb(file.size) > MAXSIZEFORICON) {
        setMessage({ text: t('contract.invalidIconSize'), color: 'error' });
      } else {
        reader.onloadend = () => {
          setContractImgSrc(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = '';
  };
  const handleTokenIconChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      if (byteToKb(file.size) > MAXSIZEFORICON) {
        setMessage({ text: t('contract.invalidIconSize'), color: 'error' });
      } else {
        reader.onloadend = () => {
          setTokenImgSrc(reader.result as string);
          checkAdminThenToken(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = '';
  };
  function getTxData() {
    try {
      const bodyParams: RequestBody = {};
      bodyParams.address = formatAddress(tranferToLowerCase(addressVal));
      if (updateInfoType === 'contract') {
        bodyParams.name = contractName; // only submit name when update contract info
      }
      bodyParams.website = site;
      bodyParams.icon = contractImgSrc;
      if (tokenImgSrc) {
        bodyParams.tokenIcon = tokenImgSrc;
      } else {
        bodyParams.tokenIcon = '';
      }
      const data = packContractAndToken(bodyParams);
      return data[0];
    } catch (e) {
      console.log('packContractAndToken error: ', e);
    }
  }
  function checkAdminThenToken(tokenIcon) {
    if (addressVal) {
      if (
        (isContractAddress(addressVal) || isInnerContractAddress(addressVal)) &&
        !addressVal.startsWith('0x')
      ) {
        setIsAddressError(false);
        setErrorMsgForAddress('');
        if (accounts[0]) {
          reqContract({ address: addressVal, fields: fieldsContract })
            .then(dataContractInfo => {
              if (
                formatAddress(dataContractInfo.from) ===
                  formatAddress(accounts[0]) ||
                formatAddress(dataContractInfo.admin) ===
                  formatAddress(accounts[0])
              ) {
                setIsAdminError(false);
                if (tokenIcon) {
                  reqToken({ address: addressVal }).then(tokenInfo => {
                    if (tokenInfo.name && tokenInfo.symbol) {
                      setIsErc20Error(false);
                      setWarningMessage('');
                    } else {
                      setIsErc20Error(true);
                      setWarningMessage('contract.errorTokenICon');
                    }
                  });
                } else {
                  setIsErc20Error(false);
                  setWarningMessage('');
                }
              } else {
                setIsAdminError(true);
                setWarningMessage('contract.errorNotAdmin');
              }
            })
            .catch(e => console.error(e));
        }
      } else {
        setIsAddressError(true);
        setErrorMsgForAddress('contract.invalidContractAddress');
      }
    } else {
      setIsAddressError(true);
      setErrorMsgForAddress('contract.requiredAddress');
    }
  }
  function checkSite() {
    if (site && !validURL(site)) {
      setIsSiteError(true);
      setErrorMsgForSite('contract.invalidUrl');
    } else {
      setIsSiteError(false);
      setErrorMsgForSite('');
    }
  }
  const isVerified = contractDetail.verify?.exactMatch;

  let isDisabled = false;
  if (updateInfoType === 'contract') {
    isDisabled =
      !btnShouldClick || isAddressError || isNameError || isSiteError;
  } else {
    isDisabled = !btnShouldClick || !tokenImgSrc;
  }

  return (
    <Wrapper>
      <PageHeader>{title}</PageHeader>
      <TopContainer>
        <div className="bodyContainer first">
          <div className="lineContainer">
            <div className="firstLine">
              <LabelWithIcon>
                <span className="labelIcon">*</span>
                {t(translations.contract.address)}
              </LabelWithIcon>
              <SkelontonContainer shown={loading}>
                <Input
                  className="inputComp"
                  style={inputStyle}
                  defaultValue={addressVal}
                  onChange={addressInputChanger}
                  readOnly={true}
                  placeholder={isConfluxTestNet ? 'cfxtest:...' : 'cfx:...'}
                  onBlur={addressOnBlur}
                />
                {isVerified ? (
                  <div className="is-verified-tip">
                    <Text
                      hoverValue={t(translations.contract.verify.isVerifiedTip)}
                    >
                      <CheckCircleIcon />
                    </Text>
                  </div>
                ) : null}
              </SkelontonContainer>
            </div>
            <div>
              <span className="blankSpan"></span>
              <span className="errorSpan">{t(errorMsgForAddress)}</span>
            </div>
          </div>
          {updateInfoType === 'contract' ? (
            <>
              <div className="lineContainer">
                <div className="firstLine">
                  <LabelWithIcon>
                    <span className="labelIcon">*</span>
                    {t(translations.contract.nameTag)}
                  </LabelWithIcon>
                  <SkelontonContainer shown={loading}>
                    <Input
                      className="inputComp"
                      defaultValue={contractName}
                      style={inputStyle}
                      onChange={nameInputChanger}
                      placeholder={t(translations.contract.namePlaceholder)}
                      onBlur={nameOnBlur}
                    />
                  </SkelontonContainer>
                </div>
                <div>
                  <span className="blankSpan"></span>
                  <span className="errorSpan">{t(errorMsgForName)}</span>
                  {!errorMsgForName && warningMsgTimesForName > 0 ? (
                    <span className="warningSpan">
                      {t(translations.contract.duplicatedNameTag, {
                        times: warningMsgTimesForName,
                      })}
                      {lang === 'en' && warningMsgTimesForName > 1 ? 's' : ''}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="lineContainer">
                <div className="firstLine">
                  <LabelWithIcon>{t(translations.contract.site)}</LabelWithIcon>
                  <SkelontonContainer shown={loading}>
                    <Input
                      className="inputComp"
                      defaultValue={site}
                      style={inputStyle}
                      onChange={siteInputChanger}
                      placeholder={t(translations.contract.sitePlaceholder)}
                      onBlur={siteOnBlur}
                    />
                  </SkelontonContainer>
                </div>
                <div>
                  <span className="blankSpan"></span>
                  <span className="errorSpan">{t(errorMsgForSite)}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
        {updateInfoType === 'token' ? (
          <div className="bodyContainer second">
            <div className="innerContainer firstInner">
              <div className="itemContainer">
                <div className="item left">
                  <input
                    type="file"
                    name="File"
                    style={displayNone}
                    accept="image/*"
                    ref={fileContractInputRef}
                    onChange={handleContractIconChange}
                  />
                  <div className="firstItem" onClick={uploadContractIcon}>
                    <img
                      src={imgUpload}
                      className="labelIcon"
                      alt={t(translations.contract.contractIcon)}
                    ></img>
                    <span className="labelText">
                      {t(translations.contract.contractIcon)}
                    </span>
                  </div>
                  <div className="iconTips">
                    {t(translations.contract.maxSize)}
                  </div>
                  <div className="secondItem" onClick={removeContractIcon}>
                    <img
                      src={imgRemove}
                      className="labelIcon"
                      alt={t(translations.contract.remove)}
                    ></img>
                    <span className="labelText">
                      {t(translations.contract.remove)}
                    </span>
                  </div>
                </div>
                <div className="item right">
                  <SkelontonContainer shown={loading}>
                    <div className="iconContainer">
                      <img
                        src={contractImgSrc || defaultContractIcon}
                        className="contractIcon"
                        alt="contract icon"
                      ></img>
                    </div>
                  </SkelontonContainer>
                </div>
              </div>
            </div>
            <div className="innerContainer secondInner">
              <div className="itemContainer">
                <div className="item left">
                  <input
                    type="file"
                    name="File"
                    style={displayNone}
                    accept="image/*"
                    ref={fileTokenInputRef}
                    onChange={handleTokenIconChange}
                  />
                  <div className="firstItem" onClick={uploadTokenIcon}>
                    <img
                      src={imgUpload}
                      className="labelIcon"
                      alt="upload"
                    ></img>
                    <span className="labelText">
                      {t(translations.contract.tokenIcon)}
                    </span>
                  </div>
                  <div className="iconTips">
                    {t(translations.contract.maxSize)}
                  </div>
                  <div className="secondItem" onClick={removeTokenIcon}>
                    <img
                      src={imgRemove}
                      className="labelIcon"
                      alt="remove"
                    ></img>
                    <span className="labelText">
                      {t(translations.contract.remove)}
                    </span>
                  </div>
                </div>
                <div className="item right">
                  <SkelontonContainer shown={loading}>
                    <div className="iconContainer">
                      <img
                        src={tokenImgSrc || defaultTokenIcon}
                        className="contractIcon"
                        alt="token icon"
                      ></img>
                    </div>
                  </SkelontonContainer>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </TopContainer>
      <div className="submitContainer">
        <DappButton
          contractAddress={contractManagerAddress}
          data={txData}
          btnDisabled={isDisabled}
          txnAction={TxnAction.contractEdit}
        ></DappButton>
        <div
          className={`warningContainer ${warningMessage ? 'shown' : 'hidden'}`}
        >
          <img src={imgWarning} alt="warning" className="warningImg" />
          <span className="text">{t(warningMessage)}</span>
        </div>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  background: #f5f6fa;

  .is-verified-tip {
    background-color: #fafbfc;
    height: 2.1429rem;
    display: flex;
    align-items: center;
    padding-right: 0.7143rem;
  }

  .inputComp {
    background-color: #fafbfc;
    .input-wrapper {
      background-color: #fafbfc;
      margin: 0;
      border: transparent;
      border-radius: 2px;
      height: 2.1429rem;
      color: #97a3b4;
      &.hover {
        background-color: #fafbfc !important;
      }
      &.focus {
        background-color: #fafbfc !important;
      }
    }
  }
  .input-container.inputComp {
    width: 100%;
    height: 2.1429rem;
  }
  .submitInput {
    .input-wrapper {
      border: none;
      height: 2.2857rem;
      margin-left: 0.3571rem;
      ${media.m} {
        margin-left: initial;
        margin-top: 0.4167rem;
        height: 2.6667rem;
      }
    }
  }
  .input-container.submitInput {
    height: 2.2857rem;
    width: 100%;
    max-width: 73.1429rem;
    margin: 0 auto;
  }
  .warningContainer {
    margin: 1.4286rem 0 0rem;
    display: flex;
    align-items: center;
    .warningImg {
      width: 1rem;
    }
    .text {
      margin-left: 0.5714rem;
      font-size: 1rem;
      color: #ffa500;
    }
  }
  .shown {
    visibility: visible;
  }
  .hidden {
    visibility: hidden;
  }
  .submitContainer {
    margin-top: 1.7143rem;
  }
  ${media.m} {
    max-width: initial;
    margin: 0 1.3333rem;
    .inputComp {
      margin-top: 0.4167rem;
    }
  }
`;

const LabelWithIcon = styled.div`
  display: inline-block;
  position: relative;
  color: #002e74;
  font-size: 1rem;
  line-height: 1.5714rem;
  width: 11rem;
  &.init {
    width: auto;
  }
  .labelIcon {
    color: #ff5599;
    font-size: 1rem;
    margin-right: 5px;
  }
  &.tabs {
    width: initial;
    color: inherit;
    font-size: inherit;
    .labelIcon {
      left: -7px;
    }
  }
`;
const TopContainer = styled.div`
  display: flex;
  background: #f5f6fa;
  flex-direction: row;
  align-items: stretch;

  .lineContainer {
    padding: 1.5714rem 0 0 0;
    border-bottom: 0.0714rem solid #e8e9ea;

    .firstLine {
      display: flex;
      align-items: center;
      position: relative;
    }

    .with-label {
      flex: 1;
    }

    .blankSpan {
      display: inline-block;
      width: 11rem;
    }

    .errorSpan,
    .warningSpan {
      display: inline-block;
      font-size: 0.8571rem;
      color: #e64e4e;
      line-height: 1.5714rem;
    }

    .warningSpan {
      color: #e68d4e;
    }

    &:last-child {
      border: none;
    }
  }

  ${media.m} {
    flex-direction: column;
  }

  .bodyContainer {
    flex: 1;
    box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
    border-radius: 0.3571rem;
    display: flex;
  }

  .first {
    flex-direction: column;
    flex-grow: 2;

    background: #fff;
    padding: 0 1.2857rem;
    margin-right: 1.7143rem;

    ${media.m} {
      margin-right: initial;
    }
  }

  .second {
    flex-direction: row;
    background: #f5f6fa;

    ${media.m} {
      margin-top: 1.0833rem;
    }
  }

  .innerContainer {
    flex: 1;
    width: 238px;
    background: #ffffff;
    box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
    border-radius: 0.3571rem;

    display: flex;
    align-items: center;
    padding: 2.8571rem 1.2857rem;

    ${media.m} {
      padding: 0.8333rem;
    }

    &.firstInner {
      display: none;
    }

    .itemContainer {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .item {
        div {
          display: flex;
          align-items: center;
        }

        .secondItem {
        }
      }

      .iconContainer {
        display: flex;
        background: #f1f4f6;
        border-radius: 0.2857rem;
        justify-content: center;
        align-items: center;
        width: 4.2857rem;
        height: 4.2857rem;

        ${media.m} {
          width: 3.6667rem;
          height: 3.6667rem;
        }
      }

      .iconTips {
        color: #97a3b4;
        line-height: 1.5714rem;
        font-size: 0.8571rem;
        margin-left: 1.4286rem;
      }
    }

    .labelIcon {
      width: 0.8571rem;
      height: 0.8571rem;
    }

    .labelText {
      margin-left: 0.3571rem;
      color: #002257;
      font-size: 1rem;

      &:hover {
        color: #0070ff;
      }

      ${media.m} {
        font-size: 1rem;
      }
    }

    .contractIcon {
      width: 2rem;
    }

    &:first-child {
      margin-right: 1.7143rem;

      ${media.m} {
        margin-right: 1.25rem;
      }
    }
  }
`;
