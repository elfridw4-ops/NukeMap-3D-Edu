export interface WeaponConfig {
    id: string;
    name: string;
    type: string;
    yieldValue: number; // in kt or mt based on selection
    yieldKt: number;
    description: string;
    weaponType: 'fission' | 'fusion' | 'dirty';
}

export type DeliveryType = 'icbm' | 'slbm' | 'bomber' | 'cruise' | 'hypothetical' | 'custom' | 'houthi';

export interface DeliveryVector {
    id: DeliveryType;
    name: string;
    velocityKmh: number;
    mach: number;
    description: string;
    altitudeApogeeKm: number; // standard apogee for ballistic flight
}

export interface LaunchParams {
    altitudeKm: number;
    velocityMach: number;
    vectorId: DeliveryType;
    customSpeedKmh?: number;
    customRangeKm?: number;
    trajectoryType?: 'standard' | 'depressed' | 'cruise';
}

export interface EnvironmentParams {
    explosionType: 'airburst' | 'surface';
    windDirection: number; // 0 to 360 degrees
    windSpeed: number; // km/h
    showMushroomCloud: boolean;
    maritimeImpact: boolean;
    oceanDepthM?: number;       // default: 2000
    coastalDepthM?: number;     // default: 8
    shoreDistanceKm?: number;   // default: 5
    beachSlopePct?: number;     // default: 2.0 (%)
    manningN?: number;          // default: 0.050 (terrain roughness)
    tropopauseAltitudeKm?: number; // default: 11
    terrainDamping?: number;    // default: 1.5 (roughness/orography of terrain, 1.0 to 5.0)
    autoShoreDistance?: boolean;// default: true (whether to automatically estimate distance mapping)
}

export interface SimulationState {
    target: {
        lng: number;
        lat: number;
    } | null;
    origin: {
        lng: number;
        lat: number;
    } | null;
    weapon: WeaponConfig;
    customYieldKt: number;
    launchParams: LaunchParams;
    environment: EnvironmentParams;
}

export interface PastStrike {
    id: string;
    target: { lng: number; lat: number };
    radii: BlastRadii;
    effectiveYield: number;
}

export interface BlastRadii {
    fireball: number;       // meters
    crater: number;         // meters
    heavyBlast: number;     // meters (20 psi)
    moderateBlast: number;  // meters (5 psi)
    lightBlast: number;     // meters (1-2 psi)
    thermal3rd: number;     // meters (3rd degree burns)
    thermal2nd: number;     // meters (2nd degree burns)
    thermal1st: number;     // meters (1er degree burns)
}

export type CameraViewAngle = 'map2d' | 'view3d' | 'street' | 'drone' | 'space';

export interface SimulationTimelineStep {
    id: string;
    timeLabel: string;
    title: string;
    description: string;
    effectsActive: string[];
    logText: string;
}

export interface CasualtyReport {
    populationTotal: number;
    populationDensity: number; // inhab / km2
    fatalities: number;
    graveInjures: number;
    lightInjures: number;
    radiationExposed: number;
    hospitalsAffected: number;
    schoolsAffected: number;
    airportsAffected: number;
    roadsAffected: number;
}
