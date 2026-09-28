/**
 *
 * Header
 *
 */

import { AmooLogo } from 'app/components/AmooLogo';
import ENV_CONFIG from 'env';
import React, { memo } from 'react';
import styled from 'styled-components';

export const Header = memo(() => {
  return (
    <Wrapper>
      <LogoWrapper href={ENV_CONFIG.ENV_LINK}>
        <AmooLogo className="amoo-logo" />
        <span>AmooStore</span>
      </LogoWrapper>
      <NFTWrapper>数字证书</NFTWrapper>
    </Wrapper>
  );
});

const LogoWrapper = styled.a`
  margin-left: 6px;
  display: flex;
  height: 32px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  .amoo-logo {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  span {
    color: #fafafa;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px; /* 116.667% */
    letter-spacing: -0.939px;
  }
`;
const Wrapper = styled.header`
  max-width: 1368px;
  margin: 0 auto;
  border-radius: 100px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.07) 0%,
    rgba(255, 255, 255, 0.02) 20%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  margin-top: 32px;
  height: 44px;
  padding: 6px;
  box-shadow: 0 2px 2px -2px rgba(255, 255, 255, 0.5) inset,
    0 -2px 2px -2px rgba(255, 255, 255, 0.7) inset,
    0 0 0 1px rgba(255, 255, 255, 0.08) inset, -1px 0 0 0 rgba(0, 0, 0, 0.15),
    1px 0 0 0 rgba(0, 0, 0, 0.15), 0 -1px 0 0 rgba(0, 0, 0, 0.07),
    0 1px 0 0 rgba(0, 0, 0, 0.07), 0 6px 24px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(14px);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NFTWrapper = styled.div`
  display: flex;
  width: 90px;
  height: 32px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 100px;
  background: #fafafa;
  color: #000;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 17px; /* 141.667% */
`;
