require('react-app-polyfill/stable');

// CRA assumes core-js 3.0 and removes newer bare polyfill imports. Keep these
// explicit calls with `void` so query-string 10 also works in older browsers.
void require('core-js/actual/array/to-sorted');
void require('core-js/actual/string/replace-all');
