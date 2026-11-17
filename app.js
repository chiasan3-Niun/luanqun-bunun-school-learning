const $ = (selector) => document.querySelector(selector);
let currentMode = 'learn';
let currentQuestion = 0;
let stars = 0;
let badges = 0;
let selectedItemId = 'school';
const matchedCards = new Set();
let questionOrder = [];
let listenOrder = [];
let listenQuestionTypes = [];
let listenQuestions = [];

const listeningQuestionBank = [
  { type:'true-false', targetId:'desk', statementId:'school' },
  { type:'audio-picture', targetId:'school' },
  { type:'audio-word', targetId:'pen' },
  { type:'image-word', targetId:'eraser' }
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function setStatus(message) { $('#status').textContent = message; }
function awardStar() { stars += 1; $('#stars').textContent = stars; }
function awardBadge() { badges += 1; $('#badges').textContent = badges; }
function updateProgress() { $('#progress-label').textContent = `${Math.min(matchedCards.size + currentQuestion, 4)}/4`; }

function playAudio(path, button) {
  if (!path) { setStatus('這個詞彙的音檔尚在確認中。'); return; }
  const audio = new Audio(path);
  audio.playbackRate = 0.8;
  button.disabled = true;
  audio.addEventListener('ended', () => { button.disabled = false; });
  audio.play().catch(() => { button.disabled = false; setStatus('音檔無法播放，請檢查檔案。'); });
}

function playAudioFile(path) {
  return new Promise((resolve) => {
    if (!path) { resolve(); return; }
    const audio = new Audio(path);
    audio.playbackRate = 0.8;
    audio.addEventListener('ended', resolve, { once:true });
    audio.addEventListener('error', resolve, { once:true });
    audio.play().catch(resolve);
  });
}

async function playAudioSequence(item, button) {
  if (!item.audio) { setStatus('這個詞彙的音檔尚在確認中。'); return; }
  button.disabled = true;
  for (let repeatCount = 0; repeatCount < 3; repeatCount += 1) await playAudioFile(item.audio);
  for (const variantAudio of item.audioVariants || []) await playAudioFile(variantAudio);
  if (item.sentenceAudio) await playAudioFile(item.sentenceAudio);
  button.disabled = false;
  setStatus(item.sentenceAudio ? '單字練習三次，接著完成例句練習。' : '單字練習完成三次。');
}
function playCardAudio(item, button) { return playAudioSequence(item, button); }

function reportAudioIssue(item) {
  const description = window.prompt(`請描述「${item.word}」的音檔問題，例如：發音錯誤、音量太小或詞彙不符。`);
  if (!description?.trim()) return;
  const reports = JSON.parse(localStorage.getItem('luanqunAudioReports') || '[]');
  reports.push({ word:item.word, audio:item.audio, description:description.trim(), createdAt:new Date().toISOString() });
  localStorage.setItem('luanqunAudioReports', JSON.stringify(reports));
  setStatus(`已記錄「${item.word}」的音檔問題，待重新確認。`);
}

async function regenerateAudio(item) {
  const word = item.word.split(' / ')[0];
  try { await navigator.clipboard?.writeText(word); } catch { /* clipboard permission is optional */ }
  setStatus(`已將「${word}」加入重新生成佇列；目前音檔仍保留，待確認新檔後才會替換。`);
  const reports = JSON.parse(localStorage.getItem('luanqunAudioRegenerationQueue') || '[]');
  reports.push({ word, audio:item.audio, createdAt:new Date().toISOString(), status:'pending' });
  localStorage.setItem('luanqunAudioRegenerationQueue', JSON.stringify(reports));
}

function imageMarkup(item) {
  return `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.meaning)}圖卡" onerror="this.hidden=true; this.nextElementSibling.hidden=false"><span class="image-placeholder" hidden>圖卡即將抵達</span>`;
}

function renderLearn() {
  const selected = unitSchoolSupplies.find((item) => item.id === selectedItemId) || unitSchoolSupplies[0];
  $('#mode-content').innerHTML = `<div class="featured-layout">
    <article class="featured-card"><div class="featured-art">${imageMarkup(selected)}</div><div class="featured-copy"><span class="word-tag">TODAY'S WORD</span><h3>${escapeHtml(selected.word)}</h3><p class="meaning">${escapeHtml(selected.meaning)}</p><button class="button coral featured-audio" type="button">▶ 播放學習音檔</button><div class="audio-tools"><button class="audio-report" type="button">回報音檔錯誤</button><button class="regenerate-audio" type="button">重新生成音檔</button></div><div class="sentence">${selected.sourceSentence ? escapeHtml(selected.sourceSentence).replaceAll('\n','<br>') : '教材目前沒有找到對應例句。'}${selected.sourceTranslation ? `<small>中文：${escapeHtml(selected.sourceTranslation).replaceAll('\n','<br>')}</small>` : ''}</div><small class="source-note">${escapeHtml(selected.sourceNote)}</small></div></article>
    <aside class="thumbnail-rail"><div class="rail-heading"><span>VOCABULARY</span><b>${unitSchoolSupplies.length} WORDS</b></div><div class="thumbnail-list">${unitSchoolSupplies.map((item) => `<button class="thumbnail-card${item.id === selected.id ? ' active' : ''}" type="button" data-item="${escapeHtml(item.id)}" aria-label="選擇${escapeHtml(item.meaning)}圖卡"><span class="thumbnail-art">${imageMarkup(item)}</span></button>`).join('')}</div></aside>
  </div>`;
  $('.featured-audio').addEventListener('click', (event) => playCardAudio(selected, event.currentTarget));
  $('.audio-report').addEventListener('click', () => reportAudioIssue(selected));
  $('.regenerate-audio').addEventListener('click', () => regenerateAudio(selected));
  document.querySelectorAll('.thumbnail-card').forEach((card) => card.addEventListener('click', () => { selectedItemId = card.dataset.item; renderLearn(); }));
}

function renderListenPicture() {
  if (currentQuestion >= 3) { renderListeningComplete(); return; }
  const round = listenQuestions[currentQuestion] || listeningQuestionBank[0];
  const target = unitSchoolSupplies.find((item) => item.id === round.targetId) || unitSchoolSupplies[0];
  const options = [target, ...unitSchoolSupplies.filter((item) => item.id !== target.id).sort(() => Math.random() - .5).slice(0, 2)].sort(() => Math.random() - .5);
  const type = round.type;
  const statementItem = unitSchoolSupplies.find((item) => item.id === (round.statementId || target.id)) || target;
  const audio = statementItem.sentenceAudio || statementItem.audio;
  let questionMarkup = '';
  if (type === 'audio-picture') {
    questionMarkup = `<h3>聽族語句子，選出符合的圖卡。</h3><div class="choice-grid">${options.map((item) => `<button class="picture-choice" type="button" data-answer="${item.id}"><span class="choice-art">${imageMarkup(item)}</span><b>${escapeHtml(item.meaning)}</b></button>`).join('')}</div>`;
  } else if (type === 'audio-word') {
    questionMarkup = `<h3>聽族語詞彙，選出正確的族語文字。</h3><div class="answer-grid">${options.map((item) => `<button class="answer-button" type="button" data-answer="${item.id}">${escapeHtml(item.word)}</button>`).join('')}</div>`;
  } else if (type === 'image-word') {
    questionMarkup = `<h3>看圖選詞，把圖片和族語文字配在一起。</h3><span class="single-choice-art">${imageMarkup(target)}</span><div class="answer-grid">${options.map((item) => `<button class="answer-button" type="button" data-answer="${item.id}">${escapeHtml(item.word)}</button>`).join('')}</div>`;
  } else {
    const isCorrect = statementItem.id === target.id;
    questionMarkup = `<h3>聽句子，判斷它和圖卡是否相符。</h3><span class="single-choice-art">${imageMarkup(target)}</span><p class="sentence quiz-sentence">${escapeHtml(statementItem.sourceSentence || statementItem.word)}</p><div class="answer-grid"><button class="answer-button" type="button" data-answer="${isCorrect ? 'true' : 'false'}">O　符合</button><button class="answer-button" type="button" data-answer="${isCorrect ? 'false' : 'true'}">X　不符合</button></div>`;
  }
  const expected = type === 'true-false' ? String(statementItem.id === target.id) : target.id;
  const label = { 'audio-picture':'聽音選圖', 'audio-word':'聽音選字', 'image-word':'圖文配對', 'true-false':'是非判斷' }[type];
  $('#mode-content').innerHTML = `<div class="challenge-card"><span class="challenge-label">${label} · ${currentQuestion + 1}/3</span>${questionMarkup}<button class="button coral play-target" type="button" data-audio="${escapeHtml(audio || '')}">▶ 播放題目音檔</button><p class="feedback" hidden></p></div>`;
  bindAudioButtons();
  document.querySelectorAll('.picture-choice,.answer-button').forEach((button) => button.addEventListener('click', () => {
    const feedback = $('.feedback');
    if (button.dataset.answer === expected) { awardStar(); currentQuestion += 1; feedback.hidden = false; feedback.textContent = '答對了！你找到正確線索。'; if (currentQuestion >= 3) { awardBadge(); setTimeout(() => renderListeningComplete(), 500); } else setTimeout(() => renderListenPicture(), 500); }
    else { feedback.hidden = false; feedback.textContent = '再聽一次，看看圖卡上的線索。'; }
  }));
}

function renderListeningComplete() {
  $('#mode-content').innerHTML = '<div class="challenge-card"><span class="challenge-label">聽力測驗完成</span><h3>這一輪的三種題型都完成了！</h3><p>你已練習是非判斷、聽音選圖、聽音選字或圖文配對。</p><button class="button coral restart-listening" type="button">再測一次</button></div>';
  $('.restart-listening').addEventListener('click', () => renderMode('listen-picture'));
}

function renderMemoryMatch() {
  const items = unitSchoolSupplies.slice(0, 4);
  const cards = items.flatMap((item) => [`<button class="memory-card" type="button" data-pair="${item.id}" data-kind="word">${escapeHtml(item.word)}</button>`,`<button class="memory-card memory-image-card" type="button" data-pair="${item.id}" data-kind="image"><span class="memory-image">${imageMarkup(item)}</span></button>`]).sort(() => Math.random() - .5);
  $('#mode-content').innerHTML = `<div class="challenge-card"><span class="challenge-label">翻牌配對 · ${matchedCards.size}/4</span><h3>把圖片和族語文字配在一起</h3><div class="memory-grid">${cards.join('')}</div><p class="feedback" hidden></p></div>`;
  let first = null;
  document.querySelectorAll('.memory-card').forEach((card) => card.addEventListener('click', () => {
    if (card.classList.contains('revealed') || card.classList.contains('matched')) return;
    card.classList.add('revealed');
    if (!first) { first = card; return; }
    const feedback = $('.feedback');
    if (first.dataset.pair === card.dataset.pair && first.dataset.kind !== card.dataset.kind) { first.classList.add('matched'); card.classList.add('matched'); matchedCards.add(card.dataset.pair); awardStar(); feedback.hidden = false; feedback.textContent = '圖文配對成功！'; if (matchedCards.size === 4) awardBadge(); }
    else { feedback.hidden = false; feedback.textContent = '這兩張不是同一組，再試一次。'; const previous = first; setTimeout(() => { previous.classList.remove('revealed'); card.classList.remove('revealed'); }, 450); }
    first = null; updateProgress();
  }));
}

function renderBoss() {
  const question = questionBank[questionOrder[currentQuestion] ?? 0];
  const options = question.options.map((text, index) => ({ text, index })).sort(() => Math.random() - 0.5);
  $('#mode-content').innerHTML = `<div class="challenge-card boss-question"><span class="challenge-label">${escapeHtml(question.type)} · ${currentQuestion + 1}/${questionBank.length}</span><h3>${escapeHtml(question.prompt)}</h3>${question.audio ? '<button class="button coral boss-audio" type="button">▶ 播放題目音檔</button>' : ''}<div class="answer-grid">${options.map((option) => `<button class="answer-button" type="button" data-answer="${option.index}">${escapeHtml(option.text)}</button>`).join('')}</div><p class="feedback" hidden></p></div>`;
  $('.boss-audio')?.addEventListener('click', (event) => playAudio(question.audio, event.currentTarget));
  document.querySelectorAll('.answer-button').forEach((button) => button.addEventListener('click', () => {
    const feedback = $('.feedback');
    if (Number(button.dataset.answer) === question.answer) { awardStar(); currentQuestion += 1; feedback.hidden = false; feedback.textContent = '首領挑戰答對！'; if (currentQuestion >= questionBank.length) { awardBadge(); feedback.textContent = '恭喜完成句子首領挑戰！'; } else setTimeout(() => renderBoss(), 550); }
    else { feedback.hidden = false; feedback.textContent = `提示：${question.hint}`; }
  }));
}

function renderSentenceChallenge() { renderBoss(); }
function renderMode(mode) {
  currentMode = mode;
  const info = gameModes.find((item) => item.id === mode) || gameModes[0];
  $('#mode-kicker').textContent = info.kicker;
  $('#mode-title').textContent = info.title;
  $('#mode-description').textContent = info.description;
  document.querySelectorAll('.map-node').forEach((node) => node.classList.toggle('active', node.dataset.mode === mode));
  if (mode === 'learn') renderLearn();
  if (mode === 'listen-picture') { currentQuestion = 0; listenOrder = shuffle(unitSchoolSupplies.map((item) => item.id)); listenQuestionTypes = shuffle(['true-false','audio-picture','audio-word','image-word']); listenQuestions = shuffle(listeningQuestionBank).slice(0, 3); renderListenPicture(); }
  if (mode === 'memory-match') renderMemoryMatch();
  if (mode === 'sentence-challenge') { currentQuestion = 0; questionOrder = shuffle(questionBank.map((_, index) => index)); renderSentenceChallenge(); }
  if (mode === 'boss-challenge') { currentQuestion = 0; questionOrder = shuffle(questionBank.map((_, index) => index)); renderBoss(); }
  updateProgress();
}

function bindAudioButtons() { document.querySelectorAll('.audio-button,.play-target').forEach((button) => button.addEventListener('click', () => playAudio(button.dataset.audio, button))); }
document.querySelectorAll('.map-node').forEach((node) => node.addEventListener('click', () => renderMode(node.dataset.mode)));
$('#start-boss').addEventListener('click', () => renderMode('boss-challenge'));
renderMode('learn');

