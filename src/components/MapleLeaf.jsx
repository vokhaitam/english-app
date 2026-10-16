import React from 'react';

export default function MapleLeaf({ size = 20, className = '' }) {
  return (
    <span
      className={`maple-leaf ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
