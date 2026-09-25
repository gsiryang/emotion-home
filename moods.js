const MOOD_KEY = 'emotion-home:moods';
const MOOD_PERIODS = ['上午', '下午', '晚上'];
const MOOD_LABELS = ['很难过', '难过', '有点低落', '平静', '开心', '很开心'];
let moodMonth = '';
function getMoods() { return { days: {}, enabled: true, ...readJSON(MOOD_KEY, {}) }; }
function saveMoods(data) {
  try { writeJSON(MOOD_KEY, data); return true; }
  catch { showToast('情绪暂时无法保存，请检查浏览器存储空间。'); return false; }
}
function moodPeriod(date = new Date()) { return date.getHours() < 12 ? 0 : date.getHours() < 18 ? 1 : 2; }
function moodFace(score) {
  const colors = ['#d6dced','#d9e3eb','#e2e7da','#ebe9c9','#f4dfa6','#f6cf84'];
  const mouths = ['M20 35 Q30 22 40 35','M21 34 Q30 26 39 34','M23 32 Q30 29 37 32','M23 31 L37 31','M21 29 Q30 40 39 29','M19 28 Q30 45 41 28 Z'];
  return `<svg viewBox="0 0 60 60" aria-hidden="true" class="mood-face"><circle cx="30" cy="30" r="27" fill="${colors[score-1]}"/><circle cx="21" cy="23" r="2" fill="#45564f"/><circle cx="39" cy="23" r="2" fill="#45564f"/><path d="${mouths[score-1]}" fill="${score===6?'#45564f':'none'}" stroke="#45564f" stroke-width="2.3" stroke-linecap="round"/></svg>`;
}
function moodDue(data, date = new Date()) {
  if (!data.enabled) return [];
  const day = data.days[localDay(date)], period = moodPeriod(date);
  if (!day && period === 2) return [0,1,2];
  return day?.shown?.includes(period) || day?.values?.[period] ? [] : [period];
}
function moodReminderTick() {
  if (document.visibilityState !== 'visible' || document.querySelector('.mood-dialog')) return;
  const data = getMoods(), now = new Date(), key = localDay(now), slots = moodDue(data,now);
  if (!slots.length) return;
  const day = data.days[key] || {values:{}, shown:[], firstPeriod:moodPeriod(now)};
  day.shown = [...new Set([...day.shown, ...slots])]; data.days[key] = day;
  if (!saveMoods(data)) return;
  const previousFocus = document.activeElement;
  const dialog = document.createElement('dialog'); dialog.className = 'mood-dialog';
  const draft = {};
  dialog.innerHTML = `<h2>${slots.length === 3 ? '今天过得怎么样？' : '这个' + MOOD_PERIODS[slots[0]] + '，心情怎么样？'}</h2><p>${slots.length === 3 ? '今天晚上才见到你。愿意的话，补选上午、下午和现在的心情；记不清的可以留空。' : '选一个最接近的表情，不需要解释。'}</p>${slots.map(period=>`<fieldset><legend>${MOOD_PERIODS[period]}</legend><div class="mood-options">${[6,5,4,3,2,1].map(score=>`<button type="button" data-mood-period="${period}" data-mood-score="${score}" aria-pressed="false">${moodFace(score)}<span>${MOOD_LABELS[score-1]}</span></button>`).join('')}</div></fieldset>`).join('')}<p class="question-help">只记录你选的心情，不影响任务和状态扫描。没填写的不会计成低分。</p><button class="button primary wide" data-mood-save disabled>保存心情</button><button class="launcher-link" data-mood-close>这次先不填</button>`;
  dialog.addEventListener('click',event=>{
    const choice = event.target.closest('[data-mood-score]');
    if(choice) {
      const period=choice.dataset.moodPeriod, score=Number(choice.dataset.moodScore);
      if(draft[period]===score) delete draft[period]; else draft[period]=score;
      dialog.querySelectorAll(`[data-mood-period="${period}"]`).forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.moodScore)===draft[period])));
      dialog.querySelector('[data-mood-save]').disabled = !Object.keys(draft).length;
    }
    if(event.target.closest('[data-mood-close]')) dialog.close();
    if(event.target.closest('[data-mood-save]') && Object.keys(draft).length) {
      const current=getMoods();
      current.days[key] = {...(current.days[key] || day), values:{...(current.days[key]?.values || {}),...draft}};
      if(saveMoods(current)) { dialog.close(); if(state.view==='settings') render(); showToast('心情已保存'); }
    }
  });
  dialog.addEventListener('close',()=>{dialog.remove(); previousFocus?.focus?.();});
  document.body.appendChild(dialog); dialog.showModal();
}
function moodAverages(month, data = getMoods()) {
  return Object.entries(data.days).filter(([day])=>day.startsWith(month+'-')).map(([day,item])=>{
    const scores=Object.values(item.values || {}).filter(score=>Number.isInteger(score)&&score>=1&&score<=6);
    return {day, count:scores.length, average:scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:null};
  }).filter(item=>item.count).sort((a,b)=>a.day.localeCompare(b.day));
}
function renderMoodChart() {
  const month = moodMonth || localDay().slice(0,7), rows=moodAverages(month);
  const days = new Date(Number(month.slice(0,4)),Number(month.slice(5,7)),0).getDate();
  const x=day=>42+(Number(day.slice(-2))-1)*470/(days-1), y=score=>190-(score-1)*30;
  const lines=rows.slice(1).map((row,i)=>Number(row.day.slice(-2))-Number(rows[i].day.slice(-2))===1 ? `<line x1="${x(rows[i].day)}" y1="${y(rows[i].average)}" x2="${x(row.day)}" y2="${y(row.average)}" stroke="#486c59" stroke-width="2.5"/>`:'').join('');
  return `<article class="setting-card"><h3>每月心情变化</h3><label class="support-field">查看月份<input type="month" data-mood-month value="${month}" max="${localDay().slice(0,7)}"></label><p>很难过 1 分 → 很开心 6 分。每个点是当天实际填写的平均值，缺失日期留空。</p>${rows.length ? `<svg viewBox="0 0 550 230" role="img" aria-label="${month}每日心情平均分，详细数值见下方记录" class="mood-chart">${[1,2,3,4,5,6].map(n=>`<line x1="42" y1="${y(n)}" x2="512" y2="${y(n)}" stroke="#e0e5da"/><text x="20" y="${y(n)+4}" font-size="12">${n}</text>`).join('')}${lines}${rows.map(row=>`<circle cx="${x(row.day)}" cy="${y(row.average)}" r="4" fill="#486c59"><title>${row.day}：${row.average.toFixed(2)} 分，${row.count} 次记录</title></circle>`).join('')}<text x="42" y="217" font-size="12">1 日</text><text x="490" y="217" font-size="12">${days} 日</text></svg><details><summary>查看每日数值（${rows.length} 天有记录）</summary><table class="mood-table"><thead><tr><th>日期</th><th>平均分</th><th>填写次数</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${row.day}</td><td>${row.average.toFixed(2)}</td><td>${row.count}</td></tr>`).join('')}</tbody></table></details>` : '<p class="empty-state">这个月还没有填写心情。没有记录的日期不计分，也不用补填。</p>'}<p class="question-help">这是心情记录，不是诊断或成绩。不同天填写的时段数量可能不同。</p></article>`;
}
function renderMoodSettings() {
  return `<p class="eyebrow">每天三个轻轻的问候</p><h1>用一个表情，记住心情。</h1><div class="support-panel"><div class="mood-preview">${[6,5,4,3,2,1].map(n=>`<span>${moodFace(n)}<small>${MOOD_LABELS[n-1]}</small></span>`).join('')}</div><p>上午 00:00–11:59、下午 12:00–17:59、晚上 18:00–23:59，各弹出一次选择窗。按设备本地时间计算。</p><p>如果当天晚上才第一次打开，会一次展示三个时段供补填；可以只选记得的时段。整天没打开就留空，不追补以前的日期。</p><button class="chip" data-mood-toggle>${getMoods().enabled ? '暂停表情提醒' : '开启表情提醒'}</button><p class="question-help">页面打开且可见时才会弹窗；关闭软件不会推送。月度曲线在设置里查看，原来的 30 秒状态检查仍可从首页主动打开。</p></div>`;
}
document.addEventListener('click',event=>{
  if(!event.target.closest('[data-mood-toggle]')) return;
  const data=getMoods(); data.enabled=!data.enabled; if(saveMoods(data)) render();
});
document.addEventListener('change',event=>{
  if(!event.target.matches('[data-mood-month]')) return;
  const value=event.target.value;
  if(/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {moodMonth=value; render();}
});
setInterval(moodReminderTick,30000);
document.addEventListener('visibilitychange',moodReminderTick);
