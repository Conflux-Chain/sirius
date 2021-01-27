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
  padding: 16px 0 12px;

  &.no-border {
    border-bottom: none;
  }

  .list-title {
    font-size: 10px;
    font-weight: 500;
    color: #97a3b4;
    line-height: 14px;
  }

  .list-content {
    font-size: 12px;
    color: #002e74;
    line-height: 24px;
  }
`;
