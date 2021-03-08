import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { media } from 'styles/media';
import { translations } from 'locales/i18n';
import dayjs from 'dayjs';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Input, Button } from '@cfxjs/react-ui';
import { useParams } from 'react-router-dom';
import { cfx } from '../../../utils/cfx';
import {
  abi as governanceAbi,
  bytecode as gobernanceBytecode,
} from '../../../utils/contract/governance.json';
import { governanceAddress } from '../../../utils/constants';
import { getTimeByBlockInterval } from '../../../utils';
import { Countdown } from './Countdown';

const governanceContract = cfx.Contract({
  abi: governanceAbi,
  bytecode: gobernanceBytecode,
  address: governanceAddress,
});

export function BlocknumberCalc() {
  const maxBlocknumber = 10000000000000;
  const { block: routeBlockNumber = '' } = useParams<{
    block?: string;
  }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language.indexOf('en') > -1;
  const [blocknumber, setBlocknumber] = useState<string>(
    +routeBlockNumber > maxBlocknumber ? maxBlocknumber + '' : routeBlockNumber,
  );
  const [currentBlocknumber, setCurrentBlocknumber] = useState<string>('');
  const [seconds, setSeconds] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const calcTimeSpan = current => {
    if (parseInt(blocknumber) > +current) {
      const timeObj = getTimeByBlockInterval(parseInt(blocknumber), +current);
      if (timeObj.seconds > 0) {
        setSeconds(timeObj.seconds);
      }
    } else {
      setError(t(translations.blocknumberCalc.higherError));
      setSeconds(null);
    }
  };

  const handleCalc = () => {
    if (blocknumber && parseInt(blocknumber) > +currentBlocknumber) {
      setLoading(true);
      governanceContract
        .getBlockNumber()
        .then(res => {
          setCurrentBlocknumber(res);
          calcTimeSpan(res);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError(t(translations.blocknumberCalc.higherError));
      setSeconds(null);
    }
  };

  const handleBlocknumberChange = e => {
    setBlocknumber(
      +e.target.value.trim() > maxBlocknumber
        ? maxBlocknumber
        : e.target.value.trim(),
    );
    setError('');
  };

  useEffect(() => {
    setLoading(true);
    // get current blocknumber
    governanceContract
      .getBlockNumber()
      .then(res => {
        setCurrentBlocknumber(res);
        if (blocknumber) calcTimeSpan(res);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.header.blocknumberCalc)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.blocknumberCalc.title)}</PageHeader>
      <StyledInputWrapper>
        <div>
          <Input
            type="number"
            step="1"
            value={blocknumber}
            placeholder={t(translations.blocknumberCalc.placeholder)}
            size="small"
            variant="solid"
            className="convert-address-input input-address"
            onChange={handleBlocknumberChange}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleCalc();
              }
            }}
          />
          <div className="convert-address-error">{error}</div>
        </div>
        <Button
          variant="solid"
          color="primary"
          size="small"
          className="convert-address-button"
          onClick={handleCalc}
          disabled={loading}
        >
          {t(translations.blocknumberCalc.calcBtn)}
        </Button>
      </StyledInputWrapper>
      <CardWrapper>
        <Card className="blocknumber">
          <span className="title">
            {t(translations.blocknumberCalc.currentBlocknumber)}
          </span>
          <span className="number">
            #{currentBlocknumber ? currentBlocknumber : ''}
          </span>
        </Card>
        <Card className="blocknumber">
          <span className="title">
            {t(translations.blocknumberCalc.remainingBlocks)}
          </span>
          <span className="number">
            #
            {currentBlocknumber &&
            blocknumber &&
            parseInt(blocknumber) > +currentBlocknumber
              ? parseInt(blocknumber) - +currentBlocknumber
              : ''}
          </span>
        </Card>
      </CardWrapper>
      {seconds != null ? (
        <>
          <Countdown seconds={seconds} />
          <div className="target-date">
            {t(translations.blocknumberCalc.targetDate)}:{' '}
            <strong>
              {dayjs(+new Date() + seconds * 1000).format(
                isEn
                  ? 'MMM DD YYYY HH:mm:ss (UTCZ)'
                  : 'YYYY年MM月DD日 HH:mm:ss (UTCZ)',
              )}
            </strong>
          </div>
        </>
      ) : null}
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;
  padding-top: 2.2857rem;

  .target-date {
    margin-top: 16px;
    font-size: 14px;
    font-weight: normal;
    color: #74798c;
  }

  ${media.s} {
    margin-top: 16px;
    padding: 1.1429rem;
  }
`;

const CardWrapper = styled.div`
  width: 100%;
  display: flex;

  ${media.s} {
    flex-direction: column;
  }

  .blocknumber {
    width: 252px !important;
    margin-top: 16px !important;
    margin-right: 16px !important;
    margin-bottom: 16px !important;
    padding-top: 16px !important;
    padding-bottom: 16px !important;

    .title {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #97a3b4;
    }

    .number {
      display: block;
      font-size: 14px;
      font-weight: normal;
      color: #002e74;
      line-height: 30px;
    }
  }
`;

const StyledInputWrapper = styled.div`
  display: flex;

  .input-container.convert-address-input {
    height: 2.2857rem;

    input {
      height: 2.2857rem;
      background: rgba(30, 61, 228, 0.04);
      border-radius: 0.2857rem;
      margin: 0;
      padding: 0 1.1429rem;
    }

    &.input-address {
      input {
        width: 28.5714rem;

        ${media.s} {
          width: 100%;
        }
      }
    }

    &.input-network-id {
      input {
        width: 11.7143rem;
      }
    }
  }

  /* solve react-ui input margin issue */
  .input-spacer {
    width: 1.1429rem;
    display: inline-block;

    ${media.s} {
      display: block;
      width: 0;
      margin-top: 0.5714rem;
    }
  }

  .btn.convert-address-button {
    height: 2.2857rem;
    line-height: 2.2857rem;
    margin: 0 0 0 1.1429rem;
    border: none;

    & > div {
      top: 0;
    }
  }

  .convert-address-error {
    width: 28.5714rem;
    margin: 0.5714rem 0;
    font-size: 0.8571rem;
    color: #e64e4e;
    line-height: 1.1429rem;
    padding-left: 0.3571rem;

    ${media.s} {
      width: 100%;
    }
  }
`;
