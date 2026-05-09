import React from 'react';

interface KeywordListProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  pendingAdditions: string[];
}

const KeywordList: React.FC<KeywordListProps> = ({
  matchedKeywords,
  missingKeywords,
  onAddKeyword,
  onRemoveKeyword,
  pendingAdditions,
}) => (
  <div>
    <div>
      <h4>Matched Keywords</h4>
      <ul>
        {matchedKeywords.map(kw => (
          <li key={kw}>
            {kw}
            {pendingAdditions.includes(kw) ? (
              <button onClick={() => onRemoveKeyword(kw)}>Remove</button>
            ) : (
              <button onClick={() => onAddKeyword(kw)}>Add</button>
            )}
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h4>Missing Keywords</h4>
      <ul>
        {missingKeywords.map(kw => (
          <li key={kw}>
            {kw}
            {pendingAdditions.includes(kw) ? (
              <button onClick={() => onRemoveKeyword(kw)}>Remove</button>
            ) : (
              <button onClick={() => onAddKeyword(kw)}>Add</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default KeywordList;
