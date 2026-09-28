import { useEffect, useRef, useState } from 'react';

const POS_KEY = 'mascot-pos';

function loadPos() {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return { x: 0, y: 0 };
    const p = JSON.parse(raw);
    if (typeof p.x === 'number' && typeof p.y === 'number') return p;
  } catch { /* ignore */ }
  return { x: 0, y: 0 };
}

function Mascot() {
  const [hidden, setHidden] = useState(false);
  const [exciting, setExciting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState(loadPos);
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const exciteTimer = useRef(null);
  const excitedRef = useRef(false);
  const dragRef = useRef({ startX: 0, startY: 0, origin: { x: 0, y: 0 }, moved: false });

  useEffect(() => {
    const onMove = (e) => {
      const wrap = wrapRef.current;
      const inner = innerRef.current;
      if (!wrap || !inner || dragRef.current.moved) return;
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const x = Math.max(-10, Math.min(10, ((e.clientY - cy) / window.innerHeight) * -12));
      const y = Math.max(-12, Math.min(12, ((e.clientX - cx) / window.innerWidth) * 14));
      inner.style.transform = `perspective(600px) rotateX(${x}deg) rotateY(${y}deg)`;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < 130 && !excitedRef.current) {
        excitedRef.current = true;
        setExciting(true);
        clearTimeout(exciteTimer.current);
        exciteTimer.current = setTimeout(() => {
          excitedRef.current = false;
          setExciting(false);
        }, 600);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      clearTimeout(exciteTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'm') setHidden((h) => !h);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (innerRef.current) innerRef.current.style.transform = '';
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origin: { ...pos },
      moved: false,
    };
    setDragging(true);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const d = dragRef.current;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const next = {
      x: Math.max(-w * 0.9, Math.min(0, d.origin.x + dx)),
      y: Math.max(-h * 0.9, Math.min(h * 0.5, d.origin.y + dy)),
    };
    setPos(next);
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    try { localStorage.setItem(POS_KEY, JSON.stringify({ x: pos.x, y: pos.y })); } catch { /* ignore */ }
  };

  const handleClick = () => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }
    excitedRef.current = true;
    setExciting(true);
    clearTimeout(exciteTimer.current);
    exciteTimer.current = setTimeout(() => {
      excitedRef.current = false;
      setExciting(false);
    }, 600);
  };

  if (hidden) return null;

  return (
    <button
      type="button"
      className={`mascot-3d ${exciting ? 'mascot-excited' : ''} ${dragging ? 'mascot-dragging' : ''}`}
      ref={wrapRef}
      title="Yuki — kéo để di chuyển, bấm để chọc, nhấn M ẩn/hiện"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
    >
      <div className="mascot-3d-inner" ref={innerRef}>
        <div className="mascot-3d-shadow" />
        <img
          src="/mascot/cherry.png"
          alt="Yuki mascot"
          draggable="false"
          className="mascot-3d-img"
        />
      </div>
    </button>
  );
}

export default Mascot;