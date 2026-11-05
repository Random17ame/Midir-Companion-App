/* Companion 225 — per-skill use-recognition rules.
 * DEFAULT: 0s cooldown, 1 positive hit per use. Explicit overrides below can
 * be refined as controlled captures establish exact skill behaviors.
 * Internal evidence origin is retained for testing, but presented to players
 * as one unified Skill Uses list.
 */
window.MIDIR_SKILL_USES=(()=>{
 'use strict';
 const DEFAULT={cooldown:0,maxHits:1,hitWindow:2,actionWindow:.30};
 // Identified from Rixi's 0x6988-labeled uses in vsekaitest.html and prior
 // documented Midir mechanics. Multi-target hits may vary with party size.
 const RULES={
  '21001':{maxHits:2,hitWindow:1},'21002':{maxHits:2},'22011':{maxHits:3,hitWindow:2},
  '24202':{maxHits:3,hitWindow:2},'26002':{maxHits:3,hitWindow:2},
  '26005':{maxHits:14,hitWindow:4,actionWindow:1.3},
  '26007':{maxHits:5,hitWindow:8,actionWindow:1.7},
  '27004':{maxHits:6,hitWindow:3},'27201':{maxHits:16,hitWindow:3,actionWindow:1.25},
  '30102':{maxHits:35,hitWindow:3.5,actionWindow:2.1},
  '35008':{maxHits:8,hitWindow:4,actionWindow:3},
  '46003':{maxHits:8,hitWindow:3},
  '59004':{cooldown:60,maxHits:100,hitWindow:20,actionWindow:18},
  '59060':{cooldown:6,maxHits:27,hitWindow:3,actionWindow:2},
  '59061':{cooldown:10,maxHits:8,hitWindow:3,actionWindow:2},
  '59063':{cooldown:24,maxHits:24,hitWindow:23,actionWindow:22},
  '59064':{cooldown:36,maxHits:6,hitWindow:3,actionWindow:1},
  '59041':{cooldown:15,maxHits:45,hitWindow:16,actionWindow:15},
  '59009':{maxHits:7,hitWindow:4,actionWindow:3},
  '54307':{maxHits:3,hitWindow:2},
  '59001':{cooldown:3,maxHits:20,hitWindow:3,actionWindow:2},
  '35014':{maxHits:30,hitWindow:2,actionWindow:1.2},
  '27204':{maxHits:12,hitWindow:2,actionWindow:1},
  '24202':{maxHits:3,hitWindow:2,actionWindow:2},
  '27203':{maxHits:45,hitWindow:3,actionWindow:2},
  '59145':{maxHits:8,hitWindow:.8,actionWindow:.7},
  '59144':{maxHits:12,hitWindow:2,actionWindow:1},
  // Typed / characteristic effect markers that work without positive damage.
  '27009':{signature:'anchor',hitWindow:1},
  '35010':{signature:'rain',cooldown:48},
  '35024':{signature:'hydra',cooldown:8.3},
  '26006':{signature:'smokescreen'},
  '27205':{signature:'starlight',maxHits:20,hitWindow:3,actionWindow:2},
  '27206':{signature:'gravity',maxHits:20,hitWindow:4,actionWindow:3},
  '30482':{signature:'inspiration'},
  '59005':{signature:'pall',cooldown:180},
  '59006':{signature:'blessing',cooldown:120},
  '59002':{signature:'vitality',cooldown:240},
  '30008':{signature:'partyhealing'},
  '10009':{signature:'firstaid'},
  '53002':{signature:'encore'},
  // Derived from existing Companion Arcana minimum-cooldown references.
  '59000':{cooldown:3},'59001':{cooldown:3},'59143':{cooldown:42}
 };
 const NAMES={27009:'Anchor Rush',35010:'Rain Casting',35024:'Hydra Transmutation',26006:'Smokescreen',27205:'Starlight Veil',27206:'Gravity Well',30482:'Inspiration',59005:'Pall of Ruination',59006:'Blessing of Protection',59002:'Voice of Vitality',30008:'Party Healing',10009:'First Aid',53002:'Encore',59000:'Hand of Restoration',59001:'Echoes of Salvation',59004:'Pulse of Purification',59009:'Resonant Litany',59041:'Thunderblight',59060:'Ignis Plume',59061:'Aqua Volley',59063:'Terra Scourge',59064:'Tri-Assault',30102:'Thunder'};
 const NAME_COOLDOWNS={
  'urgent shot':6,'crash shot':3.75,'support shot':6,'magnum shot':0,
  'mirage missile':1,'final shot':140,'golden time':162,'ventus howl':10,
  'shadow flare':10,'twilight surge':30,'polar vortex':20,'meteor strike':500,
  'gravity well':0,'hand of restoration':3,'echoes of salvation':3,
  'pulse of purification':60,'voice of vitality':240,'pall of ruination':180,
  'blessing of protection':120,'hydra transmutation':8.3,'serpentcall':42,
  'rain casting':48,'time shift':0,'shield of trust':0,'shock':0,
  'hymn of resurrection':4,'smokescreen':0,'anchor rush':0,
  'grapple shot':8,'reload':0,'nova blast':0,'tri-assault':36,
  'ignis plume':6,'aqua volley':10,'terra scourge':24,'resonant litany':0
 };
 const canon=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
 const numericId=id=>/^\d+$/.test(String(id))&&Number(id)>0&&Number(id)!==9999?String(id):'';
 function ruleFor(id,name='',overrides){
  id=numericId(id);const ov=overrides?.[id]||{};const r=RULES[id]||{};
  const value=NAME_COOLDOWNS[canon(name)]??0;
  const cooldown=Number(ov.cooldown??r.cooldown??value),maxHits=Number(ov.maxHits??r.maxHits??1);
  return {...DEFAULT,...r,...ov,cooldown:Number.isFinite(cooldown)?Math.max(0,cooldown):0,
   maxHits:Number.isFinite(maxHits)?Math.max(1,Math.floor(maxHits)):1};
 }
 function signature(o){
  if(!o||o.actorVerified===true||!Array.isArray(o.fields))return null;
  const op=Number(o.opcode),sub=Number(o.subtype),f=o.fields;
  // Use only distinctive typed/pattern positions (never arbitrary matching IDs).
  if(op===37011){
   if(sub===514&&f[1]==='1')return '27009';
   if(sub===166&&f[1]==='/black/ready/')return '35010';
   if(sub===400&&f.includes('cook_pot_outline')&&f[1]==='1')return '35024';
   if(sub===841&&f[1]==='0')return '27205';
   if(sub===838&&f[1]==='0')return '27206';
   if(sub===427&&f[1]==='1')return '30482';
   if(sub===778&&f[1]==='1')return '59005';
   if(sub===776&&f[1]==='1')return '59006';
   if(sub===777&&f[1]==='1')return '59002';
   if(sub===14&&f[1]==='party_healing')return '30008';
   if(sub===14&&f[1]==='healing_firstaid')return '10009';
  }
  if(op===37013){
   if(f[1]==='408'&&sub===700)return '26006';
   if(f[1]==='361'&&f[0]==='0')return '53002';
  }
  return null;
 }
 function validSignature(o,id,rows){
  const t=Number(o.relativeMs),f=o.fields;
  const nearby=(op,sub,pred,ms)=>rows.some(x=>x!==o&&Number(x.opcode)===op&&Number(x.subtype)===sub&&Math.abs(Number(x.relativeMs)-t)<=ms&&pred(x.fields||[]));
  if(id==='27009')return [300,650,850].every(stage=>rows.some(x=>Number(x.opcode)===37013&&String(x.fields?.[1])==='514'&&Number(x.subtype)===stage&&Number(x.relativeMs)>=t-100&&Number(x.relativeMs)<=t+2500));
  if(id==='35010')return nearby(37011,166,g=>g[1]==='/black/fire/',4000);
  if(id==='27205')return nearby(37011,841,g=>g[1]==='1',2500);
  if(id==='27206')return nearby(37011,838,g=>g[1]==='1',4000);
  // Stage 1 identifies beginning; subsequent states/targets are not extra uses.
  return true;
 }
 // Skill labels can appear in skills[], 0x6988, verified actions, and recognized cues.
 function namesFor(report){const map=new Map(Object.entries(NAMES));
  for(const p of report.players||[])for(const s of p.skills||[])if(numericId(s.skillId)&&s.name)map.set(String(s.skillId),String(s.name));
  for(const x of [...(report.skillUseEvents||[]),...(report.skillObservations||[])]){
   const id=numericId(x.skillId)||numericId(x.candidateSkillId);
   if(id&&x.skillName)map.set(id,String(x.skillName));}
  return map;
 }
 // The return value is a single sequence of skill uses, with internal source
 // details kept for regression testing but not displayed as confidence classes.
 function recognize(report,playerId,options={}){
  const pid=String(playerId),start=Number(options.start??-Infinity),end=Number(options.end??Infinity),overrides=options.rules;
  const names=namesFor(report),byId=new Map();
  const get=id=>{id=String(id);if(!byId.has(id))byId.set(id,[]);return byId.get(id)};
  const config=id=>ruleFor(id,names.get(String(id))||'',overrides);
 const passive=id=>/^(?:redoubled offensive|flare|blast)$|\bai$/i.test(names.get(String(id))||'');
  const add=(id,t,from,metadata={})=>{
   id=numericId(id);if(!id||!Number.isFinite(t)||passive(id))return null;
   const arr=get(id),r=config(id),cd=r.cooldown*1000,tol=from==='explicit'?100:from==='signature'?(id==='27205'?1200:350):from==='condition'?550:Math.max(200,r.actionWindow*1000);
   let prior=null;
   for(let j=arr.length-1;j>=0;j--){const u=arr[j];const delta=t-u.relativeMs;
    if(Math.abs(delta)<=tol||(from!=='explicit'&&delta>=0&&delta<Math.max(cd,from==='action'?r.actionWindow*1000:0))){prior=u;break;}
    // Rows can arrive by evidence class rather than chronology; scan all.
   }
   if(prior&&from==='hit'&&r.cooldown===0&&prior.hitCount>=r.maxHits)prior=null;
   if(prior){prior.sources.add(from);if(from==='action')prior.actionRecords++;
    if(from==='explicit')prior.explicitPackets++;
    if(from==='signature')prior.signatures++;
    return prior;
   }
   const u={playerId:pid,skillId:id,skillName:names.get(id)||'Skill '+id,relativeMs:t,
    atMs:null,hitCount:0,damage:0,criticalHits:0,actionRecords:from==='action'?1:0,
    explicitPackets:from==='explicit'?1:0,signatures:from==='signature'?1:0,
    sources:new Set([from]),hits:[],targetId:metadata.targetId??null};
   arr.push(u);arr.sort((a,b)=>a.relativeMs-b.relativeMs);return u;
  };
  // The recorder-only explicit packets create Rixi's labeled starts, but are
  // never used to create events for another player.
  for(const e of report.skillUseEvents||[])if(String(e.playerId)===pid)add(e.skillId,Number(e.relativeMs),'explicit',{targetId:e.targetId});
  const rows=(report.skillObservations||[]).filter(o=>String(o.playerId)===pid&&Number.isFinite(Number(o.relativeMs))).sort((a,b)=>a.relativeMs-b.relativeMs);
  // Composite self/placement signatures (not generic recipient buffs).
  const explicitIds=new Set((report.skillUseEvents||[]).filter(e=>String(e.playerId)===pid).map(e=>String(e.skillId)));
  for(const o of rows){const id=signature(o);if(id&&validSignature(o,id,rows)&&!explicitIds.has(id))add(id,Number(o.relativeMs),'signature');}
  const startMarkers=new Set(rows.filter(o=>Number(o.opcode)===31014&&o.actorVerified===true&&Number(o.actionType)===114).map(o=>String(o.skillId)));
  for(const o of rows){if(Number(o.opcode)!==31014||o.actorVerified!==true)continue;
   const id=numericId(o.skillId);if(!id)continue;
   if(explicitIds.has(id))continue;
   // For skills with explicit action-start stages, the repeated type-66 rows
   // are damage/projectile stages and do not create additional uses.
   if(startMarkers.has(id)&&Number(o.actionType)!==114)continue;
   // Type 114 is often a cast/start, type 66 frequently repeated damage stage.
   // Per-skill windows suppress repeated stages; maxHits remains independently
   // tunable and does not equal number of combat-action packets.
   add(id,Number(o.relativeMs),'action');
  }
  // Target condition carrying the source attacker ID and skill metadata.
  for(const target of report.targets||[])for(const c of target.conditions||[]){
   if(String(c.attackerId)!==pid||!Number.isFinite(Number(c.start)))continue;
   const meta=String(c.metadata||'');
   const m=meta.match(/(?:^|;)MNEI:2:(\d+);/)||meta.match(/(?:^|;)MCDCASI:2:(\d+);/);
   if(m)add(m[1],Math.round(Number(c.start)*1000),'condition',{targetId:target.entityId});
  }
  for(const arr of byId.values())arr.sort((a,b)=>a.relativeMs-b.relativeMs);
  const targets=options.targetIds?.length?new Set(options.targetIds.map(String)):null;
  const hits=(report.damageHitEvents||[]).filter(h=>String(h.playerId)===pid&&Number(h.damage)>0&&numericId(h.skillId)&&!passive(h.skillId)&&(!targets||targets.has(String(h.targetId)))).sort((a,b)=>a.relativeMs-b.relativeMs);
  for(const h of hits){const id=String(h.skillId),t=Number(h.relativeMs),arr=get(id),r=config(id);
   let match=null;
   for(let i=arr.length-1;i>=0;i--){const u=arr[i],dt=t-u.relativeMs;
    if(dt>=-150&&dt<=r.hitWindow*1000&&u.hitCount<r.maxHits){match=u;break;}
    if(dt>Math.max(r.hitWindow*1000,5000))break;
   }
   if(!match){
    const prior=arr.filter(u=>u.relativeMs<=t).at(-1);
    // A known cooldown prevents another independent use until ready. Attach
    // extra hits to its existing activation (without increasing its hit budget).
    if(prior&&r.cooldown>0&&t-prior.relativeMs<r.cooldown*1000)match=prior;
    else match=add(id,t,'hit',{targetId:h.targetId});
   }
   if(match){match.hits.push(h);match.hitCount++;match.damage+=Number(h.damage)||0;
    if(h.critical)match.criticalHits++;match.sources.add('hit');}
  }
  return [...byId.values()].flat().filter(u=>u.relativeMs>=start*1000&&u.relativeMs<=end*1000)
   .sort((a,b)=>a.relativeMs-b.relativeMs||Number(a.skillId)-Number(b.skillId))
   .map(u=>({...u,sources:[...u.sources],rule:config(u.skillId)}));
 }
 function summary(report,playerId,opts){const uses=recognize(report,playerId,opts),skills=new Map();
  for(const u of uses){const id=u.skillId;if(!skills.has(id))skills.set(id,{skillId:id,name:u.skillName,count:0,hits:0,damage:0,cooldown:u.rule.cooldown,maxHits:u.rule.maxHits});
   const s=skills.get(id);s.count++;s.hits+=u.hitCount;s.damage+=u.damage;}
  return {uses,skills:[...skills.values()].sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name))};
 }
 return {DEFAULT,RULES,ruleFor,recognize,summary,signature,namesFor};
})();
