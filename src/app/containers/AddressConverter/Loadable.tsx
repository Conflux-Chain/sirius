/**
 * Asynchronously loads the component for AddressConverter
 */

import { lazyLoad } from 'utils/loadable';

export const AddressConverter = lazyLoad(
  () => import('./index'),
  module => module.AddressConverter,
);
