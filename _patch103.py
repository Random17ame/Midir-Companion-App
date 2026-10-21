from pathlib import Path
p=Path('/mnt/data/_comp103_work/bb-bandit-flip.js')
s=p.read_text()
s=s.replace('/* Companion 102 — Blazing Brawler Bandit Hunt. React to intent, not just enemy identity. */','/* Companion 103 — Blazing Brawler Bandit Hunt. Named bandit attack and escape art. */')
a=s.index('const COUNTER_SCENES=[')
b=s.index('const DODGE_SCENES=[',a)
s=s[:a]+'''const NAMED_BANDITS=[
 ['"Horrifying" Herbert','herbert','Lunges forward with his jagged polearm','Turns and flees with an enormous sack'],
 ['"No-Face" Nelson','nelson','Swings his curved blade straight at you','Runs off clutching stolen merchandise'],
 ['"One-Eye" Klugger','klugger','Brings his heavy hammer into a crushing swing','Lumbers away with a bulging sack of loot'],
 ['"Scandalous" Charlene','charlene','Steps in aggressively with her baton','Slips away with the trade goods'],
 ['"Stinky" Berkkus','berkkus','Raises his sword and advances behind his shield','Sprints away carrying a stolen treasure chest'],
 ['"Shifty" Shankleton','shankleton','Jabs his walking stick toward you','Makes a run for it with his oversized money sack'],
 ['"Zippy" Nipmore','nipmore','Dashes in with his enchanted dagger','Scampers off with the ducats over his shoulder']
];
// Poses are paired deliberately: the same outlaw can attack or run away.
// The player must read the posture, not memorize a response per identity.
const COUNTER_SCENES=NAMED_BANDITS.map(([name,id,attack])=>[name,attack,id]);
const CHARGE_SCENES=NAMED_BANDITS.map(([name,id,_attack,escape])=>[name,escape,id]);
''' + s[b:]
s=s.replace("return {id:'bb-tile-'+(seq++),kind,title:lucky&&kind==='free'?'Lucky Finish!':scene[0],cue:scene[1],reward,lucky,state:'hidden',resolvedAt:0,pressure:0};", "return {id:'bb-tile-'+(seq++),kind,title:lucky&&kind==='free'?'Lucky Finish!':scene[0],cue:scene[1],art:scene[2]&&['counter','charge'].includes(kind)?`assets/bandit-hunt/${scene[2]}-${kind==='counter'?'attack':'escape'}.webp`:null,reward,lucky,state:'hidden',resolvedAt:0,pressure:0};")
s=s.replace('function cardInner(tile){', 'function banditArt(tile,size){return tile.art?`<img class="bb-bandit-art ${size}" src="${tile.art}" alt="${esc(tile.title)} ${tile.kind===\'counter\'?\'attacking\':\'escaping\'}" loading="${size===\'board\'?\'lazy\':\'eager\'}">`:\'\'}\nfunction cardInner(tile){')
s=s.replace('if(tile.state===\'failed\')return `<small>Missed</small><strong>${esc(tile.title)}</strong><span>${tile.reward} D</span>`;', 'if(tile.state===\'failed\')return `<small>Missed</small>${banditArt(tile,\'board\')}<strong>${esc(tile.title)}</strong><span>${tile.reward} D</span>`;')
s=s.replace('<strong>${esc(tile.title)}</strong><span>${tile.reward.toLocaleString()} D${tile.lucky?', '${banditArt(tile,\'board\')}<strong>${esc(tile.title)}</strong><span>${tile.reward.toLocaleString()} D${tile.lucky?')
old='''return `<div class="bb-bandit-active ${tile.kind}"><div class="bb-bandit-active-heading"><strong>${esc(tile.title)}${tile.lucky?' ✨':''}</strong><span id="bb-active-time">${(active.duration/1000).toFixed(2)}s</span></div><p class="bb-encounter-cue">${esc(tile.cue)}</p><div class="bb-active-track"><div id="bb-active-fill" style="width:100%"></div></div><div class="bb-bandit-actions"><button type="button" data-bb-input="counter">${skillImg('counter')}1 · Counter Punch</button><button type="button" data-bb-input="charge">${skillImg('charge')}2 · Charging Strike</button><button type="button" data-bb-input="dodge">${skillImg('dodge')}3 · Tumble</button><span class="hint">Wildlife: <strong>wait</strong> without pressing.</span></div></div>`}'''
new='''return `<div class="bb-bandit-active ${tile.kind} ${tile.art?'has-art':''}">${tile.art?`<div class="bb-active-portrait">${banditArt(tile,'active')}</div>`:''}<div class="bb-active-details"><div class="bb-bandit-active-heading"><strong>${esc(tile.title)}${tile.lucky?' ✨':''}</strong><span id="bb-active-time">${(active.duration/1000).toFixed(2)}s</span></div><p class="bb-encounter-cue">${esc(tile.cue)}</p><div class="bb-active-track"><div id="bb-active-fill" style="width:100%"></div></div><div class="bb-bandit-actions"><button type="button" data-bb-input="counter">${skillImg('counter')}1 · Counter Punch</button><button type="button" data-bb-input="charge">${skillImg('charge')}2 · Charging Strike</button><button type="button" data-bb-input="dodge">${skillImg('dodge')}3 · Tumble</button><span class="hint">Wildlife: <strong>wait</strong> without pressing.</span></div></div></div>`}'''
assert old in s,'No active block found'
s=s.replace(old,new)
p.write_text(s)
path=Path('/mnt/data/_comp103_work/styles.css')
with path.open('a') as f:
 f.write('''
/* Companion 103 — generated outlaw art for counter vs. escape cards */
.bb-bandit-active.has-art{display:grid;grid-template-columns:minmax(125px,195px) minmax(0,1fr);align-items:center;gap:16px;min-height:210px}
.bb-active-portrait{height:188px;width:100%;border-radius:14px;border:1px solid #4a364a;background:radial-gradient(ellipse at 50% 40%,#3a3045,#161219 72%);display:flex;align-items:center;justify-content:center;overflow:hidden}
.bb-bandit-art.active{width:100%;height:100%;object-fit:contain;object-position:center center;filter:drop-shadow(0 5px 9px rgba(0,0,0,.55))}
.bb-active-details{min-width:0}
.bb-bandit-art.board{width:100%;height:44px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))}
.bb-bandit-tile .bb-bandit-art.board{flex-shrink:0}
.bb-bandit-tile.active:has(.bb-bandit-art),.bb-bandit-tile.resolved:has(.bb-bandit-art),.bb-bandit-tile.failed:has(.bb-bandit-art){min-height:116px}
@media(max-width:600px){.bb-bandit-active.has-art{grid-template-columns:100px minmax(0,1fr);gap:9px}.bb-active-portrait{height:165px}.bb-bandit-art.board{height:38px}}
''')
index=Path('/mnt/data/_comp103_work/index.html');content=index.read_text();assert 'Companion 102 · Offline' in content;index.write_text(content.replace('Companion 102 · Offline','Companion 103 · Offline'))
ch=Path('/mnt/data/_comp103_work/CHANGELOG.md')
ch.write_text('''## Companion 103 — Named Bandit Encounter Art
- Added seven named Commerce outlaws from the Mabinogi World Wiki references to Blazing Brawler Bandit Hunt: "Horrifying" Herbert, "No-Face" Nelson, "One-Eye" Klugger, "Scandalous" Charlene, "Stinky" Berkkus, "Shifty" Shankleton, and "Zippy" Nipmore.
- Each named outlaw has two newly generated character illustrations: a forward attack for **Counter Punch** and a fleeing/looting pose for **Charging Strike**. Both the active reaction reveal and exposed board card show the matching pose.
- Existing wildlife feints and golem dodge cards remain fully playable and text-driven pending Mabinogi-specific reference artwork. No changes to encounter weights by reaction category, ducat rates, streak logic, saved progress, equipment, achievements, or reforge mechanics.
- The seven paired illustrations are packaged offline as fourteen lightweight WebP cutouts. Companion 102 local storage and full profile backup compatibility retained.

'''+ch.read_text())
print('patched')
