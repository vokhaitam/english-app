import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { vocabulary, topics, getAllWords } from '../data/vocabulary';
import { grammarLessons } from '../data/grammar';
import { dailySentences } from '../data/sentences';
import { speak } from '../lib/speech';

// "Của ngày" indexes: fixed per calendar day, computed once at module load
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" style={{ color: color || undefined }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function StreakCalendar({ streak }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const isToday = i === 29;
    const isActive = i >= (30 - streak) && streak > 0;
    return { isToday, isActive };
  });

  return (
    <div className="streak-dots">
      {days.map((day, i) => (
        <div
          key={i}
          className={`streak-dot ${day.isToday ? 'today' : day.isActive ? 'active' : ''}`}
          title={day.isToday ? 'Hôm nay' : ''}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const {
    getTotalKnown, getTotalStarred, getAvgQuizScore, streakDays, quizScores,
    knownWords, getTodayCount, dailyGoal, getReviewCount, getLevel, xp,
  } = useApp();

  const totalWords = Object.values(vocabulary).reduce((a, b) => a + b.length, 0);
  const totalKnown = getTotalKnown();
  const totalStarred = getTotalStarred();
  const avgScore = getAvgQuizScore();
  const overallProgress = Math.round((totalKnown / totalWords) * 100);
  const recentQuiz = quizScores.slice(0, 3);
  const todayCount = getTodayCount();
  const goalPct = dailyGoal > 0 ? Math.min(100, Math.round((todayCount / dailyGoal) * 100)) : 0;
  const dueReviews = getReviewCount();

  // Word of the day + grammar tip: deterministic by day-of-year
  const allWords = useMemo(() => getAllWords(), []);
  const wod = allWords[dayOfYear % allWords.length];
  const gTip = grammarLessons[dayOfYear % grammarLessons.length];
  const dSentence = dailySentences[dayOfYear % dailySentences.length];

  const handleSpeak = (word) => {
    speak(word, 0.85);
  };

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Xin chào! 👋</h1>
        <p className="dashboard-subtitle">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Streak banner */}
      {streakDays > 0 && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(232,50,111,0.12), rgba(255,158,125,0.14))',
          borderColor: 'rgba(232,50,111,0.25)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{ fontSize: '2.5rem' }}>🔥</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.1rem' }}>
              {streakDays} ngày liên tiếp!
            </div>
            <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
              Hãy duy trì đà này! Học thêm hôm nay để tăng streak.
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="📖" value={totalKnown} label="Từ đã học" />
        <StatCard icon="🎯" value={`${avgScore}%`} label="Điểm Quiz TB" color="var(--accent-primary)" />
        <StatCard icon="⭐" value={totalStarred} label="Đã đánh dấu" color="var(--accent-yellow)" />
        <StatCard icon="🔥" value={streakDays} label="Ngày streak" color="var(--accent-red)" />
      </div>

      {/* Overall progress */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <h2 className="section-title">🌍 Tiến trình tổng thể</h2>
          <span className="badge badge-purple">{overallProgress}%</span>
        </div>
        <div className="progress-bar-container" style={{ height: '12px', marginBottom: '12px' }}>
          <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
        </div>
        <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
          {totalKnown} / {totalWords} từ vựng đã học
        </div>
      </div>

      {/* Actions: review due */}
      {dueReviews > 0 && (
        <div className="card" style={{ marginBottom: '24px', borderColor: 'rgba(196,106,14,0.35)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div style={{ fontWeight: '700' }}>🔁 Có {dueReviews} từ đang chờ ôn tập!</div>
              <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                Ôn lại đúng lúc để nhớ lâu hơn
              </div>
            </div>
            <Link to="/review" className="btn btn-primary">Ôn ngay</Link>
          </div>
        </div>
      )}

      {/* Main + side layout */}
      <div className="home-grid">
        <div className="home-main">
          {/* Topics progress */}
          <div style={{ marginBottom: '24px' }}>
            <div className="section-header">
              <h2 className="section-title">📚 Chủ đề</h2>
              <Link to="/study" className="btn btn-ghost btn-sm">Xem tất cả →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topics.map(topic => {
                const known = (knownWords[topic.id] || []).length;
                const total = vocabulary[topic.id]?.length || 0;
                const pct = total > 0 ? Math.round((known / total) * 100) : 0;
                return (
                  <Link to={`/study?level=${topic.level}&topic=${topic.id}`} key={topic.id} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '16px 20px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                        <div className="flex items-center gap-md">
                          <span style={{ fontSize: '1.3rem' }}>{topic.icon}</span>
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{topic.name}</span>
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{known}/{total}</span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '5px' }}>
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: topic.gradient }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Streak calendar */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <h2 className="section-title">📅 30 ngày gần nhất</h2>
              <span className="badge badge-yellow">🔥 {streakDays} streak</span>
            </div>
            <StreakCalendar streak={streakDays} />
            <div className="flex gap-md" style={{ marginTop: '12px' }}>
              <div className="flex items-center gap-sm">
                <div className="streak-dot active" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Đã học</span>
              </div>
              <div className="flex items-center gap-sm">
                <div className="streak-dot today" />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hôm nay</span>
              </div>
            </div>
          </div>

          {/* Recent quiz */}
          {recentQuiz.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="section-header" style={{ marginBottom: '16px' }}>
                <h2 className="section-title">🎯 Quiz gần đây</h2>
                <Link to="/quiz" className="btn btn-ghost btn-sm">Làm quiz →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentQuiz.map((q, i) => {
                  const topic = topics.find(t => t.id === q.topicId);
                  const pct = Math.round((q.score / q.total) * 100);
                  return (
                    <div key={i} className="flex items-center justify-between" style={{ padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div className="flex items-center gap-md">
                        <span>{topic?.icon || '🎯'}</span>
                        <span style={{ fontSize: '0.9rem' }}>{topic?.name || 'Quiz'}</span>
                      </div>
                      <div className="flex items-center gap-md">
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{q.score}/{q.total}</span>
                        <span className={`badge ${pct >= 70 ? 'badge-green' : pct >= 50 ? 'badge-yellow' : 'badge-red'}`}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="home-side">
          {wod && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <h2 className="section-title" style={{ fontSize: '1rem' }}>☀️ Từ của ngày</h2>
                <span className="badge badge-purple">{wod.type}</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: '800',
                background: 'var(--gradient-hero)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {wod.word}
              </div>
              <div className="text-secondary" style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '4px 0 8px' }}>
                {wod.pronunciation}
              </div>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>{wod.meaning}</div>
              <div className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic', marginBottom: '14px' }}>
                "{wod.example}"
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => handleSpeak(wod.word)}>🔊 Nghe phát âm</button>
            </div>
          )}

          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
              <h2 className="section-title" style={{ fontSize: '1rem' }}>🎯 Mục tiêu hôm nay</h2>
              <span className="text-secondary" style={{ fontSize: '0.8rem' }}>{todayCount}/{dailyGoal}</span>
            </div>
            <div className="progress-bar-container" style={{ height: '10px', marginBottom: '12px' }}>
              <div className="progress-bar-fill" style={{ width: `${goalPct}%`, background: 'var(--gradient-hero)' }} />
            </div>
            {goalPct >= 100 ? (
              <div className="text-secondary" style={{ fontSize: '0.85rem' }}>🎉 Hoàn thành mục tiêu! Học thêm để tăng XP.</div>
            ) : (
              <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                Cần thêm {Math.max(0, dailyGoal - todayCount)} từ để đạt mục tiêu
              </div>
            )}
          </div>

          {dSentence && (
            <Link to="/daily-sentence" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ marginBottom: '24px', cursor: 'pointer' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                  <h2 className="section-title" style={{ fontSize: '1rem' }}>💬 Câu giao tiếp hôm nay</h2>
                  <span className="badge badge-yellow">{dSentence.tag}</span>
                </div>
                <div className="daily-sentence-condensed">{dSentence.en}</div>
                <div className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '8px' }}>
                  {dSentence.vi}
                </div>
                <div className="grammar-start mt-md">Xem ngữ pháp trong câu →</div>
              </div>
            </Link>
          )}

          {gTip && (
            <Link to="/grammar" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ marginBottom: '24px', cursor: 'pointer' }}>
                <div className="flex items-center gap-md" style={{ marginBottom: '12px' }}>
                  <h2 className="section-title" style={{ fontSize: '1rem' }}>📘 Mẹo ngữ pháp</h2>
                  <span className="badge badge-purple">{gTip.tag}</span>
                </div>
                <div style={{ fontWeight: '700', marginBottom: '8px' }}>{gTip.icon} {gTip.title}</div>
                <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                  {gTip.explanation.split('\n')[0]}
                </div>
                <div className="grammar-start mt-md">Học bài này →</div>
              </div>
            </Link>
          )}

          <div className="card">
            <div className="flex items-center gap-md" style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '1.6rem' }}>🚀</div>
              <div>
                <div style={{ fontWeight: '700' }}>Cấp {getLevel()}</div>
                <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{xp} XP</div>
              </div>
            </div>
            <Link to="/stats" className="btn btn-secondary btn-sm w-full">📊 Xem thống kê</Link>
          </div>
        </aside>
      </div>

      {/* Quick actions */}
      <div className="flex gap-md" style={{ marginTop: '24px', flexWrap: 'wrap' }}>
        <Link to="/study" className="btn btn-primary">📚 Học từ vựng</Link>
        <Link to="/quiz" className="btn btn-secondary">🎯 Làm quiz</Link>
        <Link to="/word-rain" className="btn btn-secondary">⌨️ Game gõ từ</Link>
        <Link to="/typing-practice" className="btn btn-secondary">✍️ Luyện ghi từ</Link>
        <Link to="/listening" className="btn btn-secondary">🎧 Luyện nghe</Link>
        <Link to="/bookmarks" className="btn btn-secondary">⭐ Từ đã lưu</Link>
      </div>
    </div>
  );
}