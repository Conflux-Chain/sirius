import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Text } from '@cfxjs/react-ui';
import { TooltipProps } from '@cfxjs/react-ui/dist/tooltip/tooltip';
import { TextProps } from '@cfxjs/react-ui/dist/text/text';
import styled from 'styled-components/macro';

type MyTextProps = {
  children?: React.ReactNode;
  maxWidth?: string;
  maxCount?: number;
  hoverValue?: React.ReactNode;
  tooltipConfig?: Partial<TooltipProps>;
} & Partial<TextProps>;
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof MyTextProps>;
export declare type Props = MyTextProps & NativeAttrs;

const Wrapper = styled(Text)<{ maxWidth: string }>`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: ${props => props.maxWidth};
  display: ${props =>
    props.maxWidth === undefined ? 'inherit' : 'inline-block'};
  cursor: pointer;
` as typeof Text & React.FC<Props & { maxWidth?: string }>;

// note:
// 1. maxWidth priority is higher than maxCount
// 2. maxCount obly apply to string
// 3. if hoverValue if provide, use hoverValue as Tooltip text, other wise use children
const TextComponent = ({
  children,
  maxWidth,
  maxCount,
  hoverValue,
  tooltipConfig,
  ...props
}: Props) => {
  let child: any = children || '';
  if (maxWidth === undefined && maxCount && typeof children === 'string') {
    child = child.substr(0, maxCount) + '...';
  }
  const tooltipValue = hoverValue || children;
  return (
    <Tooltip {...tooltipConfig} text={tooltipValue}>
      <Wrapper maxWidth={maxWidth} {...props}>
        {child}
      </Wrapper>
    </Tooltip>
  );
};

TextComponent.defaultProps = {
  maxCount: 8,
};

TextComponent.propTypes = {
  maxCount: PropTypes.number,
  maxWidth: PropTypes.string,
  hoverValue: PropTypes.node,
  tooltipConfig: PropTypes.object,
};

export default TextComponent;
