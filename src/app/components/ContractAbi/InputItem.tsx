/**
 *
 * InputItem Component
 *
 */
import React, { useState } from 'react';
import { NumberType } from './constants';
import ParamTitle from './ParamTitle';
import { Form } from '@cfxjs/antd';
import ParamInput from './ParamInput';

interface InputItemProps {
  inputItem: any;
  parentId: string;
  index: number;
  getValidator: (
    type: string,
  ) => (_: any, value: any) => Promise<void> | undefined;
}

const InputItem = ({
  inputItem,
  parentId,
  getValidator,
  index,
}: InputItemProps) => {
  const [expand, setExpand] = useState(false);
  return (
    <>
      <ParamTitle
        name={inputItem.name}
        type={inputItem.type}
        key={parentId + 'title' + inputItem.name + index}
        expandable={NumberType.includes(inputItem.type)}
        expand={expand}
        setExpand={setExpand}
      />
      <Form.Item
        name={`name${parentId}-${inputItem.name || 'input'}-${index}`}
        rules={[{ validator: getValidator(inputItem.type) }]}
        key={parentId + 'form' + inputItem.name + index}
      >
        <ParamInput
          input={inputItem}
          type={inputItem.type}
          key={parentId + 'input' + inputItem.name + index}
          expand={expand}
        />
      </Form.Item>
    </>
  );
};
export default InputItem;
