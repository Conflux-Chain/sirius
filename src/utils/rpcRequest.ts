import { CFX } from 'utils/constants';
import { POS_NULL_ADDRESS } from 'utils/constants';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import lodash from 'lodash';

// @ts-ignore
window.SDK = SDK;
// @ts-ignore
window.CFX = CFX;

const posContract = CFX.InternalContract('PoSRegister');

const request = async (method, ...args) => {
  try {
    return await CFX.provider.call(method, ...args);
  } catch (e) {
    // @todo, temp disabled notify, enable after PoS release on mainnet

    // pubsub.publish('notify', {
    //   type: 'request',
    //   option: {
    //     code: 30001,
    //   },
    // });

    throw e;
  }
};

interface PoSAccountInfoType {
  address: string | null;
  blockNumber: number | null;
  status: {
    availableVotes: number | null;
    locked: number | null;
    unlocked: number | null;
    outQueue: Array<{
      endBlockNumber: number;
      power: number;
    }>;
    inQueue: Array<{
      endBlockNumber: number;
      power: number;
    }>;
    // forceRetired: any;
    // exemptFromForfeit: any;
  };
}

export const getPosAccountInfo = async (
  address: string,
  type = 'pos',
): Promise<PoSAccountInfoType> => {
  try {
    let addr = address;

    if (type === 'pow') {
      const data = await posContract.addressToIdentifier(address);
      addr = data.toString('hex');
      // check if has no pos address
      addr = addr === POS_NULL_ADDRESS ? '' : `0x${addr}`;
    }

    if (addr) {
      const { address, blockNumber, status } = await CFX.pos.getAccount(addr);

      return {
        address: address,
        blockNumber: blockNumber,
        status: {
          availableVotes: status.availableVotes,
          locked: status.locked,
          unlocked: status.unlocked,
          outQueue: status.outQueue,
          inQueue: status.inQueue,
          // forceRetired: status.forceRetired,
          // exemptFromForfeit: status.exemptFromForfeit,
        },
      };
    } else {
      throw new Error('no related pos info');
    }
  } catch (e) {
    console.log('getPosAccountInfo: ', e);

    // pubsub.publish('notify', {
    //   type: 'request',
    //   option: {
    //     code: 30001,
    //   },
    // });

    return {
      address: null,
      blockNumber: null,
      status: {
        availableVotes: null,
        locked: null,
        unlocked: null,
        outQueue: [],
        inQueue: [],
      },
    };
  }
};

interface PoSStatusType {
  epoch: number | null;
  latestCommitted: number | null;
  latestVoted: number | null;
  pivotDecision: number | null;
}
export const getPosStatus = async (): Promise<PoSStatusType> =>
  request('pos_getStatus')
    .then(data => {
      return {
        epoch: SDK.format.uInt(data.epoch),
        latestCommitted: SDK.format.uInt(data.latestCommitted),
        latestVoted: SDK.format.uInt(data.latestVoted),
        pivotDecision: SDK.format.uInt(data.pivotDecision.height),
      };
    })
    .catch(e => {
      console.log('getPosStatus: ', e);

      // pubsub.publish('notify', {
      //   type: 'request',
      //   option: {
      //     code: 30001,
      //   },
      // });

      return {
        epoch: null,
        latestCommitted: null,
        latestVoted: null,
        pivotDecision: null,
      };
    });

type ConfirmationRiskByHashType = string | null;
export const getConfirmationRiskByHash = async (
  hash: string,
): Promise<ConfirmationRiskByHashType> =>
  request('cfx_getConfirmationRiskByHash', hash)
    .then(data => data)
    .catch(e => {
      console.log('getConfirmationRiskByHash: ', e);

      // pubsub.publish('notify', {
      //   type: 'request',
      //   option: {
      //     code: 30001,
      //   },
      // });

      return null;
    });

interface PoSBlockType {
  epoch: number | null;
  blockHeight: number | null;
  timestamp: number | null;
  miner: string | null;
  hash: string | null;
  status: string | null;
  powBlockHash: string | null;
  signatures: Array<{
    account: string;
    votes: number;
  }>;
}
export const getBlockByHash = async (hash: string): Promise<PoSBlockType> => {
  try {
    // {
    //   epoch: data.epoch,
    //   blockHeight: data.height,
    //   timestamp: data.timestamp, // uint is microsecond
    //   miner: data.miner,
    //   hash: data.hash, // pos hash
    //   status: '', // 调用 pos_getStatus 获取 latestCommitted，和 pos block height 做比较，如果 pos block height 小于这个值是 committed，大于是 voted
    //   powBlockHash: '', // 是 data.pivotDecision.blockHash
    // };

    const blockInfo = await CFX.pos.getBlockByHash(hash);

    if (lodash.isNil(blockInfo)) {
      throw new Error(`no block info of ${hash}`);
    }

    const batcher = CFX.BatchRequest();
    batcher.add(CFX.pos.getStatus.request());

    const [status] = await batcher.execute();

    if (!lodash.isNil(status.code)) {
      throw new Error(status);
    }

    return {
      epoch: blockInfo.epoch,
      blockHeight: blockInfo.height,
      miner: blockInfo.miner,
      hash: blockInfo.hash,
      timestamp: Number((blockInfo.timestamp / 1000).toFixed()), // blockInfo.timestamp uint is microsecond
      powBlockHash: blockInfo.pivotDecision.blockHash,
      status:
        blockInfo.height <= status.latestCommitted ? 'committed' : 'voted',
      signatures: blockInfo.signatures || [],
    };
  } catch (e) {
    console.log('getBlockByHash error: ', e);

    // pubsub.publish('notify', {
    //   type: 'request',
    //   option: {
    //     code: 30001,
    //   },
    // });

    return {
      epoch: null,
      blockHeight: null,
      timestamp: null,
      miner: null,
      hash: null,
      status: null,
      powBlockHash: null,
      signatures: [],
    };
  }
};

interface CommitteNodeType {
  address: string;
  votingPower: number;
}
interface PoSCommitteeType {
  currentCommittee: {
    epochNumber: number | null;
    nodes: Array<CommitteNodeType>;
    quorumVotingPower: number | null;
    totalVotingPower: number | null;
  };
  elections: Array<{
    isFinalized: boolean | null;
    startBlockNumber: number | null;
    topElectingNodes: Array<CommitteNodeType>;
  }>;
}
export const getCommittee = async (
  blickNumber: number | string,
): Promise<PoSCommitteeType> =>
  CFX.pos
    .getCommittee(blickNumber)
    .then(data => {
      return data;
    })
    .catch(e => {
      console.log('getCommittee: ', e);

      // pubsub.publish('notify', {
      //   type: 'request',
      //   option: {
      //     code: 30001,
      //   },
      // });

      return {
        currentCommittee: {
          epochNumber: null,
          nodes: [],
          quorumVotingPower: null,
          totalVotingPower: null,
        },
        elections: [],
      };
    });

interface PoSTransactionType {
  blockHash: string | null;
  blockNumber: number | null;
  from: string | null;
  hash: string | null;
  number: number | null;
  payload: any | null; // there are 6 different kind of payload, for detail https://github.com/Pana/conflux-doc/blob/master/docs/pos-rpc-zh.md
  status: string | null;
  timestamp: number | null;
  type: string | null;
}
export const getTransactionByNumber = async (
  number: number | string,
): Promise<PoSTransactionType> => {
  return CFX.pos
    .getTransactionByNumber(number)
    .then(data => {
      return {
        ...data,
        timestamp: Number((data.timestamp / 1000).toFixed()), // blockInfo.timestamp uint is microsecond
      };
    })
    .catch(e => {
      console.log('getTransactionByNumber: ', e);

      // pubsub.publish('notify', {
      //   type: 'request',
      //   option: {
      //     code: 30001,
      //   },
      // });

      return {
        blockHash: null,
        blockNumber: null,
        from: null,
        hash: null,
        number: null,
        payload: {
          blockHash: null,
          height: null,
        },
        status: null,
        timestamp: null,
        type: null,
      };
    });
};
