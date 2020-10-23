import React from 'react';
import { Tooltip } from '../Tooltip';
import 'react-json-pretty/themes/monikai.css';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { hex2utf8 } from '../../../utils';
import JSONPretty from 'react-json-pretty';
import styled from 'styled-components/macro';
type InputDataProps = {
  byteCode?: string;
  inputType?: string;
  decodedDataStr?: string;
};
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof InputDataProps>;
export declare type Props = InputDataProps & NativeAttrs;
export const InputData = ({
  className,
  byteCode,
  inputType,
  decodedDataStr,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const getStrByType = (byteCode, type, decodedDataStr) => {
    let str = '';
    switch (type) {
      case 'original':
        str = byteCode;
        break;
      case 'utf8':
        str = hex2utf8(byteCode);
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
  let str;
  try {
    str = JSON.stringify(JSON.parse(strDecoded), null, 2);
  } catch (error) {
    str = strDecoded;
  }
  return (
    <Wrap>
      <Tooltip
        text={t(translations.transactions.inputTips)}
        className="tips"
        contentClassName="testaaaa"
      >
        <JSONPretty
          id="json-pretty"
          data={str}
          themeClassName="custom-json-pretty"
        />
      </Tooltip>
    </Wrap>
  );
};
const Wrap = styled.div`
  width: 100%;
  .tips {
    width: 100%;
  }
  .__json-pretty-error__ {
    margin-top: 0px;
    background: #fafbfc;
    line-height: 1.3;
    color: #585858;
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    border-radius: 2px;
    padding: 10px;
    height: 166px;
    overflow-y: auto;
    border: none;
  }
  .custom-json-pretty {
    width: 100%;
    margin-top: 0px;
    background: #fafbfc;
    line-height: 1.3;
    color: #585858;
    white-space: pre-wrap; /* Since CSS 2.1 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    border-radius: 2px;
    padding: 10px;
    height: 166px;
    overflow-y: auto;
    border: none;
    .__json-key__ {
      color: #000;
    }
    .__json-value__ {
      color: #032f62;
    }
    .__json-string__ {
      color: #032f62;
    }
    .__json-boolean__ {
      color: #1e2022;
    }
  }
`;
