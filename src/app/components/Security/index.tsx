import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import clsx from 'clsx';

interface Props {
  type: string;
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>;
export declare type SecurityProps = React.PropsWithChildren<
  Props & NativeAttrs
>;

export function Security({ type }: SecurityProps) {
  const { t } = useTranslation();
  const levelMap = {
    lv0: {
      level: 'high',
      name: t(translations.general.security.high),
    },
    lv1: {
      level: 'medium',
      name: t(translations.general.security.medium),
    },
    lv2: {
      level: 'low',
      name: t(translations.general.security.low),
    },
    lv3: {
      level: 'veryLow',
      name: t(translations.general.security.veryLow),
    },
  };
  const text =
    levelMap[type]?.name || t(translations.general.security.notAvailable);
  const level = levelMap[type]?.level || 'not-available';

  return (
    <StyledSecurityWrapper className={clsx('sirius-security', level)}>
      <svg viewBox="0 0 50 10" className={`img`}>
        <defs>
          <mask id="mask" x="0" y="0">
            <rect x="-5" y="-5" width="55" height="15" fill="#fff" />
            <circle cx="5" cy="5" r="5" />
            <circle cx="18" cy="5" r="5" />
            <circle cx="31" cy="5" r="5" />
            <circle cx="43" cy="5" r="5" />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="50"
          height="10"
          mask="url(#mask)"
          fill="#fff"
        />
      </svg>
      <span className={`text`}>{text}</span>
    </StyledSecurityWrapper>
  );
}

const StyledSecurityWrapper = styled.span`
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  .text {
    vertical-align: middle;
    font-size: 1rem;
    margin-left: 0.4286rem;
    line-height: 1.5714rem;
  }

  .img {
    background-color: transparent;
    height: 0.7143rem;

    circle:last-child {
      animation: blinker 1s linear infinite;
    }
  }

  &.high {
    .img {
      background: linear-gradient(270deg, #7cd77b 0%, #e5f456 100%);

      .last-circle {
        animation: none;
      }
    }
    .text {
      color: #59bf9c;
    }
  }
  &.medium {
    .img {
      background: linear-gradient(270deg, #e5f456 0%, #ffd041 100%);
    }
    .text {
      color: #bfde5b;
    }
  }
  &.low {
    .img {
      background: linear-gradient(270deg, #ffd041 0%, #ec6057 100%);
    }
    .text {
      color: #ffc324;
    }
  }
  &.veryLow {
    .img {
      background: linear-gradient(270deg, #ec6057 0%, #8d3a4a 100%);
    }
    .text {
      color: #ec6057;
    }
  }
  &.not-available {
    .img {
      display: none;
    }
  }
`;
