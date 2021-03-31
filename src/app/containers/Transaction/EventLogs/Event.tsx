import React from 'react';
import styled from 'styled-components/macro';

export const Event = ({ fnName, args }) => {
  return (
    <StyledEventWrapper>
      <span className="fn-name">{fnName}</span>
      <span className="parenthesis">(</span>
      {args.map((a, index) => {
        let topic_index = a.indexed ? (
          <span className="topic-index">{`index_topic_${a.indexed} `}</span>
        ) : null;
        let type = <span className="type">{a.type} </span>;
        let arg = <span className="arg-name">{a.argName}</span>;
        let comma =
          index !== args.length - 1 ? <span className="comma">, </span> : null;
        return (
          <span key={index}>
            {topic_index}
            {type}
            {arg}
            {comma}
          </span>
        );
      })}
      <span className="parenthesis">)</span>
    </StyledEventWrapper>
  );
};

const StyledEventWrapper = styled.div`
  .parenthesis {
    margin: 0.3571rem;
  }

  .topic-index,
  .type,
  .comma {
    margin-right: 0.3571rem;
  }

  .arg-name {
    color: #cc3c20;
  }

  .type {
    color: #7cd77b;
  }
`;
