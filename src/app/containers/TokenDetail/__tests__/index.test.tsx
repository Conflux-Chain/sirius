import React from 'react';
describe('<TokenDetail />', () => {
  it('should match the snapshot', () => {
    const component = <div>Todo. TokenDetail</div>;
    expect(component).toMatchSnapshot();
  });
});
