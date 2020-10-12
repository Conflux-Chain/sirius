/**
 *
 * Footer
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { media } from './../../../styles/media';

const Wrapper = styled.div`
  font-size: 1.7143rem;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 2.2857rem;
  margin-bottom: 1.1429rem;

  ${media.s} {
    font-size: 1.2857rem;
    font-weight: 500;
    color: #050505;
    line-height: 1.8571rem;
  }
`;

const PageHeader = memo(({ children }) => {
  return <Wrapper>{children}</Wrapper>;
});

export default PageHeader;
