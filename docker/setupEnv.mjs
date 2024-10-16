import fs from 'fs/promises';
import path from 'path';

//src/env/index.ts
async function writeEnvToEnvFile() {
  const envs = Object.entries(process.env)
    .filter(([key]) => key.startsWith('REACT_APP_'))
    .reduce((acc, [key, value]) => {
      acc[key.replace('REACT_APP', 'ENV')] = value;
      return acc;
    }, {});

  const envFilePath = path.join(path.resolve(), 'src/env/index.ts');
  const envFile = await fs.readFile(envFilePath, {
    encoding: 'utf8',
  });

  await fs.writeFile(
    envFilePath,
    `${envFile.toString().replace(
      'const ENV_CONFIG = _ENV_CONFIG',
      `
       \n\n
      const docker_envs = ${JSON.stringify(
        envs,
        (key, value) => {
          if (key === 'ENV_NETWORK_ID') {
            return Number(value);
          }
          return value;
        },
        2,
      )}
      const ENV_CONFIG = docker_envs as any
        `,
    )}
   
    `,
    {
      encoding: 'utf8',
    },
  );
}

//src/utils/constants.ts
async function writeConfigToConstants() {
  const contentFilePath = path.join(path.resolve(), 'src/utils/constants.ts');

  const contentFile = await fs.readFile(contentFilePath, {
    encoding: 'utf8',
  });

  await fs.writeFile(
    contentFilePath,
    `
    ${contentFile.toString().replace(
      'export const NETWORK_OPTIONS = _NETWORK_OPTIONS',
      `
      \n\n
      const docker_config = ${JSON.stringify(
        [
          {
            name: process.env.REACT_APP_NETWORK_NAME,
            id: Number(process.env.REACT_APP_NETWORK_ID),
            url: '/',
          },
        ],
        null,
        2,
      )}
      export const NETWORK_OPTIONS = docker_config`,
    )}
    `,
    {
      encoding: 'utf8',
    },
  );
}

async function writeNginxConfig() {
  const nginxConfigPath = path.join(path.resolve(), './docker/nginx.conf');

  const nginxFile = await fs.readFile(nginxConfigPath, {
    encoding: 'utf8',
  });

  await fs.writeFile(
    nginxConfigPath,
    `
    ${nginxFile.toString().replace(
      '# PLACEHOLDER',
      `
      location /v1/ {
          proxy_pass ${process.env.REACT_APP_SCAN_BACKEND_API}/v1/;
      }
      location /stat/ {
          proxy_pass ${process.env.REACT_APP_SCAN_BACKEND_API}/stat/;
      }
      
      location /rpc/ {
          proxy_pass ${process.env.REACT_APP_SCAN_BACKEND_API}/rpc/;
      }
      
      location /rpcv2/ {
          proxy_pass ${process.env.REACT_APP_SCAN_BACKEND_API}/rpcv2/;
      }
      
      `,
    )}
    `,
    {
      encoding: 'utf8',
    },
  );
}

async function main() {
  await writeEnvToEnvFile();
  await writeConfigToConstants();
  await writeNginxConfig();
}

await main();
