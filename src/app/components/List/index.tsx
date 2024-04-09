/**
 *
 * List
 *
 */
import React from 'react';
import styled from 'styled-components';
import { Skeleton } from '@cfxjs/react-ui';
import { useBreakpoint, media } from 'styles/media';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import {
  Description,
  DescriptionProps,
} from 'sirius-next/packages/common/dist/components/Description';

interface ListProps {
  list: Array<DescriptionProps | null>;
  className?: string;
}

export const List = ({ list, className }: ListProps) => {
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
      <Card className={`sirius-list-card ${className || ''}`}>
        {list.map((item, index) => (
          <Description
            key={`desc_${index}`}
            size="small"
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

  .card.sirius-list-card.staking {
    .list-desp {
      .left {
        width: 12rem;
      }
    }
  }
`;
