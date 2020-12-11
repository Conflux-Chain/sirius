/* -*- mode: typescript -*- */
import React from 'react';
interface Props {
  color?: string;
}

export const DeleteIcon: React.FC<Props> = props => {
  const { color = '#0054FE' } = props;
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        id="Web"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g
          transform="translate(-396.000000, -249.000000)"
          stroke={color}
          strokeWidth="1.5"
        >
          <g id="Clear" transform="translate(396.000000, 249.000000)">
            <circle cx="8" cy="8" r="7"></circle>
            <line x1="10.1" y1="5.9" x2="5.9" y2="10.1"></line>
            <line x1="5.9" y1="5.9" x2="10.1" y2="10.1"></line>
          </g>
        </g>
      </g>
    </svg>
  );
};
