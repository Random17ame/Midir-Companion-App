/* Explosive Vanguard · Tower Range Lab. Offline, persistent progress. */
(()=>{'use strict';
const KEY='midir-ev-tower-lab-v1';
// Link bonuses are cumulative TOTALS, not additive bonuses across ranks.
// Stamina is intentionally ignored. Shell and pressure mechanics use shared character resources.
const LINK_LEVELS=[
 {max:0,stamina:0,shell:0,pressure:0,primary:0},
 {max:15,stamina:100,shell:0,pressure:0,primary:0},
 {max:30,stamina:200,shell:2,pressure:0,primary:0},
 {max:60,stamina:300,shell:2,pressure:0,primary:0},
 {max:110,stamina:400,shell:4,pressure:0,primary:0},
 {max:200,stamina:500,shell:4,pressure:0,primary:0},
 {max:200,stamina:500,shell:6,pressure:10,primary:10,reload:true},
 {max:200,stamina:500,shell:6,pressure:20,primary:20,thrust:1},
 {max:200,stamina:500,shell:8,pressure:30,primary:25,arcWidth:1,zoneRadius:1},
 {max:200,stamina:500,shell:8,pressure:40,primary:30,burst:2},
 {max:200,stamina:500,shell:10,pressure:50,primary:35,glory:20,chargeNoMin:true}
];
const linkState=()=>LINK_LEVELS[Math.max(0,Math.min(10,profile.linkLevel||0))];
const linkCost=level=>60+level*40;
const linkTooltip=level=>{const b=LINK_LEVELS[level];return `Arcana Link ${level}: Lance weapon Max Damage +${b.max}; Max Stamina +${b.stamina}; Mana Shell consumption -${b.shell}%; Mana Pressure +${b.pressure}%; EV primary-target damage +${b.primary}%`+(level>=6?'; Reload Shells preparation removed, cooldown reduced':'')+(level>=7?'; Relentless Thrust cooldown -1s':'')+(level>=8?'; Arc Impact width and Blast Zone radius increased':'')+(level>=9?'; Dreadnought Burst cooldown -2s':'')+(level>=10?'; Blaze of Glory final hit +20%; Lance Charge minimum range removed':'')+'. Stamina is not simulated; resource effects apply to the shared lance.';};
// Weapon tiers use wiki base attack, piercing and the maximum Masterwork
// Grade Bonus. Beginner Lion Claw Lance has no listed Grade Bonus.
// The prototype weights piercing; this is NOT the Mabinogi damage formula.
const WEAPONS=[
 {name:'Beginner Lion Claw Lance',min:37,max:57,piercing:1,gradeBonus:0,cost:0},
 {name:'Celtic Clashing Lance',min:40,max:56,piercing:1,gradeBonus:28,cost:160},
 {name:'Perseus Tempestuous Lance',min:53,max:84,piercing:2,gradeBonus:56,cost:340},
 {name:'Nightbringer Spearhead Lance',min:30,max:65,piercing:4,gradeBonus:84,cost:620},
 {name:'Soul Liberator Lance',min:78,max:153,piercing:4,gradeBonus:112,cost:1000}
];
// Crafting names and distinct weapon upgrades derive from the supplied Mabinogi Wiki
// pages. Drop availability, quantities, sale prices and discounts are game abstractions.
const MATERIALS={
 fragment:{name:'Firm Blade Fragment',value:9},armor:{name:'Huge Armor Fragment',value:7},crystal:{name:'Shining Crystal Shard',value:12},seal:{name:'Incomplete Seal Emblem',value:10},
 vengeance:{name:'Vengeance-Imbued Blade',value:14},geata:{name:'Functional Geata Fragment',value:13},mist:{name:'Misty Red Gem',value:20},
 erg:{name:'Dark Erg Chunk',value:30},adamantine:{name:'Adamantine',value:15},strength:{name:'Condensed Strength Fragment: Lance',value:13},phantasmal:{name:'Phantasmal Ingot',value:19},
 bri:{name:'Bri Leith Core',value:36},essence:{name:'Bri Leith Essence',value:23},memory:{name:'Intense Memory Crystal',value:25},alloy:{name:'Pure Fused Hillwen Alloy',value:29}
};
const RECIPES=[null,
 {fragment:3,armor:3,crystal:2,seal:2},
 {vengeance:4,geata:4,mist:2},
 {erg:2,adamantine:5,strength:8,phantasmal:3},
 {bri:3,essence:5,memory:4,alloy:2}
];
const SPECIALS=[null,
 {name:'Celtic Clashing Lance Custom Tempering',max:10,piercing:0,cost:95},
 {name:'Perseus Tempestuous Lance Unique Upgrade',max:25,piercing:0,cost:190},
 {name:'N.B Spearhead Unique Upgrade',max:25,piercing:4,cost:330},
 {name:'S.L Lance Unique Upgrade 1',max:0,piercing:1,cost:280}
];
const SOUL_SECOND={name:'S.L Lance Unique Upgrade 2',max:25,piercing:0,cost:480};
const recipeFor=tier=>RECIPES[tier]||{};
function materialUnits(tier){const recipe=recipeFor(tier);return Object.entries(recipe).map(([id,needed])=>({id,needed,owned:Math.max(0,Math.floor(profile.materials?.[id]||0)),value:MATERIALS[id].value}))}
function materialDiscount(tier){const units=materialUnits(tier);return Math.min(Math.floor(WEAPONS[tier].cost*.8),Math.floor(units.reduce((sum,x)=>sum+Math.min(x.needed,x.owned)*x.value,0)))}
function weaponCost(tier){return Math.max(0,WEAPONS[tier].cost-materialDiscount(tier))}
function materialInventory(){return Object.entries(MATERIALS).filter(([id])=>(profile.materials[id]||0)>0).map(([id,m])=>`<div class="evtd-material"><span>${m.name} <b>×${profile.materials[id]}</b></span><button data-evtd-material="${id}">Sell one · ◈ ${m.value}</button></div>`).join('')||'<small>No materials collected yet. Defeat enemies to find crafting supplies.</small>'}
function weaponMarkup(){const tier=profile.weapon, w=WEAPONS[tier],next=WEAPONS[tier+1],spec=SPECIALS[tier];const improved=!!profile.weaponUpgrades[tier];const second=tier===4&&improved&&!profile.weaponUpgrades.soulSecond?`<button data-evtd-weapon-action="soul-second">${SOUL_SECOND.name} · ◈ ${SOUL_SECOND.cost}</button>`:tier===4&&profile.weaponUpgrades.soulSecond?'S.L Lance Unique Upgrade 2 ✓ Applied':'';return `<strong>Equipped weapon · ${w.name}</strong><small>Base attack ${w.min}–${w.max} · Piercing ${w.piercing} · ${tier===0?'No Grade Bonus listed':'Masterwork Grade Bonus +'+w.gradeBonus+'%'} · All tower damage ×${weaponFactor(tier).toFixed(2)} (prototype scaling)</small>${spec?`<div class="evtd-special">${spec.name} ${improved?'✓ Applied':`<button data-evtd-weapon-action="special">Apply upgrade · ◈ ${spec.cost}</button>`}${second||''}</div>`:''}${next?`<div class="evtd-weapon-next"><strong>Next · ${next.name}</strong><div class="evtd-material-recipe">${materialUnits(tier+1).map(x=>`<span>${MATERIALS[x.id].name} ${Math.min(x.owned,x.needed)}/${x.needed}</span>`).join('')}</div><button data-evtd-weapon-action="buy">Forge / buy weapon · ◈ ${weaponCost(tier+1)}</button><small>Collected materials lower the price; materials credited to the purchase are consumed.</small></div>`:'<small>Highest weapon tier equipped.</small>'}`}
function refreshEconomy(){const w=document.querySelector('.evtd-weapon'),m=document.querySelector('#evtd-material-stock');if(w)w.innerHTML=weaponMarkup();if(m)m.innerHTML=materialInventory()}
// Material families follow the equipped weapon: the next weapon's recipe
// begins dropping immediately. Later waves at the same tier improve the
// chance of finding that family's materials. Internal rates stay off the UI.
function dropMaterial(){
 const next=Math.min(4,profile.weapon+1),age=tierAge();
 if(Math.random()>Math.min(.64,.39+age*.035))return;
 const tier=(next>1&&Math.random()<.18)?next-1:next;
 const keys=Object.keys(recipeFor(tier));
 if(!keys.length)return;
 const id=keys[Math.floor(Math.random()*keys.length)];
 profile.materials[id]=(profile.materials[id]||0)+1;
}
function defeatedEnemyGold(){return 12}
function waveClearGold(){return 22+profile.weapon*15}
const weaponPower=w=>((w.min+w.max)/2+25*w.piercing)*(1+(w.gradeBonus||0)/100);
const weaponFactor=i=>{const w=WEAPONS[i]||WEAPONS[0],spec=profile.weaponUpgrades?.[i]?SPECIALS[i]:null;return (weaponPower(w)+(spec?.max||0)+25*(spec?.piercing||0)+(i===4&&profile.weaponUpgrades?.soulSecond?SOUL_SECOND.max:0))/weaponPower(WEAPONS[0]);};

// Player-estimated ranges and attack widths in battlefield meters (EV Tower Range Lab only).
const DATA=[
 {id:'thrust',name:'Relentless Thrust',cost:40,cd:0,range:4,shape:'lockline',width:.5,damage:16,desc:'Omnidirectional lock-on within 4m; moving resets the two-jab version. Third consecutive use accumulates 2s cooldown, reduced to 1s at Link X.' },
 {id:'charge',name:'Lance Charge',cost:75,cd:10,range:14,shape:'charge',width:1,damage:25,desc:'Long straight charge · Lance cooldown hat applies'},
 {id:'burst',name:'Dreadnought Burst',cost:110,cd:16,range:5,shape:'burst',width:3,damage:42,desc:'Focused forward burst · tied to Lance Charge cooldown'},
 {id:'drill',name:'Drill Charge',cost:80,cd:0,range:3,shape:'drill',width:4,damage:28,desc:'Piercing forward dash'},
 {id:'glory',name:'Blaze of Glory',cost:155,cd:30,range:6,shape:'line',width:4,damage:58,desc:'Circular burst · 15 shells returned in game'},
 {id:'arc',name:'Arc Impact',cost:95,cd:12,range:5,shape:'line',width:2,damage:29,desc:'Nearby arc · Flash Launcher gear synergy'},
 {id:'zone',name:'Blast Zone',cost:125,cd:18,range:6,shape:'circle',damage:33,desc:'Circular field · Grapple Shot gear synergy'},
 {id:'leap',name:'Lance Leap',cost:55,cd:5,range:2.4,shape:'cone',angle:65,damage:10,desc:'Short repositioning arc'},
 {id:'impact',name:'Lance Impact',cost:50,cd:3,range:2.7,shape:'line',width:.8,damage:10,desc:'Short-line utility · not core EV rotation'}
];
const seed=()=>({mapId:'classic',mapSeed:1,visitedMaps:{classic:true},patrolIndex:0,patrolLoot:[],thrustFollowup:false,rotation:[],rotationCursor:0,autoCircuit:false,hotbar:Array(12).fill(null),tutorialStage:0,inventory:[],shopVisitedOther:false,thrustStreak:0,drillHeat:0,drillHeatAt:0,shells:100,pressure:0,reloadReadyAt:0,combatTime:0,sharedCooldowns:{},gold:180,life:20,wave:0,hat:0,spirit:false,link:false,linkLevel:0,rangeBonus:0,damageBonus:0,weapon:0,tierStartWave:1,tickets:3,payment:'gold',materials:{},weaponUpgrades:{},towers:[],best:0});
let saved;try{saved=JSON.parse(localStorage.getItem(KEY)||'null')}catch{};let profile={...seed(),...(saved&&typeof saved==='object'?saved:{})};if(!Array.isArray(profile.towers))profile.towers=[];
if(!Array.isArray(profile.patrolLoot))profile.patrolLoot=[];
if(!Array.isArray(profile.inventory))profile.inventory=[];profile.shopVisitedOther=!!profile.shopVisitedOther;
if(!Array.isArray(profile.hotbar))profile.hotbar=Array(12).fill(null);profile.hotbar=Array.from({length:12},(_,i)=>DATA.some(x=>x.id===profile.hotbar[i])?profile.hotbar[i]:null);
// Do not lock ongoing campaigns behind a newly introduced onboarding tutorial.
if(!saved||!Object.prototype.hasOwnProperty.call(saved,'tutorialStage'))profile.tutorialStage=saved&&Number(saved.wave)>0?4:0;profile.tutorialStage=Math.max(0,Math.min(4,Number(profile.tutorialStage)||0));
profile.thrustFollowup=!!profile.thrustFollowup;
profile.weapon=Math.max(0,Math.min(WEAPONS.length-1,Math.floor(Number(profile.weapon)||0)));
// One EV character: all instances of a skill share one cooldown and resource transaction.
if(!Array.isArray(profile.rotation))profile.rotation=[];
profile.rotation=profile.rotation.filter(id=>DATA.some(x=>x.id===id));profile.rotationCursor=profile.rotation.length?Math.max(0,Math.floor(Number(profile.rotationCursor)||0))%profile.rotation.length:0;profile.autoCircuit=profile.autoCircuit!==false;profile.thrustStreak=Math.max(0,Math.floor(Number(profile.thrustStreak)||0));profile.drillHeat=Math.max(0,Math.min(4,Number(profile.drillHeat)||0));profile.drillHeatAt=Number(profile.drillHeatAt)||0;
profile.shells=Math.max(0,Math.min(100,Number(profile.shells)||0));
profile.pressure=Math.max(0,Math.min(100,Number(profile.pressure)||0));
profile.combatTime=Math.max(0,Number(profile.combatTime)||0);
profile.reloadReadyAt=Math.max(0,Number(profile.reloadReadyAt)||0);
if(!profile.sharedCooldowns||typeof profile.sharedCooldowns!=='object')profile.sharedCooldowns={};

// Older campaigns adopt their current tier at the next wave rather than
// inheriting a huge fixed-wave enemy-health penalty.
if(!saved||!Object.prototype.hasOwnProperty.call(saved,'tierStartWave')||!Number.isFinite(Number(profile.tierStartWave))||Number(profile.tierStartWave)<1)profile.tierStartWave=Math.max(1,profile.wave+1);
profile.tierStartWave=Math.max(1,Math.floor(Number(profile.tierStartWave)));

// Legacy Arcana Link 9+ was a paid toggle but had no combat effect. Honor prior purchases as Link IX.
if(!Object.prototype.hasOwnProperty.call(saved||{},'linkLevel'))profile.linkLevel=profile.link?9:0;
profile.linkLevel=Math.max(0,Math.min(10,Math.floor(Number(profile.linkLevel)||0)));
profile.tickets=Math.max(0,Math.floor(Number(profile.tickets)||0));
profile.payment=profile.payment==='ticket'?'ticket':'gold';
if(!profile.materials||typeof profile.materials!=='object')profile.materials={};
if(!profile.weaponUpgrades||typeof profile.weaponUpgrades!=='object')profile.weaponUpgrades={};
// Legacy saves never stored how a tower was purchased: default to its
// listed purchase price so existing customers can sell at full gold value.
for(const t of profile.towers){if(!t||typeof t!=='object')continue;
 if(t.paidWith!=='ticket'&&t.paidWith!=='gold')t.paidWith='gold';
 if(t.paidWith==='gold'&&!Number.isFinite(t.paidGold))t.paidGold=byIdSafeCost(t.id);
}
function byIdSafeCost(id){return DATA.find(s=>s.id===id)?.cost||0}

const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(profile))}catch{}};
let enemies=[],fx=[],running=false,waveActive=false,drawer=null,uiPaused=false,manualPause=false,shopPage='towers',pendingInventory=null,last=0,spawned=0,clock=0,raf=0,selected='thrust',hover=null,drag=null,mouse={x:0,y:0},note='Open Shop to buy towers. Drag purchases directly onto clear ground, or store them in Inventory.';
const iconCache=new Map();
function iconFor(s){return window.MIDIR_ROTATION_ICONS?.[s.name]||''}
function towerIcon(s){const src=iconFor(s);if(!src)return null;if(!iconCache.has(src)){const img=new Image();img.src=src;iconCache.set(src,img)}return iconCache.get(src)}
function selectedTower(){return hover&&profile.towers.includes(hover)?hover:null}
function towerAt(x,y){return profile.towers.slice().reverse().find(t=>Math.hypot(t.x-x,t.y-y)<=12)||null}
// Match collision clearance to the ACTUAL drawn geometry: the road occupies
// 0.5m on either side of its centerline, and the tower disk has a 1m radius.
// This is footprint collision only; attacks retain their full range from the
// tower's center. No extra hidden roadside exclusion zone is applied.
const W=780,H=400,TILE=40,METER=10,ROAD_WIDTH_METERS=1; // One meter = 10 board pixels. Road is one meter across.
const TOWER_FOOTPRINT_RADIUS=10;
const ROAD_EDGE_CLEARANCE=(ROAD_WIDTH_METERS*METER)/2+TOWER_FOOTPRINT_RADIUS;
function canPlace(x,y,except=null){return x>=TOWER_FOOTPRINT_RADIUS&&x<=W-TOWER_FOOTPRINT_RADIUS&&y>=TOWER_FOOTPRINT_RADIUS&&y<=H-TOWER_FOOTPRINT_RADIUS&&distPath(x,y)>=ROAD_EDGE_CLEARANCE&&!profile.towers.some(t=>t!==except&&Math.hypot(t.x-x,t.y-y)<TOWER_FOOTPRINT_RADIUS*2)&&Math.hypot(x-basePoint().x,y-basePoint().y)>22+TOWER_FOOTPRINT_RADIUS}
function rotateSelected(delta){const t=selectedTower();if(!t){note='Select a placed tower to rotate.';updateStats();return}t.angle=(t.angle+delta+Math.PI*2)%(Math.PI*2);persist();note=byId(t.id).name+' facing '+Math.round(t.angle*180/Math.PI)+'°';updateStats()}

const MAPS=[
 {id:'classic',name:'Original Route',description:'The familiar original training layout.'},
 {id:'slalom',name:'Winding Slalom',description:'Long switchbacks with buildable gaps between lanes.'},
 {id:'straight',name:'Straight Approach',description:'One direct lane to the home base.'},
 {id:'fork',name:'Split & Rejoin',description:'Enemies divide between upper and lower lanes, then converge.'},
 {id:'spiral',name:'Triple Spiral',description:'Three inward loops around the central home base.'},
 {id:'random',name:'Randomized Route',description:'Fresh procedurally generated meanders, S-curves, staircases, switchbacks, and weaving routes.'}
];
const ORIGINAL=[[-30,200],[150,200],[150,90],[375,90],[375,310],[610,310],[610,200],[815,200]];
const randomStream=seed=>{let a=(seed>>>0)||1;return()=>{a=(a+0x6D2B79F5)|0;let x=Math.imul(a^(a>>>15),1|a);x^=x+Math.imul(x^(x>>>7),61|x);return ((x^(x>>>14))>>>0)/4294967296}};
function makeRoutes(id,seed){
 if(id==='straight')return [[[-30,200],[815,200]]];
 if(id==='slalom')return [[[-30,65],[665,65],[665,155],[115,155],[115,245],[665,245],[665,335],[815,335]]];
 if(id==='fork')return [
 [[-30,200],[180,200],[210,125],[325,95],[500,95],[570,125],[605,200],[815,200]],
 [[-30,200],[180,200],[210,275],[325,305],[500,305],[570,275],[605,200],[815,200]]
 ];
 if(id==='spiral'){
  const route=[];const steps=180;
  for(let i=0;i<=steps;i++){const t=i/steps,a=Math.PI+6*Math.PI*t,rx=405*(1-t),ry=182*(1-t);route.push([390+rx*Math.cos(a),200+ry*Math.sin(a)])}
  route.push([390,200]);return [route];
 }
 if(id==='random'){
  // Deterministic seeded variety: five fundamentally different route families.
  // All connect an entry just outside the left side to the right-side base.
  // Path lengths remain >= 50m because the horizontal span alone is 84.5m.
  const rand=randomStream(seed),variant=Math.floor(rand()*5),route=[];
  const ry=()=>Math.round(45+rand()*310),rx=()=>Math.round(65+rand()*645);
  if(variant===0){ // horizontally progressing, jagged canyon meander
   let y=ry();route.push([-30,y]);
   for(let i=1;i<=9;i++){const x=Math.round(i*77);y=Math.round(45+rand()*310);route.push([x,y]);}
   route.push([815,y]);
  }else if(variant===1){ // widely spaced S-shaped serpentine waves
   const phase=rand()*Math.PI*2,cycles=1.5+Math.floor(rand()*3),amp=75+rand()*70;
   for(let i=0;i<=64;i++){const t=i/64;route.push([Math.round(-30+845*t),Math.round(200+amp*Math.sin(t*Math.PI*2*cycles+phase)*Math.sin(Math.PI*(.1+.8*t)))]);}
  }else if(variant===2){ // orthogonal staircase with varied vertical jogs
   let y=ry();route.push([-30,y]);
   for(let i=1;i<=8;i++){const x=Math.round(i*91);route.push([x,y]);y=ry();route.push([x,y]);}
   route.push([815,y]);
  }else if(variant===3){ // long multi-lane switchback with irregular turn positions
   const lanes=3+Math.floor(rand()*2),spacing=lanes===4?88:115,y0=(400-spacing*(lanes-1))/2;
   const ys=Array.from({length:lanes},(_,i)=>Math.round(y0+i*spacing+(rand()-.5)*10));
   route.push([-30,ys[0]]);
   for(let i=0;i<lanes;i++){
    const far=i%2===0?Math.round(580+rand()*125):Math.round(90+rand()*105);
    route.push([far,ys[i]]);if(i<lanes-1)route.push([far,ys[i+1]]);
   }
   route.push([815,ys[lanes-1]]);
  }else{ // long weaving route with drifting wide bends / plateau sections
   const mid=ry();route.push([-30,mid]);
   const sections=5+Math.floor(rand()*3);
   for(let i=1;i<=sections;i++){
    const x=Math.round(i*780/(sections+1)),y=ry();
    route.push([x,route[route.length-1][1]]);
    route.push([x,y]);
    const ahead=Math.round(x+30+rand()*55);route.push([Math.min(760,ahead),y]);
   }
   route.push([815,route[route.length-1][1]]);
  }
  return [route];
 }
 return [ORIGINAL.map(x=>[...x])];
}
profile.mapId=MAPS.some(x=>x.id===profile.mapId)?profile.mapId:'classic';
profile.mapSeed=Math.max(1,Math.floor(Number(profile.mapSeed)||1));
let ROUTES=makeRoutes(profile.mapId,profile.mapSeed);
let PATH=ROUTES[0];
const byId=id=>DATA.find(s=>s.id===id);
let PATROL=[];
function rebuildPatrol(){
 PATROL=[];
 // For branching layouts the patrol traverses both routes; repeated common
 // tiles are harmless, and items are keyed to their nearest specific stop.
 for(const route of ROUTES){for(let i=1;i<route.length;i++){
  const [ax,ay]=route[i-1],[bx,by]=route[i],distance=Math.hypot(bx-ax,by-ay),count=Math.max(1,Math.ceil(distance/TILE));
  for(let j=0;j<=count;j++){
   const x=ax+(bx-ax)*j/count,y=ay+(by-ay)*j/count;
   if(x<0||x>W||y<0||y>H)continue;
   if(!PATROL.length||Math.hypot(PATROL[PATROL.length-1].x-x,PATROL[PATROL.length-1].y-y)>10)PATROL.push({x,y});
  }
 }}
 profile.patrolIndex=Math.max(0,Math.min(PATROL.length-1,Math.floor(profile.patrolIndex||0)));
}
rebuildPatrol();
function basePoint(){const last=PATH[PATH.length-1];return {x:Math.min(W-30,Math.max(30,last[0])),y:Math.min(H-30,Math.max(30,last[1]))}}
function changeMap(id,reroll=false){
 if(waveActive){note='Finish the current wave before switching maps.';updateStats();return}
 if(!MAPS.some(x=>x.id===id))return;
 if(id===profile.mapId&&!reroll){note='This map is already selected.';updateStats();return}
 // Changing geometry settles old loot and refunds placements exactly as if
 // each had been sold. No weapon, material or campaign progression is lost.
 for(const drop of profile.patrolLoot){profile.gold+=drop.gold||0;if(drop.material)profile.materials[drop.material]=(profile.materials[drop.material]||0)+1}
 profile.patrolLoot=[];
 for(const t of profile.towers){if(t.paidWith==='ticket')profile.tickets++;else profile.gold+=Number.isFinite(t.paidGold)?t.paidGold:byIdSafeCost(t.id)}
 profile.towers=[];hover=null;drag=null;enemies=[];fx=[];
 profile.mapId=id;profile.visitedMaps=profile.visitedMaps||{};profile.visitedMaps[id]=true;
 if(id==='random')profile.mapSeed=1+Math.floor(Math.random()*2147483646);
 ROUTES=makeRoutes(profile.mapId,profile.mapSeed);PATH=ROUTES[0];profile.patrolIndex=0;rebuildPatrol();
 note=(id==='random'?'Random route generated. ':'Map changed. ')+'Towers refunded and unclaimed loot collected; place defenses for the new route.';
 persist();refreshRotation();refreshEconomy();refreshMapUI();updateStats();updatePatrol();draw();
}
function refreshMapUI(){const el=document.querySelector('#evtd-map-title');if(el)el.textContent=MAPS.find(x=>x.id===profile.mapId)?.name||'Battlefield';const random=document.querySelector('#evtd-map-reroll');if(random)random.hidden=profile.mapId!=='random';const info=document.querySelector('#evtd-map-info');if(info)info.textContent=(MAPS.find(x=>x.id===profile.mapId)?.description||'')+' · Route: '+Math.round(Math.min(...ROUTES.map(route=>route.slice(1).reduce((n,p,i)=>n+Math.hypot(p[0]-route[i][0],p[1]-route[i][1]),0)))/METER)+'m minimum branch'}
function nearestPatrolIndex(x,y){let best=0,distance=Infinity;PATROL.forEach((p,i)=>{const d=Math.hypot(x-p.x,y-p.y);if(d<distance){distance=d;best=i}});return best}
function collectPatrol(direction){
 if(!PATROL.length)return;
 profile.patrolIndex=(profile.patrolIndex+direction+PATROL.length)%PATROL.length;
 const taken=profile.patrolLoot.filter(x=>x.index===profile.patrolIndex);
 profile.patrolLoot=profile.patrolLoot.filter(x=>x.index!==profile.patrolIndex);
 const gold=taken.reduce((sum,x)=>sum+(x.gold||0),0);
 profile.gold+=gold;
 for(const x of taken)if(x.material)profile.materials[x.material]=(profile.materials[x.material]||0)+1;
 profile.thrustFollowup=false;profile.thrustStreak=0; // deliberate path movement cancels follow-up
 if(profile.tutorialStage===0)profile.tutorialStage=1;
 note='Patrol '+(direction>0?'forward':'backward')+' · tile '+(profile.patrolIndex+1)+'/'+PATROL.length+(taken.length?' · collected '+gold+' gold and '+taken.filter(x=>x.material).length+' material(s)':' · empty tile')+' · double jab reset.';
 persist();refreshEconomy();updateStats();updatePatrol();
}
function updatePatrol(){const el=document.querySelector('#evtd-patrol-status');if(el)el.textContent='Tile '+(profile.patrolIndex+1)+'/'+PATROL.length+' · '+profile.patrolLoot.length+' loot piles · Relentless Thrust: '+(profile.thrustFollowup?'follow-up thrust':'double jab ready')}
function dropPatrolLoot(e){
 const next=Math.min(4,profile.weapon+1),age=tierAge(),materialChance=Math.min(.64,.39+age*.035);
 let material=null;
 if(Math.random()<=materialChance){const tier=next>1&&Math.random()<.18?next-1:next,keys=Object.keys(recipeFor(tier));if(keys.length)material=keys[Math.floor(Math.random()*keys.length)]}
 profile.patrolLoot.push({index:nearestPatrolIndex(e.x,e.y),gold:defeatedEnemyGold(),material});
}

const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function distPath(x,y){let best=Infinity;for(const route of ROUTES)for(let i=1;i<route.length;i++){const [ax,ay]=route[i-1],[bx,by]=route[i],dx=bx-ax,dy=by-ay;const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));best=Math.min(best,Math.hypot(x-ax-t*dx,y-ay-t*dy))}return best;}
const stats=s=>{
 let cd=s.cd,r=s.range,width=s.width,minRange=0;
 const link=linkState();
 if(s.id==='charge'){
   if(profile.spirit)cd-=2.5;
   cd-=profile.hat;r+=profile.rangeBonus*.45;
   // Lance Charge has a minimum engagement distance until its Spirit
   // weapon exclusive or Arcana Link X removes it.
   minRange=(profile.spirit||link.chargeNoMin)?0:2.0;
 }
 if(s.id==='burst'){const lc=Math.max(.5,10-(profile.spirit?2.5:0)-profile.hat);cd=Math.max(6,6+lc-2);cd-=link.burst||0;}
 if(s.id==='thrust'){cd=0;width=profile.thrustFollowup?1:.5;}
 if(s.id==='arc')width=(width||0)+(link.arcWidth||0);
 if(s.id==='zone')r+=link.zoneRadius||0;
 const linkMaxPower=link.max/weaponPower(WEAPONS[0]);
 const raw=(s.damage*(1+profile.damageBonus*.1)*(weaponFactor(profile.weapon)+linkMaxPower) );
 const finalBonus=s.id==='glory'?(1+(link.glory||0)/100):1;
 return {...s,cd:Math.max(0,cd),range:r,width,minRange,damage:raw*finalBonus,primaryBonus:link.primary};
};
// Patch-confirmed: Drill Charge grants 15 pressure before Link modifiers; above
// 50 pressure selected skills bypass Heavy Stander auto-defense below a certain rank.
// Relentless Thrust shell cost and per-jab restoration are user-confirmed.
// Other unpublished per-skill shell consumption and pressure gains are prototype tuning.
const SHELL_COST={thrust:5,charge:4,burst:5,drill:0,glory:0,arc:3,zone:4,leap:1,impact:1};
const PRESSURE_GAIN={thrust:4,charge:5,burst:2,drill:15,glory:0,arc:4,zone:5,leap:2,impact:2};
const STANDER_BYPASS=new Set(['drill','thrust','arc','zone','glory']);
function shellCost(id){return Math.max(0,(SHELL_COST[id]||0)*(1-(linkState().shell||0)/100))}
function pressureGain(id){return (PRESSURE_GAIN[id]||0)*(1+(linkState().pressure||0)/100)}
function reload(){if(profile.combatTime<profile.reloadReadyAt)return 'Recharge Shells is still cooling down.';if(profile.shells>=100)return 'Mana Shells are already full.';profile.shells=100;profile.reloadReadyAt=profile.combatTime+(linkState().reload?9:15);persist();updateStats();return 'Recharge Shells: Mana Shells fully restored.'}
const HOTKEYS=['1','2','3','4','5','6','7','8','9','0','-','='];
function hotbarMarkup(){return HOTKEYS.map((key,i)=>{const id=profile.hotbar[i],skill=id?byId(id):null,owned=id&&ownedManagerIds().includes(id);return `<button class="evtd-hotbar-slot" data-evtd-hotbar-slot="${i}" data-evtd-icon-cd="${owned?id:''}" title="${skill?skill.name+' · '+key+' · drag another owned skill here, or right-click to clear':'Drag a skill from Base Manager onto this slot'}"><kbd>${key}</kbd>${skill?`<span class="evtd-hotbar-image">${iconFor(skill)?`<img src="${iconFor(skill)}" alt="">`:`<b>${skill.name.slice(0,2)}</b>`}</span><span class="evtd-hotbar-cooldown" data-evtd-hotbar-cd="${i}" hidden></span>`:'<span class="evtd-hotbar-empty">+</span>'}${skill?`<span class="evtd-hotbar-name">${skill.name}</span>`:''}</button>`}).join('')}
function renderHotbar(){const bar=document.querySelector('#evtd-hotbar');if(bar)bar.innerHTML=hotbarMarkup();updateHotbar()}
function updateHotbar(){document.querySelectorAll('[data-evtd-hotbar-cd]').forEach(el=>{const id=profile.hotbar[Number(el.dataset.evtdHotbarCd)],r=id?cooldownRemaining(id):0;el.hidden=r<=0;el.textContent=r>0?r.toFixed(1):'';el.closest('.evtd-hotbar-slot')?.classList.toggle('evtd-hotbar-cooling',r>0)})}
function castManual(id){if(!ownedManagerIds().includes(id)){note='Place a tower for this skill before casting.';updateStats();return}if(uiPaused||manualPause||!running){note='Manual skills are available during an active, unpaused wave.';updateStats();return}note=fireGroup(id)?byId(id).name+' activated from hotbar.':byId(id).name+' unavailable: target, shells or cooldown.';persist();updateStats()}
function ownedManagerIds(){return DATA.filter(x=>profile.towers.some(t=>t.id===x.id)).map(x=>x.id)}
function managerIcon(id){const x=byId(id),remaining=Math.max(0,(profile.sharedCooldowns[id]||0)-profile.combatTime),img=iconFor(x);return `<span class="evtd-manager-icon ${remaining>0?'evtd-manager-cooling':''}" data-evtd-icon-cd="${id}">${img?`<img src="${img}" alt="">`:`<span>${x.name.slice(0,2)}</span>`}<b class="evtd-manager-cd" data-evtd-icon-timer="${id}" ${remaining<=0?'hidden':''}>${remaining>0?remaining.toFixed(1):''}</b></span>`}
function rotationMarkup(){if(!profile.rotation.length)return '<div class="evtd-empty-rotation">Empty circuit. Drag an owned skill from above into this area to build your rotation.</div>';return profile.rotation.map((id,i)=>{const x=byId(id),owned=profile.towers.filter(t=>t.id===id).length,rem=Math.max(0,(profile.sharedCooldowns[id]||0)-profile.combatTime);return `<div class="evtd-sequence-row ${i===profile.rotationCursor?'evtd-current-link':''}" draggable="true" data-evtd-sequence="${i}" title="Drag to reorder · Link ${i+1}: all ${x.name} towers fire together"><span class="evtd-sequence-rank">${i+1} →</span>${managerIcon(id)}<span class="evtd-sequence-label">${x.name} <small>×${owned} placed · <span data-evtd-cd="${id}">${rem>0?rem.toFixed(1)+'s':'Ready'}</span></small></span><button data-evtd-manual="${id}" title="Manually activate all ${x.name} towers">Cast</button><button data-evtd-link="${i}" data-direction="up" ${i===0?'disabled':''} title="Move earlier">↑</button><button data-evtd-link="${i}" data-direction="down" ${i===profile.rotation.length-1?'disabled':''} title="Move later">↓</button><button data-evtd-remove="${i}" title="Remove link">×</button></div>`}).join('')}
function refreshRotation(){renderHotbar();const owned=ownedManagerIds(),el=document.querySelector('#evtd-rotation-list');if(el)el.innerHTML=rotationMarkup();const palette=document.querySelector('#evtd-manager-palette');if(palette)palette.innerHTML=owned.length?owned.map(id=>`<button class="evtd-manager-tile" draggable="true" data-evtd-manager-skill="${id}" title="Drag into circuit or click to append">${managerIcon(id)}<span>${byId(id).name}</span><small>+ Link</small></button>`).join(''):'<p class="hint">Place a tower to unlock its skill.</p>';const opts=document.querySelector('#evtd-link-skill');if(opts){opts.innerHTML=owned.map(id=>`<option value="${id}">${byId(id).name}</option>`).join('');opts.disabled=!owned.length}const add=document.querySelector('[data-evtd="add-link"]');if(add)add.disabled=!owned.length}
function cooldownRemaining(id){return Math.max(0,(profile.sharedCooldowns[id]||0)-profile.combatTime)}
function drillCool(){const seconds=Math.max(0,profile.combatTime-profile.drillHeatAt);if(seconds>=1&&profile.drillHeat>0){const cooled=Math.floor(seconds);profile.drillHeat=Math.max(0,profile.drillHeat-cooled);profile.drillHeatAt+=cooled}}
function eligibleEnemies(t,st){return enemies.filter(e=>e.hp>0&&inRange(t,e,st))}
function damageEnemy(e,amount,id,pressureBefore){const bypass=pressureBefore>50&&STANDER_BYPASS.has(id);e.hp-=amount*(e.heavyStander&&!bypass?.55:1)}
function damageTarget(t,e,amount,id,pressureBefore){damageEnemy(e,amount,id,pressureBefore);fx.push({x:t.x,y:t.y,tx:e.x,ty:e.y,life:.5})}
function lockedLineTargets(t,st,targets,width,reach=st.range){
 if(!targets.length)return [];
 const primary=targets.reduce((a,b)=>Math.hypot(b.x-t.x,b.y-t.y)<Math.hypot(a.x-t.x,a.y-t.y)?b:a);
 const dx=primary.x-t.x,dy=primary.y-t.y,len=Math.hypot(dx,dy);
 if(!len)return [primary];
 const ux=dx/len,uy=dy/len,limit=reach*METER,half=width*METER/2;
 return enemies.filter(e=>e.hp>0&&(()=>{
  const ex=e.x-t.x,ey=e.y-t.y,forward=ex*ux+ey*uy;
  return forward>=0&&forward<=limit&&Math.abs(ex*uy-ey*ux)<=half;
 })());
}
const DRILL_PUSH_METERS=6; // Experimental TD readability adjustment; game-reported push was ~3m.
function routePush(e,meters){const startX=e.x,startY=e.y;const route=ROUTES[e.routeIndex]||PATH;let left=meters*METER;while(left>0&&e.segment>=0){const [px,py]=route[e.segment],d=Math.hypot(e.x-px,e.y-py);if(d<=left){e.x=px;e.y=py;left-=d;if(e.segment===0)break;e.segment--}else if(d>0){e.x+=(px-e.x)*left/d;e.y+=(py-e.y)*left/d;break}else if(e.segment>0)e.segment--;else break}if(Math.hypot(e.x-startX,e.y-startY)>1)fx.push({x:startX,y:startY,tx:e.x,ty:e.y,life:.85,knockback:true})}
// A linked manager is a SINGLE skill activation. Same-type towers fire together;
// shell/pressure/cooldown changes occur once even if many towers or enemies hit.
function fireGroup(id){const groups=profile.towers.filter(t=>t.id===id);if(!groups.length)return false;
 const st=stats(byId(id));if(cooldownRemaining(id)>0)return false;
 if(id==='drill')drillCool();
 const plans=groups.map(t=>({t,targets:eligibleEnemies(t,st)}));if(!plans.some(p=>p.targets.length))return false;
 const cost=shellCost(id);if(profile.shells<cost)return false;
 const pressureBefore=profile.pressure;profile.shells-=cost;profile.pressure=Math.min(100,profile.pressure+pressureGain(id));
 if(id==='glory')profile.shells=Math.min(100,profile.shells+15);
 const now=profile.combatTime;
 profile.sharedCooldowns[id]=now+st.cd;
 if(id==='thrust'){
  const followup=profile.thrustFollowup;profile.thrustFollowup=true;profile.thrustStreak++;
  // Provisional: accumulation after the third cast; Link X reduces 2s to 1s.
  if(profile.thrustStreak>=3){profile.sharedCooldowns[id]=now+(profile.linkLevel>=10?1:2);profile.thrustStreak=0;}
  const jabs=followup?1:2;
  for(let jab=0;jab<jabs;jab++){let landed=false;
   for(const {t,targets} of plans){for(const e of lockedLineTargets(t,st,targets,followup?1:.5)){damageTarget(t,e,st.damage*(followup?1.4:jab===0?.4:.6),id,pressureBefore);landed=true}}
   if(landed)profile.shells=Math.min(100,profile.shells+15);
  }
 }else{
  for(const {t,targets} of plans){let hit=targets;
   if(id==='charge'){
    const primary=targets.reduce((a,b)=>Math.hypot(b.x-t.x,b.y-t.y)>Math.hypot(a.x-t.x,a.y-t.y)?b:a);
    const len=Math.hypot(primary.x-t.x,primary.y-t.y),ux=(primary.x-t.x)/len,uy=(primary.y-t.y)/len;
    hit=enemies.filter(e=>e.hp>0&&(()=>{const dx=e.x-t.x,dy=e.y-t.y,projection=dx*ux+dy*uy;return projection>=0&&projection<=len&&Math.abs(dx*uy-dy*ux)<=st.width*METER/2})());
    const scalingDistance=Math.min(14,Math.max(profile.spirit?7:0,len/METER));const ramp=.5+.5*scalingDistance/14;
    for(const e of hit)damageTarget(t,e,st.damage*ramp,id,pressureBefore);
    for(const e of enemies.filter(e=>e.hp>0&&e!==primary&&Math.hypot(e.x-primary.x,e.y-primary.y)<=.25*METER))damageTarget(t,e,st.damage*ramp*.5,id,pressureBefore);
    continue;
   }
   if(id==='burst'){const primary=targets.reduce((a,b)=>Math.hypot(b.x-t.x,b.y-t.y)<Math.hypot(a.x-t.x,a.y-t.y)?b:a);const dx=primary.x-t.x,dy=primary.y-t.y,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;hit=enemies.filter(e=>e.hp>0&&(()=>{const a=(e.x-primary.x)*ux+(e.y-primary.y)*uy;return (e===primary||(a>=0&&a<=3*METER&&Math.abs((e.x-primary.x)*uy-(e.y-primary.y)*ux)<=st.width*METER/2))})());}
   if(id==='drill'){hit=lockedLineTargets(t,st,targets,st.width,st.range+1)}
   if(id==='arc')hit=targets.slice().sort((a,b)=>Math.hypot(a.x-t.x,a.y-t.y)-Math.hypot(b.x-t.x,b.y-t.y)).slice(0,3);
   for(const [j,e] of hit.entries()){damageTarget(t,e,st.damage*(j===0?1+(st.primaryBonus||0)/100:1),id,pressureBefore);if(id==='drill'&&(!e.heavyStander||(pressureBefore>50&&STANDER_BYPASS.has(id))))routePush(e,DRILL_PUSH_METERS)}
  }
  if(id==='drill'){profile.drillHeat++;profile.drillHeatAt=now;profile.sharedCooldowns[id]=now+(profile.drillHeat>=5?9:1);if(profile.sharedCooldowns[id]>now+1)profile.drillHeat=0;}
 }
 return true;
}
function view(){
 const shopTowers=DATA.map(s=>{const x=stats(s);return `<div class="evtd-shop-tower ${s.id==='thrust'&&!profile.towers.length&&!profile.inventory.length?'evtd-first-tower':''}" draggable="true" data-evtd-drag-skill="${s.id}"><button data-evtd-skill="${s.id}" data-evtd-skill-tip="${s.id}" class="${selected===s.id?'chosen':''}"><span class="evtd-skill-heading">${iconFor(s)?`<img class="evtd-skill-icon" src="${iconFor(s)}" alt="">`:''}<strong>${s.name}</strong></span><small>${s.shape==='circle'?'Area attack':s.shape==='charge'?'Charging projectile':s.shape==='lockline'?'Target-lock attack':'Directional attack'}</small>${s.id==='thrust'&&!profile.towers.length&&!profile.inventory.length?'<b class="evtd-buy-now">BUY NOW</b>':''}</button><button data-evtd-buy="${s.id}">Buy · ◈ ${s.cost} / 1 ticket</button></div>`}).join('');
 return `<section class="evtd evtd-v177">
 <div class="evtd-game-shell">
 <div class="evtd-map-bar"><button data-evtd="prev-map" aria-label="Previous map">◀</button><div><strong id="evtd-map-title">${MAPS.find(m=>m.id===profile.mapId)?.name}</strong><small id="evtd-map-info"></small></div><button data-evtd="next-map" aria-label="Next map">▶</button><button id="evtd-map-reroll" data-evtd="map-reroll" ${profile.mapId==='random'?'':'hidden'}>↻ Reroll</button></div>
 <div class="evtd-game-hud"><span>Wave <b id="evtd-wave">${profile.wave}</b></span></div>
 <div class="evtd-hotbar" id="evtd-hotbar" aria-label="Skill hotbar, keys 1 through equals">${hotbarMarkup()}</div>
 <div class="evtd-battlefield"><div class="evtd-resource-overlay"><div class="evtd-bullet-meter" title="Mana Shells"><span class="evtd-bullet-icon" id="evtd-bullet-icon">●</span><div class="evtd-meter-track"><div id="evtd-shell-fill" class="evtd-shell-fill" style="width:${profile.shells}%"></div></div><b id="evtd-shells">${Math.round(profile.shells)} / 100</b></div><div class="evtd-pressure-meter" title="Mana Pressure"><span class="evtd-pressure-icon">◈</span><div class="evtd-meter-track"><div id="evtd-pressure-fill" class="evtd-pressure-fill" style="width:${profile.pressure}%"></div></div><b id="evtd-pressure">${Math.round(profile.pressure)}%</b></div></div><div class="evtd-zoom-controls" aria-label="Battlefield zoom"><button data-evtd="zoom-out" title="Zoom out" aria-label="Zoom out">−</button><span id="evtd-zoom-label">100%</span><button data-evtd="zoom-in" title="Zoom in" aria-label="Zoom in">+</button><button data-evtd="zoom-reset" title="Fit whole battlefield">Fit</button></div><canvas id="evtd-board" width="780" height="400" tabindex="0" aria-label="Battlefield. Click the visible home base to edit your rotation. Drag towers from shop or inventory to build."></canvas><div class="evtd-drop-overlay" id="evtd-drop-overlay" hidden>Drop tower to place</div>
 <aside class="evtd-drawer" id="evtd-drawer" hidden><div class="evtd-drawer-heading"><strong id="evtd-drawer-title">Shop</strong><button data-evtd="close-drawer" aria-label="Close panel">✕</button></div>
 <div id="evtd-shop-panel" hidden><div class="evtd-shop-currency"><span>◈ Gold <b id="evtd-gold">${profile.gold}</b></span><span>Tickets <b id="evtd-tickets">${profile.tickets}</b></span></div><nav class="evtd-shop-pages"><button data-evtd-page="towers">Towers</button><button data-evtd="next-shop-page" id="evtd-next-page">Next page →</button></nav><div class="evtd-shop-tabs"><button data-evtd-page="towers">Towers</button><button data-evtd-page="upgrades">Upgrades</button><button data-evtd-page="weapons">Weapons</button></div>
 <div class="evtd-shop-section" data-evtd-section="towers"><fieldset class="evtd-pay-choice"><legend>Payment</legend><label><input type="radio" name="evtd-payment" value="gold" ${profile.payment==='gold'?'checked':''}> Gold</label><label><input type="radio" name="evtd-payment" value="ticket" ${profile.payment==='ticket'?'checked':''}> Ticket</label></fieldset><p class="hint">Drag to place, or buy for later.</p><div class="evtd-items">${shopTowers}</div></div>
 <div class="evtd-shop-section" data-evtd-section="upgrades" hidden><div class="evtd-upgrades"><label title="Lance Charge hat cooldown reduction">Lance Charge hat reforge <select data-evtd-gear="hat">${[0,1,2,3,4,5,6,7].map(x=>`<option value="${x}" ${profile.hat===x?'selected':''}>${x}</option>`).join('')}</select></label><label title="Spirit Weapon exclusive removes Lance Charge minimum targeting distance"><input type="checkbox" data-evtd-gear="spirit" ${profile.spirit?'checked':''}> Lance Spirit exclusive · ◈ 150</label><div class="evtd-link-upgrade" title="${linkTooltip(Math.max(1,profile.linkLevel))}"><strong>Arcana Link · Level ${profile.linkLevel} / X</strong><button data-evtd="link-up" ${profile.linkLevel>=10?'disabled':''}>${profile.linkLevel<10?`Increase · ◈ ${linkCost(profile.linkLevel+1)}`:'Maximum level'}</button></div><button data-evtd="range" title="Improve Lance Charge reach">Lance Charge reach training · ◈ ${60+profile.rangeBonus*50}</button><button data-evtd="damage" title="Improve all tower damage">Mounted damage training · ◈ ${65+profile.damageBonus*55}</button></div></div>
 <div class="evtd-shop-section" data-evtd-section="weapons" hidden><div class="evtd-weapon">${weaponMarkup()}</div><h3>Found materials</h3><div id="evtd-material-stock">${materialInventory()}</div></div></div>
 <div id="evtd-inventory-panel" hidden><p class="hint">Drag a tower onto open ground.</p><div id="evtd-inventory-items"></div></div>
 <div id="evtd-base-panel" hidden><div class="evtd-resources"><span>Mana Shells <b id="evtd-base-shells">${Math.round(profile.shells)}/100</b></span><span>Mana Pressure <b id="evtd-base-pressure">${Math.round(profile.pressure)}%</b></span><button data-evtd="reload" id="evtd-reload">Recharge Shells</button><span id="evtd-reload-status"></span></div><div class="evtd-patrol"><button data-evtd="patrol-back">← Patrol (A)</button><button data-evtd="patrol-next">Patrol (D) →</button><span id="evtd-patrol-status"></span></div><div class="evtd-link-editor"><label><input type="checkbox" id="evtd-auto-circuit" ${profile.autoCircuit?'checked':''}> Auto circuit (1 second per link)</label><select id="evtd-link-skill"></select><button data-evtd="add-link">Add link</button><button data-evtd="reset-links">Clear circuit</button><small>Links can revisit managers. All same-type towers activate together. Cast buttons work manually.</small></div><div class="evtd-manager-palette" id="evtd-manager-palette"></div><div id="evtd-rotation-list" class="evtd-rotation-list" aria-label="Drop skill managers to build your rotation">${rotationMarkup()}</div></div>
 </aside><div class="evtd-tutorial" id="evtd-tutorial" ${profile.tutorialStage>=4?'hidden':''}></div></div>
 <div class="evtd-action-bar"><button data-evtd="start">Start wave</button><button data-evtd="pause" id="evtd-pause">Pause</button><button data-evtd="open-shop">🛒 Shop</button><button data-evtd="open-inventory">▣ Inventory <b id="evtd-inventory-count">${profile.inventory.length}</b></button><button data-evtd="open-base">⌂ Base manager</button><button data-evtd="rotate-left">↶</button><button data-evtd="rotate-right">↷</button><button data-evtd="sell" id="evtd-sell" disabled>Sell selected</button><button data-evtd="reset">New campaign</button></div>
 <div class="evtd-note-row" id="evtd-note">${note}</div>
 </div></section>`;
}
const getCtx=()=>document.querySelector('#evtd-board')?.getContext('2d');
let zoom=1, cameraX=0,cameraY=0;
function setZoom(next,anchorX=W/2,anchorY=H/2){const z=Math.max(1,Math.min(4,Math.round(next*10)/10));const wx=(anchorX-cameraX)/zoom,wy=(anchorY-cameraY)/zoom;zoom=z;cameraX=anchorX-wx*zoom;cameraY=anchorY-wy*zoom;cameraX=Math.max(W*(1-zoom),Math.min(0,cameraX));cameraY=Math.max(H*(1-zoom),Math.min(0,cameraY));const label=document.querySelector('#evtd-zoom-label');if(label)label.textContent=Math.round(zoom*100)+'%';draw()}

function draw(){const c=getCtx();if(!c)return;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);c.save();c.setTransform(zoom,0,0,zoom,cameraX,cameraY);c.fillStyle='#112332';c.fillRect(0,0,W,H);c.strokeStyle='#263c4d';c.lineWidth=1;for(let x=0;x<W;x+=TILE){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke()}for(let y=0;y<H;y+=TILE){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke()}c.strokeStyle='#566d78';c.lineWidth=ROAD_WIDTH_METERS*METER;c.lineJoin='round';c.lineCap='round';for(const route of ROUTES){c.beginPath();route.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()}c.strokeStyle='#a7c7cb';c.lineWidth=2;for(const route of ROUTES){c.beginPath();route.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()}const base=basePoint();c.fillStyle='#edbd61';c.strokeStyle='#fff3b3';c.lineWidth=3;c.beginPath();c.arc(base.x,base.y,22,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#192936';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText('⌂ BASE',base.x,base.y+5);c.fillStyle='#fff2cc';c.strokeStyle='#172631';c.lineWidth=3;c.font='bold 15px sans-serif';c.strokeText('♥ '+profile.life,base.x,base.y-33);c.fillText('♥ '+profile.life,base.x,base.y-33);if(profile.tutorialStage===2){c.strokeStyle='#ffeb86';c.lineWidth=5;c.setLineDash([5,4]);c.beginPath();c.arc(base.x,base.y,30,0,Math.PI*2);c.stroke();c.setLineDash([])} 
 for(const drop of profile.patrolLoot){const p=PATROL[drop.index];if(!p)continue;c.fillStyle=drop.material?'#a8e8b9':'#ffdb70';c.beginPath();c.arc(p.x,p.y,5+Math.min(4,Math.sqrt(drop.gold||0)),0,Math.PI*2);c.fill()}
 const patrol=PATROL[profile.patrolIndex];if(patrol){c.strokeStyle='#6dffbe';c.lineWidth=3;c.beginPath();c.arc(patrol.x,patrol.y,16,0,Math.PI*2);c.stroke();c.fillStyle='#6dffbe';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText('◆',patrol.x,patrol.y+5)}
 for(const t of profile.towers){const s=stats(byId(t.id));if(!s)continue; if(t===hover){c.save();c.translate(t.x,t.y);c.rotate(t.angle);c.strokeStyle='rgba(92,218,245,.85)';c.fillStyle='rgba(92,218,245,.13)';c.lineWidth=2;const r=s.range*METER;if(s.minRange){c.beginPath();c.arc(0,0,s.minRange*METER,0,Math.PI*2);c.stroke()}if(['circle','lockline','burst','drill','charge'].includes(s.shape)){c.beginPath();c.arc(0,0,r,0,Math.PI*2)}else if(s.shape==='cone'){c.beginPath();c.moveTo(0,0);c.arc(0,0,r,-(s.angle||45)*Math.PI/360,(s.angle||45)*Math.PI/360);c.closePath()}else{c.beginPath();c.rect(0,-s.width*METER/2,r,s.width*METER)}c.fill();c.stroke();c.restore()}
 c.fillStyle='#ffc865';c.beginPath();c.arc(t.x,t.y,10,0,Math.PI*2);c.fill();const icon=towerIcon(byId(t.id));if(icon&&icon.complete&&icon.naturalWidth){c.save();c.beginPath();c.arc(t.x,t.y,9,0,Math.PI*2);c.clip();c.drawImage(icon,t.x-9,t.y-9,18,18);c.restore()}else{c.fillStyle='#13232a';c.font='bold 10px sans-serif';c.textAlign='center';c.fillText(byId(t.id)?.name.slice(0,3)||'',t.x,t.y+4)}c.strokeStyle='#e6f9ff';c.lineWidth=3;c.beginPath();c.moveTo(t.x+Math.cos(t.angle)*10,t.y+Math.sin(t.angle)*10);c.lineTo(t.x+Math.cos(t.angle)*22,t.y+Math.sin(t.angle)*22);c.stroke();{const remain=cooldownRemaining(t.id);if(remain>0){c.fillStyle='rgba(8,17,25,.73)';c.beginPath();c.arc(t.x,t.y,10,0,Math.PI*2);c.fill();c.fillStyle='#ffffff';c.font='bold 10px sans-serif';c.textAlign='center';c.fillText(remain<10?remain.toFixed(1):Math.ceil(remain),t.x,t.y+3)}}if(t===hover){c.strokeStyle='#82e8ff';c.lineWidth=2;c.beginPath();c.arc(t.x,t.y,12,0,Math.PI*2);c.stroke()}
}
 for(const e of enemies){if(e.heavyStander){c.strokeStyle='#b18fff';c.lineWidth=3;c.beginPath();c.arc(e.x,e.y,14,0,Math.PI*2);c.stroke()}c.fillStyle=e.hp>30?'#f36f85':'#f7a55c';c.beginPath();c.arc(e.x,e.y,11,0,Math.PI*2);c.fill();c.fillStyle='#8ce7a2';c.fillRect(e.x-13,e.y-19,26*Math.max(0,e.hp/e.max),3)}
 for(const f of fx){c.strokeStyle=f.knockback?`rgba(101,225,255,${Math.max(0,f.life)})`:`rgba(251,224,133,${Math.max(0,f.life)})`;c.lineWidth=f.knockback?6:3;c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.tx,f.ty);c.stroke()}c.restore()}
function inRange(t,e,s){const dx=e.x-t.x,dy=e.y-t.y,d=Math.hypot(dx,dy);if(d>s.range*METER||(s.minRange&&d<s.minRange*METER))return false;if(['circle','lockline','burst','drill','charge'].includes(s.shape))return true;const a=Math.atan2(dy,dx)-t.angle,forward=Math.cos(a)*d,side=Math.abs(Math.sin(a)*d);return s.shape==='cone'?Math.abs(Math.atan2(Math.sin(a),Math.cos(a)))<=(s.angle||45)*Math.PI/360:forward>=0&&side<=s.width*METER/2;}
// Weapon-relative pressure: a newly forged lance briefly outclasses enemies,
// then opponents adapt as waves are beaten with that lance. Tier changes reset
// only the pressure clock; current wave, gold, defenses and campaign persist.
// Hidden tuning values are intentionally omitted from the player-facing UI.
function tierAge(){return Math.max(0,profile.wave-profile.tierStartWave)}
function enemyVitality(){
 const tier=profile.weapon,age=tierAge(),power=weaponFactor(tier);
 // The beginner's opening wave remains familiar and manageable.
 const base=24*power*(tier===0?1:.65);
 const pressure=1+.24*age+.028*age*age;
 return Math.max(24,Math.round(base*pressure));
}
function enemySpeed(){return Math.min(76,41+Math.min(profile.weapon,4)*3+tierAge()*1.8)}
function enemyCount(){return Math.min(19,7+2*Math.min(6,tierAge())+profile.weapon)}
function advance(dt){if(!running||uiPaused||manualPause)return;clock+=dt;const count=enemyCount(); if(spawned<count&&clock>spawned*.75){const hp=enemyVitality();enemies.push({x:PATH[0][0],y:PATH[0][1],segment:0,routeIndex:ROUTES.length===1?0:spawned%ROUTES.length,hp,max:hp,speed:enemySpeed(),heavyStander:profile.weapon>0&&(spawned%4===0)});spawned++}
 for(const e of enemies){let remaining=e.speed*dt;const route=ROUTES[e.routeIndex]||PATH;while(remaining>0&&e.segment<route.length-1){const [tx,ty]=route[e.segment+1],d=Math.hypot(tx-e.x,ty-e.y);if(d<=remaining){e.x=tx;e.y=ty;remaining-=d;e.segment++}else{e.x+=(tx-e.x)/d*remaining;e.y+=(ty-e.y)/d*remaining;remaining=0}}if(e.segment>=route.length-1){e.hp=-999;profile.life=Math.max(0,profile.life-1)}}
 // Each circuit link advances after one second, even if unavailable.
 profile.combatTime+=dt;
 if(profile.autoCircuit&&profile.combatTime>=(profile.nextActionAt||0)&&profile.rotation.length){
  const id=profile.rotation[profile.rotationCursor%profile.rotation.length];fireGroup(id);
  profile.rotationCursor=(profile.rotationCursor+1)%profile.rotation.length;refreshRotation();
  profile.nextActionAt=profile.combatTime+1;
  updatePatrol();
 }
 const killedEnemies=enemies.filter(e=>e.hp<=0&&e.hp!==-999);if(killedEnemies.length){for(const enemy of killedEnemies)dropPatrolLoot(enemy);persist();updatePatrol()}enemies=enemies.filter(e=>e.hp>0);fx=fx.filter(x=>(x.life-=dt*2)>0);if((spawned===count&&!enemies.length)||profile.life<=0){running=false;waveActive=false;if(profile.life>0){profile.gold+=waveClearGold();window.MIDIR_SPECIAL_UPGRADE?.wave?.(profile.weapon);refreshEconomy()}profile.best=Math.max(profile.best,profile.wave);persist();note=profile.life<=0?'Campaign finished. Use New campaign to retry.':'Wave cleared! Earn gold and build more towers.';updateStats()}}
function updateTutorial(){const panel=document.querySelector('#evtd-tutorial'),start=document.querySelector('[data-evtd="start"]');if(start){start.disabled=profile.wave===0&&profile.tutorialStage<4;start.title=start.disabled?'Complete the highlighted first-wave tour to begin.':''}if(!panel)return;panel.hidden=profile.tutorialStage>=4;if(panel.hidden)return;const stages=[
 ['Move along the loot track','Press <b>A</b> or <b>D</b> to move the glowing green patrol marker to an adjacent path tile. Enemy gold and materials stay on the track until your marker reaches them. Empty tiles still count as movement.','Use A or D to try it',false],
 ['Confirm loot collection','You moved the green marker! During combat, use <b>A</b> and <b>D</b> to collect dropped gold and materials. This movement also resets Relentless Thrust to its double-jab attack.','I understand — next',true],
 ['Visit your Home Base','Find the glowing <b>⌂ BASE</b> on the battlefield and click it to open the Base Manager. You can also use the <b>Base manager</b> button.','Open the highlighted Base Manager',false],
 ['Understand the Base Manager','The Base Manager lets you drag <b>skills from towers you own</b> into a linked rotation. You can repeat a skill in the circuit, enable or disable automation, and drag skill icons onto the <b>1–= hotbar</b> for manual casting.','I understand — start playing',true]
 ];const [title,body,action,confirm]=stages[profile.tutorialStage];panel.innerHTML=`<div class="evtd-tutorial-character" aria-hidden="true">🧙</div><div class="evtd-tutorial-dialogue"><div class="evtd-tutorial-title"><strong>Field Guide · ${profile.tutorialStage+1}/4 · ${title}</strong><span>Required before Wave 1</span></div><p>${body}</p></div><button type="button" data-evtd-tutorial-confirm ${confirm?'':'disabled'}>${action}</button>`;document.querySelectorAll('[data-evtd="open-base"]').forEach(b=>b.classList.toggle('evtd-tour-nudge',profile.tutorialStage===2));}
function updateStats(){updateHotbar();updateTutorial();const baseS=document.querySelector('#evtd-base-shells');if(baseS)baseS.textContent=Math.round(profile.shells)+'/100';const baseP=document.querySelector('#evtd-base-pressure');if(baseP)baseP.textContent=Math.round(profile.pressure)+'%';const ic=document.querySelector('#evtd-inventory-count');if(ic)ic.textContent=profile.inventory.length;const next=document.querySelector('#evtd-next-page');if(next)next.classList.toggle('evtd-page-nudge',!!profile.towers.length&&!profile.shopVisitedOther&&shopPage==='towers');const starter=document.querySelector('[data-evtd-drag-skill="thrust"]');if(starter){const show=!profile.towers.length&&!profile.inventory.length;starter.classList.toggle('evtd-first-tower',show);const cta=starter.querySelector('.evtd-buy-now');if(cta)cta.hidden=!show;}for(const [id,val] of [['gold',profile.gold],['tickets',profile.tickets],['life',profile.life],['wave',profile.wave]]){const el=document.querySelector('#evtd-'+id);if(el)el.textContent=val}const shells=document.querySelector('#evtd-shells');if(shells)shells.textContent=Math.round(profile.shells)+' / 100';const shellFill=document.querySelector('#evtd-shell-fill');if(shellFill)shellFill.style.width=Math.max(0,Math.min(100,profile.shells))+'%';const bullet=document.querySelector('#evtd-bullet-icon');if(bullet)bullet.style.opacity=String(.25+.75*Math.max(0,Math.min(100,profile.shells))/100);const pressure=document.querySelector('#evtd-pressure');if(pressure)pressure.textContent=Math.round(profile.pressure)+'%';const pressureFill=document.querySelector('#evtd-pressure-fill');if(pressureFill)pressureFill.style.width=Math.max(0,Math.min(100,profile.pressure))+'%';const cooldown=document.querySelector('#evtd-reload-status');if(cooldown)cooldown.textContent=profile.combatTime<profile.reloadReadyAt?'Ready in '+Math.ceil(profile.reloadReadyAt-profile.combatTime)+'s':'Ready';const reloadButton=document.querySelector('#evtd-reload');if(reloadButton)reloadButton.disabled=profile.combatTime<profile.reloadReadyAt;for(const el of document.querySelectorAll('[data-evtd-cd]')){const remain=cooldownRemaining(el.dataset.evtdCd);el.textContent=remain>0?remain.toFixed(1)+'s':'Ready'}for(const el of document.querySelectorAll('[data-evtd-icon-cd]')){const remain=cooldownRemaining(el.dataset.evtdIconCd);el.classList.toggle('evtd-manager-cooling',remain>0);const counter=el.querySelector('.evtd-manager-cd');if(counter){counter.hidden=remain<=0;counter.textContent=remain>0?remain.toFixed(1):''}}const el=document.querySelector('#evtd-note');if(el)el.textContent=note;const sell=document.querySelector('#evtd-sell');if(sell){const t=selectedTower();sell.disabled=!t;sell.textContent=t?'Sell '+byId(t.id).name+' (refund '+(t.paidWith==='ticket'?'1 ticket':(Number.isFinite(t.paidGold)?t.paidGold:byId(t.id).cost)+' gold')+')':'Sell selected tower';}}
function frame(t){if(!document.querySelector('#evtd-board')){running=false;raf=0;return}const dt=Math.min(.05,Math.max(0,(t-last)/1000));last=t;advance(dt);updateHotbar();draw();raf=requestAnimationFrame(frame)}
function bind(){
 const canvas=document.querySelector('#evtd-board');if(!canvas)return;
 // Progressive EV-only help: basic description after a short hover; numerical mechanics at 8 seconds.
 // Remove native title attributes because browser tooltips would expose technical values immediately.
 const root=document.querySelector('.evtd');
 const tooltip=document.createElement('div');tooltip.className='evtd-progressive-tip';tooltip.setAttribute('role','tooltip');tooltip.hidden=true;root.appendChild(tooltip);
 let tipBasicTimer=0,tipDetailedTimer=0,tipTarget=null;
 const escapeTip=v=>String(v).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const descriptions={thrust:'Lock onto an enemy and deliver rapid thrusts. Moving changes the next attack variant.',charge:'A charging projectile that travels through enemies toward a distant target.',burst:'Focus a powerful attack on the nearest enemy and strike behind it.',drill:'A close-range attack that pushes enemies backward and builds heat with rapid use.',glory:'A wide line attack that can restore Mana Shells.',arc:'A directional strike that can damage several enemies in a row.',zone:'A broad area attack hitting enemies around the tower.',leap:'A short-range cone attack.',impact:'A short directional utility attack.'};
 const skillInfo=id=>{const b=byId(id);if(!b)return null;const x=stats(b);const width=(id==='thrust'?'Double jab 0.5m; single thrust 1m':x.width!=null?x.width.toFixed(1)+'m':'Area of effect');let extra='';if(id==='charge')extra='Targets furthest eligible enemy; minimum target distance 2m unless removed by an upgrade. Distance damage increases up to 14m; Spirit upgrade grants a 7m scaling floor; impact splash radius 0.25m.';if(id==='thrust')extra='Two-jab variant 1000% and 1500% coefficients (40% and 60% of this prototype’s total attack damage). Single follow-up uses a wider hitbox. Each successful jab restores 15 shells once per jab; activation consumes 5 shells before reductions.';if(id==='drill')extra='A 1-second minimum interval between activations, with recoverable heat and a 9-second overheat lockout after rapid consecutive uses.';if(id==='arc')extra='Up to three targets in a line; Arcana Link VIII improves the width.';if(id==='burst')extra='Selects the nearest enemy within range, then strikes up to 3m behind that target.';if(id==='glory')extra='Restores 15 Mana Shells on activation in the current prototype.';return {basic:descriptions[id]||b.desc,details:[`Range: ${x.range.toFixed(1)}m`,`Attack width: ${width}`,`Base damage: ${b.damage} (prototype units)`, x.cd>0?`Cooldown: ${x.cd.toFixed(1)}s`:'Cooldown: skill-specific or rapid activation',extra].filter(Boolean)}};
 const tipContent=el=>{const id=el.dataset.evtdSkillTip;if(id)return skillInfo(id);const old=el.dataset.evtdOriginalTitle||'';if(!old)return null;let basic=old.split(/[.;]/)[0].trim();if(el.closest('.evtd-link-upgrade'))basic='Arcana Link improves your shared EV combat capabilities.';return {basic,details:old.split(/; /).filter(Boolean)}};
 const showTip=(detailed)=>{if(!tipTarget||!tipTarget.isConnected)return;const info=tipContent(tipTarget);if(!info)return;tooltip.innerHTML='<strong>'+escapeTip(tipTarget.dataset.evtdSkillTip?byId(tipTarget.dataset.evtdSkillTip).name:'Details')+'</strong><p>'+escapeTip(info.basic)+'</p>'+(detailed?'<div class="evtd-tip-expanded"><small>Extended details</small><ol>'+info.details.map(line=>'<li>'+escapeTip(line)+'</li>').join('')+'</ol></div>':'<small>Keep hovering for extended details…</small>');tooltip.hidden=false;const bounds=tipTarget.getBoundingClientRect();const x=Math.max(10,Math.min(window.innerWidth-340,bounds.left));const y=bounds.bottom+10;tooltip.style.left=x+'px';tooltip.style.top=(y+Math.min(320,tooltip.offsetHeight)>window.innerHeight?Math.max(10,bounds.top-tooltip.offsetHeight-8):y)+'px'};
 const clearTip=()=>{clearTimeout(tipBasicTimer);clearTimeout(tipDetailedTimer);tipTarget=null;tooltip.hidden=true};
 const attachTipTitles=()=>{root.querySelectorAll('[title]').forEach(el=>{el.dataset.evtdOriginalTitle=el.getAttribute('title');el.removeAttribute('title')})};
 attachTipTitles();
 root.addEventListener('pointerover',e=>{const el=e.target.closest('[data-evtd-skill-tip],[data-evtd-original-title]');if(el===tipTarget)return;clearTip();if(!el||!root.contains(el))return;tipTarget=el;tipBasicTimer=setTimeout(()=>showTip(false),1200);tipDetailedTimer=setTimeout(()=>showTip(true),8000)});
 root.addEventListener('pointerout',e=>{if(tipTarget&&!tipTarget.contains(e.relatedTarget)&&tipTarget.contains(e.target))clearTip()});
 root.addEventListener('focusin',e=>{const el=e.target.closest('[data-evtd-skill-tip],[data-evtd-original-title]');if(!el)return;clearTip();tipTarget=el;tipBasicTimer=setTimeout(()=>showTip(false),1200);tipDetailedTimer=setTimeout(()=>showTip(true),8000)});
 root.addEventListener('focusout',clearTip);
 root.addEventListener('click',()=>{clearTip();setTimeout(attachTipTitles,0)});

 refreshMapUI();
 cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(frame);
 const coords=e=>{const r=canvas.getBoundingClientRect();return {x:((e.clientX-r.left)*W/r.width-cameraX)/zoom,y:((e.clientY-r.top)*H/r.height-cameraY)/zoom}};
 canvas.addEventListener('wheel',e=>{if(drawer)return;e.preventDefault();const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;setZoom(zoom+(e.deltaY<0?.2:-.2),x,y)},{passive:false});
 const buyInventory=(id)=>{const skill=byId(id);if(!skill)return false;const payment=profile.payment;if(payment==='ticket'){if(profile.tickets<1){note='No tickets remaining.';return false}profile.tickets--}else{if(profile.gold<skill.cost){note='Not enough gold for '+skill.name+'.';return false}profile.gold-=skill.cost}profile.inventory.push({id,paidWith:payment,paidGold:payment==='gold'?skill.cost:0});note=skill.name+' purchased. Drag it from inventory onto the map.';persist();renderInventory();updateStats();return true};
 const placePurchased=(item,x,y)=>{if(!canPlace(x,y)){note='Choose an empty area off the road, away from other towers and the base.';updateStats();return false}const idx=profile.inventory.indexOf(item);if(idx<0)return false;profile.inventory.splice(idx,1);const t={id:item.id,x,y,angle:0,cool:0,paidWith:item.paidWith,paidGold:item.paidGold};profile.towers.push(t);hover=t;note=byId(t.id).name+' placed. Click the base to link it into your rotation.';persist();refreshRotation();renderInventory();updateStats();return true};
 const renderInventory=()=>{const el=document.querySelector('#evtd-inventory-items');if(!el)return;el.innerHTML=profile.inventory.length?profile.inventory.map((it,i)=>`<div class="evtd-inventory-tower" draggable="true" data-evtd-inventory-index="${i}"><span>${byId(it.id)?.name||it.id} <small>(${it.paidWith})</small></span><button data-evtd-refund="${i}" title="Refund unplaced tower">Refund</button></div>`).join(''):'<p class="hint">Inventory empty. Buy towers in the shop.</p>'};
 const setPanel=(panel)=>{drawer=panel;uiPaused=!!panel;const el=document.querySelector('#evtd-drawer');el.hidden=!panel;['shop','inventory','base'].forEach(type=>{const child=document.querySelector('#evtd-'+type+'-panel');if(child)child.hidden=panel!==type});const title=document.querySelector('#evtd-drawer-title');if(title)title.textContent=panel==='shop'?'Shop':panel==='inventory'?'Inventory':'Home Base · Rotation Manager';if(panel==='inventory')renderInventory();if(panel==='shop')setShopPage(shopPage);if(panel==='base'){if(profile.tutorialStage===2){profile.tutorialStage=3;persist()}refreshRotation();}const pause=document.querySelector('#evtd-pause');if(pause)pause.textContent=uiPaused?'Paused · panel open':manualPause?'Resume':'Pause';updateStats()};
 const setShopPage=(page)=>{shopPage=page;if(page!=='towers')profile.shopVisitedOther=true;document.querySelectorAll('[data-evtd-section]').forEach(el=>el.hidden=el.dataset.evtdSection!==page);document.querySelectorAll('[data-evtd-page]').forEach(el=>el.classList.toggle('active',el.dataset.evtdPage===page));persist();updateStats()};
 const isBase=(x,y)=>{const b=basePoint();return Math.hypot(x-b.x,y-b.y)<=26};
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0||drawer)return;const p=coords(e);mouse=p;const t=towerAt(p.x,p.y);if(t){hover=t;drag={tower:t,fromX:t.x,fromY:t.y,startedX:p.x,startedY:p.y,moved:false};canvas.setPointerCapture(e.pointerId);updateStats()}});
 canvas.addEventListener('pointermove',e=>{const p=coords(e);mouse=p;if(!drag)return;if(Math.hypot(p.x-drag.startedX,p.y-drag.startedY)>5)drag.moved=true;if(drag.moved){drag.tower.x=p.x;drag.tower.y=p.y;draw()}});
 canvas.addEventListener('pointerup',e=>{const p=coords(e);mouse=p;if(drag){const d=drag;drag=null;if(d.moved){if(canPlace(p.x,p.y,d.tower)){d.tower.x=p.x;d.tower.y=p.y;note='Tower moved freely.'}else{d.tower.x=d.fromX;d.tower.y=d.fromY;note='Cannot place on the road or another object.'}persist();updateStats()}return}if(drawer)return;if(isBase(p.x,p.y)){setPanel('base');return}const t=towerAt(p.x,p.y);if(t){hover=t;updateStats();return}note='Open Shop to drag-buy a tower or Inventory to place a purchased tower.';updateStats()});
 canvas.addEventListener('dragover',e=>{if(!e.dataTransfer?.types.includes('text/plain'))return;e.preventDefault();e.dataTransfer.dropEffect='copy'});
 canvas.addEventListener('drop',e=>{e.preventDefault();const p=coords(e);let payload;try{payload=JSON.parse(e.dataTransfer.getData('text/plain'))}catch{return}if(!payload||!byId(payload.id))return;if(payload.origin==='inventory'){const item=profile.inventory[payload.index];if(item&&item.id===payload.id)placePurchased(item,p.x,p.y)}else if(payload.origin==='shop'){if(!canPlace(p.x,p.y)){note='Cannot place there; no purchase made.';updateStats();return}if(buyInventory(payload.id))placePurchased(profile.inventory[profile.inventory.length-1],p.x,p.y)} });
 root.addEventListener('dragstart',e=>{const manager=e.target.closest('[data-evtd-manager-skill],[data-evtd-sequence]');if(manager){const id=manager.dataset.evtdManagerSkill||profile.rotation[Number(manager.dataset.evtdSequence)];if(id){e.dataTransfer.setData('application/x-evtd-skill',id);return}}const item=e.target.closest('[data-evtd-drag-skill],[data-evtd-inventory-index]');if(!item)return;const isStock=item.hasAttribute('data-evtd-drag-skill');const index=Number(item.dataset.evtdInventoryIndex);const id=isStock?item.dataset.evtdDragSkill:profile.inventory[index]?.id;if(!id)return;e.dataTransfer.setData('text/plain',JSON.stringify({origin:isStock?'shop':'inventory',index,id}));e.dataTransfer.effectAllowed='copy'});
 root.addEventListener('click',e=>{const buy=e.target.closest('[data-evtd-buy]');if(buy){buyInventory(buy.dataset.evtdBuy);return}const refund=e.target.closest('[data-evtd-refund]');if(refund){const i=Number(refund.dataset.evtdRefund),item=profile.inventory[i];if(!item)return;profile.inventory.splice(i,1);if(item.paidWith==='ticket')profile.tickets++;else profile.gold+=item.paidGold||byIdSafeCost(item.id);persist();renderInventory();updateStats();return}const page=e.target.closest('[data-evtd-page]');if(page){setShopPage(page.dataset.evtdPage);return}});
 canvas.addEventListener('pointercancel',()=>{if(drag){drag.tower.x=drag.fromX;drag.tower.y=drag.fromY;drag=null;draw()}});
 canvas.addEventListener('contextmenu',e=>{e.preventDefault();const p=coords(e);hover=towerAt(p.x,p.y)||selectedTower();rotateSelected(Math.PI/4)});
 canvas.addEventListener('keydown',e=>{if(['q','Q','ArrowLeft','e','E','ArrowRight'].includes(e.key)){e.preventDefault();rotateSelected(['q','Q','ArrowLeft'].includes(e.key)?-Math.PI/4:Math.PI/4)}});
 document.querySelectorAll('[name="evtd-payment"]').forEach(b=>b.addEventListener('change',()=>{if(b.checked){profile.payment=b.value;persist();note='Next tower will be purchased with '+(profile.payment==='ticket'?'a ticket':'gold')+'.';updateStats()}}));
 document.querySelectorAll('[data-evtd-skill]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.evtdSkill;document.querySelectorAll('[data-evtd-skill]').forEach(x=>x.classList.toggle('chosen',x===b));note='Drag this tower onto the battlefield to purchase and place, or use Buy to store it in inventory.';updateStats()}));
 document.querySelectorAll('[data-evtd-gear]').forEach(el=>el.addEventListener('change',()=>{const k=el.dataset.evtdGear;if(k==='hat'){const n=Number(el.value),cost=n>profile.hat?Array.from({length:n-profile.hat},(_,i)=>profile.hat+i+1).reduce((a,l)=>a+(l>5?140:40),0):0;if(profile.gold<cost){el.value=profile.hat;note='Not enough gold for that hat.'}else{profile.gold-=cost;profile.hat=n;note='Hat upgrade equipped.'}}else{const cost=150;if(el.checked&&!profile[k]&&profile.gold<cost){el.checked=false;note='Not enough gold.'}else{if(el.checked&&!profile[k])profile.gold-=cost;profile[k]=el.checked}}persist();updateStats()}));
 // Rotation-Crafter-style drag source and insertion between repeated links.
 const hotbar=document.querySelector('#evtd-hotbar');if(hotbar){hotbar.addEventListener('dragover',e=>{if(e.target.closest('[data-evtd-hotbar-slot]'))e.preventDefault()});hotbar.addEventListener('drop',e=>{const slot=e.target.closest('[data-evtd-hotbar-slot]');if(!slot)return;e.preventDefault();let id=e.dataTransfer.getData('application/x-evtd-skill');if(!id){try{const p=JSON.parse(e.dataTransfer.getData('text/plain'));id=p.id||profile.rotation[p.index]}catch{}}if(!ownedManagerIds().includes(id))return;profile.hotbar[Number(slot.dataset.evtdHotbarSlot)]=id;persist();renderHotbar();note=byId(id).name+' assigned to '+HOTKEYS[Number(slot.dataset.evtdHotbarSlot)]+'.';updateStats()});hotbar.addEventListener('click',e=>{const slot=e.target.closest('[data-evtd-hotbar-slot]');if(!slot)return;const id=profile.hotbar[Number(slot.dataset.evtdHotbarSlot)];if(id)castManual(id);else{note='Open the Base Manager and drag an owned skill to this hotbar slot.';updateStats()}});hotbar.addEventListener('contextmenu',e=>{const slot=e.target.closest('[data-evtd-hotbar-slot]');if(!slot)return;e.preventDefault();profile.hotbar[Number(slot.dataset.evtdHotbarSlot)]=null;persist();renderHotbar()})}
 root.addEventListener('click',e=>{const b=e.target.closest('[data-evtd-tutorial-confirm]');if(!b||b.disabled)return;if(profile.tutorialStage===1||profile.tutorialStage===3){profile.tutorialStage++;persist();updateStats();if(profile.tutorialStage===4){note='Tour complete. Start Wave 1 when ready.';updateStats()}}});
 const basePanel=document.querySelector('#evtd-base-panel');
 if(basePanel){basePanel.addEventListener('dragstart',e=>{const tile=e.target.closest('[data-evtd-manager-skill]'),link=e.target.closest('[data-evtd-sequence]');if(!tile&&!link)return;const payload=tile?{type:'manager',id:tile.dataset.evtdManagerSkill}:{type:'link',index:Number(link.dataset.evtdSequence)};e.dataTransfer.setData('text/plain',JSON.stringify(payload));e.dataTransfer.effectAllowed=tile?'copy':'move'});
 const circuit=document.querySelector('#evtd-rotation-list');circuit.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';const row=e.target.closest('[data-evtd-sequence]');circuit.querySelectorAll('.evtd-drop-before').forEach(x=>x.classList.remove('evtd-drop-before'));if(row)row.classList.add('evtd-drop-before')});circuit.addEventListener('dragleave',e=>{if(!circuit.contains(e.relatedTarget))circuit.querySelectorAll('.evtd-drop-before').forEach(x=>x.classList.remove('evtd-drop-before'))});circuit.addEventListener('drop',e=>{e.preventDefault();let payload;try{payload=JSON.parse(e.dataTransfer.getData('text/plain'))}catch{return}const row=e.target.closest('[data-evtd-sequence]');let at=row?Number(row.dataset.evtdSequence):profile.rotation.length;if(payload.type==='manager'){if(!ownedManagerIds().includes(payload.id))return;profile.rotation.splice(at,0,payload.id)}else if(payload.type==='link'){const from=payload.index;if(!Number.isInteger(from)||from<0||from>=profile.rotation.length)return;const [id]=profile.rotation.splice(from,1);if(from<at)at--;profile.rotation.splice(at,0,id)}else return;profile.rotationCursor=0;persist();refreshRotation()});}
 document.querySelector('.evtd')?.addEventListener('click',e=>{
  const manager=e.target.closest('[data-evtd-manager-skill]');if(manager){if(ownedManagerIds().includes(manager.dataset.evtdManagerSkill)){profile.rotation.push(manager.dataset.evtdManagerSkill);persist();refreshRotation()}return}
  const manual=e.target.closest('[data-evtd-manual]');if(manual){note=fireGroup(manual.dataset.evtdManual)?'Manual '+byId(manual.dataset.evtdManual).name+' activated.':'Skill unavailable: target, shells, or cooldown.';persist();refreshRotation();updateStats();return}
  const remove=e.target.closest('[data-evtd-remove]');if(remove){if(profile.rotation.length>0){profile.rotation.splice(Number(remove.dataset.evtdRemove),1);profile.rotationCursor=0;persist();refreshRotation()}return}
  const order=e.target.closest('[data-evtd-link]');if(order){const i=Number(order.dataset.evtdLink);const j=i+(order.dataset.direction==='up'?-1:1);if(i>=0&&j>=0&&j<profile.rotation.length){[profile.rotation[i],profile.rotation[j]]=[profile.rotation[j],profile.rotation[i]];persist();refreshRotation()}return}

  const sell=e.target.closest('[data-evtd-material]');if(sell){const id=sell.dataset.evtdMaterial;if(!MATERIALS[id]||!(profile.materials[id]>0))return;profile.materials[id]--;profile.gold+=MATERIALS[id].value;note='Sold '+MATERIALS[id].name+' for gold.';persist();refreshEconomy();updateStats();return}
  const action=e.target.closest('[data-evtd-weapon-action]');if(!action)return;
  if(action.dataset.evtdWeaponAction==='special'){const spec=SPECIALS[profile.weapon];if(!spec||profile.weaponUpgrades[profile.weapon])return;if(profile.gold<spec.cost){note='Not enough gold for this weapon upgrade.';updateStats();return}profile.gold-=spec.cost;profile.weaponUpgrades[profile.weapon]=true;note=spec.name+' applied to all towers.';}
  else if(action.dataset.evtdWeaponAction==='soul-second'){if(profile.weapon!==4||!profile.weaponUpgrades[4]||profile.weaponUpgrades.soulSecond)return;if(profile.gold<SOUL_SECOND.cost){note='Not enough gold for this weapon upgrade.';updateStats();return}profile.gold-=SOUL_SECOND.cost;profile.weaponUpgrades.soulSecond=true;note='Soul Liberator unique enhancement applied.';}
  else if(action.dataset.evtdWeaponAction==='buy'){const tier=profile.weapon+1;if(tier>=WEAPONS.length)return;const cost=weaponCost(tier);if(profile.gold<cost){note='Not enough gold to forge this weapon.';updateStats();return}profile.gold-=cost;for(const x of materialUnits(tier))profile.materials[x.id]=x.owned-Math.min(x.owned,x.needed);profile.weapon=tier;profile.tierStartWave=profile.wave+1;note='Forged '+WEAPONS[tier].name+'. All towers are stronger.';}
  persist();refreshEconomy();updateStats();
 });
 window.MIDIR_EV_PATROL_ABORT?.abort();window.MIDIR_EV_PATROL_ABORT=new AbortController();
 window.addEventListener('keydown',ev=>{if(!document.querySelector('#evtd-board')||ev.repeat||ev.altKey||ev.ctrlKey||ev.metaKey)return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)||document.activeElement?.isContentEditable)return;if(HOTKEYS.includes(ev.key)){ev.preventDefault();const id=profile.hotbar[HOTKEYS.indexOf(ev.key)];if(id)castManual(id);return}if(ev.key.toLowerCase()==='a'||ev.key.toLowerCase()==='d'){ev.preventDefault();collectPatrol(ev.key.toLowerCase()==='d'?1:-1)}} ,{signal:window.MIDIR_EV_PATROL_ABORT.signal});
 document.querySelector('#evtd-auto-circuit')?.addEventListener('change',e=>{profile.autoCircuit=e.target.checked;profile.nextActionAt=profile.combatTime+1;persist();updateStats()});
 document.querySelectorAll('[data-evtd]').forEach(el=>el.addEventListener('click',()=>{const cmd=el.dataset.evtd;if(cmd==='zoom-in'||cmd==='zoom-out'||cmd==='zoom-reset'){if(cmd==='zoom-reset'){zoom=1;cameraX=0;cameraY=0;setZoom(1)}else setZoom(zoom+(cmd==='zoom-in'?.25:-.25));return}if(cmd==='sell'){const t=selectedTower();if(!t){note='Choose a placed tower to sell.';updateStats();return}if(t.paidWith==='ticket'){profile.tickets++;note='Sold '+byId(t.id).name+'; refunded one ticket.';}else{const refund=Number.isFinite(t.paidGold)?t.paidGold:byId(t.id).cost;profile.gold+=refund;note='Sold '+byId(t.id).name+'; refunded '+refund+' gold.';}profile.towers.splice(profile.towers.indexOf(t),1);hover=null;persist();refreshRotation();updateStats();return}
 if(cmd==='add-link'){const id=document.querySelector('#evtd-link-skill')?.value;if(id&&ownedManagerIds().includes(id)){profile.rotation.push(id);persist();refreshRotation()}return}if(cmd==='reset-links'){profile.rotation=[];profile.rotationCursor=0;persist();refreshRotation();return}if(cmd==='prev-map'||cmd==='next-map'){const i=MAPS.findIndex(x=>x.id===profile.mapId);changeMap(MAPS[(i+(cmd==='next-map'?1:MAPS.length-1))%MAPS.length].id);return}if(cmd==='open-shop'){setPanel('shop');return}if(cmd==='open-inventory'){setPanel('inventory');return}if(cmd==='open-base'){setPanel('base');return}if(cmd==='close-drawer'){setPanel(null);return}if(cmd==='next-shop-page'){setShopPage(shopPage==='towers'?'upgrades':shopPage==='upgrades'?'weapons':'towers');return}if(cmd==='map-reroll'){changeMap('random',true);return}if(cmd==='patrol-back'||cmd==='patrol-next'){collectPatrol(cmd==='patrol-next'?1:-1);return}if(cmd==='reload'){note=reload();updateStats();return}if(cmd==='link-up'){const next=profile.linkLevel+1;if(next<=10){const cost=linkCost(next);if(profile.gold>=cost){profile.gold-=cost;profile.linkLevel=next;profile.link=next>=9;persist();note='Arcana Link increased to Level '+next+'.';document.querySelector('.evtd-link-upgrade')?.replaceWith(document.createRange().createContextualFragment(`<div class="evtd-link-upgrade" title="${linkTooltip(next)}"><strong>Arcana Link Increase · Level ${next} / X</strong><small>Improve shared EV combat effects. Hold to inspect current bonuses.</small><button data-evtd="link-up" ${next===10?'disabled':''} title="${next<10?linkTooltip(next+1):'Maximum link level'}">${next<10?`Increase to Level ${next+1} · ◈ ${linkCost(next+1)}`:'Maximum link level'}</button></div>`));}else note='Not enough gold for Arcana Link.'}updateStats();return}if(cmd==='rotate-left'||cmd==='rotate-right'){rotateSelected(cmd==='rotate-left'?-Math.PI/4:Math.PI/4);return}if(cmd==='reset'){if(!confirm('Reset this EV tower-defense campaign and all purchased upgrades?'))return;profile=seed();enemies=[];running=false;waveActive=false;hover=null;persist();location.reload();return}if(cmd==='start'){if(profile.wave===0&&profile.tutorialStage<4){note='Complete the first-wave tour before starting.';}else if(uiPaused){note='Close the open panel before starting the wave.';}else if(profile.life<=0){note='Start a new campaign first.'}else if(!running){profile.wave++;spawned=0;clock=0;enemies=[];running=true;waveActive=true;profile.nextActionAt=profile.combatTime;persist();note='Wave '+profile.wave+' in progress.'}}if(cmd==='pause'){manualPause=!manualPause;note=manualPause?'Paused.':'Resumed.';const p=document.querySelector('#evtd-pause');if(p)p.textContent=manualPause?'Resume':'Pause'}if(cmd==='clear'){fx=[];note='Visual effects cleared.'}if(cmd==='range'||cmd==='damage'){const k=cmd==='range'?'rangeBonus':'damageBonus',cost=(cmd==='range'?60:65)+profile[k]*(cmd==='range'?50:55);if(profile.gold>=cost){profile.gold-=cost;profile[k]++;persist();note='Upgrade purchased.'}else note='Not enough gold.'}updateStats()}));updateStats();updatePatrol()
}
window.MIDIR_EV_DEFENSE={view,bind,grantTickets(n){profile.tickets+=Math.max(0,Math.floor(Number(n)||0));persist();updateStats();},exportState:()=>JSON.parse(JSON.stringify(profile)),importState:data=>{if(!data||typeof data!=='object'||Array.isArray(data)||!Array.isArray(data.towers)||data.towers.length>500||JSON.stringify(data).length>2000000)throw Error('Invalid EV Tower Lab save data');profile={...seed(),...data};persist();}};
})();
