import React from 'react';
import { Card } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import { CardProps } from '@cfxjs/react-ui/dist/card/card';
import clsx from 'clsx';

export default ({ children, className, ...others }: Partial<CardProps>) => {
  return (
    <CardWrapper>
      <Card className={clsx('sirius-Card', className)} {...others}>
        {children}
      </Card>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  .card.sirius-Card {
    box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
    padding: 0.7143rem;
    &:hover {
      box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
    }
    img,
    .img {
      width: inherit;
    }
  }
`;
