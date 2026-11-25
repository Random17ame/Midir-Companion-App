/* Resonant Litany / Dissonance Lab — compact cumulative Harmonic Saint draft.
 * Separation: Healing / Party Healing / Dissonance; no change to combat mechanics.
 * Translation text is selected by language, never concatenated EN+KO in the UI.
 * Sources: user-provided workbook; It's Mabinogi; EV Reforge; Soul/Nightbringer item data.
 */
(()=>{'use strict';
const TABLE={"firstProtection":23,"physical":[29,30,31,32,32,33,34,34,35,36,36,37,38,38,39,40,40,41,41,42,42,43,43,44,44,45,45,46,46,47,47,48,48,49,49,49,50,50,51,51,51,52,52,53,53,53,54,54,55,55,55,56,56,56,57,57,57,58,58,58,59,59,59,59,60,60,60,61,61,61,62,62,62,62,63,63,63,63,64,64,64,65,65,65,65,66,66,66,66,67,67,67,67,67,68,68,68,68,69,69,69,69,70,70,70,70,70,71,71,71,71,71,72,72,72,72,72,73,73,73,73,73,74,74,74,74,74,75,75,75,75,75,75,76,76,76,76,76,77],"magical":[30,30,31,32,33,33,34,35,36,36,37,37,38,39,39,40,40,41,42,42,43,43,44,44,45,45,46,46,47,47,48,48,48,49,49,50,50,51,51,51,52,52,53,53,53,54,54,54,55,55,55,56,56,56,57,57,57,58,58,58,59,59,59,60,60,60,61,61,61,61,62,62,62,63,63,63,63,64,64,64,64,65,65,65,65,66,66,66,66,67,67,67,67,68,68,68,68,69,69,69,69,69,70,70,70,70,71,71,71,71,71,72,72,72,72,72,73,73,73,73,73,74,74,74,74,74,74,75,75,75,75,75,76,76,76,76,76,76,77]};

const SLOTS=[['acc1','Accessory 1','💍'],['hat','Hat','🎩'],['acc2','Accessory 2','💍'],['wand','Healing Wand','🪄'],['body','Body','👕'],['offhand','Offhand','🛡️'],['gloves','Gloves','🧤'],['shoes','Boots','👢'],['robe','Robe','🧥'],['echo','Echostone','🔵']];
const REFORGE={
 accHeal:{slot:'Accessories',name:'Healing HP Recovery',kind:'heal'},
 accParty:{slot:'Accessories',name:'Party Healing HP Recovery',kind:'party'},
 bodyHeal:{slot:'Bodywear',name:'Healing HP Recovery',kind:'heal'},
 wandParty:{slot:'Wands and Staves',name:'Party Healing HP Recovery [22]',kind:'party'},
 echoParty:{slot:'Echostone',name:'Party Healing HP Recovery',kind:'party',echo:true}
};
const DEBUFFS=[
 ['Uppercut','Hydra',30,41,true],['Purrling','Purrling',15,15,true],['Mir','Mir',10,10,true],
 ['Prag','Prag',15,15,true],['Balloon','Balloon',3,3,true],['Piercing (9)','Piercing (9)',45,45,true],
 ['Pall','Pall',40,40,false],['Glyph A','Glyph A',10,10,false],['Jack','Jack',4,0,false],
 ['Catsidhe','Catsidhe',1,0,false],['Glyph B','Glyph B',10,10,false]
];
const SPEC=[0,2,3,5,7,10,13,16,20];

const RELIC_ENCHANTS={prefix:['Trusted','Piling','Memorial','Encroached','Chaste'],suffix:['Caretaker','Remorse','Snippet','Ego','Gift']};
const WAND_GRADES={nightbringer:[['common',170,12,12],['sturdy',280,13.8,30],['fine',385,31.8,48],['exquisite',495,49.8,66],['masterwork',600,67.8,84]],soul:[['masterwork',1025,90.4,112]]};
const L={
 ko:{'Resonant Litany':'음파의 세례','Dissonance':'불협화음','Healing':'힐링','Party Healing':'파티 힐링','Healing Recovery':'힐링 회복량','Party Healing Recovery':'파티 힐링 회복량','Equipment':'장비','Boosts':'추가 효과','Edit':'편집','Close':'닫기','Save':'저장','Item name':'장비 이름','Prefix':'접두','Suffix':'접미','Enchant name':'인챈트 이름','Healing +':'힐링 +','Party +':'파티 +','Potency %':'힐링 효율 %','Murias Water':'무리아스의 성수','Water %':'성수 효과 %','Healing set':'힐링 강화 세트','Set points':'세트 점수','Set':'세트','Active':'활성','Inactive':'비활성','Reforge':'세공','Line':'줄','Level':'레벨','Custom Healing':'직접 입력 힐링','Custom Party Healing':'직접 입력 파티 힐링','Custom value':'직접 입력 수치','None':'없음','Off':'끄기','On':'켜기','Accessory 1':'액세서리 1','Accessory 2':'액세서리 2','Hat':'모자','Body':'옷','Gloves':'장갑','Boots':'신발','Robe':'로브','Healing Wand':'힐링 원드','Echostone':'에코스톤','Magic Attack':'마법 공격력','Grade':'품질 등급','Common':'일반','Sturdy':'레어','Fine':'엘리트','Exquisite':'에픽','Masterwork':'마스터','Override %':'직접 입력 %','Auto':'자동','Special Upgrade':'특별 개조','Erg':'에르그','Recovery':'회복량','Stacks':'중첩','Per stack':'중첩당','Protection':'보호','Defense':'방어','Settings':'설정','Base recovery':'기본 회복량','Minimum':'최소','Maximum':'최대','Title':'타이틀','Pulse of Purification':'정화의 고동','Bri Leith Coin':'브리 레흐 주화','Totem':'토템','Amulet':'부적','Spirit Cultivation':'정령 육성','Spirit Refinement':'정령 연마','Dark Erg':'어둠의 에르그','Duskbound':'더스크바운드','Extra':'추가','Midir breakpoints':'미디르 보호 구간','Physical':'물리','Magical':'마법','Uppercut':'어퍼컷','Hydra':'하이드라','Purrling':'퍼링','Mir':'미르','Prag':'프라가라흐','Balloon':'풍선','Piercing (9)':'피어싱 (9)','Pall':'파멸의 장막','Glyph A':'글리프 A','Glyph B':'글리프 B','Jack':'잭','Catsidhe':'케트시','Manual':'직접 입력','Estimate':'회복량 비례','Calculation':'계산 방식','One-stack protection':'1중첩 보호','One-stack defense':'1중첩 방어','Anchor Healing':'기준 힐링','Anchor Party Healing':'기준 파티 힐링','Damage reduction':'피해 감소율','DPS change':'피해량 변화','Physical protection':'물리 보호','Magical protection':'마법 보호','Reset':'초기화','Disclaimer':'안내','Source':'출처','Healing Enhancement':'힐링 강화','Effect':'효과','Grade range':'등급 범위','Edit effect':'효과 편집','Wand':'원드','No Wand':'원드 없음','Tikka Wood Healing Wand':'티카 나무 힐링 원드','Nightbringer Savior':'나이트브링어 세이비어','Soul Liberator Healing Wand':'소울 리버레이트 힐링 원드','Healing HP Recovery':'힐링 생명력 회복','Party Healing HP Recovery':'파티 힐링 생명력 회복','Charge':'충전','Choice':'선택','Level effect':'레벨 효과','Details':'자세히','Healing · Minimum':'힐링 · 최소','Healing · Maximum':'힐링 · 최대','Party Healing · Minimum':'파티 힐링 · 최소','Party Healing · Maximum':'파티 힐링 · 최대','Recovery bonus':'회복량 보너스','Bonus':'보너스','Total':'합계','Equipment Level':'장비 레벨','Default':'기본값','Comparison':'비교','Normal':'일반','Limit Break':'한계 돌파','Offhand':'보조 장비','Offhand type':'보조 장비 종류','Shield':'방패','Spellbook':'마법서','Grade bonus %':'등급 보너스 %'},
 es:{'Resonant Litany':'Letanía Resonante','Dissonance':'Disonancia','Healing':'Curación','Party Healing':'Curación grupal','Equipment':'Equipo','Boosts':'Bonificaciones','Edit':'Editar','Close':'Cerrar','Grade':'Calidad','Override %':'Valor manual %','Special Upgrade':'Mejora especial','Erg':'Erg','Stacks':'Acumulaciones','Protection':'Protección','Defense':'Defensa','Settings':'Ajustes','Title':'Título','Source':'Fuente','Disclaimer':'Aviso','Recovery':'Recuperación','Healing Wand':'Varita de curación','Offhand':'Mano secundaria','Offhand type':'Tipo secundario','Shield':'Escudo','Spellbook':'Libro de hechizos','Grade bonus %':'Bonificación de calidad %'}
};
// 0.3.12: Complete Spanish UI vocabulary for the standalone Litany calculator.
Object.assign(L.es,{
 'Healing Recovery':'Recuperación de curación','Party Healing Recovery':'Recuperación de curación grupal','Item name':'Nombre del objeto','Prefix':'Prefijo','Suffix':'Sufijo','Enchant name':'Nombre del encantamiento','Healing +':'Curación +','Party +':'Curación grupal +','Potency %':'Potencia %','Potency':'Potencia','Murias Water':'Agua de Murias','Water %':'Efecto del agua %','Healing set':'Conjunto de curación','Set points':'Puntos de conjunto','Set':'Conjunto','Active':'Activo','Inactive':'Inactivo','Reforge':'Reforja','Line':'Línea','Level':'Nivel','Custom Healing':'Curación personalizada','Custom Party Healing':'Curación grupal personalizada','Custom value':'Valor personalizado','None':'Ninguno','Off':'Desactivado','On':'Activado','Accessory 1':'Accesorio 1','Accessory 2':'Accesorio 2','Hat':'Sombrero','Body':'Ropa','Gloves':'Guantes','Boots':'Botas','Robe':'Túnica','Echostone':'Piedra eco','Magic Attack':'Ataque mágico','Common':'Común','Sturdy':'Resistente','Fine':'Fino','Exquisite':'Exquisito','Masterwork':'Obra maestra','Auto':'Automático','Per stack':'Por acumulación','Base recovery':'Recuperación base','Minimum':'Mínimo','Maximum':'Máximo','Pulse of Purification':'Pulso de purificación','Bri Leith Coin':'Moneda de Bri Leith','Totem':'Tótem','Amulet':'Amuleto','Spirit Cultivation':'Cultivo espiritual','Spirit Refinement':'Refinamiento espiritual','Dark Erg':'Erg oscuro','Duskbound':'Vínculo crepuscular','Extra':'Extra','Midir breakpoints':'Umbrales de Midir','Physical':'Físico','Magical':'Mágico','Uppercut':'Uppercut','Hydra':'Hidra','Purrling':'Purrling','Mir':'Mir','Prag':'Prag','Balloon':'Globo','Piercing (9)':'Perforación (9)','Pall':'Pall','Glyph A':'Glifo A','Glyph B':'Glifo B','Jack':'Jack','Catsidhe':'Catsidhe','Manual':'Manual','Estimate':'Estimación','Calculation':'Cálculo','One-stack protection':'Protección por acumulación','One-stack defense':'Defensa por acumulación','Anchor Healing':'Curación de referencia','Anchor Party Healing':'Curación grupal de referencia','Damage reduction':'Reducción de daño','DPS change':'Cambio de DPS','Physical protection':'Protección física','Magical protection':'Protección mágica','Reset':'Reiniciar','Healing Enhancement':'Mejora de curación','Effect':'Efecto','Grade range':'Intervalo de calidad','Edit effect':'Editar efecto','Wand':'Varita','No Wand':'Sin varita','Tikka Wood Healing Wand':'Varita curativa de madera Tikka','Nightbringer Savior':'Nightbringer Savior','Soul Liberator Healing Wand':'Varita curativa Soul Liberator','Healing HP Recovery':'Recuperación de HP de curación','Party Healing HP Recovery':'Recuperación de HP de curación grupal','Charge':'Carga','Choice':'Elección','Level effect':'Efecto del nivel','Details':'Detalles','Healing · Minimum':'Curación · Mínimo','Healing · Maximum':'Curación · Máximo','Party Healing · Minimum':'Curación grupal · Mínimo','Party Healing · Maximum':'Curación grupal · Máximo','Recovery bonus':'Bono de recuperación','Bonus':'Bono','Total':'Total','Equipment Level':'Nivel del equipo','Default':'Predeterminado','Comparison':'Comparación','Normal':'Normal','Limit Break':'Límite superado','No added bonus':'Sin bono adicional','Edit to set values':'Editar para configurar','Save':'Guardar','Close':'Cerrar',
});
Object.assign(L.ko,{'Potency':'힐링 효율','Edit to set values':'편집하여 설정','No added bonus':'추가 보너스 없음'});
Object.assign(L.ko,{"Spirit Weapon":"정령 무기", "Spirit Healing Wand Awakening":"정령 힐링 원드 각성", "Relics":"무리아스 유물", "Relic slots":"유물 슬롯", "Relic":"유물", "Echoes of Salvation":"구원의 메아리", "Pall of Ruination":"파멸의 장막", "Restored effect":"복원 효과", "Duration +":"지속 시간 +", "Spirit Training":"정령 훈련", "Spirit Attunement":"정령 조율", "Spirit Control":"정령 제어", "Spirit Unleashing":"정령 해방", "Attack":"공격", "Exclusive":"전용", "Awakening":"각성", "Spirit Healing Wand Awakening active":"정령 힐링 원드 각성 활성", "Base MP":"기본 마나", "Awakening Buff Enhancement":"각성 버프 강화", "Awakening Recovery Enhancement":"각성 회복 강화", "Awakening Range Enhancement":"각성 범위 강화", "Awakening Duration Enhancement":"각성 지속 시간 강화", "Awakening Acceleration":"각성 가속", "Ultimate Awakening":"궁극의 각성", "Ultimate Attack":"궁극의 공격", "Ultimate Exclusive":"궁극의 전용", "Healing Wand: Mana Flow":"힐링 원드: 마나 흐름", "Healing Wand: Critical Care":"힐링 원드: 치명적 간호", "Healing Wand: Lucky Blessing":"힐링 원드: 행운의 축복", "Healing Wand: Focused Healing":"힐링 원드: 집중 치유", "Damage / recovery":"피해 / 회복", "Dark Erg level":"어둠의 에르그 레벨", "Dark Erg potency %":"어둠의 에르그 효율 %", "Echoes bonus":"구원의 메아리 보너스", "Relic effect":"유물 효과", "Prefix enchant":"접두 인챈트", "Suffix enchant":"접미 인챈트", "Enter displayed bonus":"표시 수치 입력", "Upgrade":"강화", "Awakening bonus":"각성 보너스", "Seconds":"초", "Healing +%":"힐링 +%"});
Object.assign(L.es,{"Spirit Weapon":"Arma espiritual", "Spirit Healing Wand Awakening":"Despertar espiritual de la varita curativa", "Relics":"Reliquias de Murias", "Relic slots":"Ranuras de reliquias", "Relic":"Reliquia", "Echoes of Salvation":"Ecos de Salvación", "Pall of Ruination":"Manto de Ruina", "Restored effect":"Efecto restaurado", "Duration +":"Duración +", "Spirit Training":"Entrenamiento espiritual", "Spirit Attunement":"Sintonía espiritual", "Spirit Control":"Control espiritual", "Spirit Unleashing":"Liberación espiritual", "Attack":"Ataque", "Exclusive":"Exclusivo", "Awakening":"Despertar", "Spirit Healing Wand Awakening active":"Despertar espiritual activo", "Base MP":"Maná base", "Awakening Buff Enhancement":"Mejora del beneficio del despertar", "Awakening Recovery Enhancement":"Mejora de recuperación del despertar", "Awakening Range Enhancement":"Mejora de alcance del despertar", "Awakening Duration Enhancement":"Mejora de duración del despertar", "Awakening Acceleration":"Aceleración del despertar", "Ultimate Awakening":"Despertar definitivo", "Ultimate Attack":"Ataque definitivo", "Ultimate Exclusive":"Exclusivo definitivo", "Healing Wand: Mana Flow":"Varita curativa: Flujo de maná", "Healing Wand: Critical Care":"Varita curativa: Cuidados críticos", "Healing Wand: Lucky Blessing":"Varita curativa: Bendición afortunada", "Healing Wand: Focused Healing":"Varita curativa: Curación concentrada", "Dark Erg level":"Nivel de Erg oscuro", "Dark Erg potency %":"Potencia de Erg oscuro %", "Echoes bonus":"Bono de Ecos", "Relic effect":"Efecto de reliquia", "Prefix enchant":"Encantamiento prefijo", "Suffix enchant":"Encantamiento sufijo", "Enter displayed bonus":"Introducir bono indicado", "Upgrade":"Mejora", "Awakening bonus":"Bono de despertar", "Seconds":"segundos", "Healing +%":"Curación +%"});
Object.assign(L.ko,{"Trusted":"신뢰하는", "Piling":"쌓이는", "Memorial":"기억의", "Encroached":"잠식된", "Chaste":"순결한", "Caretaker":"돌보는 이", "Remorse":"후회", "Snippet":"조각", "Ego":"자아", "Gift":"선물"});
Object.assign(L.es,{"Trusted":"Leal", "Piling":"Acumulación", "Memorial":"Conmemorativo", "Encroached":"Invadido", "Chaste":"Puro", "Caretaker":"Cuidador", "Remorse":"Remordimiento", "Snippet":"Fragmento", "Ego":"Ego", "Gift":"Regalo"});
const lang=()=>window.MIDIR_I18N?.language?.()||'en';
const t=k=>L[lang()]?.[k]||k;
const e=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const num=(v,min=0,max=1e6)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):0));
const fmt=v=>Number.isFinite(v)?Number(v).toLocaleString(lang()==='ko'?'ko-KR':'en-US',{maximumFractionDigits:2}):'—';
function evRule(key){const rule=REFORGE[key];if(!rule)return null;
 if(rule.echo)return {min:1,max:20,limitMax:20};
 const data=window.MIDIR_REFORGE_TABLE?.reforge||[];
 return data.find(r=>r.name===rule.name&&r.type.split(/\s*,\s*/).includes(rule.slot))||null;
}
function reforgeLevel(key,value){const rule=evRule(key);return rule?Math.round(num(value,0,Number(rule.limitMax??rule.max)||0)):0;}
function reforgeFlat(key,value){const lv=reforgeLevel(key,value);return lv?(REFORGE[key].kind==='heal'?24+lv:2.5*lv):0;}
// Item editor fields are whole-number rolls. Internal game formulas may still
// yield fractions (e.g. 2.5 Party Healing per reforge level, grade presets).
const whole=(v,min=0,max=1e6)=>Math.round(num(v,min,max));
function cleanGearEnchant(raw){return {name:String(raw?.name||''),heal:whole(raw?.heal),magicAttack:whole(raw?.magicAttack)};}
function cleanWater(raw){const enabled=!!raw?.enabled;const roll=whole(raw?.pct,0,10);return {enabled,pct:enabled?Math.max(1,roll):roll};}
function slotBlank(){return {enabled:false,name:'',prefix:{name:'',heal:0,magicAttack:0},suffix:{name:'',heal:0,magicAttack:0},murias:{enabled:false,pct:0},setPoints:0,reforges:[{key:'',level:0,value:0},{key:'',level:0,value:0},{key:'',level:0,value:0}],healFlat:0,partyFlat:0,sharedPct:0,type:'none',gradeTier:'common',gradePct:0};}
function boostBlank(){return {enabled:false,heal:0,party:0,pct:0,dProt:0,dDef:0};}
const BOOSTS=[['title','Title',null],['pulse','Pulse of Purification','Pulse of Purification'],['coin','Bri Leith Coin',null],['totem','Totem',null],['amulet','Amulet',null],['spirit','Spirit Weapon','Spirit Healing Wand Awakening'],['relics','Relics',null],['duskbound','Duskbound',null],['extra','Extra',null]];
function initial(){return {version:6,healingMin:97,healingMax:106,partyMin:205,partyMax:227,wandType:'none',gradeTier:'masterwork',gradeOverride:'',specialStep:0,ergRank:'B',ergLevel:1,ergPotencyOverride:'',darkErgLevel:0,darkErgPctOverride:'',spirit:{awakeningActive:false,baseMP:0,attack:{training:0,attunement:0,control:0,ultimate:0},exclusive:{manaFlow:0,criticalCare:0,luckyBlessing:0,focusedHealing:0,ultimate:0},awakening:{recovery:0,range:0,duration:0,buff:0,acceleration:0}},relics:['echoes','pulse','pall'].map(skill=>({enabled:false,skill,level:0,prefix:{selection:'none',name:'',heal:0,magicAttack:0},suffix:{selection:'none',name:'',heal:0,magicAttack:0}})),slots:Object.fromEntries(SLOTS.map(([id])=>[id,slotBlank()])),boosts:Object.fromEntries(BOOSTS.map(([id])=>[id,boostBlank()])),mode:'manual',protPerStack:.01,defPerStack:.05,anchorHeal:106,anchorParty:227,stacks:5,output:'healing',basePhys:297,baseMag:298,uppercutPct:89,hydraPct:89,debuffs:DEBUFFS.map(row=>({phys:row[2],mag:row[3],on:row[4]}))};}
function hydrate(raw){const a=initial();if(!raw||typeof raw!=='object')return a;Object.assign(a,raw);a.slots={...(a.slots&&typeof a.slots==='object'?a.slots:{})};a.boosts={...(a.boosts&&typeof a.boosts==='object'?a.boosts:{})};
 for(const [id] of SLOTS){const old=a.slots[id]||{};a.slots[id]={...slotBlank(),...old,
   // v6 field correction: old enchant Party/Potency and water flat entries were
   // unsupported and must never carry forward into a saved profile's totals.
   prefix:cleanGearEnchant(old.prefix),suffix:cleanGearEnchant(old.suffix),
   murias:cleanWater(old.murias),
   reforges:Array.from({length:id==='echo'?1:3},(_,i)=>({...slotBlank().reforges[0],...(old.reforges?.[i]||{})}))};
  a.slots[id].healFlat=whole(old.healFlat);a.slots[id].partyFlat=whole(old.partyFlat);
  a.slots[id].sharedPct=whole(old.sharedPct);a.slots[id].gradePct=whole(old.gradePct);
  a.slots[id].setPoints=whole(old.setPoints,0,10);
  for(const r of a.slots[id].reforges){r.level=whole(r.level,0,25);r.value=whole(r.value);}
 // Keep drafts saved by v2: migrate the previously separate EV reforge levels once.
 if(raw.version<3){const oldLevel=old.healingLevel,partyLevel=old.partyLevel,lines=a.slots[id].reforges;
  if(oldLevel>0)lines[0]={key:'heal',level:oldLevel,value:0};if(partyLevel>0)lines[id==='acc1'||id==='acc2'?1:0]={key:'party',level:partyLevel,value:0};}
 }
 for(const [id] of BOOSTS){const old=a.boosts[id]||{};a.boosts[id]={...boostBlank(),...old};}
 // Spell and weapon engravings have their own independent controls.
 const spiritDefaults=initial().spirit,rawSpirit=raw.spirit||{};
 a.spirit={...spiritDefaults,...rawSpirit,attack:{...spiritDefaults.attack,...rawSpirit.attack},exclusive:{...spiritDefaults.exclusive,...rawSpirit.exclusive},awakening:{...spiritDefaults.awakening,...rawSpirit.awakening}};
 a.relics=initial().relics.map((defaultSlot,i)=>{const old=raw.relics?.[i]||{};return {...defaultSlot,...old,skill:defaultSlot.skill,prefix:{...cleanGearEnchant(old.prefix),selection:old.prefix?.selection||''},suffix:{...cleanGearEnchant(old.suffix),selection:old.suffix?.selection||''}};});
 // v4 had Spirit Cultivation / Refinement as free-form bonuses: migrate their
 // representable part to the video-confirmed Training and Attunement levels.
 if(Number(raw.version)<5){const prior=raw.boosts||{};
  if(prior.cultivation?.enabled){a.boosts.spirit.enabled=true;a.spirit.attack.training=Math.round(num(prior.cultivation.heal,0,10)/2);}
  if(prior.refinement?.enabled){a.boosts.spirit.enabled=true;a.spirit.attack.attunement=Math.round(num(prior.refinement.pct,0,5));}
  if(prior.darkErg?.enabled&&Number(raw.ergLevel)===50&&raw.ergRank==='S'){a.darkErgLevel=50;a.darkErgPctOverride=String(num(prior.darkErg.pct,0,100));}
 }
 // Fixed boost: Pulse of Purification; Amulet has only a whole Healing roll.
 a.boosts.pulse.heal=0;a.boosts.pulse.party=0;a.boosts.pulse.pct=20;a.boosts.pulse.dProt=0;a.boosts.pulse.dDef=0;
 a.boosts.amulet.heal=Math.round(num(a.boosts.amulet.heal,0,12));a.boosts.amulet.party=0;a.boosts.amulet.pct=0;a.boosts.amulet.dProt=0;a.boosts.amulet.dDef=0;
 for(const [tree,maxes] of [['attack',{ultimate:1}],['exclusive',{ultimate:1}],['awakening',{acceleration:1}]])for(const key of Object.keys(a.spirit[tree]))a.spirit[tree][key]=Math.round(num(a.spirit[tree][key],0,maxes[key]||5));
 a.darkErgLevel=Math.round(num(a.darkErgLevel,0,50));
 for(const slot of a.relics){slot.level=Math.round(num(slot.level,0,10));for(const side of ['prefix','suffix']){const r=slot[side];if(!r.selection){r.selection=RELIC_ENCHANTS[side].includes(r.name)?r.name:r.name?'custom':'none';}if(!['none','custom',...RELIC_ENCHANTS[side]].includes(r.selection))r.selection='none';}}

 if(raw.version<3){if(raw.pulse){a.boosts.pulse.enabled=true;a.boosts.pulse.pct=20;}if(raw.duskbound){a.boosts.duskbound.enabled=true;a.boosts.duskbound.dProt=.1;a.boosts.duskbound.dDef=.1;}
  if(raw.spiritHealFlat){a.boosts.spirit.enabled=true;a.spirit.attack.training=Math.round(num(raw.spiritHealFlat,0,10)/2);}
  if(raw.spiritPct){a.boosts.spirit.enabled=true;a.spirit.attack.attunement=Math.round(num(raw.spiritPct,0,5));}
  if(raw.darkErgPct&&a.ergRank==='S'&&Number(a.ergLevel)===50){a.darkErgLevel=50;a.darkErgPctOverride=String(num(raw.darkErgPct,0,25));}
  if(Number(raw.gradePct)>0)a.gradeOverride=String(raw.gradePct);
 }
 // Healing wands never contribute Healing Enhancement set points, including v3 saves.
 a.slots.wand.setPoints=0;
 if(a.slots.offhand.type!=='shield'&&a.slots.offhand.type!=='spellbook')a.slots.offhand.type='none';
 a.slots.wand.enabled=a.wandType!=='none';
 // Normalize editable gear rolls, without rounding the actual game's computed
 // healing ranges, EV reforge coefficients or Dissonance calibration values.
 for(const key of ['gradeOverride','ergPotencyOverride','darkErgPctOverride'])
  if(a[key]!==''&&a[key]!==null&&a[key]!==undefined)a[key]=whole(a[key],0,key==='darkErgPctOverride'?25:300);
 a.spirit.baseMP=whole(a.spirit.baseMP);
  for(const [id,b] of Object.entries(a.boosts))for(const prop of ['heal','party','pct'])if(id!=='pulse')b[prop]=whole(b[prop]);
 a.debuffs=DEBUFFS.map((d,i)=>({phys:d[2],mag:d[3],on:d[4],...(a.debuffs?.[i]||{})}));a.version=6;
 return a;}
function supportedReforge(slot,key){if(key==='heal')return slot==='acc1'||slot==='acc2'?'accHeal':slot==='body'?'bodyHeal':null;
 if(key==='party')return slot==='acc1'||slot==='acc2'?'accParty':slot==='wand'?'wandParty':slot==='echo'?'echoParty':null;return null;}
function gradeDetails(a){const tiers=WAND_GRADES[a.wandType]||[];const chosen=tiers.find(x=>x[0]===a.gradeTier)||tiers.at(-1)||null;
 const auto=chosen?chosen[3]:0;return {tier:chosen,auto,used:a.gradeOverride!==''&&a.gradeOverride!==null&&a.gradeOverride!==undefined?num(a.gradeOverride,0,300):auto};}
function calc(raw){const a=hydrate(raw),grade=gradeDetails(a),wandOn=a.wandType!=='none',slots=a.slots;
 let flatH=0,flatP=0,pctH=0,pctP=0,enchantMagicAttack=0,reforge={accessoryHealing:[0,0],accessoryParty:[0,0],bodyHealing:0,wandParty:0,echoParty:0,partyWinning:0,partyWinner:'none',healingTotal:0,partyTotal:0};let setPts=0;
 for(const [id] of SLOTS){const it=slots[id];if(!it.enabled||(id==='wand'&&!wandOn)||(id==='offhand'&&it.type==='none'))continue;
  flatH+=num(it.healFlat)+num(it.prefix.heal)+num(it.suffix.heal);flatP+=num(it.partyFlat);
  // Enchant Magic Attack is tracked separately: it is not a direct flat Healing,
  // Party Healing or Dissonance modifier in the present formula.
  enchantMagicAttack+=num(it.prefix.magicAttack)+num(it.suffix.magicAttack);
  const pct=num(it.sharedPct,0,500)+(it.murias.enabled?num(it.murias.pct,1,10):0)+(id==='offhand'?num(it.gradePct,0,500):0);
  pctH+=pct;pctP+=pct;
  if(!['acc1','acc2','echo','wand'].includes(id))setPts+=num(it.setPoints,0,10);
  for(const line of it.reforges){if(id==='offhand'||!line.key)continue;
   let val=0;const rk=supportedReforge(id,line.key);if(rk)val=reforgeFlat(rk,line.level);
   else if(line.key==='customHeal'||line.key==='customParty')val=num(line.value);
   if(id==='acc1'||id==='acc2'){
    if(line.key==='heal'&&rk)reforge.accessoryHealing[id==='acc1'?0:1]+=val;
    else if(line.key==='party'&&rk)reforge.accessoryParty[id==='acc1'?0:1]+=val;
    else if(line.key==='customHeal')flatH+=val;
    else if(line.key==='customParty')flatP+=val;
   }else if(id==='body'&&line.key==='heal'&&rk)reforge.bodyHealing+=val;
   else if(id==='wand'&&line.key==='party'&&rk)reforge.wandParty+=val;
   else if(id==='echo'&&line.key==='party'&&rk)reforge.echoParty+=val;
   else if(line.key==='customHeal')flatH+=val;
   else if(line.key==='customParty')flatP+=val;
  }
 }
 reforge.accessoryPartyTotal=reforge.accessoryParty.reduce((x,y)=>x+y,0);
 reforge.partyWinning=Math.max(reforge.accessoryPartyTotal,reforge.echoParty);
 reforge.partyWinner=reforge.echoParty>reforge.accessoryPartyTotal?'echo':reforge.accessoryPartyTotal?'accessories':reforge.echoParty?'echo':'none';
 reforge.healingTotal=reforge.accessoryHealing.reduce((x,y)=>x+y,0)+reforge.bodyHealing;
 reforge.partyTotal=reforge.partyWinning+reforge.wandParty;
 flatH+=reforge.healingTotal;flatP+=reforge.partyTotal;
 let pct=wandOn?grade.used+((a.wandType==='soul'?10:a.wandType==='nightbringer'?5:0))+((a.wandType==='soul'||a.wandType==='nightbringer')?SPEC[Math.round(num(a.specialStep,0,8))]:0):0;
 // B/A do not increase potency. For intermediate S ranks the player can enter a measured value;
 // only the S50 +20% published endpoint is filled automatically.
 const ergPotency=wandOn&&a.ergRank==='S'&&a.ergLevel>=41?(a.ergPotencyOverride!==''?num(a.ergPotencyOverride,0,100):Number(a.ergLevel)===50?20:0):0;
 pct+=ergPotency;
 const darkEligible=wandOn&&a.ergRank==='S'&&Number(a.ergLevel)===50;
 const darkPct=darkEligible&&a.darkErgLevel>0?(a.darkErgPctOverride!==''?num(a.darkErgPctOverride,0,25):a.darkErgLevel*.5):0;
 pct+=darkPct;
 setPts=Math.round(setPts);if(setPts>=10)pct+=20;
 let dProt=wandOn&&a.wandType==='soul'?.8:0,dDef=wandOn&&a.wandType==='soul'?2:0;
 for(const [id] of BOOSTS){const b=a.boosts[id];if(!b.enabled||id==='spirit'||id==='relics')continue;flatH+=num(b.heal);flatP+=num(b.party);pct+=num(b.pct,0,500);dProt+=num(b.dProt,0,100);dDef+=num(b.dDef,0,1000);}
 // Spirit Augments: independent passive Attack path and timed Awakening bonus.
 // Conditional Exclusive skills are configurable and displayed, not treated as
 // unconditional Healing/Party Healing bonuses.
 let spiritMax=0,spiritAwakenPct=0;
 if(a.boosts.spirit.enabled&&wandOn){
  flatH+=2*a.spirit.attack.training;
  pct+=a.spirit.attack.attunement;
  spiritMax=Math.min(15,num(a.spirit.baseMP)*.004*a.spirit.attack.control);
  if(a.spirit.awakeningActive){spiritAwakenPct=10+3*a.spirit.awakening.buff;pct+=spiritAwakenPct;}
 }
 // Murias relic effects: enchant rolls apply to recovery; restored abilities
 // affect only their matching Arcana skill, not generic Healing/Party Healing.
 const relicEffect={echoesPct:0,pulseSeconds:0,pallSeconds:0};
 if(a.boosts.relics.enabled)for(const relic of a.relics){if(!relic.enabled)continue;
  for(const side of ['prefix','suffix']){const ench=relic[side]||{};if(ench.selection==='Gift'&&side==='suffix')pct+=5;else if(ench.selection==='custom'){flatH+=num(ench.heal);enchantMagicAttack+=num(ench.magicAttack);}}
  if(relic.skill==='echoes')relicEffect.echoesPct+=relic.level;
  if(relic.skill==='pulse')relicEffect.pulseSeconds+=relic.level*.5;
  if(relic.skill==='pall')relicEffect.pallSeconds+=relic.level*.5;
 }

 pctH+=pct;pctP+=pct;
 const healing=[(num(a.healingMin)+flatH)*(1+pctH/100),(num(a.healingMax)+flatH+spiritMax)*(1+pctH/100)],party=[(num(a.partyMin)+flatP)*(1+pctP/100),(num(a.partyMax)+flatP+spiritMax)*(1+pctP/100)];
 const anchor=num(a.anchorHeal)+num(a.anchorParty),ratio=anchor>0?(healing[1]+party[1])/anchor:1;
 const rate=a.mode==='ratio'?ratio:1,pBase=num(a.protPerStack,0,100)*rate,dBase=num(a.defPerStack,0,1e4)*rate;
 const stacks=Math.round(num(a.stacks,1,5)),protEach=pBase+dProt,defEach=dBase+dDef,protTotal=stacks*protEach,defTotal=stacks*defEach;
 const physOff=a.debuffs.reduce((sum,d)=>sum+(d.on?num(d.phys):0),0),magOff=a.debuffs.reduce((sum,d)=>sum+(d.on?num(d.mag):0),0);
 const beforeP=Math.floor(num(a.basePhys)*num(a.uppercutPct,0,100)/100-physOff),beforeM=Math.floor(num(a.baseMag)*num(a.hydraPct,0,100)/100-magOff),afterP=beforeP-Math.ceil(protTotal-1e-10),afterM=beforeM-Math.ceil(protTotal-1e-10);
 const lookup=(n,kind)=>{const i=n-TABLE.firstProtection;return i>=0&&i<TABLE[kind].length&&Number.isInteger(i)?TABLE[kind][i]:null;};
 const p0=lookup(beforeP,'physical'),p1=lookup(afterP,'physical'),m0=lookup(beforeM,'magical'),m1=lookup(afterM,'magical');
 const change=(from,to)=>from!==null&&to!==null&&from<100?(100-to)/(100-from)-1:null;
 return {state:a,grade,ergPotency,darkEligible,darkPct,spiritMax,spiritAwakenPct,relicEffect,echoesBonus:party[1]*relicEffect.echoesPct/100,setPts,setActive:setPts>=10,flatH,flatP,enchantMagicAttack,hPct:pctH,pPct:pctP,healing,party,reforge,stacks,ratio,protEach,defEach,protTotal,defTotal,pBase,dBase,directProt:dProt,directDef:dDef,beforeP,beforeM,afterP,afterM,p0,p1,m0,m1,pgain:change(p0,p1),mgain:change(m0,m1)};
}
const TIPS={darkErg:"At S50, Dark Erg may be added to a Healing Wand. S50 is +25%; intermediate values default to 0.5% per level and can be overridden.",offhand:'Choose Shield or Spellbook and its quality. No Healing or Party Healing reforge is counted. Enter a grade bonus only if the equipped item grants one.',quality:'Select quality. Masterwork uses the maximum preset; Override accepts the value shown on your wand.',enchant:'Equipment enchants can add whole-number Healing and Magic Attack. Magic Attack is tracked, not included as direct Healing or Dissonance.',erg:'B and A affect additional recovery and preparation, not Healing Potency. S50 grants +20%; enter your actual S41–49 value when known.',water:'Murias Water adds Healing Potency only: select a whole 1–10% roll when enabled.',set:'Healing Enhancement activates at 10 points across eligible equipment; wands, accessories and Echostones do not count. The +20% applies once.',reforge:'Up to three lines on ordinary equipment; one on an Echostone. Levels follow the EV simulator. Echostone Party Healing replaces matching accessory reforge totals.',base:'Enter unmodified Healing and Party Healing reference ranges to avoid counting equipment twice.',calibrate:'Manual one-stack reduction is independent of the hypothetical equipment; proportional mode is a sensitivity model, not a game formula.',bonus:'Use an Edit button to enter only the Healing or Party Healing effects that this boost actually provides.',source:'Calculation assumptions and stacking may differ from live mechanics. Compare displayed recovery and Dissonance with your character.',};
const TIPS_KO={darkErg:"S50 힐링 원드에 어둠의 에르그를 부여할 수 있습니다. 50레벨은 +25%이며 중간 단계는 레벨당 0.5%를 기본값으로 사용합니다.",offhand:'방패 또는 마법서와 등급을 선택하세요. 힐링 관련 세공은 계산하지 않습니다. 장비의 등급에 힐링 보너스가 있을 때만 직접 입력하세요.',quality:'등급을 선택하세요. 마스터 등급은 최고 수치로 시작하며 직접 입력으로 실제 수치를 설정할 수 있습니다.',enchant:'장비 인챈트는 정수 힐링 및 마법 공격력을 부여할 수 있습니다. 마법 공격력은 별도로 기록되며 힐링·불협화음에 직접 더하지 않습니다.',erg:'B/A 등급은 추가 회복과 시전 시간 효과가 있으며 힐링 효율을 직접 올리지 않습니다. S50은 +20%이며 S41–49의 실제 수치는 직접 입력하세요.',water:'무리아스의 성수는 힐링 효율만 증가합니다. 활성화 시 정수 1–10%를 선택하세요.',set:'원드, 액세서리, 에코스톤을 제외한 착용 장비에서 10점을 달성하면 힐링 강화 +20%가 한 번 적용됩니다.',reforge:'일반 장비는 최대 세 줄, 에코스톤은 한 줄. EV 세공 수치에 따르며 파티 힐링 에코스톤은 액세서리의 동일 효과와 중복되지 않습니다.',base:'장비 효과를 이중으로 계산하지 않도록 장비 적용 전 회복량을 입력하세요.',calibrate:'직접 입력 수치는 장비 변화와 별도로 유지됩니다. 회복량 비례 방식은 변화를 비교하는 용도입니다.',bonus:'추가 효과의 편집을 눌러 적용되는 힐링 또는 파티 힐링 수치를 입력하세요.',source:'실제 게임 계산 순서 및 중첩 방식과 차이가 있을 수 있습니다. 캐릭터 표시 수치와 비교해 주세요.'};
const TIPS_ES={darkErg:"Erg oscuro requiere S50. El nivel 50 proporciona +25%; los niveles intermedios usan 0,5% por nivel salvo valor manual.",offhand:'Elige Escudo o Libro de hechizos y su calidad. No se incluyen reforjas de curación del objeto secundario.',quality:'Elige calidad. Obra maestra comienza con su valor máximo; usa el valor manual para el bono real.',enchant:'Los encantamientos admiten Curación y Ataque mágico enteros. El Ataque mágico se registra por separado, sin sumarlo a Curación o Disonancia.',erg:'B y A mejoran otros efectos, pero no la potencia de curación. S50 añade 20%; introduce el valor de S41–49 si lo conoces.',water:'El agua de Murias solo aporta Potencia de curación; selecciona un valor entero del 1 al 10% al activarla.',set:'La mejora de curación se activa con 10 puntos de equipo apto. Varitas, accesorios y piedras eco no cuentan; el 20% se aplica una sola vez.',reforge:'Hasta tres líneas por objeto y una para la piedra eco. Se usan los límites EV. La piedra eco sustituye el total de reforjas equivalentes de los accesorios.',base:'Introduce los valores de referencia sin equipo para evitar contar dos veces las bonificaciones.',calibrate:'El valor manual por acumulación es independiente del equipo. El modo proporcional sirve para comparar escenarios.',bonus:'Usa Editar para introducir únicamente los efectos de curación o disonancia del bono.',source:'Los supuestos de cálculo y acumulación pueden diferir del juego. Compara los resultados con los valores de tu personaje.'};
const tip=(k)=>`<button class="hsl-help" type="button" aria-label="${e(t('Details'))}" title="${e(lang()==='ko'?(TIPS_KO[k]||k):lang()==='es'?(TIPS_ES[k]||k):(TIPS[k]||k))}">ⓘ</button>`;
const gearNumericKey=k=>k.startsWith('slots.')||k.startsWith('relics.')||k.startsWith('spirit.')||(k.startsWith('boosts.')&&!/\.(dProt|dDef)$/.test(k))||['gradeOverride','ergPotencyOverride','darkErgPctOverride'].includes(k);
const input=(key,label,v,step='1',opts='')=>{const integer=gearNumericKey(key);return `<label class="hsl-field"><span>${e(t(label))}</span><input data-hsl-key="${e(key)}" type="number" step="${integer?'1':step}" inputmode="${integer?'numeric':'decimal'}" ${integer?'min="0"':''} value="${e(v??0)}" ${opts}></label>`;};
const textInput=(key,label,v)=>`<label class="hsl-field"><span>${e(t(label))}</span><input data-hsl-key="${e(key)}" type="text" maxlength="80" value="${e(v||'')}"></label>`;
const opts=(items,selected)=>items.map(([id,name])=>`<option value="${e(id)}" ${String(id)===String(selected)?'selected':''}>${e(t(name))}</option>`).join('');
const select=(key,label,value,items)=>`<label class="hsl-field"><span>${e(t(label))}</span><select data-hsl-key="${e(key)}">${opts(items,value)}</select></label>`;
const chk=(key,label,v)=>`<label class="hsl-toggle"><input data-hsl-key="${e(key)}" type="checkbox" ${v?'checked':''}><span>${e(t(label))}</span></label>`;
const infoPair=(name,range,icon)=>`<div class="hsl-metric"><small>${icon||''} ${e(t(name))}</small><strong>${fmt(range[0])}–${fmt(range[1])}</strong></div>`;
const iconFor=name=>{const src=window.MIDIR_ROTATION_ICONS?.[name];return src?`<img src="${e(src)}" alt="">`:'';};
function reforgeEditor(id,slot,line,i){const keys=[['','None'],...(['acc1','acc2','body'].includes(id)&&supportedReforge(id,'heal')?[['heal','Healing HP Recovery']]:[]),...(supportedReforge(id,'party')?[['party','Party Healing HP Recovery']]:[]),['customHeal','Custom Healing'],['customParty','Custom Party Healing']];
 const key=`slots.${id}.reforges.${i}`,rule=supportedReforge(id,line.key),ev=rule&&evRule(rule),max=Number(ev?.limitMax??ev?.max??0),standard=Number(ev?.max??0);
 const levels=Array.from({length:max+1},(_,n)=>[n,n===0?'None':`Lv ${n}${n>standard?' ✨':''}`]);
 return `<div class="hsl-line"><small>${e(t('Line'))} ${i+1}</small>${select(key+'.key','Reforge',line.key,keys)}${ev?select(key+'.level','Level',line.level||0,levels):(line.key.startsWith('custom')?input(key+'.value','Custom value',line.value||0,'.1'):'')}</div>`;
}
function equipBoard(c){return `<div class="hsl-board" aria-label="${e(t('Equipment'))}">${SLOTS.map(([id,name,icon])=>{const it=c.state.slots[id];const rf=id==='offhand'?0:it.reforges.filter(x=>x.key&&((x.level||0)>0||x.value>0)).length;
 const flags=[it.prefix.name||it.suffix.name?'✦':'',rf?`${rf}R`:'',it.murias.enabled?'💧':'',!['wand','acc1','acc2','echo'].includes(id)&&it.setPoints?`${it.setPoints}/10`:''].filter(Boolean).join(' · ');
 const active=id==='wand'?c.state.wandType!=='none':id==='offhand'?it.enabled&&it.type!=='none':it.enabled;
 const detail=id==='wand'?(it.name||t(({'none':'No Wand','tikka':'Tikka Wood Healing Wand','nightbringer':'Nightbringer Savior','soul':'Soul Liberator Healing Wand'})[c.state.wandType]||'No Wand')):id==='offhand'?(it.name||t(({'shield':'Shield','spellbook':'Spellbook','none':'None'})[it.type]||'None')):(it.name||'—');
 const pic=id==='offhand'&&it.type==='spellbook'?'📖':icon;
 return `<button class="hsl-gear-cell ${active?'is-on':''}" data-hsl-open="slot:${id}" aria-label="${e(t('Edit'))} ${e(t(name))}" title="${e(t(name))}"><span class="hsl-gear-emoji">${pic}</span><strong>${e(t(name))}</strong><small>${e(detail)}</small><span>${active?e(flags||t('On')):e(t('Off'))}</span></button>`;}).join('')}</div>`;}
function boostBoard(c){return `<div class="hsl-boostboard">${BOOSTS.map(([id,name,sk])=>{const a=c.state.boosts[id];
 const parts=id==='pulse'?[`${t('Potency')} +20%`]:id==='amulet'?[`${t('Healing')} +${a.heal}`]:id==='spirit'?[
 `${t('Spirit Training')} ${c.state.spirit.attack.training}/5`,c.state.spirit.awakeningActive?`${t('Awakening bonus')} +${10+3*c.state.spirit.awakening.buff}%`:''
 ]:id==='relics'?[`${c.state.relics.filter(r=>r.enabled).length}/3`,c.relicEffect.echoesPct?`${t('Echoes bonus')} +${c.relicEffect.echoesPct}%`:'']:
 [a.heal?`${t('Healing')} +${fmt(a.heal)}`:'',a.party?`${t('Party Healing')} +${fmt(a.party)}`:'',a.pct?`${t('Potency')} +${fmt(a.pct)}%`:'',a.dProt?`${t('Protection')} +${fmt(a.dProt)}`:'',a.dDef?`${t('Defense')} +${fmt(a.dDef)}`:''];
 const summary=parts.filter(Boolean).slice(0,2).join(' · ')||t('Edit to set values');
 const hint=lang()==='ko'?TIPS_KO.bonus:lang()==='es'?TIPS_ES.bonus:TIPS.bonus;
 return `<div class="hsl-boost ${a.enabled?'is-on':''}" title="${e(hint)}"><label class="hsl-boost-toggle"><input type="checkbox" aria-label="${e(t(name))}" data-hsl-key="boosts.${id}.enabled" ${a.enabled?'checked':''}><span class="hsl-boosticon">${sk?iconFor(sk):'✦'}</span><span class="hsl-boostcopy"><strong class="hsl-boostname">${e(t(name))}</strong><small class="hsl-boostsummary">${e(summary)}</small></span></label>${id==='pulse'?'':`<button type="button" class="hsl-boost-edit" data-hsl-open="boost:${id}" title="${e(t('Edit'))} ${e(t(name))}">${e(t('Edit'))}</button>`}</div>`;}).join('')}</div>`;}
function gearDialog(c,id){const v=c.state.slots[id],[,title]=SLOTS.find(x=>x[0]===id);let contents='';
 const ench=(side)=>`${textInput(`slots.${id}.${side}.name`,t(side==='prefix'?'Prefix':'Suffix')+' · '+t('Enchant name'),v[side].name)}<div class="hsl-two">${input(`slots.${id}.${side}.heal`,'Healing +',v[side].heal)}${input(`slots.${id}.${side}.magicAttack`,'Magic Attack',v[side].magicAttack)}</div>`;
 if(id==='wand'){
  const a=c.state,tiers=WAND_GRADES[a.wandType]||[],grade=gradeDetails(a);
  const wands=[['none','No Wand'],['tikka','Tikka Wood Healing Wand'],['nightbringer','Nightbringer Savior'],['soul','Soul Liberator Healing Wand']];
  contents+=`<div class="hsl-wand-controls">${select('wandType','Wand',a.wandType,wands)}`;
  if(tiers.length){const quality=tiers.map(row=>[row[0],`${t(row[0][0].toUpperCase()+row[0].slice(1))} (${row[1]}) · ${row[2]}–${row[3]}%`]);
   contents+=`<div class="hsl-two">${select('gradeTier','Grade',a.wandType==='soul'?'masterwork':a.gradeTier,quality)}${input('gradeOverride','Override %',a.gradeOverride,'0.1',`placeholder="${e(t('Default'))} +${fmt(grade.auto)}%"`)}</div>`;
   contents+=select('specialStep','Special Upgrade',a.specialStep,SPEC.map((pct,step)=>[step,`${step} · +${pct}%`]));}
  if(a.wandType!=='none')contents+=`<div class="hsl-erg"><strong>${e(t('Erg'))}</strong>${select('ergRank','',a.ergRank,[['B','B'],['A','A'],['S','S']])}${select('ergLevel','',a.ergLevel,Array.from({length:50},(_,i)=>[i+1,String(i+1)]))}${a.ergRank==='S'&&a.ergLevel>=41?input('ergPotencyOverride','Potency %',a.ergPotencyOverride,'0.1',`placeholder="${a.ergLevel===50?'20':'0'}"`):''}${tip('erg')}</div>`;
   if(a.ergRank==='S'&&Number(a.ergLevel)===50){contents+=`<div class="hsl-darkerg"><strong>${e(t('Dark Erg'))} ${tip('darkErg')}</strong><div class="hsl-two">${select('darkErgLevel','Dark Erg level',a.darkErgLevel,[['0','None'],...Array.from({length:50},(_,i)=>[i+1,String(i+1)])])}${a.darkErgLevel>0?input('darkErgPctOverride','Dark Erg potency %',a.darkErgPctOverride,'0.1',`placeholder="${fmt(a.darkErgLevel*.5)}"`):''}</div></div>`;}
  contents+='</div>';
  if(a.wandType==='none')return dialog(`${t('Edit')} · ${t(title)}`,contents,c);
  contents+=textInput(`slots.${id}.name`,'Item name',v.name);
 }else if(id==='offhand'){
  contents+=select('slots.offhand.type','Offhand type',v.type,[['none','None'],['shield','Shield'],['spellbook','Spellbook']]);
  if(v.type==='none')return dialog(`${t('Edit')} · ${t(title)}`,contents,c);
  contents+=`<div class="hsl-two">${select('slots.offhand.gradeTier','Grade',v.gradeTier,[['common','Common'],['sturdy','Sturdy'],['fine','Fine'],['exquisite','Exquisite'],['masterwork','Masterwork']])}${input('slots.offhand.gradePct','Grade bonus %',v.gradePct,'.1')}</div>${tip('offhand')}`;
  contents+=`<div class="hsl-two">${textInput(`slots.${id}.name`,'Item name',v.name)}${chk(`slots.${id}.enabled`,'On',v.enabled)}</div>`;
 }else contents+=`<div class="hsl-two">${textInput(`slots.${id}.name`,'Item name',v.name)}${chk(`slots.${id}.enabled`,'On',v.enabled)}</div>`;
 if(id!=='echo')contents+=`<h4>${e(t('Prefix'))} ${tip('enchant')}</h4>${ench('prefix')}<h4>${e(t('Suffix'))} ${tip('enchant')}</h4>${ench('suffix')}<h4>${e(t('Murias Water'))} ${tip('water')}</h4>${chk(`slots.${id}.murias.enabled`,'On',v.murias.enabled)}${v.murias.enabled?select(`slots.${id}.murias.pct`,'Potency %',v.murias.pct,Array.from({length:10},(_,i)=>[i+1,`${i+1}%`])):''}`;
 if(!['acc1','acc2','echo','wand'].includes(id))contents+=`<h4>${e(t('Healing set'))} ${tip('set')}</h4>${select(`slots.${id}.setPoints`,'Set points',v.setPoints,Array.from({length:11},(_,x)=>[x,`${x}/10`]))}`;
 if(id!=='offhand')contents+=`<h4>${e(t('Reforge'))} ${tip('reforge')}</h4>${v.reforges.map((line,i)=>reforgeEditor(id,v,line,i)).join('')}`;
 contents+=`<details><summary>${e(t('Extra'))}</summary><div class="hsl-three">${input(`slots.${id}.healFlat`,'Healing +',v.healFlat,'.1')}${input(`slots.${id}.partyFlat`,'Party +',v.partyFlat,'.1')}${input(`slots.${id}.sharedPct`,'Potency %',v.sharedPct,'.1')}</div></details>`;
 return dialog(`${t('Edit')} · ${t(title)}`,contents,c);
}
function boostDialog(c,id){const [,name]=BOOSTS.find(x=>x[0]===id),v=c.state.boosts[id];
 if(id==='amulet')return dialog(`${t('Edit')} · ${t('Amulet')}`,`${chk('boosts.amulet.enabled','On',v.enabled)}${select('boosts.amulet.heal','Healing +',v.heal,Array.from({length:13},(_,i)=>[i,String(i)]))}`,c);
 if(id==='spirit')return spiritDialog(c);
 if(id==='relics')return relicDialog(c);
 return dialog(`${t('Edit')} · ${t(name)}`,`${chk(`boosts.${id}.enabled`,'On',v.enabled)}<div class="hsl-three">${input(`boosts.${id}.heal`,'Healing +',v.heal,'.1')}${input(`boosts.${id}.party`,'Party +',v.party,'.1')}${input(`boosts.${id}.pct`,'Potency %',v.pct,'.1')}${input(`boosts.${id}.dProt`,'Protection',v.dProt,'.01')}${input(`boosts.${id}.dDef`,'Defense',v.dDef,'.01')}</div>`,c);
}
function spiritDialog(c){const s=c.state.spirit,a=c.state.boosts.spirit;
 const level=(tree,key,name,max=5)=>`<div class="hsl-augment"><strong>${e(t(name))}</strong>${select(`spirit.${tree}.${key}`,'Level',s[tree][key],Array.from({length:max+1},(_,n)=>[n,`${n}/${max}`]))}</div>`;
 const attack=[['training','Spirit Training'],['attunement','Spirit Attunement'],['control','Spirit Control'],['ultimate','Spirit Unleashing',1]];
 const exclusive=[['manaFlow','Healing Wand: Mana Flow'],['criticalCare','Healing Wand: Critical Care'],['luckyBlessing','Healing Wand: Lucky Blessing'],['focusedHealing','Healing Wand: Focused Healing'],['ultimate','Ultimate Healing Wand',1]];
 const awakening=[['recovery','Awakening Recovery Enhancement'],['range','Awakening Range Enhancement'],['duration','Awakening Duration Enhancement'],['buff','Awakening Buff Enhancement'],['acceleration','Awakening Acceleration',1]];
 const group=(label,tree,items)=>`<section class="hsl-augmentgroup"><h4>${e(t(label))}</h4><div>${items.map(x=>level(tree,...x)).join('')}</div></section>`;
 const html=`<div class="hsl-two">${chk('boosts.spirit.enabled','On',a.enabled)}${chk('spirit.awakeningActive','Spirit Healing Wand Awakening active',s.awakeningActive)}</div><div class="hsl-three">${input('spirit.baseMP','Base MP',s.baseMP)}<div class="hsl-spirit-metric"><small>${e(t('Awakening bonus'))}</small><strong>+${s.awakeningActive?10+3*s.awakening.buff:0}%</strong></div></div><div class="hsl-spirit-cols">${group('Attack','attack',attack)}${group('Exclusive','exclusive',exclusive)}${group('Awakening','awakening',awakening)}</div>`;
 return dialog(`${t('Edit')} · ${t('Spirit Weapon')}`,html,c);
}
function relicDialog(c){const icons={'echoes':'Echoes of Salvation','pulse':'Pulse of Purification','pall':'Pall of Ruination'};
 const restore=(r)=>r.skill==='echoes'?`${r.level}% ${t('Party Healing')}`:`+${fmt(r.level*.5)} ${t('Seconds')}`;
 const side=(i,k,r)=>`<div class="hsl-relicaffix"><h4>${e(t(k==='prefix'?'Prefix enchant':'Suffix enchant'))}</h4>${select(`relics.${i}.${k}.selection`,'Enchant name',r[k].selection,[['none','None'],...RELIC_ENCHANTS[k].map(v=>[v,v]),['custom','Custom value']])}${r[k].selection==='custom'?`${textInput(`relics.${i}.${k}.name`,'Item name',r[k].name)}<div class="hsl-three">${input(`relics.${i}.${k}.heal`,'Healing +',r[k].heal)}${input(`relics.${i}.${k}.magicAttack`,'Magic Attack',r[k].magicAttack)}</div>`:''}${k==='suffix'&&r[k].selection==='Gift'?`<small>${e(t('Potency'))} +5%</small>`:''}</div>`;
 const html=`${chk('boosts.relics.enabled','On',c.state.boosts.relics.enabled)}${c.state.relics.map((r,i)=>`<section class="hsl-relic-slot"><div class="hsl-relic-head">${iconFor(icons[r.skill])}<strong>${e(t(icons[r.skill]))}</strong>${chk(`relics.${i}.enabled`,'On',r.enabled)}</div><div class="hsl-two">${select(`relics.${i}.level`,'Restored effect',r.level,Array.from({length:11},(_,n)=>[n,n===0?'None':`Lv ${n}`]))}<div class="hsl-spirit-metric"><small>${e(t('Relic effect'))}</small><strong>${e(restore(r))}</strong></div></div>${side(i,'prefix',r)}${side(i,'suffix',r)}</section>`).join('')}`;
 return dialog(`${t('Edit')} · ${t('Relics')}`,html,c);
}
function dialog(heading,contents,c){return `<div class="hsl-modal" id="hsl-modal"><section class="hsl-editor" role="dialog" aria-modal="true" aria-label="${e(heading)}"><header class="hsl-editor-head"><div><strong>${e(heading)}</strong><small>${e(t('Healing'))} ${fmt(c.healing[1])} · ${e(t('Party Healing'))} ${fmt(c.party[1])}</small></div><button data-hsl-close aria-label="${e(t('Close'))}">×</button></header><div class="hsl-editor-scroll">${contents}</div><footer><button data-hsl-close class="primary">${e(t('Save'))}</button></footer></section></div>`;}
let activeEditor=null;
function view(raw){const c=calc(raw),a=c.state;
 const output=a.output==='dissonance'?'dissonance':'healing';
 const k=(name,attr,selected)=>`<button data-hsl-output="${attr}" class="${selected?'primary':''}" aria-pressed="${selected}">${e(t(name))}</button>`;
 let badge=output==='healing'?`${infoPair('Healing Recovery',c.healing,iconFor('Healing'))}${infoPair('Party Healing Recovery',c.party,iconFor('Party Healing'))}`:`<div class="hsl-metric"><small>${e(t('Protection'))} · ${e(t('Per stack'))}</small><strong>${fmt(c.protEach)}</strong><small>${e(t('Total'))} ${fmt(c.protTotal)}</small></div><div class="hsl-metric"><small>${e(t('Defense'))} · ${e(t('Per stack'))}</small><strong>${fmt(c.defEach)}</strong><small>${e(t('Total'))} ${fmt(c.defTotal)}</small></div>`;
 const boostSection=`<section class="card hsl-card"><div class="hsl-section-title"><h3>${e(t('Boosts'))}</h3>${tip('bonus')}</div>${boostBoard(c)}</section>`;
 const bp=DEBUFFS.map((d,i)=>`<div class="hsl-debuff-row">${chk(`debuffs.${i}.on`,d[0],a.debuffs[i].on)}${input(`debuffs.${i}.phys`,'Physical',a.debuffs[i].phys,'.1')}${input(`debuffs.${i}.mag`,'Magical',a.debuffs[i].mag,'.1')}</div>`).join('');
 return `<div id="hsl" class="hsl-lab"><div class="hsl-topsticky"><div class="hsl-head"><h2>${iconFor('Resonant Litany')} ${e(t('Resonant Litany'))}</h2><div class="hsl-head-actions"><div class="hsl-switch">${k('Recovery','healing',output==='healing')}${k('Dissonance','dissonance',output==='dissonance')}</div><button type="button" class="hsl-top-reset" data-hsl-reset>↺ ${e(t('Reset'))}</button></div></div><div class="hsl-resultbar">${badge}${output==='dissonance'?`<label class="hsl-stack"><span>${e(t('Stacks'))}</span><select data-hsl-key="stacks">${opts(Array.from({length:5},(_,i)=>[i+1,String(i+1)]),a.stacks)}</select></label>`:''}</div></div>
 <section class="card hsl-card"><div class="hsl-section-title"><h3>${e(t('Equipment'))}</h3><span>${e(t('Healing set'))} ${Math.min(10,c.setPts)}/10 ${c.setActive?'✓':''} ${tip('set')}</span></div>${equipBoard(c)}</section>
 ${boostSection}<details class="card hsl-card hsl-settings" ${disclosures.recovery?'open':''}><summary>${e(t('Base recovery'))} ${tip('base')}</summary><div class="hsl-two">${input('healingMin','Healing · Minimum',a.healingMin)}${input('healingMax','Healing · Maximum',a.healingMax)}${input('partyMin','Party Healing · Minimum',a.partyMin)}${input('partyMax','Party Healing · Maximum',a.partyMax)}</div></details>
 <details class="card hsl-card hsl-settings" ${disclosures.calc?'open':''}><summary>${e(t('Dissonance'))} · ${e(t('Settings'))} ${tip('calibrate')}</summary><div class="hsl-two">${select('mode','Calculation',a.mode,[['manual','Manual'],['ratio','Estimate']])}${input('protPerStack','One-stack protection',a.protPerStack,'.001')}${input('defPerStack','One-stack defense',a.defPerStack,'.001')}${a.mode==='ratio'?`${input('anchorHeal','Anchor Healing',a.anchorHeal,'.1')}${input('anchorParty','Anchor Party Healing',a.anchorParty,'.1')}`:''}</div></details>
 <details class="card hsl-card hsl-settings" ${disclosures.breaks?'open':''}><summary>${e(t('Midir breakpoints'))}</summary><div class="hsl-two">${input('basePhys','Physical protection',a.basePhys)}${input('baseMag','Magical protection',a.baseMag)}${input('uppercutPct','Uppercut',a.uppercutPct,'.1')}${input('hydraPct','Hydra',a.hydraPct,'.1')}</div><div class="hsl-debuffs">${bp}</div><div class="hsl-breakpoints"><span>${e(t('Physical'))}: ${c.p0??'—'}% → ${c.p1??'—'}% · ${e(t('DPS change'))} ${c.pgain===null?'—':fmt(c.pgain*100)+'%'}</span><span>${e(t('Magical'))}: ${c.m0??'—'}% → ${c.m1??'—'}% · ${e(t('DPS change'))} ${c.mgain===null?'—':fmt(c.mgain*100)+'%'}</span></div></details>
 <footer class="hsl-footer"><span>${e(t('Disclaimer'))}: ${e(lang()==='ko'?TIPS_KO.source:lang()==='es'?TIPS_ES.source:TIPS.source)}</span><a href="https://itsmabi.com/heal-calculator" target="_blank" rel="noopener noreferrer">${e(t('Source'))}: ${e(lang()==='ko'?'잇츠 마비노기 힐링 계산기':lang()==='es'?'Calculadora de curación de It’s Mabinogi':"It's Mabinogi Healing Calculator")}</a></footer>
 ${activeEditor?(activeEditor.startsWith('slot:')?gearDialog(c,activeEditor.slice(5)):boostDialog(c,activeEditor.slice(6))):''}</div>`;
}
const disclosures={recovery:false,calc:false,breaks:false};let handlers=null;
function init(config){handlers=config;if(document.__midirLitanyBound)return;document.__midirLitanyBound=true;
 const update=(fn,origin)=>{const dialog=document.querySelector('#hsl-modal .hsl-editor-scroll');const top=dialog?.scrollTop??0;const oldX=window.scrollX,oldY=window.scrollY;
  const focusKey=origin?.dataset?.hslKey,sel=origin?.selectionStart,end=origin?.selectionEnd;
  const a=hydrate(handlers.get());fn(a);handlers.update(a);
  const newer=document.querySelector('#hsl-modal .hsl-editor-scroll');if(newer)newer.scrollTop=top;
  if(focusKey){const next=Array.from(document.querySelectorAll('[data-hsl-key]')).find(el=>el.dataset.hslKey===focusKey);
   if(next){try{next.focus({preventScroll:true});if(typeof sel==='number'&&next.setSelectionRange)next.setSelectionRange(sel,end);}catch{}}}
  window.scrollTo(oldX,oldY);
 };
 document.addEventListener('change',event=>{const node=event.target;if(!node?.matches?.('[data-hsl-key]')||!node.closest('#hsl'))return;
  const path=node.dataset.hslKey.split('.');update(a=>{let curr=a;for(let i=0;i<path.length-1;i++){const k=path[i];if(!curr[k]||typeof curr[k]!=='object')curr[k]={};curr=curr[k];}
   const value=node.type==='checkbox'?node.checked:node.type==='number'?(node.value===''?'':Number(node.value)):node.value;
   curr[path.at(-1)]=node.type==='number'&&gearNumericKey(node.dataset.hslKey)&&value!==''?whole(value):value;
   if(path.join('.')==='wandType'){a.gradeTier='masterwork';a.gradeOverride='';a.slots.wand.enabled=a.wandType!=='none';a.darkErgLevel=0;a.darkErgPctOverride='';}if(path.join('.')==='gradeTier')a.gradeOverride='';if(path.join('.')==='ergRank'||path.join('.')==='ergLevel'){if(a.ergRank!=='S'||Number(a.ergLevel)!==50){a.darkErgLevel=0;a.darkErgPctOverride='';}}if(path.join('.')==='slots.offhand.type')a.slots.offhand.enabled=a.slots.offhand.type!=='none';
   if(path.at(-1)==='key'&&path.includes('reforges')){const line=curr;line.level=0;line.value=0;}
  },node);
 });
 document.addEventListener('click',event=>{const el=event.target.closest?.('[data-hsl-open],[data-hsl-close],[data-hsl-output],[data-hsl-reset]');if(!el||!el.closest('#hsl'))return;
  if(el.hasAttribute('data-hsl-open')){activeEditor=el.dataset.hslOpen;update(()=>{},null);}
  else if(el.hasAttribute('data-hsl-close')){activeEditor=null;update(()=>{},null);}
  else if(el.hasAttribute('data-hsl-output'))update(a=>{a.output=el.dataset.hslOutput;},null);
  else if(el.hasAttribute('data-hsl-reset')){activeEditor=null;update(a=>Object.assign(a,initial()),null);}
 });
 document.addEventListener('toggle',event=>{const v=event.target;if(!v.closest?.('#hsl'))return;
  if(v.classList.contains('hsl-settings')){const all=Array.from(document.querySelectorAll('#hsl details.hsl-settings'));const index=all.indexOf(v);if(index===0)disclosures.recovery=v.open;else if(index===1)disclosures.calc=v.open;else if(index===2)disclosures.breaks=v.open;}
 },true);
}
window.MIDIR_HS_LITANY={initial,hydrate,calc,view,init};
})();
