/* Midir NDJSON session import. Conservative event-to-companion adapter; no invented cast/death/clear evidence. */
window.MIDIR_SESSION_IMPORT=(()=>{
'use strict';
const num=x=>Number.isFinite(Number(x))?Number(x):null;
const key=x=>String(x??'');
function convert(text,filename){
 const rows=text.split(/\r?\n/), entities=new Map(),hp=new Map(),active=new Map(),intervals=new Map(),hits=new Map(),summaryPlayers=new Map();
 let summary=null,start=null,end=null,parsed=0;
 const getArr=(map,k)=>{if(!map.has(k))map.set(k,[]);return map.get(k)};
 for(let i=0;i<rows.length;i++){
  if(!rows[i].trim())continue;let e;try{e=JSON.parse(rows[i])}catch{throw Error(`Malformed session event at line ${i+1}`)};
  const event=Number(e.EventId),at=num(e.At),id=key(e.Id);parsed++;
  if(event===9999&&e.type==='SessionSummary'){summary=e.summary;continue}
  if(at===null)continue;if(start===null||at<start)start=at;if(end===null||at>end)end=at;
  if(event===1){entities.set(id,{name:e.Name||'',raceId:num(e.RaceId),ownerId:key(e.OwnerId),first:at,last:at,seenAppear:true});if(num(e.maxHp)>0)getArr(hp,id).push({at,cur:num(e.currentHp)||0,max:num(e.maxHp)});
   for(const c of e.conditions||[]){const cid=num(c.CCId);if(cid===null)continue;const k=id+'|'+cid;if(!active.has(k))active.set(k,{target:id,conditionId:cid,start:at,attackerId:key(c.AttackerId||'')==='0'?null:key(c.AttackerId),metadata:c.MetaData||null})}
  }else if(event===10){const m=num(e.maxHp);if(m>0)getArr(hp,id).push({at,cur:num(e.currentHp)||0,max:m});if(entities.has(id))entities.get(id).last=at;
  }else if(event===4){const cid=num(e.CCId);if(cid===null)continue;const k=id+'|'+cid;const prior=active.get(k);if(prior)getArr(intervals,id).push({...prior,end:at});active.set(k,{target:id,conditionId:cid,start:at,attackerId:key(e.AttackerId||'')==='0'?null:key(e.AttackerId),metadata:e.MetaData||null})
  }else if(event===5){const k=id+'|'+key(e.CCId),prev=active.get(k);if(prev){getArr(intervals,id).push({...prev,end:at});active.delete(k)}
  }else if(event===3){const sid=num(e.SkillId),damage=num(e.Damage)||0;if(sid===null||damage<=0)continue;const byPlayer=getArr(hits,id);byPlayer.push({at,skillId:sid,damage,critical:e.IsCritical===true})}
 }
 if(!parsed)throw Error('No NDJSON events detected');if(!summary&&!entities.size)throw Error('Not a recognized Midir NDJSON session');
 const origin=num(summary?.startTime)??start??0;const duration=num(summary?.duration)??Math.max(0,(end||origin)-origin);
 for(const p of summary?.players||[])summaryPlayers.set(key(p.id),p);
 for(const event of active.values())getArr(intervals,event.target).push({...event,end:Math.min(end||origin,event.start+3600)});
 const players=Array.from(summaryPlayers.values()).map(p=>{
   const id=key(p.id);const rawHits=hits.get(id)||[];const bySecond=new Map();const skillStats=new Map();
   for(const h of rawHits){const t=h.at-origin;if(t<0||t>duration+2)continue;const tick=Math.floor(t),group=bySecond.get(tick)||new Map(),sk=group.get(h.skillId)||{skillId:h.skillId,damage:0,hits:0,crits:0};sk.damage+=h.damage;sk.hits++;if(h.critical)sk.crits++;group.set(h.skillId,sk);bySecond.set(tick,group);
    const total=skillStats.get(h.skillId)||{skillId:h.skillId,name:null,hitCount:0,criticalHits:0,totalDamage:0,nonCriticalDamage:0,criticalDamage:0,sourceUses:null};total.hitCount++;total.totalDamage+=h.damage;if(h.critical){total.criticalHits++;total.criticalDamage+=h.damage}else total.nonCriticalDamage+=h.damage;skillStats.set(h.skillId,total)}
   // Summary skillUses are per-second damage-hit groups, not discrete cast events.
   const groups=bySecond.size?Array.from(bySecond,([time,sk])=>({time,totalDamage:Array.from(sk.values()).reduce((n,s)=>n+s.damage,0),skills:[...sk.values()]})):Array.isArray(p.skillUses)?p.skillUses.map(g=>({time:num(g.timestamp)||0,totalDamage:num(g.totalDmg)||0,skills:(g.skills||[]).map(s=>({skillId:num(s.skillId),damage:num(s.damage)||0,hits:num(s.hitCount)||0,crits:num(s.critCount)||0}))})):[];
   return {name:String(p.name||entities.get(id)?.name||id),entityId:id,arcana:p.arcanaName||null,deathTimes:[],deathEvidence:'not-reconstructed',conditions:(intervals.get(id)||[]).map(c=>({...c,start:c.start-origin,end:c.end-origin})),skills:[...skillStats.values()],damageEvents:groups};
 });
 const targets=[];const knownPeople=new Set(players.map(p=>p.entityId));for(const [id,t] of entities){if(knownPeople.has(id))continue;
  const samples=hp.get(id)||[];const isBoss=[7600,7601,7602,7603,7585,7586,7587,193364,193359,195012].includes(t.raceId);
  if(!isBoss&&samples.length<3&&(intervals.get(id)||[]).length===0)continue;
  const tmin=Math.max(0,t.first-origin),tmax=Math.min(duration,Math.max(t.last-origin,...samples.map(s=>s.at-origin),tmin));
  const compact=[];for(const s of samples){const t=s.at-origin;if(t<0||t>duration+2)continue;const prev=compact[compact.length-1];if(prev&&prev.time===t){prev.currentHp=s.cur;prev.maxHp=s.max}else compact.push({time:t,currentHp:s.cur,maxHp:s.max})}
  // Zero HP alone is not verified death. Never fabricate a clear from these events.
  targets.push({entityId:id,name:t.name||`Entity ${t.raceId||id}`,raceId:t.raceId,firstSeen:tmin,lastSeen:tmax,seenAppear:t.seenAppear===true,hp:compact,conditions:(intervals.get(id)||[]).map(c=>({conditionId:c.conditionId,start:c.start-origin,end:c.end-origin,attackerId:c.attackerId,metadata:c.metadata,evidence:'raw-session-condition-events'})),zeroHpObserved:compact.some(s=>s.currentHp<=0),defeatEvidence:'unverified'});
 }
 const comp={format:'midir-companion',version:1,session:{title:summary?.name||filename,targetScope:'all-targets',targetEntityIds:[],startUnixSeconds:origin,durationSeconds:duration},logicalEncounters:[],players,targets};
 return {comp,stats:{lines:parsed,players:players.length,targets:targets.length,hasSummary:!!summary}};
 }
 return {convert};
})();
