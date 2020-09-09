import React from 'react';
import { render } from '@testing-library/react';

import { Nav } from '..';

describe('<Nav  />', () => {
  it('should match snapshot', () => {
    const brand = <span>header brand</span>;
    const menuStart = [<span>Blocks&Transaction</span>];
    const menuEnd = [<span>EN</span>];
    const loadingIndicator = render(
      <Nav brand={brand} menuStart={menuStart} menuEnd={menuEnd} />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
