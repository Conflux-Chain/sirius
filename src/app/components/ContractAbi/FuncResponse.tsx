/**
 *
 * FuncResponse Component
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
interface OutputParamsProps {
  name: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof OutputParamsProps>;
export declare type Props = OutputParamsProps & NativeAttrs;

const FuncResponse = ({ name }: Props) => {
  return (
    <>
      <Container>
        [ <strong>{name}</strong> method response ]
      </Container>
    </>
  );
};
const Container = styled.div`
  margin: 12px 0;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  color: #97a3b4;
`;
export default FuncResponse;
