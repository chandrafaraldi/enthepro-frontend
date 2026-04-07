import React from 'react';
import { Link } from 'react-router-dom';

export const HighlightHashtags = ({ text }) => {
  if (!text) return null;
  
  const tokens = text.split(/(\s+)/);
  return (
    <>
      {tokens.map((token, index) => {
        if (token.startsWith('#')) {
          const tag = token.substring(1);
          return (
            <Link key={index} to={`/hashtag/${tag}`} className="hashtag">
              {token}
            </Link>
          );
        }
        return token;
      })}
    </>
  );
};
