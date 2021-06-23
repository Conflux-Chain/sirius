import React from 'react';
import styled from 'styled-components/macro';
import { monospaceFont } from 'styles/variable';

interface Props {
  isMonospace?: boolean;
  children: React.ReactNode;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type WrapperProps = Props & NativeAttrs;

export const Wrapper = ({ isMonospace, children, ...others }: WrapperProps) => {
  return (
    <StyledWrapper isMonospace={isMonospace} {...others}>
      {children}
    </StyledWrapper>
  );
};

Wrapper.defaultProps = {
  isMonospace: false,
};

const StyledWrapper = styled.div<{
  isMonospace?: boolean;
}>`
  margin: initial;
  height: 13.2857rem;
  overflow-y: auto;
  color: #97a3b4;
  background: #fafbfc;
  padding: 0.7143rem;
  font-family: ${props => (props.isMonospace ? monospaceFont : 'inherit')};
`;
