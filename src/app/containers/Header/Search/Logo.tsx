/* -*- mode: typescript -*- */
/**
 * @fileOverview
 * @name Logo.tsx
 * @author yqrashawn <namy.19@gmail.com>
 */
import React from 'react';
interface Props {
  color?: string;
}

export const Logo: React.FC<Props> = props => {
  const { color = '#0054FE' } = props;
  return (
    <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1">
      <g id="Web" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-1208.000000, -28.000000)">
          <g transform="translate(884.000000, 20.000000)">
            <g transform="translate(324.000000, 8.000000)">
              <rect x="0" y="0" width="16" height="16"></rect>
              <path
                d="M7,13 C10.3137085,13 13,10.3137085 13,7 C13,3.6862915 10.3137085,1 7,1 C3.6862915,1 1,3.6862915 1,7 C1,10.3137085 3.6862915,13 7,13 Z M15,15 L12,12"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
