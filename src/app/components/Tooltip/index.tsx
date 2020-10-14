import React from 'react';
import { Tooltip } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import { TooltipProps } from '@cfxjs/react-ui/dist/tooltip/tooltip';
import clsx from 'clsx';

const TooltipWrapper = styled.div`
  .tooltip-content.siriui-tooltip-square {
    border-radius: 0;
    padding: 0.2857rem 0.7143rem;
    font-weight: 400;
    border-radius: 0;
    font-size: 12px;
    color: #cdcdcd;
    line-height: 1.1429rem;
  }
`;

export default ({
  children,
  contentClassName,
  text,
  ...others
}: TooltipProps) => {
  return (
    <TooltipWrapper>
      <Tooltip
        contentClassName={clsx('siriui-tooltip-square', contentClassName)}
        text={text}
        {...others}
      >
        {children}
      </Tooltip>
    </TooltipWrapper>
  );
};
