import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

export const StyledRemarkWrapper = styled.div`
  margin-bottom: 1.7143rem;
  margin-top: 1.7143rem;
`;

export const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 0;
  margin-top: 1rem;
  ${media.s} {
    > button {
      flex: 1;
      justify-content: center;
    }
  }
`;

export const StyledContractInfoRow = styled.div<{ $marginBottom?: string }>`
  margin-bottom: ${props => props.$marginBottom};
  border-bottom: 1px solid #ebeced;
  display: flex;
  align-items: center;
  padding: 0.8571rem 0;
  .contract-info-label {
    min-width: 230px;
    font-size: 1rem;
    color: #74798c;
  }
  .contract-info-value {
    font-size: 1rem;
    color: #282d30;
  }

  ${media.s} {
    flex-direction: column;
    align-items: flex-start;
    .sirius-text {
      white-space: normal;
    }
  }
`;

export const StyledContentWrapper = styled.div`
  font-size: 1rem;
  color: #74798c;
  line-height: 22px;
  font-weight: 450;
  &.center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
  }
  &.content-box {
    background-color: #f7f8f9;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    width: fit-content;
    .content-label {
      min-width: 180px;
    }
    .content-value {
      font-weight: 500;
    }
  }
  &.error {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background-color: #fbebeb;
    color: #e15c56;
  }
`;
