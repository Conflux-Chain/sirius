/**
 *
 * Footer
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';

interface Props {
  right: JSX.Element[];
  left: JSX.Element[];
  bottom: JSX.Element;
}

export const Footer = memo(({ right, left, bottom }: Props) => {
  return (
    <Wrapper>
      <Left>{left}</Left>
      <Right>{right}</Right>
      <Bottom>{bottom}</Bottom>
    </Wrapper>
  );
});

const Right = styled.div``;
const Bottom = styled.div``;
const Left = styled.div``;
const Wrapper = styled.footer`
  border: 1px solid green;
`;
