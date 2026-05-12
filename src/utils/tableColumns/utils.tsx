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
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import imgArrow from 'images/token/arrow.svg';
import imgOut from 'images/token/out.svg';
import imgIn from 'images/token/in.svg';
import { formatAddress } from 'utils';
import { getPocketAlias } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/utils';
import { ProxyContractAddress } from '@cfxjs/sirius-next-common/dist/components/ProxyContractAddress';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';

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
  ageI18n?: string;
  datetimeI18n?: string;
}

export const ColumnAge = ({
  key,
  dataIndex,
  title,
  ageFormat = 'age',
  toggleAgeFormat,
  right = false,
  sorter = false,
  ageI18n = translations.general.table.block.age,
  datetimeI18n = translations.general.table.dateTime,
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
                    format: ageFormat === 'age' ? t(datetimeI18n) : t(ageI18n),
                  })
                }
              </Translation>
            }
          >
            {ageFormat === 'age' ? (
              title || <Translation>{t => t(ageI18n)}</Translation>
            ) : (
              <Translation>{t => t(datetimeI18n)}</Translation>
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
            <Age from={second} to={dayjs().valueOf()} />
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

export const fromTypeInfo = {
  arrow: {
    src: imgArrow,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeOut)}
      </Translation>
    ),
  },
  out: {
    src: imgOut,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeOut)}
      </Translation>
    ),
  },
  in: {
    src: imgIn,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeIn)}
      </Translation>
    ),
  },
};

const reg = /address\/(.*)$/;

type GetFromTypeReturnValueType = 'in' | 'out' | 'arrow';
export const getFromType = (value: string): GetFromTypeReturnValueType => {
  let address = '';

  try {
    // fixed for multiple request in /address/:hash page
    let r = reg.exec(window.location.pathname);
    if (r) {
      address = r[1];
    }
  } catch (e) {}

  const { accountAddress = address } = queryString.parse(
    window.location.search,
  );
  const filter = accountAddress as string;

  return !filter
    ? 'arrow'
    : formatAddress(filter) === formatAddress(value)
    ? 'out'
    : 'in';
};

export const renderAddress = (
  value,
  row,
  type: 'to' | 'from',
  {
    withArrow = false,
    withProxy = false,
    showVerificationName = false,
  }: {
    withArrow?: boolean;
    withProxy?: boolean;
    showVerificationName?: boolean;
  } = {},
) => {
  let address = '';

  try {
    // fixed for multiple request in /address/:hash page
    let r = reg.exec(window.location.pathname);
    if (r) {
      address = r[1];
    }
  } catch (e) {}

  const { accountAddress = address } = queryString.parse(
    window.location.search,
  );
  const filter = (accountAddress as string) || '';

  if (type === 'to' && withProxy && row.proxy) {
    return (
      <ValueHighlight scope="address" value={value}>
        <ProxyContractAddress
          value={value}
          nameMap={row.nameMap}
          proxy={row.proxy}
          showVerificationName={showVerificationName}
        />
      </ValueHighlight>
    );
  }

  const pocket = getPocketAlias({
    type,
    address: value,
    pocket: row[`${type}Pocket`],
  });

  return (
    <>
      <ValueHighlight scope="address" value={value}>
        <CoreAddressContainer
          value={value}
          nameMap={row.nameMap}
          innerName={pocket}
          link={!pocket && formatAddress(filter) !== formatAddress(value)}
          contractCreated={row.contractCreated}
          isFull={!!pocket}
          showVerificationName={showVerificationName}
        />
      </ValueHighlight>
      {type === 'from' && withArrow && (
        <ImgWrap src={fromTypeInfo[getFromType(value)].src} />
      )}
    </>
  );
};

const ImgWrap = styled.img`
  position: absolute;
  width: 36px;
  height: 20px;
  right: -0.8571rem;
  top: 0.1429rem;

  ${media.s} {
    right: -0.98rem;
  }
`;
