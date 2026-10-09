import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { speak } from '../lib/speech';
import { localDateKey } from '../lib/dateHelpers';
import { getQuizSource } from '../lib/quizLabels';
import { roadmaps } from '../data/roadmaps';
import Reveal from '../components/Reveal';

// "Của ngày" indexes: fixed per calendar day, computed once at module load
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

// 8 tính năng nổi bật — theo đúng thứ tự trang luyentu.com giới thiệu.
const FEATURES = [
  { icon: '🃏', title: 'Flashcard + Spaced Repetition', desc: 'Ôn tập đúng thời điểm bạn sắp quên, ghi nhớ lâu hơn gấp 3 lần', to: '/review' },
  { icon: '🗺️', title: 'Lộ trình TOEIC 450 → 990', desc: 'Bộ từ vựng phân theo level, học có thứ tự từng mốc điểm', to: '/roadmap?id=toeic' },
  { icon: '🌍', title: 'Lộ trình IELTS 5.0 → 8.0+', desc: 'Academic & General, xếp theo band từ cơ bản đến nâng cao', to: '/roadmap?id=ielts' },
  { icon: '🎮', title: '6 game luyện tập', desc: 'Ghép thẻ, xếp chữ, thử thách nghe, xếp câu, mưa từ, luyện ghi', to: '/games' },
  { icon: '🗂️', title: 'Bộ từ vựng cá nhân', desc: 'Tạo bộ từ theo chủ đề bạn muốn rồi học hoặc kiểm tra riêng', to: '/my-decks' },
  { icon: '📊', title: 'Thống kê & Streak', desc: 'Biểu đồ tiến độ, streak hằng ngày và thành tựu chi tiết', to: '/stats' },
  { icon: '🎧', title: 'Luyện nghe mỗi ngày', desc: 'Nghe phát âm chuẩn, bài nghe ngắn gọn cho mọi trình độ', to: '/listening' },
  { icon: '📚', title: 'Kho 2.600 từ vựng', desc: '26 chủ đề theo mục tiêu TOEIC và IELTS', to: '/roadmap' },
];

// Nội dung 2 thẻ lộ trình + thẻ kho từ đổi theo ngôn ngữ đang chọn.
function featuresFor(isJa, totalWords) {
  const roadmapCards = isJa
    ? [
        { icon: '🗾', title: 'Lộ trình JLPT N5 → N3', desc: '3 cấp độ, 27 chủ đề từ sơ cấp đến trung cấp', to: '/roadmap' },
        { icon: '🈶', title: 'Bảng Hiragana & Katakana', desc: 'Học bảng kana, số đếm và cách đếm đồ kiểu Nhật', to: '/kana' },
      ]
    : [FEATURES[1], FEATURES[2]];
  return [
    FEATURES[0],
    ...roadmapCards,
    ...FEATURES.slice(3, 7),
    {
      icon: '📚',
      title: `Kho ${totalWords.toLocaleString('vi-VN')} từ vựng`,
      desc: isJa ? 'Từ vựng JLPT N5 – N3, 27 chủ đề đời sống' : '26 chủ đề theo mục tiêu TOEIC và IELTS',
      to: '/roadmap',
    },
  ];
}

// Đếm số tăng dần khi thẻ thống kê xuất hiện.
function CountUp({ value, duration = 900 }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [n, setN] = useState(() => (reduce ? value : 0));
  useEffect(() => {
    if (reduce) return undefined;
    let raf = 0;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);
  return <>{n}</>;
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" style={{ color: color || undefined }}>
        {typeof value === 'number' ? <CountUp value={value} /> : value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// 30 ngày gần nhất, dựa trên dailyProgress thật (không phỏng đoán theo streak).
function StreakCalendar({ dailyProgress }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 86400000);
    const count = dailyProgress[localDateKey(date)] || 0;
    return {
      isToday: i === 29,
      isActive: count > 0,
      title: `${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}: ${count} từ`,
    };
  });

  return (
    <div className="streak-dots">
      {days.map((day, i) => (
        <div
          key={i}
          className={`streak-dot ${day.isToday ? 'today' : day.isActive ? 'active' : ''}`}
          title={day.title}
        />
      ))}
    </div>
  );
}

// Hero visual card - hiển thị bên phải hero section
function HeroVisualCard({ totalKnown, streakDays, goalPct, avgScore, getLevel, xp }) {
  return (
    <div className="hp-hero-visual">
      <div className="hp-hero-visual-glow" aria-hidden="true" />
      {/* Card nổi - 4 góc */}
      <div className="hp-float-card hp-float-card-main">
        <div className="hp-float-card-icon">📚</div>
        <div>
          <div className="hp-float-card-value">{totalKnown.toLocaleString('vi-VN')}</div>
          <div className="hp-float-card-label">Từ đã học</div>
        </div>
      </div>
      <div className="hp-float-card hp-float-card-streak">
        <div className="hp-float-card-icon flame-flicker">🔥</div>
        <div>
          <div className="hp-float-card-value">{streakDays}</div>
          <div className="hp-float-card-label">Ngày streak</div>
        </div>
      </div>
      <div className="hp-float-card hp-float-card-score">
        <div className="hp-float-card-icon">🎯</div>
        <div>
          <div className="hp-float-card-value">{avgScore}%</div>
          <div className="hp-float-card-label">Quiz TB</div>
        </div>
      </div>
      <div className="hp-float-card hp-float-card-level">
        <div className="hp-float-card-icon">🚀</div>
        <div>
          <div className="hp-float-card-value">Cấp {getLevel()}</div>
          <div className="hp-float-card-label" style={{ color: 'rgba(255,255,255,0.85)' }}>{xp} XP</div>
        </div>
      </div>
      {/* Progress ring - ở giữa */}
      <div className="hp-hero-ring">
        <svg viewBox="0 0 100 100" className="hp-ring-svg">
          <circle cx="50" cy="50" r="42" className="hp-ring-track" />
          <circle
            cx="50" cy="50" r="42"
            className="hp-ring-fill"
            strokeDasharray={`${2.64 * goalPct} ${264 - 2.64 * goalPct}`}
            strokeDashoffset="66"
          />
        </svg>
        <div className="hp-ring-center">
          <div className="hp-ring-pct">{goalPct}%</div>
          <div className="hp-ring-label">Mục tiêu</div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { vocabulary, topics, levels, getAllWords, grammarLessons, dailySentences, isJapanese } = useLanguage();
  const featuresList = featuresFor(
    isJapanese,
    Object.values(vocabulary).reduce((a, b) => a + b.length, 0),
  );
  const {
    getTotalKnown, getTotalStarred, getAvgQuizScore, streakDays, quizScores,
    getTopicProgress, getTodayCount, dailyGoal, getReviewCount, getLevel, xp,
    dailyProgress, customDecks, sentencesLearned, toggleSentenceLearned,
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
  const allWords = useMemo(() => getAllWords(), [getAllWords]);
  const wod = allWords[dayOfYear % allWords.length];
  const gTip = grammarLessons[dayOfYear % grammarLessons.length];
  // Câu giao tiếp: có thể xem câu trước/sau, tự nhớ lại, đánh dấu đã thuộc.
  const [dsOffset, setDsOffset] = useState(0);
  const [dsHideEn, setDsHideEn] = useState(false);
  const dsTotal = dailySentences.length;
  const dsIndex = ((dayOfYear % dsTotal) + (dsOffset % dsTotal) + dsTotal) % dsTotal;
  const dSentence = dailySentences[dsIndex];
  const dsLearned = dSentence ? !!sentencesLearned[dSentence.id] : false;

  const handleSpeak = (word) => {
    speak(word, 0.85);
  };

  const todayLabel = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="fade-in">

      {/* ═══════════════════════════════════════════
          HERO SECTION — luyentu.com style 2-col
          ═══════════════════════════════════════════ */}
      <section className="hp-hero">
        {/* Decorative blobs */}
        <span className="hp-hero-blob hp-hero-blob-1" aria-hidden="true" />
        <span className="hp-hero-blob hp-hero-blob-2" aria-hidden="true" />
        <span className="hp-hero-blob hp-hero-blob-3" aria-hidden="true" />

        {/* Left: text */}
        <div className="hp-hero-text">
          {streakDays > 0 && (
            <div className="hp-hero-streak-pill">
              <span className="flame-flicker" style={{ fontSize: '0.95rem' }}>🔥</span>
              {streakDays} ngày streak
            </div>
          )}

          <div className="hp-hero-eyebrow">
            <span className="hp-hero-eyebrow-dot" />
            {isJapanese ? 'Nền tảng học tiếng Nhật' : 'Nền tảng học từ vựng'}
          </div>

          <h1 className="hp-hero-title">
            Học từ vựng
            <span className="hp-hero-title-accent">thông minh hơn</span>
            mỗi ngày
          </h1>

          <p className="hp-hero-desc">
            Flashcard + Spaced Repetition giúp nhớ lâu <strong>gấp 3 lần</strong>.
            Lộ trình TOEIC · IELTS rõ ràng, 6 game vui nhộn.
          </p>

          {/* CTA buttons */}
          <div className="hp-hero-ctas">
            {dueReviews > 0 ? (
              <Link to="/review" className="hp-cta-primary btn btn-primary">
                🔁 Ôn {dueReviews} từ ngay
              </Link>
            ) : (
              <Link to="/study" className="hp-cta-primary btn btn-primary">
                📚 Học từ vựng
              </Link>
            )}
            <Link to="/roadmap" className="hp-cta-secondary btn btn-secondary">
              🗺️ Chọn lộ trình
            </Link>
          </div>

          {/* Date + Badge row - cùng 1 dòng */}
          <div className="hp-hero-meta">
            <span className="hp-hero-date">📅 {todayLabel}</span>
            <span className="hp-hero-badge">🏅 Cấp {getLevel()}</span>
            <span className="hp-hero-badge">📖 {totalKnown} từ</span>
            <span className="hp-hero-badge">⭐ {totalStarred} đã đánh dấu</span>
          </div>
        </div>

        {/* Right: visual card cluster */}
        <HeroVisualCard
          totalKnown={totalKnown}
          streakDays={streakDays}
          goalPct={goalPct}
          avgScore={avgScore}
          getLevel={getLevel}
          xp={xp}
        />
      </section>

      {/* ═══════════════════════════════════════════
          PLATFORM STATS BAR
          ═══════════════════════════════════════════ */}
      <Reveal>
        <div className="hp-stats-bar">
          <div className="hp-stat-item">
            <div className="hp-stat-num" style={{ color: 'var(--accent-primary)' }}>
              {totalWords.toLocaleString('vi-VN')}
            </div>
            <div className="hp-stat-lbl">Từ vựng</div>
          </div>
          <div className="hp-stats-divider" />
          <div className="hp-stat-item">
            <div className="hp-stat-num" style={{ color: 'var(--accent-yellow)' }}>
              {roadmaps.length}
            </div>
            <div className="hp-stat-lbl">Lộ trình</div>
          </div>
          <div className="hp-stats-divider" />
          <div className="hp-stat-item">
            <div className="hp-stat-num" style={{ color: 'var(--accent-cyan)' }}>6</div>
            <div className="hp-stat-lbl">Loại game</div>
          </div>
          <div className="hp-stats-divider" />
          <div className="hp-stat-item">
            <div className="hp-stat-num" style={{ color: 'var(--accent-green)' }}>
              {overallProgress}%
            </div>
            <div className="hp-stat-lbl">Tiến trình của bạn</div>
          </div>
        </div>
      </Reveal>

      {/* ═══════════════════════════════════════════
          TÍNH NĂNG NỔI BẬT
          ═══════════════════════════════════════════ */}
      <div className="hp-section">
        <Reveal>
          <div className="hp-section-header">
            <div>
              <div className="hp-section-eyebrow">✨ Nền tảng học từ vựng</div>
              <h2 className="hp-section-title">Tính năng nổi bật</h2>
            </div>
            <Link to="/study" className="btn btn-ghost btn-sm">Khám phá tất cả →</Link>
          </div>
        </Reveal>
        <div className="feature-grid">
          {featuresList.map((f, i) => (
            <Reveal key={f.title} delay={i * 50}>
              <Link to={f.to} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-title">{f.title}</span>
                <span className="feature-desc">{f.desc}</span>
                <span className="feature-cta">Tìm hiểu →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          STATS + ACTIONS ROW
          ═══════════════════════════════════════════ */}
      <div className="stats-grid" style={{ marginBottom: '32px' }}>
        <StatCard icon="📖" value={totalKnown} label="Từ đã học" />
        <StatCard icon="🎯" value={`${avgScore}%`} label="Điểm Quiz TB" color="var(--accent-primary)" />
        <StatCard icon="⭐" value={totalStarred} label="Đã đánh dấu" color="var(--accent-yellow)" />
        <StatCard icon="🔥" value={streakDays} label="Ngày streak" color="var(--accent-red)" />
      </div>

      {/* Due review CTA */}
      {dueReviews > 0 && (
        <Reveal>
          <div className="hp-review-banner">
            <div className="hp-review-banner-left">
              <div className="hp-review-banner-icon">🔁</div>
              <div>
                <div className="hp-review-banner-title">Có {dueReviews} từ đang chờ ôn tập!</div>
                <div className="hp-review-banner-sub">Ôn lại đúng lúc để nhớ lâu hơn — chỉ mất vài phút</div>
              </div>
            </div>
            <Link to="/review" className="btn btn-primary">Ôn ngay →</Link>
          </div>
        </Reveal>
      )}

      {/* ═══════════════════════════════════════════
          MAIN + SIDEBAR LAYOUT
          ═══════════════════════════════════════════ */}
      <div className="home-grid">
        <div className="home-main">

          {/* Bài học theo cấp độ */}
          <div className="hp-section" style={{ marginBottom: '0' }}>
            <div className="hp-section-header">
              <div>
                <div className="hp-section-eyebrow">📚 Nội dung học</div>
                <h2 className="hp-section-title">Bài học theo chủ đề</h2>
              </div>
              <Link to="/study" className="btn btn-ghost btn-sm">Xem tất cả →</Link>
            </div>

            {/* Overall progress compact */}
            <div className="hp-overall-progress">
              <div className="hp-overall-left">
                <span className="hp-overall-label">Tiến trình tổng thể</span>
                <span className="badge badge-purple">{overallProgress}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '8px' }}>
                <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
              </div>
              <div className="text-muted" style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                {totalKnown} / {totalWords} từ vựng đã học
              </div>
            </div>

            {levels.map((lv, li) => {
              const list = topics.filter(t => t.level === lv.id);
              if (list.length === 0) return null;
              const knownAll = list.reduce((a, t) => a + getTopicProgress(t.id), 0);
              const totalAll = list.reduce((a, t) => a + (vocabulary[t.id]?.length || 0), 0);
              return (
                <Reveal key={lv.id} delay={li * 60} className="lesson-group">
                  <div className="lesson-group-head">
                    <span
                      className="lesson-group-icon"
                      style={{ background: `${lv.color}1f`, borderColor: `${lv.color}55` }}
                    >
                      {lv.icon}
                    </span>
                    <div className="lesson-group-text">
                      <div className="lesson-group-title">{lv.label}</div>
                      <div className="text-muted" style={{ fontSize: '0.76rem' }}>{lv.desc}</div>
                    </div>
                    <span className={`badge ${knownAll >= totalAll && totalAll > 0 ? 'badge-green' : 'badge-purple'}`}>
                      {knownAll}/{totalAll}
                    </span>
                  </div>

                  <div className="lesson-grid">
                    {list.map((topic, ti) => {
                      const known = getTopicProgress(topic.id);
                      const total = vocabulary[topic.id]?.length || 0;
                      const pct = total > 0 ? Math.round((known / total) * 100) : 0;
                      return (
                        <Link
                          to={`/study?level=${topic.level}&topic=${topic.id}`}
                          key={topic.id}
                          className="lesson-card"
                          style={{ animationDelay: `${ti * 40}ms` }}
                        >
                          <div className="lesson-card-top">
                            <span className="lesson-icon">{topic.icon}</span>
                            <span className={`lesson-pct ${pct >= 100 ? 'done' : ''}`}>{pct}%</span>
                          </div>
                          <div className="lesson-name">{topic.name}</div>
                          <div className="lesson-count">{known}/{total} từ</div>
                          <div className="progress-bar-container" style={{ height: '5px' }}>
                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: topic.gradient }} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Streak calendar */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <h2 className="section-title">📅 30 ngày gần nhất</h2>
              <span className="badge badge-yellow">🔥 {streakDays} streak</span>
            </div>
            <StreakCalendar dailyProgress={dailyProgress} />
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
                  const source = getQuizSource(q.topicId, topics, customDecks);
                  const pct = Math.round((q.score / q.total) * 100);
                  return (
                    <div key={i} className="flex items-center justify-between" style={{ padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div className="flex items-center gap-md">
                        <span>{source.icon}</span>
                        <span style={{ fontSize: '0.9rem' }}>{source.label}</span>
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

        {/* ───────── Right rail ───────── */}
        <aside className="home-side">
          {/* Từ của ngày */}
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

          {/* Mục tiêu hôm nay */}
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

          {/* Câu giao tiếp hôm nay */}
          {dSentence && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 className="section-title" style={{ fontSize: '1rem', margin: 0 }}>💬 Câu giao tiếp hôm nay</h2>
                <div className="flex items-center" style={{ gap: '6px' }}>
                  <span className="badge badge-yellow">Ngày {dsIndex + 1}/{dsTotal}</span>
                  <span className="badge badge-purple">{dSentence.tag}</span>
                  {dsLearned && <span className="badge badge-green">✅ Đã thuộc</span>}
                </div>
              </div>

              {dsHideEn ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '10px' }}>
                    Nhớ lại câu {isJapanese ? 'tiếng Nhật' : 'tiếng Anh'} trước khi xem đáp án...
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setDsHideEn(false)}>👁 Hiện câu {isJapanese ? 'tiếng Nhật' : 'tiếng Anh'}</button>
                </div>
              ) : (
                <div className="daily-sentence-condensed">{dSentence.en}</div>
              )}

              <div className="text-muted" style={{ fontSize: '0.82rem', fontStyle: 'italic', marginTop: '6px' }}>
                {dSentence.pron}
              </div>
              <div className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                🇻🇳 {dSentence.vi}
              </div>

              <div className="flex items-center" style={{ gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setDsOffset(o => o - 1)}>← Trước</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setDsOffset(o => o + 1)}>Sau →</button>
                {dsOffset !== 0 && (
                  <button className="btn btn-secondary btn-sm" onClick={() => setDsOffset(0)}>📍 Hôm nay</button>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => speak(dSentence.en, 0.85)}>🔊 Nghe</button>
                <button className="btn btn-secondary btn-sm" onClick={() => speak(dSentence.en, 0.55)}>🐢 Chậm</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setDsHideEn(h => !h)}>
                  {dsHideEn ? '👁 Hiện câu' : '🧠 Tự nhớ lại'}
                </button>
                <button
                  className={`btn btn-sm ${dsLearned ? 'btn-ghost' : 'btn-secondary'}`}
                  style={{ marginLeft: 'auto' }}
                  onClick={() => toggleSentenceLearned(dSentence.id)}
                >
                  {dsLearned ? '✓ Đã thuộc' : 'Đánh dấu đã thuộc'}
                </button>
              </div>

              <details style={{ marginTop: '14px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>
                  📘 Phân tích ngữ pháp trong câu
                </summary>
                <div className="grammar-formula" style={{ margin: '12px 0 10px' }}>{dSentence.grammar.name}</div>
                <p style={{ lineHeight: 1.7, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {dSentence.grammar.explanation}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  {dSentence.breakdown.map((b, i) => (
                    <div key={i} className="breakdown-item">
                      <div className="b-part">{b.part}</div>
                      <div className="b-note">{b.note}</div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}

          {/* Mẹo ngữ pháp */}
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

          {/* Lộ trình luyện thi */}
          <Link to="/roadmap" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ marginBottom: '24px', cursor: 'pointer' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <h2 className="section-title" style={{ fontSize: '1rem' }}>🗺️ Lộ trình luyện thi</h2>
                <span className="badge badge-purple">{roadmaps.length} lộ trình</span>
              </div>
              <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
                {roadmaps.map(r => `${r.icon} ${r.name}`).join(' • ')}
                {' '}— luyện theo từng mốc điểm, có tiến độ riêng cho mỗi giai đoạn.
              </div>
              <div className="grammar-start mt-md">Chọn lộ trình của bạn →</div>
            </div>
          </Link>

          {/* Level / XP */}
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

      {/* ═══════════════════════════════════════════
          QUICK ACTIONS ROW
          ═══════════════════════════════════════════ */}
      <div className="hp-quick-actions">
        <Link to="/roadmap" className="btn btn-primary">🗺️ Lộ trình luyện thi</Link>
        <Link to="/study" className="btn btn-secondary">📚 Học từ vựng</Link>
        <Link to="/quiz" className="btn btn-secondary">🎯 Làm quiz</Link>
        <Link to="/my-decks" className="btn btn-secondary">🗂️ Bộ từ của tôi</Link>
        <Link to="/games" className="btn btn-secondary">🎮 Game</Link>
        <Link to="/listening" className="btn btn-secondary">🎧 Luyện nghe</Link>
        <Link to="/study?starred=1" className="btn btn-secondary">⭐ Từ đã đánh dấu</Link>
      </div>
    </div>
  );
}