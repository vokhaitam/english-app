import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { splitWordKey } from '../lib/wordKey';
import { useApp } from '../context/AppContext';

function RadialProgress({ value, size = 80, strokeWidth = 7, color = 'var(--accent-primary)' }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--track-color)" strokeWidth={strokeWidth} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

export default function StatsPage() {
  const { vocabulary, topics } = useLanguage();
  const {
    quizScores, streakDays, getTotalKnown, getTotalStarred,
    getAvgQuizScore, getBestQuizScore, getWeekHistory, getLevel, getLevelProgress,
    xp, dailyGoal, setDailyGoal, getTodayCount, getTopMistakes,
    exportData, importData, resetProgress, getTotalInReview, getTopicProgress,
  } = useApp();
  const fileRef = useRef(null);
  const [msg, setMsg] = useState('');

  const totalWords = Object.values(vocabulary).reduce((a, b) => a + b.length, 0);
  const totalKnown = getTotalKnown();
  const overallPct = Math.round((totalKnown / totalWords) * 100);
  const avgQuiz = getAvgQuizScore();
  const todayCount = getTodayCount();
  const goalPct = dailyGoal > 0 ? Math.min(100, Math.round((todayCount / dailyGoal) * 100)) : 0;
  const week = getWeekHistory();
  const maxDay = Math.max(...week.map(d => d.count), 1);
  const topMistakes = getTopMistakes();

  const s = {
    known: totalKnown,
    quizzes: quizScores.length,
    best: getBestQuizScore(),
    streak: streakDays,
    starred: getTotalStarred(),
    review: getTotalInReview(),
    level: getLevel(),
  };

  const achievements = [
    { id: 'first-word', icon: '🌱', title: 'Khởi đầu', desc: 'Học từ đầu tiên', done: s.known >= 1 },
    { id: 'w50', icon: '📖', title: '50 từ', desc: 'Đã học 50 từ', done: s.known >= 50 },
    { id: 'w100', icon: '📚', title: '100 từ', desc: 'Đã học 100 từ', done: s.known >= 100 },
    { id: 'w250', icon: '🎓', title: '250 từ', desc: 'Đã học 250 từ', done: s.known >= 250 },
    { id: 'w500', icon: '🏅', title: '500 từ', desc: 'Đã học 500 từ', done: s.known >= 500 },
    { id: 'w1000', icon: '🏆', title: '1000 từ', desc: 'Đã học 1000 từ', done: s.known >= 1000 },
    { id: 'q1', icon: '🎯', title: 'First quiz', desc: 'Hoàn thành quiz đầu tiên', done: s.quizzes >= 1 },
    { id: 'q10', icon: '🎲', title: '10 quiz', desc: 'Làm 10 lượt quiz', done: s.quizzes >= 10 },
    { id: 'perfect', icon: '💯', title: 'Perfect', desc: 'Đạt 100% trong một quiz', done: s.best === 100 },
    { id: 'streak3', icon: '🔥', title: '3 ngày streak', desc: 'Học 3 ngày liên tiếp', done: s.streak >= 3 },
    { id: 'streak7', icon: '⚡', title: '7 ngày streak', desc: 'Học liên tiếp 1 tuần', done: s.streak >= 7 },
    { id: 'streak30', icon: '🌋', title: 'Tháng liên tiếp', desc: 'Học 30 ngày liên tiếp', done: s.streak >= 30 },
    { id: 'star10', icon: '⭐', title: 'Bộ sưu tập', desc: 'Đánh dấu 10 từ', done: s.starred >= 10 },
    { id: 'rev20', icon: '🔁', title: 'Chăm ôn tập', desc: 'Có 20 từ trong danh sách ôn', done: s.review >= 20 },
    { id: 'level5', icon: '🚀', title: 'Cấp 5', desc: 'Đạt cấp độ 5', done: s.level >= 5 },
  ];

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(reader.result);
      setMsg(ok ? '✅ Đã nhập dữ liệu thành công!' : '❌ File không hợp lệ.');
      setTimeout(() => setMsg(''), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">📊 Thống kê</h1>
        <p className="page-subtitle">Theo dõi hành trình học tiếng Anh của bạn</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <RadialProgress value={overallPct} size={100} color="var(--accent-primary)" />
            <div style={{ position: 'absolute', fontWeight: '800', fontSize: '1.1rem' }}>{overallPct}%</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginTop: '12px' }}>Từ vựng</div>
          <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{totalKnown}/{totalWords} từ</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <RadialProgress value={avgQuiz} size={100} color="var(--accent-primary)" />
            <div style={{ position: 'absolute', fontWeight: '800', fontSize: '1.1rem' }}>{avgQuiz}%</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginTop: '12px' }}>Quiz TB</div>
          <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{quizScores.length} lượt</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <RadialProgress value={goalPct} size={100} color="var(--accent-green)" />
            <div style={{ position: 'absolute', fontWeight: '800', fontSize: '1.1rem' }}>{todayCount}</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', marginTop: '12px' }}>Hôm nay</div>
          <div className="text-secondary" style={{ fontSize: '0.8rem' }}>mục tiêu {dailyGoal} từ</div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔥</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '2rem', color: 'var(--accent-yellow)' }}>{streakDays}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700' }}>Ngày streak</div>
          <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Học liên tiếp</div>
        </div>
      </div>

      {/* Level + weekly chart */}
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '24px' }}>
        <div className="card">
          <h2 className="section-title" style={{ marginBottom: '16px' }}>🏅 Cấp độ & XP</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '4rem' }}>{getLevel() >= 10 ? '👑' : '🚀'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '1.4rem' }}>Cấp {getLevel()}</div>
              <div className="progress-bar-container" style={{ margin: '10px 0' }}>
                <div className="progress-bar-fill" style={{ width: `${getLevelProgress()}%` }} />
              </div>
              <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                {xp} XP • {100 - getLevelProgress()} XP nữa lên cấp tiếp
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title" style={{ marginBottom: '16px' }}>📅 7 ngày gần nhất</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '110px' }}>
            {week.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.count || ''}</div>
                <div className="week-bar" style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%`, background: 'var(--gradient-hero)' }} title={`${d.count} từ`} />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top mistakes */}
      {topMistakes.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>⚠️ Từ hay sai nhất</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topMistakes.map((m) => {
              const parsed = splitWordKey(m.key);
              const word = parsed ? (vocabulary[parsed.topicId] || []).find(w => w.id === Number(parsed.wordId)) : null;
              const topic = parsed ? topics.find(t => t.id === parsed.topicId) : null;
              return (
                <div key={m.key} className="flex items-center justify-between" style={{ padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-md">
                    <span>{topic?.icon || '❓'}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{word?.word || m.key}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{word?.meaning || ''}</div>
                    </div>
                  </div>
                  <span className="badge badge-red">sai {m.count} lần</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-topic progress */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title" style={{ marginBottom: '20px' }}>📚 Tiến trình theo chủ đề</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topics.map(topic => {
            const known = getTopicProgress(topic.id);
            const total = vocabulary[topic.id]?.length || 0;
            const pct = total > 0 ? Math.round((known / total) * 100) : 0;
            return (
              <div key={topic.id}>
                <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                  <div className="flex items-center gap-md">
                    <span style={{ fontSize: '1.2rem' }}>{topic.icon}</span>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{topic.name}</span>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{known}/{total}</span>
                    <span className={`badge ${pct >= 70 ? 'badge-green' : pct > 0 ? 'badge-yellow' : ''}`}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar-container" style={{ height: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: `${pct}%`, background: topic.gradient }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 className="section-title" style={{ marginBottom: '20px' }}>🏆 Thành tích ({achievements.filter(a => a.done).length}/{achievements.length})</h2>
        <div className="achievement-grid">
          {achievements.map(a => (
            <div key={a.id} className={`achievement-item ${a.done ? 'done' : 'locked'}`}>
              <div className="achievement-icon" style={{ opacity: a.done ? 1 : 0.35, filter: a.done ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{a.title}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem', textAlign: 'center' }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz history */}
      {quizScores.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>🎯 Lịch sử quiz</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quizScores.slice(0, 10).map((q, i) => {
              const topic = topics.find(t => t.id === q.topicId);
              const pct = Math.round((q.score / q.total) * 100);
              const date = new Date(q.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
              return (
                <div key={i} className="flex items-center justify-between" style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-md">
                    <span>{topic?.icon || '🎯'}</span>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{topic?.name || (q.topicId === 'all' ? 'Trộn tất cả' : 'Quiz')}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{q.score}/{q.total}</span>
                    <span className={`badge ${pct >= 80 ? 'badge-green' : pct >= 60 ? 'badge-yellow' : 'badge-red'}`}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="card">
        <h2 className="section-title" style={{ marginBottom: '20px' }}>⚙️ Cài đặt & dữ liệu</h2>

        <div style={{ marginBottom: '24px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>🎯 Mục tiêu từ mỗi ngày</span>
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{dailyGoal} từ/ngày</span>
          </div>
          <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
            {[10, 20, 30, 50].map(n => (
              <button key={n} className={`btn ${dailyGoal === n ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDailyGoal(n)}>
                {n} từ
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-sm" style={{ flexWrap: 'wrap', marginBottom: '16px' }}>
          <button className="btn btn-primary" onClick={exportData}>💾 Xuất dữ liệu (backup)</button>
          <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>📥 Nhập dữ liệu</button>
          <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
          <button
            className="btn btn-secondary"
            style={{ borderColor: 'rgba(223,59,79,0.4)', color: 'var(--accent-red)' }}
            onClick={() => { if (window.confirm('Chắc chắn xóa toàn bộ tiến độ học?')) resetProgress(); }}
          >
            🗑️ Đặt lại tiến độ
          </button>
        </div>
        {msg && <div className="fade-in text-secondary" style={{ fontSize: '0.9rem' }}>{msg}</div>}
      </div>
    </div>
  );
}