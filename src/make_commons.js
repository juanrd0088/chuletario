// Común de la Liturgia de las Horas para cada santo del calendario de España
const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('commons_raw.json', 'utf8'));
const D = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const GEN_FIRST = ['cyril_constantine_the_philosopher_monk_and_methodius_michael_of_thessaloniki_bishop', 'catherine_of_siena_virgin',
  'benedict_of_nursia_abbot', 'bridget_of_sweden_religious', 'teresa_benedicta_of_the_cross_stein_virgin'];

// Ajustes manuales: romcal marca "None" cuando la Misa es propia; para las Horas hace falta el común
const M = {
  basil_the_great_and_gregory_nazianzen_bishops: ['Bishops', 'DoctorsOfTheChurch'], most_holy_name_of_jesus: ['PROP'],
  anthony_of_egypt_abbot: ['Religious'], conversion_of_saint_paul_the_apostle: ['APO'], timothy_of_ephesus_and_titus_of_crete_bishops: ['PastorsSeveral'],
  presentation_of_the_lord: ['PROP'], cyril_constantine_the_philosopher_monk_and_methodius_michael_of_thessaloniki_bishop: ['PastorsSeveral', 'Missionaries'],
  chair_of_saint_peter_the_apostle: ['APO'], perpetua_of_carthage_and_felicity_of_carthage_martyrs: ['Martyrs'], joseph_spouse_of_mary: ['PROP'],
  annunciation_of_the_lord: ['PROP'], mark_evangelist: ['APO'], catherine_of_siena_virgin: ['Virgins', 'DoctorsOfTheChurch'], joseph_the_worker: ['PROP'],
  athanasius_of_alexandria_bishop: ['Bishops', 'DoctorsOfTheChurch'], philip_and_james_apostles: ['APO'], matthias_apostle: ['APO'],
  philip_neri_priest: ['Pastors', 'Religious'], visitation_of_mary: ['BlessedVirginMary'], justin_martyr: ['Martyrs'], charles_lwanga_and_companions_martyrs: ['Martyrs'],
  barnabas_apostle: ['APO'], aloysius_gonzaga_religious: ['Religious'], nativity_of_john_the_baptist: ['PROP'], irenaeus_of_lyon_bishop: ['Martyrs', 'Bishops'],
  peter_and_paul_apostles: ['PROP'], thomas_apostle: ['APO'], benedict_of_nursia_abbot: ['Religious'], mary_magdalene: ['PROP'], bridget_of_sweden_religious: ['Religious'],
  james_apostle: ['APO'], joachim_and_anne_parents_of_mary: ['SaintsSeveral'], martha_of_bethany_mary_of_bethany_and_lazarus_of_bethany: ['SaintsSeveral'],
  ignatius_of_loyola_priest: ['Pastors', 'Religious'], transfiguration_of_the_lord: ['PROP'], dominic_de_guzman_priest: ['Pastors', 'Religious'],
  teresa_benedicta_of_the_cross_stein_virgin: ['VirginMartyrs'], lawrence_of_rome_deacon: ['Martyrs'], maximilian_mary_raymund_kolbe_priest: ['Martyrs', 'Pastors'],
  assumption_of_the_blessed_virgin_mary: ['PROP'], bernard_of_clairvaux_abbot: ['Religious', 'DoctorsOfTheChurch'], queenship_of_the_blessed_virgin_mary: ['BlessedVirginMary'],
  bartholomew_apostle: ['APO'], augustine_of_hippo_bishop: ['Bishops', 'DoctorsOfTheChurch'], passion_of_saint_john_the_baptist: ['PROP'],
  gregory_i_the_great_pope: ['Popes', 'DoctorsOfTheChurch'], nativity_of_the_blessed_virgin_mary: ['BlessedVirginMary'], most_holy_name_of_mary: ['BlessedVirginMary'],
  john_chrysostom_bishop: ['Bishops', 'DoctorsOfTheChurch'], exaltation_of_the_holy_cross: ['PROP'], our_lady_of_sorrows: ['BlessedVirginMary'],
  matthew_apostle: ['APO'], vincent_de_paul_priest: ['Pastors', 'MercyWorkers'], michael_gabriel_and_raphael_archangels: ['PROP'],
  jerome_of_stridon_priest: ['Pastors', 'DoctorsOfTheChurch'], therese_of_the_child_jesus_and_the_holy_face_of_lisieux_virgin: ['Virgins', 'DoctorsOfTheChurch'],
  holy_guardian_angels: ['PROP'], francis_of_assisi: ['Religious'], our_lady_of_the_rosary: ['BlessedVirginMary'], teresa_of_jesus_of_avila_virgin: ['Virgins', 'DoctorsOfTheChurch'],
  ignatius_of_antioch_bishop: ['Martyrs', 'Bishops'], luke_evangelist: ['APO'], paul_of_the_cross_priest: ['Pastors', 'Religious'], simon_and_jude_apostles: ['APO'],
  all_saints: ['PROP'], commemoration_of_all_the_faithful_departed: ['DIF'], dedication_of_the_lateran_basilica: ['DED'], leo_i_the_great_pope: ['Popes', 'DoctorsOfTheChurch'],
  martin_of_tours_bishop: ['Bishops'], josaphat_kuntsevych_bishop: ['Martyrs', 'Bishops'], dedication_of_the_basilicas_of_saints_peter_and_paul_apostles: ['PROP'],
  andrew_dung_lac_priest_and_companions_martyrs: ['Martyrs'], andrew_apostle: ['APO'], francis_xavier_priest: ['Missionaries'],
  ambrose_of_milan_bishop: ['Bishops', 'DoctorsOfTheChurch'], immaculate_conception_of_the_blessed_virgin_mary: ['PROP'], john_of_the_cross_priest: ['Pastors', 'DoctorsOfTheChurch'],
  stephen_the_first_martyr: ['Martyrs'], john_apostle: ['APO'], holy_innocents_martyrs: ['Martyrs'], our_lady_of_lourdes: ['BlessedVirginMary'],
  andrew_kim_tae_gon_priest_paul_chong_ha_sang_and_companions_martyrs: ['Martyrs'],
  // Propios de España
  eulogius_of_cordoba_bishop: ['Martyrs', 'Pastors'], fructuosus_of_tarragona_bishop_and_augurius_of_tarragona_and_eulogius_of_tarragona_deacons_martyrs: ['Martyrs'],
  vincent_of_saragossa_deacon: ['Martyrs'], ildephonsus_of_toledo_bishop: ['Bishops'], hermenegild_the_visigoths_martyr: ['Martyrs'],
  isidore_of_seville_bishop: ['Bishops', 'DoctorsOfTheChurch'], john_of_avila_priest: ['Pastors', 'DoctorsOfTheChurch'], isidore_the_farmer: ['Saints'],
  paschal_baylon_religious: ['Religious'], joaquina_of_saint_francis_of_assisi_de_vedruna_religious: ['Religious'], ferdinand_iii_of_castile: ['Saints'],
  maria_micaela_of_the_blessed_sacrament_desmaisieres_virgin: ['Virgins', 'Religious'], pelagius_of_cordoba_martyr: ['Martyrs'], our_lady_of_mount_carmel: ['BlessedVirginMary'],
  ezequiel_moreno_bishop: ['Bishops', 'Missionaries'], teresa_of_jesus_jornet_ibars_virgin: ['Virgins', 'Religious'], francis_borgia_priest: ['Pastors', 'Religious'],
  thomas_of_villanova_bishop: ['Bishops'], mary_soledad_torres_acosta_virgin: ['Virgins', 'Religious'], our_lady_of_the_pillar: ['BlessedVirginMary'],
  peter_of_alcantara_priest: ['Pastors', 'Religious'], peter_poveda_and_innocent_of_mary_immaculate_canoura_priests_and_companions_martyrs: ['Martyrs'],
  leander_of_seville_bishop: ['Bishops'], eulalia_of_merida_virgin: ['VirginMartyrs', 'Virgins'],
  MARIAIGLESIA: ['BlessedVirginMary'], INMCORAZON: ['BlessedVirginMary'], SUMOSACERDOTE: ['PROP']
};

const out = {};
for (const s of D.SANTORAL) {
  const id = s[0];
  let c = M[id] || raw[id] || null;
  if (c && c.length === 1 && c[0] === 'None') c = null;
  if (!c) { console.log('SIN COMÚN', id, s[5]); c = ['PROP']; }
  out[id] = c;
}
for (const k of ['MARIAIGLESIA', 'INMCORAZON', 'SUMOSACERDOTE']) out[k] = M[k];
fs.writeFileSync('commons.json', JSON.stringify(out));
console.log('ok', Object.keys(out).length);
