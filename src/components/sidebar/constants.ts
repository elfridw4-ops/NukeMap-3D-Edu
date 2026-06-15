import { DeliveryType } from '../../types';

export const VECTORS = [
  {
    id: "icbm" as DeliveryType,
    name: "ICBM",
    example: "Minuteman III",
    speedKmh: 24000,
    rangeKm: 13000,
    altitudeKm: 1200,   // apogée typique
    phases: ["Boost (3 min)", "Midcourse (25 min)", "Terminal (30 sec)"],
    color: "#ef4444"
  },
  {
    id: "slbm" as DeliveryType,
    name: "SLBM",
    example: "Trident II D5",
    speedKmh: 29000,
    rangeKm: 12000,
    altitudeKm: 1300,
    phases: ["Boost (2 min)", "Midcourse (18 min)", "Terminal (30 sec)"],
    color: "#f97316"
  },
  {
    id: "bomber" as DeliveryType,
    name: "Bombardier",
    example: "B-2 Spirit",
    speedKmh: 1010,
    rangeKm: 11000,
    altitudeKm: 15,
    phases: ["Approche", "Pénétration", "Largage"],
    color: "#6366f1"
  },
  {
    id: "cruise" as DeliveryType,
    name: "Missile de croisière",
    example: "Tomahawk",
    speedKmh: 880,
    rangeKm: 2500,
    altitudeKm: 0.1,    // vole en rase-mottes
    phases: ["Lancement", "Guidage terrain", "Terminal"],
    color: "#8b5cf6"
  },
  {
    id: "houthi" as DeliveryType,
    name: "Missile Houthi (Quds-1)",
    example: "Quds-1",
    speedKmh: 900,
    rangeKm: 2000,
    altitudeKm: 12,
    phases: ["Boost (1 min)", "Midcourse (2h)", "Terminal (30 sec)"],
    color: "#ec4899"
  },
  {
    id: "custom" as DeliveryType,
    name: "Hypothétique",
    example: "Personnalisé",
    speedKmh: null,     // saisie utilisateur
    rangeKm: 99999,
    altitudeKm: null,
    phases: ["Phase 1", "Phase 2", "Phase 3"],
    color: "#22c55e"
  }
];

export const LAUNCH_SITES = [
  {name:"Base Malmstrom (ICBM, USA)",   lat:47.50, lon:-111.18},
  {name:"Base Kings Bay (SLBM, USA)",   lat:30.80, lon:-81.56},
  {name:"Base Whiteman (B-2, USA)",     lat:38.73, lon:-93.55},
  {name:"Severomorsk (Russie)",         lat:69.07, lon:33.42},
  {name:"Base Yemen (Houthis)",         lat:15.35, lon:44.21},
  {name:"Séoul (Corée du Sud)",         lat:37.57, lon:126.98},
  {name:"Pyongyang (Corée du Nord)",    lat:39.03, lon:125.75},
  {name:"Base Dimona (Israël)",         lat:30.97, lon:35.15},
  {name:"Lop Nur (Chine, tests)",       lat:40.77, lon:89.18},
  {name:"Personnalisé (clic carte)",    lat:null,  lon:null},
];
