/**
 *
 * Empty
 *
 */
import React from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import imgTableWhoops from 'images/table-whoops.png';

interface Props {
  show: boolean;
  type?: 'fixed' | 'fluid';
  title?: string | null;
  noTitle?: boolean;
  description?: string | null;
  className?: string;
  children?: React.ReactNode;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type EmptyProps = React.PropsWithChildren<Props & NativeAttrs>;

export const Empty = ({
  show,
  type = 'fluid',
  className,
  title,
  noTitle = false,
  description,
  children,
  ...others
}: EmptyProps) => {
  const { t } = useTranslation();
  return (
    <Wrapper
      className={clsx('empty', className, {
        show,
      })}
      type={type}
      {...others}
    >
      <img className="img" src={imgTableWhoops} alt="no data" />
      {noTitle ? (
        <p className="noTitle" />
      ) : (
        <p className="title">{title || t(translations.general.table.whoops)}</p>
      )}
      <h1 className="description">
        {description || t(translations.general.table.noData)}
      </h1>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  type?: string;
}>`
  position: ${props => (props.type === 'fluid' ? 'relative' : 'absolute')};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: none;
  min-height: 16.4286rem;

  &.show {
    display: flex;
  }

  .img {
    width: 6rem;
    height: 8.5714rem;
  }

  .title {
    font-size: 1.5714rem;
    font-weight: 500;
    color: #000000;
    line-height: 2rem;
  }

  .description {
    font-size: 1rem;
    font-weight: 500;
    color: #4b4b4b;
    line-height: 1.2857rem;
    opacity: 0.4;
  }
`;
