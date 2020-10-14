import React from 'react';
import { render } from '@testing-library/react';
describe('<Description  />', () => {
  it('should match snapshot', () => {
    const description = render(<div>Todo.</div>);
    expect(description).toMatchSnapshot();
  });
});
