import React from 'react';
import { Text } from '@cfxjs/react-ui';
import { Wrapper } from './Common';

interface Props {
  data: string;
}

export const Original = ({ data }: Props) => {
  return (
    <Wrapper
      isMonospace={true}
      style={{
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <Text>{data}</Text>
    </Wrapper>
  );
};
