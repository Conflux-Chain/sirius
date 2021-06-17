import React from 'react';
import { Wrapper } from './Common';

import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

interface Props {
  data: any;
}

const AceEditorStyle = {
  width: 'initial',
  backgroundColor: '#F8F9FB',
  opacity: 0.62,
  margin: '0.3571rem 0',
};

export const JsonDecode = ({ data }: Props) => {
  let json = '';

  try {
    json = JSON.stringify(data, null, 4);
  } catch (e) {}

  return (
    <Wrapper>
      <AceEditor
        style={AceEditorStyle}
        mode="json"
        theme="tomorrow"
        name="inputdata_json"
        setOptions={{
          showLineNumbers: true,
        }}
        fontSize="1rem"
        showGutter={false}
        showPrintMargin={false}
        value={json}
        readOnly={true}
        height="11.8571rem"
        wrapEnabled={true}
      />
    </Wrapper>
  );
};
