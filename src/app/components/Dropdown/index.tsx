import qs from 'query-string';
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router';
import { useClickAway } from '@cfxjs/react-ui';
import clsx from 'clsx';
import { Check } from '@zeit-ui/react-icons';
import { media } from 'styles/media';
import Button from 'sirius-next/packages/common/dist/components/Button';
import MoreHorizontal from '@zeit-ui/react-icons/moreHorizontal';

// options example:
// [
//   {
//     key: 'txType',
//     value: 'all',
//     name: 'viewAll',
//   },
//   {
//     key: 'txType',
//     value: 'outgoing',
//     name: 'viewOutgoingTxns',
//   },
//   {
//     key: 'txType',
//     value: 'incoming',
//     name: 'viewIncomingTxns',
//   },
//   {
//     key: 'txType',
//     value: '1',
//     name: 'failed txns',
//   },
// ];

export const TableSearchDropdown = ({
  options = [],
  onChange,
}: {
  options?: Array<{
    key: string;
    value: string;
    name: string;
  }>;
  onChange?: (value: string) => void;
}) => {
  const history = useHistory();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [selected, setSelected] = useState(0);

  useClickAway(dropdownRef, () => visible && setVisible(false));

  let keyList = options.reduce((prev, curr) => {
    return prev.concat(curr.key);
  }, [] as Array<string>);
  // @ts-ignore
  keyList = [...new Set(keyList)];

  useEffect(() => {
    const query = qs.parse(location.search || '');
    const realValue2 = options.reduce((prev, curr, index) => {
      if (query[curr.key] === curr.value) {
        return index;
      }
      return prev;
    }, 0);
    setSelected(realValue2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleClick = index => {
    setVisible(false);

    const option = options[index];

    if (onChange) {
      onChange(option.value);
    } else {
      let { skip, ...query } = qs.parse(location.search || '');
      let queryValue: any = '';

      keyList.forEach(k => {
        if (k === option.key) {
          queryValue = query[k];
        }
        delete query[k];
      });

      if (queryValue !== option.value) {
        query[option.key] = option.value;

        history.push(
          qs.stringifyUrl({
            url: location.pathname,
            query: {
              skip: '0',
              ...query,
            },
          }),
        );
      }
    }
  };

  return (
    <StyledDropdownWrapper>
      <Button type="icon" onClick={() => setVisible(!visible)}>
        <MoreHorizontal size={18} />
      </Button>
      {visible && (
        <div className="option-container" ref={dropdownRef}>
          {options.map((o, index) => (
            <Option
              key={o.value}
              onClick={() => handleClick(index)}
              className={clsx('opt', { selected: selected === index })}
            >
              <span>{o.name}</span>
              <Check />
            </Option>
          ))}
        </div>
      )}
    </StyledDropdownWrapper>
  );
};

const StyledDropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 0.5714rem;

  .option-container {
    position: absolute;
    right: 0;
    box-shadow: 0rem 0.43rem 1.14rem 0rem rgba(20, 27, 50, 0.08);
    border-radius: 0.14rem;
    background-color: white;
    width: max-content;
    margin-top: 0.7143rem;
    z-index: 10;

    ${media.s} {
      right: unset;
      left: 0;
    }
  }
`;

const Option = styled.div`
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
    background-color: var(--theme-color-blue0);
    color: white;
    svg {
      visibility: visible;
    }
  }

  svg {
    visibility: hidden;
    margin-left: 0.5rem;
  }
`;
