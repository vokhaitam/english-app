import React from 'react';
import { useApp } from '../context/AppContext';

const DECOR = {
  spring: [['🌷', '🌸'], ['🦋', '🌸'], ['🌱', '🌸'], ['🌸', '🦋']],
  summer: [['🌻', '☀️'], ['🌊', '🐚'], ['🍉', '🌴'], ['⛱️', '🌊']],
  autumn: [['🍁', '🍄'], ['🌰', '🍁'], ['🎃', '🍁'], ['🍁', '🌰']],
  winter: [['⛄', '❄️'], ['🎄', '❄️'], ['🧣', '⛄'], ['❄️', '🎁']],
};

const CORNERS = ['tl', 'tr', 'bl', 'br'];

export default function SeasonDecor() {
  const { currentSeason } = useApp();
  const corners = DECOR[currentSeason] || DECOR.spring;

  return (
    <div className="season-decor" data-season={currentSeason} aria-hidden="true">
      {CORNERS.map((corner, i) => (
        <div key={corner} className={`season-decor-corner season-decor-${corner}`}>
          {corners[i].map((emoji, j) => (
            <span
              key={j}
              className="season-decor-emoji"
              style={{ animationDelay: `${(i + j) * 0.4}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
