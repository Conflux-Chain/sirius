import React from 'react';
import { render } from '@testing-library/react';

import { Header } from '..';

describe('<Header  />', () => {
  it('should match snapshot', () => {
    const logo = <span key="1">header logo</span>;
    const left = [<span key="1">Blocks&Transaction</span>];
    const right = [<span key="1">EN</span>];
    const loadingIndicator = render(
      <Header logo={logo} left={left} right={right} />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
