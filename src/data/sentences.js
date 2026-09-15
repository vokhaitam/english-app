export const dailySentences = [
  {
    id: 1,
    en: "I'm looking forward to hearing from you.",
    vi: "Tôi rất mong nhận được hồi âm từ bạn.",
    pron: "/aɪm 'lʊkɪŋ 'fɔːwəd tə 'hɪərɪŋ frəm juː/",
    tag: 'Email & thư từ',
    grammar: {
      name: 'Present Continuous + look forward to + V-ing',
      explanation: "Thì Present Continuous (am/is/are + V-ing) diễn tả việc đang diễn ra. Cụm 'look forward to' nghĩa là mong đợi; ở đây 'to' là giới từ nên động từ theo sau phải thêm -ing (hearing).",
    },
    breakdown: [
      { part: "I'm looking forward to", note: 'am + V-ing (Present Continuous) đang diễn ra' },
      { part: 'to hearing', note: "'to' là giới từ → động từ sau phải thêm -ing" },
      { part: 'from you', note: 'cụm giới từ chỉ người gửi tin' },
    ],
  },
  {
    id: 2,
    en: 'Could you tell me the way to the station, please?',
    vi: 'Bạn có thể chỉ cho tôi đường đến nhà ga được không?',
    pron: "/kʊd juː tel miː ðə weɪ tə ðə 'steɪʃn pliːz/",
    tag: 'Hỏi đường',
    grammar: {
      name: 'Could + V (yêu cầu lịch sự) + tell + O',
      explanation: "'Could' dùng để yêu cầu lịch sự, trang trọng hơn 'can'. Cấu trúc 'tell somebody + cụm hỏi' — ở đây là cụm 'the way to...' (đường đến...).",
    },
    breakdown: [
      { part: 'Could you tell me', note: "'Could + S + V' — câu yêu cầu lịch sự" },
      { part: 'the way to the station', note: "'the way to + nơi chốn' — đường đến nơi nào đó" },
      { part: 'please', note: 'cuối câu giúp câu nhờ vả nhã nhặn hơn' },
    ],
  },
  {
    id: 3,
    en: "I've already finished my homework.",
    vi: 'Mình đã làm xong bài tập về nhà rồi.',
    pron: "/aɪv ɔːl'redi 'fɪnɪʃt maɪ 'həʊmwɜːk/",
    tag: 'Báo cáo đã xong',
    grammar: {
      name: 'Present Perfect (have + V3) + already',
      explanation: "Thì Present Perfect (have/has + V3) diễn tả việc vừa hoàn thành, kết quả còn liên quan đến hiện tại. 'Already' nhấn mạnh việc đã xong sớm, đặt giữa have và V3.",
    },
    breakdown: [
      { part: "I've already finished", note: 'have + already + V3 — nhấn mạnh "đã xong rồi"' },
      { part: 'my homework', note: "'homework' là danh từ không đếm được" },
    ],
  },
  {
    id: 4,
    en: 'If I were you, I would take the train.',
    vi: 'Nếu là bạn, tôi sẽ đi tàu hỏa.',
    pron: "/ɪf aɪ wɜː juː aɪ wʊd teɪk ðə treɪn/",
    tag: 'Câu điều kiện',
    grammar: {
      name: 'Conditional type 2: If + S + were, S + would + V',
      explanation: "Câu điều kiện loại 2 diễn tả giả định không có thật ở hiện tại. 'Were' dùng cho mọi chủ ngữ (kể cả I/he/she). Mệnh đề chính dùng 'would + động từ nguyên mẫu'.",
    },
    breakdown: [
      { part: 'If I were you', note: "'were' dùng thay 'was' trong giả định, mọi ngôi" },
      { part: 'I would take', note: "'would + V' chỉ kết quả giả định" },
      { part: 'the train', note: 'ở đây take = đi bằng (phương tiện)' },
    ],
  },
  {
    id: 5,
    en: 'How long have you been learning English?',
    vi: 'Bạn học tiếng Anh được bao lâu rồi?',
    pron: "/haʊ lɒŋ hæv juː biːn 'lɜːnɪŋ 'ɪŋɡlɪʃ/",
    tag: 'Hỏi về thời gian',
    grammar: {
      name: 'Present Perfect Continuous (have been + V-ing)',
      explanation: "Thì Present Perfect Continuous (have/has been + V-ing) nhấn mạnh một quá trình kéo dài từ quá khứ đến hiện tại và vẫn tiếp diễn. 'How long' dùng để hỏi khoảng thời gian.",
    },
    breakdown: [
      { part: 'How long', note: 'cụm hỏi về khoảng thời gian kéo dài' },
      { part: 'have you been learning', note: 'have + been + V-ing — Present Perfect Continuous' },
    ],
  },
  {
    id: 6,
    en: "I'd rather stay home than go out tonight.",
    vi: 'Tối nay tôi thà ở nhà còn hơn đi ra ngoài.',
    pron: "/aɪd 'rɑːðə steɪ həʊm ðæn ɡəʊ aʊt tə'naɪt/",
    tag: 'Chọn lựa',
    grammar: {
      name: 'would rather + V(bare) than + V(bare)',
      explanation: "'Would rather' (thà... hơn) theo sau là động từ nguyên mẫu không 'to'. 'Than' nối hai lựa chọn và hai vế dùng cùng dạng động từ.",
    },
    breakdown: [
      { part: "I'd rather stay home", note: "'would rather + V' — thà làm gì hơn" },
      { part: 'than go out', note: "'than + V' — nối lựa chọn thứ hai" },
    ],
  },
  {
    id: 7,
    en: "This is the best film I've ever seen.",
    vi: 'Đây là bộ phim hay nhất mà mình từng xem.',
    pron: "/ðɪs ɪz ðə best fɪlm aɪv 'evə siːn/",
    tag: 'Đánh giá',
    grammar: {
      name: 'Superlative + Present Perfect (ever)',
      explanation: "So sánh nhất 'the best' (good → better → best). Mệnh đề quan hệ 'I've ever seen' dùng Present Perfect với 'ever' để nói về trải nghiệm trong cả quá khứ cho đến nay.",
    },
    breakdown: [
      { part: 'the best film', note: 'so sánh nhất của good: good → better → best' },
      { part: "I've ever seen", note: "'have + ever + V3' — từng trải trong đời" },
    ],
  },
  {
    id: 8,
    en: 'My car is being repaired at the moment.',
    vi: 'Xe của tôi đang được sửa vào lúc này.',
    pron: "/maɪ kɑːr ɪz 'biːɪŋ rɪˈpeəd ət ðə 'məʊmənt/",
    tag: 'Bị động',
    grammar: {
      name: 'Passive voice — Present Continuous (is/are being + V3)',
      explanation: "Câu bị động thì hiện tại tiếp diễn có dạng am/is/are + being + V3. 'Is being repaired' = đang được sửa. Dùng bị động khi người thực hiện hành động không quan trọng.",
    },
    breakdown: [
      { part: 'My car', note: 'chủ ngữ nhận hành động (bị sửa)' },
      { part: 'is being repaired', note: 'is + being + V3 — bị động tiếp diễn' },
      { part: 'at the moment', note: "'ngay lúc này' → dùng thì tiếp diễn" },
    ],
  },
  {
    id: 9,
    en: 'I wish I could speak English fluently.',
    vi: 'Ước gì tôi có thể nói tiếng Anh trôi chảy.',
    pron: "/aɪ wɪʃ aɪ kʊd spiːk 'ɪŋɡlɪʃ 'fluːəntli/",
    tag: 'Ước muốn',
    grammar: {
      name: 'wish + could + V (giả định hiện tại)',
      explanation: "'Wish + could' diễn tả ước muốn về một khả năng không có thật ở hiện tại. Sau wish + could là động từ nguyên mẫu. 'Fluently' là trạng từ bổ nghĩa cho 'speak'.",
    },
    breakdown: [
      { part: 'I wish I could speak', note: "'wish + could + V' — ước trái với thực tế hiện tại" },
      { part: 'fluently', note: 'trạng từ cách thức: fluent + ly' },
    ],
  },
  {
    id: 10,
    en: "Let's meet at the café tomorrow, shall we?",
    vi: 'Chúng ta gặp nhau ở quán cà phê ngày mai nhé?',
    pron: "/lets miːt ət ðə 'kæfeɪ tə'mɒrəʊ ʃæl wiː/",
    tag: 'Hẹn gặp',
    grammar: {
      name: "Let's + V(bare) + câu hỏi đuôi 'shall we?'",
      explanation: "'Let's + V' dùng để rủ/đề nghị làm việc gì cùng nhau. Câu hỏi đuôi riêng cho 'Let's' luôn là 'shall we?' — không bao giờ là 'don't we?'. Đây là ngoại lệ cần nhớ.",
    },
    breakdown: [
      { part: "Let's meet", note: "'Let's + V(bare)' — rủ làm gì cùng nhau" },
      { part: 'at the café tomorrow', note: 'at + địa điểm; tomorrow chỉ thời gian' },
      { part: 'shall we?', note: 'câu hỏi đuôi cố định riêng cho Let\'s' },
    ],
  },
  {
    id: 11,
    en: 'I used to play football every weekend.',
    vi: 'Tôi từng chơi bóng đá mỗi cuối tuần.',
    pron: "/aɪ juːst tə pleɪ 'fʊtbɔːl 'evri ˌwiːk'end/",
    tag: 'Thói quen quá khứ',
    grammar: {
      name: 'used to + V (thói quen quá khứ đã chấm dứt)',
      explanation: "'Used to + V(bare)' diễn tả thói quen/trạng thái thường có trong quá khứ nhưng giờ không còn. Phân biệt: 'be used to + V-ing' = quen với việc gì (hiện tại).",
    },
    breakdown: [
      { part: 'I used to play', note: "'used to + V' — từng làm (nay không còn)" },
      { part: 'every weekend', note: 'trạng từ tần suất dạng mỗi...' },
    ],
  },
  {
    id: 12,
    en: 'Make sure you turn off the lights before leaving.',
    vi: 'Hãy chắc chắn tắt đèn trước khi rời đi.',
    pron: "/meɪk ʃʊə juː tɜːn ɒf ðə laɪts bɪ'fɔː 'liːvɪŋ/",
    tag: 'Dặn dò',
    grammar: {
      name: 'Mệnh lệnh + make sure + S + V (hiện tại đơn)',
      explanation: "'Make sure + (that) + S + V' = hãy đảm bảo rằng... 'Before leaving' là rút gọn của 'before you leave' — sau giới từ 'before' động từ phải là V-ing.",
    },
    breakdown: [
      { part: 'Make sure you turn off', note: "'make sure + S + V' — hãy chắc chắn..." },
      { part: 'before leaving', note: "sau giới từ 'before' → động từ thêm -ing" },
    ],
  },
  {
    id: 13,
    en: 'Neither of us wanted to miss the concert.',
    vi: 'Không ai trong hai chúng tôi muốn bỏ lỡ buổi hòa nhạc.',
    pron: "/'naɪðə(r) ɒv ʌs 'wɒntɪd tə mɪs ðə 'kɒnsət/",
    tag: 'Phủ định',
    grammar: {
      name: 'Neither of + danh từ số nhiều + động từ số ít',
      explanation: "'Neither of + danh từ/đại từ số nhiều' (không ai trong hai) đi với động từ số ít: 'Neither of us wanted'. Sau 'want' dùng 'to + V'.",
    },
    breakdown: [
      { part: 'Neither of us', note: "'neither of + số nhiều' → động từ chia số ít" },
      { part: 'wanted to miss', note: "'want + to V'; miss = bỏ lỡ" },
    ],
  },
  {
    id: 14,
    en: "You'd better see a doctor about that cough.",
    vi: 'Bạn nên đi khám bác sĩ về cơn ho đó.',
    pron: "/juːd 'betə siː ə 'dɒktə ə'baʊt ðæt kɒf/",
    tag: 'Lời khuyên',
    grammar: {
      name: 'had better + V (base) — lời khuyên mạnh',
      explanation: "'Had better' (You'd better) mang nghĩa 'tốt hơn là, nên', theo sau bởi động từ nguyên mẫu không 'to'. 'See a doctor' = đi khám bệnh (cụm cố định với see).",
    },
    breakdown: [
      { part: "You'd better", note: "'had better + V(bare)' — lời khuyên mạnh" },
      { part: 'see a doctor', note: "'see a doctor' = đi khám bệnh" },
    ],
  },
  {
    id: 15,
    en: "I can't stand waiting in long queues.",
    vi: 'Tôi không chịu nổi cảnh xếp hàng dài.',
    pron: "/aɪ kɑːnt stænd 'weɪtɪŋ ɪn lɒŋ kjuːz/",
    tag: 'Cảm xúc',
    grammar: {
      name: "can't stand + V-ing",
      explanation: "'Can't stand' (không chịu nổi, rất ghét) luôn theo sau bởi V-ing. 'Wait in a queue' = xếp hàng chờ, hoặc đơn giản 'queue' = xếp hàng (động từ).",
    },
    breakdown: [
      { part: "I can't stand", note: "'can't stand + V-ing' — không chịu được" },
      { part: 'waiting in long queues', note: 'wait + in (địa điểm, dòng người)' },
    ],
  },
  {
    id: 16,
    en: 'By the time we arrived, the film had already started.',
    vi: 'Đến lúc chúng tôi tới nơi thì phim đã bắt đầu rồi.',
    pron: "/baɪ ðə taɪm wiː ə'raɪvd ðə fɪlm hæd ɔːl'redi 'stɑːtɪd/",
    tag: 'Quá khứ hoàn thành',
    grammar: {
      name: 'Past Perfect (had + V3) + by the time',
      explanation: "'By the time + quá khứ đơn' đánh dấu một mốc. Hành động xảy ra trước mốc đó dùng Past Perfect (had + V3): phim đã bắt đầu trước khi họ đến.",
    },
    breakdown: [
      { part: 'By the time we arrived', note: "'by the time + quá khứ đơn' = mốc thời gian" },
      { part: 'the film had already started', note: 'had + already + V3 — Past Perfect' },
    ],
  },
  {
    id: 17,
    en: "It's been ages since we last met.",
    vi: 'Đã lâu lắm rồi kể từ lần gặp cuối của chúng ta.',
    pron: "/ɪts biːn 'eɪdʒɪz sɪns wiː lɑːst met/",
    tag: 'Chào hỏi',
    grammar: {
      name: "It's been + thời gian + since + quá khứ đơn",
      explanation: "'It's been (It has been) + khoảng thời gian + since + mệnh đề quá khứ đơn' diễn tả thời gian trôi qua kể từ khi một việc xảy ra. 'Since' là liên từ nối mệnh đề thời gian.",
    },
    breakdown: [
      { part: "It's been ages", note: "'It has been + thời gian' — đã bao lâu rồi" },
      { part: 'since we last met', note: "'since + quá khứ đơn' — từ lúc việc đó xảy ra" },
    ],
  },
  {
    id: 18,
    en: "I don't mind helping you with the move.",
    vi: 'Tôi không ngại giúp bạn chuyển nhà.',
    pron: "/aɪ dəʊnt maɪnd 'helpɪŋ juː wɪð ðə muːv/",
    tag: 'Đề nghị giúp đỡ',
    grammar: {
      name: "don't mind + V-ing",
      explanation: "'Don't mind' (không phiền, không ngại) luôn theo sau bởi V-ing. 'Help somebody with something' = giúp ai đó việc gì.",
    },
    breakdown: [
      { part: "I don't mind helping", note: "'don't mind + V-ing' — không ngại làm gì" },
      { part: 'you with the move', note: "'help sb with sth' — giúp ai việc gì" },
    ],
  },
  {
    id: 19,
    en: 'She is not only smart but also hard-working.',
    vi: 'Cô ấy không chỉ thông minh mà còn chăm chỉ.',
    pron: "/ʃiː ɪz nɒt 'əʊnli smɑːt bʌt 'ɔːlsəʊ ˌhɑːd 'wɜːkɪŋ/",
    tag: 'Miêu tả người',
    grammar: {
      name: 'not only ... but also ... (cấu trúc song song)',
      explanation: "'Not only ... but also ...' (không chỉ... mà còn...) yêu cầu hai vế cùng loại/dạng — ở đây cả hai là tính từ (smart, hard-working). Nếu 'not only' đứng đầu câu thì gây đảo ngữ.",
    },
    breakdown: [
      { part: 'not only smart', note: 'vế 1 — tính từ' },
      { part: 'but also hard-working', note: 'vế 2 — tính từ, cùng dạng với vế 1' },
    ],
  },
  {
    id: 20,
    en: 'Despite the rain, we went for a walk.',
    vi: 'Mặc dù trời mưa, chúng tôi vẫn đi dạo.',
    pron: "/dɪ'spaɪt ðə reɪn wiː went fɔːr ə wɔːk/",
    tag: 'Nhượng bộ',
    grammar: {
      name: 'Despite + danh từ / cụm danh từ',
      explanation: "'Despite' (mặc dù) + danh từ/cụm danh từ — tuyệt đối không có 'of' (despite of là sai). Khi cần cả mệnh đề thì dùng 'although S + V'.",
    },
    breakdown: [
      { part: 'Despite the rain', note: 'despite + danh từ — mặc dù trời mưa' },
      { part: 'we went for a walk', note: "'go for a walk' — đi dạo (cụm cố định)" },
    ],
  },
  {
    id: 21,
    en: 'I suggest taking a taxi to save time.',
    vi: 'Mình đề nghị đi taxi để tiết kiệm thời gian.',
    pron: "/aɪ sə'dʒest 'teɪkɪŋ ə 'tæksi tə seɪv taɪm/",
    tag: 'Đề nghị',
    grammar: {
      name: 'suggest + V-ing + to + V (mục đích)',
      explanation: "Sau 'suggest' dùng V-ing (suggest doing) hoặc 'suggest that + S + V(bare)'. 'To save time' là cụm chỉ mục đích.",
    },
    breakdown: [
      { part: 'I suggest taking', note: "'suggest + V-ing' — đề nghị làm gì" },
      { part: 'a taxi', note: "'take a taxi' — đi taxi (cụm đặc thù)" },
      { part: 'to save time', note: "'to + V' — chỉ mục đích" },
    ],
  },
  {
    id: 22,
    en: 'It was such a good meal that we ordered more.',
    vi: 'Bữa ăn ngon đến mức chúng tôi gọi thêm.',
    pron: "/ɪt wɒz sʌtʃ ə ɡʊd miːl ðæt wiː 'ɔːdəd mɔː/",
    tag: 'Kết quả',
    grammar: {
      name: 'such + (a/an) + tính từ + danh từ + that',
      explanation: "'Such ... that' diễn tả kết quả: 'such + (a/an) + adj + noun + that + mệnh đề'. So sánh với 'so + adj + that' (không có danh từ đi kèm).",
    },
    breakdown: [
      { part: 'such a good meal', note: "'such + a/an + adj + noun' — nhấn mạnh mức độ" },
      { part: 'that we ordered more', note: "'that + mệnh đề' — kết quả" },
    ],
  },
  {
    id: 23,
    en: 'No sooner had I left than it started raining.',
    vi: 'Tôi vừa rời đi thì trời bắt đầu mưa.',
    pron: "/nəʊ 'suːnə hæd aɪ left ðæn ɪt 'stɑːtɪd 'reɪnɪŋ/",
    tag: 'Đảo ngữ',
    grammar: {
      name: 'No sooner had + S + V3 than + mệnh đề (đảo ngữ)',
      explanation: "'No sooner ... than' (vừa mới... thì) gây đảo ngữ: 'No sooner had I left'. Đây là cách diễn đạt trang trọng của 'As soon as I left'. 'Start + V-ing' hoặc 'start + to V' đều đúng.",
    },
    breakdown: [
      { part: 'No sooner had I left', note: 'đảo ngữ: No sooner + had + S + V3' },
      { part: 'than it started raining', note: "'...than + mệnh đề' — việc xảy ra ngay sau" },
    ],
  },
  {
    id: 24,
    en: "I've had this phone for two years.",
    vi: 'Tôi đã dùng chiếc điện thoại này được hai năm.',
    pron: "/aɪv hæd ðɪs fəʊn fɔː tuː jɪəz/",
    tag: 'Present Perfect',
    grammar: {
      name: 'Present Perfect + for + khoảng thời gian',
      explanation: "Present Perfect (have + V3) với 'for + khoảng thời gian' chỉ việc kéo dài đến hiện tại. Nếu là 'since + mốc thời gian' (since 2020) cũng dùng thì này.",
    },
    breakdown: [
      { part: "I've had this phone", note: 'have + V3 (had) — sở hữu từ quá khứ đến nay' },
      { part: 'for two years', note: "'for + duration'; 'since' dùng với mốc thời gian" },
    ],
  },
  {
    id: 25,
    en: 'What about grabbing a coffee after work?',
    vi: 'Uống một ly cà phê sau giờ làm nhé?',
    pron: "/wɒt ə'baʊt 'ɡræbɪŋ ə 'kɒfi 'ɑːftə wɜːk/",
    tag: 'Gợi ý',
    grammar: {
      name: 'What about + V-ing? (gợi ý)',
      explanation: "'What about / How about + V-ing' dùng để gợi ý thân thiện, không trang trọng. 'Grab a coffee' = tranh thủ uống một ly cà phê (khẩu ngữ).",
    },
    breakdown: [
      { part: 'What about grabbing', note: "'What about + V-ing' — gợi ý làm gì" },
      { part: 'a coffee', note: "'grab a coffee' = tranh thủ một ly cà phê" },
    ],
  },
  {
    id: 26,
    en: "The sooner we leave, the sooner we'll get there.",
    vi: 'Chúng ta đi càng sớm thì đến đó càng sớm.',
    pron: "/ðə 'suːnə wiː liːv ðə 'suːnə wiːl ɡet ðeə/",
    tag: 'So sánh kép',
    grammar: {
      name: 'The + so sánh hơn, the + so sánh hơn',
      explanation: "Cấu trúc so sánh kép 'The + comparative..., the + comparative...' nghĩa là càng... càng.... Mệnh đề phụ dùng hiện tại đơn; mệnh đề chính có thể dùng 'will'.",
    },
    breakdown: [
      { part: 'The sooner we leave', note: 'the + so sánh hơn + mệnh đề phụ' },
      { part: "the sooner we'll get there", note: 'the + so sánh hơn + mệnh đề chính (will)' },
    ],
  },
  {
    id: 27,
    en: 'He asked me where I was going.',
    vi: 'Anh ấy hỏi tôi đang đi đâu.',
    pron: "/hiː ɑːskt miː weə aɪ wɒz 'ɡəʊɪŋ/",
    tag: 'Câu tường thuật',
    grammar: {
      name: 'Reported speech — lùi thì (Present → Past)',
      explanation: "Trong câu tường thuật, thì lùi về quá khứ: 'Where am I going?' → 'where I was going'. Đồng thời mất dấu hỏi và dùng trật tự câu khẳng định S + V.",
    },
    breakdown: [
      { part: 'He asked me', note: "'ask somebody + câu hỏi' — hỏi ai điều gì" },
      { part: 'where I was going', note: 'lùi thì: am going → was going; mất dấu ?' },
    ],
  },
  {
    id: 28,
    en: 'It may rain later, so take an umbrella.',
    vi: 'Trời có thể mưa đó, nên hãy mang ô.',
    pron: "/ɪt meɪ reɪn 'leɪtə səʊ teɪk ən ʌm'brelə/",
    tag: 'Dự đoán',
    grammar: {
      name: 'may + V (khả năng) + so + mệnh đề kết quả',
      explanation: "'May + V' diễn tả khả năng xảy ra khoảng 50%. 'So' nối mệnh đề kết quả / lời khuyên. 'Take an umbrella' = mang theo ô.",
    },
    breakdown: [
      { part: 'It may rain', note: "'may + V(bare)' — khả năng có thể xảy ra" },
      { part: 'so take an umbrella', note: "'so + mệnh đề' — kết quả/lời khuyên" },
    ],
  },
  {
    id: 29,
    en: "I'm used to getting up early now.",
    vi: 'Giờ tôi đã quen dậy sớm rồi.',
    pron: "/aɪm juːst tə 'ɡetɪŋ ʌp 'ɜːli naʊ/",
    tag: 'Thói quen hiện tại',
    grammar: {
      name: 'be used to + V-ing (quen với)',
      explanation: "'Be used to + V-ing' = quen với việc gì (hiện tại). Đừng nhầm với 'used to + V(bare)' = từng làm trong quá khứ. 'Get up' = thức dậy.",
    },
    breakdown: [
      { part: "I'm used to getting up", note: "'be used to + V-ing' — đã quen làm gì" },
      { part: 'early now', note: "'now' nhấn hiện tại đã quen rồi" },
    ],
  },
  {
    id: 30,
    en: 'Could you do me a favour?',
    vi: 'Bạn giúp tôi một việc được không?',
    pron: "/kʊd juː duː miː ə 'feɪvə/",
    tag: 'Nhờ vả',
    grammar: {
      name: 'Could + S + V (nhờ vả lịch sự) + do someone a favour',
      explanation: "'Could you + V?' là cách nhờ vả lịch sự, trang trọng hơn 'Can you...?'. 'Do somebody a favour' = giúp ai một việc — cụm cố định rất thông dụng.",
    },
    breakdown: [
      { part: 'Could you do', note: "'Could + S + V' — nhờ vả lịch sự" },
      { part: 'me a favour', note: "'do sb a favour' — giúp ai một việc" },
    ],
  },
];