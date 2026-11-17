const unitSchoolSupplies = [
  { id:'school', word:'pasnanava-an', variants:[], meaning:'學校', image:'assets/images/school/pasnanava-an.png', audio:'assets/audio/school/pasnanava-an.wav', sentenceAudio:'assets/audio/school/pasnanava-an-sentence.wav', sourceSentence:'Ihaan inaak tama pasnanava-an.', sourceTranslation:'我的爸爸在學校裡。', sourceNote:'教材生活會話 2-8a；巒群男聲合成音檔。' },
  { id:'book', word:'patasan / haqil', variants:['patasan','haqil'], meaning:'書', image:'assets/images/school/patasan.png', audio:'assets/audio/school/patasan.wav', sentenceAudio:'assets/audio/school/patasan-sentence.wav', sourceSentence:'Piaqin isuu patasan / haqil?\nDusa inaak patasan / haqil.', sourceTranslation:'你有幾本書？\n我有兩本書。', sourceNote:'教材生活會話 2-5a；保留教材中的兩種說法，音檔採 patasan。' },
  { id:'pen', word:'ispapatas', variants:[], meaning:'筆', image:'assets/images/school/ispapatas.png', audio:'assets/audio/school/ispapatas.wav', sentenceAudio:'assets/audio/school/ispapatas-sentence.wav', sourceSentence:'Isaq inaak ispapatas?\nDii isuu ispapatas.', sourceTranslation:'我的筆在哪裡？\n你的筆在那裡。', sourceNote:'教材生活會話 2-8；巒群男聲合成音檔。' },
  { id:'eraser', word:'isqaqaisqais', variants:[], meaning:'橡皮擦', image:'assets/images/school/isqaqaisqais.png', audio:'assets/audio/school/isqaqaisqais.wav', sentenceAudio:'assets/audio/school/isqaqaisqais-sentence.wav', sourceSentence:'Isqaqaisqais naipa.', sourceTranslation:'那是橡皮擦。', sourceNote:'教材練習題 1-4-3；巒群男聲合成音檔。' },
  { id:'desk', word:'pangka', variants:[], meaning:'桌子', image:'assets/images/school/pangka.png', audio:'assets/audio/school/pangka.wav', sentenceAudio:'assets/audio/school/pangka-sentence.wav', sourceSentence:'Pangka naipa.', sourceTranslation:'那是桌子。', sourceNote:'教材練習題 1-4-4；巒群男聲合成音檔。' },
  { id:'chair', word:'lungquan / palusu', variants:['lungquan','palusu'], meaning:'椅子', image:'assets/images/school/lungquan.png', audio:'assets/audio/school/lungquan.wav', audioVariants:['assets/audio/school/palusu.wav'], sentenceAudio:'assets/audio/school/lungquan-sentence.wav', sourceSentence:'Lungquan / Palusu naipa.', sourceTranslation:'那是椅子。', sourceNote:'教材練習題 1-4-5；例句音檔採 lungquan。' },
  { id:'clothes', word:'hulus', variants:[], meaning:'衣服', image:'assets/images/school/hulus.png', audio:'assets/audio/school/hulus.wav', sentenceAudio:'assets/audio/school/hulus-sentence.wav', sourceSentence:'Haiza-an saam hulus.', sourceTranslation:'我們有衣服。', sourceNote:'教材練習題 2-1B；巒群男聲合成音檔。' },
  { id:'telephone', word:'patungqauta-an / patunpaklisan', variants:['patungqauta-an','patunpaklisan'], meaning:'電話', image:'assets/images/school/telephone.png', audio:'assets/audio/school/patungqauta-an.wav', audioVariants:['assets/audio/school/patunpaklisan.wav'], sentenceAudio:'assets/audio/school/patungqauta-an-sentence.wav', sourceSentence:'Patungqauta-an / Patunpaklisan naipa.', sourceTranslation:'那是電話。', sourceNote:'教材練習題 1-4-9；例句音檔採 patungqauta-an。' }
];

const questionBank = [
  { id:'book-count', type:'聽問題回答', prompt:'聽完問題後，選出正確的回答。', audio:'assets/audio/school/patasan-sentence.wav', options:['Dusa inaak patasan / haqil.','Ihaan inaak tama pasnanava-an.','Dii isuu ispapatas.'], answer:0, hint:'問題問的是有幾本書。', source:'Piaqin isuu patasan / haqil? / Dusa inaak patasan / haqil.' },
  { id:'school-place', type:'句子配圖', prompt:'哪一張圖表示「在學校」？', audio:'assets/audio/school/pasnanava-an-sentence.wav', options:['學校','書','電話'], answer:0, hint:'答案是 pasnanava-an。', source:'Ihaan inaak tama pasnanava-an.' },
  { id:'student-check', type:'情境問答', prompt:'聽到「Isnanava-an asu?」時，哪一個回答表示「是，我是學生」？', audio:'assets/audio/school/student-sentence.wav', options:['Uu! Isnanava-an saak.','Dii isuu ispapatas.','Dusa inaak patasan / haqil.'], answer:0, hint:'教材中的肯定回答以 Uu! 開頭。', source:'Isnanava-an asu? / Uu! Isnanava-an saak.' },
  { id:'pen-place', type:'位置判斷', prompt:'聽完句子後，找出正確的物品。', audio:'assets/audio/school/ispapatas-sentence.wav', options:['筆','書','桌子'], answer:0, hint:'句子中出現 ispapatas。', source:'Isaq inaak ispapatas? / Dii isuu ispapatas.' }
];

const gameModes = [
  { id:'learn', title:'詞彙營地', kicker:'MISSION 01', description:'先把詞彙和畫面記在腦中。' },
  { id:'listen-picture', title:'聽音小徑', kicker:'MISSION 02', description:'聽見族語，找到正確的圖卡。' },
  { id:'memory-match', title:'記憶溪谷', kicker:'MISSION 03', description:'翻開卡片，把詞彙和中文意思配在一起。' },
  { id:'sentence-challenge', title:'句子挑戰', kicker:'MISSION 04', description:'讀懂教材句子，選出正確的情境。' },
  { id:'boss-challenge', title:'句子首領', kicker:'BOSS BATTLE', description:'用一輪綜合問答守住學習成果。' }
];
