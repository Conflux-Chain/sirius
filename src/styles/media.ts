/*
 * Media queries utility
 */

import createBreakpoint from './createBreakpoint';

/*
 * Taken from https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32914
 */

// Update your breakpoints if you want
export const sizes = {
  s: 600,
  m: 1024,
  l: 1280,
  xl: 1440,
  xxl: 1920,
};

export const useBreakpoint = createBreakpoint({
  s: sizes.s,
  m: sizes.m,
  l: sizes.l,
  xl: sizes.xl,
  xxl: sizes.xxl,
});

/* Example
   const Demo = () => {
    const breakpoint = useBreakpoint();

    if (breakpoint === "xl") return <div>xl</div>;
    else if (breakpoint == "l") return <div>l</div>;
    else if (breakpoint == "m") return <div>m</div>;
    else return <div>s</div>;
   };
  */

const customMediaQuery = (size: keyof typeof sizes) =>
  `@media (max-width:${sizes[size]}px)`;

export const media = {
  s: customMediaQuery('s'),
  m: customMediaQuery('m'),
  l: customMediaQuery('l'),
  xl: customMediaQuery('xl'),
  xxl: customMediaQuery('xxl'),
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
