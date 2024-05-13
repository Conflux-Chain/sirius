/**
 *
 * OutputItem Component
 *
 */
import React from 'react';
import styled from 'styled-components';
import imgArray from 'images/two_array.png';
import { AddressContainer } from 'sirius-next/packages/common/dist/components/AddressContainer';
import { valueCoder } from 'js-conflux-sdk/src/contract/abi';
import { media } from 'sirius-next/packages/common/dist/utils/media';

interface OutputParamsProps {
  output: object;
  value?: any;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof OutputParamsProps>;
export declare type Props = OutputParamsProps & NativeAttrs;

const OutputItem = ({ output, value }: Props) => {
  let valueComp = <></>;
  const type = output['type'];
  let returnName = output['name'];
  let returnType = output['type'];
  try {
    if (type === 'address') {
      valueComp = (
        <span className="value">
          <AddressContainer value={value} isFull={true} />
        </span>
      );
    } else if (type.startsWith('address') && type.endsWith(']')) {
      const array = Array.from(value);
      valueComp = (
        <span className="value">
          [
          {array.map((v: any, i) => (
            <>
              <AddressContainer value={v} isFull={true} />
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
  return (
    <Container>
      <span className="name text">
        <img src={imgArray} alt="response params" className="icon" />
        {returnName} <span className="type">{returnType}</span>
      </span>
      {valueComp}
    </Container>
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
  }
`;
export default OutputItem;
