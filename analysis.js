/* Companion-33: evidence-preserving encounter / debuff analysis (offline, no network).
 * All interval times are relative to Midir's session start. This is not a cast log.
 * Reference categories below are provisional until the player confirms a complete list.
 */
window.MIDIR_ANALYSIS = (() => {
 'use strict';
 const categories = [
  {id:'phys',name:'Defense/Protection Decreased',statuses:[1164],skills:[24201,26006]},
  {id:'magic',name:'Magic Defense/Magic Protection Decreased',statuses:[1165],skills:[35024,26006]},
  {id:'amp',name:'Increased Damage Taken',statuses:[1166],skills:[21006,27010]},
  {id:'mark',name:'Death Mark',statuses:[426],skills:[27010]},
  {id:'maxpair',name:'Protection + Magic Protection Max Decreased',statuses:[1093,1094],skills:[58018]},
  {id:'lightning',name:'Dragon Lightning',statuses:[392],skills:[]},
  {id:'bone',name:'Bone Dragon / Devil’s Dash',statuses:[211],skills:[]},
  {id:'purr',name:'Purrling / Furious Charge',statuses:[912],skills:[]},
  {id:'clover',name:'Bunbun / Clover Mark',statuses:[1138],skills:[]},
  {id:'foxy',name:'Foxyquin’s Mark',statuses:[716],skills:[]}
 ];
 const bosses = new Map([[7585,{label:'Glenn Bearna · Primeval Winter (observed form 1)',key:'glenn-form1',formOnly:true}],[7586,{label:'Glenn Bearna · Primeval Winter (observed form 2)',key:'glenn-form2',formOnly:true}],[7587,{label:'Glenn Bearna · Primeval Winter (observed form 3)',key:'glenn-form3',formOnly:true}],[7602,{label:'Bri Leitt · Gate 2 — Bronntanas',key:'bri-g2'}],[7603,{label:'Bri Leitt · Gate 3 — Midir the Beloved',key:'bri-g3'}],[193364,{label:'Crom Bas · Irusan',key:'crom-irusan'}],[193359,{label:'Crom Bas · Giga Glas Ghaibhleann',key:'crom-glas'}],[195012,{label:'Rabbie Phantasm · Succubus Queen',key:'rabbie-queen'}]]);
 const n=(v)=>(v===null||v===undefined||v==='')?null:(Number.isFinite(Number(v))?Number(v):null);
 function encounters(r){
  if(r.provenance!=='companion-v1')return [];
  const targets=r.targets||[],byId=new Map(targets.map(t=>[t.entityId,t]));const result=[];
  for(const [i,l] of (r.logicalEncounters||[]).entries()){
   if(l.type!=='bri-gate-1-vertrag')continue;
   const ids=(l.entityIds||[l.firstEntityId,l.replacementEntityId]).filter(id=>id&&byId.has(id));
   const ts=ids.map(id=>byId.get(id));const start=n(l.start)??Math.min(...ts.map(t=>n(t.firstSeen)??0));const end=n(l.end)??Math.max(...ts.map(t=>n(t.lastSeen)??start));
   if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)continue;
   result.push({key:`gate1:${i}`,group:'bri-g1',name:'Bri Leitt · Gate 1 — Vertrag',attempt:l.attemptIndex||i+1,start,end,duration:end-start,targetIds:ids,clear:l.completion==='verified-clear',evidence:l.evidence||'unverified',origin:'logical-encounter',spawnAt:n(byId.get(l.firstEntityId)?.firstSeen)??start,spawnObserved:byId.get(l.firstEntityId)?.seenAppear===true});
  }
  const hasGate1=result.some(x=>x.group==='bri-g1');
  for(const t of targets){const race=Number(t.raceId);
   // Do not interpret a split Vertrag boss form as an independent encounter.
   if(race===7600||race===7601){if(hasGate1)continue;else continue;}
   const meta=bosses.get(race);if(!meta)continue;
   const start=n(t.firstSeen),end=n(t.lastSeen);if(start===null||end===null||end<=start)continue;
   const clear=!meta.formOnly&&t.zeroHpObserved===true&&t.defeatEvidence==='zero-hp-and-death-flag';
   result.push({key:`target:${t.entityId}`,group:meta.key,name:meta.label,attempt:0,start,end,duration:end-start,targetIds:[t.entityId],clear,evidence:t.defeatEvidence||'unverified',origin:'observed-target',spawnAt:start,spawnObserved:t.seenAppear===true});
  }
  const byGroup=new Map();result.sort((a,b)=>a.start-b.start);
  for(const x of result){if(!x.attempt){x.attempt=(byGroup.get(x.group)||0)+1}byGroup.set(x.group,Math.max(x.attempt,byGroup.get(x.group)||0))}
  return result;
 }
 function eventsInAttempt(r,a){
  const ids=new Set(a.targetIds);const out=[];
  for(const t of r.targets||[]){if(!ids.has(t.entityId))continue;
   for(const c of t.conditions||[]){const start=n(c.start),end=n(c.end);
    if(start===null||start<a.start||start>a.end)continue;
    out.push({...c,targetId:t.entityId,start,end});
   }
  }
  return out;
 }
 function correlatedHits(r,a,p,skillIds,time,seconds=3){
  const ids=new Set(skillIds);
  if(ids.size===0)return [];
  const hits=[];
  for(const e of p.damageEvents||[]){const at=n(e.time);
   if(at===null||at<a.start||at>a.end||Math.abs(at-time)>seconds)continue;
   for(const s of e.skills||[]){if(ids.has(Number(s.skillId)))hits.push({skillId:Number(s.skillId),at});}
  }
  return hits;
 }
 function debuffs(r,a){
  const events=eventsInAttempt(r,a);const people=(r.players||[]).filter(p=>p.entityId&&!/^\d+$/.test(p.name));
  const byActor=new Map(people.map(p=>[String(p.entityId),p]));
  const applied=[];const players=new Map(people.map(p=>[p.entityId,{player:p,credits:[]}]));
  for(const category of categories){
   const matches=category.statuses.map(id=>events.filter(c=>Number(c.conditionId)===id));
   const seen=matches.every(list=>list.length>0);
   if(!seen)continue;
   // A paired status is credited only when both statuses have been observed.
   const entries=category.statuses.length===1?matches[0]:matches.flat();
   const credited=new Set();
   for(const condition of entries){
    const explicit=byActor.get(String(condition.attackerId||''));
    if(explicit){
     const tag=explicit.entityId+':'+category.id+':'+condition.start;if(credited.has(tag))continue;credited.add(tag);
     players.get(explicit.entityId).credits.push({category:category.id,name:category.name,time:condition.start,method:'recorded-attacker',statusId:condition.conditionId,skillId:null});
     continue;
    }
    // A known different attacker is not overridden by nearby player damage.
    if(condition.attackerId)continue;
    // A hit event is corroboration, NOT a proven skill activation.
    const candidates=[];
    for(const p of people){const hits=correlatedHits(r,a,p,category.skills,condition.start);if(hits.length)candidates.push({p,hit:hits.sort((x,y)=>Math.abs(x.at-condition.start)-Math.abs(y.at-condition.start))[0]})}
    if(candidates.length!==1)continue; // Ambiguous overlapping parties are not falsely assigned.
    const {p,hit}=candidates[0];const tag=p.entityId+':'+category.id+':'+condition.start;
    if(credited.has(tag))continue;credited.add(tag);
    players.get(p.entityId).credits.push({category:category.id,name:category.name,time:condition.start,method:'nearby-skill-hit',statusId:condition.conditionId,skillId:hit.skillId,hitAt:hit.at});
   }
   applied.push({category:category.id,name:category.name,statusIds:category.statuses,firstAt:Math.min(...entries.map(c=>c.start))});
  }
  // Deduplicate repeated refreshes of the same effect for an individual's summary,
  // retaining underlying evidence for an expanded inspector.
  for(const entry of players.values()){
   entry.credits.sort((x,y)=>x.time-y.time);
   entry.categories=[...new Set(entry.credits.map(c=>c.category))];
   entry.early=a.spawnObserved?entry.credits.filter(c=>c.time>=a.spawnAt&&c.time<=a.spawnAt+10):[];
  }
  return {applied,players,required:categories.length,completeReference:applied.length===categories.length,knownOnly:true,eventsCount:events.length};
 }
 function personalWindow(r,a,p){
  const groups=(p.damageEvents||[]).filter(e=>Number.isFinite(Number(e.time))&&e.time>=a.start&&e.time<=a.end);
  if(!groups.length)return null;
  const damage=groups.reduce((sum,e)=>sum+(Number(e.totalDamage)||0),0);
  return {damage,dps:damage/a.duration,eventSeconds:groups.length,scope:r.targetScope==='all-targets'?'all-targets':'selected-target; target attribution unavailable',evidence:'damage-hit-groups, not casts or verified boss-only damage'};
 }
 function possibleRepeat(a,b){
  const sa=n(a.sessionStart),sb=n(b.sessionStart);
  if(sa===null||sb===null||sa<1000000000||sb<1000000000)return false;
  if(Math.abs(sa-sb)>3||Math.abs(Number(a.duration)-Number(b.duration))>5)return false;
  return true;
 }
 return {categories,encounters,eventsInAttempt,debuffs,personalWindow,possibleRepeat};
})();
