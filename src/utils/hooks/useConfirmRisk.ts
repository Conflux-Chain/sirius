import { useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';
import {
  // getPosStatus,
  getConfirmationRiskByHash,
} from 'utils/rpcRequest';

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

export const useConfirmRisk = (blockHash: string, epochNumber: number) => {
  const [risk, setRisk] = useState('');
  const ref = useRef(0);

  const getRisk = risk => {
    // get risk by block hash first
    if (risk !== 'lv0') {
      if (blockHash) {
        getConfirmationRiskByHash(blockHash)
          .then(data => {
            // loop if no risk info
            if (!data) {
              loop();
            } else {
              const risk = transferRisk(data);
              setRisk(risk);
              if (risk === 'lv0') {
                loop(risk, 0);
              } else {
                loop(risk);
              }
            }
          })
          .catch(e => {
            // loop if error
            loop();
          });
      }
    } else {
      // is risk is lv0, meaning security is great, then check if finalized by epoch number
      // getPosStatus()
      //   .then(data => {
      //     if (
      //       data.pivotDecision !== null &&
      //       epochNumber <= data.pivotDecision
      //     ) {
      //       setRisk('lv5');
      //     } else {
      //       loop();
      //     }
      //   })
      //   .catch(e => {
      //     loop();
      //   });
    }
  };

  const loop = (risk?, timeout = 2000) => {
    // getRisk again
    clearInterval(ref.current);
    ref.current = setTimeout(() => {
      getRisk(risk);
    }, timeout);
  };

  useEffect(() => {
    loop('', 0);

    return () => {
      clearInterval(ref.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockHash, epochNumber]);

  return risk;
};
