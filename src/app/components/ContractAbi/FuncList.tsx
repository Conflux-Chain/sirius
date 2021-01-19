import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import Func from './Func';
import { translations } from '../../../locales/i18n';
interface FuncListProps {
  type?: string;
  data?: object[];
  contractAddress: string;
  contract: object;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof FuncListProps>;
export declare type Props = FuncListProps & NativeAttrs;
const { Panel } = Collapse;
const FuncList = ({ type, data, contractAddress, contract }: Props) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState([]);
  const allKeys: string[] = [];
  data?.forEach(function (value, index) {
    allKeys.push(index + '-' + value['name']);
  });
  const clickHandler = () => {
    if (activeKey.length === 0) {
      setActiveKey(allKeys as any);
    } else {
      setActiveKey([] as any);
    }
  };
  const reset = () => {
    setActiveKey([] as any);
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
            <span className="btn" onClick={reset}>
              {t(translations.contract.reset)}{' '}
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
                header={`${index + 1}.${item['name']}`}
                key={`${index}-${item['name']}`}
                className="panelContainer"
              >
                <Func
                  data={item}
                  type={type}
                  contractAddress={contractAddress}
                  contract={contract}
                  key={`${index}-${item['name']}`}
                ></Func>
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
        padding-left: 0;
      }
      .ant-collapse-content-box {
        padding: 0;
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
    margin-left: 12px;
  }
`;
export default FuncList;
