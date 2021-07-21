import { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';

const createBreakpoint = (
  breakpoints: { [name: string]: number } = {
    laptopL: 1440,
    laptop: 1024,
    tablet: 768,
  },
) => () => {
  const [screen, setScreen] = useState(window.innerWidth);

  useEffect(() => {
    const setSideScreen = _.debounce((): void => {
      setScreen(window.innerWidth);
    }, 1000);
    window.addEventListener('resize', setSideScreen);
    return () => {
      window.removeEventListener('resize', setSideScreen);
    };
  }, []);
  const sortedBreakpoints = useMemo(
    () => Object.entries(breakpoints).sort((a, b) => (a[1] <= b[1] ? 1 : -1)),
    [],
  );
  const result = useMemo(
    () =>
      sortedBreakpoints.reduce((acc, [name, width]) => {
        if (screen <= width) {
          return name;
        } else {
          return acc;
        }
      }, sortedBreakpoints[0][0]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screen],
  );
  return result;
};

export default createBreakpoint;
