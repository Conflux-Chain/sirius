import React, { ReactNode, MouseEventHandler, useRef } from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { Link as UILink } from '@cfxjs/react-ui';
import { useRouteMatch, match, Link as RouterLink } from 'react-router-dom';
import { media, useBreakpoint } from 'styles/media';
import { ChevronUp } from '@geist-ui/react-icons';
import { useToggle, useClickAway } from 'react-use';

export type Node = string | ReactNode | JSX.Element;
export type HeaderLinkTitle = Node | Array<Node>;
export type HeaderLinkHref =
  | Node
  | Array<Node>
  | MouseEventHandler
  | [MouseEventHandler, (title: HeaderLinkTitle) => boolean];
export type HeaderLinks = Array<HeaderLinkTitle | HeaderLinkHref>;

export function generateHeaderLinksJSX(links: HeaderLinks, level = 0) {
  const linksJSX: ReactNode[] = [];

  for (let i = 0; i < links.length - 1; i += 2) {
    const [title, href] = [links[i], links[i + 1]];

    // for the matched route style
    let matched;
    if (typeof href === 'string' && href.startsWith('/'))
      // eslint-disable-next-line react-hooks/rules-of-hooks
      matched = useRouteMatch(href as string);

    // href is a array of two funcs means this is a link with [onClick, isMatchFn]
    if (
      Array.isArray(href) &&
      typeof href[0] == 'function' &&
      typeof href[1] === 'function'
    ) {
      matched = href[1](title as HeaderLinkTitle);
      linksJSX.push(
        <HeaderLink
          key={i}
          className={`navbar-link level-${level}`}
          onClick={href[0] as MouseEventHandler}
          matched={Boolean(matched)}
        >
          {title}
        </HeaderLink>,
      );
      continue;
    }

    // href is a array means this is a menu with multiple links
    if (Array.isArray(href) && typeof href[0] !== 'function') {
      linksJSX.push(
        <HeaderLink isMenu key={i} className={`navbar-link level-${level}`}>
          {title}
          {generateHeaderLinksJSX(href as HeaderLinks, level + 1)}
        </HeaderLink>,
      );
      continue;
    }

    // href is function means this is a link with on click function
    if (typeof href === 'function') {
      linksJSX.push(
        <HeaderLink
          key={i}
          className={`navbar-link level-${level}`}
          onClick={href as MouseEventHandler}
          matched={Boolean(matched) && (matched as match<{}>).isExact}
        >
          {title}
        </HeaderLink>,
      );
      continue;
    }

    // rest are normal links with normal href
    linksJSX.push(
      <HeaderLink
        key={i}
        className={`navbar-link level-${level}`}
        href={href as string}
        matched={Boolean(matched) && (matched as match<{}>).isExact}
      >
        {title}
      </HeaderLink>,
    );
  }

  return linksJSX;
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
    if (expanded) setTimeout(() => toggle(false), 200);
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
          toggle();
          onClick(e);
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
            {(bp === 'm' || bp === 's') && isMenu && <ChevronUp size={18} />}
            {children}
          </UILink>
        </div>
      </WrappLink>
    );
  } else {
    const [text, links] = children as ReactNode[];

    return (
      <WrappLink
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
            <UILink ref={ref} className={className}>
              {(bp === 'm' || bp === 's') && isMenu && <ChevronUp size={18} />}
              {text}
              {bp !== 's' && bp !== 'm' && isMenu && <ChevronUp size={18} />}
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
