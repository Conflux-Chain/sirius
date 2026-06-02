/**
 *
 * OutputParams Component
 *
 */
import React, { Fragment } from 'react';
import styled from 'styled-components';
interface OutputParamsProps {
  outputs?: object[];
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof OutputParamsProps>;
export declare type Props = OutputParamsProps & NativeAttrs;

const OutputParams = ({ outputs }: Props) => {
  const count = outputs ? outputs.length : 0;
  return (
    <>
      <Container>
        <span className="label">Return:</span>
        <span className="content">
          {outputs?.map((value, index) => {
            return (
              <Fragment key={index}>
                <span>
                  {value['name']} <i>({value['type']})</i>
                </span>
                {index !== count - 1 && <span>, </span>}
              </Fragment>
            );
          })}
        </span>
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
