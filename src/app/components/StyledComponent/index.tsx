import styled from 'styled-components/macro';

/**
 * common styled component
 */

// <a></a> link, use for jump to other domain, or for static show
export const StyledLink = styled.a`
  font-size: 14px;
  color: #1e3de4;
  line-height: 22px;
  cursor: pointer;
  border-bottom: 1px solid #1e3de4;

  &:hover,
  &:active {
    border-bottom: 1px solid #0f23bd;
  }
`;

/**
 * naming rule: Styled-Type-font size-color name(no name, use hex value for temp, replace later)
 */
export const StyledTitle1474798C = styled.span`
  font-size: 14px;
  color: #74798c;
  line-height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const StyledTitle200F1327 = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #0f1327;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

export const StyledTitle160F1327 = styled.span`
  font-size: 16px;
  font-weight: normal;
  color: #0f1327;
  line-height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;
