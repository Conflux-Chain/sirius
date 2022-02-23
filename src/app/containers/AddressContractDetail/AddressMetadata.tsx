import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { List } from 'app/components/List/';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from 'styles/media';
import { Modal } from '@cfxjs/react-ui';
import { Text } from 'app/components/Text';
import {
  fromDripToCfx,
  getTimeByBlockInterval,
  toThousands,
  publishRequestError,
} from 'utils';
import SkeletonContainer from 'app/components/SkeletonContainer/Loadable';
import { CONTRACTS, CFX, NETWORK_TYPE, NETWORK_TYPES } from 'utils/constants';
import ViewMore from 'images/contract-address/viewmore.png';
import {
  abi as governanceAbi,
  bytecode as gobernanceBytecode,
} from 'utils/contract/governance.json';
import {
  abi as stakingAbi,
  bytecode as stakingBytecode,
} from 'utils/contract/staking.json';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { Link } from 'app/components/Link/Loadable';
import { getPosAccountInfo } from 'utils/rpcRequest';
import { reqHomeDashboardOfPOSSummary } from 'utils/httpRequest';
import lodash from 'lodash';
import { PoSAddressContainer } from 'app/components/AddressContainer';
import {
  getDepositList,
  getAccumulateInterestRate,
  getVoteList,
} from 'utils/rpcRequest';

const stakingContract = CFX.Contract({
  abi: stakingAbi,
  bytecode: stakingBytecode,
  address: CONTRACTS.staking,
});

export function AddressMetadata({ address, accountInfo }) {
  const { t } = useTranslation();
  const loading = accountInfo.name === t(translations.general.loading);
  const skeletonStyle = { height: '1.5714rem' };
  const [voteList, setVoteList] = useState<any>([]);
  const [lockedCFX, setLockedCFX] = useState<number | null>(null);
  const [currentVotingRights, setCurrentVotingRights] = useState<number | null>(
    null,
  );
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0);
  const [modalShown, setModalShown] = useState<boolean>(false);
  const [posAccountInfo, setPosAccountInfo] = useState<any>(null);
  const [posLoading, setPosLoading] = useState(false);
  const [checkPosLoading, setCheckPosLoading] = useState(false);
  const [isPoSActived, setIsPoSActived] = useState(false);

  const governanceContract = useMemo(() => {
    return CFX.Contract({
      abi: governanceAbi,
      bytecode: gobernanceBytecode,
      address: CONTRACTS.governance,
    });
  }, []);

  useEffect(() => {
    setCheckPosLoading(true);
    reqHomeDashboardOfPOSSummary()
      .then(data => {
        setCheckPosLoading(false);

        if (data.latestVoted && parseInt(data.latestVoted) > 0) {
          setIsPoSActived(true);
          setPosLoading(true);
          getPosAccountInfo(address, 'pow')
            .then(data => data && setPosAccountInfo(data))
            .finally(() => setPosLoading(false));
        }
      })
      .catch(e => {
        console.error('get pos homepage summary info error: ', e);
      });

    if (
      accountInfo.address &&
      [NETWORK_TYPES.mainnet, NETWORK_TYPES.testnet].includes(NETWORK_TYPE)
    ) {
      const proArr: any = [];
      proArr.push(getDepositList(address));
      proArr.push(getAccumulateInterestRate());
      proArr.push(getVoteList(address));
      proArr.push(governanceContract.getBlockNumber());
      Promise.all(proArr)
        .then(res => {
          const currentBlockN: any = res[3] || 0;
          setCurrentBlockNumber(currentBlockN.toString());
          setVoteList(res[2]);
          // @ts-ignore
          if (res[2] && res[2].length > 0) {
            //get current voting power
            stakingContract
              .getVotePower(address, currentBlockN)
              .then(res => {
                const votePower = res;
                setCurrentVotingRights(votePower);
              })
              .catch(e => {
                console.error(e);
              });

            // get locked CFX
            CFX.InternalContract('Staking')
              .getLockedStakingBalance(address, currentBlockN)
              .then(res => {
                setLockedCFX(res || 0);
              })
              .catch(e => publishRequestError(e, 'rpc'));
          } else {
            setCurrentVotingRights(0);
          }
        })
        .catch(e => {
          console.error(e);
          setVoteList([]);
          setCurrentVotingRights(0);
        });
    }
  }, [address, accountInfo, governanceContract]);

  const posMetadata = () => {
    return (
      <List
        list={[
          {
            title: t(translations.addressDetail.pos.identifier),
            children: (
              <SkeletonContainer
                shown={checkPosLoading || posLoading}
                style={skeletonStyle}
              >
                <CenterLine>
                  <Content>
                    {isPoSActived && posAccountInfo?.address ? (
                      <PoSAddressContainer
                        value={posAccountInfo?.address}
                      ></PoSAddressContainer>
                    ) : (
                      '--'
                    )}
                  </Content>
                </CenterLine>
              </SkeletonContainer>
            ),
          },
          {
            title: t(translations.addressDetail.pos.unlockRights),
            children: (
              <SkeletonContainer
                shown={checkPosLoading || posLoading}
                style={skeletonStyle}
              >
                <CenterLine>
                  <Content>
                    {!isPoSActived ||
                    lodash.isNil(posAccountInfo?.status?.unlocked)
                      ? '--'
                      : toThousands(posAccountInfo?.status?.unlocked)}
                  </Content>
                </CenterLine>
              </SkeletonContainer>
            ),
          },
          {
            title: t(translations.addressDetail.pos.totalStakedRights),
            children: (
              <SkeletonContainer
                shown={checkPosLoading || posLoading}
                style={skeletonStyle}
              >
                <CenterLine>
                  <Content>
                    {!isPoSActived ||
                    lodash.isNil(posAccountInfo?.status?.availableVotes)
                      ? '--'
                      : toThousands(posAccountInfo?.status?.availableVotes)}
                  </Content>
                </CenterLine>
              </SkeletonContainer>
            ),
          },
          {
            title: t(translations.addressDetail.pos.lockedRights),
            children: (
              <SkeletonContainer
                shown={checkPosLoading || posLoading}
                style={skeletonStyle}
              >
                <CenterLine>
                  <Content>
                    {!isPoSActived ||
                    lodash.isNil(posAccountInfo?.status?.locked)
                      ? '--'
                      : toThousands(posAccountInfo?.status?.locked)}
                  </Content>
                </CenterLine>
              </SkeletonContainer>
            ),
          },
        ]}
      />
    );
  };

  const powMetadata = () => {
    return (
      <>
        <List
          className="staking"
          list={[
            {
              title: (
                <Tooltip
                  text={
                    <>
                      {t(translations.toolTip.address.stakedBegin)}
                      {NETWORK_TYPE === NETWORK_TYPES.testnet ? (
                        <a
                          href="https://testnet-governance.confluxnetwork.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://testnet-governance.confluxnetwork.org
                        </a>
                      ) : (
                        <a
                          href="https://governance.confluxnetwork.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://governance.confluxnetwork.org
                        </a>
                      )}
                      {t(translations.toolTip.address.stakedEnd)}
                    </>
                  }
                >
                  {t(translations.addressDetail.staked)}
                </Tooltip>
              ),
              children: (
                <SkeletonContainer
                  shown={checkPosLoading || loading}
                  style={skeletonStyle}
                >
                  <CenterLine>
                    <Content>
                      <Text
                        hoverValue={`${fromDripToCfx(
                          accountInfo.stakingBalance || 0,
                          true,
                        )} CFX`}
                      >
                        {fromDripToCfx(accountInfo.stakingBalance || 0)} CFX
                      </Text>
                    </Content>
                  </CenterLine>
                </SkeletonContainer>
              ),
            },
            {
              title: (
                <Tooltip
                  text={
                    <>
                      {t(translations.toolTip.address.lockedBegin)}
                      {NETWORK_TYPE === NETWORK_TYPES.testnet ? (
                        <a
                          href="https://testnet-governance.confluxnetwork.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://testnet-governance.confluxnetwork.org
                        </a>
                      ) : (
                        <a
                          href="https://governance.confluxnetwork.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://governance.confluxnetwork.org
                        </a>
                      )}
                      {t(translations.toolTip.address.lockedEnd)}
                    </>
                  }
                >
                  {t(translations.addressDetail.locked)}
                </Tooltip>
              ),
              children: (
                <SkeletonContainer
                  shown={checkPosLoading || loading}
                  style={skeletonStyle}
                >
                  <CenterLine>
                    <Content>
                      {voteList && voteList.length > 0 ? (
                        <>
                          <Text
                            hoverValue={`${fromDripToCfx(
                              lockedCFX || 0,
                              true,
                            )} CFX`}
                          >
                            {fromDripToCfx(lockedCFX || 0)} CFX
                          </Text>
                          &nbsp;
                          <Text
                            hoverValue={t(
                              translations.addressDetail.viewLockedDetails,
                            )}
                          >
                            <ImgWrapper
                              onClick={() => {
                                setModalShown(true);
                              }}
                              src={ViewMore}
                              alt={t(
                                translations.addressDetail.viewLockedDetails,
                              )}
                            />
                          </Text>
                        </>
                      ) : (
                        '0 CFX'
                      )}
                    </Content>
                  </CenterLine>
                </SkeletonContainer>
              ),
            },
            {
              title: (
                <Text
                  hoverValue={t(
                    translations.toolTip.address.currentVotingRights,
                  )}
                >
                  {t(translations.addressDetail.currentVotingRights)}
                </Text>
              ),
              children: (
                <SkeletonContainer
                  shown={checkPosLoading || loading}
                  style={skeletonStyle}
                >
                  <CenterLine>
                    <Content>
                      {lodash.isNil(currentVotingRights) ? (
                        '--'
                      ) : (
                        <Text
                          hoverValue={fromDripToCfx(
                            currentVotingRights || 0,
                            true,
                          )}
                        >
                          {fromDripToCfx(currentVotingRights || 0)}
                        </Text>
                      )}
                    </Content>
                  </CenterLine>
                </SkeletonContainer>
              ),
            },
          ]}
        />

        <Modal
          closable
          open={modalShown}
          onClose={() => {
            setModalShown(false);
          }}
          width="600"
        >
          <Modal.Content>
            <ModalWrapper>
              <h2>{t(translations.addressDetail.lockedDetailTitle)}</h2>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>
                        {t(translations.addressDetail.lockedDetailLocked)}
                      </th>
                      <th>
                        {t(
                          translations.addressDetail
                            .lockedDetailUnlockBlockNumber,
                        )}
                      </th>
                      <th>
                        {t(translations.addressDetail.lockedDetailUnlockTime)}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {voteList && voteList.length > 0 ? (
                      voteList.map((v, i) => {
                        const { days } = getTimeByBlockInterval(
                          v.unlockBlockNumber,
                          currentBlockNumber,
                        );
                        return (
                          <tr key={i}>
                            <td>
                              <Text
                                hoverValue={fromDripToCfx(v.amount || 0, true)}
                              >
                                {fromDripToCfx(v.amount || 0)}
                              </Text>
                            </td>
                            <td>
                              <Link
                                href={`/block-countdown/${v.unlockBlockNumber}`}
                              >
                                {v.unlockBlockNumber}
                              </Link>
                            </td>
                            <td>
                              {t(translations.addressDetail.unlockTime, {
                                days,
                              })}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </ModalWrapper>
          </Modal.Content>
        </Modal>
      </>
    );
  };

  return (
    <>
      <div style={{ marginBottom: '24px' }}>{powMetadata()}</div>
      {posMetadata()}
    </>
  );
}

const CenterLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  .metadata-tooltip-btn {
    margin-left: 0.5rem;
    margin-bottom: 0.2857rem;
    ${media.s} {
      margin-left: 1rem;
    }
  }
`;

const Content = styled.span`
  &.not-available.link {
    color: #97a3b4;
  }
`;

const ImgWrapper = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 5px;
  margin-bottom: 3px;
`;

const ModalWrapper = styled.div`
  padding: 10px;
  width: 450px;

  h2 {
    font-size: 18px;
    font-weight: 500;
    color: #3a3a3a;
    line-height: 26px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e9ea;
  }

  .table-wrapper {
    max-height: 350px;
    overflow-y: auto;
  }

  table {
    width: 100%;
    font-size: 14px;
    text-align: left;
    padding: 10px 0;
    th,
    td {
      font-weight: normal;
      color: #9b9eac;
      line-height: 24px;
      padding: 4px;
    }
    td {
      color: #23304f;
    }
  }
`;
