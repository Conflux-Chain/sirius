/**
 *
 * Header
 *
 */
import React, { memo, HTMLAttributes } from 'react';
import styled from 'styled-components/macro';

interface Props extends HTMLAttributes<HTMLElement> {
  logo: JSX.Element;
  left: JSX.Element[];
  right: JSX.Element[];
}

export const Header = memo(({ logo, left, right, ...props }: Props) => {
  return (
    <Wrapper {...props}>
      <Logo>{logo}</Logo>
      <Left>{left}</Left>
      <Right>{right}</Right>
    </Wrapper>
  );
});

const Logo = styled.div``;
const Left = styled.div``;
const Right = styled.div``;
const Wrapper = styled.nav`
  display: flex;
`;
