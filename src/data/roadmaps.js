// Lộ trình luyện thi theo mục tiêu (chỉ áp dụng cho gói tiếng Anh).
// Mỗi giai đoạn tham chiếu topic id có sẵn trong src/data/vocabulary.js.

export const roadmaps = [
  {
    id: 'toeic',
    name: 'TOEIC',
    icon: '📝',
    target: '450 → 990 điểm',
    desc: 'Lộ trình luyện từ vựng theo thang điểm TOEIC, từ nền tảng đến chuyên sâu.',
    gradient: 'linear-gradient(135deg, #e8326f, #ff7ea6)',
    stages: [
      {
        id: 'toeic-450',
        title: 'Nền tảng 450+',
        target: '450 – 545 điểm',
        desc: 'Từ vựng cơ bản phục vụ phần giao tiếp cơ bản của TOEIC.',
        topics: ['greetings', 'numbers-time', 'shopping', 'home-places'],
      },
      {
        id: 'toeic-550',
        title: 'Giao tiếp 550+',
        target: '550 – 645 điểm',
        desc: 'Dịch vụ, chỉ đường, phương tiện và tình huống khẩn cấp.',
        topics: ['services', 'directions', 'transportation', 'emergencies'],
      },
      {
        id: 'toeic-650',
        title: 'Công việc 650+',
        target: '650 – 745 điểm',
        desc: 'Từ vựng văn phòng, điện thoại và trường lớp – công việc.',
        topics: ['workplace', 'phone-internet', 'school-work'],
      },
      {
        id: 'toeic-750',
        title: 'Đọc – Nghe 750+',
        target: '750 – 845 điểm',
        desc: 'Tin tức, du lịch và thời tiết cho phần đọc hiểu dài.',
        topics: ['news-media', 'travel-daily', 'weather'],
      },
      {
        id: 'toeic-990',
        title: 'Chuyên sâu 850 – 990',
        target: '850 – 990 điểm',
        desc: 'Từ vựng học thuật khó, cần cho mức điểm top.',
        topics: ['technology-media', 'science', 'environment-society'],
      },
    ],
  },
  {
    id: 'ielts',
    name: 'IELTS',
    icon: '🌍',
    target: 'Band 5.0 → 8.0+',
    desc: 'Lộ trình Academic & General theo từng band điểm IELTS.',
    gradient: 'linear-gradient(135deg, #0e94b5, #4ecdc4)',
    stages: [
      {
        id: 'ielts-50',
        title: 'Band 5.0 – Nền tảng',
        target: 'Band 5.0',
        desc: 'Từ vựng sinh hoạt hằng ngày để trả lời Part 1 trôi chảy.',
        topics: ['greetings', 'family', 'food-drinks', 'body-health'],
      },
      {
        id: 'ielts-55',
        title: 'Band 5.5 – Giao tiếp',
        target: 'Band 5.5',
        desc: 'Mở rộng chủ đề quen thuộc: du lịch, mua sắm, di chuyển.',
        topics: ['travel-daily', 'shopping', 'directions'],
      },
      {
        id: 'ielts-60',
        title: 'Band 6.0 – Chủ đề phổ biến',
        target: 'Band 6.0',
        desc: 'Công nghệ, giải trí, thời trang — nhóm topic Part 2 hay gặp.',
        topics: ['technology-media', 'sports-hobbies', 'clothes-fashion'],
      },
      {
        id: 'ielts-65',
        title: 'Band 6.5 – Môi trường & xã hội',
        target: 'Band 6.5',
        desc: 'Từ vựng nghị luận về môi trường, tin tức và thiên nhiên.',
        topics: ['environment-society', 'news-media', 'nature'],
      },
      {
        id: 'ielts-70',
        title: 'Band 7.0 – Học thuật',
        target: 'Band 7.0',
        desc: 'Khoa học, giáo dục và công sở cho Writing Task 1 – 2.',
        topics: ['science', 'school-work', 'workplace'],
      },
      {
        id: 'ielts-80',
        title: 'Band 8.0+ – Nâng cao',
        target: 'Band 8.0+',
        desc: 'Từ vựng trừu tượng, sắc thái cao để đạt band điểm cao.',
        topics: ['emotions-personality', 'animals-nature', 'household-items'],
      },
    ],
  },
];

export const getRoadmap = (id) => roadmaps.find(r => r.id === id) || null;
