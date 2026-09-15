export const grammarLessons = [
  {
    id: 'present-simple-continuous',
    icon: '⏰',
    title: 'Hiện tại đơn & Hiện tại tiếp diễn',
    tag: 'B1',
    explanation: `Present Simple dùng để nói về sự thật, thói quen hoặc lịch trình cố định.
Present Continuous dùng để nói về hành động đang xảy ra ngay lúc nói hoặc kế hoạch gần.`,
    formula: ['Present Simple:  S + V(s/es) + O', 'Present Continuous:  S + am/is/are + V-ing + O'],
    signals: [
      { tense: 'Present Simple', words: ['always', 'usually', 'often', 'sometimes', 'never', 'every day / week', 'on Mondays', 'generally', 'twice a month'] },
      { tense: 'Present Continuous', words: ['now', 'right now', 'at the moment', 'Look!', 'Listen!', 'currently', 'these days', 'this week', 'today'] },
    ],
    examples: [
      ['He works in a bank. (thói quen / sự thật)', 'He is working in the garden now. (đang xảy ra)'],
      ['The train leaves at 8 am. (lịch trình)', 'Look! The train is leaving. (ngay lúc nói)'],
    ],
    practice: [
      {
        q: 'Choose the correct sentence:',
        options: [
          'I am usually getting up at 6.',
          'I usually get up at 6.',
          'I usually getting up at 6.',
          'I am usually get up at 6.',
        ],
        answerIndex: 1,
        explanation: 'Từ "usually" → thói quen → dùng Present Simple.',
      },
      {
        q: 'My sister ______ a book at the moment.',
        options: ['reads', 'read', 'is reading', 'reading'],
        answerIndex: 2,
        explanation: '"at the moment" → đang xảy ra → Present Continuous: is reading.',
      },
    ],
  },
  {
    id: 'past-present-perfect',
    icon: '🕰️',
    title: 'Quá khứ đơn & Hiện tại hoàn thành',
    tag: 'B1',
    explanation: `Past Simple dùng cho việc đã hoàn thành, thường có mốc thời gian rõ ràng.
Present Perfect dùng cho kinh nghiệm sống, kết quả hiện tại, hoặc hành động vừa xảy ra (không có thời điểm cụ thể).`,
    formula: ['Past Simple:  S + V2 / V-ed + (time)', 'Present Perfect:  S + have/has + V3/V-ed'],
    signals: [
      { tense: 'Past Simple', words: ['yesterday', 'last night / week / year', 'two days ago', 'in 2019', 'in the past', 'just now', 'when I was young'] },
      { tense: 'Present Perfect', words: ['already', 'yet', 'just', 'ever', 'never', 'since 2020', 'for 5 years', 'so far', 'recently', 'lately', 'up to now'] },
    ],
    examples: [
      ['I saw that movie last night. (có "last night")', 'I have seen that movie before. (no time)'],
      ['She went to London in 2019.', 'She has been to London three times.'],
    ],
    practice: [
      {
        q: 'She ______ to London in 2019.',
        options: ['has gone', 'went', 'goes', 'going'],
        answerIndex: 1,
        explanation: '"in 2019" → mốc thời gian rõ → Past Simple: went.',
      },
      {
        q: 'Have you ever ______ sushi?',
        options: ['eat', 'ate', 'eaten', 'eating'],
        answerIndex: 2,
        explanation: 'Sau have/has dùng V3 (p.p): eaten.',
      },
    ],
  },
  {
    id: 'future-forms',
    icon: '🚀',
    title: 'Tương lai: will vs going to',
    tag: 'B1',
    explanation: `Will dùng cho quyết định tức thì, dự đoán, lời hứa.
Going to dùng cho kế hoạch/dự định đã có từ trước, hoặc dự đoán dựa trên bằng chứng hiện tại.`,
    formula: ['S + will + V (nguyên mẫu)', 'S + am/is/are going to + V'],
    signals: [
      { tense: 'will', words: ['I think...', 'I guess...', 'probably', 'maybe', 'I promise', 'I"m sure', 'one day', 'tomorrow (dự đoán)'] },
      { tense: 'going to', words: ['Look at those clouds!', 'I have decided...', 'next week / month (kế hoạch rõ)', 'bằng chứng hiện tại rõ ràng'] },
    ],
    examples: [
      ['"The phone is ringing." → I\'ll answer it. (quyết định ngay)', 'I\'m going to visit Hanoi next week. (kế hoạch)'],
      ['Look at those clouds — it\'s going to rain. (bằng chứng)', 'I think it will rain tomorrow. (dự đoán)'],
    ],
    practice: [
      {
        q: 'Look at those clouds! It ______ rain.',
        options: ['will', 'is going to', 'is', 'does'],
        answerIndex: 1,
        explanation: 'Nhìn thấy bằng chứng (mây đen) → going to: "It\'s going to rain."',
      },
      {
        q: 'I think she ______ pass the exam.',
        options: ['will', 'is going to', 'is', 'does'],
        answerIndex: 0,
        explanation: 'Dự đoán cá nhân (I think...) → will.',
      },
    ],
  },
  {
    id: 'modals',
    icon: '🎫',
    title: 'Động từ khuyết thiếu (Modals)',
    tag: 'B1',
    explanation: `Can/Could: khả năng.
Should: lời khuyên.
Must/Have to: bắt buộc.
Mustn't/Had better not: cấm.
Might/Could: khả năng có thể xảy ra.`,
    formula: ['S + can/could/should/must/might + V (nguyên mẫu)', 'S + have to + V (nguyên mẫu)'],
    examples: [
      ['You should drink more water. (lời khuyên)', 'You mustn\'t smoke here. (cấm)'],
      ['I can swim. (khả năng)', 'She might come late. (khả năng)'],
    ],
    practice: [
      {
        q: 'You ______ smoke in the hospital.',
        options: ['should', 'can', 'mustn\'t', 'might'],
        answerIndex: 2,
        explanation: 'Trong bệnh viện → cấm hút thuốc → mustn\'t.',
      },
      {
        q: '______ you help me, please?',
        options: ['May not', 'Could', 'Must', 'Should'],
        answerIndex: 1,
        explanation: 'Câu nhờ vả lịch sự: "Could you help me?"',
      },
    ],
  },
  {
    id: 'comparatives',
    icon: '📏',
    title: 'So sánh hơn & So sánh nhất',
    tag: 'B1',
    explanation: `Tính từ ngắn (1 âm tiết): + er / + est.
Tính từ dài (2+ âm tiết): more / the most.
Irregular: good→better→the best, bad→worse→the worst, far→farther/further→the farthest/furthest.`,
    formula: ['So sánh hơn: A + tobe + adj-er + than B', 'So sánh nhất: A + tobe + the adj-est + (in/of...)'],
    examples: [
      ['This book is cheaper than that one.', 'She is the tallest in her class.'],
      ['Today is hotter than yesterday.', 'It is the most expensive shop in town.'],
    ],
    practice: [
      {
        q: 'Hanoi is ______ than Ho Chi Minh City.',
        options: ['smaller', 'more small', 'smallerest', 'the smallest'],
        answerIndex: 0,
        explanation: '"small" ngắn → so sánh hơn: smaller + than.',
      },
      {
        q: 'This is the ______ restaurant in town.',
        options: ['gooder', 'best', 'most good', 'goodest'],
        answerIndex: 1,
        explanation: 'good → irregular: best (so sánh nhất).',
      },
    ],
  },
  {
    id: 'first-conditional',
    icon: '⚡',
    title: 'Câu điều kiện loại 1',
    tag: 'B1',
    explanation: `Câu điều kiện loại 1 diễn tả điều kiện có thể xảy ra ở hiện tại hoặc tương lai.
Nếu "if clause" có sự kiện tương lai, chủ ngữ chính dùng will/can/may + V.`,
    formula: ['If + S + V(s/es) (hiện tại), S + will/can/may + V'],
    examples: [
      ['If it rains, we will stay at home.', 'You will pass if you study hard.'],
      ['If you don\'t hurry, you will miss the bus.'],
    ],
    practice: [
      {
        q: 'If I ______ time, I will call you.',
        options: ['have', 'will have', 'had', 'would have'],
        answerIndex: 0,
        explanation: 'Mệnh đề if dùng hiện tại đơn: "If I have time…".',
      },
      {
        q: 'We ______ late if we don\'t hurry.',
        options: ['are', 'will be', 'would be', 'were'],
        answerIndex: 1,
        explanation: 'Mệnh đề chính dùng "will + V": "We will be late…"',
      },
    ],
  },
  {
    id: 'passive-voice',
    icon: '🛡️',
    title: 'Câu bị động (Passive Voice)',
    tag: 'B1',
    explanation: `Câu bị động dùng khi muốn nhấn mạnh hành động hoặc đối tượng thực hiện hành động không quan trọng.
Cấu trúc: tobe + V3/V-ed. Tobe chia thì theo câu gốc.`,
    formula: ['Active: S + V + O', 'Passive: O + am/is/are/was/were + V3/ed (+ by S)'],
    examples: [
      ['English is spoken all over the world.', 'The car was repaired last week.'],
      ['This house was built in 1990.', 'The homework is being done right now.'],
    ],
    practice: [
      {
        q: 'English ______ all over the world.',
        options: ['speaks', 'is spoken', 'speaking', 'is speaking'],
        answerIndex: 1,
        explanation: 'English không tự nói → bị động hiện tại đơn: is spoken.',
      },
      {
        q: 'The house ______ built in 1990.',
        options: ['is', 'was', 'has', 'did'],
        answerIndex: 1,
        explanation: '"built in 1990" → quá khứ đơn bị động: was built.',
      },
    ],
  },
  {
    id: 'relative-clauses',
    icon: '🔗',
    title: 'Mệnh đề quan hệ (Relative Clauses)',
    tag: 'B1',
    explanation: `Who: chỉ người.
Which: chỉ vật.
That: cả người lẫn vật (thông dụng trong văn nói).
Where: nơi chốn.
Whose: sở hữu.`,
    formula: ['N (người) + who/that + …', 'N (vật) + which/that + …', 'N (nơi) + where + …', 'N + whose + N\'s …'],
    examples: [
      ['The man who is talking is my teacher.', 'I have a book which you may like.'],
      ['This is the house where I was born.', 'That is the girl whose brother is my friend.'],
    ],
    practice: [
      {
        q: 'The woman ______ lives next door is a doctor.',
        options: ['which', 'who', 'where', 'whose'],
        answerIndex: 1,
        explanation: '"The woman" (người) → dùng who.',
      },
      {
        q: 'This is the place ______ we first met.',
        options: ['who', 'which', 'where', 'whose'],
        answerIndex: 2,
        explanation: '"the place" (nơi chốn) → dùng where.',
      },
    ],
  },
  {
    id: 'reported-speech',
    icon: '💬',
    title: 'Câu tường thuật (Reported Speech)',
    tag: 'B1',
    explanation: `Khi tường thuật lời nói, ta lùi thì (backshift):
Present → Past; Past → Past Perfect; will → would; can → could; am/is/are → was/were; …
Quy tắc: He said (that) + …`,
    formula: [
      '"I am tired." → He said (that) he was tired.',
      '"I will come." → She said (that) she would come.',
      '"I have finished." → He said (that) he had finished.',
    ],
    examples: [
      ['She said: "I like coffee." → She said she liked coffee.', 'He told me: "I can swim." → He told me he could swim.'],
    ],
    practice: [
      {
        q: 'He said: "I am busy." → He said he ______ busy.',
        options: ['am', 'is', 'was', 'will be'],
        answerIndex: 2,
        explanation: 'am → lùi thì → was.',
      },
      {
        q: 'She said: "I don\'t like coffee." → She said she ______ coffee.',
        options: ['didn\'t like', 'doesn\'t like', 'don\'t like', 'won\'t like'],
        answerIndex: 0,
        explanation: 'don\'t → lùi thì → didn\'t.',
      },
    ],
  },
  {
    id: 'gerunds-infinitives',
    icon: '🧩',
    title: 'Danh động từ & To-infinitive',
    tag: 'B1',
    explanation: `Một số động từ theo sau bởi V-ing: enjoy, finish, avoid, mind, suggest, practice…
Một số động từ theo sau bởi to + V: want, decide, hope, plan, agree, learn…
Một số dùng được cả hai (có thể khác nghĩa): like, love, start, remember, forget.`,
    formula: ['S + enjoy/finish/avoid + V-ing', 'S + want/decide/hope + to + V (infinitive)'],
    examples: [
      ['I enjoy reading books.', 'She wants to travel abroad.'],
      ['He decided to study English.', 'Would you mind opening the window?'],
    ],
    practice: [
      {
        q: 'I finished ______ the report.',
        options: ['write', 'writing', 'to write', 'wrote'],
        answerIndex: 1,
        explanation: '"finish" luôn theo sau bởi V-ing → writing.',
      },
      {
        q: 'They decided ______ a new car.',
        options: ['buy', 'buying', 'to buy', 'bought'],
        answerIndex: 2,
        explanation: '"decide" luôn theo sau bởi to + V → to buy.',
      },
    ],
  },
  {
    id: 'present-perfect-continuous',
    icon: '⏳',
    title: 'Hiện tại hoàn thành tiếp diễn',
    tag: 'B1',
    explanation: `Diễn tả hành động bắt đầu trong quá khứ, vẫn đang tiếp diễn hoặc vừa mới dừng lại, nhấn mạnh thời gian.
Thường đi với: for + khoảng thời gian, since + mốc thời gian, all day...`,
    formula: ['S + have/has been + V-ing + (since/for...)'],
    signals: [
      { tense: 'Present Perfect Continuous', words: ['for + khoảng thời gian', 'since + mốc thời gian', 'all day', 'all week', 'How long...?', 'recently', 'lately'] },
    ],
    examples: [
      ['I have been working here since 2020.', 'It has been raining all day.'],
      ['She has been learning English for two years.', 'We have been waiting for an hour.'],
    ],
    practice: [
      {
        q: 'They ______ for the bus since 3 o\'clock.',
        options: ['have waited', 'have been waiting', 'are waiting', 'wait'],
        answerIndex: 1,
        explanation: '"since 3 o\'clock" + hành động liên tục → have been waiting.',
      },
      {
        q: 'How long ______ you ______ this book?',
        options: ['have / read', 'did / read', 'have / been reading', 'are / reading'],
        answerIndex: 2,
        explanation: 'Hỏi khoảng thời gian hành động đang tiếp diễn → have been reading.',
      },
    ],
    cloze: [
      { sentence: 'He looks tired. He ___ (work) all day.', answer: 'has been working', note: 'For + all day → hiện tại hoàn thành tiếp diễn.' },
      { sentence: 'We ___ (know) each other since childhood.', answer: 'have known', note: '"know" là động từ trạng thái, không dùng V-ing.' },
    ],
  },
  {
    id: 'past-continuous',
    icon: '🕑',
    title: 'Quá khứ tiếp diễn',
    tag: 'B1',
    explanation: `Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ, hoặc bối cảnh cho hành động xen vào.
Action 1 (đang diễn ra) bị cắt ngang bởi action 2 (ngắn) → chia như sau.`,
    formula: ['S + was/were + V-ing + when/while + ...'],
    signals: [
      { tense: 'Past Continuous', words: ['at 8 pm last night', 'at that time', 'this time yesterday', 'when + (hành động ngắn xen vào)', 'while', 'all morning / evening'] },
    ],
    examples: [
      ['I was watching TV when the phone rang.', 'While she was cooking, he arrived.'],
      ['At 8 pm last night, we were having dinner.', 'They were playing football at that time.'],
    ],
    practice: [
      {
        q: 'I was reading ______ the lights went out.',
        options: ['when', 'while', 'for', 'since'],
        answerIndex: 0,
        explanation: '"to be reading" (dài) bị cắt ngang bởi "went out" (ngắn) → when.',
      },
      {
        q: 'She ______ a shower when I called.',
        options: ['took', 'takes', 'was taking', 'has taken'],
        answerIndex: 2,
        explanation: 'Hành động đang diễn ra thì bị ngắt → was taking.',
      },
    ],
    cloze: [
      { sentence: 'While I ___ (walk) home, I saw an old friend.', answer: 'was walking', note: 'While + hành động dài → quá khứ tiếp diễn.' },
      { sentence: 'What ___ you ___ (do) at 9 pm last night?', answer: 'were doing', note: 'Hỏi hành động tại một thời điểm quá khứ.' },
    ],
  },
  {
    id: 'second-conditional',
    icon: '🔮',
    title: 'Câu điều kiện loại 2',
    tag: 'B1',
    explanation: `Diễn tả điều kiện không thật, khó xảy ra hoặc giả định ở hiện tại/tương lai.
Lưu ý: mệnh đề if dùng quá khứ (nhưng ý là hiện tại giả định), mệnh đề chính dùng would + V.
"were" dùng cho mọi chủ ngữ (I were / he were...).`,
    formula: ['If + S + V2/ed, S + would/could/might + V'],
    examples: [
      ['If I had a million dollars, I would travel the world.', 'If I were you, I would study harder.'],
      ['If she knew the answer, she would tell us.', 'If we lived near the beach, we could swim every day.'],
    ],
    practice: [
      {
        q: 'If I ______ a bird, I could fly anywhere.',
        options: ['am', 'was', 'were', 'will be'],
        answerIndex: 2,
        explanation: 'Giả định không thật → dùng "were" cho mọi chủ ngữ.',
      },
      {
        q: 'If we had more money, we ______ a new house.',
        options: ['buy', 'bought', 'would buy', 'will buy'],
        answerIndex: 2,
        explanation: 'Mệnh đề chính của điều kiện loại 2 → would buy.',
      },
    ],
    cloze: [
      { sentence: 'If I ___ (be) you, I would tell the truth.', answer: 'were', note: 'Giả định hiện tại → were.' },
      { sentence: 'We would save more if we ___ (spend) less.', answer: 'spent', note: 'Mệnh đề if dùng quá khứ đơn.' },
    ],
  },
  {
    id: 'used-to',
    icon: '📼',
    title: 'used to / be used to',
    tag: 'B1',
    explanation: `Used to + V: thói quen/thực tế trong quá khứ nay không còn.
Be used to + V-ing: quen với việc gì (hiện tại).
Get used to + V-ing: dần quen với việc gì.`,
    formula: [
      'Used to + V (nguyên mẫu): quá khứ từng...',
      'Be/Get used to + V-ing: quen với...',
    ],
    examples: [
      ['I used to play football when I was young.', 'She is used to getting up early.'],
      ['He used to smoke, but now he doesn\'t.', 'You will get used to the new job soon.'],
    ],
    practice: [
      {
        q: 'I ______ live in the countryside when I was a child.',
        options: ['used to', 'am used to', 'didn\'t used', 'use to'],
        answerIndex: 0,
        explanation: 'Thói quen quá khứ đã hết → used to + V.',
      },
      {
        q: 'She is used to ______ in Hanoi.',
        options: ['live', 'living', 'lived', 'lives'],
        answerIndex: 1,
        explanation: 'Be used to + V-ing → living.',
      },
    ],
    cloze: [
      { sentence: 'I ___ (play) tennis a lot, but now I don\'t.', answer: 'used to play', note: 'Thói quen quá khứ.' },
      { sentence: 'Are you used to ___ (get) up early?', answer: 'getting', note: 'Be used to + V-ing.' },
    ],
  },
  {
    id: 'articles',
    icon: '📌',
    title: 'Mạo từ a / an / the',
    tag: 'A2-B1',
    explanation: `A/An: danh từ đếm được số ít, nhắc lần đầu hoặc không xác định ("a" trước phụ âm, "an" trước nguyên âm).
The: xác định — đã nhắc trước đó, duy nhất, hoặc người nghe biết rõ.
Không dùng mạo từ (zero article): danh từ số nhiều nói chung, bữa ăn, các môn thể thao...`,
    formula: ['a/an + danh từ đếm được số ít', 'the + danh từ đã xác định / duy nhất', '(không mạo từ) + danh từ số nhiều chung chung'],
    examples: [
      ['I saw a cat. The cat was black.', 'The sun rises in the east. (duy nhất)'],
      ['I like cats. (chung chung)', 'She plays tennis. (môn thể thao)'],
    ],
    practice: [
      {
        q: 'She is ______ honest woman.',
        options: ['a', 'an', 'the', '(no article)'],
        answerIndex: 1,
        explanation: '"honest" bắt đầu là phụ âm đọc h, nhưng âm "o" → an.',
      },
      {
        q: '______ moon is beautiful tonight.',
        options: ['A', 'An', 'The', '(no article)'],
        answerIndex: 2,
        explanation: 'Mặt trăng là duy nhất → the.',
      },
    ],
    cloze: [
      { sentence: 'I bought ___ umbrella yesterday.', answer: 'an', note: '"umbrella" bắt đầu bằng nguyên âm âm /ʌ/.' },
      { sentence: '___ Earth goes around the Sun.', answer: 'The', note: 'Vật duy nhất → The.' },
    ],
  },
];
