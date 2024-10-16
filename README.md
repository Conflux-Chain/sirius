<h1 align="center">Conflux Scan</h1>

<p align="center">Blockchain Explorer for Conflux Network.</p>

Source code of [Conflux Scan](https://confluxscan.io)

## environment

```
node >= 18.18.2
npm >= 9.8.1
```

## install

```bash
yarn install
```

## development

```bash
# core-mainnet: REACT_APP_CORE_MAINNET=true
yarn start:core

# core-testnet: REACT_APP_CORE_TESTNET=true
yarn start:core-testnet

# core-devnet: REACT_APP_CORE_DEVNET=true
yarn start:core:devnet

```

## build

```bash
yarn build
```

After building, the config will be identified through the domain name, and if necessary, you can also specify environment variables to fix the use of a certain configuration.

### specify config

> Note: Please ensure that the deployed domain name is not matched, or disable the domain name matching logic in the `src/env/env-constants.ts`

```bash
yarn build REACT_APP_CORE_TESTNET=true
```

## config

> the config file is in `src/env/core/xxx.ts`

```ts
// src/env/core/xxx.ts
export const ENV_NETWORK_ID = 1029;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.CORE_MAINNET;
export const ENV_OPEN_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://api-stage.confluxscan${DOMAIN}`
    : `https://api.confluxscan${DOMAIN}`);
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://main.confluxrpc.com';
export const ENV_FC_ADDRESS = 'cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2';
export const ENV_FC_EXCHANGE_ADDRESS =
  'cfx:acdrd6ahf4fmdj6rgw4n9k4wdxrzfe6ex6jc7pw50m';
export const ENV_FC_EXCHANGE_INTEREST_ADDRESS =
  'cfx:acag8dru4527jb1hkmx187w0c7ymtrzkt2schxg140';
export const ENV_ENS_REGISTRY_ADDRESS =
  'cfx:acemru7fu1u8brtyn3hrtae17kbcd4pd9uwbspvnnm';
export const ENV_ENS_PUBLIC_RESOLVER_ADDRESS =
  'cfx:acasaruvgf44ss67pxzfs1exvj7k2vyt863f72n6up';
export const ENV_LOGO = logo;
```

## add chain

> Note: only support conflux network

1. You can copy the `src/env/core` folder, name it the chain you plan to add, and modify its configuration.
   ```ts
   // src/env/demo/mainnet.ts
   export const ENV_NETWORK_ID = 11111111;
   export const ENV_NETWORK_TYPE = NETWORK_TYPES.DEMO_MAINNET;
   export const ENV_OPEN_API_HOST =
     API_HOST_MAP.openAPIHost ||
     (IS_STAGE
       ? `https://api-stage.demoscan${DOMAIN}`
       : `https://api.demoscan${DOMAIN}`);
   export const ENV_RPC_SERVER =
     API_HOST_MAP.rpcHost || 'https://main.demorpc.com';
   export const ENV_FC_ADDRESS =
     'demo:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2';
   export const ENV_FC_EXCHANGE_ADDRESS =
     'demo:acdrd6ahf4fmdj6rgw4n9k4wdxrzfe6ex6jc7pw50m';
   export const ENV_FC_EXCHANGE_INTEREST_ADDRESS =
     'demo:acag8dru4527jb1hkmx187w0c7ymtrzkt2schxg140';
   export const ENV_ENS_REGISTRY_ADDRESS =
     'demo:acemru7fu1u8brtyn3hrtae17kbcd4pd9uwbspvnnm';
   export const ENV_ENS_PUBLIC_RESOLVER_ADDRESS =
     'demo:acasaruvgf44ss67pxzfs1exvj7k2vyt863f72n6up';
   export const ENV_LOGO = logo;
   ```
2. add environment variables in package.json's scripts for development
   ```json
   "scripts": {
     "start:demo": "NODE_OPTIONS=--openssl-legacy-provider REACT_APP_DEMO_MAINNET=true react-app-rewired start",
   },
   ```
3. use environment variables in the `src/env/env-constants.ts` file
   ```ts
   export const IS_DEMO_MAINNET =
     process.env.REACT_APP_DEMO_MAINNET === 'true' ||
     /^((www[.-])|(demoscan[.]))/.test(window.location.hostname);
   ```
4. use the chain config in the `src/env/index.ts` file
   ```ts
   const ENV_CONFIG = (() => {
     if (IS_DEMO_MAINNET) {
       return DEMO_MAINNET_CONFIG;
     } else if (IS_DEMO_TESTNET) {
       return DEMO_TESTNET_CONFIG;
     } else if (IS_DEMO_DEVNET) {
       return DEMO_DEVNET_CONFIG;
     }
     // ...
     return DEFAULT_NETWORK_CONFIG;
   })();
   ```
5. set network option in `src/utils/constants.ts`
   ```ts
   export const NETWORK_OPTIONS = lodash.compact([
     // demo
     {
       name: 'Demo Mainnet',
       id: 11111111,
       url: `//demoscan${DOMAIN}`,
     },
     {
       name: 'Demo Testnet',
       id: 11111112,
       url: IS_STAGE
         ? '//testnet-stage.demoscan.net'
         : `//testnet.demoscan${DOMAIN}`,
     },
     IS_DEVNET && {
       name: 'Demo Devnet',
       id: 11111113,
       url: `//devnet.demoscan${DOMAIN}`,
     },
   ]);
   ```
6. setup proxy in `src/setupProxy.js` for development
   ```ts
   const configs = {
     demo_mainnet_url: 'https://demoscan.net/',
     demo_testnet_url: 'https://testnet-stage.demoscan.io/',
     demo_devnet_url: 'https://devnet.demoscan.net/',
   };
   let url = configs.demo_mainnet_url;
   if (process.env.REACT_APP_DEMO_TESTNET === 'true') {
     url = configs.demo_testnet_url;
   } else if (process.env.REACT_APP_DEMO_DEVNET === 'true') {
     url = configs.demo_devnet_url;
   }
   ```
7. start development
   ```bash
   yarn start:demo
   ```

## Run with Docker

Open and modify the `docker-compose.yml` file and run `docker-compose up -d --build`

Modify the values of the following parameters as needed.

```yml
args:
  - NETWORK_ID=1029
  - NETWORK_NAME=Conflux Core (Hydra)
  # Required
  - SCAN_BACKEND_API=https://confluxscan.io
  # Required
  - OPEN_API_HOST=https://api.confluxscan.io
  # Required
  - RPC_SERVER=https://main.confluxrpc.com
  # CORE_MAINNET CORE_TESTNET or CORE_DEVNET
  - NETWORK_TYPE=CORE_MAINNET
  # Not necessary only if you need the FC feature
  - FC_ADDRESS=cfx:achc8nxj7r451c223m18w2dwjnmhkd6rxawrvkvsy2
  # Not necessary only if you need the FC feature
  - FC_EXCHANGE_INTEREST_ADDRESS=cfx:acag8dru4527jb1hkmx187w0c7ymtrzkt2schxg140
  # Not necessary only if you need the FC feature
  - FC_EXCHANGE_ADDRESS=cfx:acdrd6ahf4fmdj6rgw4n9k4wdxrzfe6ex6jc7pw50m
  # Not necessary only if you need the ENS feature
  - ENS_REGISTRY_ADDRESS=cfx:acemru7fu1u8brtyn3hrtae17kbcd4pd9uwbspvnnm
  # Not necessary only if you need the ENS feature
  - ENS_PUBLIC_RESOLVER_ADDRESS=cfx:acasaruvgf44ss67pxzfs1exvj7k2vyt863f72n6up
  # The logo url
  - LOGO=
```

## What can I do?

Conflux Scan is still in its early stages compared to [Etherscan](https://etherscan.io). So
there's a lot features and improvements waiting there. You can find bugs,
request new features, send PRs to improve the code and docs. Don't forget to
check out the [Conflux Bounty](https://bounty.confluxnetwork.org) to earn reward
while improving scan.

## Contributing

Please make sure to read the [Contributing Guide](.github/CONTRIBUTING.md) before making a pull request.

## License

[MIT](http://opensource.org/licenses/MIT)
