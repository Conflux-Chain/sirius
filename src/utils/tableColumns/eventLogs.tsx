import React, { useMemo } from 'react';
import { translations } from 'locales/i18n';
import { Translation } from 'react-i18next';
import styled from 'styled-components';
import { TxnHashRenderComponent } from './transaction';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import BigNumber from 'bignumber.js';
import { ColumnAge } from './utils';
import { Age } from '@cfxjs/sirius-next-common/dist/components/Age';
import dayjs from 'dayjs';
import { createRawEventInfo } from 'app/containers/Transaction/EventLogs';
import { CFX } from 'utils/constants';
import { disassembleEvent } from 'app/components/TxnComponents/util';
import { Topics } from 'app/containers/Transaction/EventLogs/Topics';
import { Data } from 'app/containers/Transaction/EventLogs/Data';
import { EventName } from '@cfxjs/sirius-next-common/dist/components/EventLog/EventName';

export const transactionHash = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.hash)}
    </Translation>
  ),
  dataIndex: 'transactionHash',
  key: 'transactionHash',
  width: 1,
  render: transactionHash => <TxnHashRenderComponent hash={transactionHash} />,
};

export const epochNumber = {
  title: (
    <Translation>{t => t(translations.general.table.block.epoch)}</Translation>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  width: 1,
  render: value => {
    if (!value) return null;
    const height = new BigNumber(value).toString();
    return <Link href={`/epoch/${height}`}>{height}</Link>;
  },
};

export const age = (ageFormat, toggleAgeFormat) => ({
  ...ColumnAge({ ageFormat, toggleAgeFormat, dataIndex: 'blockTimestamp' }),
  render: value => {
    if (!value) return <span>--</span>;
    const second = +value;

    return ageFormat === 'age' ? (
      <Age from={second} to={dayjs().valueOf()} />
    ) : (
      <div
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {dayjs.unix(second).format('YYYY-MM-DD HH:mm:ss')}
      </div>
    );
  },
});

export const EventLog = ({
  log,
  contractInfo,
  implementContractInfo,
}: {
  log: any;
  contractInfo?: any;
  implementContractInfo?: any;
}) => {
  const eventInfo = useMemo(() => {
    const rawEventInfo = createRawEventInfo(log);
    const candidateAbis: string[] = [];

    // Prefer verified implementation ABI for proxy contracts, falling back to verified contract ABI.
    if (
      implementContractInfo?.verify?.exactMatch &&
      implementContractInfo.abi
    ) {
      candidateAbis.push(implementContractInfo.abi);
    }
    if (contractInfo?.verify?.exactMatch && contractInfo.abi) {
      candidateAbis.push(contractInfo.abi);
    }

    if (!candidateAbis.length) {
      return rawEventInfo;
    }

    let decodedLog: any = null;
    for (const abi of candidateAbis) {
      try {
        const contract = CFX.Contract({
          abi: JSON.parse(abi),
          address: log.address,
        });
        decodedLog = contract.abi.decodeLog(log);
        if (decodedLog) break;
      } catch (error) {
        console.log('eventlog process error: ', error);
      }
    }

    if (!decodedLog) {
      return rawEventInfo;
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

    return {
      address: log.address,
      fnName: decodedLog.name,
      args,
      topics,
      data,
      signature: decodedLog.signature,
    };
  }, [log, contractInfo, implementContractInfo]);

  const { fnName, args, topics, data, signature } = eventInfo;

  return (
    <StyledEventLogWrapper>
      <EventName name={fnName} args={args} />
      <Topics data={topics} signature={signature} />
      {!!data.length && <Data data={data} hexData={log.data} />}
    </StyledEventLogWrapper>
  );
};

export const logs = ({ contractInfo, implementContractInfo }) => ({
  title: <Translation>{t => t(translations.eventLogs.logs)}</Translation>,
  dataIndex: 'logs',
  key: 'logs',
  width: 1,
  render: (_, row) => {
    return (
      <EventLog
        log={row}
        contractInfo={contractInfo}
        implementContractInfo={implementContractInfo}
      />
    );
  },
});

const StyledEventLogWrapper = styled.div`
  padding: 0.7143rem 0;

  .topic-item {
    align-items: flex-start;
    .index,
    .name {
      flex-shrink: 0;
    }
  }
`;
