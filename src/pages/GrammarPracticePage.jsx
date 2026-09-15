import React, { useState } from 'react';
import { grammarPractice } from '../data/practice';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function GrammarPracticePage() {
  const [screen, setScreen] = useState('start'); // 'start' | 'quiz' | 'done'
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastCount, setLastCount] = useState(20);

  const start = (count) => {
    const shuffled = [...grammarPractice].sort(() => Math.random() - 0.5).slice(0, count);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setCorrectCount(0);
    setLastCount(count);
    setScreen('quiz');
  };

  const choose = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers(a => [...a, idx]);
    if (idx === questions[current].answerIndex) setCorrectCount(c => c + 1);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
    } else {
      setScreen('done');
    }
  };

  // ---- START SCREEN ----
  if (screen === 'start') {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">✍️ Luyện tập ngữ pháp</h1>
          <p className="page-subtitle">
            {grammarPractice.length} câu hỏi trộn lẫn tất cả các thì & chủ điểm ngữ pháp
          </p>
        </div>

        <div className="card" style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📝</div>
          <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
            Trả lời từng câu hỏi trắc nghiệm để kiểm tra toàn diện kiến thức ngữ pháp của bạn.
          </p>
          <p style={{ marginBottom: '12px', fontWeight: '600', fontSize: '0.9rem' }}>
            Chọn số câu mỗi lượt:
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            {[20, 50, grammarPractice.length].map(n => (
              <button
                key={n}
                className="btn btn-secondary"
                onClick={() => start(n)}
              >
                {n === grammarPractice.length ? `Tất cả (${n})` : `${n} câu`}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Câu hỏi luôn được xáo trộn ngẫu nhiên mỗi lượt
          </div>
        </div>
      </div>
    );
  }

  // ---- RESULT SCREEN ----
  if (screen === 'done') {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const wrong = questions
      .map((q, i) => ({ q, chosen: answers[i] }))
      .filter(x => x.chosen !== x.q.answerIndex);

    return (
      <div className="fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div className="completion-screen">
          <div className="completion-emoji">
            {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👏' : '💪'}
          </div>
          <h2 className="completion-title">
            {accuracy >= 80 ? 'Xuất sắc!' : accuracy >= 60 ? 'Tốt lắm!' : 'Cố lên!'}
          </h2>
          <p className="text-secondary">
            Bạn trả lời đúng <strong style={{ color: 'var(--text-primary)' }}>{correctCount}/{questions.length}</strong> câu hỏi ngữ pháp
          </p>

          <div className="completion-stats">
            <div className="completion-stat">
              <div className="completion-stat-value" style={{ color: 'var(--accent-green)' }}>
                {correctCount}
              </div>
              <div className="completion-stat-label">Đúng ✅</div>
            </div>
            <div className="completion-stat">
              <div className="completion-stat-value" style={{ color: 'var(--accent-red)' }}>
                {questions.length - correctCount}
              </div>
              <div className="completion-stat-label">Sai ❌</div>
            </div>
            <div className="completion-stat">
              <div className="completion-stat-value" style={{ color: 'var(--accent-primary)' }}>
                {accuracy}%
              </div>
              <div className="completion-stat-label">Chính xác</div>
            </div>
          </div>

          <div className="flex gap-md">
            <button className="btn btn-secondary" onClick={() => start(lastCount)}>
              🔄 Luyện lại
            </button>
            <button className="btn btn-primary" onClick={() => setScreen('start')}>
              🎯 Chọn số câu
            </button>
          </div>
        </div>

        {wrong.length > 0 && (
          <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>📌 Cần xem lại ({wrong.length} câu)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wrong.map(w => (
                <div key={w.q.id} style={{ fontSize: '0.85rem', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px' }}>
                    {w.q.topic}
                  </div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{w.q.q}</div>
                  <div style={{ color: 'var(--accent-red)' }}>
                    Bạn chọn: {w.q.options[w.chosen] ?? 'Bỏ qua'}
                  </div>
                  <div style={{ color: 'var(--accent-green)' }}>
                    Đáp án: {w.q.options[w.q.answerIndex]}
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{w.q.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- QUIZ SCREEN ----
  const q = questions[current];
  return (
    <div className="fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setScreen('start')}>
          ← Thoát
        </button>
        <span className="badge badge-purple">
          Câu {current + 1}/{questions.length} • Đúng {correctCount}
        </span>
      </div>

      <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${((selected !== null ? current + 1 : current) / questions.length) * 100}%` }}
        />
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: '600', marginBottom: '12px' }}>
          {q.topic}
        </div>
        <h2 style={{ fontSize: '1.05rem', marginBottom: '20px', lineHeight: 1.5 }}>{q.q}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.answerIndex;
            const isChosen = selected === idx;
            const style = { justifyContent: 'flex-start', textAlign: 'left', padding: '12px 16px' };
            if (selected !== null) {
              if (isCorrect) {
                style.background = 'var(--accent-green)';
                style.color = '#fff';
                style.borderColor = 'var(--accent-green)';
              } else if (isChosen) {
                style.background = 'var(--accent-red)';
                style.color = '#fff';
                style.borderColor = 'var(--accent-red)';
              } else {
                style.opacity = 0.5;
              }
            }
            return (
              <button
                key={idx}
                className="btn btn-secondary"
                style={style}
                onClick={() => choose(idx)}
                disabled={selected !== null}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: 'var(--radius-full)', background: 'var(--bg-primary)', color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.75rem', marginRight: '10px', flexShrink: 0 }}>
                  {OPTION_LABELS[idx]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="fade-in" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'var(--text-muted)' }}>
              {q.explanation}
            </div>
            <button className="btn btn-primary" onClick={next} style={{ width: '100%' }}>
              {current < questions.length - 1 ? 'Câu tiếp theo →' : 'Xem kết quả ✅'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}