/**
 *
 * List
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useBreakpoint, media } from 'styles/media';
import { Card } from '../Card';
import { Description, DescriptionProps } from '../Description';

interface ListProps {
  list: Array<DescriptionProps>;
}

export const List = ({ list }: ListProps) => {
  const bp = useBreakpoint();
  const isS = bp === 's';

  const hasBorder = (index: number) => {
    const length = list.length;
    // mobile one column
    if (isS && index === length - 1) {
      return false;
    }
    // pc
    if (index % 2 === 0) {
      if (index === length - 1 || index === length - 2) {
        return false;
      }
    } else {
      if (index === length - 1) {
        return false;
      }
    }
    return true;
  };

  return (
    <Card>
      {list.map((item, index) => (
        <ItemWrap>
          <Description
            className="list-desp"
            title={item.title}
            children={item.children}
            noBorder={hasBorder(index)}
          ></Description>
        </ItemWrap>
      ))}
    </Card>
  );
};

const ItemWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 18px;
  .list-desp {
    width: 48%;

    ${media.s} {
      width: 100%;
    }
  }
`;
