import React, { useState } from 'react';
import { Collapse } from '@cfxjs/antd';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Func from './Func';
import { translations } from 'locales/i18n';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { AbiItem } from '@cfxjs/sirius-next-common/dist/utils/sdk';

export interface FuncDataItem {
  name: string;
  signature?: string;
}

interface FuncListProps {
  type?: string;
  data?: FuncDataItem[];
  contractAddress: string;
  contract: object;
  abi: AbiItem[];
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof FuncListProps>;
export declare type Props = FuncListProps & NativeAttrs;
const { Panel } = Collapse;

const FuncHeader = ({ index, item }: { index: number; item: FuncDataItem }) => {
  return (
    <FuncHeaderComp>
      <span>{index + 1}.</span>
      <span>{item.name}</span>
      {item.signature && (
        <div className="signature" onClick={e => e.stopPropagation()}>
          <span>{item.signature}</span>
          <CopyButton copyText={item.signature} color="#737682" size={14} />
        </div>
      )}
    </FuncHeaderComp>
  );
};

const FuncList = ({ abi, type, data, contractAddress, contract }: Props) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState([]);
  const allKeys: string[] = [];
  data?.forEach(function (value, index) {
    allKeys.push(`${type}-${index}-${value.name}`);
  });
  const clickHandler = () => {
    if (activeKey.length === 0) {
      setActiveKey(allKeys as any);
    } else {
      setActiveKey([] as any);
    }
  };
  const changeHandler = key => {
    setActiveKey(key);
  };

  return (
    <>
      <Container>
        <HeaderComp>
          <div className="label">{`${
            type === 'read'
              ? t(translations.contract.readContractInformation)
              : t(translations.contract.writeContractInformation)
          }`}</div>
          <div>
            <span className="btn" onClick={clickHandler}>
              {activeKey.length === 0
                ? t(translations.contract.expandAll)
                : t(translations.contract.collapseAll)}{' '}
            </span>
          </div>
        </HeaderComp>
        <Collapse
          expandIconPosition="right"
          className="collapseContainer"
          activeKey={activeKey}
          onChange={changeHandler}
          expandIcon={({ isActive }) => (
            <DownOutlined rotate={isActive ? 180 : 0} />
          )}
        >
          {data &&
            data.map((item, index) => (
              <Panel
                header={<FuncHeader index={index} item={item} />}
                key={`${type}-${index}-${item.name}`}
                className="panelContainer"
              >
                <Func
                  data={item}
                  type={type}
                  contractAddress={contractAddress}
                  contract={contract}
                  key={`${type}-${index}-func-${item.name || index}`}
                  id={`${type}-${index}-func-${item.name || index}`}
                  abi={abi}
                />
              </Panel>
            ))}
        </Collapse>
      </Container>
    </>
  );
};
const HeaderComp = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  line-height: 45px;
  border-bottom: 1px solid #ebeced;
  .label {
    color: #74798c;
  }
`;
const FuncHeaderComp = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  .signature {
    padding: 2px 14px;
    border-radius: 20px;
    background-color: rgba(119, 137, 211, 0.08);
    display: flex;
    align-items: center;
    gap: 8px;
    color: #282d30;
    font-size: 14px;
    font-weight: 450;
    line-height: 22px;
  }
`;
const Container = styled.div`
  width: 100%;
  .collapseContainer {
    background-color: transparent;
    border: none;
    .panelContainer {
      .ant-collapse-header {
        color: #002257;
        font-size: 14px;
        line-height: 22px;
        padding-left: 12px;
        background-color: #f9fafb;
      }
      .ant-collapse-content-box {
        padding: 0;
      }
    }
    .panelContainer:nth-child(2n) {
      .ant-collapse-header {
        background-color: #fff;
      }
    }
  }
  .btn {
    display: inline-block;
    height: 22px;
    font-size: 14px;
    color: #1e3de4;
    line-height: 22px;
    cursor: pointer;
    font-weight: 400;
    margin-right: 12px;
  }
`;
export default FuncList;
