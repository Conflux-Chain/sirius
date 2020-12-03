import React, { useMemo, useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { DatePicker } from '@cfxjs/react-ui';
import { useBreakpoint } from 'styles/media';
import imgAlarm from 'images/contract-address/alarm.svg';
import { ActionButton } from './ActionButton';

// datepicker input common style
const PickerWrap = styled.div`
  margin-right: 0.57rem;
  cursor: pointer;
  .address-table-picker.cfx-picker.cfx-picker-variant-solid.cfx-picker-color-primary {
    background-color: rgba(0, 84, 254, 0.04);
    height: 2.2857rem;
    &:hover {
      background-color: rgba(0, 84, 254, 0.1);
    }
    .cfx-picker-input {
      input {
        color: #7f8699;
        &:hover {
          color: #7f8699;
        }
      }
    }
  }
`;

// mobile picker start
const MobilePickerWrap = styled(PickerWrap)`
  display: flex;
  margin-bottom: 0.7143rem;
  .address-table-picker.cfx-picker.cfx-picker-variant-solid.cfx-picker-color-primary {
    margin-right: 0.7143rem;
  }
`;

const MobilePicker = ({ minTimestamp, maxTimestamp, onChange }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    const handler = e => {
      if (!filterButtonRef.current?.contains(e.target)) {
        let isOutOfDatepicker = true;
        const wrappers = document.querySelectorAll('.address-table-picker');
        wrappers.forEach(el => {
          if (el && el.contains(e.target)) {
            isOutOfDatepicker = false;
          }
        });
        if (e.target.className.indexOf('cfx-picker') > -1) {
          isOutOfDatepicker = false;
        }
        if (isOutOfDatepicker) {
          setVisible(false);
        }
      }
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);
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
    <MobilePickerWrap className="date-picker-mobile-wrap" ref={dropdownRef}>
      <ActionButton
        onClick={() => setVisible(!visible)}
        ref={filterButtonRef}
        src={imgAlarm}
      ></ActionButton>
      {visible && (
        <>
          <DatePicker
            className="address-table-picker"
            dropdownClassName="address-table-picker-calender"
            variant="solid"
            color="primary"
            placeholder={datePlaceholder[0]}
            onChange={handleStartChange}
            defaultValue={innerMinTimestamp}
            disabledDate={disabledDateD1}
            allowClear={false}
          />
          <DatePicker
            className="address-table-picker"
            dropdownClassName="address-table-picker-calender"
            variant="solid"
            color="primary"
            placeholder={datePlaceholder[1]}
            onChange={handleEndChange}
            defaultValue={innerMaxTimestamp}
            disabledDate={disabledDateD2}
            allowClear={false}
          />
        </>
      )}
    </MobilePickerWrap>
  );
};
// mobile picker end

// PC picker start
const Picker = ({ minTimestamp, maxTimestamp, onChange }) => {
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
    <PickerWrap>
      <DatePicker.RangePicker
        className="address-table-picker"
        // @ts-ignore
        defaultValue={defaultDateRange}
        color="primary"
        variant="solid"
        // @ts-ignore
        placeholder={datePlaceholder}
        onChange={onChange}
      />
    </PickerWrap>
  );
};
// PC picker end

export default function (props) {
  const bp = useBreakpoint();
  return bp === 's' ? <MobilePicker {...props} /> : <Picker {...props} />;
}
