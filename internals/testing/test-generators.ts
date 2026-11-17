import chalk from 'chalk';
import fs from 'fs';
import rimraf from 'rimraf';
import shell from 'shelljs';
import path from 'path';
import nodePlop from 'node-plop';

import { BACKUPFILE_EXTENSION } from '../generators/plopfile';
import type { PlopGenerator } from 'node-plop';

process.chdir(path.join(__dirname, '../generators'));

let componentGen: PlopGenerator;
let containerGen: PlopGenerator;

const NAMESPACE = 'RbGenerated';

const componentsPath = path.join(process.cwd(), '../../src/app/components');
const containersPath = path.join(process.cwd(), '../../src/app/containers');

function runLinting() {
  return new Promise<void>((resolve, reject) => {
    shell.exec(
      `npm run lint`,
      {
        silent: false, // so that we can see the errors in the console
      },
      code => (code ? reject(new Error(`Linting failed!`)) : resolve()),
    );
  });
}

function checkTypescript() {
  return new Promise<void>((resolve, reject) => {
    shell.exec(
      `npm run checkTs`,
      {
        silent: false, // so that we can see the errors in the console
      },
      code => (code ? reject(new Error(`Typescript failed!`)) : resolve()),
    );
  });
}

function removeComponent(name: string) {
  return rimraf.sync(path.join(componentsPath, name));
}

function removeContainer(name: string) {
  return rimraf.sync(path.join(containersPath, name));
}

async function handleResult({
  changes,
  failures,
}: {
  changes: unknown[];
  failures: unknown[];
}) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(failures) && failures.length > 0) {
      reject(new Error(JSON.stringify(failures, null, 2)));
    }
    resolve(changes);
  });
}
function feedbackToUser(info) {
  return (result?: any) => {
    console.info(chalk.blue(info));
    return result;
  };
}

function reportSuccess(message: string) {
  return result => {
    console.log(chalk.green(` ✓ ${message}`));
    return result;
  };
}

function reportErrors(reason: Error, shouldExist = true) {
  console.error(chalk.red(` ✘ ${reason}`));
  if (shouldExist) {
    process.exit(1);
  }
}
function restoreBackupFile(
  path: string,
  backupFileExtension = BACKUPFILE_EXTENSION,
) {
  const backupPath = path.concat(`.${backupFileExtension}`);
  fs.copyFileSync(backupPath, path);
  fs.unlinkSync(backupPath);
}

function backupFile(path: string, backupFileExtension = BACKUPFILE_EXTENSION) {
  const targetFile = path.concat(`.${backupFileExtension}`);
  fs.copyFileSync(path, targetFile);
  return targetFile;
}

async function generateComponent() {
  const componentNameBase = `${NAMESPACE}Component`;

  const allCombinations = permuatateBooleans(5);
  const promises: Promise<string>[] = [];
  for (let i = 0; i < allCombinations.length; i++) {
    const values = allCombinations[i];
    const name = `${componentNameBase}${i}`;
    const p = componentGen
      .runActions({
        ComponentName: name,
        wantMemo: values[0],
        wantStyledComponents: values[1],
        wantLoadable: values[2],
        wantTranslations: values[3],
        wantTests: values[4],
      })
      .then(handleResult)
      .then(feedbackToUser(`Generated '${name}'`))
      .then(_ => name);
    promises.push(p);
  }
  const components = await Promise.all(promises);

  // return a cleanup function
  const cleanup = () => {
    for (const component of components) {
      removeComponent(component);
      feedbackToUser(`Cleaned '${component}'`)();
    }
  };
  return [cleanup];
}

async function generateContainer() {
  const containerNameBase = `${NAMESPACE}Container`;

  const allCombinations = permuatateBooleans(5);
  const containerNames: string[] = [];
  for (let i = 0; i < allCombinations.length; i++) {
    const values = allCombinations[i];
    const name = `${containerNameBase}${i}`;
    await containerGen
      .runActions({
        ComponentName: name,
        wantMemo: true,
        wantHeaders: values[0],
        wantStyledComponents: true,
        wantLoadable: true,
        wantTranslations: values[3],
        wantTests: values[4],
      })
      .then(handleResult)
      .then(feedbackToUser(`Generated '${name}'`))
      .then(_ => name);
    containerNames.push(name);
  }

  // return a cleanup function
  const cleanup = () => {
    for (const container of containerNames) {
      removeContainer(container);
      feedbackToUser(`Cleaned '${container}'`)();
    }
  };
  return [cleanup];
}

/**
 * Run
 */
(async function () {
  const plop = await nodePlop(path.resolve('plopfile.ts'));
  componentGen = plop.getGenerator('component') as PlopGenerator;
  containerGen = plop.getGenerator('container') as PlopGenerator;
  const componentCleanup = await generateComponent().catch(reason => {
    reportErrors(reason);
    return [];
  });
  const containerCleanup = await generateContainer().catch(reason => {
    reportErrors(reason);
    return [];
  });
  // Run lint when all the components are generated to see if they have any linting erros
  const lintingResult = await runLinting()
    .then(reportSuccess(`Linting test passed`))
    .catch(reason => {
      reportErrors(reason, false);
      return false;
    });

  const tsResult = await checkTypescript()
    .then(reportSuccess(`Typescript test passed`))
    .catch(reason => {
      reportErrors(reason, false);
      return false;
    });

  const cleanups = [...componentCleanup, ...containerCleanup];
  // Everything is done, so run the cleanups synchronously
  for (const cleanup of cleanups) {
    if (typeof cleanup === 'function') {
      cleanup();
    }
  }

  if ((lintingResult && tsResult) === false) {
    process.exit(1);
  }
})();

function permuatateBooleans(length: number) {
  const array: boolean[][] = [];
  for (let i = 0; i < 1 << length; i++) {
    const items: boolean[] = [];
    for (let j = length - 1; j > 0; j--) {
      items.push(!!(i & (1 << j)));
    }
    array.push([...items, !!(i & 1)]);
  }
  return array;
}
