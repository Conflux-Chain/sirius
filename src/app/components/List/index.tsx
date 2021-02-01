/**
 *
 * List
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { Skeleton } from '@cfxjs/react-ui';
import { useBreakpoint, media } from 'styles/media';
import { Card } from '../Card';
import { Description, DescriptionProps } from '../Description';

interface ListProps {
  list: Array<DescriptionProps | null>;
}

export const List = ({ list }: ListProps) => {
  const bp = useBreakpoint();
  const isS = bp === 's';

  const noBorder = (index: number) => {
    const length = list.length;
    // mobile one column
    if (isS && index === length - 1) {
      return true;
    }
    // pc
    if (index % 2 === 0) {
      if (index === length - 1 || index === length - 2) {
        return true;
      }
    } else {
      if (index === length - 1) {
        return true;
      }
    }
    return false;
  };

  return (
    <CardWrap>
      <Card className="sirius-list-card">
        {list.map((item, index) => (
          <Description
            key={`desc_${index}`}
            small
            className={`list-desp ${item == null ? 'list-empty' : ''}`}
            title={item != null ? item.title : ''}
            noBorder={item != null ? noBorder(index) : true}
          >
            {item != null ? item.children || <Skeleton /> : null}
          </Description>
        ))}
      </Card>
    </CardWrap>
  );
};

const CardWrap = styled.div`
  .card.sirius-list-card {
    .content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .list-desp {
      width: 48%;

      ${media.s} {
        width: 100%;

        &.list-empty {
          display: none;
        }
      }
    }
  }
`;
