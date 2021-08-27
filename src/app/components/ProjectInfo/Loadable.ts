/**
 *
 * Asynchronously loads the component for NFTPreview
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProjectInfo = lazyLoad(
  () => import('./index'),
  module => module.ProjectInfo,
);
