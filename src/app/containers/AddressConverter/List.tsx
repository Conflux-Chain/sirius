import React from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';

export const List = ({
  children,
  title,
  noBorder,
}: {
  children: React.ReactNode;
  title: string;
  noBorder?: boolean;
}) => {
  return (
    <StyledListWrapper
      className={clsx({
        'no-border': noBorder,
      })}
    >
      <div className="list-title">{title}</div>
      <div className="list-content">{children}</div>
    </StyledListWrapper>
  );
};

const StyledListWrapper = styled.div`
  border-bottom: 1px solid #f1f1f1;
  padding: 1.1429rem 0 0.8571rem;

  &.no-border,
  &:last-child {
    border-bottom: none;
  }

  .list-title {
    font-size: 0.8571rem;
    font-weight: 500;
    color: #97a3b4;
    line-height: 1rem;
  }

  .list-content {
    font-size: 1rem;
    color: #002e74;
    line-height: 1.7143rem;
  }
`;
