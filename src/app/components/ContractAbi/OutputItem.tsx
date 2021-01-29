/**
 *
 * OutputItem Component
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import imgArray from 'images/two_array.png';
import { AddressContainer } from '../AddressContainer';
interface OutputParamsProps {
  output: object;
  value?: any;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof OutputParamsProps>;
export declare type Props = OutputParamsProps & NativeAttrs;

const OutputItem = ({ output, value }: Props) => {
  let valueComp = <></>;
  const type = output['type'];
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
      <Container>
        <img src={imgArray} alt="response params" className="icon" />
        <span className="name text">{output['name']}</span>
        <span className="type text">{`(${output['type']})`}</span>
        {valueComp}
      </Container>
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
