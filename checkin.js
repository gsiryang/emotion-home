const CHECK_KEY = 'emotion-home:checkins';
const CHECK_QUESTIONS = [
  ['sleep', '最近一次睡眠', ['和平常差不多', '睡得很晚', '几乎没睡']],
  ['mood', '过去几小时的情绪', ['比较平稳', '明显低落或烦躁', '哭过 / 很想哭']],
  ['body', '身体感觉', ['没有明显不适', '紧绷或燥热', '呼吸或胸口明显不适']],
  ['action', '开始一件事情', ['能够开始', '拖了很久', '几乎什么都启动不了']],
  ['attention', '刷手机或购物比价', ['和平常差不多', '一直想刷', '几个小时停不下来']],
  ['future', '现在是否觉得一件事会决定整个未来？', ['暂时没有', '有一点，问题缠在一起', '很强烈，感觉一切都要完了']]
];
let checkDraft = {};
let checkResult = null;
let dumpResult = null;
function getChecks() { return { entries: [], lowDay: '', reminders: true, times: ['12:00', '18:00', '22:00'], seen: {}, dump: {}, ...readJSON(CHECK_KEY, {}) }; }
function saveChecks(data) {
  try { writeJSON(CHECK_KEY, data); return true; }
  catch { showToast('无法保存，请检查浏览器存储空间。'); return false; }
}
function checkLevel(score) { return score >= 8 ? 'red' : score >= 4 ? 'yellow' : 'green'; }
function isLowLoad() { return getChecks().lowDay === localDay(); }
function currentCheckpoint(date = new Date(), times = getChecks().times) {
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const due = times.filter(x => x <= time).sort().pop();
  return due ? `${localDay(date)}@${due}` : '';
}
function dueCheckpoint() {
  const data = getChecks(), key = currentCheckpoint();
  return data.reminders && key && !data.seen[key] ? key : '';
}
function checkButton(text, action, extra = '', primary = false) { return `<button class="${primary ? 'button primary wide' : 'chip'}" type="button" data-check="${action}" ${extra}>${text}</button>`; }
function lowLoadNotice() { return ''; }
function dashboardCard(title, copy, view, icon, featured = false) {
  return `<button class="dash-card ${featured ? 'featured' : ''}" data-action="nav" data-view="${view}"><span class="dash-icon" aria-hidden="true">${icon}</span><span><strong>${title}</strong><small>${copy}</small></span><span aria-hidden="true">↗</span></button>`;
}
function renderDashboard() {
  const latest = getChecks().entries.slice(-1)[0];
  app.innerHTML = `<main class="page dashboard">${brandTopline('<span class="edition">日常陪伴 · 11</span>')}<header class="dashboard-intro"><p class="eyebrow">先看见自己，再向前一点</p><h1>今天，从这里开始。</h1></header>${lowLoadNotice()}<section class="dashboard-section check-entry-column"><div class="section-heading"><h2>先看看现在</h2><span>不必先知道怎么了</span></div>${false ? '<div class="check-due">到一个检查点了：花 30 秒看看现在。错过也不需要补做。</div>' : ''}${dashboardCard('30 秒状态检查', latest ? '上次：' + {green:'绿色 · 可以慢慢来',yellow:'黄色 · 先减轻负担',red:'红色 · 先照顾自己'}[latest.level] + ' · ' + new Date(latest.at).toLocaleString('zh-CN', {month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '睡眠、身体、行动……从具体信号开始', 'scan', '◌', true)}${dashboardCard('我不知道为什么难受', '写三句话，让纠缠在一起的担心显出来', 'dump', '≈')}</section><section class="dashboard-section"><div class="section-heading"><h2>只挪动一点</h2><span>小到可以开始</span></div><div class="dashboard-grid">${dashboardCard('启动器', '只给一个动作，太难就再小一点', 'launcher', '▷')}${dashboardCard('今日最小计划', '今天只留一件可控的事', 'today', '○')}${dashboardCard('每周新鲜事', '尝试一次，喜欢与否都可以', 'weekly', '✧')}${dashboardCard('检查提醒', '上午、下午、晚上，各选一个表情', 'check-settings', '◷')}</div></section><section class="dashboard-section"><div class="section-heading"><h2>其他情绪工具</h2><span>按需要打开</span></div><div class="compact-tools">${[['self','身体与情绪','从身体感受开始'],['ownership','分清情绪归属','不用替别人承担全部'],['expression','练习表达','一句话也可以']].map(([flow,title,copy]) => `<button class="dash-card" data-action="start-flow" data-flow="${flow}"><span><strong>${title}</strong><small>${copy}</small></span><span>→</span></button>`).join('')}<button class="dash-card" data-action="open-review"><span><strong>回顾今天</strong><small>看见自己，不做评分</small></span><span>→</span></button></div></section><p class="privacy-note">记录只保存在这台设备 · 不需要账号</p></main>${navBar('home')}`;
}
function renderCheckPage() {
  let body;
  if (state.view === 'check-settings') body = renderMoodSettings();
  else if (state.view === 'dump') body = renderDump();
  else if (checkResult) body = renderCheckResult(checkResult);
  else body = `<p class="eyebrow">30 秒状态检查</p><h1>这几个小时，过得怎么样？</h1><p class="lead">不用判断自己是不是“想太多”。选最接近的情况。</p><div class="scan-questions">${CHECK_QUESTIONS.map(([key,title,options]) => `<fieldset><legend>${title}</legend><div class="scan-options">${options.map((label,i) => `<button class="chip ${checkDraft[key] === i ? 'selected' : ''}" aria-pressed="${checkDraft[key] === i}" data-check="answer" data-key="${key}" data-value="${i}">${label}</button>`).join('')}</div></fieldset>`).join('')}</div>${checkButton('看看我现在需要什么', 'submit', CHECK_QUESTIONS.every(([key]) => Number.isInteger(checkDraft[key])) ? '' : 'disabled', true)}<p class="question-help">颜色是个人负荷提示，不是诊断或安全评估；绿色也不代表必须努力或没有风险。</p>`;
  app.innerHTML = `<main class="page check-page">${brandTopline()}<button class="back-link" data-action="nav" data-view="home">← 所有工具</button>${body}</main>${navBar('home')}`;
}
function renderCheckResult(result) {
  const labels = {green:'绿色 · 暂时比较平稳',yellow:'黄色 · 先减轻负担',red:'红色 · 先照顾自己'};
  const bodyAlert = result.answers.body === 2;
  return `<p class="eyebrow">这次检查的反馈</p><div class="status-card ${result.level}"><span class="status-label">${labels[result.level]}</span><h1>${result.level === 'red' ? '现在先暂停重大判断。' : result.level === 'yellow' ? '现在不需要解决未来。' : '可以慢一点，不必加码。'}</h1><p>${result.level === 'green' ? '这次选择的信号较少。如果依然难受，仍然可以休息或寻求支持。' : '你选中的信号提示，最近的负担可能偏高。先照顾当下，不急着给人生下结论。'}</p></div>${bodyAlert ? '<div class="medical-note"><strong>先照顾身体，不把它直接当作焦虑。</strong><p>呼吸或胸口明显不适时先停止活动。如果症状突然、严重、持续，或伴随胸痛、昏厥等，请立即联系当地急救；其他持续或反复不适也需要医疗评估。</p></div>' : ''}${result.level === 'red' ? '<div class="support-panel"><h2>今天先放下这些</h2><p>先不判断自己的价值，不比较同龄人，不连续投递，不买非必要物品，也不规划未来几年。不是永久放弃，只是暂缓。</p></div>' : ''}${lowLoadNotice()}<div class="support-panel"><p class="eyebrow">现在只做</p><h2>${bodyAlert ? '停下任务，坐到安全、舒服的位置。' : result.level === 'red' ? '离开屏幕，喝一点水。' : '离开屏幕，在舒服的地方慢慢活动两分钟。'}</h2><p>${bodyAlert ? '优先按上面的身体提示寻求帮助，不安排走动任务。' : '不方便活动时，坐着看看周围也可以。太难就缩小，不需要硬撑。'}</p>${bodyAlert ? checkButton('复制求助的话', 'help') : checkButton('带我开始这个小动作', 'body', '', true)}${result.level === 'red' ? '<p>之后联系一个可信任的人，请对方陪你一会儿。</p>' + checkButton('复制一句求助的话', 'help') : ''}</div><details><summary>为什么出现这个提示？</summary><p>六项各计 0–2 分，总分 ${result.score}。0–3 绿色、4–7 黄色、8–12 红色。这是你设定的个人提醒规则，未经临床验证，不能判断病情或排除危险。</p><p>本次较明显的信号：${CHECK_QUESTIONS.filter(([key]) => result.answers[key] > 0).map(([key,title,options]) => esc(title + '：' + options[result.answers[key]])).join('；') || '本次未选中明显信号'}。</p><p>任一次红色，或当天不同检查时段、间隔至少 30 分钟的连续两次黄色，会开启当天低负荷。新动作保留两级可选。重复检查不会继续降低动作，也不会修改已经开始的任务。</p></details><div class="result-next">${checkButton('启动一个小动作', 'launch', '', true)}${checkButton('看看发生了什么', 'dump')}</div>${checkButton('重新做一次检查', 'new')}<p class="question-help">如果担心自己会伤害自己，请去有人陪伴的安全地方，立即联系可信任的人和当地紧急支持。</p>`;
}
function analyzeDump(fields) {
  const text = [fields.event, fields.worry, fields.solve].filter(Boolean).join(' ');
  const terms = ['完了','以后','越来越','永远','再也','必须','不能失败','来不及','没人要','没有价值'];
  return terms.filter(term => text.includes(term));
}
function renderDump() {
  const d = getChecks().dump;
  if (dumpResult) return `<p class="eyebrow">把缠在一起的东西分开</p><h1>${dumpResult.matches.length >= 2 ? '这里可能有一些关于未来的推测。' : '难受已经被写下来了。'}</h1><div class="reflection-grid"><article><small>你描述的事情 · 还可以核实</small><p>${esc(d.event || '没有填写，也可以。')}</p></article><article><small>你正在担心的结果</small><p>${esc(d.worry || '还没有写出具体担心。')}</p></article><article><small>你现在想解决的事</small><p>${esc(d.solve || '暂时不知道也可以。')}</p></article></div><p>${dumpResult.matches.length >= 2 ? '这些表达可能把眼前一件事和长期未来连在一起：' + dumpResult.matches.map(esc).join('、') + '。先不要急着做长期判断。' : '没有命中多个词，不代表你没有难受。我们也不需要靠一个标签决定你是否值得休息。'}</p><p class="question-help">这里只按词语做本地提示，不能理解全部语境，也可能误判。第一句话是你的描述，不会被自动认定为事实。</p>${checkButton('启动一个小动作', 'launch', '', true)}${checkButton('回去修改', 'edit-dump')}`;
  return `<p class="eyebrow">我不知道为什么难受</p><h1>把脑子倒出来。</h1><p class="lead">不用先识别问题。三句话，写到哪里都可以。</p>${supportField('刚刚发生了什么？','event', d.event, '写一个具体片段',true)}${supportField('我脑子现在最担心什么？','worry',d.worry,'想到什么就写什么',true)}${supportField('我现在最想解决什么？','solve',d.solve,'不必一次想清楚',true)}${checkButton('帮我看看这三句话', 'reflect', '', true)}${checkButton('写不出来，直接检查状态', 'new')}`;
}
function renderCheckSettings() {
  const d = getChecks();
  return `<p class="eyebrow">不用靠自己一直记得</p><h1>给一天三个停顿。</h1><p class="lead">默认中午、傍晚、睡前。提醒是邀请，错过不补做。</p><div class="support-panel">${['中午','傍晚','睡前'].map((label,i) => `<label class="support-field">${label}<input type="time" data-check-time="${i}" value="${d.times[i]}"></label>`).join('')}${checkButton('保存提醒时间','save-times','',true)}${checkButton(d.reminders ? '暂停页面提醒' : '开启页面提醒','toggle-reminders')}<p>页面打开且可见时，会在这些时刻出现提示；重新打开时只提醒最近一个检查点。</p></div><div class="support-panel"><h2>关闭页面后也能提醒</h2><p>下载日历提醒文件，导入系统日历后，检查三个每天重复的事件及通知权限。它们是日历提醒，不会写入 iOS 提醒事项。</p>${checkButton('下载每日三个日历提醒','calendar')}<p class="question-help">网页关闭后无法自行定时弹出。日历通知由系统控制，请在设备上核对时间和提醒设置。若更习惯提醒事项，可手动新建三个“30 秒状态检查”，按上述时间设为每天重复。修改本页时间不会修改已导入的日历，重新导入前请删除旧事件以免重复。</p></div>`;
}
function buildCheckCalendar(times, now = new Date()) {
  const date = localDay(now).replaceAll('-', '');
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Emotion Home//Daily Check//ZH','CALSCALE:GREGORIAN'];
  times.forEach((time,i) => lines.push('BEGIN:VEVENT',`UID:emotion-check-${i}@emotion-home.local`,`DTSTAMP:${now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART:${date}T${time.replace(':','')}00`,'DURATION:PT5M','RRULE:FREQ=DAILY','SUMMARY:30秒状态检查','DESCRIPTION:打开情绪归处，看看睡眠、身体和行动。错过不补做。','BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:30秒状态检查','END:VALARM','END:VEVENT'));
  lines.push('END:VCALENDAR'); return lines.join('\r\n') + '\r\n';
}
function submitCheck() {
  if (!CHECK_QUESTIONS.every(([key]) => [0,1,2].includes(checkDraft[key]))) return;
  const d = getChecks(), now = new Date();
  const score = Object.values(checkDraft).reduce((a,b) => a+b,0);
  const entry = { at: now.toISOString(), day: localDay(now), checkpoint: currentCheckpoint(now) || localDay(now) + '@early', answers: {...checkDraft}, score, level: checkLevel(score) };
  const previous = d.entries.filter(x => x.checkpoint !== entry.checkpoint).slice(-1)[0];
  if (entry.level === 'red' || (entry.level === 'yellow' && previous?.level === 'yellow' && previous.day === entry.day && now.getTime() - new Date(previous.at).getTime() >= 30 * 60000)) d.lowDay = entry.day;
  d.entries = d.entries.filter(x => x.checkpoint !== entry.checkpoint);
  d.entries.push(entry);
  d.seen[entry.checkpoint] = true;
  if (!saveChecks(d)) return;
  checkResult = entry;
  render();
}
function checkLoadCap() {
  const d = getChecks(), last = d.entries.slice(-1)[0];
  return isLowLoad() || (last?.day === localDay() && last.level !== 'green') ? 2 : 3;
}
function startCheckBody() {
  const s = newLaunchSession('low','body');
  const latest = getChecks().entries.slice(-1)[0];
  const recent = latest?.day === localDay();
  if (recent && latest.answers.body === 2) Object.assign(s, {phase:'task',variant:1,level:0});
  else if (recent && latest.level === 'red') Object.assign(s, {phase:'task',variant:1,level:2});
  else Object.assign(s,{phase:'task',grounding:true,level:2});
  const d = getLauncher(); d.session = s;
  if (saveLauncher(d)) { state.view = 'launcher'; render(); }
}
document.addEventListener('click', event => {
  const t = event.target.closest('[data-check]'); if (!t) return;
  const action = t.dataset.check;
  if (action === 'answer') { checkDraft[t.dataset.key] = Number(t.dataset.value); return renderCheckPage(); }
  if (action === 'submit') return submitCheck();
  if (action === 'new') { checkResult = null; checkDraft = {}; state.view = 'scan'; return render(); }
  if (action === 'launch') return openCheckLauncher();
  if (action === 'dump') { dumpResult = null; state.view = 'dump'; return render(); }
  if (action === 'body') return startCheckBody();

  if (action === 'help') return supportCopy('我现在状态很不好，需要你陪我一会儿，帮我一起找支持。');
  if (action === 'edit-dump') { dumpResult = null; return render(); }
  const d = getChecks();
  if (action === 'reflect') {
    d.dump = collectSupportFields();
    if (!Object.values(d.dump).some(x => x.trim())) return showToast('写一句也可以，或者直接检查状态。');
    if (saveChecks(d)) { dumpResult = { matches: analyzeDump(d.dump) }; render(); } return;
  }
  if (action === 'save-times') {
    const times = [...app.querySelectorAll('[data-check-time]')].map(el => el.value);
    if (times.length !== 3 || times.some(x => !/^([01]\d|2[0-3]):[0-5]\d$/.test(x)) || new Set(times).size !== 3) return showToast('请选择三个不同的有效时间。');
    d.times = times.sort();
  }
  if (action === 'toggle-reminders') d.reminders = !d.reminders;
  if (action === 'calendar') {
    const url = URL.createObjectURL(new Blob([buildCheckCalendar(d.times)],{type:'text/calendar;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = '情绪归处-每日状态检查.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); return;
  }
  if (saveChecks(d)) { render(); showToast('已保存'); }
});
document.addEventListener('input', event => {
  if (state.view !== 'dump' || !event.target.dataset.supportField) return;
  const d = getChecks(); d.dump[event.target.dataset.supportField] = event.target.value; saveChecks(d);
});
function checkReminderTick() {
  if (document.visibilityState !== 'visible' || !dueCheckpoint() || document.querySelector('.check-reminder')) return;
  const key = dueCheckpoint();
  const notice = document.createElement('aside'); notice.className = 'check-reminder'; notice.setAttribute('role','status');
  const text = document.createElement('p'); text.textContent = '30 秒状态检查。看看这几个小时的睡眠、身体和行动。'; notice.appendChild(text);
  const finish = () => { const d = getChecks(); d.seen[key] = true; saveChecks(d); notice.remove(); };
  const open = document.createElement('button'); open.className = 'chip'; open.textContent = '现在看看'; open.addEventListener('click', () => { finish(); checkResult = null; checkDraft = {}; state.view = 'scan'; render(); });
  const dismiss = document.createElement('button'); dismiss.className = 'chip'; dismiss.textContent = '这次先跳过'; dismiss.addEventListener('click', finish);
  notice.appendChild(open); notice.appendChild(dismiss); document.body.appendChild(notice);
}


function openCheckLauncher() {
  const data = getLauncher();
  if (!data.session || ['done', 'rest', 'ground'].includes(data.session.phase)) {
    data.session = newLaunchSession();
    if (!saveLauncher(data)) return;
  }
  state.view = 'launcher';
  render();
}





