// Lộ trình học tiếng Trung Phồn thể theo cấp độ HSK.
// Mỗi giai đoạn tham chiếu topic id có sẵn trong src/data/zh-tw/vocab/*.

export const zhRoadmaps = [
  {
    id: 'hsk-1',
    name: 'HSK 1',
    icon: '🌱',
    target: 'Sơ cấp · Giao tiếp cơ bản',
    desc: 'Lộ trình HSK 1: nắm vững chào hỏi, số đếm, gia đình và ăn uống – nền tảng tiếng Trung đầu tiên.',
    gradient: 'linear-gradient(135deg, #66BB6A, #A5D6A7)',
    stages: [
      {
        id: 'hsk1-1',
        title: 'Chào hỏi & Số đếm',
        target: 'HSK 1 · Phần 1',
        desc: 'Các câu chào cơ bản, số đếm và thời gian trong ngày.',
        topics: ['greetings', 'numbers-time'],
      },
      {
        id: 'hsk1-2',
        title: 'Gia đình & Ăn uống',
        target: 'HSK 1 · Phần 2',
        desc: 'Từ vựng về người thân trong gia đình và món ăn hằng ngày.',
        topics: ['family', 'food'],
      },
    ],
  },
  {
    id: 'hsk-2',
    name: 'HSK 2',
    icon: '💬',
    target: 'Sơ trung cấp · Đời sống hằng ngày',
    desc: 'Lộ trình HSK 2: mở rộng sang đời sống, sức khỏe, nhà cửa và di chuyển.',
    gradient: 'linear-gradient(135deg, #29B6F6, #81D4FA)',
    stages: [
      {
        id: 'hsk2-1',
        title: 'Đời sống & Sức khỏe',
        target: 'HSK 2 · Phần 1',
        desc: 'Các hoạt động hằng ngày, cơ thể người và từ vựng y tế cơ bản.',
        topics: ['daily-life', 'body-health'],
      },
      {
        id: 'hsk2-2',
        title: 'Nhà cửa & Nơi chốn',
        target: 'HSK 2 · Phần 2',
        desc: 'Phòng ốc, địa điểm quen thuộc trong thành phố.',
        topics: ['home-places'],
      },
    ],
  },
  {
    id: 'hsk-3',
    name: 'HSK 3',
    icon: '🚀',
    target: 'Trung cấp · Giao tiếp linh hoạt',
    desc: 'Lộ trình HSK 3: giao tiếp tự tin trong mua sắm, đi lại và các tình huống thực tế.',
    gradient: 'linear-gradient(135deg, #F06292, #F48FB1)',
    stages: [
      {
        id: 'hsk3-1',
        title: 'Mua sắm & Giao thông',
        target: 'HSK 3 · Phần 1',
        desc: 'Mua hàng, hỏi giá, đặt vé và di chuyển trong thành phố.',
        topics: ['shopping', 'transportation'],
      },
    ],
  },
];

export const getZhRoadmap = (id) => zhRoadmaps.find(r => r.id === id) || null;
