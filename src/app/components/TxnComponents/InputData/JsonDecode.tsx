import React, { useMemo } from 'react';

import { AceEditor } from '@cfxjs/sirius-next-common/dist/components/AceEditor';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

interface Props {
  data: any;
}

const AceEditorStyle = {
  width: 'initial',
  opacity: 0.62,
  margin: '0.3571rem 0',
};

export const JsonDecode = ({ data }: Props) => {
  const json = useMemo(() => {
    try {
      return JSON.stringify(data, null, 4);
    } catch (e) {
      return '';
    }
  }, [data]);

  return (
    <AceEditor
      style={AceEditorStyle}
      mode="json"
      theme="tomorrow"
      name="inputdata_json"
      fontSize="1rem"
      showGutter={false}
      showPrintMargin={false}
      value={json}
      readOnly={true}
      height="11.1429rem"
      wrapEnabled={true}
    />
  );
};
