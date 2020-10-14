import React from 'react';
import styled from 'styled-components';

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
  width: 4.29rem;
  height: 4.29rem;
  background-color: ${props => props.color};
  border-radius: 0.43rem;
  opacity: 0.06;
`;
const Image = styled.div`
  position: absolute;
  top: 1.64rem;
  margin-top: -5px;
  left: 1.5rem;
`;
