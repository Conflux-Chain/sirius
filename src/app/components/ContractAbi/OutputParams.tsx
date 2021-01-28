/**
 *
 * OutputParams Component
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
interface OutputParamsProps {
  outputs?: object[];
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof OutputParamsProps>;
export declare type Props = OutputParamsProps & NativeAttrs;

const OutputParams = ({ outputs }: Props) => {
  let str = '';
  if (outputs) {
    outputs.forEach(function (value, index) {
      str += `${value['name']} <i>(${value['type']})</i>`;
      if (index !== outputs.length - 1) {
        str += ', ';
      }
    });
  }
  return (
    <>
      <Container>
        <span className="label">Return:</span>
        <span className="content" dangerouslySetInnerHTML={{ __html: str }} />
      </Container>
    </>
  );
};
const Container = styled.div`
  margin: 8px 0;
  .label {
    font-size: 14px;
    color: #002257;
    line-height: 22px;
  }
  .content {
    display: inline-block;
    margin-left: 8px;
    color: #97a3b4;
    line-height: 22px;
    font-size: 14px;
  }
`;
export default OutputParams;
