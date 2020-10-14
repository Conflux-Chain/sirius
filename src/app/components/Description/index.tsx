/**
 *
 * Description
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { media } from 'styles/media';

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
}

export const Description = memo(({ title, children }: Props) => {
  return (
    <Wrapper>
      <Left>{title}</Left>
      <Right>{children}</Right>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  min-height: 46px;
  line-height: 46px;
  border-bottom: 1px solid #e8e9ea;
  display: flex;
  &:last-child {
    border-bottom: none;
  }
`;
const Line = styled.div`
  padding: 12px 0;
  line-height: calc(46px - 24px);
`;
const Left = styled(Line)`
  width: 230px;
  color: #002257;
`;
const Right = styled(Line)`
  flex-grow: 1;
`;
