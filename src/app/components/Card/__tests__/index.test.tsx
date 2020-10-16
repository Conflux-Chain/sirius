import React from 'react';
import { render } from '@testing-library/react';
import { Card } from '..';

describe('<Card  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Card>test content</Card>);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
