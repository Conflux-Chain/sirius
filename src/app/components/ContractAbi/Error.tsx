/**
 *
 * FuncTitle Component
 *
 */
import React from 'react';
import styled from 'styled-components';
interface ErrorProps {
  message?: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ErrorProps>;
export declare type Props = ErrorProps & NativeAttrs;

const FuncTitle = ({ message }: Props) => {
  return (
    <>
      <Container className={`${message ? 'shown' : 'hidden'}`}>
        {message}
      </Container>
    </>
  );
};
const Container = styled.div`
  margin: 8px 0;
  font-size: 12px;
  color: #e64e4e;
  line-height: 16px;
  .shown {
    visibility: visible;
  }
  .hidden {
    visibility: hidden;
  }
`;
export default FuncTitle;
