import { lazyLoad } from 'utils/loadable';

const SponsorStorage = lazyLoad(
  () => import('./index'),
  module => module.default,
);

export default SponsorStorage;
