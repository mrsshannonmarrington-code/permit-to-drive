/* Permit to Drive - Maryland learner's permit practice app (static, no build step) */
(function(){
'use strict';
const BANK = (window.PTD_BANK||[]);
const EXAM_LEN = 25, PASS = 22, EXAM_MIN = 20, CAT_CAP = 4;
const LS = 'ptd.v28';

const TOPICS = [
  {key:'signs', name:'Traffic Signs', cats:['Signs','Signals','Road markings'], icon:'stop', quota:7},
  {key:'rules', name:'Rules of the Road', cats:['Maryland','Impairment','Speed'], icon:'road', quota:5},
  {key:'inter', name:'Intersections', cats:['Right-of-way','Turns','Rail'], icon:'cross', quota:5},
  {key:'pass', name:'Passing & Merging', cats:['Space','Vehicle control','Sharing'], icon:'cars', quota:4},
  {key:'safe', name:'Safe Driving', cats:['Awareness','Weather','Emergencies','Work zones'], icon:'shield', quota:3},
  {key:'park', name:'Parking', cats:['Parking'], icon:'park', quota:1},
];
const topicOf = c => TOPICS.find(t=>t.cats.includes(c)) || TOPICS[4];

/* ---------- icons ---------- */
const I = {
  stop:'<svg viewBox="0 0 64 64"><polygon points="20,4 44,4 60,20 60,44 44,60 20,60 4,44 4,20" fill="#e5302b" stroke="#fff" stroke-width="4"/><text x="32" y="39" font-family="Arial Black,Arial" font-weight="900" font-size="15" fill="#fff" text-anchor="middle">STOP</text></svg>',
  road:'<svg viewBox="0 0 64 64"><path d="M22 4h20l14 56H8z" fill="#3b4255" stroke="#ffc928" stroke-width="3"/><path d="M32 8v8M32 24v8M32 40v8" stroke="#ffc928" stroke-width="4" stroke-linecap="round"/></svg>',
  cross:'<svg viewBox="0 0 64 64"><path d="M24 4h16v20h20v16H40v20H24V40H4V24h20z" fill="#ffc928" stroke="#a86f00" stroke-width="3"/><path d="M32 10v44M10 32h44" stroke="#13204a" stroke-width="3" stroke-dasharray="5 5"/></svg>',
  cars:'<svg viewBox="0 0 64 64"><rect x="4" y="26" width="28" height="14" rx="5" fill="#ffc928"/><path d="M9 26l5-9h10l5 9" fill="#ffe58a"/><circle cx="11" cy="41" r="4" fill="#13204a"/><circle cx="25" cy="41" r="4" fill="#13204a"/><rect x="32" y="30" width="28" height="14" rx="5" fill="#4aa3ff"/><path d="M37 30l5-9h10l5 9" fill="#bfe0ff"/><circle cx="39" cy="45" r="4" fill="#13204a"/><circle cx="53" cy="45" r="4" fill="#13204a"/></svg>',
  shield:'<svg viewBox="0 0 64 64"><path d="M32 4l24 9v17c0 15-10 26-24 30C18 56 8 45 8 30V13z" fill="#2fb84f" stroke="#fff" stroke-width="3"/><path d="M20 32l8 8 16-17" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  park:'<svg viewBox="0 0 64 64"><rect x="6" y="6" width="52" height="52" rx="10" fill="#1f5fd6" stroke="#fff" stroke-width="4"/><text x="32" y="46" font-family="Arial Black,Arial" font-weight="900" font-size="36" fill="#fff" text-anchor="middle">P</text></svg>',
  clip:'<svg viewBox="0 0 64 64"><rect x="10" y="8" width="40" height="50" rx="5" fill="#fff" stroke="#ffc928" stroke-width="3"/><rect x="22" y="4" width="16" height="10" rx="3" fill="#ffc928"/><path d="M17 26l4 4 7-8M17 40l4 4 7-8" stroke="#2fb84f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M32 27h12M32 41h12" stroke="#13204a" stroke-width="3"/><path d="M44 50l12-26 4 2-12 26-6 4z" fill="#ffc928" stroke="#a86f00" stroke-width="2"/></svg>',
  book:'<svg viewBox="0 0 64 64"><path d="M4 14c10-4 20-4 28 2 8-6 18-6 28-2v38c-10-4-20-4-28 2-8-6-18-6-28-2z" fill="#fff" stroke="#ffc928" stroke-width="3"/><path d="M32 16v38" stroke="#13204a" stroke-width="2"/><path d="M10 24h16M10 32h16M38 24h16M38 32h16" stroke="#9fb3e0" stroke-width="2"/></svg>',
  watch:'<svg viewBox="0 0 64 64"><circle cx="32" cy="36" r="24" fill="#fff" stroke="#ffc928" stroke-width="5"/><rect x="26" y="2" width="12" height="8" rx="2" fill="#ffc928"/><path d="M32 36V20M32 36l10 6" stroke="#13204a" stroke-width="4" stroke-linecap="round"/></svg>',
  back:'<svg class="icon" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play:'<svg class="icon" viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="#13204a"/></svg>',
  chart:'<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="13" width="4" height="8" fill="#ffc928"/><rect x="10" y="8" width="4" height="13" fill="#ffc928"/><rect x="17" y="3" width="4" height="18" fill="#ffc928"/></svg>',
  gear:'<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>',
  sbook:'<svg class="icon" viewBox="0 0 24 24"><path d="M2 5c4-1.5 7-1.5 10 1 3-2.5 6-2.5 10-1v14c-4-1.5-7-1.5-10 1-3-2.5-6-2.5-10-1z" fill="#fff"/><path d="M12 6v14" stroke="#13204a" stroke-width="1.5"/></svg>',
  warn:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 2l11 20H1z" fill="#ffc928" stroke="#a86f00"/><path d="M12 9v6M12 18v1" stroke="#13204a" stroke-width="2.5" stroke-linecap="round"/></svg>',
  scale:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 3v18M5 21h14M4 7h16M4 7l-3 7h6zM20 7l-3 7h6z" fill="none" stroke="#ffc928" stroke-width="2" stroke-linejoin="round"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow:'<svg viewBox="0 0 24 24"><path d="M4 12h14M12 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  okc:'<svg viewBox="0 0 24 24" width="30" height="30"><path d="M4 12l5 5L20 6" fill="none" stroke="#1d8f39" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  noc:'<svg viewBox="0 0 24 24" width="30" height="30"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="#a91c18" stroke-width="4" stroke-linecap="round"/></svg>',
  hint:'<svg class="icon" viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-4 12.7V18h8v-3.3A7 7 0 0012 2z" fill="#ffc928"/><rect x="9" y="19" width="6" height="3" rx="1" fill="#fff"/></svg>',
};

/* ---------- storage ---------- */
const store = {
  load(){ try{ return JSON.parse(localStorage.getItem(LS))||{}; }catch(e){ return {}; } },
  save(s){ try{ localStorage.setItem(LS, JSON.stringify(s)); }catch(e){} }
};
let S = Object.assign({stats:{}, history:[], settings:{practiceTimer:false, sound:false}, current:null}, store.load());
const persist = () => store.save(S);

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const LET = ['A','B','C','D'];
const pool = () => BANK.filter(q=>q.img);
const byId = id => BANK.find(q=>q.id===id);
const errRate = cat => { const s=S.stats[cat]; if(!s||!s.seen) return .5; return 1 - s.right/s.seen; };

/* Draw up to n questions honoring concept-group uniqueness and a per-category cap. */
function draw(cands, n, weightFn, used){
  used = used || {groups:new Set(), cats:{}, ids:new Set()};
  const out=[]; let list = cands.filter(q=>!used.ids.has(q.id));
  while(out.length<n && list.length){
    let pick;
    if(weightFn){
      const w = list.map(weightFn), tot = w.reduce((a,b)=>a+b,0); let r=Math.random()*tot, i=0;
      for(;i<list.length;i++){ r-=w[i]; if(r<=0) break; } pick=list[Math.min(i,list.length-1)];
    } else pick = list[Math.floor(Math.random()*list.length)];
    list = list.filter(q=>q!==pick);
    if(used.groups.has(pick.concept_group)) continue;
    if((used.cats[pick.category]||0) >= CAT_CAP) continue;
    used.groups.add(pick.concept_group); used.ids.add(pick.id); used.cats[pick.category]=(used.cats[pick.category]||0)+1;
    out.push(pick);
  }
  return out;
}

function buildTest(mode, topicKey){
  const P = pool(); let qs=[];
  if(mode==='exam'){
    const used={groups:new Set(),cats:{},ids:new Set()};
    TOPICS.forEach(t=>{ qs = qs.concat(draw(P.filter(q=>t.cats.includes(q.category)), t.quota, null, used)); });
    if(qs.length<EXAM_LEN) qs = qs.concat(draw(P, EXAM_LEN-qs.length, null, used));
    if(qs.length<EXAM_LEN){ used.cats={}; qs = qs.concat(draw(P, EXAM_LEN-qs.length, null, used)); }
    qs = shuffle(qs);
  } else if(mode==='practice'){
    const seen = S.seen||{};
    qs = draw(P, EXAM_LEN, q => 1 + 3*errRate(q.category) + (seen[q.id]?0:0.6));
    if(qs.length<EXAM_LEN){ const used={groups:new Set(qs.map(q=>q.concept_group)),cats:{},ids:new Set(qs.map(q=>q.id))}; qs=qs.concat(draw(P,EXAM_LEN-qs.length,null,used)); }
  } else {
    const t = TOPICS.find(t=>t.key===topicKey);
    const used={groups:new Set(),cats:{},ids:new Set()}; used.cats=new Proxy({}, {get:()=>0}); // no category cap in study
    qs = draw(P.filter(q=>t.cats.includes(q.category)), 10, q=>1+3*errRate(q.category), used);
  }
  return {
    mode, topicKey: topicKey||null,
    items: qs.map(q=>({id:q.id, order:shuffle(q.choices), picked:null, hinted:null})),
    idx:0, started:Date.now(),
    deadline: (mode==='exam' || (mode==='practice' && S.settings.practiceTimer)) ? Date.now()+EXAM_MIN*60000 : null,
    done:false
  };
}

/* ---------- rendering ---------- */
const app = $('#app'), modal = $('#modal');
let timerHandle=null;
function go(screen, arg){ closeModal(); clearInterval(timerHandle); window.scrollTo(0,0); (SCREENS[screen]||SCREENS.home)(arg); }
function topbar(title, back='home'){ return `<div class="topbar"><button class="back" data-go="${back}" aria-label="Back">${I.back}</button><div class="title-pill" role="heading" aria-level="1">${title}</div><img class="mini-coach" src="ui/coach_happy.webp" alt=""></div>`; }

const SCREENS = {
home(){
  const resume = S.current && !S.current.done;
  const nImg = pool().length;
  app.innerHTML = `<div class="home-bg"></div><main class="screen"><section class="home">
    <div class="home-hero"><img class="logo" src="ui/logo.webp" alt="Permit to Drive"><img class="coach" src="ui/coach_happy.webp" alt="Coach, your blue car helper, waving hello"></div>
    <div class="home-menu panel" style="padding:22px">
      <h1>Maryland Driver's<br>Knowledge Test</h1>
      <p class="sub">Practice Test</p>
      ${resume?`<button class="btn-gold" data-act="resume">${I.play} Resume Test (${S.current.idx+1} of ${S.current.items.length})</button>`:''}
      <button class="btn-gold" data-go="modes" ${resume?'style="filter:saturate(.85)"':''}>${I.play} Start Practice Test</button>
      <button class="btn-navy" data-go="topics">${I.sbook} Study by Topic</button>
      <button class="btn-navy" data-study="signs">${I.warn} Road Signs</button>
      <button class="btn-navy" data-study="rules">${I.scale} MD Rules &amp; Laws</button>
      <div class="home-dock">
        <button class="dock-btn" data-go="topics">${I.sbook}Study</button>
        <button class="dock-btn" data-go="progress">${I.chart}Progress</button>
        <button class="dock-btn" data-go="settings">${I.gear}Settings</button>
      </div>
      <p class="facts">25 questions &middot; 20 minutes &middot; pass with 22 correct (88%) &middot; ${nImg} illustrated questions</p>
    </div></section></main>`;
},
modes(){
  app.innerHTML = `<div class="home-bg"></div><main class="screen">${topbar('Choose Your Test Mode')}
  <div class="modes">
    <button class="mode" data-start="practice">${I.clip}<div><h3>Practice Test</h3><div class="k">25 questions &middot; untimed</div><p>Coach gives feedback after every answer and steers you toward topics you miss most.</p></div></button>
    <button class="mode" data-go="topics">${I.book}<div><h3>Study Mode</h3><div class="k">By topic</div><p>Pick one topic and work through up to 10 questions with full explanations.</p></div></button>
    <button class="mode" data-start="exam">${I.watch}<div><h3>Exam Mode</h3><div class="k">Timed &middot; 20 minutes</div><p>Just like the MVA test: 25 questions, results at the end, 22 correct to pass.</p></div></button>
  </div></main>`;
},
topics(){
  const P=pool();
  app.innerHTML = `<div class="home-bg"></div><main class="screen">${topbar('Select a Topic')}
  <div class="topics">${TOPICS.map(t=>{const n=P.filter(q=>t.cats.includes(q.category)).length; return `<button class="topic" data-study="${t.key}" ${n?'':'disabled style="opacity:.5"'}>${I[t.icon]}${t.name}<small>${n} question${n===1?'':'s'}</small></button>`;}).join('')}</div></main>`;
},
quiz(){
  const T=S.current; if(!T){ return go('home'); }
  const it=T.items[T.idx], q=byId(it.id), total=T.items.length, t=topicOf(q.category);
  const exam = T.mode==='exam';
  app.innerHTML = `<main class="screen">
   <div class="qbar">
     <button class="back" data-act="quit" aria-label="Quit test">${I.back}</button>
     <span class="pill qcount">Question <b>${T.idx+1}</b> of ${total}</span>
     <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${T.idx}"><i style="width:${(T.idx/total)*100}%"></i></div>
     ${T.deadline?`<span class="pill timer" id="timer" aria-label="Time remaining">--:--</span>`:''}
     <span class="pill">${esc(q.category)}</span>
   </div>
   <div class="stage"><img class="scene" src="${q.img}" alt="Driver's-eye scene for this question"><img class="coach-q" src="ui/coach_happy.webp" alt=""></div>
   <div class="qtext">${esc(q.question)}</div>
   <div class="qarea">
     <div class="side">
       ${!exam?`<button class="dock-btn" data-act="hint" ${it.hinted!==null||it.picked!==null&&it.locked?'disabled':''}>${I.hint}Coach Hint</button>`:''}
       <button class="dock-btn" data-go="progress-from-quiz">${I.chart}Progress</button>
     </div>
     <div class="answers" role="radiogroup" aria-label="Answer choices">
      ${it.order.map((c,i)=>`<button class="ans ${it.picked===c?'sel':''}" role="radio" aria-checked="${it.picked===c}" data-pick="${i}" ${it.hinted===c?'disabled style="opacity:.35;text-decoration:line-through"':''}><span class="L">${LET[i]}</span><span>${esc(c)}</span></button>`).join('')}
     </div>
     <button class="btn-green" id="check" data-act="check" ${it.picked===null?'disabled':''}>${exam?I.arrow:I.check}<span>${exam?(T.idx+1===total?'FINISH':'NEXT'):'CHECK ANSWER'}</span></button>
   </div></main>`;
  if(T.deadline) startTimer();
},
results(){
  const T=S.current; if(!T) return go('home');
  const total=T.items.length, right=T.items.filter(it=>it.picked===byId(it.id).answer).length;
  const pct=Math.round(right/total*100), isTest = T.mode!=='study', pass = isTest ? (total===EXAM_LEN ? right>=PASS : pct>=88) : pct>=88;
  const cats={}; T.items.forEach(it=>{const q=byId(it.id),k=topicOf(q.category).name; cats[k]=cats[k]||{n:0,r:0}; cats[k].n++; if(it.picked===q.answer) cats[k].r++;});
  const label = T.mode==='exam'?'Exam Mode':T.mode==='practice'?'Practice Test':'Study: '+TOPICS.find(t=>t.key===T.topicKey).name;
  app.innerHTML = `<div class="fireworks"></div><main class="screen"><section class="results">
    <span class="pill" style="font-size:1.4rem">${T.timedOut?'Time is up! ':''}${isTest?'Test Complete!':'Study Set Complete!'}</span>
    <div class="big ${pass?'pass':'fail'}">${pass?'PASSED!':'NOT YET'}</div>
    <div class="res-row"><img src="ui/${pass?'coach_party':'coach_oops'}.webp" alt=""><div class="score">Your Score:<b>${right} of ${total}</b>(${pct}%)</div></div>
    <p class="note panel" style="max-width:620px;padding:10px 18px;color:#fff">${label}. ${pass?'Great driving. Keep practicing to stay sharp.':`You need ${total===EXAM_LEN?PASS+' correct':'88%'} to pass. Review the questions you missed, then try again.`}</p>
    <div class="breakdown">${Object.entries(cats).map(([k,v])=>`<div class="bd">${k}<span>${v.r}/${v.n}</span></div>`).join('')}</div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-top:8px">
      <button class="btn-gold" data-act="review">Review Answers</button>
      <button class="btn-gold" data-again="1">Take Another Test</button>
      <button class="btn-navy" data-go="home">Home</button>
    </div>
    <div id="review" class="review" hidden></div>
  </section></main>`;
},
progress(fromQuiz){
  const h=S.history, best=h.reduce((m,x)=>Math.max(m,x.right/x.total),0), passes=h.filter(x=>x.pass).length;
  const cats=Object.keys(S.stats).sort();
  app.innerHTML = `<div class="home-bg"></div><main class="screen">${topbar('My Progress', fromQuiz?'quiz':'home')}
   <div class="cards">
     <div class="card"><h3>Tests taken</h3><div class="n">${h.length}</div></div>
     <div class="card"><h3>Passed</h3><div class="n">${passes}</div></div>
     <div class="card"><h3>Best score</h3><div class="n">${h.length?Math.round(best*100)+'%':'--'}</div></div>
     <div class="card"><h3>Questions seen</h3><div class="n">${Object.keys(S.seen||{}).length} / ${pool().length}</div></div>
   </div>
   <h2 class="h2s">Accuracy by category</h2>
   ${cats.length?`<div class="cards">${cats.map(c=>{const s=S.stats[c],p=Math.round(s.right/s.seen*100);return `<div class="card"><h3>${esc(c)}</h3>${s.right} of ${s.seen} correct (${p}%)<div class="bar"><i style="width:${p}%;background:${p>=88?'var(--green)':p>=60?'var(--gold)':'var(--red)'}"></i></div></div>`;}).join('')}</div>`:'<p class="note">Answer a few questions and your category accuracy will appear here.</p>'}
   ${h.length?`<h2 class="h2s">Recent tests</h2>${h.slice(-8).reverse().map(x=>`<div class="row"><span>${new Date(x.date).toLocaleDateString()} &middot; ${x.mode==='exam'?'Exam':x.mode==='practice'?'Practice':'Study'}</span><span style="color:${x.pass?'#7dff98':'#ff9b91'}">${x.right}/${x.total} ${x.pass?'PASS':'FAIL'}</span></div>`).join('')}`:''}
   <p class="note" style="margin-top:14px">Progress is saved only on this device.</p></main>`;
},
settings(){
  app.innerHTML = `<div class="home-bg"></div><main class="screen">${topbar('Settings')}
   <div class="row"><span>20-minute timer in Practice Test</span><button class="switch" role="switch" aria-checked="${S.settings.practiceTimer}" data-act="toggleTimer" aria-label="Practice timer"></button></div>
   <div class="row"><span>Reset all saved progress</span><button class="btn-navy" data-act="reset">Reset</button></div>
   <div class="panel" style="padding:18px;margin-top:12px"><p class="note" style="margin:0">Questions follow the <a href="https://mva.maryland.gov/media/148/download" target="_blank" rel="noopener">Maryland Driver's Manual</a>. The real MVA knowledge test has 25 questions, a 20-minute limit, and requires 88% to pass, per the <a href="https://mva.maryland.gov/licenses-ids/prepare-drivers-license-test/knowledge-tests" target="_blank" rel="noopener">MVA knowledge test page</a>. This app is a study aid and is not affiliated with the MVA.</p></div>
  </main>`;
},
};
SCREENS['progress-from-quiz']=()=>SCREENS.progress(true);

function startTimer(){
  const el=$('#timer'); const T=S.current;
  const tick=()=>{ const ms=T.deadline-Date.now(); if(ms<=0){ clearInterval(timerHandle); T.timedOut=true; finish(); return; }
    const m=Math.floor(ms/60000), s=Math.floor(ms/1000)%60; if(el){ el.textContent=`${m}:${String(s).padStart(2,'0')}`; el.classList.toggle('low', ms<120000);} };
  tick(); timerHandle=setInterval(tick,500);
}

function record(q, ok){
  const s=S.stats[q.category]=S.stats[q.category]||{seen:0,right:0}; s.seen++; if(ok) s.right++;
  S.seen=S.seen||{}; S.seen[q.id]=1;
}
function finish(){
  const T=S.current; T.done=true;
  if(T.mode==='exam'){ T.items.forEach(it=>{ const q=byId(it.id); record(q, it.picked===q.answer); }); }
  const right=T.items.filter(it=>it.picked===byId(it.id).answer).length, total=T.items.length;
  S.history.push({date:Date.now(), mode:T.mode, right, total, pass: total===EXAM_LEN ? right>=PASS : right/total>=.88});
  S.history=S.history.slice(-50); persist(); go('results');
}

function feedback(it, q){
  const ok = it.picked===q.answer, letter = LET[it.order.indexOf(q.answer)];
  modal.innerHTML = `<div class="fb" role="dialog" aria-modal="true" aria-labelledby="fbh">
   <div class="fb-head"><img src="ui/${ok?'coach_thumbs':'coach_oops'}.webp" alt=""><span id="fbh" class="badge ${ok?'ok':'no'}"><span class="ic">${ok?I.okc:I.noc}</span>${ok?'Correct!':'Incorrect!'}</span></div>
   <div class="fb-body"><img src="${q.img}" alt="">
    <div>${ok?`<span class="ca">That's Right!</span>`:`<span class="ca">Correct Answer: ${letter}</span><p><b>${esc(q.answer)}</b></p>`}
     <h4>Explanation:</h4><p>${esc(q.explanation)}</p>
     <p class="ref" id="ref" hidden>Maryland Driver's Manual: ${esc(q.manual_ref||'')}</p></div></div>
   <div class="fb-actions"><button class="btn-gold" data-act="rule">${I.sbook} Manual Reference</button><button class="btn-gold" data-act="next">Next Question ${I.play}</button></div></div>`;
  modal.hidden=false; modal.querySelector('[data-act=next]').focus();
}
function closeModal(){ modal.hidden=true; modal.innerHTML=''; }

function next(){
  const T=S.current; closeModal();
  if(T.idx+1>=T.items.length) return finish();
  T.idx++; persist(); go('quiz');
}

/* ---------- events ---------- */
document.addEventListener('click', e=>{
  const b=e.target.closest('button'); if(!b||b.disabled) return;
  const d=b.dataset;
  if(d.go) return go(d.go);
  if(d.start){ S.current=buildTest(d.start); persist(); return go('quiz'); }
  if(d.study){ S.current=buildTest('study', d.study); if(!S.current.items.length){ S.current=null; return go('topics'); } persist(); return go('quiz'); }
  if(d.again){ const m=S.current?S.current.mode:'practice', k=S.current&&S.current.topicKey; S.current=buildTest(m,k); persist(); return go('quiz'); }
  if(d.pick!==undefined){
    const T=S.current, it=T.items[T.idx]; if(it.locked) return;
    it.picked=it.order[+d.pick]; persist();
    document.querySelectorAll('.ans').forEach((x,i)=>{ x.classList.toggle('sel', i===+d.pick); x.setAttribute('aria-checked', i===+d.pick); });
    $('#check').disabled=false; return;
  }
  switch(d.act){
    case 'resume': return go('quiz');
    case 'check': {
      const T=S.current, it=T.items[T.idx], q=byId(it.id); if(it.picked===null) return;
      if(T.mode==='exam') return next();
      if(!it.locked){ it.locked=true; record(q, it.picked===q.answer); persist(); }
      document.querySelectorAll('.ans').forEach((x,i)=>{ const c=it.order[i]; if(c===q.answer) x.classList.add('right'); else if(c===it.picked) x.classList.add('wrong'); });
      return feedback(it,q);
    }
    case 'hint': {
      const T=S.current, it=T.items[T.idx], q=byId(it.id);
      const wrong=it.order.filter(c=>c!==q.answer && c!==it.picked); it.hinted=wrong[Math.floor(Math.random()*wrong.length)]; persist(); return go('quiz');
    }
    case 'rule': { const r=$('#ref'); if(r) r.hidden=!r.hidden; return; }
    case 'next': return next();
    case 'quit': {
      modal.innerHTML=`<div class="fb" role="dialog" aria-modal="true"><div class="fb-head"><img src="ui/coach_oops.webp" alt=""><span class="badge no" style="font-size:1.6rem">Leave this test?</span></div><p>Your place is saved. You can resume it from the home screen.</p><div class="fb-actions"><button class="btn-navy" data-act="close">Keep Going</button><button class="btn-gold" data-go="home">Go Home</button></div></div>`;
      modal.hidden=false; return;
    }
    case 'close': return closeModal();
    case 'review': {
      const r=$('#review'), T=S.current; r.hidden=!r.hidden;
      if(!r.innerHTML) r.innerHTML=T.items.map((it,i)=>{const q=byId(it.id),ok=it.picked===q.answer;return `<div class="rv ${ok?'good':'bad'}"><img src="${q.img}" alt=""><div><h5>${i+1}. ${esc(q.question)}</h5><p>Your answer: <b style="color:${ok?'#7dff98':'#ff9b91'}">${esc(it.picked||'No answer')}</b></p>${ok?'':`<p>Correct answer: <b style="color:#7dff98">${esc(q.answer)}</b></p>`}<p>${esc(q.explanation)}</p><p class="ref">Manual: ${esc(q.manual_ref||'')}</p></div></div>`;}).join('');
      if(!r.hidden) r.scrollIntoView({behavior:'smooth'}); return;
    }
    case 'toggleTimer': S.settings.practiceTimer=!S.settings.practiceTimer; persist(); return go('settings');
    case 'reset': S={stats:{},history:[],settings:S.settings,current:null,seen:{}}; persist(); return go('progress');
  }
});
modal.addEventListener('click', e=>{ if(e.target===modal && S.current && S.current.items[S.current.idx]?.locked===undefined) closeModal(); });
document.addEventListener('keydown', e=>{
  if(!S.current || !$('.answers')) return;
  if(!modal.hidden){ if(e.key==='Enter'){ const n=modal.querySelector('[data-act=next]'); if(n){ e.preventDefault(); n.click(); } } return; }
  const k=e.key.toUpperCase(), i= '1234'.indexOf(k)>=0 ? '1234'.indexOf(k) : LET.indexOf(k);
  if(i>=0){ const b=document.querySelector(`[data-pick="${i}"]`); if(b && !b.disabled) b.click(); }
  if(e.key==='Enter'){ const c=$('#check'); if(c && !c.disabled){ e.preventDefault(); c.click(); } }
});

window.PTD = {buildTest, draw, pool, TOPICS, PASS, EXAM_LEN};
go('home');
})();
