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
      contractVerification: 'contract_verification',
      contractsList: 'contracts_list',
      charts: 'PoW Charts',
      posCharts: 'PoS Charts',
      crossSpaceCharts: 'Cross Space Charts',
      statistics: 'statistics',
      confluxNetwork: 'official_website',
      fluentWallet: 'portal',
      confluxBounty: 'bounty',
      addressConverter: 'address_converter',
      tools: 'tools',
      balanceChecker: 'balance_checker',
      more: 'more',
      support: 'support',
      feedback: 'feedback',
      faq: 'faq',
      broadcastTx: 'push_tx',
      blocknumberCalc: 'block_countdown',
      nftChecker: 'nft_checker',
      techIssue: 'tech_issue',
      report: 'report',
      suggestionBox: 'suggestion_box',
      developerDocuments: 'developer_documents',
      confluxStudio: 'conflux_studio',
      confluxTruffle: 'conflux_truffle',
      twitter: 'twitter',
      tme: 't.me',
      discord: 'discord',
      medium: 'medium',
      github: 'github',
      weibo: 'weibo',
      kakao: 'kakao',
      wechat: 'wechat',
      youtube: 'youtube',
      naver: 'naver',
      forum: 'forum',
      reddit: 'reddit',
      terms: 'terms',
      privacyPolicy: 'privacy_policy',
      supportCenter: 'support_center',
      stakingAndGovernance: 'staking_governance',
      fcCfx: 'fc_cfx',
      crossSpace: 'conflux_hub',
      developerAPI: 'developer_API',
      posOverview: 'posOverview',
      posAccounts: 'posAccounts',
      posCommittee: 'posCommittee',
      incomingRank: 'incomingRank',
      posBlocks: 'posBlocks',
      posTransactions: 'posTransactions',
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
      // nullAddress: 'null_address',
      zeroAddress: 'zero_address',
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
      // transfersErc20: 'transfers_erc20',
      // transfersErc721: 'transfers_erc721',
      // transfersErc1155: 'transfers_erc1155',
      transfersCrc20: 'transfers_crc20',
      transfersCrc721: 'transfers_crc721',
      transfersCrc1155: 'transfers_crc1155',
      contractViewer: 'contract_viewer',
      minedBlocks: 'mined_blocks',
      tokenTransfers: 'token_transfers',
      tokenHolders: 'token_holders',
      tokenAnalysis: 'token_analysis',
      tokenNFT: 'token_nft',
      statsTransactions: 'stats_transactions',
      statsTokens: 'stats_tokens',
      statsMiners: 'stats_miners',
      statsNetwork: 'stats_network',
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
      network: 'network',
      networkIntervalChange: 'network_interval_change',
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
      error: 'error',
      txnAction: {
        100: 'default', // event label ''
        101: 'contract_reg', // event label ''
        102: 'contract_update', // event label ''
        103: 'write_contract', // event label ''
        104: 'read_contract', // event label ''
        105: 'apply_sponsor', // event label ''
        106: 'contract_deploy', // event label ''
        107: 'swap_wcfx_to_cfx', // event label ''
        108: 'swap_cfx_to_wcfx', // event label ''
      },
      txnActionUnknown: 'unknown',
    },
  },
  // preference function
  preference: {
    category: 'preference',
    action: {
      changeLang: 'change_lang', // event label === lang
      changeNet: 'change_net', // event label === net
      changeCurrency: 'change_currency', // event label === currency
    },
  },
  // all function
  function: {
    category: 'function',
    action: {
      tokenTableSort: 'token_table_sort', // event label === tokenType_sortKey_sortOrder
      addressConvert: 'address_convert', // event label === address
      broadcastTx: 'broadcast_tx', // event label === success/failure
      blockCountdownCalc: 'block_countdown_calc', // event label === target blocknumber
      nftChecker: 'nft_checker', // event label === address
    },
  },
  token: {
    category: 'token',
    action: {
      recentlyActive: 'recently_active',
      newest: 'newest',
      oldest: 'oldest',
    },
  },
};
