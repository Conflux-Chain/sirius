import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Text } from '@cfxjs/react-ui';
import { TooltipProps } from '@cfxjs/react-ui/dist/tooltip/tooltip';
import { TextProps as ReactUITextProps } from '@cfxjs/react-ui/dist/text/text';
import styled from 'styled-components/macro';
import { selectText } from './../../../utils/util';

type TextProps = {
  children?: React.ReactNode;
  maxwidth?: string;
  maxCount?: number;
  hoverValue?: React.ReactNode;
  hovercolor?: string;
  tooltip?: Partial<TooltipProps>;
} & Partial<ReactUITextProps>;
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof TextProps>;
export declare type Props = TextProps & NativeAttrs;

const Wrapper = styled(Text)<any>`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  max-width: ${props => props.maxwidth};
  display: ${props =>
    props.maxwidth === undefined ? 'inherit' : 'inline-block'};
  cursor: pointer;
  font-weight: 400;
  &:hover {
    font-weight: 500;
    color: ${props => props.hovercolor};
  }
` as React.FC<Props>;

// note:
// 1. maxwidth priority is higher than maxCount
// 2. maxCount only apply to string
// 3. if hoverValue is provided, use hoverValue as Tooltip text, otherwise use children
//    if text of prop tooltip is provided, use as Tooltip text
const TextComponent = ({
  children,
  maxwidth,
  maxCount,
  hoverValue,
  tooltip,
  ...props
}: Props) => {
  let child: React.ReactNode = children;
  if (maxwidth === undefined && maxCount && typeof children === 'string') {
    child = String.prototype.substr.call(children, 0, maxCount) + '...';
  }
  const tooltipText = (
    <div onClick={e => selectText(e.currentTarget)}>
      {hoverValue || children}
    </div>
  );
  return (
    <Tooltip
      portalClassName="siriui-tooltip-square"
      text={tooltipText}
      {...tooltip}
    >
      <Wrapper maxwidth={maxwidth} {...props}>
        {child}
      </Wrapper>
    </Tooltip>
  );
};

TextComponent.defaultProps = {
  hovercolor: '#1E3DE4',
};

TextComponent.propTypes = {
  maxCount: PropTypes.number,
  maxwidth: PropTypes.string,
  hoverValue: PropTypes.node,
  hovercolor: PropTypes.string,
  tooltip: PropTypes.object,
};

export default TextComponent;
