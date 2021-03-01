/**
 *
 * Contract Detail
 *
 */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { media } from '../../../styles/media';
import { Input } from '@cfxjs/react-ui';
import { defaultContractIcon, defaultTokenIcon } from '../../../constants';
import {
  tranferToLowerCase,
  isContractAddress,
  validURL,
  byteToKb,
  isObject,
  isInnerContractAddress,
} from '../../../utils';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { Tabs } from './../Tabs';
import { reqContract, reqToken } from '../../../utils/httpRequest';
import SkelontonContainer from '../SkeletonContainer';
import imgRemove from 'images/contract/remove.svg';
import imgUpload from 'images/contract/upload.svg';
import imgWarning from 'images/warning.png';
import { usePortal } from 'utils/hooks/usePortal';
import { DappButton } from '../DappButton/Loadable';
import { useMessages } from '@cfxjs/react-ui';
import { packContractAndToken } from '../../../utils/contractManagerTool';
import { contractManagerAddress, formatAddress } from '../../../utils/cfx';
import { TxnAction } from '../../../utils/constants';
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
  'abi',
  'bytecode',
  'icon',
  'sourceCode',
  'typeCode',
];
export const Contract = ({ contractDetail, type, address, loading }: Props) => {
  const { t } = useTranslation();
  const { connected, accounts } = usePortal();
  const [, setMessage] = useMessages();
  const [title, setTitle] = useState('');
  const [addressVal, setAddressVal] = useState('');
  const [contractName, setContractName] = useState('');
  const [site, setSite] = useState('');
  const [contractImgSrc, setContractImgSrc] = useState('');
  const [tokenImgSrc, setTokenImgSrc] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [abi, setAbi] = useState('');
  const [btnShouldClick, setBtnShouldClick] = useState(true);
  const [addressDisabled, setAddressDisabled] = useState(true);
  const [errorMsgForAddress, setErrorMsgForAddress] = useState('');
  const [errorMsgForName, setErrorMsgForName] = useState('');
  const [errorMsgForSite, setErrorMsgForSite] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [isAddressError, setIsAddressError] = useState(true);
  const [isAdminError, setIsAdminError] = useState(true);
  const [isErc20Error, setIsErc20Error] = useState(true);
  const [isNameError, setIsNameError] = useState(true);
  const [isSiteError, setIsSiteError] = useState(false);
  const [isSourceCodeError, setIsSourceCodeError] = useState(true);
  const [isAbiError, setIsAbiError] = useState(true);
  const [txData, setTxData] = useState('');
  const fileContractInputRef = React.createRef<any>();
  const fileTokenInputRef = React.createRef<any>();
  const fileJsonInputRef = React.createRef<any>();
  const inputStyle = { margin: '0 0.2857rem' };
  const displayNone = {
    display: 'none',
  };
  const addressInputChanger = e => {
    setAddressVal(e.target.value);
  };

  const nameInputChanger = e => {
    setContractName(e.target.value);
  };

  const siteInputChanger = e => {
    setSite(e.target.value);
  };

  // store txn action name for wallet plugin history
  let txnAction = TxnAction.default;
  if (type === 'create') {
    txnAction = TxnAction.contractWrite;
  } else if (type === 'edit') {
    txnAction = TxnAction.contractEdit;
  }

  useEffect(() => {
    setContractImgSrc(contractDetail.icon || '');
    setTokenImgSrc(contractDetail.token && contractDetail.token.icon);
    setContractName(contractDetail.name || '');
    setSourceCode(contractDetail.sourceCode || '');
    setAbi(contractDetail.abi || '');
    setSite(contractDetail.website || '');
    switch (type) {
      case 'create':
        setAddressVal(address || '');
        setTitle(t(translations.contract.create.title));
        setAddressDisabled(false);
        break;
      case 'edit':
        setAddressVal(formatAddress(contractDetail.address));
        setTitle(t(translations.contract.edit.title));
        setAddressDisabled(true);
        checkAdminThenToken(contractDetail.token && contractDetail.token.icon);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    address,
    contractDetail.abi,
    contractDetail.address,
    contractDetail.icon,
    contractDetail.name,
    contractDetail.sourceCode,
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
          !isSiteError &&
          !isSourceCodeError &&
          !isAbiError
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
      sourceCode,
      abi,
      contractImgSrc,
      tokenImgSrc,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      accounts[0],
      isAddressError,
      isAdminError,
      isErc20Error,
      isNameError,
      isSiteError,
      isSourceCodeError,
      isAbiError,
    ],
  );

  const addressOnBlur = () => {
    checkAdminThenToken(tokenImgSrc);
  };
  function checkContractName() {
    if (contractName) {
      if (contractName.length > 35) {
        setIsNameError(true);
        setErrorMsgForName('contract.invalidNameTag');
      } else {
        setIsNameError(false);
        setErrorMsgForName('');
      }
    } else {
      setIsNameError(true);
      setErrorMsgForName('');
    }
  }
  useEffect(() => {
    checkAdminThenToken(tokenImgSrc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressVal]);

  const nameOnBlur = () => {
    checkContractName();
  };
  useEffect(() => {
    checkContractName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractName]);

  const siteOnBlur = () => {
    checkSite();
  };
  useEffect(() => {
    checkSite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site]);
  useEffect(() => {
    if (sourceCode) {
      setIsSourceCodeError(false);
    } else {
      setIsSourceCodeError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceCode]);
  useEffect(() => {
    if (abi) {
      setIsAbiError(false);
    } else {
      setIsAbiError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abi]);
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

  const handleSourceChange = code => {
    setSourceCode(code);
  };
  const abiChangeHandler = abi => {
    setAbi(abi);
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
  const handleJsonChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        try {
          let jsonContent = JSON.parse(reader.result as string);
          if (Array.isArray(jsonContent)) {
            setAbi(JSON.stringify(jsonContent));
          } else {
            if (isObject(jsonContent)) {
              if (jsonContent.abi && Array.isArray(jsonContent.abi)) {
                setAbi(JSON.stringify(jsonContent.abi));
              } else {
                setMessage({
                  text: t('contract.invalidJsonAbi'),
                  color: 'error',
                });
              }
            } else {
              setMessage({
                text: t('contract.invalidJsonAbi'),
                color: 'error',
              });
            }
          }
        } catch (error) {
          setMessage({ text: t('contract.invalidJsonFile'), color: 'error' });
        }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };
  function getTxData() {
    const bodyParams: RequestBody = {};
    bodyParams.address = formatAddress(tranferToLowerCase(addressVal));
    bodyParams.name = contractName;
    bodyParams.website = site;
    bodyParams.icon = contractImgSrc;
    if (tokenImgSrc) {
      bodyParams.tokenIcon = tokenImgSrc;
    } else {
      bodyParams.tokenIcon = '';
    }
    bodyParams.sourceCode = sourceCode;
    bodyParams.abi = abi;
    const data = packContractAndToken(bodyParams);
    return data[0];
  }
  function checkAdminThenToken(tokenIcon) {
    if (addressVal) {
      if (isContractAddress(addressVal) || isInnerContractAddress(addressVal)) {
        setIsAddressError(false);
        setErrorMsgForAddress('');
        if (accounts[0]) {
          reqContract({ address: addressVal, fields: fieldsContract })
            .then(dataContractInfo => {
              // cip-37 both
              if (
                dataContractInfo.from === accounts[0] ||
                dataContractInfo.admin === accounts[0] ||
                formatAddress(dataContractInfo.from, { hex: true }) ===
                  formatAddress(accounts[0], { hex: true }) ||
                formatAddress(dataContractInfo.admin, { hex: true }) ===
                  formatAddress(accounts[0], { hex: true })
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
      setErrorMsgForAddress('');
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
  //TODO: modity the types of div to RreactNode
  let tabsLabelSourceCode = (
    <LabelWithIcon className="tabs">
      <span className="labelIcon">*</span>
      {t(translations.contract.sourceCode)}
    </LabelWithIcon>
  ) as any;
  //TODO: modity the types of div to RreactNode
  let tabsLabelAbi = (
    <LabelWithIcon className="tabs">
      <span className="labelIcon">*</span>
      {t(translations.contract.abi)}
    </LabelWithIcon>
  ) as any;
  const importClick = () => {
    fileJsonInputRef.current.click();
  };
  return (
    <Wrapper>
      <Header>{title}</Header>
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
                  readOnly={addressDisabled}
                  placeholder={t(translations.contract.addressPlaceholder)}
                  onBlur={addressOnBlur}
                />
              </SkelontonContainer>
            </div>
            <div>
              <span className="blankSpan"></span>
              <span className="errorSpan">{t(errorMsgForAddress)}</span>
            </div>
          </div>
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
        </div>
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
                  <img src={imgUpload} className="labelIcon" alt="upload"></img>
                  <span className="labelText">
                    {t(translations.contract.tokenIcon)}
                  </span>
                </div>
                <div className="iconTips">
                  {t(translations.contract.maxSize)}
                </div>
                <div className="secondItem" onClick={removeTokenIcon}>
                  <img src={imgRemove} className="labelIcon" alt="remove"></img>
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
      </TopContainer>
      <TabContainer>
        <div className="jsonContainer">
          <input
            type="file"
            name="File"
            style={displayNone}
            accept=".json"
            ref={fileJsonInputRef}
            onChange={handleJsonChange}
          />
          <span className="text" onClick={importClick}>
            {t(translations.contract.importJsonFile)}
          </span>
        </div>
        <Tabs initialValue="1">
          <Tabs.Item label={tabsLabelSourceCode} value="1">
            <SkelontonContainer shown={loading}>
              <StyledTabelWrapper>
                <div className="ui fluid card">
                  <div className="content">
                    <div className="contentHeader" />
                    <AceEditor
                      style={AceEditorStyle}
                      mode="solidity"
                      theme="github"
                      name="UNIQUE_ID_OF_DIV"
                      setOptions={{
                        showLineNumbers: true,
                      }}
                      fontSize="1rem"
                      showGutter={false}
                      showPrintMargin={false}
                      onChange={handleSourceChange}
                      value={sourceCode}
                    />
                  </div>
                </div>
              </StyledTabelWrapper>
            </SkelontonContainer>
          </Tabs.Item>
          <Tabs.Item label={tabsLabelAbi} value="2">
            <SkelontonContainer shown={loading}>
              <StyledTabelWrapper>
                <div className="ui fluid card">
                  <div className="content abiContainer">
                    <div className="contentHeader" />
                    <AceEditor
                      style={AceEditorStyle}
                      mode="json"
                      theme="github"
                      name="UNIQUE_ID_OF_DIV_ABI"
                      setOptions={{
                        showLineNumbers: true,
                      }}
                      fontSize="1rem"
                      showGutter={false}
                      showPrintMargin={false}
                      onChange={abiChangeHandler}
                      value={abi}
                    />
                  </div>
                </div>
              </StyledTabelWrapper>
            </SkelontonContainer>
          </Tabs.Item>
        </Tabs>
      </TabContainer>
      <div className="submitContainer">
        <DappButton
          contractAddress={contractManagerAddress}
          data={txData}
          btnDisabled={!btnShouldClick}
          hoverText={
            connected === 0
              ? t(translations.contract.beforeContractSubmitTip)
              : ''
          }
          txnAction={txnAction}
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
  padding-bottom: 8.3571rem;
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
      ${media.s} {
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
    margin-top: 0.5714rem;
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
  ${media.s} {
    max-width: initial;
    margin: 0 1.3333rem;
    .inputComp {
      margin-top: 0.4167rem;
    }
  }
`;
const Header = styled.div`
  color: #1a1a1a;
  font-weight: bold;
  padding-top: 2.2857rem;
  margin-bottom: 1.7143rem;
  font-size: 1.7143rem;
  ${media.s} {
    padding-top: 1rem;
    margin-bottom: 1.6667rem;
    font-size: 1.5rem;
  }
`;
const LabelWithIcon = styled.div`
  display: inline-block;
  position: relative;
  color: #002e74;
  font-size: 1rem;
  line-height: 1.5714rem;
  width: 9.4286rem;
  &.init {
    width: auto;
  }
  .labelIcon {
    position: absolute;
    left: -0.3571rem;
    top: -0.0714rem;
    color: #ff5599;
    font-size: 1rem;
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
  .lineContainer {
    padding: 1.7857rem 0 0 0;
    border-bottom: 0.0714rem solid #e8e9ea;
    .firstLine {
      display: flex;
      align-items: center;
    }
    .with-label {
      flex: 1;
    }
    .blankSpan {
      display: inline-block;
      width: 9.4286rem;
    }
    .errorSpan {
      display: inline-block;
      font-size: 0.8571rem;
      color: #e64e4e;
      line-height: 1.5714rem;
    }
    &:last-child {
      border: none;
    }
  }

  ${media.s} {
    flex-direction: column;
    .lineContainer {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem 0;
      border-bottom: 1px solid #e8e9ea;
      .with-label {
        width: 100%;
      }
      &:last-child {
        border: none;
      }
    }
  }
  .bodyContainer {
    flex: 1;
    box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
    border-radius: 0.3571rem;
    display: flex;
  }
  .first {
    flex-direction: column;

    background: #fff;
    padding: 0 1.2857rem;
    margin-right: 1.7143rem;
    ${media.s} {
      margin-right: initial;
    }
  }
  .second {
    flex-direction: row;
    background: #f5f6fa;
    ${media.s} {
      margin-top: 1.0833rem;
    }
  }
  .innerContainer {
    flex: 1;
    background: #ffffff;
    box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
    border-radius: 0.3571rem;

    display: flex;
    align-items: center;
    padding: 2.8571rem 1.2857rem;
    ${media.s} {
      padding: 0.8333rem;
    }
    .itemContainer {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      ${media.s} {
      }
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
        ${media.s} {
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
      ${media.s} {
        font-size: 1rem;
      }
    }
    .contractIcon {
      width: 2rem;
    }

    &:first-child {
      margin-right: 1.7143rem;
      ${media.s} {
        margin-right: 1.25rem;
      }
    }
  }
`;
const AceEditorStyle = {
  width: 'initial',
  backgroundColor: '#F8F9FB',
  opacity: 0.62,
  margin: '0 1.2857rem 1.7143rem 1.2857rem',
};
const StyledTabelWrapper = styled.div`
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
  border-radius: 0.3571rem;
  .content {
  }
  thead tr th {
    background: rgba(0, 0, 0, 0.05) !important;
  }
  tr th {
    padding: 1.1429rem 1.4286rem !important;
    padding-right: 0 !important;
    &:last-of-type {
      padding: 1.1429rem 1.1429rem !important;
      padding-right: 0 !important;
    }
    &.right-pad {
      padding-right: 1.1429rem !important;
    }
  }
  &.right {
    margin-left: 1.1429rem;
  }
  .abiContainer {
    border: none;
  }
  .contentHeader {
    margin: 2.8571rem 1.2857rem 0 1.2857rem;
    height: 1px;
    background: #e8e9ea;
  }
`;
const TabContainer = styled.div`
  margin-top: 2.3571rem;
  position: relative;
  .jsonContainer {
    position: absolute;
    right: 0;
    top: 1rem;
    ${media.s} {
      display: none;
    }
    .text {
      display: inline-block;
      color: #1e3de4;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.2857rem;
      border-bottom: 2px solid #1e3de4;
    }
  }
  ${media.s} {
    margin-top: 2rem;
  }
`;
