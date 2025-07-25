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
