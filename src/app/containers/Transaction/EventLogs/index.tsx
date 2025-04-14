import React, { useEffect, useState } from 'react';
import {
  reqTransactionEventlogs,
  reqContract,
  reqContractAndToken,
} from 'utils/httpRequest';
import { toThousands } from 'utils';
import { StyledCard as Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Empty } from '@cfxjs/sirius-next-common/dist/components/Empty';
import { CFX } from 'utils/constants';
import { Description } from '@cfxjs/sirius-next-common/dist/components/Description';
import styled from 'styled-components';
import _ from 'lodash';
import { SkeletonContainer } from '@cfxjs/sirius-next-common/dist/components/SkeletonContainer';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { formatAddress } from 'utils';

import { Address } from './Address';
import { Topics } from './Topics';
import { Data } from './Data';
import { Event } from 'app/components/TxnComponents/Event';
import { disassembleEvent } from 'app/components/TxnComponents/util';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { AddressLabel } from 'app/components/TxnComponents/AddressLabel';

interface Props {
  hash: string;
  address?: string;
  abi?: Array<any>;
  bytecode?: string;
}

const EventLog = ({ log }) => {
  const { t } = useTranslation();
  const [eventInfo, setEventInfo] = useState<any>(() => {
    const splitData = _.words(log.data.substr(2), /.{64}/g).map(w => ({
      hexValue: w,
    }));

    return {
      address: log.address,
      fnName: null,
      args: [],
      topics: log.topics,
      /**
       * if contract not register, it has no abi, need to decode data manully
       * decode params value by split every 64 character
       *
       * There is 4 kind value
       * 2. address: check if it can be decoded to address, by valid top 20 character is all 0, then use sdk.format.address(data) to decode, if throw error, try below
       * 3. text: sdk.format.hexBuffer(data).toString() to decode
       * 4. number: sdk.format.bigUInt(data).toString() to decode
       * 5. hex: original data
       */
      data: splitData,
      signature: null,
    };
  });
  const [loading, setLoading] = useState(false);
  const [contractAndTokenInfo, setContractAndTokenInfo] = useState({});

  useEffect(() => {
    const fields = [
      'address',
      'abi',
      'name',
      'iconUrl',
      // 'bytecode',
      // 'sourceCode', // not need now
    ];
    setLoading(true);

    async function fn() {
      try {
        let outerTopics: Array<{
          cfxAddress?: string;
        }> = [];
        let abi = '';
        const body = await reqContract({
          address: log.address,
          fields: fields,
        });
        const { proxy, implementation } = body;

        // check if has a proxy contract, if has, use implementation abi
        if (proxy?.proxy && implementation?.address) {
          const implementationResp = await reqContract({
            address: implementation.address,
            fields,
          });
          abi = implementationResp['abi'];
        } else {
          abi = body.abi;
        }

        if (abi) {
          // in case of invalid abi
          let contract = CFX.Contract({
            abi: JSON.parse(abi),
            address: log.address,
          });
          let decodedLog = contract.abi.decodeLog(log);

          // if no decodedLog info, this contract reaction maybe a upgrade, use original contract abi to decode
          if (!decodedLog) {
            contract = CFX.Contract({
              abi: JSON.parse(body.abi),
              address: log.address,
            });
            decodedLog = contract.abi.decodeLog(log);
          }

          const args = disassembleEvent(decodedLog, log);

          const { topics, data } = args.reduce(
            (prev, curr) => {
              if (curr.indexed) {
                prev.topics.push(curr);
              } else {
                prev.data.push(curr);
              }
              return prev;
            },
            {
              topics: [] as any,
              data: [] as any,
            },
          );

          outerTopics = args;

          setEventInfo({
            address: log.address,
            fnName: decodedLog.name,
            args,
            topics,
            data,
            signature: decodedLog.signature,
          });
        }

        let addressList = outerTopics
          .map(t => t.cfxAddress)
          .filter(t => t)
          .concat(formatAddress(log.address));
        addressList = _.uniq(addressList);

        if (addressList.length) {
          reqContractAndToken({
            address: addressList,
          })
            .then(data => {
              data.total && setContractAndTokenInfo(data.map);
            })
            .catch(() => {});
        }
      } catch (e) {
        console.log('eventlog process error: ', e);
      }

      setLoading(false);
    }

    fn();
  }, [log]);

  const { fnName, args, topics, data, address, signature } = eventInfo;

  return (
    <StyledEventLogWrapper>
      <SkeletonContainer
        shown={loading}
        style={{
          minHeight: '16.4286rem',
        }}
      >
        <div className="eventlog-content">
          {log?.transactionLogIndex !== undefined ? (
            <div className="eventlog-index">{log.transactionLogIndex + 1}</div>
          ) : null}
          <div className="eventlog-item">
            <Description
              className="description"
              title={
                <strong>{t(translations.transaction.logs.address)}</strong>
              }
              size="small"
              noBorder
            >
              <Address
                address={address}
                contract={contractAndTokenInfo[formatAddress(address)]}
              ></Address>
              <AddressLabel address={address} />
            </Description>
            {fnName ? (
              <Description
                className="description"
                title={t(translations.transaction.logs.name)}
                size="small"
                noBorder
              >
                <Event fnName={fnName} args={args} />
              </Description>
            ) : null}
            <Description
              className="description"
              title={t(translations.transaction.logs.topics)}
              size="small"
              noBorder
            >
              <Topics
                data={topics}
                signature={signature}
                contractAndTokenInfo={contractAndTokenInfo}
              />
            </Description>
            {!!data.length && (
              <Description
                className="description"
                title={<i>{t(translations.transaction.logs.data)}</i>}
                size="small"
                noBorder
              >
                <Data
                  data={data}
                  hexData={log.data}
                  contractAndTokenInfo={contractAndTokenInfo}
                />
              </Description>
            )}
          </div>
        </div>
      </SkeletonContainer>
    </StyledEventLogWrapper>
  );
};

export const EventLogs = ({ hash }: Props) => {
  // [{
  //   topics: [],
  //   data: '',
  //   address: '',
  // }]
  const [eventlogs, setEventlogs] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    reqTransactionEventlogs({
      transactionHash: hash,
      aggregate: false,
    })
      .then(body => {
        setEventlogs(body.list);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [hash]);

  return (
    <StyledEventLogsWrapper>
      <Card>
        {loading ? null : <Empty show={!eventlogs.length} />}
        {eventlogs.length ? (
          <>
            <div className="eventlog-title-total">
              {t(translations.general.totalRecord, {
                total: toThousands(eventlogs.length),
              })}
            </div>
            {eventlogs.map((log, index) => (
              <EventLog log={log} key={`${log.address}-${index}`} />
            ))}
          </>
        ) : null}
      </Card>
    </StyledEventLogsWrapper>
  );
};

const StyledEventLogsWrapper = styled.div`
  position: relative;
  margin-bottom: 2.2857rem;
  min-height: 16.4286rem;

  .eventlog-title-total {
    padding: 1.1429rem 0;
    border-bottom: 1px solid #e8e9ea;
  }

  .eventlog-content {
    display: flex;

    ${media.s} {
      flex-direction: column;
    }

    .eventlog-index {
      width: 2.2857rem;
      min-width: 2.2857rem;
      height: 2.2857rem;
      border-radius: 50%;
      background: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.8571rem 2rem 0 0;
    }
    .eventlog-item {
      flex-grow: 1;
    }
  }
`;

const StyledEventLogWrapper = styled.div`
  min-height: 5.7143rem;
  padding: 0.7143rem 0;
  border-bottom: 1px solid #e8e9ea;

  &:last-child {
    border-bottom: none;
  }

  .data-container {
    background: #fafbfc;
    padding: 0.8571rem;
  }

  .description.description {
    min-height: auto;

    &:last-child {
      .left,
      .right {
        padding-bottom: 0.8571rem;
      }
    }

    .left,
    .right {
      padding-bottom: 0;
    }

    .left {
      width: 20%;
      min-width: 6rem;
      max-width: 7rem;
      text-align: right;
      padding-right: 1rem;

      ${media.m} {
        text-align: left;
      }
    }
  }
`;
