/**
 *
 * Footer
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Divider } from '@cfxjs/react-ui';
import { media } from 'styles/media';

interface Props {
  rightTop: JSX.Element[];
  rightBottom: JSX.Element[];
  left: JSX.Element[];
}

export const Footer = memo(({ rightBottom, rightTop, left }: Props) => {
  return (
    <Wrapper>
      <Container>
        <Left key="left">{left}</Left>
        <Right key="right">
          <RightTop key="right-top">{rightTop}</RightTop>
          <Divider key="divider" className="footer-bottom-divider" />
          <RightBottom key="right-bottom">{rightBottom}</RightBottom>
        </Right>
      </Container>
    </Wrapper>
  );
});

const Right = styled.div`
  flex-grow: 2;
  //padding-right: 11.57rem;

  ${media.s} {
    padding: 0;
  }
`;
const RightTop = styled.div`
  ${media.s} {
    padding: 0 0.21rem;
  }
`;
const RightBottom = styled.div`
  ${media.s} {
    padding: 0 0.21rem;
  }
`;
const Left = styled.div`
  margin-right: 2.93rem;
  display: flex;
  flex-direction: column;

  ${media.m} {
    display: none;
  }
`;
const Wrapper = styled.footer`
  box-sizing: border-box;
  background-color: #e0e3f2;
  width: 100vw;
  max-width: 100%; // fix horizontal scroll
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 2.2857rem;

  .footer-bottom-divider.divider {
    background-color: #d1d5ea;
    margin-top: 1.07rem;
    margin-bottom: 0.57rem;
  }

  ${media.s} {
    padding: 1.14rem 0.93rem;
    .footer-bottom-divider.divider {
      margin-top: 0.79rem;
      margin-bottom: 0.29rem;
    }
  }
`;
const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  flex-grow: 1;
  margin: 0 auto;
  max-width: 1368px;
`;
