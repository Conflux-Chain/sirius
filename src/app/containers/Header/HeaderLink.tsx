import React, { MouseEventHandler, ReactNode, useRef } from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { useRouteMatch } from 'react-router-dom';
import {
  useBreakpoint,
  media,
} from '@cfxjs/sirius-next-common/dist/utils/media';
import { ChevronDown } from '@zeit-ui/react-icons';
import { useClickAway, useToggle } from 'react-use';
import { ScanEvent } from '../../../utils/gaConstants';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';

export type HeaderLinkTitle = ReactNode | Array<ReactNode> | false;

export interface HeaderLink {
  title: HeaderLinkTitle;
  href?: string;
  name?: string;
  className?: string;
  onClick?: MouseEventHandler;
  children?: HeaderLink[];
  isMatchedFn?: (link: Partial<HeaderLink>) => boolean;
  matched?: boolean;
  afterClick?: VoidFunction;
  plain?: boolean;
  vertical?: boolean;
}

export type HeaderLinks = HeaderLink[];

export function genParseLinkFn(links: HeaderLinks, level = 0) {
  function parseLink(link: HeaderLink, idx: number) {
    const {
      title,
      href,
      name,
      className = '',
      onClick,
      children,
      isMatchedFn,
      matched: customMatched,
      afterClick,
      plain,
      vertical,
    } = link;

    let matched: boolean = customMatched || false;
    let childrenUI: ReactNode[] = [];
    let isMenu = false;
    if (href) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      matched = Boolean(useRouteMatch(href as string)?.isExact);
    }

    if (isMatchedFn) {
      matched = isMatchedFn(link);
    }

    if (children) {
      childrenUI = genParseLinkFn(children, level + 1);
      isMenu = true;
    }

    return (
      <HeaderLink
        isMenu={isMenu}
        key={idx}
        href={href}
        name={name}
        level={level}
        className={`navbar-link level-${level} ${plain ? 'plain' : ''} ${
          vertical ? 'vertical' : ''
        } ${className}`}
        onClick={onClick}
        matched={matched}
        afterClick={afterClick}
        plain={plain}
      >
        {title === false ? null : plain ? <span>{title}</span> : title}
        <SubLinkWrap
          className={`sub-link-wrap level-${level} ${plain ? 'plain' : ''}`}
        >
          {childrenUI}
        </SubLinkWrap>
      </HeaderLink>
    );
  }

  return links.map(parseLink);
}

const Menu = styled.div<{ name?: string }>`
  position: absolute;
  width: max-content;
  ${props => (props.name === 'switch-network' ? 'right: 0;' : 'left: 0;')}
  top: 2.3rem;
  background-color: white;
  box-shadow: 0rem 0.43rem 1.14rem 0rem rgba(20, 27, 50, 0.08);
  border-radius: 0.14rem;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  z-index: 50;

  a.link.navbar-link {
    svg {
      visibility: hidden;
    }
    &.level-1.matched,
    &.level-2.matched {
      color: var(--theme-color-primary);

      svg {
        margin-left: 1rem;
        visibility: visible;
      }
    }
  }

  ${media.m} {
    top: 0;
    box-shadow: none;

    position: inherit;
    background-color: rgba(255, 255, 255, 0.1);
    padding-left: 0;
  }
`;

const SubLinkWrap = styled.div`
  &.level-0 {
    &.plain {
      display: flex;
      align-items: flex-start;
      flex-direction: row;
    }
  }
  &.level-2 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderLink: React.FC<{
  isMenu?: boolean;
  className: string;
  href?: string;
  name?: string;
  matched?: boolean;
  onClick?: MouseEventHandler;
  afterClick?: VoidFunction;
  level: number;
  plain?: boolean;
  children?: React.ReactNode;
}> = ({
  className,
  href,
  name,
  matched,
  children,
  onClick,
  isMenu,
  afterClick,
  level,
  plain = false,
}) => {
  const [expanded, toggle] = useToggle(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    if (expanded) {
      setTimeout(() => toggle(false), 200);
    }
  });
  const bp = useBreakpoint();

  if (href) {
    return (
      <WrappLink className={`link-wrap level-${level} ${className}`}>
        <Link
          className={clsx('link', className, matched && 'matched')}
          href={href}
          ga={
            name
              ? {
                  category: ScanEvent.menu.category,
                  action: name,
                }
              : undefined
          }
          afterClick={afterClick}
        >
          {children}
        </Link>
      </WrappLink>
    );
  } else if (onClick) {
    // select
    return (
      <WrappLink
        className={`link-wrap level-${level} ${className}`}
        onClick={e => {
          e.preventDefault();
          onClick(e);
          toggle();
        }}
      >
        <div
          className={clsx(
            'link navbar-link-menu navbar-link',
            isMenu && expanded && 'expanded',
          )}
        >
          <Link
            className={clsx(
              className,
              expanded && 'expanded',
              matched && 'matched',
            )}
          >
            {(bp === 'm' || bp === 's') && isMenu && <ChevronDown size={18} />}
            {children}
          </Link>
        </div>
      </WrappLink>
    );
  } else if (plain) {
    // sub menu
    return (
      <WrappLink className={`plain-wrap level-${level} ${className}`}>
        {children}
      </WrappLink>
    );
  } else {
    const [text, links] = children as ReactNode[];

    return (
      <WrappLink
        className={`link-wrap level-${level} ${className}`}
        ref={ref}
        onClick={e => {
          toggle();
          e.preventDefault();
        }}
      >
        <div
          className={clsx([
            'link navbar-link-menu navbar-link',
            isMenu && expanded ? 'expanded' : '',
          ])}
        >
          <WrappLink>
            <Link className={clsx(className, matched && 'matched')}>
              {(bp === 'm' || bp === 's') && isMenu && (
                <ChevronDown size={18} />
              )}
              {text}
              {bp !== 's' && bp !== 'm' && isMenu && <ChevronDown size={18} />}
            </Link>
          </WrappLink>
          {expanded && (
            <Menu className="header-link-menu" name={name}>
              {links}
            </Menu>
          )}
        </div>
      </WrappLink>
    );
  }
};

const WrappLink = styled.span`
  //min-height: 2.14rem;
  .navbar-link {
    position: relative;
    cursor: pointer;
    font-weight: 500;
    &:hover {
      color: var(--theme-color-primary) !important;
      //background-color: rgba(100%, 87%, 11%, 70%);
    }
    &.matched {
      color: var(--theme-color-primary) !important;
      &:hover {
        color: var(--theme-color-primary) !important;
      }
    }
    * {
      transition: none !important;
    }
  }

  ${media.m} {
    .navbar-link {
      &:hover {
        color: var(--theme-color-blue0) !important;
      }
      &.level-0:hover:not(.matched) {
        background-color: #f1f4f6 !important;
      }
      &.matched {
        color: var(--theme-color-blue0) !important;
        background-color: #fede1b;
        &:hover {
          color: var(--theme-color-blue0) !important;
          background-color: #fede1b;
        }
      }
    }
  }
  .navbar-link-menu {
    > a.link.navbar-link {
      svg {
        transition: all 0.2s ease-out;
      }
    }
    &.expanded {
      .header-link-menu > span {
        width: 100%;
      }
      > span > a.link.navbar-link {
        svg {
          transform: rotate(180deg);
        }
      }
    }
  }

  a.link.navbar-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #424a71;
    padding: 0 16px;

    &.level-1,
    &.level-2 {
      color: #65709a;

      ${media.m} {
        color: #eeeeee;
      }
    }

    &.home {
      padding-left: 0;
      padding-right: 2rem;
    }

    &.level-1,
    &.level-2 {
      width: auto;
      padding-top: 0.43rem;
      padding-bottom: 0.43rem;
      &.matched {
        color: var(--theme-color-primary) !important;
      }
      &:hover {
        &:not(.matched) {
          color: #424a71 !important;
        }
        border-radius: 0.14286rem;
        background: #f5f6fa;
      }
    }

    .sub-link-wrap.level-2:empty {
      display: none;
    }
  }

  &.navbar-link.plain.level-0 {
    .sub-link-wrap.level-0 {
      display: flex;
      align-items: flex-start;
      flex-direction: row;
      padding-top: 13px;
      padding-bottom: 13px;
    }
  }

  &.navbar-link.plain.level-1 {
    > span {
      display: block;
      color: #282d30;
      font-size: 16px;
      font-weight: 500;
      padding: 0.43rem 16px 0.6rem;
      svg {
        visibility: hidden;
      }
      &:hover {
        color: #424a71;
      }
    }
  }

  &.plain-wrap.level-1.vertical:not(:first-child) {
    display: block;
    border-top: 1px solid #e8e9ea;
    padding-top: 8px;
    margin-top: 8px;
  }

  &.plain-wrap.level-1:not(.vertical) {
    &:last-child {
      border-left: 1px solid #eee;
    }
  }

  ${media.m} {
    &.navbar-link.plain.level-0 {
      .sub-link-wrap.level-0 {
        flex-direction: column;
      }
    }

    &.navbar-link.plain.level-1 {
      > span {
        color: #999fb3;
        &:hover {
          color: #999fb3;
        }
      }
    }

    &.plain-wrap.level-1 {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #515c82;
      &:last-child {
        border-bottom: none;
      }
    }
  }

  ${media.m} {
    .navbar-link:hover {
      background-color: transparent;
    }
    a.link.navbar-link {
      flex-direction: row;
      color: #aab9eb;
      padding-top: 0.43rem;
      padding-bottom: 0.43rem;
      &:hover {
        color: #aab9eb;
      }
      &.level-0 {
        flex-direction: row-reverse;
      }
      &.level-1 {
        &.matched {
          background-color: #fede1b;
        }
      }

      &.home {
        flex-direction: row;
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
  }
`;
