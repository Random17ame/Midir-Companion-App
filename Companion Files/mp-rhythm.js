/* Companion 119 — Melodic Puppeteer rhythm / Cutting Chorus practice. Offline only. */
(function(){'use strict';
const KEY='midir-mp-rhythm-v1';
const state={mobileAimId:null,actionReadyAt:{},link:true,hard:false,black:'2',running:false,finished:false,runStart:0,elapsed:0,notes:[],nextWhite:0,nextBlack:0,spawnIndex:0,score:0,hit:0,miss:0,chorus:0,combo:0,bestCombo:0,lastWhite:[],mouse:{x:-1000,y:-1000},result:'',binding:false,frame:0,ready:true,lastPlaced:null,travelAngle:0};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object'){state.link=saved.link!==false;state.hard=!!saved.hard;if(typeof saved.black==='string'&&saved.black.length<=24)state.black=saved.black;}}catch{}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify({link:state.link,hard:state.hard,black:state.black}))}catch{}}
function label(k){return k===' '?'Space':k==='ArrowUp'?'↑':k==='ArrowDown'?'↓':k==='ArrowLeft'?'←':k==='ArrowRight'?'→':k;}
const whiteBeat=900,approach=1300,windowMs=190,duration=60000;
// Rotation Highlights minimum cooldown floors are used for recognized skills.
// Melodic Puppeteer imposes a provisional +3s cooldown on numbered Puppet Acts.
// The exact in-game Act penalty still needs verification; no user-facing toggle.
// Unknown cooldowns for other base Puppet skills remain provisional, not verified.
const MP_MIN_CD={downbeat:4,tempo:10,wire:10,show:45,act2:0,act4:0,act6:0,act7:0};
const MP_FALLBACK_CD={act1:0,act9:0,snare:0,control:0};
function skillCooldownSeconds(skill){
 if(skill.id==='chorus')return notesInterval()/1000;
 const floor=Object.hasOwn(MP_MIN_CD,skill.id)?MP_MIN_CD[skill.id]:MP_FALLBACK_CD[skill.id]??0;
 return floor+(skill.kind==='puppet'&&/^act\d+$/.test(skill.id)?3:0);
}
const TOUCH_SKILLS=[
 {id:'downbeat',name:'Downbeat Drop',key:'touch-mp-downbeat',kind:'mp'},
 {id:'tempo',name:'Relentless Tempo',key:'touch-mp-tempo',kind:'mp'},
 {id:'wire',name:'Live Wire',key:'touch-mp-wire',kind:'mp'},
 {id:'show',name:'Showstopper',key:'touch-mp-show',kind:'mp'},
 {id:'act1',name:'Act 1: Inciting Incident',key:'touch-puppet-1',kind:'puppet'},
 {id:'act2',name:'Act 2: Threshold Cutter',key:'touch-puppet-2',kind:'puppet'},
 {id:'act4',name:'Act 4: Rising Action',key:'touch-puppet-4',kind:'puppet'},
 {id:'act6',name:'Act 6: Crisis',key:'touch-puppet-6',kind:'puppet'},
 {id:'act7',name:'Act 7: Climactic Crash',key:'touch-puppet-7',kind:'puppet'},
 {id:'act9',name:'Act 9: Invigorating Encore',key:'touch-puppet-9',kind:'puppet'},
 {id:'snare',name:"Puppet's Snare",key:'touch-puppet-snare',kind:'puppet'},
 {id:'control',name:'Control Marionette',key:'touch-puppet-control',kind:'puppet'}
];
const TOUCH_BY_KEY=Object.fromEntries(TOUCH_SKILLS.map(s=>[s.key,s]));
function skillIcon(name){const src=window.MIDIR_ROTATION_ICONS?.[name];return src?`<img src="${esc(src)}" alt="" loading="lazy">`:''}
function touchPanel(){return `<div class="mp-touch-keys" aria-label="Mobile skill trigger controls"><p class="mp-touch-hint">Aim on the field · tap a skill to trigger</p><div class="mp-touch-keys-row">${TOUCH_SKILLS.filter(s=>s.kind==='mp').map(skillButton).join('')}</div><div class="mp-touch-keys-row">${TOUCH_SKILLS.filter(s=>s.kind==='puppet').map(skillButton).join('')}</div><div class="mp-touch-keys-row mp-touch-chorus-row">${skillButton({id:'chorus',name:'Cutting Chorus',key:'chorus',kind:'chorus'})}</div></div>`}
function skillButton(s){return `<button type="button" data-mp-skill="${s.key}" class="mp-touch-skill ${s.kind==='chorus'?'mp-touch-black':'mp-touch-white'}" aria-label="Trigger ${esc(s.name)}" title="${esc(s.name)}">${skillIcon(s.name)}<span class="mp-touch-skill-name">${esc(s.name)}</span><span class="mp-touch-skill-cd" data-mp-cd="${s.key}">Ready</span></button>`}
function refreshTouchCooldowns(){const root=document.getElementById('mp-rhythm-root');if(!root)return;root.querySelectorAll('[data-mp-skill]').forEach(btn=>{const key=btn.dataset.mpSkill;const remain=Math.max(0,(state.actionReadyAt?.[key]||0)-state.elapsed);const text=btn.querySelector('[data-mp-cd]');if(text)text.textContent=remain>0?`${(remain/1000).toFixed(1)}s`:'Ready';btn.classList.toggle('on-cooldown',remain>0);btn.setAttribute('aria-disabled',remain>0?'true':'false')})}
function notesInterval(){return state.link?2000:4000}
function start(){state.mobileAimId=null;state.actionReadyAt={};state.running=true;state.finished=false;state.runStart=performance.now();state.elapsed=0;state.notes=[];state.nextWhite=1100;state.nextBlack=notesInterval()+1100;state.spawnIndex=0;state.hit=0;state.miss=0;state.chorus=0;state.score=0;state.combo=0;state.bestCombo=0;state.lastWhite=[];state.lastPlaced=null;state.travelAngle=-0.55;state.result='';render();if(window.matchMedia?.('(pointer:coarse)').matches)requestAnimationFrame(()=>document.querySelector('#mp-rhythm-stage')?.scrollIntoView({block:'start',behavior:'instant'}));cancelAnimationFrame(state.frame);state.frame=requestAnimationFrame(tick)}
function stop(){state.mobileAimId=null;state.running=false;cancelAnimationFrame(state.frame);state.frame=0}
function finish(){stop();state.finished=true;state.result=`${state.score.toLocaleString()} points · ${state.hit} hits · ${state.miss} misses · ${state.chorus} Cutting Chorus hits · best combo ${state.bestCombo}`;render()}
// Place notes in *hit-time order*, not separate white/black spawn batches.
// Travel is limited by the time since the immediately preceding note (including Chorus).
// This produces a continuous path across the field without impossible teleports.
function stageSize(){const el=document.getElementById('mp-rhythm-stage');return {w:Math.max(320,el?.clientWidth||900),h:Math.max(300,el?.clientHeight||500)}}
function placeNote(t){
 const {w,h}=stageSize();const margin=58;
 const previous=state.lastPlaced;
 if(!previous){const start={x:.48,y:.52,t};state.lastPlaced=start;return start}
 const gap=Math.max(0,t-previous.t);
 // Short gaps, such as a white beat immediately followed by Cutting Chorus,
 // must also have a short mouse movement. Maximum distance is proportional to gap.
 const maxDistance=Math.min(0.38*gap,Math.hypot(w,h));
 const momentum=state.travelAngle;
 // Slowly curving trajectory, with occasional broad reversals at the edges.
 let heading=momentum+Math.sin(state.spawnIndex*.61)*.32;
 const prevX=previous.x*w,prevY=previous.y*h;
 const distance=maxDistance*(.66+.22*(.5+.5*Math.sin(state.spawnIndex*2.19)));
 let x=prevX+Math.cos(heading)*distance;
 let y=prevY+Math.sin(heading)*distance;
 const xmin=margin,xmax=w-margin,ymin=margin,ymax=h-margin;
 if(x<xmin||x>xmax){heading=Math.PI-heading;x=prevX+Math.cos(heading)*distance}
 if(y<ymin||y>ymax){heading=-heading;y=prevY+Math.sin(heading)*distance}
 x=Math.max(xmin,Math.min(xmax,x));y=Math.max(ymin,Math.min(ymax,y));
 state.travelAngle=heading;
 const next={x:x/w,y:y/h,t};state.lastPlaced=next;return next;
}
function spawn(t,kind){const i=state.spawnIndex++;const p=placeNote(t);state.notes.push({kind,t,id:i,x:p.x,y:p.y,done:false});}
function tick(now){if(!state.running)return;state.elapsed=now-state.runStart;
 const horizon=Math.min(state.elapsed+approach,duration);
 // Single chronological sequence means each note is positioned relative to the actual next hit.
 while(Math.min(state.nextWhite,state.nextBlack)<horizon){
  if(state.nextWhite<=state.nextBlack){spawn(state.nextWhite,'white');state.nextWhite+=whiteBeat}
  else{spawn(state.nextBlack,'black');state.nextBlack+=notesInterval()}
 }
 for(const n of state.notes){if(!n.done&&state.elapsed>n.t+windowMs){n.done=true;state.miss++;state.combo=0;state.result=`Missed ${n.kind==='black'?'Cutting Chorus':'ordinary'} note`;}}
 state.notes=state.notes.filter(n=>state.elapsed<n.t+620);draw();if(state.elapsed>=duration+windowMs){finish();return}state.frame=requestAnimationFrame(tick)}
function draw(){const stage=document.getElementById('mp-rhythm-stage');if(!stage)return;const box=stage.querySelector('.mp-rhythm-notes');if(!box)return;box.innerHTML=state.notes.filter(n=>!n.done).map(n=>{const p=Math.min(1,Math.max(0,(state.elapsed-(n.t-approach))/approach));const r=8+42*p;const color=n.kind==='black'?'black':'white';return `<div class="mp-note ${color}" style="left:${n.x*100}%;top:${n.y*100}%;opacity:${Math.min(1,Math.max(.15,p*3))}"><span class="mp-ring-outer"></span><span class="mp-ring-inner" style="width:${r*2}%;height:${r*2}%"></span><small>${n.kind==='black'?'CC':'♪'}</small></div>`}).join('');const stat=document.getElementById('mp-rhythm-stat');if(stat)stat.textContent=`${Math.min(60,state.elapsed/1000).toFixed(1)} / 60s · Score ${state.score} · Combo ${state.combo} · Misses ${state.miss} · Chorus ${state.chorus}`;const notice=document.getElementById('mp-rhythm-feedback');if(notice)notice.textContent=state.result;refreshTouchCooldowns();}
function hit(key){if(!state.running)return;const touch=!!TOUCH_BY_KEY[key]||key==='touch-chorus';const cdKey=key==='touch-chorus'?'chorus':key;if(touch&&state.elapsed<(state.actionReadyAt[cdKey]||0))return;const stage=document.getElementById('mp-rhythm-stage');if(!stage)return;const rect=stage.getBoundingClientRect();const x=state.mouse.x,y=state.mouse.y;if(x<0||y<0||x>rect.width||y>rect.height)return;const isBlack=key==='touch-chorus'||key.toLowerCase()===state.black.toLowerCase();if(touch){state.actionReadyAt[cdKey]=state.elapsed+1000*skillCooldownSeconds(key==='touch-chorus'?{id:'chorus'}:TOUCH_BY_KEY[key]);refreshTouchCooldowns()}const suitable=state.notes.filter(n=>!n.done&&n.kind===(isBlack?'black':'white')&&Math.abs(state.elapsed-n.t)<=windowMs&&Math.hypot(n.x*rect.width-x,n.y*rect.height-y)<=Math.min(rect.width,rect.height)*.084).sort((a,b)=>Math.abs(state.elapsed-a.t)-Math.abs(state.elapsed-b.t));const n=suitable[0];if(!n)return;if(!isBlack&&state.hard&&state.lastWhite.includes(key.toLowerCase())){state.result='Hard mode: no repeat of either of your last two ordinary keys.';state.combo=0;draw();return;}n.done=true;const timing=Math.abs(state.elapsed-n.t);const pts=timing<=75?300:timing<=135?150:50;state.score+=pts;state.hit++;state.combo++;state.bestCombo=Math.max(state.bestCombo,state.combo);if(isBlack)state.chorus++;else state.lastWhite=[...state.lastWhite,key.toLowerCase()].slice(-2);state.result=(pts===300?'Perfect':pts===150?'Good':'Late / early')+` · ${n.kind==='black'?'Cutting Chorus':label(key)} +${pts}`;draw();}
function markup(){return `<h2>Melodic Puppeteer · Cutting Chorus Rhythm</h2><p class="muted mp-intro">Aim and time your skills independently. Black notes are Cutting Chorus.</p><section class="card mp-rhythm-shell"><div class="mp-rhythm-settings"><label><input id="mp-link" type="checkbox" ${state.link?'checked':''} ${state.running?'disabled':''}> Link Bonus Cooldown (Link X, ON by default)</label><label><input id="mp-hard" type="checkbox" ${state.hard?'checked':''} ${state.running?'disabled':''}> Hard mode · No repeat of either of the last two ordinary skills</label><label>Cutting Chorus key <button type="button" id="mp-bind" ${state.running?'disabled':''}>${state.binding?'Press a key…':esc(label(state.black))}</button></label><span class="hint">Cutting Chorus: every ${notesInterval()/1000}s · White rhythm: every ${whiteBeat/1000}s</span></div><div id="mp-rhythm-stage" class="mp-rhythm-stage" tabindex="0"><div class="mp-rhythm-grid"></div><div class="mp-rhythm-notes"></div><div id="mp-touch-aim" class="mp-touch-aim" hidden aria-hidden="true"></div>${state.running?'<button type="button" class="mp-rhythm-end" id="mp-stop">End practice</button>':''}${!state.running?`<div class="mp-rhythm-overlay"><h3>${state.finished?'Practice complete':'Cutting Chorus Rhythm'}</h3><p>${state.finished?esc(state.result):'Aim with one hand, trigger a skill with the other. Direct taps on notes never score.'}</p><button id="mp-start" class="primary">${state.finished?'Begin again':'Begin rhythm'}</button></div>`:''}</div>${touchPanel()}<div class="mp-rhythm-status"><strong id="mp-rhythm-stat">${state.finished?'Finished · ':''}Score ${state.score} · Combo ${state.combo} · Misses ${state.miss} · Chorus ${state.chorus}</strong><span id="mp-rhythm-feedback">${esc(state.result)}</span></div><p class="hint">Find your rhythm!</p></section>`}
function render(){const root=document.getElementById('mp-rhythm-root');if(!root)return;root.innerHTML=markup();bind();if(state.running)draw()}
function view(){return `<div id="mp-rhythm-root">${markup()}</div>`}
function bind(){const root=document.getElementById('mp-rhythm-root');if(!root)return;root.querySelector('#mp-start')?.addEventListener('click',start);root.querySelector('#mp-stop')?.addEventListener('click',finish);root.querySelector('#mp-link')?.addEventListener('change',e=>{state.link=e.target.checked;save();render()});
 root.querySelector('#mp-hard')?.addEventListener('change',e=>{state.hard=e.target.checked;save();render()});root.querySelector('#mp-bind')?.addEventListener('click',()=>{state.binding=true;render()});const stage=root.querySelector('#mp-rhythm-stage');function aim(e){const b=stage.getBoundingClientRect();state.mouse={x:e.clientX-b.left,y:e.clientY-b.top};const dot=stage.querySelector('#mp-touch-aim');if(dot&&e.pointerType!=='mouse'){dot.hidden=false;dot.style.left=state.mouse.x+'px';dot.style.top=state.mouse.y+'px'}}
 stage?.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;if(state.mobileAimId!==null&&state.mobileAimId!==e.pointerId)return;state.mobileAimId=e.pointerId;stage.setPointerCapture?.(e.pointerId);aim(e);e.preventDefault()});
 stage?.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||state.mobileAimId===e.pointerId)aim(e)});
 function endAim(e){if(state.mobileAimId!==e.pointerId)return;state.mobileAimId=null;const dot=stage.querySelector('#mp-touch-aim');if(dot)dot.hidden=true;state.mouse={x:-1000,y:-1000}}
 stage?.addEventListener('pointerup',endAim);stage?.addEventListener('pointercancel',endAim);
 stage?.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')state.mouse={x:-1000,y:-1000}});
 root.querySelectorAll('[data-mp-skill]').forEach(btn=>btn.addEventListener('pointerdown',e=>{if(!state.running)return;e.preventDefault();const key=btn.dataset.mpSkill==='chorus'?'touch-chorus':btn.dataset.mpSkill;hit(key)}));refreshTouchCooldowns();}
function onRender(){if(!document.getElementById('mp-rhythm-root')){if(state.running)stop();return;}bind();if(state.running&&!state.frame)state.frame=requestAnimationFrame(tick)}
document.addEventListener('keydown',e=>{if(!document.getElementById('mp-rhythm-root'))return;if(e.ctrlKey||e.altKey||e.metaKey||e.repeat)return;if(state.binding){e.preventDefault();state.black=e.key;state.binding=false;save();render();return}if(!state.running)return;if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(['Escape','Tab','Shift','Control','Alt','Meta'].includes(e.key))return;e.preventDefault();hit(e.key)},true);
function exportState(){return {link:state.link,hard:state.hard,black:state.black}}
function importState(v){if(!v||typeof v!=='object')return;state.link=v.link!==false;state.hard=!!v.hard;if(typeof v.black==='string'&&v.black.length<=24)state.black=v.black;save();render()}
window.MIDIR_MP_RHYTHM={view,onRender,exportState,importState};
})();
