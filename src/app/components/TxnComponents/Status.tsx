/**
 *
 * Status
 *
 */
import React, { useMemo } from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import _ from 'lodash';
import { PendingReason } from 'utils/tableColumns/PendingReason';

import imgSuccess from 'images/status/success.svg';
import imgError from 'images/status/error.svg';
import imgSkip from 'images/status/skip.svg';
import imgUnexecuted from 'images/status/unexecuted.svg';
import imgPending from 'images/status/pending.svg';

interface Props {
  type: string | number;
  variant?: 'dot' | 'text';
  showMessage?: boolean;
  txExecErrorInfo?: {
    type: number;
    message: string;
  };
  address?: string;
  hash?: string;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type StatusProps = React.PropsWithChildren<Props & NativeAttrs>;

const StatusComponent = ({
  type: outerType,
  className,
  variant,
  children,
  showMessage,
  txExecErrorInfo,
  address,
  hash,
  ...others
}: StatusProps) => {
  const { t } = useTranslation();
  const type = String(_.isNil(outerType) ? '4' : outerType);
  const typeMap = useMemo(
    () => ({
      '0': {
        status: 'success',
        name: t(translations.general.status.success.text),
        icon: imgSuccess,
      },
      '1': {
        status: 'error',
        name: t(translations.general.status.error.text),
        icon: imgError,
      },
      '2': {
        status: 'skip',
        name: t(translations.general.status.skip.text),
        icon: imgSkip,
      },
      '3': {
        status: 'unexecuted',
        name: t(translations.general.status.unexecuted.text),
        icon: imgUnexecuted,
      },
      '4': {
        status: 'pending',
        name: t(translations.general.status.pending.text),
        icon: imgPending,
      },
    }),
    [t],
  );
  const typeKeys = useMemo(() => Object.keys(typeMap), [typeMap]);

  if (typeKeys.includes(type)) {
    // default
    let explanation: React.ReactNode = t(
      translations.general.status[typeMap[type].status].explanation,
    );
    // only error message come from outside
    if (type === '1' || type === '4') {
      if (children) {
        explanation = children;
      } else if (txExecErrorInfo) {
        if (txExecErrorInfo.type === 1) {
          explanation = `${t(
            translations.transaction.statusError[txExecErrorInfo.type],
          )}${txExecErrorInfo.message}`;
        } else {
          explanation = t(
            translations.transaction.statusError[txExecErrorInfo.type],
          );
        }

        // if not match i18n translations, use fullnode error directly by default
        if (!explanation) {
          explanation = txExecErrorInfo.message;
        }
      }
    }
    let icon = typeMap[type].icon;
    let name = typeMap[type].name;

    if (type === '4') {
      name = (
        <>
          {name}{' '}
          {address ? (
            <>
              <span className="split"></span>
              <PendingReason account={address} hash={hash} />
            </>
          ) : null}
        </>
      );
    }

    const content = (
      <>
        <span className="icon-and-text">
          <img className="icon" src={icon} alt={type} />
          <span className="text">{name}</span>
        </span>
        {!showMessage || variant === 'dot' || type === '4' ? null : (
          <span className="description">{explanation}</span>
        )}
      </>
    );

    return (
      <StyledStatusWrapper
        className={clsx('status', className, typeMap[type].status)}
        {...others}
      >
        {variant === 'dot' ? (
          <div>
            <span className="dot"></span>
          </div>
        ) : (
          content
        )}
      </StyledStatusWrapper>
    );
  } else {
    return null;
  }
};
StatusComponent.defaultProps = {
  showMessage: true,
};

export const Status = React.memo(StatusComponent);

const StyledStatusWrapper = styled.span`
  display: flex;
  align-items: flex-start;
  vertical-align: middle;
  margin-right: 0.7143rem;

  &.success {
    color: #7cd77b;
    .dot {
      background-color: #7cd77b;
    }
  }
  &.error {
    color: #e64e4e;
    .dot {
      background-color: #e64e4e;
    }
  }
  &.skip {
    color: #fede1b;
    .dot {
      background-color: #fede1b;
    }
  }
  &.unexecuted {
    color: #b279c9;
    .dot {
      background-color: #b279c9;
    }
  }
  &.pending {
    color: #fa8000;
    .dot {
      background-color: #fa8000;
    }
  }
  .dot {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    margin-left: -0.9rem;
    margin-bottom: -0.2rem;
  }
  .icon-and-text {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .icon {
    width: 1.1429rem;
    height: 1.1429rem;
  }
  .text {
    margin-left: 0.8571rem;
    line-height: 1.5714rem;
    word-break: keep-all;
  }
  .description {
    color: #97a3b4;
    margin-left: 0.5714rem;
  }
  .split {
    margin-left: 10px;
  }
`;
