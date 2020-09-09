import React, { ReactNode, MouseEventHandler } from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { Link } from '@cfxjs/react-ui';
import { useRouteMatch, match } from 'react-router-dom';
import { media, useBreakpoint } from 'styles/media';
import { ChevronUp } from '@geist-ui/react-icons';
import { useToggle } from 'react-use';

export type HeaderLinkTitle = string | Array<string | ReactNode>;
export type HeaderLinkHref = string | string[] | MouseEventHandler;
export type HeaderLinks = Array<HeaderLinkTitle | HeaderLinkHref>;

export function generateHeaderLinksJSX(links: HeaderLinks, level = 0) {
  const linksJSX: ReactNode[] = [];

  for (let i = 0; i < links.length - 1; i += 2) {
    const [title, href] = [links[i], links[i + 1]];
    let matched;
    if (typeof href === 'string' && href.startsWith('/'))
      // eslint-disable-next-line react-hooks/rules-of-hooks
      matched = useRouteMatch(href as string);
    if (Array.isArray(href)) {
      linksJSX.push(
        <HeaderLink key={i} className={`navbar-link level-${level}`}>
          {title}
          {generateHeaderLinksJSX(href as HeaderLinks, level + 1)}
        </HeaderLink>,
      );
      continue;
    }

    if (typeof href === 'function') {
      linksJSX.push(
        <HeaderLink
          key={i}
          className={`navbar-link level-${level}`}
          onClick={href}
          matched={Boolean(matched) && (matched as match<{}>).isExact}
        >
          {title}
        </HeaderLink>,
      );
      continue;
    }

    linksJSX.push(
      <HeaderLink
        key={i}
        className={`navbar-link level-${level}`}
        href={href}
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
        visibility: visible;
      }
    }
  }

  ${media.s} {
    position: inherit;
    background-color: transparent;
    padding-left: 2.43rem;
  }
`;

export const HeaderLink: React.FC<{
  className: string;
  href?: string;
  matched?: boolean;
  onClick?: MouseEventHandler;
}> = ({ className, href, matched, children, onClick }) => {
  const [expanded, toggle] = useToggle(false);
  const bp = useBreakpoint();

  if (href) {
    return (
      <WrappLink>
        <Link className={clsx(className, matched && 'matched')} href={href}>
          {children}
        </Link>
      </WrappLink>
    );
  } else if (onClick) {
    // select
    return (
      <WrappLink>
        <div
          className={clsx([
            'link navbar-link-menu navbar-link',
            expanded ? 'expanded' : '',
          ])}
        >
          <Link
            className={className}
            onClick={e => {
              e.preventDefault();
              onClick(e);
            }}
          >
            {bp === 's' && <ChevronUp size={18} />}
            {children}
          </Link>
        </div>
      </WrappLink>
    );
  } else {
    const [text, links] = children as ReactNode[];

    return (
      <WrappLink style={{ marginLeft: bp === 's' ? '-18px' : 0 }}>
        <div
          className={clsx([
            'link navbar-link-menu navbar-link',
            expanded ? 'expanded' : '',
          ])}
        >
          <WrappLink>
            <Link
              className={className}
              onClick={e => {
                toggle();
                e.preventDefault();
              }}
            >
              {bp === 's' && <ChevronUp size={18} />}
              {text}
              {bp !== 's' && <ChevronUp size={18} />}
            </Link>
          </WrappLink>
          {expanded && <Menu className="header-link-menu">{links}</Menu>}
        </div>
      </WrappLink>
    );
  }
};

const WrappLink = styled.span`
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
      > a.link.navbar-link {
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

  ${media.s} {
    a.link.navbar-link {
      flex-direction: row;
      color: #aab9eb;
      :hover {
        color: #aab9eb;
      }
    }
  }
`;
