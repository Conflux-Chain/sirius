import React from 'react';
import { render } from '@testing-library/react';

import PageHeader from '..';

describe('<PageHeader  />', () => {
  it('should match snapshot', () => {
    const pageHeader = render(<PageHeader>PageHeader</PageHeader>);
    expect(pageHeader).toMatchSnapshot();
  });
});
