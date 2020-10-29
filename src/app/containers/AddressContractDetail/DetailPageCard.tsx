/**
 *
 * DetailPageCard
 *
 */

import React, { memo, ReactNode } from 'react';
import styled from 'styled-components/macro';
import { Card } from '../../components/Card';
import { media } from 'styles/media';

interface Props {
  title: string | ReactNode;
  icon: ReactNode;
  content: ReactNode;
}

export const DetailPageCard = memo((props: Props) => {
  const { title, icon, content } = props;
  return (
    <Main>
      <Card className="detail-page-card">
        <Inner>
          <Left>
            <Title>{title}</Title>
            <Content>{content}</Content>
          </Left>
          <Right>
            <Icon>{icon}</Icon>
          </Right>
        </Inner>
      </Card>
    </Main>
  );
});

const Main = styled.div`
  min-width: 17rem;
  .detail-page-card.card {
    div.content {
      padding: 16px 0;
    }
  }

  ${media.s} {
    min-width: 13.67rem;
    .detail-page-card.card {
      padding: 0;
      div.content {
        padding: 0;
      }
    }
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${media.s} {
    padding: 0.83rem 0.98rem;
  }
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
`;
const Right = styled.div``;
const Title = styled.div`
  color: #74798c;
  text-transform: capitalize;
`;
const Content = styled.div`
  font-weight: 700;
  color: #282d30;
  font-size: 1.71rem;

  ${media.s} {
    font-size: 1.5rem;
  }
`;
const Icon = styled.div``;
