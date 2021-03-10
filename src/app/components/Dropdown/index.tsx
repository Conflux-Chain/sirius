import React, { useState, useRef } from 'react';
import queryString from 'query-string';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import { useClickAway } from '@cfxjs/react-ui';
import clsx from 'clsx';
import { Check } from '@zeit-ui/react-icons';
import { media } from 'styles/media';
import { ActionButton } from '../ActionButton';

// move and update TxDirectionFilter to Dropdown, it should be use Select or Button-dropdown of react-ui
export const Dropdown = ({
  onChange = () => {},
  options = [],
  label = '',
  className = '',
}: {
  onChange?: (selected?: string) => void;
  options?: Array<{
    key: string;
    name: string;
  }>;
  label?: React.ReactNode;
  className?: string;
}) => {
  const location = useLocation();
  const { txType } = queryString.parse(location.search || '');
  const defaultDirection = options.findIndex(o => o.key === txType);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(
    defaultDirection === -1 ? 0 : defaultDirection,
  );
  useClickAway(dropdownRef, () => visible && setVisible(false));

  const select = selected => {
    setSelected(selected);
    onChange && onChange(options[selected].key);
    setVisible(false);
  };

  const opts = options.map((o, idx) => (
    <div
      key={o.key}
      onClick={() => select(idx)}
      className={clsx('opt', selected === idx && 'selected')}
    >
      <span>{o.name}</span>
      <Check />
    </div>
  ));

  return (
    <StyledDropdownWrapper
      className={clsx({
        className,
      })}
    >
      <ActionButton onClick={() => setVisible(!visible)}>
        {label || options[selected]?.name}
      </ActionButton>
      {visible && (
        <TxDirectionFilterDropdown ref={dropdownRef}>
          {opts}
        </TxDirectionFilterDropdown>
      )}
    </StyledDropdownWrapper>
  );
};

const StyledDropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TxDirectionFilterDropdown = styled.div`
  position: absolute;
  right: 0;
  box-shadow: 0rem 0.43rem 1.14rem 0rem rgba(20, 27, 50, 0.08);
  border-radius: 0.14rem;
  background-color: white;
  width: max-content;
  margin-top: 0.4286rem;
  z-index: 10;

  div.opt {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 1.57rem;
    padding: 0.29rem 1.14rem;
    color: #65709a;
    cursor: pointer;

    &:hover {
      background-color: #f1f4f6;
    }

    &.selected {
      background-color: #65709a;
      color: white;
      svg {
        visibility: visible;
      }
    }

    svg {
      visibility: hidden;
      margin-left: 0.5rem;
    }
  }

  ${media.s} {
    right: unset;
    left: 0;
  }
`;
