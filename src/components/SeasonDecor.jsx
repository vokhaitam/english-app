import React from 'react';
import { useApp } from '../context/AppContext';
import MapleLeaf from './MapleLeaf';

const DECOR = {
  spring: [['🌷', '🌸'], ['🦋', '🌸'], ['🌱', '🌸'], ['🌸', '🦋']],
  summer: [['🌻', '☀️'], ['🌊', '🐚'], ['🍉', '🌴'], ['⛱️', '🌊']],
  autumn: [['leaf', '🍄'], ['🌰', 'leaf'], ['🎃', 'leaf'], ['leaf', '🌰']],
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
              {emoji === 'leaf' ? <MapleLeaf size={24} className="season-decor-leaf" /> : emoji}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
