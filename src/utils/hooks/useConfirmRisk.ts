import { useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { getConfirmationRiskByHash } from 'utils/rpcRequest';

const EPS = new BigNumber(1e-6);

export function transferRisk(riskStr) {
  const riskNum = new BigNumber(riskStr);

  if (riskNum.isNaN()) {
    return '';
  }
  // risk > 1e-4*(1+EPS)
  if (riskNum.isGreaterThan(new BigNumber(1e-4).times(EPS.plus(1)))) {
    return 'lv3';
  }
  // risk > 1e-6*(1+EPS)
  if (riskNum.isGreaterThan(new BigNumber(1e-6).times(EPS.plus(1)))) {
    return 'lv2';
  }
  // risk > 1e-8*(1+EPS)
  if (riskNum.isGreaterThan(new BigNumber(1e-8).times(EPS.plus(1)))) {
    return 'lv1';
  }
  return 'lv0';
}

export const useConfirmRisk = (blockHash: string) => {
  const [risk, setRisk] = useState('');
  const ref = useRef(0);

  const getRisk = () => {
    if (blockHash) {
      getConfirmationRiskByHash(SDK.format.blockHash(blockHash))
        .then(data => {
          // retry if no risk info
          if (!data) {
            reTry();
          } else {
            const risk = transferRisk(data.toString());
            setRisk(risk);
            // retry until risk is high
            if (risk !== 'lv0') {
              reTry();
            }
          }
        })
        .catch(e => {
          // retry if error
          reTry();
        });
    }
  };

  const reTry = () => {
    // getRisk again
    ref.current = setTimeout(() => {
      getRisk();
    }, 2000);
  };

  const getRiskFnRef = useRef(getRisk);

  useEffect(() => {
    getRiskFnRef.current();

    return () => {
      clearInterval(ref.current);
    };
  }, [blockHash, getRiskFnRef]);

  return risk;
};
