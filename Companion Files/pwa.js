/* Midir Companion 0.2.82: opt-in home-screen installation and offline shell. */
(()=>{'use strict';
if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
let pending=null;
function showInstall(){
 const slot=document.querySelector('#midir-install-slot');
 if(!slot||!pending||window.matchMedia('(display-mode: standalone)').matches)return;
 slot.innerHTML='<button type="button" class="primary" id="midir-install">Install Companion on Home Screen</button>';
 slot.querySelector('button').addEventListener('click',async()=>{const prompt=pending;pending=null;slot.innerHTML='';await prompt.prompt();try{await prompt.userChoice}catch{}});
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();pending=e;showInstall()});
window.addEventListener('appinstalled',()=>{pending=null;document.querySelector('#midir-install-slot')?.replaceChildren()});
// The vault is rerendered during navigation; restore the install option as needed.
const observer=new MutationObserver(()=>{if(pending&&document.querySelector('#midir-install-slot:not(:has(button))'))showInstall()});
observer.observe(document.body,{subtree:true,childList:true});
window.addEventListener('load',()=>navigator.serviceWorker.register('../service-worker.js',{scope:'../'}).catch(err=>console.warn('Companion offline installation unavailable:',err)));
})();
