import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function TopicSelector({ selectedTopic, onSelect, progress = {}, topics: topicList }) {
  const { topics, vocabulary } = useLanguage();
  const list = topicList || topics;
  return (
    <div className="topic-grid">
      {list.map(topic => {
        const done = progress[topic.id]?.known || 0;
        const total = vocabulary[topic.id]?.length || 0;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <div
            key={topic.id}
            className={`topic-card ${selectedTopic === topic.id ? 'selected' : ''}`}
            style={{
              '--topic-gradient': topic.gradient,
            }}
            onClick={() => onSelect(topic.id)}
          >
            {/* Top bar indicator */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: topic.gradient,
              borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            }} />

            <div className="topic-icon">{topic.icon}</div>
            <div className="topic-name">{topic.name}</div>
            <div className="topic-count">{total} từ vựng</div>

            {/* Mini progress */}
            {done > 0 && (
              <div style={{ marginTop: '8px', width: '100%' }}>
                <div className="progress-bar-container" style={{ height: '4px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: topic.gradient,
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {done}/{total} đã học
                </div>
              </div>
            )}

            {selectedTopic === topic.id && (
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: topic.gradient,
                boxShadow: `0 0 10px ${topic.color}`,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
