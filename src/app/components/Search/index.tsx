import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Input } from '@cfxjs/react-ui';
import { SearchIcon } from '../SearchIcon/Loadable';
import { DeleteIcon } from '../DeleteIcon/Loadable';
type SearchProps = {
  children?: React.ReactNode;
  outerClassname?: string;
  inputClassname?: string;
  iconColor?: string;
  placeholderText?: string;
  onEnterPress?: (
    e: React.KeyboardEvent<HTMLDivElement>,
    value?: string,
  ) => void;
  onChange?: (value: string) => void;
  val?: string;
};
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof SearchProps>;
export declare type Props = SearchProps & NativeAttrs;

export const Search = ({
  outerClassname,
  placeholderText,
  inputClassname,
  onEnterPress,
  iconColor,
  onChange,
  val,
  ...props
}: Props) => {
  const [value, setValue] = useState(val);
  const [type, setType] = useState('search');
  const [clickable, setClickable] = useState(false);
  const onIconRightClickHander = () => {
    if (type === 'delete') {
      setValue('');
    }
  };
  const onChangeHandler = e => {
    setValue(e.target.value);
    onChange && onChange(e.target.value);
  };
  useEffect(() => {
    if (value) {
      setType('delete');
      setClickable(true);
    } else {
      setType('search');
      setClickable(false);
    }
  }, [value]);

  useEffect(() => {
    setValue(val);
  }, [val]);
  return (
    <div className={outerClassname}>
      <Input
        value={value}
        width="100%"
        color="primary"
        iconRight={
          type === 'search' ? (
            <SearchIcon color={iconColor} />
          ) : (
            <DeleteIcon color={iconColor} />
          )
        }
        iconRightClickable={clickable}
        onIconRightClick={onIconRightClickHander}
        placeholder={placeholderText}
        className={inputClassname}
        onKeyPress={e => {
          if (e.key === 'Enter') onEnterPress && onEnterPress(e, value);
        }}
        onChange={onChangeHandler}
      />
    </div>
  );
};
