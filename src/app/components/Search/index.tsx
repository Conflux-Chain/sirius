import React, { useState, useEffect } from 'react';
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
    setValue?: (value: string | undefined) => void,
  ) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
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
  onClear,
  val,
  ...props
}: Props) => {
  const [value, setValue] = useState(val);
  const type = value ? 'delete' : 'search';
  const clickable = !!value;
  const onIconRightClickHander = () => {
    if (type === 'delete') {
      setValue('');
      onClear && onClear();
    }
  };
  const onChangeHandler = e => {
    setValue(e.target.value);
    onChange && onChange(e.target.value);
  };
  useEffect(() => {
    setValue(val);
  }, [val]);
  return (
    <div className={`${outerClassname}`}>
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
        className={`${inputClassname}`}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            onEnterPress && onEnterPress(e, value, setValue);
          }
        }}
        onChange={onChangeHandler}
      />
    </div>
  );
};
