import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import MapleLeaf from './MapleLeaf';

const DEFAULT_CONF = { emojis: ['✨'], count: 12, minSize: 10, maxSize: 18, minDur: 14, maxDur: 24, drift: 40, spin: 180, minOpacity: 0.3, maxOpacity: 0.6 };

const CONFIG = {
  spring: { emojis: ['🌸'], count: 16, minSize: 12, maxSize: 22, minDur: 11, maxDur: 20, drift: 90, spin: 360, minOpacity: 0.45, maxOpacity: 0.85 },
  summer: { emojis: ['✨'], count: 12, minSize: 10, maxSize: 18, minDur: 14, maxDur: 24, drift: 40, spin: 180, minOpacity: 0.3, maxOpacity: 0.6 },
  autumn: { leaf: true, count: 20, minSize: 14, maxSize: 26, minDur: 10, maxDur: 18, drift: 110, spin: 300, minOpacity: 0.5, maxOpacity: 0.9 },
  winter: { emojis: ['❄️'], count: 24, minSize: 10, maxSize: 20, minDur: 9, maxDur: 16, drift: 30, spin: 200, minOpacity: 0.45, maxOpacity: 0.85 },
};

function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function randGen(seed) {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function SeasonEffect() {
  const { currentSeason } = useApp();
  const conf = CONFIG[currentSeason] || DEFAULT_CONF;

  const particles = useMemo(() => {
    const safeConf = conf || DEFAULT_CONF;
    const rnd = randGen(seedFrom(currentSeason || 'spring'));
    const isLeaf = !!safeConf.leaf;
    const emojis = Array.isArray(safeConf.emojis) ? safeConf.emojis : [];
    const count = safeConf.count || 0;
    return Array.from({ length: count }, (_, i) => {
      const dur = (safeConf.minDur || 10) + rnd() * ((safeConf.maxDur || 20) - (safeConf.minDur || 10));
      return {
        id: i,
        left: rnd() * 100,
        size: (safeConf.minSize || 10) + rnd() * ((safeConf.maxSize || 18) - (safeConf.minSize || 10)),
        duration: dur,
        delay: -rnd() * dur,
        drift: (rnd() * 2 - 1) * (safeConf.drift || 0),
        spin: (rnd() * 2 - 1) * (safeConf.spin || 0),
        opacity: (safeConf.minOpacity || 0.3) + rnd() * ((safeConf.maxOpacity || 0.6) - (safeConf.minOpacity || 0.3)),
        leaf: isLeaf,
        emoji: isLeaf || emojis.length === 0 ? null : emojis[Math.floor(rnd() * emojis.length)],
      };
    });
  }, [currentSeason, conf]);

  return (
    <div className="season-effect" data-season={currentSeason} aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className="season-particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
          }}
        >
          {p.leaf ? <MapleLeaf size={Math.round(p.size)} /> : p.emoji}
        </span>
      ))}
    </div>
  );
}
