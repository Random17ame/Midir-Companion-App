/* Companion 50: talent categories from the Echostone page's Echostone Types section.
 * Skill names cross-matched with the user-supplied Reforge/Full List table.
 * Classification is source-guided; the wiki advises referring to individual
 * Echostone pages for exhaustive color-by-color eligibility.
 */
(()=>{'use strict';
const talent={
 Red:[
 'Assault Slash','Charge','Combat Mastery','Counterattack','Defense','Evasion','Final Hit','Final Strike','Giant Full Swing','Smash','Stomp','Stampede','Throwing Attack','Taunt','Wind Guard','Windmill','Rage Impact','Lance Charge','Lance Counter','Lance Mastery','Axe Mastery','Blunt Mastery','Sword Mastery','Shield of Physis','Sword of Order','Fury of Connous','Spirit of Order'
 ],
 Blue:[
 'Firebolt','Icebolt','Lightning Bolt','Fireball','Ice Spear','Thunder','Hail Storm','Blaze','Fusion Bolt','Fire Mastery','Ice Mastery','Lightning Mastery','Bolt Mastery','Meditation','Mana Shield','Fire Shield','Ice Shield','Lightning Shield','Natural Shield','Healing','Party Healing','Musical Knowledge','Battlefield Overture','Vivace','Enduring Melody','Harvest Song','Lullaby','March Song','Dischord','Enthralling Performance','Playing Instrument','Shooting Rush','Bullet Storm','Bullet Slide','Flash Launcher','Grapple Shot','Way of the Gun','Reload'
 ],
 Yellow:[
 'Magnum Shot','Crash Shot','Arrow Revolver','Mirage Missile','Final Shot','Support Shot','Ranged Attack','Bow Mastery','Crossbow Mastery','Elven Magic Missile','Act 1: Inciting Incident','Act 2: Threshold Cutter','Act 4: Rising Action','Act 6: Crisis','Act 7: Climactic Crash','Act 9: Invigorating Encore','Control Marionette','Puppet\'s Snare','Wire Pull','Carpentry','Tailoring','Fishing','Metallurgy','Taming Wild Animals','Blacksmithing','Refining','Weaving','Handicraft','Cooking','Herbalism','Fragmentation','Metal Conversion','Synthesis','Production Mastery','Transformation Mastery','Elven Magic Missile'
 ],
 Silver:[
 'Combo: Charging Strike','Combo: Spinning Uppercut','Combo: Drop Kick','Combo: Somersault Kick','Combo: Focused Fist','Combo: Counter Punch','Combo: Pummel','Respite','Knuckle Mastery','Combo Mastery','Shuriken Mastery','Shuriken Charge','Explosive Kunai','Smokescreen','Kunai Storm','Sakura Abyss','Shadow Cloak','Shadow Bind','Fynn Crafting','Transformation Mastery','Soul of Chaos','Daemon of Physis','Fury of Connous','Spirit of Order'
 ],
 Black:[
 'Shock','Water Cannon','Flame Burst','Wind Blast','Frozen Blast','Sand Burst','Heat Buster','Rain Casting','Hydra Transmutation','Barrier Spikes','Life Drain','Summon Golem','Fire Alchemy Mastery','Water Alchemy Mastery','Wind Alchemy Mastery','Earth Alchemy Mastery','Dorcha Snatch','Dorcha Conversion','Chain Impale','Chain Crush','Chain Sweep','Chain Burst','Chain Blade Mastery','Anchor Rush','Spinning Slasher','Bachram Explosion','Death Mark','Gold Strike','Critical Hit','Stellar Surge','Orbital Pulse','Gravity Well','Astral Reave','Starlight Veil','Nova Blast','Meridian Sweep','Fate Foretold','Raging Spike'
 ]
};
const token=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const tokens=Object.fromEntries(Object.entries(talent).map(([c,arr])=>[c,new Set(arr.map(token))]));
const general={
 Red:['Strength','Defense','Protection','Max Damage','Min Damage'],
 Blue:['Intelligence','Magic Attack','Max MP','Mana','Magic Defense'],
 Yellow:['Dexterity','Luck','Max Stamina','Gathering','Production'],
 Silver:['Will','Critical','Critical Damage','Fynn'],
 Black:['Max HP','Health','Defense','Protection','Magic Protection','Magic Defense','Damage Reduction']
};
function matches(color,entry){
 if(!entry)return false;
 const name=entry.skill||'',attribute=entry.attribute||'';
 if(tokens[color]?.has(token(name)))return true;
 if(name==='-'||name==='')return general[color]?.some(k=>attribute.toLowerCase().includes(k.toLowerCase()))||false;
 return false;
}
window.MIDIR_ECHOSTONE_TALENTS={matches,talent,general};
})();
