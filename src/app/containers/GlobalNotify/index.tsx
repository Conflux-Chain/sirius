/**
 * GlobalNotify
 */
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import pubsubLib from 'utils/pubsub';
import { useNotifications } from '@cfxjs/react-ui';
import { Notification } from '@cfxjs/react-ui/dist/use-notifications/use-notifications';
import XCircleFill from '@zeit-ui/react-icons/xCircleFill';
import CheckInCircleFill from '@zeit-ui/react-icons/checkInCircleFill';
import InfoFill from '@zeit-ui/react-icons/infoFill';
import styled from 'styled-components';
import { Collapse } from '@cfxjs/antd';
import { CaretRightOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

enum Status {
  success,
  error,
}
interface Props extends Partial<Notification> {
  type: string; // one of [request, wallet]
  repeat?: boolean; // if trigger again of same code for multiple times
  option?: any; // custom option
}

export function GlobalNotify() {
  const { t } = useTranslation();
  const [, setNotifications] = useNotifications();
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
          let delay: number = 0;
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
                  >
                    <Panel
                      header={t(translations.general.error.detail)}
                      key="1"
                      className="site-collapse-custom-panel"
                    >
                      <StyledDetailWrapper>{option.detail}</StyledDetailWrapper>
                    </Panel>
                  </Collapse>
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
            delay = 3000;
            code = option.hash;
          }

          setNotifications({
            icon: icon,
            title: title,
            content: content,
            delay: delay,
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
