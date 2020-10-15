/**
 *
 * Status
 *
 */
import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

const skip = require('../../../images/status/skip.png');
const error = require('../../../images/status/error.png');
const success = require('../../../images/status/success.png');
const unexecuted = require('../../../images/status/unexecuted.png');

interface Props {
  type: string | number;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type StatusProps = React.PropsWithChildren<Props & NativeAttrs>;

export const Status = ({ type: outerType }: StatusProps) => {
  const { t } = useTranslation();
  const type = String(outerType);
  const map = useMemo(
    () => ({
      '0': {
        status: 'success',
        name: t(translations.general.status.success),
        icon: success,
      },
      '1': {
        status: 'error',
        name: t(translations.general.status.error),
        icon: error,
      },
      '2': {
        status: 'skip',
        name: t(translations.general.status.skip),
        icon: skip,
      },
      '3': {
        status: 'unexecuted',
        name: t(translations.general.status.unexecuted),
        icon: unexecuted,
      },
    }),
    [t],
  );
  if (type !== undefined) {
    return (
      <Wrapper>
        <img className="icon" src={map[type].icon} alt={type} />
        <span className={clsx('status', map[type].status)}>
          {map[type].name}
        </span>
      </Wrapper>
    );
  } else {
    return null;
  }
};

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  .status {
    margin-left: 0.8571rem;
    line-height: 1.5714rem;
    &.success {
      color: #7cd77b;
    }
    &.error {
      color: #c65252;
    }
    &.skip {
      color: #fede1b;
    }
    &.unexecuted {
      color: #b178c8;
    }
  }
  .icon {
    width: 1.1429rem;
    height: 1.1429rem;
  }
`;
