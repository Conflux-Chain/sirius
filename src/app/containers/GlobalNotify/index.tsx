/**
 * GlobalNotify
 */
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import pubsubLib from 'utils/pubsub';
import XCircleFill from '@zeit-ui/react-icons/xCircleFill';
import CheckInCircleFill from '@zeit-ui/react-icons/checkInCircleFill';
import InfoFill from '@zeit-ui/react-icons/infoFill';
import styled from 'styled-components';
import { Collapse } from '@cfxjs/sirius-next-common/dist/components/Collapse';
import { notification } from '@cfxjs/sirius-next-common/dist/components/Notification';
import { CaretRightOutlined } from '@ant-design/icons';

enum Status {
  success,
  error,
}
interface Props {
  type: string; // one of [request, wallet]
  repeat?: boolean; // if trigger again of same code for multiple times
  option?: any; // custom option
}

export function GlobalNotify() {
  const { t } = useTranslation();
  const codes = useRef({});

  useEffect(() => {
    const unsubscribe = pubsubLib.subscribe(
      'notify',
      ({ type, repeat = false, option = {} }: Props) => {
        // only notify once of same code error
        if (!repeat && codes.current[option.code]) {
          return;
        } else {
          let icon = <InfoFill color="#ccc" />;
          let title: React.ReactNode = '';
          let content: React.ReactNode = '';
          let duration: number = 0;
          let code = Math.random().toString(32).substr(2);

          if (type === 'request') {
            icon = <XCircleFill color="#e15c56" />;
            title = t(translations.general.error.title);
            content = (
              <div>
                <div>
                  {t(translations.general.error.description[option.code]) ||
                    t(translations.general.error.description[20000])}
                </div>
                {option.detail && (
                  <Collapse
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    className="site-collapse-custom-collapse"
                    ghost
                    items={[
                      {
                        key: '1',
                        header: t(translations.general.error.detail),
                        className: 'site-collapse-custom-panel',
                        children: (
                          <StyledDetailWrapper>
                            {option.detail}
                          </StyledDetailWrapper>
                        ),
                      },
                    ]}
                  />
                )}
              </div>
            );
            code = option.code;
          } else if (type === 'wallet') {
            let info: any = {};
            try {
              info = JSON.parse(option.info);
            } catch (e) {}
            if (option.status === Status.error) {
              icon = <XCircleFill color="#e15c56" />;
            } else if (option.status === Status.success) {
              icon = <CheckInCircleFill color="#7cd77b" />;
            }
            title = t(
              translations.connectWallet.notify.action[info.code || '100'],
              info,
            );
            content = (
              <LinkWrapper>
                <a
                  href={`/transaction/${info.hash}`}
                  target="_blank"
                  className="link-anchor"
                  rel="noopener noreferrer"
                >
                  {t(translations.connectWallet.notify.link)}
                </a>
              </LinkWrapper>
            );
            duration = 3000;
            code = option.hash;
          }

          notification({
            icon: icon,
            title: title,
            content: content,
            duration: duration,
            onClose: () => {
              codes.current[code] = false;
            },
          });

          codes.current[code] = true;
        }
      },
    );
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

const LinkWrapper = styled.span`
  .link-anchor {
    color: #0e47ef;
  }
`;

const StyledDetailWrapper = styled.div`
  white-space: pre-wrap;
  max-height: 11.4286rem;
  overflow: auto;
`;
