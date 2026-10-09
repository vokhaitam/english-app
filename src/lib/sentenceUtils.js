// Tách câu thành các mẩu để game xếp câu.
// Tiếng Anh tách theo khoảng trắng; tiếng Nhật không có khoảng trắng
// nên dùng Intl.Segmenter (tách từ thật, hỗ trợ cả trình duyệt lẫn Node).

export function tokenizeSentence(text, ja) {
  if (!ja) return String(text).split(/\s+/).filter(Boolean);
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter('ja', { granularity: 'word' });
    const out = [];
    for (const { segment } of seg.segment(String(text))) {
      // Bỏ dấu câu/spaces, giữ lại mẩu có chữ.
      if (/[\p{L}\p{N}]/u.test(segment)) out.push(segment);
    }
    if (out.length >= 2) return out;
  }
  return [String(text)];
}

// Câu đủ mẩu để game xếp câu có ý nghĩa (tiếng Nhật hay tách ra 1 từ).
export function playableSentences(list, ja, minTokens = 3) {
  if (!ja) return list;
  return list.filter(s => tokenizeSentence(s.en, true).length >= minTokens);
}
