import React from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { monospaceFont } from '../../styles/variable';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import { CountDown } from '../../app/components/CountDown/Loadable';
import { Tooltip } from '../../app/components/Tooltip/Loadable';

export interface ContentWrapperProps {
  children: React.ReactNode;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  className?: string;
  monospace?: boolean;
}

export const ContentWrapper = ({
  children,
  left,
  right,
  center,
  className,
  monospace,
  ...others
}: ContentWrapperProps) => {
  return (
    <StyledTdWrapper
      className={clsx({
        className,
        left,
        right,
        center,
        monospace,
      })}
      {...others}
    >
      {children}
    </StyledTdWrapper>
  );
};

const StyledTdWrapper = styled.div`
  &.monospace {
    font-family: ${monospaceFont};
  }
  &.right {
    text-align: right;
  }
  &.center {
    text-align: center;
  }
  &.left {
    text-align: left;
  }
`;

export interface ColumnAgeTypes {
  key?: string;
  dataIndex?: string;
  title?: React.ReactNode;
  ageFormat?: string;
  toggleAgeFormat?: any;
}

export const ColumnAge = ({
  key,
  dataIndex,
  title,
  ageFormat = 'age',
  toggleAgeFormat,
}: ColumnAgeTypes) => {
  return {
    title: (
      <AgeTHeader
        onClick={() =>
          toggleAgeFormat &&
          toggleAgeFormat(ageFormat === 'age' ? 'datetime' : 'age')
        }
      >
        <Tooltip
          text={
            <Translation>
              {t =>
                t(translations.general.table.switchAgeTip, {
                  format:
                    ageFormat === 'age'
                      ? t(translations.general.table.dateTime)
                      : t(translations.general.table.block.age),
                })
              }
            </Translation>
          }
          placement="top"
        >
          {ageFormat === 'age' ? (
            title || (
              <Translation>
                {t => t(translations.general.table.block.age)}
              </Translation>
            )
          ) : (
            <Translation>
              {t => t(translations.general.table.dateTime)}
            </Translation>
          )}
        </Tooltip>
      </AgeTHeader>
    ),
    dataIndex: dataIndex || 'syncTimestamp',
    key: key || 'syncTimestamp',
    width: 1,
    render: value =>
      ageFormat === 'age' ? (
        <CountDown from={value} />
      ) : (
        <div
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {dayjs.unix(value).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      ),
  };
};

const AgeTHeader = styled.div`
  color: #1e3de4;
  cursor: pointer;
`;
