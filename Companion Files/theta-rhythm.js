(()=>{'use strict';
/* Subject Theta: Containment — offline first-person Dark Diviner rhythm game.
 * Independent profile namespace: preserves the existing Companion save data.
 * Cooldowns seeded from RH_MIN_COOLDOWNS and editable, all unverified gaps marked provisional.
 */
const ROOT='midir-theta-rhythm-v1',NAMES=['Containment Initiated','Pulse Alignment','Blighted Cadence','Dark Weave','Containment Pressure','Void Resonance','Swarm Interference','Fractured Containment','Critical Instability','Subject Theta: Final Containment'];
const THETA_SKILL_ICONS={"thunder":"assets/icons/skills/gui_icon_skill_001_5_15.png","blight":"assets/icons/skills/gui_icon_skill_005_2_8.png","flare":"assets/icons/skills/gui_icon_skill_005_1_8.png","render":"assets/icons/skills/gui_icon_skill_005_5_8.png","surge":"assets/icons/skills/GUI_icon_skill_006_6_2.png","hex":"assets/icons/skills/gui_icon_skill_005_6_8.png","vortex":"assets/icons/skills/gui_icon_skill_005_3_8.png","mana":"assets/icons/skills/gui_icon_skill_005_4_8.png","ice":"assets/icons/skills/gui_icon_skill_000_3_2.png","seething":"assets/icons/skills/gui_icon_skill_005_7_8.png"};
function thetaSkillIcon(id){return THETA_SKILL_ICONS[id]?`<img class="theta-skill-icon" src="${THETA_SKILL_ICONS[id]}" alt="" aria-hidden="true">`:""}
const SKILLS=[{id:'thunder',name:'Thunder',key:'a',color:'#bfb2ff',cd:0,mp:7,dorcha:0,score:100}, {id:'blight',name:'Thunderblight',key:'s',color:'#5bdcff',cd:17,mp:50,dorcha:-1.5,score:150},{id:'flare',name:'Shadow Flare',key:'d',color:'#ff66d6',cd:10,mp:75,dorcha:-1,score:170},{id:'render',name:'Render Dorcha',key:'f',color:'#87ffb8',cd:10,mp:0,dorcha:5,score:140},{id:'surge',name:'Twilight Surge',key:'j',color:'#ffc57c',cd:36,mp:40,dorcha:0,score:1600},{id:'hex',name:'Hexshroud',key:'k',color:'#cc86ff',cd:30,mp:50,dorcha:-.7,score:140},{id:'vortex',name:'Polar Vortex',key:'l',color:'#85cfff',cd:60,mp:60,dorcha:-3,score:210},{id:'mana',name:'Render Mana',key:';',color:'#e2d2ff',cd:30,mp:0,dorcha:-1,score:110},{id:'ice',name:'Ice Bolt',key:'g',color:'#93edff',cd:0,mp:3,dorcha:0,score:45}];
const THETA_LANES=['thunder','blight','flare','surge'];
const THETA_LANE_SKILLS=THETA_LANES.map(id=>SKILLS.find(s=>s.id===id));
const DORCHA_MAX=15,BASE_MP=2500,SURGE_CHARGE_MAX=100,SURGE_CHARGE_PER_CAST=5,SURGE_NOTE_APPROACH=8,SURGE_WARNING_GRACE=6,UTILITY_SKILLS=new Set(['render','mana','hex']);
const defaultData=()=>({unlocked:1,level:1,credits:0,earned:0,keys:Object.fromEntries(SKILLS.map(s=>[s.id,s.key])),seethingKey:'q',mechanicKey:' ',offset:0,scroll:3,upgrades:{power:0,mp:0,efficiency:0,hex:0,focus:0,show:0,lucky:0,vivace:0,ergS50:0,iceBolt:0},cosmetics:{enabled:true,thunder:'default',flare:'default',vortex:'default',alternate:true},thetaRulesVersion:2,stats:{runs:0,bestCombo:0,totalPerfect:0,laser:0,seething:0,finished:0,highest:0},records:{},cooldowns:Object.fromEntries(SKILLS.map(s=>[s.id,s.cd]))});
let profile;try{profile={...defaultData(),...JSON.parse(localStorage.getItem(ROOT)||'{}')}}catch{profile=defaultData()};profile.sound=profile.sound!==false;profile.graphicsMode=['auto','performance','full'].includes(profile.graphicsMode)?profile.graphicsMode:'auto';profile.mechanicKey=profile.mechanicKey||' ';profile.keys={...defaultData().keys,...profile.keys};profile.upgrades={...defaultData().upgrades,...profile.upgrades};profile.cosmetics={...defaultData().cosmetics,...profile.cosmetics};profile.stats={...defaultData().stats,...profile.stats};profile.cooldowns={...defaultData().cooldowns,...profile.cooldowns};
// Legacy saves: update the former stock cooldowns, while leaving recognized custom values intact.
function migrateThetaRules(data){if((data.thetaRulesVersion||0)>=2)return data;const old={thunder:0,blight:15,flare:10,render:10,surge:30,hex:30,vortex:20,mana:12};for(const id of Object.keys(old))if(data.cooldowns[id]===old[id])data.cooldowns[id]=defaultData().cooldowns[id];data.thetaRulesVersion=2;return data;}
migrateThetaRules(profile);
const save=()=>{try{localStorage.setItem(ROOT,JSON.stringify(profile))}catch{}};const $=id=>document.getElementById(id);const thetaButton=action=>document.querySelector('[data-theta="'+action+'"]');const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));const view=(x)=>{let el=$('theta-root');if(el)el.innerHTML=x};
// Mobile low-cost renderer: timing/input logic continues on every animation frame;
// only visual painting is capped. No note judgments or cooldowns are slowed.
let thetaLite=false,thetaRenderScale=1;
const thetaPerformance=()=>profile.graphicsMode==='performance'||(profile.graphicsMode==='auto'&&(window.matchMedia?.('(pointer:coarse)').matches||window.innerWidth<800));
function thetaCanvasSize(){const canvas=document.getElementById('theta-canvas');if(!canvas)return;thetaLite=thetaPerformance();thetaRenderScale=thetaLite?Math.max(.48,Math.min(.78,(window.innerWidth/1120)*1.4)):1;canvas.width=Math.round(1120*thetaRenderScale);canvas.height=Math.round(690*thetaRenderScale);canvas.dataset.performance=thetaLite?'on':'off';}
window.addEventListener('resize',()=>{if(run&&document.getElementById('theta-canvas')){thetaCanvasSize();run.lastDrawTime=0}});
const currency=n=>Math.round(n).toLocaleString();let run=null,raf=0,activeTab='levels',lastView='menu',keyCapture=null;let imgs={},audio=null;['arena','theta-idle','theta-windup','theta-laser','theta-slam','theta-hit','theta-teleport','theta-rune-ring','theta-amber-prison','theta-poison-fog','first-person-left','first-person-staff',...SKILLS.map(s=>'effect-'+s.id)].forEach(name=>{let im=new Image();im.src='assets/theta/'+name+'.png';imgs[name]=im});Object.entries(THETA_SKILL_ICONS).forEach(([id,path])=>{const im=new Image();im.src=path;imgs['skill-'+id]=im});
const achievements=[['init','First Containment',s=>s.runs>=1],['combo','Unbroken Thread',s=>s.bestCombo>=100],['perfect','Perfect Cadence',s=>s.totalPerfect>=150],['laser','Laserproof',s=>s.laser>=30],['dorcha','Dorcha Master',s=>s.seething>=40],['full','Theta Contained',s=>s.finished>=1],['regular','Dedicated Diviner',s=>s.runs>=10],['pro','All Levels',s=>s.highest>=10],['upgrade','Arcane Collector',()=>Object.values(profile.upgrades).reduce((a,b)=>a+b,0)>=10],['storm','Storm Caller',s=>s.totalPerfect>=500]];
const castingBonus=()=>.1*clamp(profile.upgrades.vivace||0,0,8);
const castDuration=id=>(id==='flare'||id==='surge')?5-.5*clamp(profile.upgrades.vivace||0,0,8):id==='thunder'?(profile.upgrades.ergS50?1:1.3):0; // Flare/Surge 5.0→1.0s; Thunder separate provisional baseline 1.30s, S50 1.00s, Vivace does not affect Thunder.
// Retired Dark Economy shop levels are preserved in old saves but no longer affect combat.
const seethingCost=(id='thunder')=>id==='ice'?.9:id==='thunder'?1.3:1.6;
// Provisional hit-based Dorcha gain while Seething Mana is OFF; tune independently of skill costs.
const normalHitDorchaGain=()=>.5; // Magic talent: per completed cast, independently of Seething toggle.
const price=(id)=>({power:160,show:220,lucky:400,vivace:120,ergS50:950,iceBolt:650}[id]||180)*(profile.upgrades[id]+1);
const exchangePrices={stoneRed:250,stoneBlue:250,stoneProtectRed:750,stoneProtectBlue:750,ergPotion:380};
const exchangeItems=[['stoneRed','Red Upgrade Stone','Send 1 standard red stone to Special Upgrade.'],['stoneBlue','Blue Upgrade Stone','Send 1 standard blue stone to Special Upgrade.'],['stoneProtectRed','Protective Red Upgrade Stone','Send 1 protective red stone to Special Upgrade.'],['stoneProtectBlue','Protective Blue Upgrade Stone','Send 1 protective blue stone to Special Upgrade.'],['ergPotion','Erg Unlock Assist Potion','Send 1 assist potion to the Reforge / Erg Simulator inventory.']];
const maxLvl={power:6,show:3,lucky:1,vivace:8,ergS50:1,iceBolt:1};
// Functional upgrades come first; the optional visual-only purchase is last.
const upgradeInfo=[['iceBolt','Ice Bolt · Five-Cast Volley','Unlock G: one 1.00s charge, then five guaranteed-hit casts over 1.2s; five Seething costs, five Hexshroud hits, +25% Surge charge when ON'],['lucky','Spirit Weapon · Lucky Strike','Thunder cast: 10% chance to restore 20% of maximum MP'],['vivace','Vivace · Casting Speed','+10% in eight tiers; shortens Shadow Flare and Twilight Surge, not Thunder or Ice Bolt'],['ergS50','S50 Erg Staff · Thunder Acceleration','Thunder loading 30% faster. Buy with Sigils or sacrifice an S50 Staff in the Erg chest'],['power','Arcane Intensity','+5% score from spell notes'],['show','Arcane Aesthetics · Cosmetic Styles','Tier 1: Thunder palettes and alternate strike frames. Tier 2: richer Shadow Flare projectile and burn variants. Tier 3: Polar Vortex seasonal themes with bespoke motion. Toggle styles freely.']];
const btn=(act,label,extra='')=>`<button type="button" class="theta-btn ${extra}" data-theta="${act}" ${extra==='unavailable'?'disabled':''}>${label}</button>`;
function viewMarkup(){return `<div id="theta-root" class="theta-wrap"></div>`}
function levels(){return `<div class="theta-panel"><h3>Containment Protocols</h3><p>Every protocol retains earlier rotation layers. Select any unlocked stage.</p><div class="theta-levels">${NAMES.map((n,i)=>`<button type="button" data-theta="level:${i+1}" class="theta-level ${profile.level===i+1?'chosen':''}" ${i+1>profile.unlocked&&!window.MIDIR_RUNTIME_SCOPE?.active?'disabled':''}><span>${i+1}</span><div><strong>${n}</strong><small>${['Learn Thunder timing','Add upkeep timing','Insert Shadow Flare','Use Render Dorcha freely on cooldown','React to laser attacks','Surge lesson: release the charged burst before its glowing note expires','Activate Hexshroud outside rhythm notes','Add Polar Vortex and shockwaves','Activate Render Mana to replenish MP','All skills and Theta mechanics'][i]}</small></div><em>${i+1>profile.unlocked&&!window.MIDIR_RUNTIME_SCOPE?.active?'Locked':profile.records[i+1]?.grade||'Ready'}</em></button>`).join('')}</div></div>`}
function settings(){return `<div class="theta-panel"><h3>Customize bindings and timings</h3><p>Click any assigned key to rebind it. Skill cooldowns use the Companion's documented minimum-CD baselines; exact action timing and note gaps remain editable practice values.</p><div class="theta-settings">${SKILLS.map(s=>`<label><span style="color:${s.color}">${s.name}</span>${btn('bind:'+s.id,esc(profile.keys[s.id].toUpperCase()),'key')}<input type="number" min="0" max="120" step=".1" data-theta-cd="${s.id}" value="${profile.cooldowns[s.id]}" aria-label="${s.name} cooldown seconds"> s cooldown</label>`).join('')}<label><span>Seething Mana toggle</span>${btn('bind:seething',esc(profile.seethingKey.toUpperCase()),'key')}</label><label><span>Boss mechanic response</span>${btn('bind:mechanic',profile.mechanicKey===' '?'SPACE':esc(profile.mechanicKey.toUpperCase()),'key')}</label><label><span>Hit calibration offset</span><input id="theta-offset" type="number" min="-250" max="250" step="10" value="${profile.offset}"> ms</label><label><span>Approach time</span><input id="theta-scroll" type="number" min="1" max="5" step=".25" value="${profile.scroll}"> s</label><label><span>Visual performance</span><select id="theta-graphics"><option value="auto" ${profile.graphicsMode==='auto'?'selected':''}>Auto (optimized mobile)</option><option value="performance" ${profile.graphicsMode==='performance'?'selected':''}>Performance</option><option value="full" ${profile.graphicsMode==='full'?'selected':''}>Full effects</option></select></label></div>${btn('save-settings','Save timing and keybinds','primary')} ${btn('reset-keys','Restore default bindings')}<span id="theta-bind-error" role="status" aria-live="polite"></span><small>Keybinds are exclusive to this mode, and do not modify other Companion controls.</small></div>`}
const COSMETIC_OPTIONS={thunder:[['default','Classic Blue'],['white','White Lightning'],['purple','Purple Arc'],['red','Crimson Strike'],['black','Dan 3 Black']],flare:[['default','Classic Violet'],['ember','Purple Embers'],['void','Voidfire Projectile'],['burn','Lingering Flame']],vortex:[['default','Twilight Purple Snow'],['winter','Winter Snow'],['spring','Spring Breeze'],['summer','Summer Heatwave'],['autumn','Autumn Leaves'],['icicle','Icicle Storm']]};
const COSMETIC_TIER={thunder:1,flare:2,vortex:3};
function cosmeticsPanel(){const lv=clamp(profile.upgrades.show||0,0,3);return `<div class="theta-panel"><h3>Arcane Aesthetics · Cosmetic Studio</h3><p>Owned tiers: ${lv}/3. All styles are visual only: no score, spell timing, hit count or Dorcha changes. Choices are saved and may be changed freely.</p><label class="theta-cosmetic-field"><input type="checkbox" data-theta-cosmetic="enabled" ${profile.cosmetics.enabled?'checked':''} ${lv?'':'disabled'}> Enable cosmetic styles (switch off for original effects)</label><label class="theta-cosmetic-field"><input type="checkbox" data-theta-cosmetic="alternate" ${profile.cosmetics.alternate?'checked':''} ${lv?'':'disabled'}> Alternate animation frames and random shape variants</label>${Object.entries(COSMETIC_OPTIONS).map(([id,opts])=>`<label class="theta-cosmetic-field">${id==='flare'?'Shadow Flare':id==='vortex'?'Polar Vortex':'Thunder'} · Tier ${COSMETIC_TIER[id]}<select data-theta-cosmetic="${id}" ${lv<COSMETIC_TIER[id]?'disabled':''}>${opts.map(([key,name])=>`<option value="${key}" ${profile.cosmetics[id]===key?'selected':''}>${name}</option>`).join('')}</select></label>`).join('')}<small>Thunder styles change bolt color, highlights, and strike silhouettes. Shadow Flare styles add projectile and burn variants. Polar Vortex styles swap the entire storm theme. Unowned styles remain locked. Existing Containment Aura ranks unlock matching Arcane Aesthetics tiers automatically.</small></div>`}
function cosmeticChoice(id){return profile.cosmetics.enabled&&profile.upgrades.show>=COSMETIC_TIER[id]?profile.cosmetics[id]:'default'}
const cosmeticColors={thunder:{default:'#4dbaff',white:'#f2faff',purple:'#a66bff',red:'#ff5666',black:'#26142d'},flare:{default:'#cf65ed',ember:'#eb60d6',void:'#6530b6',burn:'#d96ae7'},vortex:{default:'#aa72df',winter:'#e5f7ff',spring:'#89de9d',summer:'#e69a6c',autumn:'#d99044',icicle:'#8fdcff'}};
function effectColor(id){return cosmeticColors[id]?.[cosmeticChoice(id)]||SKILLS.find(s=>s.id===id)?.color||'#bf96ff'}
function shop(){const stored=window.MIDIR_ERG?.getSavedS50Staffs?.()||[];return `<div class="theta-panel"><h3>Dark Erg Exchange · ${currency(profile.credits)} Sigils</h3><p>Earn Sigils from completed protocols; overheat failures and early exits award nothing.</p><div class="theta-shop">${upgradeInfo.map(([id,name,description])=>`<div><strong>${name}</strong><small>${description}</small><small>Level ${profile.upgrades[id]} / ${maxLvl[id]}</small>${btn('buy:'+id,window.MIDIR_RUNTIME_SCOPE?.active?(profile.upgrades[id]?'Disable':'Enable'):profile.upgrades[id]>=maxLvl[id]?'Maxed':`${currency(price(id))} Sigils`,window.MIDIR_RUNTIME_SCOPE?.active?'primary':profile.upgrades[id]>=maxLvl[id]||profile.credits<price(id)?'unavailable':'primary')}${id==='ergS50'&&!profile.upgrades.ergS50?`<small>Saved S50 Staffs: ${stored.length}</small>${stored.map(w=>btn('tradeS50:'+w.id,'Trade '+esc(w.type)+' S50 · '+esc(w.id),'primary')).join('')}`:''}</div>`).join('')}</div><h3>Cross-game supplies</h3><p>Single-use purchases are deposited directly into their linked simulator inventories.</p><div class="theta-shop">${exchangeItems.map(([id,name,description])=>`<div><strong>${name}</strong><small>${description}</small>${btn('exchange:'+id,currency(exchangePrices[id])+' Sigils',profile.credits<exchangePrices[id]?'unavailable':'primary')}</div>`).join('')}</div>${profile.upgrades.show?cosmeticsPanel():''}</div>`}
function achievementView(){return `<div class="theta-panel"><h3>Containment Achievements</h3><p>Permanent progress is saved locally. Earned: ${achievements.filter(a=>a[2](profile.stats)).length}/${achievements.length}.</p><div class="theta-achievements">${achievements.map(([id,n,check])=>`<div class="${check(profile.stats)?'done':''}"><span>${check(profile.stats)?'✦':'◇'}</span><strong>${n}</strong><small>${check(profile.stats)?'Unlocked':'Not yet earned'}</small></div>`).join('')}</div></div>`}
function menu(){stop();lastView='menu';view(`<section class="theta-head"><div><small>FIRST-PERSON DARK DIVINER RHYTHM TRAINING</small><h2>Subject: Theta Containment</h2><p>Cast with your hands and staff. Keep the rotation, manage Dorcha and MP, and read Theta's warning patterns.</p></div><div class="theta-currency"><strong>✦ ${currency(profile.credits)}</strong><small>Dark Sigils</small></div></section><div class="theta-layout"><div class="theta-left"><div class="theta-panel theta-hero"><img src="assets/theta/theta-idle.png" alt="Subject Theta: gray-skinned monster with white eyes and an enormous blue-infused arm"><h3>${NAMES[profile.level-1]}</h3><p>Protocol ${profile.level} of 10 · Best ${currency(profile.records[profile.level]?.score||0)}</p>${btn('start','Begin Containment','primary big')} ${btn('practice','Free Practice')}</div><div class="theta-tabs">${[['levels','Levels'],['keys','Keybinds'],['shop','Upgrades'],['awards','Achievements']].map(([id,n])=>btn('tab:'+id,n,activeTab===id?'active':'' )).join('')}</div><div id="theta-pane">${activeTab==='levels'?levels():activeTab==='keys'?settings():activeTab==='shop'?shop():achievementView()}</div></div><div class="theta-panel theta-guide"><h3>Quick Guide</h3><p><b>Perfect:</b> note fully inside its flat timing ring. Partial overlaps score Great, Good or OK (late is favored). Empty presses are ignored. Five fallen notes fail; three clean hits reset misses.</p><div class="theta-quick-skills">${THETA_LANE_SKILLS.map(s=>`<span title="${esc(s.name)}">${thetaSkillIcon(s.id)}<kbd>${esc(profile.keys[s.id].toUpperCase())}</kbd>${esc(s.name)}</span>`).join('')}</div><p><b>Utilities:</b> ${thetaSkillIcon('seething')} Seething is a toggle. ${thetaSkillIcon('render')} Dorcha, ${thetaSkillIcon('hex')} Hexshroud and ${thetaSkillIcon('mana')} Mana can be used freely between notes.</p><p><b>Surge:</b> Build its charge with Seething casts, then use <kbd>${esc(profile.keys.surge.toUpperCase())}</kbd> when full.</p><details class="theta-full-reference"><summary>Mechanics reference</summary><p><b>Seething Mana:</b> +5% Surge charge per cast while ON. Magic grants 0.5 Dorcha per cast; Seething costs 1.3 Thunder, 0.9 Ice Bolt and 1.6 advanced/Dark Diviner spells. Dorcha cap: 15.</p><p><b>Hexshroud:</b> +0.5 Dorcha per magic hit; Thunder makes one cast and six hits, Ice Bolt makes five casts and five hits. Ice Bolt charges for 1s, then fires every 0.3s.</p><p><b>Twilight Surge:</b> Requires full charge and 36s cooldown; Protocol 6 teaches the timer, later protocols allow a waiting cast.</p><p><b>Vivace:</b> Shortens Shadow Flare and Surge from 5s to 1s. Erg S50 accelerates Thunder alone. Lucky Strike may restore 20% of MP.</p><p><b>Judgment:</b> Perfect ±45ms, Great ±95ms, Good ±160ms. Five misses end the run; three clean judgments reset overheat.</p></details></div></div>`)}
function buildChart(level,free){
 const duration=free?90:level===6?115:Math.min(115,43+level*7),events=[],last={},initial=2.6;let seq=0;
 const add=(id,t,kind='tap')=>{const ix=THETA_LANES.indexOf(id);if(ix<0||t>duration-1||UTILITY_SKILLS.has(id)||id==='ice'||id==='surge')return false;const cd=profile.cooldowns[id]||0;if(last[id]!=null&&t-last[id]<Math.max(.2,cd)-.001)return false;events.push({id,ix,t:+t.toFixed(3),kind,done:false,hit:false,seq:seq++});last[id]=t;return true};
 // Plan timed casts first: all following offensive notes must respect cast completion.
 const locks=[],upkeepLocks=[];
 function cast(id,first,interval){for(let t=first;t<duration-1;t+=interval){
   // An already scheduled cast occupies the action channel; skip overlapping casts rather than add impossible rhythm notes.
   if([...locks,...upkeepLocks].some(l=>t<l.end+.12&&t+castDuration(id)>l.start-.12))continue;
   if(add(id,t))locks.push({start:t,end:t+castDuration(id),id});
 }}
 // Thunderblight uptime has first claim on the input channel; flare and Thunder must route around it.
 if(level>=2)for(let t=initial+1.3;t<duration-1;t+=Math.max(17,profile.cooldowns.blight||17)){const pre=.22,post=.4;if(add('blight',t))upkeepLocks.push({start:t-pre,end:t+post,id:'blight'});}
 if(level>=3)cast('flare',initial+5.9,level===6?Math.max(20,profile.cooldowns.flare||10):Math.max(10,profile.cooldowns.flare||10));
 // Twilight Surge is player-activated, with its separate persistent reminder note managed by surgeNoteState().
 const readyAfter=t=>{let next=t;for(let i=0;i<12;i++){let blocking=[...locks,...upkeepLocks].find(l=>next>l.start-castDuration('thunder')-.12&&next<l.end+.12);if(!blocking)break;next=blocking.end+.12;}return next};
 // Thunder cadence is scheduled after casting locks; shorter Vivace cast times allow earlier follow-ups.
 let next=initial,interval=level<4?Math.max(castDuration('thunder')+.12,1.6):castDuration('thunder')+.12; // Thunder casts follow their own S50-dependent cadence, never Vivace.
 while(next<duration-1){let adjusted=readyAfter(next);if(adjusted>=duration-1)break;add('thunder',adjusted);next=adjusted+interval;}
 // Polar Vortex uses its own utility control; it is not a recurring timing lane.
 if(level>=5)for(let t=initial+10;t<duration-1;t+=level>=7?16:22)events.push({id:'mechanic',ix:-1,t,kind:'laser',done:false,hit:false,seq:seq++});
 if(level>=8)for(let t=initial+17;t<duration-1;t+=25)events.push({id:'mechanic',ix:-1,t,kind:'slam',done:false,hit:false,seq:seq++});
 if(level>=10)for(let t=initial+23;t<duration-1;t+=30)events.push({id:'mechanic',ix:-1,t,kind:'swarm',done:false,hit:false,seq:seq++});
 return {events:events.sort((a,b)=>a.t-b.t||a.seq-b.seq),duration,locks,upkeepLocks};
}
function start(free=false){stop(false);lastView='game';let chart=buildChart(profile.level,free);run={level:profile.level,free,chart,start:performance.now(),paused:false,pauseAt:0,pausedFor:0,t:0,last:0,score:0,combo:0,best:0,counts:{Perfect:0,Great:0,Good:0,Ok:0,Miss:0},hits:0,total:0,mp:BASE_MP,mpMax:BASE_MP,dorcha:10,utilityLast:{},renderManaUntil:0,castLockUntil:0,surgeCharge:0,surgeLast:-1e6,surgeCasts:0,surgeDue:null,luckyProcs:0,stability:90,hexUntil:0,blightUntil:0,vortexUntil:0,vortexTick:0,thunderHits:[],thunderBursts:[],iceHits:[],iceUntil:0,iceLast:-1e6,iceSlowUntil:0,seething:false,beatIndex:-1,flash:null,particles:[],attacks:[],thunderCastUntil:0,thunderChargeSeed:0,feedbackShake:0,laserHits:0,seethingHits:0,perfects:0,overheat:0,streakToCool:0,overheatFlashUntil:0,failReason:null};view(`<div class="theta-game-header"><div><strong>Protocol ${profile.level} · ${NAMES[profile.level-1]}</strong><small>First-person containment rhythm</small></div></div><div class="theta-play-layout"><div class="theta-play-main"><canvas id="theta-canvas" width="1120" height="690" tabindex="0" aria-label="Theta rhythm game; tap skill circles or use the combat buttons below the track"></canvas><div class="theta-touch-lanes" aria-label="Timed combat skill buttons">${THETA_LANE_SKILLS.filter(s=>s.id!=='surge').map(s=>`<button type="button" data-theta="lane:${s.id}" title="${esc(s.name)}">${thetaSkillIcon(s.id)}<span>${esc(s.name)}</span></button>`).join('')}<button type="button" data-theta="surge" class="theta-surge-action" title="Twilight Surge">${thetaSkillIcon('surge')}<span>0%</span><i class="theta-surge-fill" style="--surge-charge:0%"></i></button><button type="button" data-theta="mechanic" title="Evade mechanic warnings">DODGE</button></div></div><div class="theta-utility-panel">${btn('toggle',thetaSkillIcon('seething')+'<span>OFF</span>')} ${btn('utility:render',thetaSkillIcon('render')+`<span>${esc(profile.keys.render.toUpperCase())}</span>`)} ${btn('utility:hex',thetaSkillIcon('hex')+`<span>${esc(profile.keys.hex.toUpperCase())}</span>`)} ${btn('utility:mana',thetaSkillIcon('mana')+`<span>${esc(profile.keys.mana.toUpperCase())}</span>`)} ${profile.upgrades.iceBolt?btn('ice',thetaSkillIcon('ice')+`<span>${esc(profile.keys.ice.toUpperCase())} ×5</span>`):''} ${btn('utility:vortex',thetaSkillIcon('vortex')+'<span>'+esc(profile.keys.vortex.toUpperCase())+'</span>')} ${btn('sound',profile.sound?'Sound ON':'Sound OFF')} ${btn('pause','Pause')} ${btn('end','Finish / End run')}</div></div><div id="theta-live" class="theta-live">Starting containment...</div><p class="theta-hint">Perfect means the entire note fits inside its flat timing ring; partial overlap is Great, Good or OK, with late presses favored. Empty presses have no penalty; a miss counts only after a note falls off the track. Five misses fail; three clean hits clear them. Press a key or tap the corresponding skill bubble or button as the note meets its timing ring. Utility skills (Render Dorcha, Hexshroud, Render Mana) are free-timing activations with cooldowns, not notes. Hit <kbd>${profile.mechanicKey===' '?'Space':esc(profile.mechanicKey.toUpperCase())}</kbd> during red mechanic warnings. Use <kbd>${esc(profile.seethingKey.toUpperCase())}</kbd> to toggle Seething Mana. The player is only shown as first-person hands and staff.</p>`);for(const [act,label] of [['toggle','Seething Mana'],['utility:render','Render Dorcha'],['utility:hex','Hexshroud'],['utility:mana','Render Mana'],['ice','Ice Bolt'],['utility:vortex','Polar Vortex'],['surge','Twilight Surge']]){const button=thetaButton(act);if(button){button.title=label;button.setAttribute('aria-label',label)}}const thetaCanvas=document.getElementById('theta-canvas');thetaCanvasSize();if(thetaCanvas){thetaCanvas.addEventListener('pointerdown',e=>{if(!run||run.paused)return;e.preventDefault();const r=thetaCanvas.getBoundingClientRect(),x=(e.clientX-r.left)*1120/r.width,y=(e.clientY-r.top)*690/r.height;let selected=null,closest=1e9;const t=now()+(profile.offset||0)/1000;for(const event of run.chart.events){if(event.done||event.ix<0||event.ix>=3)continue;const position=thetaNoteShape(event,t);if(!position||position.p<0||position.p>THETA_TRACK_EXIT)continue;const dist=Math.hypot(position.x-x,position.y-y);if(dist<closest){closest=dist;selected=event.id}}if(selected&&closest<55){hit(selected);return}if(y>610&&x>=168&&x<=952){const lane=Math.min(3,Math.floor((x-168)/(952-168)*4));if(lane<3)hit(THETA_LANES[lane]);else activateSurge();return}if(x>475&&x<645&&y>420&&y<570&&run.chart.events.some(ev=>!ev.done&&ev.ix<0&&Math.abs(ev.t-t)<.2))hit('mechanic');},{passive:false});thetaCanvas.focus({preventScroll:true})}raf=requestAnimationFrame(frame)}
function now(){return run?(performance.now()-run.start-run.pausedFor)/1000:0};function currentMult(){return run.combo>=100?2.5:run.combo>=60?2:run.combo>=35?1.5:run.combo>=15?1.25:1}
function hit(id){if(!run||run.paused)return;if(UTILITY_SKILLS.has(id)){activateUtility(id);return;}if(id==='surge'){activateSurge();return;}if(id==='ice'){activateIce();return;}if(id==='vortex'){activateVortex();return;}let t=now()+(profile.offset||0)/1000;if(id!=='mechanic'&&t<run.castLockUntil-.001){run.flash={text:'CASTING · '+Math.ceil((run.castLockUntil-t)*1000)+'ms',time:performance.now(),color:'#eec4ff'};return;}let possible=run.chart.events.filter(e=>!e.done&&e.id===id).sort((a,b)=>Math.abs(a.t-t)-Math.abs(b.t-t));let e=possible[0];if(!e)return;const name=thetaJudgment(e,t);if(!name)return; /* Extra presses and outside-ring attempts do not heat the track. */e.done=true;e.hit=true;run.counts[name]++;run.hits++;run.combo++;run.streakToCool++;if(run.streakToCool>=3){run.overheat=0;run.streakToCool=0;run.overheatFlashUntil=0;}run.best=Math.max(run.best,run.combo);let sk=SKILLS.find(s=>s.id===id);if(id==='mechanic'){run.laserHits++;run.score+=Math.round(200*currentMult());run.stability=clamp(run.stability+4,0,100);run.flash={text:'EVADED',time:performance.now(),color:'#a7ffe8'};return}let points=sk?.score||120;
 const realDorchaCost=Math.max(0,-(sk?.dorcha||0)),bonusCost=run.seething?seethingCost(id):0;
 const manaCost=sk.mp*(run.renderManaUntil>t?.8:1);
 if(run.mp<manaCost){points*=.3;run.flash={text:'LOW MP',time:performance.now(),color:'#fb947a'}}
 run.mp=clamp(run.mp-manaCost,0,run.mpMax);
 const canPay=run.dorcha+1e-6>=realDorchaCost+bonusCost;
 if(!canPay)points*=.55;
 run.dorcha=clamp(run.dorcha-realDorchaCost-bonusCost+normalHitDorchaGain(),0,DORCHA_MAX);
 if(id==='thunder'){for(let n=0;n<6;n++)run.thunderHits.push(t+n*.14);run.thunderCastUntil=t+.92;run.thunderChargeSeed=Math.floor(Math.random()*1000);run.feedbackShake=Math.max(run.feedbackShake||0,.75);spellSound('thunder',run.seething?'surge':'cast');}else if(run.hexUntil>t&&['blight','flare','vortex'].includes(id))run.dorcha=clamp(run.dorcha+.5,0,DORCHA_MAX);
 if(id==='blight')run.blightUntil=t+17;
	 if(id==='vortex'){run.vortexUntil=t+12;run.vortexTick=t+1;}
 if(id==='flare'&&run.blightUntil>t)points*=1.3;
 if(id==='thunder'&&run.blightUntil>t)points*=1.1;
 let luckyStrike=false;
 if(id==='thunder'&&profile.upgrades.lucky&&Math.random()<.1){luckyStrike=true;run.mp=clamp(run.mp+run.mpMax*.2,0,run.mpMax);run.luckyProcs++}
 if(run.seething&&canPay){points*=1.3;run.seethingHits++}
 if(run.seething)gainSurgeCharge();
 if(id==='flare'||id==='thunder')run.castLockUntil=Math.max(run.castLockUntil,t+castDuration(id));
 points*=({Perfect:1,Great:.7,Good:.4,Ok:.2}[name]||.2)*(name!=='Perfect'&&t>e.t?1.12:1)*currentMult()*(1+.05*profile.upgrades.power);run.score+=Math.round(points);run.stability=clamp(run.stability+1.2,0,100);run.flash={text:luckyStrike?'LUCKY STRIKE · +20% MP':name.toUpperCase(),time:performance.now(),color:luckyStrike?'#b5ffdc':name==='Perfect'?'#ffe6a7':name==='Great'?'#86efff':name==='Good'?'#c4a8ff':'#c5bdcf'};run.attacks.push({id,until:t+.7,seed:Math.floor(Math.random()*1000)});if(name==='Perfect')run.perfects++;spawnParticles(id)}
// Residual Dorcha is a separate gauge from ordinary Dorcha: +5% per completed spell cast
// while Seething Mana is on (never per damage tick). Missed rhythm notes do not cast.
function gainSurgeCharge(){if(!run||!run.seething)return;run.surgeCharge=Math.min(SURGE_CHARGE_MAX,run.surgeCharge+SURGE_CHARGE_PER_CAST)}
// Separate persistent Surge reminder. After the first cast it counts down on the
// 36-second skill cooldown; the note drifts in during the last eight seconds.
// Protocol 6 alone expires six seconds after arrival. In later protocols it waits
// indefinitely, even if the player has not yet built 100% residual charge.
function surgeNoteState(t){
 if(!run||run.level<6)return null;
 const first=run.surgeDue===null;
 if(first&&run.surgeCharge<SURGE_CHARGE_MAX)return {phase:'charging',remaining:0,elapsed:0,first:true};
 const due=first?t:run.surgeDue,remaining=Math.max(0,due-t),elapsed=Math.max(0,t-due);
 return {phase:remaining>0?'approaching':run.level===6?'urgent':'waiting',remaining,elapsed,first};
}
function activateSurge(){
 if(!run||run.paused)return false;
 const t=now(),skill=SKILLS.find(s=>s.id==='surge');
 if(run.level<6){run.flash={text:'SURGE UNLOCKS AT PROTOCOL 6',time:performance.now(),color:'#f4c6a4'};return false}
 if(t<run.castLockUntil-.001){run.flash={text:'FINISH CURRENT CAST',time:performance.now(),color:'#eec4ff'};return false}
 const remaining=Math.max(0,(profile.cooldowns.surge??skill.cd)-(t-run.surgeLast));
 if(remaining>0){run.flash={text:'TWILIGHT SURGE · '+Math.ceil(remaining)+'s COOLDOWN',time:performance.now(),color:'#f4c6a4'};return false}
 if(run.surgeCharge<SURGE_CHARGE_MAX){run.flash={text:'RESIDUAL DORCHA '+run.surgeCharge+'% / 100%',time:performance.now(),color:'#f4c6a4'};return false}
 // Twilight Surge costs no normal Dorcha, including no Seething Mana surcharge.
 // Its sole resources are full residual charge, cooldown, and the existing provisional MP cost.
 const manaCost=skill.mp*(run.renderManaUntil>t?.8:1);
 const lowMP=run.mp+1e-6<manaCost;
 run.mp=clamp(run.mp-manaCost,0,run.mpMax);
 run.surgeCharge=0;run.surgeLast=t;run.surgeDue=t+(profile.cooldowns.surge??skill.cd);run.surgeCasts++;
 const surgeLock=castDuration('surge');
 run.castLockUntil=Math.max(run.castLockUntil,t+surgeLock);
 // Surge is an optional action rather than a planned chart note. Delay the remaining
 // offensive chart so activating it cannot force an unavoidable miss mid-cast.
 for(const e of run.chart.events){if(!e.done&&e.ix>=0&&e.t>=t-.19)e.t=+(e.t+surgeLock+.2).toFixed(3)}
 run.chart.events.sort((a,b)=>a.t-b.t||a.seq-b.seq);
 run.chart.duration+=surgeLock+.2;
 // Large damage-weighted burst, retaining the same scoring modifiers as normal attacks.
 let points=skill.score*(lowMP?.3:1)*(run.seething?1.3:1)*currentMult()*(1+.05*profile.upgrades.power);
 run.score+=Math.round(points);run.stability=clamp(run.stability+2,0,100);
 run.flash={text:'TWILIGHT SURGE · +'+currency(points)+' POINTS',time:performance.now(),color:skill.color};
 run.attacks.push({id:'surge',until:t+.9,seed:Math.floor(Math.random()*1000)});spawnParticles('surge');
 return true;
}
// Ice Bolt is purchased and manually triggered. One 1.00s charge then five fast releases;
// each release is an actual Bolt Magic cast (Seething paid once PER release).
function activateIce(){
 if(!run||run.paused)return false;
 if(!profile.upgrades.iceBolt){run.flash={text:'UNLOCK ICE BOLT IN SHOP',time:performance.now(),color:'#f4c6a4'};return false}
 const t=now();
 if(t<run.castLockUntil-.001){run.flash={text:'FINISH CURRENT CAST',time:performance.now(),color:'#eec4ff'};return false}
 // One charge, five guaranteed-hit CASTS: first release at 1.00s, last at 2.20s.
 // 0.30s between releases; 1.20s total release window, under the 1.50s cap.
 const volleyEnd=2.2;run.castLockUntil=t+volleyEnd;
 for(const e of run.chart.events)if(!e.done&&e.ix>=0&&e.t>=t-.19)e.t=+(e.t+volleyEnd+.2).toFixed(3);
 run.chart.events.sort((a,b)=>a.t-b.t||a.seq-b.seq);run.chart.duration+=volleyEnd+.2;
 for(let i=0;i<5;i++)run.iceHits.push(t+1+i*.3);
 run.iceLast=t;
 run.flash={text:'ICE BOLT · FIVE-CAST VOLLEY',time:performance.now(),color:'#93edff'};
 return true;
}
function icePulse(t){if(!run||!run.iceHits.length)return;
 const pending=[];
 for(const at of run.iceHits){if(at>t){pending.push(at);continue}
  const cost=run.seething?seethingCost('ice'):0,canPay=run.dorcha+1e-6>=cost;
  const mpCost=3*(run.renderManaUntil>at?.8:1),lowMP=run.mp+1e-6<mpCost;
  run.mp=clamp(run.mp-mpCost,0,run.mpMax);
  run.dorcha=clamp(run.dorcha-cost+normalHitDorchaGain()+(run.hexUntil>=at?.5:0),0,DORCHA_MAX);
  if(run.seething)gainSurgeCharge();
  const points=45*(run.seething&&canPay?1.3:1)*(canPay?1:.55)*(lowMP?.3:1)*currentMult()*(1+.05*profile.upgrades.power);
  run.score+=Math.round(points);run.stability=clamp(run.stability+.2,0,100);
  run.iceSlowUntil=Math.max(run.iceSlowUntil,at+1.1);
  run.attacks.push({id:'ice',until:t+.85,seed:Math.floor(Math.random()*1000)});spawnParticles('ice');
 }
 run.iceHits=pending;
}
function activateVortex(){
 if(!run||run.paused)return false;
 const t=now(),skill=SKILLS.find(s=>s.id==='vortex'),last=run.utilityLast.vortex,cd=profile.cooldowns.vortex??skill.cd;
 if(run.level<8){run.flash={text:'POLAR VORTEX UNLOCKS AT PROTOCOL 8',time:performance.now(),color:skill.color};return false}
 if(last!=null&&t-last<cd){run.flash={text:'POLAR VORTEX · '+Math.ceil(cd-(t-last))+'s',time:performance.now(),color:skill.color};return false}
 const extra=run.seething?seethingCost('vortex'):0,required=Math.max(0,-skill.dorcha)+extra;
 if(run.mp<skill.mp||run.dorcha<required){run.flash={text:'INSUFFICIENT RESOURCES · POLAR VORTEX',time:performance.now(),color:'#fb947a'};return false}
 run.utilityLast.vortex=t;run.mp=clamp(run.mp-skill.mp*(run.renderManaUntil>t?.8:1),0,run.mpMax);
 run.dorcha=clamp(run.dorcha-required+normalHitDorchaGain(),0,DORCHA_MAX);
 run.vortexUntil=t+12;run.vortexTick=t+1;if(run.seething)gainSurgeCharge();
 run.attacks.push({id:'vortex',until:t+.7,seed:Math.floor(Math.random()*1000)});
 run.flash={text:'POLAR VORTEX',time:performance.now(),color:skill.color};spawnParticles('vortex');return true;
}
function activateUtility(id){if(!run||run.paused||!UTILITY_SKILLS.has(id))return false;
 const unlock={render:4,hex:7,mana:9}[id];if(run.level<unlock){run.flash={text:'UNLOCKS AT PROTOCOL '+unlock,time:performance.now(),color:'#f4c6a4'};return false}
 const skill=SKILLS.find(s=>s.id===id),time=now(),last=run.utilityLast[id],cd=profile.cooldowns[id]??skill.cd;
 if(last!=null&&time-last<cd){run.flash={text:skill.name+' · '+Math.ceil(cd-(time-last))+'s',time:performance.now(),color:'#f4c6a4'};return false}
 const dorchaCost=Math.max(0,-skill.dorcha),mpCost=id==='render'?100+run.mpMax*.1:skill.mp;
 if(run.mp+1e-6<mpCost||run.dorcha+1e-6<dorchaCost){run.flash={text:'INSUFFICIENT RESOURCE · '+skill.name,time:performance.now(),color:'#fb947a'};return false}
 run.utilityLast[id]=time;run.mp=clamp(run.mp-mpCost,0,run.mpMax);run.dorcha=clamp(run.dorcha-dorchaCost,0,DORCHA_MAX);
 if(id==='render')run.dorcha=clamp(run.dorcha+5+(time<=run.renderManaUntil?1:0),0,DORCHA_MAX);
 if(id==='mana'){run.mp=clamp(run.mp+run.mpMax*.3,0,run.mpMax);run.renderManaUntil=time+15;}
 if(id==='hex')run.hexUntil=time+10;
 if(run.seething)gainSurgeCharge();
 run.flash={text:skill.name.toUpperCase()+' ACTIVE',time:performance.now(),color:skill.color};run.attacks.push({id,until:time+.7,seed:Math.floor(Math.random()*1000)});return true
}
function miss(e){if(!run)return;e.done=true;run.counts.Miss++;run.combo=0;run.streakToCool=0;run.overheat++;run.overheatFlashUntil=Math.max(run.overheatFlashUntil||0,now()+.55);run.stability=clamp(run.stability-8,0,100);if(run.overheat>=5){run.failReason='Containment overheated';finish(true)}}
function spawnParticles(id){if(thetaLite)return;let c=effectColor(id);for(let i=0;i<13;i++)run.particles.push({x:560+(Math.random()-.5)*85,y:190+(Math.random()-.5)*105,vx:(Math.random()-.5)*140,vy:(Math.random()-.5)*180,life:.4+Math.random()*.55,color:c})}
function toggle(){if(!run)return;if(!run.seething){if(run.mp<50){run.flash={text:'SEETHING MANA · 50 MP REQUIRED',time:performance.now(),color:'#fb947a'};return}run.mp-=50;}run.seething=!run.seething;const btn=thetaButton('toggle');if(btn)btn.innerHTML=thetaSkillIcon('seething')+`<span>${run.seething?'ON':'OFF'}</span>`}
function pause(){if(!run)return;if(run.paused){run.pausedFor+=performance.now()-run.pauseAt;run.last=now();run.paused=false;raf=requestAnimationFrame(frame)}else{run.paused=true;run.pauseAt=performance.now();if(raf)cancelAnimationFrame(raf);raf=0;draw($('theta-canvas').getContext('2d'),run.t,0)}const btn=thetaButton('pause');if(btn)btn.textContent=run.paused?'Resume':'Pause'}
function stop(reset=true){if(raf)cancelAnimationFrame(raf);raf=0;if(reset)run=null}
function finish(forced=false){if(!run)return;if(!forced&&run.level===6&&!run.free&&run.surgeCasts===0){run.failReason='Twilight Surge lesson incomplete · cast Surge at least once';forced=true;}let g=run;stop(false);run=null;const completed=!forced;const percent=Math.round(g.hits/Math.max(1,g.chart.events.length)*100);const grade=percent>=96&&g.counts.Miss===0?'S':percent>=90?'A':percent>=80?'B':percent>=65?'C':'D';let earned=Math.max(10,Math.round(g.score/140)+(completed?75:0));if(!g.free&&!forced){profile.stats.runs++;profile.stats.bestCombo=Math.max(profile.stats.bestCombo,g.best);profile.stats.totalPerfect+=g.perfects;profile.stats.laser+=g.laserHits;profile.stats.seething+=g.seethingHits;if(completed){profile.stats.highest=Math.max(profile.stats.highest,g.level);if(g.level===10)profile.stats.finished++;if(grade!=='D')profile.unlocked=Math.max(profile.unlocked,Math.min(10,g.level+1))}if(!profile.records[g.level]||profile.records[g.level].score<g.score)profile.records[g.level]={score:g.score,grade};profile.credits+=earned;profile.earned+=earned;save()}
lastView='results';view(`<div class="theta-panel theta-results"><small>SUBJECT THETA · PROTOCOL ${g.level}</small><h2>${completed?'Containment Cycle Complete':g.failReason||'Containment Interrupted'}</h2><div class="theta-grade">${grade}</div><h3>${currency(g.score)} points · ${percent}% notes landed</h3><div class="theta-results-grid"><span>Perfect <b>${g.counts.Perfect}</b></span><span>Great <b>${g.counts.Great}</b></span><span>Good <b>${g.counts.Good}</b></span><span>OK <b>${g.counts.Ok||0}</b></span><span>Miss <b>${g.counts.Miss}</b></span><span>Best streak <b>${g.best}</b></span><span>Laser dodges <b>${g.laserHits}</b></span><span>Seething hits <b>${g.seethingHits}</b></span><span>Twilight Surges <b>${g.surgeCasts}</b></span><span>Lucky Strike <b>${g.luckyProcs}</b></span><span>Dark Sigils <b>+${g.free||forced?0:earned}</b></span></div><p>${forced?(g.failReason?'Containment failure: '+esc(g.failReason)+'. No Sigils or progression earned.':'Ending a run early does not earn Sigils or change campaign progression.'):g.free?'Free practice does not modify campaign progression.':grade==='D'?'Repeat this protocol to unlock the next stage.':'New protocol unlocked when available.'}</p>${btn('start','Retry Protocol','primary')} ${btn('menu','Back to protocol menu')}</div>`)}
const lerp=(a,b,t)=>a+(b-a)*t;
// Visual timing geometry is shared by drawing, touch targeting, and judgments.
// The ring is on the track (not below its edge). Notes keep moving through it
// after their nominal hit time, and only become misses after leaving the end.
const THETA_RING_PROGRESS=.90,THETA_TRACK_EXIT=1.035,THETA_RING_X=47,THETA_RING_Y=22;
function thetaProject(lane,p){const ease=p*p;return {x:lerp(450+220*(lane+.5)/4,168+784*(lane+.5)/4,ease),y:298+330*ease}}
function thetaNoteProgress(e,t){return THETA_RING_PROGRESS*(1-(e.t-t)/profile.scroll)}
function thetaNoteShape(e,t){const lane=THETA_LANES.indexOf(e.id);if(lane<0)return null;const p=thetaNoteProgress(e,t);return {p,...thetaProject(lane,p),rx:lerp(12,37,clamp(p,0,1)),ry:lerp(5,12,clamp(p,0,1))}}
function thetaNoteExitDelay(){return (THETA_TRACK_EXIT/THETA_RING_PROGRESS-1)*profile.scroll}
// A visible stationary note at the far end signals the next real scheduled cast
// during cooldowns and long gaps, including while other notes are moving. It is not a synthetic scoring opportunity.
function thetaOnDeck(t){if(!run)return null;const upcoming=run.chart.events.filter(e=>!e.done&&e.ix>=0&&THETA_LANES.includes(e.id));return upcoming.filter(e=>thetaNoteProgress(e,t)<0).sort((a,b)=>a.t-b.t)[0]||null}
function thetaJudgment(e,t){
 if(e.id==='mechanic'){const d=t-e.t;if(Math.abs(d)>.19)return null;const err=Math.abs(d);return err<=.045?'Perfect':err<=(d>=0?.12:.075)?'Great':err<=(d>=0?.17:.13)?'Good':'Ok'}
 const n=thetaNoteShape(e,t);if(!n||n.p<0||n.p>THETA_TRACK_EXIT)return null;
 const ring=thetaProject(THETA_LANES.indexOf(e.id),THETA_RING_PROGRESS);
 // Sample the note's elliptical outline for full containment. A centered note
 // fits, including its rim: precisely the player's desired Perfect judgment.
 let contained=true;for(let i=0;i<24;i++){const a=2*Math.PI*i/24,dx=n.x+Math.cos(a)*n.rx-ring.x,dy=n.y+Math.sin(a)*n.ry-ring.y;if((dx/THETA_RING_X)**2+(dy/THETA_RING_Y)**2>1){contained=false;break}}
 if(contained)return 'Perfect';
 // Area overlap, not just elapsed milliseconds, determines partial hits.
 let count=0,overlap=0;for(let y=-5;y<=5;y++)for(let x=-5;x<=5;x++){if(x*x+y*y>25)continue;count++;const dx=n.x+n.rx*x/5-ring.x,dy=n.y+n.ry*y/5-ring.y;if((dx/THETA_RING_X)**2+(dy/THETA_RING_Y)**2<=1)overlap++}
 const coverage=overlap/Math.max(1,count);if(coverage<=0)return null;
 // Late playable overlap is rewarded more than equivalently early overlap.
 const late=t>=e.t;return coverage>=(late?.48:.78)?'Great':coverage>=(late?.17:.43)?'Good':'Ok';
}
function polygon(ctx,coords,fill,stroke,line=1){ctx.beginPath();coords.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke()}}
function image(ctx,id,x,y,w,h,alpha=1){let im=imgs[id];if(!im?.complete||!im.naturalWidth)return;ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(im,x,y,w,h);ctx.restore()}
function thunderPalette(style){return {default:{main:'#64c4ff',edge:'#eefbff',glow:'#2ea7ff'},white:{main:'#f4fdff',edge:'#ffffff',glow:'#b7f5ff'},purple:{main:'#b77cff',edge:'#f3ddff',glow:'#8d49ff'},red:{main:'#ff6a72',edge:'#ffd7c1',glow:'#ff4e58'},black:{main:'#2d193c',edge:'#ba93ff',glow:'#7f4fd1'}}[style]||{main:'#64c4ff',edge:'#eefbff',glow:'#2ea7ff'}}
function drawThunderSource(c,seed,t,q,style){const pal=thunderPalette(style),sx=882,sy=442;const pulse=1-q,core=18+pulse*11; c.save(); c.translate(sx,sy); c.shadowColor=pal.glow; c.shadowBlur=thetaLite?0:(28); c.globalAlpha=.92; c.strokeStyle=pal.main; c.fillStyle='rgba(255,255,255,.28)'; for(let i=0;i<3;i++){const r=core+12*i+Math.sin(t*10+i+seed)*2; c.globalAlpha=.18+.12*(3-i); c.lineWidth=3-i*.35; c.beginPath(); c.arc(0,0,r,0,Math.PI*2); c.stroke();} c.globalAlpha=.9; c.fillStyle=pal.main; c.beginPath(); c.arc(0,0,core*.62,0,Math.PI*2); c.fill(); c.fillStyle=pal.edge; c.globalAlpha=.72; c.beginPath(); c.arc(-3,-3,core*.28,0,Math.PI*2); c.fill(); for(let i=0;i<10;i++){const ang=i*Math.PI*2/10+t*(1.8+(seed%3))+(seed%7)*.1, r=core+18+(i%2)*8; c.strokeStyle=i%2?pal.edge:pal.main; c.globalAlpha=.35; c.lineWidth=2; c.beginPath(); c.moveTo(Math.cos(ang)*(r-7),Math.sin(ang)*(r-7)); c.lineTo(Math.cos(ang)*r,Math.sin(ang)*r); c.stroke();} c.restore()}
function drawThunderCast(c,a,t,q){const style=cosmeticChoice('thunder'),pal=thunderPalette(style),seed=a.seed||1; const sx=882,sy=442, tx=560,ty=160; drawThunderSource(c,seed,t,q,style); c.save(); c.shadowColor=pal.glow; c.shadowBlur=thetaLite?0:(16); const branchCount=3+((seed%3)&&profile.cosmetics.alternate?1:0); for(let b=0;b<branchCount;b++){const bias=(b-(branchCount-1)/2)*10, amp=44+((seed+b*19)%21); const pts=[[sx+bias,sy-6],[780+bias+(Math.sin(seed+b+t*8)*18),382],[710-bias-(amp*.25),328],[650+bias+(amp*.18),268],[603-bias,212],[tx+((seed+b)%19)-9,ty]]; c.strokeStyle='rgba(255,255,255,.14)'; c.lineWidth=8; c.beginPath(); c.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]); c.stroke(); c.strokeStyle=pal.main; c.lineWidth=4.2+(style==='black'?1.0:0); c.beginPath(); c.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]); c.stroke(); c.strokeStyle=pal.edge; c.lineWidth=1.6; c.beginPath(); c.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]); c.stroke(); } c.globalAlpha=.22; c.fillStyle=pal.edge; c.beginPath(); c.ellipse(tx,ty,30+Math.sin(t*20)*2,20+Math.cos(t*17)*1.5,0,0,Math.PI*2); c.fill(); c.restore(); c.save(); c.globalAlpha=.38-.18*q; drawCosmeticEffect(c,{id:'thunder',seed},t,Math.min(1,q*.92)); c.restore()}
function draw(ctx,t,delta){let c=ctx,W=1120,H=690;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,c.canvas.width,c.canvas.height);c.setTransform(thetaRenderScale,0,0,thetaRenderScale,0,0);let shakeX=0,shakeY=0;if(!thetaLite&&run?.feedbackShake>0){const amp=run.feedbackShake*4.2;shakeX=Math.sin(t*74)*amp;shakeY=Math.cos(t*63)*amp*.7;run.feedbackShake=Math.max(0,run.feedbackShake-delta*3.4)}if(thetaLite&&run?.feedbackShake>0)run.feedbackShake=Math.max(0,run.feedbackShake-delta*3.4);c.save();c.translate(shakeX,shakeY);const bg=c.createLinearGradient(0,0,0,690);bg.addColorStop(0,'#081c2b');bg.addColorStop(.55,'#15313b');bg.addColorStop(1,'#08071a');c.fillStyle=bg;c.fillRect(0,0,W,H);/* The stage uses native painted scenery so no menu or UI artifacts enter gameplay. */
// Depth haze, stars and fractured pillars
for(let i=0;i<14;i++){let x=(i*183+42)%1120,y=25+(i*79)%270;c.fillStyle=`rgba(83,219,233,${.12+.08*Math.sin(t*2+i)})`;c.fillRect(x,y,2,3)}c.fillStyle='#0e091b';for(let i=0;i<7;i++){let x=i*178-10,h=100+(i%3)*35;c.fillRect(x,330-h,16,h+60);c.fillStyle='#265d70';c.fillRect(x+2,330-h,4,h);c.fillStyle='#0e091b'}
// Theta 257: faithful asymmetrical body and independent pose/attack sprites.
// White glowing eyes, charcoal gray flesh, giant blue rune arm, grounded legs and torn cloth.
let iced=t<run.iceSlowUntil,bob=Math.sin((iced?t*.55:t)*1.6)*(iced?2:5),impact=run.attacks.some(a=>a.until>t)||iced;
let upcoming=run.chart.events.filter(e=>e.ix===-1&&!e.done&&e.t>=t-.24&&e.t<=t+1.7).sort((a,b)=>a.t-b.t)[0];
let danger=upcoming?clamp(1-(upcoming.t-t)/1.6,0,1):0;
let pose=impact?'theta-hit':upcoming?(upcoming.kind==='slam'?'theta-slam':danger>.7?'theta-laser':'theta-windup'):'theta-idle';
c.save();c.translate(560,0);let squash=pose==='theta-hit'?.975:pose==='theta-slam'?1.035:1;
c.translate(0,172+bob);c.scale(squash,squash);c.translate(0,-172-bob);
c.shadowColor=iced?'#8feeff':impact?'#ae8fff':danger>.35?'#23c9e0':'#0a629e';c.shadowBlur=thetaLite?0:(iced?38:impact?31:19);
image(c,pose,-205,22+bob,410,306,1);if(iced){c.globalAlpha=.27;c.fillStyle='#9bdeff';c.beginPath();c.ellipse(0,170+bob,165,145,0,0,Math.PI*2);c.fill();c.globalAlpha=1;}
c.restore();
// Blue eyes and giant arm light are intrinsic to the sprite; orange/purple lighting belongs to spells only.
c.save();c.strokeStyle='rgba(59,203,213,.48)';c.lineWidth=3;c.shadowColor='#1ce2f4';c.shadowBlur=thetaLite?0:(14);
c.beginPath();c.ellipse(560,306+bob,170+Math.sin(t*1.8)*5,21,0,0,Math.PI*2);c.stroke();c.restore();
// Theta summons floating carved stone rings bearing Celtic knot-style inscriptions.
// Lasers are turquoise/blue, distinctly opposing the Dark Diviner purple palette.
for(let e of run.chart.events){if(e.ix!==-1||e.done)continue;
  const rem=e.t-t;if(rem>1.75||rem<-.25)continue;
  const p=clamp(1-rem/1.75,0,1),al=.28+.72*p;
  c.save();c.globalAlpha=al;
  if(e.kind==='laser'||e.kind==='swarm'){
    const count=e.kind==='swarm'?5:3;
    for(let n=0;n<count;n++){
      const x=252+n*(e.kind==='swarm'?150:290),y=185+(n%2)*34,rad=e.kind==='swarm'?63:76;
      c.save();c.translate(x,y);c.rotate(Math.sin(t*.8+n)*.12);
      image(c,'theta-rune-ring',-rad,-rad,rad*2,rad*2,.92);
      c.restore();
      const tx=e.kind==='swarm'?175+n*177:145+n*360;
      c.strokeStyle=p>.83?'rgba(121,255,254,.94)':'rgba(74,207,219,.54)';c.lineWidth=p>.83?11:3;c.shadowColor='#35e7ef';c.shadowBlur=thetaLite?0:(p>.83?28:10);
      c.beginPath();c.moveTo(x,y);c.lineTo(tx,625);c.stroke();
      c.strokeStyle='rgba(235,255,255,.82)';c.lineWidth=p>.83?3:1;c.beginPath();c.moveTo(x,y);c.lineTo(tx,625);c.stroke();
    }
  }else if(e.kind==='slam'){
    c.strokeStyle='#72e0ed';c.shadowColor='#76e9ed';c.shadowBlur=thetaLite?0:(17);c.lineWidth=3+8*p;
    c.beginPath();c.ellipse(560,293,90+230*p,25+57*p,0,0,Math.PI*2);c.stroke();
    if(p>.57)image(c,'theta-amber-prison',690,165,195,187,clamp((p-.57)*2,0,.65));
    if(p>.62)image(c,'theta-poison-fog',100,205,830,159,clamp((p-.62)*1.5,0,.62));
  }
  c.restore();
}
// Additional recurring poison / amber visuals mark Theta as a multi-element boss, without
// adding uncharted attacks or changing the rhythm timing.
if(run.level>=7){let drift=Math.sin(t*.34)*19;c.save();c.globalAlpha=.18+.1*Math.sin(t*.43);image(c,'theta-poison-fog',20+drift,250,400,116);image(c,'theta-poison-fog',700-drift,265,400,113);c.restore()}
if(run.level>=9){c.save();c.globalAlpha=.22+.08*Math.sin(t*.6);image(c,'theta-amber-prison',798,228,130,132);c.restore()}
// UI header
c.fillStyle='rgba(3,3,18,.8)';c.fillRect(20,12,1080,44);c.font='bold 19px Georgia';c.fillStyle='#f4e9ff';c.fillText('SUBJECT THETA',36,39);let barW=500; c.fillStyle='#231632';c.fillRect(285,23,barW,18);c.fillStyle='#42c4d4';c.fillRect(285,23,barW*clamp(run.stability/100,0,1),18);c.strokeStyle='#7cdbe5';c.strokeRect(285,23,barW,18);c.font='14px sans-serif';c.fillStyle='#fff';c.fillText(`Containment ${Math.round(run.stability)}%`,797,38);c.textAlign='right';c.fillText(`${Math.floor(t)} / ${Math.round(run.chart.duration)} s`,1076,38);c.textAlign='left';
// Two panels
c.fillStyle='rgba(9,4,30,.8)';c.fillRect(22,72,200,105);c.fillRect(891,72,206,252);c.fillStyle='#ffe0aa';c.font='bold 21px Georgia';c.fillText(`COMBO ${run.combo}`,33,102);c.fillText(`× ${currentMult().toFixed(2)}`,33,131);c.fillStyle='#ddd5fa';c.font='14px sans-serif';c.fillText(`${currency(run.score)} points`,33,157);c.fillText('MP',906,99);c.fillText(`${Math.round(run.mp)} / ${run.mpMax}`,1000,99);c.fillStyle='#182a4a';c.fillRect(906,106,168,10);c.fillStyle='#47b9fc';c.fillRect(906,106,168*run.mp/run.mpMax,10);c.fillStyle='#ddd5fa';c.fillText('DORCHA',906,147);c.fillText(`${Math.round(run.dorcha)} / ${DORCHA_MAX}`,1011,147);c.fillStyle='#34204b';c.fillRect(906,155,168,10);c.fillStyle='#b956ff';c.fillRect(906,155,168*run.dorcha/DORCHA_MAX,10);c.fillStyle=run.seething?'#ffdb81':'#b09aba';c.font='12px sans-serif';c.fillText(run.seething?`Seething ON · −${seethingCost('thunder').toFixed(1)} Thunder`:`Magic +${normalHitDorchaGain().toFixed(1)} / cast`,907,184);
 if(run.castLockUntil>t){c.fillStyle='#f4d2ff';c.font='bold 12px sans-serif';c.fillText(`Casting ${Math.ceil((run.castLockUntil-t)*1000)} ms`,907,202);}else if(run.hexUntil>t){c.fillStyle='#d7aaff';c.font='bold 12px sans-serif';c.fillText(`Hexshroud ${Math.ceil(run.hexUntil-t)}s`,907,202);}
 c.font='12px sans-serif';for(let id of UTILITY_SKILLS){let skill=SKILLS.find(s=>s.id===id),remaining=Math.max(0,(profile.cooldowns[id]??skill.cd)-(t-(run.utilityLast[id]??-1e6))),label={render:'Dorcha',hex:'Hex',mana:'Mana'}[id],status=id==='hex'&&run.hexUntil>t?`${Math.ceil(run.hexUntil-t)}s`:remaining?Math.ceil(remaining)+'s':'READY';c.fillStyle=remaining&&!(id==='hex'&&run.hexUntil>t)?'#e0b6bf':'#a3ffd0';c.fillText(`${profile.keys[id].toUpperCase()} ${label} ${status}`,907,224+18*['render','hex','mana'].indexOf(id))}
 c.fillStyle='#f8ca82';c.font='bold 12px sans-serif';c.fillText(`SURGE ${run.surgeCharge}%`,907,286);c.fillStyle='#332438';c.fillRect(907,293,168,9);c.fillStyle=run.surgeCharge===100?'#ffdc87':'#d69a60';c.fillRect(907,293,168*run.surgeCharge/100,9);c.fillStyle='#f3d7a3';c.font='11px sans-serif';const scd=Math.max(0,(profile.cooldowns.surge??36)-(t-run.surgeLast));c.fillText(run.level<6?'Unlocks at Protocol 6':scd?`Surge ${Math.ceil(scd)}s`:run.surgeCharge===100?'J READY':'J needs 100%',907,316);const vortexButton=thetaButton('utility:vortex');if(vortexButton){const remain=Math.max(0,(profile.cooldowns.vortex??60)-(t-(run.utilityLast.vortex??-1e6)));vortexButton.querySelector('span')&&(vortexButton.querySelector('span').textContent=run.level<8?'LOCK':remain?Math.ceil(remain)+'s':'READY');}const surgeButton=thetaButton('surge');if(surgeButton){const cd=Math.max(0,(profile.cooldowns.surge??36)-(t-run.surgeLast));surgeButton.innerHTML=thetaSkillIcon('surge')+`<span>${run.level<6?'LOCK':cd?Math.ceil(cd)+'s':run.surgeCharge===100?'READY':run.surgeCharge+'%'}</span><i class="theta-surge-fill" style="--surge-charge:${run.surgeCharge}%"></i>`;}
// Receding fretboard: 8 lanes, perspective projection
const laneCount=THETA_LANES.length,L=168,R=952,topL=450,topR=670,topY=298,botY=628,project=thetaProject;polygon(c,[[topL,topY],[topR,topY],[R,botY],[L,botY]],'rgba(10,5,31,.82)','#9955d3',3);for(let i=0;i<=laneCount;i++){let q=i/laneCount;c.strokeStyle='rgba(195,145,255,.42)';c.lineWidth=1.2;c.beginPath();c.moveTo(lerp(topL,topR,q),topY);c.lineTo(lerp(L,R,q),botY);c.stroke()}for(let i=0;i<=9;i++){let y=topY+(botY-topY)*(i/9)**2;c.strokeStyle='rgba(155,85,238,.15)';c.beginPath();c.moveTo(lerp(topL,L,(y-topY)/(botY-topY)),y);c.lineTo(lerp(topR,R,(y-topY)/(botY-topY)),y);c.stroke()}
const overheatPulse=run.overheat>=4?(.65+.18*Math.sin(t*7)):(run.overheatFlashUntil>t?clamp((run.overheatFlashUntil-t)/.55,0,1):0);
if(overheatPulse>0){
 c.save();
 c.strokeStyle=`rgba(255,82,109,${run.overheat>=4?.72:.26+.5*overheatPulse})`;
 c.shadowColor='rgba(255,74,96,.95)';
 c.shadowBlur=thetaLite?0:(run.overheat>=4?34:20+overheatPulse*18);
 c.lineWidth=run.overheat>=4?9:5+overheatPulse*4;
 c.beginPath();c.moveTo(topL,topY);c.lineTo(L,botY);c.stroke();
 c.beginPath();c.moveTo(topR,topY);c.lineTo(R,botY);c.stroke();
 c.beginPath();c.moveTo(L,botY);c.lineTo(R,botY);c.stroke();
 c.restore();
}
if(run.overheat>=4){
 c.save();
 const vg=c.createRadialGradient(560,345,220,560,345,720);
 vg.addColorStop(0,'rgba(255,0,0,0)');
 vg.addColorStop(.68,'rgba(255,20,45,0)');
 vg.addColorStop(1,'rgba(150,0,12,.42)');
 c.fillStyle=vg;c.fillRect(0,0,W,H);
 c.restore();
}
// Fixed timing targets: each offensive lane shows a flat timing ring sized so the note nests inside it at the exact hit moment.
const nearest=run.chart.events.filter(e=>!e.done&&e.ix>=0).sort((a,b)=>Math.abs(a.t-t)-Math.abs(b.t-t))[0];
for(let i=0;i<laneCount;i++){if(THETA_LANES[i]==='surge')continue;
 let pos=project(i,THETA_RING_PROGRESS),match=run.chart.events.find(e=>!e.done&&e.ix===i&&thetaJudgment(e,t)),glow=!!match;
 c.save();c.shadowColor=glow?'#70ffc6':THETA_LANE_SKILLS[i].color;c.shadowBlur=thetaLite?0:(glow?24:9);c.lineWidth=glow?5:2.8;c.strokeStyle=glow?'#a3ffe0':'rgba(244,220,255,.96)';c.fillStyle=glow?'rgba(82,255,183,.18)':'rgba(15,7,35,.48)';c.beginPath();c.ellipse(pos.x,pos.y,THETA_RING_X,THETA_RING_Y,0,0,Math.PI*2);c.fill();c.stroke();c.restore();}
if(nearest){let countdown=Math.round((nearest.t-t)*1000);c.font='bold 19px sans-serif';c.textAlign='center';c.fillStyle=Math.abs(countdown)<=160?'#8dffd3':'#ffe3aa';c.fillText(`${THETA_LANE_SKILLS[nearest.ix].name}: ${countdown>0?'+':''}${countdown} ms`,560,605);c.textAlign='left'}
// Note faces
for(let e of run.chart.events){if(e.done)continue;let p=thetaNoteProgress(e,t);if(p<0||p>THETA_TRACK_EXIT)continue;if(e.ix<0){let q=project(3.5,p);c.save();c.globalAlpha=.4+.55*p;c.fillStyle='#ff6685';c.shadowColor='#ff326b';c.shadowBlur=thetaLite?0:(18);c.beginPath();c.moveTo(q.x,q.y-18);c.lineTo(q.x+20,q.y);c.lineTo(q.x,q.y+18);c.lineTo(q.x-20,q.y);c.closePath();c.fill();c.fillStyle='#fff';c.font='bold 21px sans-serif';c.textAlign='center';c.fillText('!',q.x,q.y+7);c.restore();continue}let q=thetaNoteShape(e,t),w=q.rx,h=q.ry;c.save();c.shadowColor=THETA_LANE_SKILLS[e.ix].color;c.shadowBlur=thetaLite?0:(15);c.fillStyle=THETA_LANE_SKILLS[e.ix].color;c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.ellipse(q.x,q.y,w,h,0,0,Math.PI*2);c.fill();c.stroke();if(thetaJudgment(e,t)){c.strokeStyle='#96ffcd';c.lineWidth=2;c.beginPath();c.ellipse(q.x,q.y,w+4,h+3,0,0,Math.PI*2);c.stroke();}c.restore()}
// At least one real upcoming note is always visible, even across long cooldown gaps.
const onDeck=thetaOnDeck(t);if(onDeck){const q=project(onDeck.ix,0),s=THETA_LANE_SKILLS[onDeck.ix];c.save();c.globalAlpha=.82;c.fillStyle=s.color;c.strokeStyle='#fff';c.lineWidth=1.8;c.beginPath();c.ellipse(q.x,q.y,13,6,0,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#e8e4f7';c.textAlign='center';c.font='bold 11px sans-serif';c.fillText('ON DECK',q.x,q.y-12);c.restore();}
// strike line and keycaps
c.save();c.strokeStyle='#f5d7ff';c.shadowColor='#edb5ff';c.shadowBlur=thetaLite?0:(24);c.lineWidth=5;c.beginPath();c.moveTo(L,botY);c.lineTo(R,botY);c.stroke();c.restore();THETA_LANE_SKILLS.forEach((s,i)=>{let x=L+(R-L)*(i+.5)/laneCount;c.fillStyle='#10071f';c.fillRect(x-38,640,76,39);c.strokeStyle=s.color;c.strokeRect(x-38,640,76,39);c.fillStyle=s.color;c.textAlign='center';c.font='bold 17px sans-serif';c.fillText(profile.keys[s.id].toUpperCase(),x,657);c.font='10px sans-serif';c.fillStyle='#eee0ff';(()=>{const im=imgs['skill-'+s.id];if(im?.complete&&im.naturalWidth)c.drawImage(im,x-12,660,24,24);else c.fillText(s.name.slice(0,10),x,672)})()});c.textAlign='left';
// A separate, slow-moving Twilight Surge note. It deliberately remains visible
// after reaching the strike line; only the introducing lesson has an expiry.
if(run.level>=6){
 const note=surgeNoteState(t),lane=THETA_LANES.indexOf('surge');
 if(note&&note.phase!=='charging'){
  const progress=note.phase==='approaching'?clamp(1-note.remaining/SURGE_NOTE_APPROACH,0,1):1;
  const pos=project(lane,progress),urgent=note.phase==='urgent',waiting=note.phase==='waiting';
  const urgency=urgent?clamp(note.elapsed/SURGE_WARNING_GRACE,0,1):0;
  const frequency=urgent?1.4+urgency*7:1.1,pulse=(1+Math.sin(t*frequency*2*Math.PI))*.5;
  const radius=(waiting?27:29)+pulse*(urgent?8+urgency*21:4);
  c.save();c.shadowColor=urgent?'#ffe1aa':'#ffc57c';c.shadowBlur=thetaLite?0:(urgent?22+urgency*53+pulse*24:15+pulse*9);
  c.fillStyle=urgent?`rgba(255,178,100,${.44+.25*pulse})`:'rgba(255,197,124,.43)';
  c.strokeStyle=urgent?'#fff1c0':'#ffd5a1';c.lineWidth=urgent?3+urgency*4:3;
  c.beginPath();c.arc(pos.x,pos.y,radius,0,Math.PI*2);c.fill();c.stroke();
  c.fillStyle='#fff5d5';c.textAlign='center';c.font='bold 20px sans-serif';c.fillText(profile.keys.surge.toUpperCase(),pos.x,pos.y+7);
  c.textAlign='left';c.restore();
  c.save();c.fillStyle=urgent?'#ffe09b':'#f7d6a7';c.font='bold 14px sans-serif';c.textAlign='center';
  const message=urgent?`SURGE NOW · ${Math.max(0,SURGE_WARNING_GRACE-note.elapsed).toFixed(1)}s${run.surgeCharge<100?' · CHARGE '+run.surgeCharge+'%':''}`:waiting?'SURGE NOTE WAITING · BUILD CHARGE':`SURGE NOTE · ${note.remaining.toFixed(1)}s`;
  c.fillText(message,560,276);c.textAlign='left';c.restore();
 }
}
// Polar Vortex remains visible while it deals homing tick damage, with seasonal particles.
if(!thetaLite&&run.vortexUntil>t&&cosmeticChoice('vortex')!=='default'){c.save();c.globalAlpha=.46+.13*Math.sin(t*3);drawCosmeticEffect(c,{id:'vortex',seed:5},t,.2);c.restore();}
if(!thetaLite&&run.thunderCastUntil>t){const q=1-(run.thunderCastUntil-t)/.92;drawThunderSource(c,run.thunderChargeSeed||1,t,clamp(q,0,1),cosmeticChoice('thunder'));}
// First-person arms and staff, maintained over the note highway foreground edges
const pulse=run.attacks.length&&run.attacks[run.attacks.length-1].until>t,shift=pulse?Math.sin(t*33)*10:Math.sin(t*2)*4;image(c,'first-person-left',-50,410+shift,300,296,.95);image(c,'first-person-staff',880,375-shift,270,315,.96);
// Animated spell effect arcs and stage impacts
for(let a of run.attacks){let q=1-(a.until-t)/.7;if(q<0||q>1)continue;let col=effectColor(a.id);let damaging=['thunder','blight','flare','surge','vortex','ice'].includes(a.id);c.save();c.globalAlpha=clamp(1-q*.85,0,1);c.shadowColor=col;c.shadowBlur=thetaLite?0:(24);c.lineWidth=6*(1-q)+1;if(damaging){let size=a.id==='surge'?320:220;if(a.id==='thunder'){if(thetaLite)image(c,'effect-thunder',460,70,200,200);else drawThunderCast(c,a,t,q)}else if(a.id==='ice'){c.strokeStyle='#bdf5ff';c.lineWidth=9;c.beginPath();c.arc(560,157,100+q*40,0,Math.PI*2);c.stroke()}else if(thetaLite||cosmeticChoice(a.id)==='default')image(c,'effect-'+a.id,560-size*.5,157-size*.5,size,size);else drawCosmeticEffect(c,a,t,q);
if(a.id==='blight'){c.strokeStyle=col;c.beginPath();c.moveTo(546,0);c.lineTo(555+Math.sin(t*39)*30,100);c.lineTo(546,176);c.stroke()}}else{let size=230;image(c,'effect-'+a.id,830,360,size,size)}c.restore()}
for(let b of (thetaLite?[]:(run.thunderBursts||[]))){const life=(b.until-b.start)||.24,p=clamp((t-b.start)/life,0,1),pal=thunderPalette(cosmeticChoice('thunder')); c.save(); c.globalAlpha=1-p; c.strokeStyle=pal.edge; c.shadowColor=pal.glow; c.shadowBlur=thetaLite?0:(16); c.lineWidth=3; c.beginPath(); c.arc(560,168,18+p*30,0,Math.PI*2); c.stroke(); for(let i=0;i<6;i++){const ang=i*Math.PI/3+b.seed*.01, r=24+p*28; c.strokeStyle=i%2?pal.main:pal.edge; c.beginPath(); c.moveTo(560+Math.cos(ang)*(r-8),168+Math.sin(ang)*(r-8)); c.lineTo(560+Math.cos(ang)*(r+8),168+Math.sin(ang)*(r+8)); c.stroke();} c.restore()}
for(let p of run.particles){p.x+=p.vx*delta;p.y+=p.vy*delta;p.life-=delta;if(p.life>0){c.fillStyle=p.color;c.globalAlpha=clamp(p.life*1.4,0,1);c.fillRect(p.x,p.y,4,4)}}c.globalAlpha=1;run.thunderBursts=(run.thunderBursts||[]).filter(b=>b.until>t);run.particles=run.particles.filter(p=>p.life>0);run.attacks=run.attacks.filter(a=>a.until>t);
if(run.flash&&performance.now()-run.flash.time<680){c.fillStyle=run.flash.color;c.shadowBlur=thetaLite?0:(19);c.shadowColor=c.fillStyle;c.font='bold 37px Georgia';c.textAlign='center';c.fillText(run.flash.text,560,442);c.shadowBlur=thetaLite?0:(0);c.textAlign='left'}
c.restore();
if(run.paused){c.fillStyle='rgba(5,3,15,.72)';c.fillRect(0,0,W,H);c.fillStyle='#fff';c.font='bold 42px Georgia';c.textAlign='center';c.fillText('PAUSED',560,350);c.textAlign='left'}
}
function drawCosmeticEffect(c,a,t,q){
 const id=a.id,style=cosmeticChoice(id),color=effectColor(id),alt=profile.cosmetics.alternate;
 const seed=a.seed||1;
 const rand=(n)=>{
  const x=Math.sin(seed*97+n*57.13)*43758.5453;
  return x-Math.floor(x);
 };
 const secondary={
  thunder:{default:'#dff6ff',white:'#d7fbff',purple:'#f2d6ff',red:'#ffd4b8',black:'#9b72d3'},
  flare:{default:'#ffd2ff',ember:'#ffb8e4',void:'#a88cff',burn:'#ffd4fa'},
  vortex:{default:'#e4c8ff',winter:'#ffffff',spring:'#d6ffd7',summer:'#ffd2a8',autumn:'#ffd38b',icicle:'#dff7ff'}
 }[id]?.[style]||'rgba(255,255,255,.75)';
 c.save();
 c.translate(560,160);
 c.shadowColor=color;
 c.shadowBlur=thetaLite?0:(id==='flare'?44:32);
 c.lineCap='round';
 c.lineJoin='round';
 if(id==='thunder'){
  const branchCount=alt?3+(seed%3):3;
  const glowW=style==='black'?10:8;
  c.globalAlpha=.10+.08*(1-q);
  c.fillStyle=secondary;
  c.beginPath();
  c.ellipse(0,82,36,82,0,0,Math.PI*2);
  c.fill();
  for(let n=0;n<branchCount;n++){
   const sway=(n-(branchCount-1)/2)*22;
   const forkBias=(rand(n+3)-.5)*18;
   const pts=[];
   for(let k=0;k<7;k++)pts.push([sway+(rand(n*10+k)-.5)*(18+k*4)+Math.sin(t*16+n+k)*2,-178+k*55]);
   c.strokeStyle='rgba(255,255,255,.18)';
   c.lineWidth=glowW;
   c.beginPath(); c.moveTo(pts[0][0],pts[0][1]);
   for(let k=1;k<pts.length;k++)c.lineTo(pts[k][0],pts[k][1]);
   c.stroke();
   c.strokeStyle=color;
   c.lineWidth=style==='black'?6:4.5;
   c.beginPath(); c.moveTo(pts[0][0],pts[0][1]);
   for(let k=1;k<pts.length;k++)c.lineTo(pts[k][0],pts[k][1]);
   c.stroke();
   c.strokeStyle=secondary;
   c.lineWidth=1.8;
   c.beginPath(); c.moveTo(pts[0][0],pts[0][1]);
   for(let k=1;k<pts.length;k++)c.lineTo(pts[k][0],pts[k][1]);
   c.stroke();
   for(let f=2;f<6;f+=2){
    c.strokeStyle='rgba(255,255,255,.42)';
    c.lineWidth=2.2;
    c.beginPath();
    c.moveTo(pts[f][0],pts[f][1]);
    c.lineTo(pts[f][0]+((f%4)?22:-18)+forkBias,pts[f][1]+18+rand(f)*18);
    c.stroke();
   }
  }
  c.globalAlpha=.95;
  c.strokeStyle=secondary;
  c.lineWidth=3;
  c.beginPath();
  c.moveTo(0,-176);c.lineTo((rand(41)-.5)*28,-72);c.lineTo((rand(42)-.5)*12,44);c.lineTo(0,172);
  c.stroke();
  c.globalAlpha=.28;
  c.strokeStyle=color;
  c.lineWidth=5;
  c.beginPath();
  c.arc(0,165,26+Math.sin(t*18)*3,0,Math.PI*2);
  c.stroke();
  for(let i=0;i<11;i++){
   const ang=i*Math.PI*2/11+t*4*rand(i+70),r=26+rand(i+17)*48;
   c.fillStyle=secondary;
   c.globalAlpha=.26+.2*rand(i+50);
   c.beginPath();c.arc(Math.cos(ang)*r,138+Math.sin(ang)*r*.4,1.5+rand(i+80)*2.2,0,Math.PI*2);c.fill();
  }
 }else if(id==='flare'){
  const orbR=style==='void'?34:style==='burn'?46:40;
  c.globalAlpha=.18;
  c.fillStyle=secondary;
  c.beginPath();c.arc(0,0,orbR+32,0,Math.PI*2);c.fill();
  c.globalAlpha=.9;
  const tongues=style==='burn'?14:style==='ember'?11:style==='void'?8:9;
  for(let n=0;n<tongues;n++){
   const a0=n*Math.PI*2/tongues + (alt?Math.sin(t*1.9+n+seed*.02)*.2:0);
   const r1=style==='void'?55:70;
   const r2=r1+52+rand(n+20)*28+q*24;
   c.strokeStyle=n%2?secondary:color;
   c.lineWidth=style==='burn'?9:style==='void'?7:6;
   c.globalAlpha=.28+.4*(1-q);
   c.beginPath();
   c.moveTo(Math.cos(a0)*14,Math.sin(a0)*14);
   c.quadraticCurveTo(Math.cos(a0)*r1,Math.sin(a0)*r1,Math.cos(a0+.22)*r2,Math.sin(a0+.22)*r2);
   c.stroke();
  }
  if(style==='void'){
   c.globalAlpha=.9;
   c.fillStyle='#2b1548';
   c.beginPath();c.arc(0,0,28,0,Math.PI*2);c.fill();
   c.strokeStyle=secondary;c.lineWidth=3;
   for(let i=0;i<3;i++){
    c.beginPath();c.arc(0,0,36+i*10+Math.sin(t*3+i)*2,(-.5+i*.6),(.8+i*.7));c.stroke();
   }
  }else{
   c.globalAlpha=.95;
   c.fillStyle=color;
   c.beginPath();c.arc(0,0,orbR,0,Math.PI*2);c.fill();
   c.globalAlpha=.65;
   c.fillStyle=secondary;
   c.beginPath();c.arc(-6,-6,orbR*.45,0,Math.PI*2);c.fill();
  }
  if(style==='ember'||style==='burn'){
   for(let n=0;n<16;n++){
    const ex=Math.sin(t*2.6+n*1.7+seed)* (56+rand(n+100)*52), ey=Math.cos(t*3.4+n*1.2+seed*.5)*(28+rand(n+140)*34);
    c.globalAlpha=.28+.28*rand(n+160);
    c.fillStyle=n%3?secondary:'#ffb3cf';
    c.fillRect(ex,ey,2+rand(n+200)*3,4+rand(n+220)*6);
   }
  }
  c.globalAlpha=.4;
  c.strokeStyle=color;
  c.lineWidth=4;
  c.beginPath();c.moveTo(-86,0);c.lineTo(-132,0);c.stroke();
 }else if(id==='vortex'){
  const configs={default:{rings:['#b068ff','#e2b6ff'],speed:1.35,scale:.62},winter:{rings:['#dffaff','#ffffff'],speed:1.15,scale:.6},spring:{rings:['#72d783','#d8ffd9'],speed:1.2,scale:.66},summer:{rings:['#f0a65f','#ffd5a5'],speed:.72,scale:.58},autumn:{rings:['#d56a3a','#ffcb70'],speed:1.0,scale:.62},icicle:{rings:['#8fdcff','#f2ffff'],speed:1.1,scale:.64}}[style];
  c.scale(1,configs.scale);
  for(let ring=0;ring<3;ring++){
   const rr=44+ring*26+q*18, rot=t*configs.speed*(ring%2?1:-1)+ring;
   c.strokeStyle=configs.rings[ring%2];
   c.globalAlpha=.24+.18*(2-ring);
   c.lineWidth=7-ring*1.5;
   c.beginPath();
   for(let a1=0;a1<=Math.PI*2+.01;a1+=Math.PI/16){
    const wob=1+(style==='summer'?Math.sin(a1*3+t*2+ring)*.08:Math.sin(a1*4+t*3+ring)*.04);
    const x=Math.cos(a1+rot)*rr*wob, y=Math.sin(a1+rot)*rr*(1.35+.08*ring)*wob;
    if(a1===0)c.moveTo(x,y); else c.lineTo(x,y);
   }
   c.closePath();
   c.stroke();
  }
  const pieces=style==='icicle'?16:style==='autumn'?16:18;
  for(let n=0;n<pieces;n++){
   const a0=n*Math.PI*2/pieces+t*configs.speed*(n%2?1.6:-1.2),r=28+(n%5)*16+q*18,x=Math.cos(a0)*r,y=Math.sin(a0)*r*1.28;
   c.globalAlpha=.38+.2*(n%3===0);
   if(style==='autumn'){
    c.fillStyle=['#c95539','#e9a94a','#a66333','#df6f2e'][n%4];
    c.beginPath();c.ellipse(x,y,8,4,a0,0,Math.PI*2);c.fill();
    c.strokeStyle='rgba(80,40,12,.35)';c.lineWidth=1;c.beginPath();c.moveTo(x-4*Math.cos(a0),y-4*Math.sin(a0));c.lineTo(x+5*Math.cos(a0),y+5*Math.sin(a0));c.stroke();
   }else if(style==='icicle'){
    c.fillStyle=n%2?secondary:color;
    c.beginPath();c.moveTo(x,y-13);c.lineTo(x+7,y+4);c.lineTo(x,y+12);c.lineTo(x-6,y+4);c.closePath();c.fill();
   }else if(style==='summer'){
    c.strokeStyle=n%2?secondary:color;
    c.lineWidth=4;
    c.beginPath();
    c.moveTo(x-18,y);
    c.bezierCurveTo(x-3,y-18-rand(n+300)*10,x+7,y+18+rand(n+330)*12,x+20,y+2);
    c.stroke();
   }else if(style==='spring'){
    c.fillStyle=n%2?secondary:color;
    c.beginPath();
    c.ellipse(x,y,8,3.6,a0,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(x+Math.cos(a0)*3,y+Math.sin(a0)*3,2.4,0,Math.PI*2);c.fill();
   }else {
    c.strokeStyle=n%2?secondary:color;
    c.lineWidth=3;
    c.beginPath();
    c.moveTo(x-12,y);
    c.quadraticCurveTo(x+Math.sin(t+n)*9,y-14,x+15,y+5);
    c.stroke();
    if(style==='winter'){
      c.fillStyle=secondary;
      c.beginPath();c.arc(x,y,2.4+rand(n+360)*1.3,0,Math.PI*2);c.fill();
      c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y);c.moveTo(x,y-4);c.lineTo(x,y+4);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.4;c.stroke();
    }
   }
  }
 }
 c.restore();
}
function beatSound(strong){if(!profile.sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();let osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.setValueAtTime(strong?780:530,audio.currentTime);gain.gain.setValueAtTime(.055,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+.055);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+.058)}catch{}}
function spellSound(id,variant='cast'){if(!profile.sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const nowT=audio.currentTime;if(id==='thunder'){const g=audio.createGain();g.gain.setValueAtTime(.001,nowT);g.gain.exponentialRampToValueAtTime(variant==='surge'?.055:.04,nowT+.012);g.gain.exponentialRampToValueAtTime(.0001,nowT+.28);g.connect(audio.destination);[['sawtooth',variant==='surge'?170:150],['triangle',variant==='surge'?320:280],['square',variant==='surge'?93:82]].forEach(([type,f],i)=>{const o=audio.createOscillator();o.type=type;o.frequency.setValueAtTime(f,nowT);o.frequency.exponentialRampToValueAtTime(f*(i===1?2.8:1.85),nowT+.11);o.connect(g);o.start();o.stop(nowT+.28)});const crack=audio.createBufferSource(),len=.075,samples=Math.max(1,Math.floor(audio.sampleRate*len)),buf=audio.createBuffer(1,samples,audio.sampleRate),arr=buf.getChannelData(0);for(let i=0;i<samples;i++)arr[i]=(Math.random()*2-1)*(1-i/samples);crack.buffer=buf;const ng=audio.createGain();ng.gain.setValueAtTime(.018,nowT);ng.gain.exponentialRampToValueAtTime(.0001,nowT+len);crack.connect(ng);ng.connect(audio.destination);crack.start(nowT);return} if(id==='thunderHit'){let osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';osc.frequency.setValueAtTime(660,nowT);osc.frequency.exponentialRampToValueAtTime(420,nowT+.055);gain.gain.setValueAtTime(.012,nowT);gain.gain.exponentialRampToValueAtTime(.0001,nowT+.06);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(nowT+.062)}}catch{}}
function thunderPulse(t){if(!run)return;run.thunderHits=run.thunderHits.filter(hitAt=>{if(hitAt>t)return true;if(run.hexUntil>=hitAt)run.dorcha=clamp(run.dorcha+.5,0,DORCHA_MAX);(run.thunderBursts||(run.thunderBursts=[])).push({start:hitAt,until:hitAt+.24,seed:Math.floor(Math.random()*1000)});run.feedbackShake=Math.max(run.feedbackShake||0,.18);for(let i=0;i<(thetaLite?0:5);i++)run.particles.push({x:550+(Math.random()-.5)*54,y:170+(Math.random()-.5)*46,vx:(Math.random()-.5)*90,vy:-35-Math.random()*90,life:.18+Math.random()*.22,color:effectColor('thunder')});spellSound('thunderHit');return false;})}
function vortexPulse(t){if(!run||run.vortexUntil<=0)return;while(run.vortexTick<=t&&run.vortexTick<=run.vortexUntil){let points=24*(run.seething?1.3:1)*currentMult()*(1+.05*profile.upgrades.power);run.score+=Math.round(points);if(run.hexUntil>=run.vortexTick)run.dorcha=clamp(run.dorcha+.5,0,DORCHA_MAX);run.vortexTick+=1;}if(t>=run.vortexUntil)run.vortexUntil=0;}
function frame(){if(!run||run.paused)return;if(!$('theta-canvas')){stop();return}let time=now();let delta=clamp(time-run.last,0,.05);run.last=time;run.t=time;thunderPulse(time);vortexPulse(time);icePulse(time);let beat=Math.floor(time/.5625);if(beat>run.beatIndex){run.beatIndex=beat;beatSound(beat%4===0)}for(let e of run.chart.events){if(!run)return;if(!e.done&&time>e.t+thetaNoteExitDelay())miss(e)}if(!run)return;if(run.chart.events.length&&run.chart.events.every(e=>e.done)&&(run.hits+run.counts.Miss)>0){finish(false);return}const surgeNote=surgeNoteState(time);if(run.level===6&&surgeNote?.phase==='urgent'&&surgeNote.elapsed>=SURGE_WARNING_GRACE){run.failReason='Twilight Surge note expired';finish(true);return}if(time>=run.chart.duration+1.1){finish(false);return}if(!thetaLite||!run.lastDrawTime||time-run.lastDrawTime>=1/30){const elapsed=clamp(time-(run.lastDrawTime||time),0,.075);run.lastDrawTime=time;draw($('theta-canvas').getContext('2d'),time,elapsed)}let live=$('theta-live');if(live&&(!run.lastLiveAt||time-run.lastLiveAt>=.14)){run.lastLiveAt=time;live.textContent=`${currency(run.score)} score · Surge ${run.surgeCharge}%${surgeNote&&surgeNote.phase!=='charging'?' · Note '+(surgeNote.phase==='approaching'?Math.ceil(surgeNote.remaining)+'s':surgeNote.phase==='urgent'?'URGENT '+Math.max(0,Math.ceil(SURGE_WARNING_GRACE-surgeNote.elapsed))+'s':'WAITING'):''} · misses ${run.overheat}/5 · ${run.combo} streak · ×${currentMult().toFixed(2)} · ${Math.round(run.stability)}% Containment · Vivace +${Math.round(castingBonus()*100)}% · Thunder ${castDuration('thunder').toFixed(2)}s${profile.upgrades.ergS50?' · S50':''}`}raf=requestAnimationFrame(frame)}
function press(e){if(!run||!$('theta-canvas')||e.repeat)return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;let key=e.key.toLowerCase();if(key==='escape'){e.preventDefault();e.stopImmediatePropagation();pause();return}if(run.paused)return;if(key===profile.seethingKey.toLowerCase()){e.preventDefault();e.stopImmediatePropagation();toggle();return}if(key===profile.mechanicKey.toLowerCase()){e.preventDefault();e.stopImmediatePropagation();hit('mechanic');return}let match=SKILLS.find(s=>profile.keys[s.id].toLowerCase()===key);if(match){e.preventDefault();e.stopImmediatePropagation();hit(match.id)}}
document.addEventListener('keydown',e=>{if(keyCapture){e.stopImmediatePropagation();if(e.key==='Escape'){keyCapture=null;menu();return}if(e.key==='Tab'||e.key==='Shift'||e.key==='Control'||e.key==='Alt')return;e.preventDefault();let value=e.key.toLowerCase();if(e.ctrlKey||e.altKey||e.metaKey||value.length!==1){return}const original=keyCapture==='seething'?profile.seethingKey:keyCapture==='mechanic'?profile.mechanicKey:profile.keys[keyCapture];const assigned=[...Object.entries(profile.keys).filter(([id])=>id!==keyCapture).map(([,v])=>v),...(keyCapture==='seething'?[]:[profile.seethingKey]),...(keyCapture==='mechanic'?[]:[profile.mechanicKey])];if(assigned.includes(value)){const hint=document.getElementById('theta-bind-error');if(hint)hint.textContent='That key is already assigned. Choose a free key.';return}if(keyCapture==='seething')profile.seethingKey=value;else if(keyCapture==='mechanic')profile.mechanicKey=value;else profile.keys[keyCapture]=value;keyCapture=null;save();menu();return}press(e)},true);
document.addEventListener('change',e=>{const el=e.target.closest('[data-theta-cosmetic]');if(!el)return;const id=el.dataset.thetaCosmetic,tier=COSMETIC_TIER[id]||1;if(profile.upgrades.show<tier)return;const val=id==='enabled'||id==='alternate'?el.checked:el.value;if(id in COSMETIC_OPTIONS&&!COSMETIC_OPTIONS[id].some(o=>o[0]===val))return;profile.cosmetics[id]=val;save();});
document.addEventListener('click',e=>{let b=e.target.closest('[data-theta]');if(!b)return;let [cmd,arg]=b.dataset.theta.split(':');if(cmd==='start')start(false);else if(cmd==='practice')start(true);else if(cmd==='menu')menu();else if(cmd==='pause')pause();else if(cmd==='sound'){profile.sound=!profile.sound;save();b.textContent=profile.sound?'Sound ON':'Sound OFF'}else if(cmd==='end')finish(true);else if(cmd==='toggle')toggle();else if(cmd==='utility'){if(arg==='vortex')activateVortex();else activateUtility(arg);}else if(cmd==='surge')activateSurge();else if(cmd==='lane')hit(arg);else if(cmd==='mechanic')hit('mechanic');else if(cmd==='ice')activateIce();else if(cmd==='tab'){activeTab=arg;menu()}else if(cmd==='level'){if(+arg<=profile.unlocked||window.MIDIR_RUNTIME_SCOPE?.active){profile.level=+arg;save();menu()}}else if(cmd==='bind'){keyCapture=arg;b.textContent='Press a key…';b.focus()}else if(cmd==='save-settings'){for(let input of document.querySelectorAll('[data-theta-cd]'))profile.cooldowns[input.dataset.thetaCd]=clamp(Number(input.value)||0,0,120);profile.offset=clamp(Number($('theta-offset')?.value)||0,-250,250);profile.scroll=clamp(Number($('theta-scroll')?.value)||3,1,5);profile.graphicsMode=['auto','performance','full'].includes($('theta-graphics')?.value)?$('theta-graphics').value:'auto';save();menu()}else if(cmd==='reset-keys'){profile.keys=defaultData().keys;profile.seethingKey='q';profile.mechanicKey=' ';save();menu()}else if(cmd==='exchange'){const cost=exchangePrices[arg],rewardId={stoneRed:'red',stoneBlue:'blue',stoneProtectRed:'pred',stoneProtectBlue:'pblue'}[arg];if(Number.isFinite(cost)&&profile.credits>=cost){let success=false;if(rewardId&&window.MIDIR_SPECIAL_UPGRADE?.reward){window.MIDIR_SPECIAL_UPGRADE.reward(rewardId,1);success=true}else if(arg==='ergPotion'&&window.MIDIR_REFORGE?.addPotion){success=window.MIDIR_REFORGE.addPotion(1)===true}if(success){profile.credits-=cost;save();menu()}}}else if(cmd==='tradeS50'){if(!profile.upgrades.ergS50&&window.MIDIR_ERG?.consumeSavedS50Staff?.(arg)){profile.upgrades.ergS50=1;save();menu()}}else if(cmd==='buy'){if(window.MIDIR_RUNTIME_SCOPE?.active&&arg in maxLvl){profile.upgrades[arg]=profile.upgrades[arg]?0:maxLvl[arg];save();menu();return;}let cost=price(arg);if(arg in maxLvl&&profile.credits>=cost&&profile.upgrades[arg]<maxLvl[arg]){profile.credits-=cost;profile.upgrades[arg]++;save();menu()}}});
window.MIDIR_THETA={view:viewMarkup,mount(){if($('theta-root')){if(run){stop();run=null}menu()}},exportState:()=>JSON.parse(JSON.stringify(profile)),importState:data=>{if(!data||typeof data!=='object'||Array.isArray(data)||!data.keys||!data.upgrades||JSON.stringify(data).length>200000)throw Error('Invalid Theta save');profile={...defaultData(),...data,keys:{...defaultData().keys,...data.keys},upgrades:{...defaultData().upgrades,...data.upgrades},stats:{...defaultData().stats,...data.stats},cooldowns:{...defaultData().cooldowns,...data.cooldowns}};migrateThetaRules(profile);save();if($('theta-root'))menu()},achievements:()=>achievements.map(([id,title,check])=>({id,title,unlocked:!!check(profile.stats)}))};
})();
