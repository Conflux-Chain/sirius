import React from 'react';

describe('<Transactions />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. Transactions</div>;
    expect(component).toMatchSnapshot();
  });
});
