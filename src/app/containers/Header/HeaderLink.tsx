import React, { MouseEventHandler, ReactNode, useRef } from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { Link as UILink } from '@cfxjs/react-ui';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { media, useBreakpoint } from 'styles/media';
import { ChevronDown } from '@zeit-ui/react-icons';
import { useClickAway, useToggle } from 'react-use';
import { ScanEvent } from '../../../utils/gaConstants';
import { trackEvent } from '../../../utils/ga';
import { Link } from '../../components/Link/Loadable';

export type HeaderLinkTitle = ReactNode | Array<ReactNode>;

export interface HeaderLink {
  title: HeaderLinkTitle;
  href?: string;
  name?: string;
  className?: string;
  onClick?: MouseEventHandler;
  children?: HeaderLink[];
  isMatchedFn?: (link: Partial<HeaderLink>) => boolean;
  matched?: boolean;
  afterClick?: any;
  plain?: boolean;
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
        className={`navbar-link level-${level} ${
          plain ? 'plain' : ''
        } ${className}`}
        onClick={onClick}
        matched={matched}
        afterClick={afterClick}
        plain={plain}
      >
        {plain ? <span>{title}</span> : title}
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
      color: white;
      background-color: var(--theme-color-blue0);
      :hover {
        color: white;
      }

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
  afterClick?: any;
  level: number;
  plain?: boolean;
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
        {href.startsWith('http') ? (
          <Link
            className={clsx('link', className, matched && 'matched')}
            href={href}
            target="_blank"
            ga={{
              category: ScanEvent.menu.category,
              action: name,
            }}
          >
            {children}
          </Link>
        ) : (
          <RouterLink
            className={clsx('link', className, matched && 'matched')}
            onClick={() => {
              if (name) {
                // ga
                trackEvent({
                  category: ScanEvent.menu.category,
                  action: name,
                });
              }
              if (afterClick && typeof afterClick === 'function') {
                afterClick();
              }
              if (href.startsWith('http')) {
                // @ts-ignore
                window.location = href;
              }
            }}
            to={
              href.startsWith('http')
                ? // @ts-ignore
                  window.location.pathname + window.location.search
                : href
            }
          >
            {children}
          </RouterLink>
        )}
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
          <UILink
            // eslint-disable-next-line no-script-url
            href="javascript:void(0)"
            className={clsx(
              className,
              expanded && 'expanded',
              matched && 'matched',
            )}
          >
            {(bp === 'm' || bp === 's') && isMenu && <ChevronDown size={18} />}
            {children}
          </UILink>
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
            <UILink
              // eslint-disable-next-line no-script-url
              href="javascript:void(0)"
              className={clsx(className, matched && 'matched')}
            >
              {(bp === 'm' || bp === 's') && isMenu && (
                <ChevronDown size={18} />
              )}
              {text}
              {bp !== 's' && bp !== 'm' && isMenu && <ChevronDown size={18} />}
            </UILink>
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
      color: #1e3de4 !important;
      //background-color: rgba(100%, 87%, 11%, 70%);
    }
    &.matched {
      color: #1e3de4 !important;
      &:hover {
        color: #1e3de4 !important;
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
        color: #fff !important;
        background-color: var(--theme-color-blue0);
      }
      :hover:not(.matched) {
        color: #fff !important;
        background-color: var(--theme-color-blue0);
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

  &.plain-wrap.level-1 {
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
      :hover {
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
