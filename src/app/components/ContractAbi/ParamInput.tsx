import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '@cfxjs/antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { checkInt, checkUint, checkBytes } from '../../../utils';
import { valueCoder } from 'js-conflux-sdk/src/contract/abi';
import IntValueFormatter from './IntValueFormatter';
import { DecimalsSelect } from '@cfxjs/sirius-next-common/dist/components/DecimalsSelect';
import { MaxDecimals } from './constants';
import { Add } from '@cfxjs/sirius-next-common/dist/components/Icons';

interface ParamInputProps {
  value?: object;
  // eslint-disable-next-line no-empty-pattern
  onChange?: ({}) => void;
  type: string;
  input?: object;
  expand?: boolean;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ParamInputProps>;
export declare type Props = ParamInputProps & NativeAttrs;

const ParamInput = ({ value, onChange, type, input = {}, expand }: Props) => {
  const [decimals, setDecimals] = useState<number>();
  const { t } = useTranslation();
  const triggerChange = changedValue => {
    if (onChange) {
      onChange({
        type,
        ...value,
        ...changedValue,
      });
    }
  };
  const changeHandler = e => {
    let newVal = e.target.value;
    triggerChange({
      val: newVal,
      type: type,
    });
  };

  function getPlaceholder(type: string) {
    let text = '';

    // tuple
    if (type.startsWith('tuple')) {
      // tuple[]
      if (type.endsWith(']')) {
        text = t(translations.contract.error.tupleArray);
      } else {
        text = t(translations.contract.error.tuple);
      }
      return text;
    }

    // array & multi-dimensional array support
    if (type.endsWith(']')) {
      text = t(translations.contract.error.array, { type });
      return text;
    }

    // basic type
    if (type === 'address') {
      text = t(translations.contract.error.address);
    } else if (type === 'bool') {
      text = t(translations.contract.error.bool);
    } else if (type.startsWith('int')) {
      const [, num] = checkInt('', type);
      text = t(translations.contract.error.int, { num: Number(num) - 1 });
    } else if (type.startsWith('uint')) {
      const [, num] = checkUint('', type);
      text = t(translations.contract.error.uint, { num: num });
    } else if (type.startsWith('byte')) {
      const [, num] = checkBytes('', type);
      if (num === 0) {
        text = t(translations.contract.error.bytes);
      } else {
        text = t(translations.contract.error.bytesM, { length: num as number });
      }
    } else if (type === 'cfx') {
      text =
        t(translations.contract.payableAmountCfx) +
        ':' +
        t(translations.contract.error.cfx);
    }
    return text;
  }

  const CodersToObject = (coder, obj = {}) => {
    if (coder['coders'] && coder['coders'].length > 0) {
      obj[coder.name] = {};
      coder['coders'].forEach(c => {
        CodersToObject(c, obj[coder.name]);
      });
    } else {
      obj[coder.name] = coder.type;
    }

    return obj;
  };

  const getTupleFormat = input => {
    try {
      let coder = valueCoder(input);
      let arrayCount = 0;

      // support tuple array
      while (coder && !coder['NamedTuple'] && arrayCount < 3) {
        coder = coder['coder'];
        arrayCount++;
      }

      let returnName = coder?.names?.join(',') || coder?.name || '-';
      let returnType = coder?.type || '-';

      return (
        <span
          className="inputComp-format"
          dangerouslySetInnerHTML={{
            __html: t(translations.contract.tupleFormat, {
              type: input['internalType'] || 'tuple',
              params: `(${returnName})`,
              paramsObject:
                JSON.stringify(CodersToObject(coder)[coder.name]) +
                '[]'.repeat(arrayCount),
              paramsArray:
                returnType.replace(/\(/g, '[').replace(/\)/g, ']') +
                '[]'.repeat(arrayCount),
            }),
          }}
        />
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return (
    <div>
      <Container>
        {type.startsWith('tuple') ? getTupleFormat(input) : null}
        <Input
          className="inputComp"
          onChange={changeHandler}
          value={value && value['val']}
          placeholder={getPlaceholder(type)}
        />
      </Container>
      {expand && (
        <>
          <Container className="expand">
            <span className="label">Add Zero</span>
            <DecimalsSelect
              onChange={setDecimals}
              value={decimals}
              max={MaxDecimals[type]}
              mode="pow"
              placeholder="Select"
            />
            <Add
              className="add-icon"
              onClick={() => {
                if (decimals === undefined) return;
                let newVal = value && value['val'] ? value['val'] : 1;
                newVal += '0'.repeat(decimals);
                triggerChange({
                  val: newVal,
                  type: type,
                });
              }}
            />
          </Container>
          <IntValueFormatter
            value={value?.['val'] ?? ''}
            maxDecimals={MaxDecimals[type]}
          />
        </>
      )}
    </div>
  );
};
const Container = styled.div`
  padding-left: 7px;
  margin: 8px 0;
  .inputComp {
    margin-top: 8px;
  }

  .inputComp-tip,
  .inputComp-format {
    display: block;
    margin-top: 5px;
    font-size: 12px;

    code:before,
    code:after {
      display: none;
    }
  }
  &.expand {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .label {
    display: inline-block;
    width: 110px;
  }
  .add-icon {
    width: 16px;
    margin-left: 8px;
    cursor: pointer;
  }
`;
export default ParamInput;
