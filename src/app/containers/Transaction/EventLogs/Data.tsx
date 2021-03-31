import React, { useState, useMemo } from 'react';
import { Select } from '../../../components/Select';
import styled from 'styled-components/macro';
import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { isTestNetEnv } from 'utils/hooks/useTestnet';
import { CHAIN_ID } from 'utils/constants';
import { Link } from '../../../components/Link/Loadable';

const isTestNet = isTestNetEnv();
const chainId = isTestNet ? CHAIN_ID.testnet : CHAIN_ID.mainnet;

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
    useMemo(() => {
      if (!isPossibleAddress(data.hexValue)) {
        return select?.options.filter(o => o.key !== 'address');
      }
      return select?.options;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.hexValue]) || [];

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
        const address = format.address(`0x${value.substr(24)}`, chainId);
        result = <Link href={`/contract/${address}`}>{address}</Link>;
        break;
      case 'number':
        result = format.bigUInt(v).toString();
        break;
      case 'text':
        result = format.hexBuffer(v).toString();
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
          >
            <Select.Option value="hex">Hex</Select.Option>
            <Select.Option value="decode">Dec</Select.Option>
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
            content: 'Hex',
          },
          {
            key: 'number',
            value: 'number',
            content: 'Number',
          },
          {
            key: 'text',
            value: 'text',
            content: 'Text',
          },
          {
            key: 'address',
            value: 'address',
            content: 'Address',
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
  padding: 20px 100px 20px 20px;
  background-color: #fafbfc;
  position: relative;

  .select.select-with-abi {
    position: absolute;
    right: 20px;
    height: 30px;
    padding: 0 10px;
  }
`;
