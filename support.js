const SUPPORT_KEY = 'emotion-home:support';
let anchorStep = 0;
let supportPeriod = '';
const ANCHOR = '我现在感到害怕，不代表我已经知道未来。今天的问题只处理到今天。';
function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function weekKey(date = new Date()) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  return localDay(monday);
}
function getSupport() {
  const saved = readJSON(SUPPORT_KEY, {});
  return { days: {}, weeks: {}, anchor: {}, ...saved };
}
function saveSupport(data) {
  try { writeJSON(SUPPORT_KEY, data); return true; }
  catch { showToast('暂时无法保存，请先复制重要内容，检查浏览器存储空间。'); return false; }
}
function supportEntries() {
  const data = getSupport();
  const today = data.days[localDay()];
  const week = data.weeks[weekKey()];
  return `<button class="entry-card anchor-entry" data-action="nav" data-view="anchor"><span class="entry-icon">⌁</span><span class="entry-title">先停在今天</span><span class="entry-copy">当“今天很难”滑向“以后都完了”，先把自己接住。</span><span class="entry-action">先缓下来 →</span></button>
  <button class="entry-card self" data-action="nav" data-view="today"><span class="entry-title">今日最小可控计划</span><span class="entry-copy">${today?.task ? esc(today.task) : '只放一件小事，小到今天的你也能开始。'}</span><span class="entry-action">${today?.done ? '今天这一小块，已经完成 ✓' : '今天只做这一件 →'}</span></button>
  <button class="entry-card expression" data-action="nav" data-view="weekly"><span class="entry-title">每周一件新鲜事</span><span class="entry-copy">${week?.task ? esc(week.task) : '给生活留一个小小的新入口，不需要花钱或表现得好。'}</span><span class="entry-action">${week?.done ? '已经尝试过了 ✓' : '看看本周的小尝试 →'}</span></button>`;
}
function supportButton(text, action, extra = '') {
  return `<button type="button" class="chip" data-support="${action}" ${extra}>${text}</button>`;
}
function supportField(label, key, value = '', placeholder = '', multiline = false) {
  const attributes = `data-support-field="${key}" maxlength="500" placeholder="${esc(placeholder)}"`;
  return `<label class="support-field">${label}${multiline ? `<textarea rows="3" ${attributes}>${esc(value)}</textarea>` : `<input type="text" ${attributes} value="${esc(value)}">`}</label>`;
}
function renderSupport() {
  const data = getSupport();
  const isDay = state.view === 'today';
  supportPeriod = isDay ? localDay() : weekKey();
  let body;
  if (state.view === 'anchor') body = renderAnchor(data.anchor);
  else {
    const item = (isDay ? data.days[localDay()] : data.weeks[weekKey()]) || {};
    const choices = isDay ? ['喝一杯水', '走到楼下，待两分钟', '打开简历，只改一句话', '看五分钟旧题', '整理桌面一个角落'] : ['走一条没走过的小路，五分钟就好', '听一首陌生风格的歌', '用家里已有的食材试一种搭配', '画一个没画过的小东西', '看看附近一个没去过的公共空间'];
    body = `<p class="eyebrow">${isDay ? localDay() + ' · 只承接一件事' : weekKey() + ' 起的一周 · 周一换新页'}</p><h1>${isDay ? '今日最小可控计划' : '每周一件新鲜事'}</h1><p class="lead">${isDay ? '不靠确定未来会好，才能行动。先处理今天这一小块。' : '目标是接触一点新体验，不是证明能力。试过就算，随时可以停下。'}</p>
    ${isDay && getChecks().entries.some(entry => entry.day === localDay() && entry.level === 'red') ? '<div class="load-notice">今天不完成也没关系。计划仍由你自己填写，按自己的节奏来。</div>' : ''}
    <div class="support-panel">${item.done ? '<p class="support-success">✓ ' + (isDay ? '这一小块已经完成。今天不必再加码。' : '你给生活打开了一个小入口。喜欢或不喜欢都可以。') + '</p>' : ''}
    ${supportField(isDay ? '今天唯一的一件事' : '这周只尝试这一件', 'task', item.task, isDay ? '例如：打开窗户，站一分钟' : '例如：听一首陌生风格的歌')}
    ${supportField('最小做到什么，就算完成？', 'minimum', item.minimum, '例如：只做两分钟，也可以结束')}
    <details><summary>暂时想不到？从这里选一个</summary><div class="chip-group">${choices.map(x => supportButton(esc(x), 'suggest', `data-value="${esc(x)}"`)).join('')}</div></details>
    <div class="chip-group">${supportButton('保存这一件', 'save')}${item.task ? supportButton(item.done ? '还没完成，撤销标记' : (isDay ? '这一小步做到了' : '我试过了'), 'done') : ''}</div>
    <p class="question-help">可以缩小、改选或休息。没有连续打卡，也不会把上次没完成的事堆到今天。</p>
    ${isDay ? reminderGuide(item) : supportField('试过后的感受（可选）', 'reflection', item.reflection, '有点新鲜 / 不太喜欢 / 下次愿意再试……', true)}
    </div>${supportHistory(data, isDay)}`;
  }
  app.innerHTML = `<main class="page support-page">${brandTopline()}<button class="chip" data-action="nav" data-view="home">← 回到练习</button>${body}<details class="support-help"><summary>我需要有人陪我，或更多支持</summary><p>如果绝望感持续加重，或失眠、哭泣、焦虑已经影响生活，可以联系心理／精神科或其他专业人员。你不必独自把一切想通。</p><p>如果此刻担心自己会伤害自己，请先远离可能伤害自己的物品或地点，去有人在的安全地方，联系可信任的人陪着你，并联系当地急救或前往急诊。</p><p>可以直接说：“我现在状态很不好，需要你陪着我，帮我一起找支持。”</p>${supportButton('复制这句求助的话', 'help-copy')}</details></main>${navBar('home')}`;
}
function reminderGuide(item) {
  return `<details class="reminder-guide"><summary>加入 iPhone 提醒事项</summary><p>首次需要设置一个快捷指令。这里只传递任务文字；提醒日期和时间在 iPhone 上选择。</p><ol><li>打开 iPhone「快捷指令」，新建指令，命名为「情绪归处提醒」。</li><li>添加「添加新提醒事项」操作，将标题设为变量「快捷指令输入」，选择提醒事项列表。</li><li>展开该操作的选项，开启提醒，并将日期／时间设为「每次询问」（具体名称可能因系统版本不同）。</li><li>保存后回到这里，先保存任务，再点击下面的按钮，按系统提示完成。</li></ol><div class="chip-group">${item.task ? `<a class="chip" href="${reminderURL(item)}">运行快捷指令</a>${supportButton('复制任务文字', 'task-copy')}` : '<p>保存今天的一件事后，这里会出现添加入口。</p>'}</div><p class="question-help">无法打开时，可复制文字到提醒事项并手动设置时间。请在提醒事项中核对是否添加成功；重复运行可能产生重复提醒。本页修改、完成任务不会同步修改系统提醒。</p><a href="https://support.apple.com/zh-cn/guide/shortcuts/apd624386f42/ios" target="_blank" rel="noopener noreferrer">苹果官方：通过链接运行快捷指令</a></details>`;
}
function taskText(item) { return `今日一件事：${item.task}${item.minimum ? '；做到这些就够了：' + item.minimum : ''}`; }
function reminderURL(item) { return 'shortcuts://run-shortcut?name=' + encodeURIComponent('情绪归处提醒') + '&input=text&text=' + encodeURIComponent(taskText(item)); }
function supportHistory(data, isDay) {
  const entries = Object.entries(isDay ? data.days : data.weeks).filter(([key, value]) => key !== (isDay ? localDay() : weekKey()) && value.task).sort(([a], [b]) => b.localeCompare(a)).slice(0, 8);
  return entries.length ? `<details class="support-help"><summary>看看之前留下的小脚印</summary>${entries.map(([key, x]) => `<p><small>${esc(key)} · ${x.done ? '尝试过 / 完成' : '当时留下的计划'}</small><br>${esc(x.task)}${x.reflection ? '<br>' + esc(x.reflection) : ''}</p>`).join('')}</details>` : '';
}
function renderAnchor(d) {
  const stages = ['先安顿身体', '给念头命名', '事实与预测分开', '缩小到今天', '用行动结束'];
  const contents = [
    `<h1>先不用回答人生的问题</h1><p class="lead">如果胸口紧、燥热、想哭，或者脑子转得很快，先给身体一点空间。</p><div class="support-panel"><p>双脚落地，看看周围，找到三个看得见的东西。</p><p>放下手机也可以。喝一点水，走几步，或看看窗外。自然呼吸，如果舒服，可以把呼气放慢一点，不必憋气。</p><p>不用等到完全平静，也不必强迫自己继续。</p></div>`,
    `<h1>这是一个念头，不是判决</h1>${supportField('脑中正在出现什么预测？（可以留空）', 'prediction', d.prediction, '例如：我以后会越来越差', true)}<div class="prompt-box">试着说：“我注意到，我现在出现了${d.prediction ? '「' + esc(d.prediction) + '」' : '一个关于未来的'}这个预测。”</div><p>“如果一直这样怎么办？”“是不是落后太多？”出现时，不需要马上给出答案。</p>`,
    `<h1>今天发生了什么？</h1><p class="question-help">例如：“今天投递没有收到回复”是可观察的事实；“以后永远没人要我”是预测。不要在这里审判自己的价值。</p>${supportField('摄像机能记录下来的事实（可留空）', 'fact', d.fact, '今天发生的具体事情，不加“永远”“一定”', true)}<div class="support-panel"><p>我脑中的预测：${esc(d.prediction || '未来可能会变得很糟')}</p><p>我还没有足够信息知道长期未来。难受是真实的，预测还没有成为事实。</p></div>`,
    `<h1>今天只处理今天</h1><p class="lead">今天剩下的时间，最小能改善的一件事是什么？休息和照顾身体也算。</p>${supportField('接下来一个可完成的小动作', 'action', d.action, '例如：离开电脑，喝一杯水')}<div class="chip-group">${['喝一杯水', '走到窗边站一分钟', '洗个澡', '联系一个可信任的人'].map(x => supportButton(x, 'anchor-pick', `data-value="${x}"`)).join('')}</div>`,
    `<h1>现在可以结束分析了</h1><div class="support-panel"><p class="eyebrow">我的下一步</p><h2>${esc(d.action || '喝一杯水')}</h2><p>即使不知道未来，我仍然可以处理今天这一小块。</p></div><div class="chip-group">${supportButton('我现在去做', 'anchor-leave')}${supportButton('设为今天唯一计划', 'anchor-plan')}</div><p class="question-help">不需要再证明自己想通了。如果还很难受，可以回到身体安顿，或请一个人陪着你。</p>`
  ];
  return `<p class="eyebrow">先停在今天 · ${anchorStep + 1} / 5 · ${stages[anchorStep]}</p><blockquote class="anchor-quote">${ANCHOR}</blockquote>${contents[anchorStep]}<div class="chip-group">${anchorStep > 0 ? supportButton('上一步', 'anchor-back') : ''}${anchorStep < 4 ? supportButton(anchorStep === 0 ? '我愿意继续 / 直接看看' : '继续', 'anchor-next') : supportButton('回到身体，缓一缓', 'anchor-reset')}</div><p class="question-help">写不出来也可以跳过。内容仅保存在本机。</p>`;
}
function collectSupportFields() {
  return Object.fromEntries([...app.querySelectorAll('[data-support-field]')].map(el => [el.dataset.supportField, el.value.trim()]));
}
async function supportCopy(text) {
  try { await navigator.clipboard.writeText(text); showToast('已复制'); }
  catch { window.prompt('长按选择并复制以下文字：', text); }
}
document.addEventListener('click', event => {
  const target = event.target.closest('[data-support]');
  if (!target) return;
  const action = target.dataset.support;
  const data = getSupport();
  if (action === 'help-copy') return supportCopy('我现在状态很不好，需要你陪着我，帮我一起找支持。');
  if (state.view === 'anchor') {
    data.anchor = { ...data.anchor, ...collectSupportFields() };
    if (action === 'anchor-pick') data.anchor.action = target.dataset.value;
    if (action === 'anchor-next' && anchorStep === 3 && !data.anchor.action) { showToast('选一个小动作就好，喝一杯水也可以。'); return; }
    if (action === 'anchor-plan') {
      const old = data.days[localDay()];
      if (old?.task && !window.confirm('今天已经有一件事。要用这个更小的动作替换它吗？')) return;
      data.days[localDay()] = { task: data.anchor.action || '喝一杯水', minimum: '', done: false };
    }
    if (!saveSupport(data)) return;
    if (action === 'anchor-next') anchorStep = Math.min(4, anchorStep + 1);
    if (action === 'anchor-back') anchorStep = Math.max(0, anchorStep - 1);
    if (action === 'anchor-reset') anchorStep = 0;
    if (action === 'anchor-plan') state.view = 'today';
    if (action === 'anchor-leave') { state.view = 'home'; anchorStep = 0; }
    render();
    return;
  }
  const isDay = state.view === 'today';
  if (!isDay && state.view !== 'weekly') return;
  const group = isDay ? data.days : data.weeks;
  const key = isDay ? localDay() : weekKey();
  if (key !== supportPeriod) {
    render();
    return showToast('已进入新的一天或一周，请重新选择这一件事。');
  }
  const old = group[key] || {};
  if (action === 'task-copy') return supportCopy(taskText(old));
  if (action === 'suggest') {
    const field = app.querySelector('[data-support-field="task"]');
    field.value = target.dataset.value;
    field.focus();
    return;
  }
  const fields = collectSupportFields();
  if (!fields.task) return showToast('先写下一件足够小的事。');
  const changed = fields.task !== old.task || fields.minimum !== old.minimum;
  group[key] = { ...old, ...fields, done: changed ? false : !!old.done };
  if (action === 'done') group[key].done = changed ? true : !old.done;
  if (!saveSupport(data)) return;
  render();
  showToast(action === 'save' ? '已保存，只留这一件。' : group[key].done ? '这一小步已经算数。' : '已撤销完成标记。');
});
document.addEventListener('input', event => {
  if (state.view !== 'anchor' || !event.target.dataset.supportField) return;
  const data = getSupport();
  data.anchor[event.target.dataset.supportField] = event.target.value;
  saveSupport(data);
});

