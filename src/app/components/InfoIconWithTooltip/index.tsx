import React from 'react';
import imgInfo from 'images/info.svg';
import { Tooltip } from '@cfxjs/antd';
import { Image } from '@cfxjs/antd';

export const InfoIconWithTooltip = ({
  info,
  size = 14,
}: {
  info: React.ReactNode;
  size?: number;
}) => {
  return (
    <Tooltip title={info}>
      <Image
        src={imgInfo}
        alt="?"
        className="icon-info"
        preview={false}
        width={size}
      />
    </Tooltip>
  );
};
