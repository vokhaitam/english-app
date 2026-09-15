import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dailySentences } from '../data/sentences';

const N = dailySentences.length;

const getTodayIndex = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000) % N;
};

export default function DailySentencePage() {
  const { sentencesLearned, toggleSentenceLearned } = useApp();
  const baseIndex = getTodayIndex();
  const [offset, setOffset] = useState(0);
  const [hideEn, setHideEn] = useState(false);

  const idx = ((baseIndex + offset) % N + N) % N;
  const s = dailySentences[idx];
  const isLearned = !!sentencesLearned[s.id];

  const handleSpeak = (rate) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(s.en);
      u.lang = 'en-US';
      u.rate = rate ?? 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const toggleLearned = () => toggleSentenceLearned(s.id);

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">💬 Câu giao tiếp hôm nay</h1>
        <p className="dashboard-subtitle">
          Mỗi ngày một câu để nói tự nhiên hơn — kèm phân tích ngữ pháp
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-md" style={{ marginBottom: '24px', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setOffset(o => o - 1)}>← Câu hôm trước</button>
        <button className="btn btn-ghost btn-sm" onClick={() => setOffset(o => o + 1)}>Câu ngày mai →</button>
        {offset !== 0 && <button className="btn btn-secondary btn-sm" onClick={() => setOffset(0)}>📍 Hôm nay</button>}
      </div>

      {/* Sentence card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
          <div className="flex items-center gap-md">
            <span className="badge badge-yellow">Ngày {idx + 1}/{N}</span>
            <span className="badge badge-purple">{s.tag}</span>
          </div>
          {isLearned && <span className="badge badge-green">✅ Đã thuộc</span>}
        </div>

        {hideEn ? (
          <div style={{ padding: '28px 16px', textAlign: 'center' }}>
            <div className="text-muted" style={{ fontStyle: 'italic', marginBottom: '16px' }}>
              Nhớ lại câu tiếng Anh trước khi xem đáp án...
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setHideEn(false)}>👁 Hiện câu tiếng Anh</button>
          </div>
        ) : (
          <div className="daily-sentence">{s.en}</div>
        )}

        <div className="text-secondary" style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '8px' }}>
          {s.pron}
        </div>

        <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '6px' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>🇻🇳</span> {s.vi}
        </div>

        <div className="flex gap-md" style={{ marginTop: '18px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => handleSpeak(0.85)}>🔊 Nghe</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleSpeak(0.55)}>🐢 Nghe chậm</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setHideEn(true)}>🧠 Tự nhớ lại</button>
          <button
            className={`btn btn-sm ${isLearned ? 'btn-ghost' : 'btn-secondary'}`}
            onClick={toggleLearned}
            style={{ marginLeft: 'auto' }}
          >
            {isLearned ? '✓ Đã thuộc (bấm để bỏ)' : 'Đánh dấu đã thuộc'}
          </button>
        </div>
      </div>

      {/* Grammar breakdown */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <h2 className="section-title">📘 Ngữ pháp trong câu</h2>
        </div>
        <div className="grammar-formula" style={{ marginBottom: '16px' }}>{s.grammar.name}</div>
        <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>{s.grammar.explanation}</p>
      </div>

      {/* Breakdown */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '16px' }}>
          <h2 className="section-title">🔍 Tách câu theo ý</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {s.breakdown.map((b, i) => (
            <div key={i} className="breakdown-item">
              <div className="b-part">{b.part}</div>
              <div className="b-note">{b.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}