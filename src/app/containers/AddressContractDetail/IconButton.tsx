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
  tooltipText?: string;
  url: string;
  className?: string;
  blank?: boolean;
}

export const IconButton = ({
  size,
  tooltipText,
  className,
  children,
  url,
  blank,
}: React.PropsWithChildren<IconButtonProps>) => {
  return (
    <IconButtonWrap>
      <Tooltip placement="top" text={tooltipText}>
        <RouterLink
          target={blank ? '_blank' : '_self'}
          to={url}
          className={className}
          style={{
            cursor: 'pointer',
          }}
        >
          <svg
            className={`icon ${className}`}
            viewBox="0 0 1024 1024"
            width={size || 8}
            height={size || 8}
          >
            <defs>
              <style type="text/css" />
            </defs>
            {children}
          </svg>
        </RouterLink>
      </Tooltip>
    </IconButtonWrap>
  );
};

const IconButtonWrap = styled.div``;
