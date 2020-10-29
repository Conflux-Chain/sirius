import { media, sizes } from '../media';
import { css } from 'styled-components/macro';

describe('media', () => {
  it('should return media query in css', () => {
    const mediaQuery = css`
      ${media.s} {
        color: red;
      }
    `.join('');
    const cssVersion = css`
      @media (max-width: ${sizes.s}px) {
        color: red;
      }
    `.join('');
    expect(mediaQuery).toEqual(cssVersion);
  });
});
