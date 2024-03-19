import { useEffect, useState, useRef } from 'react';
import { getPosStatus, getConfirmationRiskByHash } from 'utils/rpcRequest';
import { transferRisk } from 'sirius-next/packages/common/dist/utils';


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
      getPosStatus()
        .then(data => {
          if (
            data.pivotDecision !== null &&
            epochNumber <= data.pivotDecision
          ) {
            setRisk('lv5');
          } else {
            loop();
          }
        })
        .catch(e => {
          loop();
        });
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
