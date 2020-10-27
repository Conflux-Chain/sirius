import React, { ReactNode, MouseEventHandler, useRef } from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { Link as UILink } from '@cfxjs/react-ui';
import { useRouteMatch, Link as RouterLink } from 'react-router-dom';
import { media, useBreakpoint } from 'styles/media';
import { ChevronDown } from '@geist-ui/react-icons';
import { useToggle, useClickAway } from 'react-use';

export type Node = string | ReactNode | JSX.Element;
export type HeaderLinkTitle = Node | Array<Node>;

export interface HeaderLink {
  title: HeaderLinkTitle;
  href?: string;
  onClick?: MouseEventHandler;
  children?: HeaderLink[];
  isMatchedFn?: (link: Partial<HeaderLink>) => boolean;
  matched?: boolean;
}

export type HeaderLinks = HeaderLink[];

export function genParseLinkFn(links: HeaderLinks, level = 0) {
  function parseLink(link: HeaderLink, idx: number) {
    const {
      title,
      href,
      onClick,
      children,
      isMatchedFn,
      matched: customMatched,
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
        className={`navbar-link level-${level}`}
        onClick={onClick}
        matched={matched}
      >
        {title}
        {childrenUI}
      </HeaderLink>
    );
  }

  return links.map(parseLink);
}

const Menu = styled.div`
  position: absolute;
  width: max-content;
  right: 0;
  background-color: white;
  box-shadow: 0rem 0.43rem 1.14rem 0rem rgba(20, 27, 50, 0.08);
  border-radius: 0.14rem;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  a.link.navbar-link {
    svg {
      visibility: hidden;
    }
    &.level-1.matched {
      color: white;
      background-color: #65709a;
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
    box-shadow: none;

    position: inherit;
    background-color: transparent;
    padding-left: 2.43rem;
  }
`;

export const HeaderLink: React.FC<{
  isMenu?: boolean;
  className: string;
  href?: string;
  matched?: boolean;
  onClick?: MouseEventHandler;
}> = ({ className, href, matched, children, onClick, isMenu }) => {
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
      <WrappLink>
        <RouterLink
          className={clsx('link', className, matched && 'matched')}
          to={href}
        >
          {children}
        </RouterLink>
      </WrappLink>
    );
  } else if (onClick) {
    // select
    return (
      <WrappLink
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
  } else {
    const [text, links] = children as ReactNode[];

    return (
      <WrappLink
        ref={ref}
        style={{ marginLeft: bp === 'm' || bp === 's' ? '-18px' : 0 }}
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
            <UILink className={clsx(className, matched && 'matched')}>
              {(bp === 'm' || bp === 's') && isMenu && (
                <ChevronDown size={18} />
              )}
              {text}
              {bp !== 's' && bp !== 'm' && isMenu && <ChevronDown size={18} />}
            </UILink>
          </WrappLink>
          {expanded && <Menu className="header-link-menu">{links}</Menu>}
        </div>
      </WrappLink>
    );
  }
};

const WrappLink = styled.span`
  min-height: 2.14rem;
  .navbar-link-menu {
    position: relative;
    cursor: pointer;
    > a.link.navbar-link {
      display: flex;
      align-items: center;

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
    font-weight: 500;
    color: #65709a;
    padding: 0.43rem 1.5rem;

    :hover {
      color: #65709a;
    }

    &.matched {
      color: #65709a;
      background-color: #fede1b;
      :hover {
        color: #65709a;
      }
    }
  }

  ${media.m} {
    a.link.navbar-link {
      flex-direction: row;
      color: #aab9eb;
      :hover {
        color: #aab9eb;
      }
    }
  }
`;
