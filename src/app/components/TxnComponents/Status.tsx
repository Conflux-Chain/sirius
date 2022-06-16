/**
 *
 * Status
 *
 */
import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Popover } from '@cfxjs/react-ui';
import { PopoverProps } from '@cfxjs/react-ui/dist/popover/popover';
import { useBreakpoint } from 'styles/media';
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
  popoverProps?: Partial<PopoverProps>;
  showMessage?: boolean;
  showTooltip?: boolean;
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
  popoverProps,
  children,
  showMessage,
  showTooltip,
  txExecErrorInfo,
  address,
  hash,
  ...others
}: StatusProps) => {
  const breakpoint = useBreakpoint();
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
    const { contentClassName: popoverContentClassName, ...popoverOthers } =
      popoverProps || {};

    return (
      <StyledStatusWrapper
        className={clsx('status', className, typeMap[type].status)}
        {...others}
      >
        {variant === 'dot' ? (
          <StyledPopoverWrapper>
            {showTooltip ? (
              <Popover
                notSeperateTitle
                title={content}
                content={explanation}
                placement="auto-start"
                hoverable={true}
                hoverableTimeout={1000}
                trigger={breakpoint === 's' ? 'click' : 'hover'}
                contentClassName={clsx(
                  'siriuse-status-popover',
                  popoverContentClassName,
                )}
                {...popoverOthers}
              >
                <span className="dot"></span>
              </Popover>
            ) : (
              <span className="dot"></span>
            )}
          </StyledPopoverWrapper>
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
  showTooltip: false,
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

const StyledPopoverWrapper = styled.div`
  .tooltip-content.siriuse-status-popover {
    padding: 0.2857rem 0.8571rem;
    .item.title {
      padding: 0;

      .icon {
        width: 0.8571rem;
        height: 0.8571rem;
      }
      .text {
        margin-left: 0.2857rem;
        color: #333333;
        text-shadow: 0rem 0.4286rem 1.1429rem rgba(0, 0, 0, 0.08);
      }
    }
    .items {
      color: #a4a8b6;
      text-shadow: 0rem 0.4286rem 1.1429rem rgba(0, 0, 0, 0.08);
      max-width: 14.2857rem;
      min-width: 11.7143rem;
      line-height: 1.0714rem;
      white-space: break-spaces;
      padding-bottom: 0.1429rem;
    }
    .inner {
      min-width: inherit;
    }
  }
`;
