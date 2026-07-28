import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Form, FormInstance } from '@cfxjs/antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@cfxjs/react-ui';
import { usePortal } from 'utils/hooks/usePortal';
import lodash from 'lodash';
import OutputItem from './OutputItem';
import { translations } from 'locales/i18n';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import {
  checkInt,
  checkUint,
  checkBytes,
  checkCfxType,
  isCurrentNetworkAddress,
  constprocessResultArray,
  toThousands,
} from '../../../utils';
import { formatAddress } from '../../../utils';
import { TXN_ACTION } from '../../../utils/constants';
import { ConnectButton } from '../../components/ConnectWallet';
import { formatType } from 'js-conflux-sdk/src/contract/abi';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import JSONBigint from 'json-bigint';
import InputItem from './InputItem';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { ErrorDecode } from '@cfxjs/sirius-next-common/dist/components/OutputData/ErrorDecode';
import {
  Error,
  FuncBody,
  FuncResponse,
  OutputParams,
  formatValuesToArgs,
} from '@cfxjs/sirius-next-common/dist/components/ContractAbi';
import {
  AbiItem,
  Hex,
  simulateContract,
} from '@cfxjs/sirius-next-common/dist/utils/sdk';

interface FuncProps {
  type?: string;
  data: object;
  contractAddress: string;
  contract: object;
  id?: string;
  abi: AbiItem[];
}

const parseResponse = (res: unknown) =>
  JSONBigint.parse(JSONBigint.stringify(res));

const Func = ({
  abi,
  type,
  data,
  contractAddress,
  contract,
  id = '',
}: FuncProps) => {
  const { addRecord } = useTxnHistory();
  const { t } = useTranslation();
  const { account, sendTransaction } = usePortal();
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

  const formRef = useRef<FormInstance>(null);

  // use full name to evoke contract function for override function compatible
  const fullNameWithType = useMemo(
    () =>
      formatType({
        name: data['name'],
        inputs: data['inputs'].filter(i => i.type !== 'cfx'), // remove cfx item
      }),
    [data],
  );
  const hasValue = type === 'write' && data['stateMutability'] === 'payable';

  useEffect(() => {
    if (data['value']) {
      setOutputValue(data['value']);
      setOutputShown(true);
    } else {
      setOutputShown(false);
    }
    if (data['error']) {
      setOutputShown(false);
      setOutputError(data['error']);
    }
  }, [data]);
  const onFinish = async values => {
    const { args, value } = formatValuesToArgs(values, hasValue);

    switch (type) {
      case 'read':
        try {
          setQueryLoading(true);
          const res = await contract[fullNameWithType](...args).call({
            from: account,
          });
          setOutputError('');
          setQueryLoading(false);
          if (data['outputs'].length === 1) {
            let arr: any[] = [];
            arr.push(constprocessResultArray(parseResponse(res)));
            setOutputValue(arr);
          } else {
            setOutputValue(
              Object.values(constprocessResultArray(parseResponse(res))),
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
        if (account) {
          let txParams = {
            from: formatAddress(account),
            to: formatAddress(contractAddress),
          };
          if (data['stateMutability'] === 'payable') {
            txParams['value'] = value;
          }
          setOutputError('');
          try {
            const { data: txData } = contract[fullNameWithType](...args);
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
  const getValidator = useCallback(
    (type: string) => {
      const check = (_: any, value) => {
        const val = value && value['val'];

        // tuple or tuple[] support
        if (type.startsWith('tuple')) {
          try {
            JSON.parse(val);
            return Promise.resolve();
          } catch {
            return Promise.reject(
              t(translations.contract.error.tuple, { type }),
            );
          }
        }

        // array & multi-dimensional array support
        if (type.endsWith(']')) {
          try {
            JSON.parse(val);
            return Promise.resolve();
          } catch {
            return Promise.reject(
              t(translations.contract.error.array, { type }),
            );
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
    },
    [t],
  );

  const [simulateLoading, setSimulateLoading] = useState(false);
  const [simulateResult, setSimulateResult] = useState<{
    success: boolean;
    result: unknown[] | null;
  }>({
    success: false,
    result: null,
  });
  const [simulateError, setSimulateError] = useState('');
  const [simulateGasError, setSimulateGasError] = useState('');
  const [simulateGas, setSimulateGas] = useState('');

  const simulateShown = simulateResult.success || simulateError;

  const clearSimulateResult = () => {
    setSimulateLoading(false);
    setSimulateGas('');
    setSimulateGasError('');
    setSimulateError('');
    setSimulateResult({
      success: false,
      result: null,
    });
  };

  const simulateFunctionCall = async () => {
    if (!formRef.current || !account) return;
    try {
      clearSimulateResult();
      await formRef.current.validateFields();
      const values = formRef.current.getFieldsValue();
      const { args, value } = formatValuesToArgs(values, hasValue, false);
      const func = contract[fullNameWithType](...args);
      setSimulateLoading(true);
      let simulateGasLoading = true;
      let simulateCallLoading = true;
      func
        .estimateGasAndCollateral({
          from: account,
          value,
        })
        .then(gasRes => {
          setSimulateGas(parseResponse(gasRes).gasUsed);
        })
        .catch(error => {
          setSimulateGasError(error.message);
        })
        .finally(() => {
          simulateGasLoading = false;
          setSimulateLoading(simulateGasLoading || simulateCallLoading);
        });
      simulateContract({
        address: contractAddress,
        account,
        value,
        abi,
        args,
        functionName: func.data.slice(0, 10),
        space: 'core',
      })
        .then(({ result: simulateRes }) => {
          if (outputs.length === 0) {
            setSimulateResult({
              success: true,
              result: [],
            });
            return;
          }

          const result = constprocessResultArray(parseResponse(simulateRes));

          setSimulateResult({
            success: true,
            result: outputs.length === 1 ? [result] : Object.values(result),
          });
        })
        .catch(error => {
          setSimulateError(error?.cause?.raw || error?.message || '');
        })
        .finally(() => {
          simulateCallLoading = false;
          setSimulateLoading(simulateGasLoading || simulateCallLoading);
        });
    } catch (error) {
      setSimulateError(error.message || '');
    }
  };

  const getCallData = async () => {
    if (!formRef.current) return;
    try {
      await formRef.current.validateFields();
      const values = formRef.current.getFieldsValue();
      const { args } = formatValuesToArgs(values, hasValue);
      const func = contract[fullNameWithType](...args);
      return func.data;
    } catch (error) {
      console.log('get calldata failed:', error);
    }
  };

  const btnComp =
    type === 'read' ? (
      <ButtonList>
        <Button
          htmlType="submit"
          variant="solid"
          color="primary"
          className="btnComp"
          loading={queryLoading}
        >
          {t(translations.contract.query)}
        </Button>
        <Button variant="solid" color="primary" className="btnComp">
          <CopyButton getCopyText={getCallData} color="#fff">
            {t(translations.simulateTrace.button.calldata)}
          </CopyButton>
        </Button>
      </ButtonList>
    ) : (
      <ButtonList>
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
        <ConnectButton>
          <Button
            variant="solid"
            color="primary"
            className="btnComp"
            onClick={simulateFunctionCall}
            loading={simulateLoading}
          >
            {t(translations.simulateTrace.button.simulate)}
          </Button>
        </ConnectButton>
        <Button variant="solid" color="primary" className="btnComp">
          <CopyButton getCopyText={getCallData} color="#fff">
            {t(translations.simulateTrace.button.calldata)}
          </CopyButton>
        </Button>
      </ButtonList>
    );
  const openTx = () => {
    window.open(`${window.location.origin}/transaction/${txHash}`);
  };
  return (
    <Container>
      <Form
        ref={formRef}
        onFinish={onFinish}
        validateTrigger={['onBlur']}
        className="formContainer"
        onFinishFailed={onFinishFailed}
      >
        <FuncBody>
          {inputsLength > 0
            ? inputs.map((inputItem, index) => (
                <InputItem
                  key={id + 'item' + inputItem.name + index}
                  index={index}
                  parentId={id}
                  inputItem={inputItem}
                  getValidator={getValidator}
                />
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
              <OutputItem
                output={item}
                value={outputValue[index]}
                key={id + index}
              />
            ))}
          {<Error message={outputError} />}
          {simulateShown && (
            <div className={`simulate-result ${simulateError && 'error'}`}>
              <div className="simulate-result-title">
                {t(translations.simulateTrace.simulatedResult)}
              </div>
              {simulateResult.success && (
                <div>
                  <div className="simulate-result-success">
                    <span>{t(translations.simulateTrace.success)}</span>
                    {outputs.length === 0 && (
                      <div
                        style={{
                          marginLeft: '16px',
                        }}
                      >
                        {t(translations.simulateTrace.bool)}
                      </div>
                    )}
                  </div>
                  {outputs.map((item, index) => (
                    <OutputItem
                      output={item}
                      value={simulateResult.result?.[index]}
                      key={id + index}
                    />
                  ))}
                </div>
              )}
              {simulateError && (
                <div>
                  {simulateError.startsWith('0x') ? (
                    <ErrorDecode
                      to={contractAddress}
                      space="core"
                      errorData={simulateError as Hex}
                      contentClassName="simulate-error-content"
                    />
                  ) : (
                    simulateError
                  )}
                </div>
              )}

              <div className="simulate-gas">
                {t(translations.simulateTrace.estimatedGas)}:{' '}
                {(simulateGas || simulateGasError) &&
                  (simulateGas ? toThousands(simulateGas) : simulateGasError)}
              </div>
            </div>
          )}
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
    .text {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
  .simulate-result {
    border-radius: 4px;
    background: #f8f8fa;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 16px;

    &.error {
      background: #fbebeb;
    }

    .simulate-result-success {
      span {
        color: #7cd77b;
      }
      display: flex;
    }

    .simulate-result-title {
      color: #000;
      font-size: 12px;
    }

    .simulate-error-content {
      background-color: unset;
    }

    .simulate-gas {
      color: #4f4f4e;
      font-size: 14px;
      font-weight: 450;
      line-height: 22px;
    }
  }
`;
const BtnGroup = styled.div`
  margin: 12px 0;
  display: flex;
  align-items: center;
`;
const ButtonList = styled.div`
  display: flex;
  align-items: center;
`;

export default Func;
