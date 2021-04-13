import React, { useState } from 'react';
import { Select } from '../../../components/Select';
import styled from 'styled-components/macro';
import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { NETWORK_ID } from 'utils/constants';
import { Link } from '../../../components/Link/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

const isPossibleAddress = data => {
  try {
    let top20 = data.substr(0, 20);
    if (Number(top20) === 0) {
      return true;
    }
  } catch (e) {}
  return false;
};

type SelectedLineSelect = {
  value?: string;
  options: Array<any>;
  onChange?: (value: string | string[]) => void;
} | null;

const SelectedLine = ({
  select,
  index,
  data,
}: {
  select?: SelectedLineSelect;
  index?: number | undefined;
  data?: any;
}) => {
  const [selected, setSelected] = useState(select?.value);
  const handleChange = value => {
    setSelected(value);
    select && select.onChange && select.onChange(value);
  };
  const options =
    (isPossibleAddress(data.hexValue)
      ? select?.options
      : select?.options.filter(o => o.key !== 'address')) || [];

  return (
    <StyledSelectItemWrapper>
      {index === undefined ? null : <span className="index">{index + 1}</span>}
      {select ? (
        <Select
          className="select"
          disableMatchWidth={true}
          size="small"
          value={selected}
          onChange={handleChange}
          width="7rem"
        >
          {options.map(o => (
            <Select.Option key={o.key} value={o.value}>
              {o.content}
            </Select.Option>
          ))}
        </Select>
      ) : null}
      <span className="value">{decodeData(data.hexValue, selected)}</span>
    </StyledSelectItemWrapper>
  );
};

const decodeData = (value, type) => {
  let result = value;
  const v = `0x${value}`;

  try {
    switch (type) {
      case 'address':
        const address = format.address(`0x${value.substr(24)}`, NETWORK_ID);
        result = <Link href={`/contract/${address}`}>{address}</Link>;
        break;
      case 'number':
        result = format.bigInt(v).toString();
        break;
      case 'text':
        result = format.hexBuffer(v).toString();
        break;
      case 'bool':
        break;
      default:
    }
  } catch (e) {
    console.log('decode error: ', e);
  }

  return result;
};

const StyledSelectItemWrapper = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: center;

  .index {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    background: #fafbfc;
    border-radius: 2px;
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .select.select {
    height: 22px;
    margin-right: 12px;

    .value {
      padding-left: 0;
    }
  }
`;

export const Data = ({
  data,
  hexData,
}: {
  data: Array<{
    argName?: string;
    value: string;
  }>;
  hexData: string;
}) => {
  const { t } = useTranslation();
  if (!data.length) {
    return null;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('decode');

    let content: string | Array<React.ReactNode> = hexData;
    let body: React.ReactNode = null;

    if (data[0].argName) {
      // data after decode with contract abi
      const handleChange = value => setValue(value);

      if (value === 'decode') {
        content = data.map((d, index) => {
          return (
            <div className="data-item" key={index}>
              <span>{d.argName}: </span>
              <span>{d.value}</span>
            </div>
          );
        });
      }

      body = (
        <>
          <Select
            className="select-with-abi"
            value={value}
            onChange={handleChange}
            size="small"
            disableMatchWidth={true}
            width="7rem"
          >
            <Select.Option value="hex">
              {t(translations.transaction.logs.hex)}
            </Select.Option>
            <Select.Option value="decode">
              {t(translations.transaction.logs.decode)}
            </Select.Option>
          </Select>
          {content}
        </>
      );
    } else {
      // original eventlog data
      const select: SelectedLineSelect = {
        value: 'hex',
        options: [
          {
            key: 'hex',
            value: 'hex',
            content: t(translations.transaction.logs.hex),
          },
          {
            key: 'number',
            value: 'number',
            content: t(translations.transaction.logs.number),
          },
          {
            key: 'text',
            value: 'text',
            content: t(translations.transaction.logs.text),
          },
          {
            key: 'address',
            value: 'address',
            content: t(translations.transaction.logs.address),
          },
        ],
      };

      body = data.map((d, index) => {
        return (
          <SelectedLine key={index} select={select} data={d}></SelectedLine>
        );
      });
    }

    return <StyledDataWrapper>{body}</StyledDataWrapper>;
  }
};

const StyledDataWrapper = styled.div`
  padding: 16px 124px 16px 16px;
  background-color: #fafbfc;
  position: relative;

  .select.select-with-abi {
    position: absolute;
    right: 16px;
    height: 30px;
    padding: 0 10px;
  }
`;
