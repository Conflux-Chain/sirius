import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { usePortal } from 'utils/hooks/usePortal';
import {
  useTxnHistory,
  Record,
  TxnHistoryContext,
} from 'utils/hooks/useTxnHistory';
import { Link as ScanLink } from './Link';
import { RotateImg } from './RotateImg';

import iconSuccess from './assets/success.svg';
import iconFail from './assets/failed.svg';
import iconPending from './assets/pending.svg';

const statusIconMap = {
  0: iconSuccess,
  1: iconFail,
  null: iconPending,
};

export const History = ({
  className,
}: {
  className?: string;
  show?: boolean;
}) => {
  const { t } = useTranslation();
  const { installed, connected } = usePortal();
  const [show, setShow] = useState(false);
  const { getRecords, clearRecords } = useTxnHistory();
  const [records, setRecords] = useState<Array<Record>>([]);

  const {
    pendingRecords,
    config: { convert },
  } = useContext(TxnHistoryContext);

  const getTxnRecords = function () {
    const records = getRecords();
    // @ts-ignore
    setRecords(records);
  };

  useEffect(() => {
    if (connected === 1) {
      setShow(true);
    } else {
      setShow(false);
    }
    getTxnRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, pendingRecords]);

  const handleClear = () => {
    clearRecords();
    getTxnRecords();
  };

  let title = t(translations.connectWallet.history.emptyRecordsTip);
  if (installed) {
    if (connected === 1) {
      title = t(translations.connectWallet.history.recentlyRecordsTip);
    }
  }

  return (
    <HistoryWrapper
      className={clsx('connect-wallect-history', className, {
        show,
      })}
    >
      <div className="history-top">
        <span className="history-title">{title}</span>
        <span className="history-button" onClick={handleClear}>
          {t(translations.connectWallet.history.clearAll)}
        </span>
      </div>
      <div className="history-bottom">
        {records.map(r => (
          <div className="history-item" key={r.hash}>
            <ScanLink href={`/transaction/${r.hash}`}>
              {(convert && convert(r.info, r)) || r.info || r.hash}
            </ScanLink>

            {r.status === null ? (
              <RotateImg
                className="history-item-status"
                src={statusIconMap[String(r.status)]}
                alt="icon"
              ></RotateImg>
            ) : (
              <img
                className="history-item-status"
                src={statusIconMap[String(r.status)]}
                alt="icon"
              ></img>
            )}
          </div>
        ))}
      </div>
    </HistoryWrapper>
  );
};

const HistoryWrapper = styled.span`
  width: 32rem;
  max-height: 21.4286rem;
  overflow: auto;
  background: #f1f3f6;
  border-radius: 0rem 0rem 0.5714rem 0.5714rem;
  padding: 1.1429rem 2.2857rem;
  box-sizing: border-box;
  display: none;

  &.show {
    display: flex;
    flex-direction: column;
  }

  .history-top {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 1.1429rem;
    cursor: pointer;

    .history-title {
      font-size: 16px;
      color: #333333;
    }

    .history-button {
      font-size: 14px;
      color: #74798c;
    }
  }

  .history-bottom {
    max-height: 228px;
    overflow: auto;

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .history-item-status {
      width: 0.8571rem;
      height: 0.8571rem;
    }
  }
`;
