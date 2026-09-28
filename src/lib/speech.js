let audioEl = null;
let voices = [];
let speakSeq = 0;

function getAudio() {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = 'auto';
  }
  return audioEl;
}

function stopSpeech() {
  speakSeq += 1;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  const el = getAudio();
  el.pause();
  el.onended = null;
  el.onerror = null;
  el.removeAttribute('src');
  el.load();
}

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  voices = window.speechSynthesis.getVoices();
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Preferred voices, from most natural/human to least. Falls back down the list.
const NICE_RANK = [
  'Microsoft Aria-Online (Natural)',
  'Microsoft Aria Online (Natural)',
  'Microsoft Aria',
  'Google UK English Female',
  'Google US English',
  'Microsoft Jenny Online (Natural)',
  'Microsoft Libby Online (Natural)',
  'Microsoft Sonia Online (Natural)',
  'Samantha',
  'Karen',
  'Moira',
  'Tessa',
  'Fiona',
  'Microsoft Zira',
];

function pickNiceEnglishVoice() {
  const en = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  if (en.length === 0) return null;

  for (const name of NICE_RANK) {
    const hit = en.find(v => v.name && v.name.toLowerCase().includes(name.toLowerCase()));
    if (hit) return hit;
  }

  const natural = en.find(v => /natural|online|neural|premium/i.test(v.name));
  if (natural) return natural;

  const female = en.find(v => /female|woman|girl/i.test(v.name));
  if (female) return female;

  return en[0];
}

function speakNative(text, rate) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve(false);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    synth.resume(); // Chrome workaround: sometimes hangs until resume

    const u = new SpeechSynthesisUtterance(text);
    const voice = pickNiceEnglishVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = 'en-US';
    }
    u.rate = rate;
    u.pitch = 1;
    u.volume = 1;
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    synth.speak(u);
  });
}

function playPart(text, rate) {
  const el = getAudio();
  el.playbackRate = Math.max(0.25, Math.min(2, rate));
  el.src = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`;
  return el.play().then(
    () => new Promise((resolve) => {
      el.onended = resolve;
      el.onerror = resolve;
    }),
    () => { throw new Error('Google TTS refused'); }
  );
}

function splitText(text, max = 150) {
  if (text.length <= max) return [text];
  const raw = text.match(/[^.!?]+[.!?]+/g) || [text];
  const parts = [];
  let cur = '';
  for (const s of raw) {
    if ((cur + s).length <= max) {
      cur += s;
    } else {
      if (cur) parts.push(cur.trim());
      cur = s.length <= max ? s : s.slice(0, max);
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

export function speak(text, rate = 0.85) {
  if (!text) return Promise.resolve();
  stopSpeech();
  const seq = speakSeq;
  let p = Promise.resolve();
  for (const part of splitText(text)) {
    p = p.then(async () => {
      if (seq !== speakSeq) return;
      const ok = await speakNative(part, rate);
      if (ok || seq !== speakSeq) return;
      await playPart(part, rate).catch(() => {});
    });
  }
  return p;
}