/* Editable Arcana registry. Keep verified-vs-user-documented distinctions explicit. */
window.MIDIR_DATA={
 arcana:{
 as:{name:'Alchemic Sharpshooter',subtitle:'Decisive rotations and spatial choices',skills:[
 {id:'magnum',name:'Magnum Shot',key:'1',cd:0,lock:0.65,shape:'single',note:'No cooldown; filler and animation-cancel weave'},
 {id:'urgent',name:'Urgent Shot',key:'2',cd:10,lock:1,shape:'single',note:'10s baseline; grants +12% ranged skill damage for 10s'},
 {id:'plume',name:'Ignis Plume',key:'3',cd:6,lock:2,shape:'circle',note:'Fire +36%; optional Water +18%'},
 {id:'volley',name:'Aqua Volley',key:'4',cd:10,lock:2.8,shape:'cone',note:'Water +52%; optional Fire +26%; charge changes fan width'},
 {id:'tri',name:'Tri-Assault',key:'5',cd:36,lock:2,shape:'line',note:'Three linear shots; consumes Fire/Water orbs'},
 {id:'golden',name:'Golden Time',key:'6',cd:162,lock:0.5,shape:'self',note:'180s base, ~162s under Wind orb effect; refills all four orbs'},
 {id:'terra',name:'Terra Scourge',key:'7',cd:24,lock:2,shape:'circle',note:'Situational area effect, not forced every cycle'},
 {id:'ventus',name:'Ventus Howl',key:'8',cd:10,lock:2,shape:'cone',note:'Crowd grouping; not compulsory single-target DPS'}],patterns:[{name:'Magnum → Urgent → Volley',steps:['magnum','urgent','magnum','volley']},{name:'Fire/Water building concept',steps:['plume','magnum','volley','magnum','plume','volley','tri']}],source:'experienced player/tooltips; timing approximations are configurable'},
 dd:{name:'Dark Diviner',subtitle:'Repeat until the engine runs on its own',skills:[
 {id:'thunder',name:'Thunder',key:'1',cd:0,lock:2,shape:'single',note:'Six hits per cast per player account; timing configurable'},
 {id:'blight',name:'Thunderblight',key:'2',cd:17,lock:0.4,shape:'single',note:'17s cooldown; with Arcana Link X nominal 17s duration'},
 {id:'flare',name:'Shadow Flare',key:'3',cd:10,lock:1,shape:'line',note:'10s cooldown; 1 Dorcha cost; use with valid target'},
 {id:'seething',name:'Seething Mana',key:'4',cd:0,lock:0.4,shape:'self',note:'Changes Dorcha spending; resource estimates need player input'},
 {id:'render',name:'Render Dorcha',key:'5',cd:10,lock:0.5,shape:'self',note:'Generate 5 Dorcha at MP cost'},
 {id:'surge',name:'Twilight Surge',key:'6',cd:36,lock:1,shape:'circle',note:'36s cooldown; save for full effective damage window'},
 {id:'mana',name:'Render Mana',key:'7',cd:30,lock:0.5,shape:'self',note:'Enables extra Render Dorcha gain in a 15s window'}],patterns:[],source:'player-provided tooltip values, with unverified action durations'}
 },
 ddStages:[
 {title:'The Engine',focus:'Thunder, then more Thunder.',details:'Practice continuous Thunder as the default action. Position while casting when possible.',visual:'thunder'},
 {title:'The Heartbeat',focus:'Thunderblight every 17 seconds.',details:'Keep the Thunder engine running while you maintain Thunderblight. Arcana Link X can extend Thunderblight to nominally 17 seconds.',visual:'blight'},
 {title:'The Reflex',focus:'Shadow Flare whenever ready and there is a target.',details:'Shadow Flare is an insertion, not a replacement for the engine. Maintain Thunderblight first.',visual:'flare'},
 {title:'The Fuel System',focus:'Seething Mana and active Dorcha management.',details:'Practice Dorcha build/spend forecasting on top of your established rhythm; do not treat illustrated resource flows as exact logged values.',visual:'dorcha'},
 {title:'The Hunter',focus:'Read phases, commit Twilight Surge only when damage can land.',details:'Account for HP gates, upcoming Pall opportunities and projected Dorcha recovery. Never grade Pall synchronization.',visual:'surge'}],
 debuffLessons:[
 {title:'Choose your opening',body:'Physical single target: Charging Strike → Spinning Uppercut. Magic/alchemy/astrology single target: Hydra Transmutation. Crowds or mixed damage: Smokescreen. These are useful opening approaches, not inflexible mandatory orders.'},
 {title:'Amplify the opportunity',body:'Death Mark amplifies damage on the target. Optional Astrology support aspects can help crowds if selected in the loadout. Do not assume every character has that aspect.'},
 {title:'Layer pet effects',body:'Ceranus/Mir Dragon share a level-1 reduction slot; Bone Dragon/Purrling share level 2 and stack with level 1. Bun Bun/Foxyquinn/Whale occupy an amplification family. Multiple Bun Buns can matter; refreshing is not always extra stacking.'},
 {title:'Peel protection and extend',body:'Brionac or Seal: Fragarach peel Protection through multiple hits. Fateweaver can refresh/extend relevant debuffs. Application ordering is flexible and party-dependent.'},
 {title:'Read missing effects',body:'Inspect target condition icons. Ask what category is missing, not merely which teammate pressed a button. Effects differ in strength and duration; a weaker application need not replace a stronger one.'},
 {title:'Pall of Ruination',body:'Harmonic Saint applies a 10-second enemy debuff with a baseline 180-second cooldown. Learn to recognize it and use an available window, but do not penalize players for unpredictable party timing.'}],
 debuffScenarios:[
 {q:'Single boss; the party mainly deals physical damage. Which opening family fits?',choices:['Charging Strike → Spinning Uppercut','Hydra only','Ventus Howl'],notes:['Yes—this targets physical Defense/Protection.','Hydra is for magic-side defenses; it may still help a mixed party.','Ventus provides crowd utility, not a general physical protection opening.']},
 {q:'Several enemies; both physical and magical damage are present. What would you consider?',choices:['Smokescreen area coverage','Only single-target Uppercut','Hold every debuff for Pall'],notes:['Broad physical and magical reduction coverage makes sense.','Single-target Uppercut can be useful, but does not cover the group.','Waiting for an unpredictable party cooldown is not necessary.']},
 {q:'An enemy already has a very strong Death Mark. What matters about applying a weaker one?',choices:['Strength and remaining duration','The newest one always wins','Always remove the old effect'],notes:['Correct consideration: weaker effects need not overwrite stronger magnitudes; refreshing duration can still help.','A lower magnitude need not replace a stronger one.','Removal is not the goal.']},
 {q:'Your party has Ceranus active. Which pet family can provide a separate stacking reduction?',choices:['Bone Dragon / Purrling','Another Mir Dragon for a second level-1 slot','None of them'],notes:['Level 2 can stack with level 1.','Mir shares level 1 with Ceranus; avoid counting it twice.','Separate reduction families are available.']},
 {q:'A Harmonic Saint just applies Pall while you have a useful burst ready. What should you practice?',choices:['Recognize and exploit the opening when feasible','Memorize a mandatory Pall timestamp','Grade teammates on exact synchronization'],notes:['Useful preparation, without requiring perfect party timing.','Pall timing is controlled by the HS and varies.','The trainer celebrates verified teamwork, not punitive Pall grading.']},
 {q:'The status bar lacks a Defense/Protection reduction. What is a good next decision?',choices:['Identify who can supply the missing category','Assume someone else has already done it','Only watch your own DPS'],notes:['Find the missing category and coordinate a useful application.','Missing status coverage is actionable information.','Party setup can affect all damage sources.']}],
 encounters:[{name:'Bri Gate 1 · Vertrag',description:'70% and 25% corner giant phases; 7600 first form replaced at 50% by distinct 7601 entity. New entity needs fresh debuffs. Clear requires real zero-HP evidence.'},{name:'Bri Gate 2 · Stone horse',description:'At 50%, the giant stone horse charges across the arena. Stay in the assigned safe regions; charge tracks are not literal lasers.'},{name:'Bri Gate 3 · Midir',description:'80% three key halos, 60% three different-HP halos and a possible bypass, 40% five key halos. Survival at 80% and 40% counts for Halo Badges; not 60%.'}],
 collectibles:[{id:'boots',name:'Giant Boots',flavor:'These boots were made for walking. Shame the giants never learned how.',gate:1,phases:[70,25]},{id:'horse',name:'Bottled Horsepower',flavor:'Industrial Adhesive. Now with 100% more horsepower.',gate:2,phases:[50]},{id:'halo',name:'Halo Badges',flavor:'Defeated a deity. Still not qualified for the Elite Four.',gate:3,phases:[80,40]}]
};
