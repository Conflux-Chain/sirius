/**
 *
 * Placeholder
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import imgTableWhoops from 'images/table-whoops.png';

interface Props {
  show: boolean;
  className?: string;
  children?: React.ReactNode;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export type PlaceholderProps = React.PropsWithChildren<Props & NativeAttrs>;

export const Placeholder = ({
  show,
  className,
  children,
  ...others
}: PlaceholderProps) => {
  const { t } = useTranslation();
  const noData = t(translations.general.table.noData);
  const whoops = t(translations.general.table.whoops);
  return (
    <Wrapper
      className={clsx('placeholder', className, {
        show,
      })}
      {...others}
    >
      <img className="img" src={imgTableWhoops} alt="no data"></img>
      <p className="title">{whoops}</p>
      <h1 className="description">{noData}</h1>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: none;

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
