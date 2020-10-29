/**
 *
 * Contract Detail
 *
 */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { media, useBreakpoint } from '../../../styles/media';
import { Input, Button } from '@cfxjs/react-ui';
import { defaultContractIcon, defaultTokenIcon } from '../../../constants';
import { tranferToLowerCase } from '../../../utils';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import { Tabs } from './../Tabs';
import { useCMContractCreate } from '../../../utils/api';
import SkelontonContainer from '../SkeletonContainer';
import { useHistory } from 'react-router-dom';
interface Props {
  contractDetail: any;
  type: string;
  address?: string;
  loading?: boolean;
}

interface RequestBody {
  [key: string]: any;
}
export const Contract = ({ contractDetail, type, address, loading }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [addressVal, setAddressVal] = useState('');
  const [contractName, setContractName] = useState('');
  const [site, setSite] = useState('');
  const [contractImgSrc, setContractImgSrc] = useState('');
  const [tokenImgSrc, setTokenImgSrc] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [abi, setAbi] = useState('');
  const fileContractInputRef = React.createRef<any>();
  const fileTokenInputRef = React.createRef<any>();
  const [password, setPassword] = useState('');
  const [btnShouldClick, setBtnShouldClick] = useState(true);
  const [addressDisabled, setAddressDisabled] = useState(true);
  const breakpoint = useBreakpoint();
  const [btnLoading, setBtnLoading] = useState(false);
  let submitBtnStyle;
  if (breakpoint === 's') {
    submitBtnStyle = { height: '2.6667rem', lineHeight: '2.6667rem' };
  } else {
    submitBtnStyle = { height: '2.2857rem', lineHeight: '2.2857rem' };
  }
  const inputStyle = { margin: '0' };
  const [shouldFetchCreate, setShouldFetchCreate] = useState(false);
  const [shouldFetchUpdate, setShouldFetchUpdate] = useState(false);
  const [requestParams, setReuqestParams] = useState({});
  let { data: dataResCreated } = useCMContractCreate(
    requestParams,
    shouldFetchCreate,
  );
  let { data: dataResUpdated } = useCMContractCreate(
    requestParams,
    shouldFetchUpdate,
  );
  if (dataResCreated) {
    setShouldFetchCreate(false);
    dataResCreated = undefined;
    setBtnLoading(false);
    // setToast({
    //   text:t(translations.general.submitSucceed),
    //   type:'success'
    // })
    history.push(`/address/${tranferToLowerCase(addressVal)}`);
  }
  if (dataResUpdated) {
    setShouldFetchUpdate(false);
    setBtnLoading(false);
    dataResUpdated = undefined;
    // setToast({
    //   text:t(translations.general.submitSucceed),
    //   type:'success'
    // })
    history.push(`/address/${tranferToLowerCase(addressVal)}`);
  }
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

  const updateCanSubmit = useCallback(() => {
    let isSubmitable = false;
    if (addressVal && contractName && sourceCode && abi && password) {
      isSubmitable = true;
    }
    setBtnShouldClick(!isSubmitable);
  }, [abi, addressVal, contractName, password, sourceCode]);
  useEffect(() => {
    setContractImgSrc(contractDetail.icon);
    setTokenImgSrc(contractDetail.token && contractDetail.token.icon);
    setContractName(contractDetail.name);
    setSourceCode(contractDetail.sourceCode);
    setAbi(contractDetail.abi);
    setSite(contractDetail.website);
    switch (type) {
      case 'create':
        setAddressVal(address || '');
        setTitle(t(translations.contract.create.title));
        setAddressDisabled(false);
        break;
      case 'edit':
        setAddressVal(contractDetail.address);
        setTitle(t(translations.contract.edit.title));
        setAddressDisabled(true);
        break;
    }
  }, [
    address,
    contractDetail.abi,
    contractDetail.address,
    contractDetail.icon,
    contractDetail.name,
    contractDetail.sourceCode,
    contractDetail.token,
    contractDetail.tokenIcon,
    contractDetail.website,
    t,
    type,
  ]);
  useEffect(() => {
    updateCanSubmit();
  }, [
    type,
    addressVal,
    contractName,
    site,
    sourceCode,
    abi,
    password,
    updateCanSubmit,
  ]);
  const uploadContractIcon = () => {
    fileContractInputRef.current.click();
  };
  const removeContractIcon = () => {
    setContractImgSrc('');
  };
  const removeTokenIcon = () => {
    setTokenImgSrc('');
  };
  const uploadTokenIcon = () => {
    fileTokenInputRef.current.click();
  };

  const passwordChangeHandle = e => {
    setPassword(e.target.value);
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
      reader.onloadend = () => {
        setContractImgSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };
  const handleTokenIconChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        setTokenImgSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };
  const submitClick = () => {
    const bodyParams: RequestBody = {};
    bodyParams.address = tranferToLowerCase(addressVal);
    bodyParams.name = contractName;
    bodyParams.website = site;
    bodyParams.icon = contractImgSrc;
    bodyParams.typeCode = 1;
    if (tokenImgSrc) {
      bodyParams.token = {};
      bodyParams.token.icon = tokenImgSrc;
    }
    bodyParams.sourceCode = sourceCode;
    bodyParams.abi = abi;
    bodyParams.password = password;
    setReuqestParams(bodyParams);
    switch (type) {
      case 'create':
        setBtnLoading(true);
        setShouldFetchCreate(true);
        break;
      case 'edit':
        setBtnLoading(true);
        setShouldFetchUpdate(true);
        break;
    }
  };
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

  return (
    <Wrapper>
      <Header>{title}</Header>
      <TopContainer>
        <div className="bodyContainer first">
          <div className="lineContainer">
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
              />
            </SkelontonContainer>
          </div>
          <div className="lineContainer">
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
              />
            </SkelontonContainer>
          </div>
          <div className="lineContainer">
            <LabelWithIcon>{t(translations.contract.site)}</LabelWithIcon>
            <SkelontonContainer shown={loading}>
              <Input
                className="inputComp"
                defaultValue={site}
                style={inputStyle}
                onChange={siteInputChanger}
              />
            </SkelontonContainer>
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
                    src="/contract/upload.svg"
                    className="labelIcon"
                    alt={t(translations.contract.contractIcon)}
                  ></img>
                  <span className="labelText">
                    {t(translations.contract.contractIcon)}
                  </span>
                </div>
                <div className="secondItem" onClick={removeContractIcon}>
                  <img
                    src="/contract/remove.svg"
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
                    src="/contract/upload.svg"
                    className="labelIcon"
                    alt="upload"
                  ></img>
                  <span className="labelText">
                    {t(translations.contract.tokenIcon)}
                  </span>
                </div>
                <div className="secondItem" onClick={removeTokenIcon}>
                  <img
                    src="/contract/remove.svg"
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
      </TopContainer>
      <TabContainer>
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
      <SubmitContainer>
        <div className="submitLeftContainer">
          <LabelWithIcon className="init">
            <span className="labelIcon">*</span>
            {t(translations.contract.enterPassword)}
          </LabelWithIcon>
          <Input
            className="submitInput"
            style={inputStyle}
            value={password}
            onChange={passwordChangeHandle}
          ></Input>
        </div>
        <div className="submitRightContainer">
          <Button
            variant="solid"
            color="primary"
            className="submitBtn"
            style={submitBtnStyle}
            onClick={submitClick}
            disabled={btnShouldClick}
            loading={btnLoading}
          >
            {t(translations.general.submit)}
          </Button>
        </div>
      </SubmitContainer>
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
    display: flex;
    align-items: center;
    padding: 0.8571rem 0.3571rem 0.8571rem 0;
    border-bottom: 0.0714rem solid #e8e9ea;
    .with-label {
      flex: 1;
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
          margin-top: 0.5714rem;
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
  width: '100%',
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
    margin: 2.7857rem 1.2857rem 0.3571rem 1.2857rem;
    height: 1px;
    background: #e8e9ea;
  }
`;
const TabContainer = styled.div`
  margin-top: 2.3571rem;

  ${media.s} {
    margin-top: 2rem;
  }
`;
const SubmitContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.7143rem;
  ${media.s} {
    align-items: flex-end;
  }
  .submitLeftContainer {
    ${media.s} {
      display: flex;
      flex-direction: column;
    }
  }
  .submitRightContainer {
    display: flex;
    align-items: flex-end;
  }
  .submitInput {
    margin-left: 0.3571rem;
    ${media.s} {
      margin-top: 0.3333rem;
      width: 100%;
      margin-left: initial;
    }
  }
  .submitBtn {
    height: 2.2857rem;
  }
  .btn.submitBtn {
    min-width: initial;
    width: 10rem;
    ${media.s} {
      width: 7.0833rem;
    }
  }
`;
