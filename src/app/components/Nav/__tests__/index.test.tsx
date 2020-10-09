import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Nav } from '..';

describe('<Nav  />', () => {
  it('should match snapshot', () => {
    const brand = <span>header brand</span>;
    const menuStart = [<span>Blocks&Transaction</span>];
    const menuEnd = [<span>EN</span>];
    const ui = render(
      <Nav brand={brand} menuStart={menuStart} menuEnd={menuEnd} />,
    );
    expect(ui.container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot on mobile', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    const brand = <span>header brand</span>;
    const menuStart = [<span>Blocks&Transaction</span>];
    const menuEnd = [<span>EN</span>];
    const ui = render(
      <Nav brand={brand} menuStart={menuStart} menuEnd={menuEnd} />,
    );
    const burgerButton = ui.container.querySelector('.navbar-burger');
    expect(burgerButton).toBeDefined();
    userEvent.click(ui.container.querySelector('.navbar-burger') as Element);
    expect(ui.container.firstChild).toMatchSnapshot();
  });
});
