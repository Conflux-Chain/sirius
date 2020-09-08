import React from 'react';
import { render } from '@testing-library/react';

import { Footer } from '..';

describe('<Footer  />', () => {
  it('should match snapshot', () => {
    const left = [<span key="1">left</span>];
    const right = [<span key="1">right</span>];
    const bottom = <span key="1">@2020 Conflux. All Rights Reserved</span>;
    const loadingIndicator = render(
      <Footer left={left} right={right} bottom={bottom} />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
