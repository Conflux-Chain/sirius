import React, { useEffect, useState } from 'react';
import { reqTransactionEventlogs, reqContract } from 'utils/httpRequest';
import { Card } from '../../../components/Card';
import { cfx } from 'utils/cfx';
import { Description } from '../../../components/Description/Loadable';
import styled from 'styled-components/macro';
import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { isTestNetEnv } from 'utils/hooks/useTestnet';
import { CHAIN_ID } from 'utils/constants';
import _ from 'lodash';
import SkeletonContainer from '../../../components/SkeletonContainer';

import { Address } from './Address';
import { Topics } from './Topics';
import { Data } from './Data';
import { Event } from './Event';

// // @ts-ignore
// window._ = _;
// // @ts-ignore
// window.sdkAddress = sdkAddress;
// // @ts-ignore
// window.format = format;

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

const disassembleEvent = (log, decodedLog) => {
  try {
    var r = /(.*)(\((.+)\))/;
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

      args = args.split(',').map(i => {
        let item = i.trim().split(' ');
        let r = {
          argName: '',
          type: item[0],
          indexed: 0, // 0 is mean not indexed
          value: null,
          hexValue: null,
          cfxAddress: null,
        };
        if (item.length === 2) {
          r.argName = item[1];
          r.value = decodedLog.object[item[1]];
        } else if (item.length === 3) {
          r.argName = item[2];
          r.type = item[0];
          r.indexed = indexCount;
          r.value = decodedLog.object[item[2]];
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
  const [eventInfo, setEventInfo] = useState<any>(() => {
    const splitData = _.words(log.data.substr(2), /.{64}/g).map(w => ({
      hexValue: w,
    }));

    return {
      address: log.address,
      fnName: null,
      args: [],
      topics: log.topics.slice(1),
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
      signature: log.topics[0],
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
              signature: log.topics[0],
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
      <SkeletonContainer shown={loading}>
        <Description className="description" title="Address" small noBorder>
          <Address address={address}></Address>
        </Description>
        {fnName ? (
          <Description className="description" title="Name" small noBorder>
            <Event fnName={fnName} args={args} />
          </Description>
        ) : null}
        <Description className="description" title="Topics" small noBorder>
          <Topics data={topics} signature={signature} />
        </Description>
        {!!data.length && (
          <Description className="description" title="Data" small noBorder>
            <Data data={data} hexData={log.data} />
          </Description>
        )}
      </SkeletonContainer>
    </StyledEventLogWrapper>
  );
};

export const EventLogs = ({ hash }: Props) => {
  const [eventlogs, setEventlogs] = useState([]);

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
        {eventlogs.map((log, index) => (
          <EventLog log={log} key={index} />
        ))}
      </Card>
    </StyledEventLogsWrapper>
  );
};

const StyledEventLogsWrapper = styled.div`
  margin-bottom: 32px;
`;

const StyledEventLogWrapper = styled.div`
  min-height: 80px;
  border-bottom: 1px solid #e8e9ea;
  padding: 10px 0;

  &:last-child {
    border-bottom: none;
  }

  .data-container {
    background: #fafbfc;
    padding: 12px;
  }

  .description.description {
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

/**
@todo
1. i18n - @txz
 */
