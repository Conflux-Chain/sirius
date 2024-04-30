/**
 *
 * ProjectInfo
 */
import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components';
import {
  DexIcon,
  CexIcon,
  AuditIcon,
  CoinMarketIcon,
  OxIcon,
  VerifyIcon,
  DetailIcon,
} from './icons';
import { translations } from 'locales/i18n';
import { Modal, Divider, Image } from '@cfxjs/antd';
import { Link } from '@cfxjs/react-ui';
import { sansSerifFont } from 'styles/variable';
import iconWarning from 'images/warning.png';
import { HIDE_IN_DOT_NET } from 'utils/constants';

interface ProjectInfoProp {
  securityAudit: {
    audit: {
      result: number;
      auditUrl: string;
    };
    cex: {
      binance: string;
      huobi: string;
      okex: string;
    };
    dex: {
      moonswap: string;
    };
    sponsor: number;
    track: {
      coinMarketCap: string;
    };
    verify: number;
    zeroAdmin: number;
  };
  tokenName: string;
  isDetailPage?: boolean;
}

export const ProjectInfo = React.memo(
  ({ securityAudit, tokenName, isDetailPage = false }: ProjectInfoProp) => {
    const { t, i18n } = useTranslation();
    const [visible, setVisible] = useState(false);
    const lang = i18n.language.indexOf('en') > -1 ? 'en' : 'zh';
    const { cex, dex, track, verify, audit, zeroAdmin } = securityAudit;
    const [list, setList] = useState<any[]>([]);
    const clickDetail = () => {
      setVisible(true);
    };

    const isAllNull = obj => {
      let sign = true;
      for (let key in obj) {
        if (obj[key]) {
          sign = false;
        }
      }
      return sign;
    };

    const isAllHave = obj => {
      for (let key in obj) {
        if (!obj[key]) {
          return false;
        }
      }
      return true;
    };

    const coinsList = [
      {
        name: 'zeroAdmin',
        icon: OxIcon,
        desc: (
          <span>
            {zeroAdmin === 1
              ? t(
                  translations.general.table.token.projectInfo.modal
                    .zeroAddress,
                )
              : t(
                  translations.general.table.token.projectInfo.modal
                    .notZeroAddress,
                )}
          </span>
        ),
        tip:
          zeroAdmin === 1
            ? t(translations.general.table.token.projectInfo.zeroAddress)
            : t(translations.general.table.token.projectInfo.notZeroAddress),
        isActive: false,
        hoverable: false,
        isWarning: false,
        onClick: clickDetail,
      },
      {
        name: 'verify',
        icon: VerifyIcon,
        desc: (
          <span>
            <Trans
              i18nKey={
                verify === 1
                  ? 'general.table.token.projectInfo.modal.verify'
                  : 'general.table.token.projectInfo.modal.unverify'
              }
            >
              The contract has been verified (
              <Link href="/contract-verification">Verify the contract</Link>{' '}
              now!)
            </Trans>
          </span>
        ),
        tip:
          verify === 1
            ? t(translations.general.table.token.projectInfo.verify)
            : t(translations.general.table.token.projectInfo.unverify),
        isActive: false,
        hoverable: false,
        isWarning: false,
        onClick: clickDetail,
      },
      {
        name: 'audit',
        icon: AuditIcon,
        desc: (
          <span>
            <Trans
              i18nKey={
                audit.result === 1
                  ? 'general.table.token.projectInfo.modal.audit'
                  : 'general.table.token.projectInfo.modal.unaudit'
              }
            >
              The contract code passes the audit (Have an audit report or
              related link?
              <Link
                href={
                  audit.result === 1
                    ? audit.auditUrl
                    : lang === 'en'
                    ? 'https://confluxscansupportcenter.zendesk.com/hc/en-us/requests/new'
                    : 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/requests/new'
                }
                target={'_blank'}
              >
                Submit{' '}
              </Link>
              it now!)
            </Trans>
          </span>
        ),
        isActive: false,
        hoverable: false,
        isWarning: false,
        onClick: clickDetail,
      },
    ];

    if (!HIDE_IN_DOT_NET) {
      coinsList.push(
        {
          name: 'cex',
          icon: CexIcon,
          desc: (
            <ModalItems>
              <TransWrapper>
                {!isAllHave(cex) ? (
                  <Trans i18nKey="general.table.token.projectInfo.modal.uncex">
                    Listed by a centralized exchange（
                    <Link
                      href={
                        lang === 'en'
                          ? 'https://confluxscansupportcenter.zendesk.com/hc/en-us/requests/new'
                          : 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/requests/new'
                      }
                      target={'_blank'}
                    >
                      Submit
                    </Link>{' '}
                    proof）
                  </Trans>
                ) : (
                  <Trans i18nKey="general.table.token.projectInfo.modal.cex">
                    Listed by a centralized exchange
                  </Trans>
                )}
              </TransWrapper>
              <TransWrapper>
                {cex.binance ? (
                  <Trans i18nKey="general.table.token.projectInfo.modal.binance">
                    -
                    <Link href={cex?.binance} target={'_blank'}>
                      Binance
                    </Link>
                  </Trans>
                ) : (
                  <span className={'inactive'}>
                    <Trans i18nKey="general.table.token.projectInfo.modal.binance">
                      - Binance
                    </Trans>
                  </span>
                )}
              </TransWrapper>
              <TransWrapper>
                {cex.huobi ? (
                  <Trans i18nKey="general.table.token.projectInfo.modal.huoBi">
                    -
                    <Link href={cex?.huobi} target={'_blank'}>
                      HuoBi
                    </Link>
                  </Trans>
                ) : (
                  <span className={'inactive'}>
                    <Trans i18nKey="general.table.token.projectInfo.modal.huoBi">
                      - HuoBi
                    </Trans>
                  </span>
                )}
              </TransWrapper>
              <TransWrapper>
                {cex.okex ? (
                  <Trans i18nKey="general.table.token.projectInfo.modal.ok">
                    -
                    <Link href={cex?.okex} target={'_blank'}>
                      OK
                    </Link>
                  </Trans>
                ) : (
                  <span className={'inactive'}>
                    <Trans i18nKey="general.table.token.projectInfo.modal.ok">
                      - OK
                    </Trans>
                  </span>
                )}
              </TransWrapper>
            </ModalItems>
          ),
          isActive: false,
          hoverable: false,
          isWarning: false,
          onClick: clickDetail,
        },
        {
          name: 'dex',
          icon: DexIcon,
          desc: (
            <ModalItems>
              <TransWrapper>
                {!isAllHave(dex) ? (
                  <Trans i18nKey="general.table.token.projectInfo.modal.undex">
                    Listed by a decentralized exchange（
                    <Link
                      href={
                        lang === 'en'
                          ? 'https://confluxscansupportcenter.zendesk.com/hc/en-us/requests/new'
                          : 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/requests/new'
                      }
                      target={'_blank'}
                    >
                      Submit
                    </Link>{' '}
                    proof）
                  </Trans>
                ) : (
                  <Trans i18nKey="general.table.token.projectInfo.modal.dex">
                    Listed by a decentralized exchange
                  </Trans>
                )}
              </TransWrapper>
              <TransWrapper>
                {dex.moonswap ? (
                  <Trans i18nKey="general.table.token.projectInfo.modal.moonswap">
                    -
                    <Link href={dex.moonswap} target={'_blank'}>
                      Moonswap
                    </Link>
                  </Trans>
                ) : (
                  <span className={'inactive'}>
                    <Trans i18nKey="general.table.token.projectInfo.modal.moonswap">
                      - Moonswap
                    </Trans>
                  </span>
                )}
              </TransWrapper>
            </ModalItems>
          ),
          isActive: false,
          hoverable: false,
          isWarning: false,
          onClick: clickDetail,
        },
        {
          name: 'track',
          icon: CoinMarketIcon,
          desc: (
            <span>
              {!isAllNull(track) ? (
                <Trans
                  i18nKey="general.table.token.projectInfo.modal.cmc"
                  components={[
                    <Link href={track.coinMarketCap} target={'_blank'} />,
                  ]}
                >
                  Listed by CoinMarketCap
                </Trans>
              ) : (
                <Trans
                  i18nKey="general.table.token.projectInfo.modal.uncmc"
                  components={[
                    null,
                    <Link
                      href={
                        lang === 'en'
                          ? 'https://confluxscansupportcenter.zendesk.com/hc/en-us/requests/new'
                          : 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/requests/new'
                      }
                      target={'_blank'}
                    />,
                  ]}
                >
                  Listed by CoinMarketCap（Submit proof）
                </Trans>
              )}
            </span>
          ),
          isActive: false,
          hoverable: false,
          isWarning: false,
          onClick: clickDetail,
        },
      );
    }

    useEffect(() => {
      const list = coinsList.map(c => {
        let isActive = false;
        let isWarning = false;
        if (securityAudit[c.name] === 1) {
          isActive = true;
        } else if (securityAudit[c.name] === 0) {
          if (['verify', 'zeroAdmin'].includes(c.name)) {
            isWarning = true;
          }
        } else {
          if (isAllNull(securityAudit[c.name])) {
            if (['verify', 'zeroAdmin'].includes(c.name)) {
              isWarning = true;
            }
          } else {
            isActive = true;
          }
        }
        c.isActive = isActive;
        c.isWarning = isWarning;
        return c;
      });

      setList(list);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCloseModal = () => {
      setVisible(false);
    };

    return (
      <ProjectWrapper>
        <IconWrapper left={isDetailPage}>
          <LeftWrapper>
            {list
              .reduce(
                (prev, curr) => {
                  // if (curr.isWarning) {
                  //   prev[0].push(curr);
                  // } else
                  if (curr.isActive) {
                    prev[1].push(curr);
                  } else {
                    prev[2].push(curr);
                  }
                  return prev;
                },
                [[], [], []],
              )
              .reduce((prev, curr) => {
                prev = prev.concat(curr);
                return prev;
              }, [])
              .reverse()
              .map(({ icon, desc, ...others }, index) =>
                React.createElement(icon, {
                  key: index,
                  ...others,
                  hoverable: true,
                }),
              )}
          </LeftWrapper>
          <DetailIcon
            onClick={clickDetail}
            warnings={list
              .map((l, index) =>
                l.isWarning ? (
                  <div key={`modalItem-warning-${index}`}>{l.tip}</div>
                ) : (
                  ''
                ),
              )
              .filter(l => l)}
          />
        </IconWrapper>
        <ModalWrapper>
          <Modal
            width="50rem"
            visible={visible}
            onCancel={onCloseModal}
            footer={null}
            centered={true}
          >
            <ModalTitle>
              {t(translations.general.table.token.projectInfo.projectInfo)} -{' '}
              {tokenName}
            </ModalTitle>
            <Divider />
            {list.map(({ icon, desc, ...others }) =>
              React.createElement(ModalItem, { key: Math.random() }, [
                React.createElement(icon, {
                  key: `modal-icon-${icon.name}`,
                  ...others,
                }),
                React.createElement(
                  'span',
                  {
                    key: `modal-desc-${icon.name}`,
                  },
                  desc,
                ),
                others.isWarning ? (
                  <span
                    className="modal-icon-warning"
                    key={`modal-warning-${icon.name}`}
                  >
                    <Image
                      width="18px"
                      src={iconWarning}
                      preview={false}
                    ></Image>
                  </span>
                ) : null,
              ]),
            )}
            <Divider />
            <RemarkTitle>
              {t(
                translations.general.table.token.projectInfo.modal.remarkTitle,
              )}
            </RemarkTitle>
            <RemarkContent>
              <div>
                {t(
                  translations.general.table.token.projectInfo.modal
                    .remarkContent1,
                )}
              </div>
              <div>
                {t(
                  translations.general.table.token.projectInfo.modal
                    .remarkContent2,
                )}
              </div>
              <div>
                {t(
                  translations.general.table.token.projectInfo.modal
                    .remarkContent3,
                )}
              </div>
              <div>
                {t(
                  translations.general.table.token.projectInfo.modal
                    .remarkContent4,
                )}
              </div>
            </RemarkContent>
            <Trans i18nKey="general.table.token.projectInfo.modal.disclaimer">
              Click to view the
              <Link
                href={
                  lang === 'en'
                    ? 'https://confluxscansupportcenter.zendesk.com/hc/en-us/articles/4405402356763-Token-List-Disclaimer-User-Warranties'
                    : 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/articles/4405402356763-%E4%BB%A3%E5%B8%81%E5%88%97%E8%A1%A8-%E5%85%8D%E8%B4%A3%E5%A3%B0%E6%98%8E'
                }
                target={'_blank'}
              >
                Disclaimer
              </Link>
            </Trans>
          </Modal>
        </ModalWrapper>
      </ProjectWrapper>
    );
  },
);

const IconWrapper = styled('div')<{ left: boolean }>`
  height: 24px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #edf0f8;
  padding: 0 4px 0 4px;
  width: 160px;
  float: ${props => (props.left ? 'left' : 'right')};
`;
const LeftWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;

  > span:not(:last-of-type) {
    margin-left: -4px; //往左偏移实现重叠效果
  }

  > span:hover {
    z-index: 2;

    svg {
      transform: scale(1.1, 1.1);
    }
  }

  svg {
    border: 1px solid white;
    border-radius: 50%;
  }
`;
const ModalItem = styled.div`
  display: flex;
  margin-bottom: 12px;

  > span {
    margin-left: 12px;
  }

  .modal-icon-warning {
    display: flex;
    align-items: center;
  }
`;
const ModalItems = styled.div`
  display: flex;
  flex-direction: column;
`;
const TransWrapper = styled.div`
  .inactive {
    color: grey;
  }
`;
const RemarkTitle = styled.div`
  font-weight: bold;
`;
const RemarkContent = styled.div`
  width: 95%;
  margin: 12px auto 12px auto;
  border: 1px solid #eeeeef;
  padding: 12px;
  border-radius: 4px;
`;
const ModalWrapper = styled.div`
  .ant-modal-content {
    border-radius: 5px !important;
  }

  .ant-divider.ant-divider-horizontal {
    margin: 12px 0 12px 0;
  }
`;
const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
const ProjectWrapper = styled.div`
  font-family: ${sansSerifFont};
`;
