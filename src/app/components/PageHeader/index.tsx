/**
 *
 * Footer
 *
 */
import React from 'react';
import styled from 'styled-components';
import { media } from './../../../styles/media';

export const PageHeader = ({
  children,
  subtitle,
}: {
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <StyledPageHeaderWrapper>
      {children}
      <StyledSubtitleWrapper>{subtitle}</StyledSubtitleWrapper>
    </StyledPageHeaderWrapper>
  );
};

const StyledPageHeaderWrapper = styled.div`
  font-size: 1.7143rem;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 2.2857rem;
  margin-bottom: 1.1429rem;
  margin-top: 2.2857rem;

  ${media.s} {
    font-size: 1.2857rem;
    font-weight: 500;
    color: #050505;
    line-height: 1.8571rem;
  }
`;

const StyledSubtitleWrapper = styled.div`
  font-size: 1rem;
  color: #74798c;
  margin-top: 0.8571rem;
  line-height: 1.2857rem;
`;
