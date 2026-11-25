/* Midir Companion Ogham rune tracker 0.3.12p. Independent owned-rune tracker and practice-only rerolls.
   Sources: Nexon 2026-11-12 Arcana Part 1, KR 2026-08-13 Ogham Part 2,
   https://prilus.gitlab.io/en/ogham and accompanying 2026-11-24 handoff.
   Stable rune IDs deliberately do not depend on localized skill names. */
(()=>{'use strict';
const SPECIAL=['Beithe','Fearn','Nin','Luis','Sail'];
const REGULAR=['Ailm','Cert','Coll','Dair','Ebhadh','Edad','Emancholl','Gort','Gétal','Idad','Iphin','Muin','Onn','Peithe','Ruis','Straiph','Tinne','Uilleand','Óir','Úath','Úr'];
const WORDS=[...SPECIAL,...REGULAR];
const ARCANA=[['ek','Elemental Knight','엘레멘탈 나이트'],['hs','Harmonic Saint','세인트 바드'],['dd','Dark Diviner','다크 메이지'],['as','Alchemic Sharpshooter','알케믹 스팅어'],['sg','Sacred Guardian','세이크리드 가디언'],['ev','Explosive Vanguard','블래스트 랜서'],['ag','Arsenal Gunner','배리어블 거너'],['fa','Forbidden Alchemist','포비든 알케미스트'],['mp','Melodic Puppeteer','멜로딕 퍼피티어'],['bb','Blazing Brawler','블레이징 브롤러']];
// 0-1: already released in NA; 2: Korean live / planned NA December 2026.
const RECIPES=[
['ek','Dynavolt Smash: Thunderblade',['Beithe','Coll','Cert'],''],['ek','Blazing Assault Slash: Full Combustion',['Nin','Ruis','Úr'],''],['ek','Line Break: Sword Dance',['Luis','Tinne','Peithe'],'라인 브레이크: 검무'],
['hs','Pulse of Purification: Resonance',['Sail','Óir','Peithe'],''],['hs','Resonant Litany: Earsplitter',['Nin','Tinne','Muin'],''],['hs','Revival Hymn: Chorus',['Fearn','Coll','Uilleand'],'소생의 찬가: 제창'],
['dd','Polar Vortex: Hoarfrost',['Beithe','Straiph','Uilleand'],''],['dd','Shadow Flare: Purgation',['Luis','Úath','Onn'],''],['dd','Latent Ignition: Intensification',['Sail','Gort','Emancholl'],'레이턴트 이그니션: 격화'],
['as','Tri-Assault: Concurrence',['Fearn','Idad','Ebhadh'],''],['as','Aqua Volley: Torrent',['Sail','Dair','Edad'],''],['as','Flame Burst: Eruption',['Nin','Cert','Emancholl'],'플레임 버스트: 분출'],
['sg','Zealous Conviction: Enforcer',['Luis','Tinne','Onn'],''],['sg','Rend Armor: Bulwark',['Sail','Gort','Idad'],''],['sg','Judgment Strike: Flurry',['Beithe','Gétal','Iphin'],'심판의 일격: 난격'],
['ev','Drill Charge: Whirlwind',['Nin','Dair','Peithe'],''],['ev','Dreadnought Burst: Detonator',['Beithe','Edad','Ebhadh'],''],['ev','Impact Crush: Overheat',['Luis','Ruis','Ailm'],'임팩트 크러시: 과열'],
['ag','Heavy Artillery: Bombardment',['Fearn','Gort','Óir'],''],['ag','Detonation: Lock On',['Beithe','Úath','Iphin'],''],['ag','Fatal Scope: Rapid Fire',['Sail','Muin','Idad'],'페이탈 스코프: 연사'],
['fa','Fangs of Stone: Compression',['Sail','Ailm','Ebhadh'],''],['fa','Chemical Carnival: Backdraft',['Luis','Coll','Úr'],''],['fa','Elemental Combination: Embodiment',['Fearn','Ruis','Onn'],'엘레멘탈 콤비네이션: 체화'],
['mp','Cutting Chorus: Crescendo',['Luis','Gétal','Straiph'],''],['mp','Downbeat Drop: Ensemble',['Fearn','Muin','Iphin'],''],['mp','Wire Web: Snare',['Nin','Dair','Úr'],'와이어 웹: 덫'],
['bb','Piercing Gale: Charge',['Nin','Ailm','Emancholl'],''],['bb','Radiant Storm: Pinnacle',['Fearn','Cert','Uilleand'],''],['bb','Force Flare: Capture',['Beithe','Úath','Straiph'],'포스 플레어: 포획']
].map(([arcana,en,words,ko],i)=>({id:arcana+'-'+(i%3+1),arcana,en,ko,words,upcoming:i%3===2}));
const ATTR=[
{id:'heal',en:'Healing Max HP Recovery',ko:'힐링 최대 생명력 회복량',es:'Recuperación máxima de Curación',max:10,unit:''},
{id:'partyHeal',en:'Party Healing Max HP Recovery',ko:'파티 힐링 최대 생명력 회복량',es:'Recuperación máxima de Curación grupal',max:10,unit:''},
{id:'magic',en:'Magic Attack',ko:'마법 공격력',es:'Ataque mágico',max:10,unit:''},
{id:'act2',en:'Act 2: Threshold Cutter Damage',ko:'액트 2 대미지',es:'Daño de Act 2',max:20,unit:'%'},
{id:'act1',en:'Act 1: Inciting Incident Damage',ko:'액트 1 대미지',es:'Daño de Act 1',max:15,unit:'%'},
{id:'act4',en:'Act 4: Rising Action Damage',ko:'액트 4 대미지',es:'Daño de Act 4',max:10,unit:'%'},
{id:'act7',en:'Act 7: Climactic Crash Damage',ko:'액트 7 대미지',es:'Daño de Act 7',max:10,unit:'%'},
{id:'magnum',en:'Magnum Shot Damage',ko:'매그넘 샷 대미지',es:'Daño de Disparo magnum',max:20,unit:'%'},
{id:'crash',en:'Crash Shot Fragment Damage',ko:'크래시 샷 파편 대미지',es:'Daño de fragmentos de Crash Shot',max:20,unit:'%'},
{id:'litany',en:'Resonant Litany Damage',ko:'레조넌트 리타니 대미지',es:'Daño de Letanía resonante',max:7,unit:'%',special:'hs'},
{id:'echoes',en:'Echoes of Salvation Damage',ko:'구원의 메아리 대미지',es:'Daño de Ecos de salvación',max:400,unit:'%',special:'hs'},
{id:'pulse',en:'Pulse of Purification Damage',ko:'정화의 파동 대미지',es:'Daño de Pulso de purificación',max:1000,unit:'',special:'hs'},
{id:'downbeat',en:'Downbeat Drop Damage',ko:'다운비트 드롭 대미지',es:'Daño de Downbeat Drop',max:250,unit:'%',special:'mp'},
{id:'tempo',en:'Relentless Tempo Damage',ko:'릴렌트리스 템포 대미지',es:'Daño de Relentless Tempo',max:50,unit:'%',special:'mp'},
{id:'showstopper',en:'Showstopper Marionette Additional Damage',ko:'쇼스토퍼 마리오네트 추가 대미지',es:'Daño extra de Showstopper',max:300,unit:'%',special:'mp'},
{id:'livewire',en:'Live Wire Damage',ko:'라이브 와이어 대미지',es:'Daño de Live Wire',max:500,unit:'%',special:'mp'},
{id:'aqua',en:'Aqua Volley Max Damage',ko:'아쿠아 발리 최대 대미지',es:'Daño máximo de Aqua Volley',max:150,unit:'%',special:'as'},
{id:'ignis',en:'Ignis Plume Damage',ko:'이그니스 플룸 대미지',es:'Daño de Ignis Plume',max:50,unit:'%',special:'as'}
];
// Source: Prilus src/components/oghamReset.logic.ts and official NA patch notes.
// Gold is the in-game lock-based amount. Herb recipes are Companion-only practice costs.
const COSTS={
 // Zero locks costs gold only, regardless of grade. Herbs are a Companion-only
 // practice surcharge for locking one or two effect lines.
 fine:[{gold:5000,herbs:{}}],
 exquisite:[{gold:5000,herbs:{}},{gold:10000,herbs:{base:3,mana:1,bloody:1}}],
 masterwork:[{gold:5000,herbs:{}},{gold:10000,herbs:{base:4,mana:2,bloody:1,sunlight:1}},{gold:20000,herbs:{base:5,mana:2,bloody:2,golden:1}}]
};
const PRACTICE_HERBS=['base','mana','bloody','sunlight','golden'];
const herbCost=(grade,locks)=>COSTS[grade]?.[locks]||null;

const L={en:{title:'Ogham Rune Inventory',inventory:'Owned runes',newRune:'Add rune',empty:'No runes saved yet.',arcana:'Arcana',awakening:'Awakening level',grade:'Grade',word:'Rune word',fine:'Fine',exquisite:'Exquisite',masterwork:'Masterwork',name:'Nickname',notes:'Notes',save:'Save',cancel:'Cancel',remove:'Remove',edit:'Edit',slot:'Slot',equip:'Equip',unequip:'Unequip',loadout:'Equipped runes',combinations:'Combinations',recommend:'Recommended equip',missing:'Missing',active:'Active',upcoming:'Upcoming in NA',locked:'Unlocks at awakening',notEnough:'Not active',points:'points',effects:'Attribute lines',effect:'Effect',level:'Level',none:'None',inventoryNote:'Stored runes are never modified by simulated rerolls.',sim:'Ogham · Rerolls',practice:"Companion practice · gold and herbs spent from the Storage Chest; herbs are not the real game materials",roll:'Reroll',reset:'Start over',lock:'Lock',attempts:'Rerolls',gold:'Gold',fragments:"Herbs",smolder:'Smoldering thread',frost:'Frostflame thread',source:'Source',suggestion:'Suggested setup',owned:'Owned',select:'Select a rune',search:'Find rune',region:'Planning: includes December synergies',pools:"Starter effects only — not full Prilus odds unless verified data is loaded",all:'All',reforges:'Reforges',echostones:'Echostones',mode:'Simulator mode',noUnlocked:'No unlocked lines',pointsNote:'Only the three required words contribute points. Special key must be Masterwork.',herbBalance:"Chest herbs",goldBalance:"Chest gold",insufficient:"Not enough gold or herbs in the Storage Chest",blocked:"Insufficient resources — no roll charged",catalogLoad:"Import verified effects JSON",catalogReady:"Source data loaded",catalogMissing:"Full effect table is not bundled; current sample pool is incomplete",cost:"Next roll",spending:"Spent",sourceMode:"Effect data",badCatalog:"Unsupported catalog JSON",levelsDerived:"97 official effects · individual tiers reconstructed from published endpoints",rerollFree:"Start over is free; it creates a fresh set of effects",official:"Game costs: gold; Companion substitutes herbs for fragments/threads."},
ko:{title:'오검 룬 보관함',inventory:'보유 오검',newRune:'오검 추가',empty:'등록한 오검이 없습니다.',arcana:'아르카나',awakening:'각성 레벨',grade:'등급',word:'오검 문자',fine:'고급',exquisite:'최고급',masterwork:'마스터피스',name:'별명',notes:'메모',save:'저장',cancel:'취소',remove:'삭제',edit:'편집',slot:'슬롯',equip:'장착',unequip:'해제',loadout:'장착 오검',combinations:'조합',recommend:'추천 장착',missing:'부족',active:'활성',upcoming:'북미 출시 예정',locked:'각성 레벨 필요',notEnough:'비활성',points:'포인트',effects:'효과 옵션',effect:'효과',level:'레벨',none:'없음',inventoryNote:'모의 재설정은 보유 오검을 변경하지 않습니다.',sim:'오검 · 효과 재설정',practice:"컴패니언 체험 · 보관함의 골드와 허브를 소모합니다. 실제 게임 재료와 다릅니다",roll:'재설정',reset:'처음부터',lock:'잠금',attempts:'재설정 횟수',gold:'골드',fragments:"허브",smolder:'타오르는 실',frost:'서리불꽃 실',source:'출처',suggestion:'추천 구성',owned:'보유',select:'오검 선택',search:'오검 검색',region:'미출시 조합 포함',pools:"기본 효과 목록 · 검증된 데이터를 불러오기 전까지 실제 확률이 아닙니다",all:'전체',reforges:'세공',echostones:'에코스톤',mode:'시뮬레이터 종류',noUnlocked:'잠금 해제된 옵션 없음',pointsNote:'조합에 필요한 세 문자만 점수에 포함됩니다. 열쇠 문자는 마스터피스여야 합니다.',herbBalance:"보관함 허브",goldBalance:"보관함 골드",insufficient:"보관함 골드 또는 허브가 부족합니다",blocked:"재료가 부족하여 재설정하지 않았습니다",catalogLoad:"검증된 효과 JSON 불러오기",catalogReady:"효과 데이터 로드됨",catalogMissing:"전체 효과 데이터가 포함되지 않았습니다",cost:"다음 재설정",spending:"사용량",sourceMode:"효과 데이터",badCatalog:"지원하지 않는 효과 데이터입니다",levelsDerived:"공식 효과 97종 · 중간 레벨 수치는 공개된 최솟값·최댓값으로 계산",rerollFree:"처음부터는 무료로 새로운 효과를 부여합니다",official:"실제 게임은 골드와 전용 재료를 사용하며 이 체험에서는 허브로 대체합니다."},
es:{title:'Inventario de runas Ogham',inventory:'Runas propias',newRune:'Añadir runa',empty:'Todavía no hay runas guardadas.',arcana:'Arcana',awakening:'Nivel de despertar',grade:'Calidad',word:'Palabra rúnica',fine:'Fina',exquisite:'Exquisita',masterwork:'Obra maestra',name:'Apodo',notes:'Notas',save:'Guardar',cancel:'Cancelar',remove:'Quitar',edit:'Editar',slot:'Ranura',equip:'Equipar',unequip:'Desequipar',loadout:'Runas equipadas',combinations:'Combinaciones',recommend:'Equipo recomendado',missing:'Faltan',active:'Activo',upcoming:'Próximamente en NA',locked:'Requiere despertar',notEnough:'Sin activar',points:'puntos',effects:'Líneas de atributo',effect:'Efecto',level:'Nivel',none:'Ninguna',inventoryNote:'Las tiradas simuladas nunca alteran las runas propias.',sim:'Ogham · Repeticiones',practice:"Práctica de Companion · el oro y las hierbas se gastan del cofre; no son materiales reales del juego",roll:'Volver a tirar',reset:'Empezar de nuevo',lock:'Bloquear',attempts:'Tiradas',gold:'Oro',fragments:"Hierbas",smolder:'Hilo ardiente',frost:'Hilo helado',source:'Fuente',suggestion:'Equipo sugerido',owned:'Propias',select:'Elegir una runa',search:'Buscar runa',region:'Incluye próximas combinaciones de diciembre',pools:"Efectos iniciales; no son las probabilidades completas de Prilus sin importar datos verificados",all:'Todas',reforges:'Reforjas',echostones:'Ecopiedras',mode:'Modo de simulador',noUnlocked:'No hay líneas desbloqueadas',pointsNote:'Solo puntúan las tres palabras necesarias. La clave debe ser Obra maestra.',herbBalance:"Hierbas del cofre",goldBalance:"Oro del cofre",insufficient:"No hay suficiente oro o hierbas en el cofre",blocked:"Recursos insuficientes: sin tirada ni cargos",catalogLoad:"Importar efectos JSON verificados",catalogReady:"Datos de efectos cargados",catalogMissing:"La tabla completa no está incluida",cost:"Próxima tirada",spending:"Gastado",sourceMode:"Datos de efectos",badCatalog:"JSON de efectos incompatible",levelsDerived:"97 efectos oficiales · niveles intermedios calculados desde los límites publicados",rerollFree:"Empezar de nuevo es gratis y genera otros efectos",official:"El juego usa oro y materiales propios; Companion emplea hierbas en su lugar."}};
const GRADE=['fine','exquisite','masterwork'];
const GRADES={fine:1,exquisite:2,masterwork:3};
Object.assign(L.en,{pickWord:'Choose a rune',pickHint:'Select an Ogham stone to configure its grade and attributes.',specialWords:'Special runes',regularWords:'Regular runes',changeWord:'Change rune',pickBack:'Back',gameReferenced:'Game reference',fallbackGlyph:'Ogham letter',emptySocket:'Empty socket',tapToEquip:'Tap a socket to equip',tapInstruction:'Tap a rune, then a socket · Drag on desktop',selectedRune:'Selected rune',tapAgainUnequip:'Tap this socket again to unequip',socketDetails:'Rune details'});
Object.assign(L.ko,{pickWord:'오검 선택',pickHint:'오검 문자를 선택한 후 등급과 효과를 설정하세요.',specialWords:'특수 오검',regularWords:'일반 오검',changeWord:'오검 변경',pickBack:'뒤로',gameReferenced:'게임 이미지 참조',fallbackGlyph:'오검 문자',emptySocket:'빈 장착 슬롯',tapToEquip:'슬롯을 눌러 장착',tapInstruction:'오검 선택 후 슬롯 터치 · PC에서는 드래그',selectedRune:'선택한 오검',tapAgainUnequip:'같은 슬롯을 다시 누르면 장착 해제',socketDetails:'오검 상세'});
Object.assign(L.es,{pickWord:'Elegir runa',pickHint:'Elige una piedra Ogham y configura su calidad y efectos.',specialWords:'Runas especiales',regularWords:'Runas normales',changeWord:'Cambiar runa',pickBack:'Volver',gameReferenced:'Referencia del juego',fallbackGlyph:'Letra Ogham',emptySocket:'Ranura vacía',tapToEquip:'Toca una ranura para equipar',tapInstruction:'Toca una runa y después una ranura · Arrastra en escritorio',selectedRune:'Runa seleccionada',tapAgainUnequip:'Toca esta ranura otra vez para desequipar',socketDetails:'Detalles de la runa'});
// Inventory organization is separate from rune identity, effects and equipment.
Object.assign(L.en,{favorite:'Favorite',unfavorite:'Remove favorite',sortBy:'Sort inventory',sortManual:'Custom order',sortFavorites:'Favorites first',sortGrade:'Grade (highest first)',sortName:'Rune name (A–Z)',sortGroup:'Group',sortRecent:'Recently added',group:'Group label',groupExample:'e.g. Boss burst, Healing',searchHint:'Find name, notes, group or effect (e.g. Magnum)',matches:'matching',searchKept:'Matches first · all runes remain visible',moveUp:'Move earlier',moveDown:'Move later',matchedEffect:'Matching effect',searchReorder:'Clear search to rearrange custom order'});
Object.assign(L.ko,{favorite:'즐겨찾기',unfavorite:'즐겨찾기 해제',sortBy:'정렬',sortManual:'사용자 지정 순서',sortFavorites:'즐겨찾기 우선',sortGrade:'등급 높은 순',sortName:'룬 이름순',sortGroup:'그룹순',sortRecent:'최근 추가순',group:'그룹 표시',groupExample:'예: 보스, 힐링',searchHint:'이름, 메모, 그룹, 효과 검색 (예: 매그넘)',matches:'개 일치',searchKept:'일치하는 룬 우선 · 모두 표시',moveUp:'앞으로 이동',moveDown:'뒤로 이동',matchedEffect:'일치하는 효과',searchReorder:'순서 변경 전 검색 초기화'});
Object.assign(L.es,{favorite:'Favorita',unfavorite:'Quitar favorito',sortBy:'Ordenar inventario',sortManual:'Orden personalizado',sortFavorites:'Favoritas primero',sortGrade:'Calidad (mayor primero)',sortName:'Nombre de runa (A–Z)',sortGroup:'Grupo',sortRecent:'Más recientes',group:'Grupo visible',groupExample:'p. ej. Jefes, Curación',searchHint:'Nombre, notas, grupo o efecto (p. ej. Magnum)',matches:'coincidencias',searchKept:'Coincidencias arriba · todas las runas siguen visibles',moveUp:'Mover antes',moveDown:'Mover después',matchedEffect:'Efecto coincidente',searchReorder:'Borra la búsqueda para reordenar'});
Object.assign(L.en,{newGroup:'New group',groupEmpty:'Drop runes here · or select a rune then tap this group',groupContents:'runes',groupOptionalName:'Optional group label',groupRename:'Double-click or double-tap the outline to name',groupRemove:'Remove group; keep runes',groupSelected:'Group selected',groupCreateHint:'Drop a rune onto another to group them · Drop at an edge to reorder',groupDrag:'Drag group',groupPosition:'Move group',groupBefore:'Move earlier',groupAfter:'Move later',levelBonus:'Bonus',customEffect:'Other effect (optional)',editorMinimal:'Rune word, grade and attribute lines',groupAddSelected:'Place selected rune here',noEffectBonus:'Select an effect to see its bonus'});
Object.assign(L.ko,{newGroup:'새 그룹',groupEmpty:'룬을 여기에 놓거나 선택한 룬을 그룹에 추가하세요',groupContents:'개',groupOptionalName:'그룹 이름 (선택)',groupRename:'윤곽선을 두 번 눌러 이름 지정',groupRemove:'그룹만 삭제 · 룬 유지',groupSelected:'선택된 그룹',groupCreateHint:'룬을 다른 룬 중앙에 놓으면 그룹 · 가장자리는 정렬',groupDrag:'그룹 드래그',groupPosition:'그룹 이동',groupBefore:'앞으로 이동',groupAfter:'뒤로 이동',levelBonus:'보너스',customEffect:'기타 효과 (선택)',editorMinimal:'룬 문자, 등급 및 옵션',groupAddSelected:'선택된 룬을 여기에 넣기',noEffectBonus:'효과를 선택하면 보너스가 표시됩니다'});
Object.assign(L.es,{newGroup:'Nuevo grupo',groupEmpty:'Suelta runas aquí o selecciona una y toca el grupo',groupContents:'runas',groupOptionalName:'Nombre del grupo (opcional)',groupRename:'Doble clic o doble toque en el borde para nombrar',groupRemove:'Eliminar grupo sin borrar runas',groupSelected:'Grupo seleccionado',groupCreateHint:'Suelta una runa sobre otra para agrupar · En el borde para reordenar',groupDrag:'Arrastrar grupo',groupPosition:'Mover grupo',groupBefore:'Mover antes',groupAfter:'Mover después',levelBonus:'Bonificación',customEffect:'Otro efecto (opcional)',editorMinimal:'Palabra, calidad y atributos',groupAddSelected:'Colocar aquí la runa seleccionada',noEffectBonus:'Selecciona un efecto para ver la bonificación'});
Object.assign(L.en,{itemType:'Item type',selectRuneWord:'Choose rune',simRollCost:'Cost per reroll'});
Object.assign(L.ko,{itemType:'아이템 종류',selectRuneWord:'룬 선택',simRollCost:'재설정 비용'});
Object.assign(L.es,{itemType:'Tipo de objeto',selectRuneWord:'Elegir runa',simRollCost:'Coste por tirada'});
Object.assign(L.en,{disassemble:'Disassemble',disassembleConfirm:'Confirm disassemble',disassembleWarning:'Disassemble the saved rune? Its slots will be cleared.',disassembled:'Rune disassembled. Resources returned:',disassembleRefund:'Disassemble refund',disassembleNone:'No spending to recover',rollToGetEffects:'Reroll to generate attributes',newSimRune:'New rune',simHistory:'Rune spending history',simNoLines:'Reroll first to generate effects.'});
Object.assign(L.ko,{disassemble:'분해',disassembleConfirm:'분해 확인',disassembleWarning:'저장된 오검을 분해하시겠습니까? 장착 슬롯에서 해제됩니다.',disassembled:'오검 분해 완료. 반환된 재화:',disassembleRefund:'분해 반환',disassembleNone:'반환할 소모 내역이 없습니다',rollToGetEffects:'효과를 부여하려면 재설정하세요',newSimRune:'새 오검',simHistory:'오검별 소모 내역',simNoLines:'먼저 재설정해 주세요.'});
Object.assign(L.es,{disassemble:'Desmontar',disassembleConfirm:'Confirmar desmontaje',disassembleWarning:'¿Desmontar esta runa guardada? Se quitará de sus ranuras.',disassembled:'Runa desmontada. Recursos recuperados:',disassembleRefund:'Reembolso al desmontar',disassembleNone:'Sin gastos que recuperar',rollToGetEffects:'Tira para obtener atributos',newSimRune:'Nueva runa',simHistory:'Gastos de esta runa',simNoLines:'Realiza primero una tirada.'});
Object.assign(L.en,{inventoryDragHint:'Drag a stone onto a center to group or onto an edge to reorder. On touch, swipe the label to scroll. Alt + Up/Down reorders in custom order.'});
Object.assign(L.ko,{inventoryDragHint:'룬을 중앙에 놓으면 그룹, 가장자리에 놓으면 순서 변경. 터치 화면에서는 이름 부분을 밀어 스크롤하세요. 사용자 지정 순서에서 Alt + 위/아래 키로 이동합니다.'});
Object.assign(L.es,{inventoryDragHint:'Arrastra una runa al centro para agrupar o al borde para reordenar. En pantallas táctiles, desliza el nombre para desplazarte. Alt + arriba/abajo cambia el orden personalizado.'});
const SORTS=['manual','favorites','grade','name','group','recent'];
// Read-only reporting and a per-Arcana alternate set; no combat formula modifications.
Object.assign(L.en,{compareShared:'shared runes',compareChanged:'changed slots',compareSame:'Shared',compareMoved:'Repositioned',compareReplaced:'Replaced',compareAdded:'Added',compareRemoved:'Removed',compareReset:'Reset B to equipped',compareNoChange:'No differences yet',compareSynergyChanged:'Synergy differences',compareSynergyNone:'No synergy differences',compareIncreases:'Increase',compareDecreases:'Decrease',compareSameEffect:'Unchanged',equippedTotals:'Equipped Effects',effectTotalsNote:'Totals of rune attribute lines only · not predicted damage or healing',equippedNone:'Equip runes to list their effects.',totalLines:'Attribute lines',differentEffects:'Unique effects',compareSets:'Compare 5-Rune Sets',compareNote:'Compare equipped Set A against an alternate Set B for this Arcana. Set B is saved but never equipped automatically.',setA:'Set A · Equipped',setB:'Set B · Alternate',setBEmpty:'Choose a rune',chooseCompare:'Choose rune for comparison slot',clearCompareSlot:'Empty this slot',copyCompare:'Copy equipped set to B',clearCompare:'Clear B',compareDifference:'B minus A',compareSkill:'Effect',compareEffects:'Effect totals by line',compareSynergy:'Synergies',compareNoSynergies:'No completed combinations',compareNoEffects:'No effects in either set',compareUnknown:'Unknown values are not included in totals',compareTier:'Grade score',compareReady:'Ready',compareLocked:'Incomplete',compareUpcoming:'Upcoming · planning',compareActive:'Active',compareFrom:'Select from either collection',compareDone:'Close',compareRemove:'Remove',compareTotal:'Combined bonus',compareSourceNote:'Each rune line stacks only with the same effect ID and unit; no synergy damage multiplier is inferred.'});
Object.assign(L.ko,{compareShared:'공통 룬',compareChanged:'변경된 슬롯',compareSame:'동일',compareMoved:'위치 변경',compareReplaced:'교체됨',compareAdded:'추가됨',compareRemoved:'제외됨',compareReset:'B를 장착 구성으로 초기화',compareNoChange:'아직 차이가 없습니다',compareSynergyChanged:'조합 변경 사항',compareSynergyNone:'조합 변경 없음',compareIncreases:'증가',compareDecreases:'감소',compareSameEffect:'변동 없음',equippedTotals:'장착 룬 효과 합계',effectTotalsNote:'룬 옵션 값의 합계이며 실제 피해량·회복량 계산이 아닙니다',equippedNone:'룬을 장착하면 효과가 표시됩니다.',totalLines:'효과 옵션',differentEffects:'서로 다른 효과',compareSets:'5개 룬 구성 비교',compareNote:'현재 장착한 A 구성과 이 아르카나의 별도 B 구성을 비교합니다. B 구성은 자동 장착되지 않습니다.',setA:'A · 장착 구성',setB:'B · 비교 구성',setBEmpty:'룬 선택',chooseCompare:'비교 슬롯의 룬 선택',clearCompareSlot:'슬롯 비우기',copyCompare:'장착 구성을 B로 복사',clearCompare:'B 구성 초기화',compareDifference:'B − A',compareSkill:'효과',compareEffects:'룬 효과 합계',compareSynergy:'조합 효과',compareNoSynergies:'완성된 조합 없음',compareNoEffects:'양쪽 모두 옵션 없음',compareUnknown:'알 수 없는 값은 합계에서 제외됩니다',compareTier:'등급 점수',compareReady:'활성 조건 만족',compareLocked:'미완성',compareUpcoming:'예정 · 계획',compareActive:'활성',compareFrom:'두 보관함에서 선택',compareDone:'닫기',compareRemove:'제거',compareTotal:'합계 보너스',compareSourceNote:'동일 효과 ID 및 단위만 합산하며 조합 피해 배율은 추정하지 않습니다.'});
Object.assign(L.es,{compareShared:'runas compartidas',compareChanged:'ranuras diferentes',compareSame:'Igual',compareMoved:'Movida',compareReplaced:'Sustituida',compareAdded:'Añadida',compareRemoved:'Retirada',compareReset:'Restablecer B a equipado',compareNoChange:'Aún no hay diferencias',compareSynergyChanged:'Cambios de sinergia',compareSynergyNone:'Sin cambios de sinergia',compareIncreases:'Aumento',compareDecreases:'Disminución',compareSameEffect:'Sin cambio',equippedTotals:'Efectos equipados',effectTotalsNote:'Suma de atributos de runas, no predicción de daño o curación',equippedNone:'Equipa runas para ver sus efectos.',totalLines:'Líneas de efecto',differentEffects:'Efectos distintos',compareSets:'Comparar conjuntos de 5 runas',compareNote:'Compara el conjunto A equipado con otro conjunto B de esta Arcana. B se guarda pero no se equipa automáticamente.',setA:'A · Equipado',setB:'B · Alternativo',setBEmpty:'Elegir runa',chooseCompare:'Elegir runa para la ranura',clearCompareSlot:'Vaciar ranura',copyCompare:'Copiar equipado a B',clearCompare:'Vaciar B',compareDifference:'B menos A',compareSkill:'Efecto',compareEffects:'Bonos por efecto',compareSynergy:'Sinergias',compareNoSynergies:'Ninguna combinación completa',compareNoEffects:'No hay efectos en ninguno',compareUnknown:'No se suman valores desconocidos',compareTier:'Puntos de calidad',compareReady:'Requisitos cumplidos',compareLocked:'Incompleta',compareUpcoming:'Próximamente · planificación',compareActive:'Activa',compareFrom:'Elegir de ambas colecciones',compareDone:'Cerrar',compareRemove:'Quitar',compareTotal:'Bono acumulado',compareSourceNote:'Solo se suman líneas con el mismo ID y unidad; no se infiere el multiplicador de sinergias.'});

// Separate collections use one shared five-socket loadout system.
Object.assign(L.en,{simInventory:'Simulated Rune Collection',simInventoryNote:'Practice results saved here are separate from your manually tracked runes. Both collections can equip into the same sockets.',ownedInventory:'Tracked Rune Inventory',saveSimRune:'Save as New Simulated Rune',updateSimRune:'Update Saved Rune',loadSimRune:'Reroll This Rune',simSaved:'Saved a copy to Simulated Rune Collection',simUpdated:'Saved rune updated',simLoaded:'Loaded simulated rune; rerolling alone does not overwrite it',simNoLines:'Roll or choose each effect before saving',simOrigin:'From simulated collection',simEditing:'Editing a copy from your simulated collection',simJump:'Open Ogham Rerolls',simEmpty:'No simulated runes yet. Save a roll from the Ogham reroll simulator.',simSource:'Simulated',trackedSource:'Tracked',bothEquip:'Both collections share the five Arcana equipment slots',simLeave:'Original saved runes change only when you choose Update Saved Rune',backInventory:'Back to rune inventory'});
Object.assign(L.ko,{simInventory:'모의 오검 보관함',simInventoryNote:'모의 오검은 실제 보유 룬과 별도로 보관되며 같은 장착 슬롯을 사용합니다.',ownedInventory:'보유 오검 보관함',saveSimRune:'모의 오검 새로 저장',updateSimRune:'저장된 오검 업데이트',loadSimRune:'이 오검 다시 재설정',simSaved:'모의 보관함에 복사본 저장',simUpdated:'저장된 오검 업데이트 완료',simLoaded:'모의 오검을 불러왔습니다. 재설정만으로 원본은 변경되지 않습니다',simNoLines:'저장 전 모든 옵션을 선택하거나 재설정하세요',simOrigin:'모의 보관함에서 불러옴',simEditing:'모의 오검의 복사본 편집 중',simJump:'오검 재설정 열기',simEmpty:'저장된 모의 오검이 없습니다. 시뮬레이터에서 저장하세요.',simSource:'모의',trackedSource:'보유',bothEquip:'두 보관함 모두 동일한 장착 슬롯을 사용합니다',simLeave:'저장된 오검은 업데이트 버튼을 눌러야 변경됩니다',backInventory:'오검 보관함으로'});
Object.assign(L.es,{simInventory:'Colección de runas simuladas',simInventoryNote:'Resultados de práctica separados de las runas registradas. Ambas colecciones usan las mismas cinco ranuras.',ownedInventory:'Inventario de runas registradas',saveSimRune:'Guardar nueva runa simulada',updateSimRune:'Actualizar runa guardada',loadSimRune:'Volver a tirar esta runa',simSaved:'Copia guardada en colección simulada',simUpdated:'Runa guardada actualizada',simLoaded:'Runa simulada cargada; volver a tirar no cambia la guardada',simNoLines:'Elige los efectos o realiza una tirada antes de guardar',simOrigin:'Desde colección simulada',simEditing:'Editando copia simulada',simJump:'Abrir tiradas Ogham',simEmpty:'No hay runas simuladas. Guarda una desde el simulador.',simSource:'Simulada',trackedSource:'Registrada',bothEquip:'Ambas colecciones comparten cinco ranuras de Arcana',simLeave:'La runa guardada solo cambia al pulsar Actualizar',backInventory:'Volver al inventario'});

Object.assign(L.en,{unlockLine:'Unlock',provisionalArt:'Provisional rune artwork'});
Object.assign(L.ko,{unlockLine:'잠금 해제',provisionalArt:'임시 오검 이미지'});
Object.assign(L.es,{unlockLine:'Desbloquear',provisionalArt:'Imagen provisional de runa'});
const slotsAt=lv=>[1,5,10,15,20].filter(x=>Number(lv)>=x).length;
function tr(k){const lang=window.MIDIR_I18N?.language?.()||'en';return (L[lang]||L.en)[k]||L.en[k]||k;}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,min,max)=>Math.max(min,Math.min(max,Math.round(Number(n)||0)));
const options=(arr,value,fn=x=>x)=>arr.map(x=>`<option value="${esc(fn(x))}" ${String(fn(x))===String(value)?'selected':''}>${esc(x)}</option>`).join('');
const labelGrade=g=>tr(g||'fine');
const glyphs={Beithe:'ᚁ',Luis:'ᚂ',Fearn:'ᚃ',Sail:'ᚄ',Nin:'ᚅ',Úath:'ᚆ',Dair:'ᚇ',Tinne:'ᚈ',Coll:'ᚉ',Cert:'ᚊ',Muin:'ᚋ',Gort:'ᚌ',Gétal:'ᚍ',Straiph:'ᚎ',Ruis:'ᚏ',Ailm:'ᚐ',Onn:'ᚑ',Úr:'ᚒ',Edad:'ᚓ',Iphin:'ᚘ',Ebhadh:'ᚕ',Óir:'ᚖ',Uilleand:'ᚗ',Emancholl:'ᚙ',Idad:'ᚔ',Peithe:'ᚚ'};
// 16 recognizable plates are clipped from the user's in-game Ogham inventory
// screenshot (2026-11-25). These preserve the game's slanted ink and varied stone
// silhouettes instead of trying to force historical Unicode letters over them.
// The other 10 words use local provisional, game-style reconstructed stone art.
const GAME_PLATES={
 Sail:'sail',Dair:'dair',Uilleand:'uilleand',Gétal:'getal',Coll:'coll',
 Straiph:'straiph',Óir:'oir',Tinne:'tinne',Fearn:'fearn',Luis:'luis',
 Cert:'cert',Peithe:'peithe',Gort:'gort',Onn:'onn',Ailm:'ailm',Nin:'nin'
};
const PROVISIONAL_PLATES={Beithe:"beithe",Edad:"edad",Ebhadh:"ebhadh",Emancholl:"emancholl",Idad:"idad",Iphin:"iphin",Muin:"muin",Ruis:"ruis",Úath:"uath",Úr:"ur"};
const imgAllowed=src=>typeof src==='string'&&/^assets\/[\w./-]+\.(?:png|webp|svg)$/.test(src);
// An explicit local override always wins; fallback images are bundled/offline.
const wordIcon=w=>{
 const custom=window.MIDIR_OGHAM_ICONS?.[w];
 const src=imgAllowed(custom)?custom:GAME_PLATES[w]?`assets/ogham/game-reference/${GAME_PLATES[w]}.png`:PROVISIONAL_PLATES[w]?`assets/ogham/provisional/${PROVISIONAL_PLATES[w]}.png`:'';
 return src?`<img class="ogham-word-symbol ogham-word-image${!imgAllowed(custom)?' ogham-game-plate-image':''}" src="${esc(src)}" alt="" draggable="false">`:
 `<span class="ogham-word-symbol ogham-glyph-symbol" aria-hidden="true"><svg class="ogham-glyph-svg" viewBox="0 0 100 100" focusable="false" aria-hidden="true"><text class="ogham-glyph-strokes" x="0" y="0" font-size="80">${glyphs[w]||'᚛᚜'}</text></svg></span>`;
};
// Measure painted SVG glyph bounds in the visitor's actual installed Ogham font.
// An optical height target balances narrow vs broad letters without distorting the
// historical stroke shapes. Glyphs stay centered across all viewport sizes/platforms.
function fitGlyphs(scope){if(!scope)return;
 const ctx=document.createElement('canvas').getContext?.('2d');
 if(ctx)ctx.font='80px "Noto Sans Ogham", "Segoe UI Symbol", "DejaVu Sans", serif';
 for(const t of scope.querySelectorAll('.ogham-glyph-strokes')){
  if(t.dataset.oghamFitted==='1')continue;
  try{
   const metrics=ctx?.measureText(t.textContent);
   // Canvas actualBoundingBox* measures the visible ink, not the much larger
   // line-height/advance box reported by SVG getBBox for short Ogham strokes.
   const ink=metrics&&Number.isFinite(metrics.actualBoundingBoxAscent)&&Number.isFinite(metrics.actualBoundingBoxDescent)
      &&Number.isFinite(metrics.actualBoundingBoxRight)&&Number.isFinite(metrics.actualBoundingBoxLeft)?
      {x:-metrics.actualBoundingBoxLeft,y:-metrics.actualBoundingBoxAscent,
       width:metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight,
       height:metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent}:t.getBBox();
   if(!ink.width||!ink.height||!Number.isFinite(ink.width)||!Number.isFinite(ink.height))continue;
   // Fit by actual mark extents, not font em units. Narrow one-stroke letters
   // become larger; broad letters stay in the same frame. Uniform scaling
   // preserves historically correct relative stroke angles and spacing.
   const scale=Math.min(78/ink.width,82/ink.height,4);
   const dx=50-scale*(ink.x+ink.width/2),dy=50-scale*(ink.y+ink.height/2);
   t.setAttribute('transform',`translate(${dx.toFixed(3)} ${dy.toFixed(3)}) scale(${scale.toFixed(4)})`);
   t.dataset.oghamFitted='1';
  }catch{/* Missing font or unsupported browser metrics: keep the glyph fallback. */}
 }
}
const arcanaLabel=a=>{const row=ARCANA.find(x=>x[0]===a);return row?((window.MIDIR_I18N?.language?.()==='ko')?row[2]:row[1]):String(a)};
// Non-destructive visual inventory containers. A group ID is metadata only:
// no rune changes ownership, disappears from search, or loses equipment links.
const groupToken=id=>'group:'+id;
const groupSource=(s,id)=>['owned','simulated'].find(source=>s.inventoryPrefs.containers[source].some(g=>g.id===id));
function groupsFor(s,source){init(s);return s.inventoryPrefs.containers[source];}
function groupOf(s,r){return s.inventoryPrefs.containers[isSimulated(s,r.id)?'simulated':'owned'].find(g=>g.id===r.groupId);}
function groupOrder(s,source){return source==='simulated'?s.inventoryPrefs.simOrder:s.inventoryPrefs.order;}
function createGroup(s,source='owned',ids=[]){init(s);if(!['owned','simulated'].includes(source))return null;
 const id='og-box-'+s.inventoryPrefs.nextGroupId++,g={id,label:''};s.inventoryPrefs.containers[source].push(g);
 const order=groupOrder(s,source),positions=ids.map(rid=>order.indexOf(rid)).filter(i=>i>=0);order.splice(positions.length?Math.min(...positions):order.length,0,groupToken(id));
 for(const rid of ids)assignGroup(s,rid,id);return g;
}
function assignGroup(s,rid,id=null){init(s);const r=findRune(s,rid);if(!r)return false;const source=isSimulated(s,rid)?'simulated':'owned';if(id&&!s.inventoryPrefs.containers[source].some(g=>g.id===id))return false;r.groupId=id;return true;}
function dissolveGroup(s,id){init(s);const source=groupSource(s,id);if(!source)return false;const order=groupOrder(s,source),token=groupToken(id);let at=order.indexOf(token);
 const members=collection(s,source).filter(r=>r.groupId===id).map(r=>r.id);for(const r of collection(s,source))if(r.groupId===id)r.groupId=null;
 s.inventoryPrefs.containers[source]=s.inventoryPrefs.containers[source].filter(g=>g.id!==id);
 // Keep member ordering close to the dissolved container, not at the end.
 const rest=order.filter(x=>x!==token&&!members.includes(x));if(at<0)at=rest.length;rest.splice(Math.min(at,rest.length),0,...members);order.splice(0,order.length,...rest);return true;
}
function renameGroup(s,id,label){init(s);const source=groupSource(s,id);if(!source)return false;s.inventoryPrefs.containers[source].find(g=>g.id===id).label=String(label??'').trim().slice(0,48);return true;}
function moveGroup(s,id,direction){init(s);const source=groupSource(s,id);if(!source)return false;const order=groupOrder(s,source),tops=order.filter(t=>t.startsWith('group:')||collection(s,source).some(r=>r.id===t&&!r.groupId));const i=tops.indexOf(groupToken(id)),j=i+Math.sign(direction);if(i<0||j<0||j>=tops.length)return false;
 const target=tops[j],before=direction<0;return reorderItem(s,source,groupToken(id),target,before?'before':'after');}
function reorderItem(s,source,from,target,side='before'){init(s);const order=groupOrder(s,source);if(!order.includes(from)||!order.includes(target)||from===target)return false;
 const i=order.indexOf(from);order.splice(i,1);const j=order.indexOf(target);order.splice(j+(side==='after'?1:0),0,from);return true;
}
function combineRunes(s,source,dragId,targetId){init(s);if(dragId===targetId)return false;const a=collection(s,source).find(x=>x.id===dragId),b=collection(s,source).find(x=>x.id===targetId);if(!a||!b)return false;
 if(b.groupId)return assignGroup(s,dragId,b.groupId);
 const g=createGroup(s,source,[targetId,dragId]);return !!g;
}
function positionRune(s,source,rid,target,side='before'){init(s);const a=collection(s,source).find(x=>x.id===rid);if(!a||rid===target)return false;
 const b=collection(s,source).find(x=>x.id===target);if(b){assignGroup(s,rid,b.groupId||null);return reorderItem(s,source,rid,target,side);}
 if(target.startsWith('group:')){assignGroup(s,rid,null);return reorderItem(s,source,rid,target,side);}return false;
}
function inventoryBlocks(s,query='',source='owned'){
 init(s);const ranked=inventoryList(s,query,source),groups=s.inventoryPrefs.containers[source],order=groupOrder(s,source),lookup=new Map(ranked.map((item,i)=>[item.r.id,{...item,i}]));
 const blocks=[],placed=new Set();for(const token of order){
  const group=groups.find(g=>groupToken(g.id)===token);
  if(group){const members=ranked.filter(x=>x.r.groupId===group.id);blocks.push({type:'group',group,members,match:members.some(x=>x.search.match)||(!query?false:group.label.toLowerCase().includes(normSearch(query)))});placed.add(token);}
  else {const found=lookup.get(token);if(found&&!found.r.groupId){blocks.push({type:'rune',...found,match:found.search.match});placed.add(token);}}
 }
 for(const g of groups)if(!placed.has(groupToken(g.id))){const members=ranked.filter(x=>x.r.groupId===g.id);blocks.push({type:'group',group:g,members,match:members.some(x=>x.search.match)});}
 for(const item of ranked)if(!item.r.groupId&&!placed.has(item.r.id))blocks.push({type:'rune',...item,match:item.search.match});
 if(normSearch(query))blocks.sort((a,b)=>Number(b.match)-Number(a.match));
 else if(s.inventoryPrefs.sort!=='manual')blocks.sort((a,b)=>{
  const ix=x=>x.type==='group'?Math.min(...x.members.map(m=>ranked.indexOf(m)).concat([999999])):ranked.findIndex(row=>row.r.id===x.r.id);
  return ix(a)-ix(b);
 });
 return blocks;
}
function init(s){if(!s||typeof s!=='object')s={};s.runes=Array.isArray(s.runes)?s.runes:[];s.simulatedRunes=Array.isArray(s.simulatedRunes)?s.simulatedRunes:[];s.nextSimId=Math.max(1,clamp(s.nextSimId||1,1,99999999));s.loadouts=s.loadouts&&typeof s.loadouts==='object'?s.loadouts:{};s.compareLoadouts=s.compareLoadouts&&typeof s.compareLoadouts==='object'&&!Array.isArray(s.compareLoadouts)?s.compareLoadouts:{};s.awakening=s.awakening&&typeof s.awakening==='object'?s.awakening:{};s.nextId=Math.max(1,clamp(s.nextId||1,1,99999999));s.sim=s.sim&&typeof s.sim==='object'?s.sim:{};
 s.inventoryPrefs=s.inventoryPrefs&&typeof s.inventoryPrefs==='object'&&!Array.isArray(s.inventoryPrefs)?s.inventoryPrefs:{};
 if(!SORTS.includes(s.inventoryPrefs.sort))s.inventoryPrefs.sort='manual';
 const prefs=s.inventoryPrefs;
 prefs.containers=prefs.containers&&typeof prefs.containers==='object'&&!Array.isArray(prefs.containers)?prefs.containers:{};
 prefs.nextGroupId=clamp(prefs.nextGroupId||1,1,99999999);
 for(const [source,items,key] of [['owned',s.runes,'order'],['simulated',s.simulatedRunes,'simOrder']]){
  const present=new Set(items.map(r=>r.id)),raw=Array.isArray(prefs.containers[source])?prefs.containers[source]:[];
  const seen=new Set();prefs.containers[source]=raw.filter(g=>g&&typeof g.id==='string'&&!seen.has(g.id)&&seen.add(g.id)).map(g=>({id:g.id,label:String(g.label||'').slice(0,48)}));
  const groups=prefs.containers[source],labels=new Map(groups.filter(g=>g.label).map(g=>[g.label.toLocaleLowerCase(),g.id]));
  for(const r of items){
   if(!groups.some(g=>g.id===r.groupId))r.groupId=null;
   // One-time upgrade of 0.3.12k free-text labels to movable visual containers.
   const legacy=String(r.group||'').trim().slice(0,48);
   if(legacy&&!r.groupId){const labelKey=legacy.toLocaleLowerCase();let id=labels.get(labelKey);if(!id){id='og-box-'+prefs.nextGroupId++;groups.push({id,label:legacy});labels.set(labelKey,id);}r.groupId=id;}
   if(legacy)r.group='';
  }
  const valid=new Set([...present,...groups.map(g=>groupToken(g.id))]);const original=Array.isArray(prefs[key])?prefs[key]:[];
  prefs[key]=[...new Set(original.filter(id=>valid.has(id))),...groups.map(g=>groupToken(g.id)).filter(id=>!original.includes(id)),...items.map(r=>r.id).filter(id=>!original.includes(id))];
 }

 for(const [arcana,ids] of Object.entries(s.compareLoadouts)){if(!ARCANA.some(a=>a[0]===arcana)||!Array.isArray(ids)){delete s.compareLoadouts[arcana];continue;}const valid=new Set([...s.runes,...s.simulatedRunes].map(r=>r.id)),used=new Set();s.compareLoadouts[arcana]=Array.from({length:5},(_,i)=>{const id=ids[i];if(!valid.has(id)||used.has(id))return null;used.add(id);return id;});}
 return s;}
function allRunes(s){return [...(s.runes||[]),...(s.simulatedRunes||[])];}
function findRune(s,id){return allRunes(s).find(r=>r.id===id);}
function isSimulated(s,id){return (s.simulatedRunes||[]).some(r=>r.id===id);}
function collection(s,source='owned'){return source==='simulated'?s.simulatedRunes:s.runes;}
// Each saved simulated rune owns its own reroll ledger.  Historic saved runes
// without a ledger start at zero; data is not manufactured retroactively.
function normalizeSpent(costs){const source=costs&&typeof costs==='object'?costs:{};const herbs={};for(const id of PRACTICE_HERBS)herbs[id]=Math.max(0,Math.floor(Number(source.herbs?.[id])||0));return {gold:Math.max(0,Math.floor(Number(source.gold)||0)),herbs};}
function subtractSpent(a,b){const x=normalizeSpent(a),y=normalizeSpent(b),herbs={};for(const id of PRACTICE_HERBS)herbs[id]=Math.max(0,x.herbs[id]-y.herbs[id]);return {gold:Math.max(0,x.gold-y.gold),herbs};}
function normalizeSavedSim(sim){const word=WORDS.includes(sim.word)?sim.word:null;if(!word)return null;const grade=SPECIAL.includes(word)?'masterwork':sim.grade;if(!GRADE.includes(grade))return null;const lines=normalizedLines(sim.lines||[],grade);if(!lines.every(l=>l.id&&l.level>=1))return null;return {word,grade,lines};}
function saveSimulatedRune(s,sim,{updateId=null}={}){init(s);const snapshot=normalizeSavedSim(sim);if(!snapshot)return null;
 const rerollCount=Math.max(0,Math.floor(Number(sim.attempts)||0)),spent=normalizeSpent(sim.costs);
 if(updateId){const r=s.simulatedRunes.find(x=>x.id===updateId);if(!r)return null;Object.assign(r,snapshot,{rerollCount,spent});sim.baseAttempts=rerollCount;sim.baseCosts=normalizeSpent(spent);return r;}
 // Save as New transfers only reroll spending not already attributed to the
 // loaded original. A second copy without further rolls has zero refund credit.
 const baseCount=Math.max(0,Math.floor(Number(sim.baseAttempts)||0));const count=Math.max(0,rerollCount-baseCount);
 const credit=subtractSpent(spent,sim.baseCosts);
 const r={...snapshot,id:'sim-og-'+s.nextSimId++,name:'',notes:'',group:'',groupId:null,favorite:false,rerollCount:count,spent:credit};
 s.simulatedRunes.push(r);s.inventoryPrefs.simOrder.push(r.id);
 sim.loadedRuneId=r.id;sim.attempts=count;sim.costs=normalizeSpent(credit);sim.baseAttempts=count;sim.baseCosts=normalizeSpent(credit);
 return r;
}
function loadSimulatedRune(s,id){init(s);const r=s.simulatedRunes.find(x=>x.id===id);if(!r)return false;const sim=simInit(s);sim.word=r.word;sim.grade=r.grade;sim.lines=normalizedLines(r.lines,r.grade);sim.locks=[];sim.loadedRuneId=id;sim.attempts=Math.max(0,Math.floor(Number(r.rerollCount)||0));sim.costs=normalizeSpent(r.spent);sim.baseAttempts=sim.attempts;sim.baseCosts=normalizeSpent(sim.costs);delete sim.arcana;sim.notice=tr('simLoaded');return true;}
// Companion-only practice refund. Rate progresses in whole percent steps from
// 1% on a spent rune to 10% after >=450,000 gold of rerolls on that rune.
// All returns are rounded upward to whole gold/herbs; no spend returns zero.
function disassembleRefund(r){const spent=normalizeSpent(r?.spent||r?.costs);const refund={gold:0,herbs:{},rate:0};if(spent.gold<=0)return refund;refund.rate=Math.min(10,1+Math.floor(spent.gold/50000));refund.gold=Math.ceil(spent.gold*refund.rate/100);for(const id of PRACTICE_HERBS){const n=spent.herbs[id];if(n>0)refund.herbs[id]=Math.ceil(n*refund.rate/100);}return refund;}
// Refund the active rune's own tracked spending. When an already-saved rune has
// been rolled again but not explicitly updated, disassembly includes those
// uncommitted reroll charges: the preview and the payout must agree.
function creditDisassembly(refund){const chest=window.MIDIR_REFORGE,herbs=window.MIDIR_HERBS;
 if(refund.gold&&!chest?.creditGold)return false;
 const entries=Object.entries(refund.herbs);
 if(entries.length&&!herbs?.addHerbs)return false;
 const counts=herbs?.getState?.()?.counts;
 if(counts&&entries.some(([id])=>!Object.prototype.hasOwnProperty.call(counts,id)))return false;
 if(refund.gold&&!chest.creditGold(refund.gold,true))return false;
 const credited={};
 for(const [id,count] of entries){let left=count;while(left>0){const chunk=Math.min(30,left),added=herbs.addHerbs(id,chunk);
  if(added!==chunk){ // Undo the credits if the destination chest rejects a deposit.
   if(credited[id]&&herbs.spendHerbs)herbs.spendHerbs({[id]:credited[id]});
   for(const [prior,qty] of Object.entries(credited))if(prior!==id&&herbs.spendHerbs)herbs.spendHerbs({[prior]:qty});
   if(refund.gold)chest.spendGold?.(refund.gold,true);
   return false;
  }
  credited[id]=(credited[id]||0)+added;left-=added;
 }}return true;
}
function disassembleSimulatedRune(s,id,{includeCurrent=false}={}){init(s);const target=s.simulatedRunes.find(x=>x.id===id);if(!target)return null;
 let basis=target;
 if(includeCurrent&&s.sim?.loadedRuneId===id){const current=simInit(s),saved=normalizeSpent(target.spent),active=normalizeSpent(current.costs);
  if(current.attempts<Math.max(0,Number(target.rerollCount)||0)||active.gold<saved.gold||PRACTICE_HERBS.some(key=>active.herbs[key]<saved.herbs[key]))return null;
  basis={spent:active};
 }
 const refund=disassembleRefund(basis);if(!creditDisassembly(refund))return null;
 removeRune(s,id);return refund;
}
// An unsaved, newly rolled rune has its own ledger too; the player need not
// save it solely to disassemble it. Never disassemble a tracked (manual) rune.
function disassembleCurrentRune(s){const sim=simInit(s);
 if(sim.loadedRuneId)return disassembleSimulatedRune(s,sim.loadedRuneId,{includeCurrent:true});
 if(normalizeSpent(sim.costs).gold<=0)return null;
 const refund=disassembleRefund({spent:sim.costs});if(!creditDisassembly(refund))return null;
 return refund;
}
function normalizedLines(lines,grade){let taken=new Set();return Array.from({length:GRADES[grade]||1},(_,i)=>{const src=Array.isArray(lines)?lines[i]:null,id=String(src?.id||'').slice(0,90);if(!id||taken.has(id))return {id:'',level:0};taken.add(id);return {id,level:clamp(src?.level,1,1000)};});}
function addRune(s,word,grade){init(s);if(!WORDS.includes(word))return null;const g=SPECIAL.includes(word)?'masterwork':GRADE.includes(grade)?grade:'fine';const rune={id:'og-'+s.nextId++,word,grade:g,name:'',notes:'',group:'',groupId:null,favorite:false,lines:normalizedLines([],g)};s.runes.push(rune);s.inventoryPrefs.order.push(rune.id);return rune;}
function updateRune(s,id,data){init(s);const rune=findRune(s,id);if(!rune)return false;const word=WORDS.includes(data.word)?data.word:rune.word,grade=SPECIAL.includes(word)?'masterwork':GRADE.includes(data.grade)?data.grade:rune.grade;rune.word=word;rune.grade=grade;rune.name=String(data.name??rune.name).slice(0,64);rune.notes=String(data.notes??rune.notes).slice(0,280);rune.group=String(data.group??rune.group??'').trim().slice(0,48);rune.favorite=Boolean(data.favorite??rune.favorite);rune.lines=normalizedLines(data.lines??rune.lines,grade);return true;}
function removeRune(s,id){init(s);s.runes=s.runes.filter(x=>x.id!==id);s.simulatedRunes=s.simulatedRunes.filter(x=>x.id!==id);s.inventoryPrefs.order=s.inventoryPrefs.order.filter(x=>x!==id);s.inventoryPrefs.simOrder=s.inventoryPrefs.simOrder.filter(x=>x!==id);if(s.sim.loadedRuneId===id)s.sim.loadedRuneId=null;for(const load of [...Object.values(s.loadouts),...Object.values(s.compareLoadouts)])if(Array.isArray(load))for(let i=0;i<load.length;i++)if(load[i]===id)load[i]=null;}
// Stable per-instance manual positions; favorites and groups never affect Arcana equipment.
function moveRune(s,id,direction){init(s);const a=isSimulated(s,id)?s.inventoryPrefs.simOrder:s.inventoryPrefs.order,i=a.indexOf(id),j=i+Math.sign(direction);if(i<0||j<0||j>=a.length||!direction)return false;[a[i],a[j]]=[a[j],a[i]];return true;}
function favoriteRune(s,id,enabled){init(s);const rune=findRune(s,id);if(!rune)return false;rune.favorite=Boolean(enabled);return true;}
const normSearch=v=>String(v??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
function searchableRune(r,s){const effects=activeEffects(s);const lineNames=(r.lines||[]).filter(l=>l.id).map(l=>{const e=effects.find(e=>e.id===l.id)||ATTR.find(e=>e.id===l.id);return [l.id,e?.en,e?.ko,e?.es,e?.name,e?.Name].filter(Boolean).join(' ')});return [r.word,r.name,r.notes,r.group,groupOf(s,r)?.label,r.grade,labelGrade(r.grade),...lineNames].join(' ');}
function inventoryMatch(r,s,query){const words=normSearch(query).split(/\s+/).filter(Boolean);if(!words.length)return {match:true,details:[]};const match=words.every(w=>normSearch(searchableRune(r,s)).includes(w));if(!match)return {match:false,details:[]};const effects=activeEffects(s);const details=(r.lines||[]).filter(l=>l.id).map(l=>{const e=effects.find(x=>x.id===l.id)||ATTR.find(x=>x.id===l.id);return {text:e?(e[window.MIDIR_I18N?.language?.()||'en']||e.en||e.name||l.id):l.id,raw:[l.id,e?.en,e?.ko,e?.es,e?.name].join(' '),level:l.level}}).filter(l=>words.some(w=>normSearch(l.raw).includes(w))).slice(0,2);return {match:true,details};}
function inventoryList(s,query='',source='owned'){init(s);const items=collection(s,source),positions=source==='simulated'?s.inventoryPrefs.simOrder:s.inventoryPrefs.order;const order=new Map(positions.map((id,i)=>[id,i]));const mode=s.inventoryPrefs.sort;const collate=(a,b)=>String(a||'').localeCompare(String(b||''),undefined,{sensitivity:'base'});const ranked=items.map(r=>({r,search:inventoryMatch(r,s,query)}));ranked.sort((a,b)=>{
 if(normSearch(query)&&a.search.match!==b.search.match)return a.search.match?-1:1;
 const x=a.r,y=b.r;let n=0;
 if(mode==='favorites')n=Number(!!y.favorite)-Number(!!x.favorite);
 if(mode==='grade')n=GRADES[y.grade]-GRADES[x.grade];
 if(mode==='name')n=collate(x.word,y.word)||collate(x.name,y.name);
 if(mode==='group')n=collate(groupOf(s,x)?.label,groupOf(s,y)?.label);
 if(mode==='recent')n=items.indexOf(y)-items.indexOf(x);
 return n||(order.get(x.id)??0)-(order.get(y.id)??0);
 });return ranked;}
function equip(s,arcana,slot,id){init(s);if(!ARCANA.some(x=>x[0]===arcana)||slot<0||slot>4||slot>=slotsAt(s.awakening[arcana]??20))return false;s.loadouts[arcana]??=Array(5).fill(null);const load=s.loadouts[arcana],r=findRune(s,id);if(id&&!r)return false;if(id)for(let i=0;i<load.length;i++)if(i!==slot&&load[i]===id)load[i]=null;load[slot]=id||null;return true;}
function equipped(s,arcana){init(s);const ids=(s.loadouts[arcana]||[]).slice(0,slotsAt(s.awakening[arcana]??20));return ids.map(id=>findRune(s,id)).filter(Boolean);}
function combinations(s,arcana){const items=equipped(s,arcana),byWord=new Map();for(const r of items){const current=byWord.get(r.word);if(!current||GRADES[r.grade]>GRADES[current.grade])byWord.set(r.word,r);}return RECIPES.filter(r=>r.arcana===arcana).map(r=>{const used=r.words.map(w=>byWord.get(w)).filter(Boolean),missing=r.words.filter(w=>!byWord.has(w));const key=r.words.find(w=>SPECIAL.includes(w));const points=used.reduce((v,w)=>v+GRADES[w.grade],0);const ready=!missing.length&&byWord.get(key)?.grade==='masterwork'&&points>=5;return {...r,used,missing,points,ready,active:ready&&!r.upcoming};});}
function idsFor(s,arcana,side='equipped'){init(s);const from=side==='alternate'?(Object.prototype.hasOwnProperty.call(s.compareLoadouts,arcana)?s.compareLoadouts[arcana]:s.loadouts[arcana]||[]):s.loadouts[arcana]||[];const unlocked=slotsAt(s.awakening[arcana]??20);return Array.from({length:5},(_,i)=>i<unlocked?(from[i]||null):null);}
function alternateEquip(s,arcana,slot,id){init(s);if(!ARCANA.some(a=>a[0]===arcana)||!Number.isInteger(slot)||slot<0||slot>=slotsAt(s.awakening[arcana]??20))return false;if(id&&!findRune(s,id))return false;
 const slots=idsFor(s,arcana,'alternate');if(id)for(let i=0;i<5;i++)if(i!==slot&&slots[i]===id)slots[i]=null;slots[slot]=id||null;s.compareLoadouts[arcana]=slots;return true;}
function alternateCopy(s,arcana){init(s);s.compareLoadouts[arcana]=idsFor(s,arcana);return s.compareLoadouts[arcana];}
function alternateClear(s,arcana){init(s);s.compareLoadouts[arcana]=Array(5).fill(null);return s.compareLoadouts[arcana];}
function effectsForIds(s,ids){init(s);const catalog=activeEffects(s),byId=new Map(catalog.map(e=>[e.id,e])),totals=new Map();let lines=0;
 for(const id of ids){const rune=findRune(s,id);if(!rune)continue;for(const line of rune.lines||[]){if(!line?.id)continue;lines++;const effect=byId.get(line.id),level=Number(line.level)||0,raw=effect?.values?.[level-1],value=raw==null?null:Number(raw),unit=effect?.unit||'';
 const key=String(line.id)+'|'+unit;if(!totals.has(key))totals.set(key,{key,id:String(line.id),unit,sum:0,lines:0,unknown:0,levels:[],runes:[]});const row=totals.get(key);row.lines++;row.levels.push(level);row.runes.push(id);if(value!==null&&Number.isFinite(value))row.sum+=value;else row.unknown++;
 }}return {lines,effects:[...totals.values()].sort((a,b)=>effectName(a.id).localeCompare(effectName(b.id),undefined,{sensitivity:'base'}))};}
function synergiesForIds(s,arcana,ids){const byWord=new Map();for(const id of ids){const rune=findRune(s,id);if(!rune)continue;const prev=byWord.get(rune.word);if(!prev||GRADES[rune.grade]>GRADES[prev.grade])byWord.set(rune.word,rune);}
 return RECIPES.filter(r=>r.arcana===arcana).map(r=>{const used=r.words.map(w=>byWord.get(w)).filter(Boolean),missing=r.words.filter(w=>!byWord.has(w)),points=used.reduce((v,r)=>v+GRADES[r.grade],0),key=r.words.find(w=>SPECIAL.includes(w));const ready=!missing.length&&byWord.get(key)?.grade==='masterwork'&&points>=5;return {...r,used,missing,points,ready,active:ready&&!r.upcoming};});}
function compareRuneSets(s,arcana){const a=idsFor(s,arcana),b=idsFor(s,arcana,'alternate'),aa=effectsForIds(s,a),bb=effectsForIds(s,b),effects=new Map();for(const e of aa.effects)effects.set(e.key,{key:e.key,id:e.id,unit:e.unit,a:e.sum,b:0,aLines:e.lines,bLines:0,aUnknown:e.unknown,bUnknown:0});for(const e of bb.effects){const row=effects.get(e.key)||{key:e.key,id:e.id,unit:e.unit,a:0,b:0,aLines:0,bLines:0,aUnknown:0,bUnknown:0};row.b=e.sum;row.bLines=e.lines;row.bUnknown=e.unknown;effects.set(e.key,row);}
 const ordered=[...effects.values()].sort((x,y)=>{const xChanged=Math.abs(x.b-x.a)>0.0000001||x.aUnknown!==x.bUnknown,yChanged=Math.abs(y.b-y.a)>0.0000001||y.aUnknown!==y.bUnknown;return Number(yChanged)-Number(xChanged)||effectName(x.id).localeCompare(effectName(y.id),undefined,{sensitivity:'base'});});
 const slots=b.map((id,i)=>{const prev=a[i];return id===prev?'same':id&&a.includes(id)?'moved':id&&prev?'replaced':id?'added':prev?'removed':'same';});
 const shared=b.filter(Boolean).filter(id=>a.includes(id)).length;
 const synergyA=synergiesForIds(s,arcana,a),synergyB=synergiesForIds(s,arcana,b),synergyChanges=synergyA.map((x,i)=>({name:recipeName(x),a:x,b:synergyB[i],changed:x.ready!==synergyB[i].ready||x.points!==synergyB[i].points})).filter(x=>x.changed);
 return {a,b,aa,bb,slots,shared,changedSlots:slots.filter(x=>x!=='same').length,effects:ordered,synergyA,synergyB,synergyChanges};}
function recommendations(s,arcana){init(s);return RECIPES.filter(r=>r.arcana===arcana).map(r=>{const used=[],missing=[];for(const word of r.words){const options=allRunes(s).filter(x=>x.word===word).sort((a,b)=>GRADES[b.grade]-GRADES[a.grade]);const pick=options[0];if(pick)used.push(pick);else missing.push(word);}const points=used.reduce((v,r)=>v+GRADES[r.grade],0);const key=r.words.find(w=>SPECIAL.includes(w));return {...r,used,missing,points,score:missing.length*20+(used.find(x=>x.word===key)?.grade==='masterwork'?0:20)+(9-points)};}).sort((a,b)=>a.score-b.score);}
function effectName(id){const a=activeEffects(currentContext?.state).find(x=>x.id===id),lang=window.MIDIR_I18N?.language?.()||'en';return a?(a[lang]||a.en):id;}
function effectSelect(value,tag,word,s){const pool=word?allowed(word,null,s):activeEffects(s);const isCustom=!!value&&!pool.some(a=>a.id===value);return `<select ${tag}><option value="">${esc(tr('none'))}</option>${pool.map(a=>`<option value="${esc(a.id)}" ${a.id===value?'selected':''}>${esc(effectName(a.id))}</option>`).join('')}<option value="custom" ${isCustom?'selected':''}>${esc(tr('edit'))} · +</option></select>`;}

function gradeSelect(value){return `<select data-og-grade>${GRADE.map(g=>`<option value="${g}" ${value===g?'selected':''}>${esc(labelGrade(g))}</option>`).join('')}</select>`;}
function recipeName(r){const lang=window.MIDIR_I18N?.language?.()||'en';return lang==='ko'?(r.ko||('조합 '+r.id.split('-')[1])):r.en;}
function selector(arcana){return `<select id="ogham-arcana">${ARCANA.map(x=>`<option value="${x[0]}" ${x[0]===arcana?'selected':''}>${esc(arcanaLabel(x[0]))}</option>`).join('')}</select>`;}
let currentArcana='hs',editing=null,editingDraft=null,pickerMode=null,search='',picked=null,dragging=null,selectedGroup=null,suppressRuneClickUntil=0,touchDragAbort=null;let currentContext=null;let totalsExpanded=true,compareExpanded=false,comparePickingSlot=null;
// The visual picker and editor are drafts until Save. Cancel never adds a phantom rune.
function beginRuneEdit(s,id){
 const r=findRune(s,id);
 if(!r)return;
 editing=id;editingDraft=JSON.parse(JSON.stringify(r));pickerMode=null;
}
function endRuneEdit(){editing=null;editingDraft=null;pickerMode=null;}

function view(){return `<h2>${esc(tr('title'))}</h2><div id="ogham-root" class="ogham-system"></div>`;}
// A socket's persistent identity is its 0-based position, not any localized name.
// The pentagon uses Companion CSS artwork; recognizable stones retain the supplied screenshot silhouettes.
const socketPositions=['top','left','right','lower-left','lower-right'];
function runeTile(r,extra=''){return `<span class="ogham-rune-art ogham-tier-${esc(r.grade)} ${GAME_PLATES[r.word]||PROVISIONAL_PLATES[r.word]?'ogham-game-reference-art':'ogham-fallback-art'} ${SPECIAL.includes(r.word)?'ogham-special-word':''} ${extra}" aria-hidden="true"><span class="ogham-rune-etched">${wordIcon(r.word)}</span><span class="ogham-rune-facets"></span></span>`;}
function loadoutSlot(s,arcana,i){
 const unlocked=i<slotsAt(s.awakening[arcana]??20),id=s.loadouts[arcana]?.[i],r=findRune(s,id),chosen=!!r&&picked?.id===id&&picked?.fromSlot===i;
 const desc=r?`${r.name||r.word}, ${labelGrade(r.grade)}`:tr('emptySocket');
 return `<div class="ogham-slot ogham-position-${socketPositions[i]} ${unlocked?'':'ogham-socket-locked'} ${r?'ogham-socket-occupied':''} ${chosen?'ogham-picked':''}" data-og-position="${i}">
  <button class="ogham-socket" type="button" data-og-slot="${i}" ${unlocked?'':'disabled'} ${r?'draggable="true"':''} aria-pressed="${chosen}" ${chosen?'aria-describedby="ogham-selected-details"':''} aria-label="${esc(tr('slot'))} ${i+1}: ${esc(desc)}" title="${esc(unlocked?(chosen?tr('tapAgainUnequip'):r?desc:tr('tapToEquip')):(tr('locked')+' '+[1,5,10,15,20][i]))}">
   <span class="ogham-socket-inner">${r?runeTile(r,'ogham-socket-rune'):`<span class="ogham-socket-glyph">${unlocked?'✦':'🔒'}</span>`}</span>
  </button><span class="ogham-socket-caption">${esc(tr('slot'))} ${i+1}${r?` · ${esc(r.word)}`:''}</span>
</div>`;
}
function runeWordPicker(){
 const renderGroup=(words,title)=>`<section class="ogham-picker-section"><h4>${esc(tr(title))}</h4><div class="ogham-picker-grid">${words.map(word=>{
  const isSpecial=SPECIAL.includes(word),game=!!GAME_PLATES[word];
  return `<button type="button" class="ogham-picker-tile" data-og-word-choose="${esc(word)}" aria-label="${esc(word)}${isSpecial?' · '+esc(tr('masterwork')):''}" title="${esc(game?tr('gameReferenced'):tr('provisionalArt'))}">
   ${runeTile({word,grade:isSpecial?'masterwork':'fine'},'ogham-picker-rune')}
   <span class="ogham-picker-word">${esc(word)}</span></button>`;
 }).join('')}</div></section>`;
 return `<div class="ogham-edit-overlay ogham-picker-overlay"><section id="ogham-word-picker" class="ogham-word-picker card" role="dialog" aria-modal="true" aria-labelledby="ogham-picker-title" aria-describedby="ogham-picker-help">
  <header><div><h3 id="ogham-picker-title">${esc(tr('pickWord'))}</h3><small id="ogham-picker-help">${esc(tr('pickHint'))}</small></div><button type="button" data-og-picker-cancel aria-label="${esc(tr('cancel'))}">×</button></header>
  <div class="ogham-picker-content">${renderGroup(SPECIAL,'specialWords')}${renderGroup(REGULAR,'regularWords')}</div>
  <footer><button type="button" data-og-picker-cancel>${esc(tr('pickBack'))}</button></footer>
 </section></div>`;
}
function bindRuneWordPicker(root,s){
 const picker=root.querySelector('#ogham-word-picker');if(!picker)return;
 picker.querySelectorAll('[data-og-picker-cancel]').forEach(b=>b.addEventListener('click',()=>{pickerMode=null;paint()}));
 picker.querySelectorAll('[data-og-word-choose]').forEach(b=>b.addEventListener('click',()=>{
  const word=b.dataset.ogWordChoose;
  if(!WORDS.includes(word))return;
  if(pickerMode==='add'){
   editing='__new__';editingDraft={id:null,word,grade:SPECIAL.includes(word)?'masterwork':'fine',name:'',notes:'',group:'',favorite:false,lines:normalizedLines([],SPECIAL.includes(word)?'masterwork':'fine')};
  }else if(pickerMode==='change'&&editingDraft){
   editingDraft.word=word;
   if(SPECIAL.includes(word))editingDraft.grade='masterwork';
   editingDraft.lines=normalizedLines(editingDraft.lines,editingDraft.grade);
  }
  pickerMode=null;paint();
 }));
}
function selectedSocketDetails(s,arcana){
 if(picked?.fromSlot==null||s.loadouts[arcana]?.[picked.fromSlot]!==picked.id)return '';
 const rune=findRune(s,picked.id);if(!rune)return '';
 const effects=activeEffects(s);
 const lines=rune.lines.filter(line=>line.id).map(line=>{
  const effect=effects.find(a=>a.id===line.id);
  const level=effect?clamp(line.level,1,maxEffectLevel(effect)):clamp(line.level,1,1000);
  return `<span class="ogham-detail-line"><span>${esc(effectName(line.id))}</span><b>Lv ${level}${effect?' · '+esc(effectBonus(effect,level)):''}</b></span>`;
 }).join('');
 return `<section id="ogham-selected-details" class="ogham-selected-details" aria-label="${esc(tr('socketDetails'))}" role="status">
  ${runeTile(rune,'ogham-detail-rune')}<div class="ogham-detail-body"><strong>${esc(rune.name||rune.word)}</strong><small>${rune.name?esc(rune.word)+' · ':''}${esc(labelGrade(rune.grade))} · ${esc(tr('slot'))} ${picked.fromSlot+1}</small>
  ${lines?`<div class="ogham-detail-lines">${lines}</div>`:''}${rune.notes?`<small class="ogham-detail-notes">${esc(rune.notes)}</small>`:''}
  <small class="ogham-detail-prompt">${esc(tr('tapAgainUnequip'))}</small></div>
 </section>`;
}
function amount(value,unit='',showSign=true){return (showSign&&value>=0?'+':'')+Number(value.toFixed(5)).toLocaleString(undefined,{maximumFractionDigits:5})+unit;}
function renderSynergySummary(rows){const full=rows.filter(r=>r.ready);return full.length?full.map(r=>`<div class="ogham-compare-synergy"><strong>${esc(recipeName(r))}</strong><span>${r.points}/9 · ${esc(tr(r.active?'compareActive':r.upcoming?'compareUpcoming':'compareReady'))}</span></div>`).join(''):`<small>${esc(tr('compareNoSynergies'))}</small>`;}
function renderEquippedTotals(s,arcana){const ids=idsFor(s,arcana),total=effectsForIds(s,ids);return `<details class="ogham-totals-panel" ${totalsExpanded?'open':''}><summary>${esc(tr('equippedTotals'))} <span>${total.effects.length} ${esc(tr('differentEffects'))} · ${total.lines} ${esc(tr('totalLines'))}</span></summary><div class="ogham-details-inner"><small>${esc(tr('effectTotalsNote'))}</small>${total.effects.length?`<div class="ogham-totals-list">${total.effects.map(row=>`<div class="ogham-total-row"><span>${esc(effectName(row.id))}<small>${row.lines} ${esc(tr('totalLines'))}</small></span><strong>${esc(amount(row.sum,row.unit))}${row.unknown?' *':''}</strong></div>`).join('')}</div>`:`<p class="hint">${esc(tr('equippedNone'))}</p>`}${total.effects.some(r=>r.unknown)?`<small>${esc(tr('compareUnknown'))}</small>`:''}<h4>${esc(tr('compareSynergy'))}</h4>${renderSynergySummary(synergiesForIds(s,arcana,ids))}</div></details>`;}
function renderCompare(s,arcana){const data=compareRuneSets(s,arcana);
 const status=x=>tr('compare'+x[0].toUpperCase()+x.slice(1));
 const slotA=(id,i)=>{const rune=findRune(s,id),kind=data.slots[i];return `<div class="ogham-compare-slot ${kind==='same'?'ogham-compare-same':'ogham-compare-diff'}" aria-label="${esc(tr('setA'))} ${esc(tr('slot'))} ${i+1}${kind!=='same'?' · '+esc(status(kind)):''}">${rune?runeTile(rune):'<span class="ogham-compare-empty">—</span>'}<small>${rune?esc(rune.name||rune.word):'—'}</small></div>`;};
 const slotB=(id,i)=>{const rune=findRune(s,id),unlocked=i<slotsAt(s.awakening[arcana]??20),kind=data.slots[i],picking=comparePickingSlot===i;return `<button type="button" class="ogham-compare-slot ogham-compare-edit ${kind==='same'?'ogham-compare-same':'ogham-compare-diff'} ${picking?'ogham-compare-picking':''}" data-og-compare-slot="${i}" ${unlocked?'':'disabled'} aria-label="${esc(tr('chooseCompare'))} ${i+1}: ${esc(rune?.name||rune?.word||tr('setBEmpty'))} · ${esc(status(kind))}" title="${esc(tr('chooseCompare'))}">${rune?runeTile(rune):'<span class="ogham-compare-empty">'+(unlocked?'+':'🔒')+'</span>'}<small>${rune?esc(rune.name||rune.word):esc(tr(unlocked?'setBEmpty':'locked'))}</small><span class="ogham-compare-slot-status">${esc(status(kind))}</span></button>`;};
 const synergyDiff=data.synergyChanges.map(row=>`<div class="ogham-compare-synergy-change"><strong>${esc(row.name)}</strong><span>${row.a.points}/9 ${row.a.ready?'✓':'—'} → ${row.b.points}/9 ${row.b.ready?'✓':'—'}</span></div>`).join('');
 const selectedSlot=comparePickingSlot;
 const selectedId=selectedSlot===null?null:idsFor(s,arcana,'alternate')[selectedSlot];
 const comparePool=[...s.runes.map(r=>({r,source:'owned'})),...s.simulatedRunes.map(r=>({r,source:'simulated'}))];
 const compareLibrary=selectedSlot===null
  ? `<div class="ogham-compare-inline-picker"><p class="hint">${esc(tr('compareFrom'))}. ${esc(tr('chooseCompare'))} ${esc(tr('setB'))}.</p></div>`
  : `<div class="ogham-compare-inline-picker"><div class="ogham-section-head"><h4>${esc(tr('chooseCompare'))} ${selectedSlot+1}</h4><div class="ogham-compare-picker-actions"><button type="button" data-og-compare-empty>${esc(tr('clearCompareSlot'))}</button><button type="button" data-og-compare-close>${esc(tr('compareDone'))}</button></div></div><p class="hint">${esc(tr('compareFrom'))}</p><div class="ogham-compare-picker-grid" tabindex="0" role="region" aria-label="${esc(tr('compareFrom'))}">${comparePool.map(({r,source})=>`<button type="button" class="ogham-compare-pick-card ${selectedId===r.id?'selected':''}" data-og-compare-choose="${esc(r.id)}" aria-label="${esc(r.name||r.word)} · ${esc(labelGrade(r.grade))}">${runeTile(r)}<span><strong>${esc(r.name||r.word)}</strong><small>${esc(r.name?r.word+' · ':'')}${esc(labelGrade(r.grade))} · ${esc(tr(source==='simulated'?'simSource':'trackedSource'))}</small></span></button>`).join('')||`<p class="hint">${esc(tr('empty'))}</p>`}</div></div>`;
 return `<details class="ogham-compare-panel" ${compareExpanded?'open':''}><summary>${esc(tr('compareSets'))}<span>${esc(tr('setA'))} / ${esc(tr('setB'))}</span></summary><div class="ogham-details-inner"><p class="hint">${esc(tr('compareNote'))}</p><div class="ogham-compare-meta"><span>${data.shared} ${esc(tr('compareShared'))}</span><span>${data.changedSlots} ${esc(tr('compareChanged'))}</span></div><div class="ogham-compare-config"><div><h4>${esc(tr('setA'))}</h4><div class="ogham-compare-slots">${data.a.map(slotA).join('')}</div></div><div><h4>${esc(tr('setB'))}</h4><div class="ogham-compare-slots">${data.b.map(slotB).join('')}</div><div class="ogham-compare-actions"><button type="button" id="ogham-compare-copy">${esc(tr('compareReset'))}</button><button type="button" id="ogham-compare-clear">${esc(tr('clearCompare'))}</button></div></div></div>${compareLibrary}${!data.changedSlots?`<p class="ogham-compare-equal">${esc(tr('compareNoChange'))}</p>`:''}<h4>${esc(tr('compareEffects'))}</h4><div class="ogham-compare-table-wrap"><table class="ogham-compare-table"><thead><tr><th>${esc(tr('compareSkill'))}</th><th>${esc(tr('setA'))}</th><th>${esc(tr('setB'))}</th><th>${esc(tr('compareDifference'))}</th></tr></thead><tbody>${data.effects.length?data.effects.map(row=>{const delta=row.b-row.a,kind=Math.abs(delta)<1e-8?'same':delta>0?'increase':'decrease';return `<tr class="ogham-compare-effect-${kind}"><th scope="row">${esc(effectName(row.id))}</th><td>${esc(amount(row.a,row.unit))}${row.aUnknown?' *':''}</td><td>${esc(amount(row.b,row.unit))}${row.bUnknown?' *':''}</td><td class="ogham-compare-delta" aria-label="${esc(tr(kind==='same'?'compareSameEffect':kind==='increase'?'compareIncreases':'compareDecreases'))}">${esc(amount(delta,row.unit))}${row.aUnknown||row.bUnknown?' *':''}</td></tr>`;}).join(''):`<tr><td colspan="4">${esc(tr('compareNoEffects'))}</td></tr>`}</tbody></table></div>${data.effects.some(e=>e.aUnknown||e.bUnknown)?`<small>${esc(tr('compareUnknown'))}</small>`:''}<p class="hint">${esc(tr('compareSourceNote'))}</p><h4>${esc(tr('compareSynergyChanged'))}</h4>${synergyDiff||`<small>${esc(tr('compareSynergyNone'))}</small>`}<div class="ogham-compare-synergies"><div><h4>${esc(tr('setA'))} · ${esc(tr('compareSynergy'))}</h4>${renderSynergySummary(data.synergyA)}</div><div><h4>${esc(tr('setB'))} · ${esc(tr('compareSynergy'))}</h4>${renderSynergySummary(data.synergyB)}</div></div></div></details>`;}
function renderComparePicker(s,arcana){if(comparePickingSlot===null)return '';const i=comparePickingSlot,selected=idsFor(s,arcana,'alternate')[i];return `<div class="ogham-edit-overlay ogham-compare-picker-overlay"><section class="card ogham-compare-picker" role="dialog" aria-modal="true" aria-label="${esc(tr('chooseCompare'))} ${i+1}"><div class="ogham-section-head"><h3>${esc(tr('chooseCompare'))} ${i+1}</h3><button type="button" data-og-compare-close aria-label="${esc(tr('compareDone'))}">×</button></div><p class="hint">${esc(tr('compareFrom'))}</p><div class="ogham-compare-picker-grid">${[...s.runes,...s.simulatedRunes].map(r=>`<button type="button" class="ogham-compare-pick-card ${selected===r.id?'selected':''}" data-og-compare-choose="${esc(r.id)}" aria-label="${esc(r.name||r.word)} · ${esc(labelGrade(r.grade))}">${runeTile(r)}<span><strong>${esc(r.name||r.word)}</strong><small>${esc(r.name?r.word+' · ':'')}${esc(labelGrade(r.grade))} · ${esc(tr(isSimulated(s,r.id)?'simSource':'trackedSource'))}</small></span></button>`).join('')||`<p class="hint">${esc(tr('empty'))}</p>`}</div><div class="ogham-compare-picker-actions"><button type="button" data-og-compare-empty>${esc(tr('clearCompareSlot'))}</button><button type="button" data-og-compare-close>${esc(tr('compareDone'))}</button></div></section></div>`;}
function inventoryCard(s,arcana,r,found,index,source='owned'){const items=collection(s,source),simulated=source==='simulated';const assigned=(s.loadouts[arcana]||[]).indexOf(r.id),manual=s.inventoryPrefs.sort==='manual'&&!r.groupId;const searchActive=!!normSearch(search);
 return `<article class="ogham-rune-card ${picked?.id===r.id?'ogham-picked':''} ${r.favorite?'ogham-favorite':''} ${searchActive?(found.match?'ogham-search-match':'ogham-search-muted'):''}" data-og-rune-id="${esc(r.id)}">
  <button type="button" draggable="true" class="ogham-rune-pick" data-og-pick="${esc(r.id)}" aria-pressed="${picked?.id===r.id?'true':'false'}" aria-label="${esc(r.name||r.word)} · ${esc(labelGrade(r.grade))} · ${esc(tr('select'))}" title="${esc(r.name||r.word)} · ${esc(labelGrade(r.grade))} · ${r.lines.filter(x=>x.id).length}/${GRADES[r.grade]} · ${esc(tr('inventoryDragHint'))}" ${manual?'aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"':''}>${runeTile(r)}<span class="ogham-rune-label"><strong>${esc(r.name||r.word)}</strong>${assigned!==-1?`<small class="ogham-equipped-tag">${assigned+1} ✓</small>`:''}<span class="ogham-search-hit">${found.details.map(d=>esc(d.text)+(d.level?' · Lv '+esc(d.level):'')).join(' · ')}</span></span></button>
  <div class="ogham-rune-actions"><button type="button" class="ogham-favorite-toggle" data-og-favorite="${esc(r.id)}" aria-pressed="${!!r.favorite}" aria-label="${esc(tr(r.favorite?'unfavorite':'favorite'))} · ${esc(r.word)}" title="${esc(tr(r.favorite?'unfavorite':'favorite'))}">${r.favorite?'★':'☆'}</button>${simulated?`<button type="button" data-og-sim-load="${esc(r.id)}" title="${esc(tr('loadSimRune'))}" aria-label="${esc(tr('loadSimRune'))}">🎲</button>`:''}<button type="button" data-og-edit="${esc(r.id)}" title="${esc(tr('edit'))}" aria-label="${esc(tr('edit'))} · ${esc(r.word)}"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 20 4-1 12-12-4-4L4 15zM13 6l4 4"/></svg></button><button class="danger" title="${esc(tr('remove'))}" data-og-remove="${esc(r.id)}" aria-label="${esc(tr('remove'))} ${esc(r.word)}">×</button></div></article>`;
}
function groupCard(s,arcana,block,source){const g=block.group,searchActive=!!normSearch(search),items=block.members;
 return `<section class="ogham-group-box ${selectedGroup===g.id?'ogham-group-selected':''} ${searchActive?(block.match?'ogham-search-match':'ogham-search-muted'):''}" data-og-container-id="${esc(g.id)}" data-og-group-source="${source}" tabindex="0" aria-label="${esc(g.label||tr('groupContents'))}: ${items.length}">
  ${g.label?`<div class="ogham-group-caption">${esc(g.label)}</div>`:''}
  <div class="ogham-group-head"><button type="button" draggable="true" class="ogham-group-handle" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown" data-og-group-handle="${esc(g.id)}" title="${esc(tr('groupRename'))}"><span aria-hidden="true">⠿</span><small>${items.length} ${esc(tr('groupContents'))}</small></button><div class="ogham-group-tools"><button type="button" class="ogham-group-remove" data-og-group-remove="${esc(g.id)}" aria-label="${esc(tr('groupRemove'))}" title="${esc(tr('groupRemove'))}">×</button></div></div>
  <div class="ogham-group-runes">${items.length?items.map(({r,search:found},i)=>inventoryCard(s,arcana,r,found,i,source)).join(''):`<small class="ogham-group-empty">${esc(tr('groupEmpty'))}</small>`}</div>
 </section>`;
}
function renderCollection(s,arcana,source){return inventoryBlocks(s,search,source).map((block,i)=>block.type==='group'?groupCard(s,arcana,block,source):inventoryCard(s,arcana,block.r,block.search,i,source)).join('');}
function updateSearchDisplay(root,s){const active=!!normSearch(search);
 for(const source of ['owned','simulated']){const blocks=inventoryBlocks(s,search,source),container=root.querySelector(`[data-og-inventory="${source}"]`);if(!container)continue;
 const byId=new Map(Array.from(container.querySelectorAll('.ogham-rune-card'),c=>[c.dataset.ogRuneId,c]));
 const boxes=new Map(Array.from(container.querySelectorAll('.ogham-group-box'),c=>[c.dataset.ogContainerId,c]));
 for(const block of blocks){if(block.type==='group'){
  const box=boxes.get(block.group.id);if(!box)continue;box.classList.toggle('ogham-search-match',active&&block.match);box.classList.toggle('ogham-search-muted',active&&!block.match);
  const inner=box.querySelector('.ogham-group-runes');for(const {r,search:found} of block.members){const card=byId.get(r.id);if(card){setCardMatch(card,found,active);inner.appendChild(card);}}
  container.appendChild(box);
 }else {const card=byId.get(block.r.id);if(card){setCardMatch(card,block.search,active);container.appendChild(card);}}}
 container.querySelectorAll('[data-og-move]').forEach(b=>{b.disabled=active;});
 }
 const status=root.querySelector('#ogham-search-status');if(status)status.textContent=active?['owned','simulated'].reduce((n,source)=>n+inventoryList(s,search,source).filter(x=>x.search.match).length,0)+' '+tr('matches')+' · '+tr('searchKept'):'';
}
function setCardMatch(card,found,active){card.classList.toggle('ogham-search-match',active&&found.match);card.classList.toggle('ogham-search-muted',active&&!found.match);const detail=card.querySelector('.ogham-search-hit');if(detail)detail.textContent=found.details.map(d=>d.text+(d.level?' · Lv '+d.level:'')).join(' · ');}
function groupDropTarget(el){const card=el?.closest?.('.ogham-rune-card');if(card)return {kind:'rune',id:card.dataset.ogRuneId,el:card};const box=el?.closest?.('.ogham-group-box');if(box)return {kind:'group',id:box.dataset.ogContainerId,el:box};const inv=el?.closest?.('[data-og-inventory]');return inv?{kind:'inventory',source:inv.dataset.ogInventory,el:inv}:null;}
function dropPlacement(el,clientX){const r=el.getBoundingClientRect(),fraction=(clientX-r.left)/Math.max(1,r.width);return fraction<.23?'before':fraction>.77?'after':'center';}
function applyInventoryDrop(s,arcana,source,target,x,payload=dragging){if(!payload||!target||!['owned','simulated'].includes(source))return false;
 if(payload.fromSlot!=null){if(target.kind==='inventory'){const ok=equip(s,arcana,payload.fromSlot,'');if(ok){picked=null;saveNow();paint();}return ok;}return false;}
 if(payload.source!==source)return false;
 let changed=false;
 if(payload.kind==='group'){
  const token=groupToken(payload.id);if(target.kind==='inventory'){const order=groupOrder(s,source);if(order.includes(token)){order.splice(order.indexOf(token),1);order.push(token);changed=true;}}
  else {let other=target.kind==='group'?groupToken(target.id):target.id;if(target.kind==='rune'){const r=collection(s,source).find(r=>r.id===target.id);if(r?.groupId)other=groupToken(r.groupId);}
   if(other!==token)changed=reorderItem(s,source,token,other,dropPlacement(target.el,x)==='before'?'before':'after');}
 }else if(payload.kind==='rune'){
  const id=payload.id;if(!collection(s,source).some(r=>r.id===id))return false;
  if(target.kind==='inventory'){assignGroup(s,id,null);const order=groupOrder(s,source);order.splice(order.indexOf(id),1);order.push(id);changed=true;}
  else if(target.kind==='group'){changed=assignGroup(s,id,target.id);}
  else if(target.kind==='rune'&&target.id!==id){const side=dropPlacement(target.el,x);changed=side==='center'?combineRunes(s,source,id,target.id):positionRune(s,source,id,target.id,side);}
 }
 if(changed){picked=null;selectedGroup=null;dragging=null;saveNow();paint();}
 return changed;
}
function renameGroupUI(s,id){const source=groupSource(s,id);if(!source)return;const group=s.inventoryPrefs.containers[source].find(g=>g.id===id);const proposed=window.prompt?.(tr('groupOptionalName'),group?.label||'');if(proposed!==undefined&&proposed!==null&&renameGroup(s,id,proposed)){saveNow();paint();}}
function scrollInventoryEdge(pane,y){const r=pane.getBoundingClientRect(),edge=28;if(pane.scrollHeight<=pane.clientHeight)return;if(y-r.top<edge)pane.scrollTop-=Math.ceil((edge-Math.max(0,y-r.top))/3);else if(r.bottom-y<edge)pane.scrollTop+=Math.ceil((edge-Math.max(0,r.bottom-y))/3);}
function bindTouchGrouping(root,s,arcana){touchDragAbort?.abort();const ctrl=new AbortController();touchDragAbort=ctrl;let active=null;
 function cleanup(){if(active?.ghost)active.ghost.remove();root.querySelectorAll('.ogham-drop-center,.ogham-drop-edge,.ogham-drop-over').forEach(el=>el.classList.remove('ogham-drop-center','ogham-drop-edge','ogham-drop-over'));active=null;}
 root.querySelectorAll('[data-og-pick],[data-og-group-handle]').forEach(btn=>btn.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;
  if(btn.hasAttribute('data-og-pick')&&!e.target.closest('.ogham-rune-art'))return;
  const runeId=btn.dataset.ogPick,groupId=btn.dataset.ogGroupHandle;
  const source=btn.closest('[data-og-inventory]')?.dataset.ogInventory;if(!source)return;
  active={id:runeId||groupId,kind:runeId?'rune':'group',source,pointerId:e.pointerId,x:e.clientX,y:e.clientY,moved:false,ghost:null};
 },{signal:ctrl.signal}));
 document.addEventListener('pointermove',e=>{if(!active||e.pointerId!==active.pointerId)return;
  if(!active.moved&&Math.hypot(e.clientX-active.x,e.clientY-active.y)<12)return;
  active.moved=true;e.preventDefault();
  if(!active.ghost){const ghost=document.createElement('div');ghost.className='ogham-touch-ghost';ghost.textContent=active.kind==='group'?tr('groupDrag'):(findRune(s,active.id)?.word||'');document.body.appendChild(ghost);active.ghost=ghost;}
  active.ghost.style.transform=`translate(${e.clientX+12}px,${e.clientY+12}px)`;
  root.querySelectorAll('.ogham-drop-center,.ogham-drop-edge,.ogham-drop-over').forEach(el=>el.classList.remove('ogham-drop-center','ogham-drop-edge','ogham-drop-over'));
  const hit=document.elementFromPoint(e.clientX,e.clientY),pane=hit?.closest('[data-og-inventory]');if(pane&&pane.dataset.ogInventory===active.source)scrollInventoryEdge(pane,e.clientY);const target=groupDropTarget(document.elementFromPoint(e.clientX,e.clientY));if(target&&target.kind!=='inventory')target.el.classList.add(target.kind==='rune'&&dropPlacement(target.el,e.clientX)!=='center'?'ogham-drop-edge':'ogham-drop-center');
 },{signal:ctrl.signal,passive:false});
 document.addEventListener('pointerup',e=>{if(!active||active.pointerId!==e.pointerId)return;const snap={...active};cleanup();if(!snap.moved)return;
  suppressRuneClickUntil=Date.now()+450;const target=groupDropTarget(document.elementFromPoint(e.clientX,e.clientY));if(target)applyInventoryDrop(s,arcana,snap.source,target,e.clientX,snap);
 },{signal:ctrl.signal});
 document.addEventListener('pointercancel',e=>{if(active?.pointerId===e.pointerId)cleanup();},{signal:ctrl.signal});
}
function renderInventory(root,s,arcana){init(s);
 const count=equipped(s,arcana).length;
 root.innerHTML=`<div class="ogham-top"><label>${esc(tr('arcana'))}${selector(arcana)}</label><label>${esc(tr('awakening'))}<select id="ogham-awaken">${Array.from({length:51},(_,i)=>`<option value="${i}" ${i===(s.awakening[arcana]??20)?'selected':''}>${i}</option>`).join('')}</select></label><small title="${esc(tr('pointsNote'))}">${esc(tr('region'))} ⓘ</small></div>
<div class="ogham-main-grid"><div class="ogham-main-loadout"><section class="card ogham-loadout-panel"><div class="ogham-section-head"><h3>${esc(tr('loadout'))} · ${esc(arcanaLabel(arcana))}</h3><span>${count}/5</span></div>
 <div class="ogham-board" aria-label="${esc(tr('loadout'))}">
  <svg class="ogham-board-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="50,13 86,40 73,85 27,85 14,40"/><path d="M 50 13 L 73 85 L 14 40 L 86 40 L 27 85 Z"/></svg>
  <div class="ogham-board-center" aria-hidden="true"><span>✧</span><small>${count}/5</small></div>
  ${Array.from({length:5},(_,i)=>loadoutSlot(s,arcana,i)).join('')}
 </div>
 ${selectedSocketDetails(s,arcana)}
 <p class="ogham-action-hint" id="ogham-equip-hint" role="status">${esc(picked?.fromSlot!=null?'':picked?tr('selectedRune')+': '+(findRune(s,picked.id)?.name||findRune(s,picked.id)?.word||'')+' · '+tr('tapToEquip'):tr('tapInstruction'))}</p>
 <details class="ogham-compact-combos"><summary>${esc(tr('combinations'))} <span>${combinations(s,arcana).filter(x=>x.active).length}/${combinations(s,arcana).length}</span> ⓘ</summary><div class="ogham-combinations">${combinations(s,arcana).map(r=>`<article class="ogham-combo ${r.ready?'ready':''}"><strong>${esc(recipeName(r))}</strong>${r.upcoming?`<small class="ogham-upcoming">${esc(tr('upcoming'))}</small>`:''}<div class="ogham-combo-words">${r.words.map(w=>`<span class="${r.missing.includes(w)?'missing':''}">${wordIcon(w)}${esc(w)}</span>`).join('')}</div><small>${r.points}/9 ${esc(tr('points'))} · ${r.active?tr('active'):r.ready?tr('upcoming'):r.missing.length?tr('missing')+': '+r.missing.join(', '):tr('notEnough')}</small></article>`).join('')}</div></details>
 <details class="ogham-recommend"><summary title="${esc(tr('pointsNote'))}">${esc(tr('recommend'))} ⓘ</summary>${recommendations(s,arcana).map(r=>`<p><strong>${esc(recipeName(r))}</strong> — ${r.words.map(w=>esc(w)).join(' + ')} · ${esc(tr('owned'))} ${r.used.length}/3 · ${esc(tr('missing'))}: ${r.missing.length?r.missing.join(', '):'—'} · ${r.points}/9</p>`).join('')}</details>
</section></div><div class="ogham-main-inventory"><div class="ogham-inventory-tools card"><label class="ogham-search-label">${esc(tr('search'))}<input id="ogham-search" type="search" autocomplete="off" value="${esc(search)}" placeholder="${esc(tr('searchHint'))}"></label><label class="ogham-sort-label">${esc(tr('sortBy'))}<select id="ogham-sort">${SORTS.map(m=>`<option value="${m}" ${s.inventoryPrefs.sort===m?'selected':''}>${esc(tr('sort'+m[0].toUpperCase()+m.slice(1)))}</option>`).join('')}</select></label></div>
<small id="ogham-search-status" class="ogham-search-status" role="status" aria-live="polite"></small>
<section class="card ogham-inventory-panel" id="ogham-inventory-drop"><div class="ogham-section-head"><h3>${esc(tr('ownedInventory'))} (${s.runes.length})</h3><div class="ogham-section-actions"><button type="button" data-og-group-add="owned" title="${esc(tr('groupCreateHint'))}">▣ + ${esc(tr('newGroup'))}</button><button type="button" class="primary" id="ogham-add">+ ${esc(tr('newRune'))}</button></div></div>
<div class="ogham-inventory" title="${esc(tr('inventoryDragHint'))}" data-og-inventory="owned" tabindex="0" role="region" aria-label="${esc(tr('ownedInventory'))}">${renderCollection(s,arcana,'owned')||`<p class="hint">${esc(tr('empty'))}</p>`}</div></section>
<section class="card ogham-inventory-panel ogham-simulated-panel"><div class="ogham-section-head"><h3 title="${esc(tr('simInventoryNote'))}">🎲 ${esc(tr('simInventory'))} (${s.simulatedRunes.length})</h3><div class="ogham-section-actions"><button type="button" data-og-group-add="simulated" title="${esc(tr('groupCreateHint'))}">▣ + ${esc(tr('newGroup'))}</button><button type="button" id="ogham-open-sim">${esc(tr('simJump'))}</button></div></div>
<div class="ogham-inventory" title="${esc(tr('inventoryDragHint'))}" data-og-inventory="simulated" tabindex="0" role="region" aria-label="${esc(tr('simInventory'))}">${renderCollection(s,arcana,'simulated')||`<p class="hint">${esc(tr('simEmpty'))}</p>`}</div></section></div></div>
${renderEquippedTotals(s,arcana)}
${renderCompare(s,arcana)}
${pickerMode?runeWordPicker():editing?editor(s):''}<p class="hint">${esc(tr('source'))}: <a href="https://prilus.gitlab.io/en/ogham" target="_blank" rel="noopener noreferrer">Prilus Ogham</a> · Nexon 2026 Ogham</p>`;
fitGlyphs(root);
root.querySelector('.ogham-totals-panel')?.addEventListener('toggle',e=>{totalsExpanded=e.target.open;});
root.querySelector('.ogham-compare-panel')?.addEventListener('toggle',e=>{compareExpanded=e.target.open;});
root.querySelectorAll('[data-og-compare-slot]').forEach(b=>b.addEventListener('click',()=>{comparePickingSlot=Number(b.dataset.ogCompareSlot);compareExpanded=true;paint()}));
root.querySelectorAll('[data-og-compare-close]').forEach(b=>b.addEventListener('click',()=>{comparePickingSlot=null;paint()}));
root.querySelectorAll('[data-og-compare-choose]').forEach(b=>b.addEventListener('click',()=>{if(comparePickingSlot===null)return;alternateEquip(s,arcana,comparePickingSlot,b.dataset.ogCompareChoose);comparePickingSlot=null;saveNow();paint()}));
root.querySelector('[data-og-compare-empty]')?.addEventListener('click',()=>{if(comparePickingSlot===null)return;alternateEquip(s,arcana,comparePickingSlot,null);comparePickingSlot=null;saveNow();paint()});
root.querySelector('#ogham-compare-copy')?.addEventListener('click',()=>{alternateCopy(s,arcana);saveNow();paint()});
root.querySelector('#ogham-compare-clear')?.addEventListener('click',()=>{alternateClear(s,arcana);saveNow();paint()});
root.querySelector('.ogham-compact-combos')?.addEventListener('toggle',e=>{if(e.target.open)fitGlyphs(e.target)});
root.querySelector('#ogham-arcana')?.addEventListener('change',e=>{picked=null;comparePickingSlot=null;currentArcana=e.target.value;paint()});
root.querySelector('#ogham-awaken')?.addEventListener('change',e=>{s.awakening[arcana]=clamp(e.target.value,0,50);picked=null;saveNow();paint()});
function selectRune(id,fromSlot=null){picked=picked?.id===id&&picked?.fromSlot===fromSlot?null:{id,fromSlot};paint();}
function putInSocket(i,payload){if(!payload?.id)return;let changed=false;
 if(payload.fromSlot!=null&&payload.fromSlot!==i){const old=s.loadouts[arcana]?.[i]||null;changed=equip(s,arcana,i,payload.id);if(changed&&old)equip(s,arcana,payload.fromSlot,old);}
 else changed=equip(s,arcana,i,payload.id);
 if(changed){picked=null;dragging=null;saveNow();paint();} }
root.querySelectorAll('[data-og-pick]').forEach(b=>{
 b.addEventListener('click',()=>{if(Date.now()<suppressRuneClickUntil)return;const id=b.dataset.ogPick;if(selectedGroup){const source=b.closest('[data-og-inventory]')?.dataset.ogInventory;if(groupSource(s,selectedGroup)===source&&assignGroup(s,id,selectedGroup)){selectedGroup=null;picked=null;saveNow();paint();return;}}selectRune(id)});
 b.addEventListener('dragstart',e=>{dragging={id:b.dataset.ogPick,fromSlot:null,kind:'rune',source:b.closest('[data-og-inventory]')?.dataset.ogInventory};e.dataTransfer?.setData('text/plain',dragging.id);if(e.dataTransfer)e.dataTransfer.effectAllowed='move';b.classList.add('ogham-dragging')});
 b.addEventListener('dragend',()=>{dragging=null;b.classList.remove('ogham-dragging')});
});
// DnD on a rune's center creates/joins a box. Dropping at either edge moves
// the rune beside it instead. This distinction avoids accidental grouping.
root.querySelectorAll('.ogham-rune-card').forEach(card=>{
 card.addEventListener('dragover',e=>{if(!dragging||dragging.fromSlot!=null)return;const src=card.closest('[data-og-inventory]')?.dataset.ogInventory;if(src!==dragging.source)return;e.preventDefault();e.stopPropagation();card.classList.toggle('ogham-drop-edge',dropPlacement(card,e.clientX)!=='center');card.classList.toggle('ogham-drop-center',dropPlacement(card,e.clientX)==='center');});
 card.addEventListener('dragleave',()=>card.classList.remove('ogham-drop-center','ogham-drop-edge'));
 card.addEventListener('drop',e=>{if(!dragging||dragging.fromSlot!=null)return;const src=card.closest('[data-og-inventory]')?.dataset.ogInventory;if(src!==dragging.source)return;e.preventDefault();e.stopPropagation();applyInventoryDrop(s,arcana,src,{kind:'rune',id:card.dataset.ogRuneId,el:card},e.clientX)});
});
// Always-visible, expandable-by-content group containers. Naming is optional;
// the x button dissolves the container but never deletes a rune.
let lastGroupTap={id:null,time:0};let lastGroupRenameAt=0;
root.querySelectorAll('[data-og-group-add]').forEach(b=>b.addEventListener('click',()=>{const g=createGroup(s,b.dataset.ogGroupAdd);if(g){selectedGroup=g.id;saveNow();paint()}}));
root.querySelectorAll('[data-og-group-remove]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();if(dissolveGroup(s,b.dataset.ogGroupRemove)){selectedGroup=null;saveNow();paint()}}));
root.querySelectorAll('[data-og-group-move]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();if(moveGroup(s,b.dataset.ogGroupMove,Number(b.dataset.ogDirection))){saveNow();paint()}}));
root.querySelectorAll('.ogham-group-box').forEach(box=>{
 const id=box.dataset.ogContainerId,source=box.dataset.ogGroupSource;
 const select=e=>{if(Date.now()<suppressRuneClickUntil)return;if(e.target.closest('.ogham-rune-card,.ogham-group-tools'))return;
  if(picked&&picked.fromSlot==null&&groupSource(s,id)===source){if(assignGroup(s,picked.id,id)){picked=null;selectedGroup=null;saveNow();paint();}return;}
  selectedGroup=selectedGroup===id?null:id;root.querySelectorAll('.ogham-group-box').forEach(el=>el.classList.toggle('ogham-group-selected',el.dataset.ogContainerId===selectedGroup));
  const now=Date.now();if(lastGroupTap.id===id&&now-lastGroupTap.time<430){lastGroupTap={id:null,time:0};lastGroupRenameAt=Date.now();renameGroupUI(s,id);return;}lastGroupTap={id,time:now};
 };
 box.querySelector('.ogham-group-handle')?.addEventListener('click',select);
 box.addEventListener('dblclick',e=>{if(e.target.closest('.ogham-rune-card,.ogham-group-tools')||Date.now()-lastGroupRenameAt<550)return;lastGroupTap={id:null,time:0};lastGroupRenameAt=Date.now();renameGroupUI(s,id)});
 box.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===box){e.preventDefault();select(e);}});
 const handle=box.querySelector('.ogham-group-handle');
 handle?.addEventListener('dragstart',e=>{dragging={id,kind:'group',source,fromSlot:null};e.dataTransfer?.setData('text/plain',groupToken(id));if(e.dataTransfer)e.dataTransfer.effectAllowed='move';box.classList.add('ogham-dragging')});
 handle?.addEventListener('dragend',()=>{dragging=null;box.classList.remove('ogham-dragging')});
 box.addEventListener('dragover',e=>{if(!dragging||dragging.fromSlot!=null||dragging.source!==source||e.target.closest('.ogham-rune-card'))return;e.preventDefault();e.stopPropagation();box.classList.add('ogham-drop-center')});
 box.addEventListener('dragleave',e=>{if(!box.contains(e.relatedTarget))box.classList.remove('ogham-drop-center')});
 box.addEventListener('drop',e=>{if(!dragging||dragging.fromSlot!=null||dragging.source!==source||e.target.closest('.ogham-rune-card'))return;e.preventDefault();e.stopPropagation();applyInventoryDrop(s,arcana,source,{kind:'group',id,el:box},e.clientX)});
});
root.querySelectorAll('[data-og-slot]').forEach(b=>{
 const i=Number(b.dataset.ogSlot);
 b.addEventListener('click',()=>{
  const id=s.loadouts[arcana]?.[i];
  // The second tap on the same occupied socket unequips without touching inventory.
  // A first tap opens details; a tap on another socket moves/swaps as before.
  if(id&&picked?.id===id&&picked?.fromSlot===i){equip(s,arcana,i,'');picked=null;saveNow();paint();}
  else if(picked)putInSocket(i,picked);
  else if(id)selectRune(id,i);
 });
 b.addEventListener('dragstart',e=>{const id=s.loadouts[arcana]?.[i];if(!id){e.preventDefault();return;}dragging={id,fromSlot:i};e.dataTransfer?.setData('text/plain',id);if(e.dataTransfer)e.dataTransfer.effectAllowed='move';});
 b.addEventListener('dragend',()=>{dragging=null;root.querySelectorAll('.ogham-drop-over').forEach(x=>x.classList.remove('ogham-drop-over'))});
 b.addEventListener('dragover',e=>{if(dragging&&!b.disabled){e.preventDefault();b.closest('.ogham-slot')?.classList.add('ogham-drop-over')}});
 b.addEventListener('dragleave',()=>b.closest('.ogham-slot')?.classList.remove('ogham-drop-over'));
 b.addEventListener('drop',e=>{e.preventDefault();b.closest('.ogham-slot')?.classList.remove('ogham-drop-over');if(dragging)putInSocket(i,dragging)});
});
root.querySelectorAll('[data-og-inventory]').forEach(inventoryZone=>{
 const source=inventoryZone.dataset.ogInventory;
 inventoryZone.addEventListener('dragover',e=>{if(dragging?.source===source)scrollInventoryEdge(inventoryZone,e.clientY)},{capture:true});
 inventoryZone.addEventListener('dragover',e=>{if(!dragging||e.target.closest('.ogham-rune-card,.ogham-group-box'))return;if(dragging.fromSlot!=null||dragging.source===source){e.preventDefault();inventoryZone.classList.add('ogham-drop-over')}});
 inventoryZone.addEventListener('dragleave',()=>inventoryZone.classList.remove('ogham-drop-over'));
 inventoryZone.addEventListener('drop',e=>{if(!dragging||e.target.closest('.ogham-rune-card,.ogham-group-box'))return;if(dragging.fromSlot!=null||dragging.source===source){e.preventDefault();inventoryZone.classList.remove('ogham-drop-over');applyInventoryDrop(s,arcana,source,{kind:'inventory',source,el:inventoryZone},e.clientX)}});
});
bindTouchGrouping(root,s,arcana);
root.querySelector('#ogham-add')?.addEventListener('click',()=>{pickerMode='add';editing=null;editingDraft=null;paint()});
root.querySelector('#ogham-search')?.addEventListener('input',e=>{search=e.target.value;updateSearchDisplay(root,s);root.querySelectorAll('[data-og-inventory]').forEach(p=>p.scrollTop=0)});
root.querySelector('#ogham-open-sim')?.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('midir-ogham-open-sim')));
root.querySelector('#ogham-sort')?.addEventListener('change',e=>{s.inventoryPrefs.sort=e.target.value;saveNow();paint()});
root.querySelectorAll('[data-og-favorite]').forEach(b=>b.addEventListener('click',()=>{const rune=findRune(s,b.dataset.ogFavorite);if(rune){favoriteRune(s,rune.id,!rune.favorite);saveNow();paint()}}));
root.querySelectorAll('[data-og-pick],[data-og-group-handle]').forEach(b=>b.addEventListener('keydown',e=>{if(!e.altKey||!['ArrowUp','ArrowDown'].includes(e.key)||normSearch(search)||s.inventoryPrefs.sort!=='manual')return;const id=b.dataset.ogPick,group=b.dataset.ogGroupHandle;if(id&&findRune(s,id)?.groupId)return;e.preventDefault();const direction=e.key==='ArrowUp'?-1:1;if(id?moveRune(s,id,direction):moveGroup(s,group,direction)){saveNow();paint();Array.from(root.querySelectorAll('[data-og-pick],[data-og-group-handle]')).find(el=>id?el.dataset.ogPick===id:el.dataset.ogGroupHandle===group)?.focus({preventScroll:true});}}));
root.querySelectorAll('[data-og-sim-load]').forEach(b=>b.addEventListener('click',()=>{if(loadSimulatedRune(s,b.dataset.ogSimLoad)){saveNow();window.dispatchEvent(new CustomEvent('midir-ogham-open-sim'));}}));
root.querySelectorAll('[data-og-edit]').forEach(e=>e.addEventListener('click',()=>{beginRuneEdit(s,e.dataset.ogEdit);paint()}));
root.querySelectorAll('[data-og-remove]').forEach(e=>e.addEventListener('click',()=>{if(!window.confirm||window.confirm(tr('remove')+'?')){removeRune(s,e.dataset.ogRemove);if(picked?.id===e.dataset.ogRemove)picked=null;editing=null;saveNow();paint()}}));
const editorEl=root.querySelector('#ogham-editor');if(editorEl)bindEditor(editorEl,s);bindRuneWordPicker(root,s);
}
function editor(s){
 const r=editingDraft;if(!r)return '';
 const lineRows=Array.from({length:GRADES[r.grade]},(_,i)=>{
  const line=r.lines[i]||{id:'',level:0},effect=allowed(r.word,null,s).find(a=>a.id===line.id);
  const custom=!!line.id&&!effect,display=effect?`${effectName(effect.id)} · ${effectBonus(effect,clamp(line.level||1,1,maxEffectLevel(effect)))}`:custom?tr('customEffect'):tr('noEffectBonus');
  return `<div class="ogham-line"><label>${esc(tr('effect'))} ${i+1}${effectSelect(line.id,`data-og-line="${i}"`,r.word,s)}<input aria-label="${esc(tr('customEffect'))}" data-og-custom="${i}" maxlength="90" placeholder="${esc(tr('customEffect'))}" value="${esc(custom?line.id:'')}" ${custom?'':'hidden'}></label><label class="ogham-line-level">${esc(tr('level'))}<span data-og-level-wrap="${i}">${effectLevelControl(effect,i,line.level)}</span></label><small class="ogham-line-bonus" data-og-level-bonus="${i}">${esc(display)}</small></div>`;
 }).join('');
 return `<div class="ogham-edit-overlay"><section class="ogham-editor card" id="ogham-editor" role="dialog" aria-modal="true" aria-label="${esc(tr('edit'))}"><header><h3>${esc(tr('edit'))}</h3><button type="button" data-og-cancel aria-label="${esc(tr('cancel'))}">×</button></header>
 <button type="button" id="ogham-edit-word" class="ogham-editor-word-pick" data-og-change-word aria-label="${esc(tr('changeWord'))}: ${esc(r.word)}">${runeTile(r,'ogham-editor-word-art')}<span><strong>${esc(r.word)}${SPECIAL.includes(r.word)?' ✦':''}</strong><small>${esc(tr('changeWord'))}</small></span><span aria-hidden="true">›</span></button>
 <label>${esc(tr('grade'))}${SPECIAL.includes(r.word)?`<select data-og-grade disabled><option value="masterwork">${esc(labelGrade('masterwork'))}</option></select>`:gradeSelect(r.grade)}</label>
 <h4>${esc(tr('effects'))}</h4>${lineRows}
 <div class="button-row"><button type="button" class="primary" data-og-commit>${esc(tr('save'))}</button><button type="button" data-og-cancel>${esc(tr('cancel'))}</button></div></section></div>`;
}
function bindEditor(root,s){
 if(!editingDraft)return;
 const capture=()=>{
  const r=editingDraft;
  // Existing nickname and notes metadata stays in old saves, but the compact
  // editor does not ask users to supply or change them.
  r.lines=Array.from(root.querySelectorAll('[data-og-line]'),e=>{
   const i=e.dataset.ogLine,id=e.value==='custom'?String(root.querySelector(`[data-og-custom="${i}"]`)?.value||'').trim().slice(0,90):e.value;
   return {id,level:clamp(root.querySelector(`[data-og-line-level="${i}"]`)?.value,1,1000)};
  });
  r.lines=normalizedLines(r.lines,r.grade);
 };
 root.querySelectorAll('[data-og-cancel]').forEach(b=>b.addEventListener('click',()=>{endRuneEdit();paint()}));
 root.querySelector('[data-og-change-word]')?.addEventListener('click',()=>{capture();pickerMode='change';paint()});
 root.querySelector('[data-og-grade]')?.addEventListener('change',e=>{capture();editingDraft.grade=e.target.value;editingDraft.lines=normalizedLines(editingDraft.lines,editingDraft.grade);paint()});
 const updateBonus=i=>{const id=root.querySelector(`[data-og-line="${i}"]`)?.value,effect=allowed(editingDraft.word,null,s).find(a=>a.id===id),level=Number(root.querySelector(`[data-og-line-level="${i}"]`)?.value)||1,bonus=root.querySelector(`[data-og-level-bonus="${i}"]`);
  if(bonus)bonus.textContent=effect?effectName(effect.id)+' · '+effectBonus(effect,level):id==='custom'?tr('customEffect'):tr('noEffectBonus');};
 root.querySelectorAll('[data-og-line]').forEach(e=>e.addEventListener('change',()=>{
  const i=Number(e.dataset.ogLine),isCustom=e.value==='custom';
  const custom=root.querySelector(`[data-og-custom="${i}"]`);if(custom){custom.hidden=!isCustom;if(isCustom)custom.value='';}
  const effect=allowed(editingDraft.word,null,s).find(a=>a.id===e.value);
  const wrap=root.querySelector(`[data-og-level-wrap="${i}"]`);
  if(wrap)wrap.innerHTML=effectLevelControl(effect,i,1);
  updateBonus(i);
 }));
 root.querySelectorAll('[data-og-level-wrap]').forEach(el=>el.addEventListener('change',()=>updateBonus(Number(el.dataset.ogLevelWrap))));
 root.querySelector('[data-og-commit]')?.addEventListener('click',()=>{
  capture();const r=editingDraft;
  if(editing==='__new__'){
   const created=addRune(s,r.word,r.grade);
   if(!created)return;
   updateRune(s,created.id,r);
  }else updateRune(s,editing,r);
  endRuneEdit();saveNow();paint();
 });
}
function saveNow(){currentContext?.save?.();}
function paint(){if(!currentContext)return;const root=document.getElementById('ogham-root');if(!root)return;const oldY=window.scrollY,panes=['[data-og-inventory="owned"]','[data-og-inventory="simulated"]','.ogham-compare-inline-picker .ogham-compare-picker-grid'],offsets=panes.map(sel=>root.querySelector(sel)?.scrollTop||0);renderInventory(root,currentContext.state,currentArcana);window.MIDIR_I18N?.apply?.(root);panes.forEach((sel,i)=>{const pane=root.querySelector(sel);if(pane)pane.scrollTop=offsets[i];});window.scrollTo?.(0,oldY);}
function mount(s,arcana,save){currentContext={state:init(s),save};currentArcana=ARCANA.some(x=>x[0]===arcana)?arcana:'hs';paint();}
// Rerolls are a standalone practice mode in the pre-existing EV simulator.
// The interactive category/Arcana is only a browsing aid. A special word rolls all
// effects, including other Arcana. This is Prilus's abilityPool rule.
const catalogItems=()=>Array.isArray(window.MIDIR_OGHAM_CATALOG?.abilities)?window.MIDIR_OGHAM_CATALOG.abilities:null;
let loadedCatalog=null,lastCatalogRef=null;
function normalizeCatalog(raw){
 const items=Array.isArray(raw)?raw:Array.isArray(raw?.OghamAbilityList)?raw.OghamAbilityList:raw?.abilities;
 if(!Array.isArray(items)||!items.length)return null;
 const normalized=items.map(a=>{
  const id=Number(a.Id??a.id),values=a.Values??a.values;
  if(!Number.isSafeInteger(id)||id<=0||!Array.isArray(values)||!values.length||!values.every(v=>Number.isFinite(Number(v))))return null;
  const descriptions=a.Desc??a.desc??{};
  const localized={en:typeof a.en==='string'?a.en:(typeof descriptions.en==='string'?descriptions.en:(typeof descriptions.EN==='string'?descriptions.EN:'')),ko:typeof a.ko==='string'?a.ko:(typeof descriptions.ko==='string'?descriptions.ko:(typeof descriptions.KO==='string'?descriptions.KO:'')),es:typeof a.es==='string'?a.es:(typeof descriptions.es==='string'?descriptions.es:'')};
  // Never use foreign-language names as fallback for the selected interface.
  if(!localized.en||!localized.ko)return null;
  return {id:'src:'+id,sourceId:id,en:localized.en,ko:localized.ko,es:localized.es||localized.en,values:values.map(Number),max:values.length,general:!!(a.GeneralPool??a.general),special:!(a.GeneralPool??a.general),unit:String(a.Unit??a.unit??''),derived:!!a.EndpointDerived,source:true};
 }).filter(Boolean);
 if(!normalized.length||new Set(normalized.map(a=>a.id)).size!==normalized.length)return null;
 return normalized;
}
function migrateLegacyEffectIds(s,items){
 // Old draft IDs were user-facing labels, not the official Ogham ability IDs.
 // Preserve both owned lines and the isolated reroll lines during the transition.
 if(!s||s.catalog||s.effectLevelsSchema===1||!Array.isArray(items)||items.length<97)return;
 const fromName={
  heal:'Healing Max HP Recovery',partyHeal:'Party Healing Max HP Recovery',magic:'Magic Attack',
  act2:'Act 2: Threshold Cutter Damage',act1:'Act 1: Inciting Incident Damage',
  act4:'Act 4: Rising Action Damage',act7:'Act 7: Climactic Crash Damage',
  magnum:'Magnum Shot - Damage',crash:'Crash Shot - Fragment Damage',
  litany:'Resonant Litany - Damage',echoes:'Echoes of Salvation - Damage',
  pulse:'Pulse of Purification - Damage',downbeat:'Downbeat Drop - Damage',
  tempo:'Relentless Tempo - Damage',
  showstopper:'Showstopper - Colossus, Pierrot, and Echo Marionette Additional Damage',
  livewire:'Live Wire - Damage',aqua:'Aqua Volley - Max Damage',ignis:'Ignis Plume - Damage'};
 const byName=new Map(items.map(x=>[x.en,x]));
 const update=lines=>{for(const line of (Array.isArray(lines)?lines:[])){
  const replacement=byName.get(fromName[line?.id]);if(replacement){line.id=replacement.id;
   line.level=clamp(line.level,1,maxEffectLevel(replacement));}
 }};
 for(const rune of (s.runes||[]))update(rune.lines);
 update(s.sim?.lines);s.effectLevelsSchema=1;
}
function activeEffects(s){
 const ref=s?.catalog||catalogItems();if(lastCatalogRef!==ref){lastCatalogRef=ref;loadedCatalog=normalizeCatalog(ref);}
 if(loadedCatalog){migrateLegacyEffectIds(s,loadedCatalog);return loadedCatalog;}
 return ATTR.map(a=>({...a,general:!a.special,values:Array.from({length:a.max},(_,i)=>i+1)}));
}
function allowed(word,arcana,s){const list=activeEffects(s);return SPECIAL.includes(word)?list:list.filter(a=>a.general);}
const maxLockCount=grade=>Math.max(0,(GRADES[grade]||1)-1);
const maxEffectLevel=(effect)=>Array.isArray(effect?.values)?effect.values.length:Math.max(1,effect?.max||1);
function effectBonus(effect,level){
 const val=effect?.values?.[Number(level)-1];
 return val==null?'—':('+'+Number(val).toLocaleString('en-US',{maximumFractionDigits:4})+(effect.unit||''));
}
function effectLevelControl(effect,index,level){
 const tag=`data-og-line-level="${index}"`;
 if(!effect)return `<input type="number" min="1" max="1000" step="1" ${tag} value="${clamp(level||1,1,1000)}">`;
 const current=clamp(level||1,1,maxEffectLevel(effect));
 return `<select ${tag} aria-label="${esc(tr('level'))} ${index+1}">${effect.values.map((_,i)=>`<option value="${i+1}" ${current===i+1?'selected':''}>${i+1}</option>`).join('')}</select>`;
}

function effectText(effect){const lang=window.MIDIR_I18N?.language?.()||'en';return (effect?.[lang]||effect?.en||effect?.id||'')+(effect?.source?'':' · sample');}
function simInit(s){init(s);const sim=s.sim;if(!WORDS.includes(sim.word))sim.word='Beithe';if(!GRADE.includes(sim.grade))sim.grade='masterwork';if(SPECIAL.includes(sim.word))sim.grade='masterwork';delete sim.arcana; // Legacy simulator selection was redundant; rune rolls are Arcana-independent.
 sim.lines=Array.isArray(sim.lines)?sim.lines:[];sim.locks=Array.isArray(sim.locks)?sim.locks:[];sim.attempts=clamp(sim.attempts,0,999999999);sim.costs=sim.costs&&typeof sim.costs==='object'?sim.costs:{gold:0,herbs:{}};sim.costs.gold=Number(sim.costs.gold)||0;sim.costs.herbs=sim.costs.herbs&&typeof sim.costs.herbs==='object'?sim.costs.herbs:{};sim.baseAttempts=Math.max(0,Math.floor(Number(sim.baseAttempts)||0));sim.baseCosts=normalizeSpent(sim.baseCosts);
 if(sim.loadedRuneId&&!s.simulatedRunes.some(r=>r.id===sim.loadedRuneId))sim.loadedRuneId=null;sim.locks=sim.locks.slice(0,GRADES[sim.grade]).map(Boolean);let seen=0;sim.locks=sim.locks.map((lock,i)=>lock&&sim.lines[i]?.id&&seen<maxLockCount(sim.grade)?!!++seen:false);return sim;}
// Pure roll: locked effects and their levels remain; all chosen effects are unique.
function rngRoll(sim,random=Math.random,effects){const count=GRADES[sim.grade]||1,pool=effects||allowed(sim.word,null);let keep=sim.locks.slice(0,count).map(Boolean),usedLocks=0;keep=keep.map(x=>x&&usedLocks<maxLockCount(sim.grade)?!!++usedLocks:false);
 const used=new Set();const result=Array(count).fill(null);
 for(let i=0;i<count;i++){const line=sim.lines[i];if(keep[i]&&line?.id&&pool.some(a=>a.id===line.id)&&!used.has(line.id)){result[i]={id:line.id,level:clamp(line.level,1,maxEffectLevel(pool.find(a=>a.id===line.id)))};used.add(line.id);}else keep[i]=false;}
 for(let i=0;i<count;i++){if(result[i])continue;const candidates=pool.filter(a=>!used.has(a.id)&&maxEffectLevel(a)>0);if(!candidates.length)break;const pick=candidates[Math.min(candidates.length-1,Math.floor(random()*candidates.length))];used.add(pick.id);result[i]={id:pick.id,level:1+Math.min(maxEffectLevel(pick)-1,Math.floor(random()*maxEffectLevel(pick)))};}
 if(result.some(a=>!a))return false;
 sim.lines=result;sim.locks=keep;return true;
}
function simCost(sim){return herbCost(sim.grade,(sim.locks||[]).filter(Boolean).length);}
function availableResources(){const chest=window.MIDIR_REFORGE,herbs=window.MIDIR_HERBS;return {gold:Number(chest?.getGold?.()??0),herbs:herbs?.getState?.()?.counts||{},goldReady:!!chest?.spendGold,herbsReady:!!herbs?.spendHerbs,ready:!!chest?.spendGold&&!!herbs?.spendHerbs};}
function canPay(cost,res){if(!cost||!res||!Number.isFinite(cost.gold)||!res.goldReady&&!(res.ready===true)||res.gold<cost.gold)return false;const needsHerbs=Object.entries(cost.herbs||{}).filter(([,n])=>n>0);return !needsHerbs.length||((res.herbsReady||res.ready===true)&&needsHerbs.every(([key,count])=>(res.herbs?.[key]||0)>=count));}
function purchaseRoll(sim,random=Math.random,s){const cost=simCost(sim),resources=availableResources();if(!canPay(cost,resources))return false;
 // No asynchronous interleaving between preflight, gold spend, and herb spend.
 const rolled={...sim,lines:sim.lines.slice(),locks:sim.locks.slice()};if(!rngRoll(rolled,random,allowed(sim.word,null,s)))return false;
 if(!window.MIDIR_REFORGE.spendGold(cost.gold,true))return false;
 if(Object.keys(cost.herbs||{}).length&&!window.MIDIR_HERBS?.spendHerbs?.(cost.herbs)){
  window.MIDIR_REFORGE.creditGold?.(cost.gold,true);return false;
 }
 sim.lines=rolled.lines;sim.locks=rolled.locks;sim.attempts++;
 sim.costs.gold+=cost.gold;for(const [id,qty] of Object.entries(cost.herbs))sim.costs.herbs[id]=(sim.costs.herbs[id]||0)+qty;
 return true;
}
function simView(){return `<div id="ogham-sim-root" class="ogham-system"></div>`;}
let simPickingWord=false,simDisassembleConfirm=false;
function renderSim(root,s,save){const sim=simInit(s),pool=allowed(sim.word,null,s),price=simCost(sim),resources=availableResources(),enough=canPay(price,resources),maxLocks=maxLockCount(sim.grade);
 const herbNames=Object.fromEntries((window.MIDIR_HERBS?.catalog||[]).map(h=>[h.id,h.name]));
 const resourceRow=(herbs)=>Object.entries(herbs||{}).filter(([,n])=>n>0).map(([id,n])=>`<span class="ogham-herb-amount">${herbNames[id]?window.MIDIR_HERBS?.iconMarkup?.(id,'herb-resource-icon')||'':''}${esc(herbNames[id]||id)} ×${Number(n).toLocaleString()}</span>`).join(' ')||'—';
 root.innerHTML=`<div class="ogham-top"><div class="ogham-sim-word-choice"><small>${esc(tr('word'))}</small><button type="button" id="ogham-sim-word-picker" aria-label="${esc(tr('selectRuneWord'))}: ${esc(sim.word)}" title="${esc(tr('selectRuneWord'))}">${runeTile({word:sim.word,grade:sim.grade},'ogham-sim-word-art')}<span><strong>${esc(sim.word)}</strong><small>${esc(tr('selectRuneWord'))}</small></span><span aria-hidden="true">⌄</span></button></div><label>${esc(tr('grade'))}<select id="ogham-sim-grade" ${SPECIAL.includes(sim.word)?'disabled':''}>${GRADE.map(g=>`<option value="${g}" ${sim.grade===g?'selected':''}>${esc(labelGrade(g))}</option>`).join('')}</select></label></div>
 <p class="hint">${esc(tr('practice'))} · ${esc(tr('inventoryNote'))}</p><p class="hint">${esc(tr('official'))}</p>
 <div class="ogham-sim-lines">${Array.from({length:GRADES[sim.grade]},(_,i)=>{
 const line=sim.lines[i]||{id:'',level:0},a=pool.find(x=>x.id===line.id),locked=!!sim.locks[i],max=a?maxEffectLevel(a):0,high=!!a&&line.level>=Math.ceil(max*.9),perfect=!!a&&line.level===max,disabled=!locked&&(!a||sim.locks.filter(Boolean).length>=maxLocks),action=tr(locked?'unlockLine':'lock');
 return `<div class="ogham-sim-line${locked?' is-locked':''}${high?' is-high':''}${perfect?' is-perfect':''}"><button type="button" class="ogham-sim-lock" data-og-sim-lock="${i}" aria-pressed="${locked}" aria-label="${esc(action)} ${i+1}" title="${esc(action)} ${i+1}" ${disabled?'disabled':''}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="${locked?'M8 11V7a4 4 0 0 1 8 0v4':'M8 11V7a4 4 0 0 1 8 0'}"/><path d="M12 15v2"/></svg></button><div class="ogham-sim-line-readout"><strong>${a?esc(effectName(a.id)):esc(tr('rollToGetEffects'))}</strong><small>${a?esc(effectBonus(a,line.level||1)):'—'}</small></div>${a?`<span class="ogham-sim-level-value">${esc(tr('level'))} ${line.level}<small> / ${max}</small></span>`:''}</div>`;}).join('')}</div>
 <div class="button-row ogham-sim-action-row"><button class="primary" id="ogham-sim-roll" ${!enough?'disabled title="'+esc(tr('insufficient'))+'"':''}>🎲 ${esc(tr('roll'))}</button><div class="ogham-roll-price" id="ogham-sim-price" aria-live="polite"><small>${esc(tr('simRollCost'))}</small><strong>${price?.gold.toLocaleString()||0} ${esc(tr('gold'))}</strong>${Object.keys(price?.herbs||{}).length?`<span class="ogham-herb-list">${resourceRow(price?.herbs)}</span>`:''}</div><button id="ogham-sim-reset">${esc(tr('reset'))}</button></div>
 <div class="ogham-sim-save"><button type="button" id="ogham-sim-save" ${!normalizeSavedSim(sim)?'disabled':''}>✦ ${esc(tr('saveSimRune'))}</button>${sim.loadedRuneId?`<button type="button" id="ogham-sim-update" ${!normalizeSavedSim(sim)?'disabled':''}>✓ ${esc(tr('updateSimRune'))}</button>`:''}${sim.loadedRuneId||sim.costs.gold>0?`<button type="button" class="ogham-disassemble" id="ogham-sim-disassemble">${esc(tr(simDisassembleConfirm?'disassembleConfirm':'disassemble'))}</button>${simDisassembleConfirm?`<small>${esc(tr('disassembleWarning'))}</small>`:''}`:''}</div>
 <div id="ogham-sim-feedback" role="status">${esc(sim.notice||(!enough?tr('insufficient'):''))}</div>
 <div class="ogham-sim-totals"><strong>${esc(tr('attempts'))}: ${sim.attempts}</strong><span>${esc(tr('spending'))}: ${sim.costs.gold.toLocaleString()} ${esc(tr('gold'))}</span>${Object.values(sim.costs.herbs).some(Number)?`<span class="ogham-herb-list">${resourceRow(sim.costs.herbs)}</span>`:''}</div>${sim.loadedRuneId||sim.costs.gold>0?`<small class="ogham-disassemble-preview">${esc(tr('disassembleRefund'))}: ${disassembleRefund({spent:sim.costs}).rate}% · ${disassembleRefund({spent:sim.costs}).gold.toLocaleString()} ${esc(tr('gold'))}${Object.keys(disassembleRefund({spent:sim.costs}).herbs).length?' · '+resourceRow(disassembleRefund({spent:sim.costs}).herbs):''}</small>`:''}
 ${window.MIDIR_REFORGE?.storageChestView?.()||''}${simPickingWord?runeWordPicker():''}`;
 root.querySelector('#ogham-sim-word-picker')?.addEventListener('click',()=>{simPickingWord=true;renderSim(root,s,save)});
 root.querySelectorAll('[data-og-picker-cancel]').forEach(el=>el.addEventListener('click',()=>{simPickingWord=false;renderSim(root,s,save)}));
 root.querySelectorAll('[data-og-word-choose]').forEach(el=>el.addEventListener('click',()=>{sim.word=el.dataset.ogWordChoose;sim.loadedRuneId=null;simDisassembleConfirm=false;sim.attempts=0;sim.costs={gold:0,herbs:{}};sim.baseAttempts=0;sim.baseCosts={gold:0,herbs:{}};sim.grade=SPECIAL.includes(sim.word)?'masterwork':sim.grade;sim.lines=[];sim.locks=[];sim.notice='';simPickingWord=false;save();renderSim(root,s,save)}));
 root.querySelector('#ogham-sim-grade')?.addEventListener('change',e=>{sim.grade=e.target.value;sim.loadedRuneId=null;simDisassembleConfirm=false;sim.attempts=0;sim.costs={gold:0,herbs:{}};sim.baseAttempts=0;sim.baseCosts={gold:0,herbs:{}};sim.lines=[];sim.locks=[];sim.notice='';save();renderSim(root,s,save)});
 
 root.querySelectorAll('[data-og-sim-lock]').forEach(el=>el.addEventListener('click',()=>{const i=Number(el.dataset.ogSimLock);simDisassembleConfirm=false;sim.locks[i]=!sim.locks[i];simInit(s);save();renderSim(root,s,save);root.querySelector(`[data-og-sim-lock="${i}"]`)?.focus({preventScroll:true})}));
 root.querySelector('#ogham-sim-roll')?.addEventListener('click',()=>{simDisassembleConfirm=false;sim.notice=purchaseRoll(sim,Math.random,s)?'':tr('blocked');save();renderSim(root,s,save)});
 root.querySelector('#ogham-sim-save')?.addEventListener('click',()=>{const saved=saveSimulatedRune(s,sim);simDisassembleConfirm=false;sim.notice=saved?tr('simSaved'):tr('simNoLines');save();renderSim(root,s,save)});
 root.querySelector('#ogham-sim-update')?.addEventListener('click',()=>{const updated=saveSimulatedRune(s,sim,{updateId:sim.loadedRuneId});simDisassembleConfirm=false;sim.notice=updated?tr('simUpdated'):tr('simNoLines');save();renderSim(root,s,save)});
 root.querySelector('#ogham-sim-disassemble')?.addEventListener('click',()=>{if(!simDisassembleConfirm){simDisassembleConfirm=true;return renderSim(root,s,save);}const result=disassembleCurrentRune(s);simDisassembleConfirm=false;if(result){sim.loadedRuneId=null;sim.attempts=0;sim.baseAttempts=0;sim.costs={gold:0,herbs:{}};sim.baseCosts={gold:0,herbs:{}};sim.lines=[];sim.locks=[];sim.notice=tr('disassembled')+' '+result.gold.toLocaleString()+' '+tr('gold');}else sim.notice=tr('blocked');save();renderSim(root,s,save);});
 root.querySelector('#ogham-sim-reset')?.addEventListener('click',()=>{sim.loadedRuneId=null;simDisassembleConfirm=false;sim.attempts=0;sim.baseAttempts=0;sim.costs={gold:0,herbs:{}};sim.baseCosts={gold:0,herbs:{}};sim.lines=[];sim.locks=[];sim.notice='';save();renderSim(root,s,save)});
 fitGlyphs(root);
 window.MIDIR_I18N?.apply?.(root);
}

function mountSim(s,save){const root=document.getElementById('ogham-sim-root');if(root)renderSim(root,init(s),save);}
window.MIDIR_OGHAM={idsFor,alternateEquip,alternateCopy,alternateClear,effectsForIds,synergiesForIds,compareRuneSets,allRunes,findRune,saveSimulatedRune,loadSimulatedRune,disassembleRefund,disassembleSimulatedRune,disassembleCurrentRune,initInventory:inventoryList,inventoryMatch,inventoryBlocks,createGroup,assignGroup,combineRunes,positionRune,dissolveGroup,renameGroup,moveGroup,reorderItem,moveRune,favoriteRune,WORDS,SPECIAL,REGULAR,ARCANA,RECIPES,ATTR,COSTS,GRADES,wordIcon,fitGlyphs,allowed,maxLockCount,herbCost,normalizeCatalog,activeEffects,effectBonus,maxEffectLevel,availableResources,canPay,purchaseRoll,slotsAt,init,addRune,updateRune,removeRune,equip,equipped,combinations,recommendations,simInit,rngRoll,view,mount,simView,mountSim,tr};
})();
