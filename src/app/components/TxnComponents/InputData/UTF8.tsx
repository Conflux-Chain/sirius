import React from 'react';
import { Text } from '@cfxjs/react-ui';
import { hex2utf8 } from '@cfxjs/sirius-next-common/dist/utils';
import { Wrapper } from './Common';

interface Props {
  data: string;
}

export const UTF8 = ({ data }: Props) => {
  let str = '';

  try {
    str = hex2utf8(data.startsWith('0x') ? data.substr(2) : data);
  } catch (e) {}

  return (
    <Wrapper
      style={{
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {/* @ts-ignore */}
      <Text>{str}</Text>
    </Wrapper>
  );
};
