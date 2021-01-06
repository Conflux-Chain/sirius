import React from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';

import iconArrow from './assets/arrow.svg';

export const Link = ({
  children,
  href,
  className,
}: {
  children?;
  href: string;
  className?: string;
}) => {
  return (
    <LinkWrapper className={clsx('connect-wallect-link', className)}>
      <a
        href={href}
        target="_blank"
        className="link-anchor"
        rel="noopener noreferrer"
      >
        <span className="link-text">{children}</span>
        <img src={iconArrow} alt="link arrow icon"></img>
      </a>
    </LinkWrapper>
  );
};

const LinkWrapper = styled.span`
  .link-anchor {
    color: #0e47ef;
  }

  .link-text {
    display: inline-block;
    margin-right: 0.2857rem;
  }
`;
