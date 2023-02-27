/**
 *
 * Nav
 *
 */
import clsx from 'clsx';
import React, { HTMLAttributes, memo, ReactNode } from 'react';
import styled from 'styled-components/macro';
import { media, useBreakpoint } from 'styles/media';
import { usePlatform } from 'utils/hooks/usePlatform';

interface Props extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  mainMenu: ReactNode;
  topMenu: ReactNode;
  subMenu?: ReactNode;
  visible?: boolean;
  toggleMenu?: any;
}

const toWrappedArray = (p: ReactNode) =>
  Array.isArray(p)
    ? p.map((e, i) => (
        <Item className="navbar-item" key={i}>
          {e}
        </Item>
      ))
    : [
        <Item className="navbar-item" key={0}>
          {p}
        </Item>,
      ];

export const Nav = memo(
  ({
    brand,
    mainMenu,
    topMenu,
    subMenu = null,
    visible = false,
    toggleMenu = () => {},
    ...props
  }: Props) => {
    const bp = useBreakpoint();
    brand = toWrappedArray(brand);
    mainMenu = toWrappedArray(mainMenu);
    topMenu = toWrappedArray(topMenu);
    const sourceSubMenu = subMenu;
    subMenu = subMenu ? toWrappedArray(subMenu) : null;
    const { isDapp } = usePlatform();

    return (
      <Outer {...props}>
        <Container>
          <Brand className="navbar-brand">
            {brand}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              role="button"
              className={clsx(['navbar-burger', visible ? 'is-active' : ''])}
              aria-label="menu"
              aria-expanded={'true'}
              data-target="navbar"
              onClick={toggleMenu}
              style={{
                visibility: isDapp ? 'hidden' : 'inherit',
              }}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </Brand>
          <Menu
            visible={visible}
            className={clsx({ 'navbar-menu': true, 'is-active': visible })}
          >
            {bp === 's' || bp === 'm' ? (
              <MenuStart className="navbar-start">{mainMenu}</MenuStart>
            ) : null}
            <MenuEnd className="navbar-end">{topMenu}</MenuEnd>
          </Menu>
        </Container>
        <Container className="secondary">
          {bp !== 's' && bp !== 'm' ? (
            <Menu
              visible={visible}
              className={clsx({ 'navbar-menu': true, 'is-active': visible })}
            >
              <MenuStart className="navbar-start">{mainMenu}</MenuStart>
              <MenuEnd className="navbar-end">{subMenu}</MenuEnd>
            </Menu>
          ) : (
            <div>{sourceSubMenu}</div>
          )}
        </Container>
      </Outer>
    );
  },
);

const Item = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
`;
const Brand = styled.div`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;

  .navbar-burger {
    color: #4c4d52;
    display: none;
  }

  ${media.m} {
    margin-right: 0;

    .navbar-burger {
      cursor: pointer;
      display: block;
      height: 4rem;
      position: relative;
      width: 3.25rem;
      margin-left: auto;
      text-decoration: none;
      span {
        background-color: currentColor;
        display: block;
        height: 2px;
        left: calc(50% - 8px);
        position: absolute;
        transform-origin: center;
        transition-duration: 86ms;
        transition-property: background-color, opacity, transform;
        transition-timing-function: ease-out;
        width: 18px;

        :nth-child(1) {
          top: calc(50% - 6px);
        }
        :nth-child(2) {
          top: calc(50% - 1px);
        }
        :nth-child(3) {
          top: calc(50% + 4px);
        }
      }
    }
    .navbar-burger.is-active {
      span {
        :nth-child(1) {
          transform: translateY(5px) rotate(45deg);
        }
        :nth-child(2) {
          opacity: 0;
        }
        :nth-child(3) {
          transform: translateY(-5px) rotate(-45deg);
        }
      }
    }
  }
`;

const Menu = styled.div<{ visible: boolean }>`
  flex-grow: 1;
  flex-shrink: 0;
  align-items: stretch;
  display: flex;

  ${media.m} {
    width: 100vw;
    position: absolute;
    left: 0;
    display: ${props => (props.visible ? 'block' : 'none')};
  }
`;
const MenuStart = styled.div`
  flex-grow: 0;
  justify-content: flex-start;
  margin-right: auto;
  align-items: center;
  display: flex;

  ${media.m} {
    flex-direction: column;
    margin-bottom: 4.43rem;
    align-items: baseline;
  }
`;
const MenuEnd = styled.div`
  flex-grow: 1;
  justify-content: flex-end;
  margin-left: auto;
  align-items: center;
  display: flex;

  ${media.m} {
    align-items: baseline;
    justify-content: flex-start;
    flex-direction: column;
  }

  .notice {
    max-width: 700px;

    @media (max-width: 1300px) {
      max-width: calc(100vw - 650px);
    }
  }
`;
const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  flex-grow: 1;
  margin: 1.5rem auto 0;
  position: relative;
  width: 100%;
  max-width: 1368px;

  &.secondary {
    margin-top: 1.125rem;
    margin-bottom: 1.125rem;

    ${media.m} {
      padding-top: 0;
      padding-bottom: 0;
      margin-top: 0;
    }
    ${media.s} {
      display: none;
    }
  }

  @media (max-width: 1360px) {
    padding: 0 1rem;
  }

  /* mobile */
  ${media.m} {
    display: block;
    padding: 0 1.71rem;
    margin-top: 0;
  }
`;
const Outer = styled.nav`
  background-color: var(--theme-color-gray1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  width: 100vw;
  z-index: 1000;
  min-height: 5rem;
  box-shadow: 0px 4px 4px rgba(43, 45, 55, 0.0105441);

  // mobile
  ${media.m} {
    min-height: 4rem;
  }
`;
