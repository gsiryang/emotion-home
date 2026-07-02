const STORAGE = {
  onboarded: "emotion-home:onboarded",
  records: "emotion-home:records",
  settings: "emotion-home:settings"
};

const COPY = {
  bodyAreas: ["头部", "眼睛", "喉咙", "胸口", "胃部", "腹部", "肩颈", "手臂和手", "腿部", "全身", "没有明显感觉"],
  sensations: [
    "紧",
    "堵",
    "沉",
    "被压住",
    "发热",
    "发冷",
    "发抖",
    "跳动",
    "呼吸浅",
    "酸",
    "胀",
    "刺痛",
    "发麻",
    "恶心",
    "没力气",
    "发软",
    "僵硬",
    "发飘",
    "空",
    "坐立不安",
    "说不清"
  ],
  urges: ["离开", "反驳", "解释", "哭", "攻击", "躲起来", "找人确认", "靠近某个人", "蜷缩", "停止思考", "什么都不做", "不知道"],
  emotions: [
    "焦虑",
    "担心",
    "不确定",
    "害怕被误解",
    "害怕被拒绝",
    "警觉",
    "烦躁",
    "生气",
    "被控制",
    "委屈",
    "不公平",
    "难过",
    "孤独",
    "失望",
    "无力",
    "空虚",
    "尴尬",
    "羞耻",
    "内疚",
    "害怕被看低",
    "想证明自己",
    "平静",
    "好奇",
    "期待",
    "都不像，但我确定自己不舒服"
  ],
  needs: ["安全感", "关系确认", "被理解", "保留不同意见", "自主权", "尊重", "空间", "休息", "清晰的信息", "公平", "被肯定", "连接", "表达", "暂时不知道"],
  selfActions: ["先坐两分钟", "喝水或走动", "放松肩膀和呼吸", "暂停回复十分钟", "写下想说的话但暂不发送", "直接表达感受", "请求澄清", "请求陪伴", "结束当前对话", "联系可信任的人"],
  ownershipFacts: ["对方没有回复", "回复变短", "语气发生变化", "对方皱眉、叹气或沉默", "对方明确说不高兴", "对方明确说与我有关", "我刚才确实说了可能伤人的话", "只是隐约感觉不对"],
  stories: ["对方生气了", "对方不喜欢我了", "我说错话了", "对方要疏远我", "我必须马上解释", "我必须让对方开心", "如果不处理，关系会变坏"],
  supports: ["对方明确指出了我的行为", "变化紧接着我的话发生", "我确实违反了已知边界", "类似问题以前出现过", "没有直接证据，只有感觉"],
  counters: ["对方今天本来就很累", "对方正在经历其他压力", "对方没有指责我", "过去沉默后关系仍然正常", "对方明确说与我无关", "我还没有足够信息"],
  alternatives: ["可能与我刚才的话有关", "可能被其他事情影响", "可能只是疲惫", "可能只想安静一会儿", "可能不同意我，但关系没有破裂", "可能没有察觉自己的语气", "目前无法判断"],
  ownershipConclusions: ["主要是我的焦虑", "可能与双方互动有关", "对方已经明确表达不满", "信息不足，暂不判断"],
  ownershipActions: ["不行动，等待更多事实", "正常相处", "直接确认一次", "为明确行为道歉", "暂停当前对话", "表达自己的边界"],
  audiences: ["陌生人", "不熟悉的人", "熟人", "亲近的人", "小组或会议", "有权威的人", "公开网络", "匿名空间"],
  expressionKinds: ["表达观点", "表达不同意见", "表达感受", "提出请求", "设立边界", "展示作品", "介绍自己", "寻求帮助"],
  expressionFears: ["被否定", "被嘲笑", "说错话", "显得不够聪明", "被攻击", "被误解", "破坏关系", "暴露自己", "尴尬冷场", "没有人回应", "身体僵住", "想躲起来"],
  safetyReality: ["没有现实危险，只是很紧张", "可能被评价，但后果可承受", "可能影响关系，需要选择表达方式", "可能带来现实后果，需要先准备", "当前环境确实不安全，暂不表达"],
  supportsForExpression: ["允许自己只说一句", "提前写好", "带着笔记说", "先向可信的人练习", "使用匿名或低暴露方式", "允许停顿", "承认自己不确定", "表达后离开一会儿", "请一个人陪伴"],
  expressionNeeds: ["被看见", "表达真实想法", "保留不同意见", "维护边界", "争取机会", "与人连接", "得到反馈", "不再隐藏", "练习勇气", "保护自己"],
  ladder: ["只在这里写下来", "朗读给自己听", "发给可信任的人", "在匿名空间表达", "向一个不熟悉的人说一句", "在小组中表达简短观点", "完整公开表达"]
};

const FLOW_META = {
  self: { label: "向内看", steps: 7, color: "self" },
  ownership: { label: "情绪归属", steps: 8, color: "ownership" },
  expression: { label: "表达自我", steps: 9, color: "expression" }
};

const app = document.querySelector("#app");

const state = {
  view: localStorage.getItem(STORAGE.onboarded) ? "home" : "onboarding",
  nav: "home",
  onboardingStep: 0,
  flow: null,
  step: 0,
  draft: {},
  openTool: null,
  cooldown: null
};

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getRecords() {
  return readJSON(STORAGE.records, []);
}

function getSettings() {
  return { promptDensity: "detailed", ...readJSON(STORAGE.settings, {}) };
}

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function listText(values, fallback = "暂未选择") {
  return values?.length ? values.join("、") : fallback;
}

function chipGroup(key, values, selected = [], options = {}) {
  const selectedValues = Array.isArray(selected) ? selected : [selected].filter(Boolean);
  return `
    <div class="chip-group" data-chip-group="${esc(key)}" data-multiple="${options.multiple !== false}">
      ${values
        .map(
          (value) => `
            <button
              class="chip ${options.warm ? "warm" : ""} ${selectedValues.includes(value) ? "selected" : ""}"
              type="button"
              data-action="toggle-chip"
              data-key="${esc(key)}"
              data-value="${esc(value)}"
              data-multiple="${options.multiple !== false}"
            >${esc(value)}</button>`
        )
        .join("")}
    </div>`;
}

function prompt(text, tone = "") {
  if (getSettings().promptDensity === "minimal") return "";
  return `<div class="prompt-box ${tone}">${text}</div>`;
}

function navBar(active = state.nav) {
  const items = [
    ["home", "⌂", "练习"],
    ["records", "▤", "记录"],
    ["tools", "◇", "工具"],
    ["settings", "⚙", "设置"]
  ];
  return `
    <nav class="bottom-nav" aria-label="主导航">
      ${items
        .map(
          ([id, icon, label]) => `
            <button class="nav-button ${active === id ? "active" : ""}" type="button" data-action="nav" data-view="${id}">
              <span aria-hidden="true">${icon}</span>${label}
            </button>`
        )
        .join("")}
    </nav>`;
}

function brandTopline(extra = "") {
  return `
    <div class="topline">
      <div class="brand"><span class="brand-mark">◉</span>情绪归处</div>
      ${extra}
    </div>`;
}

function render() {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (state.view === "onboarding") return renderOnboarding();
  if (state.view === "flow") return renderFlow();
  if (state.view === "review") return renderReview();
  if (state.view === "records") return renderRecords();
  if (state.view === "tools") return renderTools();
  if (state.view === "settings") return renderSettings();
  renderHome();
}

function renderOnboarding() {
  const pages = [
    {
      icon: "◉",
      title: "欢迎来到情绪归处",
      body: "这里没有标准答案。你可以暂时不知道自己是什么情绪，只知道身体不舒服；也可以看见别人不开心，而不立刻把它变成自己的责任。",
      content: `
        <div class="principle-list">
          <div class="principle"><strong>向内看</strong><span>从身体线索开始，慢慢辨认自己的感受。</span></div>
          <div class="principle"><strong>分清归属</strong><span>区分事实、脑补、自己的焦虑和别人的情绪。</span></div>
          <div class="principle"><strong>表达自我</strong><span>不用硬闯，在可承受的安全阶梯上逐步出现。</span></div>
        </div>`
    },
    {
      icon: "≈",
      title: "感觉不是事实",
      body: "“对方不喜欢我了”可能是一个真实的担忧，但仍然只是一个需要验证的解释。不确定不是危险，也不是失败。",
      content: `
        <div class="principle-list">
          <div class="principle"><strong>身体往往更早知道</strong><span>说不出感受时，可以先寻找胸口、胃部、呼吸和动作冲动。</span></div>
          <div class="principle"><strong>别人可以在你面前不舒服</strong><span>你可以关心，但不需要负责消除别人的全部情绪。</span></div>
          <div class="principle"><strong>表达可以很小</strong><span>写下一句、承认不确定、只向一个人说，都是有效练习。</span></div>
        </div>`
    },
    {
      icon: "⌁",
      title: "你的记录只属于你",
      body: "应用不需要账号。记录默认只保存在当前设备，不会上传到GitHub，也不会用来诊断你。",
      content: `
        <label class="field-label">默认提示密度</label>
        <div class="segmented">
          <button class="segment active" type="button" data-action="set-density" data-value="detailed">详细</button>
          <button class="segment" type="button" data-action="set-density" data-value="standard">标准</button>
          <button class="segment" type="button" data-action="set-density" data-value="minimal">简洁</button>
        </div>
        ${prompt("详细模式会解释每一步为什么这样问。以后可以随时在设置中修改。")}`
    }
  ];
  const page = pages[state.onboardingStep];
  app.innerHTML = `
    <main class="onboarding">
      <div class="onboarding-art">${page.icon}</div>
      <div class="onboarding-copy">
        <div class="onboarding-step">认识工具 ${state.onboardingStep + 1} / ${pages.length}</div>
        <h1>${page.title}</h1>
        <p class="lead">${page.body}</p>
        ${page.content}
      </div>
      <button class="button primary wide" type="button" data-action="onboarding-next">
        ${state.onboardingStep === pages.length - 1 ? "进入情绪归处" : "继续"}
      </button>
    </main>`;
}

function renderHome() {
  const records = getRecords();
  const today = new Date().toDateString();
  const todayCount = records.filter((record) => new Date(record.createdAt).toDateString() === today).length;
  app.innerHTML = `
    <main class="page">
      ${brandTopline(`<span class="progress-label">${todayCount ? `今天已看见 ${todayCount} 次` : "今天也可以慢一点"}</span>`)}
      <section class="home-intro">
        <p class="eyebrow">现在这一刻</p>
        <h1>你更需要哪一种帮助？</h1>
        <p class="lead">不需要一次想明白。选一个最接近当前状态的入口。</p>
      </section>
      <section class="entry-grid">
        <button class="entry-card self" type="button" data-action="start-flow" data-flow="self">
          <span class="entry-icon">≈</span>
          <span class="entry-title">我的身体好像在说什么</span>
          <span class="entry-copy">从身体感受开始，慢慢辨认自己的情绪和需要。</span>
          <span class="entry-action">开始向内看 <b>→</b></span>
        </button>
        <button class="entry-card ownership" type="button" data-action="start-flow" data-flow="ownership">
          <span class="entry-icon">◎</span>
          <span class="entry-title">我又开始担心别人不高兴了</span>
          <span class="entry-copy">区分事实、脑补和情绪归属，决定是否真的需要行动。</span>
          <span class="entry-action">开始分辨 <b>→</b></span>
        </button>
        <button class="entry-card expression" type="button" data-action="start-flow" data-flow="expression">
          <span class="entry-icon">◇</span>
          <span class="entry-title">我想表达，但又想躲起来</span>
          <span class="entry-copy">确认真实风险，组织想说的话，选择一个可承受的表达台阶。</span>
          <span class="entry-action">练习出现 <b>→</b></span>
        </button>
        <button class="entry-card review" type="button" data-action="open-review">
          <span class="entry-title">回顾今天</span>
          <span class="entry-copy">看看什么时候看见了自己，什么时候替别人承担了情绪。</span>
        </button>
      </section>
      <p class="daily-line">看见情绪，不等于必须立刻处理情绪。表达自我，也不必一次暴露全部自己。</p>
    </main>
    ${navBar("home")}`;
}

function latestOwnershipWithin(minutes = 20) {
  const record = getRecords().find((item) => item.type === "ownership");
  if (!record) return null;
  return Date.now() - new Date(record.createdAt).getTime() < minutes * 60 * 1000 ? record : null;
}

function startFlow(type, options = {}) {
  if (type === "ownership" && !options.skipCooldown) {
    const recent = latestOwnershipWithin();
    if (recent) {
      state.cooldown = recent;
      state.view = "flow";
      state.flow = "cooldown";
      state.step = 0;
      state.draft = {};
      return render();
    }
  }
  state.view = "flow";
  state.flow = type;
  state.step = 0;
  state.draft = type === "self" && options.event ? { event: options.event } : {};
  render();
}

function flowHeader(meta) {
  const progress = ((state.step + 1) / meta.steps) * 100;
  return `
    <header class="flow-header">
      <div class="flow-nav">
        <button class="icon-button" type="button" data-action="flow-close" aria-label="退出练习">×</button>
        <span class="progress-label">${meta.label} · ${Math.min(state.step + 1, meta.steps)} / ${meta.steps}</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
    </header>`;
}

function flowActions({ nextLabel = "继续", back = true, disabled = false } = {}) {
  return `
    <div class="flow-actions">
      <button class="button secondary" type="button" data-action="${back ? "flow-back" : "flow-close"}">${back ? "上一步" : "稍后再说"}</button>
      <button class="button primary" type="button" data-action="flow-next" ${disabled ? "disabled" : ""}>${nextLabel}</button>
    </div>`;
}

function renderFlow() {
  if (state.flow === "cooldown") return renderCooldown();
  const meta = FLOW_META[state.flow];
  const renderer = { self: renderSelfStep, ownership: renderOwnershipStep, expression: renderExpressionStep }[state.flow];
  app.innerHTML = `<main class="page flow-page">${flowHeader(meta)}${renderer()}</main>`;
}

function renderCooldown() {
  app.innerHTML = `
    <main class="page flow-page">
      <div class="flow-nav">
        <button class="icon-button" type="button" data-action="flow-close">×</button>
        <span class="progress-label">先停一下</span>
      </div>
      <section class="question">
        <p class="eyebrow">20分钟内已有一次记录</p>
        <h1 class="question-title">这是同一件事吗？</h1>
        <p class="question-help">重复分析可能正在缓解焦虑，而不是获得新信息。</p>
      </section>
      ${prompt("你上次已经完成了一次情绪归属判断。除非出现新事实，否则这一次更适合回到自己的身体。", "warm")}
      <div class="entry-grid">
        <button class="entry-card review" type="button" data-action="cooldown-choice" data-value="new-fact">
          <span class="entry-title">有新的事实出现</span>
          <span class="entry-copy">对方明确说了什么，或者客观情况发生了变化。</span>
        </button>
        <button class="entry-card review" type="button" data-action="cooldown-choice" data-value="anxiety">
          <span class="entry-title">没有，只是我又焦虑了</span>
          <span class="entry-copy">转回身体觉察，不再重复猜测对方。</span>
        </button>
        <button class="entry-card review" type="button" data-action="cooldown-choice" data-value="new-event">
          <span class="entry-title">是另一件新事件</span>
          <span class="entry-copy">开始一条新的情绪归属记录。</span>
        </button>
      </div>
    </main>`;
}

function renderSelfStep() {
  const d = state.draft;
  if (state.step === 0) {
    return `
      <section class="question">
        <p class="eyebrow">先不解释原因</p>
        <h1 class="question-title">身体哪里最明显？</h1>
        <p class="question-help">可以闭眼十秒，注意呼吸、喉咙、胸口、胃部和肩膀。</p>
      </section>
      ${chipGroup("bodyAreas", COPY.bodyAreas, d.bodyAreas)}
      ${prompt("感觉不到也可以选择“没有明显感觉”。觉察不是考试。")}
      ${flowActions({ back: false, disabled: !d.bodyAreas?.length })}`;
  }
  if (state.step === 1) {
    return `
      <section class="question">
        <p class="eyebrow">身体语言</p>
        <h1 class="question-title">它更像什么感觉？</h1>
        <p class="question-help">选择最接近的词，也可以只选“说不清”。</p>
      </section>
      ${chipGroup("sensations", COPY.sensations, d.sensations)}
      <div class="range-wrap">
        <div class="range-row"><strong>不舒服的强度</strong><span class="range-value">${d.intensity ?? 5}</span></div>
        <input type="range" min="0" max="10" value="${d.intensity ?? 5}" data-input="intensity" />
      </div>
      ${flowActions({ disabled: !d.sensations?.length })}`;
  }
  if (state.step === 2) {
    return `
      <section class="question">
        <p class="eyebrow">动作冲动</p>
        <h1 class="question-title">如果身体能行动，它想做什么？</h1>
        <p class="question-help">冲动不是命令，它只是帮助你理解当前状态。</p>
      </section>
      ${chipGroup("urges", COPY.urges, d.urges)}
      ${prompt("想反驳可能与愤怒、受威胁或害怕被误解有关；想躲起来可能与羞耻、害怕暴露或缺乏安全感有关。")}
      ${flowActions({ disabled: !d.urges?.length })}`;
  }
  if (state.step === 3) {
    return `
      <section class="question">
        <p class="eyebrow">不用追求准确</p>
        <h1 class="question-title">哪些情绪词有一点接近？</h1>
        <p class="question-help">可以多选。今天的答案以后也可以改变。</p>
      </section>
      ${chipGroup("emotions", COPY.emotions, d.emotions)}
      <label class="field-label" for="self-event">情绪出现前，最近发生了什么？</label>
      <textarea id="self-event" class="text-area" data-input="event" placeholder="只写最近的一件事，不必写完整故事。">${esc(d.event || "")}</textarea>
      ${flowActions({ disabled: !d.emotions?.length })}`;
  }
  if (state.step === 4) {
    return `
      <section class="question">
        <p class="eyebrow">情绪背后</p>
        <h1 class="question-title">你可能需要什么？</h1>
        <p class="question-help">识别需要，不等于要求眼前的人立刻满足它。</p>
      </section>
      ${chipGroup("needs", COPY.needs, d.needs)}
      ${prompt("同一个需要可以有很多满足方式。需要安全感，不等于必须马上向别人确认关系。")}
      ${flowActions({ disabled: !d.needs?.length })}`;
  }
  if (state.step === 5) {
    return `
      <section class="question">
        <p class="eyebrow">只选一个</p>
        <h1 class="question-title">现在最小、最温和的行动是什么？</h1>
        <p class="question-help">目标不是立刻解决全部问题，而是先让自己多一点空间。</p>
      </section>
      ${chipGroup("action", COPY.selfActions, d.action, { multiple: false })}
      ${Number(d.intensity ?? 5) >= 7 ? prompt("强度较高时，先暂停争论和重大决定。若感到自己不安全，请联系可信任的人或当地紧急支持。", "warm") : ""}
      ${flowActions({ disabled: !d.action, nextLabel: "生成觉察卡" })}`;
  }
  return renderSelfSummary();
}

function renderSelfSummary() {
  const d = state.draft;
  return `
    <section class="question">
      <p class="eyebrow">这一次，你看见了自己</p>
      <h1 class="question-title">觉察卡</h1>
      <p class="question-help">不需要百分之百准确。它只是你此刻最接近的描述。</p>
    </section>
    <div class="summary-card">
      <div class="summary-label">身体</div>
      <div class="summary-value">${esc(listText(d.bodyAreas))}出现${esc(listText(d.sensations))}，强度约${d.intensity ?? 5}/10。</div>
      <div class="summary-label">可能的情绪</div>
      <div class="summary-value">${esc(listText(d.emotions))}</div>
      <div class="summary-label">可能的需要</div>
      <div class="summary-value">${esc(listText(d.needs))}</div>
      <div class="summary-label">现在的行动</div>
      <div class="summary-value">${esc(d.action || "暂不行动")}</div>
    </div>
    ${prompt("能更早发现身体信号，本身就是进步。你不必等到身体非常难受才允许自己停下来。")}
    <div class="flow-actions">
      <button class="button secondary" type="button" data-action="flow-back">修改</button>
      <button class="button primary" type="button" data-action="save-flow">保存记录</button>
    </div>`;
}

function renderOwnershipStep() {
  const d = state.draft;
  if (state.step === 0) {
    return `
      <section class="question">
        <p class="eyebrow">只写摄像机能拍到的</p>
        <h1 class="question-title">客观发生了什么？</h1>
        <p class="question-help">先不猜测对方的内心，只记录言语、动作和时间。</p>
      </section>
      ${chipGroup("facts", COPY.ownershipFacts, d.facts)}
      <label class="field-label" for="fact-detail">补充一个具体事实</label>
      <textarea id="fact-detail" class="text-area" data-input="factDetail" placeholder="例如：对方看完消息后没有继续回复。">${esc(d.factDetail || "")}</textarea>
      ${prompt("“对方觉得我很烦”不是事实，因为摄像机拍不到。它可以在下一步作为你的解释被认真记录。")}
      ${flowActions({ back: false, disabled: !d.facts?.length && !d.factDetail })}`;
  }
  if (state.step === 1) {
    return `
      <section class="question">
        <p class="eyebrow">大脑正在保护关系</p>
        <h1 class="question-title">你最先脑补了什么？</h1>
        <p class="question-help">担忧是真实的，但担忧的内容还没有被证实。</p>
      </section>
      ${chipGroup("stories", COPY.stories, d.stories)}
      <label class="field-label" for="story-detail">还有什么自动想法？</label>
      <textarea id="story-detail" class="text-area" data-input="storyDetail" placeholder="例如：如果我不马上解释，关系就会坏掉。">${esc(d.storyDetail || "")}</textarea>
      ${flowActions({ disabled: !d.stories?.length && !d.storyDetail })}`;
  }
  if (state.step === 2) {
    return `
      <section class="question">
        <p class="eyebrow">把注意力带回自己</p>
        <h1 class="question-title">这件事让你怎么了？</h1>
        <p class="question-help">无论对方的真实原因是什么，你现在的身体和焦虑都值得被看见。</p>
      </section>
      <label class="field-label">身体部位</label>
      ${chipGroup("bodyAreas", COPY.bodyAreas, d.bodyAreas)}
      <label class="field-label">可能的情绪</label>
      ${chipGroup("emotions", COPY.emotions.slice(0, 20), d.emotions)}
      <div class="range-wrap">
        <div class="range-row"><strong>当前强度</strong><span class="range-value">${d.intensity ?? 5}</span></div>
        <input type="range" min="0" max="10" value="${d.intensity ?? 5}" data-input="intensity" />
      </div>
      ${flowActions({ disabled: !d.emotions?.length })}`;
  }
  if (state.step === 3) {
    return `
      <section class="question">
        <p class="eyebrow">检查，而不是定罪</p>
        <h1 class="question-title">目前有哪些证据？</h1>
        <p class="question-help">同时看支持和不支持你的担忧的信息。</p>
      </section>
      <label class="field-label">支持“可能与我有关”</label>
      ${chipGroup("supports", COPY.supports, d.supports, { warm: true })}
      <label class="field-label">提醒我“还不能确定”</label>
      ${chipGroup("counters", COPY.counters, d.counters)}
      ${flowActions({ disabled: !d.supports?.length && !d.counters?.length })}`;
  }
  if (state.step === 4) {
    return `
      <section class="question">
        <p class="eyebrow">至少保留三个可能</p>
        <h1 class="question-title">除了“都是我的错”，还有什么解释？</h1>
        <p class="question-help">不是强行乐观，而是承认信息不完整。</p>
      </section>
      ${chipGroup("alternatives", COPY.alternatives, d.alternatives)}
      ${prompt("请选择至少三个解释。你不需要决定哪一个一定正确。")}
      ${flowActions({ disabled: (d.alternatives?.length || 0) < 3 })}`;
  }
  if (state.step === 5) {
    return `
      <section class="question">
        <p class="eyebrow">区分已知与未知</p>
        <h1 class="question-title">目前最诚实的判断是什么？</h1>
      </section>
      <div class="summary-card">
        <div class="summary-label">已经知道</div>
        <div class="summary-value">你正在经历${esc(listText(d.emotions))}。你观察到了：${esc(listText(d.facts))}。</div>
        <div class="summary-label">仍然未知</div>
        <div class="summary-value">除非对方明确表达，否则情绪变化的具体原因仍然未知。</div>
        <div class="summary-label">责任边界</div>
        <div class="summary-value">你可以为自己的具体行为负责，但不需要负责让对方立即恢复开心。</div>
      </div>
      ${chipGroup("conclusion", COPY.ownershipConclusions, d.conclusion, { multiple: false })}
      ${flowActions({ disabled: !d.conclusion })}`;
  }
  if (state.step === 6) {
    return `
      <section class="question">
        <p class="eyebrow">少做一点，也是一种行动</p>
        <h1 class="question-title">现在真的需要做什么？</h1>
      </section>
      ${chipGroup("action", COPY.ownershipActions, d.action, { multiple: false })}
      ${d.action === "直接确认一次" ? prompt("可以说：你看起来有些不舒服。你想聊聊还是自己待会儿？如果和我有关，可以直接告诉我。<br><br>问完一次以后，不换说法继续确认。", "warm") : ""}
      ${d.action === "为明确行为道歉" ? prompt("可以说：我意识到刚才那句话可能让你不舒服。我想先听听你的感受，不急着为自己辩解。", "warm") : ""}
      ${flowActions({ disabled: !d.action, nextLabel: "生成归属卡" })}`;
  }
  return renderOwnershipSummary();
}

function renderOwnershipSummary() {
  const d = state.draft;
  return `
    <section class="question">
      <p class="eyebrow">把不属于你的部分放回去</p>
      <h1 class="question-title">情绪归属卡</h1>
    </section>
    <div class="summary-card">
      <div class="summary-label">事实</div>
      <div class="summary-value">${esc(listText(d.facts))}${d.factDetail ? `；${esc(d.factDetail)}` : ""}</div>
      <div class="summary-label">我的自动解释</div>
      <div class="summary-value">${esc(listText(d.stories))}${d.storyDetail ? `；${esc(d.storyDetail)}` : ""}</div>
      <div class="summary-label">我的情绪</div>
      <div class="summary-value">${esc(listText(d.emotions))}，强度约${d.intensity ?? 5}/10。</div>
      <div class="summary-label">当前判断</div>
      <div class="summary-value">${esc(d.conclusion || "信息不足")}</div>
      <div class="summary-label">下一步</div>
      <div class="summary-value">${esc(d.action || "暂不行动")}</div>
    </div>
    ${prompt("对方可以有情绪，你也可以暂时不知道原因。未知不等于危险。")}
    <div class="flow-actions">
      <button class="button secondary" type="button" data-action="flow-back">修改</button>
      <button class="button primary" type="button" data-action="save-flow">保存记录</button>
    </div>`;
}

function renderExpressionStep() {
  const d = state.draft;
  if (state.step === 0) {
    return `
      <section class="question">
        <p class="eyebrow">先确定场景</p>
        <h1 class="question-title">你想在谁面前表达什么？</h1>
        <p class="question-help">表达不只包括公开演讲，也包括说出观点、感受、请求和边界。</p>
      </section>
      <label class="field-label">面对谁</label>
      ${chipGroup("audience", COPY.audiences, d.audience, { multiple: false })}
      <label class="field-label">表达什么</label>
      ${chipGroup("expressionKind", COPY.expressionKinds, d.expressionKind, { multiple: false })}
      ${flowActions({ back: false, disabled: !d.audience || !d.expressionKind })}`;
  }
  if (state.step === 1) {
    return `
      <section class="question">
        <p class="eyebrow">不用写得漂亮</p>
        <h1 class="question-title">如果暂时没人评价，你真正想说什么？</h1>
        <p class="question-help">先把内容和“别人会怎么看”分开。</p>
      </section>
      <textarea class="text-area" data-input="rawStatement" placeholder="例如：我对这件事有不同看法。我认为……">${esc(d.rawStatement || "")}</textarea>
      ${prompt("现在只是写给自己看。你可以有立场，也可以保留不确定。")}
      ${flowActions({ disabled: !d.rawStatement?.trim() })}`;
  }
  if (state.step === 2) {
    return `
      <section class="question">
        <p class="eyebrow">想躲起来也有原因</p>
        <h1 class="question-title">你害怕表达后发生什么？</h1>
        <p class="question-help">把模糊的不安全感变成可以观察的具体担忧。</p>
      </section>
      ${chipGroup("fears", COPY.expressionFears, d.fears, { warm: true })}
      <label class="field-label">身体哪里最有反应</label>
      ${chipGroup("bodyAreas", COPY.bodyAreas, d.bodyAreas)}
      <div class="range-wrap">
        <div class="range-row"><strong>表达焦虑</strong><span class="range-value">${d.intensity ?? 6}</span></div>
        <input type="range" min="0" max="10" value="${d.intensity ?? 6}" data-input="intensity" />
      </div>
      ${flowActions({ disabled: !d.fears?.length })}`;
  }
  if (state.step === 3) {
    return `
      <section class="question">
        <p class="eyebrow">区分不适与危险</p>
        <h1 class="question-title">现实风险大约在哪里？</h1>
        <p class="question-help">勇敢不是忽略风险。安全的表达允许你选择时机、对象和暴露程度。</p>
      </section>
      ${chipGroup("safety", COPY.safetyReality, d.safety, { multiple: false })}
      <label class="field-label">什么会让表达更安全一点</label>
      ${chipGroup("expressionSupports", COPY.supportsForExpression, d.expressionSupports)}
      ${d.safety === "当前环境确实不安全，暂不表达" ? prompt("暂不表达也可以是保护自己。你仍然可以在这里保存观点，等环境改变后再决定。", "gold") : ""}
      ${flowActions({ disabled: !d.safety || !d.expressionSupports?.length })}`;
  }
  if (state.step === 4) {
    return `
      <section class="question">
        <p class="eyebrow">表达不是表演</p>
        <h1 class="question-title">你为什么仍然想说？</h1>
        <p class="question-help">找到表达服务的需要，而不是只盯着别人会如何评价。</p>
      </section>
      ${chipGroup("needs", COPY.expressionNeeds, d.needs)}
      ${prompt("你有权表达一个尚未完美的观点。表达的目标可以只是“让我在场”，不必一次说服任何人。", "gold")}
      ${flowActions({ disabled: !d.needs?.length })}`;
  }
  if (state.step === 5) {
    return `
      <section class="question">
        <p class="eyebrow">给观点一个支架</p>
        <h1 class="question-title">把想说的话组织成四部分</h1>
        <p class="question-help">每一栏都可以很短，也可以留空。</p>
      </section>
      <label class="field-label">我的观点或感受</label>
      <textarea class="text-area" data-input="position" placeholder="我认为…… / 我感到……">${esc(d.position || d.rawStatement || "")}</textarea>
      <label class="field-label">我这样想的原因</label>
      <textarea class="text-area" data-input="reason" placeholder="因为我注意到……">${esc(d.reason || "")}</textarea>
      <label class="field-label">我愿意承认的不确定</label>
      <textarea class="text-area" data-input="uncertainty" placeholder="我可能没有考虑完整，但……">${esc(d.uncertainty || "")}</textarea>
      <label class="field-label">我希望对方知道或回应什么</label>
      <textarea class="text-area" data-input="request" placeholder="我希望…… / 你不必同意，我想先说完。">${esc(d.request || "")}</textarea>
      ${flowActions({ disabled: !(d.position || d.rawStatement)?.trim() })}`;
  }
  if (state.step === 6) {
    return `
      <section class="question">
        <p class="eyebrow">安全阶梯</p>
        <h1 class="question-title">这一次，你愿意出现到哪一步？</h1>
        <p class="question-help">选择刚好有一点紧张、但仍然可承受的台阶。不是越高越好。</p>
      </section>
      ${chipGroup("ladderStep", COPY.ladder, d.ladderStep, { multiple: false })}
      ${prompt("如果焦虑是0到10，理想练习台阶大约落在4到6。超过7时，可以退一级。", "gold")}
      ${flowActions({ disabled: !d.ladderStep })}`;
  }
  if (state.step === 7) {
    const statement = buildStatement(d);
    return `
      <section class="question">
        <p class="eyebrow">先排练，再决定</p>
        <h1 class="question-title">读一遍你的表达</h1>
        <p class="question-help">听听它是否像你，而不是是否足够完美。</p>
      </section>
      <div class="statement-preview">${esc(statement)}</div>
      <label class="field-label">读完以后，焦虑现在是多少？</label>
      <div class="range-wrap">
        <div class="range-row"><strong>当前强度</strong><span class="range-value">${d.afterIntensity ?? d.intensity ?? 6}</span></div>
        <input type="range" min="0" max="10" value="${d.afterIntensity ?? d.intensity ?? 6}" data-input="afterIntensity" />
      </div>
      ${Number(d.afterIntensity ?? d.intensity ?? 6) > 7 ? prompt("强度仍然很高。可以退回上一步，选择更低暴露的台阶。退后不是失败，而是在建立可持续的安全感。", "warm") : prompt("你不需要等到完全不紧张才表达。带着可承受的紧张出现，也是一种练习。", "gold")}
      ${flowActions({ nextLabel: "生成表达卡" })}`;
  }
  return renderExpressionSummary();
}

function buildStatement(d) {
  const parts = [];
  if (d.position || d.rawStatement) parts.push((d.position || d.rawStatement).trim());
  if (d.reason?.trim()) parts.push(d.reason.trim());
  if (d.uncertainty?.trim()) parts.push(d.uncertainty.trim());
  if (d.request?.trim()) parts.push(d.request.trim());
  return parts.join(" ");
}

function renderExpressionSummary() {
  const d = state.draft;
  return `
    <section class="question">
      <p class="eyebrow">不必一次暴露全部自己</p>
      <h1 class="question-title">表达练习卡</h1>
    </section>
    <div class="summary-card expression-summary">
      <div class="summary-label">我想面对</div>
      <div class="summary-value">${esc(d.audience || "尚未选择对象")}，${esc(d.expressionKind || "表达自己")}。</div>
      <div class="summary-label">我害怕</div>
      <div class="summary-value">${esc(listText(d.fears))}</div>
      <div class="summary-label">现实风险</div>
      <div class="summary-value">${esc(d.safety || "尚未判断")}</div>
      <div class="summary-label">我的安全台阶</div>
      <div class="summary-value">${esc(d.ladderStep || "只在这里写下来")}</div>
      <div class="summary-label">我准备说</div>
      <div class="statement-preview">${esc(buildStatement(d))}</div>
    </div>
    ${prompt("表达不是向所有人证明你正确，而是允许自己的观点在世界上占一点位置。", "gold")}
    <div class="flow-actions">
      <button class="button secondary" type="button" data-action="flow-back">修改</button>
      <button class="button primary" type="button" data-action="save-flow">保存练习</button>
    </div>`;
}

function saveFlow() {
  const type = state.flow;
  const d = structuredClone(state.draft);
  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    type,
    createdAt: new Date().toISOString(),
    data: d,
    title:
      type === "self"
        ? listText(d.emotions, "一次身体觉察")
        : type === "ownership"
          ? d.conclusion || "一次情绪归属判断"
          : `${d.expressionKind || "表达自我"} · ${d.ladderStep || "练习"}`,
    summary:
      type === "self"
        ? `${listText(d.bodyAreas)}，强度${d.intensity ?? 5}/10；决定：${d.action || "暂不行动"}`
        : type === "ownership"
          ? `当前判断：${d.conclusion || "信息不足"}；决定：${d.action || "暂不行动"}`
          : `面对${d.audience || "他人"}；焦虑${d.afterIntensity ?? d.intensity ?? 6}/10`
  };
  const records = getRecords();
  records.unshift(record);
  writeJSON(STORAGE.records, records);
  showToast("记录已保存在当前设备");
  state.view = "home";
  state.nav = "home";
  state.flow = null;
  state.step = 0;
  state.draft = {};
  setTimeout(render, 420);
}

function renderReview() {
  const records = getRecords().filter((item) => item.type !== "review");
  const today = new Date().toDateString();
  const todayRecords = records.filter((record) => new Date(record.createdAt).toDateString() === today);
  app.innerHTML = `
    <main class="page flow-page">
      <div class="flow-nav">
        <button class="icon-button" type="button" data-action="flow-close">×</button>
        <span class="progress-label">今日回顾</span>
      </div>
      <section class="question">
        <p class="eyebrow">不评分，只观察</p>
        <h1 class="question-title">今天你更早看见自己了吗？</h1>
        <p class="question-help">今天共有${todayRecords.length}条记录。没有记录也可以回顾。</p>
      </section>
      <label class="field-label">今天最早出现的身体信号是什么？</label>
      <textarea class="text-area" data-review-input="bodySignal" placeholder="例如：肩膀变紧、胃部发沉……"></textarea>
      <label class="field-label">哪一刻把别人的情绪揽到了自己身上？</label>
      <textarea class="text-area" data-review-input="ownershipMoment" placeholder="可以写“没有注意到”或“不确定”。"></textarea>
      <label class="field-label">哪一次允许自己出现了一点？</label>
      <textarea class="text-area" data-review-input="expressionMoment" placeholder="写下一句话也算。"></textarea>
      <label class="field-label">明天只想练习哪一件小事？</label>
      <textarea class="text-area" data-review-input="tomorrow" placeholder="例如：想确认关系时先等十分钟。"></textarea>
      ${prompt("目标不是每天表现更好，而是逐渐缩短“情绪发生”和“我看见它”之间的距离。")}
      <div class="flow-actions">
        <button class="button secondary" type="button" data-action="flow-close">取消</button>
        <button class="button primary" type="button" data-action="save-review">保存回顾</button>
      </div>
    </main>`;
}

function renderRecords() {
  state.nav = "records";
  const records = getRecords();
  const typeLabels = { self: "向内看", ownership: "情绪归属", expression: "表达自我", review: "今日回顾" };
  app.innerHTML = `
    <main class="page">
      ${brandTopline()}
      <p class="eyebrow">你的轨迹</p>
      <h1>记录</h1>
      <p class="lead">这些不是成绩，而是你逐渐认识自己时留下的线索。</p>
      ${
        records.length
          ? `<section class="record-list">${records
              .map(
                (record) => `
                  <article class="record-card">
                    <div class="record-meta">
                      <span>${typeLabels[record.type] || "记录"}</span>
                      <span>${new Date(record.createdAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div class="record-title">${esc(record.title)}</div>
                    <p class="record-copy">${esc(record.summary || "已完成一次记录")}</p>
                  </article>`
              )
              .join("")}</section>`
          : `<div class="empty-state">还没有记录。<br />第一次只需要注意到一个身体信号。</div>`
      }
    </main>
    ${navBar("records")}`;
}

function renderTools() {
  state.nav = "tools";
  const tools = [
    {
      id: "body",
      title: "身体感受词库",
      copy: "当你只知道“不舒服”时，从压力、温度、疼痛、能量和运动感开始。",
      detail: `压力：紧、堵、沉、被压住。<br>温度：发热、发冷、发烫、发凉。<br>运动：发抖、跳动、坐立不安。<br>能量：没力气、发软、僵硬、发飘。<br>其他：空、麻、恶心、说不清。`
    },
    {
      id: "emotion",
      title: "情绪词库",
      copy: "不用一次找到最准确的词，先从舒服或不舒服、激活或低落开始。",
      detail: `焦虑：担心、警觉、害怕被拒绝、不确定。<br>愤怒：烦躁、被控制、委屈、不公平。<br>悲伤：失落、孤独、无力、遗憾。<br>羞耻：尴尬、害怕被看低、想躲起来。<br>积极：平静、好奇、期待、满足。`
    },
    {
      id: "needs",
      title: "需要词库",
      copy: "情绪背后可能是安全、自主、理解、尊重、连接、休息或表达。",
      detail: COPY.needs.join("、") + "。<br><br>识别需要，不等于要求眼前的人立刻满足它。"
    },
    {
      id: "ground",
      title: "90秒稳定练习",
      copy: "当身体强度太高，先暂停判断和关系确认。",
      detail: `双脚踩地，慢慢呼气。<br>说出眼前5样东西、身体4处触感、听到的3种声音。<br>告诉自己：“我正在焦虑，但现在不需要立刻解决全部问题。”`
    },
    {
      id: "reassure",
      title: "我又想确认关系了",
      copy: "判断是否出现新事实，避免把反复分析当成解决问题。",
      detail: `1. 有新事实吗？<br>2. 我已经问过一次了吗？<br>3. 如果现在不确认，最难受的感觉是什么？<br>4. 我可以陪这个感觉待十分钟吗？`
    },
    {
      id: "speak",
      title: "表达自我话术",
      copy: "观点不必完美，你也不必一次说服任何人。",
      detail: `表达观点：“我的理解可能不完整，但我目前的看法是……”<br>表达分歧：“我理解你的感受，同时我的判断不太一样。”<br>请求说完：“你不必同意，我想先把这句话说完整。”<br>设立边界：“我愿意继续讨论，但不接受这种表达方式。”`
    }
  ];
  app.innerHTML = `
    <main class="page">
      ${brandTopline()}
      <p class="eyebrow">需要时随时打开</p>
      <h1>工具</h1>
      <p class="lead">不必记住所有词。你可以借用这些提示，再慢慢形成自己的语言。</p>
      <section class="tool-grid">
        ${tools
          .map(
            (tool) => `
              <article class="tool-card">
                <button class="entry-card review" style="padding:0;border:0;box-shadow:none;background:transparent" type="button" data-action="toggle-tool" data-value="${tool.id}">
                  <span class="entry-title">${tool.title}</span>
                  <span class="entry-copy">${tool.copy}</span>
                </button>
                ${state.openTool === tool.id ? `<div class="tool-details">${tool.detail}</div>` : ""}
              </article>`
          )
          .join("")}
      </section>
    </main>
    ${navBar("tools")}`;
}

function renderSettings() {
  state.nav = "settings";
  const settings = getSettings();
  app.innerHTML = `
    <main class="page">
      ${brandTopline()}
      <p class="eyebrow">由你决定节奏</p>
      <h1>设置</h1>
      <section class="tool-grid">
        <article class="setting-card">
          <h3>提示密度</h3>
          <p>详细模式会解释每一步；简洁模式只保留问题与选项。</p>
          <div class="segmented" style="margin-top:14px">
            ${[
              ["detailed", "详细"],
              ["standard", "标准"],
              ["minimal", "简洁"]
            ]
              .map(
                ([value, label]) =>
                  `<button class="segment ${settings.promptDensity === value ? "active" : ""}" type="button" data-action="set-density" data-value="${value}">${label}</button>`
              )
              .join("")}
          </div>
        </article>
        <article class="setting-card">
          <h3>本地数据</h3>
          <p>记录仅保存在当前浏览器。清除浏览器数据前，建议先导出备份。</p>
          <div class="chip-group">
            <button class="chip" type="button" data-action="export-data">导出JSON</button>
            <button class="chip" type="button" data-action="clear-data">清除全部记录</button>
          </div>
        </article>
        <article class="setting-card">
          <h3>关于这个工具</h3>
          <p>情绪归处用于自我觉察与表达练习，不提供医学或心理诊断。如果你感到自己或他人处于即时危险中，请联系当地紧急服务或可信任的人。</p>
        </article>
      </section>
    </main>
    ${navBar("settings")}`;
}

function showToast(message) {
  document.querySelector(".toast")?.remove();
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2400);
}

function toggleChip(key, value, multiple) {
  if (multiple) {
    const current = Array.isArray(state.draft[key]) ? state.draft[key] : [];
    state.draft[key] = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  } else {
    state.draft[key] = state.draft[key] === value ? "" : value;
  }
  render();
}

function saveReview() {
  const data = {};
  document.querySelectorAll("[data-review-input]").forEach((input) => {
    data[input.dataset.reviewInput] = input.value.trim();
  });
  const record = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    type: "review",
    createdAt: new Date().toISOString(),
    data,
    title: "今天，我回头看了一眼",
    summary: data.tomorrow ? `明天练习：${data.tomorrow}` : "完成一次不评判的回顾"
  };
  const records = getRecords();
  records.unshift(record);
  writeJSON(STORAGE.records, records);
  state.view = "home";
  state.nav = "home";
  showToast("今日回顾已保存");
  setTimeout(render, 350);
}

function exportData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: "情绪归处",
    settings: getSettings(),
    records: getRecords()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `情绪归处-记录-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("记录已导出");
}

function clearData() {
  if (!window.confirm("确定清除当前设备上的全部记录吗？此操作无法撤销。")) return;
  writeJSON(STORAGE.records, []);
  showToast("全部记录已清除");
  render();
}

function currentStepIsValid() {
  const d = state.draft;
  if (state.flow === "ownership" && state.step === 0) return Boolean(d.facts?.length || d.factDetail?.trim());
  if (state.flow === "ownership" && state.step === 1) return Boolean(d.stories?.length || d.storyDetail?.trim());
  if (state.flow === "expression" && state.step === 1) return Boolean(d.rawStatement?.trim());
  if (state.flow === "expression" && state.step === 5) return Boolean((d.position || d.rawStatement)?.trim());
  return true;
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "onboarding-next") {
    if (state.onboardingStep < 2) state.onboardingStep += 1;
    else {
      localStorage.setItem(STORAGE.onboarded, "1");
      state.view = "home";
    }
    return render();
  }

  if (action === "set-density") {
    writeJSON(STORAGE.settings, { ...getSettings(), promptDensity: target.dataset.value });
    document.querySelectorAll(".segment").forEach((button) => button.classList.toggle("active", button.dataset.value === target.dataset.value));
    return;
  }

  if (action === "nav") {
    state.view = target.dataset.view;
    state.nav = target.dataset.view;
    return render();
  }

  if (action === "start-flow") return startFlow(target.dataset.flow);
  if (action === "open-review") {
    state.view = "review";
    return render();
  }

  if (action === "flow-close") {
    state.view = "home";
    state.nav = "home";
    state.flow = null;
    state.step = 0;
    state.draft = {};
    return render();
  }

  if (action === "flow-next") {
    state.step += 1;
    return render();
  }

  if (action === "flow-back") {
    state.step = Math.max(0, state.step - 1);
    return render();
  }

  if (action === "toggle-chip") {
    return toggleChip(target.dataset.key, target.dataset.value, target.dataset.multiple === "true");
  }

  if (action === "save-flow") return saveFlow();
  if (action === "save-review") return saveReview();

  if (action === "cooldown-choice") {
    if (target.dataset.value === "anxiety") return startFlow("self", { event: "我没有获得新事实，但再次担心别人的情绪与我有关。" });
    return startFlow("ownership", { skipCooldown: true });
  }

  if (action === "toggle-tool") {
    state.openTool = state.openTool === target.dataset.value ? null : target.dataset.value;
    return render();
  }

  if (action === "export-data") return exportData();
  if (action === "clear-data") return clearData();
});

app.addEventListener("input", (event) => {
  const input = event.target;
  if (!input.dataset.input) return;
  const key = input.dataset.input;
  const value = input.type === "range" ? Number(input.value) : input.value;
  state.draft[key] = value;
  if (input.type === "range") {
    input.closest(".range-wrap")?.querySelector(".range-value")?.replaceChildren(String(value));
  }
  const nextButton = document.querySelector('[data-action="flow-next"]');
  if (nextButton) nextButton.disabled = !currentStepIsValid();
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

render();
