import React, { useState, useMemo } from 'react';
import styled from 'styled-components/macro';
import { Select } from '../../../components/Select';

export const Topics = ({ data, signature }) => {
  const [selectMap, setSelectMap] = useState(() => {
    return data.reduce((prev, curr) => {
      prev[curr.argName] = curr.cfxAddress ? 'address' : 'decode';
      return prev;
    }, {});
  });
  const handleChange = (value, argName) => {
    setSelectMap({
      ...selectMap,
      [argName]: value,
    });
  };
  const options = useMemo(() => {
    return [
      {
        key: 'hex',
        value: 'hex',
        content: 'Hex',
      },
      {
        key: 'decode',
        value: 'decode',
        content: 'Decode',
      },
      {
        key: 'address',
        value: 'address',
        content: 'Address',
      },
    ];
  }, []);

  return (
    <StyledTopicsWrapper>
      <div className="topic-item">
        <span className="index">0</span>
        <span className="value">{signature}</span>
      </div>
      {data.map((d, index) => {
        let value = '';
        let select: React.ReactNode = null;

        if (typeof d === 'string') {
          value = d;
        } else {
          const name = selectMap[d.argName];
          const valueMap: {
            hex: string;
            decode: string;
            address?: string;
          } = {
            hex: d.hexValue,
            decode: d.value,
            address: d.cfxAddress,
          };
          // const selectedValue = selectMap[d.argName];
          const availableOptions = options.filter(
            o => valueMap[o.value] !== null,
          );

          value = valueMap[name];
          select = (
            <Select
              className="select"
              disableMatchWidth={true}
              size="small"
              value={name}
              onChange={value => {
                handleChange(value, d.argName);
              }}
            >
              {availableOptions.map(o => (
                <Select.Option key={o.key} value={o.value}>
                  {o.content}
                </Select.Option>
              ))}
            </Select>
          );

          // select = {
          //   value: 'decode',
          //   options: availableOptions,
          //   onChange: value => {
          //     handleChange(value, d.argName);
          //   },
          // };

          // select = (
          //   <SelectedLine
          //     key={index}
          //     index={index}
          //     select={{
          //       value: 'decode',
          //       options: availableOptions,
          //     }}
          //     data={d}
          //   ></SelectedLine>
          // );

          // return select;
        }

        return (
          <div key={index} className="topic-item">
            <span className="index">{index + 1}</span>
            {select}
            <span className="value">{value}</span>
          </div>
        );
      })}
    </StyledTopicsWrapper>
  );
};

const StyledTopicsWrapper = styled.div`
  .topic-item {
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
      padding-left: 0;
      height: 22px;
      padding: 0 10px;

      .value {
        padding-left: 0;
      }
    }

    .value {
      padding-left: 12px;
    }
  }
`;
