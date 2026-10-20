/* Midir Companion 55 — Herb Collection, offline-local quantities. */
(function(){'use strict';
const KEY='midir-companion-herb-chest-v1';
const HERBS=[
 {id:'base',name:'Base Herb',color:'#49b45b',glow:'#83e98f'},
 {id:'mana',name:'Mana Herb',color:'#3f92e5',glow:'#b5d7ff'},
 {id:'mandrake',name:'Mandrake',color:'#ef8d36',glow:'#ffd39a'},
 {id:'sunlight',name:'Sunlight Herb',color:'#f0c347',glow:'#fff0a2'},
 {id:'bloody',name:'Bloody Herb',color:'#de5057',glow:'#ffafac'},
 {id:'poison',name:'Poison Herb',color:'#a56bcb',glow:'#d8b9f5'},
 {id:'white',name:'White Herb',color:'#eceee8',glow:'#ffffff'},
 {id:'golden',name:'Golden Herb',color:'#dca93a',glow:'#ffe08c'}
];
const state={counts:Object.fromEntries(HERBS.map(h=>[h.id,0])),total:0,selection:null,last:''};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved){HERBS.forEach(h=>state.counts[h.id]=Math.max(0,Math.floor(Number(saved.counts?.[h.id])||0)));state.total=HERBS.reduce((sum,h)=>sum+state.counts[h.id],0)}}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify({counts:state.counts,total:state.total}))}catch(err){state.last='Storage unavailable: this collection may not survive a reload.'}}
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function reroll(){state.selection={herb:HERBS[Math.floor(Math.random()*HERBS.length)],x:8+Math.random()*78,y:10+Math.random()*70}}
reroll();
function herbSvg(h){return `<svg class="herb-icon" viewBox="0 0 74 88" role="img" aria-label="${esc(h.name)}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="leaf-${h.id}"><stop offset="0" stop-color="${h.glow}"/><stop offset="1" stop-color="${h.color}"/></radialGradient></defs><path d="M37 83 Q37 47 36 25" stroke="#53784e" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M37 65 Q5 67 7 40 Q33 40 37 65M37 56 Q67 55 68 28 Q43 32 37 56M36 41 Q11 23 25 9 Q43 18 36 41M38 35 Q52 5 61 15 Q61 37 38 35" fill="url(#leaf-${h.id})" stroke="${h.color}" stroke-width="2"/><path d="M35 81Q22 84 14 78M38 82Q53 87 62 77" stroke="#9a8667" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`}
function view(){if(!state.selection)reroll();const h=state.selection.herb;return `<h2>Herb Collection</h2><p class="muted">A little gathering break. Every herb you pick goes straight to your Storage Chest.</p><div class="herb-collection-layout"><section class="card"><div class="herb-collection-header"><strong>Gathering Field</strong><span>${state.total.toLocaleString()} gathered</span></div><div id="herb-collection-field" class="herb-collection-field"><button type="button" id="herb-pick" class="herb-pick" style="left:${state.selection.x.toFixed(2)}%;top:${state.selection.y.toFixed(2)}%" aria-label="Gather ${esc(h.name)}" title="${esc(h.name)}">${herbSvg(h)}</button></div><p id="herb-gather-status" class="hint" role="status">${esc(state.last||'Click the herb to collect it. Its type and position change every time.')}</p></section><section class="card herb-collection-chest"><h3>Storage Chest <span class="herb-chest-count">${state.total.toLocaleString()} herbs</span></h3><div class="herb-chest-grid">${HERBS.map(t=>`<div class="herb-chest-item">${herbSvg(t)}<div><strong>${esc(t.name)}</strong><span>${state.counts[t.id].toLocaleString()}</span></div></div>`).join('')}</div><p class="hint">Herbs are counted here only. They aren't consumed, sold, or used by other simulations yet.</p></section></div>`}
function bind(){const btn=document.querySelector('#herb-pick');if(!btn)return;btn.addEventListener('click',()=>{const id=state.selection.herb.id,name=state.selection.herb.name;state.counts[id]++;state.total++;state.last=`Collected ${name}! Stored: ${state.counts[id].toLocaleString()}.`;save();reroll();render()})}
function render(){const root=document.querySelector('#app');if(!root)return; // The app's view function owns its header; render through the existing app lifecycle.
 if(window.MIDIR_HERBS?.refresh)window.MIDIR_HERBS.refresh();}
function refresh(){const field=document.querySelector('#herb-collection-field');if(!field)return;const target=document.querySelector('#herb-collection-surface');if(target){target.innerHTML=view();bind()}}
// Keep app navigation, theme switching and other page controls bound by the parent app.
window.MIDIR_HERBS={view,bind,refresh,getState:()=>JSON.parse(JSON.stringify(state))};
const observer=new MutationObserver(()=>{if(document.querySelector('#herb-pick')&&!document.querySelector('#herb-pick').dataset.bound){const btn=document.querySelector('#herb-pick');btn.dataset.bound='1';btn.addEventListener('click',()=>{const id=state.selection.herb.id,name=state.selection.herb.name;state.counts[id]++;state.total++;state.last=`Collected ${name}! Stored: ${state.counts[id].toLocaleString()}.`;save();reroll();const field=document.querySelector('#herb-collection-field');if(field){const herb=state.selection.herb;field.innerHTML=`<button type="button" id="herb-pick" class="herb-pick" style="left:${state.selection.x.toFixed(2)}%;top:${state.selection.y.toFixed(2)}%" aria-label="Gather ${esc(herb.name)}" title="${esc(herb.name)}">${herbSvg(herb)}</button>`}const status=document.querySelector('#herb-gather-status');if(status)status.textContent=state.last;const chest=document.querySelector('.herb-collection-chest');if(chest){const replacement=document.createElement('div');replacement.innerHTML=view();const newChest=replacement.querySelector('.herb-collection-chest');if(newChest)chest.replaceWith(newChest)}const count=document.querySelector('.herb-collection-header span');if(count)count.textContent=state.total.toLocaleString()+' gathered';})}});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();
