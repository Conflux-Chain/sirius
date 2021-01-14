/**
 *
 * FuncBody Component
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
interface FuncBodyProps {
  children: React.ReactNode;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof FuncBodyProps>;
export declare type Props = React.PropsWithChildren<
  FuncBodyProps & NativeAttrs
>;

const FuncBody = ({ children }: Props) => {
  return (
    <>
      <Container>{children}</Container>
    </>
  );
};
const Container = styled.div`
  padding-left: 7px;
`;
export default FuncBody;
