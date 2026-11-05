/* Companion 223 — Midir 45 skill evidence interpreter.
 * An observation is NOT a confirmed skill activation. In particular, 0x9093/0x9095
 * playerId describes a known player entity addressed by the effect, not its caster.
 * Keep identifier strings intact (entity IDs can exceed JS's integer precision).
 */
window.MIDIR_SKILL_EVIDENCE=(()=>{
 'use strict';
 const ACTION=0x7926,EFFECT=0x9093,DELAYED=0x9095;
 const validId=v=>{const s=String(v??'');return /^\d{1,9}$/.test(s)&&Number(s)>0&&Number(s)!==9999?s:''};
 const asNumber=(v)=>Number.isFinite(Number(v))?Number(v):null;
 const namedCues=new Map([
  ['14:healing_firstaid',{id:'10009',name:'First Aid'}],
  ['14:party_healing',{id:'30008',name:'Party Healing'}],
  ['400:cook_pot_outline',{id:'35024',name:'Hydra Transmutation'}]
 ]);
 // Typed skill positions from the Midir 45 controlled study. Not free-form
 // scanning: arbitrary numeric effect fields are not skill identifiers.
 const typedSpec=new Map([[304,[2,2]],[419,[1,3]],[833,[1,2]],[660,[1,2]],[661,[1,2]],[145,[2,2]]]);
 function typedSkill(o){if(!o||!Array.isArray(o.fields)||!Array.isArray(o.fieldTypes))return '';
  const fields=o.fields,types=o.fieldTypes;let spec;
  if(o.opcode===EFFECT)spec=typedSpec.get(Number(o.subtype));
  else if(o.opcode===DELAYED&&fields[1]==='419')spec=[2,3];
  if(!spec)return '';
  const [slot,type]=spec;return Number(types[slot])===type?validId(fields[slot]):'';
 }
 function cue(o){if(!o||!Array.isArray(o.fields))return null;
  if(o.opcode===EFFECT){
   const subtype=Number(o.subtype);
   for(const word of o.fields){const c=namedCues.get(subtype+':'+word);if(c)return {...c,kind:'named-effect-cue'};}
   // Stage effects identify an observed ability-like effect, but not its caster.
   const stageIds={776:['59006','Blessing of Protection'],778:['59005','Pall of Ruination'],777:['59002','Voice of Vitality'],779:['59000','Hand of Restoration']};
   if(stageIds[subtype])return {id:stageIds[subtype][0],name:stageIds[subtype][1],kind:'provisional-effect-pattern'};
  }
  if(o.opcode===DELAYED){
   if(o.fields[1]==='361')return {id:'53002',name:'Encore',kind:'provisional-four-stage-pattern'};
   if(o.fields[1]==='408')return {id:'26006',name:'Smokescreen',kind:'provisional-effect-pattern'};
  }
  return null;
 }
 function interpret(o){
  const verified=o.opcode===ACTION&&o.actorVerified===true;
  const direct=verified?validId(o.skillId):'';
  // Exporter candidate IDs are checked against their documented typed slot.
  // For effect packets, a typed ID still does not establish the caster.
  const typed=typedSkill(o);
  const candidate=validId(o.candidateSkillId);
  const identified=direct||(typed&&(!candidate||candidate===typed)?typed:'');
  const fallback=identified?'':cue(o);
  return {skillId:identified||fallback?.id||'',skillName:identified?(o.skillName||''):fallback?.name||'',
   kind:verified?(direct?'verified-combat-action':'verified-unidentified-action'):
    o.opcode===ACTION?'unverified-combat-action':identified?'recipient-typed-effect':fallback?'recipient-effect-cue':'unresolved-effect',
   confidence:verified&&direct?'actor-verified':verified?'actor-verified-unidentified':identified?'recipient-only':fallback?'provisional-recipient':'unresolved',
   caveat:fallback?.kind||'',source:o};
 }
 function inWindow(e,start,end){return Number.isFinite(e.relativeMs)&&e.relativeMs>=start*1000&&e.relativeMs<=end*1000;}
 function collect(r,playerId,start=0,end=Infinity){const key=String(playerId);
  const uses=(r.skillUseEvents||[]).filter(o=>o.playerId===key&&inWindow(o,start,end));
  const actions=[],recipient=[],unresolved=[];
  for(const o of r.skillObservations||[]){if(o.playerId!==key||!inWindow(o,start,end))continue;
   const i=interpret(o);if(i.kind==='verified-combat-action'||i.kind==='verified-unidentified-action')actions.push(i);
   else if(i.kind==='recipient-typed-effect'||i.kind==='recipient-effect-cue')recipient.push(i);
   else unresolved.push(i);
  }
  const hits=(r.damageHitEvents||[]).filter(o=>o.playerId===key&&inWindow(o,start,end));
  return {uses,actions,recipient,unresolved,hits};
 }
 // Group only nearby SAME-skill action stages into *evidence bursts*, not casts.
 // These are navigation aids. Continuous/channeled skills may span many bursts,
 // and rapid separate casts can share a burst. Both remain explicitly uncertain.
 function actionBursts(actions){const groups=new Map();
  for(const o of actions){if(!o.skillId)continue;const k=o.skillId;
   if(!groups.has(k))groups.set(k,[]);groups.get(k).push(o);
  }
  const bursts=[];
  for(const [id,list] of groups){list.sort((a,b)=>a.source.relativeMs-b.source.relativeMs);
   let current=null;
   for(const row of list){const ms=row.source.relativeMs;
    const gap=id==='26007'||id==='27200'?1000:750;
    if(!current||ms-current.lastMs>gap){current={skillId:id,skillName:row.skillName||'',relativeMs:ms,lastMs:ms,records:0,kind:'verified-action-burst'};bursts.push(current)}
    current.lastMs=ms;current.records++;if(!current.skillName&&row.skillName)current.skillName=row.skillName;
   }
  }
  return bursts.sort((a,b)=>a.relativeMs-b.relativeMs);
 }
 function summarize(r,playerId,start=0,end=Infinity){const c=collect(r,playerId,start,end),bySkill=new Map();
  function row(id,name){if(!bySkill.has(id))bySkill.set(id,{skillId:id,name:name||'Skill '+id,usePackets:0,actionRecords:0,actionBursts:0,recipientEffects:0,hits:0,damage:0});const x=bySkill.get(id);if(name&&x.name.startsWith('Skill '))x.name=name;return x;}
  for(const e of c.uses){const id=validId(e.skillId);if(id)row(id,e.skillName).usePackets++;}
  for(const e of c.actions){if(e.skillId)row(e.skillId,e.skillName).actionRecords++;}
  for(const e of actionBursts(c.actions))row(e.skillId,e.skillName).actionBursts++;
  for(const e of c.recipient){if(e.skillId)row(e.skillId,e.skillName).recipientEffects++;}
  for(const e of c.hits){const id=validId(e.skillId);if(id){const x=row(id,'');x.hits++;x.damage+=e.damage;}}
  return {bySkill:[...bySkill.values()].sort((a,b)=>(b.actionRecords+b.usePackets+b.hits)-(a.actionRecords+a.usePackets+a.hits)),...c,
   bursts:actionBursts(c.actions),unidentifiedActions:c.actions.filter(a=>!a.skillId).length};
 }
 return {interpret,typedSkill,cue,collect,actionBursts,summarize,validId};
})();
