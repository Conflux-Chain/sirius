import { lazyLoad } from 'utils/loadable';

const Card = lazyLoad(
  () => import('./index'),
  module => module.default,
);

export default Card;
