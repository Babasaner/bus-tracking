// ============================================================
// Dakar Dem Dikk — Complete Bus Lines Database
// Urban + Suburban lines with geocoded stops
// ============================================================

import type { BusLine } from "./dakar-bus-data"

// Shared coordinates for reuse
const STOPS = {
  // Plateau / Centre-ville
  PLACE_INDEPENDENCE: { lat: 14.6669, lng: -17.4354 },
  SANDAGA: { lat: 14.6717, lng: -17.4383 },
  PETERSEN: { lat: 14.6650, lng: -17.4328 },
  LECLERC: { lat: 14.6697, lng: -17.4361 },
  PALAIS: { lat: 14.6644, lng: -17.4396 },
  EMBARCADERE: { lat: 14.6622, lng: -17.4319 },
  GARE_TER: { lat: 14.6653, lng: -17.4406 },
  MEDINA: { lat: 14.6836, lng: -17.4478 },
  
  // Médina / Centre
  POSTE_MEDINA: { lat: 14.6880, lng: -17.4490 },
  GUEULE_TAPEE: { lat: 14.6778, lng: -17.4478 },
  CANAL_4: { lat: 14.6950, lng: -17.4570 },
  HLM: { lat: 14.7100, lng: -17.4558 },
  FANN: { lat: 14.6964, lng: -17.4631 },
  UCAD: { lat: 14.6922, lng: -17.4619 },
  POINT_E: { lat: 14.6933, lng: -17.4642 },
  COLOBANE: { lat: 14.6889, lng: -17.4500 },
  CENTENAIRE: { lat: 14.7028, lng: -17.4539 },

  // Libertés / Nord
  LIBERTE_5: { lat: 14.7281, lng: -17.4636 },
  LIBERTE_6: { lat: 14.7231, lng: -17.4586 },
  CITE_DERKLE: { lat: 14.7200, lng: -17.4625 },
  ASECNA: { lat: 14.6775, lng: -17.4403 },
  FOIRE: { lat: 14.7017, lng: -17.4653 },
  VDN: { lat: 14.7136, lng: -17.4683 },
  JVC: { lat: 14.7267, lng: -17.4622 },

  // Parcelles / Grand Yoff
  PARCELLES_U26: { lat: 14.7667, lng: -17.4417 },
  PARCELLES_U17: { lat: 14.7700, lng: -17.4375 },
  GRAND_YOFF: { lat: 14.7414, lng: -17.4489 },
  SAP_POMPIERS: { lat: 14.7600, lng: -17.4450 },
  MARCHE_MEDINE: { lat: 14.7100, lng: -17.4510 },
  CAMBERENE: { lat: 14.7833, lng: -17.4417 },
  CAMBERENE_2: { lat: 14.7850, lng: -17.4400 },

  // Ouakam / Almadies
  OUAKAM: { lat: 14.7253, lng: -17.4878 },
  MERMOZ: { lat: 14.7183, lng: -17.4736 },
  NGOR: { lat: 14.7486, lng: -17.5089 },
  YOFF: { lat: 14.7533, lng: -17.4800 },
  AEROPORT_LSS: { lat: 14.7394, lng: -17.4894 },
  CITE_ASSEMBLEE: { lat: 14.7281, lng: -17.4822 },
  ENEA: { lat: 14.7100, lng: -17.4736 },

  // Guédiawaye / Pikine
  GUEDIAWAYE: { lat: 14.7753, lng: -17.3936 },
  SAM_NOTAIRE: { lat: 14.7700, lng: -17.4100 },
  PIKINE: { lat: 14.7575, lng: -17.3936 },
  THIAROYE: { lat: 14.7442, lng: -17.3753 },
  PATTE_DOIE: { lat: 14.7350, lng: -17.4400 },

  // Daroukhane / Corniche
  DAROUKHANE: { lat: 14.7914, lng: -17.4200 },
  CORNICHE_NORD: { lat: 14.7800, lng: -17.4350 },
  HANN_MARISTES: { lat: 14.7228, lng: -17.4264 },

  // Keur Massar / Malika
  KEUR_MASSAR: { lat: 14.7817, lng: -17.3133 },
  MALIKA: { lat: 14.7850, lng: -17.3417 },
  TERME_KEUR_MASSAR: { lat: 14.7790, lng: -17.3050 },

  // Rufisque / Banlieue
  RUFISQUE: { lat: 14.7167, lng: -17.2733 },
  BARGNY: { lat: 14.6986, lng: -17.2333 },
  YENNE: { lat: 14.6500, lng: -17.1500 },
  BAYAKH: { lat: 14.7500, lng: -17.1300 },

  // Diamniadio / AIBD
  DIAMNIADIO: { lat: 14.7117, lng: -17.1950 },
  AIBD: { lat: 14.7386, lng: -17.0836 },
  DDD_DIRECTION: { lat: 14.7200, lng: -17.4600 },
  AUTOROUTE_DAKAR: { lat: 14.7300, lng: -17.4400 },

  // Dieuppeul / Fann Résidence
  DIEUPPEUL: { lat: 14.7000, lng: -17.4580 },
  FANN_RESIDENCE: { lat: 14.6920, lng: -17.4639 },
  SORANO: { lat: 14.6722, lng: -17.4417 },

  // Baux Maraîchers
  BAUX_MARAICHERS: { lat: 14.7450, lng: -17.4550 },
  LAT_DIOR: { lat: 14.7100, lng: -17.4300 },
}

// Helper to make stop IDs
const s = (lineNum: string, name: string) => `dd-${lineNum}-${name.toLowerCase().replace(/\s+/g, "-")}`

export const DEM_DIKK_URBAN: BusLine[] = [
  // ────────────────────────────────────────────
  // LIGNE 1 — Parcelles Assainies ↔ Place Leclerc
  // ────────────────────────────────────────────
  {
    id: "dd-1",
    number: "1",
    name: "Parcelles Assainies ↔ Place Leclerc",
    color: "#1B6B3A",
    operator: "Dem Dikk",
    fare: 200,
    stops: [
      { id: s("1","parcelles"), name: "Parcelles Assainies", ...STOPS.PARCELLES_U26 },
      { id: s("1","sapeurs"), name: "Sapeurs Pompiers", ...STOPS.SAP_POMPIERS },
      { id: s("1","medine"), name: "Marché Grand Médine", ...STOPS.MARCHE_MEDINE },
      { id: s("1","ucad"), name: "UCAD", ...STOPS.UCAD },
      { id: s("1","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("1","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("1","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("1","gare-ter"), name: "Gare TER", ...STOPS.GARE_TER },
      { id: s("1","embarcadere"), name: "Embarcadère", ...STOPS.EMBARCADERE },
      { id: s("1","leclerc"), name: "Place Leclerc", ...STOPS.LECLERC },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 4 — Liberté 5 ↔ Place Leclerc
  // ────────────────────────────────────────────
  {
    id: "dd-4",
    number: "4",
    name: "Liberté 5 ↔ Place Leclerc",
    color: "#2D9D5C",
    operator: "Dem Dikk",
    fare: 200,
    stops: [
      { id: s("4","liberte5"), name: "Liberté 5", ...STOPS.LIBERTE_5 },
      { id: s("4","cite-derkle"), name: "Cité Derklé", ...STOPS.CITE_DERKLE },
      { id: s("4","point-e"), name: "Point E", ...STOPS.POINT_E },
      { id: s("4","canal4"), name: "Canal 4", ...STOPS.CANAL_4 },
      { id: s("4","gueule-tapee"), name: "Gueule Tapée", ...STOPS.GUEULE_TAPEE },
      { id: s("4","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("4","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("4","asecna"), name: "ASECNA", ...STOPS.ASECNA },
      { id: s("4","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("4","gare-ter"), name: "Gare TER", ...STOPS.GARE_TER },
      { id: s("4","embarcadere"), name: "Embarcadère", ...STOPS.EMBARCADERE },
      { id: s("4","leclerc"), name: "Place Leclerc", ...STOPS.LECLERC },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 7 — Ouakam ↔ AIBD
  // (via Plateau → VDN → Autoroute → Diamniadio)
  // ────────────────────────────────────────────
  {
    id: "dd-7",
    number: "7",
    name: "Ouakam ↔ AIBD",
    color: "#059669",
    operator: "Dem Dikk",
    fare: 500,
    stops: [
      { id: s("7","ouakam"), name: "Ouakam", ...STOPS.OUAKAM },
      { id: s("7","cite-assemblee"), name: "Cité Assemblée", ...STOPS.CITE_ASSEMBLEE },
      { id: s("7","enea"), name: "ENEA", ...STOPS.ENEA },
      { id: s("7","ucad"), name: "UCAD", ...STOPS.UCAD },
      { id: s("7","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("7","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("7","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("7","foire"), name: "Foire", ...STOPS.FOIRE },
      { id: s("7","vdn"), name: "VDN", ...STOPS.VDN },
      { id: s("7","ddd"), name: "Direction Générale DDD", ...STOPS.DDD_DIRECTION },
      { id: s("7","liberte6"), name: "Liberté 6", ...STOPS.LIBERTE_6 },
      { id: s("7","jvc"), name: "JVC", ...STOPS.JVC },
      { id: s("7","autoroute"), name: "Autoroute Dakar", ...STOPS.AUTOROUTE_DAKAR },
      { id: s("7","diamniadio"), name: "Diamniadio", ...STOPS.DIAMNIADIO },
      { id: s("7","aibd"), name: "AIBD (Aéroport)", ...STOPS.AIBD },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 8 — Aéroport LSS ↔ Palais
  // ────────────────────────────────────────────
  {
    id: "dd-8",
    number: "8",
    name: "Aéroport LSS ↔ Palais",
    color: "#10B981",
    operator: "Dem Dikk",
    fare: 300,
    stops: [
      { id: s("8","aeroport"), name: "Aéroport LSS", ...STOPS.AEROPORT_LSS },
      { id: s("8","yoff"), name: "Yoff", ...STOPS.YOFF },
      { id: s("8","liberte5"), name: "Liberté 5", ...STOPS.LIBERTE_5 },
      { id: s("8","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("8","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("8","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("8","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("8","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("8","palais"), name: "Palais", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 9 — Liberté 6 ↔ Palais
  // ────────────────────────────────────────────
  {
    id: "dd-9",
    number: "9",
    name: "Liberté 6 ↔ Palais",
    color: "#34D399",
    operator: "Dem Dikk",
    fare: 175,
    stops: [
      { id: s("9","liberte6"), name: "Liberté 6", ...STOPS.LIBERTE_6 },
      { id: s("9","vdn"), name: "VDN", ...STOPS.VDN },
      { id: s("9","foire"), name: "Foire", ...STOPS.FOIRE },
      { id: s("9","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("9","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("9","poste"), name: "Poste Médina", ...STOPS.POSTE_MEDINA },
      { id: s("9","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("9","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("9","palais"), name: "Palais", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 10 — Liberté 5 ↔ Palais (~35 stops)
  // ────────────────────────────────────────────
  {
    id: "dd-10",
    number: "10",
    name: "Liberté 5 ↔ Palais",
    color: "#6EE7B7",
    operator: "Dem Dikk",
    fare: 175,
    stops: [
      { id: s("10","liberte5"), name: "Liberté 5", ...STOPS.LIBERTE_5 },
      { id: s("10","cite-derkle"), name: "Cité Derklé", ...STOPS.CITE_DERKLE },
      { id: s("10","liberte6"), name: "Liberté 6", ...STOPS.LIBERTE_6 },
      { id: s("10","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("10","fann"), name: "Fann", ...STOPS.FANN },
      { id: s("10","fann-res"), name: "Fann Résidence", ...STOPS.FANN_RESIDENCE },
      { id: s("10","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("10","dieuppeul"), name: "Dieuppeul", ...STOPS.DIEUPPEUL },
      { id: s("10","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("10","gueule-tapee"), name: "Gueule Tapée", ...STOPS.GUEULE_TAPEE },
      { id: s("10","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("10","sorano"), name: "Sorano", ...STOPS.SORANO },
      { id: s("10","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("10","palais"), name: "Palais", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 13 — Liberté 5 ↔ Palais 2
  // ────────────────────────────────────────────
  {
    id: "dd-13",
    number: "13",
    name: "Liberté 5 ↔ Palais 2",
    color: "#047857",
    operator: "Dem Dikk",
    fare: 200,
    stops: [
      { id: s("13","liberte5"), name: "Liberté 5", ...STOPS.LIBERTE_5 },
      { id: s("13","patte-doie"), name: "Patte d'Oie", ...STOPS.PATTE_DOIE },
      { id: s("13","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("13","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("13","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("13","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("13","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("13","palais"), name: "Palais 2", lat: 14.6630, lng: -17.4410 },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 18 — Dieuppeul ↔ Centre-Ville (circulaire)
  // ────────────────────────────────────────────
  {
    id: "dd-18",
    number: "18",
    name: "Dieuppeul ↔ Centre-Ville (circulaire)",
    color: "#065F46",
    operator: "Dem Dikk",
    fare: 150,
    stops: [
      { id: s("18","dieuppeul"), name: "Dieuppeul", ...STOPS.DIEUPPEUL },
      { id: s("18","fann"), name: "Fann", ...STOPS.FANN },
      { id: s("18","ucad"), name: "UCAD", ...STOPS.UCAD },
      { id: s("18","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("18","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("18","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("18","sorano"), name: "Sorano", ...STOPS.SORANO },
      { id: s("18","sandaga-ret"), name: "Sandaga Retour", ...STOPS.SANDAGA },
      { id: s("18","medina-ret"), name: "Médina Retour", ...STOPS.MEDINA },
      { id: s("18","dieuppeul-ret"), name: "Dieuppeul", ...STOPS.DIEUPPEUL },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 20 — Dieuppeul ↔ Centre-Ville 2
  // ────────────────────────────────────────────
  {
    id: "dd-20",
    number: "20",
    name: "Dieuppeul ↔ Centre-Ville 2",
    color: "#064E3B",
    operator: "Dem Dikk",
    fare: 150,
    stops: [
      { id: s("20","dieuppeul"), name: "Dieuppeul", ...STOPS.DIEUPPEUL },
      { id: s("20","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("20","colobane"), name: "Colobane", ...STOPS.COLOBANE },
      { id: s("20","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("20","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("20","gare-ter"), name: "Gare TER", ...STOPS.GARE_TER },
      { id: s("20","petersen"), name: "Petersen", ...STOPS.PETERSEN },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 23 — Parcelles Assainies ↔ Palais 1
  // ────────────────────────────────────────────
  {
    id: "dd-23",
    number: "23",
    name: "Parcelles Assainies ↔ Palais 1",
    color: "#A7F3D0",
    operator: "Dem Dikk",
    fare: 200,
    stops: [
      { id: s("23","parcelles"), name: "Parcelles Assainies", ...STOPS.PARCELLES_U26 },
      { id: s("23","camberene"), name: "Cambérène", ...STOPS.CAMBERENE },
      { id: s("23","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("23","liberte6"), name: "Liberté 6", ...STOPS.LIBERTE_6 },
      { id: s("23","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("23","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("23","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("23","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("23","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("23","palais"), name: "Palais 1", ...STOPS.PALAIS },
    ],
  },
]

export const DEM_DIKK_SUBURBAN: BusLine[] = [
  // ────────────────────────────────────────────
  // LIGNE 2 — Daroukhane ↔ Place Leclerc (via Corniche)
  // ────────────────────────────────────────────
  {
    id: "dd-2",
    number: "2",
    name: "Daroukhane ↔ Place Leclerc",
    color: "#15803D",
    operator: "Dem Dikk",
    fare: 250,
    stops: [
      { id: s("2","daroukhane"), name: "Daroukhane", ...STOPS.DAROUKHANE },
      { id: s("2","corniche"), name: "Corniche Nord", ...STOPS.CORNICHE_NORD },
      { id: s("2","guediawaye"), name: "Guédiawaye", ...STOPS.GUEDIAWAYE },
      { id: s("2","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("2","poste-medina"), name: "Poste Médina", ...STOPS.POSTE_MEDINA },
      { id: s("2","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("2","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("2","gare"), name: "Gare TER", ...STOPS.GARE_TER },
      { id: s("2","leclerc"), name: "Place Leclerc", ...STOPS.LECLERC },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 5 — Guédiawaye ↔ Palais 1
  // ────────────────────────────────────────────
  {
    id: "dd-5",
    number: "5",
    name: "Guédiawaye ↔ Palais 1",
    color: "#16A34A",
    operator: "Dem Dikk",
    fare: 250,
    stops: [
      { id: s("5","guediawaye"), name: "Guédiawaye", ...STOPS.GUEDIAWAYE },
      { id: s("5","sam-notaire"), name: "Sam Notaire", ...STOPS.SAM_NOTAIRE },
      { id: s("5","patte-doie"), name: "Patte d'Oie", ...STOPS.PATTE_DOIE },
      { id: s("5","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("5","liberte6"), name: "Liberté 6", ...STOPS.LIBERTE_6 },
      { id: s("5","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("5","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("5","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("5","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("5","palais"), name: "Palais 1", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 6 — Cambérène 2 ↔ Palais 2
  // ────────────────────────────────────────────
  {
    id: "dd-6",
    number: "6",
    name: "Cambérène 2 ↔ Palais 2",
    color: "#4ADE80",
    operator: "Dem Dikk",
    fare: 250,
    stops: [
      { id: s("6","camberene2"), name: "Cambérène 2", ...STOPS.CAMBERENE_2 },
      { id: s("6","camberene"), name: "Cambérène", ...STOPS.CAMBERENE },
      { id: s("6","parcelles"), name: "Parcelles Assainies", ...STOPS.PARCELLES_U26 },
      { id: s("6","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("6","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("6","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("6","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("6","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("6","palais2"), name: "Palais 2", lat: 14.6630, lng: -17.4410 },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 11 — Keur Massar ↔ Lat-Dior
  // ────────────────────────────────────────────
  {
    id: "dd-11",
    number: "11",
    name: "Keur Massar ↔ Lat-Dior",
    color: "#86EFAC",
    operator: "Dem Dikk",
    fare: 300,
    stops: [
      { id: s("11","keur-massar"), name: "Keur Massar", ...STOPS.KEUR_MASSAR },
      { id: s("11","malika"), name: "Malika", ...STOPS.MALIKA },
      { id: s("11","pikine"), name: "Pikine", ...STOPS.PIKINE },
      { id: s("11","thiaroye"), name: "Thiaroye", ...STOPS.THIAROYE },
      { id: s("11","patte-doie"), name: "Patte d'Oie", ...STOPS.PATTE_DOIE },
      { id: s("11","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("11","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("11","lat-dior"), name: "Lat-Dior", ...STOPS.LAT_DIOR },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 12 — Guédiawaye ↔ Palais 1 (via Pikine)
  // ────────────────────────────────────────────
  {
    id: "dd-12",
    number: "12",
    name: "Guédiawaye ↔ Palais 1 (via Pikine)",
    color: "#BBF7D0",
    operator: "Dem Dikk",
    fare: 250,
    stops: [
      { id: s("12","guediawaye"), name: "Guédiawaye", ...STOPS.GUEDIAWAYE },
      { id: s("12","pikine"), name: "Pikine", ...STOPS.PIKINE },
      { id: s("12","thiaroye"), name: "Thiaroye", ...STOPS.THIAROYE },
      { id: s("12","hann"), name: "Hann Maristes", ...STOPS.HANN_MARISTES },
      { id: s("12","fann"), name: "Fann", ...STOPS.FANN },
      { id: s("12","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("12","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("12","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("12","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("12","palais"), name: "Palais 1", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 15A — Rufisque ↔ Palais 1 (via VDN)
  // ────────────────────────────────────────────
  {
    id: "dd-15A",
    number: "15A",
    name: "Rufisque ↔ Palais 1 (via VDN)",
    color: "#D1FAE5",
    operator: "Dem Dikk",
    fare: 400,
    stops: [
      { id: s("15A","rufisque"), name: "Rufisque", ...STOPS.RUFISQUE },
      { id: s("15A","thiaroye"), name: "Thiaroye", ...STOPS.THIAROYE },
      { id: s("15A","pikine"), name: "Pikine", ...STOPS.PIKINE },
      { id: s("15A","patte-doie"), name: "Patte d'Oie", ...STOPS.PATTE_DOIE },
      { id: s("15A","vdn"), name: "VDN", ...STOPS.VDN },
      { id: s("15A","foire"), name: "Foire", ...STOPS.FOIRE },
      { id: s("15A","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("15A","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("15A","palais"), name: "Palais 1", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 15B — Rufisque ↔ Palais 1 (via Centenaire)
  // ────────────────────────────────────────────
  {
    id: "dd-15B",
    number: "15B",
    name: "Rufisque ↔ Palais 1 (via Centenaire)",
    color: "#ECFDF5",
    operator: "Dem Dikk",
    fare: 400,
    stops: [
      { id: s("15B","rufisque"), name: "Rufisque", ...STOPS.RUFISQUE },
      { id: s("15B","bargny"), name: "Bargny", ...STOPS.BARGNY },
      { id: s("15B","pikine"), name: "Pikine", ...STOPS.PIKINE },
      { id: s("15B","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("15B","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("15B","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("15B","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("15B","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("15B","palais"), name: "Palais 1", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 16A — Malika ↔ Palais 1 (via VDN)
  // ────────────────────────────────────────────
  {
    id: "dd-16A",
    number: "16A",
    name: "Malika ↔ Palais 1 (via VDN)",
    color: "#1B6B3A",
    operator: "Dem Dikk",
    fare: 350,
    stops: [
      { id: s("16A","malika"), name: "Malika", ...STOPS.MALIKA },
      { id: s("16A","keur-massar"), name: "Keur Massar", ...STOPS.KEUR_MASSAR },
      { id: s("16A","pikine"), name: "Pikine", ...STOPS.PIKINE },
      { id: s("16A","patte-doie"), name: "Patte d'Oie", ...STOPS.PATTE_DOIE },
      { id: s("16A","vdn"), name: "VDN", ...STOPS.VDN },
      { id: s("16A","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("16A","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("16A","palais"), name: "Palais 1", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 16B — Malika ↔ Palais 1 (via Centenaire)
  // ────────────────────────────────────────────
  {
    id: "dd-16B",
    number: "16B",
    name: "Malika ↔ Palais 1 (via Centenaire)",
    color: "#166534",
    operator: "Dem Dikk",
    fare: 350,
    stops: [
      { id: s("16B","malika"), name: "Malika", ...STOPS.MALIKA },
      { id: s("16B","thiaroye"), name: "Thiaroye", ...STOPS.THIAROYE },
      { id: s("16B","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("16B","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("16B","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("16B","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("16B","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("16B","palais"), name: "Palais 1", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 208 — Bayakh ↔ Rufisque
  // ────────────────────────────────────────────
  {
    id: "dd-208",
    number: "208",
    name: "Bayakh ↔ Rufisque",
    color: "#22C55E",
    operator: "Dem Dikk",
    fare: 350,
    stops: [
      { id: s("208","bayakh"), name: "Bayakh", ...STOPS.BAYAKH },
      { id: s("208","rufisque"), name: "Rufisque", ...STOPS.RUFISQUE },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 227 — Terminus Keur Massar ↔ Parcelles
  // ────────────────────────────────────────────
  {
    id: "dd-227",
    number: "227",
    name: "Keur Massar ↔ Parcelles Assainies",
    color: "#4ADE80",
    operator: "Dem Dikk",
    fare: 300,
    stops: [
      { id: s("227","keur-massar"), name: "Terminus Keur Massar", ...STOPS.TERME_KEUR_MASSAR },
      { id: s("227","malika"), name: "Malika", ...STOPS.MALIKA },
      { id: s("227","pikine"), name: "Pikine", ...STOPS.PIKINE },
      { id: s("227","thiaroye"), name: "Thiaroye", ...STOPS.THIAROYE },
      { id: s("227","patte-doie"), name: "Patte d'Oie", ...STOPS.PATTE_DOIE },
      { id: s("227","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("227","parcelles"), name: "Parcelles Assainies", ...STOPS.PARCELLES_U26 },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 228 — Rufisque ↔ Yenne
  // ────────────────────────────────────────────
  {
    id: "dd-228",
    number: "228",
    name: "Rufisque ↔ Yenne",
    color: "#86EFAC",
    operator: "Dem Dikk",
    fare: 400,
    stops: [
      { id: s("228","rufisque"), name: "Rufisque", ...STOPS.RUFISQUE },
      { id: s("228","bargny"), name: "Bargny", ...STOPS.BARGNY },
      { id: s("228","yenne"), name: "Yenne", ...STOPS.YENNE },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 232 — Baux Maraîchers ↔ Aéroport LSS
  // ────────────────────────────────────────────
  {
    id: "dd-232",
    number: "232",
    name: "Baux Maraîchers ↔ Aéroport LSS",
    color: "#6EE7B7",
    operator: "Dem Dikk",
    fare: 250,
    stops: [
      { id: s("232","baux"), name: "Baux Maraîchers", ...STOPS.BAUX_MARAICHERS },
      { id: s("232","patte-doie"), name: "Patte d'Oie", ...STOPS.PATTE_DOIE },
      { id: s("232","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("232","liberte5"), name: "Liberté 5", ...STOPS.LIBERTE_5 },
      { id: s("232","yoff"), name: "Yoff", ...STOPS.YOFF },
      { id: s("232","aeroport"), name: "Aéroport LSS", ...STOPS.AEROPORT_LSS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 233 — Baux Maraîchers ↔ Palais
  // ────────────────────────────────────────────
  {
    id: "dd-233",
    number: "233",
    name: "Baux Maraîchers ↔ Palais",
    color: "#34D399",
    operator: "Dem Dikk",
    fare: 300,
    stops: [
      { id: s("233","baux"), name: "Baux Maraîchers", ...STOPS.BAUX_MARAICHERS },
      { id: s("233","patte-doie"), name: "Patte d'Oie", ...STOPS.PATTE_DOIE },
      { id: s("233","hlm"), name: "HLM", ...STOPS.HLM },
      { id: s("233","centenaire"), name: "Centenaire", ...STOPS.CENTENAIRE },
      { id: s("233","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("233","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("233","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("233","palais"), name: "Palais", ...STOPS.PALAIS },
    ],
  },

  // ────────────────────────────────────────────
  // LIGNE 234 — Baux Maraîchers ↔ Leclerc
  // ────────────────────────────────────────────
  {
    id: "dd-234",
    number: "234",
    name: "Baux Maraîchers ↔ Place Leclerc",
    color: "#10B981",
    operator: "Dem Dikk",
    fare: 300,
    stops: [
      { id: s("234","baux"), name: "Baux Maraîchers", ...STOPS.BAUX_MARAICHERS },
      { id: s("234","grand-yoff"), name: "Grand Yoff", ...STOPS.GRAND_YOFF },
      { id: s("234","liberte6"), name: "Liberté 6", ...STOPS.LIBERTE_6 },
      { id: s("234","fann"), name: "Fann", ...STOPS.FANN },
      { id: s("234","medina"), name: "Médina", ...STOPS.MEDINA },
      { id: s("234","sandaga"), name: "Sandaga", ...STOPS.SANDAGA },
      { id: s("234","independance"), name: "Place de l'Indépendance", ...STOPS.PLACE_INDEPENDENCE },
      { id: s("234","gare"), name: "Gare TER", ...STOPS.GARE_TER },
      { id: s("234","leclerc"), name: "Place Leclerc", ...STOPS.LECLERC },
    ],
  },
]

export const ALL_DEM_DIKK_LINES: BusLine[] = [
  ...DEM_DIKK_URBAN,
  ...DEM_DIKK_SUBURBAN,
]
