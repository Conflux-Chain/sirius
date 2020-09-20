import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Text } from '@cfxjs/react-ui';
import { TooltipProps } from '@cfxjs/react-ui/dist/tooltip/tooltip';
import { TextProps } from '@cfxjs/react-ui/dist/text/text';
import styled from 'styled-components/macro';

type MyTextProps = {
  children?: React.ReactNode;
  maxwidth?: string;
  maxCount?: number;
  hoverValue?: React.ReactNode;
  tooltipConfig?: Partial<TooltipProps>;
} & Partial<TextProps>;
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof MyTextProps>;
export declare type Props = MyTextProps & NativeAttrs;

const Wrapper = styled(Text)<{ maxwidth: string }>`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: ${props => props.maxwidth};
  display: ${props =>
    props.maxwidth === undefined ? 'inherit' : 'inline-block'};
  cursor: pointer;
  font-size: 14px;
  font-family: CircularStd-Book, CircularStd;
  font-weight: 400;
  color: #20253a;
  line-height: 24px;
` as typeof Text & React.FC<Props & { maxwidth?: string }>;

// note:
// 1. maxwidth priority is higher than maxCount
// 2. maxCount only apply to string
// 3. if hoverValue is provided, use hoverValue as Tooltip text, otherwise use children
const TextComponent = ({
  children,
  maxwidth,
  maxCount,
  hoverValue,
  tooltipConfig,
  ...props
}: Props) => {
  let child: any = children || '';
  if (maxwidth === undefined && maxCount && typeof children === 'string') {
    child = child.substr(0, maxCount) + '...';
  }
  const tooltipValue = hoverValue || children;
  return (
    <Tooltip
      portalClassName="siriui-tooltip-square"
      {...tooltipConfig}
      text={tooltipValue}
    >
      <Wrapper maxwidth={maxwidth} {...props}>
        {child}
      </Wrapper>
    </Tooltip>
  );
};

TextComponent.defaultProps = {};

TextComponent.propTypes = {
  maxCount: PropTypes.number,
  maxwidth: PropTypes.string,
  hoverValue: PropTypes.node,
  tooltipConfig: PropTypes.object,
};

export default TextComponent;
