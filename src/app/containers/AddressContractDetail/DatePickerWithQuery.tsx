import React, { useMemo, useState, useRef } from 'react';
import dayjs from 'dayjs';
import styled, { createGlobalStyle } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DatePicker, Button } from '@cfxjs/react-ui';
// import { useClickAway } from './../../components/use-click-away';
import { media, useBreakpoint } from 'styles/media';
import imgAlarm from 'images/contract-address/alarm.svg';

// mobile datepicker start
const MobileDatePickerWrap = styled.div`
  cursor: pointer;
  margin-bottom: 0.7143rem;
  .address-table-datepicker-input.cfx-picker.cfx-picker-variant-solid.cfx-picker-color-primary {
    background-color: #f5f8ff;
    height: 2.2857rem;
    &:nth-of-type(1) {
      margin-right: 0.7143rem;
    }
    &:hover {
      background-color: #e4edfe;
    }
  }
  ${media.s} {
    display: flex;
  }
  .btn.filter-button {
    display: flex;
    align-items: center;
    border-radius: 0.2857rem;
    background-color: #f5f8ff;
    &:hover {
      background-color: #dfe8ff;
    }
    width: 2.2857rem;
    min-width: 2.2857rem;
    height: 2.2857rem;
    padding: 0;
    margin-right: 0.7143rem;
    .text {
      top: 0;
    }
  }
`;

const GlobalStyle = createGlobalStyle`
  .address-table-datepicker-calender {
    left: calc(5vw) !important;
    .cfx-picker-panel-container {
      border: none;
    }
    .cfx-picker-panel,
    .cfx-picker-date-panel, 
    .cfx-picker-year-panel, 
    .cfx-picker-month-panel {
      width: 100%;
    }
    table.cfx-picker-content {
      width: 100%;
      table-layout: inherit;
    }
  }
`;

const MobileDatePickerWithQuery = ({
  minTimestamp,
  maxTimestamp,
  onChange,
}) => {
  // const d1Ref = useRef<HTMLDivElement>(null);
  // const d2Ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  // useClickAway([d1Ref, d2Ref, dropdownRef], () => visible && setVisible(false));
  // useClickAway([dropdownRef], () => visible && setVisible(false));
  const { t } = useTranslation();
  const datePlaceholder = [
    t(translations.general.startDate),
    t(translations.general.endDate),
  ];
  const startDate = dayjs('2020-10-29T00:00:00+08:00');
  const endDate = dayjs();
  const innerMinTimestamp = minTimestamp
    ? dayjs(new Date(parseInt((minTimestamp + '000') as string)))
    : startDate;
  const innerMaxTimestamp = maxTimestamp
    ? dayjs(new Date(parseInt((maxTimestamp + '000') as string)))
    : endDate;
  const disabledDateD1 = date =>
    date &&
    (date > innerMaxTimestamp.endOf('day') ||
      date < startDate.subtract(1, 'day').endOf('day'));
  const disabledDateD2 = date =>
    date &&
    (date < innerMinTimestamp.endOf('day') || date > endDate.endOf('day'));
  const handleStartChange = value => {
    onChange([value, innerMaxTimestamp]);
  };
  const handleEndChange = value => {
    onChange([innerMinTimestamp, value]);
  };

  return (
    <MobileDatePickerWrap key="date-picker-mobile-wrap" ref={dropdownRef}>
      <GlobalStyle />
      <Button
        key="address-contract-alarm-button"
        color="secondary"
        variant="text"
        className="filter-button"
        onClick={() => setVisible(!visible)}
      >
        <img src={imgAlarm} alt="address-contract-alarm" />
      </Button>
      {visible && (
        <>
          <DatePicker
            className="address-table-datepicker-input"
            dropdownClassName="address-table-datepicker-calender"
            variant="solid"
            color="primary"
            placeholder={datePlaceholder[0]}
            key="startTime"
            onChange={handleStartChange}
            defaultValue={innerMinTimestamp}
            // ref={d1Ref}
            disabledDate={disabledDateD1}
          />
          <DatePicker
            className="address-table-datepicker-input"
            dropdownClassName="address-table-datepicker-calender"
            variant="solid"
            color="primary"
            placeholder={datePlaceholder[1]}
            key="endTime"
            onChange={handleEndChange}
            defaultValue={innerMaxTimestamp}
            // ref={d2Ref}
            disabledDate={disabledDateD2}
          />
        </>
      )}
    </MobileDatePickerWrap>
  );
};
// mobile datepicker end

// PC datepicker start
const DatePickerWrap = styled.div`
  cursor: pointer;
  .address-table-datepicker.cfx-picker.cfx-picker-variant-solid.cfx-picker-color-primary {
    background-color: rgba(0, 84, 254, 0.04);
    height: 2.2857rem;
    &:hover {
      background-color: rgba(0, 84, 254, 0.1);
    }
    .cfx-picker-panel-container {
      border: none;
    }
  }
  ${media.s} {
    z-index: 10;
    width: 2.67rem;
    height: 2.67rem;
    background-color: rgb(0, 84, 254, 0.04);
    left: 0;
    right: unset;
    .month-picker-icon {
      position: absolute;
      left: 0.92rem;
      top: 0.92rem;
    }
    .cfx-picker {
      background-color: #f5f6fa;
      opacity: 0;
      width: 2.67rem;
      height: 2.67rem;
    }
  }
`;

const DatePickerWithQuery = ({ minTimestamp, maxTimestamp, onChange }) => {
  const { t } = useTranslation();
  let defaultDateRange = useMemo(
    () =>
      minTimestamp && maxTimestamp
        ? [
            minTimestamp &&
              dayjs(new Date(parseInt((minTimestamp + '000') as string))),
            maxTimestamp &&
              dayjs(new Date(parseInt((maxTimestamp + '000') as string))),
          ]
        : undefined,
    [minTimestamp, maxTimestamp],
  );
  const datePlaceholder = [
    t(translations.general.startDate),
    t(translations.general.endDate),
  ];
  return (
    <DatePickerWrap key="date-picker-wrap">
      <DatePicker.RangePicker
        className="address-table-datepicker"
        // @ts-ignore
        defaultValue={defaultDateRange}
        color="primary"
        variant="solid"
        key="date-picker"
        // @ts-ignore
        placeholder={datePlaceholder}
        onChange={onChange}
      />
    </DatePickerWrap>
  );
};
// PC datepicker end

export default function (props) {
  const bp = useBreakpoint();
  return bp === 's' ? (
    <MobileDatePickerWithQuery {...props} />
  ) : (
    <DatePickerWithQuery {...props} />
  );
}
