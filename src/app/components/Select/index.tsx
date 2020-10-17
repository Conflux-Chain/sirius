import React from 'react';
import { Select as UISelect } from '@cfxjs/react-ui';
import styled from 'styled-components/macro';
import { SelectProps } from '@cfxjs/react-ui/dist/select/select';
import clsx from 'clsx';

const Select = ({ children, className, ...others }: Partial<SelectProps>) => {
  return (
    <SelectWrapper>
      <UISelect
        dropdownClassName="sirius-select-dropdown"
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
    height: 32px;
  }
`;

export { Select };
