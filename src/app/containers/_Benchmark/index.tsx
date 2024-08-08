import Benchmark, { BenchmarkType } from 'react-component-benchmark';
import React, { useState } from 'react';
import { Button } from '@cfxjs/react-ui';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';

export default function ScanBenchmark() {
  const ref: any = React.useRef();
  const [result, setResult] = useState<any>({});

  const handleComplete = React.useCallback(results => {
    setResult(results);
  }, []);

  const handleStart = () => {
    ref.current.start();
  };

  return (
    <div style={{ padding: 40 }}>
      <Button onClick={handleStart}>Run Test</Button>
      <div>
        <p>startTime: {result.startTime}</p>
        <p>endTime: {result.endTime}</p>
        <p>
          runTime: <strong>{result.runTime}</strong>
        </p>
        <p>renderCount: {result.sampleCount}</p>
        <hr />
        <p>
          <strong>ComputedResult:</strong>
        </p>
        <p>min: {result.min}</p>
        <p>max: {result.max}</p>
        <p>median: {result.median}</p>
        <p>mean: {result.mean}</p>
      </div>
      <Benchmark
        component={CoreAddressContainer}
        componentProps={{
          value: '0x8f3f525d17159351e4b34fe766ef139470da0b02',
          alias: '',
        }}
        onComplete={handleComplete}
        ref={ref}
        samples={30}
        timeout={10000}
        type={BenchmarkType.MOUNT}
      />
    </div>
  );
}
