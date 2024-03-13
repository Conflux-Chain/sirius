import React from 'react';
import { Card as UICard } from '@cfxjs/react-ui';
import styled from 'styled-components';
import { CardProps } from '@cfxjs/react-ui/dist/card/card';
import clsx from 'clsx';
import { Spin } from '@cfxjs/antd';

export const Card = ({
  children,
  className,
  loading = false,
  ...others
}: Partial<CardProps> & { loading?: boolean }) => {
  return (
    <Spin spinning={loading}>
      <CardWrapper>
        <UICard className={clsx('sirius-card', className)} {...others}>
          {children}
        </UICard>
      </CardWrapper>
    </Spin>
  );
};

const CardWrapper = styled.div`
  .card.sirius-card {
    box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
    padding: 0 1.2857rem;
    &:hover {
      box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
    }
    .content {
      padding: 0;
    }
  }
`;
