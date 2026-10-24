// Adapted from the user's five reference tables. These are prompts, not diagnoses.
const EMOTION_GROUPS = [
 ['想哭、心里沉沉的', [
 ['悲伤','像是在失去什么','支持、告别的空间','给自己留一点时间，不必立刻振作'],
 ['失落','现实和期待之间有落差','调整期待、被理解','先承认这件事对你很重要'],
 ['心酸','想到付出时酸酸的','被看见、被理解','写下一件自己确实付出过的事'],
 ['委屈','有话说不出，想被听见','理解、接纳、公平','先写一句希望别人理解的话'],
 ['无力','想做却提不起力气','休息、支持、界限','暂停一件非必要的事'],
 ['孤单','希望有人懂或有人在','陪伴、连接','向可信任的人发一句问候'],
 ['绝望','此刻看不到出路','支持、一点可控感','先把范围缩到眼前一步，也可以请人陪着'],
 ['心累','不想再撑着了','暂停、释放压力','允许自己暂时不回应要求'],
 ['悲痛','重要的失去让人很痛','陪伴、哀伤的空间','允许哭泣，也允许暂时说不出话'],
 ['空虚','像少了点联系或意义','与自己连接、意义感','留意一件对自己还有一点意义的小事'],
 ['惆怅','对过去有些放不下','回顾、整理经历','写下想保留的一小段记忆'],
 ['伤感','回忆让人柔软又难过','回顾、安慰','给回忆一点时间，再回到身边的事物']
 ]],
 ['憋着一口气、容易烦', [
 ['生气','有件事让你很不舒服','尊重、界限','写下具体是哪件事让你不舒服'],
 ['愤怒','很强烈地觉得不公平','公平、边界','先暂停行动，区分感受和准备做的事'],
 ['烦躁','一点声音或打扰也受不了','空间、减少刺激','暂时关掉一个消息提醒'],
 ['不满','现实与在意的标准有差距','改变、一致性','挑一个能具体说明的调整点'],
 ['憋屈','有想法却表达不出来','表达空间','先把想说的一句话写下来'],
 ['嫌弃','不想再接触或被消耗','距离、保护精力','允许自己拉开一点距离'],
 ['冲动','很想立刻做出反应','缓冲、选择空间','先停几秒，再决定要不要行动'],
 ['怨气','心里一直记着被亏待的事','公平、被听见','把“为什么总这样”换成一个具体请求'],
 ['嫉妒','看见别人拥有时心里刺痛','确认在意的东西、自我价值','问自己：我羡慕的具体是什么'],
 ['轻蔑','很难认同某种行为','价值边界','表达不认同具体行为，先不攻击人'],
 ['恼火','被打扰到快受不了了','暂停、恢复空间','离开刺激源片刻，如果环境允许'],
 ['恶心','对某些人事物有明显排斥感','距离、舒适感','先远离让你不舒服的刺激；身体不适别只归因于情绪']
 ]],
 ['担心会出事、绷得很紧', [
 ['害怕','担心自己应付不了','安全、支持','确认眼前是否安全，再选一个可承受的小步'],
 ['焦虑','脑子不断预演坏结果','信息、支持、可控感','写出最担心的具体一件事，暂不追求确定未来'],
 ['紧张','很在意接下来的表现','准备、允许不完美','只演练开头一句'],
 ['不安','担心失去或被忽略','稳定、关系确认','写下担心点，区分知道的和猜测的'],
 ['担心','怕事情朝不希望的方向发展','信息、可控范围','找一件今天能做的事，也允许暂时无解'],
 ['恐惧','感到强烈威胁','保护、支持','先确认当下环境，必要时找人陪伴'],
 ['慌张','事情太多，节奏太快','慢下来、减少输入','先暂停下一件事，看看身边一个物品'],
 ['惊慌','一时很难稳住自己','安全、陪伴','找一个安全的位置，联系可信任的人'],
 ['担忧未来','不知道以后怎么走','方向感、允许不确定','把时间缩到今天，不急着规划几年'],
 ['紧绷','一直处在准备应对的状态','放松、休息','试着放松肩膀，不强迫自己马上舒服'],
 ['沉甸甸','责任像压在身上','减轻负担、支持','写下一件不全由自己负责的事'],
 ['慌乱','想处理却找不到顺序','秩序、清晰','把事情写下来，只看眼前一项']
 ]],
 ['一直怪自己、怕被评价', [
 ['羞愧','很难接受此刻的自己','接纳、理解','先描述发生的事，不急着评价整个人'],
 ['自卑','比较时觉得自己低一等','自我价值、尊重','记录一个具体做过的努力，不必和别人比'],
 ['内疚','担心自己做错或伤到了人','责任澄清、修复','分清真实责任与额外自责'],
 ['自责','不断把问题归到自己身上','理解、减轻苛求','问问自己：哪些因素不由我决定'],
 ['羞耻','把一次行为看成整个人很差','接纳、自我尊重','练习说：这件事不等于全部的我'],
 ['失颜','觉得丢脸或被人看见短处','体面、接纳','看看别人实际做了什么，哪些只是猜测'],
 ['懊悔','很希望当时能换个做法','补救、学习','如果可以，选一个小小的修复动作'],
 ['悔恨','难以放过过去的自己','理解、修复、宽容','写一个以后想尝试的不同选择'],
 ['自我怀疑','不确定自己能不能做到','信心、信息','回想一个自己曾经应对过的具体片段'],
 ['自我否定','觉得自己好像一无是处','接纳、肯定','把“我不行”缩成具体哪个环节有困难'],
 ['难为情','被关注时想躲开','安心、空间','留意脚下的支撑，允许停顿'],
 ['在意他人眼光','不断猜别人怎么评价自己','自我认可、边界','把注意力拉回自己能选择的行为']
 ]],
 ['脑子乱、空白或没感觉', [
 ['纠结','几个选择都放不下','清晰、取舍','先写下这次最在意的一个条件'],
 ['矛盾','两种想法同时存在','容纳、整合','允许“我想要，同时也害怕”一起存在'],
 ['迷茫','不知道下一步往哪里去','方向、支持','只选一个能了解一点信息的小动作'],
 ['厌倦','重复的事情让人疲乏','变化、休息','换一个小细节，也可以先休息'],
 ['麻木','不太能感觉到情绪','温和接触、休息','留意手边物品的触感，不要求自己感动'],
 ['空白','一时什么也想不出来','缓冲、空间','暂停输入，看看身边一个颜色'],
 ['茫然','暂时找不到自己的位置','方向、定位','承认现在不知道，只处理眼前一点'],
 ['混乱','很多想法挤在一起','清晰、秩序','把脑中的三件事写出来，不急着解决'],
 ['内耗','反复拉扯却很难往前','选择空间、减轻压力','允许暂时不做决定，或只做一个可撤回的小选择'],
 ['脆弱','比平时更容易受影响','保护、支持','降低一点要求，请自己信任的人陪一下'],
 ['冷漠','暂时不想投入或回应','边界、恢复空间','允许暂停回应，留意自己是不是需要休息'],
 ['拒绝感','感觉自己被排除或不被接纳','接纳、连接','区分实际发生的拒绝和对自我价值的判断']
 ]]
];
let emotionExplorer = { origin:'dump', group:null, page:0, selected:[], fit:{}, needs:[], own:'' };
let dumpUndo = null;
let dumpFlushing = false;
function openEmotions(origin) {
  emotionExplorer = {origin,group:null,page:0,selected:[],fit:{},needs:[],own:''};
  state.view='emotions'; render();
}
function emotionRow(name) { return EMOTION_GROUPS.flatMap(group=>group[1]).find(row=>row[0]===name); }
function emotionButton(text, action, value='') { return `<button type="button" class="chip" data-emotion="${action}" data-value="${esc(value)}">${text}</button>`; }
function renderEmotions() {
  const e=emotionExplorer;
  let body;
  if(e.group===null) body=`<h1>更像哪一种感觉？</h1><p class="lead">不必先知道情绪的名字。选一个大致方向就好。</p><div class="emotion-directions">${EMOTION_GROUPS.map(([label],i)=>emotionButton(label,'group',i)).join('')}${emotionButton('都不像 / 我还不知道','unknown')}</div>`;
  else {
    const rows=e.group<0?[]:EMOTION_GROUPS[e.group][1].slice(e.page*4,e.page*4+4);
    body=`<h1>${e.group<0?'说不清也可以。':'哪些词有一点接近？'}</h1><p class="lead">可以同时选两个，不需要准确，也可以换一组。</p><div class="emotion-word-grid">${rows.map(([name,hint])=>`<button class="chip ${e.selected.includes(name)?'selected':''}" aria-pressed="${e.selected.includes(name)}" data-emotion="word" data-value="${name}"><strong>${name}</strong><small>${hint}</small></button>`).join('')}</div>${e.group>=0?`<div class="chip-group">${emotionButton('换一组描述','back')}${emotionButton('看看另外四个词','page')}<span class="question-help">${e.page+1} / 3</span></div>`:emotionButton('重新看看描述','back')}`;
  }
  body+=e.selected.map(name=>{
    const row=emotionRow(name); return `<article class="support-panel"><h2>${name}</h2><p>这可能与你正在经历的“${row[1]}”有关，也可能有别的原因。</p><p><strong>可能的需要：</strong>${row[2]}</p><p><strong>可以尝试：</strong>${row[3]}。</p><p class="question-help">有这种感受，不等于你做错了什么，也不自动证明外界发生了什么。</p><div class="chip-group">${['有点像','不太像'].map(fit=>`<button class="chip ${e.fit[name]===fit?'selected':''}" data-emotion="fit" data-name="${name}" data-value="${fit}" aria-pressed="${e.fit[name]===fit}">${fit}</button>`).join('')}${emotionButton('取消这个词','word',name)}</div>${e.fit[name]==='有点像'?`<p>现在可能需要什么？只选你认同的。</p><div class="chip-group">${row[2].split('、').map(need=>`<button class="chip ${e.needs.includes(need)?'selected':''}" aria-pressed="${e.needs.includes(need)}" data-emotion="need" data-value="${need}">${need}</button>`).join('')}</div>`:''}</article>`;
  }).join('');
  if(e.group!==null || e.selected.length) body+=`<label class="support-field">我自己的说法（可选）<textarea rows="2" maxlength="500" data-emotion-own placeholder="都不像也没关系，我可以用自己的话说。">${esc(e.own)}</textarea></label><p class="question-help">这些内容根据你提供的表格改写，只作为探索线索，不是诊断，也不是唯一解释。</p><div class="emotion-exits">${emotionButton(e.origin==='self'?'带回身体与情绪':'带回我的三句话','return')}${emotionButton('表达我的需要','expression')}${emotionButton('分清这是谁的责任','ownership')}${emotionButton('做一个小动作','launch')}${emotionButton('先停在这里','stop')}</div>`;
  app.innerHTML=`<main class="page">${brandTopline()}${emotionButton('← 返回原来的内容','return')}${body}</main>`;
}
function acceptedEmotions() { return emotionExplorer.selected.filter(name=>emotionExplorer.fit[name]==='有点像'); }
function emotionContext() {
  return `我可能感到：${acceptedEmotions().join('、') || '暂时说不清'}。我可能需要：${emotionExplorer.needs.join('、') || '还不确定'}。${emotionExplorer.own}`;
}
function applyEmotions() {
  const e=emotionExplorer;
  if(e.origin==='self') {
    state.draft.emotions=[...new Set([...(state.draft.emotions||[]),...acceptedEmotions(),...(e.own.trim()?[e.own.trim()]:[])])];
    state.draft.needs=[...new Set([...(state.draft.needs||[]),...e.needs])];
    return true;
  }
  const d=getChecks(); d.dumpEmotion={words:acceptedEmotions(),needs:[...e.needs],own:e.own}; return saveChecks(d);
}
function dumpExtras() {
  const e=getChecks().dumpEmotion;
  return `<div class="dump-extra">${emotionButton('帮我找一个更贴近的情绪词','open-dump')}${e && (e.words.length||e.own) ? `<p class="question-help">我认同的描述：${esc([...e.words,e.own].filter(Boolean).join('、'))}${e.needs.length?'；可能需要：'+esc(e.needs.join('、')):''}</p>`:''}<button type="button" class="flush-button" data-dump-clear>🚽 冲走这些烦恼 · 清空</button>${dumpUndo?'<button type="button" class="launcher-link" data-dump-undo>撤销刚才的清空</button>':''}<span class="question-help">只清空这里的三句话和本次情绪描述。</span></div>`;
}
function finishDumpFlush(overlay) {
  overlay?.remove(); app.inert=false; dumpFlushing=false;
  if(state.view==='dump') {render(); app.querySelector('textarea')?.focus();}
}
function clearDump() {
  if(dumpFlushing) return;
  const d=getChecks(); const previous={dump:{...d.dump},emotion:d.dumpEmotion,result:dumpResult};
  d.dump={}; delete d.dumpEmotion;
  if(!saveChecks(d)) return;
  dumpUndo=previous; dumpResult=null; dumpFlushing=true; app.inert=true;
  app.querySelector('.dump-sheet')?.classList.add('dump-flushing');
  const overlay=document.createElement('div'); overlay.className='flush-overlay'; overlay.setAttribute('role','status');
  overlay.innerHTML='<div class="flush-paper" aria-hidden="true">〰<br>〰〰<br>〰</div><div class="flush-bowl" aria-hidden="true">🚽<span class="flush-water"></span></div><p>给新的想法，留一点空白。</p>';
  document.body.appendChild(overlay);
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  setTimeout(()=>finishDumpFlush(overlay),reduced?0:950);
}
document.addEventListener('click',event=>{
  if(event.target.closest('[data-dump-clear]')) return clearDump();
  if(event.target.closest('[data-dump-undo]') && dumpUndo) {
    const d=getChecks();
    if(Object.values(d.dump).some(value=>String(value).trim())) return showToast('这里已经有新的内容，先保留它，不覆盖。');
    d.dump=dumpUndo.dump;d.dumpEmotion=dumpUndo.emotion;
    if(saveChecks(d)){dumpResult=dumpUndo.result;dumpUndo=null;render();} return;
  }
  const t=event.target.closest('[data-emotion]');if(!t)return;
  const action=t.dataset.emotion, value=t.dataset.value, e=emotionExplorer;
  if(action==='open-self') return openEmotions('self');
  if(action==='open-dump') return openEmotions('dump');
  if(action==='group'){e.group=Number(value);e.page=0;}
  if(action==='unknown')e.group=-1;
  if(action==='back')e.group=null;
  if(action==='page')e.page=(e.page+1)%3;
  if(action==='word'){
    if(e.selected.includes(value)){e.selected=e.selected.filter(x=>x!==value);delete e.fit[value];e.needs=[];}
    else if(e.selected.length<2)e.selected.push(value);else return showToast('先选最接近的两个就好，也可以取消再选。');
  }
  if(action==='fit'){e.fit[t.dataset.name]=value;if(value==='不太像')e.needs=[];}
  if(action==='need')e.needs=e.needs.includes(value)?e.needs.filter(x=>x!==value):[...e.needs,value];
  if(['return','stop','launch','ownership','expression'].includes(action)) {
    if(!applyEmotions())return;
    if(action==='ownership'){ startFlow('ownership',{skipCooldown:true}); state.draft.emotionContext=emotionContext(); return render(); }
    if(action==='expression'){ const context=emotionContext(); startFlow('expression'); state.draft.rawStatement=context; state.draft.request=e.needs.join('、'); return render(); }
    if(action==='launch')return openCheckLauncher();
    state.view=action==='stop'?'home':e.origin==='self'?'flow':'dump';
  }
  render();
});
document.addEventListener('input',event=>{if(event.target.matches('[data-emotion-own]'))emotionExplorer.own=event.target.value;});

