import React from 'react';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import styled from 'styled-components';

export const StyledPageHeader: typeof PageHeader = props => {
  return (
    <StyledWrapper>
      <PageHeader {...props} />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .text-\\#1a1a1a {
    color: #fafafa;
  }
`;
