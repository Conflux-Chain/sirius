export const ScanEvent = {
  // menu click
  menu: {
    category: 'menu',
    action: {
      home: 'home',
      bnt: 'bnt',
      accounts: 'accounts',
      tokens20: 'tokens_erc20',
      tokens721: 'tokens_erc721',
      tokens1155: 'tokens_erc1155',
      contractReg: 'contract_reg',
      sponsor: 'sponsor',
      contractsList: 'contracts_list',
      charts: 'charts',
      statistics: 'statistics',
      confluxNetwork: 'official_website',
      confluxPortal: 'portal',
      confluxBounty: 'bounty',
      addressConverter: 'address_converter',
      broadcastTx: 'push_tx',
      blocknumberCalc: 'block_countdown',
      twitter: 'twitter',
      github: 'github',
      medium: 'medium',
    },
  },
  // global search
  // event label === search keyword
  search: {
    category: 'search',
    action: {
      account: 'account',
      contract: 'contract',
      innerContract: 'inner_contract',
      epoch: 'epoch',
      block: 'block',
      transaction: 'transaction',
      nullAddress: 'null_address',
      invalid: 'invalid',
    },
  },
  // stats function
  // interval_change event label === interval value
  stats: {
    category: 'stats',
    action: {
      blockTimeIntervalChange: 'blockTime_interval_change',
      tpsIntervalChange: 'tps_interval_change',
      difficultyIntervalChange: 'difficulty_interval_change',
      hashRateIntervalChange: 'hashRate_interval_change',
      transactions: 'transactions',
      transactionsIntervalChange: 'transactions_interval_change',
      tokens: 'tokens',
      tokensIntervalChange: 'tokens_interval_change',
      miners: 'miners',
      minersIntervalChange: 'miners_interval_change',
    },
  },
  // preference function
  preference: {
    category: 'preference',
    action: {
      changeLang: 'change_lang', // event label === lang
      changeNet: 'change_net', // event label === net
    },
  },
};
