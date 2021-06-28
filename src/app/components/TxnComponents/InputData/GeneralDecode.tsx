import React from 'react';
import { Wrapper } from './Common';
import _ from 'lodash';

export const GeneralDecode = ({
  data = '',
  decodedData = {},
}: {
  data: string;
  decodedData: any;
}) => {
  const { fullName } = decodedData;
  const originalDataSlice = _.words(data.slice(10), /.{64}/g);

  return (
    <Wrapper isMonospace={true}>
      {fullName ? (
        <>
          <div className="general-decode-fullname">Function: {fullName}</div>
          <br />
        </>
      ) : (
        ''
      )}
      <div className="general-decode-signature">
        MethodID: {data.slice(0, 10)}
      </div>
      <div className="general-decode-signature">
        {originalDataSlice.map((o, index) => {
          return (
            <div key={index}>
              <span
                style={{
                  display: 'inline-block',
                  width: `${
                    35 +
                    ((originalDataSlice.length - 1).toString().length - 1) * 10
                  }px`,
                }}
              >{`[${index}]: `}</span>
              {o}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};
