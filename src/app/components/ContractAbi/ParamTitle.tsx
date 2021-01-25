/**
 *
 * ParamTitle Component
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
interface ParamTitleProps {
  name?: string;
  type?: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ParamTitleProps>;
export declare type Props = ParamTitleProps & NativeAttrs;

const ParamTitle = ({ name, type }: Props) => {
  let nameText = name || '<input>';
  return (
    <>
      <TitleContainer>
        {nameText}
        {type !== 'cfx' && (
          <span>
            &nbsp;(<i>{type}</i>)
          </span>
        )}
      </TitleContainer>
    </>
  );
};
const TitleContainer = styled.span`
  display: inline-block;
  font-size: 14px;
  color: #002257;
  line-height: 22px;
  margin-top: 8px;
`;
export default ParamTitle;
