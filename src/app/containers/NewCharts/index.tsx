// export { BlockTime } from './BlockTime';
import React from 'react';
import { Link } from 'app/components/Link/Loadable';
import { Space } from '@cfxjs/antd';

export function NewChart() {
  return (
    <Space size="large" direction="vertical">
      <Link href="/new-chart/blocktime">Block Time Chart</Link>
      <Link href="/new-chart/hashrate">Hash Rate Chart</Link>
      <Link href="/new-chart/difficulty">Difficulty Chart</Link>
    </Space>
  );
}
