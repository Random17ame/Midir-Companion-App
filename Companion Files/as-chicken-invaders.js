/* Alchemic Sharpshooter — Crom Bas Invaders. 50-wave arcade, offline persistent progression. */
(()=>{'use strict';
const KEY='midir-as-crom-invaders-v1',BONUS='midir-as-crom-global-bonuses-v1';
const skillDefs=[
 {id:'urgent',name:'Urgent Shot',cd:6,cost:30,damage:2,description:'Light arrow; Archery Enhancement +10% for 10 seconds',key:'1'},
 {id:'ignis',name:'Ignis Plume',cd:6,cost:45,damage:36,description:'Burning path and three expanding fire blasts',key:'2'},
 {id:'aqua',name:'Aqua Volley',cd:10,cost:60,damage:30,description:'Charge a piercing fan of five water arrows',key:'3'},
 {id:'crash',name:'Crash Shot',cd:3.75,cost:90,damage:20,description:'Impact plus shrapnel',key:'4'},
 {id:'ventus',name:'Ventus Howl',cd:10,cost:80,damage:12,description:'Weak wind tunnel that drags enemies inward',key:'5'},
 {id:'terra',name:'Terra Scourge',cd:24,cost:110,damage:90,description:'Charge placement, then repeated earth strikes',key:'6'},
 {id:'tri',name:'Tri-Assault',cd:36,cost:150,damage:75,description:'Three massive arrows',key:'7'},
 {id:'golden',name:'Golden Time',cd:162,cost:230,damage:0,description:'Brief rapid-fire surge',key:'8'},
 {id:'anchor',name:'Anchor Rush',cd:0,cost:95,damage:0,description:'Spend 1 Dorcha to anchor and dash with 0.5s invulnerability',key:'9'}
];
const SKILL_ICONS={
 urgent:'assets/icons/skills/GUI_icon_skill_003_4_8.png',
 ignis:'assets/icons/skills/gui_icon_skill_005_3_7.png',
 aqua:'assets/icons/skills/gui_icon_skill_005_4_7.png',
 crash:'assets/icons/skills/gui_icon_skill_001_5_12.png',
 ventus:'assets/icons/skills/gui_icon_skill_005_5_7.png',
 terra:'assets/icons/skills/gui_icon_skill_005_6_7.png',
 tri:'assets/icons/skills/gui_icon_skill_005_7_7.png',
 golden:'assets/icons/skills/gui_icon_skill_003_7_1.png',
 anchor:'assets/crom/anchor-rush-icon.png'
};
const CAMP_IMAGES={};
for(const [id,src] of Object.entries({cathedral:'assets/crom/camp/crom-cathedral-ref-1.jpg',entry:'assets/crom/camp/crom-cathedral-ref-2.jpg'})){
 const im=new Image();im.src=src;CAMP_IMAGES[id]=im;
}
const shop=[
 {id:'maxhp',name:'Maximum Health +1',cost:18,desc:'Permanently add one HP in Crom Bás Invaders',max:10,fragments:true},
 {id:'limit',name:'Limit Break Luck',cost:12,desc:'Better Limit Break odds',max:5},
 {id:'herb',name:'Huge Lucky Harvest',cost:10,desc:'Improve 20× herb harvest chance',max:5},
 {id:'ducats',name:'Bandit Bonus',cost:10,desc:'Earn extra ducats',max:5},
 {id:'tickets',name:'Tower Tickets',cost:8,desc:'Bonus EV tower tickets',max:10},
 {id:'red',name:'Red Upgrade Stone',cost:2,stone:'red'},
 {id:'blue',name:'Blue Upgrade Stone',cost:2,stone:'blue'},
 {id:'pred',name:'Protective Red Stone',cost:12,stone:'pred'},
 {id:'pblue',name:'Protective Blue Stone',cost:12,stone:'pblue'},
 {id:'ladeca',name:'Ladeca Red Stone',cost:5,stone:'ladeca'},
 {id:'eweca',name:'Eweca Blue Stone',cost:5,stone:'eweca'},
 {id:'pladeca',name:'Protective Ladeca Stone',cost:22,stone:'pladeca'},
 {id:'peweca',name:'Protective Eweca Stone',cost:22,stone:'peweca'},
 ];
const seed=()=>({fragments:0,chunks:0,best:0,clears:0,kills:0,attempts:0,skills:{},hotbar:['urgent','ignis','aqua','crash','ventus','terra','tri','golden',null],reforges:{crashCount:0,crashRadius:0,crashPower:0,magnumPower:0},purchases:{},stoneRewards:0,bossWins:{},minibossWins:0,highestCycle:0,waveClears:0,spentFragments:0,spentChunks:0});
let profile=seed();try{profile={...seed(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{}
profile.linkLevel=Math.max(0,Math.min(10,Number(profile.linkLevel)||0));profile.skills ||= {};profile.reforges||={};profile.purchases||={};profile.hotbar=Array.isArray(profile.hotbar)?[...profile.hotbar.slice(0,9),...Array(Math.max(0,9-profile.hotbar.length)).fill(null)]:['urgent','ignis','aqua','crash','ventus','terra','tri','golden',null];
let phase='menu',modal='',canvas=null,ctx=null,raf=0,last=0,world=null,keys=new Set(),mouse={x:400,y:490,active:false},note='',shopGuardUntil=0,dragSkillId='',pauseDrawerOpen=false;
// 281: touch state stays inside the Invaders module and never changes desktop key bindings.
const invadersMobile=()=>!!(navigator.userAgentData?.mobile||/iPhone|iPod|Android.*Mobile/i.test(navigator.userAgent||'')||(/Android/i.test(navigator.userAgent||'')&&matchMedia('(pointer: coarse) and (max-width: 900px)').matches));
const touchMove={x:0,y:0,pointer:null,struggleSide:null};
const touchHolds=new Map();
function resetTouch(){touchMove.x=touchMove.y=0;touchMove.pointer=null;touchMove.struggleSide=null;touchHolds.clear();}

// Cari's baseline protection equals two UNUPGRADED automatic Magnum Shots.
const BASE_MAGNUM_DAMAGE=18;
const CARI_SHIELD_POOL=2*BASE_MAGNUM_DAMAGE;
// Ronaun baseline shield absorbs one unupgraded Magnum Shot; stronger attacks overflow.
const RONAUN_SHIELD_POOL=BASE_MAGNUM_DAMAGE;
// Defensive proximity fire: close enough to punish flanking melee mobs, not a ranged substitute.
const BASIC_RANGED_RANGE=115;
// Keep defensive auto-fire in step with Magnum Shot (including Golden Time boosts).
const harmFactor=()=>linkAt(10)?.8:1;const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));const rand=(a,b)=>a+Math.random()*(b-a);
function persist(){try{localStorage.setItem(KEY,JSON.stringify(profile))}catch{}}
function bonus(){try{return JSON.parse(localStorage.getItem(BONUS)||'{}')}catch{return {}}}
function saveBonus(v){try{localStorage.setItem(BONUS,JSON.stringify(v))}catch{}}
function extStone(id){try{const api=window.MIDIR_SPECIAL_UPGRADE;if(api?.reward){api.reward(id,1);return true;}}catch{}return false}
function skillDef(id){return skillDefs.find(s=>s.id===id)}
function hotbarSkillAt(slot){return profile.hotbar?.[slot-1]||null}
function setHotbarSkill(slot,id){if(slot<1||slot>skillDefs.length)return;const next=(profile.hotbar||skillDefs.map(s=>s.id)).slice(0,skillDefs.length);const from=next.indexOf(id);const prev=next[slot-1];if(from>=0)next[from]=prev||null;next[slot-1]=id;profile.hotbar=next;persist();}
function assignedKey(id){const idx=(profile.hotbar||[]).indexOf(id);return idx>=0?String(idx+1):'–'}
function skillIcon(id){return SKILL_ICONS[id]||''}
function skillByKey(k){const n=Number(k);if(!Number.isInteger(n)||n<1||n>skillDefs.length)return null;return hotbarSkillAt(n)}
function closeMenuModal(){modal='';mouse.active=false;shopGuardUntil=Date.now()+450;menuHero.x=Math.min(menuHero.x,520);refreshShell();}
const LINK_COSTS=[20,35,55,80,115,155,205,265,335,425];
const LINK_TEXT=['I · +2 maximum HP','II · Skill movement +20%','III · Ventus tunnel +3m width','IV · Ignis radius 30% of max Crash AoE','V · +20% Tri damage; +5% archery','VI · Elemental generation +30%','VII · Terra duration +7s','VIII · Aqua charge -50%; charged damage +30%','IX · Range damage +1% per meter (max 15%)','X · Hermetic Harmony: stronger damage over time and protection'];
function linkLevel(){return Math.max(0,Math.min(10,Number(profile.linkLevel)||0));}
function linkAt(n){return linkLevel()>=n;}
function linkCost(n){return LINK_COSTS[n-1]||0;}
function maxHeroHP(){return 5+Math.max(0,Math.min(10,profile.purchases?.maxhp||0))+(linkAt(1)?2:0);}
function applyLinkDamage(raw,kind,target,origin){let factor=1;if(linkAt(5)&&(['magnum','urgent','crash','aqua','tri'].includes(kind)))factor*=1.05;if(linkAt(5)&&kind==='tri')factor*=1.20;if(linkAt(8)&&kind==='aqua'&&origin?.fullCharge)factor*=1.30;if(linkAt(10)&&['ignis','terra','ventus'].includes(kind))factor*=1.10;if(linkAt(9)&&target&&origin){const dist=Math.hypot(target.x-origin.x,target.y-origin.y);factor*=1+Math.min(.15,dist/80*.01);}return raw*factor;}
function heroChargeDuration(){return linkAt(8)?1:2;}
function aquaSpread(progress){return 256-208*clamp(progress,0,1);}
function aquaHalfWidth(progress,reach){return 2*aquaSpread(progress)*reach/540;}
function setHeroAnim(kind,duration=.36,extra={}){if(!world?.hero)return;const h=world.hero;h.animKind=kind;h.animAt=world.t;h.animUntil=world.t+duration;Object.assign(h,extra);}
function heroAnimState(h=world?.hero){const now=world?.t||0;if(!h)return {state:'idle',mode:'idle',time:0,progress:0};if(h.inv>1.05&&h.lastDamageAt&&now-h.lastDamageAt<.44)return {state:'hit',mode:'hit',time:now-h.lastDamageAt,progress:clamp((now-h.lastDamageAt)/.44,0,1)};if(world?.aquaCharge)return {state:'attack',mode:'aquaCharge',time:now-world.aquaCharge.started,progress:clamp((now-world.aquaCharge.started)/heroChargeDuration(),0,1)};if(world?.terraCharge)return {state:'attack',mode:'terraCharge',time:now-world.terraCharge.started,progress:0};if(world?.anchorAim)return {state:'attack',mode:'anchorAim',time:now-(h.animAt||now),progress:0};if(h.animKind&&h.animUntil>now)return {state:'attack',mode:h.animKind,time:now-(h.animAt||now),progress:clamp((now-(h.animAt||now))/Math.max(.001,(h.animUntil||now)-((h.animAt)||now)),0,1),spread:h.aquaReleaseSpread||0,aquaChargePct:h.aquaChargePct||0};if(h.isMoving)return {state:'move',mode:'move',time:h.moveTime||0,progress:0};return {state:'idle',mode:'idle',time:h.idleTime||0,progress:0};}

function worldInit(){return {t:0,wave:0,cycle:0,hero:{x:400,y:555,hp:5,inv:0,lastX:400,lastY:555,isMoving:false,moveTime:0,idleTime:0,animKind:'',animAt:0,animUntil:0,lastDamageAt:-10},enemies:[],shots:[],enemyShots:[],effects:[],defeatSprites:[],score:0,fragments:0,chunks:0,spawnDue:0,moveTick:0,attackTicks:[],attackCarry:0,cariShieldTick:0,ronaunLines:[],wraithDue:0,wraithRoarStacks:[],melciZones:[],irusanZones:[],irusanPower:null,irusanCauldron:null,glasZones:[],discipleZones:[],elements:{fire:0,water:0,earth:0,air:0},dorcha:0,dorchaHits:0,anchorAim:null,anchorDash:null,lastAuto:0,lastCloseAuto:0,aquaCharge:null,terraCharge:null,terraZones:[],ventusTunnels:[],healthDrops:[],ignisBursts:[],lastCast:{},boostUntil:0,urgentBuff:0,started:true};}
function stageInfo(w){const stage=(w.wave-1)%50+1;const escalation=Math.max(0,Math.floor((w.wave-26)/5)+1);return {stage,escalation,cycle:Math.floor((w.wave-1)/50)};}
// Distribute regular waves across depth, not just the back wall. Keep the
// bottom approach free and never relocate scripted boss or seal formations.
function waveSpawnPoint(i,count,cols,type){
 const row=Math.floor(i/cols),col=i%cols;
 const xBase=75+col*(650/Math.max(1,cols-1));
 const depthBands=[78,170,272,360,125,225,315];
 // Rotate depth bands between waves so repeated layouts do not feel identical.
 const band=(col*3+row*2+(world.wave%depthBands.length))%depthBands.length;
 const cari=type.includes('Cari');
 const y=clamp(depthBands[band]+rand(-19,19)+(cari?rand(0,16):0),60,375);
 const x=clamp(xBase+rand(-18,18)+(row%2?13:-13),43,757);
 // Avoid sprite overlaps with the already placed combatants. Allow a slight
 // lateral adjustment before changing the selected depth lane.
 for(let attempt=0;attempt<12;attempt++){
  const cx=clamp(x+(attempt%3-1)*22,43,757);
  const cy=clamp(y+(Math.floor(attempt/3)-1.5)*25,58,380);
  if(world.enemies.every(e=>Math.hypot((e.x-cx)*.85,e.y-cy)>47))return {x:cx,y:cy};
 }
 return {x,y};
}
function waveStart(){const w=world;w.wave++;w.cycle=Math.floor((w.wave-1)/50);const {stage}=stageInfo(w);const boss=stage%10===0;
 const count=boss?1:Math.min(28,6+Math.floor(stage/3));const types=['Ronaun','Disciple','Frozen Cari','Un Llygadog','Gwallgof','Un Llygadog','Dark Ronaun','Dark Disciple'];
 const multiplier=Math.pow(1.55,w.cycle)*(1+Math.max(0,w.wave-50)*.013);w.enemies=[];const cols=Math.min(9,count);
 for(let i=0;i<count;i++){const type=boss?(stage===50?'Giga Glas Ghaibhleann':stage%20===0?'Glas Ghaibhleann':'Irusan'):(stage<=10?types[Math.floor((stage-1)/2)%types.length]:types[(Math.floor((stage-1)/5)+i)%types.length]);
 const {x,y}=boss?{x:400,y:105}:waveSpawnPoint(i,count,cols,type);
 const hp=(boss?650+stage*28:24+stage*5)*(type.startsWith('Dark')?1.6:1)*(type.includes('Gwallgof')?1.85:type==='Un Llygadog'?.65:type==='Wyneb'?.45:1)*multiplier;
 w.enemies.push({x,y,hp,max:hp,type,boss,phase:rand(0,6),column:i%cols,originX:x,originY:y,dir:i%2?1:-1,moveAxis:i%3===0?'y':'x',shield:type.includes('Ronaun')?RONAUN_SHIELD_POOL:0,dash:0,returning:false,waveBorn:w.t,roarReady:0,cornerTriggered:false,discipleWeapon:type.includes('Disciple')?['sword','guns','staff'][Math.floor(Math.random()*3)]:null});if(type.includes('Cari'))spawnWynebPartner(x,y);}
 w.spawnDue=0;w.ronaunLines=[];w.wraithRoarStacks=[];w.wraithDue=w.t+rand(8,15);w.melciZones=[];w.irusanZones=[];w.irusanPower=null;w.irusanCauldron=null;w.glasZones=[];w.discipleZones=[];/* Preserve alchemy and Dorcha between waves. */if(stage>=15&&stage%10===5||boss&&w.enemies.some(e=>e.type==='Irusan'))spawnMelci();for(const e of w.enemies.filter(e=>e.type.includes('Glas Ghaibhleann'))){const giga=e.type.startsWith('Giga');e.x=400;e.y=105;e.glas={giga,sealed:!giga,shieldDisciples:[],triggers:new Set(),next:w.t+2,cycle:0,puddles:[],nextShield:w.t+5,nextDisciples:w.t+1,berserk:false,elementImmune:null,nextElement:w.t+10,drainAt:0};if(!giga)for(const [i,element] of ['fire','water','earth','air'].entries())spawnGlasOrb(e,element,i);}for(const e of w.enemies.filter(e=>e.type==='Irusan')){e.irusan={next:w.t+3,sequence:0,phase:'ready',originX:e.x,originY:e.y,returnAt:0,laser:null,nextCari:w.t+30,nextCircle:w.t+5,frenzyStart:0,halfTriggered:false};}note=boss?'Boss wave · '+w.enemies[0].type:'Wave '+w.wave;
}
// Global three-second attack window; later waves earn a fractional increase.
function attackAllowed(){const w=world,{escalation}=stageInfo(w);const rate=3+escalation*.17;w.attackTicks=w.attackTicks.filter(t=>w.t-t<3);const cap=Math.floor(rate);
 if(w.attackTicks.length<cap){w.attackTicks.push(w.t);return true;}
 const fraction=rate-cap;if(w.attackTicks.length===cap&&Math.random()<fraction/3){w.attackTicks.push(w.t);return true;}return false;
}
// Every enemy keeps its own persistent hazards and cooldowns.
function createRonaunLine(e){const w=world;e.animAttackStart=w.t;e.animAttackUntil=w.t+.7;const x1=rand(50,750),y1=rand(430,575),angle=rand(-.55,.55)*(Math.random()<.5?-1:1),len=rand(130,245);const x2=clamp(x1+Math.cos(angle)*len*(Math.random()<.5?-1:1),35,765),y2=clamp(y1+Math.sin(angle)*len,417,585);w.ronaunLines.push({owner:e,x1,y1,x2,y2});w.effects.push({x:e.x,y:e.y,r:28,life:.5,color:'#f2a0d5'});}
function lineDistance(px,py,l){const dx=l.x2-l.x1,dy=l.y2-l.y1,t=clamp(((px-l.x1)*dx+(py-l.y1)*dy)/Math.max(1,dx*dx+dy*dy),0,1);return Math.hypot(px-(l.x1+t*dx),py-(l.y1+t*dy));}
function spawnMinion(type,x,y){const w=world;const info=stageInfo(w);const scale=Math.pow(1.55,w.cycle)*(1+Math.max(0,w.wave-50)*.013);const hp=(24+info.stage*5)*(type.includes('Gwallgof')?1.85:type==='Un Llygadog'?.65:type==='Wyneb'?.45:1)*scale;const enemy={x,y,hp,max:hp,type,boss:false,phase:rand(0,6),column:0,originX:x,originY:y,dir:Math.random()<.5?-1:1,moveAxis:Math.random()<.3?'y':'x',shield:type.includes('Ronaun')?RONAUN_SHIELD_POOL:0,dash:0,returning:false,waveBorn:w.t,roarReady:0,cornerTriggered:false,discipleWeapon:type.includes('Disciple')?['sword','guns','staff'][Math.floor(Math.random()*3)]:null};w.enemies.push(enemy);if(type.includes('Cari'))spawnWynebPartner(x,y);return enemy;}

// Wyneb is a Cari companion: wounded Wynebs chase, latch in place and detonate.
function spawnWynebPartner(x,y){const w=world;
 // Wyneb remains visibly paired with Cari, but avoids a uniform rigid offset.
 // Pick from diagonal/forward/back companion positions with safe spacing.
 const offsets=[[55,30],[-55,30],[60,-35],[-60,-35],[35,61],[-35,61],[75,6],[-75,6]];
 const start=Math.floor(Math.random()*offsets.length);let sx=x,sy=y;
 for(let i=0;i<offsets.length;i++){
  const [dx,dy]=offsets[(start+i)%offsets.length];
  const px=clamp(x+dx,38,762),py=clamp(y+dy,48,395);
  if(w.enemies.every(o=>Math.hypot((o.x-px)*.9,o.y-py)>37)){sx=px;sy=py;break;}
 }
 if(sx===x&&sy===y){sx=clamp(x+(x>400?-58:58),38,762);sy=clamp(y+45,48,395);}
 const e={x:sx,y:sy,hp:0,max:0,type:'Wyneb',boss:false,phase:rand(0,6),originX:sx,originY:sy,dir:1,moveAxis:'none',shield:0,dash:0,returning:false,waveBorn:w.t,cornerTriggered:false,wynebState:'idle',wynebFuse:0};const {stage}=stageInfo(w);e.hp=(15+stage*3)*Math.pow(1.55,w.cycle);e.max=e.hp;w.enemies.push(e);return e;}
function updateWyneb(dt){const w=world,h=w.hero;for(const e of w.enemies){if(e.type!=='Wyneb')continue;if(e.wynebState==='chase'){const dx=h.x-e.x,dy=h.y-e.y,d=Math.hypot(dx,dy);if(d>1){const step=Math.min(d,155*dt);e.x+=dx/d*step;e.y+=dy/d*step;}if(d<27){e.wynebState='bomb';e.wynebFuse=w.t+2.2;note='Wyneb · explosion incoming!';}}else if(e.wynebState==='bomb'&&w.t>=e.wynebFuse){if(Math.hypot(e.x-h.x,e.y-h.y)<86&&h.inv<=0){h.hp-=2;h.inv=1.4;}w.effects.push({x:e.x,y:e.y,r:86,life:.65,color:'#fa78ed'});e.hp=-1;e.exploded=true;note='Wyneb detonated!';}}}

function summonUnLlygadog(e,anywhere=false){const w=world,pool=['Ronaun','Disciple','Frozen Cari','Gwallgof','Un Llygadog','Dark Disciple'];let added=0;for(let i=0;i<2;i++){let x=e.x+(i===0?-52:52),y=e.y;if(anywhere){x=rand(35,765);y=rand(40,395);}let free=false;for(let retry=0;retry<18;retry++){if(!w.enemies.some(o=>o.hp>0&&Math.hypot(o.x-x,o.y-y)<39)){free=true;break;}if(!anywhere)break;x=rand(35,765);y=rand(40,395);}if(free){spawnMinion(pool[Math.floor(Math.random()*pool.length)],x,y);added++;}}return added;}
function wraithRoar(e){const w=world;e.animAttackStart=w.t;e.animAttackUntil=w.t+1;const tier=stageInfo(w).escalation;w.wraithRoarStacks=w.wraithRoarStacks.filter(until=>until>w.t);w.wraithRoarStacks.push(w.t+Math.max(3.5,7-tier*.06));e.roarReady=w.t+Math.max(5,18-tier*.3);w.effects.push({x:e.x,y:e.y,r:36,life:.8,color:'#d5a0ef'});note='Wraith roar!';}
function spawnWraith(){const w=world;if(!w.enemies.length)return;const x=rand(45,755),y=rand(55,300);const e=spawnMinion('Wraith',x,y);e.hp*=.75;e.max=e.hp;wraithRoar(e);}
// Glas' seals respond only to matching alchemy elements, including charged Tri-Assault arrows.
const GLAS_ELEMENTS=['fire','water','earth','air'];
function spawnGlasOrb(boss,element,i){const w=world;const x=105+i*195,y=283;w.enemies.push({x,y,originX:x,originY:y,hp:3,max:3,type:'Glas '+element+' Orb',element,glasOrb:true,glasOwner:boss,boss:false,shield:0,moveAxis:'none',phase:0,dir:0,waveBorn:w.t});}
function glasReinforcements(boss,elemental=false){const w=world,scale=1+w.cycle*.4; if(elemental){boss.glas.shieldDisciples=[];for(const [i,element] of GLAS_ELEMENTS.entries()){const e=spawnMinion('Disciple',120+i*185,245);e.element=element;e.glasDisciple=true;e.glasOwner=boss;e.hp*=1.3;e.max=e.hp;boss.glas.shieldDisciples.push(e);}note='Elemental Disciples · break the shields!';return;}
 const n=Math.min(20,5+Math.floor(Math.random()*4)+w.cycle*2),types=['Ronaun','Disciple','Frozen Cari','Un Llygadog','Gwallgof','Ronaun'];for(let i=0;i<n;i++){const x=55+(i%8)*96,y=255+Math.floor(i/8)*48;const e=spawnMinion(types[Math.floor(Math.random()*types.length)],x,y);e.glasBlocker=true;e.glasOwner=boss;e.hp*=scale;e.max=e.hp;}note='Glas summons reinforcements!';}
// Keep the central dodge corridor clear; warn in red before each staggered blight appears.
function glasPuddles(boss,large=false){const w=world;
 const locations=large?[[95,550],[700,545],[135,450],[665,435],[110,350],[700,350]]:[[105,545],[690,535],[135,445],[670,365]];
 boss.glas.puddles=locations.map(([x,y],i)=>({x,y,r:(large?43:35)*1.2,born:w.t+i*.75+.9,warning:w.t+i*.75}));note='Purple blight · red circles warn of incoming blight!';}
// Giga puddles likewise warn first and never occupy the central dodge corridor.
function gigaPuddle(boss){const w=world,g=boss.glas;const locations=[[90,540],[710,535],[140,455],[660,455],[95,365],[710,360],[170,560]];const used=g.puddles.map(p=>p.slot);const slot=locations.findIndex((_,i)=>!used.includes(i));if(slot<0)return;const [x,y]=locations[slot];const latest=g.puddles.reduce((t,p)=>Math.max(t,p.born||0),w.t);const born=Math.max(w.t+.9,latest+.75);g.puddles.push({x,y,r:12,maxR:(46+Math.min(14,w.cycle*3))*1.2,born,warning:born-.9,slot});note='Giga Glas · blight incoming!';}
function gigaBerserk(boss){const w=world,g=boss.glas;g.berserk=true;g.nextElement=w.t;g.next=w.t+.7;g.puddles.forEach(p=>{if(w.t>=p.born)p.r=p.maxR;});for(const e of w.enemies){if(e!==boss&&(e.glasOwner===boss||e.glasBlocker)){e.hp=0;e.consumedByGlas=true;}}g.shieldDisciples=[];boss.shield=0;note='GIGA GLAS · BERSERK!';}
function gigaUpdate(boss,dt){const w=world,h=w.hero,g=boss.glas,hp=boss.hp/boss.max;
 // Renew elemental disciples twenty seconds after the entire set is defeated.
 if(!g.berserk&&g.nextDisciples&&w.t>=g.nextDisciples&&!g.shieldDisciples.some(e=>e.hp>0)){glasReinforcements(boss,true);g.nextDisciples=0;}
 if(!g.berserk&&!g.nextDisciples&&g.shieldDisciples.length&&!g.shieldDisciples.some(e=>e.hp>0))g.nextDisciples=w.t+20;
 for(const [threshold,id] of [[.9,'90'],[.7,'70'],[.5,'50'],[.4,'40'],[.3,'30'],[.1,'10']]){if(hp<=threshold&&!g.triggers.has(id)){g.triggers.add(id);if(id==='70'||id==='40')glasReinforcements(boss,false);if(id==='90'||id==='70'||id==='50'||id==='30'||id==='10')gigaPuddle(boss);if(id==='10')gigaBerserk(boss);}}
 if(g.berserk&&w.t>=g.nextElement){g.nextElement=w.t+10;const previous=g.elementImmune;const options=GLAS_ELEMENTS.filter(e=>e!==previous);g.elementImmune=options[Math.floor(Math.random()*options.length)];note='Giga Glas resists '+g.elementImmune+'!';}
 if(w.t>=g.nextShield&&!g.berserk){g.nextShield=w.t+5;if(g.shieldDisciples.some(e=>e.hp>0))boss.shield=5;}
 if(w.t>=g.next){const roll=g.cycle++;const kind=roll%12===11?'swipe':roll%4===3?'safe':'laser';const left=roll%2===0;let lane=[135,400,665][Math.floor(Math.random()*3)];if(kind==='safe'){
  const freeLanes=[0,1,2].filter(i=>!g.puddles.some(p=>{const center=[135,400,665][i];return Math.abs(p.x-center)<p.r+68&&p.y>290&&p.y<610;}));
  lane=[135,400,665][freeLanes.length?freeLanes[Math.floor(Math.random()*freeLanes.length)]:1];
 }
 w.glasZones.push({boss,kind,x:lane,at:w.t+(kind==='safe'?2:1),until:w.t+(kind==='safe'?2.55:1.5),left,hit:false});g.next=w.t+(g.berserk?1.8:3.8);note=kind==='safe'?'Giga Glas · find the safe lane!':kind==='laser'?'Giga Glas · laser!':'Giga Glas · swipe!';}
 for(const p of g.puddles){if(w.t<p.born)continue;p.r=Math.min(p.maxR,p.r+dt*1.65);if(Math.hypot(h.x-p.x,h.y-p.y)<p.r){if(!g.berserk){h.hp=0;note='Purple blight!';}else if(w.t>g.drainAt){g.drainAt=w.t+.65;h.hp-=.4;boss.hp=Math.min(boss.max,boss.hp+.4);note='Life drained!';}}}
}
function updateGlas(dt){const w=world,h=w.hero;
 for(const boss of w.enemies.filter(e=>e.type.includes('Glas Ghaibhleann')&&e.hp>0)){const g=boss.glas;if(!g)continue;if(g.giga){gigaUpdate(boss,dt);continue;}
  if(g.sealed){if(!w.enemies.some(e=>e.glasOrb&&e.glasOwner===boss&&e.hp>0)){g.sealed=false;g.next=w.t+2;note='Glas is free!';}continue;}
  const hp=boss.hp/boss.max;
  for(const [threshold,id] of [[.9,'90'],[.7,'70'],[.4,'40'],[.3,'30'],[.15,'15'],[.1,'10'],[.05,'5']]){if(hp<=threshold&&!g.triggers.has(id)){g.triggers.add(id);if(id==='90')glasReinforcements(boss,true);if(id==='70'||id==='40')glasReinforcements(boss,false);if(id==='10'){glasReinforcements(boss,false);glasReinforcements(boss,true);}if(id==='30')glasPuddles(boss);if(id==='15')g.puddles=[];if(id==='5')glasPuddles(boss,true);}}
  if(w.t>=g.nextShield){g.nextShield=w.t+5;const active=g.shieldDisciples.filter(e=>e.hp>0).length;if(active){boss.shield=5;w.effects.push({x:boss.x,y:boss.y,r:60,life:.7,color:'#8fdcff'});}}
  if(w.t>=g.next){const kind=g.cycle++%5===4?'laser':'swipe';const left=g.cycle%2===1;w.glasZones.push({boss,kind,x:kind==='laser'?400:left?200:600,at:w.t+(kind==='laser'?1:1.1),until:w.t+(kind==='laser'?1.5:1.6),left,hit:false});g.next=w.t+3.7;note=kind==='laser'?'Glas · Center laser!':`Glas · ${left?'Left':'Right'} swipe!`;}
  for(const puddle of g.puddles){if(w.t<puddle.born)continue;if(Math.hypot(h.x-puddle.x,h.y-puddle.y)<puddle.r){h.hp=0;note='Purple blight!';}}
 }
 for(const z of w.glasZones){if(z.boss.hp<=0)continue;if(w.t>=z.at&&!z.hit){z.hit=true;const hit=z.kind==='safe'?Math.abs(h.x-z.x)>105:z.kind==='laser'?Math.abs(h.x-z.x)<64:z.left?(h.y>=413||h.y>=206&&h.x<400):(h.y>=413||h.y>=206&&h.x>=400);if(hit&&h.inv<=0){h.hp-=z.kind==='laser'?2:1.5;h.inv=.9;note='Glas attack hit!';}}}w.glasZones=w.glasZones.filter(z=>z.boss.hp>0&&w.t<z.until);
}
function damageGlasTarget(target,raw,element){if(target.glasOrb||target.glasDisciple){if(target.element!==element)return false;}
 if(target.type.includes('Glas Ghaibhleann')&&target.glas?.sealed)return false;if(target.glas?.berserk&&element&&element===target.glas.elementImmune)return false;
 if(target.type==='Wyneb'&&target.wynebState==='bomb')return false;target.animHitStart=world.t;target.animHitUntil=world.t+.34;// Cari absorbs up to two baseline (unupgraded) Magnum Shots of incoming damage.
 // Powerful skills may exhaust the pool and pass their excess damage through to HP.
 const cariAbsorbed=Math.min(Math.max(0,target.cariShieldHp||0),Math.max(0,raw));
 target.cariShieldHp=Math.max(0,(target.cariShieldHp||0)-cariAbsorbed);
 const remainder=Math.max(0,raw-cariAbsorbed);
 const absorbed=Math.min(target.shield||0,remainder);target.shield=Math.max(0,(target.shield||0)-absorbed);if(target.type==='Wyneb'&&target.wynebState==='idle'&&remainder>absorbed)target.wynebState='chase';target.hp-=Math.max(0,remainder-absorbed)*(target.glas?.berserk?1.5:1)*(target.type.includes('Gwallgof')?Math.max(.32,.73-world.cycle*.055):1);return true;
}
// Mid-cycle mini-boss: independent timing, no ordinary attack-budget consumption.
function spawnMelci(){const w=world,stage=stageInfo(w),scale=Math.pow(1.55,w.cycle)*(1+Math.max(0,w.wave-50)*.013);
 const x=400,y=108,hp=(245+stage.stage*18)*scale;
 w.enemies.push({x,y,hp,max:hp,type:'Melci Diafol',boss:false,miniboss:true,phase:0,column:0,originX:x,originY:y,dir:1,moveAxis:'x',shield:0,dash:0,returning:false,waveBorn:w.t,roarReady:0,cornerTriggered:false,melciStep:0,melciAttackReady:w.t+3.3,melciState:'run',melciStateUntil:0,melciLegStart:w.t,melciLegEnd:w.t,melciTargetX:x,melciTargetY:y,melciMoveSpeed:0,renderLift:0});
}
function melciPlanRun(e){const w=world;const step=e.melciStep++%8;
 const dx=[-45,-45,65,65,45,45,-65,-65][step],dy=[0,0,130,130,0,0,-130,-130][step];
 const tx=clamp(e.x+dx,45,755),ty=clamp(e.y+dy,65,470);
 e.melciTargetX=tx;e.melciTargetY=ty;e.melciLegStart=w.t;e.melciLegEnd=w.t+1;
 e.melciMoveSpeed=Math.hypot(tx-e.x,ty-e.y);
}
function melciAttack(e,near){const w=world;e.animAttackStart=w.t;
 if(near){e.animAttackUntil=w.t+2.85;e.melciState='flame';e.melciStateUntil=w.t+2.85;e.melciTargetX=e.x;e.melciTargetY=e.y;
  const targetX=clamp(w.hero.x,35,765),targetY=clamp(Math.max(e.y+85,w.hero.y),e.y+85,605);e.flameTarget={x:targetX,y:targetY};for(let i=0;i<5;i++)w.melciZones.push({kind:'flame',owner:e,x:targetX,y:targetY,originX:e.x,originY:e.y+12,at:w.t+.28+i*.6,expires:w.t+.28+i*.6+.24,hit:false,pulse:i});
  w.effects.push({kind:'melci-flame-cast',x:e.x,y:e.y+44,r:36,life:.72,color:'#ff9a57'});note='Melci · Flame Burst!';
 }else{const tx=clamp(w.hero.x,55,745),ty=clamp(w.hero.y,95,565);e.animAttackUntil=w.t+2.75;e.melciState='kunai';e.melciStateUntil=w.t+2.75;e.kunaiTarget={x:tx,y:ty};e.kunaiAirStart=w.t+.35;e.kunaiLand=w.t+2.55;e.renderLift=0;
  w.melciZones.push({kind:'kunai',owner:e,x:tx,y:ty,at:w.t+.78,expires:w.t+2.95,hitIndex:-1,landAt:w.t+2.55});
  note='Melci · Kunai Storm!';
 }
 e.melciAttackReady=w.t+(near?4.2:4.6);
}
function updateMelci(dt){const w=world,h=w.hero;for(const e of w.enemies.filter(x=>x.miniboss&&x.hp>0)){e.renderLift=0;
  if(e.melciState==='flame'){if(w.t>=e.melciStateUntil){e.melciState='run';melciPlanRun(e);}continue;}
  if(e.melciState==='kunai'){const start=e.kunaiAirStart||w.t,land=e.kunaiLand||w.t;if(w.t>=start&&w.t<=land){const p=clamp((w.t-start)/Math.max(.001,land-start),0,1);e.renderLift=Math.sin(p*Math.PI)*42;}else if(w.t>land){e.renderLift=0;e.melciState='land';e.melciLandAt=w.t;e.melciStateUntil=w.t+.44;}continue;}
  if(e.melciState==='land'){if(w.t>=e.melciStateUntil){e.melciState='run';melciPlanRun(e);}continue;}
  if(w.t>=e.melciAttackReady){const close=Math.hypot(e.x-h.x,e.y-h.y)<245 || e.y>=370;melciAttack(e,close);continue;}
  if(!Number.isFinite(e.melciTargetX)||w.t>=e.melciLegEnd||Math.hypot(e.melciTargetX-e.x,e.melciTargetY-e.y)<4)melciPlanRun(e);
  const dx=e.melciTargetX-e.x,dy=e.melciTargetY-e.y,dist=Math.hypot(dx,dy);if(dist>0.01){const step=Math.min(dist,(e.melciMoveSpeed||dist)*dt);e.x+=dx/dist*step;e.y+=dy/dist*step;}
 }}
function updateMelciZones(dt){const w=world,h=w.hero;
 for(const z of w.melciZones){if(z.owner.hp<=0){z.done=true;continue;}
  if(z.kind==='kunai'){
   if(w.t<z.at)continue;
   for(let k=z.hitIndex+1;k<5;k++){
    const time=z.at+k*.44;if(w.t<time)break;z.hitIndex=k;
    w.effects.push({kind:'melci-kunai-hit',x:z.x,y:z.y,r:49,life:.28,color:'#a5a0ff'});
    if(Math.hypot(h.x-z.x,h.y-z.y)<59&&h.inv<=0){h.hp-=1;h.inv=.28;note='Kunai Storm hit!';}
   }
   if(z.hitIndex>=4)z.done=true;
  }else if(z.kind==='flame'&&w.t>=z.at){
   // The cone is a stationary area attack with five instantaneous damage pulses;
   // unlike Kunai Storm, no moving flame projectile or travel delay is involved.
   const ox=z.originX,oy=z.originY,dx=z.x-ox,dy=z.y-oy,reach=Math.max(100,Math.hypot(dx,dy));
   const hx=h.x-ox,hy=h.y-oy,forward=(hx*dx+hy*dy)/reach,lateral=Math.abs(hx*dy-hy*dx)/reach;
   if(!z.hit){
    if(forward>=0&&forward<=reach+24&&lateral<=18+forward*.45&&h.inv<=0){h.hp-=.25;h.stunned=Math.max(h.stunned||0,.5);h.inv=.12;note='Flame Burst · stunned!';}
    z.hit=true;
    w.effects.push({kind:'melci-flame-hit',x:ox+dx*.70,y:oy+dy*.70,r:47,life:.24,color:'#f4a368'});
   }
   // Keep the cone visible through its pulse; remove only after the pulse animation expires.
   if(w.t>=z.expires)z.done=true;

  }
 }
 w.melciZones=w.melciZones.filter(z=>!z.done&&w.t<z.expires);
}
// Irusan operates on its own boss timeline, independently of the standard attack budget.
function irusanHit(amount,label){const h=world.hero;if(h.inv>0)return;h.hp-=amount*harmFactor();h.inv=.9;note=label;}
function spawnIrusanCircle(w,x,y){w.irusanZones.push({kind:'circle',x:clamp(x,36,764),y:clamp(y,36,575),at:w.t+5,until:w.t+5.24});}
function irusanHalf(e){const w=world,h=w.hero;e.irusan.halfTriggered=true;e.irusan.phase='struggle';w.irusanPower={boss:e,progress:0,last:null,needed:20};touchMove.struggleSide=null;w.irusanZones=[];w.enemyShots=[];h.inv=Math.max(h.inv,999);h.stunned=0;h.frozen=0;note='POWER STRUGGLE · alternate A / D or ← / →!';}
function irusanStruggleInput(k){const w=world,p=w?.irusanPower;if(!p||p.boss.hp<=0)return false;const side=k==='a'||k==='arrowleft'?'L':k==='d'||k==='arrowright'?'R':null;if(!side)return false;if(side!==p.last){p.progress++;p.last=side;if(p.progress>=p.needed){const boss=p.boss;w.irusanPower=null;w.irusanZones=[];w.hero.inv=Math.min(w.hero.inv,1.2);boss.irusan.phase='cauldron';const hp=(180+w.wave*4)*Math.pow(1.55,w.cycle);const pot={type:'Cauldron',x:400,y:230,hp,max:hp,boss:false,shield:0,cauldron:true,spawnAt:w.t,slamAt:w.t+.55};w.enemies.push(pot);w.irusanCauldron={enemy:pot,boss,deadline:w.t+20};note='Destroy the cauldron! · 20s';}}return true;}
// A distinct left/right crossing is one struggle input, not a held-stick repeat.
function mobileIrusanStruggle(x){if(!world?.irusanPower)return;const side=x<=-.35?'L':x>=.35?'R':null;if(!side){touchMove.struggleSide=null;return;}if(side!==touchMove.struggleSide){touchMove.struggleSide=side;irusanStruggleInput(side==='L'?'arrowleft':'arrowright');}}
function updateIrusan(dt){const w=world,h=w.hero;
 for(const e of w.enemies.filter(x=>x.type==='Irusan'&&x.hp>0)){
  const st=e.irusan;if(!st)continue;const fraction=e.hp/e.max;
  if(!st.halfTriggered&&fraction<=.5){irusanHalf(e);continue;}
  if(st.phase==='struggle'||st.phase==='cauldron'){w.irusanZones=[];continue;}
  if(st.roamX===undefined){st.roamX=e.x;st.roamY=e.y;st.roamNext=w.t;}
  if(st.phase==='ready'||st.phase==='laserTrack'||st.phase==='laserLock'){if(w.t>=st.roamNext||Math.hypot(e.x-st.roamX,e.y-st.roamY)<10){st.roamX=clamp(h.x+rand(-180,180),80,720);st.roamY=clamp(h.y-rand(110,260),75,445);st.roamNext=w.t+rand(1.5,3);}const dd=Math.hypot(st.roamX-e.x,st.roamY-e.y);if(dd>1){const step=Math.min(dd,65*dt);e.x+=(st.roamX-e.x)/dd*step;e.y+=(st.roamY-e.y)/dd*step;}}
  if(st.phase==='swipeTelegraph'){const dd=Math.hypot(st.swipeX-e.x,st.swipeY-e.y);if(dd>1){const step=Math.min(dd,170*dt);e.x+=(st.swipeX-e.x)/dd*step;e.y+=(st.swipeY-e.y)/dd*step;}}
  if(fraction<=.5&&w.t>=st.nextCari){st.nextCari=w.t+30;spawnMinion('Frozen Cari',rand(70,730),rand(65,275));note='Irusan summons a Cari!';}
  if((fraction<=.9&&fraction>.55||fraction<=.4)&&w.t>=st.nextCircle){st.nextCircle=w.t+rand(7,10);spawnIrusanCircle(w,h.x,h.y);for(let i=0;i<Math.min(5,2+Math.floor(w.cycle/2));i++)spawnIrusanCircle(w,rand(40,760),rand(70,580));}
  if(fraction<=.1&&!st.frenzyStart){st.frenzyStart=w.t;note='Irusan grows furious!';}
  const frenzy=st.frenzyStart?Math.min(.88,(w.t-st.frenzyStart)/125):0;
  const gap=Math.max(.48,3*(1-frenzy));
  if(st.phase==='swipeTelegraph'&&w.t>=st.returnAt){if(Math.hypot(h.x-e.x,h.y-e.y)<93)irusanHit(1.4,'Irusan · Swipe!');w.effects.push({x:e.x,y:e.y,r:88,life:.6,color:'#ff916f'});st.phase='swipeReturn';st.returnAt=w.t+.45;}
  else if(st.phase==='swipeReturn'&&w.t>=st.returnAt){st.phase='ready';st.roamNext=0;st.next=w.t+Math.max(.5,1.4*(1-frenzy));}
  else if(st.phase==='laserTrack'){st.laser.x=h.x;st.laser.y=h.y;if(w.t>=st.laser.lockAt){st.phase='laserLock';note='Laser locked · move!';}}
  else if(st.phase==='laserLock'&&w.t>=st.laser.fireAt){const x=st.laser.x;w.irusanZones.push({kind:'laser',x,y:0,at:w.t,until:w.t+.72,width:56});if(Math.abs(h.x-x)<32)irusanHit(2,'Irusan · Laser!');st.phase='ready';st.next=w.t+gap;st.laser=null;}
  else if(st.phase==='ready'&&w.t>=st.next){if(st.sequence++%2===0){st.swipeX=clamp(h.x,55,745);st.swipeY=clamp(h.y-84,65,470);st.phase='swipeTelegraph';st.returnAt=w.t+Math.max(.42,.9*(1-frenzy));note='Irusan · Swipe incoming!';}else{st.laser={x:h.x,y:h.y,lockAt:w.t+2,fireAt:w.t+3};st.phase='laserTrack';note='Irusan · Laser targeting!';}}
 }
 for(const z of w.irusanZones){if(!w.irusanPower&&!w.irusanCauldron&&z.kind==='circle'&&w.t>=z.at&&!z.hit){z.hit=true;if(Math.hypot(h.x-z.x,h.y-z.y)<54)irusanHit(2,'Irusan · Red circle!');w.effects.push({x:z.x,y:z.y,r:55,life:.6,color:'#f36165'});}}
 w.irusanZones=w.irusanZones.filter(z=>w.t<z.until);
 if(w.irusanCauldron){const p=w.irusanCauldron;
  if(p.enemy.hp<=0){w.effects.push({x:p.enemy.x,y:p.enemy.y,r:86,life:1.1,color:'#b36ded',kind:'cauldron-break'});p.boss.irusan.phase='ready';p.boss.irusan.next=w.t+1;w.irusanCauldron=null;note='Cauldron shattered!';}
  else if(w.t>=p.deadline){p.enemy.hp=0;h.transformedUntil=w.t+20;p.boss.irusan.phase='ready';p.boss.irusan.next=w.t+1;w.irusanCauldron=null;note='Transformed · cannot attack for 20s!';}
 }
}
function shovePlayer(dx,dy){const h=world.hero;h.x=clamp(h.x+dx,30,770);h.y=clamp(h.y+dy,30,585);}
function fireEnemy(e,special=false){const w=world;if(!(['Disciple','Frozen Cari','Un Llygadog','Ronaun','Wraith','Dark Disciple','Dark Ronaun'].includes(e.type)))return false;if(!attackAllowed())return false;e.animAttackStart=w.t;e.animAttackUntil=w.t+.65;const speed=135+w.cycle*20+Math.max(0,w.wave-50)*.55;
 const shot=(vx,vy,kind='basic',radius=6)=>w.enemyShots.push({x:e.x,y:e.y+15,vx,vy,kind,radius});
 if(e.type.includes('Disciple')){
  const weapon=e.discipleWeapon||'sword';e.discipleWeapon=weapon;
  e.animAttackUntil=w.t+.73;
  if(weapon==='sword'){
   const reach=special?185:142,half=special?61:47;
   w.discipleZones.push({kind:special?'sword-line':'sword-cone',owner:e,x:e.x,y:e.y+20,reach,half,at:w.t+.45,until:w.t+.68,hit:false});
  }else if(weapon==='guns'){
   if(special){
    // Restore the original Disciple side-dash specials exclusively for dual guns.
    // Both patterns now fire purple enchanted rounds down-screen, never upward.
    if(Math.random()<.5){
     e.dash=e.dir*(45+rand(0,22));e.returning=true;
     for(const vx of [-105,105])for(const vy of [speed*.92,speed*1.15])shot(vx,vy,'disciple-gun',6);
    }else{
     const dx=w.hero.x-e.x;
     e.dash=dx>0?-36:36;e.returning=true;
     const vx=clamp(dx*.22,-78,78);
     for(const off of [-36,0,36])shot(vx+off,speed+22,'disciple-gun',off===0?8:6);
    }
    e.animAttackUntil=w.t+.85;
   }else{
    for(const off of [-.5,.5])shot(off*35,speed,'disciple-gun',6);
   }
  }else{
   const sx=clamp(w.hero.x,e.x-110,e.x+110),sy=clamp(Math.max(e.y+70,w.hero.y),e.y+60,575);
   w.discipleZones.push({kind:special?'staff-ritual':'staff-wave',owner:e,x:clamp(sx,42,758),y:sy,r:special?63:48,at:w.t+(special?.83:.68),until:w.t+(special?1.04:.88),hit:false});
  }
 }else if(e.type.includes('Ronaun')){
  createRonaunLine(e);
 }else if(e.type==='Un Llygadog'){
  if(special)summonUnLlygadog(e);else shot(0,speed);
 }else if(e.type.includes('Wraith')){
  if(special&&w.t>=e.roarReady)wraithRoar(e);
 }else if(e.type.includes('Cari')){
  if(special)shot(0,85+w.cycle*8,'freeze',13);else shot(0,speed);
 }else return false;
 return true;
}
// A heavy, deliberate W-shaped approach: fast diagonal legs with clear corners,
// and a pursuit centerline that tracks the hero without teleporting sideways.
// Called each simulation frame rather than at the formation's 1-second cadence.
function updateDiscipleZones(){const w=world,h=w.hero;if(!w)return;
 for(const z of w.discipleZones){if(z.owner.hp<=0){z.dead=true;continue;}if(w.t<z.at||z.hit)continue;z.hit=true;
  if(w.irusanPower||h.inv>0)continue;
  let struck=false;
  if(z.kind==='sword-cone'){const dx=Math.abs(h.x-z.x),dy=h.y-z.y;struck=dy>=0&&dy<z.reach&&dx<17+dy/z.reach*z.half;}
  else if(z.kind==='sword-line')struck=h.y>=z.y&&h.y<z.y+z.reach&&Math.abs(h.x-z.x)<z.half*.5;
  else struck=Math.hypot(h.x-z.x,h.y-z.y)<z.r;
  if(struck){h.hp-=1*harmFactor();h.inv=.65;h.lastDamageAt=w.t;note='Disciple magic hit!';}
 }
 w.discipleZones=w.discipleZones.filter(z=>!z.dead&&w.t<z.until);
}
function updateGwallgof(dt){
 const w=world;if(!w)return;const hero=w.hero;
 for(const e of w.enemies){
  if(e.hp<=0||!e.type.includes('Gwallgof'))continue;
  if(e.gwallPhase===undefined){
   e.gwallPhase=(e.phase||0)*.28;
   e.gwallCenter=e.x;
   e.gwallLastX=e.x;e.gwallLastY=e.y;
  }
  const alive=Math.max(0,w.t-e.waveBorn);
  const pace=1+Math.min(.16,alive*.003);
  // Four distinct diagonal legs produce the angular W silhouette.
  e.gwallPhase+=dt*(1.08+Math.min(.16,alive*.003));
  const leg=Math.floor(e.gwallPhase),fraction=e.gwallPhase-leg;
  const direction=(leg%2===0)?1:-1;
  const zig=direction===1?(-1+2*fraction):(1-2*fraction);
  // Preserve responsiveness while making the zig-zag readable from a distance.
  const desiredCenter=clamp(hero.x,112,688);
  e.gwallCenter+=clamp(desiredCenter-e.gwallCenter,-105*dt,105*dt);
  const amplitude=Math.min(93,68+alive*.25);
  const targetX=clamp(e.gwallCenter+zig*amplitude,33,767);
  const maxSideStep=(145+Math.min(25,alive*.3))*pace*dt;
  e.x+=clamp(targetX-e.x,-maxSideStep,maxSideStep);
  // Push toward the player, then keep pressure as the player retreats.
  // Leave just enough room for an intentional dodge around the hammer brute.
  const targetY=clamp(hero.y-17,65,588);
  const forwardSpeed=(78+Math.min(22,alive*.3))*pace*dt;
  const retreatSpeed=48*dt;
  e.y+=clamp(targetY-e.y,-retreatSpeed,forwardSpeed);
  e.x=clamp(e.x,33,767);e.y=clamp(e.y,36,588);
  e.animLastX=e.gwallLastX;e.animLastY=e.gwallLastY;
  e.gwallLastX=e.x;e.gwallLastY=e.y;
 }
}
function moveEnemiesFrame(){const w=world,{escalation}=stageInfo(w);const whole=w.enemies;
 // Formation movement stays inside the top two-thirds. Descents are axis-aligned.
 for(const e of whole){
  if(e.type==='Irusan'||e.type.includes('Glas Ghaibhleann')||e.glasOrb||e.glasDisciple||e.cauldron){continue;}if(e.miniboss){continue;}if(e.dash){const dx=e.dash;e.x=clamp(e.x+dx,30,770);e.dash=0;
   for(const other of whole){if(other!==e&&Math.hypot(e.x-other.x,e.y-other.y)<43){other.x=clamp(other.x+Math.sign(dx||1)*24,30,770);}}
  }else if(e.type==='Wyneb'){/* idle companion; damaged Wynebs move per-frame */
  }else if(e.type.includes('Gwallgof')){
   // Gwallgof pursuit now advances continuously in updateGwallgof(dt).
   // Do not move it a second time on the shared one-second formation tick.
  }else if(e.type.includes('Cari')){
   // A gentle drifting patrol across both axes; Cari stays in the danger zone.
   const age=w.t-e.waveBorn;
   const targetY=clamp(e.originY+Math.sin(age*.39+e.phase)*34,64,379);
   e.y+=clamp(targetY-e.y,-9,9);
   e.x=clamp(e.x+e.dir*(7+Math.min(4,escalation*.1)),35,765);
   if(e.x<=35||e.x>=765)e.dir*=-1;
  }else if(e.y>408){e.y=Math.max(375,e.y-28);e.returning=false;
  }else if(e.type.includes('Ronaun')){
   const targetX=w.hero.x<280?clamp(w.hero.x,40,270):w.hero.x>520?clamp(w.hero.x,530,760):e.originX;
   e.x+=clamp(targetX-e.x,-9,9);e.y+=clamp((targetX===e.originX?315:clamp(w.hero.y-85,250,545))-e.y,-9,9);
   if(e.x>280&&e.x<520)e.y=Math.min(e.y,397);
  }else if(e.moveAxis==='y'){const offset=Math.sin(w.moveTick*.65+e.phase)*8;e.y=clamp(e.y+offset,36,395);
  }else{e.x=clamp(e.x+e.dir*(10+Math.min(8,escalation*.18)),30,770);if(e.x<=35||e.x>=765)e.dir*=-1;}
  // Re-form if an attack pushed a combatant toward the safe sector.
  if(e.returning&&e.y>380)e.y=Math.max(350,e.y-25);
  if(e.type==='Un Llygadog'&&!e.cornerTriggered&&((e.x<45||e.x>755)&&(e.y<60||e.y>380))){e.cornerTriggered=true;for(let k=0;k<3;k++)summonUnLlygadog(e,true);}
  if(e.type.includes('Wraith')){const dangerous=w.shots.some(s=>!s.dead&&Math.abs(s.x-e.x)<70&&s.y>e.y-120&&s.y<e.y+60);if(dangerous){const dx=e.x-w.hero.x,dy=e.y-w.hero.y;if(Math.abs(dx)>Math.abs(dy))e.x=clamp(e.x+Math.sign(dx||1)*38,30,770);else e.y=clamp(e.y+Math.sign(dy||-1)*32,30,395);}}
 }
 // Un Llygadog's gentle repulsion displaces nearby enemies away from its position.
 for(const wy of whole.filter(e=>e.hp>0&&e.type==='Un Llygadog')){for(const other of whole){if(other===wy||other.hp<=0||other.type==='Wyneb')continue;const dx=other.x-wy.x,dy=other.y-wy.y,dist=Math.hypot(dx,dy);if(dist>1&&dist<110){const push=(110-dist)/110*3;other.x=clamp(other.x+dx/dist*push,30,770);other.y=clamp(other.y+dy/dist*push,30,395);}}}
 // All Cari use one common five-second shield cycle, unaffected by spawn time.
 if(w.t-w.cariShieldTick>=5){w.cariShieldTick+=5;const carriers=whole.filter(e=>e.type.includes('Cari')&&e.hp>0);
  for(const e of whole){if(e.type.includes('Cari')||e.hp<=0)continue;
   if(carriers.some(c=>Math.hypot(e.x-c.x,e.y-c.y)<=102))e.cariShieldHp=CARI_SHIELD_POOL;
  }
 }
 const alive=whole.filter(e=>e.hp>0&&!e.miniboss&&e.type!=='Irusan'&&!e.type.includes('Glas Ghaibhleann')&&!e.glasOrb&&!e.glasDisciple&&e.type!=='Cauldron');if(!alive.length)return;
 const cycle=w.cycle;const specialRate=cycle===0?.025+Math.max(0,w.wave-25)*.00045:Math.min(.25,.075+cycle*.028+Math.max(0,w.wave-25)*.0006);
 // At most the shared attack budget; a selected attacker takes one action.
 for(let j=0;j<Math.min(2,alive.length);j++){if(Math.random()>Math.min(.7,.35+escalation*.007))continue;
  const e=alive[Math.floor(Math.random()*alive.length)];const special=Math.random()<specialRate;
  if(e.type.includes('Ronaun')||e.type.includes('Wraith')){if(special)fireEnemy(e,true);}
  else if(e.type.includes('Disciple')||e.type.includes('Cari')||e.type==='Un Llygadog')fireEnemy(e,special);
 }
}
function start(){world=worldInit();world.hero.hp=maxHeroHP();phase='run';modal='';profile.attempts++;persist();waveStart();drawNow();updateHud();}
function bankWaveRewards(){const w=world;if(!w)return;profile.fragments+=w.fragments;profile.chunks+=w.chunks;profile.kills+=w.score;w.fragments=0;w.chunks=0;w.score=0;persist();}
function endRun(cleared){const w=world;if(!w)return;bankWaveRewards();profile.best=Math.max(profile.best,w.wave);persist();phase='menu';modal=cleared?'clear':'defeat';note=cleared?'Great run!':'The dungeon fought back.';refreshShell();}
function awardEnemy(e){const w=world;if(e.glasOrb)return;if(cromSpriteKey(e.type)){w.defeatSprites.push({type:e.type,x:e.x,y:e.y,born:w.t,boss:e.boss,discipleWeapon:e.discipleWeapon||null});if(w.defeatSprites.length>40)w.defeatSprites.shift();}if(e.boss){profile.bossWins||={};profile.bossWins[e.type]=(profile.bossWins[e.type]||0)+1;}if(e.miniboss)profile.minibossWins=(profile.minibossWins||0)+1;w.score++;w.fragments+=(e.boss?15:e.miniboss?9:1+Number(Math.random()<.16))*(1+Math.floor((w.wave-1)/50));if(e.boss||e.miniboss)w.chunks+=(e.miniboss?1+Math.floor(e.max/1800):2+Math.floor(e.max/1000))*(1+Math.floor((w.wave-1)/50));if(!e.boss&&!e.miniboss&&!e.cauldron&&Math.random()<0.055){w.healthDrops.push({x:e.x,y:e.y,heal:1,until:w.t+12,pulse:Math.random()*6});}if(w.wave%50===0&&w.enemies.length===0)w.chunks+=12;}
function igniteBurst(s,x,y){const w=world;if(s.exploded)return;s.exploded=true;s.dead=true;const radius=linkAt(4)?(.30*(210+5*25)):105+(profile.reforges.crashRadius||0)*25/3;w.ignisBursts.push({x,y,radius,damage:s.damage,originX:s.originX??x,originY:s.originY??y,next:w.t,remaining:3});note='Ignis Plume · three explosions!';}
function updateIgnisBursts(){const w=world;for(const burst of w.ignisBursts){while(burst.remaining>0&&w.t>=burst.next){for(const e of w.enemies){if(e.hp<=0||Math.hypot(e.x-burst.x,e.y-burst.y)>burst.radius+(e.boss?42:15))continue;if(e.type==='Irusan'&&['struggle','cauldron'].includes(e.irusan?.phase))continue;if(damageGlasTarget(e,applyLinkDamage(burst.damage,'ignis',e,{x:burst.originX,y:burst.originY}),'fire')){e.animHitStart=w.t;e.animHitUntil=w.t+.34;}}w.effects.push({x:burst.x,y:burst.y,r:burst.radius,life:.42,color:'#ff803a'});w.effects.push({kind:'ignis-eruption',x:burst.x,y:burst.y,r:burst.radius,stage:3-burst.remaining,life:.52,color:'#ff7b2b'});burst.remaining--;burst.next+=.32;}}w.ignisBursts=w.ignisBursts.filter(b=>b.remaining>0);}
function releaseAqua(){const w=world;if(!w?.aquaCharge)return;const charge=w.aquaCharge;w.aquaCharge=null;const progress=clamp((w.t-charge.started)/heroChargeDuration(),0,1);const spread=aquaSpread(progress);const h=w.hero;const base=skillDefs.find(x=>x.id==='aqua').damage+(profile.reforges.magnumPower||0)*7;const damage=base*((w.urgentBuff>w.t)?1.10:1);for(let i=0;i<5;i++){const off=i-2;w.shots.push({element:'water',x:h.x,y:h.y-18,vx:off*spread,vy:-540,damage,kind:'aqua',fullCharge:progress>=.995,originX:h.x,originY:h.y,dead:false,hit:new Set(),radius:8,penetrate:true,prevX:h.x,prevY:h.y-18,trail:[]});}h.animShotAt=w.t;setHeroAnim('aquaRelease',.42,{aquaReleaseSpread:spread,aquaChargePct:progress});note='Aqua Volley · '+Math.round(progress*100)+'% charge';}
function impact(s,e){const w=world;if(s.hit?.has(e))return;if(s.kind==='ignis'){igniteBurst(s,s.x,s.y);return;}let victims=[e];if(s.kind==='crash'){const radius=210+(profile.reforges.crashRadius||0)*25;const available=w.enemies.filter(z=>z!==e&&z.hp>0&&Math.hypot(z.x-e.x,z.y-e.y)<=radius).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y));victims=[e,...available.slice(0,5+(profile.reforges.crashCount||0)*2)];}
 const factor=s.kind==='crash'?1+Math.max(0,victims.length-1)*(.22+(profile.reforges.crashPower||0)*.07):1;let blocked=false;
 for(const target of victims){if(target.hp<=0)continue;if(target.type==='Irusan'&&['struggle','cauldron'].includes(target.irusan?.phase))continue;const raw=applyLinkDamage(s.damage*factor,s.kind,target,{x:s.originX??s.x,y:s.originY??s.y,fullCharge:s.fullCharge});if(!damageGlasTarget(target,raw,s.element))continue;if(s.kind==='aqua'&&(target.glasBlocker||target.glasOrb||target.glasDisciple)){blocked=true;if(target.glasBlocker&&target.glasOwner?.glas?.giga){const h=w.hero;w.enemyShots.push({x:target.x,y:target.y,vx:(h.x-target.x)*1.15,vy:(h.y-target.y)*1.15,radius:12,kind:'reflected-aqua'});}}target.animHitStart=w.t;target.animHitUntil=w.t+.34;if(s.kind==='crash'&&target!==e)w.effects.push({kind:'crash-fragment-line',x:e.x,y:e.y,toX:target.x,toY:target.y,r:0,life:.30,ttl:.30,color:'#ffd4a2'});w.effects.push({x:target.x,y:target.y,r:5,life:.3,color:s.kind==='crash'?'#f9c36b':'#93f3d9'});}if(s.kind==='crash')w.effects.push({x:e.x,y:e.y,r:12,life:.45,color:'#e6a3ff'});
 if(s.kind!=='ignis'&&world){w.dorchaHits=(w.dorchaHits||0)+1;if(w.dorchaHits>=3){w.dorchaHits-=3;w.dorcha=Math.min(15,(w.dorcha||0)+1);}}s.hit?.add(e);s.dead=blocked||!s.penetrate;
}
function fire(kind,damage,spread=0){const w=world;if(!w)return;const h=w.hero;const boosted=(kind!=='urgent'&&w.urgentBuff>w.t)?1.10:1;damage*=boosted;const count=kind==='tri'?3:kind==='ventus'?5:1;if(kind==='ignis')setHeroAnim('ignis',.5);else if(kind==='ventus')setHeroAnim('ventus',.34);else if(kind==='tri')setHeroAnim('tri',.34);else if(kind==='urgent'||kind==='magnum'||kind==='crash')setHeroAnim('shot',.26);for(let i=0;i<count;i++){const off=i-(count-1)/2;if(kind==='ventus'){w.shots.push({element:'air',x:h.x,y:h.y-28-off*8,vx:0,vy:-430,damage,kind,originX:h.x,originY:h.y,dead:false,hit:new Set(),radius:24,penetrate:true,prevX:h.x,prevY:h.y-28-off*8,trail:[]});}else{w.shots.push({element:kind==='ignis'?'fire':kind==='aqua'?'water':kind==='terra'?'earth':kind==='ventus'?'air':kind==='tri'?(w.triElements?.[i%w.triElements.length]||null):null,x:h.x+off*7,y:h.y-18,vx:off*(kind==='aqua'?64:kind==='tri'?36:spread),vy:-540,damage,kind,originX:h.x,originY:h.y,dead:false,hit:new Set(),radius:5,penetrate:false,prevX:h.x+off*7,prevY:h.y-18,trail:[]});}}}

function startTerraCharge(){if(!world||world.terraCharge)return;world.terraCharge={started:world.t,y:360,dir:-1,speed:260};note='Terra Scourge · choose distance';}
function emitTerraDust(x,y,baseR=120,count=10){const w=world;if(!w)return;for(let i=0;i<count;i++){const ang=Math.random()*Math.PI*2;const dist=Math.random()*baseR*.72;w.effects.push({kind:'terra-dust',x:x+Math.cos(ang)*dist,y:y+Math.sin(ang)*dist*.72,r:10+Math.random()*14,life:.38+Math.random()*.26,color:Math.random()>.55?'#a88952':'#d7bf88',vx:(Math.random()-.5)*10,vy:-6-Math.random()*14});}for(let i=0;i<4;i++){const ang=(Math.PI*2/4)*i+Math.random()*.35;const dist=baseR*(.52+Math.random()*.2);w.effects.push({kind:'terra-shard',x:x+Math.cos(ang)*dist,y:y+Math.sin(ang)*dist*.5,r:8+Math.random()*8,life:.34+Math.random()*.18,color:'#e3d0a0',vx:Math.cos(ang)*(8+Math.random()*14),vy:-10-Math.random()*14});}}
function releaseTerra(){const w=world;if(!w?.terraCharge)return;const tc=w.terraCharge;w.terraCharge=null;const d=skillDefs.find(x=>x.id==='terra');const zone={x:w.hero.x,y:tc.y,r:120,damage:((w.urgentBuff>w.t)?1.10:1)*d.damage,next:w.t,until:w.t+(linkAt(7)?17:10),hits:0};w.terraZones.push(zone);w.effects.push({x:zone.x,y:zone.y,r:zone.r,life:.8,color:'#dfbd77'});w.effects.push({kind:'terra-cast',x:w.hero.x,y:w.hero.y-12,r:18,life:.46,color:'#c7a462'});w.effects.push({kind:'terra-cast-ring',x:w.hero.x,y:w.hero.y+4,r:22,life:.54,color:'#d9c28c'});emitTerraDust(zone.x,zone.y,zone.r,12);setHeroAnim('terraRelease',.46);note='Terra Scourge unleashed';}
function updateTerra(dt){const w=world;if(w.terraCharge){const tc=w.terraCharge;tc.y+=tc.dir*tc.speed*dt;if(tc.y<120){tc.y=120;tc.dir=1;}if(tc.y>520){tc.y=520;tc.dir=-1;}}
 for(const z of w.terraZones){while(w.t>=z.next&&z.next<=z.until+1e-6){for(const e of w.enemies){if(e.hp<=0||Math.hypot(e.x-z.x,e.y-z.y)>z.r+(e.boss?42:15))continue;if(e.type==='Irusan'&&['struggle','cauldron'].includes(e.irusan?.phase))continue;damageGlasTarget(e,applyLinkDamage(z.damage,'terra',e,{x:z.x,y:z.y}),'earth');}w.effects.push({x:z.x,y:z.y,r:z.r,life:.42,color:'#d9b96c'});w.effects.push({kind:'terra-crack',x:z.x,y:z.y,r:z.r*.68,life:.28,color:'#8d6c39'});emitTerraDust(z.x,z.y,z.r,10);z.hits++;z.next+=3;}}
 w.terraZones=w.terraZones.filter(z=>w.t<=z.until+.3);
}
function updateVentus(dt){const w=world;for(const v of w.ventusTunnels){if(Math.random()<.9){const py=rand(Math.max(40,v.y2+18),v.y1-24);const side=(Math.random()>.5?1:-1);const offset=v.width+18+Math.random()*42;w.effects.push({kind:'ventus-stream',x:v.x+side*offset,y:py,r:10+Math.random()*8,life:.28+Math.random()*.08,color:'#b7f4ff',vx:-side*(42+Math.random()*30),vy:-22-Math.random()*18});}for(const e of w.enemies){if(e.hp<=0||e.glasOrb||e.glasDisciple||e.type.includes('Glas Ghaibhleann')||e.type==='Irusan'||e.cauldron)continue;const dy=v.y1-e.y;if(dy<0||dy>v.length)continue;const dx=e.x-v.x;const ax=Math.abs(dx);if(ax<150){const pull=(1-ax/150)*v.pull*dt;const sign=dx===0?0:dx>0?-1:1;e.x=clamp(e.x+sign*pull,30,770);if(Math.random()<Math.max(.15,.7-ax/180)){w.effects.push({kind:'ventus-pull',x:e.x+dx*.08,y:e.y+rand(-14,14),r:7+Math.random()*5,life:.18+Math.random()*.08,color:'#d3fdff',vx:sign*(18+Math.random()*30),vy:-6-Math.random()*10});}if(ax<v.width){damageGlasTarget(e,applyLinkDamage(v.damage*dt*1.65,'ventus',e,{x:v.x,y:v.y1}),'air');e.animHitStart=w.t;e.animHitUntil=w.t+.08;if(Math.random()<.45)w.effects.push({kind:'ventus-hit',x:v.x+rand(-v.width*.45,v.width*.45),y:e.y+rand(-16,16),r:10+Math.random()*6,life:.2+Math.random()*.1,color:'#e4ffff',vx:(Math.random()-.5)*12,vy:-14-Math.random()*10});}}}}
 w.ventusTunnels=w.ventusTunnels.filter(v=>w.t<v.until);
}

function releaseAnchor(){const w=world;if(!w?.anchorAim)return;const aim=w.anchorAim;w.anchorAim=null;if(w.dorcha<1)return;w.dorcha--;const h=w.hero;w.anchorDash={start:w.t,fromX:h.x,fromY:h.y,toX:clamp(aim.x,30,770),toY:clamp(h.y+78,30,585)};h.inv=Math.max(h.inv,.5);setHeroAnim('anchorDash',.5);w.effects.push({x:aim.x,y:h.y+80,r:24,life:.5,color:'#9f69e9'});note='Anchor Rush!';}
function updateAnchor(dt){const w=world;if(w.anchorAim){const a=w.anchorAim;a.x+=a.direction*260*dt;if(a.x>=770){a.x=770;a.direction=-1;}if(a.x<=30){a.x=30;a.direction=1;}}if(w.anchorDash){const d=w.anchorDash;const p=clamp((w.t-d.start)/.5,0,1);w.hero.x=d.fromX+(d.toX-d.fromX)*p;w.hero.y=d.fromY+(d.toY-d.fromY)*p;w.hero.inv=Math.max(w.hero.inv,.5-p*.5);if(p>=1)w.anchorDash=null;}}
function cast(id){if(phase!=='run'||!world)return;const d=skillDefs.find(x=>x.id===id);if(!d||!profile.skills[id]||world.hero.transformedUntil>world.t||world.irusanPower)return;const now=world.t;if(id!=='terra'&&world.terraCharge)return;if(id==='anchor'){if(world.dorcha<1||world.anchorAim||world.anchorDash)return;world.anchorAim={x:world.hero.x,direction:1};setHeroAnim('anchorAim',.6);note='Anchor Rush · choose anchor';updateHud();return;}if(now-(world.lastCast[id]??-1e9)<d.cd)return;if(id==='terra'){world.lastCast[id]=now;world.hero.animShotAt=now;setHeroAnim('terraCharge',.4);if(linkAt(2))world.hero.linkHasteUntil=now+2.5;world.elements.earth=Math.min(100,(world.elements.earth||0)+100*(linkAt(6)?1.3:1));startTerraCharge();updateHud();return;}world.lastCast[id]=now;world.hero.animShotAt=now;if(linkAt(2))world.hero.linkHasteUntil=now+2.5;const element={ignis:'fire',aqua:'water',terra:'earth',ventus:'air'}[id];if(element){const amount={ignis:36,aqua:52,ventus:78,terra:100}[id]||0;world.elements[element]=Math.min(100,(world.elements[element]||0)+amount*(linkAt(6)?1.3:1));}if(id==='urgent'){world.urgentBuff=now+10;note='Archery Enhancement · +10% for 10s';fire(id,d.damage);}else if(id==='tri'){const owned=GLAS_ELEMENTS.filter(el=>world.elements[el]>0);world.triElements=owned.length?owned:[null];for(const el of owned)world.elements[el]=Math.max(0,world.elements[el]-100);note=owned.length?'Tri-Assault · '+owned.join(' / '):'Tri-Assault · no elemental orbs charged';fire(id,d.damage);shovePlayer(0,44);}else if(id==='aqua'){world.aquaCharge={started:now};setHeroAnim('aquaCharge',heroChargeDuration());note='Aqua Volley · charging';updateHud();return;}else if(id==='golden'){for(const el of GLAS_ELEMENTS)world.elements[el]=100;world.boostUntil=now+7;note='Golden Time!';}else if(id==='ventus'){world.ventusTunnels.push({x:world.hero.x,y1:world.hero.y,y2:0,length:world.hero.y,width:58+(linkAt(3)?24:0),pull:270,damage:d.damage,until:now+1.2});world.effects.push({kind:'ventus-cast',x:world.hero.x,y:world.hero.y-8,r:18,life:.46,color:'#bcefff'});world.effects.push({kind:'ventus-cast-ring',x:world.hero.x,y:world.hero.y+6,r:20,life:.62,color:'#8feaff'});fire(id,d.damage);note='Ventus Howl · pulling';}else{fire(id,d.damage);}updateHud();}
function tick(dt){if(phase!=='run'||!world)return;const w=world;w.t+=dt;if(w.irusanPower)w.hero.inv=Math.max(w.hero.inv,999);if(w.aquaCharge&&w.t-w.aquaCharge.started>=(linkAt(8)?1:2))releaseAqua();updateIgnisBursts();updateAnchor(dt);updateTerra(dt);updateVentus(dt);const h=w.hero;h.inv=Math.max(0,h.inv-dt);h.frozen=Math.max(0,(h.frozen||0)-dt);h.stunned=Math.max(0,(h.stunned||0)-dt);const crossings=w.ronaunLines.filter(l=>l.owner.hp>0&&lineDistance(h.x,h.y,l)<19).length;h.tangled=crossings;const v=290*dt*(linkAt(2)&&h.linkHasteUntil>w.t?1.2:1)*(crossings>=3?0:crossings?Math.max(.23,1-crossings*.35):1);const left=keys.has('arrowleft')||keys.has('a'),right=keys.has('arrowright')||keys.has('d'),up=keys.has('arrowup')||keys.has('w'),down=keys.has('arrowdown')||keys.has('s');const analogActive=Math.abs(touchMove.x)+Math.abs(touchMove.y)>.02;if(!w.anchorDash&&!w.irusanPower&&!h.frozen&&!(h.stunned>0)&&crossings<3&&(left||right||up||down||analogActive)){const dx=(right?1:0)-(left?1:0)+touchMove.x,dy=(down?1:0)-(up?1:0)+touchMove.y;const magnitude=Math.max(1,Math.hypot(dx,dy));h.x+=dx/magnitude*v;h.y+=dy/magnitude*v;}else if(!w.anchorDash&&!w.irusanPower&&!h.frozen&&!(h.stunned>0)&&crossings<3&&mouse.active){h.x+=(mouse.x-h.x)*Math.min(1,dt*8);h.y+=(mouse.y-h.y)*Math.min(1,dt*8);}h.x=clamp(h.x,30,770);h.y=clamp(h.y,30,585);const heroStep=Math.hypot(h.x-(h.lastX??h.x),h.y-(h.lastY??h.y));h.isMoving=heroStep>.18;if(h.isMoving){h.moveTime=(h.moveTime||0)+dt;h.idleTime=0;}else h.idleTime=(h.idleTime||0)+dt;h.lastX=h.x;h.lastY=h.y;for(const drop of w.healthDrops){if(Math.hypot(h.x-drop.x,h.y-drop.y)<24&&h.hp<maxHeroHP()){h.hp=Math.min(maxHeroHP(),h.hp+(drop.heal||1));drop.dead=true;note='Recovered HP';}}w.healthDrops=w.healthDrops.filter(d=>!d.dead&&w.t<d.until);
 const autoGap=w.boostUntil>w.t?.3:1;if(!w.irusanPower&&!(h.transformedUntil>w.t)&&w.t-w.lastAuto>=autoGap){w.lastAuto=w.t;fire('magnum',BASE_MAGNUM_DAMAGE+(profile.reforges.magnumPower||0)*7);h.animShotAt=w.t;setHeroAnim('shot',.22);}
 if(!w.irusanPower&&!(h.transformedUntil>w.t)&&w.t-(w.lastCloseAuto||0)>=autoGap){const nearby=w.enemies.filter(e=>e.hp>0&&!e.glasOrb&&!e.cauldron&&Math.hypot(e.x-h.x,e.y-h.y)<=BASIC_RANGED_RANGE).sort((a,b)=>Math.hypot(a.x-h.x,a.y-h.y)-Math.hypot(b.x-h.x,b.y-h.y));if(nearby.length){const target=nearby[0],power=(18+(profile.reforges.magnumPower||0)*7)/6*((w.urgentBuff>w.t)?1.1:1);w.lastCloseAuto=w.t;for(const off of [-7,7]){const sx=h.x+off,sy=h.y-13,dx=target.x-sx,dy=target.y-sy,dist=Math.max(1,Math.hypot(dx,dy));w.shots.push({x:sx,y:sy,vx:dx/dist*610,vy:dy/dist*610,damage:power,kind:'close-ranged',originX:h.x,originY:h.y,dead:false,hit:new Set(),radius:7,penetrate:false,prevX:sx,prevY:sy,trail:[],maxTravel:BASIC_RANGED_RANGE+24,traveled:0});}w.effects.push({x:h.x,y:h.y-17,r:16,life:.2,color:'#d8ecff'});}}
 updateGwallgof(dt);updateMelci(dt);
 // One deliberate formation / attack frame each second.
 while(w.t-w.moveTick>=1){w.moveTick++;moveEnemiesFrame();}updateWyneb(dt);
 if(w.enemies.length&&w.t>=w.wraithDue){if(w.wave>=6&&Math.random()<.42)spawnWraith();w.wraithDue=w.t+rand(11,21);}
 for(const s of w.shots){s.prevX=s.x;s.prevY=s.y;s.trail ||= [];s.trail.unshift({x:s.x,y:s.y});if(s.trail.length>6)s.trail.length=6;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.kind==='close-ranged'){s.traveled=(s.traveled||0)+Math.hypot(s.vx,s.vy)*dt;if(s.traveled>(s.maxTravel||90))s.dead=true;}if(s.kind==='ignis'){w.effects.push({x:s.x,y:s.y,r:11,life:.34,color:'#ff6d31'});}if(s.kind==='aqua'){w.effects.push({x:s.x,y:s.y+13,r:5,life:.25,color:'#5de5fa'});}if(s.y<-25||s.y>635||s.x<-20||s.x>820){if(s.kind==='ignis')igniteBurst(s,clamp(s.x,0,800),clamp(s.y,0,620));else s.dead=true;}if(s.dead)continue;for(const e of w.enemies){if(e.hp<=0||s.dead)continue;if(s.hit?.has(e))continue;if(Math.abs(s.x-e.x)<(e.boss?48:20)+s.radius&&Math.abs(s.y-e.y)<(e.boss?40:18)+s.radius){impact(s,e);if(s.penetrate&&!s.dead){s.damage*=s.kind==='aqua'?1:.76;}} }}
 w.shots=w.shots.filter(x=>!x.dead);for(const e of w.enemies.filter(x=>x.hp<=0&&!x.consumedByGlas&&!x.exploded))awardEnemy(e);w.enemies=w.enemies.filter(x=>x.hp>0);w.ronaunLines=w.ronaunLines.filter(l=>l.owner.hp>0);
 updateMelciZones(dt);updateDiscipleZones();updateIrusan(dt);updateGlas(dt);if(h.hp<=0){endRun(false);return;}w.wraithRoarStacks=w.wraithRoarStacks.filter(until=>until>w.t);for(const b of w.enemyShots){b.x+=(b.vx||0)*dt;b.y+=b.vy*dt;if(Math.hypot(b.x-h.x,b.y-h.y)<21+(b.radius||5)&&h.inv<=0){h.hp-=(1+Math.min(3,w.wraithRoarStacks.length)*.25)*harmFactor();h.inv=1.4;h.lastDamageAt=w.t;b.dead=true;if(b.kind==='freeze'){h.frozen=3;note='Frozen for 3 seconds!';}else note='Hit!';if(h.hp<=0){endRun(false);return;}}}w.enemyShots=w.enemyShots.filter(x=>!x.dead&&x.y<640&&x.y>-30&&x.x>-30&&x.x<830);
 for(const e of w.enemies){if(e.type.includes('Gwallgof')&&Math.hypot(e.x-h.x,e.y-h.y)<35&&h.inv<=0){h.hp-=(1+Math.min(3,w.wraithRoarStacks.length)*.25)*harmFactor();h.inv=1.4;h.lastDamageAt=w.t;if(h.hp<=0){endRun(false);return;}}if(e.y>615){h.hp--;h.lastDamageAt=w.t;e.hp=-1;if(h.hp<=0){endRun(false);return;}}}w.enemies=w.enemies.filter(e=>e.hp>=0);w.effects=w.effects.filter(e=>(e.life-=dt)>0);w.defeatSprites=w.defeatSprites.filter(e=>w.t-e.born<.58);
 if(!w.enemies.length){w.glasZones=[];profile.best=Math.max(profile.best,w.wave);if(!w.spawnDue)w.spawnDue=w.t+5;else if(w.t>=w.spawnDue){if(w.wave%50===0){profile.clears++;w.chunks+=15;note='50-wave clear! Bonus round begins!';}profile.waveClears=(profile.waveClears||0)+1;profile.highestCycle=Math.max(profile.highestCycle||0,Math.floor(w.wave/50));bankWaveRewards();waveStart();}}
 updateHud();}
// Companion 209: individually extracted, transparent approved sprite art; original canvas silhouettes remain as fallback.
// Fixed-camera environment atlas: artwork changes by wave, hitboxes never do.
const CROM_ROOMS=['Vestibule','Abandoned Chapel','Grand Nave','Processional Hall','Ruined Cloister','Moonlit Courtyard','Reliquary Hall','Shadow Gallery','Sunken Crypt','Bloodstone Sanctuary','Collapsed Transept','Abyssal Ritual Hall','Ascension Hall','Shattered Observatory','Storm Battlements','Summit Approach'];
const CROM_ENV={};for(let i=1;i<=16;i++){const image=new Image();image.src='assets/crom/environments/room-'+String(i).padStart(2,'0')+'.webp';CROM_ENV[i]=image;}
for(const i of [20,40,50]){const image=new Image();image.src='assets/crom/environments/roof-'+i+'.webp';CROM_ENV['roof'+i]=image;}
function environmentForWave(w){const n=(w.wave-1)%50+1;if(n===20||n===40||n===50)return 'roof'+n;return 1+Math.floor((n-1)/3)%16;}
function cromEnvironment(c,w){const id=environmentForWave(w),im=CROM_ENV[id];if(im?.complete&&im.naturalWidth)c.drawImage(im,0,0,800,620);else{c.fillStyle='#262032';c.fillRect(0,0,800,620);}const n=(w.wave-1)%50+1;const corruption=Math.min(.33,.035+w.cycle*.045+n/50*.18);c.fillStyle='rgba(77,17,126,'+(corruption*(.7+.3*Math.sin(w.t*.85)))+')';c.fillRect(0,0,800,620);
 // pulse along ritual fissures, kept faint behind projectiles and warning geometry
 c.save();c.globalAlpha=.11+.06*Math.sin(w.t*1.2);c.strokeStyle='#bb68fd';c.lineWidth=2;for(let j=0;j<6;j++){const x=90+j*121;c.beginPath();c.moveTo(x,68);c.lineTo(x+13,166);c.lineTo(x-9,251);c.stroke();}c.restore();
 // Irusan's fleeting silhouette: visual only, always under telegraphs and actors
 const passing=(w.t%28);if(passing<4){c.save();c.translate(-180+passing*280,110);c.rotate(-.21);c.fillStyle='rgba(5,3,15,'+(.13*Math.sin(Math.PI*passing/4))+')';c.beginPath();c.moveTo(-155,-30);c.quadraticCurveTo(-40,-120,0,-5);c.quadraticCurveTo(75,-110,180,-20);c.quadraticCurveTo(60,8,0,28);c.quadraticCurveTo(-90,15,-155,-30);c.fill();c.restore();}
 c.save();c.font='bold 12px system-ui';c.textAlign='left';c.fillStyle='rgba(225,210,240,.72)';c.fillText(typeof id==='string'?'ROOFTOP · '+(n===50?'GIGA GLAS':n===40?'SHATTERED SUMMIT':'ALTAR OF GLAS'):CROM_ROOMS[id-1].toUpperCase(),18,24);c.restore();}
// Dedicated four-frame hero action strips (Ignis, Aqua, Terra, Ventus) built
// from the existing playable archer artwork. The normal atlas remains for idle/movement.
const HERO_ELEMENTAL_ATLAS=new Image();
HERO_ELEMENTAL_ATLAS.src='assets/crom/sprites/archer-elemental-atlas.png';
const HERO_ELEMENTAL_ROWS={ignis:0,aquaCharge:1,aquaRelease:1,terraCharge:2,terraRelease:2,ventus:3};
function drawHeroElemental(ctx,mode,x,y,time,progress){
 if(!HERO_ELEMENTAL_ATLAS.complete||!HERO_ELEMENTAL_ATLAS.naturalWidth)return false;
 const row=HERO_ELEMENTAL_ROWS[mode];if(row===undefined)return false;
 const frame=mode==='aquaCharge'?Math.min(3,Math.floor((progress||0)*4)):
  mode==='terraCharge'?Math.floor(Math.max(0,time)/.14)%3:
  Math.min(3,Math.floor(Math.max(0,time)/.105));
 ctx.save();ctx.imageSmoothingEnabled=true;
 ctx.drawImage(HERO_ELEMENTAL_ATLAS,frame*144,row*144,144,144,x-29,y-5-36,58,72);
 ctx.restore();return true;
}
// Dedicated Melci action frames preserve her approved character design.
// Each row has eight 192x192 transparent frames: sprint, flame, airborne kunai, landing.
const MELCI_ACTION_ATLAS=new Image();
MELCI_ACTION_ATLAS.src='assets/crom/sprites/melci-action-atlas.png';
function drawMelciAction(ctx,e,width,height){
 if(!MELCI_ACTION_ATLAS.complete||!MELCI_ACTION_ATLAS.naturalWidth)return false;
 const state=e.melciState||'run',now=world.t;
 let row=0,frame=0;
 if(state==='flame'){
  row=1;
  const elapsed=Math.max(0,now-(e.animAttackStart||now));
  frame=elapsed<.28?0:elapsed<.58?1:elapsed<1?2:elapsed<1.55?3:elapsed<2.15?4:elapsed<2.5?5:elapsed<2.78?6:7;
 }else if(state==='kunai'){
  row=2;
  const elapsed=Math.max(0,now-(e.animAttackStart||now));
  // Make the sequence read clearly as: target -> crouch/lift -> airborne throw -> descent.
  frame=elapsed<.20?0:elapsed<.40?1:elapsed<.62?2:elapsed<.92?3:elapsed<1.28?4:elapsed<1.72?5:elapsed<2.18?6:7;
 }else if(state==='land'){
  row=3;
  const elapsed=Math.max(0,now-(e.melciLandAt||now));
  frame=elapsed<.07?0:elapsed<.13?1:elapsed<.19?2:elapsed<.25?3:elapsed<.31?4:elapsed<.37?5:elapsed<.43?6:7;
 }else{
  row=0;
  frame=Math.floor(Math.max(0,now-e.waveBorn)/.11)%8;
 }
 const lift=e.renderLift||0;
 // The body rises while the floor marker and targeting circle remain anchored.
 if(lift>0){ctx.save();ctx.fillStyle='rgba(6,4,16,.28)';ctx.beginPath();ctx.ellipse(e.x,e.y+28,18,6,0,0,Math.PI*2);ctx.fill();ctx.restore();}
 ctx.save();ctx.imageSmoothingEnabled=true;
 const drawW=width*1.22,drawH=height*1.35;
 ctx.drawImage(MELCI_ACTION_ATLAS,frame*192,row*192,192,192,e.x-drawW/2,e.y-5-lift-drawH/2,drawW,drawH);
 ctx.restore();return true;
}
const CROM_SPRITES={};
const CROM_STATES={idle:0,move:1,attack:2,hit:3,defeat:4};
for(const name of ['disciple-sword','disciple-guns','disciple-staff','ronaun','gwallgof','un-llygadog','cari','wyneb','wraith','irusan','glas','giga-glas','archer','melci','disciple','cauldron']){
 const im=new Image();im.src='assets/crom/sprites/'+name+'-atlas.png';CROM_SPRITES[name]=im;
}
function cromSprite(ctx,name,x,y,width,height,state='idle',time=0,alpha=1){
 const image=CROM_SPRITES[name];if(!image?.complete||!image.naturalWidth)return false;
 const row=CROM_STATES[state]??0;
 const durations={idle:.28,move:.11,attack:.1,hit:.09,defeat:.15};
 const frame=Math.floor(Math.max(0,time)/durations[state||'idle'])%4;
 ctx.save();ctx.imageSmoothingEnabled=true;ctx.globalAlpha*=alpha;
 ctx.drawImage(image,frame*144,row*144,144,144,x-width/2,y-height/2,width,height);ctx.restore();return true;
}
function cromAnimState(e){
 if(e.hp<=0)return 'defeat';
 if(e.type==='Wyneb'&&e.wynebState==='bomb')return 'attack';
 if(e.animHitUntil>world.t)return 'hit';
 if(e.animAttackUntil>world.t)return 'attack';
 if(e.type==='Irusan'&&e.irusan?.phase!=='ready'&&e.irusan?.phase)return 'attack';
 if(e.glas&&(world.glasZones.length||e.glas.berserk))return 'attack';
 if(e.type==='Wyneb'&&e.wynebState==='chase')return 'move';
 if(e.type.includes('Melci'))return Math.hypot(e.x-(e.animLastX??e.x),e.y-(e.animLastY??e.y))>.7?'move':'idle';
 if(e.type.includes('Gwallgof')||e.type==='Wraith'||e.type==='Un Llygadog')return 'move';
 return Math.hypot(e.x-(e.animLastX??e.x),e.y-(e.animLastY??e.y))>1.5?'move':'idle';
}
function cromDrawEnemy(ctx,e,width,height){
 const name=cromSpriteKey(e.type);if(!name)return false;
 if(name==='disciple'&&e.discipleWeapon){const state=cromAnimState(e);const elapsed=state==='attack'?world.t-(e.animAttackStart||world.t):world.t-e.waveBorn;e.animLastX=e.x;e.animLastY=e.y;return cromSprite(ctx,'disciple-'+e.discipleWeapon,e.x,e.y-5,width*1.15,height*1.13,state,elapsed);}
 if(name==='melci'&&drawMelciAction(ctx,e,width,height)){e.animLastX=e.x;e.animLastY=e.y;return true;}
 const state=cromAnimState(e);const time=state==='attack'?world.t-(e.animAttackStart||0):state==='hit'?world.t-(e.animHitStart||0):world.t-e.waveBorn;
 const lift=e.renderLift||0; if(lift>0){ctx.save();ctx.globalAlpha*=.34;ctx.fillStyle='#050711';ctx.beginPath();ctx.ellipse(e.x,e.y+26,17,6,0,0,Math.PI*2);ctx.fill();ctx.restore();}
 e.animLastX=e.x;e.animLastY=e.y;
 return cromSprite(ctx,name,e.x,e.y-5-lift,width,height,state,time);
}
function cromSpriteKey(type){if(type.startsWith('Giga Glas'))return 'giga-glas';if(type.includes('Glas'))return 'glas';if(type==='Irusan')return 'irusan';if(type==='Cauldron')return 'cauldron';if(type.includes('Disciple'))return 'disciple';if(type.includes('Ronaun'))return 'ronaun';if(type.includes('Gwallgof'))return 'gwallgof';if(type==='Un Llygadog')return 'un-llygadog';if(type==='Wyneb')return 'wyneb';if(type.includes('Cari'))return 'cari';if(type.includes('Wraith'))return 'wraith';if(type.includes('Melci'))return 'melci';return null;}
// Small original fantasy silhouettes; designed to remain readable in a crowded 800x620 arena.
function art(ctx,type,x,y,boss){const sprite=cromSpriteKey(type);if(sprite&&cromSprite(ctx,sprite,x,y-5,boss?112:56,boss?105:62))return;ctx.save();ctx.translate(x,y);ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle='#120f23';ctx.lineWidth=2.5;
 const path=(pts,fill)=>{ctx.fillStyle=fill;ctx.beginPath();pts.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.fill();ctx.stroke();};
 const oval=(xx,yy,rx,ry,fill)=>{ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(xx,yy,rx,ry,0,0,7);ctx.fill();ctx.stroke();};
 if(type.includes('Glas')){const giga=type.startsWith('Giga');path([[-35,-5],[-54,-35],[-23,-25],[0,-37],[24,-25],[55,-35],[35,1],[25,39],[-24,39]],giga?'#4f327e':'#514e57');path([[-12,-32],[0,-50],[14,-32],[23,3],[13,35],[-15,35],[-23,3]],giga?'#7053c3':'#bdb5a6');for(const wing of [-1,1]){path([[wing*20,-20],[wing*67,-70],[wing*58,5],[wing*27,11]],giga?'#472064':'#343039');}ctx.strokeStyle='#b96afa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(0,22);ctx.lineTo(8,-20);ctx.stroke();}
 else if(type==='Irusan'){path([[-17,-23],[-28,32],[0,39],[28,32],[17,-23]],'#c6c4d3');oval(0,-30,13,16,'#858394');path([[-22,-43],[0,-55],[22,-43],[27,-19],[9,-37],[-9,-37],[-27,-19]],'#f0edf0');ctx.strokeStyle='#b77bac';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-20,16);ctx.lineTo(-10,40);ctx.moveTo(20,16);ctx.lineTo(10,40);ctx.stroke();}
 else if(type.includes('Ronaun')){path([[-15,-15],[-22,25],[-7,34],[8,34],[23,25],[15,-15]],'#514951');oval(0,-15,18,20,'#49434d');ctx.fillStyle='#292b32';ctx.fillRect(-15,-35,30,28);ctx.strokeRect(-15,-35,30,28);for(let i=-10;i<=10;i+=10){ctx.strokeStyle='#a0a2a8';ctx.beginPath();ctx.moveTo(i,-34);ctx.lineTo(i,-8);ctx.stroke();}ctx.fillStyle='#e04466';ctx.fillRect(-8,-21,16,5);}
 else if(type.includes('Gwallgof')){path([[-17,-23],[-25,27],[-11,40],[14,38],[25,27],[17,-23]],'#302b3c');path([[-20,-19],[-33,-5],[-22,-34],[0,-45],[18,-37],[33,-8],[20,-10]],'#453b53');for(const side of [-1,1])path([[side*8,-34],[side*22,-58],[side*15,-19]],'#ae294d');oval(-8,-21,5,7,'#e4dac9');}
 else if(type==='Un Llygadog'){path([[-16,-29],[-25,23],[0,38],[24,20],[17,-29]],'#302441');path([[-17,-20],[-22,33],[-6,30],[-2,39],[17,27],[23,-20]],'#552e70');oval(0,-21,15,17,'#28283c');oval(0,-22,9,11,'#cfa9de');oval(0,-22,4,7,'#ad38ef');for(const side of [-1,1])path([[side*13,-28],[side*22,-47],[side*19,-22]],'#a83276');}
 else if(type==='Wyneb'){oval(0,10,22,15,'#a758d1');path([[-20,12],[-11,-5],[0,-9],[13,-4],[21,12]],'#d9a4f0');oval(-7,6,4,5,'#302342');oval(8,6,4,5,'#302342');oval(0,-9,12,6,'#f4b8f6');}
 else if(type.includes('Cari')){oval(0,13,17,21,'#eef0f1');oval(0,-16,17,19,'#eeeefa');for(const side of [-1,1]){path([[side*7,-27],[side*16,-43],[side*20,-14]],'#24283a');path([[side*15,1],[side*31,-21],[side*32,24]],'#8442c6');}oval(-7,-15,3,5,'#4be0ff');oval(8,-15,3,5,'#e8b142');ctx.strokeStyle='#f4bd64';ctx.beginPath();ctx.moveTo(-7,6);ctx.lineTo(7,11);ctx.stroke();}
 else if(type.includes('Wraith')){path([[-12,-20],[-22,18],[-14,40],[-5,25],[6,41],[20,19],[14,-20]],'#54298f');path([[-19,-18],[-9,-43],[13,-43],[22,-17],[13,11],[-14,11]],'#4b1f81');oval(0,-22,12,18,'#9253e2');oval(0,-21,4,8,'#f3acff');}
 else if(type.includes('Melci')){path([[-18,-15],[-24,20],[-12,36],[13,36],[24,20],[18,-15]],'#943b3d');oval(0,-23,17,17,'#373344');for(const side of [-1,1]){path([[side*8,-31],[side*17,-50],[side*15,-16]],'#999299');}ctx.strokeStyle='#ff6854';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(22,2);ctx.lineTo(36,16);ctx.stroke();}
 else if(type.includes('Disciple')){path([[-17,-20],[-24,20],[-12,36],[12,36],[24,20],[18,-18]],'#161820');path([[-11,-14],[-18,12],[0,28],[18,12],[11,-14]],'#221f29');oval(0,-24,14,16,'#e7dccd');path([[-11,-32],[-18,-10],[18,-10],[11,-32],[0,-40]],'#17191f');ctx.fillStyle='#020202';ctx.fillRect(-10,-26,20,10);ctx.fillStyle='#d0d0d0';ctx.fillRect(-7,-23,4,2);ctx.fillRect(3,-23,4,2);}
 else if(type==='Cauldron'){oval(0,8,24,18,'#3f3740');path([[-21,-2],[-25,18],[-13,31],[14,31],[24,17],[20,-2]],'#2e2a32');oval(0,-8,23,10,'#6e636e');oval(0,-16,18,9,'#a05be1');ctx.strokeStyle='#8a73a1';ctx.beginPath();ctx.moveTo(-22,-4);ctx.quadraticCurveTo(-34,-2,-29,12);ctx.moveTo(22,-4);ctx.quadraticCurveTo(34,-2,29,12);ctx.stroke();}
 else{path([[-15,-15],[-19,22],[0,33],[20,22],[15,-15]],'#5f526f');path([[-19,-16],[-11,-40],[11,-40],[19,-16]],'#47405e');oval(0,-19,11,12,'#9f7baf');ctx.fillStyle='#e97982';ctx.fillRect(-7,-23,14,3);}
 ctx.restore();}
function drawHeroShadow(ctx,x,y,alpha=.22){ctx.save();ctx.globalAlpha*=alpha;ctx.fillStyle='#050711';ctx.beginPath();ctx.ellipse(x,y+27,18,7,0,0,Math.PI*2);ctx.fill();ctx.restore();}
function drawIgnisPoseFX(ctx,x,y,progress){
 const originY=y-22;
 ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';
 ctx.strokeStyle='rgba(255,129,29,.75)';ctx.lineWidth=2.5;
 ctx.shadowColor='#ff671d';ctx.shadowBlur=14;
 for(let i=0;i<3;i++){
  const side=i-1,offset=side*7;
  ctx.beginPath();ctx.moveTo(x+offset,originY+9);ctx.quadraticCurveTo(x+offset*1.8+Math.sin(progress*20+i)*5,originY-8,x+offset*.5,originY-18-progress*20);ctx.stroke();
 }
 ctx.shadowBlur=18;ctx.strokeStyle='rgba(255,199,90,.98)';ctx.lineWidth=3;
 ctx.beginPath();ctx.moveTo(x,originY+10);ctx.lineTo(x,originY-38-progress*22);ctx.stroke();
 ctx.fillStyle='#fff3b4';ctx.beginPath();ctx.moveTo(x,originY-47-progress*22);ctx.lineTo(x-7,originY-30-progress*22);ctx.lineTo(x,originY-35-progress*22);ctx.lineTo(x+7,originY-30-progress*22);ctx.closePath();ctx.fill();
 ctx.restore();
}
function drawAquaChargeFX(ctx,x,y,progress,release=false){
 const originY=y-25,reach=release?95:60,spread=aquaSpread(progress);
 ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';ctx.lineJoin='round';
 const opacity=release?.92:.40+progress*.28;
 for(let i=-2;i<=2;i++){
  const endX=x+i*spread*reach/540;
  const tipY=originY-reach;
  ctx.shadowColor='#5ceaff';ctx.shadowBlur=release?15:8;
  ctx.strokeStyle='rgba(126,241,255,'+opacity+')';ctx.lineWidth=i===0?3.4:2.2;
  ctx.beginPath();ctx.moveTo(x,originY);ctx.lineTo(endX,tipY);ctx.stroke();
  ctx.fillStyle='rgba(190,252,255,'+opacity+')';ctx.beginPath();ctx.moveTo(endX,tipY-6);ctx.lineTo(endX-4,tipY+9);ctx.lineTo(endX,tipY+4);ctx.lineTo(endX+4,tipY+9);ctx.closePath();ctx.fill();
 }
 ctx.shadowBlur=0;ctx.strokeStyle='rgba(163,242,255,.8)';ctx.lineWidth=2;
 ctx.beginPath();ctx.ellipse(x,originY+5,15+8*progress,5+3*progress,0,0,Math.PI*2);ctx.stroke();
 if(progress>.88){ctx.shadowColor='#b9f8ff';ctx.shadowBlur=12;ctx.fillStyle='rgba(210,252,255,.85)';ctx.beginPath();ctx.ellipse(x,originY-6,5,12,0,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
function drawHeroShot(ctx,s){ctx.save();if(s.kind==='ignis'){ctx.lineCap='round';for(let i=0;i<(s.trail?.length||0);i++){const pt=s.trail[i],alpha=Math.max(.08,.38-i*.06);ctx.strokeStyle='rgba(255,110,46,'+alpha+')';ctx.lineWidth=Math.max(2.5,8-i);ctx.beginPath();ctx.moveTo(i===0?(s.prevX??s.x):pt.x,i===0?(s.prevY??s.y):pt.y);ctx.lineTo(s.x,s.y);ctx.stroke();}ctx.translate(s.x,s.y);ctx.rotate(Math.atan2(s.vy,s.vx)+Math.PI/2);ctx.shadowColor='#ff7a2b';ctx.shadowBlur=10;ctx.fillStyle='#ffd889';ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(-6,-5);ctx.lineTo(0,-8);ctx.lineTo(6,-5);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,196,112,.95)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(0,13);ctx.stroke();ctx.strokeStyle='rgba(255,112,39,.85)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,12);ctx.lineTo(0,25);ctx.stroke();}
 else if(s.kind==='aqua'){ctx.globalCompositeOperation='screen';for(let i=0;i<(s.trail?.length||0);i++){const pt=s.trail[i],alpha=Math.max(.06,.22-i*.03);ctx.strokeStyle='rgba(96,236,255,'+alpha+')';ctx.lineWidth=Math.max(1.5,5-i*.5);ctx.beginPath();ctx.moveTo(i===0?(s.prevX??s.x):pt.x,i===0?(s.prevY??s.y):pt.y);ctx.lineTo(s.x,s.y);ctx.stroke();}ctx.translate(s.x,s.y);ctx.rotate(Math.atan2(s.vy,s.vx)+Math.PI/2);ctx.shadowColor='#5af1ff';ctx.shadowBlur=10;ctx.fillStyle='#8ceeff';ctx.strokeStyle='#dcffff';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(-7,0);ctx.lineTo(0,-5);ctx.lineTo(7,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;}
 else if(s.kind==='ventus'){ctx.globalCompositeOperation='screen';for(let i=0;i<(s.trail?.length||0);i++){const pt=s.trail[i],alpha=Math.max(.05,.18-i*.025);ctx.strokeStyle='rgba(172,245,255,'+alpha+')';ctx.lineWidth=Math.max(1.2,4.5-i*.45);ctx.beginPath();ctx.moveTo(i===0?(s.prevX??s.x):pt.x,i===0?(s.prevY??s.y):pt.y);ctx.lineTo(s.x,s.y);ctx.stroke();}ctx.translate(s.x,s.y);ctx.fillStyle='rgba(193,244,255,.55)';ctx.strokeStyle='rgba(230,255,255,.7)';ctx.lineWidth=1.2;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(0,12-i*10,18-i*4.5,7.5-i*1.4,0,0,Math.PI*2);ctx.fill();ctx.stroke();}ctx.beginPath();ctx.moveTo(-7,11);ctx.quadraticCurveTo(0,-6,7,11);ctx.stroke();}
 else{ctx.fillStyle=s.kind==='crash'?'#efbeff':s.kind==='ignis'?'#ff9e63':'#ffda8a';ctx.beginPath();ctx.ellipse(s.x,s.y,s.kind==='ignis'?7:3,14,0,0,7);ctx.fill();}ctx.restore();}
function drawIgnisEruption(ctx,e){
 const age=clamp(1-e.life/.52,0,1),stage=e.stage||0;
 const radius=Math.min(65,e.r*.50)*(0.35+age*.9),height=(28+stage*11)*(1-age*.62);
 ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=1-age*.87;
 const gradient=ctx.createRadialGradient(e.x,e.y,2,e.x,e.y,radius);
 gradient.addColorStop(0,'rgba(255,242,167,.65)');gradient.addColorStop(.35,'rgba(255,124,34,.5)');gradient.addColorStop(1,'rgba(208,38,18,0)');
 ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(e.x,e.y,radius,0,Math.PI*2);ctx.fill();
 ctx.lineCap='round';
 for(let i=0;i<9;i++){
  const angle=i*Math.PI*2/9+stage*.4;
  const px=e.x+Math.cos(angle)*radius*.7,py=e.y+Math.sin(angle)*radius*.35;
  ctx.strokeStyle=i%2?'rgba(255,105,31,.86)':'rgba(255,207,97,.92)';ctx.lineWidth=3+(i%3);
  ctx.beginPath();ctx.moveTo(e.x+Math.cos(angle)*radius*.12,e.y+Math.sin(angle)*radius*.15);
  ctx.quadraticCurveTo(px,py-height*.55,px+Math.sin(i*2+stage)*6,py-height);ctx.stroke();
 }
 ctx.restore();
}
function drawHeroAquaTelegraph(ctx,w){
 const progress=clamp((w.t-w.aquaCharge.started)/heroChargeDuration(),0,1);
 // The five emitted arrows have vx = offset * aquaSpread(progress), vy = -540.
 // Projecting those exact velocities over reach guarantees that the telegraph
 // bounds and the outer projectile trajectories line up at every charge level.
 const reach=200,originX=w.hero.x,originY=w.hero.y-18,half=aquaHalfWidth(progress,reach);
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.globalCompositeOperation='screen';
 const fill=ctx.createLinearGradient(originX,originY,originX,originY-reach);
 fill.addColorStop(0,'rgba(72,218,255,.18)');fill.addColorStop(1,'rgba(65,205,255,.075)');
 ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(originX,originY);
 ctx.lineTo(originX-half,originY-reach);ctx.lineTo(originX+half,originY-reach);ctx.closePath();ctx.fill();
 ctx.strokeStyle='rgba(142,241,255,.86)';ctx.lineWidth=2;
 for(let i=-2;i<=2;i++){
  const endX=originX+i*aquaSpread(progress)*reach/540;
  ctx.globalAlpha=i===0?.94:.52;ctx.beginPath();ctx.moveTo(originX,originY);ctx.lineTo(endX,originY-reach);ctx.stroke();
  const tipY=originY-reach;ctx.beginPath();ctx.moveTo(endX-4,tipY+10);ctx.lineTo(endX,tipY);ctx.lineTo(endX+4,tipY+10);ctx.stroke();
 }
 ctx.globalAlpha=1;ctx.strokeStyle='rgba(195,253,255,.95)';ctx.lineWidth=2.5;
 ctx.beginPath();ctx.moveTo(originX-half,originY-reach);ctx.lineTo(originX,originY);ctx.lineTo(originX+half,originY-reach);ctx.stroke();
 ctx.fillStyle='#d4fbff';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText('AQUA '+Math.ceil(100*progress)+'%',originX,originY-50);
 ctx.restore();
}
function drawVentusCastFX(ctx,x,y,progress){ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='rgba(182,245,255,.88)';ctx.fillStyle='rgba(164,234,246,.18)';ctx.shadowColor='#9befff';ctx.shadowBlur=9;for(let i=0;i<3;i++){const rx=10+i*6+progress*4;const ry=4+i*1.8;ctx.beginPath();ctx.ellipse(x,y+7-i*4,rx,ry,0,0,Math.PI*2);ctx.stroke();}ctx.shadowBlur=0;for(let i=0;i<4;i++){const dir=i<2?-1:1;const py=y-12+i*8;ctx.beginPath();ctx.moveTo(x+dir*(16+i*2),py+12);ctx.quadraticCurveTo(x+dir*(6+i),py+2,x+dir*(14+i*2),py-10);ctx.stroke();}ctx.beginPath();ctx.moveTo(x-4,y+14);ctx.quadraticCurveTo(x,y-6-progress*18,x+4,y+14);ctx.stroke();ctx.restore();}
function drawTerraCastFX(ctx,x,y,progress,release=false){const ring=release?18+progress*24:14+Math.sin(progress*12)*2;ctx.save();ctx.globalCompositeOperation='screen';ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=release?'rgba(224,198,128,.92)':'rgba(194,161,89,.85)';ctx.fillStyle=release?'rgba(146,105,46,.28)':'rgba(120,87,42,.18)';ctx.shadowColor='#d5b06c';ctx.shadowBlur=10;ctx.beginPath();ctx.ellipse(x,y+8,12+progress*6,5+progress*1.5,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y+4,ring,0,Math.PI*2);ctx.stroke();for(let i=0;i<5;i++){const ang=-Math.PI*.9+i*(Math.PI*.45);const px=x+Math.cos(ang)*(8+progress*10);const py=y+2+Math.sin(ang)*(6+progress*3);ctx.strokeStyle='rgba(171,135,76,'+(.75-.08*i)+')';ctx.beginPath();ctx.moveTo(px,py+10);ctx.lineTo(px,py-4-progress*18-(release?8:0));ctx.stroke();ctx.fillStyle=i%2?'rgba(224,198,128,.9)':'rgba(156,118,61,.85)';ctx.beginPath();ctx.moveTo(px,py-7-progress*8);ctx.lineTo(px-4,py+1-progress*4);ctx.lineTo(px+4,py+1-progress*4);ctx.closePath();ctx.fill();}ctx.restore();}
function archer(ctx,x,y){const now=world?.t||performance.now()/1000;const h=phase==='run'&&world?.hero?world.hero:{isMoving:true,moveTime:now,idleTime:now};const anim=phase==='run'?heroAnimState(h):{state:'move',mode:'move',time:now,progress:0};drawHeroShadow(ctx,x,y);const state=anim.state==='hit'?'hit':anim.state==='attack'?'attack':anim.state==='move'?'move':'idle';const bob=anim.state==='move'?Math.sin((h.moveTime||0)*16)*1.6:anim.state==='idle'?Math.sin((h.idleTime||0)*2.2)*.5:(anim.mode==='anchorDash'?-1.5:-.8);const rendered=(anim.state==='attack'&&drawHeroElemental(ctx,anim.mode,x,y+bob,anim.time,anim.progress))||cromSprite(ctx,'archer',x,y-5+bob,58,72,state,anim.time);if(!rendered){ctx.save();ctx.translate(x,y);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#181b2d';ctx.lineWidth=2.5;ctx.fillStyle='#302d53';ctx.beginPath();ctx.moveTo(-12,-16);ctx.lineTo(-20,17);ctx.lineTo(-9,28);ctx.lineTo(10,27);ctx.lineTo(19,15);ctx.lineTo(12,-16);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#d1d8df';ctx.beginPath();ctx.arc(0,-20,11,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#4c5177';ctx.beginPath();ctx.moveTo(-15,-20);ctx.lineTo(-5,-44);ctx.lineTo(11,-41);ctx.lineTo(19,-17);ctx.lineTo(3,-28);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#f4c978';ctx.lineWidth=4;ctx.beginPath();ctx.arc(19,-12,22,-1.3,1.3);ctx.stroke();ctx.strokeStyle='#aee0fb';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(25,-32);ctx.lineTo(25,8);ctx.stroke();ctx.strokeStyle='#b0a7e4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-10,3);ctx.lineTo(-15,24);ctx.moveTo(8,3);ctx.lineTo(13,25);ctx.stroke();ctx.restore();}
 if(anim.mode==='ignis')drawIgnisPoseFX(ctx,x,y-1,anim.progress);
 if(anim.mode==='ventus')drawVentusCastFX(ctx,x,y-1,anim.progress);
 if(anim.mode==='terraCharge')drawTerraCastFX(ctx,x,y-1,.42+Math.sin(now*10)*.08,false);
 if(anim.mode==='terraRelease')drawTerraCastFX(ctx,x,y-1,anim.progress,true);
 if(anim.mode==='aquaCharge')drawAquaChargeFX(ctx,x,y-1,anim.progress,false);
 if(anim.mode==='aquaRelease')drawAquaChargeFX(ctx,x,y-1,anim.aquaChargePct||anim.progress,true);}
function drawNow(){if(!ctx||!canvas)return;const c=ctx,w=world;c.clearRect(0,0,800,620);if(phase!=='menu'&&w)cromEnvironment(c,w);
 if(phase==='menu'){const sky=c.createLinearGradient(0,0,0,620);sky.addColorStop(0,'#6f6875');sky.addColorStop(.46,'#4e4953');sky.addColorStop(1,'#28252b');c.fillStyle=sky;c.fillRect(0,0,800,620);c.fillStyle='rgba(25,21,28,.98)';c.fillRect(0,0,800,370);const moon='rgba(219,96,138,.22)';c.fillStyle=moon;c.beginPath();c.arc(638,88,86,0,Math.PI*2);c.fill();for(let i=0;i<18;i++){const x=24+i*46;c.strokeStyle=i%2?'#302d34':'#252329';c.lineWidth=3;c.beginPath();c.moveTo(x,368);c.lineTo(x+6,312-(i%4)*10);c.lineTo(x+18,368);c.stroke();}c.save();c.translate(400,205);const pulse=.88+.06*Math.sin(performance.now()/700);c.scale(pulse,pulse);c.fillStyle='rgba(18,12,24,.98)';c.beginPath();c.moveTo(-168,110);c.lineTo(-138,-120);c.lineTo(-90,-120);c.lineTo(-72,-180);c.lineTo(-46,-120);c.lineTo(-28,-150);c.lineTo(0,-255);c.lineTo(28,-150);c.lineTo(46,-120);c.lineTo(72,-180);c.lineTo(90,-120);c.lineTo(138,-120);c.lineTo(168,110);c.closePath();c.fill();c.fillStyle='rgba(86,56,110,.95)';for(const [x,y,w,h] of [[0,-126,32,92],[-88,-28,30,74],[88,-28,30,74],[0,-22,44,86]]){c.fillRect(x-w/2,y-h/2,w,h);}c.fillStyle='rgba(236,165,255,.16)';c.beginPath();c.moveTo(-22,-6);c.lineTo(0,-70);c.lineTo(22,-6);c.closePath();c.fill();c.restore();c.fillStyle='rgba(30,27,33,.98)';c.fillRect(0,370,800,250);for(let i=0;i<7;i++){const tx=60+i*68;const ty=442+(i%2)*12;c.fillStyle='rgba(79,73,68,.92)';c.fillRect(tx,ty,48,26);c.strokeStyle='#282421';c.strokeRect(tx,ty,48,26);if(i<4){c.strokeStyle='#2c241d';c.beginPath();c.moveTo(tx+24,ty+26);c.lineTo(tx+8,ty+56);c.moveTo(tx+24,ty+26);c.lineTo(tx+40,ty+56);c.stroke();}}c.fillStyle='rgba(76,67,56,.97)';c.fillRect(568,436,166,90);c.fillStyle='rgba(229,215,187,.95)';c.font='bold 25px system-ui';c.textAlign='center';c.fillText('SUPPLY WAGON',651,469);c.font='13px system-ui';c.fillText('Dark Erg provisions',651,491);c.fillText('and field gear',651,507);c.fillStyle='rgba(233,228,240,.82)';c.font='bold 24px system-ui';c.fillText('Forward Camp of Crom Bás',400,40);c.font='13px system-ui';c.fillText('A bleak pioneer outpost beneath the looming cathedral',400,60);const abyss=clamp((330-menuHero.y)/185,0,1)*(menuHero.x>260&&menuHero.x<560?1:.25);c.fillStyle='rgba(12,2,22,'+(.62*abyss)+')';c.fillRect(0,0,800,620);c.fillStyle='rgba(120,34,173,'+(.18*abyss)+')';c.beginPath();c.ellipse(400,170,112+78*abyss,95+50*abyss,0,0,Math.PI*2);c.fill();c.strokeStyle='rgba(235,187,255,.88)';c.lineWidth=2;c.strokeRect(292,118,216,114);c.fillStyle='rgba(242,214,252,.97)';c.font='bold 18px system-ui';c.fillText('Walk into the cathedral gate to begin',400,145);c.font='12px system-ui';c.fillText('The abyss deepens as you approach',400,164);c.fillText('Shop: approach the supply wagon on the right',620,540);archer(c,menuHero.x,menuHero.y);return;}
 if(!w)return;
 for(const v of w.ventusTunnels){c.save();const height=Math.min(620,w.hero.y),phase=(w.t*7)%100;for(let i=0;i<3;i++){c.fillStyle='rgba(148,228,236,'+(.09+i*.025)+')';c.strokeStyle='rgba(178,240,255,'+(.35+i*.12)+')';c.lineWidth=2;c.fillRect(v.x-v.width+i*8-4,0,v.width*2-i*16,height);c.strokeRect(v.x-v.width+i*8-4,0,v.width*2-i*16,height);}c.fillStyle='rgba(200,246,255,.22)';c.fillRect(v.x-v.width*.38,0,v.width*.76,height);c.strokeStyle='rgba(225,251,255,.55)';c.lineWidth=1.5;for(let i=0;i<7;i++){const y=(i*92+phase)%Math.max(1,height+60)-30;const bend=Math.sin((w.t*8)+(i*1.4))*10;c.beginPath();c.moveTo(v.x-v.width*.72+bend,y+22);c.quadraticCurveTo(v.x+bend*.35,y-10,v.x+v.width*.72-bend,y+22);c.stroke();}c.restore();}
 for(const tz of w.terraZones){c.fillStyle='rgba(223,189,119,.12)';c.strokeStyle='rgba(240,219,150,.65)';c.lineWidth=3;c.beginPath();c.arc(tz.x,tz.y,tz.r,0,Math.PI*2);c.fill();c.stroke();}
 if(w.terraCharge){c.fillStyle='rgba(161,118,61,.12)';c.strokeStyle='rgba(222,194,129,.88)';c.lineWidth=3;c.beginPath();c.arc(w.hero.x,w.terraCharge.y,120,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.moveTo(w.hero.x,w.hero.y);c.lineTo(w.hero.x,w.terraCharge.y);c.stroke();for(let i=0;i<6;i++){const ang=(w.t*2.2+i)*1.05;const px=w.hero.x+Math.cos(ang)*74;const py=w.terraCharge.y+Math.sin(ang)*28;c.fillStyle='rgba(206,179,116,'+(.22+.06*Math.sin(w.t*8+i))+')';c.beginPath();c.arc(px,py,4+(i%2),0,Math.PI*2);c.fill();}}
 for(const d of w.healthDrops){const pulse=.6+.4*Math.sin(w.t*6+(d.pulse||0));c.fillStyle='rgba(255,92,120,'+(0.55+0.2*pulse)+')';c.strokeStyle='rgba(255,230,240,.9)';c.lineWidth=2;c.beginPath();c.arc(d.x,d.y,12,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#fff';c.fillRect(d.x-2,d.y-7,4,14);c.fillRect(d.x-7,d.y-2,14,4);} 
for(const boss of w.enemies.filter(e=>e.glas?.puddles?.length)){for(const z of boss.glas.puddles){if(w.t<(z.warning??z.born))continue;const rr=z.maxR||z.r; if(w.t<z.born){c.save();const pulse=.55+.45*Math.sin(w.t*8);c.fillStyle='rgba(255,36,50,.16)';c.strokeStyle='rgba(255,88,96,.92)';c.lineWidth=3;c.beginPath();c.arc(z.x,z.y,rr,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='rgba(197,110,255,'+(0.5+.35*pulse)+')';c.lineWidth=6;c.shadowBlur=14;c.shadowColor='#b04cff';c.beginPath();c.arc(z.x,z.y,rr-3,0,Math.PI*2);c.stroke();c.shadowBlur=0;c.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<6;i++){const ang=(w.t*2.4)+(i*Math.PI*2/6);c.beginPath();c.arc(z.x+Math.cos(ang)*(rr-8),z.y+Math.sin(ang)*(rr-8),2.5,0,Math.PI*2);c.fill();}c.restore();continue;}c.save();const t=w.t*2.8,pulse=.72+.28*Math.sin(w.t*6.4);const outer=rr*1.34;const glow=c.createRadialGradient(z.x,z.y,rr*.55,z.x,z.y,outer);glow.addColorStop(0,'rgba(0,0,0,0)');glow.addColorStop(.55,'rgba(114,45,156,0.12)');glow.addColorStop(.8,'rgba(176,74,255,0.42)');glow.addColorStop(1,'rgba(224,155,255,0)');c.fillStyle=glow;c.beginPath();c.arc(z.x,z.y,outer,0,Math.PI*2);c.fill();c.shadowBlur=22;const pcol='rgba(200,92,255,'+(0.85+.12*pulse)+')';c.shadowColor='#c54eff';c.strokeStyle=pcol;c.lineWidth=7;c.beginPath();c.arc(z.x,z.y,rr*.92,0,Math.PI*2);c.stroke();c.shadowBlur=0;const ring2=c.createRadialGradient(z.x,z.y,rr*.42,z.x,z.y,rr);ring2.addColorStop(0,'rgba(0,0,0,1)');ring2.addColorStop(.48,'rgba(6,4,13,1)');ring2.addColorStop(.68,'rgba(24,12,38,.98)');ring2.addColorStop(.83,'rgba(112,41,160,.58)');ring2.addColorStop(1,'rgba(242,183,255,.18)');c.fillStyle=ring2;c.beginPath();c.arc(z.x,z.y,rr,0,Math.PI*2);c.fill();c.globalCompositeOperation='screen';for(let i=0;i<3;i++){c.strokeStyle=['rgba(129,61,193,.45)','rgba(176,88,255,.38)','rgba(234,186,255,.24)'][i];c.lineWidth=2+i;const start=t+i*1.35; c.beginPath();c.arc(z.x,z.y,rr*(.42+.16*i),start,start+Math.PI*(1.05-.16*i));c.stroke();}c.globalCompositeOperation='source-over';c.fillStyle='rgba(0,0,0,.98)';c.beginPath();c.arc(z.x,z.y,rr*.42,0,Math.PI*2);c.fill();c.strokeStyle='rgba(243,197,255,.55)';c.lineWidth=1.5;c.beginPath();c.arc(z.x,z.y,rr*.44,0,Math.PI*2);c.stroke();c.fillStyle='rgba(244,212,255,.9)';for(let i=0;i<5;i++){const ang=-t*1.6+i*(Math.PI*2/5);const rad=rr*(.9+.05*Math.sin(t+i));c.beginPath();c.arc(z.x+Math.cos(ang)*rad,z.y+Math.sin(ang)*rad,2.2+.6*(i%2),0,Math.PI*2);c.fill();}c.restore();}}for(const z of w.glasZones){c.fillStyle=z.kind==='safe'?'rgba(101,234,168,.16)':z.kind==='laser'?'rgba(255,63,105,.35)':'rgba(255,145,93,.25)';if(z.kind==='safe'){c.fillRect(0,0,z.x-105,620);c.fillRect(z.x+105,0,800-z.x-105,620);c.strokeStyle='#91efb8';c.strokeRect(z.x-105,0,210,620);}else if(z.kind==='laser')c.fillRect(z.x-72,0,144,620);else{c.fillRect(0,413,800,207);c.fillRect(z.left?0:400,206,400,207);}}for(const z of w.discipleZones){if(z.owner.hp<=0)continue;c.save();const active=w.t>=z.at,breath=.66+.2*Math.sin(w.t*16);c.globalAlpha=active?.9:.48;c.strokeStyle=active?'#e0a7ff':'#a077e2';c.lineWidth=active?3:2;c.fillStyle=active?'rgba(166,72,244,.32)':'rgba(146,70,206,.13)';c.shadowColor='#ad6cff';c.shadowBlur=active?14:5;c.beginPath();if(z.kind==='sword-cone'){c.moveTo(z.x,z.y);c.lineTo(z.x-(17+z.half),z.y+z.reach);c.lineTo(z.x+(17+z.half),z.y+z.reach);c.closePath();}else if(z.kind==='sword-line'){c.rect(z.x-z.half*.5,z.y,z.half,z.reach);}else{c.arc(z.x,z.y,z.r+Math.sin(w.t*9)*2,0,Math.PI*2);}c.fill();c.stroke();if(active){c.strokeStyle='#f2d5ff';c.beginPath();if(z.kind.startsWith('sword')){c.moveTo(z.x,z.y+6);c.lineTo(z.x,z.y+z.reach*.92);}else{c.arc(z.x,z.y,z.r*.56,0,Math.PI*2);}c.stroke();}c.restore();}for(const z of w.melciZones){if(z.kind==='kunai'){const pulse=.55+.45*Math.sin(w.t*12);c.save();c.globalAlpha=(w.t<z.at)?0.55:0.95;c.strokeStyle='rgba(166,160,255,.92)';c.lineWidth=3;c.beginPath();c.arc(z.x,z.y,55+3*pulse,0,Math.PI*2);c.stroke();c.strokeStyle='rgba(239,235,255,.55)';c.setLineDash([7,7]);c.beginPath();c.arc(z.x,z.y,34+2*pulse,0,Math.PI*2);c.stroke();c.setLineDash([]);if(z.owner.melciState==='kunai'){for(let k=0;k<5;k++){const impact=z.at+k*.44,travel=.42,progress=(w.t-(impact-travel))/travel;if(progress<0||progress>1)continue;for(let j=0;j<3;j++){const off=(j-1)*19,sx=z.owner.x+off*.4,sy=z.owner.y-(z.owner.renderLift||0)-30,tx=z.x+off,ty=z.y;const px=sx+(tx-sx)*progress,py=sy+(ty-sy)*progress;c.save();c.translate(px,py);c.rotate(Math.atan2(ty-sy,tx-sx)+Math.PI/2);c.shadowColor='#b88aff';c.shadowBlur=8;c.fillStyle='#e5dbff';c.strokeStyle='#8251d0';c.lineWidth=2;c.beginPath();c.moveTo(0,12);c.lineTo(-5,-5);c.lineTo(0,-17);c.lineTo(5,-5);c.closePath();c.fill();c.stroke();c.restore();}}}c.restore(); }else if(z.kind==='flame'&&w.t>=z.at-.18&&w.t<=z.expires){const ox=z.originX,oy=z.originY,tx=z.x,ty=z.y;const dx=tx-ox,dy=ty-oy,dist=Math.max(1,Math.hypot(dx,dy)),nx=-dy/dist,ny=dx/dist;const hot=w.t>=z.at&&w.t<=z.at+.10;const pulse=hot?1:.64;c.save();c.globalCompositeOperation='screen';c.shadowColor='#ff7223';c.shadowBlur=hot?21:9;for(let k=2;k>=0;k--){const scale=1-k*.23,spread=(18+dist*.45)*scale;c.fillStyle=['rgba(255,242,147,.30)','rgba(255,146,39,.26)','rgba(245,66,16,.20)'][k];c.beginPath();c.moveTo(ox,oy);c.lineTo(tx+nx*spread,ty+ny*spread);c.quadraticCurveTo(ox+dx*.55+nx*spread*.35,oy+dy*.55+ny*spread*.35,ox,oy);c.lineTo(tx-nx*spread,ty-ny*spread);c.quadraticCurveTo(ox+dx*.55-nx*spread*.35,oy+dy*.55-ny*spread*.35,ox,oy);c.fill();}c.lineWidth=hot?3.7:1.8;c.strokeStyle='rgba(255,229,120,'+(.58+.34*pulse)+')';for(let j=-1;j<=1;j++){c.beginPath();c.moveTo(ox+nx*j*5,oy+ny*j*5);c.quadraticCurveTo(ox+dx*.65+nx*j*13,oy+dy*.65+ny*j*13,tx+nx*j*(14+dist*.25),ty+ny*j*(14+dist*.25));c.stroke();}c.restore();}}for(const z of w.irusanZones){if(w.irusanPower||w.irusanCauldron)continue;if(z.kind==='circle'){c.fillStyle='rgba(250,65,74,.19)';c.strokeStyle='#ff6b72';c.lineWidth=3;c.beginPath();c.arc(z.x,z.y,52,0,Math.PI*2);c.fill();c.stroke();}else if(z.kind==='laser'){c.fillStyle='rgba(252,69,82,.48)';c.fillRect(z.x-z.width/2,0,z.width,620);}}for(const e of w.enemies.filter(e=>e.type==='Irusan'&&e.irusan?.laser)){const l=e.irusan.laser;c.fillStyle=e.irusan.phase==='laserTrack'?'rgba(245,79,86,.16)':'rgba(245,79,86,.39)';c.fillRect(l.x-30,0,60,620);c.strokeStyle='#ff9c8b';c.strokeRect(l.x-30,0,60,620);}for(const l of w.ronaunLines){c.save();c.lineCap='round';c.shadowColor='#ff273f';c.shadowBlur=13;c.strokeStyle='rgba(255,44,65,.30)';c.lineWidth=40;c.beginPath();c.moveTo(l.x1,l.y1);c.lineTo(l.x2,l.y2);c.stroke();c.shadowBlur=0;c.strokeStyle='#fa3e50';c.lineWidth=37;c.globalAlpha=.8;c.stroke();c.strokeStyle='#2a111f';c.lineWidth=23;c.stroke();c.setLineDash([11,8]);c.strokeStyle='#ff8dbc';c.lineWidth=7;c.stroke();c.setLineDash([]);c.fillStyle='#ff6074';for(const [x,y] of [[l.x1,l.y1],[l.x2,l.y2]]){c.beginPath();c.arc(x,y,12,0,Math.PI*2);c.fill();}c.restore();}for(const e of w.enemies){if(e.type==='Cauldron'){const fall=Math.max(0,(e.slamAt||0)-w.t);if(fall>0){c.save();c.globalAlpha=.5;c.fillStyle='rgba(214,116,255,.15)';c.beginPath();c.arc(e.x,e.y,56,0,7);c.fill();c.restore();}}if(e.type==='Wyneb'&&e.wynebState==='bomb'){const remaining=Math.max(0,e.wynebFuse-w.t);c.fillStyle='rgba(227,66,180,'+(0.15+0.15*Math.sin(w.t*16))+')';c.strokeStyle='#ffc4fb';c.lineWidth=3;c.beginPath();c.arc(e.x,e.y,86,0,7);c.fill();c.stroke();c.fillStyle='#fff';c.font='bold 13px system-ui';c.textAlign='center';c.fillText(remaining.toFixed(1)+'s',e.x,e.y-34);}if(e.type.includes('Cari')){c.fillStyle='rgba(105,174,255,.12)';c.strokeStyle='rgba(123,190,255,.45)';c.beginPath();c.arc(e.x,e.y,102,0,Math.PI*2);c.fill();c.stroke();}if(e.type.includes('Glas Ghaibhleann')){c.fillStyle='rgba(126,94,151,.2)';c.fillRect(0,15,800,190);if(!cromDrawEnemy(c,e,520,210)){c.save();c.translate(400,105);c.scale(6.1,2.2);art(c,e.type,0,0,true);c.restore();}if(e.glas?.berserk){c.fillStyle=({fire:'#f26a60',water:'#68c4fc',earth:'#cba86d',air:'#88dbad'})[e.glas.elementImmune]||'#dc81ed';c.fillRect(0,184,800,9);}c.fillStyle='#f5d9fb';c.textAlign='center';c.font='bold 18px system-ui';c.fillText(e.glas?.giga?'GIGA GLAS GHAIBHLEANN':'GLAS GHAIBHLEANN',400,28);}else if(e.glasOrb){c.fillStyle={fire:'#fa724e',water:'#75c9ef',earth:'#bda46f',air:'#a1e3bd'}[e.element];c.beginPath();c.arc(e.x,e.y,20,0,Math.PI*2);c.fill();c.fillStyle='#182437';c.font='bold 11px system-ui';c.textAlign='center';c.fillText(e.element.toUpperCase(),e.x,e.y+4);}else{if(e.type==='Cauldron'){const drop=(e.slamAt&&w.t<e.slamAt)?(e.slamAt-w.t)*260:0;const yy=e.y-drop; if(!cromSprite(c,'cauldron',e.x,yy-5,64,70,e.hp/e.max<.35?'hit':'idle',w.t-(e.spawnAt||w.t)))art(c,e.type,e.x,yy,e.boss);}else if(!cromDrawEnemy(c,e,e.boss?112:56,e.boss?105:62))art(c,e.type,e.x,e.y,e.boss);}if(e.miniboss){c.fillStyle='#ffd3a1';c.textAlign='center';c.font='bold 13px system-ui';c.fillText('MELCI DIAFOL',e.x,e.y-48);}if(e.shield||e.cariShieldHp){c.fillStyle='#8ddafa';c.font='bold 12px system-ui';c.textAlign='center';c.fillText('◆ '+Math.ceil(e.cariShieldHp||e.shield),e.x,e.y-37);}c.fillStyle='#30323b';c.fillRect(e.x-(e.boss?50:20),e.y-(e.boss?53:34),e.boss?100:40,5);c.fillStyle=e.boss?'#e28b8b':'#80c7a1';c.fillRect(e.x-(e.boss?50:20),e.y-(e.boss?53:34),(e.boss?100:40)*clamp(e.hp/e.max,0,1),5);}
 for(const d of w.defeatSprites){const key=cromSpriteKey(d.type),variant=key==='disciple'&&d.discipleWeapon?'disciple-'+d.discipleWeapon:key;cromSprite(c,variant,d.x,d.y-5,d.boss?112:56,d.boss?105:62,'defeat',w.t-d.born,Math.max(0,1-(w.t-d.born)/.58));}
 for(const b of w.enemyShots){c.save();c.translate(b.x,b.y);const a=Math.atan2(b.vy,b.vx)+Math.PI/2;c.rotate(a);const ice=b.kind==='freeze';c.shadowBlur=12;c.shadowColor=ice?'#7cecff':b.kind==='disciple-gun'?'#a46aff':'#f85b25';c.fillStyle=ice?'#a6f4ff':b.kind==='disciple-gun'?'#b98aff':'#ff722b';c.strokeStyle=ice?'#e9ffff':b.kind==='disciple-gun'?'#f0dcff':'#ffe48d';c.lineWidth=2;c.beginPath();c.moveTo(0,-(ice?21:15));c.lineTo(ice?-11:-8,4);c.lineTo(0,ice?15:11);c.lineTo(ice?11:8,4);c.closePath();c.fill();c.stroke();c.restore();}if(w.aquaCharge)drawHeroAquaTelegraph(c,w);
 if(w.hero.animKind==='aquaRelease'&&w.hero.animUntil>w.t){
  const elapsed=w.t-w.hero.animAt,reach=130*clamp(1-elapsed/.38,0,1),spread=w.hero.aquaReleaseSpread||aquaSpread(0);
  c.save();c.globalCompositeOperation='screen';c.globalAlpha=clamp(1-elapsed/.38,0,1)*.62;c.strokeStyle='#94f5ff';c.lineWidth=2;
  for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(w.hero.x,w.hero.y-18);c.lineTo(w.hero.x+i*spread*reach/540,w.hero.y-18-reach);c.stroke();}c.restore();
 }
 for(const s of w.shots)drawHeroShot(c,s);for(const e of w.effects){if(e.kind==='crash-fragment-line'){c.save();const a=Math.min(1,e.life/(e.ttl||.3));c.globalAlpha=a;c.shadowColor='#ffc96d';c.shadowBlur=12;c.strokeStyle='#ff9d49';c.lineWidth=5;c.beginPath();c.moveTo(e.x,e.y);c.lineTo(e.toX,e.toY);c.stroke();c.shadowBlur=0;c.strokeStyle='#fff2bc';c.lineWidth=2.3;c.stroke();c.restore();continue;}if(e.kind==='ignis-eruption'){drawIgnisEruption(c,e);continue;}if(e.kind==='ventus-cast'){c.save();c.globalAlpha=clamp(e.life*2,0,1);c.strokeStyle=e.color||'#bcefff';c.lineWidth=2.5;c.beginPath();c.arc(e.x,e.y,e.r+(1-e.life)*18,0,Math.PI*2);c.stroke();for(let i=0;i<3;i++){c.beginPath();c.ellipse(e.x,e.y+6-i*5,e.r*.7+(1-e.life)*8,e.r*.22,0,0,Math.PI*2);c.stroke();}c.restore();continue;}if(e.kind==='ventus-cast-ring'){c.save();c.globalAlpha=clamp(e.life*2,0,1)*.8;c.strokeStyle=e.color||'#8feaff';c.lineWidth=2;c.beginPath();c.ellipse(e.x,e.y+10,e.r+(1-e.life)*22,e.r*.35+(1-e.life)*6,0,0,Math.PI*2);c.stroke();c.restore();continue;}if(e.kind==='ventus-stream'){c.save();c.globalAlpha=clamp(e.life*2,0,1)*.8;c.strokeStyle=e.color||'#b7f4ff';c.lineWidth=2;c.beginPath();c.moveTo(e.x,e.y);c.quadraticCurveTo(e.x+(e.vx||0)*.45,e.y-8,e.x+(e.vx||0)*.95,e.y+(e.vy||0)*.8);c.stroke();c.restore();continue;}if(e.kind==='ventus-pull'){c.save();c.globalAlpha=clamp(e.life*2,0,1);c.strokeStyle=e.color||'#d3fdff';c.lineWidth=2;c.beginPath();c.moveTo(e.x,e.y);c.quadraticCurveTo(e.x+(e.vx||0)*.3,e.y-6,e.x+(e.vx||0),e.y+(e.vy||0));c.stroke();c.restore();continue;}if(e.kind==='ventus-hit'){c.save();c.globalAlpha=clamp(e.life*2,0,1);c.strokeStyle=e.color||'#e4ffff';c.lineWidth=2;for(let i=0;i<2;i++){c.beginPath();c.ellipse(e.x,e.y,e.r*(.65+i*.18),e.r*(.22+i*.06),0,0,Math.PI*2);c.stroke();}c.restore();continue;}if(e.kind==='terra-dust'){c.save();c.globalAlpha=clamp(e.life*2,0,1)*.9;c.fillStyle=e.color||'#b5965e';c.translate(e.x+(e.vx||0)*(1-e.life)*3,e.y+(e.vy||0)*(1-e.life)*3);c.beginPath();c.ellipse(0,0,e.r*(.7+.35*(1-e.life)),e.r*.52,0,0,Math.PI*2);c.fill();c.restore();continue;}if(e.kind==='terra-shard'){c.save();c.globalAlpha=clamp(e.life*2,0,1);c.fillStyle=e.color||'#dcc38d';const ox=(e.vx||0)*(1-e.life)*2.8,oy=(e.vy||0)*(1-e.life)*2.8;c.translate(e.x+ox,e.y+oy);c.beginPath();c.moveTo(0,-e.r*.8);c.lineTo(-e.r*.45,e.r*.25);c.lineTo(e.r*.45,e.r*.25);c.closePath();c.fill();c.restore();continue;}if(e.kind==='terra-cast'){c.save();c.globalAlpha=clamp(e.life*2,0,1);c.strokeStyle=e.color||'#c8a464';c.lineWidth=3;c.beginPath();c.arc(e.x,e.y,e.r+(1-e.life)*16,0,Math.PI*2);c.stroke();c.restore();continue;}if(e.kind==='terra-cast-ring'){c.save();c.globalAlpha=clamp(e.life*2,0,1)*.85;c.fillStyle='rgba(137,101,49,.18)';c.strokeStyle=e.color||'#d8c58f';c.lineWidth=2;c.beginPath();c.ellipse(e.x,e.y+10,e.r+(1-e.life)*20,(e.r*.36)+(1-e.life)*8,0,0,Math.PI*2);c.fill();c.stroke();c.restore();continue;}if(e.kind==='terra-crack'){c.save();c.globalAlpha=clamp(e.life*2,0,1)*.55;c.strokeStyle=e.color||'#8d6c39';c.lineWidth=2;c.beginPath();c.moveTo(e.x-22,e.y+8);c.lineTo(e.x-7,e.y-4);c.lineTo(e.x+10,e.y+4);c.lineTo(e.x+24,e.y-8);c.moveTo(e.x-12,e.y+20);c.lineTo(e.x,e.y+6);c.lineTo(e.x+14,e.y+18);c.stroke();c.restore();continue;}c.strokeStyle=e.color;c.lineWidth=3;c.globalAlpha=clamp(e.life*2,0,1);c.beginPath();c.arc(e.x,e.y,e.r+(1-e.life)*20,0,7);c.stroke();c.globalAlpha=1;}if(w.hero.inv<=0||Math.floor(w.t*12)%2)archer(c,w.hero.x,w.hero.y);if(w.irusanPower){c.fillStyle='rgba(15,19,32,.85)';c.fillRect(154,237,492,127);c.fillStyle='#ffe6b3';c.font='bold 24px system-ui';c.textAlign='center';c.fillText('POWER STRUGGLE',400,274);c.font='bold 16px system-ui';c.fillText(invadersMobile()?'Swipe the movement stick LEFT / RIGHT rapidly!':'Alternate A / D or ← / → rapidly!',400,304);c.fillStyle='#4b4b64';c.fillRect(205,324,390,17);c.fillStyle='#8cdfb2';c.fillRect(205,324,390*w.irusanPower.progress/w.irusanPower.needed,17);}if(w.irusanCauldron){c.fillStyle='#ffc98c';c.font='bold 17px system-ui';c.textAlign='center';c.fillText('CAULDRON  '+Math.max(0,Math.ceil(w.irusanCauldron.deadline-w.t))+'s',400,40);}if(w.hero.transformedUntil>w.t){c.fillStyle='#ffd1b0';c.font='bold 16px system-ui';c.textAlign='center';c.fillText('TRANSFORMED  '+Math.ceil(w.hero.transformedUntil-w.t)+'s',w.hero.x,w.hero.y-60);}if(w.hero.tangled>0){c.fillStyle='#f3a2da';c.font='bold 14px system-ui';c.textAlign='center';c.fillText(w.hero.tangled>=3?'BOUND':`SLOWED ×${w.hero.tangled}`,w.hero.x,w.hero.y-62);}if(w.hero.stunned>0){c.fillStyle='#ffb36e';c.font='bold 13px system-ui';c.textAlign='center';c.fillText('STUN',w.hero.x,w.hero.y-75);}if(w.hero.frozen>0){c.fillStyle='#a9ddff';c.font='bold 15px system-ui';c.textAlign='center';c.fillText('❄ '+w.hero.frozen.toFixed(1)+'s',w.hero.x,w.hero.y-45);}
}
let menuHero={x:400,y:490};function menuMove(dt){const speed=230*dt;menuHero.x+=((keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0))*speed;menuHero.y+=((keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0))*speed;if(mouse.active){menuHero.x+=(mouse.x-menuHero.x)*Math.min(1,dt*5);menuHero.y+=(mouse.y-menuHero.y)*Math.min(1,dt*5);}menuHero.x=clamp(menuHero.x,12,788);menuHero.y=clamp(menuHero.y,110,585);if(Date.now()<shopGuardUntil)return;if(menuHero.y<230&&menuHero.x>275&&menuHero.x<540){start();return;}if(menuHero.y>420&&menuHero.x>555){mouse.active=false;modal='shop';refreshShell();return;}}
function frame(tm){const dt=Math.min(.05,(tm-last)/1000||.016);last=tm;if(phase==='run')tick(dt);else if(phase==='menu'&&!modal)menuMove(dt);drawNow();raf=requestAnimationFrame(frame)}
function hotbarButtonHtml(slot,id,phaseRun=false){const d=id?skillDef(id):null;const unlock=d?!!profile.skills[d.id]:false;const remain=d&&world&&phase==='run'?Math.max(0,d.cd-(world.t-(world.lastCast[d.id]??-999))):0;const ready=!!d&&unlock&&phase==='run'&&remain<=0;const icon=d?`<img class="asci-icon" src="${skillIcon(d.id)}" alt="">`:'';const title=d?`${slot} · ${d.name} · ${d.description}`:`${slot} · Empty slot`;return `<button type="button" draggable="${phase==='pause'}" class="asci-skill ${unlock?'unlocked':''} ${ready?'ready':''} ${!d?'empty':''}" data-asci-cast="${d?.id||''}" data-skill-id="${d?.id||''}" data-slot="${slot}" title="${title}" ${!d||!unlock||phase!=='run'||remain>0?'disabled':''}><span class="asci-slotnum">${slot}</span>${icon}<b>${d?d.name:'Empty'}</b><small>${d?(unlock?(remain?remain.toFixed(1)+'s':'Ready'):'Locked'):'Drag a skill here'}</small></button>`}
function skillGrid(){return profile.hotbar.map((id,i)=>hotbarButtonHtml(i+1,id,true)).join('')}
function skillInventoryHtml(){return skillDefs.filter(d=>profile.skills[d.id]).map(d=>{const unlocked=true;const icon=skillIcon(d.id)?`<img class="asci-icon" src="${skillIcon(d.id)}" alt="">`:'';return `<div class="asci-purchase asci-skillcard ${unlocked?'unlocked':''}" draggable="true" data-skill-id="${d.id}" title="Drag onto a hotbar slot">${icon}<div><b>${d.name}</b><small>${d.description} · key ${assignedKey(d.id)}</small></div></div>`}).join('')}
function hotbarEditorHtml(){return `<div class="asci-hotbar-editor"><div class="asci-hotbar-grid">${profile.hotbar.map((id,i)=>`<div class="asci-hotbar-slot" draggable="${!!id}" data-skill-id="${id||''}" data-hotbar-slot="${i+1}">${hotbarButtonHtml(i+1,id,false)}<button type="button" class="asci-clear-slot" data-asci-clear-slot="${i+1}">Clear</button></div>`).join('')}</div><div class="asci-skill-inventory">${skillInventoryHtml()||'<p>Unlock skills at the camp shop to assign them here.</p>'}</div></div>`}
function orbMarkup(){if(!world)return '';const gains={fire:world.elements.fire||0,water:world.elements.water||0,wind:world.elements.air||0,earth:world.elements.earth||0};return '<div class="asci-orb-row">'+['fire','water','wind','earth'].map(el=>{const n=clamp(gains[el],0,100);return `<div class="craft-orb asci-orb${n>=100?' full':n>0?' charged':''}" data-orb="${el}" style="--orb-progress:${n}%"><span class="craft-orb-ball"><span class="craft-orb-liquid"></span></span><small>${el} ${n}%</small></div>`}).join('')+(profile.skills.anchor?`<div class="craft-orb asci-orb dorcha" style="--orb-progress:${world.dorcha/15*100}%"><span class="craft-orb-ball"><span class="craft-orb-liquid"></span></span><small>Dorcha ${world.dorcha}/15</small></div>`:'')+'</div>'; }
function updateHud(){let h=document.querySelector('#asci-hud');if(h&&world){const hp=Math.max(0,world.hero.hp);const hpPct=clamp(hp/maxHeroHP(),0,1)*100;h.innerHTML=`<div class="asci-barblock"><span>Wave <b>${world.wave}</b>/50 ${world.cycle?'· Loop '+(world.cycle+1):''}</span><div class="asci-hpbar"><i style="width:${hpPct}%"></i></div><span>HP ${hp.toFixed(hp%1?1:0)} / ${maxHeroHP()}</span>${world.urgentBuff>world.t?`<span style="display:block;color:#f0cf8d;font-weight:700;font-size:11px;margin-top:3px">✦ Archery Enhancement +10% · ${Math.ceil(world.urgentBuff-world.t)}s</span>`:''}</div>`;}const orb=document.querySelector('#asci-orbs');if(orb&&world)orb.innerHTML=orbMarkup();const s=document.querySelector('#asci-skills');if(s&&phase==='run')s.innerHTML=skillGrid();for(const button of document.querySelectorAll('[data-asci-touch]')){const id=button.dataset.asciTouch,d=skillDef(id);if(!d||!world)continue;const remaining=Math.max(0,d.cd-(world.t-(world.lastCast[id]??-999)));const locked=!profile.skills[id],isActive=!!world.aquaCharge&&id==='aqua'||!!world.terraCharge&&id==='terra'||!!world.anchorAim&&id==='anchor';button.disabled=locked||remaining>0&&!isActive;button.classList.toggle('cooling',remaining>0&&!isActive);button.style.setProperty('--asci-cooldown',d.cd?Math.min(100,100*remaining/d.cd)+'%':'0%');const label=button.querySelector('.asci-touch-cd');if(label)label.textContent=locked?'LOCK':isActive?'HOLD':remaining>0?remaining.toFixed(1)+'s':'';}const n=document.querySelector('#asci-note');if(n)n.textContent=note;const wallet=document.querySelector('#asci-wallet');if(wallet)wallet.innerHTML=`<span title="Fragments">◈ ${profile.fragments.toLocaleString()}</span><span title="Chunks">◆ ${profile.chunks.toLocaleString()}</span>`;}
function shopHtml(){const currency=`<strong>◆ ${profile.chunks.toLocaleString()} chunks</strong> <strong>◈ ${profile.fragments.toLocaleString()} fragments</strong>`;const stoneAvailable=!!window.MIDIR_SPECIAL_UPGRADE?.reward;return `<div class="asci-overlay"><div class="asci-shop"><div class="asci-modalhead"><h3>Dark Erg Shop</h3><button data-asci="close">✕</button></div><div class="asci-shop-body"><h4>Skill Unlocks</h4><div class="asci-shopgrid">${skillDefs.map(x=>`<div class="asci-purchase"><div class="asci-purchase-head">${skillIcon(x.id)?`<img class="asci-icon" src="${skillIcon(x.id)}" alt="">`:''}<b>${x.name}</b></div><small>${x.description} · ${x.cd}s · Hotbar key ${assignedKey(x.id)}</small><button data-asci-unlock="${x.id}" ${profile.skills[x.id]||profile.fragments<x.cost?'disabled':''}>${profile.skills[x.id]?'Unlocked':'◈ '+x.cost}</button></div>`).join('')}</div><h4>Reforges</h4><div class="asci-shopgrid">${[['crashCount','Crash fragments',40,4],['crashRadius','Shrapnel reach',30,5],['crashPower','Crash damage',35,5],['magnumPower','Magnum power',30,8]].map(([id,name,cost,max])=>`<div class="asci-purchase"><b>${name}</b><small>Level ${profile.reforges[id]||0} / ${max}</small><button data-asci-reforge="${id}" ${profile.fragments<cost*(1+(profile.reforges[id]||0))||(profile.reforges[id]||0)>=max?'disabled':''}>◈ ${cost*(1+(profile.reforges[id]||0))}</button></div>`).join('')}</div><h4>Alchemic Sharpshooter Link</h4><div class="asci-linkcard"><div class="asci-link-rank">LINK ${linkLevel()} / X</div><div class="asci-link-track">${Array.from({length:10},(_,i)=>`<span class="${i<linkLevel()?'lit':''}">${i+1}</span>`).join('')}</div><div class="asci-link-bonuses">${LINK_TEXT.map((label,i)=>`<div class="${i<linkLevel()?'obtained':''}">${label}</div>`).join('')}</div>${linkLevel()<10?`<button data-asci-link ${profile.fragments<linkCost(linkLevel()+1)?'disabled':''}>Increase Link Level → ${linkLevel()+1} · ◈ ${linkCost(linkLevel()+1)}</button>`:'<strong>All links unlocked</strong>'}</div><h4>Survival Upgrades</h4><div class="asci-shopgrid"><div class="asci-purchase"><b>Maximum Health +1</b><small>${maxHeroHP()} max HP · cap 15</small><button data-asci-maxhp ${profile.fragments<18||(profile.purchases.maxhp||0)>=10?'disabled':''}>◈ 18</button></div></div><h4>Rewards for other games</h4><div class="asci-shopgrid">${shop.map(x=>{const purchased=profile.purchases[x.id]||0;return `<div class="asci-purchase"><b>${x.name}</b><small>${x.desc||'To Shared Stone Chest'} ${x.max?'· '+purchased+'/'+x.max:''}</small><button data-asci-buy="${x.id}" ${profile.chunks<x.cost||x.max&&purchased>=x.max||x.stone&&!stoneAvailable?'disabled':''}>◆ ${x.cost}</button></div>`}).join('')}</div><details><summary>Help</summary><p>Fragments unlock skills and upgrades for this game. Chunks buy stones and bonuses for other minigames. Shops close while a run is active.</p></details></div><div class="asci-shop-wallet" aria-label="Owned currency">${currency}</div></div></div>`}
function mobileControls(){if(!invadersMobile())return {before:'',after:'',cls:''};
 // Every skill has a real mobile action; only charging skills use hold-and-release.
 const charged=new Set(['aqua','terra','anchor']);
 const actions=skillDefs.map(d=>{const locked=!profile.skills[d.id];const hold=charged.has(d.id);return `<button type="button" class="asci-touch-skill${locked?' locked':''}" data-asci-touch="${d.id}" aria-label="${d.name}${locked?' locked':hold?' hold and release':''}" title="${d.name}${hold?' · hold and release':''}" ${locked?'disabled':''}><img src="${skillIcon(d.id)}" alt=""><span>${d.name}</span><b class="asci-touch-cd" aria-live="off"></b></button>`}).join('');
 return {cls:' asci-mobile-layout',before:`<div class="asci-mobile-hint">Tap a skill to cast · hold and release charged skills · move with the right control</div><div class="asci-touch-row"><div class="asci-touch-actions" aria-label="Skill buttons">${actions}</div>`,after:`<div class="asci-touch-movement">${window.MIDIR_MOBILE_MOVE.markup()}</div></div>`};
}
function view(){const touch=mobileControls();return `<div class="asci-wrap${touch.cls}"><div class="asci-top"><div><h2>Crom Bás Invaders</h2><p class="hint">Stage your assault from camp, then enter the cathedral.</p></div><div class="asci-actions">${phase==='menu'?'<button data-asci="guide">Field notes</button>':''}<button data-asci="${phase==='run'?'pause':phase==='pause'?'resume':'shop'}">${phase==='run'?'Pause':phase==='pause'?'Resume':'Shop'}</button>${phase==='run'||phase==='pause'?'<button data-asci="quit">Quit run</button>':''}<details><summary>?</summary><small>Move with WASD, arrow keys, or mouse. Hold and release Terra Scourge to place it. Skills use the current hotbar keys 1–8.</small></details></div></div>${touch.before}<div class="asci-game asci-stage"><canvas id="asci-canvas" width="800" height="620" tabindex="0"></canvas><div class="asci-stagehud asci-hud" id="asci-hud"></div><div class="asci-stagewallet" id="asci-wallet"></div><div class="hint asci-stageorbs" id="asci-orbs"></div><div class="asci-stagehotbar asci-skills" id="asci-skills">${phase==='run'?skillGrid():''}</div><div class="hint asci-stagenote" id="asci-note">${note}</div>${phase==='pause'?`<div class="asci-pause"><div class="asci-pause-panel"><h2>Paused</h2><div class="asci-pause-actions"><button class="primary" data-asci="resume">Continue</button><button data-asci="drawer" aria-expanded="${pauseDrawerOpen}">${pauseDrawerOpen?'Close skills':'Edit hotbar'}</button></div>${pauseDrawerOpen?`<section class="asci-pause-drawer"><h3>Unlocked skills</h3><p>Drag an unlocked skill onto a hotbar slot. Changes save immediately.</p>${hotbarEditorHtml()}</section>`:''}</div></div>`:''}${modal?shopOrResult():''}</div>${touch.after}${phase==='menu'?`<div class="asci-currencies">◈ ${profile.fragments.toLocaleString()} fragments · ◆ ${profile.chunks.toLocaleString()} chunks · Best wave ${profile.best}</div>`:''}</div>`}
function shopOrResult(){if(modal==='shop')return shopHtml();if(modal==='guide')return `<div class="asci-overlay"><div class="asci-shop"><div class="asci-modalhead"><h3>Expedition Field Notes</h3><button type="button" data-asci="close">✕</button></div><p>Best wave <b>${profile.best}</b> · Full-cycle clears <b>${profile.clears}</b> · Enemies defeated <b>${profile.kills}</b></p><div class="asci-shopgrid"><div class="asci-purchase"><b>Ronaun</b><small>Binding lines restrict movement. The cage-headed enemies favor the unsafe lanes.</small></div><div class="asci-purchase"><b>Cari and Wyneb</b><small>The ghost bride shields allies; her slime companion charges when wounded.</small></div><div class="asci-purchase"><b>Gwallgof</b><small>A relentless hammer brute that advances toward you in wide W-shaped sweeps. Keep repositioning to dodge its approach.</small></div><div class="asci-purchase"><b>Un Llygadog</b><small>Lantern-faced summoner. Watch for reinforcements.</small></div><div class="asci-purchase"><b>Irusan and Melci</b><small>The trickster serves the cat-fairy master. Mind the warnings.</small></div><div class="asci-purchase"><b>Glas</b><small>The rooftop is scarred by each encounter. Elemental seals demand matching skills.</small></div></div><button type="button" data-asci="close">Return to camp</button></div></div>`;return `<div class="asci-overlay"><div class="asci-result"><h2>${modal==='clear'?'Victory!':'Run ended'}</h2><p>Best wave ${profile.best} · ◈ ${profile.fragments} · ◆ ${profile.chunks}</p><button class="primary" data-asci="close">Back to camp</button></div></div>`}
function refreshShell(){resetTouch();const wrap=document.querySelector('.asci-wrap');if(!wrap)return;wrap.outerHTML=view();bindCanvas();bindHotbarDnD();bindMobileControls();}
function bindCanvas(){canvas=document.querySelector('#asci-canvas');if(!canvas)return;ctx=canvas.getContext('2d');canvas.onpointermove=e=>{if(invadersMobile())return;const b=canvas.getBoundingClientRect();mouse.x=(e.clientX-b.left)/b.width*800;mouse.y=(e.clientY-b.top)/b.height*620;mouse.active=true;};canvas.onpointerleave=()=>{mouse.active=false};canvas.onclick=e=>{if(phase==='menu'&&!modal){const b=canvas.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*800,y=(e.clientY-b.top)/b.height*620;if(y<230&&x>275&&x<540)start();else if(y>400&&x>555){modal='shop';refreshShell();}}};drawNow();}
function handleClick(e){const root=e.target.closest('.asci-wrap');if(!root)return;const cmd=e.target.closest('[data-asci]');if(cmd){const a=cmd.dataset.asci;if(a==='pause'){phase='pause';pauseDrawerOpen=false;refreshShell();}else if(a==='resume'){phase='run';pauseDrawerOpen=false;refreshShell();}else if(a==='drawer'&&phase==='pause'){pauseDrawerOpen=!pauseDrawerOpen;refreshShell();}else if(a==='quit'){endRun(false)}else if(a==='shop'){if(phase==='menu'){modal='shop';refreshShell();}}else if(a==='guide'){if(phase==='menu'){modal='guide';refreshShell();}}else if(a==='close'){closeMenuModal();}return;}const clr=e.target.closest('[data-asci-clear-slot]');if(clr&&phase==='pause'){const slot=Number(clr.dataset.asciClearSlot);if(slot>=1&&slot<=skillDefs.length){const next=profile.hotbar.slice();next[slot-1]=null;profile.hotbar=next;persist();refreshShell();}return;}const skill=e.target.closest('[data-asci-cast]');if(skill){const id=skill.dataset.asciCast;if(id==='terra'&&world?.terraCharge)releaseTerra();else if(id)cast(id);return;}const unlock=e.target.closest('[data-asci-unlock]');if(unlock&&phase==='menu'){const d=skillDefs.find(x=>x.id===unlock.dataset.asciUnlock);if(d&&!profile.skills[d.id]&&profile.fragments>=d.cost){profile.fragments-=d.cost;profile.spentFragments=(profile.spentFragments||0)+d.cost;profile.skills[d.id]=true;if(!profile.hotbar.includes(d.id)){const empty=profile.hotbar.indexOf(null);if(empty>=0)profile.hotbar[empty]=d.id;}persist();refreshShell()}return;}const reforge=e.target.closest('[data-asci-reforge]');if(reforge&&phase==='menu'){const id=reforge.dataset.asciReforge,base={crashCount:40,crashRadius:30,crashPower:35,magnumPower:30},cap={crashCount:4,crashRadius:5,crashPower:5,magnumPower:8};const n=profile.reforges[id]||0,cost=base[id]*(n+1);if(base[id]&&n<cap[id]&&profile.fragments>=cost){profile.fragments-=cost;profile.spentFragments=(profile.spentFragments||0)+cost;profile.reforges[id]=n+1;persist();refreshShell()}return;}const linkBuy=e.target.closest('[data-asci-link]');if(linkBuy&&phase==='menu'&&linkLevel()<10){const cost=linkCost(linkLevel()+1);if(profile.fragments>=cost){profile.fragments-=cost;profile.spentFragments=(profile.spentFragments||0)+cost;profile.linkLevel=linkLevel()+1;persist();refreshShell();}return;}const hpBuy=e.target.closest('[data-asci-maxhp]');if(hpBuy&&phase==='menu'&&profile.fragments>=18&&(profile.purchases.maxhp||0)<10){profile.fragments-=18;profile.purchases.maxhp=(profile.purchases.maxhp||0)+1;profile.spentFragments=(profile.spentFragments||0)+18;persist();refreshShell();return;}const buy=e.target.closest('[data-asci-buy]');if(buy&&phase==='menu'){const x=shop.find(s=>s.id===buy.dataset.asciBuy),n=profile.purchases[x?.id]||0;if(!x||profile.chunks<x.cost||x.max&&n>=x.max)return;if(x.stone&&!extStone(x.stone))return;profile.chunks-=x.cost;profile.spentChunks=(profile.spentChunks||0)+x.cost;profile.purchases[x.id]=n+1;if(!x.stone){const b=bonus();b[x.id]=(b[x.id]||0)+1;saveBonus(b);if(x.id==='tickets')window.MIDIR_EV_DEFENSE?.grantTickets?.(2);}persist();refreshShell();}}
function bindHotbarDnD(){for(const el of document.querySelectorAll('[data-skill-id]')){el.addEventListener('dragstart',ev=>{dragSkillId=el.dataset.skillId||'';ev.dataTransfer?.setData('text/plain',dragSkillId);});}for(const zone of document.querySelectorAll('[data-hotbar-slot]')){zone.addEventListener('dragover',ev=>{ev.preventDefault();zone.classList.add('dragover');});zone.addEventListener('dragleave',()=>zone.classList.remove('dragover'));zone.addEventListener('drop',ev=>{ev.preventDefault();zone.classList.remove('dragover');const id=ev.dataTransfer?.getData('text/plain')||dragSkillId;const slot=Number(zone.dataset.hotbarSlot);if(phase==='pause'&&id&&skillDef(id)&&profile.skills[id])setHotbarSkill(slot,id);refreshShell();});}}
let sharedMobileMoveCleanup=null;
function bindMobileControls(){
 if(sharedMobileMoveCleanup){sharedMobileMoveCleanup();sharedMobileMoveCleanup=null}
 if(!invadersMobile())return;
 const moveControl=document.querySelector('.asci-touch-movement .midir-mobile-movement');
 if(moveControl)sharedMobileMoveCleanup=window.MIDIR_MOBILE_MOVE.bind(moveControl,(x,y)=>{touchMove.x=x;touchMove.y=y;if(phase==='run'&&world?.irusanPower)mobileIrusanStruggle(x)});
 document.querySelectorAll('[data-asci-touch]').forEach(button=>{
  const id=button.dataset.asciTouch;
  const end=e=>{if(touchHolds.get(id)!==e.pointerId)return;touchHolds.delete(id);button.classList.remove('holding');if(phase!=='run')return;if(id==='aqua')releaseAqua();else if(id==='terra')releaseTerra();else if(id==='anchor')releaseAnchor();};
  button.addEventListener('pointerdown',e=>{if(phase!=='run'||button.disabled||touchHolds.has(id))return;e.preventDefault();touchHolds.set(id,e.pointerId);button.classList.add('holding');try{button.setPointerCapture?.(e.pointerId)}catch{}cast(id)});
  button.addEventListener('pointerup',end);button.addEventListener('pointercancel',end);button.addEventListener('lostpointercapture',end);
  button.addEventListener('contextmenu',e=>e.preventDefault());
 });
}
function keydown(e){if(!document.querySelector('.asci-wrap'))return;const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown',' '].includes(k))e.preventDefault();keys.add(k);if(phase==='run'&&world?.irusanPower){irusanStruggleInput(k);return;}if(phase==='run'){const id=skillByKey(k);if(id&&id==='anchor'){if(!e.repeat)cast(id);}else if(id&&id==='terra'&&!(world?.terraCharge)){cast(id);}else if(id&&id!=='terra'){cast(id);}if(k==='escape'){phase='pause';pauseDrawerOpen=false;refreshShell()}}else if(phase==='pause'&&k==='escape'){phase='run';pauseDrawerOpen=false;refreshShell()}else if(phase==='menu'&&modal&&k==='escape'){closeMenuModal();}}
function keyup(e){const k=e.key.toLowerCase();keys.delete(k);if(phase==='run'&&world?.aquaCharge&&skillByKey(k)==='aqua')releaseAqua();if(phase==='run'&&world?.terraCharge&&skillByKey(k)==='terra')releaseTerra();if(phase==='run'&&world?.anchorAim&&skillByKey(k)==='anchor')releaseAnchor();}
let hooked=false;window.addEventListener('blur',()=>{resetTouch();mouse.active=false});function bind(){bindCanvas();bindHotbarDnD();bindMobileControls();if(!hooked){document.addEventListener('click',handleClick);document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);hooked=true;}cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(frame)}
function leave(){cancelAnimationFrame(raf);raf=0;keys.clear();if(sharedMobileMoveCleanup){sharedMobileMoveCleanup();sharedMobileMoveCleanup=null}resetTouch();if(phase==='run'){phase='pause';}canvas=null;ctx=null;mouse.active=false;}
window.MIDIR_AS_INVADERS={view,bind,leave,exportState:()=>JSON.parse(JSON.stringify(profile)),importState(v){if(!v||typeof v!=='object')return;profile={...seed(),...v,skills:{...(v.skills||{})},reforges:{...(v.reforges||{})},purchases:{...(v.purchases||{})},hotbar:Array.isArray(v.hotbar)?[...v.hotbar.slice(0,9),...Array(Math.max(0,9-v.hotbar.length)).fill(null)]:seed().hotbar,bossWins:{...(v.bossWins||{})}};persist();},getProgress:()=>({...profile}),bonuses:bonus};
})();
