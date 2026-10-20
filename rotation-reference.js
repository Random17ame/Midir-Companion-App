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
        "Martyr's Consecration",
        "Defensive utility",
        "Keep this in mind for defensive situations; its exact role still needs a verified tooltip."
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
        "Virtuous Oath",
        "Always-on Virtue engine",
        "Keep Oath active, watch your status effects, and take well-timed attacks rather than avoiding every swing."
      ],
      [
        "Fateweaver",
        "Oath snapshot setup",
        "Prepare the right defensive snapshot before activating Oath."
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
    "summary": "Transmutation Energy is the real limitation. Bullet Barrage carries sustained damage; prepare Fatal Scope for a safe Way of the Gun and Pall burst.",
    "skills": [
      [
        "Gunner's Crest",
        "Start the damage engine",
        "Keep your empowerment running so your gun skills build meaningful Transmutation Energy."
      ],
      [
        "Bullet Barrage",
        "Sustained damage star",
        "Keep it working across long fights. Its repeated damage adds up even between flashy burst windows."
      ],
      [
        "Heavy Artillery",
        "Spend energy",
        "Plan around your Transmutation Energy supply, not just the cooldown indicator."
      ],
      [
        "Calamity Cannon",
        "Positioned energy spender",
        "Find a useful firing line and enough energy before committing."
      ],
      [
        "Fatal Scope",
        "Protect the charge",
        "Build the charge safely and align it with Way of the Gun and Pall when possible. Getting interrupted wastes the opportunity."
      ],
      [
        "Tracer Pod",
        "Mark your priority target",
        "Set up your target before the big gun sequence, especially when preparing Fatal Scope."
      ],
      [
        "Detonation Field",
        "Make the battlefield work",
        "Place your field where the target will stay long enough for your attacks to benefit."
      ],
      [
        "Way of the Gun",
        "Burst amplifier",
        "Save it for a real damage window, ideally with Fatal Scope and Pall lined up."
      ],
      [
        "Bullet Slide",
        "Base gun movement",
        "Use positioning and cooldowns to keep damage going while the Arcana kit cycles."
      ],
      [
        "Flash Launcher",
        "Base gun damage",
        "Work it into available openings without spending the energy needed for your main attacks."
      ],
      [
        "Shooting Rush",
        "Position and hit",
        "Use the movement and line coverage without losing your preferred firing position."
      ],
      [
        "Bullet Storm",
        "Base gun pressure",
        "Use it when you have a useful target spread and a gap in your Arcana sequence."
      ],
      [
        "Reload",
        "Spirit-dependent ammunition",
        "A Dual Gun spirit can refill bullets instantly. It does not replace Transmutation Energy generation."
      ],
      [
        "Grapple Shot",
        "Mobility tool",
        "Reposition with purpose, especially when preparing a charged Fatal Scope."
      ]
    ]
  },
  "fa": {
    "name": "Forbidden Alchemist",
    "summary": "Choose your formula, then aim Serpentcall, Chemical Carnival, and Fangs of Stone at where moving enemies are going. Preparation means nothing if the target leaves your ground marker.",
    "skills": [
      [
        "Elemental Compounding",
        "Choose the right herbs",
        "Choose a formula for the fight and the bonus you will need soon, not merely what is available now."
      ],
      [
        "Compound Catalyst",
        "One formula at a time",
        "Applying a new formula replaces the current Catalyst. Think ahead before swapping bonuses."
      ],
      [
        "Elemental Amplification",
        "Choose your utility",
        "Different elements change what you gain; plan offense, movement, or defense for the next phase."
      ],
      [
        "Serpentcall",
        "Ground aim / prediction",
        "Aim at the ground where the enemy will be. A moving target can leave your attack behind."
      ],
      [
        "Chemical Carnival",
        "Ground aim / damage",
        "Place the attack for the enemy’s movement, not just where it stood when you clicked."
      ],
      [
        "Fangs of Stone",
        "Ground aim / grouping",
        "Lead moving targets with your cursor and use the pull to set up follow-up damage."
      ],
      [
        "Elemental Wave",
        "Empower base Alchemy",
        "Set up the Alchemy bonuses you actually plan to use next."
      ],
      [
        "Water Cannon",
        "Water toolkit",
        "Use it when your formula and positioning favor Water."
      ],
      [
        "Flame Burst",
        "Fire toolkit",
        "Take advantage of Fire preparation and keep the target within its effective area."
      ],
      [
        "Heat Buster",
        "Prepared payoff",
        "Bring the right pressure and buffs before committing."
      ],
      [
        "Sand Burst",
        "Control tool",
        "Use the blind when it creates space or a safe opportunity."
      ],
      [
        "Wind Blast",
        "Control and spacing",
        "Move or disrupt enemies when positioning matters more than raw damage."
      ],
      [
        "Shock",
        "Supportive damage",
        "Keep it active when the setup and duration fit the fight."
      ],
      [
        "Life Drain",
        "Survival and damage",
        "Use it deliberately when healing and damage can both matter."
      ]
    ]
  },
  "mp": {
    "name": "Melodic Puppeteer",
    "summary": "Your base Puppetry skills can feel almost cooldown-free with S50 Erg and the set bonus, but charge times and hidden target/server limits remain. Those bonuses do not apply to Arcana skills; Link X has its own Cutting Chorus exception.",
    "skills": [
      [
        "Cutting Chorus",
        "Link X cooldown exception",
        "The Puppet Erg and set bonuses do not reduce Arcana cooldowns. Link X specifically shortens Cutting Chorus."
      ],
      [
        "Downbeat Drop",
        "Arcana timing",
        "Work it around other attacks rather than expecting base Puppetry cooldown reductions to apply."
      ],
      [
        "Relentless Tempo",
        "Keep the momentum",
        "Time this with your puppet’s next useful sequence."
      ],
      [
        "Showstopper",
        "Burst commitment",
        "Plan its impact around the party and the target’s actual position."
      ],
      [
        "Showstopper's Echo",
        "Extra puppet pressure",
        "Get value from Echo while keeping your next Puppet action ready."
      ],
      [
        "Live Wire",
        "Maintain your link",
        "Watch the timing so you do not lose the advantage between actions."
      ],
      [
        "Act 2: Threshold Cutter",
        "Per-target restriction",
        "A target can temporarily refuse another Act 2 even when you can cast it on a different enemy."
      ],
      [
        "Act 7: Climactic Crash",
        "Charge is the real cooldown",
        "With the reductions active it may show no cooldown, but a full charge and your connection still limit the real pace."
      ],
      [
        "Pierrot Marionette",
        "Summon and control",
        "Plan which puppet you need and remember that fast resummoning has a hidden delay."
      ],
      [
        "Colossus Marionette",
        "Summon and control",
        "Keep your puppet choice aligned with the next attack and its positioning."
      ],
      [
        "Marionette Summoning",
        "Hidden resummon delay",
        "The visible cooldown can disappear, but you still cannot resummon immediately."
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
