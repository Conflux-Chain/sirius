import React from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { monospaceFont } from 'styles/variable';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Age } from '@cfxjs/sirius-next-common/dist/components/Age';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import queryString from 'query-string';

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
  dataIndex?: string | string[];
  title?: React.ReactNode;
  ageFormat?: string;
  toggleAgeFormat?: any;
  right?: boolean;
  sorter?: boolean;
}

export const ColumnAge = ({
  key,
  dataIndex,
  title,
  ageFormat = 'age',
  toggleAgeFormat,
  right = false,
  sorter = false,
}: ColumnAgeTypes) => {
  return {
    title: (
      <ContentWrapper right={right}>
        <AgeTHeader
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();

            return (
              toggleAgeFormat &&
              toggleAgeFormat(ageFormat === 'age' ? 'datetime' : 'age')
            );
          }}
        >
          <Tooltip
            title={
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
      </ContentWrapper>
    ),
    dataIndex: dataIndex || 'syncTimestamp',
    key: key || 'syncTimestamp',
    width: 1,
    sorter: sorter,
    render: value => {
      const second = /^\d+$/.test(value) ? value : dayjs(value).unix();

      return (
        <ContentWrapper right={right}>
          {ageFormat === 'age' ? (
            <Age from={second} />
          ) : (
            <div
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {dayjs.unix(second).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          )}
        </ContentWrapper>
      );
    },
  };
};

const AgeTHeader = styled.div`
  display: inline-block;
  color: #1e3de4;
  cursor: pointer;
`;

export const number = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.number)}</Translation>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  render: (value, row, index, wrapperNumber = Infinity) => {
    const { skip = 0, limit = 10 } = queryString.parse(window.location.search);
    let page = 0;
    let pageSize = 10;
    let number = 1;

    try {
      page = Math.floor(Number(skip) / Number(limit)) + 1;
      pageSize = Math.floor(Number(limit));
      number = (page - 1) * pageSize + index + 1;
    } catch (e) {}

    if (String(number).length > wrapperNumber) {
      return (
        <Text
          maxCount={3}
          hoverValue={<StyledNumberWrapper>{number}</StyledNumberWrapper>}
        >
          {String(number)}
        </Text>
      );
    } else {
      return number;
    }
  },
};

const StyledNumberWrapper = styled.span`
  white-space: nowrap;
`;
