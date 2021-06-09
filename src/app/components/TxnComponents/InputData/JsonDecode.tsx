import React from 'react';
import ReactJson from 'react-json-view';
import { Wrapper } from './Common';
interface Props {
  data: any;
}

export const JsonDecode = ({ data }: Props) => {
  let json = {};

  try {
    json = JSON.parse(JSON.stringify(data));
  } catch (e) {}

  return (
    <Wrapper>
      <ReactJson
        src={json}
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
    </Wrapper>
  );
};
