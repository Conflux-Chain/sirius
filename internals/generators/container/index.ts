/**
 * Component Generator
 */

import { Actions, PlopGenerator } from 'node-plop';
import path from 'path';

import { containerExists } from '../utils';

export enum ContainerProptNames {
  'ComponentName' = 'ComponentName',
  'wantMemo' = 'wantMemo',
  'wantHeaders' = 'wantHeaders',
  'wantStyledComponents' = 'wantStyledComponents',
  'wantTranslations' = 'wantTranslations',
  'wantLoadable' = 'wantLoadable',
  'wantTests' = 'wantTests',
}

const containersPath = path.join(__dirname, '../../../src/app/containers');

export const containerGenerator: PlopGenerator = {
  description: 'Add a container component',
  prompts: [
    {
      type: 'input',
      name: ContainerProptNames.ComponentName,
      message: 'What should it be called?',
      default: 'Form',
      validate: value => {
        if (/.+/.test(value)) {
          return containerExists(value)
            ? 'A container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: ContainerProptNames.wantMemo,
      default: false,
      message: 'Do you want to wrap your component in React.memo?',
    },
    {
      type: 'confirm',
      name: ContainerProptNames.wantHeaders,
      default: false,
      message: 'Do you want headers?',
    },
    {
      type: 'confirm',
      name: ContainerProptNames.wantStyledComponents,
      default: true,
      message: 'Do you want to use styled-components?',
    },
    {
      type: 'confirm',
      name: ContainerProptNames.wantTranslations,
      default: false,
      message:
        'Do you want i18n translations (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: ContainerProptNames.wantLoadable,
      default: false,
      message: 'Do you want to load the component asynchronously?',
    },
    {
      type: 'confirm',
      name: ContainerProptNames.wantTests,
      default: false,
      message: 'Do you want to have tests?',
    },
  ],
  actions: (data: { [P in ContainerProptNames]: string }) => {
    const containerPath = `${containersPath}/{{properCase ${ContainerProptNames.ComponentName}}}`;

    const actions: Actions = [
      {
        type: 'add',
        path: `${containerPath}/index.tsx`,
        templateFile: './container/index.tsx.hbs',
        abortOnFail: true,
      },
    ];

    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: `${containerPath}/Loadable.ts`,
        templateFile: './container/loadable.ts.hbs',
        abortOnFail: true,
      });
    }

    if (data.wantTests) {
      actions.push({
        type: 'add',
        path: `${containerPath}/__tests__/index.test.tsx`,
        templateFile: './container/index.test.tsx.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'prettify',
      data: { path: `${containersPath}/${data.ComponentName}/**` },
    });

    return actions;
  },
};
