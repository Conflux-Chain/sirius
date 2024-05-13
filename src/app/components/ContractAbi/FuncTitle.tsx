/**
 *
 * FuncTitle Component
 *
 */
import React from 'react';
import styled from 'styled-components';
interface FuncTitleProps {
  index?: string;
  title?: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof FuncTitleProps>;
export declare type Props = FuncTitleProps & NativeAttrs;

const FuncTitle = ({ index, title }: Props) => {
  return (
    <>
      <TitleContainer>
        {index}.{title}
      </TitleContainer>
    </>
  );
};
const TitleContainer = styled.span`
  font-size: 14px;
  color: #002257;
  line-height: 22px;
`;
export default FuncTitle;
