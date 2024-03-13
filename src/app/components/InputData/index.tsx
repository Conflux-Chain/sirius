import React from 'react';
import 'react-json-pretty/themes/monikai.css';
import { hex2utf8 } from 'sirius-next/packages/common/dist/utils';
import ReactJson from 'react-json-view';
import styled from 'styled-components';
import { Text } from '@cfxjs/react-ui';
type InputDataProps = {
  byteCode?: string;
  inputType?: string;
  decodedDataStr?: string;
};
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof InputDataProps>;
export declare type Props = InputDataProps & NativeAttrs;
export const InputData = React.memo(
  ({ className, byteCode, inputType, decodedDataStr, ...props }: Props) => {
    const getStrByType = (byteCode = '', type, decodedDataStr) => {
      let str = '';
      switch (type) {
        case 'original':
          str = byteCode;
          break;
        case 'utf8':
          // str = byteCode;
          str = hex2utf8(
            byteCode.startsWith('0x') ? byteCode.substr(2) : byteCode,
          );
          break;
        case 'decodeInputData':
          str = decodedDataStr;
          break;
        default:
          break;
      }
      return str;
    };
    let strDecoded = getStrByType(byteCode, inputType, decodedDataStr);
    let isJson = false;
    let str;
    try {
      isJson = true;
      str = JSON.parse(strDecoded);
    } catch (error) {
      isJson = false;
      str = strDecoded;
    }
    return (
      <Wrap>
        {isJson ? (
          <ReactJson
            src={str}
            enableClipboard
            name={false}
            style={{
              height: '11.8571rem',
              overflowY: 'auto',
              background: '#FAFBFC',
              borderRadius: '2px',
            }}
            displayDataTypes={false}
          />
        ) : (
          // @ts-ignore
          <Text className="textContainer">{str}</Text>
        )}
      </Wrap>
    );
  },
);

const Wrap = styled.div`
  width: 100%;
  .tips {
    width: 100%;
  }
  .textContainer {
    margin: initial;
    height: 11.8571rem;
    overflow-y: auto;
    color: #97a3b4;
    background: #fafbfc;
    padding: 0.7143rem;
  }
`;
