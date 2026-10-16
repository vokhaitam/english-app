import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import MapleLeaf from './MapleLeaf';

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
  const conf = CONFIG[currentSeason] || CONFIG.spring;

  const particles = useMemo(() => {
    const rnd = randGen(seedFrom(currentSeason));
    const isLeaf = !!conf.leaf;
    return Array.from({ length: conf.count }, (_, i) => {
      const dur = conf.minDur + rnd() * (conf.maxDur - conf.minDur);
      return {
        id: i,
        left: rnd() * 100,
        size: conf.minSize + rnd() * (conf.maxSize - conf.minSize),
        duration: dur,
        delay: -rnd() * dur,
        drift: (rnd() * 2 - 1) * conf.drift,
        spin: (rnd() * 2 - 1) * conf.spin,
        opacity: conf.minOpacity + rnd() * (conf.maxOpacity - conf.minOpacity),
        leaf: isLeaf,
        emoji: isLeaf ? null : conf.emojis[Math.floor(rnd() * conf.emojis.length)],
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
