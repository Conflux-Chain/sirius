/**
 *
 * CopyButton
 *
 */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Tooltip } from 'sirius-next/packages/common/dist/components/Tooltip';

interface IconButtonProps {
  size?: number;
  tooltipText?: React.ReactNode | string;
  url?: string;
  className?: string;
  blank?: boolean;
  viewBox?: string;
  onClick?: () => void;
}

export const IconButton = ({
  size,
  tooltipText,
  className,
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
      <Tooltip title={tooltipText}>
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
