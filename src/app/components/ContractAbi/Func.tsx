import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { Button, Tooltip, Modal } from '@cfxjs/react-ui';
import { useConfluxPortal } from '@cfxjs/react-hooks';
import BigNumber from 'bignumber.js';
import lodash from 'lodash';
import FuncBody from './FuncBody';
import ParamTitle from './ParamTitle';
import ParamInput from './ParamInput';
import OutputParams from './OutputParams';
import FuncResponse from './FuncResponse';
import OutputItem from './OutputItem';
import Error from './Error';
import Loading from '../../components/Loading';
import imgSuccessBig from 'images/success_big.png';
import imgRejected from 'images/rejected.png';
import { translations } from '../../../locales/i18n';
import {
  isAddress,
  checkInt,
  checkUint,
  getEllipsStr,
  checkBytes,
  checkCfxType,
} from '../../../utils';
interface FuncProps {
  type?: string;
  data: object;
  contractAddress: string;
  contract: object;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof FuncProps>;
export declare type Props = FuncProps & NativeAttrs;

const Func = ({ type, data, contractAddress, contract }: Props) => {
  const { t } = useTranslation();
  const { portalInstalled, address, login, confluxJS } = useConfluxPortal();
  const [modalShown, setModalShown] = useState(false);
  const [modalType, setModalType] = useState('');
  const [txHash, setTxHash] = useState('');
  const [outputShown, setOutputShown] = useState(false);
  const [outputValue, setOutputValue] = useState({});
  const [outputError, setOutputError] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const inputs = (data && data['inputs']) || [];
  const outputs = (data && data['outputs']) || [];
  const inputsLength = inputs.length;
  useEffect(() => {
    if (data['value']) {
      setOutputValue(data['value']);
      setOutputShown(true);
    } else {
      setOutputShown(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  useEffect(() => {
    if (type === 'write') {
      if (address) {
        setHoverText('');
      } else {
        setHoverText(t(translations.contract.connectPortalFirst));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, address]);
  const onFinish = async values => {
    const newValues = lodash.clone(values);
    const items: object[] = Object.values(newValues);
    const objValues: any[] = [];
    items.forEach(function (value, index) {
      if (value['type'] === 'bool') {
        let val = value['val'];
        if (val === 'true' || val === '1') {
          value['val'] = true;
        } else if (val === 'false' || val === '0') {
          value['val'] = false;
        }
      }
      objValues.push(value['val']);
    });
    switch (type) {
      case 'read':
        try {
          setQueryLoading(true);
          const res = await contract[data['name']](...objValues);
          setOutputError('');
          setQueryLoading(false);
          if (data['outputs'].length === 1) {
            let arr: any[] = [];
            arr.push(res);
            setOutputValue(arr);
          } else {
            setOutputValue(Object.values(res));
          }
          // setOutputValue(res)
          setOutputShown(true);
        } catch (error) {
          setQueryLoading(false);
          setOutputShown(false);
          setOutputError(error.message);
        }
        break;
      case 'write':
        if (!portalInstalled) {
          useConfluxPortal.openHomePage();
        } else {
          if (address) {
            let objParams: any[] = [];
            let txParams = {
              from: address,
              to: contractAddress,
            };
            if (data['stateMutability'] === 'payable') {
              objParams = objValues.slice(1);
              txParams['value'] = new BigNumber(objValues[0])
                .multipliedBy(10 ** 18)
                .toFixed();
            } else {
              objParams = objValues;
            }
            setOutputError('');
            try {
              const { data: txData } = contract[data['name']](...objParams);
              txParams['data'] = txData;
              //loading
              setModalType('loading');
              setModalShown(true);
              confluxJS
                .sendTransaction(txParams)
                .then(txHash => {
                  //success alert
                  setModalType('success');
                  setTxHash(txHash);
                  setOutputError('');
                })
                .catch(error => {
                  //rejected alert
                  setModalType('fail');
                  setOutputError(error.message || '');
                });
            } catch (error) {
              setOutputError(error.message || '');
            }
          } else {
            login();
          }
        }

        break;
      default:
        break;
    }
  };
  const closeHandler = () => {
    setModalShown(false);
  };
  function getValidator(type: string) {
    const check = (_: any, value) => {
      const val = value['val'];
      if (type === 'address') {
        if (isAddress(val)) {
          return Promise.resolve();
        }
        return Promise.reject(t(translations.contract.error.address));
      } else if (type === 'bool') {
        if (
          ['true', 'false', '0', '1'].indexOf(val) !== -1 ||
          lodash.isBoolean(val)
        ) {
          return Promise.resolve();
        }
        return Promise.reject(t(translations.contract.error.bool));
      } else if (type === 'string') {
        return Promise.resolve();
      } else if (type.startsWith('int')) {
        const [isInt, min, max] = checkInt(val, type);
        if (isInt) {
          return Promise.resolve();
        }
        return Promise.reject(t(translations.contract.error.int, { min, max }));
      } else if (type.startsWith('uint')) {
        const [isUint, min, max] = checkUint(val, type);
        if (isUint) {
          return Promise.resolve();
        }
        return Promise.reject(
          t(translations.contract.error.uint, { min, max }),
        );
      } else if (type.startsWith('byte')) {
        const [isBytes, num] = checkBytes(val, type);
        if (isBytes) {
          return Promise.resolve();
        }
        if (num === 0) {
          return Promise.reject(t(translations.contract.error.bytes));
        } else {
          return Promise.reject(
            t(translations.contract.error.bytesM, { length: num as number }),
          );
        }
      } else if (type === 'cfx') {
        if (checkCfxType(val)) {
          return Promise.resolve();
        }
        return Promise.reject(t(translations.contract.error.cfx));
      }
    };
    return check;
  }

  const btnComp =
    type === 'read' ? (
      <Button
        htmlType="submit"
        variant="solid"
        color="primary"
        className="btnComp"
        loading={queryLoading}
      >
        {t(translations.contract.query)}
      </Button>
    ) : (
      <Button
        htmlType="submit"
        variant="solid"
        color="primary"
        className="btnComp"
      >
        {t(translations.contract.write)}
      </Button>
    );
  const openTx = () => {
    window.open(`${window.location.origin}/transaction/${txHash}`);
  };
  return (
    <Container>
      <Form
        onFinish={onFinish}
        validateTrigger={['onBlur']}
        className="formContainer"
      >
        <FuncBody>
          {inputsLength > 0
            ? inputs.map((inputItem, index) => (
                <>
                  <ParamTitle
                    name={inputItem.name}
                    type={inputItem.type}
                  ></ParamTitle>
                  <Form.Item
                    name={inputItem.name + index}
                    rules={[{ validator: getValidator(inputItem.type) }]}
                    key={inputItem.name + index}
                  >
                    {/* <Input
                      placeholder={getPlaceholder(inputItem.type)}
                      className="inputComp"
                      key={inputItem.name + index}
                    /> */}
                    <ParamInput
                      type={inputItem.type}
                      key={inputItem.name + index}
                    ></ParamInput>
                  </Form.Item>
                </>
              ))
            : null}
          {inputsLength > 0 && (
            <>
              <BtnGroup>
                {hoverText ? (
                  <Tooltip text={hoverText} placement="top-start">
                    {btnComp}
                  </Tooltip>
                ) : (
                  <>{btnComp}</>
                )}
                {txHash && (
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={openTx}
                    className="viewBtn"
                  >
                    {t(translations.contract.viewTx)}
                  </Button>
                )}
              </BtnGroup>
              {type === 'read' && (
                <OutputParams outputs={outputs}></OutputParams>
              )}
              {type === 'read' && outputShown && (
                <FuncResponse name={data['name']}></FuncResponse>
              )}
            </>
          )}
          {type === 'read' &&
            outputShown &&
            outputs.map((item, index) => (
              <>
                <OutputItem
                  output={item}
                  value={outputValue[index]}
                  key={index}
                ></OutputItem>
              </>
            ))}
          {<Error message={outputError}></Error>}
        </FuncBody>
      </Form>
      <Modal
        closable
        open={modalShown}
        onClose={closeHandler}
        wrapClassName="dappButtonModalContainer"
      >
        <Modal.Content className="contentContainer">
          {modalType === 'loading' && (
            <>
              <Loading></Loading>
              <div className="loadingText">
                {t(translations.general.loading)}
              </div>
              <div className="confirmText">
                {t(translations.general.waitForConfirm)}
              </div>
            </>
          )}
          {modalType === 'success' && (
            <>
              <img src={imgSuccessBig} alt="success" className="statusImg" />
              <div className="submitted">
                {t(translations.sponsor.submitted)}.
              </div>
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
          )}
          {modalType === 'fail' && (
            <>
              <img src={imgRejected} alt="rejected" className="statusImg" />
              <div className="submitted">
                {t(translations.general.txRejected)}
              </div>
            </>
          )}
        </Modal.Content>
      </Modal>
    </Container>
  );
};
const Container = styled.div`
  .viewBtn.btn {
    margin-left: 12px;
    height: 30px;
    line-height: 30px;
    min-width: initial;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
  .inputComp {
    margin-top: 8px;
  }
  .btnComp.btn {
    height: 30px;
    line-height: 30px;
    min-width: initial;
    margin-left: 0;
  }
`;
const BtnGroup = styled.div`
  margin: 12px 0;
`;

export default Func;
