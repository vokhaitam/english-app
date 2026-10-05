// Ngữ pháp tiếng Nhật: N5 → N4 → N3.
// Mỗi bài: formula (công thức), explain (giải thích tiếng Việt), examples, practice.

export const grammarLessons = [
  {
    id: 'ja-n5-01',
    level: 'n5',
    order: 1,
    title: 'は と です — Giới thiệu bản thân',
    formula: ['私は〜です', '私は〜ではありません'],
    explain:
      '「は」đọc là "wa" nhưng là trợ từ chủ đề, đánh dấu đề tài câu. 「です」là vị ngữ lịch sự. ' +
      'Khi phủ định dùng 「ではありません」. Trong tiếng Nhật, mệnh đề luôn kết thúc bằng một trợ từ (です, ます, ない…).',
    examples: [
      { jp: '私は留学生です。', vi: 'Tôi là du học sinh.', note: 'は + です' },
      { jp: '田中さんは先生です。', vi: 'Anh Tanaka là giáo viên.', note: 'は + です' },
      { jp: '私は学生ではありません。', vi: 'Tôi không phải là học sinh.', note: 'phủ định lịch sự' },
    ],
    practice: [
      {
        q: '「私 ＿ 学生です。」Chọn trợ từ điền vào chỗ trống.',
        options: ['は', 'を', 'に', 'が'],
        answerIndex: 0,
        explanation: '「は」đánh dấu chủ ngữ. 「私は学生です」= Tôi là học sinh.',
      },
      {
        q: '「Peterは音楽家です。」Nghĩa là gì?',
        options: ['Peter là nhạc công', 'Peter thích nghe nhạc', 'Peter đang nghe nhạc', 'Peter đang học nhạc'],
        answerIndex: 0,
        explanation: '「〜は〜です」= "X là Y". 音楽家 (ongyaku-ka) = nhạc công, nhạc sĩ.',
      },
    ],
  },
  {
    id: 'ja-n5-02',
    level: 'n5',
    order: 2,
    title: 'を — Tân ngữ',
    formula: ['私は〜を食べます', '〜を買います'],
    explain:
      '「を」đọc là "o", chỉ tân ngữ — thứ bị tác động lên. ' +
      'Chỉ dùng với động từ hữu động. Thứ tự câu: chủ ngữ + tân ngữ + trợ từ (SOV, ngược với tiếng Anh).',
    examples: [
      { jp: '毎朝パンを食べます。', vi: 'Sáng nào tôi cũng ăn bánh mì.', note: 'を + 食べます' },
      { jp: 'コーヒーを飲みます。', vi: 'Tôi uống cà phê.', note: 'を + 飲みます' },
    ],
    practice: [
      {
        q: '「ご飯 ＿ 食べます。」Chọn trợ từ đúng.',
        options: ['を', 'は', 'に', 'が'],
        answerIndex: 0,
        explanation: 'Ăn là hành động hữu động nên cần を.',
      },
    ],
  },
  {
    id: 'ja-n5-03',
    level: 'n5',
    order: 3,
    title: 'に と で — Nơi chốn và thời gian',
    formula: ['学校に行きます', '家で勉強します', '七時に起きます'],
    explain:
      '「に」chỉ điểm đến với động từ nội động (行きます) và thời điểm cụ thể (七時). ' +
      '「で」chỉ nơi chốn hành động xảy ra (家で) và phương tiện (電車で).',
    examples: [
      { jp: '来週、日本に行きます。', vi: 'Tuần sau tôi sẽ đi Nhật.', note: 'điểm đến → に' },
      { jp: '家で宿題をします。', vi: 'Tôi làm bài tập ở nhà.', note: 'nơi xảy ra → で' },
      { jp: '七時に起きます。', vi: 'Tôi thức dậy lúc 7 giờ.', note: 'thời điểm → に' },
    ],
    practice: [
      {
        q: '「毎日 ＿ 日本語を勉強します。」Chọn に hay で?',
        options: ['で', 'に', 'を', 'が'],
        answerIndex: 0,
        explanation: 'Học diễn ra ở một nơi chốn nên dùng で. 「学校に行きます」mới dùng に.',
      },
      {
        q: '「図書館に ＿ 。」(Tôi sẽ đi đến thư viện.) Chọn trợ từ.',
        options: ['に', 'で', 'を', 'は'],
        answerIndex: 0,
        explanation: '「行く」là động từ nội động nên điểm đến dùng に.',
      },
    ],
  },
  {
    id: 'ja-n5-04',
    level: 'n5',
    order: 4,
    title: 'が — Tồn tại: あります と います',
    formula: ['庭に犬がいます', '机の上に本があります'],
    explain:
      '「あります」dùng cho vật vô tri, 「います」dùng cho sinh vật sống. ' +
      '「が」đánh dấu chủ ngữ, dùng khi chủ ngữ chưa biết (何が…). ' +
      'Sự tồn tại luôn gắn với một nơi chốn: 「〜に〜がいます/あります」.',
    examples: [
      { jp: '庭に犬がいます。', vi: 'Trong vườn có con chó.', note: 'います + động vật' },
      { jp: '机の上に本があります。', vi: 'Trên bàn có sách.', note: 'あります + vật' },
      { jp: '何がありますか。', vi: 'Có gì ở đây à?', note: '〜がありますか' },
    ],
    practice: [
      {
        q: '「庭に鳥が ＿ 。」(Trong vườn có chim.) Chọn đúng.',
        options: ['います', 'あります', 'です', 'します'],
        answerIndex: 0,
        explanation: 'Chim là sinh vật sống nên dùng います.',
      },
      {
        q: '「冷蔵庫に何が ＿ か。」Chọn từ điền.',
        options: ['あります', 'います', 'です', 'します'],
        answerIndex: 0,
        explanation: 'Đồ vật trong tủ lạnh dùng あります.',
      },
    ],
  },
  {
    id: 'ja-n5-05',
    level: 'n5',
    order: 5,
    title: 'Động từ Ichidan (一段動詞)',
    formula: ['ます: 食べます', 'た: 食べました', 'ない: 食べません'],
    explain:
      'Ichidan bỏ 「ます」rồi thêm lại 「ます」: 食べます. ' +
      'Quá khứ thêm 「ました」, phủ định thêm 「ません」, thể て là dạng gốc + 「て」. ' +
      'Danh hiệu nhận biết: động từ ichidan tận cùng bằng え hoặc り (|ru) ngoại trừ する.',
    examples: [
      { jp: '朝ごはんを食べました。', vi: 'Tôi đã ăn sáng.', note: 'た形 ました' },
      { jp: '毎日勉强しません。', vi: 'Tôi không học mỗi ngày.', note: 'phủ định ません' },
      { jp: '日本語を話します。', vi: 'Tôi nói tiếng Nhật.', note: 'ます' },
    ],
    practice: [
      {
        q: '「寝る」(ngủ) ở thể quá khứ là gì?',
        options: ['寝ました', '寝りました', '寝てました', '寝まます'],
        answerIndex: 0,
        explanation: 'Ichidan không đổi thân: 寝 + ました = 寝ました.',
      },
    ],
  },
  {
    id: 'ja-n5-06',
    level: 'n5',
    order: 6,
    title: 'Động từ Godan (五段動詞)',
    formula: ['書きます', '泳ぎます', '待ちます'],
    explain:
      'Godan đổi âm cuối trước khi gắn suffix. ' +
      'く → き, ぐ → ぎ, す → し, む・ぶ・ぬ → び・ぴ・に, ' +
      'う・つ・る → い, い・ち・り → い, え → え.',
    examples: [
      { jp: '手紙を書きます。', vi: 'Tôi viết thư.', note: '書きます — k→ki' },
      { jp: '毎朝走ります。', vi: 'Sáng nào tôi chạy.', note: '走ります — ri→ri' },
      { jp: '登録します。', vi: 'Tôi đăng ký.', note: '登録します — ku→ki' },
    ],
    practice: [
      {
        q: '「泳ぐ」(bơi) ở thể ます là gì?',
        options: ['泳ぎます', '泳います', '泳ぬます', '泳ぬます'],
        answerIndex: 0,
        explanation: 'Nhóm ぐ → ぎ: 泳ぎます.',
      },
      {
        q: '「買う」(mua) ở thể ます là gì?',
        options: ['買います', '買うます', '買ぬます', '買ぎます'],
        answerIndex: 0,
        explanation: 'Nhóm う → い: 買います.',
      },
    ],
  },
  {
    id: 'ja-n5-07',
    level: 'n5',
    order: 7,
    title: 'Tính từ い-形容詞',
    formula: ['高い', '高くないです', '高くて'],
    explain:
      'Tính từ い chia theo dạng: い → くない (phủ định), い → くて (thể て), い → ければ (nếu). ' +
      'Danh hiệu nhận biết: い-adj thường kết thúc bằng く・い・し・い.',
    examples: [
      { jp: 'このりんごは安いです。', vi: 'Quả táo này rẻ.', note: '便宜 (yênshi)' },
      { jp: 'その店の料理は安くないです。', vi: 'Món ăn ở quán đó không rẻ.', note: '安くないです' },
      { jp: '便宜くておいしいです。', vi: 'Rẻ mà còn ngon.', note: '便宜くておいしい' },
    ],
    practice: [
      {
        q: '「高い」(cao) phủ định là gì?',
        options: ['高くないです', '高いないです', '高しますない', '高くなかった'],
        answerIndex: 0,
        explanation: 'い-adj phủ định: い → くない です.',
      },
    ],
  },
  {
    id: 'ja-n5-08',
    level: 'n5',
    order: 8,
    title: 'Tính từ な-形容詞',
    formula: ['元気です', '元気ではない', '元気な人'],
    explain:
      'な-adj có gốc là danh từ, đứng trước danh từ phải gắn 「な」: 元気な人. ' +
      'Phủ định dùng 「ではありません」, không dùng 「くない」. ' +
      'Danh hiệu nhận biết: 静か、元気、好き、便利、大事 — gốc là danh từ.',
    examples: [
      { jp: 'この建物は新しいです。', vi: 'Tòa nhà này mới.', note: '新しい — ví dụ na-adj' },
      { jp: 'みんな元気ですか。', vi: 'Mọi người khỏe chứ?', note: '元気' },
      { jp: '静かな公園です。', vi: 'Đây là công viên yên tĩnh.', note: 'な đứng trước danh từ' },
    ],
    practice: [
      {
        q: '「元気」(khỏe) thuộc loại nào?',
        options: ['な-形容詞', 'い-形容詞', '名詞', '動詞'],
        answerIndex: 0,
        explanation: '元気 là な-adjective: 元気です / 元気な人. Không dùng 元気ない.',
      },
    ],
  },
  {
    id: 'ja-n5-09',
    level: 'n5',
    order: 9,
    title: 'Số và bộ đếm (助数詞)',
    formula: ['二人 futari', '五枚 gomai', '三本 sanpon'],
    explain:
      'Tiếng Nhật BẮT BUỘC dùng bộ đếm sau số, và bộ đếm quyết định loại vật được đếm. ' +
      'Số 1–10 dùng từ đếm riêng: ひとつ、ふたつ、みっつ… Từ 11 trở lên dùng 十 + số: じゅういち, にじゅうさん.',
    examples: [
      { jp: '兄弟が二人います。', vi: 'Tôi có hai anh em.', note: '二人 futari — số 2 riêng' },
      { jp: '切手を五枚送ります。', vi: 'Tôi gửi năm phong thư.', note: '五枚 — mai cho vật phẳng' },
      { jp: 'ビールを三本飲みます。', vi: 'Tôi uống ba lon bia.', note: '三本 — pon cho chai lon' },
    ],
    practice: [
      {
        q: '「3 本の鉛筆」中「本」đọc là gì?',
        options: ['pon', 'mai', 'nin', 'dai'],
        answerIndex: 0,
        explanation: '本 đọc hon với số 4–10 và pon với số 1–3: 三本 = sanpon.',
      },
      {
        q: '「五个学生」应该用哪个助数词?',
        options: ['五人 gonin', '五枚 gomai', '五本 gohon', '五つ mutsu'],
        answerIndex: 0,
        explanation: 'Đếm người dùng 人 (nin): 五人 = gonin.',
      },
    ],
  },
  {
    id: 'ja-n5-10',
    level: 'n5',
    order: 10,
    title: 'Thời gian: から と まで と に',
    formula: ['九時から五時まで', '三時に起きます', '二年間'],
    explain:
      '「から」bắt đầu, 「まで」kết thúc, 「に」tại thời điểm. ' +
      '「の」đặt sau khoảng thời gian để chỉ "trong suốt": 「三年の間」.',
    examples: [
      { jp: '上课は九時から五時までです。', vi: 'Lớp học từ 9h đến 17h.', note: 'から + まで' },
      { jp: '毎日六時に起きます。', vi: 'Tôi dậy lúc 6h mỗi ngày.', note: 'に + thời điểm' },
      { jp: '二年間日本に住みました。', vi: 'Tôi sống ở Nhật hai năm.', note: '二年間' },
    ],
    practice: [
      {
        q: '「会议 10 点 ＿ 12 点」chọn trợ từ nào?',
        options: ['から', 'まで', 'に', 'で'],
        answerIndex: 0,
        explanation: 'から là điểm bắt đầu: 十時から十二時まで.',
      },
    ],
  },
  {
    id: 'ja-n5-11',
    level: 'n5',
    order: 11,
    title: 'Thể phủ định: ない と ません',
    formula: ['食べない', '食べません', '行きません'],
    explain:
      'Ichidan: bỏ る + ない. Godan: đổi âm cuối + ない. ' +
      'Thể lịch sự thay ない bằng ません, thêm です ở cuối câu.',
    examples: [
      { jp: 'お酒は飲みません。', vi: 'Tôi không uống rượu.', note: 'ません' },
      { jp: '昨日台风でした。', vi: 'Hôm qua có bão.', note: 'でした' },
    ],
    practice: [
      {
        q: '「行く」phủ định lịch sự là gì?',
        options: ['行きません', '行きない', '行ないません', '行ません'],
        answerIndex: 0,
        explanation: 'Godan く → き rồi thêm ません: 行きません.',
      },
    ],
  },
  {
    id: 'ja-n5-12',
    level: 'n5',
    order: 12,
    title: 'Gợi ý và rủ rê: ましょう と ませんか',
    formula: ['〜ましょう', '〜ませんか', '〜ましょうか'],
    explain:
      '「〜ましょう」gợi ý "cùng làm nhé". ' +
      '「〜ませんか」rủ rê lịch sự, dùng với người quen. ' +
      '「〜ましょうか」nhấn mạnh hơn, gần nghĩa "chúng ta nên làm gì?".',
    examples: [
      { jp: 'いっしょに行きましょう。', vi: 'Cùng đi nhé.', note: 'ましょう' },
      { jp: '明日の映画を見るませんか。', vi: 'Đi xem phim ngày mai không?', note: 'ませんか' },
    ],
    practice: [
      {
        q: 'Rủ bạn "ngày mai đi chơi nhé" cách nào tự nhiên nhất?',
        options: ['明日遊びませんか。', '明日遊びますか。', '明日遊んでください。', '明日遊んでもいいです。'],
        answerIndex: 0,
        explanation: 'ませんか là cách mời lịch sự dùng với bạn bè.',
      },
    ],
  },
  {
    id: 'ja-n5-13',
    level: 'n5',
    order: 13,
    title: 'Nghĩa vụ: なければなりません と ないと',
    formula: ['〜なければなりません', '〜ないと不行'],
    explain:
      '「〜なければなりません」= phải, phải làm. ' +
      '「〜ないと不行」= nếu không… thì không được. ' +
      'Cách nói năng: 〜なきゃいけない.',
    examples: [
      { jp: '明日までに出さなければなりません。', vi: 'Phải nộp trước ngày mai.', note: 'なければ' },
      { jp: '時間を守らないと不行です。', vi: 'Không giữ giờ thì không được.', note: 'ないと' },
    ],
    practice: [
      {
        q: '「Phải ăn sáng」dùng mẫu nào?',
        options: ['朝ごはんを食べなければなりません。', '朝ごはんを食べたくありません。', '朝ごはんを食べてよかった。', '朝ごはんを食べましょう。'],
        answerIndex: 0,
        explanation: '〜なければ = phải (bắt buộc).',
      },
    ],
  },
  {
    id: 'ja-n5-14',
    level: 'n5',
    order: 14,
    title: 'Vị trí: 上・下・中・横・隣',
    formula: ['上にあります', '隣にいます', '前に주세요'],
    explain:
      'Vị trí: 上 (trên), 下 (dướng), 中 (trong), 外 (ngoài), 前 (trước), 後ろ (sau), ' +
      '横 (bên cạnh), 隣 (hàng xóm). Luôn gắn vị trí với に.',
    examples: [
      { jp: '机の上に本があります。', vi: 'Trên bàn có sách.', note: '上にあります' },
      { jp: 'あの人の隣に座ってください。', vi: 'Ngồi cạnh người đó nhé.', note: '隣に' },
    ],
    practice: [
      {
        q: '「在山上」chọn cách nào?',
        options: ['山の上にいます。', '山の上です。', '山の上をいます。', '山の上がいます。'],
        answerIndex: 0,
        explanation: 'Vị trí luôn gắn với に.',
      },
    ],
  },
  {
    id: 'ja-n5-15',
    level: 'n5',
    order: 15,
    title: 'て — Cầu nối câu',
    formula: ['〜てから', '〜ています', '〜てしまう'],
    explain:
      'Thể て là xương sống của tiếng Nhật. ' +
      '「〜てから」= sau khi. 「〜ています」= đang / kết quả còn tồn tại. ' +
      '「〜てしまう」= tiếc nuối hoặc vô tình làm. 「〜てもいい」= được phép.',
    examples: [
      { jp: 'ご飯を食べてから寝ます。', vi: 'Tôi ăn cơm rồi ngủ.', note: 'てから' },
      { jp: '財布をなくしました。', vi: 'Tôi làm mất ví.', note: 'てしまう — tiếc' },
      { jp: '今、弁当を作っています。', vi: 'Tôi đang làm cơm hộp.', note: 'ています' },
    ],
    practice: [
      {
        q: '「这门课很有趣」chọn cách nào?',
        options: ['この授業はおもしろいです。', 'この授業は上课します。', 'この授業は免费です。', 'この授業に行きます。'],
        answerIndex: 0,
        explanation: '「〜は〜がおもしろい」= cái gì thú vị. 授業 = lớp học.',
      },
    ],
  },

  {
    id: 'ja-n4-01',
    level: 'n4',
    order: 16,
    title: 'Cách điều kiện: と と たら と なら と ば',
    formula: ['雨が降ると', '〜たら', '〜なら', '〜ば'],
    explain:
      '「と」= khi… thì luôn (tự nhiên, phổ quát). ' +
      '「たら」= nếu (giả định cụ thể, hoặc sau khi hoàn tất). ' +
      '「なら」= nếu là (nói về hiện tại). ' +
      '「ば」= nếu (hình thức, điều kiện chưa xảy ra).',
    examples: [
      { jp: '春になると、花が咲きます。', vi: 'Khi vào xuân, hoa nở.', note: 'と' },
      { jp: '雨が降ったら、家に帰ります。', vi: 'Nếu trời mưa, tôi sẽ về nhà.', note: 'たら' },
      { jp: '学生なら、割引があります。', vi: 'Nếu là học sinh thì được giảm giá.', note: 'なら' },
      { jp: '安ければ、買います。', vi: 'Nếu rẻ thì tôi mua.', note: 'ば' },
    ],
    practice: [
      {
        q: '「如果下雨的话我不去」tự nhiên nhất là?',
        options: ['雨が降ったら、行きません。', '雨が降ると、行きません。', '雨が降れば、行きません。', '雨が降なら、行きません。'],
        answerIndex: 0,
        explanation: 'たら = "nếu thì" (giả định cụ thể). と nghĩa là "khi… luôn".',
      },
    ],
  },
  {
    id: 'ja-n4-02',
    level: 'n4',
    order: 17,
    title: 'て形 — Nối câu và xin phép',
    formula: ['〜てください', '〜てもいいです', '〜てはいけません'],
    explain:
      'Ghép câu bằng て: 〜てください (xin vui lòng), 〜てもいいです (được phép), ' +
      '〜てはいけません (không được phép), 〜ても originationOriginated.',
    examples: [
      { jp: 'ここに名前を書いてください。', vi: 'Xin viết tên ở đây.', note: 'てください' },
      { jp: 'ここで写真を撮ってもいいですか。', vi: 'Tôi chụp ảnh ở đây được không?', note: 'てもいい' },
      { jp: '宿題をしてから寝ます。', vi: 'Tôi làm bài tập rồi ngủ.', note: 'てから' },
    ],
    practice: [
      {
        q: '「可以吸烟吗？」dùng mẫu nào?',
        options: ['たばこを吸ってもいいですか。', 'たばこを吸ってください。', 'たばこを吸てはいけません。', 'たばこを吸わないです。'],
        answerIndex: 0,
        explanation: 'Xin phép = 〜てもいいですか.',
      },
    ],
  },
  {
    id: 'ja-n4-03',
    level: 'n4',
    order: 18,
    title: ' Cho — Nhận — Cho',
    formula: ['A が B に〜をあげます', 'B が A に〜をくれます', 'A が B に〜をもらいます'],
    explain:
      '「あげる」người nói là người cho. ' +
      '「くれる」người khác cho mình. ' +
      '「もらう」mình nhận từ người khác. ' +
      'Mẫu đảo: 「〜てあげる」= làm hộ người khác, 「〜てもらう」= nhờ người khác làm.',
    examples: [
      { jp: '友達に花をあげました。', vi: 'Tôi tặng hoa cho bạn.', note: 'tôi cho' },
      { jp: '彼女がプレゼントをくれました。', vi: 'Cô ấy tặng tôi quà.', note: 'người khác cho tôi' },
      { jp: '先生に日本語を教えてもらいました。', vi: 'Tôi được thầy dạy tiếng Nhật.', note: 'tôi nhận' },
    ],
    practice: [
      {
        q: '「老师教了我」dùng động từ nào?',
        options: ['先生に教えてもらいました。', '先生にあげました。', '先生にくれました。', '先生にもらいました。'],
        answerIndex: 0,
        explanation: 'Ai dạy tôi thì tôi 教えてもらいました (tôi là người nhận).',
      },
    ],
  },
  {
    id: 'ja-n4-04',
    level: 'n4',
    order: 19,
    title: 'Thể năng lực (可能形)',
    formula: ['泳げます', '食べられます', 'できます'],
    explain:
      'Godan: 泳ぎます → 泳げます (nhóm u + e). ' +
      'Ichidan: 食べます → 食べられます. ' +
      '「できます」dùng riêng cho kỹ năng. ' +
      '「〜なければなりません」cũng có thể nghĩa là "không làm được" (lỗi kỹ thuật).',
    examples: [
      { jp: '日本語を話せます。', vi: 'Tôi có thể nói tiếng Nhật.', note: '話せます' },
      { jp: 'この料理は食べられますか。', vi: 'Ăn được món này không?', note: 'Ichidan' },
    ],
    practice: [
      {
        q: '「可以看见富士山」dùng mẫu nào?',
        options: ['富士山が見えます。', '富士山を見ます。', '富士山を見ます。', '富士山が見られます。'],
        answerIndex: 0,
        explanation: '「見える」= có thể nhìn thấy (năng lực). 「見る」= nhìn (hành động).',
      },
    ],
  },
  {
    id: 'ja-n4-05',
    level: 'n4',
    order: 20,
    title: 'Câu bị độc và bị ép',
    formula: ['〜されます', '〜せます', '見られます'],
    explain:
      '「〜される / 〜れる」= bị (bị động). ' +
      '「〜させる」= bắt ai làm gì (bị ép). ' +
      '「名詞＋される」= danh từ trở thành thụ động (先生になる → 先生にされる).',
    examples: [
      { jp: '窃盗に盗まれました。', vi: 'Bị trộm cắp.', note: 'bị động' },
      { jp: '母に野菜を食べさせます。', vi: 'Mẹ bắt tôi ăn rau.', note: 'bị ép' },
      { jp: '支払いは現金のみです。', vi: 'Thanh toán chỉ bằng tiền mặt.', note: '名詞＋は' },
    ],
    practice: [
      {
        q: '「让孩子读书」dùng mẫu nào?',
        options: ['子どもに本を読ませます。', '子どもに本を読みます。', '子どもが本を読みます。', '子どもに本を読ませたいです。'],
        answerIndex: 0,
        explanation: ' causative 让 = 〜させます.',
      },
    ],
  },
  {
    id: 'ja-n4-06',
    level: 'n4',
    order: 21,
    title: 'Lý do và nhượng bộ: ので と から と けど と のに',
    formula: ['〜ので', '〜から', '〜けど / 〜が', '〜のに'],
    explain:
      '「〜ので」= vì (lịch sự, có thể đặt sau cả câu). ' +
      '「〜から」= vì (thân mật, chỉ đặt sau mệnh đề chính). ' +
      '「〜けど / 〜が」= nhưng (nhẹ). ' +
      '「〜のに」= nhưng (trái ý, bất ngờ).',
    examples: [
      { jp: '雨がないので、散歩します。', vi: 'Vì không mưa nên tôi đi dạo.', note: 'ので' },
      { jp: '安いけど、あまりおいしくない。', vi: 'Rẻ nhưng không ngon lắm.', note: 'けど' },
      { jp: '安いのに買いませんでした。', vi: 'Rẻ mà tôi vẫn không mua.', note: 'のに' },
    ],
    practice: [
      {
        q: '「因为下雨了所以不去」dùng mẫu nào?',
        options: ['雨が降るので、行きません。', '雨が降っても、行きません。', '雨が降ると、行きません。', '雨が降らないので、行きません。'],
        answerIndex: 0,
        explanation: 'ので = vì (lịch sự). から cũng được nhưng thân mật hơn.',
      },
    ],
  },
  {
    id: 'ja-n4-07',
    level: 'n4',
    order: 22,
    title: 'Cách khiêm tốn: いただけます か',
    formula: ['〜ていただけますか', 'ございます', '〜ちょっと'],
    explain:
      '「〜ていただけますか」= xin phép lịch sự nhất (nghĩa "xin hãy làm cho tôi"). ' +
      '「ございます」= kính ngữ, thay cho います/です. ' +
      '「ちょっと」= một chút (giảm nhẹ, từ chối lịch sự).',
    examples: [
      { jp: '明日、耳が痛いので、病院に行きます。', vi: 'Ngày mai tôi đi khám vì đau tai.', note: 'ので — nêu lý do' },
      { jp: 'もう少しお待ちいただけますか。', vi: 'Bạn chờ thêm một chút được không?', note: 'いただけますか' },
    ],
    practice: [
      {
        q: '「你能来吗？」lịch sự nhất là?',
        options: ['来ていただけますか。', '来ますか。', '来てください。', '来て医学会。'],
        answerIndex: 0,
        explanation: '〜いただけますか là kính ngữ dùng để xin hỏi người trên hoặc người quen.',
      },
    ],
  },
  {
    id: 'ja-n4-08',
    level: 'n4',
    order: 23,
    title: 'So sánh và phủ định mềm',
    formula: ['〜のほうが〜より', '〜と同じくらい', '〜ほど（ない）'],
    explain:
      '「〜のほうが〜より」= cái nào hơn. ' +
      '「〜と同じくらい」= tương đương với. ' +
      '「〜ほど（ない）」= không bằng. ' +
      '「〜 registrando」= chưa bao giờ.',
    examples: [
      { jp: '電車より飛行機のほうが速いです。', vi: 'Máy bay nhanh hơn tàu.', note: 'は〜より' },
      { jp: 'コーヒーと同じくらい甘い。', vi: 'Ngọt ngang cà phê.', note: 'と同じくらい' },
    ],
    practice: [
      {
        q: '「A 比 B 便宜」dùng mẫu nào?',
        options: ['AのほうがBより安いです。', 'AよりBのほうが安い。', 'AのほうがBを安い。', 'AはBに安いです。'],
        answerIndex: 0,
        explanation: 'Cấu trúc 「〜のほうが〜より」= cái nào hơn.',
      },
    ],
  },
  {
    id: 'ja-n4-09',
    level: 'n4',
    order: 24,
    title: 'Văn bản thân mật và trang trọng',
    formula: ['plainly casual', 'だ・である', 'です・ます'],
    explain:
      'Văn bản học thuật và tin tức dùng 「である」. ' +
      'Giao tiếp và email dùng 「です・ます」. ' +
      '「 Plain」nghĩa là thân mật, chỉ dùng với bạn bè.',
    examples: [
      { jp: '私は学生である。', vi: 'Tôi là sinh viên. (văn bản)', note: 'である体' },
      { jp: '私は学生です。', vi: 'Tôi là sinh viên. (lịch sự)', note: 'です体' },
    ],
    practice: [
      {
        q: 'Báo cáo học thuật thường dùng văn phong nào?',
        options: ['である体', 'です・ます体', 'thân mật', 'thể tilde'],
        answerIndex: 0,
        explanation: 'である体 dùng cho bài báo, báo cáo. です・ます体 dùng cho hội thoại và email lịch sự.',
      },
    ],
  },

  {
    id: 'ja-n3-01',
    level: 'n3',
    order: 25,
    title: 'So sánh giống như: みたいに と ように と 必需的',
    formula: ['〜みたいに', '〜ような', '〜かのように'],
    explain:
      '「〜みたいに」nối với câu. ' +
      '「〜ような + danh từ」nối với danh từ. ' +
      '「〜かのように」nâng cao, dùng trong văn viết.',
    examples: [
      { jp: '子供みたいに笑う。', vi: 'Cười như trẻ con.', note: 'みたいに' },
      { jp: '夏のような暑さだ。', vi: 'Nóng như mùa hè.', note: 'ような' },
    ],
    practice: [
      {
        q: '「像他哥哥一样」dùng mẫu nào?',
        options: ['彼のお兄さんのように。', '彼のお兄さんのみたいな。', '彼のお兄さんの酋。', '彼のお兄さんの打算。'],
        answerIndex: 0,
        explanation: 'Nối với danh từ: 〜のように (giống như). Với câu thì dùng 〜みたいに.',
      },
    ],
  },
  {
    id: 'ja-n3-02',
    level: 'n3',
    order: 26,
    title: 'Nghe đồn と Có vẻ',
    formula: ['〜そうです', '〜多糖', '〜らしい'],
    explain:
      '「mệnh đề + そうです」= nghe nói là. ' +
      '「danh từ + そうです」= có vẻ như. ' +
      '「〜らしい」= hình như, có dấu hiệu là.',
    examples: [
      { jp: '明日は雨だそうです。', vi: 'Nghe nói ngày mai có mưa.', note: 'động từ + そうです' },
      { jp: '雨降りの気配がある。', vi: 'Có dấu hiệu sắp mưa.', note: 'danh từ + そう' },
    ],
    practice: [
      {
        q: '「听说他明天来」dùng mẫu nào?',
        options: ['彼は明日来るそうです。', '彼は明日来るでしょう。', '彼は明日来たら、来ます。', '彼は来てほしいです。'],
        answerIndex: 0,
        explanation: '「động từ + そう」= nghe đồn.',
      },
    ],
  },
  {
    id: 'ja-n3-03',
    level: 'n3',
    order: 27,
    title: 'Nguyên nhân sâu: ために と ように と せいで',
    formula: ['〜ために', '〜ように', '〜せいで', '〜おかげで'],
    explain:
      '「〜ために」= vì hoặc để. ' +
      '「〜ように」= để (mục đích). ' +
      '「〜せいで」= vì (tiêu cực, "do bởi"). ' +
      '「〜おかげで」= vì (tích cực, "nhờ").',
    examples: [
      { jp: '雨のせいで、競技が中止になった。', vi: 'Vì mưa, giải đấu bị hoãn.', note: 'せいで' },
      { jp: 'あなたのおかげで合格しました。', vi: 'Nhờ bạn mà tôi đỗ.', note: 'おかげで' },
    ],
    practice: [
      {
        q: '「多亏了你我通过了」dùng mẫu nào?',
        options: ['あなたのおかげで合格しました。', 'あなたのためにしました。', 'あなたのせいで合格しました。', 'おかげでです。'],
        answerIndex: 0,
        explanation: 'おかげで = nhờ (tích cực). せいで = vì (tiêu cực).',
      },
    ],
  },
  {
    id: 'ja-n3-04',
    level: 'n3',
    order: 28,
    title: 'Khuyến nghị: ほうがいい と でしょう',
    formula: ['〜たほうがいい', '〜たほうがいいでしょう', '〜なくて困る'],
    explain:
      '「〜たほうがいい」= nên làm. ' +
      '「〜たほうがいいでしょう」= chắc là nên. ' +
      '「〜なくて困る」= không thể nào chịu nổi. ' +
      '「〜てほしい」= ước mong ai đó làm gì.',
    examples: [
      { jp: 'そろそろ帰ったほうがいい。', vi: 'Tôi nên về rồi.', note: 'たほうがいい' },
      { jp: '漢字が読めなくて困っています。', vi: 'Tôi không đọc được kanji nên rất khó.', note: 'なくて困る' },
    ],
    practice: [
      {
        q: '「我该走了」dùng mẫu nào?',
        options: ['そろそろ帰ったほうがいいです。', 'そろそろ帰ってください。', 'そろそろ帰らない。', 'そろそろ帰りたくない。'],
        answerIndex: 0,
        explanation: 'たほうがいい = nên (khuyến nghị).',
      },
    ],
  },
  {
    id: 'ja-n3-05',
    level: 'n3',
    order: 29,
    title: 'Vừa vừa と Song song',
    formula: ['〜ながら', '〜alongside', '〜つつ'],
    explain:
      '「〜ながら」= vừa… vừa…, hai hành động của cùng một chủ thể. ' +
      '「〜つつ」cũng nghĩa tương tự nhưng trang trọng hơn, hay dùng trong văn viết.',
    examples: [
      { jp: '音楽を聞きながら勉強します。', vi: 'Tôi vừa nghe nhạc vừa học.', note: 'ながら' },
    ],
    practice: [
      {
        q: '「一边吃饭一边看电视」dùng mẫu nào?',
        options: ['ご飯を食べながらテレビを見ます。', 'ご飯を食べてテレビを見ます。', 'ご飯 Bands.', 'ご飯を食べたらテレビを見ます。'],
        answerIndex: 0,
        explanation: 'ながら = vừa… vừa… (song song, cùng chủ thể).',
      },
    ],
  },
  {
    id: 'ja-n3-06',
    level: 'n3',
    order: 30,
    title: 'Dự định と Dự kiến',
    formula: ['〜つもりです', '〜予定です', '〜はずです', '〜でしょう'],
    explain:
      '「〜つもりです」= dự định, còn có thể đổi. ' +
      '「〜予定です」= đã lên kế hoạch, cố định hơn. ' +
      '「〜はずです」= lẽ ra phải là. ' +
      '「〜でしょう」= suy đoán, dự báo.',
    examples: [
      { jp: '夏休みに日本へ行く予定です。', vi: 'Tôi dự định đi Nhật hè.', note: '予定です' },
      { jp: '明日は晴れるはずです。', vi: 'Ngày mai lẽ ra phải nắng.', note: 'はずです' },
    ],
    practice: [
      {
        q: '「我打算去日本」dùng mẫu nào?',
        options: ['日本へ行く予定です。', '日本へ行くつもりです。', '日本へ行きます。', '日本へ行きました。'],
        answerIndex: 1,
        explanation: 'つもり = dự định (còn đổi được). 予定 = đã lên kế hoạch.',
      },
    ],
  },
  {
    id: 'ja-n3-07',
    level: 'n3',
    order: 31,
    title: 'Phủ định mềm: わけではない',
    formula: ['〜わけではない', '〜わけではないが', '〜に過ぎない'],
    explain:
      '「〜わけではない」= không hẳn là (phủ định mềm, vẫn thừa nhận một phần). ' +
      '「〜わけではないが」= không hẳn, nhưng… . ' +
      '「〜に過ぎない」= chỉ là, không hơn. ' +
      '「〜次第」= tùy vào.',
    examples: [
      { jp: '嫌いなわけではありません。', vi: 'Không phải là tôi ghét.', note: 'phủ định mềm' },
      { jp: 'うまい不过是普通です。', vi: 'Ngon nhưng chỉ ở mức bình thường.', note: 'に過ぎない' },
    ],
    practice: [
      {
        q: '「我不是说讨厌」dùng mẫu nào?',
        options: ['嫌いなわけではありません。', '嫌いです。', '嫌いだろう。', '嫌いでした。'],
        answerIndex: 0,
        explanation: 'わけではない = "không phải là…" (phủ định mềm).',
      },
    ],
  },
  {
    id: 'ja-n3-08',
    level: 'n3',
    order: 32,
    title: 'Kết quả và kết thúc: の結果 と の末に',
    formula: ['〜の結果', '〜の末に', '〜次第', '〜おかげで'],
    explain:
      '「〜の結果」= kết quả của. ' +
      '「〜の末に」= sau khi… đã kết thúc. ' +
      '「〜次第」= tùy vào. ' +
      '「〜次第だ」= hoàn toàn phụ thuộc vào.',
    examples: [
      { jp: '努力の結果です。', vi: 'Đây là kết quả của nỗ lực.', note: 'の結果' },
      { jp: '苦小区的末に、合格しました。', vi: 'Sau nhiều khổ sở, tôi đã đỗ.', note: 'の末に' },
    ],
    practice: [
      {
        q: '「经过努力的结果」dùng mẫu nào?',
        options: ['努力の結果です。', '努力によってです。', '努力のためにです。', '努力の結果的样子。'],
        answerIndex: 0,
        explanation: '〜の結果 = kết quả của. 〜の末に = sau khi đã trải qua.',
      },
    ],
  },
  {
    id: 'ja-n3-09',
    level: 'n3',
    order: 33,
    title: 'Cụm từ N3 thường gặp',
    formula: ['〜による', '〜に対して', '〜において', '〜とともに'],
    explain:
      '「〜による」= do, bởi (nguyên nhân gián tiếp, trang trọng). ' +
      '「〜に対して」= đối với. ' +
      '「〜において」= tại, trong (văn bản). ' +
      '「〜とともに」= cùng với.',
    examples: [
      { jp: '事故による遅れです。', vi: 'Chậm trễ do tai nạn.', note: 'による' },
      { jp: '日本に関して研究しています。', vi: 'Tôi đang nghiên cứu về Nhật.', note: 'に関して' },
    ],
    practice: [
      {
        q: '「由于事故」trong văn viết trang trọng dùng?',
        options: ['事故により', '事故で', '事故に', '事故の'],
        answerIndex: 0,
        explanation: '「〜による / 〜により」trang trọng hơn 「〜で」.',
      },
    ],
  },
  {
    id: 'ja-n3-10',
    level: 'n3',
    order: 34,
    title: 'Trợ từ bổ nghĩa nâng cao',
    formula: ['〜つつ', '〜において', '〜わけには'],
    explain:
      '「〜わけにはいかない」= không thể (vì lý do khách quan). ' +
      '「〜わけがない」= không thể nào (không đời nào). ' +
      '「〜次第」= tùy vào. ' +
      '「〜かねる」= có khả năng (tiêu cực, dùng trong văn viết).',
    examples: [
      { jp: '今の時間では出られない。', vi: 'Giờ này không thể ra ngoài.', note: 'では出られない' },
      { jp: '彼が Such はずがない。', vi: 'Không thể nào chuyện đó xảy ra.', note: 'はずがない' },
    ],
    practice: [
      {
        q: '「现在不可能出去」dùng mẫu nào?',
        options: ['今の時間では出られません。', '今出ないです。', '今出ませんでした。', '今出たくないです。'],
        answerIndex: 0,
        explanation: '「〜では〜られない」= không thể (bị giới hạn bởi hoàn cảnh).',
      },
    ],
  },
];