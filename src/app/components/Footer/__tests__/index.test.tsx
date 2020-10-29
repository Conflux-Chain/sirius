import React from 'react';
import { render } from '@testing-library/react';

import { Footer } from '..';

describe('<Footer  />', () => {
  it('should match snapshot', () => {
    const left = [<span key="1">left</span>];
    const rightTop = [<span key="1">rightTop</span>];
    const rightBottom = [
      <span key="1">@2020 Conflux. All Rights Reserved</span>,
    ];
    const loadingIndicator = render(
      <Footer left={left} rightTop={rightTop} rightBottom={rightBottom} />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
