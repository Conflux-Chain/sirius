/**
 *
 * CopyButton
 *
 */
import React from 'react';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import styled from 'styled-components';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';

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
          <Link
            target={blank ? '_blank' : '_self'}
            href={url || ''}
            className={className}
            style={{
              cursor: 'pointer',
            }}
          >
            {svg}
          </Link>
        )}
        {!url && svg}
      </Tooltip>
    </IconButtonWrap>
  );
};

const IconButtonWrap = styled.div`
  cursor: pointer;
`;
