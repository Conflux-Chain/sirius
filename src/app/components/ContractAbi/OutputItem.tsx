/**
 *
 * OutputItem Component
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import imgArray from 'images/two_array.png';
import { AddressContainer } from '../AddressContainer';
import { valueCoder } from 'js-conflux-sdk/src/contract/abi';

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
    } else if (type.startsWith('byte') && type.endsWith('[]')) {
      // TODO deal bytes[] length too long
      valueComp = (
        <span className="value">
          {Array.isArray(value) ? (
            <>
              [<br />
              {value.map(v => (
                <>
                  &nbsp;&nbsp;{v},<br />
                </>
              ))}
              ]
            </>
          ) : (
            value
          )}
        </span>
      );
    } else if (type.startsWith('byte')) {
      valueComp = (
        <span className="value">{`${'0x' + value.toString('hex')}`}</span>
      );
    } else if (type.startsWith('tuple')) {
      try {
        // TODO maybe have bug
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
    } else if (type === 'address[]') {
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
    <>
      {type.startsWith('tuple') ? (
        <Container>
          <img src={imgArray} alt="response params" className="icon" />
          <div>
            <span className="name text">
              {returnName} <span className="type">{returnType}</span>
            </span>
            <br />
            {valueComp}
          </div>
        </Container>
      ) : (
        <Container>
          <img src={imgArray} alt="response params" className="icon" />
          <span className="name text">{returnName}</span>
          <span className="type text">{`(${returnType})`}</span>
          {valueComp}
        </Container>
      )}
    </>
  );
};
const Container = styled.div`
  display: flex;
  align-items: center;
  padding-left: 7px;
  margin: 8px 0;
  .icon {
    display: inline-block;
    width: 10px;
    margin-top: 2px;
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
    margin-left: 4px;
  }
`;
export default OutputItem;
