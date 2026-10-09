import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { roadmaps, getRoadmap } from '../data/roadmaps';
import { jaRoadmaps, getJaRoadmap } from '../data/ja-roadmaps';
import Reveal from '../components/Reveal';

function stageStats(stage, vocabulary, getTopicProgress) {
  const topics = stage.topics.filter(t => vocabulary[t]);
  const total = topics.reduce((sum, t) => sum + vocabulary[t].length, 0);
  const known = topics.reduce((sum, t) => sum + getTopicProgress(t), 0);
  return { total, known, pct: total > 0 ? Math.round((known / total) * 100) : 0 };
}

function roadmapStats(roadmap, vocabulary, getTopicProgress) {
  const unique = [...new Set(roadmap.stages.flatMap(s => s.topics))];
  const topics = unique.filter(t => vocabulary[t]);
  const total = topics.reduce((sum, t) => sum + vocabulary[t].length, 0);
  const known = topics.reduce((sum, t) => sum + getTopicProgress(t), 0);
  const doneStages = roadmap.stages.filter(s => {
    const st = stageStats(s, vocabulary, getTopicProgress);
    return st.total > 0 && st.known >= st.total;
  }).length;
  return {
    total,
    known,
    pct: total > 0 ? Math.round((known / total) * 100) : 0,
    doneStages,
  };
}

export default function RoadmapPage() {
  const { vocabulary, topics, isJapanese } = useLanguage();
  const { getTopicProgress } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = (isJapanese ? getJaRoadmap : getRoadmap)(searchParams.get('id'));

  // ---- CHI TIẾT MỘT LỘ TRÌNH — Timeline style ----
  if (selected) {
    const stats = roadmapStats(selected, vocabulary, getTopicProgress);
    const goBack = () => {
      searchParams.delete('id');
      setSearchParams(searchParams, { replace: true });
    };

    return (
      <div className="fade-in">
        {/* Header */}
        <div className="rm-detail-header">
          <button className="btn btn-ghost btn-sm rm-back-btn" onClick={goBack}>
            ← Tất cả lộ trình
          </button>

          <div className="rm-detail-hero" style={{ background: selected.gradient }}>
            <span className="rm-detail-hero-blob" aria-hidden="true" />
            <div className="rm-detail-hero-content">
              <div className="rm-detail-icon">{selected.icon}</div>
              <div>
                <h1 className="rm-detail-name">{selected.name}</h1>
                <div className="rm-detail-target">{selected.target}</div>
                <p className="rm-detail-desc">{selected.desc}</p>
              </div>
            </div>
            {/* Overall progress */}
            <div className="rm-overall-progress">
              <div className="rm-overall-row">
                <span className="rm-overall-label">Tiến trình tổng thể</span>
                <span className="rm-overall-pct">{stats.pct}%</span>
              </div>
              <div className="rm-overall-bar">
                <div className="rm-overall-fill" style={{ width: `${stats.pct}%` }} />
              </div>
              <div className="rm-overall-sub">
                {stats.known}/{stats.total} từ vựng •{' '}
                {stats.doneStages}/{selected.stages.length} giai đoạn hoàn thành
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="rm-timeline">
          {selected.stages.map((stage, idx) => {
            const st = stageStats(stage, vocabulary, getTopicProgress);
            const isDone = st.total > 0 && st.known >= st.total;
            const isActive = !isDone && (
              idx === 0 ||
              (() => {
                const prevSt = stageStats(selected.stages[idx - 1], vocabulary, getTopicProgress);
                return prevSt.known > 0;
              })()
            );
            const nextTopic =
              stage.topics.find(t => vocabulary[t] && getTopicProgress(t) < vocabulary[t].length) ||
              stage.topics.find(t => vocabulary[t]);
            const nextTopicData = topics.find(t => t.id === nextTopic);

            return (
              <Reveal key={stage.id} delay={idx * 80}>
                <div className={`rm-timeline-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                  {/* Connector line */}
                  {idx < selected.stages.length - 1 && (
                    <div className={`rm-timeline-line ${isDone ? 'done' : ''}`} aria-hidden="true" />
                  )}

                  {/* Stage node */}
                  <div className="rm-stage-node" style={{ background: isDone ? 'var(--accent-green)' : selected.gradient }}>
                    {isDone ? '✓' : idx + 1}
                  </div>

                  {/* Stage card */}
                  <div className="rm-stage-card">
                    {/* Stage header */}
                    <div className="rm-stage-head">
                      <div className="rm-stage-head-left">
                        <div className="rm-stage-title-row">
                          <span className="rm-stage-title">{stage.title}</span>
                          {isDone && <span className="badge badge-green">✅ Hoàn thành</span>}
                          {isActive && !isDone && <span className="rm-active-badge">Đang học</span>}
                        </div>
                        <div className="rm-stage-target-badge" style={{ background: selected.gradient }}>
                          {stage.target}
                        </div>
                        <p className="rm-stage-desc">{stage.desc}</p>
                      </div>
                      {/* Circular progress */}
                      <div className="rm-stage-ring">
                        <svg viewBox="0 0 60 60">
                          <circle cx="30" cy="30" r="24" className="rm-ring-track" />
                          <circle
                            cx="30" cy="30" r="24"
                            className="rm-ring-fill"
                            style={{
                              stroke: isDone ? 'var(--accent-green)' : 'var(--accent-primary)',
                              strokeDasharray: `${1.507 * st.pct} ${150.7 - 1.507 * st.pct}`,
                              strokeDashoffset: '37.7',
                            }}
                          />
                        </svg>
                        <div className="rm-ring-txt">{st.pct}%</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="rm-stage-progress">
                      <div className="rm-stage-progress-bar">
                        <div
                          className="rm-stage-progress-fill"
                          style={{
                            width: `${st.pct}%`,
                            background: isDone ? 'var(--accent-green)' : selected.gradient,
                          }}
                        />
                      </div>
                      <span className="rm-stage-progress-label">{st.known}/{st.total} từ</span>
                    </div>

                    {/* Topic chips */}
                    <div className="rm-stage-topics">
                      {stage.topics.filter(t => vocabulary[t]).map(t => {
                        const data = topics.find(x => x.id === t);
                        const known = getTopicProgress(t);
                        const total = vocabulary[t].length;
                        const full = known >= total;
                        return (
                          <Link
                            key={t}
                            to={`/study?level=${data?.level || ''}&topic=${t}`}
                            className={`rm-topic-chip ${full ? 'full' : ''}`}
                            title={`${data?.name} — ${known}/${total} từ`}
                          >
                            <span className="rm-chip-icon">{data?.icon}</span>
                            <span className="rm-chip-name">{data?.name}</span>
                            <span className="rm-chip-count">{known}/{total}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    {nextTopic && (
                      <div className="rm-stage-cta">
                        <Link
                          to={`/study?level=${nextTopicData?.level || ''}&topic=${nextTopic}`}
                          className={`btn ${isDone ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                        >
                          {isDone ? '🔄 Ôn lại giai đoạn' : `▶ Học tiếp: ${nextTopicData?.name}`}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- DANH SÁCH LỘ TRÌNH ----
  const roadmapList = isJapanese ? jaRoadmaps : roadmaps;
  return (
    <div className="fade-in">
      {/* Page hero */}
      <div className="rm-list-hero">
        <span className="rm-list-hero-blob rm-list-hero-blob-1" aria-hidden="true" />
        <span className="rm-list-hero-blob rm-list-hero-blob-2" aria-hidden="true" />
        <div className="rm-list-hero-content">
          <div className="hp-section-eyebrow">🗺️ Luyện thi chuyên sâu</div>
          <h1 className="rm-list-title">Chọn lộ trình của bạn</h1>
          <p className="rm-list-subtitle">
            {isJapanese
              ? 'Lộ trình JLPT bài bản theo từng cấp độ N5 → N3, học có hệ thống'
              : 'Lộ trình TOEIC & IELTS theo từng mốc điểm, từ vựng phân cấp rõ ràng'}
          </p>
        </div>
      </div>

      {/* Roadmap cards */}
      <div className="rm-list-grid">
        {roadmapList.map((rm, i) => {
          const stats = roadmapStats(rm, vocabulary, getTopicProgress);
          return (
            <Reveal key={rm.id} delay={i * 100}>
              <div
                className="rm-list-card"
                onClick={() => setSearchParams({ id: rm.id })}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSearchParams({ id: rm.id })}
              >
                {/* Top banner */}
                <div className="rm-list-card-top" style={{ background: rm.gradient }}>
                  <span className="rm-list-card-blob" aria-hidden="true" />
                  <div className="rm-list-card-top-content">
                    <div className="rm-list-card-icon">{rm.icon}</div>
                    <div>
                      <div className="rm-list-card-name">{rm.name}</div>
                      <div className="rm-list-card-target">{rm.target}</div>
                    </div>
                  </div>
                  {/* Stage dots */}
                  <div className="rm-list-stage-dots">
                    {rm.stages.map((s, si) => {
                      const st = stageStats(s, vocabulary, getTopicProgress);
                      return (
                        <div
                          key={s.id}
                          className={`rm-list-dot ${st.known >= st.total && st.total > 0 ? 'done' : st.known > 0 ? 'partial' : ''}`}
                          title={s.target}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Body */}
                <div className="rm-list-card-body">
                  <p className="rm-list-card-desc">{rm.desc}</p>

                  {/* Stats row */}
                  <div className="rm-list-card-stats">
                    <div className="rm-list-card-stat">
                      <span className="rm-list-card-stat-val">{rm.stages.length}</span>
                      <span className="rm-list-card-stat-lbl">giai đoạn</span>
                    </div>
                    <div className="rm-list-card-stat">
                      <span className="rm-list-card-stat-val">{stats.total}</span>
                      <span className="rm-list-card-stat-lbl">từ vựng</span>
                    </div>
                    <div className="rm-list-card-stat">
                      <span className="rm-list-card-stat-val" style={{ color: 'var(--accent-primary)' }}>
                        {stats.doneStages}
                      </span>
                      <span className="rm-list-card-stat-lbl">đã xong</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="rm-list-progress-row">
                    <div className="rm-list-progress-bar">
                      <div
                        className="rm-list-progress-fill"
                        style={{ width: `${stats.pct}%`, background: rm.gradient }}
                      />
                    </div>
                    <span className={`badge ${stats.pct >= 100 ? 'badge-green' : 'badge-purple'}`}>
                      {stats.pct}%
                    </span>
                  </div>

                  <div className="rm-list-cta">
                    Xem lộ trình chi tiết →
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Info strip */}
      <Reveal>
        <div className="rm-info-strip">
          <div className="rm-info-item">
            <div className="rm-info-icon">🎯</div>
            <div>
              <div className="rm-info-title">Học có mục tiêu</div>
              <div className="rm-info-desc">Từ vựng được phân loại theo từng mốc điểm cụ thể</div>
            </div>
          </div>
          <div className="rm-info-item">
            <div className="rm-info-icon">🃏</div>
            <div>
              <div className="rm-info-title">Flashcard thông minh</div>
              <div className="rm-info-desc">Kết hợp Spaced Repetition để ghi nhớ lâu hơn</div>
            </div>
          </div>
          <div className="rm-info-item">
            <div className="rm-info-icon">📊</div>
            <div>
              <div className="rm-info-title">Theo dõi tiến độ</div>
              <div className="rm-info-desc">Biểu đồ và thống kê chi tiết từng giai đoạn</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
