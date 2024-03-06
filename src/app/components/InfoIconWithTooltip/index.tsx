import React from 'react';
import imgInfo from 'images/info.svg';
import { Tooltip } from '@cfxjs/antd';
import { Image } from '@cfxjs/antd';
import styled from 'styled-components';

export const InfoIconWithTooltip = ({
  info,
  size = 14,
  children = null,
}: {
  info: React.ReactNode;
  size?: number;
  children?: React.ReactNode;
}) => {
  const title =
    typeof info === 'string' ? info.split('\n').map(i => <div>{i}</div>) : info;
  return (
    <StyledContentWrapper>
      {children ? <span className="infoIcon-text">{children}</span> : null}
      <Tooltip title={title}>
        <Image
          src={imgInfo}
          alt="?"
          className="icon-info"
          preview={false}
          width={size}
        />
      </Tooltip>
    </StyledContentWrapper>
  );
};

const StyledContentWrapper = styled.span`
  display: inline-flex;
  align-items: center;

  .infoIcon-text {
    margin-right: 0.2857rem;
  }
`;
