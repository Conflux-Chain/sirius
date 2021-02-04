import React from 'react';

describe('<Accounts />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Accounts</div>;
    expect(component).toMatchSnapshot();
  });
});
