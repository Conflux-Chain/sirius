/**
 *
 * ProjectInfo
 */
import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components/macro';
import {
  DexIcon,
  CexIcon,
  AuditIcon,
  CoinMarketIcon,
  OxIcon,
  SponsorIcon,
  VerifyIcon,
  DetailIcon,
} from './icons';
import { translations } from '../../../locales/i18n';
import { Modal, Divider } from '@jnoodle/antd';
import { Link } from '@cfxjs/react-ui';
import { sansSerifFont } from '../../../styles/variable';

interface ProjectInfoProp {
  securityAudit: {
    audit: number;
    cex: {
      binance: string;
      huobi: string;
      ok: string;
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
    const {
      audit,
      cex,
      dex,
      sponsor,
      track,
      verify,
      zeroAdmin,
    } = securityAudit;
    const [activeArray, setActiveArray] = useState<string[]>([]);
    const [inactiveArray, setInactiveArray] = useState<string[]>([]);
    const clickDetail = () => {
      setVisible(true);
    };
    const activeMap = {
      audit: (
        <AuditIcon isActive={true} onClick={clickDetail} hoverable={true} />
      ),
      sponsor: (
        <SponsorIcon isActive={true} onClick={clickDetail} hoverable={true} />
      ),
      verify: (
        <VerifyIcon isActive={true} onClick={clickDetail} hoverable={true} />
      ),
      zeroAdmin: (
        <OxIcon isActive={true} onClick={clickDetail} hoverable={true} />
      ),
      cex: <CexIcon isActive={true} onClick={clickDetail} hoverable={true} />,
      dex: <DexIcon isActive={true} onClick={clickDetail} hoverable={true} />,
      track: (
        <CoinMarketIcon
          isActive={true}
          onClick={clickDetail}
          hoverable={true}
        />
      ),
    };
    const inactiveMap = {
      audit: <AuditIcon onClick={clickDetail} hoverable={true} />,
      sponsor: <SponsorIcon onClick={clickDetail} hoverable={true} />,
      verify: <VerifyIcon onClick={clickDetail} hoverable={true} />,
      zeroAdmin: <OxIcon onClick={clickDetail} hoverable={true} />,
      cex: <CexIcon onClick={clickDetail} hoverable={true} />,
      dex: <DexIcon onClick={clickDetail} hoverable={true} />,
      track: <CoinMarketIcon onClick={clickDetail} hoverable={true} />,
    };

    useEffect(() => {
      const tempActiveArray: string[] = [];
      const tempInactiveArray: string[] = [];
      for (let item in securityAudit) {
        if (securityAudit[item] === 0) {
          tempInactiveArray.push(item);
        } else if (securityAudit[item] === 1) {
          tempActiveArray.push(item);
        } else {
          if (isAllNull(securityAudit[item])) {
            tempInactiveArray.push(item);
          } else {
            tempActiveArray.push(item);
          }
        }
      }
      setActiveArray(tempActiveArray);
      setInactiveArray(tempInactiveArray);
      // eslint-disable-next-line
    }, []);
    const isAllNull = obj => {
      let sign = true;
      for (let key in obj) {
        if (obj[key]) {
          sign = false;
        }
      }
      return sign;
    };
    const onCloseModal = () => {
      setVisible(false);
    };
    return (
      <ProjectWrapper>
        <IconWrapper left={isDetailPage}>
          <LeftWrapper>
            {inactiveArray.map(key => {
              return <span key={key}>{inactiveMap[key]}</span>;
            })}
            {activeArray.map(key => {
              return <span key={key}>{activeMap[key]}</span>;
            })}
          </LeftWrapper>
          <DetailIcon onClick={clickDetail} />
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
            <ModalItem>
              <VerifyIcon isActive={verify === 1} />
              <span>
                <Trans i18nKey="general.table.token.projectInfo.modal.verify">
                  The contract has been verified (
                  <Link href="/contract-verification">Verify the contract</Link>{' '}
                  now!)
                </Trans>
              </span>
            </ModalItem>
            <ModalItem>
              <AuditIcon isActive={audit === 1} />
              <span>
                <Trans i18nKey="general.table.token.projectInfo.modal.audit">
                  The contract code passes the audit (Have an audit report or
                  related link?
                  <Link
                    href={
                      lang === 'en'
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
            </ModalItem>
            <ModalItem>
              <SponsorIcon isActive={sponsor === 1} />
              <span>
                <Trans i18nKey="general.table.token.projectInfo.modal.sponsor">
                  Accepted by Conflux’s Global Ecosystem Grants Program (
                  <Link
                    href={
                      lang === 'en'
                        ? 'https://forum.conflux.fun/t/grant-proposal-review-process-project-eligibility/8273'
                        : 'https://forum.conflux.fun/t/conflux/7836 '
                    }
                    target={'_blank'}
                  >
                    Apply for Grants
                  </Link>{' '}
                  now!)
                </Trans>
              </span>
            </ModalItem>
            <ModalItem>
              <OxIcon isActive={zeroAdmin === 1} />
              <span>
                {t(
                  translations.general.table.token.projectInfo.modal
                    .zeroAddress,
                )}
              </span>
            </ModalItem>
            <ModalItem>
              <CexIcon isActive={!isAllNull(cex)} />
              <ModalItems>
                <TransWrapper>
                  <Trans i18nKey="general.table.token.projectInfo.modal.cex">
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
                  {cex.ok ? (
                    <Trans i18nKey="general.table.token.projectInfo.modal.ok">
                      -
                      <Link href={cex?.ok} target={'_blank'}>
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
            </ModalItem>
            <ModalItem>
              <DexIcon isActive={!isAllNull(dex)} />
              <ModalItems>
                <TransWrapper>
                  <Trans i18nKey="general.table.token.projectInfo.modal.dex">
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
            </ModalItem>
            <ModalItem>
              <CoinMarketIcon isActive={!isAllNull(track)} />
              <span>
                {!isAllNull(track) ? (
                  <Trans
                    i18nKey="general.table.token.projectInfo.modal.cmc"
                    components={[
                      <Link href={track.coinMarketCap} target={'_blank'} />,
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
                    Listed by CoinMarketCap（ Submit proof）Rate: --
                  </Trans>
                ) : (
                  <Trans
                    i18nKey="general.table.token.projectInfo.modal.cmc"
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
                    Listed by CoinMarketCap（Submit proof）Rate: --
                  </Trans>
                )}
              </span>
            </ModalItem>
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

  > span:not(:last-child) {
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
`;
const ModalItems = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
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
