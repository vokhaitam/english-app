// Lộ trình JLPT theo cấp độ (chỉ áp dụng cho gói tiếng Nhật).
// Mỗi giai đoạn tham chiếu topic id có sẵn trong src/data/ja/vocab/*.

export const jaRoadmaps = [
  {
    id: 'jlpt-n5',
    name: 'JLPT N5',
    icon: '🌱',
    target: 'Sơ cấp · 12 chủ đề',
    desc: 'Lộ trình lên chứng chỉ N5: giao tiếp cơ bản, gia đình, trường lớp và đi lại.',
    gradient: 'linear-gradient(135deg, #66BB6A, #A5D6A7)',
    stages: [
      {
        id: 'n5-1',
        title: 'Giao tiếp hằng ngày',
        target: 'N5 · Phần 1',
        desc: 'Chào hỏi, số đếm, đời sống và ăn uống — nền tảng đầu tiên.',
        topics: ['ja-greetings', 'ja-numbers-time', 'ja-daily-life', 'ja-food'],
      },
      {
        id: 'n5-2',
        title: 'Gia đình & trường lớp',
        target: 'N5 · Phần 2',
        desc: 'Người thân, nơi ở, cơ thể và lớp học.',
        topics: ['ja-family', 'ja-home-places', 'ja-body-health', 'ja-school-work'],
      },
      {
        id: 'n5-3',
        title: 'Đi lại & mua sắm',
        target: 'N5 · Phần 3',
        desc: 'Phương tiện, hỏi đường, mua sắm và trang phục.',
        topics: ['ja-shopping', 'ja-transportation', 'ja-directions', 'ja-clothes-fashion'],
      },
    ],
  },
  {
    id: 'jlpt-n4',
    name: 'JLPT N4',
    icon: '💬',
    target: 'Sơ trung cấp · 10 chủ đề',
    desc: 'Lộ trình lên chứng chỉ N4: đời sống quanh nhà, thế giới tự nhiên và công việc.',
    gradient: 'linear-gradient(135deg, #29B6F6, #81D4FA)',
    stages: [
      {
        id: 'n4-1',
        title: 'Đời sống & cảm xúc',
        target: 'N4 · Phần 1',
        desc: 'Thời tiết, đồ đạc gia đình và cảm xúc cá nhân.',
        topics: ['ja-weather', 'ja-household-items', 'ja-emotions-personality'],
      },
      {
        id: 'n4-2',
        title: 'Thế giới quanh bạn',
        target: 'N4 · Phần 2',
        desc: 'Thể thao, động vật, thiên nhiên và internet.',
        topics: ['ja-sports-hobbies', 'ja-animals-nature', 'ja-nature', 'ja-phone-internet'],
      },
      {
        id: 'n4-3',
        title: 'Du lịch & công việc',
        target: 'N4 · Phần 3',
        desc: 'Du lịch, tình huống khẩn cấp và môi trường công sở.',
        topics: ['ja-travel-daily', 'ja-emergencies', 'ja-workplace'],
      },
    ],
  },
  {
    id: 'jlpt-n3',
    name: 'JLPT N3',
    icon: '🚀',
    target: 'Trung cấp · 5 chủ đề',
    desc: 'Lộ trình lên chứng chỉ N3: công nghệ, khoa học, xã hội và tin tức.',
    gradient: 'linear-gradient(135deg, #F06292, #F48FB1)',
    stages: [
      {
        id: 'n3-1',
        title: 'Công nghệ & khoa học',
        target: 'N3 · Phần 1',
        desc: 'Máy tính, dịch vụ công cộng và khoa học.',
        topics: ['ja-technology-media', 'ja-services', 'ja-science'],
      },
      {
        id: 'n3-2',
        title: 'Xã hội & tin tức',
        target: 'N3 · Phần 2',
        desc: 'Môi trường, đời sống xã hội và báo chí.',
        topics: ['ja-environment-society', 'ja-news-media'],
      },
    ],
  },
];

export const getJaRoadmap = (id) => jaRoadmaps.find(r => r.id === id) || null;
