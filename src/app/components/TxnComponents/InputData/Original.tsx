import React from 'react';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
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
      <Text hideTooltip singleLine={false}>
        {data}
      </Text>
    </Wrapper>
  );
};
