/* Companion 0.3.12b — independent Midir-46.b Personal Bests comparison evidence.
 * This deliberately never converts 30-second windows into complete Companion v1 sessions.
 * Schema mapping is isolated pending an actual burst-data export from Midir-46.b.
 */
window.MIDIR_BURST_COMPARISON=(()=>{'use strict';
 const num=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v))?Number(v):null;
 const string=v=>String(v??'');
 const first=(o,keys)=>{for(const k of keys)if(o&&o[k]!==undefined&&o[k]!==null)return o[k];return null};
 const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
 const hitKind=v=>/^(hit|damage|damage-hit|damage_hit)$/i.test(string(v));
 const useKind=v=>/^(use|skill-use|skill_use|observed-use|observed_use|activation)$/i.test(string(v));
 function isComparison(text){return /<script\b[^>]*\bid\s*=\s*["']burst-data["'][^>]*>/i.test(text)}
 function read(text,filename='comparison.html'){
  let root;
  if(isComparison(text)){
   const tag=/<script\b[^>]*\bid\s*=\s*["']burst-data["'][^>]*>/i.exec(text);
   const end=text.indexOf('</script>',tag.index+tag[0].length);
   if(end<0)throw Error('Leaderboard JSON script is not closed');
   root=JSON.parse(text.slice(tag.index+tag[0].length,end));
  }else root=JSON.parse(text);
  if(!obj(root))throw Error('Invalid leaderboard JSON object');
  const sources=first(root,['players','entries','comparisons','records','leaderboard']);
  if(!Array.isArray(sources)||!sources.length||sources.length>8)throw Error('Expected 1–8 leaderboard player entries');
  const players=sources.map((p,index)=>normalizePlayer(p,index));
  // Reject accidental normal-report inputs and missing actual event evidence.
  if(!players.some(p=>p.hits.length||p.uses.length))throw Error('No individual hit/use evidence in leaderboard comparison');
  return {kind:'midir-burst-comparison',schema:'midir-46b-30s',name:filename,title:string(root.title||'Midir Personal Bests — 30s Boss Burst Comparison'),arcana:string(root.arcana||root.arcanaName||players[0].arcana||''),players};
 }
 function normalizePlayer(p,index){
  if(!obj(p))throw Error('Invalid leaderboard player '+(index+1));
  const window=obj(p.window)?p.window:obj(p.bestWindow)?p.bestWindow:obj(p.best30)?p.best30:obj(p.burst)?p.burst:p;
  const start=num(first(window,['startMs','startAtMs','windowStartMs','absoluteStartMs','startTimestampMs']))??num(first(p,['startMs','windowStartMs','absoluteStartMs','startTimestampMs']));
  const rows=first(window,['events','timeline','damageEvents','hitEvents'])??first(p,['events','timeline','damageEvents','hitEvents']);
  const splitHits=first(window,['hits','damageHits'])??first(p,['hits','damageHits']);
  const splitUses=first(window,['uses','skillUseEvents','observedUses'])??first(p,['uses','skillUseEvents','observedUses']);
  if(rows!==null&&!Array.isArray(rows))throw Error('Invalid events list');
  const rawHits=[],rawUses=[];
  for(const e of Array.isArray(rows)?rows:[]){if(!obj(e))continue;const kind=first(e,['kind','type','eventType']);if(hitKind(kind))rawHits.push(e);else if(useKind(kind))rawUses.push(e)}
  if(!rawHits.length&&Array.isArray(splitHits))rawHits.push(...splitHits);
  if(!rawUses.length&&Array.isArray(splitUses))rawUses.push(...splitUses);
  if(rawHits.length>250000||rawUses.length>250000)throw Error('Leaderboard event safety limit exceeded');
  function relMs(e){let v=num(first(e,['relativeMs','timeMs','offsetMs','relativeTimeMs','tMs','time','t']));if(v===null&&start!==null){const at=num(first(e,['atMs','timestampMs','absoluteMs']));if(at!==null)v=at-start;}return v}
  // Actual Midir 46.b export names live in p.skills[].name and use .id.
  // Hit/use events deliberately carry IDs only; enrichment is display-only.
  // Summary damage is NEVER added to hit evidence again.
  const summary=Array.isArray(first(window,['skills','skillBreakdown','perSkill']))?first(window,['skills','skillBreakdown','perSkill']):Array.isArray(first(p,['skills','skillBreakdown','perSkill']))?first(p,['skills','skillBreakdown','perSkill']):[];
  const nameById=new Map(summary.filter(obj).map(sk=>[string(first(sk,['id','skillId'])),string(first(sk,['name','skillName'])||'')]));
  const skillLabel=e=>string(first(e,['skillName','name'])||nameById.get(string(first(e,['skillId','id','skill'])??'0'))||'');
  const hits=rawHits.map(e=>({t:relMs(e),skillId:string(first(e,['skillId','id','skill'])??'0'),skillName:skillLabel(e),damage:num(first(e,['damage','amount','value'])),critical:first(e,['critical','isCritical'])===true||first(e,['critical','isCritical'])===1?true:first(e,['critical','isCritical'])===false||first(e,['critical','isCritical'])===0?false:null,petName:string(first(e,['petName','pet'])||'')})).filter(e=>e.t!==null&&e.t>=0&&e.t<30000&&e.damage!==null&&e.damage>0).sort((a,b)=>a.t-b.t);
  const uses=rawUses.map(e=>({t:relMs(e),skillId:string(first(e,['skillId','id','skill'])??'0'),skillName:skillLabel(e),observed:true})).filter(e=>e.t!==null&&e.t>=0&&e.t<30000).sort((a,b)=>a.t-b.t);
  const bySkill=new Map();for(const h of hits){const k=h.skillId==='9999'&&h.petName?'9999:'+h.petName:h.skillId,entry=bySkill.get(k)||{skillId:h.skillId,name:h.petName?'Pet: '+h.petName:h.skillName||'Skill '+k,damage:0,hits:0,largest:0,criticalHits:0};entry.damage+=h.damage;entry.hits++;entry.largest=Math.max(entry.largest,h.damage);entry.criticalHits+=Number(h.critical);if(h.skillName&&!h.petName)entry.name=h.skillName;bySkill.set(k,entry)}
  const skillStats=[...bySkill.values()].sort((a,b)=>b.damage-a.damage);
  const recordedTotal=num(first(window,['totalDamage','damage','bossDamage','total']))??num(first(p,['totalDamage','bossDamage','damage','total']));
  const derivedTotal=hits.reduce((n,h)=>n+h.damage,0);
  const best10=bestWindow(hits,10000);
  return {name:string(first(p,['username','playerName','name'])||'Player '+(index+1)),arcana:string(first(p,['arcana','arcanaName'])||''),rank:num(first(p,['rank','leaderboardRank'])),sourceSession:string(first(p,['sourceSession','sessionName','sessionId','source'])||''),startAtMs:start,recordedTotal,derivedTotal,hits,uses,skillStats,exportedSkillSummaries:summary,best10};
 }
 // Half-open intervals [start, start+10_000) prevent counting a 10_001ms span.
 // Candidate starts can be shifted within the original 0–30s window.
 function bestWindow(hits,length=10000){
  // Search the full domain of 10-second windows within the exported 30s.
  // Unlike choosing only intervals that start on a hit, candidates ending
  // directly after a hit are needed to handle subsecond events and late hits.
  // Work is O(n log n) for sorting and O(n) for the two-pointer sweep.
  const events=hits.slice().filter(h=>Number.isFinite(h.t)&&Number.isFinite(h.damage)&&h.damage>0&&h.t>=0&&h.t<30000).sort((a,b)=>a.t-b.t);
  const limit=Math.max(0,30000-length);
  if(!events.length)return {start:0,end:length,damage:0,hits:0,skills:[]};
  const clamp=t=>Math.max(0,Math.min(limit,t));
  const candidates=[0,limit];
  for(const h of events){candidates.push(clamp(h.t),clamp(h.t-length+1));}
  candidates.sort((a,b)=>a-b);
  let left=0,right=0,sum=0,bestDamage=-1,bestStart=0,bestRange=[0,0];
  for(const start of candidates){
   while(left<right&&events[left].t<start)sum-=events[left++].damage;
   while(right<events.length&&events[right].t<start+length)sum+=events[right++].damage;
   if(sum>bestDamage+0.00001){bestDamage=sum;bestStart=start;bestRange=[left,right];}
  }
  const chosen=events.slice(...bestRange),groups=new Map();
  for(const h of chosen){
   const key=h.skillId==='9999'&&h.petName?'9999:'+h.petName:h.skillId;
   const g=groups.get(key)||{skillId:h.skillId,name:h.petName?'Pet: '+h.petName:h.skillName||'Skill '+h.skillId,damage:0,hits:0,criticalHits:0};
   g.damage+=h.damage;g.hits++;g.criticalHits+=Number(h.critical);
   if(h.skillName&&!h.petName)g.name=h.skillName;groups.set(key,g);
  }
  return {start:bestStart,end:bestStart+length,damage:chosen.reduce((total,h)=>total+h.damage,0),hits:chosen.length,skills:[...groups.values()].sort((a,b)=>b.damage-a.damage)};
 }

 return {isComparison,read,bestWindow};
})();
