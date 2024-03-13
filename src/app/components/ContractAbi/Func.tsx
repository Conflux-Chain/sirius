import React, { useState, useEffect } from 'react';
import { Form } from '@cfxjs/antd';
import { useTranslation } from 'react-i18next';
import { Buffer } from 'buffer';
import styled from 'styled-components';
import { Button } from '@cfxjs/react-ui';
import { usePortal } from 'utils/hooks/usePortal';
import lodash from 'lodash';
import FuncBody from './FuncBody';
import ParamTitle from './ParamTitle';
import ParamInput from './ParamInput';
import OutputParams from './OutputParams';
import FuncResponse from './FuncResponse';
import OutputItem from './OutputItem';
import Error from './Error';
import { translations } from '../../../locales/i18n';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import {
  checkInt,
  checkUint,
  checkBytes,
  checkCfxType,
  isCurrentNetworkAddress,
  convertBigNumbersToStrings,
  convertObjBigNumbersToStrings,
  constprocessResultArray,
} from '../../../utils';
import { formatAddress } from '../../../utils';
import { TXN_ACTION } from '../../../utils/constants';
import { ConnectButton } from '../../components/ConnectWallet';
import { formatType } from 'js-conflux-sdk/src/contract/abi';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import JSONBigint from 'json-bigint';

interface FuncProps {
  type?: string;
  data: object;
  contractAddress: string;
  contract: object;
  id?: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof FuncProps>;
export declare type Props = FuncProps & NativeAttrs;

const Func = ({ type, data, contractAddress, contract, id = '' }: Props) => {
  const { addRecord } = useTxnHistory();
  const { t } = useTranslation();
  const { accounts, sendTransaction } = usePortal();
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [outputShown, setOutputShown] = useState(false);
  const [outputValue, setOutputValue] = useState({});
  const [outputError, setOutputError] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);
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
    if (data['error']) {
      setOutputShown(false);
      setOutputError(data['error']);
    }
  }, [data]);
  const onFinish = async values => {
    // {type: 'string', val: ''} Only string has no set check, it can be '', undefined is an unfilled string,See getValidator type === 'string'.
    const newValues = JSONBigint.parse(
      JSONBigint.stringify(values, (key, value) =>
        value === undefined
          ? { type: 'string', val: '' }
          : value['type'] === 'tuple'
          ? {
              type: 'string',
              val: convertObjBigNumbersToStrings(
                JSONBigint.parse(value['val']),
              ),
            }
          : value,
      ),
    );

    const items: object[] = Object.values(newValues);
    const objValues: any[] = [];
    // Special convert for various types before call sdk
    items.forEach(function (value, index) {
      let val = value['val'];
      if (value['type'] === 'bool') {
        if (val === 'true' || val === '1') {
          value['val'] = true;
        } else if (val === 'false' || val === '0') {
          value['val'] = false;
        }
      } else if (value['type'].startsWith('tuple')) {
        value['val'] = JSON.parse(value['val']);
      } else if (value['type'].endsWith(']')) {
        // array: convert to array
        value['val'] = Array.from(JSON.parse(value['val']));
        // TODO byte array support
      } else if (value['type'].startsWith('byte')) {
        value['val'] = Buffer.from(value['val'].substr(2), 'hex');
      }
      objValues.push(value['val']);
    });

    // use full name to evoke contract function for override function compatible
    const fullNameWithType = formatType({
      name: data['name'],
      inputs: data['inputs'].filter(i => i.type !== 'cfx'), // remove cfx item
    });

    const objValuesNew = convertBigNumbersToStrings(objValues);

    switch (type) {
      case 'read':
        try {
          setQueryLoading(true);
          const res = await contract[fullNameWithType](...objValuesNew);
          setOutputError('');
          setQueryLoading(false);
          if (data['outputs'].length === 1) {
            let arr: any[] = [];
            arr.push(
              constprocessResultArray(
                JSONBigint.parse(JSONBigint.stringify(res)),
              ),
            );
            setOutputValue(arr);
          } else {
            setOutputValue(
              Object.values(
                constprocessResultArray(
                  JSONBigint.parse(JSONBigint.stringify(res)),
                ),
              ),
            );
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
        if (accounts[0]) {
          let objParams: any[] = [];
          let txParams = {
            from: formatAddress(accounts[0]),
            to: formatAddress(contractAddress),
          };
          if (data['stateMutability'] === 'payable') {
            objParams = objValues.slice(1);
            txParams['value'] = SDK.format.bigUIntHex(
              SDK.Drip.fromCFX(objValues[0]),
            );
          } else {
            objParams = objValues;
          }
          setOutputError('');
          try {
            const { data: txData } = contract[fullNameWithType](...objParams);
            txParams['data'] = txData;
          } catch (error) {
            setOutputError(error.message || '');
            return;
          }
          //loading
          setModalShow(true);
          try {
            const txHash = await sendTransaction(txParams);
            const code = TXN_ACTION.writeContract;

            // mark txn action to history
            addRecord({
              hash: txHash,
              info: JSON.stringify({
                code: code,
                description: t(translations.connectWallet.notify.action[code]),
                hash: txHash,
              }),
            });

            setTxHash(txHash);
            setOutputError('');

            trackEvent({
              category: ScanEvent.wallet.category,
              action:
                ScanEvent.wallet.action.txnAction[code] ||
                ScanEvent.wallet.action.txnActionUnknown,
            });
          } catch (error) {
            setModalType('error');
            setErrorMessage(
              error.code ? `${error.code} - ${error.message}` : error.message,
            );
            setOutputError(error.message || '');
          }
        }

        break;
      default:
        break;
    }
  };
  const onFinishFailed = () => {
    setOutputError('');
    setOutputShown(false);
  };
  const closeHandler = () => {
    // reset tx status modal state
    setModalShow(false);
    setModalType('');
    setErrorMessage('');
    setTxHash('');
  };
  function getValidator(type: string) {
    const check = (_: any, value) => {
      const val = value && value['val'];

      // tuple or tuple[] support
      if (type.startsWith('tuple')) {
        try {
          JSON.parse(val);
          return Promise.resolve();
        } catch {
          return Promise.reject(t(translations.contract.error.tuple, { type }));
        }
      }

      // array & multi-dimensional array support
      if (type.endsWith(']')) {
        try {
          JSON.parse(val);
          return Promise.resolve();
        } catch {
          return Promise.reject(t(translations.contract.error.array, { type }));
        }
      }

      if (type === 'address') {
        if (isCurrentNetworkAddress(val)) {
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
        const [isInt, num] = checkInt(val, type);
        if (isInt) {
          return Promise.resolve();
        }
        return Promise.reject(
          t(translations.contract.error.int, { num: Number(num) - 1 }),
        );
      } else if (type.startsWith('uint')) {
        const [isUint, num] = checkUint(val, type);
        if (isUint) {
          return Promise.resolve();
        }
        return Promise.reject(
          t(translations.contract.error.uint, { num: num }),
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
      <ConnectButton>
        <Button
          htmlType="submit"
          variant="solid"
          color="primary"
          className="btnComp"
        >
          {t(translations.contract.write)}
        </Button>
      </ConnectButton>
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
        onFinishFailed={onFinishFailed}
      >
        <FuncBody>
          {inputsLength > 0
            ? inputs.map((inputItem, index) => (
                <React.Fragment key={id + 'item' + inputItem.name + index}>
                  <ParamTitle
                    name={inputItem.name}
                    type={inputItem.type}
                    key={id + 'title' + inputItem.name + index}
                  />
                  <Form.Item
                    name={`name${id}-${inputItem.name || 'input'}-${index}`}
                    rules={[{ validator: getValidator(inputItem.type) }]}
                    key={id + 'form' + inputItem.name + index}
                  >
                    <ParamInput
                      input={inputItem}
                      type={inputItem.type}
                      key={id + 'input' + inputItem.name + index}
                    />
                  </Form.Item>
                </React.Fragment>
              ))
            : null}
          {((type === 'read' && inputsLength > 0) ||
            (type === 'write' && inputsLength >= 0)) && (
            <>
              <BtnGroup>
                {btnComp}
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
              {type === 'read' && <OutputParams outputs={outputs} />}
              {type === 'read' && outputShown && (
                <FuncResponse name={data['name']} />
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
                  key={id + index}
                />
              </>
            ))}
          {<Error message={outputError} />}
        </FuncBody>
      </Form>

      <TxnStatusModal
        show={modalShow}
        status={modalType}
        onClose={closeHandler}
        hash={txHash}
        errorMessage={errorMessage}
      />
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
