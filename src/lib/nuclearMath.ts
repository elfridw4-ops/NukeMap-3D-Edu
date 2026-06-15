import { BlastRadii, WeaponConfig, DeliveryVector, DeliveryType, CasualtyReport } from "../types";
import { AutomaticGeoData } from "./geoDataFetcher";

/**
 * Enhanced scale laws based on "The Effects of Nuclear Weapons" (Glasstone & Dolan, 1977).
 * Evaluates blast wave circles using overpressures (psi) and thermal radiation.
 * It also computes craters based on Dolan and surface mechanical models.
 */
export const calculateBlastRadii = (yieldKt: number, explosionType: 'airburst' | 'surface', manningN: number = 0.050): BlastRadii => {
    // 1. Crater (only created in surface burst)
    // Dolan empirical model: R_crater = 45 * Y^(0.33) in m. We use manning n as soil hardness proxy.
    // Higher n (rougher terrain/rock) -> smaller crater. Lower n (smooth plains/soft soil) -> larger crater.
    const soilHardnessFactor = Math.pow(0.050 / Math.max(0.010, manningN), 0.3);
    const craterR_m = explosionType === 'surface' 
        ? 45 * Math.pow(yieldKt, 0.33) * soilHardnessFactor
        : 0;

    // 2. Fireball radius (meters)
    // Glasstone & Dolan: R = 0.28 * Y^0.32 in km for air burst, multiplied by ~1.3 for surface
    const fireballR_km = 0.28 * Math.pow(yieldKt, 0.32) * (explosionType === 'surface' ? 1.3 : 1.0);

    // 3. Heavy Blast overpressure circle (20 psi - total destruction)
    // R = 0.28 * Y^0.33 in km
    const heavyBlastR_km = 0.28 * Math.pow(yieldKt, 0.33) * (explosionType === 'surface' ? 0.8 : 1.0);

    // 4. Moderate Blast overpressure circle (5 psi - residential collapse)
    // R = 0.71 * Y^0.33 in km
    const moderateBlastR_km = 0.71 * Math.pow(yieldKt, 0.33) * (explosionType === 'surface' ? 0.8 : 1.0);

    // 5. Light Blast overpressure circle (1-2 psi - glass shattering)
    // R = 1.61 * Y^0.33 in km
    const lightBlastR_km = 1.61 * Math.pow(yieldKt, 0.33) * (explosionType === 'surface' ? 0.8 : 1.0);

    // 6. Thermal radiation burns (meters) using Dolan model for atmospheric transmission
    // 3rd degree (severe skin necrosis, 50% fatalities without medical aid)
    const thermal3rdR_km = 1.20 * Math.pow(yieldKt, 0.40);

    // 2nd degree (critical blistering, severe burns)
    const thermal2ndR_km = 1.55 * Math.pow(yieldKt, 0.40);

    // 1st degree (moderate pain, erythema, mild sunburn)
    const thermal1stR_km = 2.10 * Math.pow(yieldKt, 0.40);

    return {
        fireball: Math.max(10, fireballR_km * 1000),
        crater: Math.max(0, craterR_m),
        heavyBlast: Math.max(30, heavyBlastR_km * 1000),
        moderateBlast: Math.max(70, moderateBlastR_km * 1000),
        lightBlast: Math.max(150, lightBlastR_km * 1000),
        thermal3rd: Math.max(100, thermal3rdR_km * 1000),
        thermal2nd: Math.max(130, thermal2ndR_km * 1000),
        thermal1st: Math.max(180, thermal1stR_km * 1000),
    };
};

export const DELIVERY_VECTORS: DeliveryVector[] = [
    {
        id: 'icbm',
        name: "Minuteman III (ICBM)",
        velocityKmh: 24000,
        mach: 19.6,
        description: "Missile Balistique Intercontinental des silos terrestres américains. Vitesse terminale extrême, trajectoire exoatmosphérique.",
        altitudeApogeeKm: 1200
    },
    {
        id: 'slbm',
        name: "Trident II (SLBM)",
        velocityKmh: 29000,
        mach: 23.7,
        description: "Missile lancée depuis des sous-marins nucléaires (SNLE). Temps de réaction réduit, trajectoire basse et rapide.",
        altitudeApogeeKm: 800
    },
    {
        id: 'bomber',
        name: "B-2 Spirit (Bombardier furtif)",
        velocityKmh: 1010,
        mach: 0.82,
        description: "Bombardier lourd furtif subsonique USAF. Largue des bombes intelligentes à moyenne altitude.",
        altitudeApogeeKm: 15
    },
    {
        id: 'cruise',
        name: "AGM-109 Tomahawk (Missile de croisière)",
        velocityKmh: 880,
        mach: 0.72,
        description: "Missile de croisière subsonique ras-de-terre. Suit avec précision la topographie du terrain.",
        altitudeApogeeKm: 0.1
    },
    {
        id: 'houthi',
        name: "Missile Houthi (Quds-1)",
        velocityKmh: 900,
        mach: 0.73,
        description: "Missile de conception d'asymétrie moyenne portée tactique. Silhouette de croisière basse altitude.",
        altitudeApogeeKm: 12
    },
    {
        id: 'hypothetical',
        name: "Vecteur Hypersonique (Vitesse personnalisée)",
        velocityKmh: 15000,
        mach: 12.2,
        description: "Technologie hypothétique de planeur hypersonique de rentrée d'arène. Vitesse extrême et profil furtif de haute altitude.",
        altitudeApogeeKm: 100
    }
];

export const WEAPON_PRESETS: WeaponConfig[] = [
    {
        id: "davy_crockett",
        name: "Davy Crockett",
        type: "Tactique",
        yieldValue: 0.02,
        yieldKt: 0.02,
        description: "La plus petite ogive nucléaire déployée par les USA (M-388 fission).",
        weaponType: "fission"
    },
    {
        id: "little_boy",
        name: "Little Boy",
        type: "Historique (Fission)",
        yieldValue: 15,
        yieldKt: 15,
        description: "Bombe à l'uranium 235 larguée sur Hiroshima (6 août 1945).",
        weaponType: "fission"
    },
    {
        id: "fat_man",
        name: "Fat Man",
        type: "Historique (Fission)",
        yieldValue: 20,
        yieldKt: 20,
        description: "Bombe au plutonium à implosion larguée sur Nagasaki (9 août 1945).",
        weaponType: "fission"
    },
    {
        id: "w88",
        name: "W88 Trident",
        type: "Stratégique (Fusion)",
        yieldValue: 475,
        yieldKt: 475,
        description: "Ogive thermonucléaire américaine moderne transportée par SLBM Trident II.",
        weaponType: "fusion"
    },
    {
        id: "b83",
        name: "B83 (Gravité)",
        type: "Stratégique (Fusion)",
        yieldValue: 1200,
        yieldKt: 1200,
        description: "Bord thermonucléaire libre de gravité la plus puissante en service actif aux USA.",
        weaponType: "fusion"
    },
    {
        id: "tsar_bomba",
        name: "Tsar Bomba (Test standard)",
        type: "Historique (Thermonucléaire)",
        yieldValue: 50000,
        yieldKt: 50000,
        description: "La bombe la plus puissante testée par l'URSS avec un tampon en plomb amortisseur (octobre 1961).",
        weaponType: "fusion"
    },
    {
        id: "tsar_bomba_original",
        name: "Tsar Bomba (Originale Théorique)",
        type: "Stratégique (Thermonucléaire maximale)",
        yieldValue: 100000,
        yieldKt: 100000,
        description: "La configuration originale de l'URSS à trois étages avec gaine en Uranium 238, prévue pour 100 Mt.",
        weaponType: "fusion"
    },
    {
        id: "dirty_bomb",
        name: "Bombe Sale (Sale / Radiologique)",
        type: "Terrorisme / Sale",
        yieldValue: 0.1,
        yieldKt: 1.0,
        description: "Arme de dispersion de poussières hautement corrosives et de poudres radioactives (Cobalt/Césium).",
        weaponType: "dirty"
    },
    {
        id: "custom",
        name: "Ogive Personnalisée...",
        type: "Personnalisé",
        yieldValue: 500,
        yieldKt: 500,
        description: "Ajustez la puissance entre 1 kt et 100 Mt, et sélectionnez la physique de décomposition.",
        weaponType: "fission"
    }
];

export interface TsunamiMetrics {
    initialWaveHeightM: number;
    shoreWaveHeightM: number;
    runUpHeightM: number;
    inundationDistanceM: number;
    recommendedFloodRadiusM: number;
    depthProfile: { distanceKm: number; depthM: number; waveHeightM: number }[];
    effectiveCoastYield: number;
    isEligible: boolean;
}

export interface CoastalAnchor {
    name: string;
    lat: number;
    lng: number;
}

// Same coastal list
export const COASTAL_ANCHORS: CoastalAnchor[] = [
    { name: "La Manche (Le Havre)", lat: 49.7, lng: 0.1 },
    { name: "Atlantique (Brest)", lat: 48.3, lng: -5.0 },
    { name: "Atlantique (Nantes / Saint-Nazaire)", lat: 47.1, lng: -2.7 },
    { name: "Atlantique (Bordeaux)", lat: 45.7, lng: -1.3 },
    { name: "Méditerranée (Marseille / Côte d'Azur)", lat: 43.1, lng: 5.3 },
    { name: "Méditerranée (Nice)", lat: 43.4, lng: 7.3 },
    { name: "Méditerranée (Barcelone)", lat: 41.2, lng: 2.3 },
    { name: "Mer du Nord (Pays-Bas)", lat: 53.0, lng: 4.5 },
    { name: "Mer du Nord (Copenhague)", lat: 55.7, lng: 12.8 },
    { name: "Mer Baltique (Gdansk)", lat: 54.5, lng: 19.0 },
    { name: "Mer Noire (Varna / Constantza)", lat: 44.1, lng: 28.7 },
    { name: "Mer Adriatique (Venise)", lat: 45.3, lng: 12.5 },
    { name: "Océan Pacifique (San Francisco)", lat: 37.8, lng: -123.0 },
    { name: "Océan Pacifique (Los Angeles)", lat: 33.9, lng: -118.8 },
    { name: "Océan Pacifique (Vancouver)", lat: 49.1, lng: -123.3 },
    { name: "Océan Atlantique (New York)", lat: 40.5, lng: -73.8 },
    { name: "Océan Atlantique (Boston)", lat: 42.3, lng: -70.8 },
    { name: "Golfe du Mexique (La Nouvelle-Orléans)", lat: 29.1, lng: -89.9 },
    { name: "Mer des Caraïbes (Miami)", lat: 25.7, lng: -80.0 },
    { name: "Océan Pacifique (Tokyo)", lat: 35.5, lng: 140.2 },
    { name: "Océan Pacifique (Osaka)", lat: 34.3, lng: 135.3 },
    { name: "Mer de Chine (Shanghai)", lat: 31.0, lng: 122.2 },
    { name: "Mer de Chine (Hong Kong)", lat: 22.2, lng: 114.2 },
    { name: "Détroit de Malacca (Singapour)", lat: 1.2, lng: 103.8 },
    { name: "Océan Indien (Bombay)", lat: 18.9, lng: 72.7 },
    { name: "Océan Indien (Calcutta)", lat: 22.0, lng: 88.1 },
    { name: "Océan Indien (Perth)", lat: -32.0, lng: 115.5 },
    { name: "Océan Pacifique (Sydney)", lat: -33.9, lng: 151.3 },
    { name: "Océan Pacifique (Auckland)", lat: -36.8, lng: 174.9 },
    { name: "Océan Arctique (Mourmansk)", lat: 69.2, lng: 33.1 },
    { name: "Océan Arctique (Mer de Kara, Sibérie)", lat: 71.0, lng: 71.0 },
    { name: "Océan Arctique (Mer de Laptev, Sibérie)", lat: 75.0, lng: 115.0 },
    { name: "Mer d'Okhotsk (Vladivostok)", lat: 43.1, lng: 131.8 },
    { name: "Mer Rouge (Djeddah)", lat: 21.5, lng: 39.0 },
    { name: "Golfe Persique (Dubaï)", lat: 25.3, lng: 55.1 },
    { name: "Océan Indien (Le Cap)", lat: -34.0, lng: 18.4 },
    { name: "Océan Atlantique (Dakar)", lat: 14.7, lng: -17.5 },
    { name: "Méditerranée (Alexandrie)", lat: 31.3, lng: 29.9 },
    { name: "Océan Atlantique (Rio de Janeiro)", lat: -23.0, lng: -43.1 },
    { name: "Océan Atlantique (Buenos Aires)", lat: -34.6, lng: -57.8 },
    { name: "Océan Pacifique (Valparaíso)", lat: -33.0, lng: -71.7 },
    { name: "Océan Pacifique (Lima)", lat: -12.1, lng: -77.2 },
    { name: "Mer des Caraïbes (Panama)", lat: 9.0, lng: -79.5 }
];

export const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const estimateClosestSeaDistanceKm = (lat: number, lng: number): { distanceKm: number; name: string } => {
    let minDistance = Infinity;
    let closestAnchorName = "Inconnu";
    
    for (const anchor of COASTAL_ANCHORS) {
        const d = calculateDistanceKm(lat, lng, anchor.lat, anchor.lng);
        if (d < minDistance) {
            minDistance = d;
            closestAnchorName = anchor.name;
        }
    }
    
    return {
        distanceKm: parseFloat(minDistance.toFixed(1)),
        name: closestAnchorName
    };
};

export const calculateTsunamiMetrics = (
    yieldKt: number,
    oceanDepthM: number = 2000,
    shoreDistanceKm: number = 5,
    beachSlopePct: number = 2.0,
    terrainDamping: number = 1.5,
    isTargetOnWater: boolean = false,
    coastalDepthM: number = 8,
    manningN: number = 0.050
): TsunamiMetrics => {
    const actualDistanceToCoast = isTargetOnWater ? 0 : shoreDistanceKm;
    const k_base = 0.012;
    const k = Math.max(0.1, terrainDamping) * k_base;
    
    const effectiveCoastYield = isTargetOnWater 
        ? yieldKt 
        : yieldKt * Math.exp(-k * actualDistanceToCoast);

    const isEligible = effectiveCoastYield >= 20;
    const refDistanceM = 1500;
    const initialWaveHeightM = isEligible ? (0.45 * Math.sqrt(effectiveCoastYield)) : 0;

    const d_deep = Math.max(10, oceanDepthM);
    const d_shore = Math.max(1, coastalDepthM);
    const beta = 9;
    const R_max = Math.max(0.5, isTargetOnWater ? shoreDistanceKm : Math.min(25, shoreDistanceKm));

    const steps = 10;
    const depthProfile = [];
    for (let i = 0; i <= steps; i++) {
        const distKm = (R_max * i) / steps;
        const u = 1 - (distKm / R_max);
        const depthM = d_shore + (d_deep - d_shore) * (Math.log(1 + beta * u) / Math.log(1 + beta));
        
        let waveHeightM = 0;
        if (isEligible) {
            const currentDistM = Math.max(refDistanceM, distKm * 1000);
            const cylindricalSpread = Math.sqrt(refDistanceM / currentDistM);
            const shoalingFactor = Math.pow(d_deep / depthM, 0.25); // Loi de Green
            waveHeightM = initialWaveHeightM * cylindricalSpread * shoalingFactor;
        }

        depthProfile.push({
            distanceKm: parseFloat(distKm.toFixed(2)),
            depthM: Math.round(depthM),
            waveHeightM: parseFloat(waveHeightM.toFixed(2))
        });
    }

    const shoreWaveHeightM = isEligible ? depthProfile[steps].waveHeightM : 0;
    const slopeRad = Math.atan(beachSlopePct / 100);
    const runupCoeff = 1.0 + 1.25 * Math.sqrt(Math.sin(slopeRad)); // Formule de Hunt simplifiée
    const runUpHeightM = isEligible ? (shoreWaveHeightM * runupCoeff) : 0;

    // Utilisation du coefficient de Manning pour simuler la friction du terrain
    // Formule d'inondation max (modèle de friction empirique)
    const frictionFactor = Math.pow(manningN, 2) * 5 + 0.005; 
    const inundationDistanceM = isEligible ? (runUpHeightM / (Math.sin(slopeRad) + frictionFactor)) : 0;
    const recommendedFloodRadiusM = isEligible ? ((R_max * 1000) + inundationDistanceM) : 0;

    return {
        initialWaveHeightM: parseFloat(initialWaveHeightM.toFixed(2)),
        shoreWaveHeightM: parseFloat(shoreWaveHeightM.toFixed(2)),
        runUpHeightM: parseFloat(runUpHeightM.toFixed(2)),
        inundationDistanceM: parseFloat(inundationDistanceM.toFixed(2)),
        recommendedFloodRadiusM: parseFloat(recommendedFloodRadiusM.toFixed(2)),
        depthProfile,
        effectiveCoastYield: parseFloat(effectiveCoastYield.toFixed(2)),
        isEligible
    };
};

/**
 * Calculates human and layout casualties using demographics weighted by blast radii rings.
 */
export const calculateCasualtyReport = (
    lat: number,
    lng: number,
    radii: BlastRadii,
    weaponType: 'fission' | 'fusion' | 'dirty',
    nearbyCityData: AutomaticGeoData | null
): CasualtyReport => {
    // 1. Resolve population profile
    let baseDensity = 4500; // default dense urban area
    let cityName = "Zone Cible";
    let totalUrbanPopulation = 1200000;
    
    let baseHospitals = 10;
    let baseSchools = 40;

    if (nearbyCityData && nearbyCityData.population > 0) {
        baseDensity = nearbyCityData.densityValue;
        totalUrbanPopulation = nearbyCityData.population;
        cityName = nearbyCityData.cityName;
        baseHospitals = nearbyCityData.hospitals;
        baseSchools = nearbyCityData.schools;
    } else {
        // Pseudo-random but consistent coordinate-based population mapping (WorldPop integration proxy)
        const densitySeed = Math.abs(Math.sin(lat) * Math.cos(lng));
        if (densitySeed < 0.15) {
            baseDensity = 80; // ocean / desert / low density rural
            totalUrbanPopulation = 5000;
            baseHospitals = 0; baseSchools = 1;
        } else if (densitySeed < 0.4) {
            baseDensity = 650; // suburb / small town
            totalUrbanPopulation = 85000;
            baseHospitals = 1; baseSchools = 5;
        } else if (densitySeed < 0.8) {
            baseDensity = 3200; // medium urban center
            totalUrbanPopulation = 450000;
            baseHospitals = 4; baseSchools = 20;
        } else {
            baseDensity = 11000; // dense metropolis node
            totalUrbanPopulation = 6200000;
            baseHospitals = 15; baseSchools = 80;
        }
    }

    // 2. Compute overlapping ring casualty integration areas (in km2)
    // - Fireball & 20 psi overpressure (98% mortality)
    const fatalRadiusKm = Math.max(radii.fireball, radii.heavyBlast) / 1000;
    const areaFatalKm2 = Math.PI * fatalRadiusKm * fatalRadiusKm;

    // - Moderate 5 psi & 3rd degree burn (50% mortality, 50% severe injuries)
    const severeRadiusKm = Math.max(radii.moderateBlast, radii.thermal3rd) / 1000;
    const areaSevereKm2 = Math.max(0, (Math.PI * severeRadiusKm * severeRadiusKm) - areaFatalKm2);

    // - Light blast 1-2 psi & 1st/2nd degree burn (10% severe injuries, 70% light injuries)
    const lightRadiusKm = Math.max(radii.lightBlast, radii.thermal1st) / 1000;
    const areaLightKm2 = Math.max(0, (Math.PI * lightRadiusKm * lightRadiusKm) - (areaFatalKm2 + areaSevereKm2));

    // Calculate initial raw metrics based on population densities inside circles
    let fatalities = Math.min(totalUrbanPopulation, areaFatalKm2 * baseDensity * 0.98);
    let graveInjures = Math.min(totalUrbanPopulation - fatalities, areaSevereKm2 * baseDensity * 0.45);
    let lightInjures = Math.min(totalUrbanPopulation - fatalities - graveInjures, areaLightKm2 * baseDensity * 0.35);

    // Scaling factor for Dirty bomb (minor flash/blast, high radiation dispersion over time)
    if (weaponType === 'dirty') {
        fatalities = fatalities * 0.05 + 10; // few blast deaths
        graveInjures = graveInjures * 0.15 + 150;
        lightInjures = lightInjures * 1.5 + 1500; // massive panic & low-exposure acute cases
    }

    // Rounding
    fatalities = Math.ceil(fatalities);
    graveInjures = Math.ceil(graveInjures);
    lightInjures = Math.ceil(lightInjures);

    // Fallout exposure metrics (length-wind correlated)
    const radiationExposed = Math.ceil(baseDensity * 2.5 * (weaponType === 'dirty' ? 120 : 45));

    // Dynamic infrastructure destruction counters based on radius overlap
    const maxActiveRadiusKm = lightRadiusKm;
    // Assume all infrastructure within moderate blast zone is 100% destroyed, and 30% in light blast zone
    const destructionRatio = Math.min(1.0, (severeRadiusKm * severeRadiusKm * Math.PI) / (100 * 100 * Math.PI)) * 0.7 + Math.min(1.0, (lightRadiusKm * lightRadiusKm * Math.PI) / (100 * 100 * Math.PI)) * 0.3;
    
    // Scale against total infrastructure using a simple density heuristic or actual base values
    const hospitalsAffected = Math.ceil(baseHospitals * destructionRatio);
    const schoolsAffected = Math.ceil(baseSchools * destructionRatio);
    const airportsAffected = maxActiveRadiusKm > 15 ? 2 : (maxActiveRadiusKm > 4 ? 1 : 0);
    const roadsAffected = Math.ceil(Math.min(450, (baseDensity / 120) * (maxActiveRadiusKm * 1.8)));

    return {
        populationTotal: totalUrbanPopulation,
        populationDensity: baseDensity,
        fatalities,
        graveInjures,
        lightInjures,
        radiationExposed,
        hospitalsAffected,
        schoolsAffected,
        airportsAffected,
        roadsAffected
    };
};

/**
 * Calculates Richer equivalent energy scale
 * Energy in Joules: 1 kt TNT = 4.184 x 10^12 Joules
 */
export const calculateRichterScale = (yieldKt: number): number => {
    const energyJoules = yieldKt * 4.184e12;
    // Gutenberg-Richter log relationship: Mag = (2/3) * log10(E) - 3.2
    const mag = (2 / 3) * Math.log10(energyJoules) - 3.2;
    return parseFloat(mag.toFixed(2));
};

/**
 * Translates weapon energy parameters into visual timelines from T-0 to T+24h.
 */
export const getSimulationTimeline = (yieldKt: number, radii: BlastRadii, deliveryId: DeliveryType, windSpeedKmh: number): any[] => {
    const speed = DELIVERY_VECTORS.find(v => v.id === deliveryId)?.velocityKmh || 3000;
    const shockwaveSpeedMps = 343; // sound speed average
    const timeToCoverModerateS = Math.round(radii.moderateBlast / shockwaveSpeedMps);
    const falloutArrivalMin = Math.round((radii.moderateBlast * 3) / (windSpeedKmh / 60 || 5));

    return [
        {
            id: 't_flash',
            timeLabel: "T+0s",
            title: "Thermal Flash / Éclat Lumineux",
            description: "Dégagement instantané de l'onde thermique (UV/Infrarouges) voyageant à la vitesse de la lumière. Aveuglement absolu et inflammation à distance des combustibles.",
            effectsActive: ["flash", "thermal"],
            logText: `SYSTEM // Détonation de ${Math.round(yieldKt)} kt enregistrée. Flash d'irradiation thermique sphérique propagé à c.`
        },
        {
            id: 't_fireball',
            timeLabel: "T+1s",
            title: "Boule de Feu & Plasma",
            description: `Développement et diamètre maximal de la boule de feu de plasma ionisé (~${Math.round(radii.fireball)} m). Températures internes de plusieurs millions de degrés, provoquant une vaporisation complète de tout matériau structural.`,
            effectsActive: ["fireball", "extreme_overpressure"],
            logText: `TELEMETRY // Extension maximale présumée du dôme plasmatique hyperdense à R = ${Math.round(radii.fireball)} m.`
        },
        {
            id: 't_blast',
            timeLabel: `T+${timeToCoverModerateS}s`,
            title: `Bord d'Onde de Choc (${Math.round(radii.moderateBlast / 1000)} km)`,
            description: `Le front d'onde supersonique poussé par l'hyper-décompression de l'air balaye toute infrastructure. Les surpressions oscillent entre 5 psi (collapsus de briques) et 20 psi (béton armé tordu/jeté).`,
            effectsActive: ["shockwave", "blast_heavy", "blast_mod"],
            logText: `GEO_NET // Front cinétique barométrique s'étendant à R = ${Math.round(radii.moderateBlast)} m. Crête de surpression de 5 psi atteinte.`
        },
        {
            id: 't_mushroom',
            timeLabel: "T+30s",
            title: "Effet Cheminée & Dôme",
            description: `L'air surchauffé au niveau terrestre crée un vide ascensionnel colossal, tirant la terre brûlée et les débris vaporisés vers la haute atmosphère pour former la tige et le chapeau polaire pulvérulent (champignon).`,
            effectsActive: ["mushroom", "winds"],
            logText: `SAT_COM // Démarrage des flux convectifs troposphériques. Colonne de débris ascendants à 150 m/s.`
        },
        {
            id: 't_fallout_close',
            timeLabel: `T+${falloutArrivalMin}min`,
            title: "Précipitation Noire Côtière",
            description: `Les gaz d'hexafluorures refroidis se condensent en grappes de cendres abrasives et de pluies noires hautement ionisantes. Un rideau invisible emporté par les vents commence à s'abattre au sol (Plumes bêta-gamma)`,
            effectsActive: ["fallout_heavy"],
            logText: `RADIO_LOG // Alerte rad-fallout déclenchée au rad-vecteur orienté à N°°`
        }
    ];
};

/**
 * Calculates haversine distance between two sets of coordinates in kilometers.
 */
export const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) *
              Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
};

/**
 * Calculates flight time in minutes.
 */
export const flightTimeMin = (distKm: number, speedKmh: number): number => {
    if (!speedKmh || speedKmh <= 0) return 0;
    return (distKm / speedKmh) * 60;
};

/**
 * Calculates the real-world physically scaled time (in seconds) corresponding to the
 * compressed visual animation time (detonationTimeMs, 0 to 10000).
 * Reference yield is 50000 kt (50 Mt), which has the following milestones at specific t in ms:
 * - t = 0 ms -> T+0s (Gamma flash)
 * - t = 80 ms -> T+0.001s (Visible fireball begins)
 * - t = 800 ms -> T+10s (Fireball max size, 3.5 km)
 * - t = 1400 ms -> T+35s (Shockwave at 12 km)
 * - t = 2000 ms -> T+76s (Shockwave at 26 km)
 * - t = 3000 ms -> T+226s (Shockwave at 77 km)
 * - t = 5000 ms -> T+300s (Mushroom cloud stabilized, T+5min)
 * - t = 8000 ms -> T+7200s (Fallout begins, T+2h)
 * - t = 10000 ms -> T+86400s (Fallout dispersal over regional area, T+24h)
 * All values scale by S = (yieldKt / 50000)^(1/3)
 */
export const getSimulatedTimeSec = (detonationTimeMs: number, yieldKt: number): number => {
    const relativeYield = Math.max(0.01, yieldKt);
    const S = Math.pow(relativeYield / 50000, 1 / 3);
    const t = Math.max(0, Math.min(10000, detonationTimeMs));

    // Linear interpolation helper
    const lerp = (x: number, x1: number, x2: number, y1: number, y2: number) => {
        return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
    };

    let baseSec = 0;
    if (t <= 80) {
        baseSec = lerp(t, 0, 80, 0, 0.001);
    } else if (t <= 800) {
        baseSec = lerp(t, 80, 800, 0.001, 10);
    } else if (t <= 1400) {
        baseSec = lerp(t, 800, 1400, 10, 35);
    } else if (t <= 2000) {
        baseSec = lerp(t, 1400, 2000, 35, 76);
    } else if (t <= 3000) {
        baseSec = lerp(t, 2000, 3000, 76, 226);
    } else if (t <= 5000) {
        baseSec = lerp(t, 3000, 5000, 226, 300);
    } else if (t <= 8000) {
        baseSec = lerp(t, 5000, 8000, 300, 7200);
    } else {
        baseSec = lerp(t, 8000, 10000, 7200, 86400);
    }

    return baseSec * S;
};

/**
 * Formats simulated real elapsed time in seconds into human readable French
 */
export const formatSimulatedTime = (sec: number): string => {
    if (sec <= 0.0001) return "T+0 s";
    if (sec < 0.1) return `T+${(sec * 1000).toFixed(0)} ms`;
    if (sec < 60) return `T+${sec.toFixed(1)} s`;
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = Math.round(sec % 60);
    if (hrs > 0) {
        if (mins > 0) return `T+${hrs} h ${mins} min`;
        return `T+${hrs} h`;
    }
    if (mins > 0) {
        if (secs > 0) return `T+${mins} min ${secs} s`;
        return `T+${mins} min`;
    }
    return `T+${secs} s`;
};

/**
 * Calculates quadratic bezier parabolic path.
 */
export const getParabolicPath = (x0: number, y0: number, x1: number, y1: number, altitudePx: number): string => {
    const mx = (x0 + x1) / 2;
    const my = Math.min(y0, y1) - altitudePx;
    return `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`;
};
