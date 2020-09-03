/**
 *
 * Header
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';

interface Props {
  logo: JSX.Element;
  left: JSX.Element[];
  right: JSX.Element[];
}

export const Header = memo(({ logo, left, right }: Props) => {
  return (
    <Wrapper>
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
