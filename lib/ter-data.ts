import type { BusLine } from "./dakar-bus-data"

const STOPS = {
  DAKAR_GARE: { lat: 14.6653, lng: -17.4406 },
  COLOBANE: { lat: 14.6889, lng: -17.4500 },
  HANN: { lat: 14.7170, lng: -17.4320 },
  DALIFORT: { lat: 14.7300, lng: -17.4100 },
  BAUX_MARAICHERS: { lat: 14.7450, lng: -17.4550 },
  PIKINE: { lat: 14.7575, lng: -17.3936 },
  THIAROYE: { lat: 14.7442, lng: -17.3753 },
  YEUMBEUL: { lat: 14.7600, lng: -17.3400 },
  KEUR_MASSAR: { lat: 14.7817, lng: -17.3133 },
  MBAO: { lat: 14.7500, lng: -17.2900 },
  PNR: { lat: 14.7300, lng: -17.2500 },
  DIAMNIADIO: { lat: 14.7117, lng: -17.1950 },
}

export const TER_LINES: BusLine[] = [
  {
    id: "ter-1",
    number: "TER",
    name: "Dakar ↔ Diamniadio",
    color: "#3B82F6", // Bleu train
    operator: "TER" as any,
    fare: 1500,
    stops: [
      { id: "ter-s1", name: "Gare de Dakar", ...STOPS.DAKAR_GARE },
      { id: "ter-s2", name: "Colobane", ...STOPS.COLOBANE },
      { id: "ter-s3", name: "Hann", ...STOPS.HANN },
      { id: "ter-s4", name: "Dalifort", ...STOPS.DALIFORT },
      { id: "ter-s5", name: "Baux Maraîchers", ...STOPS.BAUX_MARAICHERS },
      { id: "ter-s6", name: "Pikine", ...STOPS.PIKINE },
      { id: "ter-s7", name: "Thiaroye", ...STOPS.THIAROYE },
      { id: "ter-s8", name: "Yeumbeul", ...STOPS.YEUMBEUL },
      { id: "ter-s9", name: "Keur Massar", ...STOPS.KEUR_MASSAR },
      { id: "ter-s10", name: "Mbao", ...STOPS.MBAO },
      { id: "ter-s11", name: "PNR", ...STOPS.PNR },
      { id: "ter-s12", name: "Diamniadio", ...STOPS.DIAMNIADIO },
    ],
    returnStops: [
      { id: "ter-r1", name: "Diamniadio", ...STOPS.DIAMNIADIO },
      { id: "ter-r2", name: "PNR", ...STOPS.PNR },
      { id: "ter-r3", name: "Mbao", ...STOPS.MBAO },
      { id: "ter-r4", name: "Keur Massar", ...STOPS.KEUR_MASSAR },
      { id: "ter-r5", name: "Yeumbeul", ...STOPS.YEUMBEUL },
      { id: "ter-r6", name: "Thiaroye", ...STOPS.THIAROYE },
      { id: "ter-r7", name: "Pikine", ...STOPS.PIKINE },
      { id: "ter-r8", name: "Baux Maraîchers", ...STOPS.BAUX_MARAICHERS },
      { id: "ter-r9", name: "Dalifort", ...STOPS.DALIFORT },
      { id: "ter-r10", name: "Hann", ...STOPS.HANN },
      { id: "ter-r11", name: "Colobane", ...STOPS.COLOBANE },
      { id: "ter-r12", name: "Gare de Dakar", ...STOPS.DAKAR_GARE },
    ]
  }
]
