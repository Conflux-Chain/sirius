/**
 *
 * Nav
 *
 */
import clsx from 'clsx';
import React, { HTMLAttributes, memo, ReactNode } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components/macro';
import { media } from 'styles/media';

interface Props extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  menuStart: ReactNode;
  menuEnd: ReactNode;
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

export const Nav = memo(({ brand, menuStart, menuEnd, ...props }: Props) => {
  const [visible, toggleMenu] = useToggle(false);
  brand = toWrappedArray(brand);
  menuStart = toWrappedArray(menuStart);
  menuEnd = toWrappedArray(menuEnd);

  return (
    <Outter {...props}>
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
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </Brand>
        <Menu
          visible={visible}
          className={clsx({ 'navbar-menu': true, 'is-active': visible })}
        >
          <MenuStart className="navbar-start">{menuStart}</MenuStart>
          <MenuEnd className="navbar-end">{menuEnd}</MenuEnd>
        </Menu>
      </Container>
    </Outter>
  );
});

const Item = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  min-height: 5rem;

  ${media.s} {
    min-height: 2.14rem;
  }
`;
const Brand = styled.div`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
  margin-right: 4rem;
  .navbar-burger {
    color: #4c4d52;
    display: none;
  }

  ${media.s} {
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

  ${media.s} {
    width: 100vw;
    position: absolute;
    left: 0;
    display: ${props => (props.visible ? 'block' : 'none')};
  }
`;
const MenuStart = styled.div`
  justify-content: flex-start;
  margin-right: auto;
  align-items: stretch;
  display: flex;

  ${media.s} {
    flex-direction: column;
    margin-bottom: 4.43rem;
  }
`;
const MenuEnd = styled.div`
  justify-content: flex-end;
  margin-left: auto;
  align-items: stretch;
  display: flex;

  ${media.s} {
    align-items: baseline;
    justify-content: flex-start;
    flex-direction: column;
  }
`;
const Container = styled.div`
  display: flex;
  align-items: stretch;
  flex-grow: 1;
  margin: 0 auto;
  position: relative;
  padding: 0 2.86rem;

  // mobile
  ${media.s} {
    display: block;
    padding: 0 1.71rem;
  }
`;
const Outter = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: stretch;
  width: 100vw;
  z-index: 30;
  min-height: 5rem;

  // mobile
  ${media.s} {
    min-height: 4rem;
  }
`;
