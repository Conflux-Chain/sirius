import React from 'react';
import { Select as UISelect } from '@cfxjs/react-ui';
import styled from 'styled-components';
import { SelectProps } from '@cfxjs/react-ui/dist/select/select';
import clsx from 'clsx';

const Select = ({
  children,
  className,
  dropdownClassName,
  ...others
}: Partial<SelectProps>) => {
  return (
    <SelectWrapper>
      <UISelect
        dropdownClassName={clsx('sirius-select-dropdown', dropdownClassName)}
        className={clsx('sirius-select', className)}
        {...others}
      >
        {children}
      </UISelect>
    </SelectWrapper>
  );
};

Select.Option = UISelect.Option;

const SelectWrapper = styled.div`
  .select.sirius-select {
    height: 2.2857rem;
  }
`;

export { Select };
