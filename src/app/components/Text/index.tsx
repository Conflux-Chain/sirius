import React from 'react';
import { Text as UIText } from '@cfxjs/react-ui';
import { Tooltip } from 'sirius-next/packages/common/dist/components/Tooltip';
import { TextProps as ReactUITextProps } from '@cfxjs/react-ui/dist/text/text';
import styled from 'styled-components';
import { selectText } from 'sirius-next/packages/common/dist/utils';
import clsx from 'clsx';
import { useBreakpoint } from 'styles/media';

type TextProps = {
  children?: React.ReactNode;
  maxWidth?: string;
  maxCount?: number;
  hoverValue?: React.ReactNode;
  hoverValueMaxCount?: number;
} & Partial<ReactUITextProps>;
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof TextProps>;
export declare type Props = TextProps & NativeAttrs;

// note:
// 1. maxWidth priority is higher than maxCount
// 2. maxCount only apply to string
// 3. if hoverValue is provided, use hoverValue as Tooltip text, otherwise use children
//    if text of prop tooltip is provided, use as Tooltip text
export const Text = React.memo(
  ({
    className,
    children,
    maxWidth,
    maxCount,
    hoverValue,
    hoverValueMaxCount: outerHoverValueMaxCount,
    ...props
  }: Props) => {
    const bp = useBreakpoint();
    let child: React.ReactNode = children;
    if (maxWidth === undefined && maxCount && typeof children === 'string') {
      child = String.prototype.substr.call(children, 0, maxCount) + '...';
    }

    let textContent = hoverValue || children;
    // 控制移动端字符串类型 tooltip 的长度
    // 这里有个问题，就是截断的位置可能是一个完整的单词，暂时没有办法处理，如果为了避免这种情况，需要由外面传入前对内容进行处理，比如设置固定宽度小于 24rem
    // @todo 后续可以试下读取文本长度，动态设置容器宽度值的方式，可以避免截断位置的问题
    if (bp === 's' && typeof textContent === 'string') {
      const hoverValueMaxCount = outerHoverValueMaxCount || 34; // default text count is 36
      let textContentCopy: string = textContent;
      let newTextContent: Array<React.ReactNode> = [];
      let count = 0;
      while (textContentCopy.length > hoverValueMaxCount) {
        newTextContent.push(
          <span key={count}>
            {textContentCopy.substr(0, hoverValueMaxCount)}
          </span>,
        );
        newTextContent.push(<br key={`br${count}`} />);
        textContentCopy = textContentCopy.substr(hoverValueMaxCount);
        // 防止文本过长的情况
        if (count > 3) {
          textContentCopy =
            textContentCopy.substr(0, hoverValueMaxCount - 3) + '...';
        }
      }
      newTextContent.push(<span key={++count}>{textContentCopy}</span>);
      textContent = newTextContent;
    }
    const tooltipText = React.createElement(
      'div',
      {
        onClick: e => {
          e.preventDefault();
          e.stopPropagation();

          selectText(e.currentTarget);
        },
      },
      textContent,
    );

    const p = { title: tooltipText };
    return React.createElement(Tooltip, p, [
      <StyledTextWrapper maxWidth={maxWidth} key="text">
        {/* @ts-ignore */}
        <UIText className={clsx('sirius-text', className)} {...props}>
          {child}
        </UIText>
      </StyledTextWrapper>,
    ]);
  },
);

const StyledTextWrapper = styled.span<any>`
  .text.sirius-text {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: bottom;
    max-width: ${props => props.maxWidth};
    display: ${props =>
      props.maxWidth === undefined ? 'inherit' : 'inline-block'};
    /* cursor: pointer; */
    a {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      vertical-align: bottom;
      max-width: ${props => props.maxWidth};
      display: ${props =>
        props.maxWidth === undefined ? 'inherit' : 'inline-block'};
      cursor: pointer;
    }
    a:hover {
      color: #0626ae;
    }
  }
`;
