import React from 'react';
import { Tooltip as UITooltip } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import { TooltipProps } from '@cfxjs/react-ui/dist/tooltip/tooltip';
import clsx from 'clsx';

export const Tooltip = ({
  children,
  contentClassName,
  text,
  ...others
}: TooltipProps) => {
  return (
    <TooltipWrapper>
      <UITooltip
        contentClassName={clsx('sirius-tooltip', contentClassName)}
        text={text}
        {...others}
      >
        {children}
      </UITooltip>
    </TooltipWrapper>
  );
};

const TooltipWrapper = styled.div`
  .tooltip-content.sirius-tooltip {
    border-radius: 0;
    padding: 0.2857rem 0.7143rem;
    font-weight: 400;
    border-radius: 0;
    font-size: 12px;
    color: #cdcdcd;
    line-height: 1.1429rem;
  }
`;
