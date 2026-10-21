/* Companion 104 — Blazing Brawler Bandit Hunt. Named bandits, wildlife feints, and golem encounter art. */
(function(){'use strict';
const KEY='midir-companion-bb-bandit-v1';
const SIZE=9;
// Mabinogi commerce archetypes with invented moment-to-moment card scenes.
// Counter Punch is deliberately reserved for incoming melee attacks; neutral / fleeing
// bandits require Charging Strike, not a defensive counter.
const NAMED_BANDITS=[
 ['"Horrifying" Herbert','herbert','Lunges forward with his jagged polearm','Turns and flees with an enormous sack'],
 ['"No-Face" Nelson','nelson','Swings his curved blade straight at you','Runs off clutching stolen merchandise'],
 ['"One-Eye" Klugger','klugger','Brings his heavy hammer into a crushing swing','Lumbers away with a bulging sack of loot'],
 ['"Scandalous" Charlene','charlene','Steps in aggressively with her baton','Slips away with the trade goods'],
 ['"Stinky" Berkkus','berkkus','Raises his sword and advances behind his shield','Sprints away carrying a stolen treasure chest'],
 ['"Shifty" Shankleton','shankleton','Jabs his walking stick toward you','Makes a run for it with his oversized money sack'],
 ['"Zippy" Nipmore','nipmore','Dashes in with his enchanted dagger','Scampers off with the ducats over his shoulder']
];
// Poses are paired deliberately: the same outlaw can attack or run away.
// The player must read the posture, not memorize a response per identity.
const COUNTER_SCENES=NAMED_BANDITS.map(([name,id,attack])=>[name,attack,id]);
const CHARGE_SCENES=NAMED_BANDITS.map(([name,id,_attack,escape])=>[name,escape,id]);
// Visual names describe the player's supplied Mabinogi screenshots rather than
// asserting official subtype names. Every card uses the raised-arm slam cue.
const DODGE_SCENES=[
 ['Moss-covered Golem','One huge arm lifts high, ready to slam into the road','golem-moss'],
 ['Runic Golem','Floating stone blocks pull back as one heavy arm rises','golem-rune'],
 ['Ice Golem','Its frozen arm swings upward before a crushing slam','golem-ice'],
 ['Pale Stone Golem','The enormous stone arm rises for a ground-shaking strike','golem-pale'],
 ['Stone Golem','A dark stone arm lifts into a dangerous overhead slam','golem-dark']
];
const WAIT_SCENES=[
 ['Wisp','A drifting spirit hovers nearby; do not lunge after it','wisp'],
 ['Red Fox','It flicks across the road and bolts if startled','red-fox'],
 ['Brown Fox','Cautious wildlife watches the caravan, then backs away','brown-fox'],
 ['White Fox','It pauses in the snow and slips off the route','white-fox'],
 ['Young Gray Fox','A nervous feint — let it dart clear and hold steady','young-gray-fox'],
 ['Green Kiwi','Odd and timid, it startles easily but is no bandit','green-kiwi'],
 ['White Kiwi','A fluffy distraction that is still just wary wildlife','white-kiwi'],
 ['Gold Kiwi','Flashy feathers, no threat — stay patient','gold-kiwi'],
 ['Black Kiwi','It scurries at the edge of the path and keeps its distance','black-kiwi']
];
const FREE_SCENES=[
 ['Ducat Purse','A trader left a handful of ducats'],
 ['Merchant Crate','A forgotten stash with no guards'],
 ['Traveler Cache','A lucky find along the trade road'],
 ['Dropped Trade Pouch','Coins spill out right at your feet']
];
const RESPONSE_LABEL={counter:'Counter Punch',charge:'Charging Strike',dodge:'Tumble',wait:'Wait'};
const RESPONSE_ICON={counter:'assets/icons/skills/gui_icon_skill_002_4_13.png',charge:'assets/icons/skills/gui_icon_skill_002_4_4.png',dodge:window.MIDIR_ROTATION_ICONS?.Tumble||''};
const records={bestStreak:0,bestRunDucats:0,totalDucatsEarned:0,runs:[]};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object'){
 records.bestStreak=Math.max(0,Math.floor(Number(saved.bestStreak)||0));
 records.bestRunDucats=Math.max(0,Math.floor(Number(saved.bestRunDucats)||0));
 records.totalDucatsEarned=Math.max(0,Math.floor(Number(saved.totalDucatsEarned)||0));
 if(Array.isArray(saved.runs))records.runs=saved.runs.filter(r=>Number.isFinite(r.date)&&Number.isFinite(r.ducats)).slice(-18);
}}catch{}
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let seq=1, board=[], session=null, active=null, boundRoot=null, frame=0, boardGeneration=0, announce='Flip a card to hunt bandits and chase ducats.';
function save(){try{localStorage.setItem(KEY,JSON.stringify(records))}catch{announce+=' Browser storage is unavailable.'}}
function rand(arr){return arr[Math.floor(Math.random()*arr.length)]}
function ducatCount(){return window.MIDIR_REFORGE?.getDucats?.()||0}
function dazzlingCount(){return window.MIDIR_REFORGE?.getDazzlingTools?.()||0}
function newTile(){
 const rewardBase=5+Math.floor(Math.random()*4);
 const lucky=Math.random()<(1/300);
 const reward=rewardBase*(lucky?20:1);
 const roll=Math.random();
 let kind,scene;
 if(roll<0.16){kind='free';scene=rand(FREE_SCENES);}
 else if(roll<0.45){kind='counter';scene=rand(COUNTER_SCENES);}
 else if(roll<0.72){kind='charge';scene=rand(CHARGE_SCENES);}
 else if(roll<0.85){kind='dodge';scene=rand(DODGE_SCENES);}
 else{kind='wait';scene=rand(WAIT_SCENES);}
 let art=null;
 if(scene[2]){
  if(kind==='dodge' || kind==='wait') art=`assets/bandit-hunt/${scene[2]}.webp`;
  else if(kind==='counter' || kind==='charge') art=`assets/bandit-hunt/${scene[2]}-${kind==='counter'?'attack':'escape'}.webp`;
 }
 return {id:'bb-tile-'+(seq++),kind,title:lucky&&kind==='free'?'Lucky Finish!':scene[0],cue:scene[1],art,reward,lucky,state:'hidden',resolvedAt:0,pressure:0};
}
function freshBoard(){return Array.from({length:SIZE*SIZE},()=>newTile())}
function neighbors(index){const x=index%SIZE,y=Math.floor(index/SIZE),list=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=SIZE||ny>=SIZE)continue;list.push(ny*SIZE+nx)}return list}
function startRun(){boardGeneration++;session={started:Date.now(),ducats:0,streak:0,bestStreak:0,flips:0,successes:0,fails:0,stolen:0};board=freshBoard();active=null;announce='Bandits are on the road. Flip a card and react fast.';refresh()}
function endRun(record=true){boardGeneration++;cancelAnimationFrame(frame);frame=0;active=null;if(record&&session&&(session.ducats>0||session.flips>0)){records.bestStreak=Math.max(records.bestStreak,session.bestStreak);records.bestRunDucats=Math.max(records.bestRunDucats,session.ducats);records.totalDucatsEarned+=session.ducats;records.runs.push({date:Date.now(),ducats:session.ducats,bestStreak:session.bestStreak,successes:session.successes,fails:session.fails,stolen:session.stolen});records.runs=records.runs.slice(-18);save();announce=`Run finished! ${session.ducats.toLocaleString()} ducats banked · best streak ${session.bestStreak}.`;}session=null;refresh()}
function timerMs(tile){if(!session)return 2200;
 // A successful response puts pressure on neighboring still-hidden encounters.
 // No matter how high the chain grows, the player gets at least 0.7s to react.
 return clamp(2200-session.streak*70-Math.floor(session.successes/4)*35-(tile?.pressure||0)*160,700,2200);
}
function streakSweep(streak){return streak>=12?8:streak>=8?5:streak>=5?3:streak>=3?1:0}
function rewardNearby(index,count){if(!count)return {amount:0,tiles:[]};const picks=neighbors(index).filter(i=>board[i]&&board[i].state==='hidden').slice(0);for(let i=picks.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[picks[i],picks[j]]=[picks[j],picks[i]]}const chosen=picks.slice(0,count);let amount=0;for(const idx of chosen){board[idx].state='bonus';amount+=board[idx].reward}return {amount,tiles:chosen}}
function addDucats(amount){if(!amount)return;const confirmed=window.MIDIR_REFORGE?.addDucats?.(amount);if(!Number.isFinite(confirmed))return;session.ducats+=amount}
function queueReplace(indexes,delay){const generation=boardGeneration;setTimeout(()=>{if(generation!==boardGeneration)return;for(const idx of indexes){board[idx]=newTile()}refresh()},delay)}
function resolveSuccess(index,autoWait=false){if(!session||!board[index])return;const tile=board[index];tile.state='resolved';tile.resolvedAt=Date.now();session.flips++;session.successes++;session.streak++;session.bestStreak=Math.max(session.bestStreak,session.streak);records.bestStreak=Math.max(records.bestStreak,session.bestStreak);const sweep=streakSweep(session.streak);const bonus=rewardNearby(index,sweep);const total=tile.reward+bonus.amount;addDucats(total);for(const neighborIndex of neighbors(index)){if(board[neighborIndex]?.state==='hidden')board[neighborIndex].pressure=clamp((board[neighborIndex].pressure||0)+1,0,5)}active=null;announce=`${autoWait?'Stayed calm':'Clean read'}! ${tile.title}${tile.lucky?' · Lucky Finish!':''} paid ${tile.reward.toLocaleString()} ducats${bonus.amount?` + ${bonus.amount.toLocaleString()} from ${bonus.tiles.length} nearby stash${bonus.tiles.length===1?'':'es'}`:''}.`;queueReplace([index,...bonus.tiles],650);refresh()}
function resolveFree(index){if(!session||!board[index])return;const tile=board[index];tile.state='resolved';tile.resolvedAt=Date.now();session.flips++;addDucats(tile.reward);active=null;announce=`${tile.title}${tile.lucky?' · Lucky Finish!':''} gave you ${tile.reward.toLocaleString()} ducats for free.`;queueReplace([index],600);refresh()}
function resolveTimeout(){if(!session||active==null)return;const tile=board[active.index];tile.state='stolen';session.flips++;session.fails++;session.streak=0;session.stolen+=tile.reward;announce=`Too slow. ${tile.title} got away with ${tile.reward.toLocaleString()} ducats.`;const idx=active.index;active=null;queueReplace([idx],800);refresh()}
function resolveFailure(index,input){if(!session||!board[index])return;const tile=board[index];const near=neighbors(index).filter(i=>board[i]&&board[i].state==='hidden');let lost=tile.reward;tile.state='failed';for(const idx of near){board[idx].state='stolen';lost+=board[idx].reward}session.flips++;session.fails++;session.streak=0;session.stolen+=lost;announce=`Wrong read (${RESPONSE_LABEL[input]||'No action'})! This was ${tile.kind==='wait'?'a wildlife feint':tile.kind==='dodge'?'a Golem dodge':tile.kind==='counter'?'an incoming attack':'a neutral or escaping bandit'} — ${RESPONSE_LABEL[tile.kind]}. Bandit Imps ran off with ${lost.toLocaleString()} unclaimed ducats.`;active=null;queueReplace([index,...near],950);refresh()}
function respond(input){if(!session||!active)return;const tile=board[active.index];if(tile.kind==='wait'){return resolveFailure(active.index,input)}if(tile.kind===input)return resolveSuccess(active.index,false);resolveFailure(active.index,input)}
function tick(now){if(!active||!session){frame=0;return}const remain=active.deadline-now;if(remain<=0){if(active.kind==='wait')resolveSuccess(active.index,true);else resolveTimeout();return}const meter=document.getElementById('bb-active-fill');if(meter)meter.style.width=(100*remain/active.duration).toFixed(1)+'%';const label=document.getElementById('bb-active-time');if(label)label.textContent=(remain/1000).toFixed(2)+'s';frame=requestAnimationFrame(tick)}
function flip(index){if(!session||active||!board[index]||board[index].state!=='hidden')return;const tile=board[index];if(tile.kind==='free'){resolveFree(index);return}tile.state='active';const duration=timerMs(tile);active={index,kind:tile.kind,duration,deadline:performance.now()+duration};announce=`${tile.title}: ${tile.cue}. Choose your response!`;refresh();cancelAnimationFrame(frame);frame=requestAnimationFrame(tick)}
function chestSummary(){return `<div class="bb-bandit-summary"><div><small>Storage Chest</small><strong>${ducatCount().toLocaleString()} ducats</strong></div><div><small>Dazzling Tools</small><strong>${dazzlingCount().toLocaleString()}</strong></div>${session?`<div><small>Run ducats</small><strong>${session.ducats.toLocaleString()}</strong></div><div><small>Current streak</small><strong>${session.streak}</strong></div>`:`<div><small>Best run</small><strong>${records.bestRunDucats.toLocaleString()}</strong></div><div><small>Best streak</small><strong>${records.bestStreak}</strong></div>`}</div>`}
function skillImg(skill){const src=RESPONSE_ICON[skill];return src?`<img class="bb-action-icon" src="${src}" alt="">`:''}
function legend(){return `<div class="bb-bandit-legend"><div><span class="bb-chip counter">${skillImg('counter')}1 · Counter Punch</span><span>Incoming melee attack — answer it.</span></div><div><span class="bb-chip charge">${skillImg('charge')}2 · Charging Strike</span><span>Neutral or fleeing bandit — catch them.</span></div><div><span class="bb-chip dodge">${skillImg('dodge')}3 · Tumble</span><span>Golem's crushing blow — get away.</span></div><div><span class="bb-chip wait">Wait</span><span>Wildlife looks threatening but isn't the bandit you're after.</span></div><div><span class="bb-chip free">Free</span><span>Merchant caches pay out immediately.</span></div></div>`}
function banditArt(tile,size){const action=tile.kind==='counter'?'attacking':tile.kind==='charge'?'escaping':tile.kind==='dodge'?'preparing a heavy arm slam':tile.kind==='wait'?'remaining wary wildlife':'revealed';return tile.art?`<img class="bb-bandit-art ${size} ${tile.kind==='dodge'?'golem-photo':''} ${tile.kind==='wait'?'wildlife-photo':''}" src="${tile.art}" alt="${esc(tile.title)} ${action}" loading="${size==='board'?'lazy':'eager'}">`:''}
function cardInner(tile){if(tile.state==='hidden')return `<span class="bb-bandit-back">?</span>`;if(tile.state==='bonus')return `<small>Chain sweep</small><strong>${tile.reward}</strong><span>D</span>`;if(tile.state==='stolen')return `<small>Imp escaped</small><strong>${tile.reward}</strong><span>D</span>`;if(tile.state==='failed')return `<small>Missed</small>${banditArt(tile,'board')}<strong>${esc(tile.title)}</strong><span>${tile.reward} D</span>`;return `<small>${tile.kind==='wait'?'Wildlife':tile.kind==='dodge'?'Golem':tile.kind==='free'?'Treasure':'Bandit'}</small>${banditArt(tile,'board')}<strong>${esc(tile.title)}</strong><span>${tile.reward.toLocaleString()} D${tile.lucky?' ✨':''}</span>`}
function tileClass(tile,index){return `bb-bandit-tile ${tile.state} ${tile.kind}${active?.index===index?' current':''}`}
function boardMarkup(){return `<div class="bb-bandit-board-scroller"><div class="bb-bandit-grid" role="grid" aria-label="Bandit hunt board">${board.map((tile,index)=>`<button type="button" class="${tileClass(tile,index)}" data-bb-flip="${index}" ${!session||!!active||tile.state!=='hidden'?'disabled':''}>${cardInner(tile)}</button>`).join('')}</div></div>`}
function activeMarkup(){if(!active||!session)return `<div class="bb-bandit-active idle"><strong>No revealed card</strong><span>Flip a tile to reveal an encounter. Read its action before choosing your response.</span></div>`;
 const tile=board[active.index];
 return `<div class="bb-bandit-active ${tile.kind} ${tile.art?'has-art':''}">${tile.art?`<div class="bb-active-portrait">${banditArt(tile,'active')}</div>`:''}<div class="bb-active-details"><div class="bb-bandit-active-heading"><strong>${esc(tile.title)}${tile.lucky?' ✨':''}</strong><span id="bb-active-time">${(active.duration/1000).toFixed(2)}s</span></div><p class="bb-encounter-cue">${esc(tile.cue)}</p><div class="bb-active-track"><div id="bb-active-fill" style="width:100%"></div></div><div class="bb-bandit-actions"><button type="button" data-bb-input="counter">${skillImg('counter')}1 · Counter Punch</button><button type="button" data-bb-input="charge">${skillImg('charge')}2 · Charging Strike</button><button type="button" data-bb-input="dodge">${skillImg('dodge')}3 · Tumble</button><span class="hint">Wildlife: <strong>wait</strong> without pressing.</span></div></div></div>`}
function recordsMarkup(){return `<section class="card bb-bandit-records"><h3>Bandit Hunt Records</h3><div class="bb-bandit-summary compact"><div><small>Lifetime ducats</small><strong>${records.totalDucatsEarned.toLocaleString()}</strong></div><div><small>Best streak</small><strong>${records.bestStreak}</strong></div><div><small>Best run</small><strong>${records.bestRunDucats.toLocaleString()}</strong></div></div>${records.runs.length?`<div class="bb-bandit-run-list">${records.runs.slice(-5).reverse().map(r=>`<div><span>${new Date(r.date).toLocaleDateString()}</span><strong>${r.ducats.toLocaleString()} D</strong><small>Best streak ${r.bestStreak} · ${r.successes} reads · ${r.fails} misses</small></div>`).join('')}</div>`:'<p class="hint">Finish a hunt to save your first record.</p>'}</section>`}
function inner(){return `<div class="bb-bandit-shell"><div class="bb-bandit-intro"><p class="muted">Flip cards across the trade route: Counter Punch incoming bandits, Charging Strike looters and escapees, Tumble away from golems, and ignore wildlife. Every earned ducat goes straight to your Storage Chest. Wrong reactions let Bandit Imps steal the nearby treasure. Long streaks sweep up more rewards from the surrounding cards.</p>${chestSummary()}${legend()}</div><section class="card"><div class="bb-bandit-toolbar"><div><strong>Bandit Hunt Board</strong><span class="hint">Average tile reward: 5–8 ducats. Lucky Finish pays 20× at a 1/300 rate.</span></div><div class="bb-bandit-controls">${session?`<button type="button" id="bb-end-hunt">End hunt</button>`:`<button type="button" id="bb-start-hunt" class="primary">Start hunt</button>`}</div></div>${activeMarkup()}${boardMarkup()}<p id="bb-bandit-status" class="hint" role="status">${esc(announce)}</p></section>${recordsMarkup()}</div>`}
function view(){if(!board.length)board=freshBoard();return `<h2>Blazing Brawler · Bandit Hunt</h2><p class="muted">React fast, keep your cool, and chase a board full of ducats without letting the Bandit Imps make off with the good stuff.</p><div id="bb-bandit-root">${inner()}</div>`}
function keyHandler(e){if(!document.getElementById('bb-bandit-root'))return;if(e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(e.repeat)return;if(e.key==='1'){e.preventDefault();e.stopImmediatePropagation();respond('counter')}else if(e.key==='2'){e.preventDefault();e.stopImmediatePropagation();respond('charge')}else if(e.key==='3'){e.preventDefault();e.stopImmediatePropagation();respond('dodge')}}
function bind(){const root=document.getElementById('bb-bandit-root');if(!root){boundRoot=null;cancelAnimationFrame(frame);frame=0;return}boundRoot=root;root.querySelector('#bb-start-hunt')?.addEventListener('click',startRun);root.querySelector('#bb-end-hunt')?.addEventListener('click',()=>endRun(true));root.querySelectorAll('[data-bb-flip]').forEach(btn=>btn.addEventListener('click',()=>flip(Number(btn.dataset.bbFlip))));root.querySelectorAll('[data-bb-input]').forEach(btn=>btn.addEventListener('click',()=>respond(btn.dataset.bbInput)))}
function refresh(){const root=document.getElementById('bb-bandit-root');if(!root)return;root.innerHTML=inner();bind();if(active){cancelAnimationFrame(frame);frame=requestAnimationFrame(tick)}}
function onRender(){const root=document.getElementById('bb-bandit-root');if(!root){boundRoot=null;cancelAnimationFrame(frame);frame=0;return}if(root!==boundRoot)bind();}
function exportState(){return {bestStreak:records.bestStreak,bestRunDucats:records.bestRunDucats,totalDucatsEarned:records.totalDucatsEarned,runs:records.runs.slice(-18)}}
function importState(v){if(!v||typeof v!=='object')return;records.bestStreak=clamp(Math.floor(Number(v.bestStreak)||0),0,1e6);records.bestRunDucats=clamp(Math.floor(Number(v.bestRunDucats)||0),0,1e12);records.totalDucatsEarned=clamp(Math.floor(Number(v.totalDucatsEarned)||0),0,1e12);records.runs=Array.isArray(v.runs)?v.runs.slice(-18).filter(r=>Number.isFinite(r.date)&&Number.isFinite(r.ducats)):[];save();}
document.addEventListener('keydown',keyHandler,true);
window.MIDIR_BB={view,onRender,exportState,importState};
})();
