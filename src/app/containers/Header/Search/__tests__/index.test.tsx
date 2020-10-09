import React from 'react';
import { render } from '@testing-library/react';

import { Search } from '../';

describe('<Search  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Search />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
