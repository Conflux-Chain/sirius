import React from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';

export interface ContentWrapperProps {
  children: React.ReactNode;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  className?: string;
}

export const ContentWrapper = ({
  children,
  left,
  right,
  center,
  className,
  ...others
}: ContentWrapperProps) => {
  return (
    <StyledTdWrapper
      className={clsx({
        className,
        left,
        right,
        center,
      })}
      {...others}
    >
      {children}
    </StyledTdWrapper>
  );
};

const StyledTdWrapper = styled.div`
  &.right {
    text-align: right;
  }
  &.center {
    text-align: center;
  }
  &.left {
    text-align: left;
  }
`;
