import React from 'react';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

export function InfoImage({ color = 'blue', icon, alt }) {
  return (
    <Main>
      <Block color={color} />
      <Image>
        <img className="icon" alt={alt} src={icon} />
      </Image>
    </Main>
  );
}

const Main = styled.div`
  position: relative;
`;
const Block = styled.div<{ color: string }>`
  min-width: 4.29rem;
  min-height: 4.29rem;
  background-color: ${props => props.color};
  border-radius: 0.43rem;
  opacity: 0.06;

  ${media.s} {
    min-width: 3.67rem;
    min-height: 3.67rem;
  }
`;
const Image = styled.div`
  position: absolute;
  top: 1.64rem;
  margin-top: -5px;
  left: 1.5rem;

  ${media.s} {
    top: 1.34rem;
    left: 1.14rem;
  }
`;
