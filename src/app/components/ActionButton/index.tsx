import styled from 'styled-components';
import React from 'react';
import { Button } from '@cfxjs/react-ui';

interface ButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
}

export const ActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, children, ...others }, ref) => {
    return (
      <ActionButtonWrap>
        <Button
          color="secondary"
          variant="text"
          className="filter-button"
          onClick={onClick}
          ref={ref}
          {...others}
        >
          {children}
        </Button>
      </ActionButtonWrap>
    );
  },
);

const ActionButtonWrap = styled.div`
  .btn.filter-button {
    display: flex;
    align-items: center;
    border-radius: 0.2857rem;
    background-color: rgba(0, 84, 254, 0.04);
    min-width: 2.2857rem;
    height: 2.2857rem;
    padding: 0 0.4286rem;
    margin-right: 0.7143rem;
    color: #b1b3b9;
    font-weight: normal;

    &:hover {
      background-color: rgba(0, 84, 254, 0.1);
      color: #b1b3b9;
    }

    .text {
      top: 0;
    }
  }
`;
