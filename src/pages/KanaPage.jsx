import React, { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Katakana = Hiragana + 0x60, nên bảng suy ra từ bảng hiragana để không lệch ký tự.
const toKatakana = (s) => String.fromCodePoint(s.codePointAt(0) + 0x60);

const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

const VOWELS = ['a', 'i', 'u', 'e', 'o'];
const VOWEL_LABELS = { a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お' };

function KanaCell({ item, script, onPick, picked }) {
  const glyph = script === 'katakana' ? toKatakana(item.kana) : item.kana;
  return (
    <button
      type="button"
      className={`kana-cell ${picked ? 'picked' : ''}`}
      onClick={() => onPick(item, glyph)}
      title={`${item.kana} = ${item.romaji}`}
    >
      <span className="kana-glyph">{glyph}</span>
      <span className="kana-romaji">{item.romaji}</span>
    </button>
  );
}

function RowBlock({ row, script, onPick, picked }) {
  const cells = row.cells.filter(Boolean);
  // Ô trống ở hàng ya/wa chỉ để giữ đúng hình dạng bảng gốc, không cần hiện.
  const voiced = row.voiced;
  const semi = row.semi;
  return (
    <div className="kana-row-block">
      <div className="kana-row-head">
        <span className="kana-row-label">{row.row}</span>
        <span className="kana-row-vowels">
          {VOWELS.map(v => (
            <span key={v} title={v}>{VOWEL_LABELS[v]}</span>
          ))}
        </span>
      </div>
      <div className="kana-row">
        {cells.map(item => (
          <KanaCell key={`${script}-${item.kana}`} item={item} script={script} onPick={onPick} picked={picked} />
        ))}
        {voiced && (
          <div className="kana-voiced-group">
            {voiced.map(item => (
              <KanaCell key={`${script}-${item.kana}`} item={item} script={script} onPick={onPick} picked={picked} />
            ))}
          </div>
        )}
        {semi && (
          <div className="kana-semi-group">
            {semi.map(item => (
              <KanaCell key={`${script}-${item.kana}`} item={item} script={script} onPick={onPick} picked={picked} />
            ))}
          </div>
        )}
      </div>
      {row.extra && (
        <div className="kana-extra">
          {row.extra.map(item => (
            <KanaCell key={`${script}-${item.kana}`} item={item} script={script} onPick={onPick} picked={picked} />
          ))}
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: 'hiragana', label: 'Hiragana', hint: 'Nhật bản dùng ký tự này, 46 âm cơ bản' },
  { id: 'katakana', label: 'Katakana', hint: 'Dùng cho từ vựng nước ngoài, tên riêng' },
  { id: 'practice', label: 'Luyện tập', hint: 'Nghe âm thanh, tự nhận ký tự đúng' },
  { id: 'reference', label: 'Bảng tra nhanh', hint: 'Lượng từ đếm, số và chia động từ' },
];

export default function KanaPage() {
  const { kana, isJapanese, selectLanguage, pack } = useLanguage();
  const [tab, setTab] = useState('hiragana');
  const [picked, setPicked] = useState(null);
  const [drill, setDrill] = useState({ queue: [], index: 0, answer: null, score: { ok: 0, no: 0 } });

  const onPick = useCallback((item, glyph) => {
    setPicked({ kana: item.kana, glyph, romaji: item.romaji });
  }, []);

  // Trang này chỉ có ở gói Nhật: chuyển sang Nhật thay vì render trang rỗng.
  if (!isJapanese || !kana) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">🔤 Bảng Kana</h1>
          <p className="page-subtitle">Mục này chỉ dành cho gói tiếng Nhật.</p>
        </div>
        <div className="card">
          <p className="text-muted" style={{ marginBottom: '16px' }}>
            Bạn đang học <strong>{pack.name}</strong>. Chuyển sang tiếng Nhật để xem bảng kana và luyện đọc.
          </p>
          <button className="btn btn-primary" onClick={() => selectLanguage('ja')}>
            Chuyển sang 日本語
          </button>
        </div>
      </div>
    );
  }

  // Đáp án được sinh một lần lúc bắt đầu vòng luyện, không random trong render
  // để giữ component thuần cho React Compiler.
  const startDrill = () => {
    const pool = kana.chart.filter(c => !c.particle);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const queue = shuffled.map(item => {
      const distractors = shuffled
        .filter(c => c.kana !== item.kana)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(c => c.kana);
      return { item, options: shuffle([item.kana, ...distractors]) };
    });
    setDrill({ queue, index: 0, answer: null, score: { ok: 0, no: 0 } });
    setPicked(null);
  };

  const current = drill.queue[drill.index];
  const answer = (glyph) => {
    if (!current || drill.answer) return;
    const ok = glyph === current.item.kana;
    setDrill(prev => ({
      ...prev,
      answer: { glyph, ok },
      score: { ok: prev.score.ok + (ok ? 1 : 0), no: prev.score.no + (ok ? 0 : 1) },
    }));
  };

  const nextDrill = () => {
    setDrill(prev => ({ ...prev, index: prev.index + 1, answer: null }));
  };

  const drillDone = drill.queue.length > 0 && drill.index >= drill.queue.length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">🔤 Bảng Kana</h1>
        <p className="page-subtitle">46 âm cơ bản, âm nhỏ và luyện đọc trước khi học từ vựng</p>
      </div>

      <div className="kana-tabs" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`kana-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => { setTab(t.id); setPicked(null); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {picked && (
        <div className="kana-picked" role="status">
          <span className="kana-picked-glyph">{picked.glyph}</span>
          <span className="kana-picked-romaji">{picked.romaji}</span>
          <span className="kana-picked-hira">{picked.kana}</span>
        </div>
      )}

      {(tab === 'hiragana' || tab === 'katakana') && (
        <div className="card">
          <p className="text-muted kana-hint">
            {TABS.find(t => t.id === tab).hint}. Bấm một ô để xem cách đọc.
          </p>
          <div className="kana-table">
            {kana.rows.map(row => (
              <RowBlock
                key={`${tab}-${row.id}`}
                row={row}
                script={tab}
                onPick={onPick}
                picked={picked?.kana}
              />
            ))}
          </div>
          <div className="kana-legend">
            <span><strong>がぎぐげご</strong> là き・し・ち・ひの hàng khi thêm dấu ゛</span>
            <span><strong>ぱぴぷぺぽ</strong> là は行 khi thêm dấu ゜</span>
          </div>
        </div>
      )}

      {tab === 'practice' && (
        <div className="card">
          <p className="text-muted kana-hint">
            Nghe hoặc nhìn romaji, rồi bấm đúng ký tự hira/katakana. Làm hết một vòng để xem điểm.
          </p>

          {drill.queue.length === 0 && (
            <button className="btn btn-primary" onClick={startDrill}>Bắt đầu luyện tập</button>
          )}

          {drill.queue.length > 0 && !drillDone && (
            <>
              <div className="kana-drill-score">
                <span className="badge badge-green">Đúng {drill.score.ok}</span>
                <span className="badge badge-red">Sai {drill.score.no}</span>
                <span className="text-muted">{drill.index + 1}/{drill.queue.length}</span>
              </div>
              <div className="kana-drill-card">
                <div className="kana-drill-prompt">{current.item.romaji}</div>
                <div className="kana-drill-options">
                  {current.options.map(k => (
                    <button
                      key={k}
                      type="button"
                      className={`kana-option ${drill.answer?.glyph === k ? (drill.answer.ok ? 'right' : 'wrong') : ''}`}
                      onClick={() => answer(k)}
                      disabled={Boolean(drill.answer)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
                {drill.answer && (
                  <div className="kana-drill-feedback">
                    {drill.answer.ok
                      ? <>Đúng rồi. <strong>{current.item.kana}</strong> đọc là <strong>{current.item.romaji}</strong>.</>
                      : <>Đáp án là <strong>{current.item.kana}</strong> ({current.item.romaji}), bạn đã bấm <strong>{drill.answer.glyph}</strong>.</>}
                    <button className="btn btn-primary btn-sm" onClick={nextDrill}>
                      {drill.index + 1 >= drill.queue.length ? 'Xem kết quả' : 'Tiếp'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {drillDone && (
            <div className="kana-drill-result">
              <p><strong>{drill.score.ok}</strong> đúng / <strong>{drill.score.no}</strong> sai trong {drill.queue.length} câu.</p>
              <button className="btn btn-primary" onClick={startDrill}>Làm lại</button>
            </div>
          )}
        </div>
      )}

      {tab === 'reference' && (
        <div className="kana-reference">
          <div className="card">
            <h2 className="section-title">🔡 Âm nhỏ và âm đặc biệt</h2>
            <div className="kana-chip-row">
              {kana.yoon.map(k => (
                <span key={k.kana} className="kana-chip">
                  <strong>{k.kana}</strong>
                  <small>{k.romaji}</small>
                  <em>{k.note}</em>
                </span>
              ))}
              {kana.special.map(k => (
                <span key={k.kana} className="kana-chip">
                  <strong>{k.kana}</strong>
                  <small>{k.romaji}</small>
                  <em>{k.note}</em>
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">🔢 Số và cách đọc</h2>
            <table className="kana-table-data">
              <thead>
                <tr><th>Số</th><th>Đọc</th><th>Romaji</th><th>Ghi chú</th></tr>
              </thead>
              <tbody>
                {kana.numberWords.map(n => (
                  <tr key={n.kanji}>
                    <td className="jp-cell">{n.kanji}</td>
                    <td className="jp-cell">{n.kana}</td>
                    <td>{n.romaji}</td>
                    <td className="text-muted">{n.note || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2 className="section-title">🧮 Lượng từ đếm</h2>
            <table className="kana-table-data">
              <thead>
                <tr><th>Lượng từ</th><th>Đọc</th><th>Dùng cho</th><th>Ví dụ</th><th>Nghĩa</th></tr>
              </thead>
              <tbody>
                {kana.counters.map(c => (
                  <tr key={`${c.kanji}-${c.read}-${c.count}`}>
                    <td className="jp-cell">{c.kanji}</td>
                    <td className="jp-cell">{c.read}</td>
                    <td>{c.count}</td>
                    <td className="jp-cell">{c.example}</td>
                    <td>{c.mean}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="kana-rules">
              {kana.countingRules.map(r => (
                <li key={r.range}><strong>{r.range}:</strong> {r.text}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="section-title">⚡ Chia động từ</h2>
            <div className="kana-verb-groups">
              {Object.entries(kana.verbClasses).map(([key, g]) => (
                <div key={key} className="kana-verb-group">
                  <div className="kana-verb-label">{g.label}</div>
                  <p className="text-muted">{g.rule}</p>
                  <div className="kana-chip-row">
                    {g.endings.map(e => (
                      <span key={e} className="kana-chip small">
                        <strong className="jp-cell">{e}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}