/**
 *
 * OutputItem Component
 *
 */
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import imgArray from 'images/two_array.png';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { valueCoder } from 'js-conflux-sdk/src/contract/abi';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { ArrowDown } from '@cfxjs/sirius-next-common/dist/components/Icons';
import { MaxDecimals, NumberType } from './constants';
import IntValueFormatter from './IntValueFormatter';

interface OutputParamsProps {
  output: object;
  value?: any;
}

const OutputItem = ({ output, value }: OutputParamsProps) => {
  const [expand, setExpand] = useState(false);
  const type = output['type'];
  const { returnName, returnType, valueComp } = useMemo(() => {
    let valueComp = <></>;
    let returnName = output['name'];
    let returnType = output['type'];
    try {
      if (type === 'address') {
        valueComp = (
          <span className="value">
            <CoreAddressContainer value={value} isFull={true} />
          </span>
        );
      } else if (type.startsWith('address') && type.endsWith(']')) {
        const array = Array.from(value);
        valueComp = (
          <span className="value">
            [
            {array.map((v: any, i) => (
              <>
                <CoreAddressContainer value={v} isFull={true} />
                {i === array.length - 1 ? null : ', '}
              </>
            ))}
            ]
          </span>
        );
      } else if (type.startsWith('byte') && type.endsWith(']')) {
        // deal with bytes[] length too long
        // Iteration Traversing nested byte array
        const convertBytesArrayToHex = value => {
          if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
              value[i] = convertBytesArrayToHex(value[i]);
            }
          } else if (value.indexOf('0x') < 0) {
            return '0x' + value.toString('hex');
          }
          return value;
        };

        valueComp = (
          <span className="value">
            {JSON.stringify(convertBytesArrayToHex(value))}
          </span>
        );
      } else if (type.startsWith('byte')) {
        const convertBytesToHex = value => {
          if (value.toString('hex').indexOf('0x') < 0) {
            return '0x' + value.toString('hex');
          }
          return value;
        };
        valueComp = <span className="value">{convertBytesToHex(value)}</span>;
      } else if (type.startsWith('tuple')) {
        // tuple & tuple[]
        try {
          // TODO maybe have some bugs
          const convertValueToObject = (value: any) => {
            if (value && value.toObject) {
              // convert nested tuple object
              let v = value.toObject();
              Object.keys(v).forEach(o => {
                v[o] = convertValueToObject(v[o]);
              });
              return v;
            } else if (Array.isArray(value) && value.length > 0) {
              // tuple array
              return value.map(v => convertValueToObject(v));
            }
            return value;
          };

          valueComp = (
            <span className="value">
              {JSON.stringify(convertValueToObject(value))}
            </span>
          );
          let coder = valueCoder(output);
          returnName = `${output['internalType'] || 'tuple'}(${
            coder?.names?.join(',') || coder?.name || ''
          })`;
          returnType = coder?.type;
        } catch (e) {
          console.error(e);
          returnName = output['name'];
          returnType = output['type'];
          valueComp = <span className="value">{value}</span>;
        }
      } else if (type.endsWith(']')) {
        // array
        valueComp = <span className="value">{JSON.stringify(value)}</span>;
      } else if (NumberType.includes(type)) {
        // number
        valueComp = (
          <span className="value with-icon">
            <span>{value.toString()}</span>
            <ArrowDown
              className={`down-icon ${expand ? 'expand' : ''}`}
              onClick={() => setExpand(e => !e)}
            />
          </span>
        );
      } else {
        valueComp = (
          <span className="value">{`${
            value !== false ? value.toString() : 'false'
          }`}</span>
        );
      }
    } catch (error) {
      console.error(error.message);
    }
    return {
      returnName,
      returnType,
      valueComp,
    };
  }, [type, value, output, expand]);
  return (
    <div>
      <Container>
        <span className="name text">
          <img src={imgArray} alt="response params" className="icon" />
          {returnName} <span className="type">{returnType}</span>
        </span>
        {valueComp}
      </Container>
      {expand && (
        <IntValueFormatter maxDecimals={MaxDecimals[type]} value={value} />
      )}
    </div>
  );
};
const Container = styled.div`
  display: flex;
  align-items: center;
  padding-left: 7px;
  margin: 8px 0;
  flex-wrap: wrap;
  img.icon {
    display: inline-block;
    width: 10px;
    margin-right: 3px;
  }
  .text {
    color: #97a3b4;
  }
  .name {
    margin-left: 4px;
  }
  .type {
    font-style: italic;
  }
  .value {
    margin-left: 15px;
    max-width: 95%;

    ${media.s} {
      width: 100%;
      max-width: 100%;
    }
    &.with-icon {
      display: flex;
      align-items: center;
    }
  }
  .down-icon {
    width: 16px;
    margin-left: 5px;
    cursor: pointer;
    transition: transform 0.3s;
    &.expand {
      transform: rotate(180deg);
    }
  }
`;
export default OutputItem;
