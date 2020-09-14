/*
 * Media queries utility
 */

import { createBreakpoint } from 'react-use';

/*
 * Taken from https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32914
 */

// Update your breakpoints if you want
export const sizes = {
  s: 600,
  m: 1024,
  l: 1440,
  xl: 1920,
};

export const useBreakpoint = createBreakpoint({
  s: sizes.s,
  m: sizes.m,
  l: sizes.l,
  xl: sizes.xl,
});

const customMediaQuery = (size: keyof typeof sizes) =>
  `@media (max-width:${sizes[size]}px)`;

export const media = {
  s: customMediaQuery('s'),
  m: customMediaQuery('m'),
  l: customMediaQuery('l'),
  xl: customMediaQuery('xl'),
};

/* Example
const SomeDiv = styled.div`
  display: flex;
  ....
  ${media.m} {
    display: block
  }
`;
*/
