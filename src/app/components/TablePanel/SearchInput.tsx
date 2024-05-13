/**
 * TokenDetail
 */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { tranferToLowerCase } from 'utils';
import { Search as SearchComp } from '../Search/Loadable';
import { CONTRACTS } from 'utils/constants';
import { ActionButton } from 'app/components/ActionButton';
import { useClickAway } from '@cfxjs/react-ui';
import { media, useBreakpoint } from 'styles/media';

import imgSearch from 'images/search.svg';

interface FilterProps {
  filter: string;
  onFilter: (value: string) => void;
  placeholder: string;
}

// @todo extract to common search component with mobile compatible
export const TableSearchInput = ({
  filter,
  onFilter,
  placeholder,
}: FilterProps) => {
  const bp = useBreakpoint();
  const lFilter = tranferToLowerCase(filter);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useState(lFilter);
  const [visible, setVisible] = useState<boolean>(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useClickAway(inputRef, () => visible && setVisible(false));

  useEffect(() => {
    setValue(lFilter);
  }, [lFilter]);

  const onEnterPress = () => {
    // deal with zero address
    if (value === '0x0') {
      setValue(CONTRACTS.zero);
      if (CONTRACTS.zero !== lFilter) {
        onFilter(CONTRACTS.zero);
      }
      return;
    }

    if (value !== lFilter) {
      onFilter(value);
    }
  };

  // clear search box need to reset search result
  const onClear = () => {
    onFilter('');
  };

  return (
    <FilterWrap>
      {bp === 's' && (
        <ActionButton
          onClick={() => setVisible(!visible)}
          ref={filterButtonRef}
        >
          <img
            src={imgSearch}
            alt="alarm icon"
            className="mobile-icon-search"
          ></img>
        </ActionButton>
      )}
      {(bp !== 's' || visible) && (
        <div ref={inputRef}>
          <SearchComp
            outerClassname="outerContainer"
            inputClassname="transfer-search"
            iconColor="#74798C"
            placeholderText={placeholder}
            onEnterPress={onEnterPress}
            onChange={val => setValue(tranferToLowerCase(val))}
            onClear={onClear}
            val={value}
          />
        </div>
      )}
    </FilterWrap>
  );
};

const FilterWrap = styled.div`
  display: flex;
  margin-right: 0.7143rem;

  .outerContainer {
    flex-grow: 1;
    width: 22rem;

    .transfer-search.input-container {
      height: 2.28rem;
      .input-wrapper {
        border: none;
        border-radius: 1.14rem;
        background: rgba(0, 84, 254, 0.04);
        input {
          color: #74798c;
          ::placeholder {
            color: rgba(116, 121, 140, 0.6);
            font-size: 12px;
          }
        }
        &.hover {
          background-color: rgba(0, 84, 254, 0.1);
          input {
            color: #74798c;
          }
        }
        &.focus {
          input {
            color: #74798c;
          }
        }
      }
    }

    ${media.s} {
      width: 15rem;
    }
  }

  .mobile-icon-search {
    width: 14px;
  }
`;
