/* Ephemeral local developer QA. No name, purchases, or achievements are persisted in ordinary saves. */
(()=>{'use strict';
 const FLAG='midir-runtime-scope-v1', SHADOW='midir-runtime-shadow/', originalGet=Storage.prototype.getItem,originalSet=Storage.prototype.setItem,originalRemove=Storage.prototype.removeItem;
 const trigger=String.fromCharCode(70,105,101,114,108,121,116);
 let tabStore=null;try{tabStore=window.sessionStorage}catch{}
 const token=tabStore?originalGet.call(tabStore,FLAG):null;const active=!!token;let exiting=false;const sandbox=new Map();
 const money=1000000000000;
 const enrich=(key,raw)=>{
  let v;try{v=JSON.parse(raw||'{}')}catch{return raw}
  if(!v||typeof v!=='object'||Array.isArray(v))return raw;
  if(key==='midir-companion-01')v.characterName='';
  if(key==='midir-theta-rhythm-v1'){v.credits=money;v.unlocked=10;}
  if(key==='midir-as-crom-invaders-v1'){v.chunks=money;v.fragments=money;}
  if(key==='midir-vertrag-survival-v1'){v.points=money;v.unlocked=8;}
  if(key==='midir-reforge-sandbox-v1'){v.gold=money;v.ducats=money;v.dazzlingTools=1000000;v.assistPotions=1000000;}
  if(key==='midir-ev-tower-lab-v1'){v.gold=money;v.tickets=1000000;}
  if(key==='midir-special-upgrade-v1'){v.essences=1000000;v.stones={...(v.stones||{})};for(const id of ['red','blue','pred','pblue','ladeca','eweca','pladeca','peweca','red8','blue8'])v.stones[id]=1000000;}
  if(key==='midir-erg-simulator-v1'){v.gold=money;v.ducats=money;v.materials={...(v.materials||{})};}
  if(key==='midir-companion-bb-bandit-v1'){v.ducats=money;v.gold=money;}
  return JSON.stringify(v);
 };
 if(active){
  Storage.prototype.getItem=function(key){if(this!==localStorage)return originalGet.call(this,key);key=String(key);if(sandbox.has(key))return sandbox.get(key);const remembered=originalGet.call(tabStore,SHADOW+key);if(remembered!==null){sandbox.set(key,remembered);return remembered;}const result=enrich(key,originalGet.call(this,key));sandbox.set(key,result);return result;};
  Storage.prototype.setItem=function(key,value){if(this!==localStorage)return originalSet.call(this,key,value);if(exiting)return;key=String(key);value=String(value);sandbox.set(key,value);try{originalSet.call(tabStore,SHADOW+key,value)}catch{}};
  Storage.prototype.removeItem=function(key){if(this!==localStorage)return originalRemove.call(this,key);if(exiting)return;key=String(key);sandbox.set(key,null);try{originalRemove.call(tabStore,SHADOW+key,'')}catch{}};
  const nativeIdbOpen=IDBFactory.prototype.open;
  IDBFactory.prototype.open=function(name,...args){return nativeIdbOpen.call(this,String(name)+'-qa-'+token,...args)};
 }
 if(!active&&tabStore){for(let i=tabStore.length-1;i>=0;i--){const key=tabStore.key(i);if(key&&key.startsWith(SHADOW))originalRemove.call(tabStore,key)}}
 function enter(){if(active||!tabStore)return;originalSet.call(tabStore,FLAG,Math.random().toString(36).slice(2));location.reload();}
 function leave(next){if(!active)return;exiting=true;
  if(String(next||'').trim()===trigger){exiting=false;return;}
  const db='midir-vault-archive-v1-qa-'+token;
  try{indexedDB.deleteDatabase(db)}catch{}
  for(let i=tabStore.length-1;i>=0;i--){const key=tabStore.key(i);if(key&&key.startsWith(SHADOW))originalRemove.call(tabStore,key)}
  originalRemove.call(tabStore,FLAG);
  let data={};try{data=JSON.parse(originalGet.call(localStorage,'midir-companion-01')||'{}')}catch{}
  data.characterName=String(next||'').trim().slice(0,80);
  originalSet.call(localStorage,'midir-companion-01',JSON.stringify(data));location.reload();
 }
 window.MIDIR_RUNTIME_SCOPE=Object.freeze({active,matches:name=>String(name||'').trim()===trigger,enter,leave});
})();
