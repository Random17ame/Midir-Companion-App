/* Companion 74 — concise player-facing skill strategy, informed by in-game review. */
window.MIDIR_ROTATION_REFERENCE={
  "as": {
    "name": "Alchemic Sharpshooter",
    "summary": "Build Fire and Water for Tri-Assault, then use Magnum between cooldowns. Good targeting beats perfect button order; Terra Scourge follows a selected target but asks you to spend a long cast on it.",
    "skills": [
      [
        "Hermetic Harmony",
        "Element setup",
        "Pick an elemental pairing that suits the fight before committing to your damage cycle."
      ],
      [
        "Ignis Plume",
        "Fire energy",
        "Build Fire energy and keep the area useful for the targets you actually want to hit."
      ],
      [
        "Aqua Volley",
        "Charged Water attack",
        "Charge and aim for useful lines through enemies; a clean hit is better than a wasted perfect charge."
      ],
      [
        "Tri-Assault",
        "Spend Fire and Water",
        "Build both resources, then fire your three volleys in a real opening. Line up extra targets when possible."
      ],
      [
        "Terra Scourge",
        "Targeted area impact / long cast",
        "Select an enemy and strike the area around them. It is target-locked, not ground-aimed. Its roughly two-second cast can cost two or three Magnum Shots, so pick a worthwhile moment."
      ],
      [
        "Ventus Howl",
        "Group targets",
        "Make targets easier to hit together. Skip unnecessary grouping against a lone stationary boss."
      ],
      [
        "Magnum Shot",
        "Flexible filler",
        "Fit fast Magnum Shots into downtime instead of standing idle waiting for Arcana skills."
      ],
      [
        "Urgent Shot",
        "Damage setup",
        "Set up stronger archery hits when the bonus can actually be used, rather than letting the window expire."
      ],
      [
        "Golden Time",
        "Refill resources",
        "Recover elemental energy for another burst; it does not refresh the Arcana cooldowns."
      ]
    ]
  },
  "dd": {
    "name": "Dark Diviner",
    "summary": "Keep Thunderblight active and spend Dorcha deliberately. Hexshroud helps earn Dorcha back when you hit afflicted enemies, balancing Seething Mana’s empowered casts.",
    "skills": [
      [
        "Render Dorcha",
        "Dorcha supply",
        "Rebuild Dorcha before an empowered sequence leaves you unable to pay for the next cast."
      ],
      [
        "Render Mana",
        "Mana recovery",
        "Keep the mana side of your resource loop healthy so you can continue generating Dorcha."
      ],
      [
        "Seething Mana",
        "Empowered casting",
        "Your powerful casts spend Dorcha. Feed that expense by attacking enemies afflicted with Hexshroud."
      ],
      [
        "Thunderblight",
        "Keep it active",
        "Reapply when needed and keep pressure on the enemy while it ticks."
      ],
      [
        "Hexshroud",
        "Dorcha recovery on afflicted enemies",
        "Afflict the enemy, then keep attacking it to generate Dorcha. This helps offset Seething Mana’s cost for empowered attacks."
      ],
      [
        "Shadow Flare",
        "Frequent damage",
        "Fit this in when available without disrupting your Thunderblight and Dorcha rhythm."
      ],
      [
        "Polar Vortex",
        "Control and coverage",
        "Use its area control when multiple targets or positioning make it worthwhile."
      ],
      [
        "Thunder",
        "Reliable repeated damage",
        "Use repeated Thunder casts to sustain damage and keep your resource cycle moving."
      ],
      [
        "Twilight Surge",
        "Commitment window",
        "Save this for a window long enough to land its value, not a boss about to leave."
      ]
    ]
  },
  "ek": {
    "name": "Elemental Knight",
    "summary": "Keep Instill Elements on. Two-handed and sword-and-shield EKs build around Blazing Assault Slash → Shattering Windmill → Dynavolt Smash, with five Bash stacks and Rage Impact ready. Dual wielders favor fast Bash → Flashing Steel chains, clean cursor aim and evasive dashes.",
    "skills": [
      [
        "Instill Elements",
        "Always-on toggle",
        "Turn it on and keep it on. Watch your status list: it adds damage and useful effects to normal Close Combat and Arcana skills."
      ],
      [
        "Dauntless Defense",
        "Defend and counter",
        "Use a real defensive window to turn an incoming attack into an opportunity instead of absorbing it for free."
      ],
      [
        "Dynavolt Smash",
        "Follow up Shattering Windmill",
        "Always use Shattering Windmill before Dynavolt Smash for the boosted hit. Keep the pair together when planning your burst."
      ],
      [
        "Shattering Windmill",
        "Set up Dynavolt Smash",
        "Freeze and pressure targets, then follow immediately with Dynavolt Smash."
      ],
      [
        "Blazing Assault Slash",
        "Engage and set the pace",
        "Use it to close distance and lead into the Shattering Windmill → Dynavolt Smash sequence."
      ],
      [
        "Flashing Steel",
        "Bash-fueled mobility and damage",
        "Ready? Use it free. On cooldown? Spend one Bash stack to use it again without changing the timer. Dual wielders can weave Bash between repeated dashes; mind your cursor and enemy attacks."
      ],
      [
        "Bash",
        "Maintain five stacks",
        "A landed Bash hit builds one stack with two-handed or sword-and-shield, two with dual wield. Maintain five for stronger base skills and the Arcana damage built from them; unused stacks begin falling off after 20 seconds."
      ],
      [
        "Rage Impact",
        "High-priority damage boost",
        "Keep it on cooldown, especially when dual wielding. Two-handed spirit weapons can reset it for you; dual wielders must manage the timing themselves."
      ],
      [
        "Smash",
        "Base skill behind Dynavolt",
        "Its strength feeds Dynavolt Smash. Consider how your weapon and Bash stacks improve the follow-up."
      ],
      [
        "Windmill",
        "Base skill behind Shattering",
        "Use it for close-range coverage; its strength feeds Shattering Windmill."
      ],
      [
        "Charge",
        "Approach carefully",
        "Get into position without launching yourself into dangerous attacks."
      ],
      [
        "Defense",
        "Defensive response",
        "A well-timed defense can keep your burst sequence intact."
      ]
    ]
  },
  "hs": {
    "name": "Harmonic Saint",
    "summary": "Keep Voice of Vitality and Echoes active, use Hands when someone is nearly down, and put Pall where your party can burst. Protect clear sightlines by never piling support circles on top of one another. Music performances are about getting another shot at Haunting.",
    "skills": [
      [
        "Blessing of Protection",
        "Survive the scary part",
        "Get protection in place before the party needs it, not after everything has gone wrong."
      ],
      [
        "Echoes of Salvation",
        "Keep it rolling",
        "If Echoes is sitting ready, you are probably leaving support on the table. Keep it working."
      ],
      [
        "Hand of Restoration",
        "The big heal",
        "Hands is your emergency button. Use it on the guy who almost died—not on someone who was already fine."
      ],
      [
        "Hymn of Resurrection",
        "Get pets back into the fight",
        "Primarily for reviving pets during combat. The party should not make you spend the whole fight resurrecting them."
      ],
      [
        "Pall of Ruination",
        "Party burst signal",
        "Give your damage dealers a clear moment to unload. Coordinate Pall with their actual burst, not just your cooldown."
      ],
      [
        "Pulse of Purification",
        "Keep the circles readable",
        "DON’T PUT CIRCLES ON CIRCLES. Overlapping them makes danger harder to see, and seeing the floor matters more than stacking pretty effects."
      ],
      [
        "Voice of Vitality",
        "100% uptime",
        "If it is not on your status list, have someone check your pulse. Its cooldown is shorter than its duration: keep it up all the time."
      ],
      [
        "Encore",
        "Another chance to play",
        "Reset your music buff cooldowns when Rate isn’t a Lie. More tries mean more chances at that elusive Haunting performance."
      ],
      [
        "Spirit Healing Wand",
        "Stronger heals when they matter",
        "Spirit Healing Wand Awakening improves healing effectiveness. Save its strengthened heals for the hardest, most important moments of a fight."
      ]
    ]
  },
  "sg": {
    "name": "Sacred Guardian",
    "summary": "Oath stays on, Pledge stays up, and boss attacks become Virtue opportunities when you parry. Reach 100, spend it on Divine Retribution, and repeat.",
    "skills": [
      [
        "Pledge of Penance",
        "Keep the circle active",
        "Pledge feeds your Virtue while the circle is up. Keep attacking to extend it, and use Retribution to refresh it."
      ],
      [
        "Provoke",
        "Invite the attack",
        "Be where the boss wants to hit so you can turn its aggression into a timed defense."
      ],
      [
        "Ardent Advance",
        "Gap close and build",
        "Move into the fight and take the Virtue. Distance also affects how soon it is ready again."
      ],
      [
        "Rend Armor",
        "Parry for Virtue",
        "Use it just before a hit to earn bonus Virtue and reset its cooldown. A good parry is progress toward another Retribution."
      ],
      [
        "Deliver Judgment",
        "Big Virtue gain",
        "Use it for damage and a sizable push toward 100 Virtue."
      ],
      [
        "Divine Retribution",
        "Spend 100 Virtue",
        "This is the payoff. Get to 100 quickly, spend it in a worthwhile boss window, and start building again."
      ],
      [
        "Fateweaver",
        "Step 1 · Prepare Oath",
        "Choose your defensive stats before activating Oath. The stronger the setup, the better the snapshot that follows."
      ],
      [
        "Golden Magic Wool",
        "Step 2 · Amplify the snapshot",
        "Pair Wool with Fateweaver to strengthen the defenses you are about to preserve. They work together; prepare both before Oath."
      ],
      [
        "Virtuous Oath",
        "Step 3 · Lock in the defenses",
        "Activate Oath after Fateweaver and Golden Magic Wool. Keep it active to gain Virtue and empower the rest of the SG kit."
      ],
      [
        "Bash",
        "Boost Windmill's foundation",
        "Build and preserve Bash stacks. Stronger base Close Combat hits feed stronger Windmill damage, which then feeds Sacred Guardian's abilities."
      ],
      [
        "Rage Impact",
        "Amplify melee damage",
        "Use Rage Impact to strengthen the melee damage feeding Windmill and your SG damage chain."
      ],
      [
        "Zealous Conviction",
        "Three-part sequence",
        "Move through all three stages; later stages add Virtue and return you to stage one."
      ]
    ]
  },
  "ev": {
    "name": "Explosive Vanguard",
    "summary": "Manage shells, choose safe approaches, and look for practical burst openings. We will refine individual skill priorities when their in-game details are confirmed.",
    "skills": [
      [
        "Recharge Shells",
        "Skill overview pending",
        "Explore when this action fits the weapon and target layout."
      ],
      [
        "Relentless Thrust",
        "Skill overview pending",
        "Explore when this action fits the weapon and target layout."
      ],
      [
        "Arc Impact",
        "Skill overview pending",
        "Explore when this action fits the weapon and target layout."
      ],
      [
        "Blast Zone",
        "Skill overview pending",
        "Explore when this action fits the weapon and target layout."
      ],
      [
        "Drill Charge",
        "Skill overview pending",
        "Explore when this action fits the weapon and target layout."
      ],
      [
        "Dreadnought Burst",
        "Skill overview pending",
        "Explore when this action fits the weapon and target layout."
      ],
      [
        "Blaze of Glory",
        "Skill overview pending",
        "Explore when this action fits the weapon and target layout."
      ]
    ]
  },
  "ag": {
    "name": "Arsenal Gunner",
    "summary": "Build Transmutation Energy with Bullet Barrage, Heavy Artillery, Calamity Cannon and your first Fatal Scope shot. Every 100 energy fills one gold Energy Bullet. Spend complete bullets on Detonation Field, Tracer Pod, Crest and Fatal Scope follow-ups; use Crest to keep refilling while you fight.",
    "skills": [
      ["Gunner's Crest", "Spend 1 bullet · earn energy with Dual Guns", "Spend one full Energy Bullet to activate Crest for four minutes. While it's up, Flash Launcher, Shooting Rush, Bullet Storm, Grapple Shot and Bullet Slide each generate 50 energy when used. Keep Crest active to fuel your setup."],
      ["Bullet Barrage", "Build 60–300 energy", "Hold for at least half a second to earn 60 energy, or fire for the full three seconds to earn 300 (three bullets). Longer firing also means a longer cooldown, from one to nine seconds."],
      ["Heavy Artillery", "Generate 1 bullet", "Use it to deal damage and gain 100 energy. It's a builder, not a spender—take the free bullet when the shot fits."],
      ["Calamity Cannon", "Generate 1 bullet", "Line up the shot and collect 100 energy. Don't hold it back because you think it spends a bullet—it builds one."],
      ["Fatal Scope", "First shot builds · follow-ups spend", "Your first shot generates 100 energy. Release before full aim and you only get that shot; reach full aim to enter re-aim mode and fire an extra shot for each full Energy Bullet you spend. Normal full aim takes two seconds."],
      ["Tracer Pod", "Spend 1 bullet · faster Fatal Scope", "Mark your priority target for one full Energy Bullet. Fatal Scope aims twice as fast against it: full aim takes one second instead of two. This doesn't stack with Detonation Field's aim bonus."],
      ["Detonation Field", "Spend 1 bullet · overlap your circles", "Always put your circles on your circles. Layer fields under your targets, then land attacks there. Fatal Scope aims twice as fast against enemies inside the field; Tracer Pod doesn't make it any faster."],
      ["Way of the Gun", "Coordinate your burst", "Prepare your position and energy before committing to the burst. Don't confuse its ammunition interactions with Transmutation Energy."],
      ["Bullet Slide", "Crest: +50 energy", "Use it when repositioning helps; with Crest active, this Dual Gun skill generates half an Energy Bullet."],
      ["Flash Launcher", "Crest: +50 energy", "Fit it between Arcana attacks. With Crest active it generates 50 Transmutation Energy, even though it doesn't cost an Energy Bullet."],
      ["Bullet Storm", "Crest: +50 energy", "Use it on a worthwhile spread of targets. With Crest active, using this Dual Gun skill adds 50 energy."],
      ["Reload", "Ammunition, not Energy Bullets", "A Dual Gun spirit can refill ordinary ammunition instantly. It does not refill Transmutation Energy, so keep your energy builders in rotation."],
      ["Grapple Shot", "Dodge with i-frames · Crest: +50", "Keep it ready to evade dangerous attacks with its invulnerability frames. With Crest active, using it also earns 50 energy."]
    ]
  },
  "fa": {
    "name": "Forbidden Alchemist",
    "summary": "Do your elemental preparation outside combat, keep all four amplification buffs, then spend the fight landing Fangs of Stone and your preferred Water Cannon or Heat Buster route. Build Alchemy orbs for Serpentcall or Chemical Carnival—both spend the whole stack.",
    "skills": [
      [
        "Elemental Compounding",
        "Prepare before the fight",
        "Set up your elemental formula outside combat. Make your choices before the pull so your attention stays on dealing damage once the fight begins."
      ],
      [
        "Compound Catalyst",
        "Prepare the right formula",
        "Only one Catalyst formula can be active at a time. Set up the bonus your build needs before you engage."
      ],
      [
        "Elemental Amplification",
        "Keep all four buffs",
        "Elevate your gameplay with full buffs. Pick all four elements and bring their bonuses into the fight."
      ],
      [
        "Fangs of Stone",
        "Your bread and butter",
        "One of your biggest damage sources and most-used skills. Lead moving enemies carefully—Fangs can miss if they move out of the impact area."
      ],
      [
        "Serpentcall",
        "Spend every Alchemy orb",
        "Your Tri-Assault equivalent. Build up the shared Alchemy orbs, then spend them all on a well-aimed Serpentcall. Its ground targeting can miss moving enemies."
      ],
      [
        "Chemical Carnival",
        "Target an enemy · spend every orb",
        "Select an enemy rather than a ground location. It uses the same Alchemy orbs as Serpentcall and consumes your entire stock, so plan which payoff you want."
      ],
      [
        "Water Cannon",
        "A main damage choice",
        "One of two popular base-Alchemy damage staples. Water Cannon and Heat Buster can perform similarly across a comparable window; favor whichever your build supports."
      ],
      [
        "Heat Buster",
        "A main damage choice",
        "The alternative to leaning into Water Cannon. Both can deliver comparable damage over time; build and preference decide. Amplify Heat Buster with Elemental Amplification or Elemental Wave."
      ],
      [
        "Elemental Wave",
        "Make Heat Buster hit harder",
        "Its benefit is also included in Elemental Amplification. Use either amplification route to supercharge Heat Buster and leave them high and dry."
      ],
      [
        "Flame Burst",
        "Feeds Serpentcall",
        "A core part of what makes Serpentcall work, but you generally won’t spend much of your Forbidden Alchemist combat rotation casting Flame Burst itself."
      ],
      [
        "Wind Blast",
        "Utility and spacing",
        "Push or reposition enemies when control matters. It is a utility button, not a damage-rotation priority."
      ],
      [
        "Shock",
        "Activate Brionac",
        "Use Shock to activate Brionac without consuming the once-per-day Demigod Transformation option. It is reusable sooner and with fewer consequences."
      ]
    ]
  },
  "mp": {
    "name": "Melodic Puppeteer",
    "summary": "Three puppets, three sets of attacks, and barely enough fingers to keep up. Downbeat Drop and Act 7 carry your damage; keep Live Wire active and thread Cutting Chorus through every opening you can find. This Arcana rewards fast hands and overlapping actions.",
    "skills": [
      [
        "Live Wire",
        "Keep the whole show connected",
        "A cornerstone of your rotation. Keep Live Wire working so your puppets can pile on the pressure without losing the rhythm."
      ],
      [
        "Downbeat Drop",
        "Your bread and butter",
        "One of your two big repeat attacks. Send it whenever it's ready, and keep the other puppets busy while it lands."
      ],
      [
        "Act 7: Climactic Crash",
        "Crash, charge, repeat",
        "Your other bread-and-butter attack. Hurl a puppet into the enemy, charge the next crash, and keep the hits coming faster than your fingers want to move."
      ],
      [
        "Cutting Chorus",
        "Weave it between everything",
        "While a summoned puppet is already attacking, slip Cutting Chorus between your other commands for an extra AoE hit at that puppet's location. Its short cooldown makes frequent weaving the whole point."
      ],
      [
        "Act 2: Threshold Cutter",
        "Keep another puppet flying",
        "Launch a puppet straight back into the action. If one enemy can't be hit by Act 2 again yet, find another target and keep your puppets moving."
      ],
      [
        "Act 4: Rising Action",
        "Fill the gaps with another hit",
        "Put a free puppet to work while Downbeat Drop and Act 7 cycle. Three puppets means there's almost always another attack to send."
      ],
      [
        "Act 6: Crisis",
        "Another button, another opening",
        "Bring Act 6 into the mix when your main attacks are busy. Use your spare puppet to keep the rotation packed instead of waiting around."
      ],
      [
        "Relentless Tempo",
        "Turn up the pace",
        "Lean into the speed of the Arcana: keep your puppets attacking together and make each available command count."
      ],
      [
        "Showstopper's Echo",
        "Build toward the grand finale",
        "Keep the Echo's extra puppet pressure rolling while you line up the next big hit."
      ],
      [
        "Showstopper",
        "Bring the house down",
        "This is your grand finale. Set the puppets loose, catch the boss in your best opening, and make the whole stage feel the impact."
      ]
    ]
  },
  "bb": {
    "name": "Blazing Brawler",
    "summary": "React to the combo choices in front of you. Each hit is another chance for a crit-based Fighter cooldown reset; Fighter resets do not refresh Blazing Brawler’s own Arcana cooldowns.",
    "skills": [
      [
        "Fire Within",
        "Fury engine",
        "Keep Fury generation going so your strongest Ignite options remain available."
      ],
      [
        "Berserker’s Fury",
        "Empower at the right moment",
        "Use your Fury for a stronger sequence when you can keep attacking."
      ],
      [
        "Piercing Gale",
        "Fury spender",
        "Commit Fury when the target is reachable and your next combo is ready."
      ],
      [
        "Earthshaker",
        "Fury spender / space",
        "Choose a good impact position and spend Fury where the hit will matter."
      ],
      [
        "Radiant Storm",
        "Major Fury commitment",
        "Line up the right targets and opening before spending two Fury."
      ],
      [
        "Ignite: Flurry of Fists",
        "Arcana combo starter",
        "Start a chain; the Fighter reset can be triggered by its hits but does not reset this Arcana cooldown."
      ],
      [
        "Charging Strike",
        "Stage 1 opener",
        "Start a Fighter combo when a worthwhile follow-up is available."
      ],
      [
        "Spinning Uppercut",
        "Stage 2 choice",
        "Choose it when ready. Crit resets can rapidly reopen a combo route."
      ],
      [
        "Pummel",
        "Stage 3 / rapid inputs",
        "Finish with three real hit checks, while mashing the activation key for its separate ten-input sequence."
      ],
      [
        "Focused Fist",
        "Stage 1 / optional charge",
        "Release quickly or charge when there is room. Watch what Stage 2 choices will be ready after it."
      ],
      [
        "Somersault Kick",
        "Stage 2 / three hits",
        "Three independent hit opportunities can trigger a Fighter cooldown reset."
      ],
      [
        "Drop Kick",
        "Stage 3 finisher",
        "Finish a valid combo and adapt as soon as a reset changes what is ready."
      ],
      [
        "Tumble",
        "Movement and survival",
        "Use it to keep up with targets or evade danger, not just because its cooldown is ready."
      ],
      [
        "Ignite: Cyclone Drive",
        "Arcana Stage 2",
        "A combo follow-up that can trigger crit resets without having its own cooldown reset."
      ],
      [
        "Ignite: Hammerblow",
        "Arcana Stage 3",
        "Finish the Arcana combo when it can connect; Fighter-only resets will not refresh this cooldown."
      ]
    ]
  }
};
