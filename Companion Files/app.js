(()=>{'use strict';
const D=window.MIDIR_DATA,$=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),fmt=n=>Number(n||0).toLocaleString(),safeNum=n=>Number.isFinite(Number(n))?Number(n):null;
const storeKey='midir-companion-01';let state;try{state=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch{state={}};state={arcana:'as',page:'vault',reports:[],drillHistory:[],academyHistory:[],marks:[],settings:{ddStage:0,ddMinutes:2,ddInterval:20,asDuration:60},asSkillSettings:{},asSequence:'3 1 2 1 4 1 3 4 5',...state};if(!Array.isArray(state.reports))state.reports=[];if(!Array.isArray(state.metricMilestones))state.metricMilestones=[];if(!Array.isArray(state.academySetAside))state.academySetAside=[];if(!state.archiveLedger||typeof state.archiveLedger!=='object')state.archiveLedger={version:1,awards:{},skillMedians:{},winners:{},sources:{}};state.page='vault';if(typeof state.characterName!=='string')state.characterName='';const runtime={timers:[],drill:null,as:null,scenario:0,answer:null,academy:0,academyChoice:null,academyReveal:false,position:0,attack:'cone',facing:0,reportSelection:0};
function save(){if(reportStorageBlocked){message('Report storage needs recovery; profile saves are paused to protect existing reports.');return false}try{const payload=reportDbReady?{...state,reports:state.reports.map(reportIndexEntry),reportStorage:'indexeddb-v2'}:state;localStorage.setItem(storeKey,JSON.stringify(payload));return true}catch{message('Storage is full or unavailable. Export a backup of your profile.');return false}}function message(s){let el=$('notice');if(el){el.textContent=s;el.hidden=false;}else console.info(s)}function later(fn,ms){const t=setTimeout(fn,ms);runtime.timers.push(t);return t}function interval(fn,ms){const t=setInterval(fn,ms);runtime.timers.push(t);return t}function stopTimers(){runtime.timers.forEach(t=>{clearTimeout(t);clearInterval(t)});runtime.timers=[];runtime.as=null}
function pane(title,body,extra=''){return `<section class="card ${extra}"><h2>${title}</h2>${body}</section>`}function buttons(arr){return '<div class="button-row">'+arr.map(([label,fn,cls=''])=>`<button class="${cls}" data-act="${fn}">${label}</button>`).join('')+'</div>'}function notice(){return '<div class="notice" id="notice" hidden></div>'}function page(name){if(name==='encounter')name='vault';stopTimers();state.page=name;save();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===name));render()}
function render(){const p=state.page;const views={home,imports,rotation,debuff,encounter,records,vault,settings:settingsPage};$('app').innerHTML=(views[p]||home)()+notice();bind();window.MIDIR_THETA?.mount?.();window.MIDIR_I18N?.apply(document);}
function home(){return `<h2>Your practice space</h2><p class="muted">Train away from the encounter, then bring the decisions back into the game. You decide whether a drill was good enough.</p><div class="grid">${[['Arcana Simulators','DD Subject Theta rhythm or AS keyboard fluency','rotation'],['Debuff Academy','Guided rotation, effect library, flashcards, and missing-debuff drills','debuff'],['Personal Records','Progress notes and verified-only collectibles','records'],['Midir Reports',state.reports.length+' imported report(s)','imports']].map(c=>`<section class="card"><h3>${c[0]}</h3><p class="muted">${c[1]}</p>${buttons([['Open','page:'+c[2],'primary']])}</section>`).join('')}</div>${pane('Ground rules','<p>These tools offer snapshot builder, not a performance verdict. Hit events are not automatically cast counts; unobserved deaths, mechanics, casts, and debuffs remain unknown. Find your rhythm and build confidence.</p>')}`}
function imports(){let rs=state.reports;return `<h2>Imported Midir reports</h2><p class="muted">Read Midir-45 standalone HTML (also accepts earlier structured Midir reports) (embedded <code>script#data</code>). Legacy HTML reports remain useful for damage and HP but cannot verify deaths or collectibles. Files stay in this browser.</p><div class="card drop" id="drop"><h3>Drop Midir export files here</h3><p>.json or offline .html · select multiple</p>${buttons([['Choose files','pick','primary'],['Export local backup','backup'],['Import backup','restore']])}<input id="backup-picker" type="file" accept=".json" hidden></div><div class="grid">${rs.map((r,i)=>`<div class="card"><div class="row between"><h3>${esc(r.name)}</h3><span class="pill">${r.version?'v'+r.version:'legacy'}</span></div><p>${esc(r.encounter)} · ${fmt(r.duration)}s</p><p class="hint">${r.players.length} player(s) · ${r.targets.length} target(s) · ${r.provenance==='companion-v1'?'Structured companion':'Report-only, limited evidence'}</p>${buttons([['Inspect','inspect:'+i],['Remove','remove:'+i,'danger']])}</div>`).join('')||'<div class="card"><p>No reports yet. Training modules work without imports.</p></div>'}</div><div id="report-detail"></div>`}
function decodeObservationFieldTypes(value){
 if(Array.isArray(value))return value.map(t=>Number(t)||0);
 if(typeof value==='string'&&value&&/^[A-Za-z0-9+/]*={0,2}$/.test(value)){
  try{return Array.from(atob(value),ch=>ch.charCodeAt(0));}catch{return [];}
 }
 return [];
}
function cleanExport(comp,outer,filename){
 if(!comp||comp.format!=='midir-companion'||comp.version!==1)throw Error('Unsupported companion version or format');
 const session=comp.session||{};
 const players=(comp.players||[]).map(p=>({name:String(p.name||'Unknown'),entityId:String(p.entityId||''),arcana:p.arcana||null,
  deathTimes:Array.isArray(p.deathTimes)?p.deathTimes.filter(Number.isFinite):null,
  reviveTimes:Array.isArray(p.reviveTimes)?p.reviveTimes.filter(Number.isFinite):[],
  conditions:Array.isArray(p.conditions)?p.conditions:[],
  skills:Array.isArray(p.skills)?p.skills.map(sk=>{const source=outer?.players?.find(op=>op.name===p.name)?.skills?.find(os=>os.name&&os.name===sk.name);return source?.biggest>0?{...sk,biggest:source.biggest}:sk}):[],
  damageTaken:p.damageTaken!=null&&Number.isFinite(Number(p.damageTaken))?Number(p.damageTaken):null,
  damageEvents:Array.isArray(p.damageEvents)?p.damageEvents:[]}));
 const targets=(comp.targets||[]).map(t=>({entityId:String(t.entityId||''),name:String(t.name||''),raceId:t.raceId,
  firstSeen:t.firstSeen==null?null:safeNum(t.firstSeen),lastSeen:t.lastSeen==null?null:safeNum(t.lastSeen),seenAppear:t.seenAppear===true,
  hp:(t.hp||[]).filter(h=>Number.isFinite(h.time)&&Number.isFinite(h.currentHp)&&Number.isFinite(h.maxHp)&&h.maxHp>0),
  conditions:Array.isArray(t.conditions)?t.conditions:[],zeroHpObserved:t.zeroHpObserved===true,defeatEvidence:t.defeatEvidence||'unverified'}));
 const reportPlayers=(Array.isArray(outer?.players)?outer.players:[]).map(p=>({name:p.name,color:p.color,damage:p.damage,dps:p.dps,deaths:p.deaths,skills:p.skills||[]}));
 return {name:filename,version:1,provenance:'companion-v1',targetScope:session.targetScope||'all-targets',
  targetEntityIds:session.targetEntityIds||[],title:session.title||filename,encounter:(targets.some(t=>Number(t.raceId)===7600)&&targets.some(t=>Number(t.raceId)===7602)?'Multiple encounters · Bri Leith Gates 1 & 2':outer?.encounter==='Human'&&targets.some(t=>Number(t.raceId)===7603)?'Bri Leith · Gate 3 — Midir the Beloved':outer?.encounter)||session.title||filename,
  duration:Number(session.durationSeconds)||0,sessionStart:session.startUnixSeconds??null,players,targets,
  logicalEncounters:Array.isArray(comp.logicalEncounters)?comp.logicalEncounters:[],
  encounters:(Array.isArray(outer?.encounters)?outer.encounters:Array.isArray(comp.encounters)?comp.encounters:[]).map(e=>({id:String(e.id||''),label:String(e.label||''),entityIds:(e.entityIds||[]).map(String),start:Number(e.start),end:Number(e.end),completion:e.completion||'unverified',phases:e.phases||[]})).filter(e=>Number.isFinite(e.start)&&Number.isFinite(e.end)&&e.end>e.start),
  skillUseEvents:(Array.isArray(outer?.skillUseEvents)?outer.skillUseEvents:[]).filter(e=>Number.isFinite(Number(e.relativeMs))&&e.playerId!=null&&e.skillId!=null).map(e=>({playerId:String(e.playerId),playerName:String(e.playerName||''),skillId:String(e.skillId),skillName:String(e.skillName||''),atMs:Number.isFinite(Number(e.atMs))?Number(e.atMs):null,relativeMs:Number(e.relativeMs),targetId:e.targetId==null?null:String(e.targetId)})),
  damageHitEvents:(Array.isArray(outer?.damageHitEvents)?outer.damageHitEvents:[]).filter(e=>Number.isFinite(Number(e.relativeMs))&&Number(e.damage)>0&&e.playerId!=null&&e.skillId!=null).map(e=>({playerId:String(e.playerId),skillId:String(e.skillId),targetId:e.targetId==null?null:String(e.targetId),atMs:Number.isFinite(Number(e.atMs))?Number(e.atMs):null,relativeMs:Number(e.relativeMs),damage:Number(e.damage),critical:e.critical===true,delayed:e.delayed===true})),
  // Midir 45: preserve typed, source/recipient-distinguished evidence as supplied.
  // Numeric protocol fields intentionally remain strings (some are uint64 IDs).
  skillObservations:(outer?.skillObservationSchemaVersion===1&&Array.isArray(outer.skillObservations)?outer.skillObservations:[])
   .filter(e=>e&&e.playerId!=null&&Number.isFinite(Number(e.relativeMs))&&[31014,37011,37013].includes(Number(e.opcode)))
   .map(e=>({playerId:String(e.playerId),playerName:e.playerName==null?'':String(e.playerName),
    atMs:Number.isFinite(Number(e.atMs))?Number(e.atMs):null,relativeMs:Number(e.relativeMs),opcode:Number(e.opcode),
    skillId:String(e.skillId??0),skillName:e.skillName==null?null:String(e.skillName),candidateSkillId:String(e.candidateSkillId??0),
    subtype:Number(e.subtype)||0,actionType:Number(e.actionType)||0,actorVerified:e.actorVerified===true,
    fields:Array.isArray(e.fields)?e.fields.map(f=>String(f??'')):[],
    fieldTypes:decodeObservationFieldTypes(e.fieldTypes)})),
  skillObservationSchemaVersion:outer?.skillObservationSchemaVersion===1?1:null,
  unsupportedSkillObservationSchemaVersion:outer?.skillObservationSchemaVersion!=null&&outer.skillObservationSchemaVersion!==1?outer.skillObservationSchemaVersion:null,
  skillUseEvidence:typeof outer?.skillUseEvidence==='string'?outer.skillUseEvidence:null,
  sourceProvenance:{filename,reportTitle:String(outer?.title||session.title||''),hasCanonicalEncounters:Array.isArray(outer?.encounters),hasPreciseHits:outer?.damageHitSchemaVersion===1},
  reviveEvents:(Array.isArray(outer?.reviveEvents)?outer.reviveEvents:[]).filter(e=>Number.isFinite(Number(e.relativeTime))&&e.playerId!=null).map(e=>({playerId:String(e.playerId),playerName:String(e.playerName||''),at:Number.isFinite(Number(e.at))?Number(e.at):null,relativeTime:Number(e.relativeTime)})),
  skillUseSchemaVersion:outer?.skillUseSchemaVersion===1?1:null,damageHitSchemaVersion:outer?.damageHitSchemaVersion===1?1:null,encounterSchemaVersion:outer?.encounterSchemaVersion===1?1:null,
  evidenceVersion:outer?.skillObservationSchemaVersion===1?'midir-45-skill-observation-v1':outer?.skillUseSchemaVersion===1?'midir-45-observed-use':'companion-v1',
  boss:outer?.boss||null,reportPlayers}
}
function parseReport(source,filename){let root;if(/\.html?$/i.test(filename)){
 // Read only the JSON script from the HTML source. DOMParser duplicates huge HTML
 // documents and dramatically increases peak memory for extended multi-gate reports.
 const match=/<script\b[^>]*\bid=["']data["'][^>]*>/i.exec(source);
 if(!match)throw Error('No structured #data payload in this HTML report.');
 const from=match.index+match[0].length,to=source.indexOf('</script>',from);
 if(to<0)throw Error('Report JSON script is not closed.');
 root=JSON.parse(source.slice(from,to));
 }else root=JSON.parse(source);if(root.format==='midir-companion')return cleanExport(root,null,filename);if(root.companion)return cleanExport(root.companion,root,filename);if(!Array.isArray(root.players))throw Error('Unrecognized Midir report format');return{name:filename,version:null,provenance:'legacy-report',title:root.title||filename,encounter:root.encounter||'Unknown',duration:Number(root.duration)||0,sessionStart:null,boss:root.boss||null,players:root.players.map(p=>({name:p.name,entityId:'',arcana:null,deathTimes:null,skills:p.skills||[],damageEvents:p.hits||[]})),targets:[],logicalEncounters:[],reportPlayers:root.players||[]}}
async function filesSelected(files){let ok=0,fail=[];for(const f of files){if(f.size>90*1024*1024){fail.push(f.name+': file too large for browser memory safety');continue}try{let r=parseReport(await f.text(),f.name);const fingerprint=JSON.stringify([r.sessionStart,r.title,r.duration,r.players.map(p=>[p.entityId,p.name,p.skills.length]),r.targets.map(t=>t.entityId)]);
   r.archiveDigest=await archiveParsedFingerprint(r);r.archiveFileDigest=await archiveFileFingerprint(content);r.id='r'+hash(fingerprint);if(state.reports.some(p=>p.id===r.id)){fail.push(f.name+': appears already imported');continue}state.reports.push(r);ok++}catch(e){fail.push(f.name+': '+e.message)}}save();render();message(`${ok} imported. ${fail.length?fail.join(' · '):''}`)}function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return(h>>>0).toString(16)}// Skill evidence inspector: player entity IDs and canonical attempt windows are
// independent selectors. Typed recipient effects NEVER become player cast counts.
let skillInspectReportId='',skillInspectPlayerId='',skillInspectAttempt='session';
function inspectReport(i){
 const r=state.reports[i];if(!r)return;
 if(skillInspectReportId!==r.id){skillInspectReportId=r.id;skillInspectPlayerId='';skillInspectAttempt='session';}
 const target=r.targets.filter(t=>t.hp?.length).sort((a,b)=>Math.max(0,...b.hp.map(h=>h.maxHp))-Math.max(0,...a.hp.map(h=>h.maxHp)))[0];
 const players=r.players.filter(p=>p.entityId);const player=players.find(p=>p.entityId===skillInspectPlayerId)||players[0];
 const attempts=Array.isArray(r.encounters)?r.encounters:[];
 const attemptIndex=skillInspectAttempt==='session'?-1:Number(skillInspectAttempt);
 const attempt=Number.isInteger(attemptIndex)&&attemptIndex>=0?attempts[attemptIndex]:null;
 const start=attempt?.start??0,end=attempt?.end??Infinity;
 const scopeOptions='<option value="session">Entire session</option>'+attempts.map((a,i)=>`<option value="${i}" ${attempt===a?'selected':''}>${esc(a.label||'Encounter '+(i+1))} · ${a.completion==='observed-zero-hp'?'Cleared':'Attempted'}</option>`).join('');
 const personOptions=players.map(p=>`<option value="${esc(p.entityId)}" ${p===player?'selected':''}>${esc(p.name)}</option>`).join('');
 const hasEvidence=!!window.MIDIR_SKILL_EVIDENCE;
 const result=hasEvidence&&player?window.MIDIR_SKILL_EVIDENCE.summarize(r,player.entityId,start,end):null;
 const names=new Map();for(const sk of player?.skills||[]){const id=String(sk.skillId??sk.id??'');if(id&&sk.name)names.set(id,sk.name)};
 for(const use of r.skillUseEvents||[])if(use.playerId===player?.entityId&&use.skillName)names.set(use.skillId,use.skillName);
 for(const row of r.skillObservations||[])if(row.playerId===player?.entityId&&row.skillName){const id=String(row.skillId||row.candidateSkillId||'');if(id&&id!=='0')names.set(id,row.skillName)}
 const recognized=window.MIDIR_SKILL_USES?.summary(r,player?.entityId||'',attempt?{start:attempt.start,end:attempt.end}:{})||{uses:[],skills:[]};
 const rowHtml=x=>`<tr><td>${esc(names.get(x.skillId)||x.name)}</td><td>${fmt(x.count)}</td><td>${fmt(x.hits)}</td><td>${fmt(Math.round(x.damage))}</td><td>${fmt(x.cooldown)}s</td><td>${fmt(x.maxHits)}</td></tr>`;
 const eventRows=recognized.uses.slice(0,300).map(u=>`<div class="rh-hit"><span class="rh-time">${(u.relativeMs/1000).toFixed(3)}s</span><span>${esc(names.get(u.skillId)||u.skillName)}</span><span>${fmt(u.hitCount)} hit${u.hitCount===1?'':'s'} · ${fmt(Math.round(u.damage))} damage</span></div>`).join('');
 const stats=`<p class="hint">${fmt(r.skillObservations?.length||0)} skill observations · ${fmt(r.damageHitEvents?.length||0)} damage hits · ${attempts.length} encounters</p>`;
 const inspect=`<h3>Skill Uses · ${fmt(recognized.uses.length)}</h3><p class="hint">Skill-specific rules combine action patterns, effects and damage. Unconfigured skills use 0s cooldown and 1 hit per use. Use counts are adjustable as further captures establish each skill's behavior.</p>`+
  `<div class="row"><label>Player <select id="skill-evidence-player">${personOptions}</select></label><label>Attempt / scope <select id="skill-evidence-attempt">${scopeOptions}</select></label></div>`+
  `<div class="scroll"><table><thead><tr><th>Skill</th><th>Uses</th><th>Hits</th><th>Damage</th><th>Cooldown</th><th>Hits/use</th></tr></thead><tbody>${recognized.skills.slice(0,150).map(rowHtml).join('')||'<tr><td colspan="6">No skill activity identified in this selection.</td></tr>'}</tbody></table></div>`+
  `<details><summary>Skill Uses Timeline · ${fmt(recognized.uses.length)}</summary><div class="rh-sequence">${eventRows||'<p>No skill uses found.</p>'}</div>${recognized.uses.length>300?'<p class="hint">Showing the first 300 uses.</p>':''}</details>`;
 const html=pane('Report inspection: '+esc(r.name),`<p>${esc(r.encounter)} · ${r.duration}s</p>${stats}<p class="hint">Skill timelines and encounter windows use session-relative timestamps; HTML chart control labels do not determine imports.</p><div class="scroll"><table><tr><th>Player</th><th>Damage skills</th><th>Recorded deaths</th></tr>${r.players.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.skills.length}</td><td>${p.deathTimes===null?'unknown':p.deathTimes.length}</td></tr>`).join('')}</table></div><h3>Boss HP samples</h3><p>${target?esc(target.name)+' · '+target.hp.length+' samples · observed zero: '+(target.zeroHpObserved?'yes':'no'):(r.boss?.hp?.length||0)+' legacy percentage samples'}</p>${player?inspect:'<p class="hint">Structured player IDs unavailable; this report supports legacy damage viewing only.</p>'}`);
 const host=$('report-detail');if(!host)return;host.innerHTML=html;
 $('skill-evidence-player')?.addEventListener('change',e=>{skillInspectPlayerId=e.target.value;inspectReport(i)});
 $('skill-evidence-attempt')?.addEventListener('change',e=>{skillInspectAttempt=e.target.value;inspectReport(i)});
 host.scrollIntoView({block:'nearest'});
}
function rotation(){if(state.arcana==='future')return pane('Future Arcana modules','<p>More adventures coming soon.</p>');return state.arcana==='dd'?dd():as()}
function dd(){return window.MIDIR_THETA?.view?.()||'<p>Containment module is unavailable.</p>'}

function as(){const a=D.arcana.as,skills=a.skills,settings=state.asSkillSettings;return `<h2>Alchemic Sharpshooter · Arcana Simulators</h2><p class="muted">Decisiveness and fluent execution. Configure your actual keybinds, practice a sequence, then experiment with positioning.</p><div class="cols"><div>${pane('Keyboard practice',`<p>Click <strong>Begin</strong>, then use your keyboard. Cooldown and action-lock timers are simulated, not measured gameplay latency.</p><div class="skillbar" id="as-skillbar">${skills.map(s=>skillTile(s,settings)).join('')}</div><label>Practice sequence (keys, separated by spaces or commas)<input style="width:100%" id="as-sequence" value="${esc(state.asSequence)}"></label><div class="row"><label>Session length (seconds)<input type="number" id="as-duration" min="15" max="600" value="${state.settings.asDuration}"></label></div>${buttons([['Begin keyboard practice','as-start','primary'],['Finish and reflect','as-stop']])}<p class="hint">Only keyboard events while this page is focused. A key press inside an input is ignored. This is snapshot builder, not an exact combat simulator.</p><div id="as-live"><div class="log" id="as-log">Ready to begin.</div></div>`)}${pane('Build a rotation',`<p>Skill interactions and cooldowns use documented baselines. Configure the simulated inputs below.</p><div class="scroll"><table><tr><th>Skill</th><th>Key</th><th>CD (s)</th><th>Action time (s)</th></tr>${skills.map(s=>{const c=settings[s.id]||{};return `<tr><td>${esc(s.name)}</td><td><input aria-label="${esc(s.name)} key" data-sk="${s.id}" data-field="key" maxlength="10" value="${esc(c.key??s.key)}" style="width:65px"></td><td><input type="number" data-sk="${s.id}" data-field="cd" value="${c.cd??s.cd}" min="0" step=".1" style="width:75px"></td><td><input type="number" data-sk="${s.id}" data-field="lock" value="${c.lock??s.lock}" min="0" step=".1" style="width:75px"></td></tr>`}).join('')}</table></div>${buttons([['Save practice settings','as-config'],['Load Magnum → Urgent → Volley','as-pattern:0'],['Load Fire/Water cycle','as-pattern:1']])}`)}</div><div>${pane('Skill knowledge',skills.map(s=>`<div class="lesson">${window.MIDIR_ICONS?.skills?.[s.id]?`<img class="midir-inline-icon" src="${esc(window.MIDIR_ICONS.skills[s.id])}" alt="">`:``}<strong>${esc(s.name)}</strong> · ${s.cd}s base CD<p class="hint">${esc(s.note)}</p></div>`).join(''))}${positionLab()}${pane('Rotational experiment',`<p>Use the patterns you practice in-game, then compare the resulting imported skill damage. More button presses are only useful if projected effective damage also improves.</p><p class="hint">This version does not infer casts from multi-hit damage events or assume a critical multiplier. Session comparison is limited to directly reported hit and damage statistics.</p>`)}</div></div>`}
function positionLab(){const pos=[[40,150],[100,185],[180,185]],p=pos[runtime.position]||pos[0],enemies=[[145,65],[198,87],[230,55],[268,104],[218,150],[305,146]],attack=runtime.attack;const dx=attack==='line'?260:240;let shape=attack==='line'?`<rect x="${p[0]}" y="${p[1]-22}" width="${Math.min(320-p[0],dx)}" height="44" fill="#2fbab0" fill-opacity=".20" stroke="#6be5d9"/>`:`<path d="M${p[0]} ${p[1]} L${p[0]+200} ${p[1]-125} L${p[0]+200} ${p[1]+125} Z" fill="#2fbab0" fill-opacity=".20" stroke="#6be5d9"/>`;let hit=enemies.filter(e=>{const x=e[0]-p[0],y=e[1]-p[1];return attack==='line'?x>=0&&x<260&&Math.abs(y)<22:x>=0&&x<240&&Math.abs(y)<x*.625}).length;return pane('Positioning Lab · Where do you want to be?',`<p>Switch positions and visualize a simplified line or cone attack. These are illustrative, not calibrated Mabinogi hitboxes.</p><svg class="scenario-svg" viewBox="0 0 340 220" role="img" aria-label="Six enemies and your selected attack coverage">${shape}${enemies.map(e=>`<circle cx="${e[0]}" cy="${e[1]}" r="10" fill="#b64b65" stroke="#f5b6c4"/>`).join('')}<circle cx="${p[0]}" cy="${p[1]}" r="12" fill="#2864cc" stroke="#e6ecfb"/><text x="${p[0]}" y="${p[1]+27}" text-anchor="middle" fill="#fff" font-size="11">You</text></svg><div class="button-row">${['Left approach','Center flank','Lower flank'].map((label,i)=>`<button class="${runtime.position===i?'primary':''}" data-act="pos:${i}">${label}</button>`).join('')}</div><div class="button-row"><button class="${attack==='cone'?'primary':''}" data-act="shape:cone">Cone</button><button class="${attack==='line'?'primary':''}" data-act="shape:line">Line</button></div><p><strong>Illustrative coverage: ${hit} / 6 targets.</strong></p><p>What do you do next—attack immediately or spend time improving coverage? Your choice depends on cooldowns and the encounter, not a single correct answer.</p>${buttons([['Commit: attack now','position-commit:attack'],['Commit: reposition first','position-commit:move']])}<p id="position-feedback" class="hint">Choose deliberately, then reflect.</p>`)}
function skillTile(s,settings){const c=settings[s.id]||{};return `<div class="skill" data-skill="${s.id}"><div class="kbd">${esc(c.key??s.key)}</div>${window.MIDIR_ICONS?.skills?.[s.id]?`<img class="midir-skill-icon" src="${esc(window.MIDIR_ICONS.skills[s.id])}" alt="" loading="lazy">`:``}<strong>${esc(s.name)}</strong><small>${c.cd??s.cd}s CD</small><span class="cool">Ready</span></div>`}
function startAS(){stopTimers();const seconds=Math.min(600,Math.max(15,Number($('as-duration').value)||60));state.settings.asDuration=seconds;state.asSequence=$('as-sequence').value;save();const sk=D.arcana.as.skills.map(s=>({...s,...(state.asSkillSettings[s.id]||{})}));runtime.as={begin:performance.now(),end:performance.now()+seconds*1000,skills:sk,ready:{},lock:0,actions:[],sequence:state.asSequence.split(/[\s,]+/).filter(Boolean),index:0};const log=$('as-log');if(log)log.textContent='Active. Use configured keys.';interval(()=>{const a=runtime.as;if(!a)return;const now=performance.now();for(const s of a.skills){const node=document.querySelector(`[data-skill="${s.id}"] .cool`);if(node){let remain=Math.max(0,(a.ready[s.id]||0)-now)/1000;node.textContent=remain>0?remain.toFixed(1)+'s':'Ready';node.closest('.skill').classList.toggle('ready',!remain)}}if(now>=a.end)stopAS()},140)}function logAS(s){const el=$('as-log');if(el){el.textContent=s+'\n'+el.textContent;el.scrollTop=0}}function asKey(e){const a=runtime.as;if(!a||e.repeat||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;const sk=a.skills.find(s=>String(s.key).toLowerCase()===e.key.toLowerCase());if(!sk)return;e.preventDefault();const now=performance.now();if((a.ready[sk.id]||0)>now){logAS(sk.name+': on cooldown');return}if(a.lock>now){logAS(sk.name+': simulated action lock');return}a.ready[sk.id]=now+Number(sk.cd)*1000;a.lock=now+Number(sk.lock)*1000;a.actions.push({skill:sk.id,time:(now-a.begin)/1000});let expected=a.sequence[a.index%Math.max(1,a.sequence.length)];if(expected&&expected===sk.key){a.index++;logAS('✓ '+sk.name+' · '+((now-a.begin)/1000).toFixed(1)+'s')}else logAS(sk.name+' · '+((now-a.begin)/1000).toFixed(1)+'s (expected key '+(expected||'any')+')')}
function stopAS(){let a=runtime.as;if(!a)return;let elapsed=Math.max(1,(performance.now()-a.begin)/1000);state.drillHistory.push({type:'as',date:Date.now(),actions:a.actions.length,seconds:elapsed,sequence:state.asSequence});stopTimers();save();const box=$('as-live');if(box)box.innerHTML=`<div class="notice ok"><strong>Practice finished.</strong><p>${a.actions.length} accepted simulated actions in ${elapsed.toFixed(1)} seconds (${(a.actions.length*60/elapsed).toFixed(1)} actions/min). This measures keyboard practice only, not observed gameplay APM or quality.</p><p>Did the pattern feel fluent? Edit, repeat, or test it in game. You make the assessment.</p></div>`}
const debuffCards=[
 {id:'phys',name:'Defense/Protection Decreased',category:'Defense/Protection Decreased',symbol:'↘',desc:'A shared boss status category for physical Defense and Protection reductions. Spinning Uppercut, Smokescreen, and Fateweaver may contribute here. An icon does not prove which skill applied it.',why:'Check this category rather than demanding a separate Uppercut icon. Stronger applications and longer durations take priority within the type.'},
 {id:'magic',name:'Magic Defense/Magic Protection Decreased',category:'Magic Defense/Magic Protection Decreased',symbol:'♨',desc:'A shared status category for reductions to Magic Defense and Magic Protection. Hydra Transmutation, Smokescreen, and Fateweaver may contribute. The icon is a category, not a specific caster or skill.',why:'Look for the magic-defense reduction category; Hydra is one possible source, not an independent mandatory status slot.'},
 {id:'amp',name:'Increased Damage Taken',category:'Increased Damage Taken',symbol:'✦',desc:'The shared damage-amplification status. Support Shot, Death Mark and applicable other effects can contribute. A visible category icon does not tell you which skill applied the strongest effect.',why:'The strongest effect and longest duration take priority among applications of the same type.'},
 {id:'deathmark',name:'Death Mark',category:'Death Mark · separate status',symbol:'✧',desc:'Death Mark now has a separate Death Mark status icon as well as its Increased Damage Taken contribution. Practice recognizing the mark itself separately from the shared damage-amplification indicator.',why:'A Death Mark icon and an Increased Damage Taken icon convey different pieces of status information.'},
 {id:'uppercut',name:'Spinning Uppercut',category:'Source skill → physical reduction',symbol:'↘',desc:'Combo: Spinning Uppercut reduces Defense and Protection. After the April 2026 update, teach its contribution via the shared Defense/Protection Decreased status rather than treating its original condition icon as an always-independent layer.',why:'At highest Human rank, the notes list 22% Defense then 103 flat, and 11% Protection then 23 flat.'},
 {id:'hydra',name:'Hydra Transmutation',category:'Source skill → magic reduction',symbol:'♨',desc:'Hydra applies Magic Defense and Magic Protection reduction. After the update it contributes to the shared magic-reduction category, so seeing this category is not proof Hydra specifically was used.',why:'At highest Human rank, the notes list 22% then 105 Magic Defense, and 11% then 31 Magic Protection reductions.'},
 {id:'smoke',name:'Smokescreen',category:'Source skill → both reduction categories',symbol:'☁',desc:'Smokescreen provides area coverage for both physical and magical defensive reductions, and can populate both shared reduction categories. You may recognize the reduction icons without a unique Smokescreen icon.',why:'Percentage-based reductions are applied before flat reductions. Strongest effects and longest durations prevail within each status category.'},
 {id:'support',name:'Support Shot',category:'Source skill → increased damage taken',symbol:'➶',desc:'Support Shot contributes to Increased Damage Taken, not a unique required amplification icon. The April notes list 48% increased damage dealt to the target at the stated reference rank.',why:'A shared damage-taken icon can come from more than one source. Do not infer the specific skill from the status alone.'},
 {id:'kartbomb',name:'Kart Bomb',category:'Unique defense reduction · condition 598',symbol:'💣',desc:'Kart Bomb applies its own defense reduction, shown by the Water Balloon condition icon. Look for that specific icon on the boss rather than the generic damage amplification icon.',why:'Its dedicated Water Balloon status counts separately toward Full Party Coverage, regardless of who applied it.'},
 {id:'mark',name:'Death Mark · damage amplification',category:'Source skill → increased damage taken',symbol:'✦',desc:'Death Mark supplies an Increased Damage Taken effect and also has its own Death Mark status icon. The two should be recognized separately.',why:'The April notes list a 53% increased damage taken value for Death Mark at the stated reference rank.'},
 {id:'reversal',name:'Aspect of Reversal',category:'Fateweaver · healing on hit',symbol:'✚',desc:'Each hit on the afflicted target returns 100 HP to the attacker. Its distinct status shows that Fateweaver was used.',why:'Not damage amplification and not defense reduction. Aspect of Reversal status is the icon to look for.'},
 {id:'fate',name:'Fateweaver · five aspects',category:'Fateweaver · distinct aspects',symbol:'⌛',desc:'Fateweaver has Reversal, Might, Swiftness, Fortification and Focus. Reversal gives the attacker 100 HP back each time they hit the affected target; its icon confirms Fateweaver appeared in the fight. Focus is rarely chosen.',why:'Aspect of Reversal (condition 515) is healing-on-hit, not amplification or defense reduction; it independently satisfies Fateweaver’s Full Party Coverage slot.'},
 {id:'astrology',name:'Astrology support effects',category:'Conditional shared reductions / amplification',symbol:'✳',desc:'Selected Celestial Conjunction board effects may contribute reduction or increased-damage-taken categories. These depend on the character’s actual board setup.',why:'The April update revised lower-defense and increased-damage-taken aspects. Do not assume a specific option is equipped.'},
 {id:'pet1',name:'Ceraunus / Mir Dragon · Lightning Debuff',category:'Pet condition · Ceraunus / Mir Dragon',symbol:'⚡',desc:'Lightning Wave (504) from Ceraunus and Lightning Breath (392) from Mir Dragon use the identical status artwork and represent one shared Lightning Debuff effect.',why:'Recognize Lightning Wave and Lightning Breath as the same effect, despite their different names and source pets. Either condition counts for the single pet-defense slot; simultaneous applications do not create two coverage slots.'},
 {id:'bonedash',name:'Bone Dragon · Devil’s Dash',category:'Pet condition · Bone Dragon',symbol:'Ⅱ',desc:'Bone Dragon’s Devil’s Dash status is named Bone Dragon Devil’s Dash. Learn its own artwork as a pet-condition recognition cue, without treating it as proof of an extra independent April reduction category.',why:'Exact artwork from Bone Dragon’s Devil’s Dash status. A condition icon does not by itself establish the precise magnitude or independent stacking of the defense reduction.'},
 {id:'purrcharge',name:'Purrling · Furious Charge',category:'Pet condition · Purrling',symbol:'🐾',desc:'Purrling’s Furious Charge status is named Purrling’s Furious Charge. Its status art is distinct from the shared physical-reduction category.',why:'Exact Purrling’s Furious Charge status icon. The April update addresses stronger/weaker Bone Dragon and Purrling effects; do not assume simultaneous applications add together.'},
 {id:'clover',name:'Bunbun · Lucky Clover',category:'Pet mark · Bunbun / Foxyquinn',symbol:'♣',desc:'Lucky Clover (condition 1138) is Bunbun’s version of the shared pet mark effect. Foxyquinn’s Mark (716) is equivalent for debuff tracking, despite its different condition ID and visual artwork.',why:'Either Lucky Clover or Foxyquinn’s Mark fulfills the same pet damage-amplification coverage slot. Observing both does not grant two independent slots or achievement credits; individual stack-strength interactions may still matter in-game.'},
 {id:'foxy',name:'Foxyquinn’s Mark',category:'Pet mark · Foxyquinn / Bunbun',symbol:'✿',desc:'Foxyquinn’s Mark (condition 716) is Foxyquinn’s version of the shared pet mark effect. Lucky Clover (1138) from Bunbun fulfills the same debuff requirement even though the status icons differ.',why:'Recognize either icon as the same tracked pet damage-amplification slot. Two pet marks do not count as two independent debuff groups; strength and stacking behavior must be evaluated separately.'},
 {id:'pet2',name:'Bone Dragon / Purrling interactions',category:'Pet source interaction · strength priority',symbol:'Ⅱ',desc:'Review the distinct Devil’s Dash and Furious Charge icons, then decide how the April shared-effect priority rules affect the combined result.',why:'Source interactions are not an extra independently stacking category; see the individually mapped Bone Dragon and Purrling cards.'},
 {id:'petamp',name:'Lucky Clover / Foxyquinn’s Mark interactions',category:'Pet mark interaction · strength priority',symbol:'♥',desc:'Lucky Clover and Foxyquinn’s Mark are two source-specific indicators of one debuff group, not two required effects. Account for the in-game override rules separately.',why:'Foxyquinn’s Mark overrides one Clover Sign stack, but not two or more according to the April update.'},
 {id:'protectionmax',name:'Protection Max Decreased',category:'Protection ceiling reduction · Brionac/Fragarach',symbol:'🛡',desc:'A distinct maximum-Protection reduction condition used when learning Brionac/Fragarach protection peeling. Look for the distinct status icon.',why:'Recognize the specific Protection Max Decreased icon separately from the April shared Defense/Protection Decreased category. The icon alone does not prove which weapon or skill applied it.'},
 {id:'magicprotectionmax',name:'Magic Protection Max Decreased',category:'Magic Protection ceiling reduction · Brionac/Fragarach',symbol:'◇',desc:'A distinct maximum-Magic-Protection reduction status. Look for the distinct status icon.',why:'This is not the same as the April shared Magic Defense/Magic Protection Decreased category. Match the actual status artwork, not just the words Protection Decreased.'},
 {id:'peel',name:'Brionac / Seal: Fragarach',category:'Protection peeling · distinct mechanic',symbol:'⚔',desc:'Repeated-hit Protection peeling is a separate kind of mechanic from identifying an April 2026 shared status category.',why:'Do not count it as an extra shared debuff icon merely because Protection is involved.'},
 {id:'pall',name:'Pall of Ruination',category:'Harmonic Saint · special burst effect',symbol:'♫',desc:'A short party-controlled burst opportunity. A brief party-wide damage window. Recognize it, communicate it, and make those moments count.',why:'Coordinate this moment with the party before committing your strongest attacks.'}
];
const debuffTracks=[
 {title:'Learn the three status categories',body:'Since the April 2026 update, multiple skills feed the same three visible debuff categories. Identify which category is absent instead of treating each applying skill as a separate stacking icon.',tags:['phys','magic','amp']},
 {title:'Several skills, one category',body:'Spinning Uppercut contributes to physical reduction; Hydra to magical reduction; Smokescreen can contribute to both. The category icons do not identify which source applied them.',tags:['phys','magic','uppercut','hydra','smoke']},
 {title:'Recognize damage amplification and Death Mark',body:'Support Shot and Death Mark can contribute to Increased Damage Taken. Death Mark also has a distinct Mark status. Kart Bomb is a separate defense reduction with its own icon, not damage amplification.',tags:['amp','deathmark','support','kartbomb','mark']},
 {title:'Other contributions and pet effects',body:'Fateweaver and selected Astrology aspects can contribute shared categories. Aspect of Reversal has its own healing-on-hit icon and coverage slot. Lightning Wave and Lightning Breath are interchangeable, as are the Bone Dragon/Purrling effects and Lucky Clover/Foxyquinn’s Mark.',tags:['fate','reversal','astrology','pet1','bonedash','purrcharge','clover','foxy']},
 {title:'Read paired pet status icons',body:'Lucky Clover (Bunbun) and Foxyquinn’s Mark (Foxyquinn) have distinct status icons but fill one pet-mark slot. Devil’s Dash (Bone Dragon) and Furious Charge (Purrling) fill one pet-defense slot. Lightning Wave (Ceraunus) and Lightning Breath (Mir Dragon) share the same icon and fill one Lightning slot.',tags:['clover','foxy','bonedash','purrcharge','pet1']},
 {title:'Protection ceiling effects',body:'Brionac/Fragarach protection peeling can show distinct maximum-Protection indicators. Identify Protection Max Decreased and Magic Protection Max Decreased separately from the April shared defensive reduction categories.',tags:['protectionmax','magicprotectionmax','phys','magic','peel']},
 {title:'What is actually missing?',body:'A missing skill name is not necessarily a missing category. If physical and magical reductions are showing but increased damage taken is absent, consider an available source of that category. Check strength and duration before replacing.',tags:['phys','magic','amp']},
 {title:'Complete the nine coverage groups',body:'Death Mark supports Increased Damage Taken rather than creating a tenth requirement. The Brionac/Fragarach slot needs both maximum-Protection statuses. Kart Bomb adds its own separate defense reduction, while Fateweaver Aspect of Reversal has a distinct healing-on-hit status that counts as the ninth coverage group. Pall of Ruination is an important burst skill, not one of the nine.',tags:['amp','deathmark','kartbomb','protectionmax','magicprotectionmax','reversal','pall']}
];
/* Source-choice Academy: nine coverage groups; pet alternatives are interchangeable; the two max-Protection conditions must co-occur. */
const MISSING_GROUPS={
 phys:['phys'],magic:['magic'],amp:['amp'],
 lightning:['pet1'],petdefense:['bonedash','purrcharge'],petmark:['clover','foxy'],
 protectionPair:['protectionmax','magicprotectionmax'],kart:['kartbomb'],reversal:['reversal']
};
const MISSING_GROUP_NAMES={phys:'Defense/Protection Decreased',magic:'Magic Defense/Magic Protection Decreased',amp:'Increased Damage Taken (including Death Mark)',lightning:'Lightning Debuff',petdefense:'Pet defense · Bone Dragon / Purrling',petmark:'Pet mark · Lucky Clover / Foxyquinn’s Mark',protectionPair:'Protection Max Decreased + Magic Protection Max Decreased',kart:'Kart Bomb · own defense reduction',reversal:'Fateweaver · Aspect of Reversal (healing on hit)'};
const MISSING_SOURCES=[
 {id:'uppercut',name:'Spinning Uppercut',skill:'24201',groups:['phys'],note:'Source of shared physical defensive reduction'},
 {id:'hydra',name:'Hydra Transmutation',skill:'35024',groups:['magic'],note:'Source of shared magical defensive reduction'},
 {id:'smoke',name:'Smokescreen',skill:'26006',groups:['phys','magic'],note:'One skill can cover both shared defensive reduction groups'},
 {id:'support',name:'Support Shot',skill:'21006',groups:['amp'],note:'Source of increased-damage-taken category'},
 {id:'kartbomb',name:'Kart Bomb',symbol:'💣',groups:['kart'],note:'Own defense reduction effect; represented by the Water Balloon status icon'},
 {id:'deathmark',name:'Death Mark',skill:'27010',groups:['amp'],note:'Death Mark contributes to Increased Damage Taken; not an extra required category'},
 {id:'fate',name:'Fateweaver (debuff aspects)',skill:'58011',groups:['phys','magic','reversal'],conditional:true,note:'Aspect of Reversal restores 100 HP to the attacker per hit on its target; distinct from defense reduction and damage amplification. Other aspects include Might, Swiftness, Fortification and Focus.'},
 {id:'astro',name:'Celestial Conjunction',skill:'27208',groups:['phys','magic','amp'],conditional:true,note:'Specific board aspects determine which categories it can apply'},
 {id:'brionac',name:'Brionac',symbol:'⚔',groups:['protectionPair'],note:'Protection peeling family; pair is treated as inseparable in this trainer'},
 {id:'fragarach',name:'Seal: Fragarach',skill:'58018',groups:['protectionPair'],note:'Protection peeling family; pair is treated as inseparable in this trainer'},
 {id:'ceraunus',name:'Ceraunus',symbol:'⚡',groups:['lightning'],note:'Lightning Wave · condition 504 · same effect as Lightning Breath'},
 {id:'mir',name:'Mir Dragon',symbol:'🐉',groups:['lightning'],note:'Lightning Breath · condition 392 · same effect as Lightning Wave'},
 {id:'bone',name:'Bone Dragon',symbol:'🐉',groups:['petdefense'],note:'Devil’s Dash; either Bone Dragon or Purrling satisfies one shared pet-defense slot'},
 {id:'purr',name:'Purrling',symbol:'🐈',groups:['petdefense'],note:'Furious Charge; either Purrling or Bone Dragon satisfies one shared pet-defense slot'},
 {id:'bunbun',name:'Bunbun',symbol:'♣',groups:['petmark'],note:'Lucky Clover · condition 1138 · same tracked effect as Foxyquinn’s Mark'},
 {id:'foxy',name:'Foxyquinn',symbol:'🦊',groups:['petmark'],note:'Foxyquinn’s Mark · condition 716 · same tracked effect as Lucky Clover'}
];
/* Procedural scenarios use the nine coverage slots. Pet alternatives are OR; Brionac/Fragarach max-protection pair is AND. */
const MISSING_POOL=Object.keys(MISSING_GROUPS);
const missingPractice={current:null,recent:[],count:0};
function shuffled(items){const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function generateMissingScenario(){
 let result=null,signature='';
 for(let tries=0;tries<50;tries++){
  const shuffledGroups=shuffled(MISSING_POOL);
  const count=1+Math.floor(Math.random()*3);
  const missing=shuffledGroups.slice(0,count);
  const rest=shuffledGroups.slice(count);
  // Show a varied subset of the other conditions, never merely omit part of the max-decrease pair.
  const present=rest.slice(0,2+Math.floor(Math.random()*(rest.length-1)));
  signature=[missing.slice().sort().join(','),present.slice().sort().join(',')].join('|');
  result={title:'Read the boss conditions',present,missing,
    hint:`${count} ${count===1?'debuff group is':'debuff groups are'} missing from this example. Select one or more sources that can fill the gaps.`};
  if(!missingPractice.recent.includes(signature))break;
 }
 missingPractice.recent.push(signature);
 if(missingPractice.recent.length>25)missingPractice.recent.shift();
 missingPractice.current=result;
 missingPractice.count++;
 return result;
}
function missingSkillIcon(src){const icon=src.skill&&MISSING_SKILL_ICONS[src.skill];return icon?`<img class="missing-source-image" src="${esc(icon)}" alt="" loading="lazy">`:`<span class="missing-source-placeholder" aria-hidden="true">${src.symbol||'?'}</span>`}
const MISSING_SKILL_ICONS={"24201": "assets/icons/skills/gui_icon_skill_002_2_4.png", "35024": "assets/icons/skills/gui_icon_skill_003_0_2.png", "26006": "assets/icons/skills/gui_icon_skill_003_0_5.png", "21006": "assets/icons/skills/gui_icon_skill_000_0_7.png", "27010": "assets/icons/skills/gui_icon_skill_003_1_15.png", "58011": "assets/icons/skills/gui_icon_skill_004_7_6.png", "27208": "assets/icons/skills/gui_icon_skill_005_7_11.png", "58018": "assets/icons/skills/gui_icon_skill_005_1_0.png"};
function missingCovered(selected){const out=new Set;for(const id of selected){const src=MISSING_SOURCES.find(s=>s.id===id);if(src)for(const group of src.groups)out.add(group)}return out}
function missingScenario(){return missingPractice.current||generateMissingScenario()}
function renderMissing(){const u=academyUI,q=missingScenario(),picked=new Set(u.missingSelected||[]),covered=missingCovered(picked),uncovered=q.missing.filter(g=>!covered.has(g));const possibleSources=MISSING_SOURCES;
 const visible=[...new Set(q.present)].flatMap(g=>{const ids=MISSING_GROUPS[g];return (g==='petdefense'||g==='petmark')?[ids[(missingPractice.count+['petdefense','petmark'].indexOf(g))%ids.length]]:ids});
 const sourceCards=possibleSources.map(src=>`<button type="button" class="missing-source-card ${picked.has(src.id)?'is-selected':''}" aria-pressed="${picked.has(src.id)}" data-act="acad-source:${src.id}">${missingSkillIcon(src)}<span class="missing-source-copy"><strong>${esc(src.name)}</strong><small>${esc(src.groups.map(g=>MISSING_GROUP_NAMES[g]).join(' · '))}</small></span>${src.conditional?'<span class="missing-conditional">Config dependent</span>':''}</button>`).join('');
 const coverage=q.missing.map(group=>`<div class="missing-coverage-row"><span>${covered.has(group)?'✓':'○'} ${esc(MISSING_GROUP_NAMES[group])}</span><span class="hint">${covered.has(group)?'Covered by selection':'Not selected'}</span></div>`).join('');
 const answerGuide=q.missing.map(group=>`<div class="missing-answer-group"><strong>${esc(MISSING_GROUP_NAMES[group])}</strong><div class="hint">${esc(MISSING_SOURCES.filter(src=>src.groups.includes(group)).map(src=>src.name+(src.conditional?' (configuration dependent)':'')).join(' · '))}</div></div>`).join('');
 return `<h2>New Debuff, Who This?</h2>${buttons([['← Academy menu','acad-mode:home']])}<p class="muted">Read the boss's condition icons, then choose one or more skills or pet sources that could add the missing groups. More than one answer may work; select multiple sources if you like.</p>${pane('Situation '+missingPractice.count+' · '+esc(q.title),`<p class="academy-narrative">${esc(q.hint)}</p><h3>Already showing on the boss</h3><div class="debuff-strip">${visible.map(statusToken).join('')}</div><p class="hint">Paired pet alternatives each count as one group: Bone Dragon or Purrling, Ceraunus or Mir Dragon, and Bunbun or Foxyquinn. Death Mark belongs to Increased Damage Taken. The two Max Decreased indicators must BOTH be present for their shared protection-peel group. Source icons are possible applications, not proof of a particular caster.</p><h3>Choose source skills or pets</h3><div class="missing-source-grid">${sourceCards}</div><p class="hint">Known skill icons are shown where available. Pet summons and Brionac use labeled placeholders, not invented skill artwork.</p><div class="button-row"><button data-act="acad-explain" class="primary">Reveal missing groups & sources</button><button data-act="acad-source-clear">Clear selections</button><button data-act="acad-missing-next">Next situation →</button></div>${u.shown?`<div class="lesson"><h3>Missing groups</h3>${coverage}<p class="hint">${uncovered.length?'Still missing from your selections: '+uncovered.length+' group(s).':'Your selected sources cover every missing group in this example.'} Conditional skill aspects and source availability must be checked in-game. </p><h3>Source reference — all applicable choices</h3>${answerGuide}${buttons([['Save practice reflection','acad-reflect']])}</div>`:''}`)}`;
}
const iconCardIds=debuffCards.filter(c=>Boolean(window.MIDIR_ICONS?.conditions?.[c.id])).map(c=>c.id);
const validIconIds=new Set(iconCardIds);
let academyUI={missingSelected:[],mode:'home',lesson:0,card:0,flip:false,quizType:'identify',question:0,answer:null,shown:false,seed:0,deck:[],deckPos:0,round:0,lastId:null};
function activeIconIds(){const excluded=new Set(state.academySetAside);return iconCardIds.filter(id=>!excluded.has(id))}
function shuffleDeck(ids,avoid){const deck=ids.slice();for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}if(deck.length>1&&deck[0]===avoid){const i=1+Math.floor(Math.random()*(deck.length-1));[deck[0],deck[i]]=[deck[i],deck[0]]}return deck}
function resetFlashRound(avoid=null){academyUI.deck=shuffleDeck(activeIconIds(),avoid);academyUI.deckPos=0;academyUI.flip=false;academyUI.round+=1}
function currentFlashId(){return academyUI.deck[academyUI.deckPos]||null}
function startFlashDeck(preferred=null){academyUI.round=0;academyUI.lastId=null;resetFlashRound();if(preferred&&academyUI.deck.includes(preferred)){const i=academyUI.deck.indexOf(preferred);[academyUI.deck[0],academyUI.deck[i]]=[academyUI.deck[i],academyUI.deck[0]]}}
function nextFlashCard(){academyUI.lastId=currentFlashId();academyUI.deckPos++;academyUI.flip=false;if(academyUI.deckPos>=academyUI.deck.length)resetFlashRound(academyUI.lastId)}
function setAsideFlashCard(){const id=currentFlashId();if(!id)return;if(!state.academySetAside.includes(id))state.academySetAside.push(id);save();const pending=academyUI.deck.slice(academyUI.deckPos+1).filter(x=>!state.academySetAside.includes(x));if(pending.length){academyUI.deck=pending;academyUI.deckPos=0;academyUI.flip=false;academyUI.lastId=id}else resetFlashRound(id)}
function restoreFlashCard(id){if(!validIconIds.has(id))return;state.academySetAside=state.academySetAside.filter(x=>x!==id);save();const cur=currentFlashId();resetFlashRound(cur)}

window.MIDIR_CUSTOM_CONDITION_ICONS=Object.assign({kartbomb:'assets/icons/conditions/gui_condition_change03_1_7.png',reversal:'assets/icons/conditions/gui_condition_change02_2_3.png'},window.MIDIR_CUSTOM_CONDITION_ICONS||{});
function academyIcon(id){return window.MIDIR_ICONS?.conditions?.[id]||window.MIDIR_CUSTOM_CONDITION_ICONS?.[id]||null}
function academySourceIcons(ids){return `<div class="academy-source-icons">${ids.map(id=>{const src=MISSING_SOURCES.find(s=>s.id===id);if(!src)return '';const file=src.skill&&MISSING_SKILL_ICONS[src.skill];return `<span class="academy-source-icon" title="${esc(src.name)}">${file?`<img src="${esc(file)}" alt="" loading="lazy">`:`<span class="academy-source-fallback">${esc(src.symbol||'•')}</span>`}<small>${esc(src.name)}</small></span>`}).join('')}</div>`}
const ACADEMY_LESSON_SKILLS=[['uppercut','hydra','smoke','support','deathmark'],['uppercut','hydra','smoke','fate'],['support','deathmark'],['fate','astro','ceraunus','mir'],['bone','purr','bunbun','foxy'],['brionac','fragarach'],['smoke','support','deathmark'],['deathmark','fragarach','fate']];
function academyLibrarySourceIcons(id){const sources={phys:['uppercut','smoke','fate'],magic:['hydra','smoke','fate'],amp:['support','deathmark','astro'],deathmark:['deathmark'],uppercut:['uppercut'],hydra:['hydra'],smoke:['smoke'],support:['support'],mark:['deathmark'],fate:['fate'],astrology:['astro'],peel:['brionac','fragarach'],protectionmax:['brionac','fragarach'],magicprotectionmax:['brionac','fragarach'],pall:[]};return academySourceIcons(sources[id]||[])}
function statusToken(id){const c=debuffCards.find(x=>x.id===id);if(!c)return '';const icon=academyIcon(id);return `<span class="debuff-token" title="${icon?'Status icon':'Effect reference'} · ${esc(c.name)}">${icon?`<img class="midir-condition-icon" src="${esc(icon)}" alt="${esc(c.name)} status icon">`:`<span class="debuff-glyph">${c.symbol}</span>`}<span class="debuff-token-label">${esc(c.category)}</span></span>`}
const FIELD_GUIDE_GROUPS=[
 {name:'Defense reduction',ids:['phys'],summary:'Shared Defense/Protection Decreased status; multiple skills may apply it.'},
 {name:'Magic defense reduction',ids:['magic'],summary:'Shared Magic Defense/Magic Protection Decreased status.'},
 {name:'Damage amplification',ids:['amp'],summary:'Increased Damage Taken status; Death Mark, Support Shot and other sources contribute to the same slot.'},
 {name:'Protection peeling',ids:['protectionmax','magicprotectionmax'],summary:'Both maximum-Protection statuses are required together.'},
 {name:'Pet defense · Bone Dragon / Purrling',ids:['bonedash','purrcharge'],summary:'Either pet effect satisfies this coverage slot.'},
 {name:'Pet defense · Ceraunus / Mir Dragon',ids:['pet1'],summary:'Lightning Wave (Ceraunus, 504) and Lightning Breath (Mir Dragon, 392) count as one effect.'},
 {name:'Pet damage amplification · Bunbun / Foxyquinn',ids:['clover','foxy'],summary:'Lucky Clover (1138) or Foxyquinn’s Mark (716) satisfies the same slot. Both together count once.'},
 {name:'Kart Bomb',ids:['kartbomb'],summary:'Its Water Balloon status is a separate defense-reduction slot.'},
 {name:'Fateweaver · Aspect of Reversal',ids:['reversal'],summary:'Healing on hit; a distinct slot, not damage amplification.'}
];
function academyGuideEntry(c){const index=debuffCards.indexOf(c);return `<button class="debuff-entry ${index===academyUI.card?'selected':''}" data-act="acad-card-home:${index}">${statusToken(c.id)}<span><strong>${esc(c.name)}</strong></span></button>`}
function academyLandingLibrary(){
 const primary=new Set(FIELD_GUIDE_GROUPS.flatMap(g=>g.ids));
 const sourceCards=debuffCards.filter(c=>!primary.has(c.id));
 const selected=debuffCards[academyUI.card]||debuffCards[0];
 return `<section class="card academy-reference"><div class="academy-reference-heading"><div><h2>Debuff Field Guide</h2><p class="muted">Nine distinct groups are used by the Full Party Coverage achievement. Identify the boss's status icons; more than one skill or pet can fulfill some groups.</p></div><span class="academy-reference-count">9 coverage groups</span></div>
 <div class="academy-guide-groups">${FIELD_GUIDE_GROUPS.map((group,i)=>`<section class="academy-guide-group"><h3><span class="academy-group-number">${i+1}</span> ${esc(group.name)}</h3><p class="hint">${esc(group.summary)}</p><div class="academy-group-entries">${group.ids.map(id=>debuffCards.find(c=>c.id===id)).filter(Boolean).map(academyGuideEntry).join('')}</div></section>`).join('')}</div>
 <details class="academy-guide-extra"><summary>Skill sources and additional effects</summary><p class="hint">These explain which skills can apply the groups above. They are not additional Full Party Coverage slots.</p><div class="academy-library academy-library-inline">${sourceCards.map(academyGuideEntry).join('')}</div></details>
 <div class="academy-reference-detail">${pane(selected.name,`<p class="academy-narrative">${esc(selected.desc)}</p>${academyLibrarySourceIcons(selected.id)}<p class="hint">${esc(selected.why)}</p>`)}</div></section>`;
}

function debuff(){let u=academyUI;let back=buttons([['← Return to Debuff Academy','acad-mode:home']]);if(u.mode==='home')return `<h2>Debuff Academy</h2><p class="muted">Spot the debuffs. Set up your burst.</p><details class="ui-more-help"><summary>How it works</summary><p>Practice an opening, learn effect icons, or find the missing debuff. The Field Guide has more details.</p></details><div class="rotation-shortcuts academy-shortcuts"><button class="rotation-shortcut" data-act="acad-mode:rotation"><strong>Build the Debuff Opening</strong><span>Build your party’s opening.</span></button><button class="rotation-shortcut" data-act="open-academy-flash"><strong>Flash Cards</strong><span>Know them at a glance.</span></button><button class="rotation-shortcut" data-act="acad-mode:missing"><strong>New Debuff, Who This?</strong><span>Find what’s missing.</span></button></div>${academyLandingLibrary()}<section class="card"><h3>Your practice</h3><p class="muted">${state.academyHistory.length} practice rounds completed.</p></section>`;
if(u.mode==='rotation'){const l=debuffTracks[u.lesson];return `<h2>Build the Debuff Opening</h2>${back}<div class="academy-progress"><div class="academy-progress-bar" style="width:${100*(u.lesson+1)/debuffTracks.length}%"></div></div><div class="academy-lesson-steps">${debuffTracks.map((step,i)=>`<button type="button" class="academy-lesson-step ${i===u.lesson?'current':''}" data-act="acad-lesson:${i}" title="${esc(step.title)}">${i+1}</button>`).join('')}</div>${pane('Step '+(u.lesson+1)+' of '+debuffTracks.length+' · '+l.title,`<p class="academy-narrative">${esc(l.body)}</p><div class="debuff-strip">${l.tags.map(statusToken).join('')}</div><h3>Who brings this to the fight?</h3>${academySourceIcons(ACADEMY_LESSON_SKILLS[u.lesson]||[])}<p class="hint">Watch the boss. Time your refresh.</p>${buttons([['← Earlier step','acad-prev'],['Next step →','acad-next','primary'],['I practiced this step','acad-reviewed']])}`)}${pane('Big picture',`<p>Layer your debuffs, then make your move.</p>`)}`}
if(u.mode==='flash'){const id=currentFlashId(),c=debuffCards.find(x=>x.id===id),available=activeIconIds(),setAside=state.academySetAside.map(id=>debuffCards.find(x=>x.id===id)).filter(Boolean);
const management=`<details class="card academy-deck-management"><summary>Set-aside cards (${setAside.length}) · Manage deck</summary><p class="hint">Bring back cards whenever you like.</p>${setAside.length?`<div class="academy-deck-pile">${setAside.map(c=>`<div class="academy-deck-entry">${statusToken(c.id)}<span>${esc(c.name)}</span><button data-act="acad-restore:${esc(c.id)}">Return to deck</button></div>`).join('')}</div>${buttons([['Return all cards to deck','acad-restore-all']])}`:'<p class="hint">No cards set aside yet.</p>'}</details>`;
return `<h2>Flash Cards</h2>${back}<p class="muted">Name that debuff! Set aside cards you know.</p><div class="card academy-flash">${c?`<small>Round ${u.round} · Card ${u.deckPos+1} of ${u.deck.length} · ${available.length} in deck</small><div class="debuff-large has-icon"><img class="flash-condition-icon" src="${esc(academyIcon(c.id))}" alt="Status effect to identify" loading="eager"></div><p class="hint">Know this icon?</p>${u.flip?`<h2>${esc(c.name)}</h2><p>${esc(c.why)}</p>`:'<h3>Which effect does this icon represent?</h3>'}${buttons([[u.flip?'Hide answer':'Reveal answer','acad-flip','primary'],['Next card →','acad-flash-next'],['Set aside · I know this icon','acad-set-aside']])}`:`<h3>All icon cards are set aside.</h3><p>You can bring back individual cards below, or restore the whole deck when you're ready to practice again.</p>${buttons([['Return all cards to deck','acad-restore-all','primary']])}`}</div>${management}<p class="hint">${debuffCards.length-iconCardIds.length} Broader skill and mechanic references are available in the Academy Field Guide.</p>`}

if(u.mode==='missing')return renderMissing();
return back}

function encounter(){return `<h2>Encounter Study · Bri Leith</h2><p class="muted">Prepare for the mechanics with the greatest consequences. Rehearse critical windows without clearing earlier gates.</p><div class="grid">${D.encounters.map((e,i)=>`<div class="card"><h3>${esc(e.name)}</h3><p>${esc(e.description)}</p>${buttons([['View focus','encounter:'+i]])}</div>`).join('')}</div><div id="encounter-extra"></div>${pane('Teaching priorities',`<p><strong>Gate 3 80%:</strong> Learn the three-halo coordination. <strong>Gate 3 40%:</strong> Repeat disciplined execution across five halo kills; a single loss may cascade into a wipe. <strong>Gate 3 60%:</strong> Learn the group's strategy in context; death here is not a Halo Badge penalty.</p><p class="hint">This is encounter preparation, not a 3D mechanic simulator. HP percentages alone do not prove detailed mechanic boundaries when telemetry is sparse.</p>`)}`}
function records(){const r=state.reports;return `<h2>Personal Records & Achievements</h2><p class="muted">Celebrations are separate from drills. Every run has something worth remembering.</p><div class="grid">${D.collectibles.map(c=>{const events=computeCollectibleEvents(c);const balance=events.reduce((sum,x)=>sum+x.delta,0);return `<section class="card record"><small>BRI LEITH · GATE ${c.gate}</small><h3 class="gold">${esc(c.name)}</h3><div class="stat">${balance>=0?'+':''}${balance}</div><p><em>${esc(c.flavor)}</em></p><p class="hint">${events.filter(e=>e.delta!==null).length} recorded result(s). No floor-at-zero assumption.</p>${buttons([['See Awards','evidence:'+c.id]])}</section>`}).join('')}</div>${pane('Player-owned milestones',`<p>Mark an improvement you recognized yourself. These are personal notes, not tool-certified records.</p><div class="row"><input id="milestone" placeholder="e.g. Thunderblight rhythm feels automatic" style="flex:1;min-width:230px">${buttons([['Save milestone','milestone-save','primary']])}</div>${state.marks.slice().reverse().map(m=>`<div class="lesson">${esc(m.text)} <small>${new Date(m.date).toLocaleDateString()}</small></div>`).join('')||'<p class="hint">No personal notes yet.</p>'}`)}${pane('Recent training',`<div class="scroll"><table><tr><th>When</th><th>Experience</th><th>Note</th></tr>${state.drillHistory.slice(-10).reverse().map(d=>`<tr><td>${new Date(d.date).toLocaleDateString()}</td><td>${d.type==='dd'?'DD legacy stage '+(d.stage+1):'AS key practice'}</td><td>${d.type==='dd'?esc(d.mode):d.actions+' simulated actions'}</td></tr>`).join('')||'<tr><td colspan="3">No drill history yet</td></tr>'}</table></div>`)}<div id="record-evidence"></div>`}
/* Reward engine is intentionally strict: only complete evidence permits ±1. Each import is deduplicated and each distinct verified attempt is counted once. */
function hpIntervals(target,percent){if(!target||!Array.isArray(target.hp)||target.hp.length<2)return null;let a=target.hp.map(h=>({t:h.time,p:100*h.currentHp/h.maxHp})).sort((x,y)=>x.t-y.t);const eps=.25;let intervals=[],begin=null,last=null;for(let i=0;i<a.length;i++){let hit=Math.abs(a[i].p-percent)<=eps;if(hit){if(begin===null)begin=a[i].t;last=a[i].t}else if(begin!==null){if(last>begin)intervals.push([begin,last]);begin=null;last=null}}if(begin!==null&&last>begin)intervals.push([begin,last]);return intervals.length?intervals:null}
function gateForTarget(r,gate){const targets=r.targets||[];
 if(r.encounters?.length){return r.encounters.filter(e=>{const races=(e.entityIds||[]).map(id=>targets.find(t=>t.entityId===id)?.raceId).map(Number).concat((e.phases||[]).map(p=>Number(p.raceId)));const label=String(e.label||'');return gate===1?(races.some(v=>v===7600||v===7601)||/vertrag|gate\s*1/i.test(label)):gate===2?(races.includes(7602)||/bronntanas|gate\s*2/i.test(label)):(races.includes(7603)||/midir the beloved|gate\s*3/i.test(label));}).map((e,i)=>{const ts=targets.filter(t=>e.entityIds.includes(t.entityId));return {key:e.id||'canonical-'+i,complete:e.completion==='observed-zero-hp',entry:e,targets:ts,boss:ts.find(t=>t.hp?.length)||ts[0]};});}
if(gate===1){const a=(r.logicalEncounters||[]).filter(x=>x.type==='bri-gate-1-vertrag');return a.map((entry,i)=>({key:'g1-'+i,complete:entry.completion==='verified-clear',entry,targets:targets.filter(t=>entry.entityIds.includes(t.entityId)),boss:targets.find(t=>t.entityId===entry.replacementEntityId)||targets.find(t=>t.entityId===entry.firstEntityId)}))}if(gate===2){return targets.filter(t=>Number(t.raceId)===7602).map(t=>({key:t.entityId,complete:!!t.zeroHpObserved&&t.defeatEvidence==='zero-hp-and-death-flag',boss:t,targets:[t]}))}if(gate===3){return targets.filter(t=>Number(t.raceId)===7603).map(t=>({key:t.entityId,complete:!!t.zeroHpObserved&&t.defeatEvidence==='zero-hp-and-death-flag',boss:t,targets:[t]}))}return []}
// Gate 1 phases belong to different Vertrag entities: 70% to 7600,
// 25% to 7601. A plateau has a start sample near the threshold and a
// subsequent lower-HP sample after the damage-immune giant wave. Treat the
// interval conservatively as HP-observed rather than an exact spawn timestamp.
function gate1PhaseWindow(target,percent){
 if(!target||!Array.isArray(target.hp))return null;
 const samples=target.hp.filter(h=>h.maxHp>0&&Number.isFinite(h.time))
  .map(h=>({time:h.time,p:100*h.currentHp/h.maxHp})).sort((a,b)=>a.time-b.time);
 const at=samples.findIndex(h=>Math.abs(h.p-percent)<=0.27);
 if(at<0)return null;
 const first=samples[at];
 const after=samples.slice(at+1).find(h=>h.p<percent-0.28&&h.time>first.time);
 return after&&after.time>first.time?[first.time,after.time]:null;
}
function awardFor(r,c,player,attempt){if(!Array.isArray(player.deathTimes))return{delta:null,note:'Death timestamps unavailable'};if(!attempt.complete)return{delta:null,note:'No verified clear (failed or unclear attempts make no collection change)'};const boss=attempt.boss;if(!boss)return{delta:null,note:'Boss HP history unavailable'};let sets=c.gate===1
  ? [gate1PhaseWindow(attempt.targets.find(t=>Number(t.raceId)===7600),70),gate1PhaseWindow(attempt.targets.find(t=>Number(t.raceId)===7601),25)].map(x=>x?[x]:null)
  : c.phases.map(percent=>hpIntervals(boss,percent));if(sets.some(x=>x===null))return{delta:null,note:'Cannot bound every required HP phase'};const intervals=sets.flat();if(intervals.some(([a,b])=>a>=b))return{delta:null,note:'Incomplete phase interval'};const died=player.deathTimes.some(d=>intervals.some(([a,b])=>d>=a&&d<=b));return{delta:died?-1:1,note:died?'Recorded death inside designated HP plateau':'No recorded deaths inside designated HP plateaus'}}
function computeCollectibleEvents(c){const out=[];const historical=archiveLedger().collectibles[c.id];if(historical?.qualified){out.push({run:'Lifetime archive',reportId:null,player:state.characterName||'Archived character',delta:historical.delta,note:historical.qualified+' previously evaluated archived attempts'});}const seen=new Set;for(const r of state.reports){if(r.archiveCompact||archiveLedger().sources[r.id])continue;if(r.provenance!=='companion-v1')continue;const attempts=gateForTarget(r,c.gate);for(const a of attempts)for(const p of (chosenPlayer(r)?[chosenPlayer(r)]:[])){const key=[r.id,c.id,a.key,p.entityId||p.name].join('|');if(seen.has(key))continue;seen.add(key);const result=awardFor(r,c,p,a);out.push({run:r.title,reportId:r.id,player:p.name,...result})}}return out}
let openAwardId=null;
const AWARD_RULES={
  1:'Giant Boots celebrate clearing Vertrag of the Deep Roots while staying standing through the 70% and 25% Ancient Giant waves.',
  2:'Bottled Horsepower celebrates defeating Bronntanas and staying on your feet through the 50% phase.',
  3:'Halo Badges celebrate defeating Midir the Beloved and surviving the 80% and 40% halo phases.'
};
function awardDescription(delta){return delta===1?'You earned one! A victorious run through the special challenge.':delta===-1?'A brave clear, but the challenge caught you this time. One collectible slips away.':'No change this time — keep adventuring!'}
function evidence(id){
 const area=$('record-evidence');if(!area)return;
 if(openAwardId===id && area.innerHTML){openAwardId=null;area.innerHTML='';document.querySelectorAll('[data-act^="evidence:"]').forEach(b=>b.setAttribute('aria-expanded','false'));return}
 openAwardId=id;const c=D.collectibles.find(x=>x.id===id);if(!c)return;
 const events=computeCollectibleEvents(c);
 document.querySelectorAll('[data-act^="evidence:"]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.act==='evidence:'+id)));
 area.innerHTML=pane('Awards · '+esc(c.name),`<div class="row between"><p class="hint award-rule">${esc(AWARD_RULES[c.gate])}</p><button data-act="evidence:${esc(id)}" aria-label="Close awards">Close ×</button></div><p class="hint">A clear and the right moments of the fight earn a collectible. When a run cannot be confirmed, your collection stays unchanged.</p><div class="scroll"><table><tr><th>Adventure</th><th>Player</th><th>Award</th><th>Celebration</th></tr>${events.map(e=>`<tr><td>${e.reportId?`<button class="award-run-link" data-act="award-find:${esc(e.reportId)}" title="Find this run among your saved reports">${esc(e.run)} ↘</button>`:esc(e.run)}</td><td>${esc(e.player)}</td><td>${e.delta===null?'No change':e.delta>0?'+'+fmt(e.delta):fmt(e.delta)}</td><td>${esc(e.reportId?awardDescription(e.delta):'Banked lifetime archive awards')}</td></tr>`).join('')||'<tr><td colspan="4">Your next adventure could be your first award!</td></tr>'}</table></div>`);
}
function focusAwardRun(reportId){
 const entry=[...document.querySelectorAll('.vault-report-entry')].find(x=>x.dataset.reportId===reportId);
 if(!entry){message('This report is no longer in your Vault.');return}
 document.querySelectorAll('.vault-report-entry.award-highlight').forEach(x=>x.classList.remove('award-highlight'));
 entry.classList.add('award-highlight');entry.scrollIntoView({behavior:'smooth',block:'center'});
 entry.setAttribute('tabindex','-1');entry.focus({preventScroll:true});
}

// Rendered and dynamically inserted actions share one click handler.
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-act]');if(b&&!b.disabled)action(b.dataset.act)});
function bind(){if(state.page==='imports'){const drop=$('drop');drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over')});drop.addEventListener('dragleave',()=>drop.classList.remove('over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');filesSelected([...e.dataTransfer.files])})}}
function action(s){let [cmd,arg]=s.split(':');if(cmd==='page')return page(arg);if(cmd==='acad-card-home'){academyUI.card=Math.max(0,Math.min(debuffCards.length-1,Number(arg)||0));return render()}if(cmd==='acad-lesson'){academyUI.lesson=Math.max(0,Math.min(debuffTracks.length-1,Number(arg)||0));return render()}if(cmd==='pick')return $('reports-picker').click();if(cmd==='inspect')return inspectReport(Number(arg));if(cmd==='remove'){state.reports.splice(Number(arg),1);save();return render()}if(cmd==='backup'){const blob=new Blob([JSON.stringify({type:'midir-companion-backup',data:state},null,2)],{type:'application/json'});download(blob,'midir-companion-backup.json');return}if(cmd==='restore')return $('backup-picker').click();if(cmd==='pos'){runtime.position=+arg;return render()}if(cmd==='shape'){runtime.attack=arg;return render()}if(cmd==='position-commit'){const el=$('position-feedback');if(el)el.textContent=arg==='attack'?'You committed to immediate execution. Reflect: how much damage opportunity would movement have cost?':'You committed to improving position. Reflect: do the extra potential targets justify the travel?';return}if(cmd==='as-start')return startAS();if(cmd==='as-stop')return stopAS();if(cmd==='as-config'){for(const input of document.querySelectorAll('[data-sk]')){const id=input.dataset.sk,key=input.dataset.field;state.asSkillSettings[id]??={};state.asSkillSettings[id][key]=key==='key'?input.value:Number(input.value)||0}save();return render()}if(cmd==='as-pattern'){const pattern=D.arcana.as.patterns[Number(arg)];state.asSequence=pattern.steps.map(id=>{const skill=D.arcana.as.skills.find(s=>s.id===id);return state.asSkillSettings[id]?.key||skill.key}).join(' ');save();return render()}if(cmd==='acad-mode'){academyUI.mode=arg;academyUI.answer=null;academyUI.missingSelected=[];academyUI.shown=false;if(arg==='flash')startFlashDeck();if(arg==='missing'&&!missingPractice.current)generateMissingScenario();return render()}if(cmd==='acad-prev'){academyUI.lesson=Math.max(0,academyUI.lesson-1);return render()}if(cmd==='acad-next'){academyUI.lesson=Math.min(debuffTracks.length-1,academyUI.lesson+1);return render()}if(cmd==='acad-reviewed'){state.academyHistory.push({kind:'review',lesson:academyUI.lesson,date:Date.now()});save();return message('Practice noted.')}if(cmd==='acad-card'){academyUI.card=+arg;return render()}if(cmd==='acad-flash-card'){academyUI.card=+arg;academyUI.flip=false;academyUI.mode='flash';startFlashDeck(debuffCards[academyUI.card]?.id);return render()}if(cmd==='acad-flip'){academyUI.flip=!academyUI.flip;return render()}if(cmd==='acad-flash-next'){nextFlashCard();return render()}if(cmd==='acad-shuffle'){resetFlashRound(currentFlashId());return render()}if(cmd==='acad-set-aside'){setAsideFlashCard();return render()}if(cmd==='acad-restore'){restoreFlashCard(arg);return render()}if(cmd==='acad-restore-all'){state.academySetAside=[];save();resetFlashRound(currentFlashId());return render()}if(cmd==='acad-source'){const v=new Set(academyUI.missingSelected||[]);v.has(arg)?v.delete(arg):v.add(arg);academyUI.missingSelected=[...v];academyUI.shown=false;return render()}if(cmd==='acad-source-clear'){academyUI.missingSelected=[];academyUI.shown=false;return render()}if(cmd==='acad-explain'){academyUI.shown=true;return render()}if(cmd==='acad-missing-next'){academyUI.question++;generateMissingScenario();academyUI.missingSelected=[];academyUI.shown=false;return render()}if(cmd==='acad-reflect'){state.academyHistory.push({kind:'missing-debuff',question:academyUI.question,selectedSources:[...academyUI.missingSelected],missingGroups:[...missingScenario().missing],date:Date.now()});save();return message('Practice reflection saved without a grade.')}if(cmd==='debuff-prev'){runtime.academy=Math.max(0,runtime.academy-1);return render()}if(cmd==='debuff-next'){runtime.academy=Math.min(D.debuffLessons.length-1,runtime.academy+1);return render()}if(cmd==='debuff-mark'){state.academyHistory.push({kind:'review',lesson:runtime.academy,date:Date.now()});save();return render()}if(cmd==='debuff-choice'){runtime.academyChoice=+arg;runtime.academyReveal=false;return render()}if(cmd==='debuff-reveal'){runtime.academyReveal=true;return render()}if(cmd==='debuff-scenario-next'){runtime.scenario=(runtime.scenario+1)%D.debuffScenarios.length;runtime.academyChoice=null;runtime.academyReveal=false;return render()}if(cmd==='debuff-save'){state.academyHistory.push({kind:'scenario',scenario:runtime.scenario,choice:runtime.academyChoice,date:Date.now()});save();return message('Reflection saved without a grade.')}if(cmd==='encounter')return $('encounter-extra').innerHTML=pane('Encounter focus',`<h3>${esc(D.encounters[+arg].name)}</h3><p>${esc(D.encounters[+arg].description)}</p><p>Discuss the decision you would make when the phase begins. For repeated-critical phases, rehearse the same decision several times.</p>`);if(cmd==='evidence')return evidence(arg);if(cmd==='milestone-save'){const input=$('milestone');if(input.value.trim()){state.marks.push({text:input.value.trim().slice(0,240),date:Date.now()});save();render()}return}}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}$('reports-picker').addEventListener('change',e=>{filesSelected([...e.target.files]);e.target.value='' });document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>page(b.dataset.page)));document.addEventListener('keydown',asKey);document.addEventListener('change',async e=>{if(e.target.id!=='backup-picker'||!e.target.files[0])return;
 const f=e.target.files[0];e.target.value='';if(!(await companionMobileImportCheck([f],'backup')))return;const oldProfile=state;try{
  if(f.size>200*1024*1024)throw Error('Backup exceeds the 200 MB safety limit.');
  const b=JSON.parse(await f.text());const d=b?.data;const archived=b?.archivedHtml||{};const trainingExtras=b?.trainingExtras; if(trainingExtras!==undefined&&(!trainingExtras||typeof trainingExtras!=='object'||Array.isArray(trainingExtras)||JSON.stringify(trainingExtras).length>8*1024*1024))throw Error('Invalid training extras in backup.');if(!archived||typeof archived!=='object'||Array.isArray(archived)||Object.keys(archived).length>1500)throw Error('Invalid archived report backup.');
  if(b?.type!=='midir-companion-backup'||!d||typeof d!=='object'||Array.isArray(d)||!Array.isArray(d.reports)||!Array.isArray(d.marks||[])||!Array.isArray(d.metricMilestones||[]))throw Error('Invalid backup structure.');
  if(d.reports.length>1500||(d.metricMilestones||[]).length>40000||(d.marks||[]).length>10000)throw Error('Backup exceeds record safety limits.');
  const allowedPages=new Set(['vault','rotation','debuff','settings']);
  for(const r of d.reports){if(!r||typeof r!=='object'||typeof r.id!=='string'||r.id.length>160||(!r.archiveCompact&&(!Array.isArray(r.players)||!Array.isArray(r.targets)||r.players.length>200||r.targets.length>5000)))throw Error('Backup contains an invalid report.');}
  const summary=companionPrefs().secretSauce?`Backup preview\n\nReports: ${d.reports.length}\nAchievement milestones: ${(d.metricMilestones||[]).length}\nPersonal notes: ${(d.marks||[]).length}\nCharacter: ${String(d.characterName||'Not set').slice(0,80)}\n\nThis REPLACES the current profile index and progress. Archived HTML files included: ${Object.keys(archived).length}. Continue?`:`Restore this Companion backup?\n\nThis replaces your current profile and saved game and training progress, including preferences.\n\nContinue?`;
  if(!confirm(summary))return;
  const previous=state;state={...state,...d,page:allowedPages.has(d.page)?d.page:'vault'};
  reportAutoArchive();await reportDbWriteBatch(state.reports);
  reportDbReady=true;reportStorageBlocked=false;
  for(const [id,html] of Object.entries(archived)){if(typeof html!=='string'||html.length>40*1024*1024||!d.reports.some(r=>r.id===id))throw Error('Invalid archived HTML entry.');await storeHtml(id,html)}
  if(!save()){state=previous;throw Error('Restore cancelled: not enough browser storage. Your previous in-memory profile was retained.');}
  // Optional in new backups; older backups must not reset an existing herb chest or practice records.
  if(trainingExtras?.herbs)window.MIDIR_HERBS?.importState(trainingExtras.herbs);
  if(trainingExtras?.pig)window.MIDIR_PIG?.importState(trainingExtras.pig);
  if(trainingExtras?.mpRhythm)window.MIDIR_MP_RHYTHM?.importState(trainingExtras.mpRhythm);
  if(trainingExtras?.reforge)window.MIDIR_REFORGE?.importState(trainingExtras.reforge);
  if(trainingExtras?.erg)window.MIDIR_ERG?.importState?.(trainingExtras.erg);if(trainingExtras?.specialUpgrade)window.MIDIR_SPECIAL_UPGRADE?.importState?.(trainingExtras.specialUpgrade);
  if(trainingExtras?.bb)window.MIDIR_BB?.importState(trainingExtras.bb);
  if(trainingExtras?.evTower)window.MIDIR_EV_DEFENSE?.importState?.(trainingExtras.evTower);
  if(trainingExtras?.theta)window.MIDIR_THETA?.importState?.(trainingExtras.theta);
  if(trainingExtras?.vertrag)window.MIDIR_VERTRAG?.importState?.(trainingExtras.vertrag);
  if(trainingExtras?.sgOath)window.MIDIR_SG_OATH?.importState?.(trainingExtras.sgOath);
  if(trainingExtras?.asInvaders)window.MIDIR_AS_INVADERS?.importState?.(trainingExtras.asInvaders);if(trainingExtras?.asBonuses)try{localStorage.setItem('midir-as-crom-global-bonuses-v1',JSON.stringify(trainingExtras.asBonuses))}catch{}
  await archiveCompactAll();render();message('Profile restored. '+Object.keys(archived).length+' interactive HTML archives restored; older backups may require original HTML imports.');
 }catch(err){state=oldProfile;reportStorageBlocked=oldProfile.reportStorage==='indexeddb-v2'&&state.reports.some(r=>!Array.isArray(r.players));reportDbReady=!reportStorageBlocked&&reportDbReady;message('Backup restore failed: '+err.message)}
});
/* Vault v0.3: imported HTML is the primary artifact. JSON remains an optional data-only input.
   An independent IndexedDB object store holds full HTML reports outside localStorage.
   Metrics are computed conservatively from actual exporter fields. */
const vaultDbName='midir-vault-archive-v1';
let reportDbReady=false,reportStorageBlocked=false,reportPageNumber=0;
const reportPageSize=10;let reportArchivePage=0,showReportArchive=false;
function reportIsArchived(r){return r.archived===true}
function reportIsFull(r){
 const observations=Array.isArray(r.skillObservations)&&r.skillObservations.length>0;
 const encounters=Array.isArray(r.encounters)&&r.encounters.some(e=>Array.isArray(e.entityIds)&&e.entityIds.length);
 const bossIds=new Set((r.encounters||[]).flatMap(e=>e.entityIds||[]).map(String));
 const bossHits=(r.damageHitEvents||[]).some(h=>bossIds.has(String(h.targetId))&&Number(h.damage)>0);
 return observations&&encounters&&bossHits;
}
function companionMobileMode(){const ua=navigator.userAgent||'';return !!(navigator.userAgentData?.mobile||/iPhone|iPod|Android.*Mobile/i.test(ua)||(/Android/i.test(ua)&&matchMedia('(pointer: coarse) and (max-width: 900px)').matches))}
function companionActiveReportLimit(){return companionMobileMode()?10:30}
function reportAutoArchive(){let changed=false;for(const r of state.reports){if(r.archived==null&&!reportIsFull(r)){r.archived=true;r.archiveReason='legacy-incomplete';changed=true}}const active=state.reports.filter(r=>!reportIsArchived(r)).reverse();for(const r of active.slice(companionActiveReportLimit())){r.archived=true;r.archiveReason='active-cap';changed=true}return changed}

// Companion 278 — canonical identity survives re-selection and filename changes.
// SHA-256 covers the parsed report's evidence, not mutable Vault display/award fields.
function archiveIdentityPayload(r){return [r.provenance||'',r.sessionStart??null,r.duration??null,
 r.players||[],r.targets||[],r.encounters||[],r.logicalEncounters||[],r.damageHitEvents||[],
 r.skillUseEvents||[],r.skillObservations||[],r.reviveEvents||[],r.reportPlayers||[]];}
async function archiveDigest(value){
 if(!globalThis.crypto?.subtle)throw Error('SHA-256 requires a secure browser context; details kept until available.');
 const bytes=new TextEncoder().encode(value);
 const digest=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
async function archiveParsedFingerprint(r){return archiveDigest(JSON.stringify(archiveIdentityPayload(r)));}
async function archiveFileFingerprint(contents){return archiveDigest(contents);}
function reportIndexEntry(r){return {id:r.id,name:r.name,encounter:r.encounter,importedAt:r.importedAt,isHtml:r.isHtml,htmlSaved:r.htmlSaved,sourceFingerprint:r.sourceFingerprint,sessionStart:r.sessionStart,provenance:r.provenance,duration:r.duration,version:r.version,archived:r.archived===true,archiveReason:r.archiveReason,archiveCompact:r.archiveCompact===true,archiveSummary:r.archiveSummary||null,archiveDigest:r.archiveDigest||null,archiveFileDigest:r.archiveFileDigest||null};}
async function reportDbWriteBatch(reports){const db=await openVaultDb();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('details','readwrite'),os=tx.objectStore('details');for(const r of reports)os.put(r,r.id);tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error||Error('Report storage transaction failed'));tx.onabort=()=>reject(tx.error||Error('Report storage transaction aborted'));})}finally{db.close()}}
async function reportDbRead(id){const db=await openVaultDb();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('details'),q=tx.objectStore('details').get(id);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)})}finally{db.close()}}
async function reportDbRemove(id){const db=await openVaultDb();try{await new Promise((resolve,reject)=>{const tx=db.transaction('details','readwrite');tx.objectStore('details').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}finally{db.close()}}
async function reportStorageInitialize(){
 const stored=state.reports.slice();
 try{
  if(state.reportStorage==='indexeddb-v2'){
   const hydrated=[];
   for(const entry of stored){const full=await reportDbRead(entry.id);if(!full)throw Error('Missing stored report '+entry.id);hydrated.push(full)}
   state.reports=hydrated;reportDbReady=true;if(reportAutoArchive()){await reportDbWriteBatch(state.reports);save()}await archiveCompactAll();if(state.characterName.trim()){rebuildOwnedMilestones();save()}return;
  }
  if(stored.length){await reportDbWriteBatch(stored);for(const entry of stored){if(!await reportDbRead(entry.id))throw Error('Migration verification failed')}}
  reportDbReady=true;reportAutoArchive();await reportDbWriteBatch(state.reports);
  if(!save()){reportDbReady=false;throw Error('Could not commit report index; original records preserved')}await archiveCompactAll();if(state.characterName.trim()){rebuildOwnedMilestones();save()}
 }catch(err){reportDbReady=false;state.reports=stored;reportStorageBlocked=state.reportStorage==='indexeddb-v2';message('Report storage upgrade paused: '+err.message+'. '+(reportStorageBlocked?'Profile writes blocked to protect the report index.':'Original local records were not deleted.'));}
}
function storageSize(bytes){return Number.isFinite(bytes)?(bytes/1024/1024).toFixed(1)+' MB':'Unavailable'}
async function refreshStorageStatus(){const target=$('storage-status');if(!target)return;const quota=await navigator.storage?.estimate?.().catch(()=>null);const db=await openVaultDb().catch(()=>null);let htmlCount='unavailable';if(db){try{htmlCount=await new Promise((resolve,reject)=>{const tx=db.transaction('reports'),q=tx.objectStore('reports').count();q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)})}catch{}db.close()}
 target.textContent=`${state.reports.length} structured reports · ${htmlCount} HTML archives · ${reportDbReady?'IndexedDB report storage active':'Legacy storage fallback'} · Browser usage ${storageSize(quota?.usage)} / quota ${storageSize(quota?.quota)}. Storage limits are browser-controlled.`}
async function vaultFullBackup(){
 const archivedHtml={};let total=0;
 try{
  for(const r of state.reports){if(!r.htmlSaved)continue;const html=await readHtml(r.id);if(html){total+=html.length;if(total>175*1024*1024)throw Error('Archived HTML exceeds the 175 MB single-backup safety limit. Keep original HTML files and export your profile separately.');archivedHtml[r.id]=html}}
  const backupReports=[];for(const r of state.reports){backupReports.push(r.archiveCompact?r:r)}const data={type:'midir-companion-backup',version:2,data:{...state,reports:backupReports},archivedHtml,trainingExtras:{specialUpgrade:window.MIDIR_SPECIAL_UPGRADE?.exportState(),herbs:window.MIDIR_HERBS?.exportState(),pig:window.MIDIR_PIG?.exportState(),reforge:window.MIDIR_REFORGE?.exportState(),erg:window.MIDIR_ERG?.exportState?.(),bb:window.MIDIR_BB?.exportState(),mpRhythm:window.MIDIR_MP_RHYTHM?.exportState(),evTower:window.MIDIR_EV_DEFENSE?.exportState?.(),theta:window.MIDIR_THETA?.exportState?.(),vertrag:window.MIDIR_VERTRAG?.exportState?.(),sgOath:window.MIDIR_SG_OATH?.exportState?.(),asInvaders:window.MIDIR_AS_INVADERS?.exportState?.(),asBonuses:window.MIDIR_AS_INVADERS?.bonuses?.()}};download(new Blob([JSON.stringify(data)],{type:'application/json'}),'Companion-Profile-Backup.json');message(companionPrefs().secretSauce?'Full backup created: '+state.reports.length+' reports and '+Object.keys(archivedHtml).length+' HTML archives. Keep this file in a safe location.':'Profile backup saved. Store this file safely to protect your game and training progress.');
 }catch(err){message('Full backup unavailable: '+err.message)}
}
async function storagePersistentRequest(){try{if(!navigator.storage?.persist)throw Error('Persistent storage is not supported here');const ok=await navigator.storage.persist();message(ok?'Persistent storage was granted by the browser.':'Browser did not grant persistent storage. Your data remains available under normal browser retention rules.');refreshStorageStatus()}catch(e){message('Storage request unavailable: '+e.message)}}

function openVaultDb(){return new Promise((resolve,reject)=>{if(!window.indexedDB)return reject(Error('IndexedDB unavailable'));const q=indexedDB.open(vaultDbName,3);q.onupgradeneeded=()=>{if(!q.result.objectStoreNames.contains('reports'))q.result.createObjectStore('reports');if(!q.result.objectStoreNames.contains('details'))q.result.createObjectStore('details');if(!q.result.objectStoreNames.contains('cold'))q.result.createObjectStore('cold')};q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)})}
async function storeHtml(id,html){const db=await openVaultDb();return new Promise((resolve,reject)=>{const tx=db.transaction('reports','readwrite');tx.objectStore('reports').put(html,id);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
async function readHtml(id){const db=await openVaultDb();return new Promise((resolve,reject)=>{const tx=db.transaction('reports');const req=tx.objectStore('reports').get(id);req.onsuccess=()=>{db.close();resolve(req.result)};req.onerror=()=>{db.close();reject(req.error)}})}
async function removeHtml(id){try{const db=await openVaultDb();await new Promise((resolve,reject)=>{const tx=db.transaction('reports','readwrite');tx.objectStore('reports').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});db.close()}catch(e){console.warn(e)}}
const vaultPlayers=r=>r.players.filter(p=>p.skills?.some(x=>Number(x.totalDamage??x.total)>0));
function participantStats(r,p){const report=r.reportPlayers?.find(x=>x.name===p.name);const skills=p.skills||[];const damage=skills.reduce((n,x)=>n+(Number(x.totalDamage??x.total??0)||0),0);const hasReportDamage=report?.damage!=null&&Number.isFinite(Number(report.damage)),hasReportDps=report?.dps!=null&&Number.isFinite(Number(report.dps));return {damage:hasReportDamage?Number(report.damage):damage,dps:hasReportDps?Number(report.dps):r.duration>0?damage/r.duration:null,deathCount:Array.isArray(p.deathTimes)?p.deathTimes.length:report?.deaths!=null&&Number.isFinite(Number(report.deaths))?Number(report.deaths):null,damageTaken:p.damageTaken??null,topHit:Math.max(0,...(report?.skills||skills).map(x=>Number(x.biggest??x.maxHit??0)||0)),duration:r.duration}}
function verifiedBossClear(r){if(r.provenance!=='companion-v1')return false;return [1,3].some(g=>gateForTarget(r,g).some(a=>a.complete===true))}
function skillRecordMap(p){const out=new Map();for(const sk of p.skills||[]){const name=String(sk.skillId??sk.id??sk.name??'').trim();if(!name)continue;const amount=Number(sk.biggest??sk.maxHit??0);if(Number.isFinite(amount)&&amount>0)out.set(name,Math.max(out.get(name)||0,amount))}return out}
function vaultDate(r){const n=Number(r.sessionStart);return n>1000000000?new Date(n*1000).toLocaleString():r.importedAt?new Date(r.importedAt).toLocaleString():'Unknown session date'}
function vaultArcana(p){return p.arcana?String(p.arcana):'Arcana unknown'}
// Bri survivor awards rely on exported death events, never negative HP / Deadly.
// One normal revival per gate; a second death is the normal permanent-down threshold.
// Harmonic Saint's exceptional self-revival is not inferred from death counts.
function briSurvivalEvidence(r,a,selected){
 if(!a.clear||!['bri-g1','bri-g2','bri-g3'].includes(a.group))return null;
 const people=(r.players||[]).filter(p=>p&&p.name&&p.entityId&&Array.isArray(p.deathTimes));
 if(!selected||!Array.isArray(selected.deathTimes)||people.length<2||people.length!==(r.players||[]).length)return null;
 const key=p=>String(p.entityId||p.name);
 if(new Set(people.map(key)).size!==people.length)return null;
 const self=people.find(p=>key(p)===key(selected));if(!self)return null;
 const count=p=>p.deathTimes.filter(t=>Number.isFinite(t)&&t>=a.start&&t<=a.end).length;
 const others=people.filter(p=>key(p)!==key(self));
 const encounterArcana=p=>{
  const matching=rhEncounter({r,p}).find(w=>w.start<a.end&&w.end>a.start);
  return matching?rhEncounterArcana(r,p,matching).arc:rhArcana(p.arcana);
 };
 const isSaint=p=>encounterArcana(p)==='hs';
 const arcanaKnown=p=>!!encounterArcana(p);
 return {selfDeaths:count(self),others,counts:others.map(count),isSaint,arcanaKnown,
   // Last One Standing permits a still-standing HS, but must *prove* each
   // other player is a non-HS who has used the normal revive and died again.
   finalDps:others.every(p=>arcanaKnown(p)&&(isSaint(p)||count(p)>=2))
     &&others.some(p=>arcanaKnown(p)&&!isSaint(p)&&count(p)>=2)};
}
function vaultEventsForImport(r){
 const A=window.MIDIR_ANALYSIS;if(!A)return [];
 const p=chosenPlayer(r);if(!p)return [];
 const events=[];const attempts=A.encounters(r);
 const earlier=[];
 for(const other of state.reports){if(other.id===r.id||!chosenPlayer(other))continue;
  if((other.importedAt||0)>(r.importedAt||0))continue;
  for(const attempt of A.encounters(other))earlier.push({r:other,a:attempt,p:chosenPlayer(other)});
 }
 for(let i=0;i<attempts.length;i++){
  const a=attempts[i],stats=A.personalWindow(r,a,p),coverage=A.debuffs(r,a),owned=coverage.players.get(p.entityId);
  const common={reportId:r.id,encounter:a.name,attemptKey:a.key,player:p.name,date:r.importedAt||Date.now()};
  const deaths=p.deathTimes?.filter(t=>t>=a.start&&t<=a.end).length??null;
  const prev=earlier.filter(x=>x.a.group===a.group&&x.a.origin===a.origin&&x.r.targetScope===r.targetScope)
   .sort((x,y)=>(y.r.importedAt||0)-(x.r.importedAt||0))[0];
  if(a.clear&&deaths===0&&!events.some(x=>x.type==='first-deathless'&&x.encounter===a.name)&&!earlier.some(x=>x.a.group===a.group&&x.a.clear&&x.p.deathTimes?.filter(t=>t>=x.a.start&&t<=x.a.end).length===0)){
   events.push({...common,type:'first-deathless',title:'Untouchable!',detail:`A verified deathless ${a.name} clear (attempt ${a.attempt})!`,magnitude:30,evidence:'attempt clear and recorded deaths'});
  }
  // A first clear requires explicit defeat/clear evidence, not just a target disappearing.
  if(a.clear&&!earlier.some(x=>x.a.group===a.group&&x.a.clear)&&!events.some(x=>x.type==='first-clear'&&x.encounter===a.name)){
   events.push({...common,type:'first-clear',title:'First boss clear!',detail:`Your first verified ${a.name} clear in the Vault. A real defeat, not just a disappearing target.`,magnitude:32,evidence:'verified attempt clear and selected character present'});
  }
  const survivor=briSurvivalEvidence(r,a,p);
  if(survivor&&survivor.selfDeaths===0){
   if(survivor.counts.every(n=>n>=1))events.push({...common,type:'sole-survivor',title:'Sole Survivor!',detail:`You completed ${a.name} without a recorded death while every other recorded party member fell at least once.`,magnitude:35,evidence:'verified Bri Leith gate clear and complete party death timestamps, scoped to this gate'});
   if(survivor.finalDps)events.push({...common,type:'last-one-standing',title:'Last One Standing!',detail:`The others have fallen, but you weren't finished yet. You brought ${a.name} home.`,magnitude:55,evidence:'verified gate clear, player deathless; every other identified non-Harmonic Saint used their normal revival and died again; Harmonic Saints exempt'});
  }
  if(survivor&&survivor.others.filter(o=>survivor.arcanaKnown(o)&&!survivor.isSaint(o)&&o.deathTimes.filter(t=>t>=a.start&&t<=a.end).length>=2).length>=2){
   events.push({...common,type:'against-all-odds',title:'Against All Odds!',detail:`Your party finished ${a.name} after at least two other fighters exhausted their normal revives.`,magnitude:40,evidence:'verified Bri Leith gate clear, identified non-Harmonic Saint teammates and two in-gate recorded deaths each'});
  }
  // Count distinct attributed status groups, never raw repeat applications.
  if(owned?.categories.length>=2){
   const named=owned.categories.map(id=>A.categories.find(c=>c.id===id)?.name||id);
   events.push({...common,type:'debuff-variety',title:'More than one way to help!',detail:`You contributed ${named.length} distinct tracked debuff groups in ${a.name}: ${named.join(', ')}. Attribution includes identified attackers or unique nearby hit evidence; this is not uptime or a cast count.`,magnitude:16,evidence:'distinct attributed boss status categories'});
  }
  if(owned?.categories.length){
   const supportHistory=earlier.filter(v=>v.a.group===a.group&&A.debuffs(v.r,v.a).players.get(v.p.entityId)?.categories.length);
   if(supportHistory.length>=2&&[3,5,10].includes(supportHistory.length+1))events.push({...common,type:'debuff-regular',title:'Debuff Regular!',detail:`Contributed a tracked boss debuff in ${supportHistory.length+1} separate ${a.name} attempts.`,magnitude:(supportHistory.length+1)*5,tier:supportHistory.length+1,evidence:'observed statuses with player attribution or unique hit correlation'});
   const names=owned.categories.map(id=>A.categories.find(c=>c.id===id)?.name||id);
   events.push({...common,type:'debuff-contributor',title:'Every debuff helps!',detail:`You contributed ${names.join(', ')} against ${a.name} (attempt ${a.attempt}). Attribution: ${owned.credits.some(c=>c.method==='recorded-attacker')?'recorded attacker and/or':'only'} nearby skill-hit correlation; see the evidence panel.`,magnitude:12,evidence:'boss status and player attacker ID / correlated skill damage'});
  }
  if(owned?.early.some(x=>x.time>=a.spawnAt&&x.time-a.spawnAt<=10)){
   const first=owned.early.find(x=>x.time>=a.spawnAt&&x.time-a.spawnAt<=10),after=first.time-a.spawnAt;
   events.push({...common,type:'early-debuff',title:'Quick on the draw!',detail:`You helped apply ${first.name} ${after.toFixed(1)}s after boss appearance in ${a.name} (attempt ${a.attempt}).`,magnitude:20,evidence:'boss appearance, condition start, supported player attribution'});
  }
  // Party achievement: the nine required boss icons appeared at least once.
  // No source attribution and no claim of simultaneous coverage.
  const complete=A.fullCoverage(r,a);
  if(a.clear&&complete.complete){events.push({...common,type:'full-party-coverage',title:'Full Party Coverage!',detail:`All ${complete.required} debuff slots appeared on ${a.name} during a verified clear: ${complete.slots.map(s=>s.name).join(', ')}. Checks recorded boss icons, regardless of source; not a continuous-uptime award.`,magnitude:90,evidence:'nine independent condition-icon slots across verified boss attempt'});}
  // To the Nines: 7/9 simultaneous slot uptime for >=97% of a verified clear.
  const nines=A.toTheNines(r,a);
  if(a.clear&&nines.eligible&&nines.qualified){events.push({...common,type:'to-the-nines',title:'To the Nines!',detail:`You kept the boss dressed up: at least seven of nine effects were active simultaneously for ${(nines.fraction*100).toFixed(2)}% of the ${a.name} fight (${nines.coveredSeconds.toFixed(1)} of ${nines.duration.toFixed(1)} seconds).`,magnitude:97,evidence:'timed boss condition intervals, 7/9 concurrent icons, >=97% verified combat window'});}
  // Six minutes of all nine simultaneously active, with no refresh gap.
  const dressed=A.perfectlyDressed(r,a);
  if(a.clear&&dressed.qualified)events.push({...common,type:'perfectly-dressed',title:'Perfectly Dressed!',detail:`All nine debuff effects stayed active together for ${(dressed.longestRun/60).toFixed(2)} uninterrupted minutes during ${a.name}.`,magnitude:360,evidence:'nine distinct concurrent boss debuff slots, continuous interval coverage and verified clear'});
  // Gate mission timers are 20/20/30 minutes. Evidence is boss-combat time,
  // not total mission elapsed time; don't represent it as a mission clear timer.
  const gateLimit=a.group==='bri-g1'||a.group==='bri-g2'?1200:a.group==='bri-g3'?1800:null;
  if(a.clear&&gateLimit){
   if((a.group==='bri-g1'||a.group==='bri-g2'?a.duration>=1020:a.duration>1500))events.push({...common,type:'long-haul',title:'The Long Haul!',detail:`That ${a.name} fight took a very long time, but you saw it through and cleared it.`,magnitude:a.duration,evidence:'verified clear and observed boss-combat duration, not full mission timer'});
   const clears=earlier.filter(x=>x.a.clear&&['bri-g1','bri-g2','bri-g3'].includes(x.a.group)&&x.r.targetScope===r.targetScope&&x.p.name===p.name).map(x=>({group:x.a.group,seconds:x.a.duration,reportId:x.r.id}));
   // Distinct sessions only: one verified gate combat under half its mission limit.
   if(a.duration<gateLimit/2){
    const eligible=new Map();for(const e of clears){const limit=e.group==='bri-g3'?1800:1200;if(e.seconds<limit/2)eligible.set(e.reportId,e)}
    eligible.set(r.id,{group:a.group,seconds:a.duration,reportId:r.id});
    if(eligible.size>=5&&!state.metricMilestones.some(x=>x.type==='clockwork'&&x.player===p.name))events.push({...common,type:'clockwork',title:'Clockwork!',detail:'Five distinct verified Bri Leith gate fights, each finished in less than half that gate’s mission time allowance. Fast fights, consistent results.',magnitude:5,evidence:'five distinct verified gate boss-combat intervals, each below half of 20/30-minute mission allowance; not total mission duration'});
   }
  }
  // Burst is measured from timestamped personal hit groups, not cast counts.
  const burst=(player,attempt)=>{const samples=(player.damageEvents||[]).filter(e=>Number.isFinite(Number(e.time))&&e.time>=attempt.start&&e.time<=attempt.end).map(e=>({t:Number(e.time),d:Math.max(0,Number(e.totalDamage)||0)})).sort((x,y)=>x.t-y.t);let best=0,rolling=0,left=0;for(let right=0;right<samples.length;right++){rolling+=samples[right].d;while(samples[right].t-samples[left].t>10)rolling-=samples[left++].d;best=Math.max(best,rolling)}return best};
  const thisBurst=burst(p,a),priorBurst=Math.max(0,...earlier.filter(x=>x.a.group===a.group&&x.a.origin===a.origin&&x.r.targetScope===r.targetScope).map(x=>burst(x.p,x.a)));
  if(a.clear&&priorBurst>0&&thisBurst>priorBurst)events.push({...common,type:'burst-brilliance',title:'Burst of Brilliance!',detail:`New personal best for recorded damage within ten seconds during ${a.name}: ${fmt(Math.round(thisBurst))}.`,magnitude:Math.round(thisBurst),evidence:'timestamped all-target personal damage-hit groups in a ten-second attempt window; not boss-only damage'});
  // Never Off Duty: consecutive matched *verified clears* with attributable
  // debuff evidence in each, not mere presence of an effect on the boss.
  if(a.clear&&owned?.categories.length){const priorClears=earlier.filter(x=>x.a.group===a.group&&x.a.clear&&x.r.targetScope===r.targetScope).sort((u,v)=>(v.r.importedAt||0)-(u.r.importedAt||0));let streak=1;for(const x of priorClears){if(!A.debuffs(x.r,x.a).players.get(x.p.entityId)?.categories.length)break;streak++;}if(streak>=3&&!state.metricMilestones.some(x=>x.type==='never-off-duty'&&x.encounter===a.name&&x.player===p.name))events.push({...common,type:'never-off-duty',title:'Never Off Duty!',detail:`You personally contributed an attributable boss debuff in ${streak} successive verified ${a.name} clears.`,magnitude:streak,evidence:'attributed status contributions across distinct verified boss clears'});}
  // Consistent performance milestones use prior verified attempt history.
  const history=earlier.filter(x=>x.a.group===a.group&&x.a.origin===a.origin&&x.a.clear&&x.p.deathTimes&&x.r.targetScope===r.targetScope).sort((x,y)=>(x.r.importedAt||0)-(y.r.importedAt||0));
  if(a.clear&&deaths===0&&history.length){let streak=1;for(let k=history.length-1;k>=0;k--){if(history[k].p.deathTimes.filter(t=>t>=history[k].a.start&&t<=history[k].a.end).length===0)streak++;else break;}
    if([3,5,10].includes(streak))events.push({...common,type:'reliable-finisher',title:`Reliable Finisher · ${streak} clears`,detail:`${streak} consecutive recorded verified deathless clears of ${a.name}.`,magnitude:streak*10,evidence:'verified clear flags and in-attempt death timestamps',tier:streak});
  }
  if(a.clear&&history.length){const fastest=Math.min(...history.map(v=>v.a.duration));
   if(a.duration<fastest){let streak=1;const sorted=history.map(v=>v.a.duration);for(let k=sorted.length-1;k>0&&sorted[k]<Math.min(...sorted.slice(0,k));k--)streak++;
    if(streak>=2)events.push({...common,type:'personal-best-streak',title:'Personal Best Streak!',detail:`Another verified ${a.name} combat-time record; ${streak} successive record-setting clears.`,magnitude:streak*12,evidence:'verified combat durations, not dungeon clear times',tier:streak});
   }
  }
  const priorAttempts=earlier.filter(v=>v.a.group===a.group&&v.a.origin===a.origin&&v.p.deathTimes&&v.r.targetScope===r.targetScope).sort((u,v)=>(v.r.importedAt||0)-(u.r.importedAt||0));
  if(a.clear&&priorAttempts.length){const last=priorAttempts[0],oldD=last.p.deathTimes.filter(t=>t>=last.a.start&&t<=last.a.end).length;
    if((!last.a.clear||oldD>0)&&deaths===0&&(a.duration<last.a.duration||!last.a.clear))events.push({...common,type:'the-comeback',title:'The Comeback!',detail:`After an unfinished or death-marked ${a.name} attempt, you returned with a verified deathless clear.`,magnitude:44,evidence:'prior attempt result and current verified deathless clear'});
  }
  if(a.clear){const record=earlier.filter(v=>v.a.group===a.group&&v.a.clear&&v.a.origin===a.origin);if(record.length){const best=Math.min(...record.map(v=>v.a.duration));if(a.duration<best){const improvement=Math.round(100*(best-a.duration)/best);if(improvement>=5)events.push({...common,type:'speedrunner-journey',title:'Speedrunner’s Journey!',detail:`New verified ${a.name} combat record: ${best.toFixed(1)}s → ${a.duration.toFixed(1)}s (−${improvement}%).`,magnitude:improvement,evidence:'comparable verified boss combat times, not dungeon times',tier:improvement>=25?3:improvement>=10?2:1});}}}
  if(!prev)continue;
  const prevDeaths=prev.p.deathTimes?.filter(t=>t>=prev.a.start&&t<=prev.a.end).length??null;
  if(prevDeaths!==null&&deaths!==null&&deaths<prevDeaths){
   events.push({...common,type:'fewer-deaths',title:'Fewer falls!',detail:`Recorded deaths improved from ${prevDeaths} to ${deaths} in individual ${a.name} attempts.`,magnitude:50,evidence:'time-bounded death event counts'});
   if(deaths===0&&a.clear)events.push({...common,type:'deathless',title:'Deathless improvement!',detail:`You improved from ${prevDeaths} recorded deaths to a verified deathless ${a.name} clear.`,magnitude:100,evidence:'verified attempt clear and time-bounded death events'});
  }else if(a.clear&&prev.a.clear&&deaths===0&&prevDeaths===0){
   events.push({...common,type:'fewer-deaths',title:'Fewer Falls · Zero maintained!',detail:`Another verified deathless ${a.name} clear. You kept your falls at zero.`,magnitude:100,evidence:'successive verified clears and time-bounded death events'});
  }
  if(a.clear&&prev.a.clear&&a.duration<prev.a.duration){
   const pct=100*(1-a.duration/prev.a.duration);
   events.push({...common,type:'faster-combat',title:'Faster boss attempt!',detail:`Verified ${a.name} combat shortened from ${prev.a.duration.toFixed(1)}s to ${a.duration.toFixed(1)}s (−${pct.toFixed(1)}%). This is not dungeon-clear time.`,magnitude:pct,evidence:'verified boss clear + per-attempt boundaries'});
  }
  // Same encounter group, export scope and bounded windows; observed hit groups
  // can include other targets, so describe the achievement as recorded damage only.
  const old=A.personalWindow(prev.r,prev.a,prev.p);
  if(stats&&old&&stats.damage>0&&old.damage>0&&stats.damage>=old.damage*1.2&&r.targetScope===prev.r.targetScope){
   const pct=100*(stats.damage/old.damage-1);
   events.push({...common,type:'attempt-damage',title:'More damage in the fight!',detail:`Recorded personal damage within the ${a.name} attempt increased ${pct.toFixed(1)}% (${fmt(Math.round(old.damage))} → ${fmt(Math.round(stats.damage))}). This is damage-hit evidence, not boss-only damage or a rotation grade.`,magnitude:pct,evidence:'personal timestamped damage-hit groups in two matched attempt windows'});
  }
  if(stats&&old&&stats.dps>old.dps+10000&&old.dps>0&&r.targetScope==='all-targets'){
   const pct=100*(stats.dps/old.dps-1);
   events.push({...common,type:'dps',title:'Active-window damage improved!',detail:`Observed all-target damage per second during ${a.name} increased ${pct.toFixed(1)}% between attempts. Not boss-only DPS or rotation quality.`,magnitude:pct,evidence:'all-target damage-hit groups inside matched encounter windows'});
  }
 }
 // Preserve report-wide largest-hit achievements only for two single-encounter
 // recordings of the same boss and export scope. Do not attribute a peak to a
 // particular boss phase or cast without event/target evidence.
 if(attempts.length===1){
  const a=attempts[0];
  const prev=earlier.filter(x=>x.a.group===a.group&&x.r.targetScope===r.targetScope&&A.encounters(x.r).length===1)
   .sort((x,y)=>(y.r.importedAt||0)-(x.r.importedAt||0))[0];
  if(prev){
   const common={reportId:r.id,encounter:a.name,attemptKey:a.key,player:p.name,date:r.importedAt||Date.now()};
   const now=participantStats(r,p),was=participantStats(prev.r,prev.p);
   if(now.topHit>0&&was.topHit>0&&now.topHit>was.topHit){
    const pct=100*(now.topHit/was.topHit-1);
    events.push({...common,type:'hit',title:'New biggest recording hit!',detail:`Your largest skill hit in a comparable ${a.name} report increased ${pct.toFixed(1)}%. The report may include supporting enemies; this is not proven boss-only damage.`,magnitude:pct,evidence:'HTML skill-summary biggest hit, report scope'});
   }
   const oldSkills=skillRecordMap(prev.p),newSkills=skillRecordMap(p);const wins=[];
   for(const [id,value] of newSkills){const prevVal=oldSkills.get(id);if(prevVal>0&&value>prevVal)wins.push({id,value,prevVal,pct:100*(value/prevVal-1)})}
   wins.sort((a,b)=>b.pct-a.pct);
   if(wins.length>=2)events.push({...common,type:'skill-specialist',title:'Skill Specialist!',detail:`${wins.length} distinct skills set new recorded single-hit peaks in comparable ${a.name} reports.`,magnitude:wins.length*8,tier:wins.length>=5?3:wins.length>=3?2:1,evidence:'per-skill reported highest hits, report scoped'});
   if(wins.length){const x=wins[0];const sk=p.skills.find(s=>String(s.skillId??s.name)===x.id);
    events.push({...common,type:'skill-hit',title:'Skill-specific peak!',detail:`${sk?.name||'Unidentified skill'} reached a new largest reported single hit (+${x.pct.toFixed(1)}%) in comparable ${a.name} recordings. Report-scope, not proven boss-only.`,magnitude:x.pct,evidence:'HTML per-skill biggest hit',additionalSkillRecords:wins.length});
   }
   if(now.damage>0&&was.damage>0&&now.damage>=was.damage*1.1){
    const pct=100*(now.damage/was.damage-1);
    events.push({...common,type:'total-damage',title:'More damage dealt!',detail:`Your total reported damage grew ${pct.toFixed(1)}% across comparable ${a.name} recordings. Raw report total, not rotation efficiency or boss-only damage.`,magnitude:pct,evidence:'report damage totals'});
   }
   if(now.damageTaken!==null&&was.damageTaken!==null&&(was.damageTaken>0&&now.damageTaken<was.damageTaken||(now.damageTaken===0&&was.damageTaken===0&&verifiedBossClear(r)&&verifiedBossClear(prev.r)))){
    const held=now.damageTaken===0&&was.damageTaken===0;const pct=held?100:100*(1-now.damageTaken/was.damageTaken);
    events.push({...common,type:'taken',title:held?'Stronger Defense · Untouched again!':'Stronger defense!',detail:held?`Another verified ${a.name} clear with zero recorded damage taken.`:`You took ${pct.toFixed(1)}% less recorded damage in the comparable ${a.name} report.`,magnitude:pct,evidence:held?'verified clears and recorded damage taken':'recorded damage taken'});
   }
  }
 }
 return events;
}
function celebration(events){if(!events.length)return;document.querySelectorAll('.vault-modal').forEach(e=>e.remove());const best=[...events].sort((a,b)=>b.magnitude-a.magnitude)[0];const modal=document.createElement('div');modal.className='vault-modal';modal.innerHTML=`<div class="vault-modal-inner" role="dialog" aria-modal="true" aria-label="New achievement"><span class="vault-sparkle">✦ ★ ✦</span><h2>${esc(best.title)}</h2><p>${esc(best.detail)}</p><p class="hint">${events.length>1?`${events.length-1} other milestone(s) quietly saved in your Vault.`:'Saved to milestones.'}</p><button id="vault-dismiss" class="primary">Wonderful!</button></div>`;document.body.appendChild(modal);modal.querySelector('button').addEventListener('click',()=>modal.remove());}
let vaultViewerId=null;
async function viewReportInline(id){
  const r=state.reports.find(x=>x.id===id);
  if(!r)return;
  // Mobile reports deserve a full-height reader rather than a miniature inline frame.
  // Desktop preserves the original inline report experience.
  if(companionMobileMode())return openMobileReportReader(id);
  vaultViewerId=id;
  render();
  const host=$('vault-inline-content');
  if(!host)return;
  host.textContent='Loading archived report…';
  try{
    const html=await readHtml(id);
    if(vaultViewerId!==id||!$('vault-inline-content'))return;
    if(!html){host.innerHTML='<p class="hint">The original HTML is not archived for this entry. Re-import the original HTML file to attach it without duplicating your report.</p>';return}
    // The original self-contained Midir export carries its own plots, controls and data.
    // Sandbox report scripts so imported HTML cannot access Companion profile/storage.
    const frame=document.createElement('iframe');
    frame.className='vault-report-frame';
    frame.title='Midir report — '+r.name;
    frame.setAttribute('sandbox','allow-scripts allow-downloads');
    frame.setAttribute('referrerpolicy','no-referrer');
    frame.srcdoc=html;
    host.replaceChildren(frame);
    host.scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){host.textContent='Unable to load archived HTML: '+e.message}
}
// The report is an unmodified saved export. Adapt only the in-memory viewing copy:
// injected script executes within the same opaque-origin sandbox as the report itself,
// never with access to Companion storage or its DOM.
function mobileReportViewingHtml(html){
 const helper=`<style id="midir-mobile-report-style">
 @media(max-width:760px){body{padding:10px!important;max-width:none!important;font-size:15px!important;overflow-wrap:anywhere}h1{font-size:1.3rem!important}.panel,.tile{padding:10px!important}#chart-wrap{overflow-x:auto;overflow-y:visible;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;border-radius:8px}#chart{display:block;max-width:none!important;height:auto!important;min-height:0!important}#tip{max-width:min(290px,80vw)!important;overflow-wrap:anywhere}button,select,input{min-height:40px!important} .top{grid-template-columns:repeat(2,minmax(0,1fr))!important} .hp-search,.controls{flex-wrap:wrap!important}}
 </style><script id="midir-mobile-report-helper">(function(){'use strict';
 let factor=1;const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function chart(){return document.getElementById('chart')}
 function wrap(){return document.getElementById('chart-wrap')}
 function resize(){const w=wrap(),svg=chart();if(!w||!svg)return;const base=w.clientWidth;if(base<40){setTimeout(resize,80);return}svg.style.width=Math.round(base*factor)+'px';svg.style.maxWidth='none';svg.style.height=Math.round(Math.max(190,Math.min(520,base*factor*.39)))+'px';}
 function action(cmd){const w=wrap(),svg=chart();if(cmd==='chart'){if(svg){svg.scrollIntoView({behavior:'instant',block:'start'});window.scrollBy(0,-12)}return}
 if(cmd==='fit')factor=1;else if(cmd==='in')factor=clamp(Math.round((factor+.5)*10)/10,1,3);else if(cmd==='out')factor=clamp(Math.round((factor-.5)*10)/10,1,3);
 resize();if(w&&cmd==='fit')w.scrollLeft=0;}
 window.addEventListener('message',e=>{if(e.source!==parent||!e.data||e.data.midirMobileReport!==1)return;action(e.data.command)});
 window.addEventListener('resize',resize);
 document.addEventListener('DOMContentLoaded',()=>{resize();requestAnimationFrame(resize);setTimeout(resize,150);const svg=chart();if(svg){svg.addEventListener('click',e=>{if(!e.isTrusted)return;try{svg.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:e.clientX,clientY:e.clientY,pointerType:'mouse'}))}catch{}})}});
 })();<\/script>`;
 // Never write the helper back to the original archived HTML.
 return /<\/head\s*>/i.test(html)?html.replace(/<\/head\s*>/i,helper+'</head>'):html.replace(/<body([^>]*)>/i,(_m,attrs)=>'<body'+attrs+'>'+helper);
}
let mobileReportOverlay=null;
function closeMobileReportReader(){
 if(!mobileReportOverlay)return;
 mobileReportOverlay.remove();mobileReportOverlay=null;
 document.body.classList.remove('midir-report-reading');
 document.removeEventListener('keydown',mobileReportEscape,true);
}
function mobileReportEscape(e){if(e.key==='Escape'&&mobileReportOverlay){e.preventDefault();e.stopPropagation();closeMobileReportReader()}}
async function openMobileReportReader(id){
 const r=state.reports.find(x=>x.id===id);if(!r)return;
 closeMobileReportReader();
 const overlay=document.createElement('div');overlay.className='midir-report-reader';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Imported report full-screen reader');
 overlay.innerHTML=`<div class="midir-report-reader-head"><div class="midir-report-reader-title"><strong>${esc(r.encounter)}</strong><small>${esc(r.name)}</small></div><button class="midir-report-close" type="button" data-report-reader="close" aria-label="Close full-screen report">Close ✕</button></div><div class="midir-report-reader-controls" role="toolbar" aria-label="Report navigation and chart zoom"><button type="button" data-report-reader="chart">Jump to scatter</button><button type="button" data-report-reader="out" aria-label="Zoom chart out">−</button><button type="button" data-report-reader="fit">Fit</button><button type="button" data-report-reader="in" aria-label="Zoom chart in">+</button><span class="midir-report-zoom-label" aria-live="polite">100%</span></div><p class="midir-report-reader-hint">Pan or drag the scatter to explore time; tap data points for details. Zoom changes chart size, not report data.</p><div class="midir-report-reader-body">Loading report…</div>`;
 document.body.appendChild(overlay);mobileReportOverlay=overlay;document.body.classList.add('midir-report-reading');document.addEventListener('keydown',mobileReportEscape,true);
 const close=overlay.querySelector('[data-report-reader="close"]');close.focus({preventScroll:true});
 let level=1;const send=command=>overlay.querySelector('iframe')?.contentWindow?.postMessage({midirMobileReport:1,command},'*');
 overlay.addEventListener('click',e=>{const cmd=e.target.closest('[data-report-reader]')?.dataset.reportReader;if(!cmd)return;if(cmd==='close'){closeMobileReportReader();return}if(cmd==='in')level=Math.min(3,level+.5);else if(cmd==='out')level=Math.max(1,level-.5);else if(cmd==='fit')level=1;overlay.querySelector('.midir-report-zoom-label').textContent=Math.round(level*100)+'%';send(cmd)});
 try{const html=await readHtml(id);if(mobileReportOverlay!==overlay)return;const body=overlay.querySelector('.midir-report-reader-body');if(!html){body.textContent='The original interactive HTML is not retained. Re-import the original report to view its charts.';return}
 const frame=document.createElement('iframe');frame.className='midir-report-reader-frame';frame.title='Full-screen Midir report — '+r.name;frame.setAttribute('sandbox','allow-scripts allow-downloads');frame.setAttribute('referrerpolicy','no-referrer');frame.srcdoc=mobileReportViewingHtml(html);body.replaceChildren(frame);
 }catch(err){if(mobileReportOverlay===overlay)overlay.querySelector('.midir-report-reader-body').textContent='Unable to load report: '+err.message}
}
function closeReportInline(){vaultViewerId=null;render()}
function openReport(id){
  if(companionMobileMode())return openMobileReportReader(id);
  // Open on the synchronous click stack before any async IndexedDB operation;
  // otherwise Chrome/Edge can block the new tab as a popup.
  const win=window.open('about:blank','_blank');
  if(!win){message('Your browser blocked the report tab. Allow popups for this file, then try again.');return;}
  win.document.title='Loading Midir report (safe preview)…';
  win.document.body.textContent='Opening saved Midir report…';
  readHtml(id).then(html=>{
    if(!html){win.document.body.textContent='Original HTML not stored. Please re-import this report.';return;}
    const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
    win.document.body.textContent='';const frame=win.document.createElement('iframe');frame.setAttribute('sandbox','allow-scripts allow-downloads');frame.setAttribute('referrerpolicy','no-referrer');frame.style.cssText='position:fixed;inset:0;width:100%;height:100%;border:0';frame.src=url;win.document.body.appendChild(frame);
    setTimeout(()=>URL.revokeObjectURL(url),5*60*1000);
  }).catch(e=>{try{win.document.body.textContent='Unable to open: '+e.message}catch{} });
}
// Companion 279 — safety prompts before loading memory-heavy Discord exports.
// Browser quota estimates are advisory and cannot guarantee sufficient RAM.
async function companionMobileImportCheck(files,kind){
 if(!companionMobileMode())return true;
 const total=files.reduce((sum,file)=>sum+(Number(file.size)||0),0);
 if(!total)return true;
 const quota=await navigator.storage?.estimate?.().catch(()=>null);
 const used=Number(quota?.usage),max=Number(quota?.quota);
 const remaining=Number.isFinite(used)&&Number.isFinite(max)&&max>0?Math.max(0,max-used):null;
 const bulky=total>=12*1024*1024;
 const lowStorage=remaining!==null&&(remaining<100*1024*1024||total*3>remaining);
 const overflow=kind==='reports'&&state.reports.filter(r=>!reportIsArchived(r)).length+files.length>companionActiveReportLimit();
 if(!bulky&&!lowStorage&&!overflow)return true;
 const words=['Mobile '+kind+' caution:',`${files.length} file(s), ${storageSize(total)} selected.`,
  'Large HTML and backups can require several times their file size in memory while parsing.',
  overflow?'This import may move older active reports to the compact Archive (maximum 10 detailed active reports on mobile). You must keep the original exports for future reactivation.':'',
  remaining===null?'Free browser storage could not be estimated.':`Browser-reported free storage: ${storageSize(remaining)} (estimate only).`,
  'Back up your profile and keep original exports before proceeding. Very large files can stress phone RAM; if import fails, try desktop or export a shorter recording.',
  'Continue?'];
 return confirm(words.join('\n\n'));
}
async function filesSelectedVault(files){
 if(!(await companionMobileImportCheck(files,'reports')))return;
 let ok=0,fail=[],newEvents=[],suspected=[],newHtmlIds=[],replaced=[];const initialReportCount=state.reports.length,initialMilestones=[...state.metricMilestones];
 for(const f of files){if(f.size>90*1024*1024){fail.push(f.name+': exceeds the 90 MB single-import safety limit. Please export a shorter recording or gate subset.');continue}
  try{
   const content=await f.text();
   if(/\.ndjson$/i.test(f.name)){let lines=1;for(let i=0;i<content.length;i++){if(content.charCodeAt(i)===10&&++lines>250000)break}if(lines>250000)throw Error('Session exceeds 250,000 events')}
   const r=/\.ndjson$/i.test(f.name)?cleanExport(window.MIDIR_SESSION_IMPORT.convert(content,f.name).comp,null,f.name):parseReport(content,f.name);
   const fingerprint=JSON.stringify([r.sessionStart,r.title,r.duration,r.players.map(p=>[p.entityId,p.name,p.skills.length]),r.targets.map(t=>t.entityId)]);
   r.sourceFingerprint=hash(fingerprint);
   const repeats=state.reports.filter(x=>x.sourceFingerprint===r.sourceFingerprint||(!x.archiveCompact&&window.MIDIR_ANALYSIS.possibleRepeat(x,r)));
   if(repeats.length){
    const prior=repeats[0];
    if(prior.archiveCompact){
     if(!prior.archiveDigest||prior.archiveDigest!==r.archiveDigest){fail.push(f.name+': existing compact archive requires a verified matching original export (use Return to active).');continue;}
     if(!confirm('This file matches the archived session +prior.name+. Reactivate it as an active report?')){fail.push(f.name+': archived copy retained');continue;}
     await archiveRestoreFromFile(f,prior.id);ok++;continue;
    }
    if(!confirm(`This session already exists in your Vault as "${prior.name}".\n\nReplace the old imported data with the newly selected file? Any improved export details will be used and its achievements recalculated.\n\nCancel keeps the original unchanged.`)){fail.push(`${f.name}: existing import kept`);continue;}
    // Preserve identity so saved references point to the updated session; do not award twice.
    r.id=prior.id;r.importedAt=prior.importedAt||Date.now();r.archived=prior.archived===true;r.archiveReason=prior.archiveReason||null;r.isHtml=/\.html?$/i.test(f.name);
    if(!Array.isArray(r.players)||!Array.isArray(r.targets)||r.players.length>200||r.targets.length>5000)throw Error('Report exceeds entity safety limits');
    if(r.isHtml){await storeHtml(r.id,content);r.htmlSaved=true;}
    else {r.htmlSaved=!!prior.htmlSaved;r.isHtml=!!prior.isHtml;}
    const index=state.reports.indexOf(prior);state.reports[index]=r;
    if(reportDbReady)await reportDbWriteBatch([r]);
    replaced.push(r.id);ok++;continue;
   }
   // Repeated exports of a session must not generate new awards.
   let counter=0;do{r.id='r'+hash(fingerprint+'|'+Date.now()+'|'+(counter++));}while(state.reports.some(x=>x.id===r.id));
   r.importedAt=Date.now()+ok;r.isHtml=/\.html?$/i.test(f.name);
   if(!Array.isArray(r.players)||!Array.isArray(r.targets)||r.players.length>200||r.targets.length>5000)throw Error('Report exceeds entity safety limits');
   if(r.isHtml){try{await storeHtml(r.id,content);r.htmlSaved=true;newHtmlIds.push(r.id)}catch(e){r.htmlSaved=false;fail.push(f.name+': HTML archiving unavailable ('+e.message+')')}}
   state.reports.push(r);const events=vaultEventsForImport(r);
   for(const event of events){const key=[event.reportId,event.player,event.type,event.attemptKey||''].join('|');if(!state.metricMilestones.some(x=>x.id===key))state.metricMilestones.push({...event,id:key})}
   newEvents.push(...events);ok++;
  }catch(e){fail.push(f.name+': '+e.message);if(state.reports.length>initialReportCount){const last=state.reports[state.reports.length-1];if(last?.name===f.name){state.reports.pop();state.metricMilestones=state.metricMilestones.filter(x=>x.reportId!==last.id);newEvents=newEvents.filter(x=>x.reportId!==last.id);if(last.htmlSaved){await removeHtml(last.id);newHtmlIds=newHtmlIds.filter(id=>id!==last.id)}}}}
 }
 rebuildOwnedMilestones();const autoArchiveChanged=reportAutoArchive();let detailsSaved=true;
 if(reportDbReady&&(state.reports.length>initialReportCount||autoArchiveChanged)){try{await reportDbWriteBatch(autoArchiveChanged?state.reports:state.reports.slice(initialReportCount))}catch(err){detailsSaved=false;fail.push('Structured report save failed: '+err.message)}}
 const persisted=detailsSaved&&save();if(!persisted){state.reports.splice(initialReportCount);state.metricMilestones=initialMilestones;newEvents=[];ok=0;for(const id of newHtmlIds)await removeHtml(id);save();}render();
 message(`${ok} report(s) processed. ${persisted?'Saved to your local Vault.':'Storage unavailable: this batch was rolled back to protect existing progress. Export a profile backup.'}  ${suspected.length?'Possible repeat session: '+suspected.join(' · ')+'. ':''}${fail.join(' · ')}`);
 if(persisted){celebration(newEvents);archiveCompactAll().then(()=>render()).catch(e=>message('Archive compaction deferred: '+e.message))};
}
filesSelected=filesSelectedVault;
let milestoneEditIndex=null;
const achievementKinds=[
 {id:'tour-three',name:'First Steps',description:'Visit three different training activities.',icon:'🧭'},
 {id:'tour-six',name:'Curious Adventurer',description:'Visit six different training activities.',icon:'🧭'},
 {id:'tour-ten',name:'World Traveler',description:'Visit ten different training activities.',icon:'🌍'},
 {id:'tour-all',name:'Grand Tour',description:'Visit every featured minigame.',icon:'🏅'},
 {id:'arcana-three',name:'Arcana Curious',description:'Explore three Arcana landing pages.',icon:'✨'},
 {id:'arcana-six',name:'Arcana Explorer',description:'Explore six Arcana landing pages.',icon:'✨'},
 {id:'arcana-ten',name:'Arcana Scholar',description:'Explore all ten Arcana landing pages.',icon:'📚'},
 {id:'auction-first',name:'First Sale',description:'Complete an Auction House sale in Reforge Simulator.',icon:'🪙'},
 {id:'auction-100m',name:'High Roller',description:'Complete a simulated sale for 100 million gold.',icon:'💰'},
 {id:'auction-billion',name:'Billionaire’s Club',description:'Complete one simulated Auction House sale for at least 1 billion gold.',icon:'💎'},
 {id:'auction-3',name:'Market Regular',description:'Complete three Auction House sales.',icon:'🛍'},
 {id:'auction-10',name:'Market Mogul',description:'Complete ten Auction House sales.',icon:'👑'},
 {id:'auction-lifetime-billion',name:'Gold Mountain',description:'Earn 1 billion gold from simulated Auction House sales.',icon:'🏦'},
 {id:'erg-s50-break',name:'Beyond S50',description:'Roll a Limit Break on a weapon that is already Erg S50.',icon:'💠'},
 {id:'erg-taps-100',name:'Persistent Smith',description:'Make 100 Erg attempts.',icon:'⚒'},
 {id:'erg-taps-500',name:'Steadfast Smith',description:'Make 500 Erg attempts.',icon:'⚒'},
 {id:'erg-two-weapons',name:'Twin Blades',description:'Keep two Erg weapons.',icon:'⚔'},
 {id:'erg-five-weapons',name:'Arsenal Curator',description:'Keep five Erg weapons.',icon:'🗡'},
 {id:'erg-s50-two',name:'Erg Mastery',description:'Own two weapons at Erg S50.',icon:'🏆'},
 {id:'reforge-attempt-500',name:'Roll With It',description:'Make 500 reforging attempts.',icon:'🎲'},
 {id:'reforge-attempt-1000',name:'Never Give Up',description:'Make 1,000 reforging attempts.',icon:'🎲'},
 {id:'reforge-dazzling-ten',name:'Dazzling Devotee',description:'Buy ten Dazzling Reforging Tools.',icon:'✨'},
 {id:'reforge-dazzling-used-10',name:'Dazzling Hands',description:'Use ten Dazzling Reforging Tools.',icon:'💫'},
 {id:'reforge-limit-five',name:'Lucky Five',description:'Roll five Limit Breaks.',icon:'🍀'},
 {id:'reforge-limit-ten',name:'Fortune Favors',description:'Roll ten Limit Breaks.',icon:'🌠'},
 {id:'reforge-chest-ten',name:'Treasure Trove',description:'Store ten reforged items.',icon:'📦'},
 {id:'oath-memory-ten',name:'Second Nature',description:'Complete ten Oath sequences from memory.',icon:'🧠'},
 {id:'oath-memory-25',name:'Unshakable Oath',description:'Complete 25 Oath sequences from memory.',icon:'👑'},
 {id:'oath-sequences-ten',name:'Oath Practice',description:'Complete ten Oath sequences.',icon:'🛡'},
 {id:'pig-runs-25',name:'Carrot Veteran',description:'Finish 25 Pig Pursuit runs.',icon:'🥕'},
 {id:'pig-runs-50',name:'Pig Pursuit Legend',description:'Finish 50 Pig Pursuit runs.',icon:'🐷'},
 {id:'bandit-streak-75',name:'Uncatchable Hunter',description:'Reach a Bandit Hunt streak of 75.',icon:'🎭'},
 {id:'bandit-ducats-million',name:'Ducat Millionaire',description:'Earn 1 million ducats in Bandit Hunt.',icon:'🪙'},
 {id:'herb-total-1000',name:'Master Gatherer',description:'Gather 1,000 herbs.',icon:'🌿'},
 {id:'herb-total-2500',name:'Green Thumb',description:'Gather 2,500 herbs.',icon:'🌱'},
 {id:'ev-wave-100',name:'Century Defense',description:'Reach wave 100 in Tower Range Lab.',icon:'🏰'},
 {id:'ev-wave-150',name:'Endless Defender',description:'Reach wave 150 in Tower Range Lab.',icon:'🏰'},
 {id:'ev-ten-towers',name:'Tower Architect',description:'Place ten towers on the battlefield.',icon:'🗼'},
 {id:'ev-all-maps',name:'Map Explorer',description:'Play on all six Tower Range Lab maps.',icon:'🗺'},
 {id:'cross-erg-reforge',name:'Forged and Refined',description:'Reach Erg S50 and roll a Limit Break.',icon:'💎'},
 {id:'cross-oath-ev',name:'Guardian of the Gates',description:'Complete an Oath memory sequence and reach EV wave 10.',icon:'🛡'},
 {id:'cross-pig-bandit',name:'Chase Champion',description:'Complete ten Pig Pursuit runs and reach a Bandit Hunt streak of ten.',icon:'🏃'},
 {id:'cross-herb-erg',name:'Patient Crafter',description:'Gather 500 herbs and reach Erg S40.',icon:'🌿'},
 {id:'cross-collector',name:'Collector’s Corner',description:'Store five reforged items and five Erg weapons.',icon:'📦'},
 {id:'achievement-25',name:'Achievement Hunter',description:'Collect 25 different achievements.',icon:'🏅'},
 {id:'achievement-50',name:'Achievement Collector',description:'Collect 50 different achievements.',icon:'🏆'},
 {id:'achievement-100',name:'Legend of the Vault',description:'Collect 100 different achievements.',icon:'👑'},

 {id:'as-first-flight',name:'First Flight',description:'Start a run in Crom Bás Invaders.',icon:'🏹'},
 {id:'as-wave-10',name:'Into the Darkness',description:'Reach wave 10 in Crom Bás Invaders.',icon:'🌘'},
 {id:'as-wave-25',name:'Halfway Hero',description:'Reach wave 25 in Crom Bás Invaders.',icon:'🏹'},
 {id:'as-wave-50',name:'Crom Conqueror',description:'Clear 50 waves in Crom Bás Invaders.',icon:'👑'},
 {id:'as-three-clears',name:'Endless Archer',description:'Clear three 50-wave cycles.',icon:'✨'},
 {id:'as-all-skills',name:'Full Quiver',description:'Unlock every Crom Bás Invaders skill.',icon:'🏹'},
 {id:'as-melci',name:'Melci Down',description:'Defeat Melci Diafol.',icon:'⚔️'},
 {id:'as-irusan',name:'Cat and Mouse',description:'Defeat Irusan.',icon:'🐈'},
 {id:'as-glas',name:'Glass Breaker',description:'Defeat Glas Ghaibhleann.',icon:'💥'},
 {id:'as-giga',name:'Giga Victory',description:'Defeat Giga Glas Ghaibhleann.',icon:'👑'},
 {id:'as-boss-hunter',name:'Crom Boss Hunter',description:'Defeat all three Crom Bás bosses.',icon:'🏆'},
 {id:'as-encore',name:'Encore',description:'Complete a second 50-wave cycle.',icon:'🔁'},
 {id:'as-kills-250',name:'Arrow Rain',description:'Defeat 250 enemies.',icon:'🏹'},
 {id:'as-kills-1000',name:'Quiver of Legends',description:'Defeat 1,000 enemies.',icon:'✨'},
 {id:'as-fragment-shop',name:'Dark Erg Crafter',description:'Spend 500 Dark Erg Fragments.',icon:'◈'},
 {id:'as-chunk-shop',name:'Dark Erg Merchant',description:'Spend 50 Dark Erg Chunks.',icon:'◆'},
 {id:'as-stones',name:'Stone Courier',description:'Buy ten Special Upgrade stones with Dark Erg.',icon:'💎'},
 {id:'as-max-crash',name:'Shrapnel Master',description:'Max all three Crash Shot upgrades.',icon:'🎯'},
 {id:'as-all-bonuses',name:'Helping Hand',description:'Buy a bonus for each of the four other minigames.',icon:'🤝'},

 {id:'ev-first-wave',name:'First Defense',description:'Reach the first EV Tower Range Lab wave.',icon:'🏰'},
 {id:'ev-ten-waves',name:'Ten-Wave Defender',description:'Reach wave 10 in the EV Tower Range Lab.',icon:'🛡'},
 {id:'pig-first-run',name:'Pig Pursuit Participant',description:'Complete a Pig Pursuit run.',icon:'🐷'},
 {id:'special-bricked',name:'Oops, That Hurt',description:'Lock a weapon by failing a high-step Special Upgrade.',icon:'💥'},
 {id:'special-essence-buy',name:'Second Chance',description:'Buy a Special Upgrade Recovery Essence.',icon:'🧪'},
 {id:'special-essence-use',name:'Back in Business',description:'Restore a locked weapon with Recovery Essence.',icon:'🔧'},
 {id:'special-step8',name:'Eighth Wonder',description:'Reach Special Upgrade Step 8.',icon:'✨'},

 {id:'special-step5',name:'Into the Forge',description:'Reach Special Upgrade Step 5.',icon:'⚒'},
 {id:'special-step7',name:'Lucky Seven',description:'Reach Special Upgrade Step 7.',icon:'⭐'},
 {id:'special-red8',name:'Crimson Crown',description:'Reach Special Upgrade R8.',icon:'🔴'},
 {id:'special-blue8',name:'Azure Crown',description:'Reach Special Upgrade S8.',icon:'🔵'},
 {id:'special-protection',name:'Close Call',description:'Survive a failed Step 6–8 attempt with a protective stone.',icon:'🛡'},
 {id:'special-rebound',name:'The Comeback Kid',description:'Upgrade a weapon after restoring it with Recovery Essence.',icon:'🔧'},
 {id:'special-steps-25',name:'Stone by Stone',description:'Successfully complete 25 Special Upgrade attempts.',icon:'💠'},
 {id:'special-steps-100',name:'Anvil Regular',description:'Successfully complete 100 Special Upgrade attempts.',icon:'⚒'},
 {id:'special-stones-10',name:'Stone Collector',description:'Earn ten Special Upgrade stones from minigames.',icon:'💎'},
 {id:'special-stones-50',name:'Stone Hoarder',description:'Earn fifty Special Upgrade stones from minigames.',icon:'💎'},
 {id:'special-chest-return',name:'Safe Keeping',description:'Return a Special Upgraded weapon to the Storage Chest.',icon:'📦'},
 {id:'special-s50',name:'Forged to the Limit',description:'Reach Step 8 on an Erg S50 weapon.',icon:'✨'},
 {id:'special-step8-limit',name:'Beyond the Anvil',description:'Combine Step 8 and a Limit Break on the same weapon.',icon:'🌟'},
 {id:'special-s50-limit',name:'Perfect Storm',description:'Combine Step 8, Erg S50, and a Limit Break on the same weapon.',icon:'👑'},

 {id:'bandit-streak',name:'Bandit Hunt Streak',description:'Achieve a 3-run streak in Bandit Hunt.',icon:'🎭'},
 {id:'herb-gatherer',name:'Herb Gatherer',description:'Collect 25 herbs.',icon:'🌿'},
 {id:'ev-wave-5',name:'Hold the Line 5',description:'Reach wave 5 in Tower Range Lab.',icon:'🏰'},
 {id:'ev-wave-15',name:'Hold the Line 15',description:'Reach wave 15 in Tower Range Lab.',icon:'🏰'},
 {id:'ev-wave-25',name:'Hold the Line 25',description:'Reach wave 25 in Tower Range Lab.',icon:'🏰'},
 {id:'ev-wave-40',name:'Hold the Line 40',description:'Reach wave 40 in Tower Range Lab.',icon:'🏰'},
 {id:'ev-wave-60',name:'Hold the Line 60',description:'Reach wave 60 in Tower Range Lab.',icon:'🏰'},
 {id:'ev-arsenal',name:'Arsenal Assembled',description:'Place five towers in Tower Range Lab.',icon:'🗼'},
 {id:'ev-weapon-2',name:'New Lance',description:'Equip a stronger lance in Tower Range Lab.',icon:'⚔'},
 {id:'ev-weapon-5',name:'Legendary Lance',description:'Reach the final lance tier in Tower Range Lab.',icon:'🌟'},
 {id:'ev-link-5',name:'Arcana Linked',description:'Reach Arcana Link V in Tower Range Lab.',icon:'✨'},
 {id:'ev-link-10',name:'Full Link',description:'Reach Arcana Link X in Tower Range Lab.',icon:'💫'},
 {id:'pig-runs-3',name:'Pig Pursuit ×3',description:'Complete 3 Pig Pursuit runs.',icon:'🐷'},
 {id:'pig-runs-5',name:'Pig Pursuit ×5',description:'Complete 5 Pig Pursuit runs.',icon:'🐷'},
 {id:'pig-runs-10',name:'Pig Pursuit ×10',description:'Complete 10 Pig Pursuit runs.',icon:'🐷'},
 {id:'pig-time-15',name:'Pig Pursuit: 15s',description:'Finish Pig Pursuit in 15 seconds or less.',icon:'⏱'},
 {id:'pig-time-30',name:'Pig Pursuit: 30s',description:'Finish Pig Pursuit in 30 seconds or less.',icon:'⏱'},
 {id:'pig-time-60',name:'Pig Pursuit: 60s',description:'Finish Pig Pursuit in 60 seconds or less.',icon:'⏱'},
 {id:'pig-time-90',name:'Pig Pursuit: 90s',description:'Finish Pig Pursuit in 90 seconds or less.',icon:'⏱'},
 {id:'bandit-streak-5',name:'Bandit Streak 5',description:'Reach a Bandit Hunt streak of 5.',icon:'🎭'},
 {id:'bandit-streak-10',name:'Bandit Streak 10',description:'Reach a Bandit Hunt streak of 10.',icon:'🎭'},
 {id:'bandit-streak-20',name:'Bandit Streak 20',description:'Reach a Bandit Hunt streak of 20.',icon:'🎭'},
 {id:'bandit-streak-40',name:'Bandit Streak 40',description:'Reach a Bandit Hunt streak of 40.',icon:'🎭'},
 {id:'bandit-ducats-1000',name:'Ducat Hunter 1,000',description:'Earn 1,000 total ducats in Bandit Hunt.',icon:'🪙'},
 {id:'bandit-ducats-10000',name:'Ducat Hunter 10,000',description:'Earn 10,000 total ducats in Bandit Hunt.',icon:'🪙'},
 {id:'bandit-ducats-50000',name:'Ducat Hunter 50,000',description:'Earn 50,000 total ducats in Bandit Hunt.',icon:'🪙'},
 {id:'bandit-ducats-100000',name:'Ducat Hunter 100,000',description:'Earn 100,000 total ducats in Bandit Hunt.',icon:'🪙'},
 {id:'herb-total-50',name:'Herb Basket 50',description:'Collect 50 herbs.',icon:'🌿'},
 {id:'herb-total-100',name:'Herb Basket 100',description:'Collect 100 herbs.',icon:'🌿'},
 {id:'herb-total-250',name:'Herb Basket 250',description:'Collect 250 herbs.',icon:'🌿'},
 {id:'herb-total-500',name:'Herb Basket 500',description:'Collect 500 herbs.',icon:'🌿'},
 {id:'herb-challenge-10',name:'Herb Sprint 10',description:'Collect 10 herbs in one timed challenge.',icon:'🌱'},
 {id:'herb-challenge-20',name:'Herb Sprint 20',description:'Collect 20 herbs in one timed challenge.',icon:'🌱'},
 {id:'herb-challenge-40',name:'Herb Sprint 40',description:'Collect 40 herbs in one timed challenge.',icon:'🌱'},
 {id:'erg-b20',name:'Erg B20',description:'Reach Erg B20 on a weapon.',icon:'🔨'},
 {id:'erg-b50',name:'Erg B50',description:'Reach Erg B50 on a weapon.',icon:'🔨'},
 {id:'erg-a30',name:'Erg A30',description:'Reach Erg A30 on a weapon.',icon:'🔨'},
 {id:'erg-a50',name:'Erg A50',description:'Reach Erg A50 on a weapon.',icon:'🔨'},
 {id:'erg-s30',name:'Erg S30',description:'Reach Erg S30 on a weapon.',icon:'🔨'},
 {id:'erg-s40',name:'Erg S40',description:'Reach Erg S40 on a weapon.',icon:'🔨'},
 {id:'erg-s50',name:'Erg S50',description:'Reach Erg S50 on a weapon.',icon:'🔨'},
 {id:'reforge-dazzling-buy',name:'Dazzling Purchase',description:'Buy a Dazzling Reforging Tool.',icon:'✨'},
 {id:'reforge-dazzling-five',name:'Dazzling Collector',description:'Buy five Dazzling Reforging Tools.',icon:'💎'},
 {id:'reforge-dazzling-use',name:'Dazzling Debut',description:'Use a Dazzling Reforging Tool.',icon:'🌟'},
 {id:'reforge-limit-break',name:'Limit Break!',description:'Roll a Limit Break reforge.',icon:'💥'},
 {id:'reforge-limit-break-three',name:'Beyond the Limit',description:'Roll three Limit Break reforges.',icon:'🔥'},
 {id:'reforge-attempt-25',name:'Reforge Apprentice',description:'Make 25 reforge attempts.',icon:'🎲'},
 {id:'reforge-attempt-100',name:'Reforge Regular',description:'Make 100 reforge attempts.',icon:'🎰'},
 {id:'reforge-chest-five',name:'Treasure Keeper',description:'Store five reforged items.',icon:'📦'},
 {id:'oath-sequence',name:'Oath Rehearsal',description:'Complete an Oath snapshot sequence.',icon:'🛡'},
 {id:'oath-memory',name:'From Memory',description:'Complete an Oath snapshot sequence with steps hidden.',icon:'🧠'},
 {id:'oath-memory-five',name:'Oath Memorized',description:'Complete five Oath sequences from memory.',icon:'👑'},
 {id:'first-clear',name:'First Boss Clear',description:'Your first verified clear of an encounter with this character in the Vault.',icon:'🏆'},
 {id:'debuff-variety',name:'Versatile Support',description:'Contribute at least two distinct tracked debuff groups in one attempt, with recorded or uniquely correlated evidence.',icon:'✺'},
 {id:'attempt-damage',name:'Attempt Damage Breakthrough',description:'Increase observed personal damage in a matched encounter attempt by at least 20%. Not boss-only or normalized for duration.',icon:'⬆'},
 {id:'sole-survivor',name:'Sole Survivor',description:'Finish a verified Bri Leith gate deathless while every other recorded party member falls at least once.',icon:'✦'},
 {id:'last-one-standing',name:'Last One Standing',description:'The others have fallen, but you’re not finished yet. Bring it home.',icon:'⚔'},
 {id:'against-all-odds',name:'Against All Odds',description:'Complete a Bri Leith gate despite at least two teammates exhausting their normal revives.',icon:'🏁'},
 {id:'first-deathless',name:'Untouchable',description:'Your first verified deathless boss clear.',icon:'✦'},
 {id:'fewer-deaths',name:'Fewer Falls',description:'Reduce your deaths on a repeated encounter, reach zero, or keep zero deaths across verified clears.',icon:'🛡'},
 {id:'deathless',name:'Deathless Improvement',description:'Return to an encounter and finish with zero recorded deaths.',icon:'★'},
 {id:'skill-hit',name:'Skill-Specific Peak',description:'Set a new largest hit for an individual skill.',icon:'⚔'},
 {id:'hit',name:'New Biggest Hit',description:'Improve your best recorded individual hit.',icon:'⚡'},
 {id:'total-damage',name:'More Damage Dealt',description:'Increase recorded total damage by 10% or more in comparable reports.',icon:'◆'},
 {id:'faster-combat',name:'Faster Boss Combat',description:'Finish a comparable verified boss fight more quickly.',icon:'⏱'},
 {id:'dps',name:'Damage Breakthrough',description:'Celebrate an improvement in your recorded DPS.',icon:'↗'},
 {id:'taken',name:'Stronger Defense',description:'Take less recorded damage in a comparable attempt, or maintain zero damage taken across verified clears.',icon:'◈'},
 {id:'debuff-contributor',name:'Debuff Contributor',description:'Help apply at least one observed boss debuff, with attacker attribution or unique nearby skill-hit evidence.',icon:'✧'},
 {id:'early-debuff',name:'Quick Setup',description:'Your attributed debuff arrives within 10 seconds of the boss appearing.',icon:'⚡'},
 {id:'full-party-coverage',name:'Full Party Coverage',description:'Observe all nine debuff effects on the boss during a verified clear. Any source counts; they do not need to overlap.',icon:'🏅'},
 {id:'perfectly-dressed',name:'Perfectly Dressed',description:'Keep all nine debuff effects on the boss simultaneously for six uninterrupted minutes during a verified clear.',icon:'🎩'},
 {id:'clockwork',name:'Clockwork',description:'Finish five verified Bri Leith gate boss fights in less than half the applicable mission time allowance.',icon:'⏲'},
 {id:'long-haul',name:'The Long Haul',description:'An exhausting boss fight took a very long time to clear. But you did it.',icon:'🏁'},
 {id:'burst-brilliance',name:'Burst of Brilliance',description:'Break your recorded personal damage record over a ten-second window in a comparable boss attempt.',icon:'💥'},
 {id:'never-off-duty',name:'Never Off Duty',description:'Contribute identifiable boss debuffs in three successive verified clears of the same encounter.',icon:'✧'},
 {id:'to-the-nines',name:'To the Nines',description:'Keep at least 7 of 9 debuff effects active simultaneously for 97% or more of a verified boss fight. Refresh gaps are allowed within the remaining 3%.',icon:'🎩'},
 {id:'personal-best-streak',name:'Personal Best Streak',description:'Successive verified boss-time personal records.',icon:'🔥'},
 {id:'reliable-finisher',name:'Reliable Finisher',description:'Consecutive verified deathless clears: 3, 5 and 10.',icon:'🛡'},
 {id:'skill-specialist',name:'Skill Specialist',description:'New recorded single-hit peaks from multiple distinct skills.',icon:'⚔'},
 {id:'debuff-regular',name:'Debuff Regular',description:'Contribute observable debuffs in multiple comparable attempts.',icon:'✳'},
 {id:'the-comeback',name:'The Comeback',description:'Follow a difficult attempt with a verified deathless clear.',icon:'↗'},
 {id:'speedrunner-journey',name:'Speedrunner’s Journey',description:'Verified boss combat personal best progression.',icon:'⏱'}
];
function minigameAwards(){
 const awards=[],when=Date.now(),add=(id,title,detail)=>awards.push({id:'minigame:'+id,type:id,title,detail,date:when,encounter:'Arcana Minigames',player:state.characterName||'Player'});
 const thetaAwards=window.MIDIR_THETA?.achievements?.()||[];for(const award of thetaAwards){if(award.unlocked)add('theta-'+award.id,award.title,'Earned in Dark Diviner: Subject Theta Containment.');}
 const ev=window.MIDIR_EV_DEFENSE?.exportState?.();
 const asGame=window.MIDIR_AS_INVADERS?.getProgress?.();
 if(asGame?.attempts>=1)add('as-first-flight','First Flight','Launch a Crom Bás Invaders run.');
 if(asGame?.best>=10)add('as-wave-10','Into the Darkness','Reach wave 10 in Crom Bás Invaders.');
 if(asGame?.best>=25)add('as-wave-25','Halfway Hero','Reach wave 25 in Crom Bás Invaders.');
 if(asGame?.best>=50)add('as-wave-50','Crom Conqueror','Clear wave 50 in Crom Bás Invaders.');
 if(asGame?.clears>=3)add('as-three-clears','Endless Archer','Complete three 50-wave cycles.');
 if(Object.keys(asGame?.skills||{}).filter(k=>asGame.skills[k]).length>=8)add('as-all-skills','Full Quiver','Unlock all Crom Bás Invaders skills.');
 if((asGame?.minibossWins||0)>0)add('as-melci','Melci Down','Defeat Melci Diafol.');
 if((asGame?.bossWins?.Irusan||0)>0)add('as-irusan','Cat and Mouse','Defeat Irusan.');
 if((asGame?.bossWins?.['Glas Ghaibhleann']||0)>0)add('as-glas','Glass Breaker','Defeat Glas Ghaibhleann.');
 if((asGame?.bossWins?.['Giga Glas Ghaibhleann']||0)>0)add('as-giga','Giga Victory','Defeat Giga Glas Ghaibhleann.');
 if(['Irusan','Glas Ghaibhleann','Giga Glas Ghaibhleann'].every(n=>(asGame?.bossWins?.[n]||0)>0))add('as-boss-hunter','Crom Boss Hunter','Defeat all Crom Bás boss variants.');
 if((asGame?.clears||0)>=2)add('as-encore','Encore','Complete two 50-wave cycles.');
 if((asGame?.kills||0)>=250)add('as-kills-250','Arrow Rain','Defeat 250 enemies.');
 if((asGame?.kills||0)>=1000)add('as-kills-1000','Quiver of Legends','Defeat 1,000 enemies.');
 if((asGame?.spentFragments||0)>=500)add('as-fragment-shop','Dark Erg Crafter','Spend 500 Dark Erg Fragments.');
 if((asGame?.spentChunks||0)>=50)add('as-chunk-shop','Dark Erg Merchant','Spend 50 Dark Erg Chunks.');
 if(['red','blue','pred','pblue','ladeca','eweca','pladeca','peweca'].reduce((n,k)=>n+(Number(asGame?.purchases?.[k])||0),0)>=10)add('as-stones','Stone Courier','Buy ten stones from the Dark Erg Shop.');
 if(['crashCount','crashRadius','crashPower'].every((n,i)=>(asGame?.reforges?.[n]||0)>=[4,5,5][i]))add('as-max-crash','Shrapnel Master','Max Crash Shot upgrades.');
 if(['limit','herb','ducats','tickets'].every(n=>(asGame?.purchases?.[n]||0)>0))add('as-all-bonuses','Helping Hand','Buy all four other-minigame bonuses.');

 if(ev&&Number(ev.wave)>=1)add('ev-first-wave','First Defense','Started a campaign and reached at least wave 1 in EV Tower Range Lab.');
 if(ev&&Number(ev.best)>=10)add('ev-ten-waves','Ten-Wave Defender','Reached wave 10 in EV Tower Range Lab.');
 const pig=window.MIDIR_PIG?.exportState?.();if(pig&&Array.isArray(pig.runs)&&pig.runs.length)add('pig-first-run','Pig Pursuit Participant','Completed a Pig Pursuit run.');
 const bb=window.MIDIR_BB?.exportState?.();if(bb&&Number(bb.bestStreak)>=3)add('bandit-streak','Bandit Hunt Streak','Achieved a streak of at least 3 in Bandit Hunt.');
 const herbs=window.MIDIR_HERBS?.exportState?.();if(herbs&&Number(herbs.chest?.total)>=25)add('herb-gatherer','Herb Gatherer','Collected at least 25 herbs.');

 const su=window.MIDIR_SPECIAL_UPGRADE?.exportState?.();if(su?.stats?.bricked)add('special-bricked','Oops, That Hurt','Bricked a weapon with a failed Special Upgrade.');if(su?.stats?.essencesBought)add('special-essence-buy','Second Chance','Bought a Special Upgrade Recovery Essence.');if(su?.stats?.essencesUsed)add('special-essence-use','Back in Business','Recovered a locked weapon.');if(su?.stats?.step8)add('special-step8','Eighth Wonder','Reached Special Upgrade Step 8.');
 const rf=window.MIDIR_REFORGE?.exportState?.(),erg=window.MIDIR_ERG?.exportState?.(),oath=window.MIDIR_SG_OATH?.exportState?.();
 if(ev&&Number(ev.best)>= 5)add('ev-wave-5','Hold the Line 5','Reach wave 5 in Tower Range Lab.');
 if(ev&&Number(ev.best)>= 15)add('ev-wave-15','Hold the Line 15','Reach wave 15 in Tower Range Lab.');
 if(ev&&Number(ev.best)>= 25)add('ev-wave-25','Hold the Line 25','Reach wave 25 in Tower Range Lab.');
 if(ev&&Number(ev.best)>= 40)add('ev-wave-40','Hold the Line 40','Reach wave 40 in Tower Range Lab.');
 if(ev&&Number(ev.best)>= 60)add('ev-wave-60','Hold the Line 60','Reach wave 60 in Tower Range Lab.');
 if(ev&&ev.towers?.length>=5)add('ev-arsenal','Arsenal Assembled','Place five towers in Tower Range Lab.');
 if(ev&&Number(ev.weapon)>=1)add('ev-weapon-2','New Lance','Equip a stronger lance in Tower Range Lab.');
 if(ev&&Number(ev.weapon)>=4)add('ev-weapon-5','Legendary Lance','Reach the final lance tier in Tower Range Lab.');
 if(ev&&Number(ev.linkLevel)>=5)add('ev-link-5','Arcana Linked','Reach Arcana Link V in Tower Range Lab.');
 if(ev&&Number(ev.linkLevel)>=10)add('ev-link-10','Full Link','Reach Arcana Link X in Tower Range Lab.');
 if(pig&&pig.runs?.length>=3)add('pig-runs-3','Pig Pursuit ×3','Complete 3 Pig Pursuit runs.');
 if(pig&&pig.runs?.length>=5)add('pig-runs-5','Pig Pursuit ×5','Complete 5 Pig Pursuit runs.');
 if(pig&&pig.runs?.length>=10)add('pig-runs-10','Pig Pursuit ×10','Complete 10 Pig Pursuit runs.');
 if(pig&&pig.runs?.some(r=>Number(r.time)>=15))add('pig-time-15','Pig Pursuit: 15s','Finish Pig Pursuit in 15 seconds or less.');
 if(pig&&pig.runs?.some(r=>Number(r.time)>=30))add('pig-time-30','Pig Pursuit: 30s','Finish Pig Pursuit in 30 seconds or less.');
 if(pig&&pig.runs?.some(r=>Number(r.time)>=60))add('pig-time-60','Pig Pursuit: 60s','Finish Pig Pursuit in 60 seconds or less.');
 if(pig&&pig.runs?.some(r=>Number(r.time)>=90))add('pig-time-90','Pig Pursuit: 90s','Finish Pig Pursuit in 90 seconds or less.');
 if(bb&&Number(bb.bestStreak)>=5)add('bandit-streak-5','Bandit Streak 5','Reach a Bandit Hunt streak of 5.');
 if(bb&&Number(bb.bestStreak)>=10)add('bandit-streak-10','Bandit Streak 10','Reach a Bandit Hunt streak of 10.');
 if(bb&&Number(bb.bestStreak)>=20)add('bandit-streak-20','Bandit Streak 20','Reach a Bandit Hunt streak of 20.');
 if(bb&&Number(bb.bestStreak)>=40)add('bandit-streak-40','Bandit Streak 40','Reach a Bandit Hunt streak of 40.');
 if(bb&&Number(bb.totalDucatsEarned)>=1000)add('bandit-ducats-1000','Ducat Hunter 1,000','Earn 1,000 total ducats in Bandit Hunt.');
 if(bb&&Number(bb.totalDucatsEarned)>=10000)add('bandit-ducats-10000','Ducat Hunter 10,000','Earn 10,000 total ducats in Bandit Hunt.');
 if(bb&&Number(bb.totalDucatsEarned)>=50000)add('bandit-ducats-50000','Ducat Hunter 50,000','Earn 50,000 total ducats in Bandit Hunt.');
 if(bb&&Number(bb.totalDucatsEarned)>=100000)add('bandit-ducats-100000','Ducat Hunter 100,000','Earn 100,000 total ducats in Bandit Hunt.');
 if(herbs&&Number(herbs.chest?.total)>=50)add('herb-total-50','Herb Basket 50','Collect 50 herbs.');
 if(herbs&&Number(herbs.chest?.total)>=100)add('herb-total-100','Herb Basket 100','Collect 100 herbs.');
 if(herbs&&Number(herbs.chest?.total)>=250)add('herb-total-250','Herb Basket 250','Collect 250 herbs.');
 if(herbs&&Number(herbs.chest?.total)>=500)add('herb-total-500','Herb Basket 500','Collect 500 herbs.');
 if(herbs&&herbs.challenge?.runs?.some(r=>Number(r.collected)>=10))add('herb-challenge-10','Herb Sprint 10','Collect 10 herbs in one timed challenge.');
 if(herbs&&herbs.challenge?.runs?.some(r=>Number(r.collected)>=20))add('herb-challenge-20','Herb Sprint 20','Collect 20 herbs in one timed challenge.');
 if(herbs&&herbs.challenge?.runs?.some(r=>Number(r.collected)>=40))add('herb-challenge-40','Herb Sprint 40','Collect 40 herbs in one timed challenge.');
 if(erg&&erg.weapons?.some(w=>({"B":0,"A":1,"S":2}[w.route]>{"B":0,"A":1,"S":2}["B"]||w.route==="B"&&Number(w.level)>=20)))add('erg-b20','Erg B20','Reach Erg B20 on a weapon.');
 if(erg&&erg.weapons?.some(w=>({"B":0,"A":1,"S":2}[w.route]>{"B":0,"A":1,"S":2}["B"]||w.route==="B"&&Number(w.level)>=50)))add('erg-b50','Erg B50','Reach Erg B50 on a weapon.');
 if(erg&&erg.weapons?.some(w=>({"B":0,"A":1,"S":2}[w.route]>{"B":0,"A":1,"S":2}["A"]||w.route==="A"&&Number(w.level)>=30)))add('erg-a30','Erg A30','Reach Erg A30 on a weapon.');
 if(erg&&erg.weapons?.some(w=>({"B":0,"A":1,"S":2}[w.route]>{"B":0,"A":1,"S":2}["A"]||w.route==="A"&&Number(w.level)>=50)))add('erg-a50','Erg A50','Reach Erg A50 on a weapon.');
 if(erg&&erg.weapons?.some(w=>({"B":0,"A":1,"S":2}[w.route]>{"B":0,"A":1,"S":2}["S"]||w.route==="S"&&Number(w.level)>=30)))add('erg-s30','Erg S30','Reach Erg S30 on a weapon.');
 if(erg&&erg.weapons?.some(w=>({"B":0,"A":1,"S":2}[w.route]>{"B":0,"A":1,"S":2}["S"]||w.route==="S"&&Number(w.level)>=40)))add('erg-s40','Erg S40','Reach Erg S40 on a weapon.');
 if(erg&&erg.weapons?.some(w=>({"B":0,"A":1,"S":2}[w.route]>{"B":0,"A":1,"S":2}["S"]||w.route==="S"&&Number(w.level)>=50)))add('erg-s50','Erg S50','Reach Erg S50 on a weapon.');
 if(rf&&Number(rf.achievementStats?.dazzlingBought)>=1)add('reforge-dazzling-buy','Dazzling Purchase','Buy a Dazzling Reforging Tool.');
 if(rf&&Number(rf.achievementStats?.dazzlingBought)>=5)add('reforge-dazzling-five','Dazzling Collector','Buy five Dazzling Reforging Tools.');
 if(rf&&Number(rf.achievementStats?.dazzlingUsed)>=1)add('reforge-dazzling-use','Dazzling Debut','Use a Dazzling Reforging Tool.');
 if(rf&&Number(rf.achievementStats?.limitBreaks)>=1)add('reforge-limit-break','Limit Break!','Roll a Limit Break reforge.');
 if(rf&&Number(rf.achievementStats?.limitBreaks)>=3)add('reforge-limit-break-three','Beyond the Limit','Roll three Limit Break reforges.');
 if(rf&&Number(rf.attempts)>=25)add('reforge-attempt-25','Reforge Apprentice','Make 25 reforge attempts.');
 if(rf&&Number(rf.attempts)>=100)add('reforge-attempt-100','Reforge Regular','Make 100 reforge attempts.');
 if(rf&&rf.chest?.length>=5)add('reforge-chest-five','Treasure Keeper','Store five reforged items.');
 if(oath&&Number(oath.achievementStats?.sequenceCompletions)>=1)add('oath-sequence','Oath Rehearsal','Complete an Oath snapshot sequence.');
 if(oath&&Number(oath.achievementStats?.memoryCompletions)>=1)add('oath-memory','From Memory','Complete an Oath snapshot sequence with steps hidden.');
 if(oath&&Number(oath.achievementStats?.memoryCompletions)>=5)add('oath-memory-five','Oath Memorized','Complete five Oath sequences from memory.');

 // Cross-activity and mastery awards are based on saved, observable progress.
 const visits=Object.keys(state.minigameVisits||{});
 const featured=['ek:pig','bb:bb-bandit','fa:herbs','mp:erg','ev:reforge','mp:rhythm','ev:ev-defense','sg:oath','as:position','ag:ag-position','dd:theta','hs:music-lie'];
 const activities=visits.map(v=>v==='dd:dd-drill'?'dd:theta':v).filter(v=>featured.includes(v));
 const arcs=Object.keys(state.arcanaVisits||{});
 const reward=(id,condition)=>{if(condition){const def=achievementKinds.find(k=>k.id===id);if(def)add(id,def.name,def.description)}};
 const specialStats=su?.stats||{};const rStats=rf?.achievementStats||{};
 for(const [id,key,limit] of [['special-step5','step5',1],['special-step7','step7',1],['special-red8','red8',1],['special-blue8','blue8',1],['special-protection','protectedFailures',1],['special-rebound','upgradesAfterRecovery',1],['special-steps-25','successful',25],['special-steps-100','successful',100],['special-stones-10','stonesEarned',10],['special-stones-50','stonesEarned',50],['special-chest-return','returned',1],['special-s50','step8S50',1]])reward(id,Number(specialStats[key])>=limit);
 // A single weapon may reach these milestones in any order or return through the chest.
 // Inspect only the equipment's own Erg, Special Upgrade and reforge lines together.
 const inventoryItems=[...(su?.weapons||[]).map(w=>({erg:w.origin?.erg,specialUpgrade:{step:w.step,kind:w.kind},lines:w.origin?.lines||[]})),...(rf?.chest||[]),...(rf?.activeErgItem?[{...rf.activeErgItem,lines:rf?.results?.length?rf.results:rf.activeErgItem.lines}]:[]),...(erg?.weapons||[]).map(w=>({erg:w,specialUpgrade:w.specialUpgrade,lines:w.lines||[]}))];
 const fullSet=w=>Number(w?.specialUpgrade?.step)>=8;
 const atS50=w=>w?.erg?.route==='S'&&Number(w.erg.level)>=50;
 const withLimit=w=>Array.isArray(w?.lines)&&w.lines.some(line=>line.limit===true);
 reward('special-s50',inventoryItems.some(w=>fullSet(w)&&atS50(w)));
 reward('special-step8-limit',Number(specialStats.step8Limit)>=1||Number(rStats.step8LimitBreaks)>=1||inventoryItems.some(w=>fullSet(w)&&withLimit(w)));
 reward('special-s50-limit',Number(specialStats.step8S50Limit)>=1||Number(rStats.step8S50LimitBreaks)>=1||inventoryItems.some(w=>fullSet(w)&&atS50(w)&&withLimit(w)));
 for(const [id,n] of [['tour-three',3],['tour-six',6],['tour-ten',10]])reward(id,activities.length>=n);
 reward('tour-all',featured.every(v=>activities.includes(v)));
 for(const [id,n] of [['arcana-three',3],['arcana-six',6],['arcana-ten',10]])reward(id,arcs.length>=n);
 const sales=Array.isArray(rf?.sales)?rf.sales:[];
 reward('auction-first',sales.length>=1);
 reward('auction-100m',sales.some(x=>Number(x.payout)>=100000000));
 reward('auction-billion',sales.some(x=>Number(x.payout)>=1000000000));
 reward('auction-3',sales.length>=3);reward('auction-10',sales.length>=10);
 reward('auction-lifetime-billion',sales.reduce((sum,x)=>sum+(Number(x.payout)||0),0)>=1000000000);
 reward('erg-s50-break',Number(rf?.achievementStats?.s50LimitBreaks)>=1);
 for(const [id,n] of [['erg-taps-100',100],['erg-taps-500',500]])reward(id,Number(erg?.attempts)>=n);
 const weapons=Array.isArray(erg?.weapons)?erg.weapons:[];
 reward('erg-two-weapons',weapons.length>=2);reward('erg-five-weapons',weapons.length>=5);
 reward('erg-s50-two',weapons.filter(w=>w.route==='S'&&Number(w.level)>=50).length>=2);
 for(const [id,n] of [['reforge-attempt-500',500],['reforge-attempt-1000',1000]])reward(id,Number(rf?.attempts)>=n);
 reward('reforge-dazzling-ten',Number(rf?.achievementStats?.dazzlingBought)>=10);
 reward('reforge-dazzling-used-10',Number(rf?.achievementStats?.dazzlingUsed)>=10);
 reward('reforge-limit-five',Number(rf?.achievementStats?.limitBreaks)>=5);
 reward('reforge-limit-ten',Number(rf?.achievementStats?.limitBreaks)>=10);
 reward('reforge-chest-ten',(rf?.chest?.length||0)>=10);
 reward('oath-memory-ten',Number(oath?.achievementStats?.memoryCompletions)>=10);
 reward('oath-memory-25',Number(oath?.achievementStats?.memoryCompletions)>=25);
 reward('oath-sequences-ten',Number(oath?.achievementStats?.sequenceCompletions)>=10);
 reward('pig-runs-25',(pig?.runs?.length||0)>=25);reward('pig-runs-50',(pig?.runs?.length||0)>=50);
 reward('bandit-streak-75',Number(bb?.bestStreak)>=75);
 reward('bandit-ducats-million',Number(bb?.totalDucatsEarned)>=1000000);
 reward('herb-total-1000',Number(herbs?.chest?.total)>=1000);
 reward('herb-total-2500',Number(herbs?.chest?.total)>=2500);
 reward('ev-wave-100',Number(ev?.best)>=100);reward('ev-wave-150',Number(ev?.best)>=150);
 reward('ev-ten-towers',(ev?.towers?.length||0)>=10);
 reward('ev-all-maps',Object.keys(ev?.visitedMaps||{}).length>=6);
 reward('cross-erg-reforge',weapons.some(w=>w.route==='S'&&Number(w.level)>=50)&&Number(rf?.achievementStats?.limitBreaks)>=1);
 reward('cross-oath-ev',Number(oath?.achievementStats?.memoryCompletions)>=1&&Number(ev?.best)>=10);
 reward('cross-pig-bandit',(pig?.runs?.length||0)>=10&&Number(bb?.bestStreak)>=10);
 reward('cross-herb-erg',Number(herbs?.chest?.total)>=500&&weapons.some(w=>w.route==='S'&&Number(w.level)>=40));
 reward('cross-collector',(rf?.chest?.length||0)>=5&&weapons.length>=5);
 // Collection awards only count underlying achievements, avoiding self-unlock loops.
 const distinct=new Set([...(state.metricMilestones||[]).map(x=>x.type),...(state.minigameUnlocked||[]).map(x=>x.type),...awards.map(x=>x.type)]);
 for(const [id,n] of [['achievement-25',25],['achievement-50',50],['achievement-100',100]])reward(id,distinct.size>=n);
 const history=Array.isArray(state.minigameUnlocked)?state.minigameUnlocked:[];
 const existing=new Set(history.map(x=>x.type));const fresh=awards.filter(x=>!existing.has(x.type));
 if(fresh.length){state.minigameUnlocked=[...history,...fresh.map(x=>({...x,id:x.id,date:Date.now()}))];save();}
 return state.minigameUnlocked||awards;
}
const ACH_BOOK_GROUPS=[
 {name:'The Vault',detail:'Moments from your recorded adventures',match:id=>achievementKinds.findIndex(k=>k.id===id)>=achievementKinds.findIndex(k=>k.id==='first-clear')},
 {name:'Exploration & Collections',detail:'Discover the Companion and collect awards',match:id=>/^(tour-|arcana-|achievement-|cross-)/.test(id)},
 {name:'Crom Bás Invaders',detail:'Waves, bosses, and Dark Erg',match:id=>id.startsWith('as-')},
 {name:'Tower Range Lab',detail:'Hold the line',match:id=>id.startsWith('ev-')},
 {name:'Pig Pursuit',detail:'Catch that pig',match:id=>id.startsWith('pig-')},
 {name:'Bandit Hunt',detail:'Streaks and ducats',match:id=>id.startsWith('bandit-')},
 {name:'Herb Collection',detail:'Gathering adventures',match:id=>id.startsWith('herb-')},
 {name:'Erg Simulator',detail:'Upgrade your arsenal',match:id=>id.startsWith('erg-')},
 {name:'Reforge & Auction House',detail:'Roll, trade, repeat',match:id=>/^(reforge-|auction-)/.test(id)},
 {name:'Special Upgrade',detail:'Stones and the anvil',match:id=>id.startsWith('special-')},
 {name:'Oath Workshop',detail:'Remember your oath',match:id=>id.startsWith('oath-')},
 {name:'Other Achievements',detail:'More to discover',match:id=>true}
];
let achievementBookPage=0,achievementBookOpen=false;
// Midir-import-derived achievements begin with first-clear and are hidden in game-only mode.
// The underlying records are retained so enabling Secret Sauce restores the full collection.
function visibleAchievementKinds(){const kinds=achievementKinds;return companionPrefs().secretSauce?kinds:kinds.filter(k=>kinds.indexOf(k)<kinds.findIndex(x=>x.id==='first-clear'));}

function achievementBookPages(){
 const assigned=new Set(),result=[];
 for(const group of ACH_BOOK_GROUPS){const entries=visibleAchievementKinds().filter(k=>!assigned.has(k.id)&&group.match(k.id));entries.forEach(k=>assigned.add(k.id));if(!entries.length)continue;
 // Split long collections into readable book spreads instead of tiny overcrowded badges.
 for(let i=0;i<entries.length;i+=12)result.push({name:group.name,detail:group.detail,entries:entries.slice(i,i+12),part:Math.floor(i/12)+1,parts:Math.ceil(entries.length/12)});
 }
 return result;
}
function achievementCatalogHtml(){
 const banked=Object.entries(archiveLedger().awards).map(([type,v])=>({type,title:v.title||type,detail:'Banked lifetime archive achievement · '+v.count+' qualified credits',evidence:'archived-session-credit'}));const owned=[...(state.metricMilestones||[]),...banked,...minigameAwards()];
 const earned=new Map();for(const e of owned){if(!earned.has(e.type))earned.set(e.type,[]);earned.get(e.type).push(e)}
 const available=visibleAchievementKinds();
 const total=available.filter(k=>!k.planned).length;
 const count=available.filter(k=>!k.planned&&earned.has(k.id)).length;
 const recent=owned.filter(e=>available.some(k=>k.id===e.type&&!k.planned)).slice().sort((a,b)=>(Number(b.date)||0)-(Number(a.date)||0)).slice(0,5);
 const latest=recent.length?recent.map(e=>{const k=achievementKinds.find(x=>x.id===e.type);return `<div class="achievement-recent-card"><span class="achievement-recent-icon" aria-hidden="true">${k.icon}</span><span class="achievement-recent-copy"><strong>${esc(k.name)}</strong><small>${esc(e.title&&e.title!==k.name?e.title:k.description)}</small></span></div>`}).join(''):'<span class="hint">Your latest achievements will appear here.</span>';
 const pages=achievementBookPages();achievementBookPage=Math.max(0,Math.min(achievementBookPage,pages.length-1));const pg=pages[achievementBookPage];const selected=visibleAchievementKinds().find(k=>k.id===catalogOpenId&&pg.entries.some(e=>e.id===k.id));const matches=selected?earned.get(selected.id)||[]:[];
 const contents=pg.entries.map(k=>{const records=earned.get(k.id)||[];return `<button class="achievement-book-entry ${records.length?'catalog-earned':'catalog-locked'} ${selected?.id===k.id?'catalog-selected':''}" data-act="catalog-details:${k.id}" aria-label="${esc(k.name)}. ${records.length?'Earned':'Not yet earned'}"><span class="achievement-book-entry-icon" aria-hidden="true">${k.icon}</span><strong>${esc(k.name)}</strong><small>${records.length?'Earned ✓':k.planned?'Coming soon':'Not yet'}</small></button>`}).join('');
 return `<div class="catalog-summary"><span><strong>${count} / ${total}</strong> achievements discovered</span></div>
 <div class="achievement-recent"><strong>Latest achievements</strong><div class="achievement-recent-strip">${latest}</div></div>
 <button class="achievement-book-launch" data-act="achievement-book-open"><span aria-hidden="true">📖</span><span>Open Achievement Book <small>${count}/${total} discovered</small></span></button>
 ${achievementBookOpen?`<div class="achievement-book-overlay" role="presentation"><div class="achievement-book-dialog" role="dialog" aria-modal="true" aria-label="Achievement Book" tabindex="-1"><div class="achievement-book-head"><strong>📖 Achievement Book</strong><button class="achievement-book-close" data-act="achievement-book-close" aria-label="Close Achievement Book">✕</button></div><div class="achievement-book-spread"><div class="achievement-book-page"><div class="achievement-book-page-title"><span>${esc(pg.name)}</span><small>${pg.parts>1?'Part '+pg.part+' of '+pg.parts+' · ':''}${esc(pg.detail)}</small></div><div class="achievement-book-grid">${contents}</div></div><div class="achievement-book-page achievement-book-detail-page">${selected?`<div class="achievement-book-detail-icon">${selected.icon}</div><h3>${esc(selected.name)}</h3><p>${esc(selected.description)}</p><strong>${matches.length?'Unlocked':'Not yet unlocked'}</strong>${matches.length?`<div class="achievement-book-unlocks">${matches.slice(-3).reverse().map(e=>`<small>${esc(e.detail||e.title||'Award earned')}${e.date?' · '+new Date(e.date).toLocaleDateString():''}</small>`).join('')}</div>`:''}`:`<div class="achievement-book-placeholder"><span aria-hidden="true">✦</span><h3>${esc(pg.name)}</h3><p>Choose an achievement to see its story.</p><strong>${pg.entries.filter(k=>earned.has(k.id)).length} / ${pg.entries.filter(k=>!k.planned).length} discovered on this page</strong></div>`}</div></div><div class="achievement-book-footer"><button data-act="achievement-book-prev" ${achievementBookPage===0?'disabled':''}>← Previous</button><span>Page ${achievementBookPage+1} of ${pages.length}</span><button data-act="achievement-book-next" ${achievementBookPage===pages.length-1?'disabled':''}>Next →</button></div></div></div>`:''}`;
}
let catalogOpenId=null;
function encounterRecordsHtml(){
 const A=window.MIDIR_ANALYSIS;if(!A)return '';
 const tracked=state.characterName.trim(),rows=[],best=new Map();
 for(const r of state.reports){if(r.archiveCompact)continue;const player=chosenPlayer(r);
  for(const a of A.encounters(r)){
   const deb=A.debuffs(r,a),contrib=player?deb.players.get(player.entityId):null;
   const deaths=player?.deathTimes?.filter(t=>t>=a.start&&t<=a.end).length;
   const damage=player?A.personalWindow(r,a,player):null;
   if(a.clear&&(!best.has(a.group)||a.duration<best.get(a.group).duration))best.set(a.group,{...a,report:r});
   const covered=deb.applied.map(x=>x.name),full=A.fullCoverage(r,a),nines=A.toTheNines(r,a);
   const credit=contrib?.credits||[];
   const list=credit.length?credit.map(c=>`<div class="hint"><strong>${esc(c.name)}</strong> at ${c.time.toFixed(1)}s (${Math.max(0,c.time-a.spawnAt).toFixed(1)}s after spawn) · ${c.method==='recorded-attacker'?'observed attacker ID':'matching skill-hit group within 3s'}${c.skillId?' · skill ID '+c.skillId:''}</div>`).join(''):'<span class="hint">No personal debuff source identified from available evidence. This does not mean you contributed nothing.</span>';
   rows.push(`<details class="encounter-attempt"><summary><strong>${esc(a.name)}</strong> · Attempt ${a.attempt} · ${a.duration.toFixed(0)}s · ${a.clear?'Verified clear':'Unverified/unfinished'} <span class="hint">${esc(r.name)}</span></summary>
    <p class="hint">Boss appeared at ${a.spawnAt.toFixed(0)}s ${a.spawnObserved?'(appearance observed)':'(spawn unverified)'}; attempt ${a.start.toFixed(0)}–${a.end.toFixed(0)}s on report timeline. ${esc(a.evidence)}. ${player?'Selected character: '+esc(player.name):'No matching Vault character.'}</p>
    <p><strong>Full Party Coverage: ${full.count}/${full.required} slots</strong> · ${full.complete?'All nine icons observed ✓':'Missing: '+esc(full.slots.filter(s=>!s.observed).map(s=>s.name).join(', '))}</p>    <p><strong>To the Nines:</strong> ${nines.eligible?(100*nines.fraction).toFixed(2)+'% of fight at 7/9 or better · '+nines.coveredSeconds.toFixed(1)+'s / '+nines.duration.toFixed(1)+'s · '+(nines.qualified?'97% target met ✓':'97% target not met'):'Cannot verify · '+esc(nines.reason)}</p>
<p><strong>Reference status coverage: ${deb.applied.length}/${deb.required}</strong> ${deb.completeReference?'· all currently listed categories observed':'· incomplete in recorded evidence'}</p>
    <p class="hint">Coverage checks the nine specified boss condition icon slots, regardless of source. Pet alternatives share slots; this measures appearance at least once, NOT continuous or simultaneous uptime.</p>
    <p class="hint">Observed: ${esc(covered.join(' · ')||'none of the reference conditions')}</p>
    <p><strong>Your contribution${contrib?.early.length?' · Early debuff within 10s ✓':''}</strong>${deaths!==undefined?' · '+deaths+' death(s) in attempt':''}</p>${list}
    ${damage?`<p class="hint">Damage-hit events in attempt window: ${fmt(Math.round(damage.damage))} · ${fmt(Math.round(damage.dps))}/s (${esc(damage.scope)}). Not a cast count or verified boss-only DPS.</p>`:'<p class="hint">No timestamped personal damage groups available for this selected window.</p>'}
   </details>`);
  }
 }
 const high=[...best.values()].sort((x,y)=>x.name.localeCompare(y.name)).map(a=>`<tr><td>${esc(a.name)}</td><td>${a.duration.toFixed(1)}s</td><td>${esc(a.report.name)}</td></tr>`).join('');
 const ref=A.categories.map(c=>`<span class="reference-condition">${esc(c.name)} <small>(${c.statuses.join(c.all===true?' + ':' / ')})</small></span>`).join('');
 return `<div class="encounter-records"><p class="hint">A session may contain several boss attempts. Verified clear times are measured per attempt, not across the entire recording. Each imported file keeps independent achievements, even if the session might be repeated.</p>
  ${high?`<h3>Fastest observed verified boss clears</h3><div class="scroll"><table><tr><th>Encounter</th><th>Time</th><th>Saved report</th></tr>${high}</table></div>`:'<p class="hint">No verified boss clears available for record comparisons yet.</p>'}
  <h3>Attempt and debuff evidence</h3>${rows.join('')||'<p class="hint">Import structured Midir HTML reports to see individual attempts.</p>'}
  <details class="encounter-attempt"><summary>Observed debuff icons — ${A.categories.length} groups</summary><p class="hint">Full Party Coverage uses nine agreed slots, including Kart Bomb condition 598 and Fateweaver Aspect of Reversal condition 515. The Brionac/Fragarach peel requires both maximum-Protection statuses. Sources do not matter.</p><div class="reference-grid">${ref}</div></details>
 </div>`;
}
function vault(){
 if(!companionPrefs().secretSauce){
  const notes=state.marks.map((m,i)=>({m,i})).reverse().map(({m,i})=>`<div class="lesson personal-milestone"><strong>${esc(m.text)}</strong> <small class="hint">${new Date(m.date).toLocaleDateString()}</small></div>`).join('')||'<p class="hint">No personal milestones yet.</p>';
  return `<div class="vault-header"><div class="vault-titlebar"><h2>The Vault</h2></div></div>
  <section class="vault-section"><h2>Achievement Book</h2><p class="hint">Achievements earned through games, training, and collections.</p>${achievementCatalogHtml()}</section>
  <section class="vault-section"><h2>Personal milestones</h2>${notes}</section>`;
 }
 const collectibles=D.collectibles.map(c=>{const events=computeCollectibleEvents(c),balance=events.reduce((sum,x)=>sum+x.delta,0);return `<article class="card record"><small>BRI LEITH · GATE ${c.gate}</small><div class="award-heading"><h3 class="gold">${esc(c.name)}</h3><img class="award-illustration" src="assets/awards/${c.gate===1?'giant-boots':c.gate===2?'bottled-horsepower':'halo-badges'}.png" alt="${esc(c.name)} collectible artwork" loading="lazy"></div><div class="stat">${balance>=0?'+':''}${balance}</div><p><em>${esc(c.flavor)}</em></p><p class="hint">${events.filter(e=>e.delta!==null).length} recorded result(s)</p><div class="button-row"><button data-act="evidence:${c.id}" aria-expanded="${openAwardId===c.id?'true':'false'}">See Awards</button></div></article>`}).join('');
 const milestones=state.metricMilestones.slice().reverse().map(e=>`<div class="lesson"><strong>${esc(e.title)}</strong> · ${esc(e.encounter)} · ${esc(e.player)}<p>${esc(e.detail)}</p><small>${new Date(e.date).toLocaleString()}</small></div>`).join('')||'<p class="hint">New milestones will appear here.</p>';
 const personal=state.marks.map((m,i)=>({m,i})).reverse().map(({m,i})=>`<div class="lesson personal-milestone"><div class="row" style="align-items:center;justify-content:space-between;gap:10px"><div style="flex:1;min-width:160px"><strong>${esc(m.text)}</strong> <small class="hint">${new Date(m.date).toLocaleDateString()}</small></div><div class="milestone-inline-actions"><button data-act="milestone-edit:${i}" aria-label="Edit milestone">Edit</button><button class="danger" data-act="milestone-remove:${i}" aria-label="Remove milestone">Remove</button></div></div>${milestoneEditIndex===i?`<div class="row milestone-edit-row"><input id="milestone-edit-input" value="${esc(m.text)}" maxlength="240" style="flex:1;min-width:200px" aria-label="Edit personal milestone"><button class="primary" data-act="milestone-update:${i}">Save changes</button><button data-act="milestone-cancel">Cancel</button></div>`:''}</div>`).join('')||'<p class="hint">No personal milestones recorded yet.</p>';
 const catalog=achievementCatalogHtml();
 const activeReportRows=state.reports.filter(r=>!reportIsArchived(r)).reverse();
 const archiveReportRows=state.reports.filter(reportIsArchived).reverse();
 const showing=showReportArchive?archiveReportRows:activeReportRows;
 const currentPage=showReportArchive?reportArchivePage:reportPageNumber;
 const pageCount=Math.max(1,Math.ceil(showing.length/reportPageSize));
 const reports=showing.slice(Math.min(currentPage,pageCount-1)*reportPageSize,(Math.min(currentPage,pageCount-1)+1)*reportPageSize).map(r=>{const player=chosenPlayer(r),stats=player?participantStats(r,player):null;
 const index=state.reports.indexOf(r);
 return `<div class="vault-report-entry" data-report-id="${esc(r.id)}"><div class="vault-run vault-run-static"><span class="vault-run-title">${esc(r.encounter)}</span><span>${esc(vaultDate(r))}</span><span>${esc(player?rhEncounterArcanaLabel(r,player):(r.archiveSummary?.arcanaByEncounter||r.archiveSummary?.playerNames?.join(', ')||'Character not found'))}</span><span>${stats?.dps!==null&&stats?.dps!==undefined?fmt(Math.round(stats.dps))+' recording DPS':r.archiveSummary?.dps!=null?fmt(Math.round(r.archiveSummary.dps))+' recorded DPS':'Personal DPS unavailable'}</span><span>${esc(r.name)}</span></div>${state.reports.some(other=>other!==r&&(other.sourceFingerprint&&other.sourceFingerprint===r.sourceFingerprint||(!other.archiveCompact&&!r.archiveCompact&&window.MIDIR_ANALYSIS.possibleRepeat(other,r))))?'<p class="hint vault-repeat-notice">⚠ Possible repeat of another saved session · Kept separately, awards count for both. Remove either import if desired.</p>':''}<div class="button-row vault-report-actions">${r.archiveCompact?'<span class="hint">Compact archive · original export required to reactivate</span>':''}${r.htmlSaved&&!r.archiveCompact?`<button class="primary" data-act="vault-inline:${r.id}">${companionMobileMode()?'Open full-screen report':'View report here'}</button><button data-act="vault-open:${r.id}">${companionMobileMode()?'Open report reader':'Open in new tab ↗'}</button>`:''}${r.archiveCompact?'':`<button data-act="inspect:${index}">Inspect data</button>`}<button data-act="vault-archive:${r.id}">${reportIsArchived(r)?'Return to active':'Archive'}</button><button class="danger" data-act="vault-remove:${r.id}" aria-label="Remove imported report ${esc(r.name)}">Remove import</button>${!r.htmlSaved?`<span class="hint">Original interactive HTML not retained in Companion.</span>`:''}</div></div>`;
 }).join('')||'<p class="hint">No reports yet. Your next adventure awaits!</p>';
 const active=state.reports.find(r=>r.id===vaultViewerId);
 const inlineViewer=active?`<div class="vault-inline-viewer"><div class="vault-inline-toolbar"><div><strong>${esc(active.encounter)}</strong><small>${esc(active.name)}</small></div><div class="button-row"><button data-act="vault-open:${active.id}">Open in new tab ↗</button><button data-act="vault-close">Minimize / Close</button></div></div><div id="vault-inline-content" class="vault-inline-content" aria-live="polite">Loading report…</div></div>`:'';
 return `<div class="vault-header"><div class="vault-titlebar"><h2>The Vault</h2><button id="vault-character-save" class="button-ghost" data-act="character-save" hidden>Save</button></div><div class="vault-character-actions"><div class="vault-character-inline"><input id="vault-character-name" type="text" maxlength="80" autocomplete="off" value="${esc(state.characterName)}" placeholder="Character name" aria-label="Character name"></div></div></div><p class="hint vault-character-status" id="vault-character-status">${state.characterName.trim()?`Tracking ${esc(state.characterName)} · ${state.reports.filter(r=>chosenPlayer(r)).length} of ${state.reports.length} saved reports contain this character.`:'Enter your character name to track personal awards and milestones.'}</p>
 <section class="vault-section" aria-labelledby="vault-collectibles-title"><h2 id="vault-collectibles-title">Achievement Collectibles</h2><p class="hint">Your Bri Leith collection.</p><div class="grid">${collectibles}</div><div id="record-evidence"></div></section>
 <section class="vault-section" aria-labelledby="vault-import-title"><h2 id="vault-import-title">Add to Your Vault</h2><div class="vault-input-grid"><div class="card drop vault-import-card" id="drop"><h3>Import Midir Reports</h3><p>Bring your adventures into the Vault.</p><details class="ui-more-help"><summary>Which files?</summary><p>Use exported Midir HTML reports or NDJSON recordings. Restore a Companion backup with Restore profile backup.</p></details><div class="compact-actions"><button class="primary" data-act="pick">Import sessions / reports</button><button class="subtle" data-act="backup">Profile backup</button><button class="subtle" data-act="restore">Restore profile backup</button></div><input id="backup-picker" type="file" accept=".json" hidden></div><div class="card vault-milestone-card"><h3>My Milestones</h3><p class="hint">Save a moment worth remembering.</p><div class="row"><input id="milestone" placeholder="A personal achievement worth remembering" maxlength="240" style="flex:1;min-width:180px">${buttons([['Save milestone','milestone-save','primary']])}</div></div></div><div class="card vault-saved-milestones"><h3>Saved Milestones</h3><div class="personal-milestone-list">${personal}</div></div></section>
 <section class="vault-section" aria-labelledby="vault-records-title"><h2 id="vault-records-title">Personal Records & Milestones</h2><p class="hint">Your best moments, all in one place.</p>${pane('Achievement Catalog',catalog)}<details class="card vault-fold"><summary>Encounter-Specific Records &amp; Debuff Contributions</summary>${encounterRecordsHtml()}</details><details class="card vault-fold"><summary>Earned Milestones</summary>${milestones}</details></section>
 <section class="vault-section" aria-labelledby="vault-storage-title"><h2 id="vault-storage-title">Storage Management</h2><div class="card"><p id="storage-status" class="hint">Calculating local storage…</p><p class="hint">Your progress stays on this device. Keep a backup!</p><details class="ui-more-help"><summary>Backup help</summary><p>Full backups include reports, achievements, minigame progress, and saved workshop settings. Keep your original Midir exports too. Clearing browser data may remove local progress.</p></details><div class="button-row"><button data-act="storage-refresh">Refresh capacity</button><button data-act="storage-persist">Request persistent storage</button><button data-act="backup">Export profile backup</button></div><p class="hint">Keep a backup somewhere safe.</p></div></section>
 <section class="vault-section" aria-labelledby="vault-reports-title"><h2 id="vault-reports-title">${showReportArchive?'Report Archive':'Active Imported Reports'} <small>(${showing.length})</small></h2><p class="hint">Active reports show the newest fully equipped imports. Older or incomplete reports are kept in the archive, not deleted. Archived reports retain independent achievement credits and rolling best rotation sequences; full report details and original HTML are discarded after safe compact summary storage; keep your exports for reactivation.</p><div class="button-row"><button data-act="report-active" ${!showReportArchive?'disabled':''}>Active reports (${activeReportRows.length})</button><button data-act="report-archive" ${showReportArchive?'disabled':''}>Archive (${archiveReportRows.length})</button></div>${showReportArchive?archiveOverviewHtml():''}${showReportArchive&&state.settings?.archiveCompactionDeferred?'<p class="hint">Disk-space compaction is paused until approved. <button data-act="archive-compact-optin">Enable compact archiving</button></p>':''}${activeReportRows.length>=20?'<p class="hint"><strong>Backup recommended:</strong> You have at least 20 active imports. Protect your history before adding more. <button data-act="backup">Export full backup</button></p>':''}${inlineViewer}<div id="report-detail"></div>${pane('Saved Reports',reports)}<div class="button-row"><button data-act="report-prev" ${currentPage===0?'disabled':''}>Previous 10</button><span class="hint">Page ${currentPage+1} of ${Math.max(1,Math.ceil(showing.length/reportPageSize))}</span><button data-act="report-next" ${(currentPage+1)*reportPageSize>=showing.length?'disabled':''}>Next 10</button></div></section>`;
}
imports=vault;records=vault;
home=function(){return `<h2>Your practice space</h2><p class="muted">Train what you control, then bring the confidence back to the game.</p><div class="grid">${[['Arcana Simulators','DD repetition and AS flow','rotation'],['Debuff Academy','Learn debuff layers and status recognition','debuff'],['The Vault',state.reports.length+' saved reports and your milestones','vault']].map(c=>`<section class="card"><h3>${c[0]}</h3><p class="muted">${c[1]}</p>${buttons([['Open','page:'+c[2],'primary']])}</section>`).join('')}</div>${pane('Recent training',state.drillHistory.slice(-8).reverse().map(d=>`<div class="lesson"><strong>${d.type==='dd'?'DD audio drill (legacy)':'AS keyboard practice'}</strong><span class="hint"> · ${new Date(d.date).toLocaleString()}</span><p>${d.type==='dd'?'Stage '+(d.stage+1)+' · '+esc(d.mode):fmt(d.actions)+' simulated actions'}</p></div>`).join('')||'<p class="hint">Your recent drills will appear here.</p>')}`};
const previousRender=render;render=function(){if(state.page==='home'||state.page==='vault'||state.page==='imports'||state.page==='records'||state.page==='encounter')state.page='vault';const nav=document.querySelector('nav');if(nav){nav.querySelectorAll('[data-page="imports"],[data-page="records"],[data-page="home"],[data-page="encounter"]').forEach(n=>n.remove());const order=[['vault','The Vault'],['rotation','Arcana Simulators'],['debuff','Debuff Academy']];order.forEach(([pageName,label])=>{let b=nav.querySelector(`[data-page="${pageName}"]`);if(!b){b=document.createElement('button');b.dataset.page=pageName;b.textContent=label;b.addEventListener('click',()=>page(pageName));nav.appendChild(b)}});order.forEach(([pageName])=>{const b=nav.querySelector(`[data-page="${pageName}"]`);if(b)nav.appendChild(b)});nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.page===state.page))}previousRender();const characterInput=$('vault-character-name');if(characterInput){characterInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applyCharacterName()}});characterInput.addEventListener('input',syncCharacterDraftUi);syncCharacterDraftUi()}syncOverviewSidebar();if(state.page==='vault'){refreshStorageStatus();$('archive-arcana')?.addEventListener('change',e=>action('archive-arcana:'+e.target.value));const drop=$('drop');if(drop){drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('over')});drop.addEventListener('dragleave',()=>drop.classList.remove('over'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('over');filesSelectedVault([...e.dataTransfer.files])})}}};
const previousAction=action;action=function(s){let [cmd,arg]=s.split(':');if(cmd==='backup')return vaultFullBackup();
 if(cmd==='archive-arcana'){if(Object.hasOwn(RH_ARCANA,arg))archiveSelectedArcana=arg;return render()}if(cmd==='report-active'){showReportArchive=false;return render()}
 if(cmd==='report-archive'){showReportArchive=true;return render()}
 if(cmd==='report-prev'){if(showReportArchive)reportArchivePage=Math.max(0,reportArchivePage-1);else reportPageNumber=Math.max(0,reportPageNumber-1);return render()}
 if(cmd==='report-next'){const count=state.reports.filter(r=>reportIsArchived(r)===showReportArchive).length;const max=Math.max(0,Math.ceil(count/reportPageSize)-1);if(showReportArchive)reportArchivePage=Math.min(max,reportArchivePage+1);else reportPageNumber=Math.min(max,reportPageNumber+1);return render()}
 if(cmd==='archive-compact-optin'){state.settings.archiveCompactionDeferred=false;return archiveCompactAll().then(()=>render()).catch(e=>message('Archive compaction unavailable: '+e.message));}
 if(cmd==='vault-archive')return archiveToggle(arg);
if(cmd==='storage-refresh')return refreshStorageStatus();if(cmd==='storage-persist')return storagePersistentRequest();
 if(cmd==='milestone-edit'){const i=Number(arg);if(!Number.isInteger(i)||!state.marks[i])return;milestoneEditIndex=i;return render()}
 if(cmd==='milestone-cancel'){milestoneEditIndex=null;return render()}
 if(cmd==='milestone-update'){const i=Number(arg),el=$('milestone-edit-input');if(!Number.isInteger(i)||!state.marks[i]||!el)return;const value=el.value.trim().slice(0,240);if(!value)return message('Write a milestone before saving.');state.marks[i].text=value;milestoneEditIndex=null;save();return render()}
 if(cmd==='milestone-remove'){const i=Number(arg);if(!Number.isInteger(i)||!state.marks[i])return;if(!confirm('Remove this personal milestone? This cannot be undone.'))return;state.marks.splice(i,1);milestoneEditIndex=null;save();return render()}
 if(cmd==='achievement-book-open'){achievementBookOpen=true;catalogOpenId=null;return render()}if(cmd==='achievement-book-close'){achievementBookOpen=false;catalogOpenId=null;return render()}if(cmd==='achievement-book-prev'){achievementBookPage=Math.max(0,achievementBookPage-1);catalogOpenId=null;return render()}if(cmd==='achievement-book-next'){achievementBookPage=Math.min(achievementBookPages().length-1,achievementBookPage+1);catalogOpenId=null;return render()}if(cmd==='catalog-details'){catalogOpenId=catalogOpenId===arg?null:arg;return render()}
if(cmd==='character-save')return applyCharacterName();if(cmd==='award-find')return focusAwardRun(arg);if(cmd==='open-academy-flash'){academyUI.mode='flash';academyUI.flip=false;academyUI.shown=false;startFlashDeck();if(state.page!=='debuff')return page('debuff');return render()}if(cmd==='vault-open')return openReport(arg);if(cmd==='vault-inline')return viewReportInline(arg);if(cmd==='vault-close')return closeReportInline();if(cmd==='vault-remove'){
 const r=state.reports.find(x=>x.id===arg);
 if(!r)return;
 if(!confirm('Permanently delete "'+r.name+'" from report storage? Previously banked archive achievements and winning rotation sequences remain independent lifetime records. The full report cannot be recovered without a backup.'))return;
 if(vaultViewerId===r.id)vaultViewerId=null;
 state.reports=state.reports.filter(x=>x.id!==r.id);
 state.metricMilestones=state.metricMilestones.filter(e=>e.reportId!==r.id);rebuildOwnedMilestones();
 // Derived collectibles recalculate from the remaining reports; personal notes and training history stay intact.
 save();render();
 if(reportDbReady)archiveDeleteStored(r.id).catch(e=>message('Archived report deletion could not be completed: '+e.message));
 removeHtml(r.id).catch(e=>console.warn('Unable to remove archived HTML',e));
 message('Imported report removed.');
 return;
 }if(cmd==='remove'){let r=state.reports[+arg];if(r){removeHtml(r.id);state.reports.splice(+arg,1);state.metricMilestones=state.metricMilestones.filter(e=>e.reportId!==r.id);save();return render()}}return previousAction(s)};
/* Integrated Arcana modules: shares Arcana Simulators state and event dispatcher. */
/* Companion 07: exploratory Arcana pages. No verified DPS formulas, forced rotations, or mastery grades. */
const ARCANA_PAGES={
 ek:{name:'Elemental Knight',subtitle:'Element selection and approach decisions',skills:['Instill Elements','Dauntless Defense','Dynavolt Smash','Shattering Windmill','Blazing Assault Slash','Flashing Steel'],drill:'Element Switchboard',description:'Practice recognizing when to change your elemental approach versus remaining committed. No claimed universal best element.',prompts:[['An enemy telegraphs a dangerous retaliation while your strongest attack is available.','Defend or reposition first','Commit the attack immediately'],['A group becomes clustered while you are targeting a single enemy.','Consider an area skill','Maintain single-target pressure'],['The next phase is likely to demand a different elemental approach.','Prepare a deliberate switch','Change only after losing the window']]},
 hs:{name:'Harmonic Saint',subtitle:'Support triage and situational awareness',skills:['Blessing of Protection','Echoes of Salvation','Hand of Restoration','Hymn of Resurrection','Pall of Ruination','Polyphonic Melody','Pulse of Purification','Voice of Vitality'],drill:'Triage Desk',description:'Acknowledge competing priorities without pretending that a raid has one perfect healing order.',prompts:[['A teammate is in immediate danger, while the boss is vulnerable to Pall.','Address immediate survival','Prepare Pall for the opening'],['A player is down as another ally takes damage.','Assess safe revival opportunity','Stabilize the living player'],['Several status ailments appear while damage continues.','Review cleansing opportunity','Prioritize direct restoration']]},
 sg:{name:'Sacred Guardian',subtitle:'Defensive snapshot snapshot builder and post-death recovery',skills:['Virtuous Oath','Fateweaver (3152)','Golden Magic Wool','Shield of Trust','Orbital Pulse','Divine Link','Enduring Melody'],drill:'Oath Workshop',description:'A community-developed optional optimization. Practice the full defensive setup or build a useful snapshot quickly after death; no compulsory rotation or damage grade.'},
 ev:{name:'Explosive Vanguard',subtitle:'Mana Shells, lance positioning, and burst windows',skills:['Recharge Shells','Relentless Thrust','Arc Impact','Blast Zone','Drill Charge','Dreadnought Burst','Blaze of Glory','Lance Charge','Lance Leap','Lance Impact'],drill:'Blast Window Planner',description:'Practice noticing the opportunity cost of committing to a burst when targets may move.',prompts:[['The target may leave the blast zone imminently.','Wait or reposition','Commit the burst now'],['Targets form a straight corridor.','Evaluate a line attack','Use an area detonation regardless'],['A phase transition is approaching.','Conserve a major commitment','Spend cooldowns immediately']]},
 ag:{name:'Arsenal Gunner',subtitle:'Targeting, field placement, and firing commitment',skills:['Bullet Barrage','Heavy Artillery','Tracer Pod','Detonation Field','Gunner\'s Crest','Fatal Scope','Calamity Cannon'],drill:'Field and Aim',description:'Practice choosing between creating a favorable firing lane and using an available attack.',prompts:[['Your firing lane no longer crosses the Detonation Field.','Realign for the field','Fire from the current position'],['A priority target enters range while several lesser targets cluster.','Decide based on encounter priority','Favor area coverage'],['A target may move before an aimed shot lands.','Consider holding aim briefly','Fire immediately']]},
 fa:{name:'Forbidden Alchemist',subtitle:'A profoundly serious herb research initiative',skills:['Chemical Carnival','Compound Catalyst','Elemental Amplification','Elemental Compounding','Fangs of Stone','Serpentcall'],drill:'Herb Collection',description:'No rotation, no combat grading. This is an entirely unnecessary but delightful botanical accounting exercise.'},
 mp:{name:'Melodic Puppeteer',subtitle:'Frequent Cutting Chorus insertion practice',skills:['Cutting Chorus'],drill:'Cutting Chorus Weaving',description:'Alternate ordinary actions with Cutting Chorus when it is available. Timing is a training model; minimum cooldowns are not a guarantee of live-game mechanics.'},
 bb:{name:'Blazing Brawler',subtitle:'Reading openings and maintaining momentum',skills:[],drill:'Opening Reader',description:'A decision-oriented foundation while the newer Arcana skill catalogue is being verified.',prompts:[['Your target recovers from a stagger while you are mid-combination.','Adapt to the new opening','Continue the rehearsed sequence'],['A counterattack is telegraphed.','Respect the threat','Commit to the next strike'],['An add interrupts your preferred engagement range.','Recover position and target','Ignore positioning']]}
};
const arcRuntime={herbs:0,herbX:45,herbY:45,herbId:'base',step:0,sequence:['1','2','3'],weaves:0,ordinary:0,choices:0,scenario:0,follow:'',history:[]};
function arcHerbButton(){const herbApi=window.MIDIR_HERBS;const markup=herbApi?.iconMarkup?herbApi.iconMarkup(arcRuntime.herbId,'arc-herb-icon'):'<span class="arc-herb-fallback">🌿</span>';const label=(herbApi?.herbById?.(arcRuntime.herbId)?.name)||'herb';return `<button class="herb herb-sprite" data-act="arc-herb" style="left:${arcRuntime.herbX}%;top:${arcRuntime.herbY}%" aria-label="Collect ${esc(label)}" title="${esc(label)}">${markup}</button>`;}
const arcOriginalRotation=rotation;
rotation=function(){if(ARCANA_PAGES[state.arcana])return arcanaPage(state.arcana);return arcOriginalRotation()};
function arcanaPage(key){const a=ARCANA_PAGES[key];const skills=a.skills.length?a.skills.map(n=>`<span class="arc-skill">${esc(n)}</span>`).join(''):'<span class="hint">Skill-specific cards awaiting verified references; no fabricated skill names.</span>';
let drill='';
if(key==='fa')drill=`<div class="herb-field" id="herb-field" aria-label="Herb collection field">${arcHerbButton()}</div><p class="stat">${arcRuntime.herbs} herbs collected</p>${arcRuntime.herbs>=5?'<p class="herb-praise">You\'re doing great!</p>':''}${arcRuntime.herbs>=10?'<p class="herb-praise">Forbidden Alchemists are great at crunching numbers, so since you did that already I thought I\'d remind you not to take this so seriously and have some fun once in a while!</p>':''}<p class="hint">Each herb moves to a new location. There is no time limit, completion requirement, or grade.</p>${buttons([['Reset herbs','arc-herb-reset']])}`;
else if(key==='sg')drill=sgWorkshop();
else if(key==='mp')drill=`<div class="arc-cue">${arcRuntime.ordinary>arcRuntime.weaves?'Cutting Chorus opportunity — weave when appropriate':'Use an ordinary skill, then look for an available Cutting Chorus window.'}</div><div class="button-row"><button data-act="arc-main" class="primary">Other skill</button><button data-act="arc-chorus">Cutting Chorus</button></div><p>Other skills: <strong>${arcRuntime.ordinary}</strong> · Chorus insertions: <strong>${arcRuntime.weaves}</strong></p><p class="hint">Practice the rhythm, not a fixed numerical score. Availability and animation behavior depend on the real game.</p>${buttons([['Reset practice','arc-weave-reset']])}`;
else {const scene=a.prompts[arcRuntime.scenario%a.prompts.length];drill=`<p class="hint">Scenario ${arcRuntime.scenario%a.prompts.length+1} of ${a.prompts.length}</p><div class="arc-cue">${esc(scene[0])}</div>${buttons([[scene[1],'arc-choice:0','primary'],[scene[2],'arc-choice:1']])}${arcRuntime.follow?`<p class="lesson">${esc(arcRuntime.follow)}</p>`:''}${buttons([['Next situation','arc-next']])}<p class="hint">These are decision snapshot builder prompts; the Companion does not judge which approach you choose.</p>`;}
return `<h2>${esc(a.name)} · Arcana Simulators</h2><p class="muted">${esc(a.subtitle)}. An exploratory page, not an authoritative rotation guide.</p><div class="cols"><div>${pane(a.drill,`<p>${esc(a.description)}</p>${drill}`)}</div><div>${pane('Skill reference · preliminary',`<div class="arc-skills">${skills}</div><p class="hint">Listed skills are sourced from Mabinogi World Wiki category pages or Nexon where available. Newer Arcana skill mappings may be incomplete; gameplay timings have not been validated.</p>`)}${pane('Training philosophy','<p>Teach what you control. Prepare for what you cannot. Celebrate what you accomplish together.</p><p class="hint">No forced perfect rotation, no measured DPS claim, no penalties for choosing a different response.</p>')}</div></div>`;
}
/* Sacred Guardian Oath Workshop. User-provided snapshot behavior; no claims of packet-derived values. */
const SG_CORE=[
  ['f','Fateweaver 3152','Capture prepared defenses.'],
  ['o','Virtuous Oath','Capture Fateweaver’s frozen bonus.'],
  ['f','Fateweaver 3152','Replace Fateweaver while retaining the earlier F contribution already frozen in Oath.'],
  ['o','Virtuous Oath','Replace Oath with a snapshot that sees Fateweaver’s inherited chain.'],
  ['w','Golden Magic Wool','One consumable; snapshot both active Fateweaver and Oath.'],
  ['f','Fateweaver 3152','Snapshot Oath and Wool, including Wool’s frozen history.'],
  ['o','Virtuous Oath','Final snapshot: capture Fateweaver and Wool.']
];
const SG_QUICK=[SG_CORE[0],SG_CORE[1],SG_CORE[4],SG_CORE[5],SG_CORE[6]];
const SG_WOOLLESS=[SG_CORE[0],SG_CORE[1],SG_CORE[2],SG_CORE[3]];
const SG_PREP=[
 ['yip','Lovable Yip','Activate before Divine Link'],
 ['cloud','Cloud / Nimbus','Summon before Divine Link'],
 ['link','Divine Link','Linked pet; do not replace'],
 ['shield','Shield of Trust','Short window, roughly 15 s'],
 ['melody','Receive Enduring Melody','Ally coordination'],
 ['catering','Defensive catering dish','Consumable preparation'],
 ['bags','Doll Bags','Use your own bag combination; weight ≤ 1'],
 ['pulse','Orbital Pulse · two Protection aspects','Short window, roughly 15 s']
];
const sg={page:'full',checkMode:'full',mode:'full',step:0,prep:new Set(),snap:{f:null,o:null,w:null},history:[],woolAt:null,woolSpent:false,hide:false,startedAt:null,showExplanation:true,availableWool:true,minutes:60};
const SG_EMERGENCY_DEFAULT=['f','o','w','f','o'];
let sgEmergencySequence=[...SG_EMERGENCY_DEFAULT];
let sgEmergencyEditorOpen=false;
try{const saved=JSON.parse(localStorage.getItem('midir-sg-emergency-sequence-v1')||'null');if(Array.isArray(saved)&&saved.length&&saved.length<=16&&saved.every(x=>['f','o','w'].includes(x)))sgEmergencySequence=saved;}catch(e){}
function sgSaveEmergency(){try{localStorage.setItem('midir-sg-emergency-sequence-v1',JSON.stringify(sgEmergencySequence))}catch(e){}}
function sgSteps(){return sg.mode==='full'?SG_CORE:sgEmergencySequence.filter(id=>id!=='w'||sg.availableWool).map(id=>id==='f'?['f','Fateweaver 3152','Freeze your current defensive stats.']:id==='o'?['o','Virtuous Oath','Capture Oath from currently active bonuses.']:['w','Golden Magic Wool','Freeze the current defensive bonuses.']);}
function sgEmergencyEdit(){return `<details class="sg-emergency-editor" ${sgEmergencyEditorOpen?'open':''}><summary>Edit Emergency sequence</summary><p class="hint">Arrange your Oath casts.</p><div class="sg-emergency-rows">${sgEmergencySequence.map((id,i)=>`<div class="sg-emergency-row"><span class="sg-emergency-index">${i+1}</span><strong>${id==='f'?'Fateweaver':id==='o'?'Virtuous Oath':'Golden Magic Wool'}</strong><button type="button" data-act="sg-seq-up:${i}" title="Move up" ${i===0?'disabled':''}>↑</button><button type="button" data-act="sg-seq-down:${i}" title="Move down" ${i===sgEmergencySequence.length-1?'disabled':''}>↓</button><button type="button" data-act="sg-seq-delete:${i}" title="Remove cast" ${sgEmergencySequence.length===1?'disabled':''}>×</button></div>`).join('')}</div><div class="sg-emergency-add"><button type="button" data-act="sg-seq-add:f">+ Fateweaver</button><button type="button" data-act="sg-seq-add:o">+ Oath</button><button type="button" data-act="sg-seq-add:w">+ Wool</button><button type="button" data-act="sg-seq-default">Restore default</button></div></details>`;}
function sgReset(keepPrep=true){sg.step=0;sg.snap={f:null,o:null,w:null};sg.history=[];sg.woolAt=null;sg.woolSpent=false;sg.startedAt=null;if(!keepPrep)sg.prep=new Set()}
function sgLineage(k){const v=sg.snap[k];return v?`${v.name}: ${v.tree}`:'Not yet captured'}
/* Snapshot values are frozen when captured. Each refresh replaces its own previous
   bonus, while reading the other two latest frozen bonuses. These rates are a
   planning approximation, not an authoritative in-game stacking/rounding model. */
const SG_SNAPSHOT_RATES={f:0.12,o:0.10,w:0.20};
function sgSnapshotValues(kind){
 const foundation=sgProjected(sgPrepByMode[sg.page]||sgPlanner.enabled).raw;
 const input={...foundation};
 for(const other of ['f','o','w']){
  if(other===kind||!sg.snap[other]?.bonus)continue;
  for(const stat of SG_STATS)input[stat]+=(sg.snap[other].bonus[stat]||0);
 }
 const bonus={};
 for(const stat of SG_STATS){
  const rate=kind==='o'&&stat==='hp'?0.15:SG_SNAPSHOT_RATES[kind];
  // Only Virtuous Oath affects maximum HP. Fateweaver 3152 and Wool snapshot
  // Defense, Magic Defense, Protection and Magic Protection exclusively.
  const computed=stat==='hp'&&kind!=='o'?0:Math.max(0,input[stat]*rate);
  bonus[stat]=kind==='o'?Math.min(SG_CAPS[stat],computed):computed;
 }
 return {input,bonus};
}
function sgSnapshotProjection(prepared){
 const active={...prepared.raw};
 for(const kind of ['f','o','w'])if(sg.snap[kind]?.bonus){for(const stat of SG_STATS)active[stat]+=(sg.snap[kind].bonus[stat]||0)}
 const oath=sg.snap.o?.bonus||prepared.capped;
 return {active,oath};
}
function sgSnapshot(kind){const labels={f:'Fateweaver',o:'Oath',w:'Wool'};const other=kind==='f'?['o','w']:kind==='o'?['f','w']:['f','o'];const inherited=other.filter(k=>sg.snap[k]).map(k=>sg.snap[k].tree);const tree=`${kind.toUpperCase()}${sg.history.filter(x=>x.kind===kind).length+1}${inherited.length?'('+inherited.join(' + ')+')':''}`;
 const values=sgSnapshotValues(kind);
 sg.snap[kind]={...values,name:labels[kind],tree,includes:other.filter(k=>sg.snap[k]).map(k=>labels[k]),foundation:[...[...sg.prep].map(k=>SG_PREP.find(x=>x[0]===k)?.[1]||k),...sgGearBonusState().components.map(x=>x.name)],at:Date.now()};
 sg.history.push({kind,tree,foundation:sg.snap[kind].foundation});
 if(kind==='w'){sg.woolAt=Date.now();sg.woolSpent=true}
}
/* Companion 124: SG pre-Oath threshold planner. Inputs are entered character-sheet totals;
   observed video deltas are examples, not universal pet / transformation promises. */
const SG_STATS=['hp','def','prot','mdef','mprot'];
const SG_CAPS={hp:3000,def:150,prot:15,mdef:150,mprot:15};
const SG_LABELS={hp:'Maximum HP',def:'Defense',prot:'Protection',mdef:'Magic Defense',mprot:'Magic Protection'};
const SG_BUFS={
 shield:{def:40,mdef:15,mprot:15}, yip:{def:30,prot:30,mdef:30,mprot:10},
 catering:{def:50,prot:10,mdef:50,mprot:20},
 pulse:{def:30,prot:3,mdef:30,mprot:3},
 /* A single example is deliberately used for the quick calculator; users can edit it. */
 cloud:{def:20,prot:5},
 link:{hp:618,def:3,mdef:17},
 transform:{hp:450,def:3,prot:18,mdef:20},
 bags:{def:0,prot:0,mdef:0,mprot:0}
};
const sgPlanEdits={full:'',quick:''};
const sgPrepByMode={full:new Set(['catering','bags','cloud','yip','link','melody','shield','pulse','transform']),quick:new Set(['bags','shield','pulse'])};
sg.prep=sgPrepByMode.full;
const sgPlanner={base:{hp:8000,def:450,prot:85,mdef:320,mprot:240},enabled:new Set(['catering','bags','cloud','yip','link','shield','melody','pulse']),dynamic:{link:{...SG_BUFS.link},transform:{...SG_BUFS.transform},bags:{...SG_BUFS.bags},catering:{...SG_BUFS.catering}},musicEffect:136.3,musicBfo:69,musicInspiringEffect:16,musicGrade:'inspiring',musicReforge:3,melodyManual:false,customMelody:5};
const sgN=(x)=>Math.max(0,Math.min(1e7,Number(x)||0));

/* Companion 227: Oath equipment, titles and temporary persona. These are player-entered
   preparation assumptions; only the prepared totals feed newly captured snapshots. */
const SG_RELIC_WILL={none:0,C:20,B:30,A:45,S:60,EX:70};
const SG_PERSONA_DURATION_MS=5*60*1000,SG_PERSONA_SHARED_COOLDOWN_MS=30*60*1000;
const sgGear={relicRank:'none',persona:{activeUntil:0,sharedReadyAt:0},emblem:{equipped:false,mind:5,mana:5,body:5,emergencyActive:'tenacious'},title1:{equipped:false,bonuses:''},title2:{equipped:false,bonuses:''}};
const SG_EXTRA_STATS=['str','will','int','hp','def','prot','mdef','mprot'];
const SG_EXTRA_ALIASES={
 'str':'str','strength':'str','will':'will','int':'int','intelligence':'int',
 'hp':'hp','max hp':'hp','maximum hp':'hp','health':'hp',
 'def':'def','defense':'def','defence':'def','prot':'prot','protection':'prot',
 'magic def':'mdef','magic defense':'mdef','magic defence':'mdef','m def':'mdef','mdef':'mdef',
 'magic prot':'mprot','magic protection':'mprot','m prot':'mprot','mprot':'mprot'
};
const sgSignedNumber=(x)=>Number.isFinite(Number(x))?Math.max(-1e7,Math.min(1e7,Number(x))):0;
function sgPersonaActive(now=Date.now()){return sgGear.persona.activeUntil>now}
function sgClockLabel(ms){const secs=Math.ceil(Math.max(0,ms)/1000),m=Math.floor(secs/60),s=secs%60;return `${m}:${String(s).padStart(2,'0')}`}
function sgReadTitleBonuses(text){const buff=Object.fromEntries(SG_EXTRA_STATS.map(k=>[k,0])),invalid=[];
 const entries=String(text||'').split(/[\n;,]+/).map(x=>x.trim()).filter(Boolean);
 for(const entry of entries){
  const n=entry.replace(/\u00a0/g,' ').replace(/\s+/g,' ');
  const leading=n.match(/^([+-]?\s*\d+(?:\.\d+)?)\s+(.+)$/),trailing=n.match(/^(.+?)\s+([+-]?\s*\d+(?:\.\d+)?)$/);
  const match=leading||trailing;
  if(!match){invalid.push(entry);continue}
  const key=String(leading?match[2]:match[1]).toLowerCase().replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim();
  const stat=SG_EXTRA_ALIASES[key],val=Number(String(leading?match[1]:match[2]).replace(/\s/g,''));
  if(!stat||!Number.isFinite(val)||Math.abs(val)>1e7){invalid.push(entry);continue}
  buff[stat]+=val;
 }
 return {buff,invalid};
}
function sgGearBonusState(now=Date.now(),mode=sg.page==='quick'?'quick':'full'){
 const components=[],total=Object.fromEntries(SG_EXTRA_STATS.map(k=>[k,0])),add=(id,name,buff)=>{
  const valid=Object.fromEntries(SG_EXTRA_STATS.map(k=>[k,sgSignedNumber(buff[k]||0)]));
  components.push({id,name,buff:valid});for(const k of SG_EXTRA_STATS)total[k]+=valid[k];
 };
 if(SG_RELIC_WILL[sgGear.relicRank])add('relic','Little Fury Sword Relic · '+sgGear.relicRank,{will:SG_RELIC_WILL[sgGear.relicRank]});
 if(sgPersonaActive(now))add('persona',"Ophelia's Tears · active persona",{will:100,int:-20,str:-30});
 if(mode==='quick'?sgGear.emblem.emergencyActive==='defensive':sgGear.emblem.equipped){const e=sgGear.emblem;add('emblem','Alban Knights Emblem',{will:e.mind*5,mdef:e.mana*3,hp:e.body*10})}
 for(const [id,title] of [['title1','Title'],['title2','2nd Title']]){const entry=sgGear[id],parsed=sgReadTitleBonuses(entry.bonuses);if(entry.equipped)add(id,title,parsed.buff)}
 const converted={def:Math.trunc(total.str/10),mdef:Math.trunc(total.will/10),mprot:Math.trunc(total.int/10)};
 const actual={hp:total.hp,def:total.def+converted.def,prot:total.prot,mdef:total.mdef+converted.mdef,mprot:total.mprot+converted.mprot};
 return {components,total,converted,actual};
}
function sgGearStepIds(now=Date.now(),mode=sg.page==='quick'?'quick':'full'){const result=[];if(sgGear.relicRank!=='none')result.push('relic');if(mode==='quick'?sgGear.emblem.emergencyActive==='defensive':sgGear.emblem.equipped)result.push('emblem');if(sgPersonaActive(now))result.push('persona');if(sgGear.title1.equipped)result.push('title1');if(sgGear.title2.equipped)result.push('title2');return result;}
function sgGearPanel(){const now=Date.now(),active=sgPersonaActive(now),remaining=Math.max(0,sgGear.persona.sharedReadyAt-now);const e=sgGear.emblem,g=sgGearBonusState(now);const projection=sgProjected(sgPrepByMode[sg.page]||sgPlanner.enabled);const emergency=sg.page==='quick';
 const title=(id,name)=>{const t=sgGear[id],parsed=sgReadTitleBonuses(t.bonuses),line=SG_EXTRA_STATS.filter(k=>parsed.buff[k]).map(k=>`${k.toUpperCase()} ${parsed.buff[k]>0?'+':''}${parsed.buff[k]}`).join(' · ');return `<div class="sg-gear-title"><div class="sg-gear-label"><strong>${esc(name)}</strong><label><input data-sg-gear-check="${id}" type="checkbox" ${t.equipped?'checked':''}> Equipped</label></div><textarea data-sg-title="${id}" rows="3" spellcheck="false" placeholder="Will +20&#10;Magic Defense +5&#10;Strength -10">${esc(t.bonuses)}</textarea><small class="hint">One bonus per line (or comma-separated); use either “Will +20” or “+20 Will”. Negative values are supported.</small><small class="sg-gear-readout">${esc(parsed.invalid.length?`Unrecognized: ${parsed.invalid.join(' / ')}`:line||'No valid title bonuses entered')}</small></div>`};
 return `<section class="sg-gear-panel" aria-label="Oath-Maxing equipment and persona"><div class="sg-section-heading"><h3>Equipment, Persona & Titles</h3><small class="hint">Current preparation bonuses are included in the Oath projection</small></div><div class="sg-gear-grid">
 <div class="sg-gear-card"><div class="sg-gear-heading"><img src="assets/oath/little-fury-sword-relic.png" alt="Little Fury Sword Relic"><div><strong>Equip Little Fury Sword Relic</strong><small>Will by relic rank</small></div></div><label>Equipped rank <select data-sg-relic aria-label="Little Fury Sword Relic rank">${Object.entries(SG_RELIC_WILL).map(([rank,bonus])=>`<option value="${rank}" ${sgGear.relicRank===rank?'selected':''}>${rank==='none'?'Not equipped':`${rank} · +${bonus} Will`}</option>`).join('')}</select></label></div>
 <div class="sg-gear-card"><div class="sg-gear-heading"><img src="assets/oath/ophelias-tears-persona.png" alt="Ophelia's Tears Persona"><div><strong>Ophelia's Tears</strong><small>+100 Will · −20 Intelligence · −30 Strength</small></div></div><div class="sg-gear-actions"><button type="button" data-act="sg-persona:${active?'end':'start'}" ${!active&&remaining?'disabled':''}>${active?'End Persona':'Activate Persona'}</button><small class="sg-persona-status" aria-live="polite">${active?'Active · '+sgClockLabel(sgGear.persona.activeUntil-now)+' left':remaining?'Shared Persona cooldown · '+sgClockLabel(remaining)+' remaining':'Ready to activate'}</small></div><p class="hint">Lasts 5 minutes. Activating starts a shared 30-minute Persona cooldown, preserved after it ends.</p></div>
 <div class="sg-gear-card"><div class="sg-gear-heading"><span class="sg-emblem-symbol" aria-hidden="true">✥</span><div><strong>Alban Knights Emblem</strong><small>Rune of Mind · Mana · Body</small></div></div><label class="sg-gear-emblem"><input type="checkbox" data-sg-emblem-prep ${e.equipped?'checked':''}> Include defensive emblem in Full Oath preparation</label><div class="sg-rune-grid">${[['mind','Rune of Mind','Will',5],['mana','Rune of Mana','Magic Defense',3],['body','Rune of Body','HP',10]].map(([key,label,stat,value])=>`<label>${label}<select data-sg-rune="${key}">${Array.from({length:6},(_,i)=>`<option value="${i}" ${e[key]===i?'selected':''}>Level ${i} · +${i*value} ${stat}</option>`).join('')}</select></label>`).join('')}</div><label class="sg-emblem-emergency-select">Emblem equipped when Emergency Oath begins <select data-sg-emblem-emergency><option value="tenacious" ${e.emergencyActive==='tenacious'?'selected':''}>Tenacious Taunt Duration emblem</option><option value="defensive" ${e.emergencyActive==='defensive'?'selected':''}>Alban Knights defensive emblem</option><option value="other" ${e.emergencyActive==='other'?'selected':''}>Other emblem / none</option></select></label><p class="sg-emblem-caution">Emergency Oath may begin mid-combat. An active Tenacious Taunt Duration emblem cannot be swapped to the defensive emblem while in combat (30 seconds after dealing or taking damage). ${emergency?e.emergencyActive==='defensive'?'The simulator includes defensive-emblem stats because you selected that it was already equipped.':'The simulator excludes defensive-emblem stats for this emergency setup.':'Choose the emblem already active at the start of an emergency; this does not switch equipment automatically.'}</p></div>
 <div class="sg-gear-card sg-title-card"><strong>Equip Titles</strong><p class="hint">Enter your title’s actual bonuses; each field supports multiple stats.</p>${title('title1','Title Bonus')}${title('title2','2nd Title Bonus')}</div></div>
 <div class="sg-gear-conversion"><strong>Current stat conversions (all enabled sources)</strong><span>STR ${projection.primary.str>0?'+':''}${projection.primary.str} → ${projection.converted.def>0?'+':''}${projection.converted.def} Defense</span><span>WILL ${projection.primary.will>0?'+':''}${projection.primary.will} → ${projection.converted.mdef>0?'+':''}${projection.converted.mdef} Magic Defense</span><span>INT ${projection.primary.int>0?'+':''}${projection.primary.int} → ${projection.converted.mprot>0?'+':''}${projection.converted.mprot} Magic Protection</span><span>Other equipped-gear flat bonuses: HP ${g.actual.hp>0?'+':''}${g.actual.hp}, DEF ${g.total.def>0?'+':''}${g.total.def}, M.DEF ${g.total.mdef>0?'+':''}${g.total.mdef}, PROT ${g.total.prot>0?'+':''}${g.total.prot}, M.PROT ${g.total.mprot>0?'+':''}${g.total.mprot}</span></div>
 <p class="hint">Every full 10 STR gives +1 Defense; 10 WILL gives +1 Magic Defense; 10 INT gives +1 Magic Protection. Doll Bags and Catering may contribute to those same conversions. Negative stat changes reduce the corresponding defenses; the conversion is applied once after summing all active bonus sources. Enter base defensive stats separately under Edit Player Stats; these additions should not already be included in that baseline.</p></section>`;
}
function sgGearImport(data){if(!data||typeof data!=='object'||Array.isArray(data))return;
 if(Object.prototype.hasOwnProperty.call(SG_RELIC_WILL,data.relicRank))sgGear.relicRank=data.relicRank;
 const p=data.persona;if(p&&typeof p==='object')for(const field of ['activeUntil','sharedReadyAt']){const n=Number(p[field]);if(Number.isFinite(n)&&n>=0&&n<1e16)sgGear.persona[field]=n;}
 const e=data.emblem;if(e&&typeof e==='object'){if(typeof e.equipped==='boolean')sgGear.emblem.equipped=e.equipped;if(['tenacious','defensive','other'].includes(e.emergencyActive))sgGear.emblem.emergencyActive=e.emergencyActive;for(const key of ['mind','mana','body']){const v=Number(e[key]);if(Number.isInteger(v)&&v>=0&&v<=5)sgGear.emblem[key]=v}}
 for(const id of ['title1','title2'])if(data[id]&&typeof data[id]==='object'){if(typeof data[id].equipped==='boolean')sgGear[id].equipped=data[id].equipped;if(typeof data[id].bonuses==='string')sgGear[id].bonuses=data[id].bonuses.slice(0,4000)}
}

// Music model: BFO is the ally's observed Inspiring/Haunting percent (65-75).
// Calibrate the equivalent buff-effect multiplier using rank-one BFO (base 20),
// Inspiring 16 with its normal accessories. EM swaps boots first (0-3 levels),
// then each accessory (1-3 more levels) loses 3 Inspiring. This is an estimate,
// not a measurement of the ally's real gear or hidden performance rounding.
// Gear allocation: boots give up to 3 Enduring Protection levels with no
// Inspiring accessory penalty. Each swapped accessory adds up to 3 further
// levels but replaces one +3 Inspiring accessory. For any desired total,
// fill boots first, then one accessory at a time to preserve Inspiring.
function sgMelodyGear(level,inspiring=sgPlanner.musicInspiringEffect){
 const total=Math.max(0,Math.min(9,Math.floor(Number(level)||0)));
 const boots=Math.min(3,total);
 const first=Math.min(3,Math.max(0,total-boots));
 const second=Math.min(3,Math.max(0,total-boots-first));
 const accessories=(first>0?1:0)+(second>0?1:0);
 const inspiringAfter=Math.max(0,Math.min(16,Number(inspiring)||0)-3*accessories);
 return {total,boots,first,second,accessories,inspiringAfter};
}
function sgMusicFor(key,reforge=sgPlanner.musicReforge,effect=sgPlanner.musicEffect,inspiring=sgPlanner.musicInspiringEffect){
 const raw=state.musicBuffLab?.inputs||{};
 const equippedInspiring=key==='bo'?Math.min(16,Math.max(0,Number(inspiring)||0)):sgMelodyGear(reforge,inspiring).inspiringAfter;
 const quality=1.3+(Number(raw.musicKnowledgeReforge)||0)/100+equippedInspiring/100;
 const harmony=(Number(raw.fairyDragonHarmonyEffectBuff)||0)/100;
 const item=1+((Number(raw.itemGradeQuality)||0)+(Number(raw.musicSpecialUpgrades)||0))/100;
 const base=key==='bo'?20:key==='def'?11:5+Math.max(0,Math.min(9,Math.floor(Number(reforge)||0)));
 return (base*(1+effect/100)*quality+base*harmony)*item;
}
function sgBfoEffect(bfo=sgPlanner.musicBfo){
 const raw=state.musicBuffLab?.inputs||{};
 const quality=1.3+(Number(raw.musicKnowledgeReforge)||0)/100+0.16;
 const harmony=(Number(raw.fairyDragonHarmonyEffectBuff)||0)/100;
 const item=1+((Number(raw.itemGradeQuality)||0)+(Number(raw.musicSpecialUpgrades)||0))/100;
 return Math.max(0,((bfo/20/item-harmony)/quality-1)*100);
}
/* Music source choice: link the exact Inspiring Enduring Melody results from
   Rate Isn't a Lie, including its configured ranks, reforges and modifiers.
   The ally BFO estimate is only used when the music-lab source is not selected. */
function sgMelodyAmount(){
 if(sgPlanner.melodyFromLab){
  const def=musicCalcForKey('enduring_def').inspiring;
  const prot=musicCalcForKey('enduring_prot').inspiring;
  return {def,prot,mdef:def,mprot:prot};
 }
 const effect=sgBfoEffect();
 const prot=sgPlanner.melodyManual?sgN(sgPlanner.customMelody):sgMusicFor('prot',sgPlanner.musicReforge,effect);
 const def=sgPlanner.melodyManual?sgN(sgPlanner.customMelody):sgMusicFor('def',sgPlanner.musicReforge,effect);
 return {def,prot,mdef:def,mprot:prot};
}
function sgProjected(enabled=sgPlanner.enabled){
 const raw={...sgPlanner.base},components=[],primary={str:0,will:0,int:0};
 const gear=sgGearBonusState();components.push(...gear.components);
 for(const id of enabled){
  if(id==='melody'){const buff=sgMelodyAmount();components.push({id,name:'Enduring Melody · Bri build estimate',buff});continue}
  if(id==='link')continue;
  const buff=sgPlanner.dynamic[id]||SG_BUFS[id];if(buff)components.push({id,name:SG_PREP.find(p=>p[0]===id)?.[1]||(id==='transform'?'G2 transformation':'Buff'),buff});
 }
 if(enabled.has('link'))components.push({id:'link',name:'Divine Link · observed flat increases',buff:{...sgPlanner.dynamic.link}});
 for(const x of components){for(const k of SG_STATS)raw[k]+=Number(x.buff[k])||0;for(const k of ['str','will','int'])primary[k]+=Number(x.buff[k])||0;}
 const converted={def:Math.trunc(primary.str/10),mdef:Math.trunc(primary.will/10),mprot:Math.trunc(primary.int/10)};
 for(const k of Object.keys(converted))raw[k]+=converted[k];
 const capped={},remaining={};for(const k of SG_STATS){const rate=k==='hp'?0.15:0.10;const projectedBonus=Math.max(0,raw[k]*rate);capped[k]=Math.min(projectedBonus,SG_CAPS[k]);remaining[k]=Math.max(0,SG_CAPS[k]-projectedBonus)}
 return {raw,capped,remaining,components,primary,converted};
}
/* Shared SG stat onboarding (Companion 132). Entries are one character-sheet snapshot,
   not separate values per scenario. Dismissal and entered values persist locally.
   Buff usefulness compares capped Oath output with and without that effect; it does
   not imply a buff has no non-Oath utility. */
const SG_STATS_STORE='midir-sg-player-stats-v1';
const sgStatsWizard={status:'ask',step:0,celebrate:false};
(function(){try{const saved=JSON.parse(localStorage.getItem(SG_STATS_STORE)||'null');if(!saved)return;if(saved.base)for(const k of SG_STATS)if(Number.isFinite(Number(saved.base[k])))sgPlanner.base[k]=sgN(saved.base[k]);sgStatsWizard.status=saved.status==='complete'?'complete':'later'}catch(e){}})();
function sgSavePlayerStats(){try{localStorage.setItem(SG_STATS_STORE,JSON.stringify({status:sgStatsWizard.status,base:sgPlanner.base}))}catch(e){}}
function sgOathBonus(k,value){return Math.max(0,Math.min((k==='hp'?.15:.10)*value,SG_CAPS[k]))}
function sgBuffAmount(id){if(id==='melody')return sgMelodyAmount();return sgPlanner.dynamic[id]||SG_BUFS[id]||{}}
function sgBuffWorth(id,result,selected){const amt=sgBuffAmount(id),enabled=new Set(sgPrepByMode[sg.page]||sgPlanner.enabled);enabled.add(id);const withBuff=sgProjected(enabled);enabled.delete(id);const withoutBuff=sgProjected(enabled);const changed=SG_STATS.filter(k=>sgOathBonus(k,withBuff.raw[k])-sgOathBonus(k,withoutBuff.raw[k])>0.001).map(k=>SG_LABELS[k]);return {any:changed.length>0,changed,hasStats:SG_STATS.some(k=>Number(amt[k])!==0)||['str','will','int'].some(k=>Number(amt[k])!==0)};}
function sgStatScene(){const k=SG_STATS[sgStatsWizard.step]||'hp',name=SG_LABELS[k],max=({hp:20000,def:1500,prot:150,mdef:1500,mprot:150})[k],value=sgPlanner.base[k],pct=Math.min(100,100*value/max),finished=sgStatsWizard.step>=SG_STATS.length;
 if(sgStatsWizard.status==='ask')return `<section class="sg-wizard" aria-label="Character stat setup"><div class="sg-wizard-emblem">✦</div><h3>Build your Sacred Guardian profile</h3><p>Set up your stats to begin.</p><div class="sg-wizard-buttons"><button class="primary" data-act="sg-stats-begin">Begin</button><button data-act="sg-stats-later">I'll do this later</button></div></section>`;
 if(finished)return `<section class="sg-wizard sg-wizard-success"><div class="sg-wizard-emblem">✦</div><h3>Profile ready!</h3><p>Ready to go!</p><button class="primary" data-act="sg-stats-finish">Explore Oath Workshop</button></section>`;
 return `<section class="sg-wizard" aria-label="Enter ${esc(name)}"><div class="sg-wizard-top">Character profile · ${sgStatsWizard.step+1} of ${SG_STATS.length}</div><div class="sg-wizard-emblem">${k==='hp'?'♥':k==='prot'||k==='mprot'?'✧':'⛨'}</div><h3>${esc(name)}</h3><p>Enter the value shown in your Character Info panel.</p><div class="sg-stat-meter ${pct>=100?'is-full':''}" role="progressbar" aria-valuenow="${value}" aria-valuemax="${max}"><span style="width:${pct}%"></span></div><div class="sg-meter-label"><span>${value.toLocaleString()} entered</span><span>${max.toLocaleString()} cap threshold</span></div><form id="sg-stat-form"><label class="sg-wizard-number">${esc(name)} <input id="sg-stat-entry" type="number" min="0" step="1" required value="${value}"></label><div class="sg-wizard-buttons"><button type="button" data-act="sg-stats-back" ${sgStatsWizard.step===0?'disabled':''}>Back</button><button type="submit" class="primary">${sgStatsWizard.step===SG_STATS.length-1?'Finish':'Save & next'} ✦</button><button type="button" data-act="sg-stats-later">I'll do this later</button></div></form></section>`;
}
function sgStatsHeader(){const configured=sgStatsWizard.status==='complete';return `<div class="sg-profile-strip"><span>✦ ${configured?'Character stats saved':'Character stats not yet confirmed'}</span><button type="button" data-act="sg-stats-edit">${configured?'Edit player stats':'Enter player stats'}</button></div>`}
const sgBonusWizard={id:null,step:0};
const SG_BONUS_LABELS={...SG_LABELS,str:'Strength',will:'Will',int:'Intelligence'};
function sgEditableBonusStats(id){return ['bags','catering'].includes(id)?[...SG_STATS,'str','will','int']:SG_STATS}
const SG_EDITABLE_BUFFS=new Set(['catering','bags','link','transform']);
function sgBuffIcon(id){const mapping={catering:'',bags:'',cloud:'',yip:'Lovable Yip',link:'Divine Link',transform:'',shield:'Shield of Trust',melody:'Enduring Melody',pulse:'Orbital Pulse'};const name=mapping[id];return (name&&window.MIDIR_ROTATION_ICONS?.[name])||({yip:'assets/icons/skills/GUI_icon_skill_004_7_15.png',link:'assets/icons/skills/gui_icon_skill_003_5_10.png',shield:'assets/icons/skills/gui_icon_skill_003_5_5.png',pulse:'assets/icons/skills/gui_icon_skill_005_3_11.png',catering:'assets/icons/skills/gui_icon_skill_003_1_3.png',transform:'assets/icons/skills/gui_icon_skill_000_0_0.png'})[id]||''}
function sgBonusDialog(){if(!sgBonusWizard.id)return '';const id=sgBonusWizard.id,fields=sgEditableBonusStats(id),field=fields[sgBonusWizard.step],names={catering:'Catering Dish',bags:'Doll Bags',link:'Divine Link',transform:'G2 Transformation'},values=sgPlanner.dynamic[id]||{},value=Number(values[field])||0;return `<div class="sg-edit-backdrop" role="presentation"><section class="sg-wizard sg-edit-dialog" role="dialog" aria-modal="true" aria-label="Edit ${esc(names[id])} bonus"><div class="sg-wizard-top">${esc(names[id])} · ${sgBonusWizard.step+1} of ${fields.length}</div><div class="sg-wizard-emblem">✦</div><h3>${esc(SG_BONUS_LABELS[field])}</h3><div class="sg-stat-meter"><span style="width:${Math.min(100,Math.max(0,100*value/(field==='hp'?3000:['def','mdef'].includes(field)?1500:['str','will','int'].includes(field)?300:150)))}%"></span></div><form id="sg-bonus-form"><label class="sg-wizard-number">Bonus to ${esc(SG_BONUS_LABELS[field])} <input id="sg-bonus-entry" type="number" ${['str','will','int'].includes(field)?'min="-10000000" max="10000000"':'min="0" max="10000000"'} step="1" required value="${value}"></label><p class="hint">${['str','will','int'].includes(field)?'Extra stats affect the matching defensive stat in groups of 10. Negative bonuses are supported.':'Enter the observed flat stat increase.'}</p><div class="sg-wizard-buttons"><button type="button" data-act="sg-bonus-back" ${sgBonusWizard.step===0?'disabled':''}>Back</button><button class="primary" type="submit">${sgBonusWizard.step===fields.length-1?'Save bonus':'Save & next'} ✦</button><button type="button" data-act="sg-bonus-close">Close</button></div></form></section></div>`}

function sgPlannerView(){
 const result=sgProjected(sgPrepByMode[sg.page]||sgPlanner.enabled);
 const input=(id,val,step=1)=>`<input type="number" min="${/:(str|will|int)$/.test(id)?-10000000:0}" max="10000000" step="${step}" data-sg-calc="${id}" value="${Number(val)}" style="width:7em;max-width:100%">`;
 const snapshot=sgSnapshotProjection(result);
 const statGauges=SG_STATS.map(k=>{const cap=SG_CAPS[k],used=snapshot.oath[k],pct=Math.min(100,100*used/cap);return `<div class="sg-compact-stat"><div><strong>${esc(SG_LABELS[k])}</strong><span>Oath +${used.toFixed(1)} / ${cap} ${pct>=99.999?'✦ Capped':''}</span></div><div class="sg-stat-meter ${pct>=99.999?'is-full':''}"><span style="width:${pct}%"></span></div><small class="hint">With active snapshots: ${snapshot.active[k].toFixed(1)} · Prepared: ${result.raw[k].toFixed(1)}</small></div>`}).join('');
 const activeSet=sgPrepByMode[sg.page]||sgPlanner.enabled;
 const support=[['catering','Catering Dish','10-minute meal; activate early'],['bags','Doll Bags','Enter your own doll bag totals'],['cloud','Cloud / Nimbus pet','Fixed buff; summon before Divine Link'],['yip','Lovable Yip','Use the other pet before Divine Link'],['link','Divine Link','Linked pet; replacing it breaks Link'],['transform','G2 transformation','Flat bonus depends on race and skill rank; 36-minute reuse'],['shield','Shield of Trust + Magic Dampening','Same short-duration window'],['melody','Enduring Melody','Ally music; build-dependent'],['pulse','Orbital Pulse · both aspects','Effects add together; short-duration window']];
 const opts=support.map(([id,title,hint])=>{const selected=activeSet.has(id),worth=sgBuffWorth(id,result,selected),note=!worth.hasStats?'Enter your observed bonuses':worth.any?`Helps: ${worth.changed.join(', ')}`:'No additional Oath gain · affected stats capped';const icon=sgBuffIcon(id);return `<div class="sg-bonus-row ${!worth.any&&worth.hasStats?'sg-prep-capped':''}"><input type="checkbox" aria-label="Enable ${esc(title)}" data-sg-calc-check="${id}" ${selected?'checked':''}><span class="sg-bonus-icon">${icon?`<img src="${esc(icon)}" alt="">`:'✦'}</span><div class="sg-bonus-copy"><div class="sg-bonus-top"><strong>${esc(title)}</strong>${SG_EDITABLE_BUFFS.has(id)?`<button type="button" class="sg-bonus-edit" data-act="sg-bonus-edit:${id}">Edit</button>`:''}</div><small class="${worth.any?'sg-gain':'sg-no-gain'}">${esc(note)}</small></div></div>`}).join('');
 const dynamic=['link','transform','bags','catering'].map(id=>`<fieldset><legend>${id==='link'?'Divine Link · increases shown while linked':id==='bags'?'Doll Bags · your observed total':id==='catering'?'Catering · your observed dish bonuses':'G2 transformation · flat stats'}</legend>${sgEditableBonusStats(id).map(k=>`<label style="display:inline-flex;gap:.3rem;align-items:center;margin:.25rem .5rem .25rem 0">${SG_BONUS_LABELS[k]} ${input('dynamic:'+id+':'+k,(sgPlanner.dynamic[id]||{})[k]||0)}</label>`).join('')}</fieldset>`).join('');
 const chosen=sgMelodyGear(sgPlanner.musicReforge);
 const effect=sgBfoEffect();
 const {prot:melodyProt,def:melodyDef}=sgMelodyAmount();
 const sliders=`<div class="sg-slider-pair sg-music-compact"><label><span class="sg-music-label">Ally BFO <strong>${sgPlanner.musicBfo}%</strong></span><div class="sg-stat-meter"><span style="width:${(sgPlanner.musicBfo-65)*10}%"></span></div><input aria-label="Ally Inspiring or Haunting BFO" type="range" min="65" max="75" step="1" value="${sgPlanner.musicBfo}" data-sg-slider="bfo"></label><label><span class="sg-music-label">Enduring Protection reforge <strong>${sgPlanner.musicReforge}/9</strong></span><div class="sg-stat-meter"><span style="width:${sgPlanner.musicReforge/9*100}%"></span></div><input aria-label="Enduring Melody Protection reforge" type="range" min="0" max="9" step="1" value="${sgPlanner.musicReforge}" data-sg-slider="reforge"></label></div><p class="sg-music-result">+${melodyProt.toFixed(1)} Protection / Magic Protection · +${melodyDef.toFixed(1)} Defense / Magic Defense</p>`;
 const advice={full:{title:'Full setup',why:'Worth preparing before combat when an ally can play and pet swaps are safe.',prep:['relic','emblem','title1','title2','persona','catering','bags','cloud','yip','transform','link','melody','shield','pulse'],notes:'Prepare the meal and bags early. Summon Cloud/Nimbus and use Yip before establishing Divine Link. Coordinate ally Enduring Melody; use short Shield/Pulse effects immediately before snapshots.',chain:SG_CORE},quick:{title:'Emergency re-Oath',why:'Prioritize being protected again; avoid waiting for ally music, catering, or replacing the linked pet.',prep:['bags','shield','pulse'],notes:'Keep already-active Doll Bags. If a Taunt Duration emblem is worn, do not count the defensive emblem while in combat. Use Shield and Pulse if available, and skip unsafe gear/pet swaps.',chain:sg.availableWool?SG_QUICK:SG_WOOLLESS},wool:{title:'Wool readiness',why:'Spend the consumable when safe and when useful stats still have headroom.',prep:['bags','catering','cloud','yip','link','melody','shield','pulse'],notes:'Prepare long effects outside combat, obtain ally music, then apply short effects and complete the full sequence. If capped or the ally is unavailable, save Wool.',chain:SG_CORE}};
 const recommended=advice[sg.mode];
 const labels=Object.fromEntries([...SG_PREP,...SG_CHECKLIST_ITEMS.filter(x=>x[4]==='gear')].map(x=>[x[0],x[1]]));
 const rotation=`<div class="sg-scenario-plan"><h4>Suggested rotation · ${recommended.title}</h4><p class="hint">${recommended.why} ${recommended.notes}</p><ol>${[...recommended.prep.map(id=>labels[id]||id),...recommended.chain.map(x=>x[1])].map(name=>`<li>${esc(name)}</li>`).join('')}</ol><button type="button" data-act="sg-plan-apply">Use this preparation as my starting point</button><details><summary>Customize this rotation</summary><textarea data-sg-plan-edit="${sg.mode}" rows="9" style="width:100%">${esc(sgPlanEdits[sg.mode]||[...recommended.prep.map(id=>labels[id]||id),...recommended.chain.map(x=>x[1])].join(' → '))}</textarea><p class="hint">Your edits are notes for this practice session; the snapshot builder below still follows its established chain.</p></details><p class="hint">Adjust the preparation checkboxes to match your situation.</p></div>`;
 return `${sgGearPanel()}<div class="sg-calculator"><div class="sg-section-heading"><h3>Oath thresholds</h3><button type="button" data-act="sg-stats-edit">Edit Player Stats</button></div><div class="sg-stat-dashboard">${statGauges}</div><div class="sg-section-heading"><h4>Ally Music</h4><button type="button" class="${sgPlanner.melodyFromLab?'primary':''}" data-act="sg-music-source">${sgPlanner.melodyFromLab?'Using Rate Isn\'t a Lie · Switch back':'Use Rate Isn\'t a Lie'}</button></div>${sgPlanner.melodyFromLab?`<div class="sg-music-linked"><strong>Inspiring Enduring Melody</strong><span>From Rate Isn\'t a Lie · +${melodyProt.toFixed(1)} Prot / M.Prot · +${melodyDef.toFixed(1)} Def / M.Def</span></div>`:sliders}<h4>Available buffs</h4><div class="sg-bonus-grid">${opts}</div><details class="sg-stat-breakdown"><summary>Fine-tune your Doll Bag, Catering and other bonuses</summary><div class="sg-prep-dynamic-grid">${dynamic}</div></details></div>${sgBonusDialog()}`;
}
/* Sacred Guardian visual checklist: independent of the immutable snapshot drill sequence.
   Checklist order reflects user preference, not an enforced in-game combo. */
const SG_CHECKLIST_ITEMS=[
 ['relic','Little Fury Sword Relic','Equip desired rank for Will','','gear'],
 ['emblem','Alban Knights Emblem','Equip before combat; Rune of Mind / Mana / Body','','gear'],
 ['title1','Equip Title','Apply your primary title bonuses','','gear'],
 ['title2','Equip 2nd Title','Apply your second title bonuses','','gear'],
 ['persona','Ophelia’s Tears Persona','5-minute duration, shared 30-minute cooldown','','gear'],
 ['catering','Catering','Prepare before combat','','prep'],
 ['bags','Doll Bags','Your equipped combination; weight ≤ 1','','prep'],
 ['cloud','Cloud / Nimbus','Summon before Divine Link','','pet'],
 ['yip','Lovable Yip','Activate before Divine Link','','pet'],
 ['transform','G2 Transformation','Use when available','','prep'],
 ['link','Divine Link','Keep the chosen pet linked','','pet'],
 ['melody','Enduring Melody','Coordinate ally music','', 'buff'],
 ['shield','Shield of Trust','Includes Magic Dampening','', 'buff'],
 ['pulse','Orbital Pulse','Both Celestial Conjunction aspects','','buff'],
 ['f1','Fateweaver 3152 · first','Start the snapshot chain','', 'chain'],
 ['o1','Virtuous Oath · first','Capture Fateweaver','', 'chain'],
 ['f2','Fateweaver 3152 · second','Refresh the inherited snapshot','', 'chain'],
 ['o2','Virtuous Oath · second','Refresh the inherited snapshot','', 'chain'],
 ['w','Golden Magic Wool','Use after prepared snapshots','', 'chain'],
 ['f3','Fateweaver 3152 · final','Capture the Wool snapshot','', 'chain'],
 ['o3','Virtuous Oath · final','Complete the chain','', 'chain']
];
const SG_CHECKLIST_ICONS={relic:'',emblem:'',title1:'',title2:'',persona:'',yip:'Lovable Yip',link:'Divine Link',pulse:'Orbital Pulse',melody:'Enduring Melody',shield:'Shield of Trust',f1:'Fateweaver',f2:'Fateweaver',f3:'Fateweaver',o1:'Virtuous Oath',o2:'Virtuous Oath',o3:'Virtuous Oath',w:'Golden Magic Wool'};
const SG_CHECKLIST_DEFAULTS={full:SG_CHECKLIST_ITEMS.map(x=>x[0]),quick:['relic','emblem','title1','title2','persona','bags','shield','pulse']};
const SG_CHAIN_IDS=new Set(['f1','o1','f2','o2','w','f3','o3']);
const sgChecklistAllIds=()=>[...SG_CHECKLIST_ITEMS.map(x=>x[0]),...sgEmergencyChainItems().map(x=>x[0])];
function sgEmergencyChainItems(){const counts={f:0,o:0,w:0};return sgEmergencySequence.filter(id=>id!=='w'||sg.availableWool).map(id=>{const count=++counts[id],key=`em-${id}-${count}`,name=id==='f'?'Fateweaver 3152':id==='o'?'Virtuous Oath':'Golden Magic Wool',icon=id==='f'?'Fateweaver':id==='o'?'Virtuous Oath':'Golden Magic Wool';return [key,`${name} · ${count}`,`Emergency cast ${count}`,id==='w'?'assets/golden-magic-wool-user.png':'','chain',icon]});}
function sgChecklistVisible(mode){
 // Exactly one chain source for each mode. Never permit old full-chain IDs or
 // stored emergency IDs to leak into the other mode or double-render a cast.
 const prepIds=new Set(SG_CHECKLIST_ITEMS.filter(x=>x[4]!=='chain').map(x=>x[0]));
 const desiredPrep=new Set([...sgPrepByMode[mode],...sgGearStepIds(Date.now(),mode)].filter(id=>prepIds.has(id)));
 const chain=(mode==='full'?['f1','o1','f2','o2','w','f3','o3'].filter(id=>id!=='w'||sg.availableWool):sgEmergencyChainItems().map(x=>x[0]));
 const allowed=new Set([...desiredPrep,...chain]);
 const order=sgChecklist.order[mode];
 const result=[];for(const id of [...order,...SG_CHECKLIST_ITEMS.map(x=>x[0]).filter(id=>desiredPrep.has(id)),...chain])if(allowed.has(id)&&!result.includes(id))result.push(id);
 return result;
}


const sgChecklist={order:{full:[...SG_CHECKLIST_DEFAULTS.full],quick:[...SG_CHECKLIST_DEFAULTS.quick]},done:{full:new Set(),quick:new Set()}};
function sgChecklistMove(mode,source,target){const list=sgChecklist.order[mode]=sgChecklistVisible(mode).concat(sgChecklist.order[mode].filter(id=>!sgChecklistVisible(mode).includes(id)));const from=list.indexOf(source),to=list.indexOf(target);if(from<0||to<0||from===to)return;list.splice(from,1);list.splice(to,0,source);sgChecklistStore();}
function sgChecklistStore(){try{localStorage.setItem('midir-sg-checklist-v1',JSON.stringify({order:sgChecklist.order,done:Object.fromEntries(Object.entries(sgChecklist.done).map(([k,v])=>[k,[...v]]))}))}catch(e){}}
(function sgChecklistLoad(){try{const data=JSON.parse(localStorage.getItem('midir-sg-checklist-v1')||'null');if(!data)return;for(const mode of ['full','quick']){const allowed=new Set([...SG_CHECKLIST_ITEMS.map(x=>x[0]),...sgEmergencyChainItems().map(x=>x[0])]);if(Array.isArray(data.order?.[mode])){const arr=[...new Set(data.order[mode].filter(id=>allowed.has(id)))];if(arr.length)sgChecklist.order[mode]=arr;}sgChecklist.done[mode]=new Set((data.done?.[mode]||[]).filter(id=>allowed.has(id)));}}catch(e){}})();
// Sacred Guardian Oath Workshop: keep the editable setup, checklist and snapshot practice together.
const SG_OATH_SAVE_KEY='midir-sg-workshop-state-v1';
let sgAchievementStats={memoryCompletions:0,sequenceCompletions:0};
function sgOathExport(){return {
 version:1,gear:JSON.parse(JSON.stringify(sgGear)),achievementStats:{...sgAchievementStats}, playerStats:{status:sgStatsWizard.status,base:{...sgPlanner.base}},
 emergencySequence:[...sgEmergencySequence],
 checklist:{order:{full:[...sgChecklist.order.full],quick:[...sgChecklist.order.quick]},done:{full:[...sgChecklist.done.full],quick:[...sgChecklist.done.quick]}},
 planner:{base:{...sgPlanner.base},enabled:[...sgPlanner.enabled],dynamic:JSON.parse(JSON.stringify(sgPlanner.dynamic)),
 musicEffect:sgPlanner.musicEffect,musicBfo:sgPlanner.musicBfo,musicInspiringEffect:sgPlanner.musicInspiringEffect,
 musicGrade:sgPlanner.musicGrade,musicReforge:sgPlanner.musicReforge,melodyManual:sgPlanner.melodyManual,
 customMelody:sgPlanner.customMelody,melodyFromLab:sgPlanner.melodyFromLab},
 prepByMode:{full:[...sgPrepByMode.full],quick:[...sgPrepByMode.quick]},
 planEdits:{...sgPlanEdits},
 practice:{page:sg.page,checkMode:sg.checkMode,step:sg.step,availableWool:sg.availableWool,
 snap:JSON.parse(JSON.stringify(sg.snap)),history:JSON.parse(JSON.stringify(sg.history)),
 woolAt:sg.woolAt,woolSpent:sg.woolSpent,hide:sg.hide,startedAt:sg.startedAt}
};}
function sgOathImport(data){if(!data||typeof data!=='object'||Array.isArray(data)||data.version!==1)return false;sgGearImport(data.gear);sgAchievementStats={memoryCompletions:0,sequenceCompletions:0,...(data.achievementStats||{})};
 const allowed=new Set(SG_STATS),validList=(items,max=64)=>Array.isArray(items)?items.filter(x=>typeof x==='string'&&x.length<100).slice(0,max):null;
 const planner=data.planner||{},stats=data.playerStats||{};
 for(const k of SG_STATS){const n=Number(planner.base?.[k]??stats.base?.[k]);if(Number.isFinite(n)&&n>=0&&n<=1e8)sgPlanner.base[k]=n;}
 if(['ask','later','complete'].includes(stats.status))sgStatsWizard.status=stats.status;
 if(validList(data.emergencySequence,16)?.every(x=>['f','o','w'].includes(x))&&data.emergencySequence.length)sgEmergencySequence=[...data.emergencySequence.slice(0,16)];
 for(const mode of ['full','quick']){
  const prep=validList(data.prepByMode?.[mode]);if(prep)sgPrepByMode[mode]=new Set(prep.filter(x=>SG_PREP.some(y=>y[0]===x)||x==='transform'));
  const order=validList(data.checklist?.order?.[mode]);if(order)sgChecklist.order[mode]=order;
  const done=validList(data.checklist?.done?.[mode]);if(done)sgChecklist.done[mode]=new Set(done);
  if(typeof data.planEdits?.[mode]==='string')sgPlanEdits[mode]=data.planEdits[mode].slice(0,2000);
 }
 const enabled=validList(planner.enabled);if(enabled)sgPlanner.enabled=new Set(enabled);
 if(planner.dynamic&&typeof planner.dynamic==='object')for(const id of ['link','transform','bags','catering'])for(const k of sgEditableBonusStats(id)){const n=Number(planner.dynamic[id]?.[k]);if(Number.isFinite(n)&&n>=(['str','will','int'].includes(k)?-1e7:0)&&n<=1e7){sgPlanner.dynamic[id]??={};sgPlanner.dynamic[id][k]=n;}}
 for(const field of ['musicEffect','musicBfo','musicInspiringEffect','musicReforge','customMelody']){const n=Number(planner[field]);if(Number.isFinite(n)&&n>=0&&n<=10000)sgPlanner[field]=n;}
 for(const field of ['melodyManual','melodyFromLab'])if(typeof planner[field]==='boolean')sgPlanner[field]=planner[field];
 if(typeof planner.musicGrade==='string')sgPlanner.musicGrade=planner.musicGrade.slice(0,60);
 const practice=data.practice||{};
 if(['full','quick','checklist'].includes(practice.page))sg.page=practice.page;
 if(['full','quick'].includes(practice.checkMode))sg.checkMode=practice.checkMode;
 if(Number.isInteger(practice.step)&&practice.step>=0&&practice.step<=30)sg.step=practice.step;
 for(const field of ['availableWool','woolSpent','hide'])if(typeof practice[field]==='boolean')sg[field]=practice[field];
 for(const field of ['woolAt','startedAt'])if(practice[field]===null||(typeof practice[field]==='number'&&Number.isFinite(practice[field])))sg[field]=practice[field];
 if(practice.snap&&typeof practice.snap==='object')for(const k of ['f','o','w'])if(practice.snap[k]===null||typeof practice.snap[k]==='object')sg.snap[k]=practice.snap[k];
 if(Array.isArray(practice.history))sg.history=practice.history.slice(0,40);
 sg.mode=sg.page==='quick'?'quick':'full';sg.prep=sgPrepByMode[sg.mode];
 sgSavePlayerStats();sgSaveEmergency();sgChecklistStore();return true;
}
function sgOathSave(){try{localStorage.setItem(SG_OATH_SAVE_KEY,JSON.stringify(sgOathExport()))}catch(e){}}
try{const old=JSON.parse(localStorage.getItem(SG_OATH_SAVE_KEY)||'null');if(old)sgOathImport(old);}catch(e){}
window.MIDIR_SG_OATH={exportState:sgOathExport,importState(data){const ok=sgOathImport(data);if(ok){sgOathSave();}return ok}};
function sgChecklistView(){const mode=sg.checkMode,order=sgChecklistVisible(mode),done=sgChecklist.done[mode];const items=Object.fromEntries([...SG_CHECKLIST_ITEMS,...sgEmergencyChainItems()].map(x=>[x[0],x]));const renderItem=(id,i)=>{const it=items[id],iconName=SG_CHECKLIST_ICONS[id]||it[5]||it[1],source=window.MIDIR_ROTATION_ICONS?.[iconName]||({yip:'assets/icons/skills/GUI_icon_skill_004_7_15.png',link:'assets/icons/skills/gui_icon_skill_003_5_10.png',shield:'assets/icons/skills/gui_icon_skill_003_5_5.png',pulse:'assets/icons/skills/gui_icon_skill_005_3_11.png'})[id]||it[3]||(id==='w'?'assets/golden-magic-wool-user.png':id==='relic'?'assets/oath/little-fury-sword-relic.png':id==='persona'?'assets/oath/ophelias-tears-persona.png':'');return `<div class="sg-check-item ${done.has(id)?'sg-check-done':''}" draggable="true" data-sg-drag="${id}" tabindex="0" aria-label="Drag to reorder ${esc(it[1])}"><span class="sg-check-number">${i+1}</span><span class="sg-drag-handle" title="Drag to reorder">⠿</span><input type="checkbox" aria-label="Completed ${esc(it[1])}" data-sg-done="${id}" ${done.has(id)?'checked':''}><span class="sg-check-icon">${source?`<img src="${esc(source)}" alt="">`:'✦'}</span><span class="sg-check-copy"><strong>${esc(it[1])}</strong><small>${esc(it[2])}</small></span></div>`};return `<section class="sg-visual-checklist" aria-label="Oath preparation checklist"><div class="sg-check-head"><div><h3>Oath checklist</h3><p class="hint">Arrange and check off your steps.</p></div><div class="sg-mode-row sg-check-modes"><button type="button" class="${mode==='full'?'primary':''}" data-act="sg-check-mode:full">Full Oath-maxing</button><button type="button" class="${mode==='quick'?'primary':''}" data-act="sg-check-mode:quick">Emergency Oath-speedrun</button></div></div><details class="sg-check-drawer"><summary>Suggested rotation <span>›</span></summary><p class="hint">Arrange your steps.</p><ol>${order.map(id=>`<li>${esc(items[id][1])}</li>`).join('')}</ol></details><div class="sg-check-topline"><span>${order.filter(id=>done.has(id)).length} checked · ${order.length} steps</span><button type="button" data-act="sg-check-reset">Restore suggested order</button><button type="button" data-act="sg-check-clear">Clear checks</button></div><div class="sg-check-list" id="sg-check-list">${order.map(renderItem).join('')}</div><p class="hint">Cloud/Yip before Divine Link; prepare longer buffs early and short buffs near your first snapshot. </p></section>`}
function sgChecklistBind(){const mode=sg.checkMode,list=document.getElementById('sg-check-list');if(!list)return;let dragging=null;list.querySelectorAll('[data-sg-done]').forEach(el=>el.addEventListener('change',()=>{el.checked?sgChecklist.done[mode].add(el.dataset.sgDone):sgChecklist.done[mode].delete(el.dataset.sgDone);sgChecklistStore();render()}));list.querySelectorAll('[data-sg-drag]').forEach(el=>{el.addEventListener('dragstart',event=>{dragging=el.dataset.sgDrag;el.classList.add('sg-dragging');event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',dragging)});el.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='move';el.classList.add('sg-drag-over')});el.addEventListener('dragleave',()=>el.classList.remove('sg-drag-over'));el.addEventListener('drop',event=>{event.preventDefault();const source=dragging||event.dataTransfer.getData('text/plain');sgChecklistMove(mode,source,el.dataset.sgDrag);dragging=null;render()});el.addEventListener('dragend',()=>{dragging=null;list.querySelectorAll('.sg-drag-over,.sg-dragging').forEach(x=>x.classList.remove('sg-drag-over','sg-dragging'))});el.addEventListener('keydown',event=>{if(!event.altKey||!['ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const order=sgChecklistVisible(mode),idx=order.indexOf(el.dataset.sgDrag),next=idx+(event.key==='ArrowUp'?-1:1);if(next>=0&&next<order.length){sgChecklistMove(mode,order[idx],order[next]);render();document.querySelector(`[data-sg-drag="${el.dataset.sgDrag}"]`)?.focus()}})})}
function sgWorkshop(){if(sg.page!=='checklist'&&(sgStatsWizard.status==='ask'||sgStatsWizard.status==='entry'))return sgStatScene();const pageNav=`<div class="sg-mode-row sg-three-pages"><button class="${sg.page==='full'?'primary':''}" data-act="sg-page:full">Oath Max</button><button class="${sg.page==='quick'?'primary':''}" data-act="sg-page:quick">Emergency Oath</button><button class="${sg.page==='checklist'?'primary':''}" data-act="sg-page:checklist">Checklist</button></div>`;if(sg.page==='checklist')return sgStatsHeader()+pageNav+sgChecklistView();sg.mode=sg.page;sg.prep=sgPrepByMode[sg.page];const steps=sgSteps(),item=steps[Math.min(sg.step,steps.length-1)],finished=sg.step>=steps.length;
 const modeButtons='';
 const prep=SG_PREP.map(([id,name,note])=>`<label class="sg-prep"><input type="checkbox" data-sg-prep="${id}" ${sg.prep.has(id)?'checked':''}> <span>${esc(name)}<small class="hint">${esc(note)}</small></span></label>`).join('');
 const captured=['f','o','w'].map(k=>`<div class="sg-snapshot"><strong>${k==='f'?'Fateweaver':k==='o'?'Virtuous Oath':'Golden Magic Wool'}</strong><p>${esc(sgLineage(k))}</p>${sg.snap[k]?`<small class="hint">Frozen bonus: ${SG_STATS.map(stat=>SG_LABELS[stat]+' +'+sg.snap[k].bonus[stat].toFixed(1)).join(' · ')}<br>Foundation when captured: ${esc(sg.snap[k].foundation.join(', ')||'No checked preparation bonuses')}</small>`:''}</div>`).join('');
 const woolInfo=sg.woolAt?`<p class="hint">Wool activated in this snapshot. At last update: ${Math.floor((Date.now()-sg.woolAt)/1000)}s elapsed of the illustrative 60s active window. This page does not observe game buffs.</p>`:'<p class="hint">Golden Magic Wool is a 60-second consumable commitment. No in-game Wool is consumed here.</p>';
 const top=`${pageNav}${sg.mode==='quick'?'<p class="sg-emergency-note"><strong>Emergency Oath reminder:</strong> If Tenacious Taunt Duration or another emblem is equipped at combat start, do not assume you can switch to an Alban Knights defensive emblem until 30 seconds have passed without dealing or taking damage. Select the emblem already active for this scenario below.</p>':''}${sgPlannerView()}`;
 if(sg.mode==='wool')return top+`<h3>Golden Wool commitment checkpoint</h3><p>Decide whether to spend a consumable now. Waiting or accepting an imperfect snapshot are both reasonable.</p><div class="sg-grid"><div class="sg-snapshot"><strong>Before Wool</strong><p>Have Fateweaver and Virtuous Oath both been refreshed as far as practical? In the full sequence Wool sees F₂ and O₂.</p></div><div class="sg-snapshot"><strong>After Wool</strong><p>Finish with Fateweaver → final Oath while Wool is available. The earlier snapshotted values remain part of the chain even if an original temporary buff expires.</p></div></div>${woolInfo}${buttons([['Practice full setup','sg-mode:full','primary'],['Practice quick recovery','sg-mode:quick']])}<p class="hint">Wool lasts about one minute and is consumed. You may need to wait for it to wear off before using another. The trainer is a snapshot builder, not a live cooldown or buff tracker.</p>`;
 return top+`<h3>Create Your Snapshot</h3><p class="hint">Capture snapshots in sequence; the Oath gauges above update as each bonus is frozen. Fateweaver and Wool freeze 12% and 20% of defensive stats at cast time; each recast replaces its prior bonus.</p>${sg.mode==='quick'?sgEmergencyEdit():''}${sg.mode==='quick'?`<label class="sg-prep"><input type="checkbox" data-sg-option="wool" ${sg.availableWool?'checked':''}> Golden Magic Wool available</label>`:''}<div class="sg-active sg-capture-compact sg-capture-panel">${finished?`<h3>Snapshot complete ✦</h3>`:`<div class="sg-capture-prompt"><span class="hint">Snapshot ${sg.step+1} / ${steps.length}</span><strong>${sg.hide?'Recall the next action':esc(item[1])}</strong></div><p class="hint">${sg.hide?'Recall the next snapshot from memory.':esc(item[2])}</p>`}${!finished&&sg.hide?buttons([['Reveal instruction','sg-reveal']]):''}${!finished?`<div class="sg-capture-skills">${[['f','Fateweaver','Fateweaver'],['o','Virtuous Oath','Virtuous Oath'],['w','Golden Magic Wool','Golden Magic Wool']].filter(([id])=>id!=='w'||sg.availableWool).map(([id,name,icon])=>{const src=window.MIDIR_ROTATION_ICONS?.[icon]||(id==='w'?'assets/golden-magic-wool-user.png':'');return `<button type="button" data-act="sg-cast:${id}" title="${name}" aria-label="Capture ${name}" class="sg-capture-skill">${src?`<img src="${esc(src)}" alt="">`:'✦'}<small>${id==='f'?'Fateweaver':id==='o'?'Oath':'Wool'}</small></button>`}).join('')}</div>`:''}<div class="sg-feedback" aria-live="polite">${esc(sg.feedback||'Choose the next snapshot.')}</div><div class="sg-capture-footer"><button type="button" data-act="sg-undo" title="Undo last snapshot" aria-label="Undo last snapshot">↶ Undo</button><button type="button" data-act="sg-reset" title="Reset snapshot" aria-label="Reset snapshot">↻ Reset</button><label><input type="checkbox" data-sg-option="hide" ${sg.hide?'checked':''}> Memory</label></div></div><details class="sg-small-option"><summary>Frozen snapshot lineage</summary><div class="sg-grid">${captured}</div>${woolInfo}</details>`;
}
function sgAction(cmd,arg){sg.feedback='';
 if(cmd==='sg-persona'){
  const now=Date.now();if(arg==='start'&&!sgPersonaActive(now)&&now>=sgGear.persona.sharedReadyAt){sgGear.persona.activeUntil=now+SG_PERSONA_DURATION_MS;sgGear.persona.sharedReadyAt=now+SG_PERSONA_SHARED_COOLDOWN_MS;sg.feedback='Ophelia’s Tears activated.'}
  else if(arg==='end'&&sgPersonaActive(now)){sgGear.persona.activeUntil=now;sg.feedback='Persona ended. Shared cooldown continues.'}
  else sg.feedback='Persona is still active or on shared cooldown.';
  sgOathSave();return render();
 }
 if(cmd==='sg-emblem'){if(arg==='equip')sgGear.emblem.equipped=true;else if(arg==='remove')sgGear.emblem.equipped=false;sgOathSave();return render();}

 if(cmd.startsWith('sg-seq-')){sgEmergencyEditorOpen=true;const i=Number(arg);if(cmd==='sg-seq-add'&&['f','o','w'].includes(arg)&&sgEmergencySequence.length<16)sgEmergencySequence.push(arg);else if(cmd==='sg-seq-default')sgEmergencySequence=[...SG_EMERGENCY_DEFAULT];else if(cmd==='sg-seq-delete'&&Number.isInteger(i)&&sgEmergencySequence.length>1&&i>=0&&i<sgEmergencySequence.length)sgEmergencySequence.splice(i,1);else if(['sg-seq-up','sg-seq-down'].includes(cmd)&&Number.isInteger(i)){const j=i+(cmd==='sg-seq-up'?-1:1);if(j>=0&&j<sgEmergencySequence.length)[sgEmergencySequence[i],sgEmergencySequence[j]]=[sgEmergencySequence[j],sgEmergencySequence[i]];}sgSaveEmergency();sgChecklist.order.quick=sgChecklist.order.quick.filter(id=>!id.startsWith('em-')&&!SG_CHAIN_IDS.has(id));sgReset();sgChecklist.done.quick.clear();sgChecklistStore();return render()}
if(cmd==='sg-music-source'){sgPlanner.melodyFromLab=!sgPlanner.melodyFromLab;return render()}if(cmd==='sg-bonus-edit'&&SG_EDITABLE_BUFFS.has(arg)){sgBonusWizard.id=arg;sgBonusWizard.step=0;return render()}if(cmd==='sg-bonus-close'){sgBonusWizard.id=null;return render()}if(cmd==='sg-bonus-back'){sgBonusWizard.step=Math.max(0,sgBonusWizard.step-1);return render()}if(cmd==='sg-stats-begin'||cmd==='sg-stats-edit'){sgStatsWizard.status='entry';sgStatsWizard.step=0;return render()}
 if(cmd==='sg-stats-later'){sgStatsWizard.status='later';sgSavePlayerStats();return render()}
 if(cmd==='sg-stats-back'){sgStatsWizard.step=Math.max(0,sgStatsWizard.step-1);return render()}
 if(cmd==='sg-stats-finish'){sgStatsWizard.status='complete';sgSavePlayerStats();return render()}
if(cmd==='sg-page'){sg.page=arg==='checklist'?'checklist':arg==='quick'?'quick':'full';if(sg.page!=='checklist'){sg.mode=sg.page;sg.prep=sgPrepByMode[sg.page];sgReset()}sg.hide=false;return render()}
 if(cmd==='sg-check-mode'){sg.checkMode=arg==='quick'?'quick':'full';return render()}
 if(cmd==='sg-mode'){sg.page=arg==='quick'?'quick':'full';sg.mode=sg.page;sg.prep=sgPrepByMode[sg.page];sgReset();sg.hide=false;return render()}
 if(cmd==='sg-check-reset'){const mode=sg.checkMode;sgChecklist.order[mode]=[...SG_CHECKLIST_DEFAULTS[mode]];sgChecklist.done[mode].clear();sgChecklistStore();return render()}
 if(cmd==='sg-check-clear'){sgChecklist.done[sg.checkMode].clear();sgChecklistStore();return render()}
 if(cmd==='sg-check-remove'){const mode=sg.checkMode;sgChecklist.order[mode]=sgChecklist.order[mode].filter(x=>x!==arg);sgChecklist.done[mode].delete(arg);sgChecklistStore();return render()}
 if(cmd==='sg-check-add'){const mode=sg.mode==='quick'?'quick':'full';if(SG_CHECKLIST_ITEMS.some(x=>x[0]===arg)&&!sgChecklist.order[mode].includes(arg))sgChecklist.order[mode].push(arg);sgChecklistStore();return render()}
 if(cmd==='sg-plan-apply'){const presets={full:['catering','bags','cloud','yip','link','melody','shield','pulse','transform'],quick:['bags','shield','pulse']};sgPrepByMode[sg.page]=new Set(presets[sg.page]||[]);sg.prep=sgPrepByMode[sg.page];return render()}
 if(cmd==='sg-reset'){sgReset();return render()}
 if(cmd==='sg-clear'){sgPrepByMode[sg.page].clear();sgReset(false);sg.prep=sgPrepByMode[sg.page];return render()}
 if(cmd==='sg-reveal'){sg.hide=false;return render()}
 if(cmd==='sg-undo'){if(sg.history.length){const history=sg.history.slice(0,-1);sgReset();for(const h of history)sgSnapshot(h.kind);sg.step=history.length;sg.feedback='Rebuilt prior snapshots for this snapshot.'}return render()}
 if(cmd==='sg-cast'){const steps=sgSteps(),expected=steps[sg.step];if(!expected)return render();if(arg!==expected[0]){sg.feedback=`Not the next action in this practice sequence. Expected: ${expected[1]}. No progress was lost.`;return render()}
 if(arg==='w'&&sg.mode==='full'&&!(sg.snap.f&&sg.snap.o)){sg.feedback='Wool checkpoint: establish Fateweaver and Oath snapshots before committing.';return render()}
 sgSnapshot(arg);sg.step++;if(sg.step>=steps.length){sgAchievementStats.sequenceCompletions++;if(sg.hide)sgAchievementStats.memoryCompletions++;sgOathSave();}sg.feedback=arg==='w'?'Wool committed in snapshot builder; now capture it with the remaining snapshots.':'Snapshot created. The Oath gauges now reflect the frozen bonuses.';return render()}
}
/* Workshop checkboxes use change events so settings and prepared buffs are preserved on rerender. */
let sgGearTimer=null;
const sgOriginalBind=bind;
bind=function(){sgOriginalBind();if(state.arcana!=='sg'||state.page!=='rotation')return;sgOathSave();sgChecklistBind();if(sgGearTimer!==null){clearInterval(sgGearTimer);sgGearTimer=null}
 document.querySelector('[data-sg-relic]')?.addEventListener('change',e=>{if(Object.prototype.hasOwnProperty.call(SG_RELIC_WILL,e.target.value)){sgGear.relicRank=e.target.value;sgOathSave();render()}});
 document.querySelectorAll('[data-sg-rune]').forEach(el=>el.addEventListener('change',()=>{const n=Number(el.value);if(Number.isInteger(n)&&n>=0&&n<=5)sgGear.emblem[el.dataset.sgRune]=n;sgOathSave();render()}));
 document.querySelector('[data-sg-emblem-prep]')?.addEventListener('change',e=>{sgGear.emblem.equipped=e.target.checked;sgOathSave();render()});
 document.querySelector('[data-sg-emblem-emergency]')?.addEventListener('change',e=>{if(['tenacious','defensive','other'].includes(e.target.value)){sgGear.emblem.emergencyActive=e.target.value;sgOathSave();render()}});
 document.querySelectorAll('[data-sg-gear-check]').forEach(el=>el.addEventListener('change',()=>{sgGear[el.dataset.sgGearCheck].equipped=el.checked;sgOathSave();render()}));
 document.querySelectorAll('[data-sg-title]').forEach(el=>el.addEventListener('change',()=>{sgGear[el.dataset.sgTitle].bonuses=el.value.slice(0,4000);sgOathSave();render()}));
 let wasPersonaActive=sgPersonaActive();const sgTimer=sgGearTimer=setInterval(()=>{if(state.arcana!=='sg'||state.page!=='rotation'){clearInterval(sgTimer);return}const now=Date.now(),active=sgPersonaActive(now);if(active!==wasPersonaActive){clearInterval(sgTimer);sgOathSave();return render()}const label=document.querySelector('.sg-persona-status');if(label)label.textContent=active?'Active · '+sgClockLabel(sgGear.persona.activeUntil-now)+' left':sgGear.persona.sharedReadyAt>now?'Shared Persona cooldown · '+sgClockLabel(sgGear.persona.sharedReadyAt-now)+' remaining':'Ready to activate';if(!active&&now>=sgGear.persona.sharedReadyAt&&document.querySelector('[data-act="sg-persona:start"]:disabled')){clearInterval(sgTimer);return render()}},1000);
 document.querySelector('.sg-emergency-editor')?.addEventListener('toggle',e=>{sgEmergencyEditorOpen=e.target.open});document.getElementById('sg-bonus-form')?.addEventListener('submit',e=>{e.preventDefault();const field=document.getElementById('sg-bonus-entry'),id=sgBonusWizard.id;if(!field||!field.checkValidity()||!id)return;sgPlanner.dynamic[id]??={};sgPlanner.dynamic[id][sgEditableBonusStats(id)[sgBonusWizard.step]]=['str','will','int'].includes(sgEditableBonusStats(id)[sgBonusWizard.step])?sgSignedNumber(field.value):sgN(field.value);sgBonusWizard.step++;if(sgBonusWizard.step>=sgEditableBonusStats(id).length)sgBonusWizard.id=null;render()});document.querySelectorAll('[data-sg-slider]').forEach(el=>{el.addEventListener('wheel',e=>{e.preventDefault();const min=Number(el.min),max=Number(el.max),val=Math.max(min,Math.min(max,Number(el.value)+(e.deltaY<0?1:-1)));if(el.dataset.sgSlider==='bfo')sgPlanner.musicBfo=val;else sgPlanner.musicReforge=val;const key=el.dataset.sgSlider;render();document.querySelector(`[data-sg-slider="${key}"]`)?.focus({preventScroll:true})},{passive:false});});document.getElementById('sg-stat-form')?.addEventListener('submit',e=>{e.preventDefault();const field=document.getElementById('sg-stat-entry');if(!field||!field.checkValidity())return;sgPlanner.base[SG_STATS[sgStatsWizard.step]]=sgN(field.value);sgStatsWizard.step++;if(sgStatsWizard.step>=SG_STATS.length){sgStatsWizard.status='complete';sgSavePlayerStats()}render()});document.querySelectorAll('[data-sg-prep]').forEach(el=>el.addEventListener('change',()=>{if(el.checked){sgPrepByMode[sg.page].add(el.dataset.sgPrep);sgPlanner.enabled.add(el.dataset.sgPrep)}else {sgPrepByMode[sg.page].delete(el.dataset.sgPrep);sgPlanner.enabled.delete(el.dataset.sgPrep)}sg.prep=sgPrepByMode[sg.page];render()}));document.querySelectorAll('[data-sg-plan-edit]').forEach(el=>el.addEventListener('change',()=>{sgPlanEdits[el.dataset.sgPlanEdit]=el.value}));document.querySelectorAll('[data-sg-slider]').forEach(el=>el.addEventListener('input',()=>{if(el.dataset.sgSlider==='bfo')sgPlanner.musicBfo=Number(el.value);else sgPlanner.musicReforge=Number(el.value);const key=el.dataset.sgSlider;render();document.querySelector(`[data-sg-slider="${key}"]`)?.focus({preventScroll:true})}));document.querySelectorAll('[data-sg-calc-check]').forEach(el=>el.addEventListener('change',()=>{const id=el.dataset.sgCalcCheck;if(id==='manual')sgPlanner.melodyManual=el.checked;else {if(el.checked){sgPlanner.enabled.add(id);sgPrepByMode[sg.page]?.add(id)}else {sgPlanner.enabled.delete(id);sgPrepByMode[sg.page]?.delete(id)}}render()}));document.querySelectorAll('[data-sg-calc]').forEach(el=>el.addEventListener('change',()=>{const key=el.dataset.sgCalc;const val=sgN(el.value);if(key.startsWith('base:')){sgPlanner.base[key.split(':')[1]]=val;sgSavePlayerStats()}else if(key.startsWith('dynamic:')){const [,id,stat]=key.split(':');sgPlanner.dynamic[id][stat]=['str','will','int'].includes(stat)?sgSignedNumber(el.value):val;}else if(key==='reforge')sgPlanner.musicReforge=Math.min(9,Math.floor(val));else if(key==='musicEffect')sgPlanner.musicEffect=val;else if(key==='inspiringEffect')sgPlanner.musicInspiringEffect=Math.min(16,val);else if(key==='manual')sgPlanner.customMelody=val;render()}));document.querySelectorAll('[data-sg-calc-select]').forEach(el=>el.addEventListener('change',()=>{sgPlanner.musicGrade=el.value;render()}));document.querySelectorAll('[data-sg-option]').forEach(el=>el.addEventListener('change',()=>{if(el.dataset.sgOption==='wool'){sg.availableWool=el.checked;sgReset()}if(el.dataset.sgOption==='hide')sg.hide=el.checked;render()}))};

const arcOriginalAction=action;
action=function(s){let [cmd,arg]=s.split(':');
if(cmd==='arc-herb'){arcRuntime.herbs++;arcRuntime.herbX=5+Math.random()*78;arcRuntime.herbY=8+Math.random()*70;arcRuntime.herbId=window.MIDIR_HERBS?.randomHerb?.().id||arcRuntime.herbId;return render()}
if(cmd==='arc-herb-reset'){arcRuntime.herbs=0;arcRuntime.herbId='base';return render()}
if(cmd.startsWith('sg-'))return sgAction(cmd,arg);
if(cmd==='arc-main'){arcRuntime.ordinary++;return render()}
if(cmd==='arc-chorus'){arcRuntime.weaves++;return render()}
if(cmd==='arc-weave-reset'){arcRuntime.weaves=0;arcRuntime.ordinary=0;return render()}
if(cmd==='arc-choice'){const a=ARCANA_PAGES[state.arcana];const scene=a?.prompts?.[arcRuntime.scenario%a.prompts.length];arcRuntime.follow=scene?'Consider what the encounter actually permits. You selected: '+scene[Number(arg)+1]+'.':'Review your choice.';return render()}
if(cmd==='arc-next'){arcRuntime.scenario++;arcRuntime.follow='';return render()}
return arcOriginalAction(s)};
// Overview is a collapsible sidebar, not a standalone page.
let overviewOpen=false;
const overviewLinks=[
 ['as','as-invaders','Crom Bás Invaders'],
 ['as','position','Positioning Lab'],['dd','theta','Subject Theta Containment'],['ek','pig','Pig Pursuit'],
 ['hs','music-lie',"Rate isn't a Lie"],['sg','oath','Oath Workshop'],['ev','reforge','Reforge Simulator'],
 ['ag','ag-position','Field & Firing Lane Lab'],['fa','herbs','Herb Collection / Precision Harvest'],
 ['mp','erg','Erg Break Simulator'],['mp','rhythm','Cutting Chorus Rhythm'],['ev','ev-defense','Tower Range Lab'],['bb','bb-bandit','Bandit Hunt']
];
function sidebarContents(){return `<h2>Games & Simulators</h2><div class="overview-links">${overviewLinks.map(([arc,view,title])=>`<button type="button" data-overview-route="${arc}:${view}">${esc(title)}</button>`).join('')}<button type="button" data-overview-route="${state.arcana}:craft">Rotation Crafter (${esc(state.arcana.toUpperCase())})</button><button type="button" data-overview-page="debuff">Debuff Academy</button></div><h2>Recent training</h2><p class="hint panel-intro">Teach what you control. Prepare for what you cannot.</p>${state.drillHistory.slice(-8).reverse().map(d=>`<div class="lesson"><strong>${d.type==='dd'?'DD audio drill (legacy)':'AS keyboard practice'}</strong><small> · ${new Date(d.date).toLocaleString()}</small><p>${d.type==='dd'?'Stage '+(d.stage+1)+' · '+esc(d.mode):fmt(d.actions)+' simulated actions'}</p></div>`).join('')||'<p class="hint">Your completed drills appear here.</p>'}`}

function syncOverviewSidebar(){const side=$('overview-sidebar');if(!side)return;side.hidden=!overviewOpen;side.setAttribute('aria-hidden',String(!overviewOpen));$('overview-toggle')?.setAttribute('aria-expanded',String(overviewOpen));if(overviewOpen){const content=$('overview-sidebar-content');if(content)content.innerHTML=sidebarContents()}}
function setOverviewOpen(next){overviewOpen=Boolean(next);syncOverviewSidebar();window.MIDIR_I18N?.apply(document)}
function toggleOverviewSidebar(){setOverviewOpen(!overviewOpen)}
$('overview-toggle')?.addEventListener('click',toggleOverviewSidebar);
$('overview-sidebar-content')?.addEventListener('click',e=>{const b=e.target.closest('[data-overview-route],[data-overview-page]');if(!b)return;if(b.dataset.overviewPage){state.page=b.dataset.overviewPage;setOverviewOpen(false);save();render();return;}const [arc,view]=b.dataset.overviewRoute.split(':');stopTimers();state.arcana=arc;state.arcanaVisits=state.arcanaVisits||{};state.arcanaVisits[arc]=Date.now();state.page='rotation';save();setOverviewOpen(false);render();action('hub:'+view);});
$('overview-close')?.addEventListener('click',()=>setOverviewOpen(false));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overviewOpen){setOverviewOpen(false);$('overview-toggle')?.focus()}});
document.addEventListener('pointerdown',event=>{if(overviewOpen&&!$('overview-sidebar')?.contains(event.target)&&!$('overview-toggle')?.contains(event.target))setOverviewOpen(false)});
// Select one player by exact case-insensitive character name, never by position in the party.
function chosenPlayer(r){const name=state.characterName.trim().toLocaleLowerCase();if(!name)return null;return (r.players||[]).find(p=>String(p.name||'').trim().toLocaleLowerCase()===name)||null}
function rebuildOwnedMilestones(){const existing=state.metricMilestones||[];const other=existing.filter(x=>!x.reportId);state.metricMilestones=other;const ordered=[...state.reports].sort((a,b)=>(a.importedAt||0)-(b.importedAt||0));for(const r of ordered){if(reportIsArchived(r)||r.archiveCompact||archiveLedger().sources[r.id])continue;for(const event of vaultEventsForImport(r)){const id=[event.reportId,event.player,event.type,event.attemptKey||''].join('|');if(!state.metricMilestones.some(x=>x.id===id))state.metricMilestones.push({...event,id})}}}
function syncCharacterDraftUi(){const input=$('vault-character-name'),button=$('vault-character-save'),status=$('vault-character-status');if(!input)return;const saved=state.characterName.trim();const current=input.value.trim();if(button){const dirty=current!==saved;button.hidden=!dirty;button.disabled=!dirty}if(status){status.textContent=saved?`Tracking ${state.characterName} · ${state.reports.filter(r=>chosenPlayer(r)).length} of ${state.reports.length} saved reports contain this character.`:'Enter your character name to track personal awards and milestones.'}}
function applyCharacterName(){const el=$('vault-character-name');if(!el)return;const name=el.value.trim().slice(0,80);const previous=new Set(state.metricMilestones.map(x=>x.id));state.characterName=name;rebuildOwnedMilestones();const newEvents=state.metricMilestones.filter(x=>x.reportId&&!previous.has(x.id));save();render();message(name?'Vault now follows '+name+'. Reports with no matching character are excluded from your awards and personal milestones.':'Enter your character name to track personal awards and stats.');if(name&&newEvents.length)celebration(newEvents)}
if(state.oathSequence){const items=state.oathSequence.split(',').map(s=>s.trim()).filter(Boolean);if(items.length)arcRuntime.sequence=items}
// Deferred until IndexedDB report hydration completes; do not erase bankable old milestones.
// Rotation reference and experimental positioning — independent of report evidence.
const rotationOriginal=rotation,rotationActionOriginal=action,rotationBindOriginal=bind;
let rotationView='reference';
let positionIntroSeen=false;
const positionSandbox={mode:'cone',enemies:[],player:{x:90,y:250},angle:-12,range:250,spread:48,lineWidth:24,selected:'player',tool:'move',last:'',eliminated:new Set(),busy:false};
function randomizeSandbox(){const p=positionSandbox;p.enemies=Array.from({length:1+Math.floor(Math.random()*15)},(_,i)=>({id:i+1,x:130+Math.random()*400,y:35+Math.random()*315}));p.eliminated.clear();p.last='New group. Try moving yourself or rotating the attack.'}
randomizeSandbox();
function posClamp(v,a,b){return Math.min(b,Math.max(a,v))}
function posAngle(a){return (a*Math.PI)/180}
function posHits(){const p=positionSandbox, a=posAngle(p.angle),ux=Math.cos(a),uy=Math.sin(a),hit=[];for(const e of p.enemies){const dx=e.x-p.player.x,dy=e.y-p.player.y,along=dx*ux+dy*uy,cross=Math.abs(-dx*uy+dy*ux);if(along>=0&&along<=p.range&&(p.mode==='line'?cross<=p.lineWidth/2+9:cross<=Math.tan(posAngle(p.spread/2))*along+9))hit.push(e.id)}return hit}
function posPaint(){const el=$('position-arena');if(!el)return;const p=positionSandbox,a=posAngle(p.angle),ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux,ex=p.player.x+ux*p.range,ey=p.player.y+uy*p.range;let shape;if(p.mode==='line'){const h=p.lineWidth/2;shape=`<polygon points="${p.player.x+nx*h},${p.player.y+ny*h} ${ex+nx*h},${ey+ny*h} ${ex-nx*h},${ey-ny*h} ${p.player.x-nx*h},${p.player.y-ny*h}" />`}else{const h=Math.tan(posAngle(p.spread/2))*p.range;shape=`<polygon points="${p.player.x},${p.player.y} ${ex+nx*h},${ey+ny*h} ${ex-nx*h},${ey-ny*h}" />`}const predicted=new Set(posHits());el.innerHTML=`<defs><pattern id="position-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#52667a" opacity=".2"/></pattern></defs><rect width="560" height="380" fill="#132133"/><rect width="560" height="380" fill="url(#position-grid)"/><g class="position-aim">${shape}</g>${p.enemies.map(e=>`<g data-enemy="${e.id}" class="position-enemy ${p.eliminated.has(e.id)?'is-eliminated':''} ${predicted.has(e.id)?'predicted-hit':''}"><circle cx="${e.x}" cy="${e.y}" r="12"/><text x="${e.x}" y="${e.y+4}" text-anchor="middle">${e.id}</text></g>`).join('')}<g class="position-player"><circle cx="${p.player.x}" cy="${p.player.y}" r="14"/><path d="M${p.player.x} ${p.player.y}L${p.player.x+ux*23} ${p.player.y+uy*23}"/></g><circle class="position-aim-knob" cx="${p.player.x+ux*70}" cy="${p.player.y+uy*70}" r="19"/><text class="position-rotate-symbol" x="${p.player.x+ux*70}" y="${p.player.y+uy*70+5}" text-anchor="middle">↻</text>`;const status=$('position-status');if(status)status.textContent=`${predicted.size} of ${p.enemies.length} targets inside your ${p.mode==='line'?'line':'cone'} · ${p.last||'Drag yourself, drag the aiming handle, or change the targets.'}`}
function positionStudio(){const p=positionSandbox;if(!positionIntroSeen)return `<h2>Positioning Lab</h2><section class="card position-intro"><h2>How to use Positioning Lab</h2><p>Drag the blue character or any red enemy to rearrange the battlefield.</p><p>Drag the circular ↻ aiming handle to rotate the cone or line. You can also press <strong>←</strong> and <strong>→</strong> to turn it.</p><p>Change the target count, attack shape, reach, and spread. Press Attack to see which targets are covered.</p><p class="hint">This is a practice diagram, not a precise in-game hitbox simulator.</p><button type="button" class="primary" data-act="pos-begin">Start positioning</button></section>`;return `<h2>Positioning Lab</h2><p class="muted">Drag targets and your character, rotate your attack with ← / → or the ↻ handle, and test your coverage. Illustrative geometry, not exact in-game hitboxes.</p><div class="position-layout"><section class="card position-stage"><svg id="position-arena" class="position-arena" tabindex="0" viewBox="0 0 560 380" aria-label="Drag the blue character or any red target. Rotate the cone or line using the aiming handle or left and right arrow keys."></svg><p id="position-status" class="hint" aria-live="polite"></p><div class="button-row"><button class="primary" data-act="pos-fire" id="position-attack">Attack</button><button data-act="pos-random">Randomize targets</button><button data-act="pos-reset">Restore eliminated</button><button data-act="pos-help">How to use</button></div></section><section class="card position-tools"><h3>Build your scenario</h3><p class="hint">Drag blue to move yourself; drag any red target to reposition it. Grab ↻ to rotate, or press ← / →. All pieces remain draggable without changing tools.</p><label>Target count <input id="pos-count" type="number" min="1" max="15" value="${p.enemies.length}"></label><label>Attack shape<select id="pos-shape"><option value="cone" ${p.mode==='cone'?'selected':''}>Cone</option><option value="line" ${p.mode==='line'?'selected':''}>Line</option></select></label><label>Direction <output id="pos-angle-value">${p.angle}°</output><input id="pos-angle" type="range" min="-180" max="180" value="${p.angle}"></label><label>Reach <output id="pos-range-value">${p.range}</output><input id="pos-range" type="range" min="70" max="420" value="${p.range}"></label><label>${p.mode==='cone'?'Cone spread':'Line width'} <output id="pos-width-value">${p.mode==='cone'?p.spread+'°':p.lineWidth}</output><input id="pos-width" type="range" min="10" max="${p.mode==='cone'?120:90}" value="${p.mode==='cone'?p.spread:p.lineWidth}"></label><p class="hint">Attacking temporarily eliminates targets reached by the attack shape.</p></section></div>`}

const agPosition={enemies:[],fields:[],player:{x:64,y:204},aim:0,angle:0,last:'',hits:[],lineHits:[],heavyHits:[],fieldHits:[],width:24,line:true,heavy:true,touchTool:'field'};
function agPositionRandom(){const p=agPosition;p.enemies=Array.from({length:3+Math.floor(Math.random()*10)},(_,i)=>({id:i+1,x:135+Math.random()*375,y:40+Math.random()*300}));p.fields=[];p.hits=[];p.lineHits=[];p.heavyHits=[];p.fieldHits=[];p.aim=p.enemies[0]?.id||0;p.angle=0;p.last='New enemy layout';}
agPositionRandom();
function agPositionGeom(){const p=agPosition,center=p.enemies.find(e=>e.id===p.aim)||p.enemies[0]||{x:300,y:190};const theta=Math.atan2(center.y-p.player.y,center.x-p.player.x)+p.angle*Math.PI/180;return {center,ux:Math.cos(theta),uy:Math.sin(theta),range:570};}
function agFieldGroups(){const f=agPosition.fields,visited=new Set(),groups=[];for(let i=0;i<f.length;i++){if(visited.has(i))continue;const group=[],todo=[i];visited.add(i);while(todo.length){const j=todo.pop();group.push(j);for(let k=0;k<f.length;k++)if(!visited.has(k)&&Math.hypot(f[j].x-f[k].x,f[j].y-f[k].y)<=f[j].r+f[k].r){visited.add(k);todo.push(k)}}groups.push(group)}return groups;}
function agPositionView(){const p=agPosition;return `<h2>Arsenal Gunner · Field & Firing Lane Lab</h2><p class="muted">Drag the blue player and red targets. Tap an orange field location or select a purple Heavy Artillery target.</p><div class="position-layout"><section class="card position-stage"><div class="position-touch-tools" role="group" aria-label="Choose battlefield touch action"><button type="button" data-act="ag-tool:field" class="ag-tool-field ${p.touchTool==='field'?'selected':''}" aria-pressed="${p.touchTool==='field'}">◉ Detonation Field <small>Tap to place</small></button><button type="button" data-act="ag-tool:artillery" class="ag-tool-artillery ${p.touchTool==='artillery'?'selected':''}" aria-pressed="${p.touchTool==='artillery'}">◎ Heavy Artillery <small>Tap a target</small></button></div><svg id="ag-position-arena" class="position-arena" viewBox="0 0 560 380" aria-label="Drag blue player and red enemies. Choose orange Detonation Field to place fields or purple Heavy Artillery to target enemies."></svg><p class="hint" id="ag-position-status" aria-live="polite"></p><div class="button-row"><button class="primary" data-act="ag-fire">Commit selected attacks</button><button data-act="ag-random">Randomize enemies</button><button data-act="ag-clear">Clear fields</button></div></section><section class="card position-tools"><h3>Firing setup</h3><p class="hint">Drag to position. Use orange Detonation Field to tap a placement point, or purple Heavy Artillery to tap an enemy. Both attack areas may overlap.</p><label><input id="ag-position-line" type="checkbox" ${p.line?'checked':''}> Line attack</label><label><input id="ag-position-heavy" type="checkbox" ${p.heavy?'checked':''}> Heavy Artillery (target-centered)</label><label>Firing lane width <input id="ag-position-width" type="range" min="10" max="64" value="${p.width}"></label><label>Line angle offset <output id="ag-position-angle-value">${p.angle}°</output><input id="ag-position-angle" type="range" min="-180" max="180" value="${p.angle}"></label><p class="hint">Connected fields explode together.</p></section></div>`}
function agPositionPaint(){const svg=$('ag-position-arena');if(!svg)return;const p=agPosition,{center,ux,uy,range}=agPositionGeom(),nx=-uy,ny=ux,h=p.width/2;const x=p.player.x,y=p.player.y;const v=[`${x+nx*h},${y+ny*h}`,`${x+ux*range+nx*h},${y+uy*range+ny*h}`,`${x+ux*range-nx*h},${y+uy*range-ny*h}`,`${x-nx*h},${y-ny*h}`].join(' ');const overlap=e=>p.fields.some(f=>Math.hypot(e.x-f.x,e.y-f.y)<=f.r+10);const groups=agFieldGroups();svg.innerHTML=`<rect width="560" height="380" fill="#132133"/><g stroke="#263e50" stroke-width=".6">${Array.from({length:13},(_,i)=>`<path d="M${i*45} 0V380"/>`).join('')}${Array.from({length:9},(_,i)=>`<path d="M0 ${i*45}H560"/>`).join('')}</g>${p.fields.map((f,i)=>`<circle cx="${f.x}" cy="${f.y}" r="${f.r}" fill="#f29c42" fill-opacity=".13" stroke="#ffaf4b" stroke-width="2.5" stroke-dasharray="6 4"/><text x="${f.x}" y="${f.y-5}" text-anchor="middle" fill="#ffe5b8" font-size="11" pointer-events="none">${i+1}</text>`).join('')}${p.line?`<polygon points="${v}" fill="#7cd7fa" fill-opacity=".13" stroke="#7cd7fa" pointer-events="none"/>`:''}${p.heavy?`<circle cx="${center.x}" cy="${center.y}" r="72" fill="#bc9bff" fill-opacity=".12" stroke="#d2b2ff" stroke-width="3" pointer-events="none"/>`:''}${p.enemies.map(e=>`<g data-ag-enemy="${e.id}" style="cursor:grab;touch-action:none"><circle cx="${e.x}" cy="${e.y}" r="13" fill="${p.hits.includes(e.id)?'#289e7f':overlap(e)?'#c68841':'#b04f5e'}" stroke="${e.id===p.aim?'#d0f8ff':'#d3a7ac'}" stroke-width="2"/><text x="${e.x}" y="${e.y+4}" text-anchor="middle" fill="white" font-size="11" pointer-events="none">${e.id}</text></g>`).join('')}<g data-ag-player="1" style="cursor:grab;touch-action:none"><circle cx="${x}" cy="${y}" r="14" fill="#62acda" stroke="#d0efff" stroke-width="2"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="12" fill="white" pointer-events="none">AG</text></g>`;const status=$('ag-position-status');if(status)status.textContent=`${p.fields.length}/5 fields · ${groups.length} connected group${groups.length===1?'':'s'} · ${p.hits.length} unique enemy hit${p.hits.length===1?'':'s'} · ${p.last||'Click to place a field; drag characters to move them.'}`}
function agPositionFire(){const p=agPosition,{center,ux,uy,range}=agPositionGeom(),x=p.player.x,y=p.player.y;const along=e=>(e.x-x)*ux+(e.y-y)*uy;const cross=e=>Math.abs(-(e.x-x)*uy+(e.y-y)*ux);const lineTouches=(e,r=0)=>p.line&&along(e)>=-r&&along(e)<=range+r&&cross(e)<=p.width/2+r;const heavyTouches=(e,r=0)=>p.heavy&&Math.hypot(e.x-center.x,e.y-center.y)<=72+r;const baseLine=p.enemies.filter(e=>lineTouches(e,10)).map(e=>e.id),baseHeavy=p.enemies.filter(e=>heavyTouches(e,10)).map(e=>e.id);const triggered=new Set();for(let i=0;i<p.fields.length;i++){const f=p.fields[i];if(lineTouches(f,f.r)||heavyTouches(f,f.r))triggered.add(i)}const linked=new Set();for(const group of agFieldGroups())if(group.some(i=>triggered.has(i)))for(const i of group)linked.add(i);const fieldHits=p.enemies.filter(e=>[...linked].some(i=>{const f=p.fields[i];return Math.hypot(e.x-f.x,e.y-f.y)<=f.r+10})).map(e=>e.id);p.lineHits=baseLine;p.heavyHits=baseHeavy;p.fieldHits=fieldHits;p.hits=[...new Set([...baseLine,...baseHeavy,...fieldHits])];p.last=`Committed ${[p.line?'line':'',p.heavy?'Heavy Artillery':''].filter(Boolean).join(' + ')||'no attack'}: ${p.hits.length} unique enemies hit (${baseLine.length} line, ${baseHeavy.length} Heavy Artillery, ${fieldHits.length} linked-field coverage).`;agPositionPaint()}
function bindAgPosition(){const svg=$('ag-position-arena');if(!svg)return;const p=agPosition;for(const [id,key] of [['ag-position-line','line'],['ag-position-heavy','heavy']])$(id)?.addEventListener('change',e=>{p[key]=e.target.checked;p.hits=[];agPositionPaint()});$('ag-position-width')?.addEventListener('input',e=>{p.width=Number(e.target.value);p.hits=[];agPositionPaint()});$('ag-position-angle')?.addEventListener('input',e=>{p.angle=Number(e.target.value);$('ag-position-angle-value').textContent=p.angle+'°';p.hits=[];agPositionPaint()});function coord(ev){const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const m=svg.getScreenCTM();return m?pt.matrixTransform(m.inverse()):{x:0,y:0}}let gesture=null;svg.addEventListener('pointerdown',ev=>{const pt=coord(ev),node=ev.target.closest('[data-ag-enemy]'),en=node&&p.enemies.find(e=>e.id===Number(node.dataset.agEnemy));const player=ev.target.closest('[data-ag-player]');gesture={id:ev.pointerId,kind:player?'player':en?'enemy':'field',enemy:en?.id,start:pt,last:pt,moved:false};svg.setPointerCapture(ev.pointerId)});svg.addEventListener('pointermove',ev=>{if(!gesture||gesture.id!==ev.pointerId)return;const pt=coord(ev);gesture.last=pt;if(Math.hypot(pt.x-gesture.start.x,pt.y-gesture.start.y)>5)gesture.moved=true;if(gesture.kind==='player'&&gesture.moved){p.player.x=posClamp(pt.x,14,546);p.player.y=posClamp(pt.y,14,366);p.hits=[];agPositionPaint()}else if(gesture.kind==='enemy'&&gesture.moved){const en=p.enemies.find(e=>e.id===gesture.enemy);if(en){en.x=posClamp(pt.x,14,546);en.y=posClamp(pt.y,14,366);p.hits=[];agPositionPaint()}}});function finish(ev){if(!gesture||gesture.id!==ev.pointerId)return;const g=gesture;gesture=null;if(ev.type==='pointercancel')return;if(g.kind==='field'&&!g.moved&&p.touchTool==='field'){p.fields.push({x:posClamp(g.last.x,0,560),y:posClamp(g.last.y,0,380),r:94});if(p.fields.length>5)p.fields.shift();p.last='Placed Detonation Field · '+p.fields.length+'/5';p.hits=[];agPositionPaint()}else if(g.kind==='enemy'&&!g.moved){if(p.touchTool==='field'){p.fields.push({x:posClamp(g.last.x,0,560),y:posClamp(g.last.y,0,380),r:94});if(p.fields.length>5)p.fields.shift();p.last='Placed Detonation Field · '+p.fields.length+'/5'}else{p.aim=g.enemy;p.last='Heavy Artillery aimed at enemy '+g.enemy}p.hits=[];agPositionPaint()}}svg.addEventListener('pointerup',finish);svg.addEventListener('pointercancel',finish);agPositionPaint()}
function referencePage(){const key=state.arcana,ref=window.MIDIR_ROTATION_REFERENCE[key]||{name:key,summary:'More skills coming soon.',skills:[]};const pages=[...(key==='ag'?[`<button class="rotation-shortcut" data-act="hub:special"><strong>Special Upgrade</strong><span>Upgrade weapons to step 8.</span></button>`]:[]),`<button class="rotation-shortcut" data-act="hub:craft"><strong>Rotation Crafter</strong><span>Build your rotation. Find your rhythm.</span></button>`];if(key==='ek')pages.push(`<button class="rotation-shortcut" data-act="hub:pig"><strong>Pig Pursuit</strong><span>Chase carrots. Keep your balance.</span></button>`);if(key==='ag')pages.push(`<button class="rotation-shortcut" data-act="hub:ag-position"><strong>Field & Firing Lane Lab</strong><span>Set the field. Line up your shot.</span></button>`);if(key==='as')pages.push(`<button class="rotation-shortcut" data-act="hub:as-invaders"><strong>Crom Bás Invaders</strong><span>Fight 50 waves. Collect Dark Erg.</span></button>`);if(key==='as')pages.push(`<button class="rotation-shortcut" data-act="hub:position"><strong>Positioning Lab</strong><span>Line up your best shot.</span></button>`);if(key==='sg')pages.push(`<button class="rotation-shortcut" data-act="hub:oath"><strong>Oath Workshop</strong><span>Prepare your Oath, your way.</span></button>`);if(key==='dd')pages.push(`<button class="rotation-shortcut" data-act="hub:theta"><strong>Subject Theta: Containment</strong><span>First-person Dark Diviner rhythm training.</span></button>`);if(key==='hs')pages.push(`<button class="rotation-shortcut" data-act="hub:music-lie"><strong>Rate isn't a Lie</strong><span>Music Buff Effect Calculator and the playful performance simulator on one page. Performance supports desktop keys and mobile touch controls.</span></button>`);if(key==='bb')pages.push(`<button class="rotation-shortcut" data-act="hub:bb-bandit"><strong>Bandit Hunt</strong><span>Catch the bandits. Keep up!</span></button>`);if(key==='mp')pages.push(`<button class="rotation-shortcut" data-act="hub:rhythm"><strong>Cutting Chorus Rhythm</strong><span>Independent aim-and-trigger timing drill: mouse and keyboard on PC, separate touch aiming and skill buttons on mobile.</span></button>`);if(key==='mp')pages.push(`<button class="rotation-shortcut" data-act="hub:erg"><strong>Erg Break Simulator</strong><span>Tap the divine mineral, advance B → A → S, and build a weapon collection.</span></button>`);if(key==='fa')pages.push(`<button class="rotation-shortcut" data-act="hub:herbs"><strong>Herb Collection</strong><span>Gather herbs at your own pace, or try Precision Harvest with disappearing targets and personal bests.</span></button>`);if(key==='ev')pages.push(`<button class="rotation-shortcut" data-act="hub:reforge"><strong>Reforge Simulator</strong><span>Still looking for that 7/5 Cooldown hat?</span></button>`);return `<h2>${esc(ref.name)} · Arcana Simulators</h2><p class="muted">${esc(ref.summary)}</p><h3>Available pages</h3><div class="rotation-shortcuts">${pages.join('')}</div><section class="card"><h2>Skill Knowledge</h2><p class="hint">Learn how skills contribute to resource cycles, movement, timing and damage windows. Skills and equipment interactions are described together.</p><div class="rotation-skill-grid">${ref.skills.map(([name,role,detail,evidence])=>{const fromData=window.MIDIR_DATA?.arcana?.[key]?.skills?.find(s=>s.name===name);const icon=window.MIDIR_ROTATION_ICONS?.[name]||(fromData&&window.MIDIR_ICONS?.skills?.[fromData.id]);return `<article class="rotation-skill-card">${icon?`<img class="midir-skill-icon" alt="" src="${esc(icon)}">`:''}<div><h3>${esc(name)}</h3><small class="gold">${esc(role)}</small><p>${esc(detail)}</p></div></article>`}).join('')}</div></section>`}
// Companion 96: Arcana Simulators is the single Arcana selection point.
const rotationReferenceWithoutPicker=referencePage;
const rotationArcanaOptions='<option value="as">Alchemic Sharpshooter</option><option value="dd">Dark Diviner</option><option value="ek">Elemental Knight</option><option value="hs">Harmonic Saint</option><option value="sg">Sacred Guardian</option><option value="ev">Explosive Vanguard</option><option value="ag">Arsenal Gunner</option><option value="fa">Forbidden Alchemist</option><option value="mp">Melodic Puppeteer</option><option value="bb">Blazing Brawler</option>';
referencePage=function(){
  const choices=rotationArcanaOptions.replace(/<option value="([^"]+)">([^<]*)<\/option>/g,(_,value,label)=>`<option value="${esc(value)}" ${value===state.arcana?'selected':''}>${esc(label)}</option>`);
  return `<div class="rotation-arcana-picker"><label for="rotation-lab-arcana"><strong>Choose your Arcana</strong></label><select id="rotation-lab-arcana" aria-label="Choose Arcana Simulators Arcana">${choices}</select></div>`+rotationReferenceWithoutPicker();
};
document.addEventListener('change',event=>{
  if(event.target?.id!=='rotation-lab-arcana'||state.page!=='rotation')return;
  const next=event.target.value;
  if(!/^(as|dd|ek|hs|sg|ev|ag|fa|mp|bb)$/.test(next)||next===state.arcana)return;
  stopTimers();
  if(typeof craftEnd==='function'&&typeof craftSession!=='undefined'&&craftSession)craftEnd();
  state.arcana=next;
  state.arcanaVisits=state.arcanaVisits||{};state.arcanaVisits[next]=Date.now();
  rotationView='reference';
  save();
  render();
});
function rotationHub(){if(rotationView==='reference')return referencePage();const back=`<div class="rotation-back"><button data-act="hub:home">← Return to the Arcana Simulators</button></div>`;if(rotationView==='position'&&state.arcana==='as')return back+positionStudio();if(rotationView==='ag-position'&&state.arcana==='ag')return back+agPositionView();if(rotationView==='craft')return back+craftView();if(rotationView==='music-lie'&&state.arcana==='hs')return back+musicBuffLabView();if(rotationView==='music-calc'&&state.arcana==='hs')return back+`<h2>Harmonic Saint · Music Buff Effect Calculator</h2><p class="muted">Enter your current music stats and skill-specific reforges. Results update and save without needing a keyboard-driven performance session.</p><div class="music-lab music-mobile-calculator"><div class="music-calculator-body">${musicBuffSections()}${musicSpecificFieldPanel()}${musicBuffResultPanel()}</div></div>`;if(rotationView==='special'&&state.arcana==='ag')return back+window.MIDIR_SPECIAL_UPGRADE.view();if(rotationView==='reforge'&&state.arcana==='ev')return back+window.MIDIR_REFORGE.view();if(rotationView==='rhythm'&&state.arcana==='mp')return back+window.MIDIR_MP_RHYTHM.view();if(rotationView==='erg'&&state.arcana==='mp')return back+window.MIDIR_ERG.view();if(rotationView==='herbs'&&state.arcana==='fa')return back+window.MIDIR_HERBS.view();if(rotationView==='pig'&&state.arcana==='ek')return back+window.MIDIR_PIG.view();if(rotationView==='bb-bandit'&&state.arcana==='bb')return back+window.MIDIR_BB.view();if(rotationView==='oath'&&state.arcana==='sg')return back+`<h2>Sacred Guardian · Oath Workshop</h2><p class="muted">Prepare your buffs. Perfect your Oath.</p><section class="card">${sgWorkshop()}</section>`;if(rotationView==='theta'&&state.arcana==='dd')return back+dd();if(rotationView==='drill')return back+rotationOriginal();return back+rotationOriginal()}
rotation=rotationHub;
let lastHubArcana=state.arcana;
const hubPreviousRender=render;render=function(){if(lastHubArcana!==state.arcana){rotationView='reference';lastHubArcana=state.arcana}hubPreviousRender();if(state.page==='rotation'&&rotationView==='position')posPaint();if(state.page==='rotation'&&rotationView==='ag-position')agPositionPaint();if(state.page==='rotation'&&rotationView==='special')window.MIDIR_SPECIAL_UPGRADE.render();if(state.page==='rotation'&&rotationView==='reforge')window.MIDIR_REFORGE.render();if(state.page==='rotation'&&rotationView==='erg')window.MIDIR_ERG.render()};
action=function(s){if(s.startsWith('hub:')){const visit=s.slice(4);if(visit!=='home'&&visit!=='reference'){state.minigameVisits=state.minigameVisits||{};const key=state.arcana+':'+visit;if(!state.minigameVisits[key]){state.minigameVisits[key]=Date.now();save();}}if(typeof musicBuffSession!=='undefined'&&musicBuffSession)musicBuffEnd();rotationView=s.slice(4)==='home'?'reference':s.slice(4)==='dd-drill'?'theta':s.slice(4);stopTimers();return render()}if(s.startsWith('ag-tool:')){agPosition.touchTool=s.slice(8)==='artillery'?'artillery':'field';agPosition.last=agPosition.touchTool==='field'?'Tap the arena to place an orange Detonation Field.':'Tap a red enemy to center purple Heavy Artillery.';return render()}if(s==='ag-random'){agPositionRandom();return render()}if(s==='ag-clear'){agPosition.fields=[];agPosition.last='Fields cleared';agPositionPaint();return}if(s==='ag-fire'){agPositionFire();return}if(s==='pos-begin'){positionIntroSeen=true;return render()}if(s==='pos-help'){positionIntroSeen=false;return render()}if(s==='pos-random'){randomizeSandbox();return render()}if(s==='pos-reset'){positionSandbox.eliminated.clear();positionSandbox.last='All targets restored';return posPaint()}if(s==='pos-fire'){const p=positionSandbox;if(p.busy)return;p.busy=true;p.eliminated=new Set(posHits());p.last=`Eliminated ${p.eliminated.size} target${p.eliminated.size===1?'':'s'}! Move or adjust your next attack.`;posPaint();$('position-arena')?.classList.add('position-fired');setTimeout(()=>{p.busy=false;$('position-arena')?.classList.remove('position-fired')},700);return}return rotationActionOriginal(s)};
let dragPosition=null;
function bindPositionEvents(){const svg=$('position-arena');if(!svg)return;const p=positionSandbox;let activePointer=null;for(const [id,key] of [['pos-shape','mode']])$(id)?.addEventListener('change',e=>{p[key]=e.target.value;render()});$('pos-count')?.addEventListener('change',e=>{const num=posClamp(Math.round(Number(e.target.value)||1),1,15);while(p.enemies.length<num)p.enemies.push({id:1+Math.max(0,...p.enemies.map(x=>x.id)),x:140+Math.random()*380,y:30+Math.random()*310});p.enemies=p.enemies.slice(0,num);p.eliminated.clear();render()});for(const [id,key] of [['pos-angle','angle'],['pos-range','range'],['pos-width',p.mode==='cone'?'spread':'lineWidth']])$(id)?.addEventListener('input',e=>{p[key]=Number(e.target.value);const out=$(id+'-value');if(out)out.textContent=p[key]+(key==='angle'||key==='spread'?'°':'');p.eliminated.clear();posPaint()});function coords(ev){const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const m=svg.getScreenCTM();return m?pt.matrixTransform(m.inverse()):{x:0,y:0}}function update(ev){const c=coords(ev);if(dragPosition==='player'){p.player.x=posClamp(c.x,12,548);p.player.y=posClamp(c.y,12,368)}else if(dragPosition==='aim'){p.angle=Math.round(Math.atan2(c.y-p.player.y,c.x-p.player.x)*180/Math.PI);if($('pos-angle'))$('pos-angle').value=p.angle;if($('pos-angle-value'))$('pos-angle-value').textContent=p.angle+'°'}else if(typeof dragPosition==='number'){const en=p.enemies.find(e=>e.id===dragPosition);if(en){en.x=posClamp(c.x,12,548);en.y=posClamp(c.y,12,368)}}p.eliminated.clear();posPaint()}
svg.addEventListener('pointerdown',ev=>{const node=ev.target.closest('[data-enemy]');const aim=ev.target.closest('.position-aim-knob,.position-rotate-symbol');const player=ev.target.closest('.position-player');if(!aim&&!player&&!node)return;if(activePointer!==null)return;activePointer=ev.pointerId;dragPosition=aim?'aim':player?'player':Number(node.dataset.enemy);svg.setPointerCapture(ev.pointerId);update(ev)});svg.addEventListener('pointermove',ev=>{if(dragPosition!==null&&ev.pointerId===activePointer)update(ev)});const end=ev=>{if(ev.pointerId!==activePointer)return;dragPosition=null;activePointer=null};svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end)}
bind=function(){rotationBindOriginal();if(state.page==='rotation'&&rotationView==='position')bindPositionEvents();if(state.page==='rotation'&&rotationView==='ag-position')bindAgPosition()};

// Companion-40: generic Rotation Crafter for every Arcana, with per-skill editing and custom stage visuals.
const craftKeys=['1','2','3','4','5','6','7','8','9','0','-','=','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'];
state.settings.craftDuration=Number(state.settings.craftDuration||state.settings.asDuration||60);
if(!state.crafterProfiles||typeof state.crafterProfiles!=='object')state.crafterProfiles={};
if(!state.crafterProfiles.as)state.crafterProfiles.as={slots:{...(state.crafterSlots||{})},sequence:[...(state.crafterSequence||[])],skillSettings:{...(state.asSkillSettings||{})},secondary:{...(state.crafterSecondary||{})}};
let craftDrawer=false,craftSelected=null,craftSession=null,craftCharge=null;
const craftElements=['fire','water','wind','earth'],craftOrbMax=100,craftOrbLabels={fire:'Fire',water:'Water',wind:'Wind',earth:'Earth'};
const craftOrbGains={plume:{primary:'fire',main:36,secondary:18},volley:{primary:'water',main:52,secondary:26},terra:{primary:'earth',main:100,secondary:62},ventus:{primary:'wind',main:78,secondary:39}};
// FA uses the same visual orb gauge, with practice-only elemental accumulation.
// These increments are illustrative, not verified live-game orb generation coefficients.
const craftFaOrbGains={watercannon:{water:20},flameburst:{fire:20},windblast:{wind:20},sandburst:{earth:20},hydra:{earth:20},fangs:{earth:25}};
const craftSecondaryDefaults={plume:'water',volley:'fire',terra:'wind',ventus:'earth'};
const CRAFT_DEFS={
 as:{name:'Alchemic Sharpshooter',scene:'archer',target:'archery target',charged:['volley'],skills:[
  {id:'magnum',name:'Magnum Shot',cd:0,lock:.65,shape:'instant',note:'No cooldown; filler and animation-cancel weave'},
  {id:'urgent',name:'Urgent Shot',cd:10,lock:1,shape:'instant',note:'Cooldown can be adjusted for Erg or other setup'},
  {id:'plume',name:'Ignis Plume',cd:6,lock:2,shape:'circle',note:'Fire +36%; optional second orb +18%'},
  {id:'volley',name:'Aqua Volley',cd:10,lock:2.8,shape:'charged cone',note:'Water +52%; optional second orb +26%',charge:900},
  {id:'tri',name:'Tri-Assault',cd:36,lock:2,shape:'3-shot line',note:'Requires full Fire and Water orbs; fires 3 shots from one keypress'},
  {id:'golden',name:'Golden Time',cd:162,lock:.5,shape:'self',note:'Refills all four orbs'},
  {id:'terra',name:'Terra Scourge',cd:24,lock:2,shape:'circle',note:'Earth +100%; optional second orb +62%'},
  {id:'ventus',name:'Ventus Howl',cd:10,lock:2,shape:'cone',note:'Wind +78%; optional second orb +39%'},
  {id:'crash',name:'Crash Shot',cd:18,lock:1.2,shape:'burst',note:'Bow area utility; included for completeness'},
  {id:'mirage',name:'Mirage Missile',cd:20,lock:1.1,shape:'single',note:'Damage-over-time utility bow skill'},
  {id:'arrowrevolver',name:'Arrow Revolver',cd:0,lock:.9,shape:'sequence',note:'Bow base skill for repeated shots'},
  {id:'finalshot',name:'Final Shot',cd:300,lock:.4,shape:'self',note:'Long-cooldown bow stance / burst window'},
  {id:'supportshot',name:'Support Shot',cd:15,lock:.8,shape:'single',note:'Included because many players still want it available on the bar'}]},
 ek:{name:'Elemental Knight',scene:'dual',target:'strawman',skills:[
  {id:'bash',name:'Bash',cd:0,lock:.25,shape:'melee',note:'Generate 1 stack per successful hit, 2 while dual-wielding; retain stacks for base-skill amplification.'},
  {id:'rageimpact',name:'Rage Impact',cd:10,lock:.35,shape:'aoe',note:'Melee damage amplification window; two-handed spirit can reset cooldown.'},
  {id:'smash',name:'Smash',cd:0,lock:.8,shape:'melee',note:'Basic close-combat burst hit'},
  {id:'assault',name:'Assault Slash',cd:5,lock:.9,shape:'dash',note:'Gap-closing slash'},
  {id:'windmill',name:'Windmill',cd:8,lock:1.2,shape:'aoe',note:'Base melee area strike'},
  {id:'counter',name:'Counterattack',cd:0,lock:.4,shape:'guard',note:'Counter stance utility'},
  {id:'charge',name:'Charge',cd:12,lock:.9,shape:'dash',note:'Fast engagement tool'},
  {id:'instill',name:'Instill Elements',cd:20,lock:.4,shape:'self',note:'Prepare the desired element'},
  {id:'dauntless',name:'Dauntless Defense',cd:10,lock:.5,shape:'self',note:'Defensive timing tool'},
  {id:'dynavolt',name:'Dynavolt Smash',cd:10,lock:.9,shape:'melee',note:'Arcana strike'},
  {id:'shattering',name:'Shattering Windmill',cd:10,lock:1.2,shape:'aoe',note:'Arcana area control'},
  {id:'blazingassault',name:'Blazing Assault Slash',cd:7,lock:1,shape:'dash',note:'Arcana engagement attack'},
  {id:'flashing',name:'Flashing Steel',cd:7,lock:1.1,shape:'aoe',note:'Arcana finishing slash'}]},
 dd:{name:'Dark Diviner',scene:'mage',target:'archery target',skills:[
  {id:'thunder',name:'Thunder',cd:0,lock:2,shape:'cast',note:'Baseline repeated spell'},
  {id:'blight',name:'Thunderblight',cd:17,lock:.4,shape:'instant',note:'Rhythm-setting upkeep skill'},
  {id:'flare',name:'Shadow Flare',cd:10,lock:1,shape:'line',note:'Short-cooldown insertion'},
  {id:'seething',name:'Seething Mana',cd:0,lock:.4,shape:'self',note:'Dorcha conversion utility'},
  {id:'render',name:'Render Dorcha',cd:10,lock:.5,shape:'self',note:'Generate Dorcha'},
  {id:'surge',name:'Twilight Surge',cd:36,lock:1,shape:'circle',note:'Major burst window'},
  {id:'mana',name:'Render Mana',cd:30,lock:.5,shape:'self',note:'Support the next Dorcha cycle'},
  {id:'hex',name:'Hexshroud',cd:24,lock:.4,shape:'self',note:'Defensive / utility timing'},
  {id:'vortex',name:'Polar Vortex',cd:18,lock:1.2,shape:'aoe',note:'Area-control option'},
  {id:'fireball',name:'Fireball',cd:0,lock:2.4,shape:'cast',note:'Base staff magic'},
  {id:'icespear',name:'Ice Spear',cd:0,lock:2.2,shape:'cast',note:'Base staff magic'},
  {id:'meteor',name:'Meteor Strike',cd:180,lock:2.5,shape:'circle',note:'Major base-magic cooldown'}]},
 mp:{name:'Melodic Puppeteer',scene:'puppet',target:'strawman',skills:[
  {id:'wirepull',name:'Wire Pull',cd:3,lock:.6,shape:'pull',note:'Control-bars positioning tool'},
  {id:'act6',name:'Act 6: Crisis',cd:22,lock:1,shape:'aoe',note:'Puppet grouping / utility'},
  {id:'act2',name:'Act 2: Threshold Cutter',cd:7,lock:.8,shape:'line',note:'Base control-bar attack'},
  {id:'act7',name:'Act 7: Climactic Crash',cd:17,lock:1.2,charge:1000,shape:'aoe',note:'Puppet burst strike'},
  {id:'act4',name:'Act 4: Rising Action',cd:7,lock:1,shape:'line',note:'Base control-bar combo tool'},
  {id:'deathmark',name:'Death Mark',cd:20,lock:.7,shape:'single',note:'Debuff support still matters on the bar'},
  {id:'chorus',name:'Cutting Chorus',cd:4,lock:.8,shape:'line',note:'Arcana weave skill'},
  {id:'downbeat',name:'Downbeat Drop',cd:4,lock:1,shape:'aoe',note:'Arcana pressure tool'},
  {id:'tempo',name:'Relentless Tempo',cd:10,lock:.6,shape:'self',note:'Tempo / preparation skill'},
  {id:'showstopper',name:'Showstopper',cd:45,lock:1.2,shape:'aoe',note:'Arcana commitment skill'},
  {id:'livewire',name:'Live Wire',cd:10,lock:.9,shape:'line',note:'Arcana finisher / control'}]},
 sg:{name:'Sacred Guardian',scene:'guardian',target:'strawman',skills:[
  {id:'bash',name:'Bash',cd:0,lock:.7,shape:'melee',note:'Basic weapon strike'},
  {id:'defense',name:'Defense',cd:0,lock:.3,shape:'guard',note:'Base defensive stance'},
  {id:'counter',name:'Counterattack',cd:0,lock:.3,shape:'guard',note:'Counter tool'},
  {id:'charge',name:'Charge',cd:12,lock:.8,shape:'dash',note:'Mobility / engage'},
  {id:'pledge',name:'Pledge of Penance',cd:40,lock:.5,shape:'self',note:'Arcana sustain / offense'},
  {id:'provoke',name:'Provoke',cd:20,lock:.5,shape:'aoe',note:'Threat control utility'},
  {id:'ardent',name:'Ardent Advance',cd:3,lock:.8,shape:'dash',note:'Arcana advance tool'},
  {id:'rend',name:'Rend Armor',cd:7,lock:.7,shape:'single',note:'Party contribution tool'},
  {id:'zealous',name:'Zealous Conviction',cd:1.5,lock:.6,shape:'melee',note:'Three stages: 0 / 1 / 2 Virtue; third stage loops back to stage one'},
  {id:'judgment',name:'Deliver Judgment',cd:9,lock:1,shape:'melee',note:'Commit into a good opening'},
  {id:'retribution',name:'Divine Retribution',cd:30,lock:1.2,shape:'melee',note:'Major shield-led burst'},
  {id:'oath',name:'Virtuous Oath',cd:60,lock:.5,shape:'self',note:'Snapshot / defensive timing'}]},
 ag:{name:'Arsenal Gunner',scene:'guns',target:'archery target',skills:[
  {id:'rush',name:'Shooting Rush',cd:8,lock:.8,shape:'dash',note:'Base dual-gun movement attack'},
  {id:'grapple',name:'Grapple Shot',cd:14,lock:.8,shape:'single',note:'Base control shot'},
  {id:'way',name:'Way of the Gun',cd:30,lock:.5,shape:'self',note:'Dual-gun self-buff'},
  {id:'storm',name:'Bullet Storm',cd:12,lock:1,shape:'aoe',note:'Base firing barrage'},
  {id:'reload',name:'Reload',cd:0,lock:.4,shape:'self',note:'Base weapon maintenance'},
  {id:'barrage',name:'Bullet Barrage',cd:9,lock:.5,charge:3000,shape:'charged line',note:'Hold to fire for 0.5–3 seconds. Generates 60–300 Transmutation Energy, with 1–9 seconds cooldown based on duration.'},
  {id:'artillery',name:'Heavy Artillery',cd:11,lock:1.1,shape:'circle',note:'Generates 100 Transmutation Energy on use.'},
  {id:'tracer',name:'Tracer Pod',cd:14,lock:.8,shape:'single',note:'Arcana setup tool'},
  {id:'detonation',name:'Detonation Field',cd:20,lock:1,shape:'aoe',note:'Arcana area control'},
  {id:'crest',name:'Gunner\'s Crest',cd:3,lock:.5,shape:'self',note:'Arcana enhancement'},
  {id:'fatal',name:'Fatal Scope',cd:30,lock:.8,charge:2000,shape:'single',note:'Hold to aim. Normally 50% per second, or 100% per second against targets marked by Tracer Pod or inside Detonation Field. Full aim allows re-aim follow-up shots at one full Energy Bullet each.'},
  {id:'calamity',name:'Calamity Cannon',cd:10,lock:1.3,shape:'line',note:'Generates 100 Transmutation Energy on use.'}]},
 bb:{name:'Blazing Brawler',scene:'brawler',target:'strawman',skills:[
  {id:'chargingstrike',name:'Charging Strike',cd:12,lock:.8,shape:'dash',note:'Base knuckle engage'},
  {id:'uppercut',name:'Spinning Uppercut',cd:12,lock:.9,shape:'single',note:'Base debuff / knuckle utility'},
  {id:'pummel',name:'Pummel',cd:24,lock:5,shape:'melee',note:'Five-second rapid-input combo finisher: repeat the activation key up to ten times'},
  {id:'focusfist',name:'Focused Fist',cd:14,lock:.6,charge:1200,shape:'single',note:'Optional hold-to-charge opener. Release early for an uncharged strike, or hold for full charge.'},
  {id:'hammer',name:'Ignite: Hammerblow',cd:9,lock:.8,shape:'melee',note:'Arcana starter'},
  {id:'flurry',name:'Ignite: Flurry of Fists',cd:9,lock:1,shape:'melee',note:'Arcana rapid punches'},
  {id:'cyclone',name:'Ignite: Cyclone Drive',cd:9,lock:1.1,shape:'aoe',note:'Arcana spin / area pressure'},
  {id:'radiant',name:'Radiant Storm',cd:30,lock:1.1,shape:'aoe',note:'Arcana burst follow-up'},
  {id:'piercing',name:'Piercing Gale',cd:22,lock:1,shape:'dash',note:'Arcana finisher'}]},
 ev:{name:'Explosive Vanguard',scene:'lance',target:'strawman',skills:[
  {id:'lancecharge',name:'Lance Charge',cd:10,lock:1,shape:'dash',note:'Maximum Lance Spirit Amplitude and equipped cooldown reforges shorten this skill and the linked Dreadnought Burst cycle.'},
  {id:'lanceleap',name:'Lance Leap',cd:5,lock:.5,shape:'dash',note:'Leap away to reset range and speed up the next on-foot Lance Charge.'},
  {id:'lanceimpact',name:'Lance Impact',cd:3,lock:.7,shape:'line',note:'Force separation and grant Lance Charge Mount Bonus; its damage multiplier also supports Drill Charge.'},
  {id:'lancecounter',name:'Lance Counter',cd:0,lock:.5,shape:'guard',note:'Base lance counter'},
  {id:'charge',name:'Charge',cd:12,lock:.8,shape:'dash',note:'Base engage option'},
  {id:'reloadshells',name:'Recharge Shells',cd:10,lock:.5,shape:'self',note:'Replenish Mana Shells and maintain the Mana Bullet damage buff; assumes maximum Link reduction.'},
  {id:'thrust',name:'Relentless Thrust',cd:8,lock:.8,shape:'line',note:'Shell-positive quick thrust sequence; grants mount bonus for Lance Charge, with cooldown accumulation on repeated use.'},
  {id:'impact',name:'Arc Impact',cd:8,lock:1,shape:'aoe',note:'Cleave whose damage inherits Flash Launcher enhancements, including relevant reforges.'},
  {id:'blastzone',name:'Blast Zone',cd:6,lock:1.1,shape:'circle',note:'Surrounding AoE inheriting Grapple Shot damage enhancements.'},
  {id:'drill',name:'Drill Charge',cd:20,lock:1.1,shape:'dash',note:'Line movement and escape; takes damage from Lance Impact and distance from Lance Charge distance increases. Accumulates cooldown across uses.'},
  {id:'dreadnought',name:'Dreadnought Burst',cd:16,lock:1.2,shape:'line',note:'Uses Lance Charge cooldown and relevant damage reforges; the Crafter models Link 9+ and conservatively floors its cooldown at 6 seconds.'},
  {id:'glory',name:'Blaze of Glory',cd:34,lock:1.2,shape:'line',note:'Major commitment for stable target and prepared burst window.'}]},
 fa:{name:'Forbidden Alchemist',scene:'alch',target:'archery target',skills:[
  {id:'watercannon',name:'Water Cannon',cd:0,lock:.8,shape:'projectile',note:'Base alchemy projectile'},
  {id:'flameburst',name:'Flame Burst',cd:0,lock:1,shape:'cone',note:'Base alchemy flame option'},
  {id:'windblast',name:'Wind Blast',cd:8,lock:.8,shape:'cone',note:'Base alchemy control tool'},
  {id:'sandburst',name:'Sand Burst',cd:14,lock:.7,shape:'aoe',note:'Base alchemy utility'},
  {id:'hydra',name:'Hydra Transmutation',cd:20,lock:1.2,shape:'aoe',note:'Base alchemy debuff option'},
  {id:'catalyst',name:'Compound Catalyst',cd:15,lock:.6,shape:'self',note:'Arcana setup'},
  {id:'amplify',name:'Elemental Amplification',cd:5,lock:.6,shape:'self',note:'Arcana empowerment'},
  {id:'compounding',name:'Elemental Compounding',cd:20,lock:1,shape:'projectile',note:'Arcana attack'},
  {id:'fangs',name:'Fangs of Stone',cd:18,lock:1,shape:'line',note:'Arcana earth-themed attack'},
  {id:'serpent',name:'Serpentcall',cd:100,lock:1.2,shape:'projectile',note:'Arcana finisher'}]},
 hs:{name:'Harmonic Saint',scene:'saint',target:'allies',skills:[
  {id:'heal',name:'Healing',cd:0,lock:.5,shape:'single ally',note:'Base single-target healing'},
  {id:'partyheal',name:'Party Healing',cd:0,lock:.8,shape:'party',note:'Base multi-target healing'},
  {id:'blessing',name:'Blessing of Protection',cd:180,lock:.5,shape:'party',note:'Protective arcana support'},
  {id:'echoes',name:'Echoes of Salvation',cd:5,lock:.8,shape:'party',note:'Arcana healing / support'},
  {id:'hand',name:'Hand of Restoration',cd:3,lock:.7,shape:'single ally',note:'Arcana focused heal'},
  {id:'hymn',name:'Hymn of Resurrection',cd:4,lock:1,shape:'party',note:'Recovery tool'},
  {id:'pall',name:'Pall of Ruination',cd:180,lock:.5,shape:'party support',note:'Burst support window'},
  {id:'pulse',name:'Pulse of Purification',cd:60,lock:.8,shape:'party',note:'Area support / cleanse'},
  {id:'voice',name:'Voice of Vitality',cd:240,lock:.7,shape:'party',note:'Multi-target support'}]}
};
const CRAFT_ACTIVE_TALENT_SKILLS={"ek":[["Bash","melee"],["Assault Slash","dash"],["Charge","dash"],["Counterattack","counter"],["Defense","self"],["Smash","melee"],["Windmill","aoe"],["Crisis Escape","utility"],["Evasion","defensive"],["Final Hit","self"],["Final Strike","melee"],["Rage Impact","aoe"],["Stampede","dash"],["Stomp","aoe"],["Taunt","aoe"],["Throwing Attack","single"],["Wind Guard","self"],["Gold Strike","single"]],"sg":[["Bash","melee"],["Charge","dash"],["Counterattack","counter"],["Defense","self"],["Crisis Escape","utility"],["Evasion","defensive"],["Final Hit","self"],["Final Strike","melee"],["Rage Impact","aoe"],["Stampede","dash"],["Stomp","aoe"],["Taunt","aoe"],["Throwing Attack","single"],["Wind Guard","self"],["Gold Strike","single"],["Smash","melee"],["Assault Slash","dash"],["Windmill","aoe"]],"mp":[["Wire Pull","pull"],["Act 2: Threshold Cutter","line"],["Act 4: Rising Action","line"],["Act 6: Crisis","aoe"],["Act 7: Climactic Crash","aoe"],["Act 1: Inciting Incident","puppet"],["Act 9: Invigorating Encore","puppet"],["Colossus Marionette","summon"],["Control Marionette","puppet"],["Pierrot Marionette","summon"],["Puppet's Snare","control"]],"hs":[["Healing","single ally"],["Party Healing","party"],["First Aid","single ally"],["Mana Shield","self"],["Natural Shield","party"],["Fire Shield","party"],["Ice Shield","party"],["Lightning Shield","party"],["Battlefield Overture","party"],["Dance of Death","aoe"],["Dischord","single"],["Encore","self"],["Enduring Melody","party"],["Enthralling Performance","aoe"],["Fantastic Chorus","party"],["Harvest Song","party"],["Lullaby","aoe"],["March Song","party"],["Playing Instrument","party"],["Song","party"],["Vivace","party"],["Polyphonic Melody","party"],["Resonant Litany","party"]],"dd":[["Fireball","cast"],["Ice Spear","cast"],["Thunder","cast"],["Meteor Strike","circle"],["Blaze","single"],["Fire Shield","self"],["Firebolt","cast"],["Fusion Bolt","cast"],["Hail Storm","charged aoe"],["Ice Shield","self"],["Icebolt","cast"],["Inspiration","self"],["Lightning Bolt","cast"],["Lightning Rod","charged line"],["Lightning Shield","self"],["Mana Shield","self"],["Meditation","self"],["Natural Shield","self"],["Shockwave","aoe"],["Snap Cast","self"],["Spellwalk","self"]],"bb":[["Charging Strike","dash"],["Spinning Uppercut","single"],["Pummel","melee"],["Combo: Counter Punch","counter"],["Counter Punch","counter"],["Combo: Pummel","melee"],["Drop Kick","melee"],["Focused Fist","single"],["Respite","self"],["Somersault Kick","melee"],["Tumble","dash"],["Berserker's Fury","self"],["Fire Within","self"],["Earthshaker","aoe"]],"ag":[["Bullet Storm","aoe"],["Grapple Shot","single"],["Reload","self"],["Shooting Rush","dash"],["Way of the Gun","self"],["Bullet Slide","dash"],["Flash Launcher","single"]],"ev":[["Lance Charge","dash"],["Lance Counter","counter"],["Lance Impact","line"],["Lance Leap","dash"]],"fa":[["Water Cannon","projectile"],["Flame Burst","cone"],["Wind Blast","cone"],["Sand Burst","aoe"],["Hydra Transmutation","aoe"],["Barrier Spikes","aoe"],["Chain Cylinder","self"],["Elemental Wave","self"],["Frozen Blast","aoe"],["Golden Time","self"],["Heat Buster","single"],["Life Drain","single"],["Rain Casting","aoe"],["Shock","single"],["Summon Golem","summon"],["Chemical Carnival","aoe"]]};
function craftExpandedSkills(key){const meta=CRAFT_DEFS[key]||CRAFT_DEFS.as,src=CRAFT_ACTIVE_TALENT_SKILLS[key]||[],list=[...meta.skills],names=new Set(list.map(s=>s.name.toLowerCase()));for(const [name,shape] of src){if(names.has(name.toLowerCase()))continue;names.add(name.toLowerCase());const id='talent-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const bbBase={
  'talent-tumble':14,'talent-somersault-kick':16,'talent-drop-kick':20,
  'talent-focused-fist':14,'talent-charging-strike':12,'talent-spinning-uppercut':12,'talent-pummel':24
 };const confirmed=key==='bb'&&Object.prototype.hasOwnProperty.call(bbBase,id);list.push({id,name,cd:confirmed?bbBase[id]:0,lock:.6,shape,note:confirmed?'Fighter cooldown: shown after the S50 Erg reduction when enabled.':'Adjust this skill’s cooldown and action timing to suit your build.',timingUnknown:!confirmed})}return list}
const saintTargetRoster=[
 {id:'archer',label:'AS trainee',className:'ally-archer'},
 {id:'knight',label:'EK trainee',className:'ally-knight'},
 {id:'mage',label:'DD trainee',className:'ally-mage'},
 {id:'guardian',label:'SG trainee',className:'ally-guardian'},
 {id:'gunner',label:'AG trainee',className:'ally-gunner'},
 {id:'brawler',label:'BB trainee',className:'ally-brawler'},
 {id:'lancer',label:'EV trainee',className:'ally-lancer'},
 {id:'alch',label:'FA trainee',className:'ally-alch'},
 {id:'puppet',label:'MP trainee',className:'ally-puppet'}
];
function craftMeta(){return CRAFT_DEFS[state.arcana]||CRAFT_DEFS.as}
function craftProfile(key=state.arcana){if(!state.crafterProfiles[key])state.crafterProfiles[key]={slots:{},sequence:[],skillSettings:{},secondary:{}};return state.crafterProfiles[key]}
function craftSkills(){return craftExpandedSkills(state.arcana)}
function craftSkill(id){return craftSkills().find(s=>s.id===id)}
function craftField(skill,field){const profile=craftProfile();const value=profile.skillSettings?.[skill.id]?.[field];return value===undefined||value===null||value===''?(skill[field]??0):value}
function craftFieldNumber(skill,field){return Number(craftField(skill,field))||0}
function craftEvCooldown(skill){
 if(state.arcana!=='ev')return craftFieldNumber(skill,'cd');
 const g=craftProfile().gear||{};
 const reforge=Math.min(7,Math.max(0,Number(g.evLanceCooldownReforge??5)||0));
 const spirit=g.evMaxSpirit!==false?2.5:0;
 const lance=Math.max(0,craftFieldNumber(craftSkill('lancecharge')||{id:'lancecharge',cd:10},'cd')-spirit-reforge);
 if(skill.id==='lancecharge')return lance;
 if(skill.id==='dreadnought'){
  const base=craftFieldNumber(skill,'cd');
  // Dreadnought base skill cooldown is six seconds, with Lance Charge added.
  // Conservative 6s floor: the reference does not establish an in-game minimum.
  const raw=(base-10)+lance-(g.evLink9===false?0:2);
  return Math.max(6,raw);
 }
 return craftFieldNumber(skill,'cd');
}

function craftSecondary(skillId){const profile=craftProfile();const primary=craftOrbGains[skillId]?.primary;const configured=profile.secondary?.[skillId];return craftElements.includes(configured)&&configured!==primary?configured:craftSecondaryDefaults[skillId]}
function craftIcon(skill){const src=skill.icon||window.MIDIR_ROTATION_ICONS?.[skill.name]||window.MIDIR_ICONS?.skills?.[skill.id];return src?`<img src="${esc(src)}" alt="" loading="lazy">`:`<span class="craft-no-icon" aria-hidden="true">✦</span>`}
function craftOrbMarkup(){return craftElements.map(element=>`<div class="craft-orb" data-orb="${element}" aria-label="${craftOrbLabels[element]} orb, 0% of ${craftOrbMax}%"><span class="craft-orb-ball"><span class="craft-orb-liquid"></span></span><strong>${craftOrbLabels[element]}</strong><small class="craft-orb-count">0%</small></div>`).join('')}
function craftUpdateOrbs(){const o=craftSession?.orbs||{};for(const el of craftElements){const root=document.querySelector(`[data-orb="${el}"]`);if(!root)continue;const n=Math.max(0,Math.min(craftOrbMax,o[el]||0));root.classList.toggle('full',n===craftOrbMax);root.style.setProperty('--orb-progress',n/craftOrbMax*100+'%');const count=root.querySelector('.craft-orb-count');if(count)count.textContent=n+'%';root.setAttribute('aria-label',`${craftOrbLabels[el]} orb, ${n}% of ${craftOrbMax}%${n===craftOrbMax?', full':''}`)}}
function craftCelebrate(){const stage=$('craft-animation');if(!stage)return;stage.classList.remove('celebrate');void stage.offsetWidth;stage.classList.add('celebrate');setTimeout(()=>{if(stage.isConnected)stage.classList.remove('celebrate')},850)}
function craftSvgImage(href,x,y,w,h,cls='',extra=''){return `<image ${cls?`class="${cls}"`:''} href="${esc(href)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" ${extra}/>`}
const CRAFT_HERO_SPRITES={
 archer:'assets/crafter-sprites/archer.png',mage:'assets/crafter-sprites/mage.png',guns:'assets/crafter-sprites/guns.png',alch:'assets/crafter-sprites/alch.png',
 dual:'assets/crafter-sprites/dual.png',puppet:'assets/crafter-sprites/puppet.png',guardian:'assets/crafter-sprites/guardian.png',brawler:'assets/crafter-sprites/brawler.png',
 lance:'assets/crafter-sprites/lance.png',saint:'assets/crafter-sprites/saint.png'
};
const CRAFT_HERO_SPRITE_META={archer:{size:182,glow:'#64d4c4'},mage:{size:186,glow:'#9d83ff'},guns:{size:198,glow:'#ea8aa6'},alch:{size:188,glow:'#6fdde2'},dual:{size:184,glow:'#87aaff'},puppet:{size:186,glow:'#d286df'},guardian:{size:188,glow:'#bfd3e5'},brawler:{size:180,glow:'#f0a06b'},lance:{size:194,glow:'#9fb8ff'},saint:{size:184,glow:'#d8e9ff'}};
const CRAFT_TARGET_SPRITES={archer:'assets/crom/sprites/wraith.png',mage:'assets/crom/sprites/ronaun.png',guns:'assets/crom/sprites/cari.png',alch:'assets/crom/sprites/un-llygadog.png',dual:'assets/crom/sprites/gwallgof.png',puppet:'assets/crom/sprites/melci.png',guardian:'assets/crom/sprites/gwallgof.png',brawler:'assets/crom/sprites/wyneb.png',lance:'assets/crom/sprites/irusan.png'};
function craftBackdrop(scene){const accent={archer:'#63d2c0',mage:'#8f76ff',guns:'#d67c96',alch:'#67d2d5',dual:'#5b8ee4',puppet:'#c478d0',guardian:'#9db6d0',brawler:'#e78b57',lance:'#9db4ff'}[scene]||'#7f63ff';return `<defs><linearGradient id="craft-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#090914"/><stop offset="58%" stop-color="#141226"/><stop offset="100%" stop-color="#090b14"/></linearGradient><linearGradient id="craft-floor" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#100f22"/><stop offset="55%" stop-color="#201837"/><stop offset="100%" stop-color="#0f1020"/></linearGradient><radialGradient id="craft-violet" cx="50%" cy="36%" r="60%"><stop offset="0%" stop-color="${accent}" stop-opacity=".42"/><stop offset="70%" stop-color="${accent}" stop-opacity=".08"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient><filter id="craft-shadow"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000814" flood-opacity=".8"/></filter></defs><rect width="540" height="220" rx="16" fill="url(#craft-bg)"/><rect width="540" height="220" rx="16" fill="url(#craft-violet)" opacity=".85"/><g opacity=".72"><path d="M34 22L88 22L100 118L22 118Z" fill="#1b1831"/><path d="M452 22L506 22L518 118L440 118Z" fill="#1b1831"/><path d="M236 16L304 16L318 110L222 110Z" fill="#201a37"/><path d="M254 28Q270 10 286 28L296 88L244 88Z" fill="#341f55" opacity=".95"/><rect x="260" y="32" width="20" height="58" rx="10" fill="${accent}" opacity=".6"/></g><path d="M0 150Q270 120 540 150V220H0Z" fill="#080912" opacity=".92"/><path d="M0 156L270 128L540 156V220H0Z" fill="url(#craft-floor)"/><path d="M0 176Q135 166 270 176T540 176" stroke="rgba(138,102,210,.35)" stroke-width="2" fill="none"/><path d="M0 196Q135 186 270 196T540 196" stroke="rgba(138,102,210,.18)" stroke-width="1.5" fill="none"/>`}
function craftTargetSprite(kind,x,y,size,label){const href=CRAFT_TARGET_SPRITES[kind]||CRAFT_TARGET_SPRITES.archer;const rx=Math.round(size*.34),ry=Math.max(9,Math.round(size*.1));return `<g id="craft-target" class="craft-target-sprite" transform="translate(${x} ${y})" filter="url(#craft-shadow)"><ellipse cx="0" cy="38" rx="${rx}" ry="${ry}" fill="#050711" opacity=".85"/><circle cx="0" cy="-2" r="${Math.round(size*.4)}" fill="#a156ff" opacity=".18"/><circle cx="0" cy="-2" r="${Math.round(size*.27)}" fill="#c37bff" opacity=".12"/>${craftSvgImage(href,-size/2,-size/2,size,size,'craft-target-image')}${kind==='guardian'?`${craftSvgImage('assets/crafter-sprites/guardian-target-windup.png',-size/2,-size/2,size,size,'craft-sg-target-windup')}${craftSvgImage('assets/crafter-sprites/guardian-target-strike.png',-size/2,-size/2,size,size,'craft-sg-target-strike')}<g id="craft-sg-enemy-body"><path d="M 7 -15 Q 27 -44 31 -15 L 28 20 Q 11 29 -4 14 Z" fill="#4b4357" stroke="#c2a5e1" stroke-width="2" opacity=".93"/><circle cx="11" cy="-24" r="12" fill="#494050" stroke="#b9aed4" stroke-width="2"/><path d="M 5 -26 L 11 -21 L 17 -26" fill="none" stroke="#f59abd" stroke-width="2.5"/></g><g id="craft-sg-enemy-arm"><path d="M 20 -7 L 40 -2 L 51 12" fill="none" stroke="#796880" stroke-width="12" stroke-linecap="round"/><g id="craft-sg-weapon"><path d="M 48 12 L 65 -43 L 74 -47 L 75 -35 L 57 17 Z" fill="#a8b8cb" stroke="#eff5ff" stroke-width="2"/><path d="M 51 12 L 69 15" stroke="#392e49" stroke-width="6"/></g></g><path id="craft-sg-swing" d="M 52 -43 Q 108 -36 112 35" fill="none" stroke="#ffbf81" stroke-width="8" stroke-linecap="round" opacity="0"/>`:''}<text x="0" y="${Math.round(size*.6)}" text-anchor="middle" font-size="10" fill="#ccb7ef">${esc(label||'Crom target')}</text></g>`}
function craftCharacterFigure(kind,{x=120,y=122,label='Arcana trainee',small=false}={}){
 const href=CRAFT_HERO_SPRITES[kind]||CRAFT_HERO_SPRITES.archer;
 const meta=CRAFT_HERO_SPRITE_META[kind]||CRAFT_HERO_SPRITE_META.archer;
 const size=Math.round((meta.size||184)*(small?0.39:0.78));
 const left=Number((-size/2).toFixed(2)),top=Number((-(size*.88)).toFixed(2));
 const shadowY=Number((size*.12).toFixed(2)),shadowRx=Number((size*.18).toFixed(2)),shadowRy=Number((size*.055).toFixed(2));
 const glowR=Number((size*.24).toFixed(2)),glow=meta.glow||'#8db6ff';
 const frame=phase=>href.replace(/\.png$/,`-${phase}.png`);
 const imageClass=`craft-character-image${small?' ally-character-image':''}`;
 // Stage lighting and ground contact are siblings of the animated sprite, never its children.
 const marker=`<g class="craft-ground-marker" aria-hidden="true"><ellipse cx="0" cy="${shadowY}" rx="${shadowRx}" ry="${shadowRy}" fill="#050711" opacity=".86"/><circle cx="0" cy="${Number((shadowY-28).toFixed(2))}" r="${glowR}" fill="${glow}" opacity=".14"/></g>`;
 const sprites=`<g class="craft-character-sprite craft-character-${esc(kind)}">${craftSvgImage(href,left,top,size,size,`${imageClass} craft-pose-idle`)}${craftSvgImage(frame('windup'),left,top,size,size,`${imageClass} craft-pose-windup`)}${craftSvgImage(frame('strike'),left,top,size,size,`${imageClass} craft-pose-strike`)}</g>`;
 return `<g class="craft-character-wrap craft-character-wrap-${esc(kind)}" transform="translate(${x} ${y})" aria-label="${esc(label)}">${marker}${sprites}</g>`;
}
function craftProjectileMarkup(kind){if(kind==='archer')return `<g id="craft-projectile" opacity="0"><path d="M164 100L260 98" stroke="#9aece2" stroke-width="4" stroke-linecap="round"/><path d="M248 91L262 98L248 105" fill="none" stroke="#9aece2" stroke-width="4" stroke-linecap="round"/></g>`;if(kind==='mage')return `<g id="craft-projectile" opacity="0"><circle cx="192" cy="100" r="10" fill="#b896ff"/><path d="M192 100L266 100" stroke="#b896ff" stroke-width="6" stroke-linecap="round"/></g>`;if(kind==='guns')return `<g id="craft-projectile" opacity="0"><circle cx="214" cy="98" r="4" fill="#ffd6a2"/><path d="M214 98L290 98" stroke="#ffd6a2" stroke-width="4" stroke-linecap="round"/></g>`;if(kind==='alch')return `<g id="craft-projectile" opacity="0"><circle cx="204" cy="102" r="12" fill="#9ad4ff"/><circle cx="204" cy="102" r="20" fill="#9ad4ff" opacity=".18"/></g>`;if(kind==='dual')return `<g id="craft-projectile" opacity="0"><path d="M212 116Q278 60 334 88" fill="none" stroke="#edf3ff" stroke-width="7" stroke-linecap="round"/></g>`;if(kind==='puppet')return `<g id="craft-projectile" opacity="0"><path d="M168 86Q256 52 342 84" fill="none" stroke="#f6c7ef" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 6"/><path d="M168 118Q256 84 342 110" fill="none" stroke="#f6c7ef" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 6"/></g>`;if(kind==='guardian')return `<g id="craft-projectile" opacity="0"><path d="M210 106Q278 72 334 90" fill="none" stroke="#c9d6e7" stroke-width="10" stroke-linecap="round"/></g>`;if(kind==='brawler')return `<g id="craft-projectile" opacity="0"><path d="M218 102Q286 80 332 96" fill="none" stroke="#ffd38f" stroke-width="9" stroke-linecap="round"/></g>`;if(kind==='lance')return `<g id="craft-projectile" opacity="0"><path d="M198 104L404 104" stroke="#dce7f0" stroke-width="5" stroke-linecap="round"/></g>`;return ''}
function craftSceneSvg(kind){const meta={archer:{hero:'archer',target:'archer',heroX:120,heroY:159,targetX:428,targetY:100,targetSize:96,label:'Shadow wraith'},mage:{hero:'mage',target:'mage',heroX:120,heroY:159,targetX:428,targetY:100,targetSize:96,label:'Crom invader'},guns:{hero:'guns',target:'guns',heroX:132,heroY:159,targetX:428,targetY:100,targetSize:96,label:'Crom invader'},alch:{hero:'alch',target:'alch',heroX:124,heroY:159,targetX:426,targetY:100,targetSize:96,label:'Crom invader'},dual:{hero:'dual',target:'dual',heroX:146,heroY:159,targetX:324,targetY:100,targetSize:100,label:'Crom brute'},puppet:{hero:'puppet',target:'puppet',heroX:126,heroY:159,targetX:416,targetY:98,targetSize:96,label:'Masked disciple'},guardian:{hero:'guardian',target:'guardian',heroX:144,heroY:159,targetX:324,targetY:100,targetSize:100,label:'Crom brute'},brawler:{hero:'brawler',target:'dual',heroX:144,heroY:159,targetX:324,targetY:100,targetSize:100,label:'Crom brute'},lance:{hero:'lance',target:'guardian',heroX:136,heroY:159,targetX:422,targetY:98,targetSize:96,label:'Crom invader'}}[kind]||{hero:'archer',target:'archer',heroX:120,heroY:159,targetX:428,targetY:100,targetSize:96,label:'Crom target'};return `<svg viewBox="0 0 540 220" role="img" aria-label="Stylized ${esc(kind)} rotation crafter scene">${craftBackdrop(kind)}${craftCharacterFigure(meta.hero,{x:meta.heroX,y:meta.heroY,label:meta.hero+' trainee'})}${craftProjectileMarkup(kind)}${craftTargetSprite(meta.target,meta.targetX,meta.targetY,meta.targetSize,meta.label)}</svg>`}
function craftSaintAllyFigure(t){const map={'ally-archer':'archer','ally-knight':'dual','ally-mage':'mage','ally-guardian':'guardian','ally-gunner':'guns','ally-brawler':'brawler','ally-lancer':'lance','ally-alch':'alch','ally-puppet':'puppet','ally-saint':'saint'};const kind=map[t.className]||'archer';return `<svg class="ally-figure-svg" viewBox="0 0 180 205" role="img" aria-label="${esc(t.label)}"><defs><filter id="ally-shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000915" flood-opacity=".8"/></filter></defs>${craftCharacterFigure(kind,{x:90,y:156,label:t.label,small:false}).replace('filter="url(#craft-shadow)"','filter="url(#ally-shadow)"')}</svg>`}
function craftSaintScene(){const targets=(craftSession?.saintTargets||[]);return `<div class="craft-healing-stage" id="craft-animation"><div class="craft-saint-caster">${craftSaintAllyFigure({label:'Harmonic Saint',className:'ally-saint'})}<small>Harmonic Saint</small></div><div class="craft-heal-targets">${targets.length?targets.map((t,i)=>`<div class="craft-ally-card ${esc(t.className)}" data-heal-target="${i}">${craftSaintAllyFigure(t)}<strong>${esc(t.label)}</strong><div class="ally-health"><span style="width:${t.hp}%"></span></div><div class="ally-plus">+</div></div>`).join(''):'<p class="hint">Press Begin to generate 1–3 random party targets.</p>'}</div></div>`}
function craftScene(){if(state.arcana==='hs')return craftSaintScene();return `<div class="craft-animation" id="craft-animation" data-scene="${esc(craftMeta().scene)}">${craftSceneSvg(craftMeta().scene)}<div id="craft-fireworks-left" class="craft-fireworks left" aria-hidden="true"></div><div id="craft-fireworks-right" class="craft-fireworks right" aria-hidden="true"></div></div>`}
function craftSlot(key){const skill=craftSkill(craftProfile().slots[key]);return `<button type="button" class="craft-slot ${skill?'assigned':''}" data-craft-key="${esc(key)}" aria-label="${esc(key)}: ${skill?esc(skill.name):'Empty slot'}" title="${skill?esc(skill.name):'Drop a skill here'}"><small>${esc(key)}</small>${skill?craftIcon(skill):'<span class="craft-empty">+</span>'}<span class="craft-cool" data-craft-cool="${esc(key)}"></span></button>`}
function craftSettingsTable(){return `<div class="scroll"><table class="craft-settings-table"><tr><th>Skill</th><th>Cooldown</th><th>Delay</th><th>Charge ms</th><th>Shape</th></tr>${craftSkills().map(skill=>`<tr><td>${craftIcon(skill)}<span class="craft-setting-name">${esc(skill.name)}</span></td><td><input type="number" min="0" step="0.1" data-craft-setting="${skill.id}" data-field="cd" value="${esc(craftField(skill,'cd'))}"></td><td><input type="number" min="0" step="0.1" data-craft-setting="${skill.id}" data-field="lock" value="${esc(craftField(skill,'lock'))}"></td><td>${skill.charge!==undefined?`<input type="number" min="0" step="50" data-craft-setting="${skill.id}" data-field="charge" value="${esc(craftField(skill,'charge'))}">`:'—'}</td><td><small>${esc(skill.shape||'')}</small></td></tr>`).join('')}</table></div>`}
function craftGearControls(){if(!['mp','bb','ek','sg','ag','ev'].includes(state.arcana))return '';const p=craftProfile(),g=p.gear||{};const check=(id,label)=>`<label><input type="checkbox" data-craft-gear="${id}" ${g[id]?'checked':''}> ${label}</label>`;const num=(id,label,value,min,max,step=1)=>`<label>${label} <input type="number" min="${min}" max="${max}" step="${step}" data-craft-number="${id}" value="${g[id]??value}"></label>`;let rows='';if(state.arcana==='mp')rows=check('ergS50','S50 Control Bars · −50% Marionette Show cooldown')+check('puppetSet','Puppetry set · −50% Puppet Skill cooldown')+check('mpLinkX','Link X · Cutting Chorus cooldown −2 seconds')+'<p class="hint">Puppet-only reductions do not shorten Arcana skills. Server-imposed minimums still apply to resummoning and repeated targets.</p>';if(state.arcana==='bb')rows=check('bbLink5','Arcana Link 5+ · Ignite crits reduce Ignite and Combo cooldowns')+check('knuckleErgS50','S50 Erg · Combo cooldown −50%')+check('critReset','Equipment · 50% cooldown reset on a qualifying critical hit')+num('critChance','Critical hit chance (%)',30,0,100)+num('critHits','Hit events per action',1,1,24)+'<p class="hint">Each hit event is evaluated separately. Pummel and Somersault Kick always register 3 separate hits for critical-reset checks; other skills use the configurable hit count. Any Ignite or Combo critical hit refreshes Tumble. At Link 5+, each critical Ignite hit also reduces all Ignite and Combo cooldowns by 20% of their full duration; this is separate from equipment resets.</p>';if(state.arcana==='ek')rows=`<label>Weapon configuration <select data-craft-option="ekWeapon"><option value="twohand" ${g.ekWeapon==='twohand'?'selected':''}>Two-handed sword</option><option value="shield" ${g.ekWeapon==='shield'?'selected':''}>One-handed + shield</option><option value="dual" ${g.ekWeapon==='dual'?'selected':''}>Dual-wield one-handed swords</option></select></label>`+check('ekSpirit','Two-handed sword spirit · Rage Impact reset possibility')+num('ekSpiritChance','Spirit reset chance (%) — configure for your build',0,0,100)+check('ekHitConfirmed','Bash hits connect (uncheck to train invulnerability whiffs)');if(state.arcana==='sg')rows=check('sgOathStart','Start training with Virtuous Oath active')+num('sgOathVirtue','Virtue gained per second from Oath',0.5,0,100,.1)+num('sgRelic','Murias Relic Virtue-generation modifier (percentage)',0,0,100,1)+'<p class="hint">Watch the dummy raise its weapon, then Parry during the highlighted reaction window. A successful parry grants 7 Virtue and resets Rend Armor.</p>';if(state.arcana==='ev'){
 const reforge=Math.min(7,Math.max(0,Number(g.evLanceCooldownReforge??5)||0));
 const lance=craftEvCooldown(craftSkill('lancecharge'));
 const dread=craftEvCooldown(craftSkill('dreadnought'));
 rows=`<label>Lance Charge cooldown reforge <select data-craft-number="evLanceCooldownReforge"><option value="0" ${reforge===0?'selected':''}>None</option>${[1,2,3,4,5,6,7].map(i=>`<option value="${i}" ${reforge===i?'selected':''}>${i}/5${i>5?' · Limit Break':''}</option>`).join('')}</select></label>`+
 `<label><input type="checkbox" data-craft-gear="evMaxSpirit" ${g.evMaxSpirit!==false?'checked':''}> Maximum Lance Spirit · Amplitude</label>`+
 `<label><input type="checkbox" data-craft-gear="evLink9" ${g.evLink9!==false?'checked':''}> Arcana Link 9+ · Dreadnought cooldown benefit</label>`+
 `<p class="hint">With these settings: Lance Charge <strong>${lance.toFixed(1)}s</strong>; Dreadnought Burst <strong>${dread.toFixed(1)}s</strong>. Dreadnought uses a conservative 6s minimum; a game-imposed minimum has not been verified. Spirit and Link bonuses start enabled. 5/5 is the starting reforge; 6/5 and 7/5 are rare limit breaks. No additional Echostone or damage reforge is presumed.</p>`;
}
if(state.arcana==='ag')rows=check('agSpirit','Dual Gun spirit · instantaneous bullet reload (Transmutation Energy still required)')+'<p class="hint">Gunner’s Crest grants +50 energy per Dual Gun skill for 240 seconds. Tracer Pod and Detonation Field increase Fatal Scope aim speed by 100% against affected targets (not additive). The crafter treats the active setup as applying to its practice target.</p>';return `<details class="craft-secondary-config"><summary>Equipment and combat configuration · ${esc(craftMeta().name)}</summary><p class="hint">Settings persist for this Arcana.</p>${rows}</details>`}
function craftSecondaryControls(){if(state.arcana!=='as')return '';return `<details class="craft-secondary-config"><summary>Secondary orb elements</summary><p class="hint">Choose the secondary element generated by each AS orb-building skill. Values are capped at 100%.</p><div class="craft-secondary-grid">${Object.entries(craftOrbGains).map(([id,g])=>`<label>${esc(craftSkill(id)?.name||id)} <small>${craftOrbLabels[g.primary]} +${g.main}% · second +${g.secondary}%</small><select data-craft-secondary="${id}">${craftElements.filter(e=>e!==g.primary).map(e=>`<option value="${e}" ${craftSecondary(id)===e?'selected':''}>${craftOrbLabels[e]}</option>`).join('')}</select></label>`).join('')}</div></details>`}
function craftSequenceEditor(){const profile=craftProfile();return `<details class="craft-builder"><summary>Edit Skills & Presets ${profile.sequence.length?'· '+profile.sequence.length+' steps':''}</summary><div class="craft-builder-body"><p class="hint">Choose assigned hotbar keys in any order. Leave this empty for free practice. Cooldowns, delays and charged hold time can all be customized below.</p><div class="craft-sequence">${profile.sequence.map((key,i)=>`<button type="button" data-craft-remove="${i}" title="Remove step">${esc(key)} <span>×</span></button>`).join('')||'<span class="hint">No planned rotation</span>'}</div><div class="craft-seq-actions"><button type="button" data-craft-clear="1">Clear rotation</button><button type="button" data-craft-reset="1">Reset custom skill values</button></div><div class="craft-key-choices">${craftKeys.filter(k=>craftSkill(profile.slots[k])).map(k=>`<button type="button" data-craft-add="${esc(k)}">${esc(k)} · ${esc(craftSkill(profile.slots[k]).name)}</button>`).join('')||'<span class="hint">Assign skills to your bar to build a rotation.</span>'}</div><h3>Skill settings</h3><p class="hint">Set the cooldowns and action delays to match your build before practicing.</p>${craftSettingsTable()}${craftSecondaryControls()}${craftGearControls()}</div></details>`}
function craftDrawerContent(){return `<aside class="craft-drawer ${craftDrawer?'open':''}" id="craft-drawer" ${craftDrawer?'':'hidden'}><div class="craft-drawer-head"><strong>Skills</strong><button id="craft-drawer-close" aria-label="Close skill drawer">×</button></div><p class="hint">Drag or tap a skill to assign it to a slot. On mobile, hold and drag a skill onto a hotkey; tap a hotkey to cast during practice.</p><div class="craft-drawer-list">${craftSkills().map(skill=>`<div class="craft-skill-pick ${craftSelected===skill.id?'selected':''}" draggable="true" data-craft-skill="${skill.id}" tabindex="0" role="button" aria-label="Choose ${esc(skill.name)}">${craftIcon(skill)}<div><strong>${esc(skill.name)}</strong><small>${skill.timingUnknown&&!craftProfile().skillSettings?.[skill.id]?.hasOwnProperty('cd')?'Set cooldown':(state.arcana==='ev'?craftEvCooldown(skill):craftFieldNumber(skill,'cd')).toFixed(1)+'s cooldown'} · ${esc(skill.shape||'')} · ${craftFieldNumber(skill,'lock')}s delay</small><span class="hint">${esc(skill.note||'')}</span></div></div>`).join('')}</div></aside>`}
// BB stage-chain inputs deliberately use 1–3: browsers reserve F1 and other function keys.
const BB_CHAIN={1:['chargingstrike','focusfist','flurry'],2:['uppercut','talent-somersault-kick','cyclone'],3:['pummel','talent-drop-kick','hammer']};
function bbChainSkill(stage,index){return craftSkill((BB_CHAIN[stage]||[])[index])}
function bbChainStage(id){for(const [stage,ids] of Object.entries(BB_CHAIN))if(ids.includes(id))return Number(stage);return 0}
function bbChainCooldown(id){const skill=craftSkill(id);if(!skill||!craftSession)return 0;return Math.max(0,((craftSession.ready[id]||0)-performance.now())/1000)}
function bbChainMarkup(){if(state.arcana!=='bb')return '';const stage=craftSession?.bbComboStage||0;return `<section class="bb-combo-box" id="bb-combo-box" aria-live="polite"><strong>${stage?'Combo · Stage '+stage+' complete — choose Stage '+(stage+1):'Combo shortcuts · 1 / 2 / 3'}</strong><p class="hint">${stage?'Keys 1–3 temporarily override their hotbar slots. Cooling skills stay visible, but cannot be used until ready.':'Use any Stage 1 attack to open Stage 2. F1–F3 remain available for normal hotbar assignments.'}</p><div class="bb-combo-options">${(stage?BB_CHAIN[stage+1]:BB_CHAIN[1]).map((id,i)=>{const sk=craftSkill(id),cool=stage?bbChainCooldown(id):0;return `<button type="button" data-bb-combo="${i}" data-bb-skill="${esc(id)}" class="${cool>0?'bb-on-cooldown':''}" ${!craftSession||!stage||cool>0?'disabled':''} aria-label="${stage?'Use':'Preview'} ${esc(sk?.name||id)}${cool>0?', cooldown '+cool.toFixed(1)+' seconds':''}"><kbd>${i+1}</kbd>${sk?craftIcon(sk):''}<span>${esc(sk?.name||id)}</span><small class="bb-cooldown-time" ${cool>0?'':'hidden'}>${cool>0?cool.toFixed(1)+'s':''}</small></button>`}).join('')}</div></section>`}
function bbChainUpdate(){const el=$('bb-combo-box');if(el)el.outerHTML=bbChainMarkup()}
function bbChainCooldownTick(){if(state.arcana!=='bb'||!craftSession)return;const root=$('bb-combo-box');if(!root)return;for(const btn of root.querySelectorAll('[data-bb-skill]')){const left=craftSession.bbComboStage?bbChainCooldown(btn.dataset.bbSkill):0;const cooling=left>0;btn.classList.toggle('bb-on-cooldown',cooling);btn.disabled=!craftSession.bbComboStage||cooling;const timer=btn.querySelector('.bb-cooldown-time');if(timer){timer.hidden=!cooling;timer.textContent=cooling?left.toFixed(1)+'s':''}const sk=craftSkill(btn.dataset.bbSkill);btn.setAttribute('aria-label',`${craftSession.bbComboStage?'Use':'Preview'} ${sk?.name||btn.dataset.bbSkill}${cooling?', cooldown '+left.toFixed(1)+' seconds':''}`)}}
function bbPummelKeyLabel(){return craftSession?.bbPummel?.key||'1'}
function bbPummelMarkup(){const p=craftSession?.bbPummel;if(!p)return '';return `<div class="bb-pummel-panel" id="bb-pummel-panel" aria-live="polite"><strong>Pummel — Rapid Press!</strong><p>Press <kbd>${esc(p.key)}</kbd> 10 times before the five-second animation finishes. <span id="bb-pummel-count">0 / 10</span></p><div class="bb-pummel-track"><div id="bb-pummel-fill" style="width:0%"></div></div><small id="bb-pummel-time">5.0s remaining</small></div>`}
function bbPummelInput(key){const p=craftSession?.bbPummel;if(!p||key.toLowerCase()!==p.key.toLowerCase())return false;if(performance.now()>p.end)return true;p.count=Math.min(10,p.count+1);const label=$('bb-pummel-count');if(label)label.textContent=p.count+' / 10';const fill=$('bb-pummel-fill');if(fill)fill.style.width=p.count*10+'%';if(p.count===10)craftMessage('Pummel · 10/10 rapid inputs!');return true}
function bbPummelBegin(key){if(!craftSession)return;const now=performance.now();craftSession.bbPummel={key:key||'1',count:0,end:now+5000};const stage=$('bb-combo-box');if(stage)stage.insertAdjacentHTML('afterend',bbPummelMarkup());craftMessage('Pummel! Tap '+(key||'1')+' ten times quickly.');}
function bbPummelTick(){const p=craftSession?.bbPummel;if(!p)return;const remaining=Math.max(0,(p.end-performance.now())/1000);const el=$('bb-pummel-time');if(el)el.textContent=remaining.toFixed(1)+'s remaining';if(remaining<=0){const total=p.count;craftSession.bbPummel=null;$('bb-pummel-panel')?.remove();craftMessage('Pummel complete · '+total+'/10 rapid inputs.')}}
function bbChainInput(index){if(state.arcana!=='bb'||!craftSession||!craftSession.bbComboStage)return;const session=craftSession,stage=session.bbComboStage+1,skill=bbChainSkill(stage,index);if(!skill)return;if(bbChainCooldown(skill.id)>0){craftMessage(skill.name+' is cooling down.');return;}const actions=session.actions.length;craftFire(skill);if(craftSession!==session||session.actions.length===actions)return;session.bbComboStage=stage===3?0:stage;bbChainUpdate();if(skill.id==='pummel')bbPummelBegin(String(index+1))}
function craftNextMarkup(){const seq=craftSession?.sequence||craftProfile().sequence;const idx=craftSession?.index||0;if(seq.length){const key=seq[idx%seq.length],skill=craftSkill(craftProfile().slots[key]);return `<div class="craft-next-card">${skill?craftIcon(skill):''}<div><strong>${esc(skill?.name||key)}</strong><small>Next expected key: ${esc(key)}</small></div></div>`}return 'Free practice · no required rotation'}
function craftView(){const meta=craftMeta();const profile=craftProfile();return `<h2>${esc(meta.name)} · Rotation Crafter</h2><div class="craft-layout"><section class="craft-primary">${craftSequenceEditor()}<div class="craft-bar-head"><strong>Skill Bar</strong><button id="craft-drawer-toggle" aria-expanded="${craftDrawer}" aria-controls="craft-drawer">${craftDrawer?'Close skills':'Skills ☷'}</button></div><div class="craft-hotbar"><div class="craft-hotbar-row">${craftKeys.slice(12).map(craftSlot).join('')}</div><div class="craft-hotbar-row">${craftKeys.slice(0,12).map(craftSlot).join('')}</div></div><p id="craft-assignment-help" class="hint">Drag or tap a skill, then choose a slot. During practice, tap or hold an assigned hotkey to cast. Right-click or long-press a slot to clear it.</p>${craftDamagePanel()}<div class="craft-stage">${['as','fa'].includes(state.arcana)?`<div class="craft-orbs" id="craft-orbs" aria-label="Alchemy orbs">${craftOrbMarkup()}</div>${state.arcana==='fa'?'<p class="hint craft-fa-orb-note">Practice-only orb estimates. Elemental attacks build their matching orb; Serpentcall spends all four.</p>':''}`:''}<div id="craft-next" class="craft-next">${craftNextMarkup()}</div>${state.arcana==='ag'?'<div class="ag-energy-panel"><strong>Transmutation Energy</strong><div class="ag-energy-bullets" id="craft-ag-energy" aria-live="polite"></div><small id="craft-ag-status">Each bullet holds 100 energy. Gold means ready to spend. Hold Fatal Scope to aim; press its key again for additional re-aim shots.</small></div>':''}${state.arcana==='ek'?'<div id="craft-bash-count">Bash stacks: 0/5</div>':''}${state.arcana==='sg'?'<div id="craft-sg-warning" class="craft-sg-warning" aria-live="polite">Watch the dummy; use your assigned Rend Armor hotkey during the parry window.</div><div id="craft-virtue" aria-live="polite">Virtue: 0 / 100</div><div id="craft-pledge">Pledge inactive</div>':''}${state.arcana==='bb'?bbChainMarkup():''}${craftScene()}<div id="craft-charge-meter" class="craft-charge-meter" hidden><div id="craft-charge-fill"></div><span id="craft-charge-label">Charging…</span></div><p class="hint" id="craft-feedback" aria-live="polite">Assign your skills, then Begin. Hold Bullet Barrage for up to 3 seconds to gain energy; release after at least 0.5s. Focused Fist also supports charging; Pummel needs ten rapid presses.</p></div><div class="craft-bottom"><label>Duration <select id="craft-duration"><option value="30" ${state.settings.craftDuration===30?'selected':''}>30 sec</option><option value="60" ${state.settings.craftDuration===60?'selected':''}>60 sec</option><option value="120" ${state.settings.craftDuration===120?'selected':''}>2 min</option><option value="300" ${state.settings.craftDuration===300?'selected':''}>5 min</option></select></label><button class="primary" id="craft-begin" ${craftSession?'hidden':''}>Begin</button><button id="craft-finish" ${craftSession?'':'hidden'}>Finish</button><span class="hint" id="craft-timer"></span></div></section>${craftDrawerContent()}</div>`}
function craftMessage(msg){const node=$('craft-feedback');if(node)node.textContent=msg}
function craftRandomSaintTargets(){const count=1+Math.floor(Math.random()*3),pool=[...saintTargetRoster].sort(()=>Math.random()-.5).slice(0,count);return pool.map(p=>({...p,hp:60+Math.floor(Math.random()*31),drainRate:1.15+Math.random()*1.1}))}
// Cosmetic support pressure only: allies never die or disappear when their HP reaches zero.
function craftSaintHealthTick(now){const s=craftSession;if(state.arcana!=='hs'||!s||!s.saintTargets?.length)return;const last=s.saintHealthTick??now;const dt=Math.min(.3,Math.max(0,(now-last)/1000));s.saintHealthTick=now;if(!dt)return;for(const [i,t] of s.saintTargets.entries()){t.hp=Math.max(0,t.hp-(t.drainRate||1.6)*dt);const bar=document.querySelector(`[data-heal-target="${i}"] .ally-health span`);if(bar){bar.style.width=t.hp.toFixed(2)+'%';bar.parentElement?.setAttribute('aria-label',`${t.label}: ${Math.round(t.hp)}% HP`);bar.parentElement?.classList.toggle('ally-health-low',t.hp<26);}}}
function craftUpdateSaintDom(){if(state.arcana!=='hs'||!craftSession)return;const wrap=$('craft-animation');if(!wrap)return;wrap.outerHTML=craftSaintScene()}
function craftSgDelay(){return 3000+Math.random()*7000}
function craftSgEnemyVisual(phase){const stage=$('craft-animation');if(stage&&stage.dataset.scene==='guardian')stage.dataset.sgAttack=phase;const warning=$('craft-sg-warning');if(warning){warning.textContent=phase==='windup'?'Guardian winding up — watch the weapon!':phase==='window'?'PARRY WINDOW — press your Rend Armor hotkey!':phase==='strike'?'The dummy swings!':phase==='blocked'?'Perfect parry! +7 Virtue · Rend Armor ready':phase==='miss'?'Missed. No damage or penalty.':'Watch the dummy for its next attack.';warning.dataset.phase=phase}}
function craftSgEnemyUpdate(now){const attack=craftSession?.sgEnemy;if(!attack||state.page!=='rotation'||rotationView!=='craft')return;
 if(attack.phase==='idle'&&now>=attack.next){attack.phase='windup';attack.started=now;attack.parried=false;craftSgEnemyVisual('windup')}
 if(attack.phase==='windup'&&now-attack.started>=850){attack.phase='window';craftSgEnemyVisual('window')}
 if(attack.phase==='window'&&now-attack.started>=1700){attack.phase='strike';attack.struck=now;craftSgEnemyVisual('strike')}
 if(attack.phase==='strike'&&now-attack.struck>=400){attack.phase='miss';attack.finished=now;craftSgEnemyVisual('miss')}
 if((attack.phase==='miss'||attack.phase==='blocked')&&now-attack.finished>=650){attack.phase='idle';attack.next=now+craftSgDelay();craftSgEnemyVisual('idle')}
}
function craftSgParry(now=performance.now()){craftSgEnemyUpdate(now);const session=craftSession,attack=session?.sgEnemy;if(state.arcana!=='sg'||!attack||attack.phase!=='window'||now-attack.started<850||now-attack.started>=1700)return false;session.virtue=Math.min(100,(session.virtue||0)+7);session.ready.rend=0;attack.parried=true;attack.phase='blocked';attack.finished=now;craftSgEnemyVisual('blocked');return true;}
function craftStateTick(now){const s=craftSession;if(!s)return;
 if(state.arcana==='ek'&&s.bashStacks>0&&Number.isFinite(s.bashExpires)){
  while(s.bashStacks>0&&now>=s.bashExpires){s.bashStacks--;s.bashExpires+=20000;}
 }
 if(state.arcana==='sg'){
  if(s.pledgeUntil>0&&now>=s.pledgeUntil)s.pledgeUntil=0;
  const stage=$('craft-animation');if(stage&&stage.dataset.scene==='guardian')stage.classList.toggle('sg-pledge-active',s.pledgeUntil>now);
  const indicator=$('craft-pledge');if(indicator)indicator.textContent=s.pledgeUntil>now?'Pledge active · '+((s.pledgeUntil-now)/1000).toFixed(1)+'s':'Pledge inactive';
 }
 const bash=$('craft-bash-count');if(bash)bash.textContent='Bash stacks: '+(s.bashStacks||0)+'/5'+(s.bashStacks?' · next decay '+(Math.max(0,s.bashExpires-now)/1000).toFixed(1)+'s':'');
}
function craftUpdate(){const frameNow=performance.now();craftStateTick(frameNow);craftSaintHealthTick(frameNow);if(craftSession&&state.arcana==='sg'){craftSgEnemyUpdate(performance.now());craftSgEnemyVisual(craftSession.sgEnemy.phase);const now=performance.now(),g=craftProfile().gear||{},dt=Math.max(0,now-(craftSession.lastVirtueTick||now))/1000;craftSession.lastVirtueTick=now;if(craftSession.oathActive)craftSession.virtue=Math.min(100,craftSession.virtue+dt*Math.max(0,Number(g.sgOathVirtue??0.5))*(1+Math.max(0,Number(g.sgRelic)||0)/100));if(craftSession.pledgeUntil>now)craftSession.virtue=Math.min(100,craftSession.virtue+dt/1.5);const readout=$('craft-virtue');if(readout)readout.textContent='Virtue: '+craftSession.virtue.toFixed(1)+' / 100 · Oath '+(craftSession.oathActive?'active':'inactive')}if(state.page!=='rotation'||rotationView!=='craft')return;if(['as','fa'].includes(state.arcana))craftUpdateOrbs();const beginControl=$('craft-begin'),finishControl=$('craft-finish');if(beginControl)beginControl.hidden=!!craftSession;if(finishControl)finishControl.hidden=!craftSession;if(state.arcana==='ag')craftAgEnergyPaint();if(state.arcana==='bb'){bbChainCooldownTick();bbPummelTick();}const profile=craftProfile();for(const k of craftKeys){const el=document.querySelector(`[data-craft-cool="${CSS.escape(k)}"]`);if(!el)continue;const sk=craftSkill(profile.slots[k]);const left=sk&&craftSession?Math.max(0,(craftSession.ready[sk.id]||0)-performance.now())/1000:0;el.textContent=left?left.toFixed(1)+'s':'';el.closest('.craft-slot')?.classList.toggle('cooling',left>0)}const next=$('craft-next');if(next)next.innerHTML=craftNextMarkup();craftDamageUpdate();if(craftSession){const timer=$('craft-timer');if(timer)timer.textContent=Math.max(0,(craftSession.end-performance.now())/1000).toFixed(0)+'s';if(performance.now()>=craftSession.end)craftEnd()}}
function craftBegin(){if(craftSession)craftEnd();const seconds=Number($('craft-duration')?.value)||60;state.settings.craftDuration=seconds;save();const profile=craftProfile();craftSession={start:performance.now(),end:performance.now()+seconds*1000,ready:{},busyUntil:0,orbs:{fire:0,water:0,wind:0,earth:0},triBusy:false,triTimers:[],actions:[],damageReference:craftDamageReference(),sequence:profile.sequence.filter(k=>craftSkill(profile.slots[k])),index:0,hand:'left',saintTargets:state.arcana==='hs'?craftRandomSaintTargets():[],saintHealthTick:performance.now(),virtue:0,pledgeUntil:0,zealousStage:1,bashStacks:0,bashExpires:0,oathActive:state.arcana==='sg'&&!!profile.gear?.sgOathStart,lastVirtueTick:performance.now(),transmutation:0,agMarks:0,agCrestUntil:0,agTracerUntil:0,agFieldUntil:0,agFatalReaim:false,agFatalKey:null,bbComboStage:0,bbPummel:null,sgEnemy:state.arcana==='sg'?{phase:'idle',next:performance.now()+craftSgDelay(),parried:false}:null};$('craft-begin').hidden=true;$('craft-finish').hidden=false;if(state.arcana==='hs')craftUpdateSaintDom();craftMessage('Ready. Use your assigned keys.');craftSession.clock=setInterval(craftUpdate,85);bbChainUpdate();craftUpdate()}
function craftEnd(){if(!craftSession)return;const s=craftSession;clearInterval(s.clock);(s.triTimers||[]).forEach(clearTimeout);craftSession=null;craftCharge=null;craftSgEnemyVisual('idle');state.drillHistory.push({type:'craft-'+state.arcana,date:Date.now(),actions:s.actions.length,seconds:Math.max(1,(performance.now()-s.start)/1000),sequence:s.sequence.join(' ')});save();if($('craft-begin'))$('craft-begin').hidden=false;if($('craft-finish'))$('craft-finish').hidden=true;$('craft-charge-meter')?.setAttribute('hidden','');craftDamageCompleted(s);craftMessage('Finished · '+s.actions.length+' accepted skill actions.');if(state.arcana==='hs')craftUpdateSaintDom();craftUpdate()}
function craftProjectileHue(skill){if(state.arcana==='fa'){const cycle=['dust','fire','wind','water'];const idx=((craftSession?.actions?.length||0)-1)%cycle.length;return cycle[idx]}return ''}
function craftAnimateAction(skill,{celebrate=false}={}){const stage=$('craft-animation');if(!stage)return;const hand=craftSession?craftSession.hand=(craftSession.hand==='left'?'right':'left'):'right';stage.dataset.hand=hand;stage.dataset.effect=craftProjectileHue(skill);stage.classList.remove('acting','projectile','melee','left','right');void stage.offsetWidth;const scene=craftMeta().scene;const projectileScenes=new Set(['archer','mage','guns','alch']);const type=scene==='puppet'?'strings':scene==='guardian'?'block':scene==='brawler'?'punch':scene==='lance'?'thrust':scene==='dual'?'slash':scene==='guns'?'firearms':scene==='alch'?'alchemy':scene==='mage'?'cast':'bow';stage.dataset.attackStyle=type;stage.classList.add('acting',projectileScenes.has(scene)?'projectile':'melee',hand);if(celebrate)craftCelebrate();setTimeout(()=>{if(stage.isConnected)stage.classList.remove('acting','projectile','melee','left','right')},430)}
function craftApplySaintHeal(skill){if(state.arcana!=='hs'||!craftSession)return;const party=craftSession.saintTargets;const multi=['partyheal','blessing','echoes','hymn','pall','pulse','voice'].includes(skill.id);const targets=multi?party.map((_,i)=>i):party.length?[Math.floor(Math.random()*party.length)]:[];for(const i of targets){const t=party[i];if(!t)continue;t.hp=Math.min(100,t.hp+(skill.id==='heal'||skill.id==='hand'?26:18));const card=document.querySelector(`[data-heal-target="${i}"]`);if(card){card.classList.remove('heal-pop');void card.offsetWidth;card.classList.add('heal-pop');const bar=card.querySelector('.ally-health span');if(bar)bar.style.width=t.hp+'%';}}setTimeout(()=>document.querySelectorAll('.craft-ally-card.heal-pop').forEach(el=>el.classList.remove('heal-pop')),650)}
function craftUseRotationProgress(skillId){if(!craftSession?.sequence.length)return;const profile=craftProfile();const actual=craftKeys.find(k=>profile.slots[k]===skillId);const expected=craftSession.sequence[craftSession.index%craftSession.sequence.length];if(actual===expected)craftSession.index++}
function craftIsFighterSkill(skill){return /^(talent-(focused-fist|charging-strike|spinning-uppercut|pummel|drop-kick|somersault-kick|tumble)|combo|charging|uppercut|pummel|focusfist|dropkick|somersault|tumble|respite|counterpunch|talent-counter-punch|dashpunch)/i.test(skill.id)&&!/(ignite|piercing|radiant|earthshaker)/i.test(skill.id)}
function craftIsBbIgniteOrCombo(skill){return /^(hammer|flurry|cyclone|ignite|talent-ignite-|talent-(focused-fist|charging-strike|spinning-uppercut|pummel|drop-kick|somersault-kick)|chargingstrike|uppercut|pummel|focusfist|dropkick|somersault|counterpunch|talent-counter-punch|combo)/i.test(skill.id)}
function craftAgEnergyPaint(){const host=$('craft-ag-energy');if(!host)return;const energy=Math.max(0,Math.min(500,Number(craftSession?.transmutation)||0));host.innerHTML=Array.from({length:5},(_,i)=>{const fill=Math.max(0,Math.min(100,energy-i*100));return `<span class="ag-bullet ${fill>=100?'charged':fill>0?'partial':'empty'}" title="Bullet ${i+1}: ${Math.round(fill)}%" style="--ag-fill:${fill}%">⬤</span>`}).join('');host.setAttribute('aria-label',`${Math.round(energy)} of 500 Transmutation Energy (${(energy/100).toFixed(2)} of 5 bullets)`)}
function craftBarrageFinish(heldSeconds){if(!craftSession||state.arcana!=='ag')return;const duration=Math.max(.5,Math.min(3,Number(heldSeconds)||0));const energy=Math.round(60+(duration-.5)/2.5*240);const cooldown=1+(duration-.5)/2.5*8;const skill=craftSkill('barrage');const before=craftSession.actions.length;craftFire(skill,{barrage:{duration,energy,cooldown}});if(craftSession&&craftSession.actions.length>before)craftMessage(`Bullet Barrage · ${duration.toFixed(2)}s firing · +${energy} energy · ${cooldown.toFixed(1)}s cooldown`)}

function craftFire(skill,options={}){if(!craftSession||craftSession.triBusy)return;const session=craftSession,now=performance.now();session.sgParrySuccess=false;if((session.ready[skill.id]||0)>now && !(state.arcana==='ek'&&skill.id==='flashing'&&(session.bashStacks||0)>0&&session.bashExpires>now)){craftMessage(skill.name+' is cooling down.');return}if(session.busyUntil>now){craftMessage('Action delay still active.');return}if(state.arcana==='sg'&&skill.id==='retribution'&&session.virtue<100){craftMessage('Divine Retribution requires 100 Virtue.');return}if(state.arcana==='as'&&skill.id==='tri'&&(session.orbs.fire<craftOrbMax||session.orbs.water<craftOrbMax)){craftMessage('Tri-Assault needs full Fire and Water orbs.');return}if(state.arcana==='ag'){
 if(['detonation','tracer','crest'].includes(skill.id)&&session.transmutation<100){craftMessage(skill.name+' needs one full Energy Bullet.');return}
 if(options.fatalFollowup&&session.transmutation<100){craftMessage('Fatal Scope re-aim needs one full Energy Bullet.');return}
}
const flashingCooling=state.arcana==='ek'&&skill.id==='flashing'&&(session.ready.flashing||0)>now;let cooldown=state.arcana==='ev'?craftEvCooldown(skill):craftFieldNumber(skill,'cd');if(state.arcana==='ag'&&skill.id==='barrage'&&options.barrage)cooldown=options.barrage.cooldown;const gear=craftProfile().gear||{};
if(state.arcana==='mp'){const puppet=/^(act[0-9]|puppet|summon|desummon)/i.test(skill.id);if(puppet)cooldown=Math.max(0,cooldown*(1-(gear.ergS50?0.5:0)-(gear.puppetSet?0.5:0)));if(gear.mpLinkX&&/chorus|cutting/i.test(skill.id))cooldown=Math.max(0,cooldown-2);if(/summon|desummon/i.test(skill.id))cooldown=Math.max(2,cooldown)}
if(state.arcana==='bb'&&gear.knuckleErgS50&&craftIsFighterSkill(skill))cooldown*=0.5;
if(!flashingCooling)session.ready[skill.id]=now+cooldown*1000;
if(state.arcana==='bb'){
 const hits=/^(pummel|talent-pummel|talent-somersault-kick|somersault)$/i.test(skill.id)?3:Math.max(1,Math.min(24,Math.floor(Number(gear.critHits)||1)));
 const crits=Array.from({length:hits},()=>Math.random()*100<Math.max(0,Math.min(100,Number(gear.critChance)||0)));
 const isIgnite=/^(hammer|flurry|cyclone|talent-ignite-|ignite)/i.test(skill.id);
 // A crit from any Ignite or Combo attack refreshes Tumble, independently of Link 5 and equipment resets.
 const isCombo=/^(talent-(focused-fist|charging-strike|spinning-uppercut|pummel|drop-kick|somersault-kick)|chargingstrike|uppercut|pummel|focusfist|dropkick|somersault|counterpunch|talent-counter-punch|combo)/i.test(skill.id);
 if((isIgnite||isCombo)&&crits.some(Boolean))for(const tumbleId of ['talent-tumble','tumble'])session.ready[tumbleId]=now;
 // Link 5 reduces REMAINING cooldowns by a fraction of each skill's full configured cooldown per crit.
 // Never decrease cooldowns that are already ready, and never create negative cooldowns.
 if(gear.bbLink5&&isIgnite){const count=crits.filter(Boolean).length;
  if(count)for(const ability of craftSkills())if(craftIsBbIgniteOrCombo(ability)){
   const full=craftFieldNumber(ability,'cd')*(gear.knuckleErgS50&&craftIsFighterSkill(ability)?.5:1);
   if((session.ready[ability.id]||0)>now)session.ready[ability.id]=Math.max(now,session.ready[ability.id]-full*200*count);
  }
  session.bbLastLinkCrits=count;
 }
 if(gear.critReset&&crits.some(critical=>critical&&Math.random()<0.5)){
  for(const ability of craftSkills())if(craftIsFighterSkill(ability))session.ready[ability.id]=now;
  session.lastCritReset=true;
 }else session.lastCritReset=false;
}session.busyUntil=now+craftFieldNumber(skill,'lock')*1000;session.actions.push({skill:skill.id,time:(now-session.start)/1000});if(state.arcana==='bb'&&bbChainStage(skill.id)===1){session.bbComboStage=1;bbChainUpdate();}
if(state.arcana==='ek'){
 if(skill.id==='bash'){
  session.bashStacks=Math.min(5,(session.bashStacks||0)+((gear.ekHitConfirmed===false)?0:(gear.ekWeapon==='dual'?2:1)));
  session.bashExpires=now+20000;
 }
 if(skill.id==='flashing'&&flashingCooling&&session.bashStacks>0)session.bashStacks--;if(gear.ekWeapon==='twohand'&&gear.ekSpirit&&Math.random()*100<(Number(gear.ekSpiritChance)||0))session.ready.rageimpact=now;
}
if(state.arcana==='ag'){
 if(skill.id!=='fatal')session.agFatalReaim=false;
 const spending=['detonation','tracer','crest'];
 if(spending.includes(skill.id))session.transmutation-=100;
 if(skill.id==='barrage'&&options.barrage)session.transmutation=Math.min(500,session.transmutation+options.barrage.energy);
 if(skill.id==='artillery'||skill.id==='calamity')session.transmutation=Math.min(500,session.transmutation+100);
 if(skill.id==='fatal'){
  if(options.fatalFollowup){session.transmutation-=100;session.agFatalReaim=true;}
  else {session.transmutation=Math.min(500,session.transmutation+100);session.agFatalReaim=!!options.fatalFullyAimed;session.agFatalKey=options.fatalKey||null;}
 }
 if(skill.id==='crest')session.agCrestUntil=now+240000;
 if(skill.id==='tracer')session.agTracerUntil=now+Math.max(1000,Number(options.tracerDurationMs)||15000);
 if(skill.id==='detonation')session.agFieldUntil=now+Math.max(1000,Number(options.fieldDurationMs)||15000);
 if(session.agCrestUntil>now&&['flashlauncher','rush','storm','grapple','bulletslide'].includes(skill.id))session.transmutation=Math.min(500,session.transmutation+50);
 session.agMarks=session.transmutation/100;
 craftAgEnergyPaint();
}
if(state.arcana==='sg'){
 if(skill.id==='oath'||skill.id==='virtuousoath')session.oathActive=!session.oathActive;
 if(skill.id==='retribution'){session.virtue=0;if(session.pledgeUntil>now)session.pledgeUntil=Math.min(now+15000,session.pledgeUntil+2000);}
 else {
  let gain=0;
  if(skill.id==='pledge')session.pledgeUntil=now+15000;
  if(skill.id==='ardent')gain=1;
  if(skill.id==='rend'){gain=1;if(craftSgParry(now))session.sgParrySuccess=true;}
  if(skill.id==='judgment')gain=10;
  if(skill.id==='zealous'){gain=session.zealousStage-1;session.zealousStage=session.zealousStage===3?1:session.zealousStage+1;}
  session.virtue=Math.min(100,session.virtue+gain);
  if(session.pledgeUntil>now&&['pledge','ardent','rend','judgment','zealous','retribution','provoke'].includes(skill.id)&&skill.id!=='pledge')session.pledgeUntil=Math.min(now+15000,session.pledgeUntil+2000);
 }
}craftUseRotationProgress(skill.id);if(state.arcana==='as'&&skill.id==='tri'){session.orbs.fire=0;session.orbs.water=0;session.triBusy=true;craftUpdateOrbs();craftAnimateAction(skill);craftMessage('Tri-Assault · shot 1 of 3');session.triTimers.push(setTimeout(()=>{if(craftSession!==session)return;craftAnimateAction(skill);craftMessage('Tri-Assault · shot 2 of 3')},320));session.triTimers.push(setTimeout(()=>{if(craftSession!==session)return;craftAnimateAction(skill,{celebrate:true});craftMessage('Tri-Assault · shot 3 of 3!');session.triBusy=false;craftUpdate()},1070))}else{if(state.arcana==='as'){const gain=craftOrbGains[skill.id];if(gain){session.orbs[gain.primary]=Math.min(craftOrbMax,session.orbs[gain.primary]+gain.main);const secondary=craftSecondary(skill.id);session.orbs[secondary]=Math.min(craftOrbMax,session.orbs[secondary]+gain.secondary)}if(skill.id==='golden')for(const element of craftElements)session.orbs[element]=craftOrbMax;craftUpdateOrbs()}if(state.arcana==='fa'){if(['serpent','carnival'].includes(skill.id)){for(const element of craftElements)session.orbs[element]=0;}else{const gain=craftFaOrbGains[skill.id];if(gain)for(const [element,amount] of Object.entries(gain))session.orbs[element]=Math.min(craftOrbMax,session.orbs[element]+amount);}craftUpdateOrbs()}if(state.arcana==='hs')craftApplySaintHeal(skill);craftAnimateAction(skill);craftMessage(session.sgParrySuccess?'Perfect parry! Rend Armor intercepted the strike · +7 Virtue · cooldown reset.':skill.name+' · released!'+(state.arcana==='ek'?' · Bash stacks: '+(session.bashStacks||0):'')+(session.lastCritReset?' · Critical reset!':''))}craftUpdate()}
function craftKeyDown(e){if(state.page!=='rotation'||rotationView!=='craft'||!craftSession||e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;if(state.arcana==='bb'&&craftSession.bbPummel){if(e.key.toLowerCase()===bbPummelKeyLabel().toLowerCase()){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)bbPummelInput(e.key);}return;}if(state.arcana==='bb'&&craftSession.bbComboStage&&/^[123]$/.test(e.key)){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat&&!craftCharge&&!craftSession.triBusy)bbChainInput(Number(e.key)-1);return;}const k=craftKeys.find(k=>k.toLowerCase()===e.key.toLowerCase());if(!k)return;const profile=craftProfile();const sk=craftSkill(profile.slots[k]);if(!sk)return;
if(state.arcana==='ag'&&sk.id==='fatal'&&craftSession.agFatalReaim&&craftSession.agFatalKey===k&&!craftCharge){
 e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;
 if(craftSession.transmutation<100){craftMessage('Fatal Scope · not enough energy for re-aim.');craftSession.agFatalReaim=false;return}
 craftSession.transmutation-=100;craftSession.agMarks=craftSession.transmutation/100;
 craftSession.actions.push({skill:'fatal-followup',time:(performance.now()-craftSession.start)/1000});
 craftAgEnergyPaint();craftAnimateAction(sk);craftMessage('Fatal Scope · re-aim shot! −100 energy');return;
}e.preventDefault();e.stopImmediatePropagation();if(e.repeat||craftCharge||craftSession.triBusy)return;if((craftSession.ready[sk.id]||0)>performance.now()&&!(state.arcana==='ek'&&sk.id==='flashing'&&(craftSession.bashStacks||0)>0&&craftSession.bashExpires>performance.now()))return;if(craftSession.busyUntil>performance.now())return;const charged=craftFieldNumber(sk,'charge')>0;if(charged){const agAimBoost=state.arcana==='ag'&&sk.id==='fatal'&&(craftSession.agTracerUntil>performance.now()||craftSession.agFieldUntil>performance.now());
craftCharge={key:k,skill:sk,start:performance.now(),full:agAimBoost?1000:craftFieldNumber(sk,'charge')};const meter=$('craft-charge-meter');if(meter)meter.hidden=false;const tick=()=>{if(!craftCharge||craftCharge.key!==k)return;const ratio=Math.min(1,(performance.now()-craftCharge.start)/craftCharge.full);if($('craft-charge-fill'))$('craft-charge-fill').style.width=(ratio*100)+'%';if($('craft-charge-label'))$('craft-charge-label').textContent=state.arcana==='ag'&&sk.id==='barrage'?`Bullet Barrage · ${Math.max(.5,ratio*3).toFixed(2)}s / 3.00s`:state.arcana==='ag'&&sk.id==='fatal'?`Fatal Scope aim · ${Math.round(ratio*100)}% (${(craftCharge.full/1000).toFixed(1)}s full aim)`:ratio===1?'Fully charged · release!':'Charging…';if(ratio>=1&&state.arcana==='ag'&&sk.id==='barrage'){const held=craftCharge;craftCharge=null;$('craft-charge-meter')?.setAttribute('hidden','');craftBarrageFinish(3);return}if(ratio<1)craftCharge.frame=requestAnimationFrame(tick)};tick()}else{const before=craftSession.actions.length;craftFire(sk);if(state.arcana==='bb'&&sk.id==='pummel'&&craftSession&&craftSession.actions.length>before)bbPummelBegin(k)}}
function craftKeyUp(e){if(!craftCharge)return;const k=craftCharge.key;if(e.key.toLowerCase()!==k.toLowerCase())return;e.preventDefault();e.stopImmediatePropagation();const skill=craftCharge.skill;const heldStart=craftCharge.start;const fraction=Math.min(1,(performance.now()-craftCharge.start)/craftCharge.full);cancelAnimationFrame(craftCharge.frame);craftCharge=null;$('craft-charge-meter')?.setAttribute('hidden','');if(state.arcana==='ag'&&skill.id==='barrage'){craftBarrageFinish(Math.max(.5,(performance.now()-heldStart)/1000));return}if(!craftSession?.triBusy){const before=craftSession?.actions.length||0;craftFire(skill,state.arcana==='ag'&&skill.id==='fatal'?{fatalFullyAimed:fraction>=1,fatalKey:k}:{});if(state.arcana==='bb'&&skill.id==='focusfist'&&craftSession&&craftSession.actions.length>before)craftMessage('Focused Fist · '+(fraction>=1?'fully charged':'released at '+Math.round(fraction*100)+'% charge'))}}
function craftAssign(key,id){if(!craftKeys.includes(key)||!craftSkill(id))return;craftProfile().slots[key]=id;save();render()}
function craftMove(from,to){const profile=craftProfile();if(!craftKeys.includes(from)||!craftKeys.includes(to)||from===to)return;const previous=profile.slots[to];profile.slots[to]=profile.slots[from];if(previous)profile.slots[from]=previous;else delete profile.slots[from];save();render()}
function craftClearSlot(key){const profile=craftProfile();delete profile.slots[key];profile.sequence=profile.sequence.filter(k=>k!==key);save();render()}
function craftEvRefresh(){
 if(state.arcana!=='ev'||craftSession)return;
 const outer=document.querySelector('details.craft-builder');
 const inner=document.querySelector('details.craft-secondary-config');
 const outerOpen=!!outer?.open,innerOpen=!!inner?.open;
 render();
 if(outerOpen){const next=document.querySelector('details.craft-builder');if(next)next.open=true;}
 if(innerOpen){const next=document.querySelector('details.craft-secondary-config');if(next)next.open=true;}
}
// Mobile pointer input feeds the SAME hotkey handlers used by physical keyboards.
// This preserves charging, cooldowns, BB combo stages, Pummel, and Fatal Scope re-aim.
let craftTouchDrag=null,craftTouchHotkey=null,craftTouchLongPress=null,craftTouchSuppressClickUntil=0;
function craftTouchKeyEvent(key){return {key,repeat:false,altKey:false,ctrlKey:false,metaKey:false,preventDefault(){},stopImmediatePropagation(){}}}
function craftTouchRelease(){if(!craftTouchHotkey)return;const active=craftTouchHotkey;craftTouchHotkey=null;craftKeyUp(craftTouchKeyEvent(active.key));active.el?.classList.remove('craft-touch-pressed')}
function craftTouchDragEnd(cancelled=false){const drag=craftTouchDrag;if(!drag)return;craftTouchDrag=null;drag.ghost?.remove();document.querySelectorAll('.craft-touch-target').forEach(el=>el.classList.remove('craft-touch-target'));if(cancelled||!drag.moved)return;craftTouchSuppressClickUntil=performance.now()+450;const target=document.elementFromPoint(drag.x,drag.y)?.closest('[data-craft-key]');if(!target)return;if(drag.kind==='skill')craftAssign(target.dataset.craftKey,drag.value);else craftMove(drag.value,target.dataset.craftKey);craftSelected=null}
function craftTouchBind(){
 document.querySelectorAll('[data-craft-skill]').forEach(el=>{
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.button!==0)return;craftTouchDrag={pointer:e.pointerId,kind:'skill',value:el.dataset.craftSkill,source:el,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,ghost:null};el.setPointerCapture?.(e.pointerId)});
  el.addEventListener('pointermove',e=>{const d=craftTouchDrag;if(!d||d.pointer!==e.pointerId)return;d.x=e.clientX;d.y=e.clientY;if(!d.moved&&Math.hypot(d.x-d.startX,d.y-d.startY)>9){d.moved=true;const ghost=document.createElement('div');ghost.className='craft-touch-ghost';ghost.textContent=el.querySelector('strong')?.textContent||'Skill';document.body.appendChild(ghost);d.ghost=ghost}if(d.moved){e.preventDefault();d.ghost.style.left=d.x+'px';d.ghost.style.top=d.y+'px';document.querySelectorAll('.craft-touch-target').forEach(n=>n.classList.remove('craft-touch-target'));document.elementFromPoint(d.x,d.y)?.closest('[data-craft-key]')?.classList.add('craft-touch-target')}});
  el.addEventListener('pointerup',e=>{if(craftTouchDrag?.pointer===e.pointerId)craftTouchDragEnd()});el.addEventListener('pointercancel',e=>{if(craftTouchDrag?.pointer===e.pointerId)craftTouchDragEnd(true)});
 });
 document.querySelectorAll('[data-craft-key]').forEach(el=>{
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.button!==0)return;const key=el.dataset.craftKey;if(craftSession&&!craftSelected&&craftSkill(craftProfile().slots[key])){craftTouchRelease();craftTouchHotkey={pointer:e.pointerId,key,el};el.classList.add('craft-touch-pressed');el.setPointerCapture?.(e.pointerId);craftKeyDown(craftTouchKeyEvent(key));return}if(!craftSession&&!craftSelected&&craftSkill(craftProfile().slots[key])){craftTouchDrag={pointer:e.pointerId,kind:'slot',value:key,source:el,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,ghost:null};el.setPointerCapture?.(e.pointerId);craftTouchLongPress=setTimeout(()=>{if(craftTouchDrag?.pointer===e.pointerId&&!craftTouchDrag.moved){craftTouchDragEnd(true);craftClearSlot(key)}},650)}});
  el.addEventListener('pointermove',e=>{const d=craftTouchDrag;if(!d||d.pointer!==e.pointerId||d.kind!=='slot')return;d.x=e.clientX;d.y=e.clientY;if(!d.moved&&Math.hypot(d.x-d.startX,d.y-d.startY)>10){clearTimeout(craftTouchLongPress);d.moved=true;d.ghost=document.createElement('div');d.ghost.className='craft-touch-ghost';d.ghost.textContent=d.value;document.body.appendChild(d.ghost)}if(d.moved){e.preventDefault();d.ghost.style.left=d.x+'px';d.ghost.style.top=d.y+'px';document.querySelectorAll('.craft-touch-target').forEach(n=>n.classList.remove('craft-touch-target'));document.elementFromPoint(d.x,d.y)?.closest('[data-craft-key]')?.classList.add('craft-touch-target')}});
  el.addEventListener('pointerup',e=>{clearTimeout(craftTouchLongPress);if(craftTouchHotkey?.pointer===e.pointerId)craftTouchRelease();if(craftTouchDrag?.pointer===e.pointerId)craftTouchDragEnd()});el.addEventListener('pointercancel',e=>{clearTimeout(craftTouchLongPress);if(craftTouchHotkey?.pointer===e.pointerId)craftTouchRelease();if(craftTouchDrag?.pointer===e.pointerId)craftTouchDragEnd(true)});
 });
}
function craftBind(){if(state.page!=='rotation'||rotationView!=='craft')return;document.querySelectorAll('[data-craft-gear]').forEach(el=>el.addEventListener('change',()=>{craftProfile().gear??={};craftProfile().gear[el.dataset.craftGear]=el.checked;save();craftEvRefresh()}));document.querySelectorAll('[data-craft-option]').forEach(el=>el.addEventListener('change',()=>{craftProfile().gear??={};craftProfile().gear[el.dataset.craftOption]=el.value;save()}));document.querySelectorAll('[data-craft-number]').forEach(el=>el.addEventListener('change',()=>{craftProfile().gear??={};craftProfile().gear[el.dataset.craftNumber]=Math.max(Number(el.min)||0,Math.min(Number(el.max)||100,Number(el.value)||0));save();craftEvRefresh()}));document.querySelectorAll('[data-craft-crit]').forEach(el=>el.addEventListener('change',()=>{craftProfile().gear??={};craftProfile().gear.critChance=Math.max(0,Math.min(100,Number(el.value)||0));save()}));document.querySelectorAll('[data-craft-secondary]').forEach(sel=>sel.addEventListener('change',()=>{craftProfile().secondary[sel.dataset.craftSecondary]=sel.value;save();craftMessage('Secondary orb choice saved.')}));document.querySelectorAll('[data-craft-setting]').forEach(input=>input.addEventListener('change',()=>{const profile=craftProfile();const id=input.dataset.craftSetting,field=input.dataset.field;profile.skillSettings[id]??={};profile.skillSettings[id][field]=field==='charge'?Math.max(0,Number(input.value)||0):Math.max(0,Number(input.value)||0);save();if(rotationView==='craft')render()}));$('craft-drawer-toggle')?.addEventListener('click',()=>{craftDrawer=!craftDrawer;render()});$('craft-drawer-close')?.addEventListener('click',()=>{craftDrawer=false;render()});$('craft-begin')?.addEventListener('click',craftBegin);$('craft-finish')?.addEventListener('click',craftEnd);document.querySelectorAll('[data-craft-skill]').forEach(el=>{el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','skill:'+el.dataset.craftSkill);e.dataTransfer.effectAllowed='copyMove'});el.addEventListener('click',()=>{if(performance.now()<craftTouchSuppressClickUntil||craftSession)return;craftSelected=el.dataset.craftSkill;document.querySelectorAll('[data-craft-skill]').forEach(x=>x.classList.toggle('selected',x.dataset.craftSkill===craftSelected))});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}})});document.querySelectorAll('[data-craft-key]').forEach(el=>{const key=el.dataset.craftKey;el.draggable=!!craftSkill(craftProfile().slots[key]);el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','slot:'+key);e.dataTransfer.effectAllowed='move'});el.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';el.classList.add('drop-ready')});el.addEventListener('dragleave',()=>el.classList.remove('drop-ready'));el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('drop-ready');const data=e.dataTransfer.getData('text/plain');if(data.startsWith('skill:'))craftAssign(key,data.slice(6));else if(data.startsWith('slot:'))craftMove(data.slice(5),key)});el.addEventListener('click',()=>{if(performance.now()<craftTouchSuppressClickUntil)return;if(craftSelected&&!craftSession){const chosen=craftSelected;craftSelected=null;craftAssign(key,chosen)}});el.addEventListener('contextmenu',e=>{e.preventDefault();craftClearSlot(key)})});document.querySelectorAll('[data-craft-add]').forEach(b=>b.addEventListener('click',()=>{craftProfile().sequence.push(b.dataset.craftAdd);save();render()}));document.querySelectorAll('[data-craft-remove]').forEach(b=>b.addEventListener('click',()=>{craftProfile().sequence.splice(Number(b.dataset.craftRemove),1);save();render()}));document.querySelectorAll('[data-craft-clear]').forEach(b=>b.addEventListener('click',()=>{craftProfile().sequence=[];save();render()}));document.querySelectorAll('[data-craft-reset]').forEach(b=>b.addEventListener('click',()=>{craftProfile().skillSettings={};save();render()}));craftTouchBind();craftUpdate()}

// Rotation Crafter damage bridge. Reuses the exact shared non-critical per-hit
// reference used by Rotation Highlights; never reads raw crit damage as the score.
// One accepted action counts as one conservative boss-equivalent strike until
// per-cast strike and multi-target attribution can be independently verified.
let craftDamageLast=null;
function craftDamageReference(){
 if(!rhEligible().length)return null;
 const result=rhBuild();if(!result.baseline?.size)return null;
 const eligible=rhEligible(),names=new Map();
 for(const {p,r} of eligible){
  for(const sk of p.skills||[]){const id=String(sk.skillId??sk.id??'');if(id&&sk.name)names.set(id,sk.name);}
  for(const use of r.skillUseEvents||[])if(use.skillName&&use.skillId!=null)names.set(String(use.skillId),use.skillName);
 }
 const ref=new Map();const ambiguous=new Set();
 for(const [id,entry] of result.baseline){
  const key=rhKey(names.get(String(id))||'');
  if(!key||/^(redoubledoffensive|flare|blast)$/.test(key))continue;
  if(ref.has(key)&&ref.get(key).id!==String(id))ambiguous.add(key);
  else ref.set(key,{...entry,id:String(id),name:names.get(String(id))});
 }
 for(const key of ambiguous)ref.delete(key);
 return {ref,sourceCount:result.eligible,encounters:result.encounters,gate2:result.gate2};
}
function craftDamageCalculate(actions,reference){
 let total=0,matched=0,unmatched=0,estimated=0;const bySkill=new Map();
 for(const a of actions||[]){const skill=craftSkill(a.skill);const key=rhKey(skill?.name||'');const unit=reference?.ref.get(key);
  if(!unit){unmatched++;continue;}
  total+=unit.value;matched++;if(unit.estimated)estimated++;
  const row=bySkill.get(key)||{name:skill.name,count:0,total:0,estimated:unit.estimated};row.count++;row.total+=unit.value;bySkill.set(key,row);
 }
 return {total,matched,unmatched,estimated,bySkill:[...bySkill.values()].sort((a,b)=>b.total-a.total)};
}
function craftDamagePanel(){
 const reference=craftSession?.damageReference||craftDamageReference();
 if(!reference)return '';
 const result=craftSession?craftDamageCalculate(craftSession.actions,reference):craftDamageLast?.arcana===state.arcana&&craftDamageLast?.character===state.characterName?craftDamageLast.result:null;
 return `<section class="craft-damage-panel" aria-label="Estimated rotation damage"><div class="craft-damage-title"><strong>Estimated boss damage</strong><span class="hint">From Rotation Highlights · ${reference.sourceCount} imported player report(s)</span></div><div class="craft-damage-total" id="craft-damage-total">${fmt(Math.round(result?.total||0))}</div><div class="hint" id="craft-damage-breakdown">${result?`${result.matched} scored actions · ${result.unmatched} without matched boss data${result.estimated?' · '+result.estimated+' estimated-value actions':''}`:'Begin practicing to estimate your damage.'}</div><p class="hint">One normalized single-target strike per accepted action; uses the same pooled non-critical skill values as Rotation Highlights. Not actual DPS, a crit simulation, or a verified damage-per-cast model. Unmatched skills add no estimated damage.</p>${result?.bySkill?.length?`<details><summary>Damage by skill</summary>${result.bySkill.map(r=>`<div class="craft-damage-row"><span>${esc(r.name)} ×${r.count}${r.estimated?' · inferred reference':''}</span><strong>${fmt(Math.round(r.total))}</strong></div>`).join('')}</details>`:''}</section>`;
}
function craftDamageUpdate(){
 const element=$('craft-damage-total');if(!element||!craftSession?.damageReference)return;
 const result=craftDamageCalculate(craftSession.actions,craftSession.damageReference);
 element.textContent=fmt(Math.round(result.total));const breakdown=$('craft-damage-breakdown');
 if(breakdown)breakdown.textContent=`${result.matched} scored actions · ${result.unmatched} without matched boss data${result.estimated?' · '+result.estimated+' estimated-value actions':''}`;
}
function craftDamageCompleted(session){
 if(!session.damageReference)return;
 craftDamageLast={arcana:state.arcana,character:state.characterName,result:craftDamageCalculate(session.actions,session.damageReference)};
 const total=$('craft-damage-total'),breakdown=$('craft-damage-breakdown');if(total)total.textContent=fmt(Math.round(craftDamageLast.result.total));
 if(breakdown)breakdown.textContent=`Completed · ${craftDamageLast.result.matched} scored actions · ${craftDamageLast.result.unmatched} unscored${craftDamageLast.result.estimated?' · '+craftDamageLast.result.estimated+' inferred-value actions':''}`;
}
const oldCraftRotation=rotation;
rotation=function(){if(rotationView==='craft')return `<div class="rotation-back"><button data-act="hub:home">← Return to the Arcana Simulators</button></div>`+craftView();return oldCraftRotation()};
const craftRenderOriginal=render;render=function(){craftRenderOriginal();craftBind()};
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-bb-combo]');if(b&&state.page==='rotation'&&rotationView==='craft'&&state.arcana==='bb')bbChainInput(Number(b.dataset.bbCombo))},true);
document.addEventListener('keydown',craftKeyDown,true);document.addEventListener('keyup',craftKeyUp,true);


// Companion-42: Harmonic Saint "Rate isn't a Lie" music buff calculator + simulator.
state.musicBuffLab=state.musicBuffLab&&typeof state.musicBuffLab==='object'?state.musicBuffLab:{inputs:{},slots:{},duration:60};state.musicBuffLab.inputs=state.musicBuffLab.inputs||{};state.musicBuffLab.slots=state.musicBuffLab.slots||{};state.musicBuffLab.duration=Number(state.musicBuffLab.duration||60);if(typeof state.musicBuffLab.calculatorOpen!=='boolean')state.musicBuffLab.calculatorOpen=true;
let musicBuffSession=null,musicBuffDrawer=false,musicBuffSelected=null;
const musicFieldDefs=[
 ['musicGrandmaster','Grandmaster',[['Off',0],['On',5]]],
 ['musicPlayingRankBuff','Playing Rank',[['N',0],['F',1],['E',2],['D',3],['C',4],['B',5],['A',6],['9',7],['8',8],['7',9],['6',10],['5',11],['4',12],['3',13],['2',14],['1',15]]],
 ['musicSongRankBuff','Song Rank',[['N',0],['F',1],['E',2],['D',3],['C',4],['B',5],['A',6],['9',7],['8',8],['7',9],['6',10],['5',11],['4',12],['3',13],['2',14],['1',15]]],
 ['musicPotionBuff','Music Buff Potion',[['No Potion Active',0],['Music Buff Potion (30 min)',2]]],
 ['musicCairbreBugle','Cairbre\'s Bugle',[['No Bugle Active',0],["Cairbre's Bugle",3],['_ of Abundant Blessings',5]]],
 ['roseBraceletBuff','Rose Couples Bracelet',[['Loving Bond Inactive',0],['Loving Bond Active',1]]],
 ['troubadourSetEffectBuff','Set Effect',[['No Set Effect',0],['Troubadour Active',3],['Seraphic Active',5]]],
 ['fairyDragonSonicEffectBuff','Fairy Dragon Sonic Wave',[['Not Summoned',0],['Sonic Wave Bonus',3]]],
 ['musicBuffTitleEffect','Title Effects',null],['musicInstrumentUpgrades','Upgrade Effects',null],['musicBuffEnchants','Enchant Effects',null],['playingInstrumentReforge','Playing Instrument Effect Reforge',null],['homesteadMusicBuffEffect','Homestead Effects',null],['fleurGrassTiaraBuff','Fleur\'s Grass Tiara',null,0,4],
 ['fairyDragonHarmonyEffectBuff','Fairy Dragon Harmony',[['Not Summoned',0],['Harmony Specialty Bonus',2]]],
 ['harmonicSaintLinkEffect','Harmonic Saint Link Effect',[['No Link Bonus',0],['Link IX Bonus',3]]],
 ['itemGradeQuality','Item Grade (Masterwork Quality)',[['No Item Grade',0],['Soul Liberator',7]]],
 ['musicSpecialUpgrades','Special Upgrade',[['Step Upgrade Lv 0',0],['Step Upgrade Lv 1',0.5],['Step Upgrade Lv 2',1],['Step Upgrade Lv 3',1.5],['Step Upgrade Lv 4',2.3],['Step Upgrade Lv 5',3],['Step Upgrade Lv 6',3.8],['Step Upgrade Lv 7',4.5],['Step Upgrade Lv 8',5.5]]],
 ['musicDollBags','Doll Bag Effects',null],['musicMuriasWater','Holy Water of Murias',null],
 ['musicKnowledgeReforge','Musical Knowledge - Reforge',null,0,10],
 ['marchWalkingSpeed','March Song · Walking Speed Reforge',null,0,9999],['marchMountSpeed','March Song · Mount Speed Reforge',null,0,9999],
 ['enduringProtectionReforge','Enduring Melody · Protection Reforge',null,0,3],['enduringMpRecoveryReforge','Enduring Melody · MP Recovery Speed Reforge',null,0,10],['enduringStaminaRecoveryReforge','Enduring Melody · Stamina Recovery Speed Reforge',null,0,10],['harvestGatheringSpeedReforge','Harvest Song · Gathering Speed Reforge',null,0,20],
 ['vivaceMagicCastingReforge','Vivace · Magic Casting Speed Reforge',null,0,20],['vivaceAlchemyCastingReforge','Vivace · Alchemy Casting Speed Reforge',null,0,20],
 ['musicNormalEffect','Normal Performance Effect',null,0,9999],['musicExcellentEffect','Excellent Performance Effect',null,0,9999],['musicInspiringEffect','Inspiring Performance Effect',null,0,9999]
];
const musicBaseEffects={
 'bo_damage':{label:'Battlefield Overture / Vivace Damage',value:0.20,percent:true,digits:2},
 'bo_crit':{label:'Battlefield Overture Critical',value:0.11,percent:true,digits:2},
 'enduring_def':{label:'Enduring Melody Defenses',value:11,percent:false,digits:1},
 'enduring_prot':{label:'Enduring Melody Protections',value:5,percent:false,digits:1},
 'enduring_recovery':{label:'Enduring Melody MP Recovery Speed',value:4.10,percent:true,digits:2},
 'enduring_stamina_recovery':{label:'Enduring Melody Stamina Recovery Speed',value:4.10,percent:true,digits:2},
 'harvest_solo':{label:'Harvest Song Solo Gathering Speed',value:0.25,percent:true,digits:2},
 'harvest_party':{label:'Harvest Song Party Max Gathering Speed',value:0.35,percent:true,digits:2},
 'lullaby_damage':{label:'Lullaby Damage',value:300,percent:false,digits:0},
 'march_ally':{label:'March Song Ally Speed',value:0.12,percent:true,digits:2},
 'march_mount':{label:'March Song Mount Speed',value:0.09,percent:true,digits:2},
 'vivace_speed':{label:'Vivace Attack/Charge Speed',value:0.11,percent:true,digits:2},
 'vivace_magic':{label:'Vivace Magic Casting Speed',value:0.11,percent:true,digits:2},
 'vivace_alchemy':{label:'Vivace Alchemy Casting Speed',value:0.11,percent:true,digits:2}
};
const musicDefaultInputs={musicGrandmaster:0,musicPlayingRankBuff:0,musicSongRankBuff:0,musicPotionBuff:0,musicCairbreBugle:0,roseBraceletBuff:0,troubadourSetEffectBuff:0,fairyDragonSonicEffectBuff:0,musicBuffTitleEffect:0,musicInstrumentUpgrades:0,musicBuffEnchants:0,playingInstrumentReforge:0,homesteadMusicBuffEffect:0,fleurGrassTiaraBuff:0,fairyDragonHarmonyEffectBuff:0,harmonicSaintLinkEffect:0,itemGradeQuality:0,musicSpecialUpgrades:0,musicDollBags:0,musicMuriasWater:0,musicKnowledgeReforge:0,marchWalkingSpeed:0,marchMountSpeed:0,enduringProtectionReforge:0,enduringMpRecoveryReforge:0,enduringStaminaRecoveryReforge:0,harvestGatheringSpeedReforge:0,vivaceMagicCastingReforge:0,vivaceAlchemyCastingReforge:0,musicNormalEffect:0,musicExcellentEffect:0,musicInspiringEffect:0,musicSkillBaseEffectKey:'bo_damage'};
const musicSimSkills=[
 {id:'battlefield',name:'Battlefield Overture',cd:1,shape:'song buff',note:'Min/Max Attack and critical chance party buff'},
 {id:'march',name:'March Song',cd:1,shape:'song buff',note:'Movement speed song'},
 {id:'enduring',name:'Enduring Melody',cd:1,shape:'song buff',note:'Defensive and recovery song'},
 {id:'vivace',name:'Vivace',cd:1,shape:'song buff',note:'Magic / alchemy damage and speed song'},
 {id:'harvest',name:'Harvest Song',cd:1,shape:'song buff',note:'Gathering speed song'},
 {id:'lullaby',name:'Lullaby',cd:3,shape:'debuff song',note:'Sleep-inducing support skill'},
 {id:'dischord',name:'Dischord',cd:3,shape:'debuff song',note:'Movement-speed reduction song'},
 {id:'dance',name:'Dance of Death',cd:6,shape:'aoe performance',note:'Performance pressure skill'},
 {id:'fantastic',name:'Fantastic Chorus',cd:8,shape:'support performance',note:'Supportive chorus effect'},
 {id:'enthralling',name:'Enthralling Performance',cd:8,shape:'control performance',note:'Bewildering performance skill'},
 {id:'encore',name:'Encore',cd:12,shape:'support',note:'Repeat or refresh a recent performance'},
 {id:'instrument',name:'Playing Instrument',cd:0,shape:'performance',note:'Baseline instrument practice'},
 {id:'song',name:'Song',cd:0,shape:'performance',note:'Sing freely without a specific buff'}
];
function musicInputs(){const saved=state.musicBuffLab.inputs||{};
 // Preserve the strongest of the previous tier-specific values on upgrade; do not add them together.
 if(saved.musicKnowledgeReforge===undefined){const legacy=['musicKnowledgeNormalReforge','musicKnowledgeExcellentReforge','musicKnowledgeInspiringReforge'].map(k=>Number(saved[k])||0);saved.musicKnowledgeReforge=Math.max(0,...legacy)}
 state.musicBuffLab.inputs={...musicDefaultInputs,...saved};return state.musicBuffLab.inputs}
function musicValue(key){const v=musicInputs()[key];return typeof v==='number'?v:Number(v)||0}
function musicCalcForKey(key){const data=musicBaseEffects[key];const base=data.value,total=musicValue('musicGrandmaster')+musicValue('musicPlayingRankBuff')+musicValue('musicSongRankBuff')+musicValue('musicPotionBuff')+musicValue('musicCairbreBugle')+musicValue('roseBraceletBuff')+musicValue('musicBuffTitleEffect')+musicValue('musicInstrumentUpgrades')+musicValue('musicBuffEnchants')+musicValue('playingInstrumentReforge')+musicValue('homesteadMusicBuffEffect')+musicValue('fleurGrassTiaraBuff')+musicValue('troubadourSetEffectBuff')+musicValue('fairyDragonSonicEffectBuff')+musicValue('harmonicSaintLinkEffect')+musicValue('musicDollBags')+musicValue('musicMuriasWater'), harmony=musicValue('fairyDragonHarmonyEffectBuff'),item=musicValue('itemGradeQuality'),special=musicValue('musicSpecialUpgrades');
 // mabi.gg's saved March Song calculator lists Walking / Mount Speed as +1 percentage point of *base* per level.
 const marchAdd=key==='march_ally'?musicValue('marchWalkingSpeed')*0.01:key==='march_mount'?musicValue('marchMountSpeed')*0.01:0;
 // Skill-specific reforges apply only to their own listed effect, before Music Buff Effect and performance multipliers.
 // Enduring Melody Protection: +1 flat protection per reforge level (max 3).
 // Harvest Song and Vivace: +1 percentage point of base per reforge level.
 const skillAdd=key==='enduring_prot'?musicValue('enduringProtectionReforge'):
  key==='enduring_recovery'?musicValue('enduringMpRecoveryReforge')*0.10:
  key==='enduring_stamina_recovery'?musicValue('enduringStaminaRecoveryReforge')*0.10:
  key==='harvest_solo'||key==='harvest_party'?musicValue('harvestGatheringSpeedReforge')*0.01:
  key==='vivace_magic'?musicValue('vivaceMagicCastingReforge')*0.01:
  key==='vivace_alchemy'?musicValue('vivaceAlchemyCastingReforge')*0.01:0;
 const effectiveBase=base+marchAdd+skillAdd;
 // Performance-effect reforges are tier-specific, not global Music Buff Effect bonuses.
 const calc=(performance,reforge,tierEffect)=>((((1+total*0.01)*effectiveBase*(performance+(reforge+tierEffect)*0.01))+((harmony*0.01)*effectiveBase))*(1+(item*0.01)+(special*0.01)));
 return {totalStat:total+harmony,simpleTotal:total,harmony,data,normal:calc(1.0,musicValue('musicKnowledgeReforge'),musicValue('musicNormalEffect')),excellent:calc(1.1,musicValue('musicKnowledgeReforge'),musicValue('musicExcellentEffect')),inspiring:calc(1.3,musicValue('musicKnowledgeReforge'),musicValue('musicInspiringEffect'))};
}
function musicFormat(calcValue,key){const data=musicBaseEffects[key]||{percent:false,digits:2};const number=data.percent?calcValue*100:calcValue;return number.toLocaleString(undefined,{minimumFractionDigits:data.digits,maximumFractionDigits:data.digits})+(data.percent?'%':'')}
function musicPossessive(){const n=(state.characterName||'').trim();return n?`${n}'s`:'your'}
function musicSkillIcon(skill){return craftIcon(skill)}
function musicLabSlot(key){const skill=musicSimSkills.find(s=>s.id===state.musicBuffLab.slots?.[key]);return `<button type="button" class="craft-slot ${skill?'assigned':''}" data-music-key="${esc(key)}" aria-label="${esc(key)}: ${skill?esc(skill.name):'Empty slot'}" title="${skill?esc(skill.name):'Drop a skill here'}"><small>${esc(key)}</small>${skill?musicSkillIcon(skill):'<span class="craft-empty">+</span>'}<span class="craft-cool" data-music-cool="${esc(key)}"></span></button>`}
function musicBuffSections(){const inputs=musicInputs();const groupA=['musicGrandmaster','musicPlayingRankBuff','musicSongRankBuff','musicPotionBuff','musicCairbreBugle','roseBraceletBuff','troubadourSetEffectBuff','fairyDragonSonicEffectBuff'];
 const groupB=['musicBuffTitleEffect','musicInstrumentUpgrades','musicBuffEnchants','playingInstrumentReforge','homesteadMusicBuffEffect','fleurGrassTiaraBuff','fairyDragonHarmonyEffectBuff','harmonicSaintLinkEffect'];
 const groupC=['itemGradeQuality','musicSpecialUpgrades','musicDollBags','musicMuriasWater'];
 const groups=[['Core Buff Effect Sources',groupA],['Additional Buff Sources',groupB],['Item / Special Effects',groupC]];
 const fieldMap=Object.fromEntries(musicFieldDefs.map(d=>[d[0],d]));
 return groups.map(([title,keys])=>`<section class="card music-calc-card"><h3>${title}</h3><div class="music-calc-grid">${keys.map(key=>{const [id,label,options,min,max]=fieldMap[key];const val=inputs[id]??0;return `<label><span>${esc(label)}</span>${options?`<select data-music-input="${id}">${options.map(([name,value])=>`<option value="${value}" ${String(val)===String(value)?'selected':''}>${esc(name)}</option>`).join('')}</select>`:`<input type="number" data-music-input="${id}" value="${esc(val)}" min="${min??0}" ${max!==undefined?`max="${max}"`:''} step="0.1">`}</label>`}).join('')}</div></section>`).join('')}
function musicSpecificFieldPanel(){const keys=['marchWalkingSpeed','marchMountSpeed','enduringProtectionReforge','enduringMpRecoveryReforge','enduringStaminaRecoveryReforge','harvestGatheringSpeedReforge','vivaceMagicCastingReforge','vivaceAlchemyCastingReforge'];const fields=Object.fromEntries(musicFieldDefs.map(d=>[d[0],d]));return `<section class="card music-calc-card music-skill-reforges"><h3>Skill modifying reforges</h3><p class="hint">Set all your skill-specific reforge levels here, regardless of which song is selected above. Each modifier affects only its corresponding skill result.</p><div class="music-calc-grid">${keys.map(key=>{const [id,label,,min,max]=fields[key];return `<label><span>${esc(label)}</span><input type="number" data-music-input="${id}" value="${esc(musicInputs()[id]??0)}" min="${min??0}" ${max!==undefined?`max="${max}"`:''} step="1"></label>`}).join('')}</div></section>`}
function musicBuffResultPanel(){const selected=musicInputs().musicSkillBaseEffectKey||'bo_damage';const calc=musicCalcForKey(selected);return `<section class="card music-calc-card"><h3>Rank 1 Music Skill Effect</h3><div class="music-calc-grid"><label><span>Music Skill Base Effect</span><select data-music-input="musicSkillBaseEffectKey">${Object.entries(musicBaseEffects).map(([k,v])=>`<option value="${k}" ${selected===k?'selected':''}>${esc(v.label)}: ${v.percent?(v.value*100).toFixed(2)+'%':v.value}</option>`).join('')}</select></label><label><span>Normal Effect</span><input type="number" data-music-input="musicNormalEffect" min="0" step="0.1" value="${esc(musicInputs().musicNormalEffect)}"></label><label><span>Excellent Effect</span><input type="number" data-music-input="musicExcellentEffect" min="0" step="0.1" value="${esc(musicInputs().musicExcellentEffect)}"></label><label><span>Inspiring Effect</span><input type="number" data-music-input="musicInspiringEffect" min="0" step="0.1" value="${esc(musicInputs().musicInspiringEffect)}"></label><label><span>Musical Knowledge - Reforge</span><input type="number" data-music-input="musicKnowledgeReforge" min="0" max="10" step="1" value="${esc(musicInputs().musicKnowledgeReforge)}"></label></div><div class="music-result-strip"><div><small>Total Music Buff Effect Stat</small><strong>${musicFormat(calc.totalStat,'enduring_def').replace('.0','')}</strong><span>Includes Fairy Dragon Harmony effect</span></div><div><small>Normal Buff</small><strong>${musicFormat(calc.normal,selected)}</strong></div><div><small>Excellent / Marvelous Buff</small><strong>${musicFormat(calc.excellent,selected)}</strong></div><div><small>Inspiring / Haunting Buff</small><strong>${musicFormat(calc.inspiring,selected)}</strong></div></div><p class="hint">Formula follows the Music Buff calculator on Mabinogi World Wiki. Fairy Dragon Harmony contributes separately from Performance Quality.</p></section>`}
function musicSimScene(){return `<div class="music-stage" id="music-stage"><div class="music-bard" id="music-bard"><div class="music-bard-head"></div><div class="music-bard-hair"></div><div class="music-bard-body"></div><div class="music-bard-arm left"></div><div class="music-bard-arm right"></div><div class="music-bard-leg left"></div><div class="music-bard-leg right"></div><div class="music-bard-instrument"></div><div class="music-notes"><span>♪</span><span>♫</span><span>♬</span></div></div><div class="music-overlay" id="music-overlay" aria-live="polite"></div></div>`}
function musicBuffLabView(){const profile=state.musicBuffLab;return `<h2>Harmonic Saint · Rate isn't a Lie</h2><p class="muted">Fine-tune your music buffs, then take the stage and bring them to life.</p><p class="hint sim-rate-disclaimer">Any similarities to in game rates are purely an accident.</p><div class="music-lab"><details class="music-calculator-details" id="music-calculator" ${(companionMobileMode()||profile.calculatorOpen)?'open':''}><summary>Music Buff Effect Calculator</summary><div class="music-calculator-body">${musicBuffSections()}${musicSpecificFieldPanel()}${musicBuffResultPanel()}</div></details><section class="card music-sim-card"><h3>Buff Simulator</h3><p class="hint">Assign Bard skills to your hotbar, press Begin, then tap a hotkey or use your keyboard. This simulator shows the current haunting / inspiring buff text using your calculator values.</p><div class="craft-layout music-sim-layout"><section class="craft-primary"><div class="craft-bar-head"><strong>Skill Bar</strong><button id="music-drawer-toggle" aria-expanded="${musicBuffDrawer}" aria-controls="music-drawer">${musicBuffDrawer?'Close skills':'Skills ☷'}</button></div><div class="craft-hotbar"><div class="craft-hotbar-row">${craftKeys.slice(12).map(musicLabSlot).join('')}</div><div class="craft-hotbar-row">${craftKeys.slice(0,12).map(musicLabSlot).join('')}</div></div><p class="hint">Drag or tap Bard skills to assign them. During a performance, tap a hotkey to play. Long-press or right-click a slot to clear it during setup.</p>${musicSimScene()}<div class="craft-bottom"><label>Duration <select id="music-duration"><option value="30" ${profile.duration===30?'selected':''}>30 sec</option><option value="60" ${profile.duration===60?'selected':''}>60 sec</option><option value="120" ${profile.duration===120?'selected':''}>2 min</option><option value="300" ${profile.duration===300?'selected':''}>5 min</option></select></label><button class="primary" id="music-begin">Begin</button><button id="music-finish" hidden>Finish</button><span class="hint" id="music-timer"></span></div></section><aside class="craft-drawer ${musicBuffDrawer?'open':''}" id="music-drawer" ${musicBuffDrawer?'':'hidden'}><div class="craft-drawer-head"><strong>Bard skills</strong><button id="music-drawer-close" aria-label="Close skill drawer">×</button></div><p class="hint">Drag a skill onto a slot, or tap a skill and then its slot.</p><div class="craft-drawer-list">${musicSimSkills.map(skill=>`<div class="craft-skill-pick ${musicBuffSelected===skill.id?'selected':''}" draggable="true" data-music-skill="${skill.id}" tabindex="0" role="button">${musicSkillIcon(skill)}<div><strong>${esc(skill.name)}</strong><small>${skill.cd}s cooldown · ${esc(skill.shape)}</small><span class="hint">${esc(skill.note)}</span></div></div>`).join('')}</div></aside></div></section></div>`}
function musicBuffOverlay(skillId){const owner=musicPossessive();const line=(text)=>`<div>${esc(text)}</div>`;const calcMarch=musicCalcForKey('march_ally'),calcMarchMount=musicCalcForKey('march_mount'),calcDef=musicCalcForKey('enduring_def'),calcProt=musicCalcForKey('enduring_prot'),calcRec=musicCalcForKey('enduring_recovery'),calcStamina=musicCalcForKey('enduring_stamina_recovery'),calcDmg=musicCalcForKey('bo_damage'),calcCrit=musicCalcForKey('bo_crit'),calcViv=musicCalcForKey('vivace_speed'),calcVivMagic=musicCalcForKey('vivace_magic'),calcVivAlchemy=musicCalcForKey('vivace_alchemy'),calcHarvest=musicCalcForKey('harvest_party'),calcLullaby=musicCalcForKey('lullaby_damage');
 const box=(body)=>`<div class="music-overlay-block">${body}</div>`;
 switch(skillId){
  case 'march': return box(`<div>${esc(`The haunting sound of ${owner} March Song fills the air.`)}</div>${line(`Your Movement Speed increased by ${musicFormat(calcMarch.inspiring,'march_ally')}.`)}`);
  case 'enduring': return box(`<div>${esc(`The haunting sound of ${owner} Enduring Melody fills the air.`)}</div>${line(`Your Defense increased by ${musicFormat(calcDef.inspiring,'enduring_def')}.`)}${line(`Your Protection increased by ${musicFormat(calcProt.inspiring,'enduring_prot')}.`)}${line(`Magic defense increased by ${musicFormat(calcDef.inspiring,'enduring_def')}.`)}${line(`Magic protection increased by ${musicFormat(calcProt.inspiring,'enduring_prot')}.`)}${line(`Your MP Recovery Speed increased by ${musicFormat(calcRec.inspiring,'enduring_recovery')}.`)}${line(`Your Stamina Recovery Speed increased by ${musicFormat(calcStamina.inspiring,'enduring_stamina_recovery')}.`)}`);
  case 'vivace': return box(`<div>${esc(`The haunting sound of ${owner} Vivace fills the air.`)}</div>${line(`Your Magic Attack increased by ${musicFormat(calcDmg.inspiring,'bo_damage')}.`)}${line(`Your Alchemic Damage increased by ${musicFormat(calcDmg.inspiring,'bo_damage')}.`)}${line(`Your Magic Charging Speed increased by ${musicFormat(calcVivMagic.inspiring,'vivace_magic')}.`)}${line(`Your Alchemic Charging Speed increased by ${musicFormat(calcVivAlchemy.inspiring,'vivace_alchemy')}.`)}${line(`Your Attack Speed increased by ${musicFormat(calcViv.inspiring,'vivace_speed')}.`)}`);
  case 'battlefield': return box(`<div>${esc(`The haunting sound of ${owner} Battlefield Overture fills the air.`)}</div>${line(`Your Min ATT increased by ${musicFormat(calcDmg.inspiring,'bo_damage')}.`)}${line(`Your Max ATT increased by ${musicFormat(calcDmg.inspiring,'bo_damage')}.`)}${line(`Your critical chance increased by ${musicFormat(calcCrit.inspiring,'bo_crit')}.`)}`);
  case 'harvest': return box(`<div>${esc(`The haunting sound of ${owner} Harvest Song fills the air.`)}</div>${line('Your Gathering Success Rate increased by 5.00%.')}${line('Your Production Success Rate increased by 5.00%.')}${line(`Your Gathering Speed increased by ${musicFormat(calcHarvest.inspiring,'harvest_party')}.`)}`);
  case 'lullaby': return box(`<div>${esc(`The haunting sound of ${owner} Lullaby fills the air.`)}</div>${line(`Lullaby Damage increased by ${musicFormat(calcLullaby.inspiring,'lullaby_damage')}.`)}`);
  case 'dischord': return box(`<div>${esc(`The haunting sound of ${owner} Dischord fills the air.`)}</div>${line('Dischord ripples outward with a harsh, unsettling performance.')}`);
  case 'dance': return box(`<div>${esc(`${owner[0].toUpperCase()+owner.slice(1)} Dance of Death sends the stage into motion.`)}</div>${line('The performance erupts wildly as the rhythm takes over.')}`);
  case 'fantastic': return box(`<div>${esc(`The haunting sound of ${owner} Fantastic Chorus fills the air.`)}</div>${line('Fantastic Chorus resonates through the field.')}`);
  case 'enthralling': return box(`<div>${esc(`The haunting sound of ${owner} Enthralling Performance fills the air.`)}</div>${line('The audience is captivated by the performance.')}`);
  case 'encore': return box(`<div>${esc(`The haunting sound of ${owner} Encore fills the air.`)}</div>${line('Encore rings out, urging the melody onward.')}`);
  case 'instrument': return box(`<div>${esc(`${owner[0].toUpperCase()+owner.slice(1)} instrument practice fills the air with a lively sound.`)}</div>`);
  case 'song': return box(`<div>${esc(`The haunting sound of ${owner} Song fills the air.`)}</div>`);
  default: return box(`<div>${esc(`The haunting sound of ${owner} performance fills the air.`)}</div>`);
 }
}
function musicBuffUpdate(){if(state.page!=='rotation'||rotationView!=='music-lie')return;for(const k of craftKeys){const el=document.querySelector(`[data-music-cool="${CSS.escape(k)}"]`);if(!el)continue;const skill=musicSimSkills.find(s=>s.id===state.musicBuffLab.slots?.[k]);const left=skill&&musicBuffSession?Math.max(0,(musicBuffSession.ready[skill.id]||0)-performance.now())/1000:0;el.textContent=left?left.toFixed(1)+'s':'';el.closest('.craft-slot')?.classList.toggle('cooling',left>0)}if(musicBuffSession&&$('music-timer'))$('music-timer').textContent=Math.max(0,(musicBuffSession.end-performance.now())/1000).toFixed(0)+'s';if(musicBuffSession&&performance.now()>=musicBuffSession.end)musicBuffEnd()}
function musicBuffBegin(){if(musicBuffSession)musicBuffEnd();state.musicBuffLab.duration=Number($('music-duration')?.value)||60;save();musicBuffSession={start:performance.now(),end:performance.now()+state.musicBuffLab.duration*1000,ready:{},clock:setInterval(musicBuffUpdate,100)};$('music-begin').hidden=true;$('music-finish').hidden=false;musicBuffUpdate()}
function musicBuffEnd(){if(!musicBuffSession)return;clearInterval(musicBuffSession.clock);musicBuffSession=null;if($('music-begin'))$('music-begin').hidden=false;if($('music-finish'))$('music-finish').hidden=true;if($('music-timer'))$('music-timer').textContent='';const overlay=$('music-overlay');if(overlay)overlay.innerHTML='';musicBuffStopPerformance();save()}
function musicBuffStopPerformance(){const stage=$('music-stage'),overlay=$('music-overlay');if(stage)stage.classList.remove('pulse','acting','hop','spin','riff','performing');if(overlay)overlay.innerHTML='';if(musicBuffSession)musicBuffSession.playing=null}
function musicBuffPulse(skillId){const overlay=$('music-overlay'),stage=$('music-stage');if(!overlay||!stage)return;musicBuffStopPerformance();overlay.innerHTML=musicBuffOverlay(skillId);const move=['hop','spin','riff'][Math.floor(Math.random()*3)];void stage.offsetWidth;stage.classList.add('pulse','acting','performing',move);if(musicBuffSession)musicBuffSession.playing=skillId}
function musicBuffFire(skill){if(!musicBuffSession)return;const now=performance.now();if((musicBuffSession.ready[skill.id]||0)>now)return;musicBuffSession.ready[skill.id]=now+(Number(skill.cd)||0)*1000;musicBuffPulse(skill.id);musicBuffUpdate()}
function musicBuffKeyDown(e){if(state.page!=='rotation'||rotationView!=='music-lie'||!musicBuffSession||e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;const key=craftKeys.find(k=>k.toLowerCase()===e.key.toLowerCase());if(!key)return;const skill=musicSimSkills.find(s=>s.id===state.musicBuffLab.slots?.[key]);if(!skill)return;e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;musicBuffFire(skill)}
function musicBuffAssign(key,id){if(musicBuffSession||!craftKeys.includes(key)||!musicSimSkills.find(s=>s.id===id))return;state.musicBuffLab.slots[key]=id;save();render()}
function musicBuffMove(from,to){if(musicBuffSession||from===to)return;const slots=state.musicBuffLab.slots||{};const prev=slots[to];slots[to]=slots[from];if(prev)slots[from]=prev;else delete slots[from];save();render()}
function musicBuffClear(key){if(musicBuffSession)return;delete state.musicBuffLab.slots[key];save();render()}
// Rate Isn't a Lie uses the same mobile assignment gestures as Rotation Crafter,
// but playback calls musicBuffFire directly (music skills do not charge).
let musicTouchDrag=null,musicTouchLongPress=null,musicTouchSuppressClickUntil=0;
function musicTouchEnd(cancelled=false){
 const d=musicTouchDrag;if(!d)return;musicTouchDrag=null;clearTimeout(musicTouchLongPress);
 d.ghost?.remove();document.querySelectorAll('.music-touch-target').forEach(el=>el.classList.remove('music-touch-target'));
 if(cancelled||!d.moved)return;
 musicTouchSuppressClickUntil=performance.now()+450;
 const target=document.elementFromPoint(d.x,d.y)?.closest('[data-music-key]');if(!target)return;
 if(d.kind==='skill')musicBuffAssign(target.dataset.musicKey,d.value);
 else musicBuffMove(d.value,target.dataset.musicKey);
 musicBuffSelected=null;
}
function musicTouchBind(){
 document.querySelectorAll('[data-music-skill]').forEach(el=>{
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.button!==0||musicBuffSession)return;
   musicTouchDrag={pointer:e.pointerId,kind:'skill',value:el.dataset.musicSkill,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,ghost:null};el.setPointerCapture?.(e.pointerId)});
  el.addEventListener('pointermove',e=>{const d=musicTouchDrag;if(!d||d.pointer!==e.pointerId)return;
   d.x=e.clientX;d.y=e.clientY;if(!d.moved&&Math.hypot(d.x-d.startX,d.y-d.startY)>9){d.moved=true;d.ghost=document.createElement('div');d.ghost.className='craft-touch-ghost';d.ghost.textContent=el.querySelector('strong')?.textContent||'Bard skill';document.body.appendChild(d.ghost)}
   if(d.moved){e.preventDefault();d.ghost.style.left=d.x+'px';d.ghost.style.top=d.y+'px';document.querySelectorAll('.music-touch-target').forEach(n=>n.classList.remove('music-touch-target'));document.elementFromPoint(d.x,d.y)?.closest('[data-music-key]')?.classList.add('music-touch-target')}});
  el.addEventListener('pointerup',e=>{if(musicTouchDrag?.pointer===e.pointerId)musicTouchEnd()});
  el.addEventListener('pointercancel',e=>{if(musicTouchDrag?.pointer===e.pointerId)musicTouchEnd(true)});
 });
 document.querySelectorAll('[data-music-key]').forEach(el=>{
  el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||e.button!==0)return;const key=el.dataset.musicKey;
   if(musicBuffSession){if(!musicBuffSelected){const skill=musicSimSkills.find(s=>s.id===state.musicBuffLab.slots?.[key]);if(skill){e.preventDefault();musicBuffFire(skill);el.classList.add('craft-touch-pressed');el.setPointerCapture?.(e.pointerId)}}return}
   if(musicBuffSelected||!state.musicBuffLab.slots?.[key])return;
   musicTouchDrag={pointer:e.pointerId,kind:'slot',value:key,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,ghost:null};el.setPointerCapture?.(e.pointerId);
   musicTouchLongPress=setTimeout(()=>{if(musicTouchDrag?.pointer===e.pointerId&&!musicTouchDrag.moved){musicTouchEnd(true);musicTouchSuppressClickUntil=performance.now()+450;musicBuffClear(key)}},650);
  });
  el.addEventListener('pointermove',e=>{const d=musicTouchDrag;if(!d||d.pointer!==e.pointerId||d.kind!=='slot')return;
   d.x=e.clientX;d.y=e.clientY;if(!d.moved&&Math.hypot(d.x-d.startX,d.y-d.startY)>10){clearTimeout(musicTouchLongPress);d.moved=true;d.ghost=document.createElement('div');d.ghost.className='craft-touch-ghost';d.ghost.textContent=d.value;document.body.appendChild(d.ghost)}
   if(d.moved){e.preventDefault();d.ghost.style.left=d.x+'px';d.ghost.style.top=d.y+'px';document.querySelectorAll('.music-touch-target').forEach(n=>n.classList.remove('music-touch-target'));document.elementFromPoint(d.x,d.y)?.closest('[data-music-key]')?.classList.add('music-touch-target')}});
  el.addEventListener('pointerup',e=>{clearTimeout(musicTouchLongPress);el.classList.remove('craft-touch-pressed');if(musicTouchDrag?.pointer===e.pointerId)musicTouchEnd()});
  el.addEventListener('pointercancel',e=>{clearTimeout(musicTouchLongPress);el.classList.remove('craft-touch-pressed');if(musicTouchDrag?.pointer===e.pointerId)musicTouchEnd(true)});
 });
}
function musicBuffBind(){if(state.page!=='rotation'||(rotationView!=='music-lie'&&rotationView!=='music-calc'))return;const calculator=$('music-calculator');if(calculator)calculator.addEventListener('toggle',()=>{state.musicBuffLab.calculatorOpen=calculator.open;save()});document.querySelectorAll('[data-music-input]').forEach(el=>el.addEventListener('change',()=>{const key=el.dataset.musicInput;state.musicBuffLab.inputs[key]=el.tagName==='SELECT'?(key==='musicSkillBaseEffectKey'?el.value:Number(el.value)): (key==='musicSkillBaseEffectKey'?el.value:Number(el.value)||0);save();render()}));$('music-drawer-toggle')?.addEventListener('click',()=>{musicBuffDrawer=!musicBuffDrawer;render()});$('music-drawer-close')?.addEventListener('click',()=>{musicBuffDrawer=false;render()});$('music-begin')?.addEventListener('click',musicBuffBegin);$('music-finish')?.addEventListener('click',musicBuffEnd);document.querySelectorAll('[data-music-skill]').forEach(el=>{el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','music-skill:'+el.dataset.musicSkill);e.dataTransfer.effectAllowed='copy'});el.addEventListener('click',()=>{if(musicBuffSession||performance.now()<musicTouchSuppressClickUntil)return;musicBuffSelected=el.dataset.musicSkill;document.querySelectorAll('[data-music-skill]').forEach(x=>x.classList.toggle('selected',x.dataset.musicSkill===musicBuffSelected))});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}})});document.querySelectorAll('[data-music-key]').forEach(el=>{const key=el.dataset.musicKey;el.draggable=!!state.musicBuffLab.slots[key];el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','music-slot:'+key);e.dataTransfer.effectAllowed='move'});el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drop-ready')});el.addEventListener('dragleave',()=>el.classList.remove('drop-ready'));el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('drop-ready');const data=e.dataTransfer.getData('text/plain');if(data.startsWith('music-skill:'))musicBuffAssign(key,data.slice(12));else if(data.startsWith('music-slot:'))musicBuffMove(data.slice(11),key)});el.addEventListener('click',()=>{if(performance.now()<musicTouchSuppressClickUntil)return;if(musicBuffSelected&&!musicBuffSession){const chosen=musicBuffSelected;musicBuffSelected=null;musicBuffAssign(key,chosen)}});el.addEventListener('contextmenu',e=>{e.preventDefault();musicBuffClear(key)})});musicTouchBind();musicBuffUpdate()}
const musicRenderOriginal=render;render=function(){musicRenderOriginal();musicBuffBind()};
document.addEventListener('keydown',e=>{if(state.page==='rotation'&&rotationView==='music-lie'&&e.key==='Escape'){musicBuffStopPerformance();e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('pointerdown',e=>{if(state.page==='rotation'&&rotationView==='music-lie'&&musicBuffSession?.playing&&!e.target.closest('#music-stage'))musicBuffStopPerformance()},true);
document.addEventListener('keydown',musicBuffKeyDown,true);

Object.assign(window.MIDIR_ROTATION_ICONS||={}, {
  'Charge':'assets/icons/skills/gui_icon_skill_002_3_1.png',
  'Counterattack':'assets/icons/skills/gui_icon_skill_000_7_0.png',
  'Natural Shield':'assets/icons/skills/gui_icon_skill_000_2_15.png',
  'Stomp':'assets/icons/skills/gui_icon_skill_000_1_13.png'
});

const renderBeforeStorageRecovery=render;
render=function(){
 if(reportStorageBlocked){
  $('app').innerHTML='<section class="card"><h2>Vault storage recovery required</h2><p>A saved report index references structured data that could not be opened in IndexedDB. To protect your achievements and report history, all profile writes are paused.</p><p>Do not clear site data. If you have a previously exported full profile backup, restore it here. Otherwise, keep this browser profile and investigate browser storage permissions.</p><input type="file" id="backup-picker" accept=".json"><p class="hint">Restore is allowed once IndexedDB is accessible again. Interactive HTML archives remain in their existing database.</p><div id="notice" class="notice" hidden></div></section>';
  return;
 }
 renderBeforeStorageRecovery();
 window.MIDIR_HERBS?.onRender();
 window.MIDIR_PIG?.onRender();
 window.MIDIR_BB?.onRender();
 window.MIDIR_MP_RHYTHM?.onRender();
};
window.MIDIR_RENDER_LANGUAGE=()=>{render();syncOverviewSidebar();window.MIDIR_I18N?.apply(document);};
window.MIDIR_I18N?.setup();
// Companion 277: lifetime archive ledger is independent from skill-median comparisons.
// Individual report milestones are intentionally NOT retained after archival compaction.
let archiveSelectedArcana='as',archiveBusy=false,archiveRestoreId=null;
let archiveFilePicker=null;if(typeof document!=='undefined'){archiveFilePicker=document.createElement('input');archiveFilePicker.type='file';archiveFilePicker.accept='.html,.json,.ndjson';archiveFilePicker.hidden=true;archiveFilePicker.id='archive-reselect-picker';document.body.appendChild(archiveFilePicker);}
function archiveLedger(){
 if(!state.archiveLedger||typeof state.archiveLedger!=='object')state.archiveLedger={version:1,awards:{},skillMedians:{},winners:{},sources:{},collectibles:{}};
 const l=state.archiveLedger;
 for(const key of ['awards','skillMedians','winners','sources','collectibles'])if(!l[key]||typeof l[key]!=='object')l[key]={};
 return l;
}
function archiveMedian(values){const a=values.filter(x=>Number.isFinite(x)&&x>0).sort((a,b)=>a-b);if(!a.length)return null;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
function archiveSkillBaseline(r,p,arcana){
 const out={};const bossIds=new Set((r.encounters||[]).flatMap(e=>e.entityIds||[]).map(String));const windows=arcana?rhEncounter({r,p}).filter(w=>rhEncounterArcana(r,p,w).arc===arcana):[];const hits=(r.damageHitEvents||[]).filter(h=>String(h.playerId)===String(p.entityId)&&h.critical===false&&Number(h.damage)>0&&bossIds.has(String(h.targetId))&&(!arcana||windows.some(w=>Number(h.relativeMs)/1000>=w.start&&Number(h.relativeMs)/1000<=w.end)));
 const bySkill={};for(const h of hits)(bySkill[String(h.skillId)]??=[]).push(Number(h.damage));
 const matchingIds=new Set(windows.flatMap(w=>{const out=[];for(const h of r.damageHitEvents||[])if(String(h.playerId)===String(p.entityId)&&Number(h.relativeMs)/1000>=w.start&&Number(h.relativeMs)/1000<=w.end)out.push(String(h.skillId));for(const bucket of p.damageEvents||[])if(Number(bucket.time)>=w.start&&Number(bucket.time)<=w.end)for(const sk of bucket.skills||[])out.push(String(sk.skillId));return out;}));
 for(const sk of p.skills||[]){const id=String(sk.skillId??sk.id??'');if(!id||id==='9999'||arcana&&!matchingIds.has(id))continue;
  const samples=bySkill[id]||[];let median=archiveMedian(samples);
  if(median===null){const non=Math.max(0,Number(sk.hitCount||0)-Number(sk.criticalHits||0));const amount=Number(sk.nonCriticalDamage);if(non>0&&Number.isFinite(amount)&&amount>0)median=amount/non;}
  if(median!==null&&Number.isFinite(median)&&median>0)out[id]={value:median,name:String(sk.name||id)};
 }
 return out;
}
function archiveScore(seq,medians){return (seq?.hits||[]).reduce((sum,h)=>sum+Math.max(0,Number(h.count)||0)*Math.max(0,Number(medians[h.id]?.value)||0),0)}
function archiveCandidate(w,arc,mode,seconds){
 if(!w?.details?.length)return null;
 const hits=w.details.filter(e=>Number(e.credited)>0).map(e=>({id:String(e.id),name:String(e.name||e.id),time:Math.max(0,Number(e.time)-Number(w.start)),count:Number(e.credited)}));
 return hits.length?{arc,mode,seconds,hits,source:String(w.r?.id||''),title:String(w.r?.title||w.r?.name||''),gate:w.gate||null}:null;
}
function archiveExtract(r){
 const summary={version:1,dps:null,awards:[],collectibles:{},rotations:[],medians:{},playerNames:[],createdAt:Date.now()};
 const p=chosenPlayer(r);if(p){summary.playerNames.push(p.name);summary.dps=participantStats(r,p).dps;summary.arcanaByEncounter=rhEncounterArcanaLabel(r,p);}
 const seenAwards=new Set(),awardCounts=new Map();const addAward=(e,key)=>{if(seenAwards.has(key))return;seenAwards.add(key);const type=String(e.type);const old=awardCounts.get(type)||{type,title:String(e.title||type),count:0};old.count++;awardCounts.set(type,old)};
 // Existing saved milestone events are authoritative and are banked once per report.
 for(const e of state.metricMilestones||[]){if(e.reportId!==r.id||!e.type)continue;const key=String(e.id||[e.type,e.attemptKey||'',e.encounter||''].join('|'));addAward(e,key);}
 // Also evaluate reports that have not yet generated saved milestone entries.
 try{for(const e of vaultEventsForImport(r)){const key=String(e.id||[e.reportId,e.player,e.type,e.attemptKey||''].join('|'));addAward(e,key);}}catch(error){console.warn('Archive achievement evaluation skipped',error)}
 summary.awards=[...awardCounts.values()];
 if(p&&r.provenance==='companion-v1')for(const c of D.collectibles||[]){try{const rows=gateForTarget(r,c.gate).map(a=>{const result=awardFor(r,c,p,a);return {run:r.title||r.name,reportId:r.id,player:p.name,...result}});summary.collectibles[c.id]={delta:rows.reduce((a,x)=>a+(x.delta===1||x.delta===-1?x.delta:0),0),qualified:rows.filter(x=>x.delta===1||x.delta===-1).length};}catch(error){console.warn('Archive collectible evaluation skipped',error)}}
 if(p&&typeof rhBuild==='function'){
  const oldReports=state.reports,oldArcana=state.arcana,oldSauce=state.settings?.secretSauce;
  try{state.settings??={};state.settings.secretSauce=true;state.reports=[r];const arcs=Object.keys(RH_ARCANA).filter(arc=>rhEligible(arc).some(x=>x.r===r&&x.p.entityId===p.entityId));for(const arc of arcs){state.arcana=arc;const base=archiveSkillBaseline(r,p,arc);const result=rhBuild();for(const [id,ref] of result.baseline||[]){if(!base[id]&&Number(ref.value)>0)base[id]={value:Number(ref.value),name:String(ref.name||id),estimated:true}}summary.medians[arc]=base;for(const mode of ['best','repeatable'])for(const seconds of [10,60]){const c=archiveCandidate(result[mode]?.[seconds],arc,mode,seconds);if(c)summary.rotations.push(c)}}}
  catch(error){console.warn('Archive highlight extraction skipped',error)}finally{state.reports=oldReports;state.arcana=oldArcana;state.settings.secretSauce=oldSauce;}
 }
 return summary;
}
function archiveCredit(r){
 const l=archiveLedger(),summary=r.archiveSummary;if(!summary)return false;
 const existing=l.sources[r.id];
 const signature=hash(JSON.stringify([summary.awards||[],summary.collectibles||{},summary.medians||{},summary.rotations||[]]));
 if(existing?.signature===signature)return false;
 const awarded={...existing?.awardCredits};
 for(const e of summary.awards||[]){const k=String(e.type||'');if(!k)continue;
  const recorded=Math.max(0,Number(e.count)||0),old=Number(awarded[k])||0;
  if(recorded>old){const a=l.awards[k]??={title:e.title||k,count:0};a.count+=recorded-old;awarded[k]=recorded;}
 }
 const collectibleCredits={...existing?.collectibleCredits};
 for(const [id,t] of Object.entries(summary.collectibles||{})){
  const old=collectibleCredits[id]||{delta:0,qualified:0};const next={delta:Number(t.delta)||0,qualified:Number(t.qualified)||0};
  const col=l.collectibles[id]??={delta:0,qualified:0};
  col.delta+=next.delta-old.delta;col.qualified+=next.qualified-old.qualified;
  collectibleCredits[id]=next;
 }
 l.sources[r.id]={name:r.name,date:r.importedAt||Date.now(),signature,awardCredits:awarded,collectibleCredits};
 // Only newly archived evidence changes medians; re-scoring a winner never changes awards.
 for(const [arc,skills] of Object.entries(summary.medians||{})){
  const med=l.skillMedians[arc]??={};for(const [id,item] of Object.entries(skills))if(Number(item.value)>0)med[id]={value:Number(item.value),name:String(item.name||id),source:r.id,estimated:item.estimated===true};
 }
 for(const seq of summary.rotations||[]){const key=seq.mode+':'+seq.seconds;
  const winners=l.winners[seq.arc]??={};const previous=winners[key],medians=l.skillMedians[seq.arc]||{};
  if(!previous||archiveScore(seq,medians)>archiveScore(previous,medians))winners[key]=seq;
 }
 return true;
}
function archiveRecoverCredits(){let changed=false;for(const r of state.reports){if(r.archiveCompact&&archiveCredit(r))changed=true;}return changed;}
async function archiveReadCold(id){const db=await openVaultDb();try{return await new Promise((res,rej)=>{const q=db.transaction('cold','readonly').objectStore('cold').get(id);q.onsuccess=()=>res(q.result||null);q.onerror=()=>rej(q.error||Error('Cold record read failed'))})}finally{db.close()}}
async function archiveDeleteStored(id){const db=await openVaultDb();try{await new Promise((res,rej)=>{const tx=db.transaction(['details','cold'],'readwrite');tx.objectStore('details').delete(id);tx.objectStore('cold').delete(id);tx.oncomplete=res;tx.onerror=()=>rej(tx.error||Error('Archived delete failed'));tx.onabort=()=>rej(tx.error||Error('Archived delete aborted'))})}finally{db.close()}}
async function archiveCompactWrite(r,summary){
 const digest=r.archiveDigest||await archiveParsedFingerprint(r);
 const compact={...reportIndexEntry(r),archiveCompact:true,archiveSummary:summary,
  archiveDigest:digest,archiveFileDigest:r.archiveFileDigest||null,htmlSaved:false};
 // Stage a temporary recovery copy and compact index atomically. If the
 // separate localStorage profile commit fails, the full record remains in cold.
 const db=await openVaultDb();try{await new Promise((resolve,reject)=>{
  const tx=db.transaction(['details','cold'],'readwrite');
  tx.objectStore('cold').put(r,r.id);tx.objectStore('details').put(compact,r.id);
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Archive staging failed'));
  tx.onabort=()=>reject(tx.error||Error('Archive staging aborted'));
 })}finally{db.close()}
 return compact;
}
async function archivePurgeRecovery(id){
 const db=await openVaultDb();try{await new Promise((resolve,reject)=>{
  const tx=db.transaction(['cold','reports'],'readwrite');
  tx.objectStore('cold').delete(id);tx.objectStore('reports').delete(id);
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error||Error('Archive purge failed'));
  tx.onabort=()=>reject(tx.error||Error('Archive purge aborted'));
 })}finally{db.close()}
}
async function archiveCompactAll(){
 if(archiveBusy||!reportDbReady||reportStorageBlocked)return;
 state.settings??={};
 if(!state.reports.some(r=>reportIsArchived(r)))return;
 if(!state.settings.archiveCompactApproved){
  if(state.settings.archiveCompactionDeferred)return;
  if(!confirm('Compact archived imports to save browser disk space? Their detailed report data and stored HTML will be removed after summaries are saved. Reactivation then requires reselecting the original export. Keep your original files and an external backup before proceeding.')){
   state.settings.archiveCompactionDeferred=true;save();return;
  }
  state.settings.archiveCompactApproved=true;state.settings.archiveCompactionDeferred=false;
  if(!save())throw Error('Could not save archive compaction consent. No report data was discarded.');
 }
 archiveBusy=true;let changed=archiveRecoverCredits();const purge=[];
 try{
  for(let i=0;i<state.reports.length;i++){
   const r=state.reports[i];if(!reportIsArchived(r))continue;
   if(r.archiveCompact){
    if(r.archiveDigest){purge.push(r.id);continue;}
    // Build 277 cold data is needed once to migrate its original identity.
    const cold=await archiveReadCold(r.id);
    if(!cold){console.warn('Legacy archive has no recoverable report for fingerprint migration:',r.id);continue;}
    const compact={...r,archiveDigest:await archiveParsedFingerprint(cold),archiveFileDigest:cold.archiveFileDigest||null,htmlSaved:false};
    await reportDbWriteBatch([compact]);state.reports[i]=compact;changed=true;purge.push(r.id);continue;
   }
   const summary=archiveExtract(r);
   const compact=await archiveCompactWrite(r,summary);state.reports[i]=compact;
   archiveCredit(compact);state.metricMilestones=state.metricMilestones.filter(e=>e.reportId!==r.id);
   changed=true;purge.push(r.id);
  }
  if(changed&&!save())throw Error('Archive index could not be saved. Recovery copies were kept.');
  // Disk reclamation occurs only after the summary and ledger have committed.
  for(const id of purge){try{await archivePurgeRecovery(id)}catch(e){console.warn('Archive recovery purge deferred:',id,e)}}
 }finally{archiveBusy=false}
}
async function archiveToggle(id){const r=state.reports.find(x=>x.id===id);if(!r)return;
 if(reportIsArchived(r)){
  archiveRestoreId=r.id;archiveFilePicker.value='';archiveFilePicker.click();return;
 }
 try{
  if(!confirm('Archive this import? The original report details and HTML will be deleted from browser storage. To return it to active, you will need to select its original export file again. Keep the file externally.'))return;
  state.settings.archiveCompactApproved=true;state.settings.archiveCompactionDeferred=false;
  r.archived=true;r.archiveReason='manual';await reportDbWriteBatch([r]);
  if(!save())throw Error('Unable to save archive status');await archiveCompactAll();render();
 }catch(error){message('Unable to archive report: '+error.message)}
}
async function archiveRestoreFromFile(file,id){
 if(typeof companionMobileMode==='function'&&companionMobileMode()&&!(await companionMobileImportCheck([file],'reactivation')))throw Error('File selection cancelled.');
 const old=state.reports.find(r=>r.id===id);
 if(!old||!reportIsArchived(old))throw Error('Archived session not found.');
 if(file.size>90*1024*1024)throw Error('Selected file exceeds the 90 MB single-import safety limit.');
 const contents=await file.text();
 const restored=/\.ndjson$/i.test(file.name)?cleanExport(window.MIDIR_SESSION_IMPORT.convert(contents,file.name).comp,null,file.name):parseReport(contents,file.name);
 const digest=await archiveParsedFingerprint(restored);
 const fileDigest=await archiveFileFingerprint(contents);
 // Strong, evidence-based identity, never just a matching name or date.
 if(old.archiveDigest){if(digest!==old.archiveDigest)throw Error('Wrong export: the parsed report fingerprint does not match the archived session.');}
 else if(old.archiveFileDigest){if(fileDigest!==old.archiveFileDigest)throw Error('Wrong export: the original file fingerprint does not match.');}
 else throw Error('This older archive has no verified identity. It cannot be reactivated automatically; restore a full 277 backup first.');
 const oldIndex=state.reports.indexOf(old);
 const original={...old};const previousReports=state.reports.map(r=>({...r}));
 restored.id=old.id;restored.importedAt=Date.now();restored.archived=false;restored.archiveReason=null;
 restored.archiveCompact=false;restored.archiveSummary=null;restored.sourceFingerprint=old.sourceFingerprint;
 restored.archiveDigest=digest;restored.archiveFileDigest=fileDigest;
 restored.isHtml=/\.html?$/i.test(file.name);restored.htmlSaved=false;
 await reportDbWriteBatch([restored]);
 state.reports.splice(oldIndex,1);state.reports.push(restored);
 reportAutoArchive();
 if(!save()){
  state.reports=previousReports;await reportDbWriteBatch([original]);
  throw Error('Profile storage is full; archived entry kept.');
 }
 if(restored.isHtml){try{await storeHtml(restored.id,contents);restored.htmlSaved=true;await reportDbWriteBatch([restored]);save()}catch(e){message('Session reactivated, but HTML viewer storage unavailable: '+e.message)}}
 // Credited archive awards stay banked. Re-importing does not award them again.
 await archiveCompactAll();render();message('Verified original selected. Session returned to active reports.');
}
archiveFilePicker?.addEventListener('change',async()=>{
 const file=archiveFilePicker.files?.[0],id=archiveRestoreId;
 archiveRestoreId=null;archiveFilePicker.value='';if(!file||!id)return;
 try{await archiveRestoreFromFile(file,id)}catch(e){message('Reactivation cancelled: '+e.message)}
});
function archiveOverviewHtml(){
 const l=archiveLedger(),arcs=Object.keys(RH_ARCANA);
 const awards=Object.entries(l.awards).sort((a,b)=>a[1].title.localeCompare(b[1].title));
 const collect=Object.entries(l.collectibles).filter(([,x])=>x.qualified).map(([id,x])=>`<span>${esc(D.collectibles.find(c=>c.id===id)?.name||id)}: ${x.delta>=0?'+':''}${fmt(x.delta)} (${fmt(x.qualified)} scored)</span>`).join(' · ');
 const wins=l.winners[archiveSelectedArcana]||{},med=l.skillMedians[archiveSelectedArcana]||{};
 const records=['best:10','best:60','repeatable:10','repeatable:60'].map(k=>{const w=wins[k];const label=({'best:10':'Recorded 10s peak','best:60':'Recorded 60s peak','repeatable:10':'Cooldown-aware 10s','repeatable:60':'Cooldown-aware 60s'})[k];if(!w)return `<div class="lesson"><strong>${label}</strong> · No archived rotation</div>`;const score=archiveScore(w,med);return `<div class="lesson"><strong>${label}</strong> · ${fmt(Math.round(score))} normalized <small class="hint">${esc(w.title||'Historical session')}</small><details><summary>Winning sequence (${w.hits.length} recorded skill events)</summary>${w.hits.map(h=>`<span class="hint">+${Number(h.time).toFixed(2)}s ${esc(h.name)} ×${fmt(h.count)} · median ${fmt(Math.round(med[h.id]?.value||0))}</span>`).join(' · ')}</details></div>`}).join('');
 return `<div class="card archive-overview"><h3>Lifetime archive summary</h3><p class="hint">Earned award credits are independent of rotation comparisons. The individual milestone history beyond 30 active reports is not retained.</p><p><strong>Banked achievements / awards</strong> · ${awards.length} types, ${awards.reduce((sum,[,a])=>sum+a.count,0)} credits</p><details><summary>Show banked awards</summary>${awards.length?awards.map(([,a])=>`<span class="hint">${esc(a.title)} ×${fmt(a.count)}</span>`).join(' · '):'<p class="hint">No banked awards yet.</p>'}</details>${collect?`<p class="hint">${collect}</p>`:''}<p><label>Archived Rotation Highlights Arcana <select id="archive-arcana">${arcs.map(a=>`<option value="${a}" ${archiveSelectedArcana===a?'selected':''}>${esc(RH_ARCANA[a])}</option>`).join('')}</select></label></p>${records}<p class="hint">All compared sequences use the same current archive median per skill. Missing newer skill values use the stored fallback median. Updating these values cannot award achievements.</p></div>`;
}

reportStorageInitialize().finally(()=>render());

// Positioning Lab: keyboard rotation independent of field dragging.
document.addEventListener('keydown',e=>{if(state.page!=='rotation'||rotationView!=='position'||!positionIntroSeen)return;if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,select,textarea'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();positionSandbox.angle=((positionSandbox.angle+(e.key==='ArrowRight'?5:-5)+540)%360)-180;const input=$('pos-angle'),label=$('pos-angle-value');if(input)input.value=positionSandbox.angle;if(label)label.textContent=positionSandbox.angle+'°';positionSandbox.eliminated.clear();posPaint();}},true);


// Companion 141 — imported boss-rotation highlights; strictly scoped to Vault character + Arcana.
const RH_ARCANA={as:'Alchemic Sharpshooter',dd:'Dark Diviner',ek:'Elemental Knight',hs:'Harmonic Saint',sg:'Sacred Guardian',ev:'Explosive Vanguard',ag:'Arsenal Gunner',fa:'Forbidden Alchemist',mp:'Melodic Puppeteer',bb:'Blazing Brawler'};
const rhSafe=x=>Number.isFinite(Number(x))?Number(x):0;
const rhKey=x=>String(x||'').trim().toLowerCase().replace(/[^a-z0-9]/g,'');
function rhArcana(value){const v=rhKey(value);return Object.keys(RH_ARCANA).find(k=>v===k||v===rhKey(RH_ARCANA[k]))||null}
// Arcana is fixed within a single encounter, but NOT across a whole export.
// Strong actor-attributed use or damage evidence for an exclusive Arcana skill
// overrides session Arcana. Shared basic skills are not Arcana identifiers.
const RH_ARCANA_SIGNATURE_SKILLS={hs:['Resonant Litany'],ag:['Bullet Barrage','Heavy Artillery','Calamity Cannon','Fatal Scope'],bb:['Ignite: Hammerblow','Ignite: Cyclone Drive'],ev:['Dreadnought Burst'],fa:['Hydra Transmutation'],mp:['Cutting Chorus']};
const RH_GENERIC_ARCANA_SKILLS=new Set(['healing','party healing','bash','defense','counterattack','charge','smash','windmill','rage impact','death mark','thunder','fireball','ice spear','meteor strike','magnum shot','support shot','reload','redoubled offensive','flare','blast','final hit']);
function rhArcanaSkillMap(){
 const names=new Map();for(const [arc,skills] of Object.entries(RH_MIN_COOLDOWNS))for(const name of [...Object.keys(skills),...(RH_ARCANA_SIGNATURE_SKILLS[arc]||[])]){
  const key=rhCanonicalName(name);if(RH_GENERIC_ARCANA_SKILLS.has(key))continue;
  if(!names.has(key))names.set(key,new Set());names.get(key).add(arc);
 }
 return names;
}
function rhEncounterArcana(r,p,win){
 const specific=rhArcanaSkillMap(),byId=new Map();
 for(const sk of p.skills||[])if(sk.name&&sk.skillId!=null)byId.set(String(sk.skillId),String(sk.name));
 for(const u of r.skillUseEvents||[])if(u.skillName&&u.skillId!=null)byId.set(String(u.skillId),String(u.skillName));
 for(const o of r.skillObservations||[])if(o.skillName&&(o.skillId||o.candidateSkillId))byId.set(String(o.skillId||o.candidateSkillId),String(o.skillName));
 const scores=new Map();const add=(id,label,weight)=>{
  const arcs=specific.get(rhCanonicalName(label||byId.get(String(id))||''));
  if(arcs?.size!==1)return;const arc=[...arcs][0];scores.set(arc,(scores.get(arc)||0)+weight);
 };
 const within=t=>Number.isFinite(Number(t))&&Number(t)>=Number(win.start)&&Number(t)<=Number(win.end);
 const pid=String(p.entityId);
 // Explicit actor-attributed use packets are strongest. Some exports have
 // these only for the recording player; boss damage remains valid evidence.
 for(const u of r.skillUseEvents||[])if(String(u.playerId)===pid&&within(Number(u.relativeMs)/1000))add(u.skillId,u.skillName,4);
 const bosses=new Set((win.targetIds||[]).map(String));
 for(const h of r.damageHitEvents||[])if(String(h.playerId)===pid&&within(Number(h.relativeMs)/1000)&&bosses.has(String(h.targetId)))add(h.skillId,h.skillName,1);
 // Older damage-only exports still identify Arcana skills by per-second hits.
 if(!(r.damageHitEvents||[]).some(h=>String(h.playerId)===pid&&within(Number(h.relativeMs)/1000)))for(const bucket of p.damageEvents||[])if(within(bucket.time))for(const hit of bucket.skills||[])add(hit.skillId,hit.name,Math.max(1,Number(hit.hits)||1));
 // Only actor-verified observations can identify the player as a caster.
 for(const o of r.skillObservations||[])if(String(o.playerId)===pid&&o.actorVerified===true&&within(Number(o.relativeMs)/1000))add(o.skillId,o.skillName,4);
 if(scores.size===1)return {arc:[...scores.keys()][0],evidence:'encounter-skill'};
 if(scores.size>1)return {arc:null,evidence:'conflicting-encounter-skills'};
 // Absence of an exclusive ability is not proof that the session label is
 // correct; keep the previous session fallback for older sparse recordings.
 return {arc:rhArcana(p.arcana),evidence:'session-fallback'};
}
function rhEncounterArcanaLabel(r,p){
 const windows=rhEncounter({r,p});if(!windows.length)return p.arcana||'Arcana unknown';
 const items=windows.map(w=>{const identified=rhEncounterArcana(r,p,w);const arc=identified.arc?RH_ARCANA[identified.arc]:'Unresolved Arcana';return `Gate ${w.gate||'?'}: ${arc}${identified.evidence==='session-fallback'?' (session label)':''}`;});
 return [...new Set(items)].join(' · ');
}
function rhEligible(key=state.arcana){
 const name=String(state.characterName||'').trim().toLowerCase();if(!name)return [];
 return (state.reports||[]).flatMap(r=>(r.players||[]).filter(p=>String(p.name||'').trim().toLowerCase()===name&&
  (r.damageHitEvents?.some(e=>String(e.playerId)===String(p.entityId))||r.skillUseEvents?.some(e=>String(e.playerId)===String(p.entityId))||Array.isArray(p.damageEvents)&&p.damageEvents.length)
 ).map(p=>({r,p})).filter(x=>rhEncounter(x).some(win=>rhEncounterArcana(x.r,x.p,win).arc===key)));
}
function rhEncounter(x){
 const r=x.r;
 if(r.encounters?.length){return r.encounters.map(e=>{const race=(e.phases||[]).map(p=>Number(p.raceId));const named=(e.label||'').toLowerCase();const gate=race.includes(7602)||/gate\s*2|bronntanas/.test(named)?2:race.includes(7603)||/gate\s*3|midir the beloved/.test(named)?3:race.some(n=>n===7600||n===7601)||/gate\s*1|vertrag/.test(named)?1:0;
  return {gate,start:e.start,end:e.end,target:e.label||'Boss',targetIds:e.entityIds||[],canonical:true,completion:e.completion};}).filter(e=>e.end>e.start&&e.targetIds.length);}
 const targets=r.targets||[];
 const gate=n=>targets.filter(t=>Number(t.raceId)===n&&Array.isArray(t.hp)&&t.hp.length>=2);
 const order=[[2,gate(7602)],[1,targets.filter(t=>[7600,7601].includes(Number(t.raceId))&&t.hp?.length>=2)],[3,gate(7603)]];
 for(const [g,ts] of order){if(!ts.length)continue;
  return ts.map(t=>{const hp=t.hp.filter(h=>Number.isFinite(Number(h.time))).map(h=>Number(h.time)).sort((a,b)=>a-b);const start=Math.max(0,hp[0],Number(t.firstSeen)||0),end=Math.min(Number(r.duration)||1e12,hp[hp.length-1]);return {gate:g,start,end,target:t.name||'Boss',targetIds:[t.entityId]}}).filter(w=>w.end>w.start);
 }return [];
}
function rhSkillId(s){const id=String(s.skillId??s.id??'');return id==='9999'?'':id}
// Rotation Highlights: user-supplied lowest possible ordinary cooldowns (seconds).
const RH_MIN_COOLDOWNS={"as": {"Magnum Shot": 0, "Urgent Shot": 6, "Ignis Plume": 6, "Aqua Volley": 10, "Tri-Assault": 36, "Golden Time": 162, "Terra Scourge": 24, "Ventus Howl": 10, "Crash Shot": 3.75, "Mirage Missile": 1, "Arrow Revolver": 0.5, "Final Shot": 140, "Support Shot": 6}, "ek": {"Bash": 0, "Rage Impact": 6, "Smash": 0, "Assault Slash": 0.6, "Windmill": 0.3, "Counterattack": 2.4, "Charge": 6, "Instill Elements": 0, "Dauntless Defense": 28, "Dynavolt Smash": 14, "Shattering Windmill": 8, "Blazing Assault Slash": 3, "Flashing Steel": 5}, "dd": {"Thunder": 0, "Thunderblight": 15, "Shadow Flare": 10, "Seething Mana": 0, "Render Dorcha": 10, "Twilight Surge": 30, "Render Mana": 0, "Hexshroud": 30, "Polar Vortex": 20, "Fireball": 0, "Ice Spear": 0, "Meteor Strike": 500}, "mp": {"Wire Pull": 0, "Act 6: Crisis": 0, "Act 2: Threshold Cutter": 0, "Act 7: Climactic Crash": 0, "Act 4: Rising Action": 0, "Death Mark": 0, "Cutting Chorus": 2, "Downbeat Drop": 4, "Relentless Tempo": 10, "Showstopper": 45, "Live Wire": 10}, "sg": {"Bash": 0, "Defense": 0, "Counterattack": 2.4, "Charge": 6, "Pledge of Penance": 40, "Provoke": 20, "Ardent Advance": 3, "Rend Armor": 0, "Zealous Conviction": 0, "Deliver Judgment": 9, "Divine Retribution": 0, "Virtuous Oath": 0}, "ag": {"Shooting Rush": 4.8, "Grapple Shot": 8, "Way of the Gun": 144, "Bullet Storm": 12, "Reload": 0, "Bullet Barrage": 8, "Heavy Artillery": 9, "Tracer Pod": 0, "Detonation Field": 0, "Gunner's Crest": 0, "Fatal Scope": 25, "Calamity Cannon": 8}, "bb": {"Charging Strike": 0, "Spinning Uppercut": 0, "Pummel": 0, "Focused Fist": 0, "Ignite: Hammerblow": 7.2, "Ignite: Flurry of Fists": 7.2, "Ignite: Cyclone Drive": 7.2, "Radiant Storm": 21, "Piercing Gale": 15.4}, "ev": {"Lance Charge": 0, "Lance Leap": 4.2, "Lance Impact": 2.1, "Lance Counter": 3.5, "Charge": 6, "Recharge Shells": 0, "Relentless Thrust": 0, "Arc Impact": 8, "Blast Zone": 6, "Drill Charge": 0, "Dreadnought Burst": 7, "Blaze of Glory": 30}, "fa": {"Water Cannon": 0, "Flame Burst": 0, "Wind Blast": 4.4, "Sand Burst": 2.1, "Hydra Transmutation": 8.3, "Compound Catalyst": 0, "Elemental Amplification": 20, "Elemental Compounding": 0, "Fangs of Stone": 0, "Serpentcall": 42}, "hs": {"Healing": 0, "Party Healing": 0, "Blessing of Protection": 120, "Echoes of Salvation": 3, "Hand of Restoration": 3, "Hymn of Resurrection": 4, "Pall of Ruination": 180, "Pulse of Purification": 60, "Voice of Vitality": 240}};
const RH_EXTRA_COOLDOWNS={"Final Hit": 120, "Evasion": 0, "Stampede": 9, "Lightning Rod": 21, "Shockwave": 0, "Spell Walk": 0, "Flash Launcher": 4.8, "Bullet Slide": 4, "Somersault Kick": 0, "Drop Kick": 0, "Chemical Carnival": 0, "Heat Buster": 0, "Frozen Blast": 15.4, "Rain Casting": 48, "Resonana Litany": 1};
const rhCanonicalName=n=>String(n||'').toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
// Only explicit skill-ID metadata on boss conditions with a recorded source
// can corroborate remote skill activity. Other condition IDs and effect-recipient
// associations cannot establish the caster. Interval starts have second precision.
function rhConditionHints(r,playerId,start,end,targetIds){
 const bosses=new Set((targetIds||[]).map(String)),rows=[];
 for(const t of r.targets||[]){
  if(!bosses.has(String(t.entityId)))continue;
  for(const c of t.conditions||[]){
   if(String(c.attackerId||'')!==String(playerId)||!Number.isFinite(Number(c.start)))continue;
   const time=Number(c.start);if(time<start||time>end)continue;
   const meta=String(c.metadata||'');
   // Explicit skill ID carried by a known Midir condition metadata field.
   const matched=meta.match(/(?:^|;)MNEI:2:(\d+)(?:;|$)/)||meta.match(/(?:^|;)MCDCASI:2:(\d+)(?:;|$)/);
   if(!matched||matched[1]==='9999')continue;
   rows.push({skillId:matched[1],relativeMs:time*1000,conditionId:c.conditionId,targetId:String(t.entityId),source:'source-attributed-target-condition'});
  }
 }
 return rows.sort((a,b)=>a.relativeMs-b.relativeMs);
}
// Companion 224 — evidence-limited cooldown-relative scoring.
// A remote player does NOT have 0x6988 use packets. Verified action stages are
// timing hints, not casts; recipient effects never establish who cast a skill.
// Previously one unknown cooldown invalidated every window for the entire fight.
// Instead, score only boss-hit skills with a known minimum cooldown and report
// everything that cannot be audited as unscored context.
// Skill-specific usage budgets. The recognized use timeline runs across the
// *whole attempt*, so starting a 10s/60s viewing window never resets cooldowns.
// Companion 276: editable skill-shape defaults for cooldown-audited windows only.
// Durations are provisional; damage outside a known duration may imply another use.
// Keep them separate from RH_MIN_COOLDOWNS so rules can be corrected independently.
const RH_SKILL_SHAPES={
 'thunderblight':{duration:16,maxHits:45,dot:true},
 'pledge of penance':{duration:40,maxHits:120,dot:true},
 'terra scourge':{duration:23,maxHits:24,dot:true},
 'pulse of purification':{duration:20,maxHits:100,dot:true},
 'hydra transmutation':{duration:18,maxHits:100,dot:true},
 'live wire':{duration:12,maxHits:90,dot:true},
 'resonant litany':{duration:4,maxHits:7},
 'tri assault':{duration:3,maxHits:6},
 'thunder':{duration:3.5,maxHits:35}
};
function rhCooldownEvidence(part,skillNames,arcana,rhRule,strikes){
 const credits=new Map(),groups=new Map();let capped=0;
 const table=RH_MIN_COOLDOWNS[arcana]||{};
 const cooldowns=new Map([...Object.entries(table),...Object.entries(RH_EXTRA_COOLDOWNS)].map(([name,seconds])=>[rhCanonicalName(name),Number(seconds)]));
 const getRule=id=>{
  const name=skillNames.get(String(id))||'';
  const base=window.MIDIR_SKILL_USES?.ruleFor(id,name)||{cooldown:0,maxHits:1,hitWindow:2};
  const shape=RH_SKILL_SHAPES[rhCanonicalName(name)]||{};
  const cd=cooldowns.get(rhCanonicalName(name));
  // Without an explicit multi-hit/area/duration rule, each positive boss hit
  // is provisionally its own use. A generic default 2s packet window is not
  // sufficient evidence for grouping hits into a single activation.
  const shaped=Object.keys(shape).length>0||Number(base.maxHits)>1||Number(base.hitWindow)!==2;
  return {...base,...shape,cooldown:Number.isFinite(cd)?cd:base.cooldown,
   hitWindow:shape.duration??(shaped?base.hitWindow:0)};
 };
 // Recognized timestamps are candidate activations. Collapse closely repeated
 // packets and reject a too-early new use without discarding the original
 // activation's ongoing damage-over-time ticks.
 for(const u of part.useEvents||[]){const id=String(u.skillId),arr=groups.get(id)||[],t=Number(u.relativeMs);
  if(!Number.isFinite(t))continue;
  if(!arr.length||t-arr[arr.length-1].time>300)arr.push({time:t,credited:0,observed:true,accepted:null});
  groups.set(id,arr);
 }
 for(const arr of groups.values())arr.sort((a,b)=>a.time-b.time);
 for(const e of part.events){
  const id=String(e.id),rule=getRule(id),time=e.time*1000;
  const arr=groups.get(id)||[];
  let lastAccepted=null;
  for(const a of arr){if(a.time>time+150)break;
   if(a.accepted!==null) {if(a.accepted)lastAccepted=a;continue}
   const cd=Number(rule.cooldown)||0;
   a.accepted=!lastAccepted||a.time-lastAccepted.time>=cd*1000-150;
   if(a.accepted)lastAccepted=a;
  }
  let anchor=null;
  for(let i=arr.length-1;i>=0;i--){const a=arr[i],delta=time-a.time;
   if(a.accepted===true&&delta>=-150&&delta<=rule.hitWindow*1000&&a.credited<rule.maxHits){anchor=a;break}
  }
  let violates=false;
  if(!anchor){
   const cd=Number(rule.cooldown)||0;
   violates=!!lastAccepted&&time-lastAccepted.time<cd*1000-150;
   anchor={time,credited:0,observed:false,accepted:!violates};
   arr.push(anchor);arr.sort((a,b)=>a.time-b.time);groups.set(id,arr);
  }
  const hits=Math.max(0,e.precise?1:strikes(e));
  const credit=violates?0:Math.min(hits,Math.max(0,rule.maxHits-anchor.credited));
  anchor.credited+=credit;capped+=hits-credit;
  credits.set(e,{credit,reason:violates?'cooldown-conflict':credit?'skill-shape':'hit-limit',
   cd:rule.cooldown,anchored:anchor.observed});
 }
 return {credits,capped,unknownIds:new Set(),anchored:(part.useEvents||[]).length};
}
function rhBuild(){
 const eligible=rhEligible(),pieces=[];
 for(const x of eligible)for(const win of rhEncounter(x)){
  if(rhEncounterArcana(x.r,x.p,win).arc!==state.arcana)continue;
  const events=[];const hits=x.r.damageHitEvents||[],bossIds=new Set(win.targetIds.map(String));
  const preciseAvailable=x.r.damageHitSchemaVersion===1||hits.length>0;
  if(preciseAvailable){for(const h of hits){const time=h.relativeMs/1000;if(String(h.playerId)!==String(x.p.entityId)||String(h.skillId)==='9999'||!bossIds.has(String(h.targetId))||time<win.start||time>win.end)continue;
   events.push({time,id:h.skillId,hits:1,crits:h.critical?1:0,damage:h.damage,critical:h.critical,precise:true});
  }}else{for(const group of x.p.damageEvents||[]){const time=Number(group.time);if(!Number.isFinite(time)||time<win.start||time>win.end)continue;
   for(const sk of group.skills||[]){const id=rhSkillId(sk),hits=rhSafe(sk.hits??sk.hitCount);if(!id||!hits)continue;
    events.push({time,id,hits,crits:Math.min(hits,rhSafe(sk.crits??sk.critCount))});
   }}}
  if(events.length){
   const scopeEvidence=window.MIDIR_SKILL_EVIDENCE?.collect(x.r,x.p.entityId,win.start,win.end);
   const useEvents=window.MIDIR_SKILL_USES?.recognize(x.r,x.p.entityId,{start:win.start,end:win.end,targetIds:win.targetIds})||[];
   pieces.push({...win,r:x.r,p:x.p,events:events.sort((a,b)=>a.time-b.time),precise:preciseAvailable,
    uses:(x.r.skillUseEvents||[]).filter(u=>u.playerId===x.p.entityId&&u.relativeMs/1000>=win.start&&u.relativeMs/1000<=win.end),
    useEvents,actionBursts:window.MIDIR_SKILL_EVIDENCE?.actionBursts(scopeEvidence?.actions||[])||[],
    conditionHints:rhConditionHints(x.r,x.p.entityId,win.start,win.end,win.targetIds)});
  }
 }
 // A precise boss-recipient hit is stronger scope evidence than a Gate 2 label.
 // Consider every qualifying gate with actual boss-target hits. Only fall back
 // to Gate 2 when there are no such precise windows anywhere in the reports.
 const bossOnly=pieces.some(p=>p.precise);
 const gate2=!bossOnly&&pieces.some(p=>p.gate===2);
 const selected=bossOnly?pieces.filter(p=>p.precise):gate2?pieces.filter(p=>p.gate===2):pieces;
 const observed=new Map(),skillNames=new Map();
 for(const entry of selected)for(const s of entry.p.skills||[]){const id=rhSkillId(s);if(!id)continue;
  const hits=rhSafe(s.hitCount??s.hits),crits=Math.min(hits,rhSafe(s.criticalHits??s.critCount));const non=hits-crits,damage=rhSafe(s.nonCriticalDamage),critDamage=rhSafe(s.criticalDamage);
  if(!observed.has(id))observed.set(id,{n:0,d:0,c:0,cd:0});const o=observed.get(id);o.n+=non;o.d+=damage;o.c+=crits;o.cd+=critDamage;
  if(s.name)skillNames.set(id,String(s.name));
 }
 // Passive chance procs must not be treated as deliberate rotation actions.
 const excludedName=name=>/^(redoubled offensive|flare|blast)$/.test(String(name||'').trim().toLowerCase());
 const excludedIds=new Set([...skillNames].filter(([,name])=>excludedName(name)).map(([id])=>String(id)));
 for(const part of pieces)part.events=part.events.filter(e=>!excludedIds.has(String(e.id)));
  // Prefer actual boss-recipient hit observations for shared non-crit reference values.
 // This prevents damage to summoned enemies from influencing the skill baseline.
 if(selected.some(x=>x.precise)){
  observed.clear();for(const entry of selected.filter(e=>e.precise))for(const h of entry.events){if(!observed.has(h.id))observed.set(h.id,{n:0,d:0,c:0,cd:0});const o=observed.get(h.id);
   if(h.critical){o.c++;o.cd+=h.damage;}else{o.n++;o.d+=h.damage;}
  }
 }
 for(const entry of selected)for(const u of entry.useEvents||[])if(u.skillName&&!skillNames.has(u.skillId))skillNames.set(u.skillId,u.skillName);
 const baseline=new Map();
 const selectedSkillIds=new Set(selected.flatMap(part=>part.events.map(e=>String(e.id))));
 // The character has one critical-damage multiplier shared across skills.
 // Infer that multiplier from skills with BOTH ordinary and critical evidence.
 // Weighted median resists noisy small samples; this is an estimate, not proof.
 const critRatios=[];
 for(const [id,o] of observed){
  if(excludedIds.has(String(id))||!selectedSkillIds.has(String(id)))continue;
  if(o.n>0&&o.d>0){
   const ordinary=o.d/o.n;baseline.set(id,{value:ordinary,estimated:false});
   if(o.c>0&&o.cd>0){
    const ratio=(o.cd/o.c)/ordinary;
    if(Number.isFinite(ratio)&&ratio>0)critRatios.push({ratio,weight:Math.min(o.n,o.c)});
   }
  }
 }
 critRatios.sort((a,b)=>a.ratio-b.ratio);
 const totalWeight=critRatios.reduce((sum,r)=>sum+r.weight,0);
 let criticalMultiplier=null,accumulatedWeight=0;
 for(const r of critRatios){accumulatedWeight+=r.weight;
  if(accumulatedWeight>=totalWeight/2){criticalMultiplier=r.ratio;break;}
 }
 // A crit-only skill can still contribute. Normalize its observed critical
 // damage by this same player's measured multiplier, with no crit-score bonus.
 if(criticalMultiplier){for(const [id,o] of observed){
  if(excludedIds.has(String(id))||!selectedSkillIds.has(String(id))||baseline.has(id)||o.c<=0||o.cd<=0)continue;
  const estimatedNormal=(o.cd/o.c)/criticalMultiplier;
  if(Number.isFinite(estimatedNormal)&&estimatedNormal>0)baseline.set(id,{value:estimatedNormal,estimated:true});
 }}
 // Only enforce constraints verified for a specific skill. A fixed cooldown must
 // never be inferred from the generic rotation-crafter default for all skills.
 const RH_RULES={
  'tri-assault':{maxStrikesPerAppearance:3,maxAppearances:3,windowSeconds:36},
  'resonant litany':{maxStrikesPerAppearance:7},
  'ignis plume':{maxStrikesPerAppearance:3},
  'act 2: threshold cutter':{maxStrikesPerAppearance:3},
  'act 7: climatic clash':{maxStrikesPerAppearance:3},
  'act 7: climactic clash':{maxStrikesPerAppearance:3},
  'act 7: climactic crash':{maxStrikesPerAppearance:3},
  'explosive kunai':{maxStrikesPerAppearance:8,expectedStrikes:5},
  'sakura abyss':{maxStrikesPerAppearance:5},
  'heat buster':{maxStrikesPerAppearance:3},
  'meridian sweep':{maxStrikesPerAppearance:3},
  'somersault kick':{maxStrikesPerAppearance:3},
  'relentless tempo':{maxStrikesPerAppearance:7},
  'rend armor':{cooldownException:'Parry reset'},
  'shooting rush':{cooldownException:'Spirit reset'},
  'rage impact':{cooldownException:'Spirit reset'},
  'bullet barrage':{unrestrictedHits:true},
  'bullet storm':{unrestrictedHits:true},
  'live wire':{dot:true},
  'pulse of purification':{dot:true},
  'pledge of penance':{dot:true}
 };
 const bb=state.arcana==='bb';
 function rhRule(id){const name=(skillNames.get(id)||'').toLowerCase();return Object.entries(RH_RULES).find(([key])=>name.includes(key))?.[1]||null;}
 function strikes(entry){if(entry.precise)return entry.hits;const label=(skillNames.get(entry.id)||'').toLowerCase();if(bb)return entry.hits;
  const rule=rhRule(entry.id);if(rule?.unrestrictedHits||rule?.dot)return entry.hits;if(rule?.maxStrikesPerAppearance)return Math.min(entry.hits,rule.maxStrikesPerAppearance+(state.arcana==='ag'?1:0));if(state.arcana==='ag')return Math.min(entry.hits,2);
  // Single-target equivalent: group multi-target collisions to one observed hit by default.
  return Math.min(entry.hits,1);
 }
 function invalidByVerifiedRule(events,uses=[]){if(bb)return false;
  // When observed skill-use packets exist, check their timestamps, not damage hits.
  // Packet observations are not a cast counter; do not reject a valid boss segment
  // because extra 0x6988 packets occurred in the same activation.
  if(uses.length)return false;
  for(const [name,rule] of Object.entries(RH_RULES)){
   if(rule.cooldownException||!rule.maxAppearances)continue;
   const observed=events.filter(e=>(skillNames.get(e.id)||'').toLowerCase().includes(name)).sort((a,b)=>a.time-b.time);
   for(let i=0;i<observed.length;i++){let count=0,prior=null;
    for(let j=i;j<observed.length&&observed[j].time<observed[i].time+rule.windowSeconds;j++){
     if(observed[j].time!==prior){count++;prior=observed[j].time;}
    }
    if(count>rule.maxAppearances)return true;
   }
  }
  return false;
 }
 const best={10:null,60:null},repeatable={10:null,60:null};
 for(const part of selected){part.cooldownEvidence=rhCooldownEvidence(part,skillNames,state.arcana,rhRule,strikes);
  part.skillNameById=Object.fromEntries(skillNames);}
 for(const win of selected)for(const seconds of [10,60]){
  if(win.end-win.start<seconds)continue;
  const candidates=new Set([win.start,win.end-seconds]);for(const e of win.events){candidates.add(Math.max(win.start,Math.min(win.end-seconds,e.time)));candidates.add(Math.max(win.start,Math.min(win.end-seconds,e.time-seconds+0.0001)));}
  for(const start of candidates){const events=win.events.filter(e=>e.time>=start&&e.time<start+seconds);if(!events.length||invalidByVerifiedRule(events,win.uses?.filter(u=>u.relativeMs/1000>=start&&u.relativeMs/1000<start+seconds)))continue;
   // For precise hits, a grouped bucket/use can strike a boss more than once.
   // Credit up to the verified hit budget per inferred skill activation, but do
   // not let additional targets or repeat packets masquerade as extra casts.
   const perActivation=new Map();
   const usesBySkill=new Map();for(const u of win.uses||[]){const k=String(u.skillId);if(!usesBySkill.has(k))usesBySkill.set(k,[]);usesBySkill.get(k).push(u)}
   const preciseAllowance=e=>{
     if(!e.precise||bb)return 1;
     const rule=rhRule(e.id);if(rule?.unrestrictedHits||rule?.dot)return 1;
     const cap=rule?.maxStrikesPerAppearance??1;
     const max=cap+(state.arcana==='ag'?1:0);
     const uses=(usesBySkill.get(String(e.id))||[]).filter(u=>u.relativeMs/1000<=e.time&&u.relativeMs/1000>=e.time-30);
     const use=uses[uses.length-1];const group=use?`use:${use.atMs||use.relativeMs}`:`second:${Math.floor(e.time)}`;
     const k=String(e.id)+':'+group;const count=perActivation.get(k)||0;perActivation.set(k,count+1);
     return count<max?1:0;
   };

   let score=0,hasEstimate=false;const details=[];for(const e of events){const ref=baseline.get(e.id);if(!ref)continue;const credited=e.precise?preciseAllowance(e):strikes(e);if(credited<=0)continue;score+=credited*ref.value;hasEstimate ||= ref.estimated;details.push({...e,credited,normalized:credited*ref.value,name:skillNames.get(e.id)||'Unidentified skill',estimated:ref.estimated});}
   if(score>0&&(!best[seconds]||score>best[seconds].score))best[seconds]={...win,start,seconds,score,details,hasEstimate};
   // Rank a separate cooldown-respecting *candidate*. Unknown cooldowns do
   // not erase useful evidence from known skills such as Hand of Restoration.
   // This is NOT a verified cast sequence and deliberately omits unscored hits.
   const constrained=win.cooldownEvidence;
   let repeatScore=0,repeatEstimate=false;
   const repeatDetails=[],unscoredHits=[];
   for(const e of events){
    const ref=baseline.get(e.id),budget=constrained.credits.get(e);
    const credit=budget?.credit||0;
    if(!ref||!credit){
     unscoredHits.push({...e,name:skillNames.get(String(e.id))||'Unidentified skill',
      reason:!ref?'no-noncritical-baseline':budget?.reason||'unresolved'});
     continue;
    }
    repeatScore+=credit*ref.value;repeatEstimate ||= ref.estimated;
    repeatDetails.push({...e,credited:credit,normalized:credit*ref.value,
     name:skillNames.get(String(e.id))||'Unidentified skill',estimated:ref.estimated,
     evidence:budget.anchored?'timing-observation-and-hits':'damage-hit-inferred'});
   }
   const exceptions=/(time shift|bachram boost)/i;
   const overrides=[...(win.uses||[]).map(u=>({skillId:u.skillId,skillName:u.skillName,
    time:Number(u.relativeMs)/1000})),...(win.actionBursts||[]).map(a=>({skillId:a.skillId,skillName:a.skillName,time:Number(a.relativeMs)/1000}))];
   const hasOverride=overrides.some(u=>exceptions.test(String(u.skillName||skillNames.get(String(u.skillId))||''))&&u.time>=start-60&&u.time<start+seconds);
   if(!hasOverride&&repeatScore>0&&(!repeatable[seconds]||repeatScore>repeatable[seconds].score))
    repeatable[seconds]={...win,start,seconds,score:repeatScore,details:repeatDetails,
     unscoredHits,hasEstimate:repeatEstimate,evidenceTier:'hit-inferred-cooldown-budget'};
  }
 }
 return {best,repeatable,bossOnly,gate2,eligible:eligible.length,encounters:selected.length,baseline};
}
// The exporter labels Wireless Puppet activations with an " AI" suffix.
// For Melodic Puppeteer these are active Acts, not passive procs. Preserve
// skill IDs and raw labels in evidence; present the ordinary Act name in UI.
function rhDisplaySkillName(name,arcana=state.arcana){
 const raw=String(name||'');
 return arcana==='mp'&&/^Act\s+\d+\s*:/i.test(raw)&&/\s+AI$/i.test(raw)
  ?raw.replace(/\s+AI$/i,'').trim():raw;
}
function rhClock(s){const n=Math.floor(s);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function rhAbbr(name){const words=String(name||'').trim().split(/\s+/).filter(Boolean);return words.length<=1?(words[0]||'SK').slice(0,2).toUpperCase():words.slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function rhSkillIcon(name,id){
 const exact=window.MIDIR_ROTATION_ICONS?.[name]||window.MIDIR_ROTATION_ICONS?.[String(name||'').replace(/\s+AI$/i,'').trim()];
 if(exact)return exact;
 const numeric=id!=null?String(id):'';
 const byData=window.MIDIR_DATA?.arcana&&Object.values(window.MIDIR_DATA.arcana).flatMap(a=>Array.isArray(a.skills)?a.skills:[]).find(s=>String(s.id)===numeric||String(s.name||'').trim().toLowerCase()===String(name||'').trim().toLowerCase());
 return (byData&&window.MIDIR_ICONS?.skills?.[byData.id])||'';
}
function rhTileInner(e){const icon=rhSkillIcon(e.name,e.id);return icon?`<img src="${esc(icon)}" alt="" loading="lazy"><small>${esc(rhAbbr(e.name))}</small>`:`<b>${esc(rhAbbr(e.name))}</b>`}
function rhTrackTitle(name,id){const icon=id==='__other'?'':rhSkillIcon(name,id);return icon?`<span class="rh-track-title"> <img src="${esc(icon)}" alt="" loading="lazy"><span>${esc(name)}</span></span>`:`${esc(name)}`}
// Combine independent player-attributed evidence without interpreting packet counts
// as cast counts. A typed effect addressed to this player is deliberately absent.
function rhEvidenceTimelineActions(w,seconds){
 const start=w.start,end=start+seconds;
 return (w.useEvents||[]).filter(u=>u.relativeMs/1000>=start&&u.relativeMs/1000<end)
  .map(u=>({u:{...u,skillName:rhDisplaySkillName(u.skillName)},sourceSkillName:u.skillName,
   t:u.relativeMs/1000,count:u.hitCount,crits:u.criticalHits,damage:u.damage}));
}
function rhVisualTimeline(w, actions, displayDetails, seconds, mode="best"){
 const events=actions.map((a,i)=>({t:a.t,id:String(a.u.skillId),name:a.u.skillName||w.skillNameById?.[String(a.u.skillId)]||'Unidentified skill',
  crits:a.crits||0,hitCount:a.count||0,noHit:!a.count,i})).sort((a,b)=>a.t-b.t||a.i-b.i);
 if(!events.length)return '<p class="hint">No skill uses identified inside this window.</p>';
 // Display a separate skill lane even for one-off puppet Acts; previously
 // uncommon skills were collapsed into a generic Other skills lane.
 const trackKeys=[...new Set(events.map(e=>state.arcana==='mp'&&/^Act\s+\d+\s*:/i.test(e.name)?'act:'+rhCanonicalName(e.name):'id:'+e.id))];
 const label=e=>`${e.name} · +${Math.max(0,e.t-w.start).toFixed(2)}s${e.hitCount?' · '+e.hitCount+' hits':''}${e.crits?' · '+e.crits+' critical hits':''}`;
 const chip=e=>`<span class="rh-tile${e.noHit?' no-hit':''}${e.crits?' has-crit':''}" tabindex="0" title="${esc(label(e))}" aria-label="${esc(label(e))}">${rhTileInner(e)}${e.crits?'<sup>✦'+e.crits+'</sup>':''}</span>`;
 const stream=`<div class="rh-flow-events">${events.map(chip).join('')}</div>`;
 const width=seconds===60?960:680;
 const trackHtml=trackKeys.map(trackKey=>{const list=events.filter(e=>(state.arcana==='mp'&&/^Act\s+\d+\s*:/i.test(e.name)?'act:'+rhCanonicalName(e.name):'id:'+e.id)===trackKey);
  const name=list[0]?.name||'Skill',id=list[0]?.id;
  const marks=list.map(e=>{const pct=Math.max(0,Math.min(98,(e.t-w.start)/seconds*100));return `<span class="rh-track-event" style="left:${pct.toFixed(3)}%">${chip(e)}</span>`}).join('');
  return `<div class="rh-track-row"><div class="rh-track-name" title="${esc(name)}">${rhTrackTitle(name,id)}</div><div class="rh-track-lane">${marks}</div></div>`;
 }).join('');
 const ticks=Array.from({length:6},(_,i)=>`<span style="left:${i*20}%">${Math.round(seconds*i/5)}s</span>`).join('');
 const tracks=`<div class="rh-track-scroll"><div class="rh-track-content" style="min-width:${width}px"><div class="rh-track-axis"><div></div><div class="rh-track-ticks">${ticks}</div></div>${trackHtml}</div></div>`;
 const uid='rh-view-'+mode+'-'+seconds;
 return `<div class="rh-visual"><div class="rh-view-options"><input type="radio" id="${uid}-stream" name="${uid}" checked><label for="${uid}-stream">Single stream</label><input type="radio" id="${uid}-tracks" name="${uid}"><label for="${uid}-tracks">Skill tracks</label></div><div class="rh-stream-panel"><p class="hint">Skill Uses · ${events.length} in this window</p>${stream}</div><div class="rh-tracks-panel"><p class="hint">Position follows recorded time. Each recognized skill gets its own track; hover or focus a tile for timestamps and hits.</p>${tracks}</div><p class="hint">✦ indicates critical hits. Skill Uses with no damage appear dimmed; multi-hit skills appear once per recognized use.</p></div>`;
}
function rotationHighlightsView(){const result=rhBuild(),key=state.arcana;
 const panel=(seconds,mode="best")=>{const w=result[mode][seconds];if(!w)return `<section class="card"><h3>${seconds}-second ${seconds===10?'Peak Burst':'Peak Rotation'}</h3><p class="muted">${mode==='repeatable'?'No boss hits within the selected cooldown and hit rules.':'No recorded peak yet.'}</p></section>`;
  const dotLabels=['live wire','pulse of purification','pledge of penance'];const dotGroups=new Map();const displayDetails=[];for(const e of w.details){const name=String(e.name||'').toLowerCase();if(dotLabels.some(x=>name.includes(x))){const key=String(e.id);if(!dotGroups.has(key)){const row={...e,time:w.start,dot:true};dotGroups.set(key,row);displayDetails.push(row);}else{const row=dotGroups.get(key);row.credited+=e.credited;row.normalized+=e.normalized;row.crits+=e.crits;}}else displayDetails.push(e);}displayDetails.sort((a,b)=>a.time-b.time);const details=displayDetails.map(e=>`<div class="rh-hit"><span class="rh-time">+${(e.time-w.start).toFixed(2)}s</span><span>${esc(e.name)}${e.dot?' · damage over time (combined)':''} ${key==='bb'&&e.crits?' <strong class="gold">✦ '+e.crits+' crit'+(e.crits===1?'':'s')+'</strong>':''}</span><span>${fmt(e.credited)} hit${e.credited===1?'':'s'} · ${fmt(Math.round(e.normalized))}</span></div>`).join('');
  const actions=rhEvidenceTimelineActions(w,seconds);
  const actionRows=actions.map(a=>`<div class="rh-hit"><span class="rh-time">+${(a.t-w.start).toFixed(2)}s</span><span>${esc(a.u.skillName)}</span><span>${a.count?fmt(a.count)+' hits · '+fmt(Math.round(a.damage))+' damage':'No damage hits'}</span></div>`).join('');
  const visualTimeline=rhVisualTimeline(w,actions,displayDetails,seconds,mode);
  const excluded=w.unscoredHits||[];
  const omitted=new Map();for(const e of excluded)omitted.set(e.name,(omitted.get(e.name)||0)+1);
  const excludedNotice=mode==='repeatable'?`<p class="hint">Skill cooldowns and maximum hits per use are applied. Default rules: 0s cooldown, 1 hit per use.${omitted.size?' Hits above a skill limit: '+esc([...omitted].map(([name,count])=>name+' ('+count+')').join(', '))+'.':''}</p>`:'';
  const actionPanel=actions.length?`<details class="rh-actions"><summary>Skill Uses · ${actions.length}</summary><div class="rh-sequence">${actionRows}</div></details>`:'';
  return `<section class="card"><h3>${seconds}-second ${seconds===10?'Burst':'Rotation'} · ${mode==='repeatable'?'Cooldown-aware':'Recorded peak'}</h3><div class="rh-metric"><strong>${fmt(Math.round(w.score))}</strong><span>Boss Damage Score</span></div><p>${esc(w.target)} · Gate ${w.gate||'—'} · ${rhClock(w.start)}–${rhClock(w.start+seconds)}</p><p class="hint">${esc(w.r.name)} · ${w.details.length} recorded boss-hit events${w.hasEstimate?' · includes estimated non-critical averages':''}</p>${excludedNotice}${visualTimeline}${actionPanel}<details><summary>Damage Timeline</summary><div class="rh-sequence">${details}</div></details></section>`;
 };
 return `<h2>${esc(RH_ARCANA[key]||key)} · Rotation Highlights</h2><p class="muted">Your strongest recorded boss-hit sequences, with per-skill cooldown and hit-count rules. Skill resets and temporary cooldown overrides may affect these windows. Using a shared non-critical damage baseline across eligible runs of ${esc(state.characterName||'your character')} as this Arcana.</p><p class="hint">${result.eligible} imported player report(s) · ${result.encounters} qualifying boss interval(s) · ${result.bossOnly?'Boss-only hit evidence prioritized':result.gate2?'Boss-only hits unavailable; Gate 2 prioritized':'Boss-only hits and Gate 2 unavailable; using other encounter windows'}. ${key==='bb'?'Blazing Brawler preserves all registered hits and marks critical hits; cooldown anomalies are not rejected.':'Single-target-equivalent strikes use conservative caps; recorded hits are scored without assuming general skill cooldowns.'} Boss-target hits are used when available. Skill Uses include skills without damage when their identifying signatures are available. Rules can be tuned as more recordings become available.</p><div class="rh-results">${panel(10)}${panel(60)}</div><h3>Cooldown-aware Rotation Highlights</h3><p class="hint">Scores use the same Skill Uses timeline with per-skill cooldowns and maximum hits per use. New skills default to 0s cooldown and 1 hit per use; skill-specific overrides can be refined with future recordings.</p><div class="rh-results">${panel(10,"repeatable")}${panel(60,"repeatable")}</div><p class="hint">Midir 45 records are filtered to observed boss target IDs. When precise hits are absent, results are approximate one-second hit sequences and may include other targets.</p>`;
}
const rhReferenceOriginal=referencePage;
referencePage=function(){let html=rhReferenceOriginal();if(!rhEligible().length)return html;const item=`<button class="rotation-shortcut" data-act="hub:highlights"><strong>Rotation Highlights</strong><span>See your best normalized 10-second and 60-second boss rotations from imported ${esc(RH_ARCANA[state.arcana])} runs.</span></button>`;return html.replace('<button class="rotation-shortcut" data-act="hub:craft">',item+'<button class="rotation-shortcut" data-act="hub:craft">');};
// The earlier selector wrapper calls referencePage() dynamically, so routing remains intact.
const rhHubOriginal=rotationHub;
rotationHub=function(){if(rotationView==='highlights')return `<div class="rotation-back"><button data-act="hub:home">← Return to the Arcana Simulators</button></div>`+(rhEligible().length?rotationHighlightsView():'<p>No matching character and Arcana data imported.</p>');return rhHubOriginal()};
rotation=rotationHub;

// Companion 152: frame challenge is a separate mode within the existing AS / AG positioning labs.
const framePreviousPosition=positionStudio,framePreviousAg=agPositionView,framePreviousBind=bind;
positionStudio=function(){return window.MIDIR_FRAMES.active('as')?'<div id="fb-host">'+window.MIDIR_FRAMES.view('as')+'</div>':framePreviousPosition().replace('<h2>Positioning Lab</h2>','<h2>Positioning Lab</h2><div class="button-row"><button type="button" class="primary" data-fb-enter="as">Play Target Frames · 10 + bonus</button></div>')};
agPositionView=function(){return window.MIDIR_FRAMES.active('ag')?'<div id="fb-host">'+window.MIDIR_FRAMES.view('ag')+'</div>':framePreviousAg().replace('<h2>Arsenal Gunner · Field & Firing Lane Lab</h2>','<h2>Arsenal Gunner · Field & Firing Lane Lab</h2><div class="button-row"><button type="button" class="primary" data-fb-enter="ag">Play Target Frames · 10 + bonus</button></div>')};
window.MIDIR_FRAME_EXIT=function(){render()};
// Frame, Tower Defense, and Invaders bind from one route-aware hook below.


// EV tower lab is an independent Arcana tool; never replace the existing Crafter.
const evtdPreviousReference=referencePage;
referencePage=function(){const html=evtdPreviousReference();if(state.arcana!=='ev')return html;return html.replace('<button class="rotation-shortcut" data-act="hub:craft">','<button class="rotation-shortcut" data-act="hub:ev-defense"><strong>Tower Range Lab · Prototype</strong><span>Buy skill towers, visualize ranges and cooldowns, and defend waves with saved upgrades.</span></button><button class="rotation-shortcut" data-act="hub:craft">');};
const evtdPreviousHub=rotationHub;
rotationHub=function(){if(rotationView==='ev-defense'&&state.arcana==='ev')return '<div class="rotation-back"><button data-act="hub:home">← Return to the Arcana Simulators</button></div>'+window.MIDIR_EV_DEFENSE.view();return evtdPreviousHub();};
rotation=rotationHub;



/* Crom Bás Invaders integration */
const asciPreviousHub=rotationHub,asciPreviousAction=action;
// Crom Bás Invaders is registered directly in referencePage's shortcuts and overviewLinks.
rotationHub=function(){if(rotationView==='as-invaders'&&state.arcana==='as')return '<div class="rotation-back"><button data-act="hub:home">← Return to the Arcana Simulators</button></div>'+window.MIDIR_AS_INVADERS.view();return asciPreviousHub();};
// A single binder for standalone simulator modes; keep the base form bindings intact.
bind=function(){
 framePreviousBind();
 if(state.page!=='rotation')return;
 if((rotationView==='position'&&state.arcana==='as')||(rotationView==='ag-position'&&state.arcana==='ag')){
  const key=state.arcana,enter=document.querySelector('[data-fb-enter]');
  if(enter)enter.addEventListener('click',()=>{window.MIDIR_FRAMES.begin(key);render()});
  if(window.MIDIR_FRAMES.active(key))window.MIDIR_FRAMES.bind(key);
 }
 if(state.arcana==='ev'&&rotationView==='ev-defense')window.MIDIR_EV_DEFENSE.bind();
 if(state.arcana==='as'&&rotationView==='as-invaders')window.MIDIR_AS_INVADERS.bind();
};
action=function(s){if(s.startsWith('hub:')&&rotationView==='as-invaders')window.MIDIR_AS_INVADERS.leave();return asciPreviousAction(s);};
rotation=rotationHub;


/* Companion 225: player presentation and preferences. The parser remains separate
 * from the UI; disabling Secret Sauce changes discoverability, not stored data.
 * Preference fields live under state.settings and are automatically included in
 * the existing full-profile backup / restore flow. */
const companionAccentColors={
 teal:{accent:'#5ad2c3',gold:'#f2bb65'},
 blue:{accent:'#70b9ff',gold:'#f2c67b'},
 violet:{accent:'#b7a1ff',gold:'#ffca84'},
 amber:{accent:'#efbd68',gold:'#ffd18b'},
 rose:{accent:'#ff96b6',gold:'#f2c87b'},
 green:{accent:'#8cd6a3',gold:'#f2bb65'}
};
function companionPrefs(){
 const opt=(state.settings&&typeof state.settings==='object'&&!Array.isArray(state.settings))?state.settings:{};
 const accent=Object.hasOwn(companionAccentColors,opt.accentColor)?opt.accentColor:'teal';
 const detail=Number(opt.detailedTooltipSeconds);
 return {secretSauce:opt.secretSauce===true,accentColor:accent,
   detailedTooltipSeconds:[3,5,8,12,15,20].includes(detail)?detail:8,
   textSize:opt.textSize==='large'?'large':'normal',reduceMotion:opt.reduceMotion===true};
}
function companionApplyAppearance(){
 const opt=companionPrefs(),palette=companionAccentColors[opt.accentColor],root=document.documentElement;
 root.style.setProperty('--accent',palette.accent);
 root.style.setProperty('--gold',palette.gold);
 root.dataset.companionTextSize=opt.textSize;
 root.dataset.companionReduceMotion=opt.reduceMotion?'on':'off';
 root.dataset.companionSecret=opt.secretSauce?'on':'off';
 window.MIDIR_COMPANION_PREFS={detailedTooltipSeconds:opt.detailedTooltipSeconds};
 const heading=document.querySelector('header h1');
 if(heading)heading.innerHTML=opt.secretSauce?'Midir <span>Companion</span>':'Mabinogi <span>Companion</span>';
 document.title=opt.secretSauce?'Midir Companion — The Vault & Training':'Mabinogi Companion — Practice & Play';
}
function settingsPage(){
 const cfg=companionPrefs();
 const palettes=[['teal','Sea Glass'],['blue','Sky Blue'],['violet','Violet'],['amber','Golden'],['rose','Rose'],['green','Forest']];
 return `<div class="settings-page"><div class="settings-title"><div><p class="eyebrow">COMPANION PREFERENCES</p><h2>Settings</h2><p class="muted">Customize your training space. Changes are saved automatically.</p></div><button type="button" data-act="settings-close">Return to practice</button></div>
 <section class="card settings-section"><h3>Appearance</h3>
 <fieldset class="settings-color-choices"><legend>Accent color</legend><div class="settings-swatch-grid">${palettes.map(([id,label])=>`<label class="settings-swatch ${cfg.accentColor===id?'is-selected':''}"><input type="radio" name="companion-accent" value="${id}" data-setting="accentColor" ${cfg.accentColor===id?'checked':''}><span class="settings-swatch-dot" style="background:${companionAccentColors[id].accent}"></span><span>${label}</span></label>`).join('')}</div></fieldset>
 <div class="settings-control"><label for="companion-text-size"><strong>Text size</strong><small>Increase the interface text if you prefer.</small></label><select id="companion-text-size" data-setting="textSize"><option value="normal" ${cfg.textSize==='normal'?'selected':''}>Standard</option><option value="large" ${cfg.textSize==='large'?'selected':''}>Larger</option></select></div>
 <label class="settings-toggle"><span><strong>Reduce motion</strong><small>Minimize decorative animations and transitions.</small></span><input type="checkbox" data-setting="reduceMotion" ${cfg.reduceMotion?'checked':''}></label>
 </section>
 <section class="card settings-section"><h3>Help & tooltips</h3>
 <div class="settings-control"><label for="companion-detail-delay"><strong>Detailed tooltip delay</strong><small>Controls the extended numerical help in Tower Range Lab. Normal tooltips still appear quickly.</small></label><select id="companion-detail-delay" data-setting="detailedTooltipSeconds">${[3,5,8,12,15,20].map(n=>`<option value="${n}" ${cfg.detailedTooltipSeconds===n?'selected':''}>${n} seconds${n===8?' (default)':''}</option>`).join('')}</select></div>
 </section>
 <section class="card settings-section"><h3>Your progress</h3><p class="hint">Keep your games, training records, workshop progress, and preferences safe. A profile backup includes all saved data, even content not currently displayed.</p><div class="button-row"><button type="button" class="primary" data-act="backup">Export profile backup</button><button type="button" data-act="restore">Restore profile backup</button></div><input id="backup-picker" type="file" accept=".json" hidden><small class="muted">Restoring a full profile backup replaces this profile's saved progress. You'll see a confirmation first.</small></section>
 <section class="card settings-section settings-secret"><h3>Advanced features</h3><p class="hint">Optional collections and session tools can be hidden when you only want games and practice.</p><label class="settings-toggle settings-secret-toggle"><span><strong>See Secret Sauce</strong><small>Show Midir imports, report-based achievements, collectibles, and performance highlights. The Achievement Book is always available.</small></span><input type="checkbox" id="companion-secret-sauce" data-setting="secretSauce" ${cfg.secretSauce?'checked':''}></label><p class="hint">Hidden features and their saved progress are not deleted. This setting is saved with your profile and restored from backups.</p></section>
 </div>`;
}
function companionSettingsChange(field,el){
 if(!state.settings||typeof state.settings!=='object'||Array.isArray(state.settings))state.settings={};
 const opt=companionPrefs();
 if(field==='secretSauce')state.settings.secretSauce=!!el.checked;
 else if(field==='accentColor'&&Object.hasOwn(companionAccentColors,el.value))state.settings.accentColor=el.value;
 else if(field==='detailedTooltipSeconds'&&[3,5,8,12,15,20].includes(Number(el.value)))state.settings.detailedTooltipSeconds=Number(el.value);
 else if(field==='textSize'&&['normal','large'].includes(el.value))state.settings.textSize=el.value;
 else if(field==='reduceMotion')state.settings.reduceMotion=!!el.checked;
 else return;
 // Vault and the Achievement Book stay accessible with Secret Sauce off.
 if(save()!==false){companionApplyAppearance();render();}
 else {state.settings.secretSauce=opt.secretSauce;render();}
}
// The Settings link is accessible only from the slide-out menu.
const companionSidebarContents=sidebarContents;
sidebarContents=function(){return companionSidebarContents().replace('</div><h2>Recent training</h2>',
 '<button type="button" class="companion-settings-entry" data-overview-page="settings">⚙ Settings</button></div><h2>Recent training</h2>');};
// Don't list Vault from the primary navigation in ordinary game mode.
const companionPreviousRender=render;
render=function(){
 const on=companionPrefs().secretSauce;
 if(!on&&['imports','records','encounter'].includes(state.page))state.page='vault';
 if(!on&&rotationView==='highlights')rotationView='home';
 companionApplyAppearance();
 companionPreviousRender();
 for(const b of document.querySelectorAll('nav [data-page="vault"]')){
   b.hidden=false;b.setAttribute('aria-hidden','false');b.style.display='';
 }
 if(state.page==='settings')document.querySelector('nav button.active')?.classList.remove('active');
};
const companionPreviousPage=page;
page=function(name){
 if(!companionPrefs().secretSauce&&['imports','records','encounter'].includes(name))name='vault';
 if(name!=='rotation'&&state.page==='rotation'&&rotationView==='as-invaders')window.MIDIR_AS_INVADERS?.leave?.();
 return companionPreviousPage(name);
};
const companionPreviousAction=action;
action=function(code){
 const enabled=companionPrefs().secretSauce;
 if(code==='settings-close')return page('rotation');
 if(!enabled&&(code==='pick'||code==='inspect'||code.startsWith('vault-')||code==='vault-open'||code==='vault-inline'||code.startsWith('hub:highlights')))
   return message('Enable additional features from Settings to open this section.');
 return companionPreviousAction(code);
};
const companionPreviousBind=bind;
bind=function(){
 companionPreviousBind();
 if(state.page==='settings'){
  document.querySelectorAll('[data-setting]').forEach(el=>el.addEventListener('change',()=>companionSettingsChange(el.dataset.setting,el)));
 }
};
// Stop report-driven highlight shortcuts from appearing when optional data is hidden.
const companionOriginalEligible=rhEligible;
rhEligible=function(...args){return companionPrefs().secretSauce?companionOriginalEligible(...args):[];};
// Universal encounter-survival training: visible from every Arcana reference page.
const vertragReferencePrevious=referencePage;
referencePage=function(){
 const html=vertragReferencePrevious();
 const link='<button class="rotation-shortcut" data-act="hub:vertrag"><strong>Vertrag · Giant Phase Survival</strong><span>Universal stomp-dodging lessons with Sacred Guardian as your instructor.</span></button>';
 return html.replace('<button class="rotation-shortcut" data-act="hub:craft">',link+'<button class="rotation-shortcut" data-act="hub:craft">');
};
const vertragRotationPrevious=rotation;
rotation=function(){
 if(rotationView==='vertrag'){window.MIDIR_VERTRAG.setArcana(state.arcana);return '<div class="rotation-back"><button data-act="hub:home">← Return to the Arcana Simulators</button></div>'+window.MIDIR_VERTRAG.view();}
 return vertragRotationPrevious();
};
const vertragRenderPrevious=render;
render=function(){
 vertragRenderPrevious();
 window.MIDIR_VERTRAG.mount();
};
// Apply all preferences and hide optional features on the initial page, too.
// Companion 281: mobile report reader, ten active imports, and touch-ready SG Oath checklist.
// Desktop layout, controls and simulator behavior are untouched.
// Only modules still requiring keyboard-specific controls stay gated on mobile.
// Only the legacy drill lacks a mobile input design. All converted activities are available.
const MIDIR_MOBILE_DESKTOP_ONLY=new Set(['drill']);
const MIDIR_MOBILE_ENABLED_GAMES=['vertrag','craft','theta','position','ag-position','as-invaders','music-lie','rhythm','pig','ev-defense','bb-bandit','herbs','erg','reforge','oath','special'];
const mobilePreviousAction=action;
action=function(code){
 if(companionMobileMode()&&code==='mobile-open-settings')return page('settings');
 if(companionMobileMode()&&code.startsWith('mobile-tool:')){const target=code.slice(12),routes={'sg-full':['sg','oath'],'sg-quick':['sg','oath'],'music-calc':['hs','music-lie'],special:['ag','special'],erg:['mp','erg']};if(!Object.prototype.hasOwnProperty.call(routes,target))return;const [arc,view]=routes[target];state.arcana=arc;state.page='rotation';rotationView=view;lastHubArcana=arc;if(target==='sg-full'||target==='sg-quick'){sg.page=target==='sg-full'?'full':'quick';sg.mode=sg.page;sg.prep=sgPrepByMode[sg.page]}save();return render()}
 if(companionMobileMode()&&code==='mobile-sg-checklist'){
  state.arcana='sg';state.page='rotation';rotationView='oath';lastHubArcana='sg';sg.page='checklist';sg.checkMode=sg.checkMode==='quick'?'quick':'full';
  save();return render();
 }
 if(companionMobileMode()&&code.startsWith('hub:')&&MIDIR_MOBILE_DESKTOP_ONLY.has(code.slice(4))){
  return message('Desktop only — keyboard and mouse required.');
 }
 return mobilePreviousAction(code);
};
const mobilePreviousRender=render;
render=function(){
 mobilePreviousRender();
 if(!companionMobileMode())return;
 document.documentElement.dataset.midirMobile='true';
 if(state.page==='vault'){
  const top=document.querySelector('#app .vault-header');
  if(top){const box=document.createElement('section');box.className='mobile-companion-banner';box.setAttribute('aria-label','Mobile Companion tools');
   const advanced=companionPrefs().secretSauce;
   const active=advanced?state.reports.filter(r=>!reportIsArchived(r)).length:0;
   const reportNotes=advanced?`<p class="hint">${active} / 10 active detailed reports on mobile. Older sessions move to the Archive. Full compaction requires confirmation and original exports for recovery.</p><p class="hint">⚠ Large files can exceed phone memory even when storage space is available. Keep an external profile backup and the original HTML files.</p>`:'';
   box.innerHTML=`<h3>Mobile Companion</h3><p>${advanced?'Import downloaded Discord HTML exports, inspect your reports, and take your Oath checklist with you.':'Quick access to character preparation, practice tools, and your Oath checklist.'}</p><div id="midir-install-slot" class="midir-install-slot" aria-live="polite"></div><div class="mobile-tools-grid"><button type="button" class="primary" data-act="mobile-sg-checklist">SG Oath checklist</button><button type="button" data-act="mobile-tool:sg-full">Oath Max setup</button><button type="button" data-act="mobile-tool:sg-quick">Emergency Oath</button><button type="button" data-act="mobile-tool:music-calc">Music calculator</button><button type="button" data-act="mobile-tool:special">Special Upgrade</button><button type="button" data-act="mobile-tool:erg">Erg Simulator</button></div>${reportNotes}`;
   top.insertAdjacentElement('afterend',box);
  }
 }

 if(state.page==='rotation'){
  for(const b of document.querySelectorAll('[data-act^="hub:"]')){
   const id=b.dataset.act.slice(4);
   if(!MIDIR_MOBILE_DESKTOP_ONLY.has(id)){
    b.disabled=false;b.classList.remove('mobile-desktop-only');b.removeAttribute('title');
    b.querySelector('.mobile-na')?.remove();
   }
  }
  for(const b of document.querySelectorAll('[data-act^="hub:"]')){
   const id=b.dataset.act.slice(4);if(!MIDIR_MOBILE_DESKTOP_ONLY.has(id))continue;
   b.disabled=true;b.classList.add('mobile-desktop-only');b.title='N/A on mobile — requires a keyboard and mouse';
   if(!b.querySelector('.mobile-na')){const notice=document.createElement('small');notice.className='mobile-na';notice.textContent='N/A on mobile · desktop only';b.appendChild(notice)}
  }
 }
};

companionApplyAppearance();
render();

})();

