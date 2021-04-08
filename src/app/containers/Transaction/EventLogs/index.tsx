import React, { useEffect, useState } from 'react';
import { reqTransactionEventlogs, reqContract } from 'utils/httpRequest';
import { Card } from '../../../components/Card/Loadable';
import { Empty } from '../../../components/Empty/Loadable';
import { cfx } from 'utils/cfx';
import { Description } from '../../../components/Description/Loadable';
import styled from 'styled-components/macro';
import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { isTestNetEnv } from 'utils/hooks/useTestnet';
import { CHAIN_ID } from 'utils/constants';
import _ from 'lodash';
import SkeletonContainer from '../../../components/SkeletonContainer';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { Address } from './Address';
import { Topics } from './Topics';
import { Data } from './Data';
import { Event } from './Event';

import BigNumber from 'bignumber.js';
import { Buffer } from 'buffer';

// @ts-ignore
window.BigNumber = BigNumber;
// @ts-ignore
window.Buffer = Buffer;

const isTestNet = isTestNetEnv();
const chainId = isTestNet ? CHAIN_ID.testnet : CHAIN_ID.mainnet;

interface Props {
  hash: string;
  address?: string;
  abi?: Array<any>;
  bytecode?: string;
}

/**
 * @example:
 * contract has registered abi
 * {
 *   fnName: 'transfer', // event function name
 *   args: { // event topics
 *     "argName": "from", // params name
 *     "type": "address", // params type
 *     "indexed": 1, // topic index, same as indexed order
 *     "value": "0x1f3c6b9696604cdc3ce1ca277d4c69a9c2770c9x", // decoded value
 *     "hexValue": "0x0000000000000000000000001f3c6b9696604cdc3ce1ca277d4c69a9c2770c9f", // original hex value of topic list
 *     "cfxAddress": null // if decoded value is start with 0x0, 0x1, 0x8, then checkout cfx base32 address
 *   }
 * }
 */

const getAddress = data => format.address(data, chainId);

/**
 *
 * @param data
 * @param type
 * @returns
 * @todo convert hex data
 */
const formatData = (data, type) => {
  try {
    // bigint value, should convert first, because Object.prototype.toString.call(data) = '[object Array]'
    if (data.sign !== undefined) {
      return data.toString();
    }
    // bytes[], uint[], int[], tuple
    // @todo use JSON.stringify to decode data, will cause inner value to be wrapped with quotation mark, like "string" type
    if (Object.prototype.toString.call(data) === '[object Array]') {
      return JSON.stringify(data);
    }
    // others: bytes, address, uint, int,
    return data.toString();
  } catch (e) {
    return data.toString();
  }
};

const disassembleEvent = (log, decodedLog) => {
  try {
    var r = /(.*?)(?=\()(\((.+)\))$/;
    const result = r.exec(decodedLog.fullName);
    if (result !== null) {
      const fnName = result[1];
      let args:
        | string
        | Array<{
            argName: string;
            type: string;
            indexed: number;
          }> = result[3];
      let indexCount = 1;

      args = args.split(', ').map(i => {
        let item = i.trim().split(' ');
        const type = item[0];

        let r = {
          argName: '',
          type: type,
          indexed: 0, // 0 is mean not indexed
          value: null,
          hexValue: null,
          cfxAddress: null,
        };

        if (item.length === 2) {
          r.argName = item[1];
          r.value = formatData(decodedLog.object[item[1]], r.type);
        } else if (item.length === 3) {
          r.argName = item[2];
          r.type = type;
          r.indexed = indexCount;
          r.value = formatData(decodedLog.object[item[2]], r.type);
          r.hexValue = log.topics[indexCount];

          try {
            r.value = format.hexAddress(r.value);
            r.cfxAddress = getAddress(r.value);
          } catch (e) {}

          indexCount += 1;
        }
        return r;
      });

      return {
        fnName,
        args,
      };
    }
  } catch (e) {
    return decodedLog.fullName;
  }
};

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

  useEffect(() => {
    const fields = [
      'address',
      'abi',
      // 'bytecode',
      // 'sourceCode', // not need now
    ];
    setLoading(true);

    // get contract info
    reqContract({ address: log.address, fields: fields })
      .then(body => {
        try {
          if (!body.abi) {
            throw new Error(`not abi of this contract: ${log.address}`);
          } else {
            // in case of invalid abi
            const contract = cfx.Contract({
              abi: JSON.parse(body.abi),
              address: log.address,
            });
            const decodedLog = contract.abi.decodeLog(log);

            const { fnName, args } = disassembleEvent(log, decodedLog);
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
                topics: [],
                data: [],
              },
            );

            setEventInfo({
              address: log.address,
              fnName,
              args,
              topics,
              data,
              signature: decodedLog.signature,
            });
          }
        } catch (e) {}
      })
      .finally(() => {
        setLoading(false);
      });
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
        <Description
          className="description"
          title={t(translations.transaction.logs.address)}
          small
          noBorder
        >
          <Address address={address}></Address>
        </Description>
        {fnName ? (
          <Description
            className="description"
            title={t(translations.transaction.logs.name)}
            small
            noBorder
          >
            <Event fnName={fnName} args={args} />
          </Description>
        ) : null}
        <Description
          className="description"
          title={t(translations.transaction.logs.topics)}
          small
          noBorder
        >
          <Topics data={topics} signature={signature} />
        </Description>
        {!!data.length && (
          <Description
            className="description"
            title={t(translations.transaction.logs.data)}
            small
            noBorder
          >
            <Data data={data} hexData={log.data} />
          </Description>
        )}
      </SkeletonContainer>
    </StyledEventLogWrapper>
  );
};

export const EventLogs = ({ hash }: Props) => {
  const [eventlogs, setEventlogs] = useState([
    {
      topics: [],
      data: '',
      address: '',
    },
  ]);

  useEffect(() => {
    reqTransactionEventlogs({
      hash,
    }).then(body => {
      setEventlogs(body.list);
    });
  }, [hash]);

  return (
    <StyledEventLogsWrapper>
      <Card>
        <Empty show={!eventlogs.length} />
        {eventlogs.map((log, index) => (
          <EventLog log={log} key={`${log.address}-${index}`} />
        ))}
      </Card>
    </StyledEventLogsWrapper>
  );
};

const StyledEventLogsWrapper = styled.div`
  position: relative;
  margin-bottom: 2.2857rem;
  min-height: 16.4286rem;
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
      width: 6rem;
    }
  }
`;
