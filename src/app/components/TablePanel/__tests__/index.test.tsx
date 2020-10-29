import React from 'react';
import { render } from '@testing-library/react';
describe('<TablePanel  />', () => {
  it('should match snapshot', () => {
    const tablePanel = render(<div>Todo.</div>);
    expect(tablePanel).toMatchSnapshot();
  });
});
