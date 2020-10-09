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
import iconContractRemove from './../../../images/contract/remove.png';
import iconContractUpload from './../../../images/contract/upload.png';
import { defaultContractIcon, defaultTokenIcon } from '../../../constants';
import { tranferToLowerCase } from '../../../utils';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/worker-json';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import Tabs from './../Tabs';
import { useCMContractCreate, useCMContractUpdate } from '../../../utils/api';
import SkelontonContainer from '../SkeletonContainer';
interface Props {
  contractDetail: any;
  type: string;
  history: any;
  address?: string;
  loading?: boolean;
}

const Wrapper = styled.div`
  background: #f5f6fa;
  padding-bottom: 8.3571rem;
  .inputComp {
    .input-wrapper {
      margin: 0;
      height: 1.5714rem;
      border: none;
      color: #97a3b4;
    }
  }
  .input-container.inputComp {
    width: 100%;
    height: 1.5714rem;
  }
  .submitInput {
    .input-wrapper {
      border: none;
      ${media.xl} {
        height: 2.2857rem;
      }
      ${media.s} {
        height: 2.6667rem;
      }
    }
  }
  .input-container.submitInput {
    height: 2.2857rem;
    width: 100%;
  }
  ${media.xl} {
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
  color: #0f1327;
  font-weight: bold;
  ${media.xl} {
    padding-top: 32px;
    margin-bottom: 24px;
    font-size: 24px;
  }
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
  ${media.xl} {
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
    padding-left: 1.2857rem;
    ${media.xl} {
      margin-right: 1.7143rem;
    }
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
    ${media.xl} {
      padding: 2.8571rem 1.2857rem;
    }
    ${media.s} {
      padding: 0.8333rem;
    }
    .itemContainer {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      ${media.xl} {
      }
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
        ${media.xl} {
          width: 4.2857rem;
          height: 4.2857rem;
        }

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
      ${media.xl} {
        font-size: 1rem;
      }
      ${media.s} {
        font-size: 1rem;
      }
    }
    .contractIcon {
      width: 2rem;
    }

    &:first-child {
      ${media.xl} {
        margin-right: 1.7143rem;
      }
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
  ${media.xl} {
    margin-top: 2.3571rem;
  }
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
    ${media.xl} {
      margin-left: 0.3571rem;
    }
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
    ${media.xl} {
      width: 10rem;
    }
    ${media.s} {
      width: 7.0833rem;
    }
  }
`;
interface RequestBody {
  [key: string]: any;
}
export const Contract = ({
  contractDetail,
  type,
  history,
  address,
  loading,
}: Props) => {
  const { t } = useTranslation();
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
  const { data: dataResCreated } = useCMContractCreate(
    requestParams,
    shouldFetchCreate,
  );
  const { data: dataResUpdated } = useCMContractUpdate(
    requestParams,
    shouldFetchUpdate,
  );
  if (dataResCreated && dataResCreated['code'] === 0) {
    //TODO: modify the router
    history.replace('/');
  }
  if (dataResUpdated && dataResUpdated['code'] === 0) {
    //TODO: modify the router
    history.replace('/');
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
    setTokenImgSrc(contractDetail.tokenIcon);
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
    bodyParams.tokenIcon = tokenImgSrc;
    bodyParams.sourceCode = sourceCode;
    bodyParams.abi = abi;
    bodyParams.password = password;
    setReuqestParams(bodyParams);
    switch (type) {
      case 'create':
        setShouldFetchCreate(true);
        break;
      case 'edit':
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
                    src={iconContractUpload}
                    className="labelIcon"
                    alt={t(translations.contract.contractIcon)}
                  ></img>
                  <span className="labelText">
                    {t(translations.contract.contractIcon)}
                  </span>
                </div>
                <div className="secondItem" onClick={removeContractIcon}>
                  <img
                    src={iconContractRemove}
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
                    src={iconContractUpload}
                    className="labelIcon"
                    alt="upload"
                  ></img>
                  <span className="labelText">
                    {t(translations.contract.tokenIcon)}
                  </span>
                </div>
                <div className="secondItem" onClick={removeTokenIcon}>
                  <img
                    src={iconContractRemove}
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
          <Input.Password
            className="submitInput"
            style={inputStyle}
            value={password}
            onChange={passwordChangeHandle}
          ></Input.Password>
        </div>
        <div className="submitRightContainer">
          <Button
            variant="solid"
            color="primary"
            className="submitBtn"
            style={submitBtnStyle}
            onClick={submitClick}
            disabled={btnShouldClick}
          >
            {t(translations.general.submit)}
          </Button>
        </div>
      </SubmitContainer>
    </Wrapper>
  );
};
