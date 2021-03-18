export const ScanEvent = {
  // menu click
  menu: {
    category: 'menu',
    action: {
      home: 'home',
      bnt: 'bnt',
      blocks: 'blocks',
      transactions: 'transactions',
      cfxTransfers: 'cfx_transfers',
      accounts: 'accounts',
      tokens20: 'tokens_erc20',
      tokens721: 'tokens_erc721',
      tokens1155: 'tokens_erc1155',
      contractReg: 'contract_reg',
      sponsor: 'sponsor',
      contractDeployment: 'contract_deployment',
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
  // tabPanel change
  tab: {
    category: 'tab',
    action: {
      latestBlocks: 'latest_blocks',
      latestTransactions: 'latest_transactions',
      allBlocks: 'all_blocks',
      allTransactions: 'all_transactions',
      blockTransactions: 'block_transactions',
      referenceBlocks: 'reference_blocks',
      transactionCfxTransfers: 'transaction_cfx_transfers',
      cfxTransfers: 'cfx_transfers',
      accountTransactions: 'account_transactions',
      transfersErc20: 'transfers_erc20',
      transfersErc721: 'transfers_erc721',
      transfersErc1155: 'transfers_erc1155',
      contractViewer: 'contract_viewer',
      minedBlocks: 'mined_blocks',
      tokenTransfers: 'token_transfers',
      tokenHolders: 'token_holders',
      statsTransactions: 'stats_transactions',
      statsTokens: 'stats_tokens',
      statsMiners: 'stats_miners',
      contractSourceCode: 'contract_source_code',
      contractAbi: 'contract_abi',
      contractRead: 'contract_read',
      contractWrite: 'contract_write',
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
  // confi wallet
  // TODO add more track
  wallet: {
    category: 'wallet',
    action: {
      connect: 'connect',
      disconnect: 'disconnect',
      versionNotMatch: 'version_not_match',
      readContract: 'read_contract',
      writeContract: 'write_contract',
      regContract: 'reg_contract',
      updateContract: 'update_contract',
      applySponsor: 'apply_sponsor',
      error: 'error',
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
  // all function
  function: {
    category: 'function',
    action: {
      tokenTableSort: 'token_table_sort', // event label === tokenType_sortKey_sortOrder
    },
  },
};
