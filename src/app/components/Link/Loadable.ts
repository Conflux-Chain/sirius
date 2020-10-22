/**
 *
 * Asynchronously loads the component for Description
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Link = lazyLoad(
  () => import('./index'),
  module => module.Link,
);
