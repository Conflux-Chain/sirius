import React from 'react';
import styled from 'styled-components';
import { Button } from '@cfxjs/react-ui';

const ActionButtonWrap = styled.div`
  .btn.filter-button {
    display: flex;
    align-items: center;
    border-radius: 0.2857rem;
    background-color: rgba(0, 84, 254, 0.04);
    &:hover {
      background-color: rgba(0, 84, 254, 0.1);
    }
    width: 2.2857rem;
    min-width: 2.2857rem;
    height: 2.2857rem;
    padding: 0;
    margin-right: 0.7143rem;
    .text {
      top: 0;
    }
  }
`;

interface ButtonProps {
  children?: React.ReactNode;
  src: string;
  onClick: () => void;
}

export const ActionButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ src, onClick, ...others }, ref) => {
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
          <img src={src} alt="address-contract-alarm" />
        </Button>
      </ActionButtonWrap>
    );
  },
);
