/**
 *
 * CopyButton
 *
 */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Tooltip } from '../../components/Tooltip';

interface IconButtonProps {
  size?: number;
  tooltipText?: React.ReactNode | string;
  url?: string;
  className?: string;
  blank?: boolean;
  tooltipContentClassName?: string;
  viewBox?: string;
  onClick?: () => void;
}

export const IconButton = ({
  size,
  tooltipText,
  className,
  tooltipContentClassName = '',
  children,
  url,
  blank,
  viewBox,
  onClick = () => {},
}: React.PropsWithChildren<IconButtonProps>) => {
  const svg = (
    <svg
      className={`icon ${className}`}
      viewBox={viewBox ? viewBox : '0 0 1024 1024'}
      width={size || 8}
      height={size || 8}
      onClick={onClick}
    >
      {children}
    </svg>
  );

  return (
    <IconButtonWrap>
      <Tooltip
        hoverable
        placement="top"
        text={tooltipText}
        contentClassName={tooltipContentClassName}
      >
        {url && (
          <RouterLink
            target={blank ? '_blank' : '_self'}
            to={url || ''}
            className={className}
            style={{
              cursor: 'pointer',
            }}
          >
            {svg}
          </RouterLink>
        )}
        {!url && svg}
      </Tooltip>
    </IconButtonWrap>
  );
};

const IconButtonWrap = styled.div`
  cursor: pointer;
`;
