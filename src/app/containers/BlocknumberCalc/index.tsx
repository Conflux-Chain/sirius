import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { translations } from 'locales/i18n';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import {
  cfx_getBlockByEpochNumber,
  pos_getBlockByNumber,
} from 'utils/rpcRequest';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { Radio } from '@cfxjs/sirius-next-common/dist/components/Radio';
import Button from '@cfxjs/sirius-next-common/dist/components/Button';
import { Input } from '@cfxjs/react-ui';
import { Countdown } from './Countdown';
import { trackEvent } from '../../../utils/ga';
import { ScanEvent } from '../../../utils/gaConstants';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import calculateSvg from 'images/calculate.svg';
import dayjs from 'dayjs';
import { useMount } from 'react-use';

const getPosInfo = async () => {
  const currentInfo = await pos_getBlockByNumber();
  const currentNumber = currentInfo.height;
  const currentTimestamp = currentInfo.timestamp / 1000; // ms
  const prevNumber = Math.max(currentNumber - 3000, 1);
  const prevInfo = await pos_getBlockByNumber(prevNumber);
  const prevTimestamp = prevInfo.timestamp / 1000; // ms
  const interval =
    (currentTimestamp - prevTimestamp) / (currentNumber - prevNumber);
  return {
    current: currentNumber,
    interval,
  };
};
const getEpochInfo = async () => {
  const currentInfo = await cfx_getBlockByEpochNumber();
  const currentNumber = currentInfo.epochNumber;
  const currentTimestamp = currentInfo.timestamp * 1000; // ms
  const prevNumber = Math.max(currentNumber - 100000, 1);
  const prevInfo = await cfx_getBlockByEpochNumber(prevNumber);
  const prevTimestamp = prevInfo.timestamp * 1000; // ms
  const interval =
    (currentTimestamp - prevTimestamp) / (currentNumber - prevNumber);
  return {
    current: currentNumber,
    interval,
  };
};
const getPowInfo = async () => {
  const currentInfo = await cfx_getBlockByEpochNumber();
  const currentNumber = currentInfo.blockNumber;
  const currentTimestamp = currentInfo.timestamp * 1000; // ms
  const prevInfo = await cfx_getBlockByEpochNumber(
    Math.max(currentInfo.epochNumber - 100000, 1),
  );
  const prevNumber = prevInfo.blockNumber;
  const prevTimestamp = prevInfo.timestamp * 1000; // ms
  const interval =
    (currentTimestamp - prevTimestamp) / (currentNumber - prevNumber);
  return {
    current: currentNumber,
    interval,
  };
};

// About 100 years
const MAX_EPOCH_HEIGHT = 3000000000;
const MAX_POW_BLOCK_NUMBER = 7000000000;
const MAX_POS_BLOCK_NUMBER = 110000000;

enum Type {
  epoch = 'epoch',
  pow = 'pow',
  pos = 'pos',
}

export function BlocknumberCalc() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const history = useHistory();

  const options = useMemo(
    () => [
      {
        label: t(translations.blocknumberCalc.epoch.tab),
        value: Type.epoch,
      },
      {
        label: t(translations.blocknumberCalc.pow.tab),
        value: Type.pow,
      },
      {
        label: t(translations.blocknumberCalc.pos.tab),
        value: Type.pos,
      },
    ],
    [t],
  );
  const { type: _type, value: _value } = useMemo(() => qs.parse(search), [
    search,
  ]);

  const [type, setType] = useState((_type as Type) || options[0].value);

  // for epoch
  const [epochInput, setEpochInput] = useState(
    _type === Type.epoch ? (_value as string) : '',
  );
  const [currentEpochHeight, setCurrentEpochHeight] = useState('');
  const [targetEpochDate, setTargetEpochDate] = useState<dayjs.Dayjs | null>(
    null,
  );

  // for pow
  const [powInput, setPowInput] = useState(
    _type === Type.pow ? (_value as string) : '',
  );
  const [currentPowBlockNumber, setCurrentPowBlockNumber] = useState('');
  const [targetPowDate, setTargetPowDate] = useState<dayjs.Dayjs | null>(null);

  // for pos
  const [posInput, setPosInput] = useState(
    _type === Type.pos ? (_value as string) : '',
  );
  const [currentPosBlockNumber, setCurrentPosBlockNumber] = useState('');
  const [targetPosDate, setTargetPosDate] = useState<dayjs.Dayjs | null>(null);

  const {
    current,
    target,
    input,
    max,
    setCurrent,
    setTarget,
    setInput,
    getInfo,
  } = useMemo(() => {
    switch (type) {
      case Type.epoch:
        return {
          current: currentEpochHeight,
          target: targetEpochDate,
          input: epochInput,
          max: MAX_EPOCH_HEIGHT,
          setCurrent: setCurrentEpochHeight,
          setTarget: setTargetEpochDate,
          setInput: setEpochInput,
          getInfo: getEpochInfo,
        };
      case Type.pow:
        return {
          current: currentPowBlockNumber,
          target: targetPowDate,
          input: powInput,
          max: MAX_POW_BLOCK_NUMBER,
          setCurrent: setCurrentPowBlockNumber,
          setTarget: setTargetPowDate,
          setInput: setPowInput,
          getInfo: getPowInfo,
        };
      case Type.pos:
        return {
          current: currentPosBlockNumber,
          target: targetPosDate,
          input: posInput,
          max: MAX_POS_BLOCK_NUMBER,
          setCurrent: setCurrentPosBlockNumber,
          setTarget: setTargetPosDate,
          setInput: setPosInput,
          getInfo: getPosInfo,
        };
      default:
        return null as never;
    }
  }, [
    type,
    currentEpochHeight,
    targetEpochDate,
    epochInput,
    currentPowBlockNumber,
    targetPowDate,
    powInput,
    currentPosBlockNumber,
    targetPosDate,
    posInput,
  ]);

  const remaining = useMemo(() => {
    if (!current || !input) return '--';
    if (+input > +current) {
      return +input - +current;
    }
    return '--';
  }, [input, current]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalc = useCallback(async () => {
    if (input && parseInt(input) > +current) {
      setLoading(true);
      try {
        const info = await getInfo();
        setCurrent(info.current);
        setTarget(dayjs().add((+input - info.current) * info.interval, 'ms'));
        const url = qs.stringifyUrl({
          url: window.location.pathname,
          query: {
            type,
            value: input,
          },
        });
        history.replace(url);
      } finally {
        trackEvent({
          category: ScanEvent.function.category,
          action: ScanEvent.function.action.blockCountdownCalc,
          label: input,
        });
        setLoading(false);
      }
    } else {
      setError(t(translations.blocknumberCalc.higherError));
      setTarget(null);
    }
  }, [input, current, type, getInfo, setCurrent, setTarget, history, t]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const value = e.target.value.trim();
    setInput(+value > max ? max.toString() : value);
    setError('');
  };

  useEffect(() => {
    cfx_getBlockByEpochNumber().then(data => {
      setCurrentEpochHeight(data.epochNumber);
      setCurrentPowBlockNumber(data.blockNumber);
    });
    pos_getBlockByNumber().then(data => {
      setCurrentPosBlockNumber(data.height);
    });
  }, []);

  useMount(() => {
    if (input) {
      handleCalc();
    }
  });

  return (
    <>
      <Helmet>
        <title>{t(translations.header.blocknumberCalc)}</title>
        <meta
          name="description"
          content={t(translations.metadata.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.blocknumberCalc.subtitle)}>
        {t(translations.blocknumberCalc.title)}
      </PageHeader>
      <ContentWrapper>
        <Radio
          options={options}
          value={type}
          onChange={value => {
            setError('');
            setType(value);
          }}
        />
        <StyledInputWrapper>
          <div className="calculate-input-wrapper">
            <Input
              type="number"
              step="1"
              max={max}
              value={input}
              placeholder={t(translations.blocknumberCalc.placeholder)}
              size="small"
              variant="solid"
              className="calculate-input"
              onChange={handleInputChange}
              onKeyPress={e => {
                if (loading) return;
                if (e.key === 'Enter') {
                  handleCalc();
                }
              }}
            />
            <div className="calculate-error">{error}</div>
          </div>
          <Button
            type="action"
            color="primary"
            size="small"
            className="calculate-button"
            onClick={handleCalc}
            disabled={loading}
          >
            <img src={calculateSvg} alt="" />
            <span className="calculate-button-text">
              {t(translations.blocknumberCalc.calcBtn)}
            </span>
          </Button>
        </StyledInputWrapper>
        {target && <Countdown target={target} type={type} />}
        <CardWrapper>
          <Card className="blocknumber">
            <span className="title">
              {t(translations.blocknumberCalc[type].current)}
            </span>
            <span className="number">#{current ? current : '--'}</span>
          </Card>
          <Card className="blocknumber">
            <span className="title">
              {t(translations.blocknumberCalc[type].remaining)}
            </span>
            <span className="number">#{remaining}</span>
          </Card>
        </CardWrapper>
      </ContentWrapper>
    </>
  );
}

const ContentWrapper = styled.div`
  max-width: 1040px;
  margin: 24px auto 0;
`;

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;

  ${media.s} {
    flex-direction: column;
    gap: 12px;
  }

  > div {
    flex: 1;
  }

  .blocknumber {
    padding: 32px !important;
    ${media.s} {
      padding: 12px !important;
    }

    .title {
      display: block;
      font-size: 14px;
      font-weight: 450;
      color: rgba(38, 36, 75, 0.6);
      line-height: 24px;
      margin-bottom: 6px;
    }

    .number {
      display: block;
      font-size: 20px;
      font-weight: 500;
      color: #282d30;
      line-height: 24px;
    }
  }
`;

const StyledInputWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 16px;
  border-radius: 0.2857rem;
  overflow: hidden;
  margin-bottom: 24px;
  ${media.s} {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .calculate-input-wrapper {
    flex: 1;
    > div {
      width: 100%;
    }
    .calculate-input {
      width: 100%;
      height: 2.2857rem;
      ${media.s} {
        height: 36px;
      }

      input {
        background: #fafaff;
        margin: 0;
        padding: 0 1.1429rem;
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

  .calculate-button {
    width: 172px;
    height: 2.2857rem;
    line-height: 2.2857rem;
    margin: 0;
    border: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    ${media.s} {
      min-width: 36px;
      width: 36px;
      height: 36px;
      padding: 6px;
      line-height: 36px;
    }

    & > div {
      top: 0;
    }

    img {
      width: 24px;
      height: 24px;
    }

    .calculate-button-text {
      ${media.s} {
        display: none;
      }
    }
  }

  .calculate-error {
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
