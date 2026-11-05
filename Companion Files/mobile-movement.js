/* Shared mobile directional controls for Crom Bas Invaders and Vertrag.
   Preferences persist locally; each game owns its own vector and lifecycle. */
(()=>{'use strict';
const KEY='midir-mobile-movement-mode-v1';
let choice='analog';try{if(localStorage.getItem(KEY)==='dpad')choice='dpad'}catch{}
const current=()=>choice;
function toggle(){choice=choice==='analog'?'dpad':'analog';try{localStorage.setItem(KEY,choice)}catch{};document.querySelectorAll('[data-midir-move-mode]').forEach(n=>{n.dataset.midirMoveMode=choice});document.querySelectorAll('[data-midir-move-toggle]').forEach(n=>{n.textContent=choice==='analog'?'Switch to D-pad':'Switch to analog';n.setAttribute('aria-label',n.textContent)});return choice}
function markup(){return `<div class="midir-mobile-movement" data-midir-move-mode="${choice}"><div class="midir-analog-pad" role="group" aria-label="Analog movement"><div class="midir-mobile-knob"></div></div><div class="midir-dpad" role="group" aria-label="Directional movement"><button type="button" data-midir-dir="up" aria-label="Move up">▲</button><button type="button" data-midir-dir="left" aria-label="Move left">◀</button><span aria-hidden="true">●</span><button type="button" data-midir-dir="right" aria-label="Move right">▶</button><button type="button" data-midir-dir="down" aria-label="Move down">▼</button></div><small>MOVE</small><button type="button" class="midir-move-switch" data-midir-move-toggle>${choice==='analog'?'Switch to D-pad':'Switch to analog'}</button></div>`}
function bind(container,onVector){if(!container)return ()=>{};const analog=container.querySelector('.midir-analog-pad'),knob=container.querySelector('.midir-mobile-knob');const directions={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},active=new Map();let pointer=null,lastX=0,lastY=0;function emit(x,y){lastX=x;lastY=y;onVector(x,y)}
function analogMove(e){const b=analog.getBoundingClientRect(),reach=Math.max(1,Math.min(b.width,b.height)*.35),dx=(e.clientX-(b.left+b.width/2))/reach,dy=(e.clientY-(b.top+b.height/2))/reach,m=Math.max(1,Math.hypot(dx,dy)),x=dx/m,y=dy/m;knob.style.transform=`translate(-50%,-50%) translate(${x*reach}px,${y*reach}px)`;emit(x,y)}
function analogStop(e){if(pointer!==e.pointerId)return;pointer=null;knob.style.transform='translate(-50%,-50%)';emit(0,0)}
const down=e=>{if(choice!=='analog'||pointer!==null)return;e.preventDefault();pointer=e.pointerId;try{analog.setPointerCapture(e.pointerId)}catch{};analogMove(e)};
const move=e=>{if(pointer!==e.pointerId)return;e.preventDefault();analogMove(e)};
analog.addEventListener('pointerdown',down);analog.addEventListener('pointermove',move);for(const event of ['pointerup','pointercancel','lostpointercapture'])analog.addEventListener(event,analogStop);
const pads=[...container.querySelectorAll('[data-midir-dir]')];
function dpadEmit(){let x=0,y=0;for(const dir of active.values()){x+=directions[dir][0];y+=directions[dir][1]}const m=Math.max(1,Math.hypot(x,y));emit(x/m,y/m)}
for(const button of pads){button.addEventListener('pointerdown',e=>{if(choice!=='dpad')return;e.preventDefault();active.set(e.pointerId,button.dataset.midirDir);button.classList.add('held');try{button.setPointerCapture(e.pointerId)}catch{};dpadEmit()});const end=e=>{if(!active.has(e.pointerId))return;active.delete(e.pointerId);button.classList.remove('held');dpadEmit()};for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,end);button.addEventListener('contextmenu',e=>e.preventDefault())}
const switcher=container.querySelector('[data-midir-move-toggle]');const switchClick=()=>{active.clear();pads.forEach(p=>p.classList.remove('held'));pointer=null;knob.style.transform='translate(-50%,-50%)';emit(0,0);toggle()};switcher.addEventListener('click',switchClick);
const stop=()=>{active.clear();pointer=null;knob.style.transform='translate(-50%,-50%)';emit(0,0)};
window.addEventListener('blur',stop);return ()=>{stop();window.removeEventListener('blur',stop)}
}
window.MIDIR_MOBILE_MOVE={current,toggle,markup,bind};
})();
