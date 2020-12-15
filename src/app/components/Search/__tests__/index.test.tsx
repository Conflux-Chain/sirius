import React from 'react';
import { render } from '@testing-library/react';
import { Search } from '..';
describe('<Search  />', () => {
  it('should match snapshot', () => {
    const SearchComp = render(<Search>Search</Search>);
    expect(SearchComp).toMatchSnapshot();
  });
});
