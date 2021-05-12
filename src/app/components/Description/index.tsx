/**
 *
 * Description
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import clsx from 'clsx';

interface Props {
  title: React.ReactNode;
  small?: boolean;
  children: React.ReactNode;
  noBorder?: boolean;
  verticle?: boolean;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type DescriptionProps = React.PropsWithChildren<Props & NativeAttrs>;

export const Description = ({
  title,
  style,
  className,
  children,
  small,
  noBorder,
  verticle,
  ...others
}: DescriptionProps) => {
  return (
    <Wrapper
      style={style}
      className={clsx('description', className, {
        small: small,
        'no-border': noBorder,
        verticle: verticle,
      })}
      {...others}
    >
      <div className="left">{title}</div>
      <div className="right">{children}</div>
    </Wrapper>
  );
};
Description.defaultProps = {
  verticle: false,
};

const Wrapper = styled.div`
  display: flex;
  min-height: 3.2857rem;
  line-height: 3.2857rem;
  border-bottom: 1px solid #e8e9ea;

  &.no-border {
    border-bottom: none;
  }

  &.small {
    .left {
      width: 10rem;
    }
  }

  .left {
    padding: 0.8571rem 0;
    line-height: calc(3.2857rem - 1.7143rem);
    width: 25%;
    min-width: 160px;
    max-width: 260px;
    color: #002257;
    flex-shrink: 0;
  }

  .right {
    padding: 0.8571rem 0;
    line-height: calc(3.2857rem - 1.7143rem);
    flex-grow: 1;
    color: #97a3b4;

    ${media.s} {
      padding-top: 0;
    }
  }

  ${media.s} {
    flex-direction: column;
  }

  &.verticle {
    flex-direction: column;

    .left {
      width: 100%;
    }

    .right {
      padding-top: 0;
    }
  }
`;
