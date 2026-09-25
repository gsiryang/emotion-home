const LAUNCHER_KEY = 'emotion-home:launcher';
const MICRO_TASKS = {
  job: [
    [['看一眼招聘软件的图标。', '不用打开，看见它就够了。', 0], ['打开招聘软件。', '不用找岗位，打开后就可以关掉。', 0], ['找到一个可能感兴趣的岗位，只收藏。', '最多两分钟，不投递；没找到也可以停。', 2], ['看一个收藏岗位的要求。', '只看两分钟，判断“考虑 / 暂不考虑”，不用投递。', 2]],
    [['看一眼简历文件的名字。', '不用打开它。', 0], ['打开已有简历。', '不修改，打开就算完成。', 0], ['读简历里的一句话。', '最多两分钟，不用修改。', 2], ['把简历里的一句话改得更清楚。', '最多五分钟，改不完也停在这里。', 5]]
  ],
  algorithm: [
    [['看一眼浏览器图标。', '不用打开，也不用找题。', 0], ['打开 LeetCode。', '不需要找题，打开就算完成。', 0], ['打开一道以前做过的题，只读题目。', '三分钟，不写代码。没有旧题时，看一道熟悉题型的题面就好。', 3], ['写一道旧题的第一步思路。', '五分钟，只写一句或一小段，不要求做完。', 5]],
    [['把手放到鼠标或手机旁。', '碰到就够了。', 0], ['打开以前的算法笔记。', '找不到时，只打开笔记应用就够了。', 0], ['看一段以前写过的题解。', '两分钟，不要求理解全部。', 2], ['给旧题解的一行写一句注释。', '最多五分钟，不要求运行代码。', 5]]
  ],
  c: [
    [['看一眼放 C 笔记的位置。', '不需要打开。', 0], ['打开 C 笔记。', '没有笔记时，打开一个空白文档就够了。', 0], ['看 C 笔记里 volatile 的解释。', '只看两分钟；没有这一页，就看一个熟悉的关键词。', 2], ['写下 volatile 的一个疑问。', '最多五分钟，只写问题，不必解答。', 5]],
    [['把手放到键盘旁。', '不用敲代码。', 0], ['打开一个以前的 C 文件。', '没有文件时，打开编辑器就算完成。', 0], ['读旧 C 代码里的一个函数。', '两分钟，不修改代码。', 2], ['给一行 C 代码加一句解释。', '最多五分钟，不需要编译。', 5]]
  ],
  english: [
    [['在心里念一个 hello。', '不用出声。', 0], ['轻声说一次 hello。', '不方便出声时，在心里说也算。', 0], ['说两遍 Tell me about yourself。', '最多两分钟，不检查发音。', 2], ['用英语说一句自我介绍。', '最多三分钟，不录音、不评分。', 3]],
    [['看一眼这个词：today。', '看见就算。', 0], ['读一次 today。', '在心里读也可以。', 0], ['读一句你熟悉的英语。', '最多两分钟，一句就停。', 2], ['用 today 写一句英语。', '最多三分钟，不查语法。', 3]]
  ],
  body: [
    [['轻轻动一下手指。', '在现在的位置就可以。', 0], ['把鞋放到脚边。', '不用穿，更不用出门。', 0], ['穿上鞋。', '最多两分钟，不要求运动，穿上就算完成。', 2], ['在安全、舒服的地方慢慢走一会儿。', '五分钟就停；不方便走动时，坐着轻轻活动手指也可以。', 5]],
    [['看向离你最近的水杯。', '不用拿起来。', 0], ['把水杯挪近一点。', '伸手不方便，就看一眼杯子也可以。', 0], ['给自己倒一点水，喝一口。', '最多两分钟，喝一口就够了。', 2], ['坐在舒服的位置，喝一点水。', '留两分钟给自己，不需要同时做别的事。', 2]]
  ],
  life: [
    [['看一眼桌上的一个物品。', '不用收拾。', 0], ['碰一下准备收好的物品。', '不用移动。', 0], ['把桌上一个物品放回去。', '最多两分钟，只收这一个。', 2], ['整理桌面一个手掌大的角落。', '最多三分钟，到时间就停。', 3]],
    [['看向窗户的方向。', '不用起身。', 0], ['把目光移到一个看得见的东西上。', '只看一眼，不用分析。', 0], ['看看窗外或身边的一个物品。', '两分钟，留意一个颜色就够了。', 2], ['给一个小空间留一点空位。', '最多三分钟，只挪开一个物品即可。', 3]]
  ]
};
const LAUNCH_DOMAINS = { job: '求职', algorithm: '算法', c: 'C 语言', english: '英语', body: '身体', life: '生活' };
let launcherTimer = null;
function getLauncher() {
  const data = readJSON(LAUNCHER_KEY, {});
  return { events: [], session: null, ...data };
}
function saveLauncher(data) {
  try { writeJSON(LAUNCHER_KEY, data); return true; }
  catch { showToast('暂时无法保存，请检查浏览器存储空间。'); return false; }
}
function launchButton(text, action, extra = '', primary = false) {
  return `<button type="button" class="${primary ? 'button primary wide' : 'launcher-link'}" data-launch="${action}" ${extra}>${text}</button>`;
}
function launchTask(session) {
  if (session.grounding) return [
    ['把目光停在一个身边的物品上。', '不用站起来，看见它就够了。', 0],
    ['放下手机，看看窗外。', '不方便移动时，坐着看一眼周围也可以。', 0],
    ['放下手机，在安全的地方慢慢走两分钟。', '可以走到窗边；不方便走动时，坐着看看周围也可以。', 2]
  ][Math.min(session.level, 2)];
  return MICRO_TASKS[session.domain][session.variant][session.level];
}
function newLaunchSession(mood = '', domain = '') {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, phase: 'choose', mood, domain, variant: 0, level: 0 };
}
function renderLauncher() {
  clearInterval(launcherTimer);
  launcherTimer = null;
  const data = getLauncher();
  const s = data.session || newLaunchSession();
  let content;
  if (s.phase === 'choose') {
    content = `<p class="eyebrow">启动器</p><h1>现在先做一件<br>很小的事。</h1><p class="lead">不用先有动力。只找一个能开始的动作。</p><fieldset><legend>你现在是什么状态？</legend><div class="launcher-moods">${[['low', '完全不想动'], ['anxious', '有点焦虑'], ['okay', '还可以']].map(([id, label]) => `<button class="chip ${s.mood === id ? 'selected' : ''}" aria-pressed="${s.mood === id}" data-launch="mood" data-value="${id}">${label}</button>`).join('')}</div></fieldset><fieldset><legend>你想往哪边挪一点？</legend><div class="launcher-domains">${Object.entries(LAUNCH_DOMAINS).map(([id, label]) => `<button class="chip ${s.domain === id ? 'selected' : ''}" aria-pressed="${s.domain === id}" data-launch="domain" data-value="${id}">${label}</button>`).join('')}</div></fieldset>${checkLoadCap() < 3 ? `<fieldset><legend>今天保留两种启动大小</legend><div class="launcher-sizes">${[[1,'轻一点 · 打开就算'],[2,'小一步 · 2–3 分钟']].map(([level,label]) => `<button class="chip ${(s.loadLevel || 2) === level ? 'selected' : ''}" aria-pressed="${(s.loadLevel || 2) === level}" data-launch="load-level" data-value="${level}">${label}</button>`).join('')}</div></fieldset>` : ''}${launchButton('给我一个动作', 'generate', s.mood && s.domain ? '' : 'disabled', true)}`;
  } else if (s.phase === 'ground') {
    content = `<p class="eyebrow">先回到当下</p><h1>先区分事实和预测。</h1><p class="lead">写一句就好，也可以留空直接做一个身体动作。</p>${supportField('当前事实', 'fact', s.fact, '例如：今天没有收到回复', true)}${supportField('我脑子正在预测', 'prediction', s.prediction, '例如：以后永远找不到工作', true)}${supportField('今天我能控制的一件事', 'control', s.control, '例如：离开电脑两分钟', true)}${launchButton('先做一个身体动作', 'ground-task', '', true)}`;
  } else if (s.phase === 'done') {
    content = `<p class="eyebrow">这一次，已经算数</p><div class="launcher-finish" aria-hidden="true">✓</div><h1>今天你完成了一次启动。<br>可以停了。</h1><p class="lead">不必接着证明什么。现在关掉页面也可以。</p>${launchButton('到这里就好', 'rest', '', true)}${launchButton('我还有一点力气，再来一个', 'again')}<details class="launcher-count"><summary>看看本周的小脚印</summary><p>本周成功启动：${data.events.filter(x => weekKey(new Date(x.at)) === weekKey()).length} 次</p></details>`;
  } else if (s.phase === 'rest') {
    content = `<p class="eyebrow">停在这里也可以</p><h1>现在不用再做什么。</h1><p class="lead">你可以关掉页面，给自己一点空间。</p>${launchButton('需要时，再选一个小动作', 'again')}`;
  } else {
    const [task, end, minutes] = launchTask(s);
    const running = s.phase === 'running';
    content = `<p class="eyebrow">现在只做这一件事</p><h1>${esc(task)}</h1><p class="lead">${esc(end)}</p>${running && minutes ? '<p class="launcher-clock" aria-label="剩余时间"></p>' : ''}${launchButton(running ? '我已经启动了，到这里就好' : minutes ? `开始 ${minutes} 分钟` : '我开始了', running ? 'complete' : 'start', '', true)}${launchButton(s.level ? '太难了，再小一点' : '还是做不到，先停在这里', s.level ? 'smaller' : 'rest')}<p class="launcher-note">${running ? '时间只是上限。已经开始，就可以提前结束。' : '做到这一步就够了，不追加任务。'}</p>`;
  }
  app.innerHTML = `<main class="page launcher-page">${brandTopline()}<section class="launcher-content">${lowLoadNotice()}${content}</section><footer class="launcher-footer">${launchButton('情绪练习与今日计划 →', 'tools')}</footer></main>`;
  if (s.phase === 'running' && launchTask(s)[2]) {
    const tick = () => {
      if (state.view !== 'launcher') { clearInterval(launcherTimer); return; }
      const clock = app.querySelector('.launcher-clock');
      if (!clock) return;
      const seconds = Math.max(0, Math.ceil((s.until - Date.now()) / 1000));
      clock.textContent = seconds ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : '到时间了。可以停了，不需要补做。';
      if (!seconds) clearInterval(launcherTimer);
    };
    launcherTimer = setInterval(tick, 1000);
    tick();
  }
}
function handleLauncher(action, value) {
  const data = getLauncher();
  const s = data.session || newLaunchSession();
  if (action === 'tools') { state.view = 'home'; return render(); }
  if (action === 'mood' && ['low', 'anxious', 'okay'].includes(value) && s.phase === 'choose') s.mood = value;
  if (action === 'domain' && MICRO_TASKS[value] && s.phase === 'choose') s.domain = value;
  if (action === 'load-level' && s.phase === 'choose' && [1,2].includes(Number(value))) s.loadLevel = Number(value);
  if (action === 'generate') {
    if (s.phase !== 'choose' || !s.mood || !MICRO_TASKS[s.domain]) return;
    s.variant = Math.floor(Math.random() * MICRO_TASKS[s.domain].length);
    s.level = checkLoadCap() < 3 ? (s.loadLevel || 2) : s.mood === 'anxious' ? 1 : s.mood === 'low' ? 2 : 3;
    s.phase = 'task';
  }
  if (action === 'ground') {
    if (['done', 'rest'].includes(s.phase)) Object.assign(s, newLaunchSession());
    s.phase = 'ground'; delete s.until;
  }
  if (action === 'ground-task' && s.phase === 'ground') { Object.assign(s, collectSupportFields(), { phase: 'task', grounding: true, level: 2 }); }
  if (action === 'smaller' && ['task', 'running'].includes(s.phase)) { s.level = Math.max(0, s.level - 1); s.phase = 'task'; delete s.until; }
  if (action === 'start' && s.phase === 'task') {
    const minutes = launchTask(s)[2];
    if (minutes) { s.phase = 'running'; s.until = Date.now() + minutes * 60000; }
    else action = 'complete';
  }
  if (action === 'complete' && ['task', 'running'].includes(s.phase)) {
    if (!data.events.some(x => x.id === s.id)) data.events.push({ id: s.id, at: new Date().toISOString(), domain: s.grounding ? 'body' : s.domain, mood: s.mood, level: s.level });
    s.phase = 'done';
    delete s.until;
  }
  if (action === 'rest') { s.phase = 'rest'; delete s.until; }
  data.session = action === 'again' ? newLaunchSession() : s;
  if (saveLauncher(data)) render();
}
document.addEventListener('click', event => {
  const target = event.target.closest('[data-launch]');
  if (target) handleLauncher(target.dataset.launch, target.dataset.value);
});
document.addEventListener('input', event => {
  if (state.view !== 'launcher' || !event.target.dataset.supportField) return;
  const data = getLauncher();
  if (data.session?.phase !== 'ground') return;
  data.session[event.target.dataset.supportField] = event.target.value;
  saveLauncher(data);
});

