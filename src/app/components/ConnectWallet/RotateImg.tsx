import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import clsx from 'clsx';

export const RotateImg = ({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt?: string;
  className?: string;
  style?: object;
}) => {
  return (
    <RotateImgWrapper className={clsx('rotate-img-wrapper')}>
      <img
        src={src}
        alt={alt || src}
        className={clsx('rotate-img', className)}
        style={style}
      ></img>
    </RotateImgWrapper>
  );
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const RotateImgWrapper = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  .rotate-img {
    display: block;
    animation: ${rotate} 1.5s ease-in-out infinite;
  }
`;
