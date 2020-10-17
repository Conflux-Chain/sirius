import React from 'react';
import { render } from '@testing-library/react';
import { Security } from '..';

describe('<Security  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Security type="lv0"></Security>);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
