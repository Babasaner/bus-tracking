import type { BusLine } from "./dakar-bus-data"

const STOPS = {
  PETERSEN: { lat: 14.6650, lng: -17.4328 },
  GRAND_DAKAR: { lat: 14.6930, lng: -17.4470 },
  BOURGUIBA: { lat: 14.7080, lng: -17.4520 },
  LIBERTE_6: { lat: 14.7231, lng: -17.4586 },
  FRONT_DE_TERRE: { lat: 14.7350, lng: -17.4450 },
  GRAND_MEDINE: { lat: 14.7100, lng: -17.4510 },
  MARCHE_J_DAKAR: { lat: 14.7550, lng: -17.4400 },
  PARCELLES_PA: { lat: 14.7667, lng: -17.4417 },
  HANN: { lat: 14.7228, lng: -17.4264 },
  GUEDIAWAYE_TERM: { lat: 14.7753, lng: -17.3936 },
}

export const BRT_LINES: BusLine[] = [
  {
    id: "brt-1",
    number: "BRT",
    name: "Petersen ↔ Guédiawaye",
    color: "#E11D48", // Rose/Rouge distinctif
    operator: "BRT" as any,
    fare: 500,
    stops: [
      { id: "brt-s1", name: "Gare Petersen", ...STOPS.PETERSEN },
      { id: "brt-s2", name: "Grand Dakar", ...STOPS.GRAND_DAKAR },
      { id: "brt-s3", name: "Station Bourguiba", ...STOPS.BOURGUIBA },
      { id: "brt-s4", name: "Liberté 6", ...STOPS.LIBERTE_6 },
      { id: "brt-s5", name: "Front de Terre", ...STOPS.FRONT_DE_TERRE },
      { id: "brt-s6", name: "Grand Médine", ...STOPS.GRAND_MEDINE },
      { id: "brt-s7", name: "Marché J. Dakar", ...STOPS.MARCHE_J_DAKAR },
      { id: "brt-s8", name: "Parcelles Assainies", ...STOPS.PARCELLES_PA },
      { id: "brt-s9", name: "Terminus Guédiawaye", ...STOPS.GUEDIAWAYE_TERM },
    ],
    returnStops: [
      { id: "brt-r1", name: "Terminus Guédiawaye", ...STOPS.GUEDIAWAYE_TERM },
      { id: "brt-r2", name: "Parcelles Assainies", ...STOPS.PARCELLES_PA },
      { id: "brt-r3", name: "Marché J. Dakar", ...STOPS.MARCHE_J_DAKAR },
      { id: "brt-r4", name: "Grand Médine", ...STOPS.GRAND_MEDINE },
      { id: "brt-r5", name: "Front de Terre", ...STOPS.FRONT_DE_TERRE },
      { id: "brt-r6", name: "Liberté 6", ...STOPS.LIBERTE_6 },
      { id: "brt-r7", name: "Station Bourguiba", ...STOPS.BOURGUIBA },
      { id: "brt-r8", name: "Grand Dakar", ...STOPS.GRAND_DAKAR },
      { id: "brt-r9", name: "Gare Petersen", ...STOPS.PETERSEN },
    ]
  }
]
