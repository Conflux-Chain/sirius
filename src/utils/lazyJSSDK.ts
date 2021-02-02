// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
(function () {
  if (window.confluxJS) return;
  import('js-conflux-sdk').then(module => {
    window.confluxJS = new module.Conflux({
      url: `${window?.location?.protocol}//${window?.location?.host}/rpcv2`, // cip-37
    });
  });
})();
