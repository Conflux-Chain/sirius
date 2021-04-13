/**
 *
 * Asynchronously loads the component for EventLogs
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventLogs = lazyLoad(
  () => import('./index'),
  module => module.EventLogs,
);
