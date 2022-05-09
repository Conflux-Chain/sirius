import React from 'react';
import { Link } from 'app/components/Link/Loadable';
import { Space } from '@cfxjs/antd';

export function NewChart() {
  return (
    <Space size="large" direction="vertical">
      <Link href="/new-charts/blocktime">Block Time Chart</Link>
      <Link href="/new-charts/hashrate">Hash Rate Chart</Link>
      <Link href="/new-charts/difficulty">Difficulty Chart</Link>
      <Link href="/stat/supply">Total Supply</Link>
    </Space>
  );
}
