import React from 'react';
import { Text as UIText } from '@cfxjs/react-ui';
import { Tooltip } from '../Tooltip';
import { TooltipProps } from '@cfxjs/react-ui/dist/tooltip/tooltip';
import { TextProps as ReactUITextProps } from '@cfxjs/react-ui/dist/text/text';
import styled from 'styled-components/macro';
import { selectText } from './../../../utils/util';
import clsx from 'clsx';

type TextProps = {
  children?: React.ReactNode;
  maxWidth?: string;
  maxCount?: number;
  hoverValue?: React.ReactNode;
  tooltipProps?: Partial<TooltipProps>;
} & Partial<ReactUITextProps>;
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof TextProps>;
export declare type Props = TextProps & NativeAttrs;

// note:
// 1. maxWidth priority is higher than maxCount
// 2. maxCount only apply to string
// 3. if hoverValue is provided, use hoverValue as Tooltip text, otherwise use children
//    if text of prop tooltip is provided, use as Tooltip text
export const Text = ({
  className,
  children,
  maxWidth,
  maxCount,
  hoverValue,
  tooltipProps,
  ...props
}: Props) => {
  const { text, ...others } = tooltipProps || {};
  let child: React.ReactNode = children;
  if (maxWidth === undefined && maxCount && typeof children === 'string') {
    child = String.prototype.substr.call(children, 0, maxCount) + '...';
  }
  const tooltipText = (
    <div onClick={e => selectText(e.currentTarget)}>
      {text || hoverValue || children}
    </div>
  );

  return (
    <Tooltip text={tooltipText} placement="top" {...others}>
      <StyledTextWrapper maxWidth={maxWidth}>
        <UIText className={clsx('sirius-text', className)} {...props}>
          {child}
        </UIText>
      </StyledTextWrapper>
    </Tooltip>
  );
};

const StyledTextWrapper = styled.span<any>`
  .text.sirius-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: bottom;
    max-width: ${props => props.maxWidth};
    display: ${props =>
      props.maxWidth === undefined ? 'inherit' : 'inline-block'};
    cursor: pointer;
  }
`;
