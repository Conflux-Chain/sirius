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
import { Popover } from '@cfxjs/react-ui';
import { PopoverProps } from '@cfxjs/react-ui/dist/popover/popover';
import { useBreakpoint } from 'styles/media';
import imgSuccess from 'images/status/success.svg';
import imgError from 'images/status/error.svg';
import imgSkip from 'images/status/skip.svg';
import imgUnexecuted from 'images/status/unexecuted.svg';

interface Props {
  type: string | number;
  variant?: 'dot' | 'text';
  popoverProps?: Partial<PopoverProps>;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type StatusProps = React.PropsWithChildren<Props & NativeAttrs>;

export const Status = ({
  type: outerType,
  className,
  variant,
  popoverProps,
  children,
  ...others
}: StatusProps) => {
  const breakpoint = useBreakpoint();
  const { t } = useTranslation();
  const type = String(outerType);
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
    }),
    [t],
  );
  const typeKeys = useMemo(() => Object.keys(typeMap), [typeMap]);

  if (typeKeys.includes(type)) {
    let explanation: React.ReactNode = t(
      translations.general.status[typeMap[type].status].explanation,
    );
    // only error message come from outside
    if (type === '1' && children) {
      explanation = children;
    }
    const content = (
      <>
        <img className="icon" src={typeMap[type].icon} alt={type} />
        <span className="text">{typeMap[type].name}</span>
        {variant === 'dot' ? null : (
          <span className="description">{explanation}</span>
        )}
      </>
    );
    const { contentClassName: popoverContentClassName, ...popoverOthers } =
      popoverProps || {};

    return (
      <Wrapper
        className={clsx('status', className, typeMap[type].status)}
        {...others}
      >
        {variant === 'dot' ? (
          <StyledPopoverWrapper>
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
          </StyledPopoverWrapper>
        ) : (
          content
        )}
      </Wrapper>
    );
  } else {
    return null;
  }
};

const Wrapper = styled.span`
  display: flex;
  align-items: center;
  vertical-align: middle;
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
  .dot {
    display: inline-block;
    width: 0.5714rem;
    height: 0.5714rem;
    border-radius: 50%;
    cursor: pointer;
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
