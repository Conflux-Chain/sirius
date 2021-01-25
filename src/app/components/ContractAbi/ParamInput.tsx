import React from 'react';
import styled from 'styled-components/macro';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { checkInt, checkUint, checkBytes } from '../../../utils';

interface ParamInputProps {
  value?: object;
  // eslint-disable-next-line no-empty-pattern
  onChange?: ({}) => void;
  type: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ParamInputProps>;
export declare type Props = ParamInputProps & NativeAttrs;

const ParamInput = ({ value, onChange, type }: Props) => {
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
    console.log(newVal);
    triggerChange({
      val: newVal,
      type: type,
    });
  };
  function getPlaceholder(type: string) {
    let text = '';

    // tuple
    // TODO tuple or tuple[] support
    if (type.startsWith('tuple')) {
      text = t(translations.contract.error.tuple);

      return text;
    }

    // array
    // TODO multi-dimentional array support
    if (type.endsWith('[]')) {
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
      text = t(translations.contract.error.int, { num });
    } else if (type.startsWith('uint')) {
      const [, num] = checkUint('', type);
      text = t(translations.contract.error.uint, { num });
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
  return (
    <>
      <Container>
        <Input
          className="inputComp"
          onChange={changeHandler}
          value={value && value['val']}
          placeholder={getPlaceholder(type)}
        ></Input>
      </Container>
    </>
  );
};
const Container = styled.div`
  .inputComp {
    margin-top: 8px;
  }
`;
export default ParamInput;
