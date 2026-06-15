import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Provide __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------------------------------------------
// TYPES & SCHEMAS
// -------------------------------------------------------------
export interface GeoDataMeasurement {
  min: number;
  max: number;
  unit: string;
}

export interface CityGeodata {
  id: string;
  name: string;
  country: string;
  category: 'historical' | 'geopolitical' | 'educational';
  coordinates: { lat: number; lon: number };
  bathymetry: {
    h0: GeoDataMeasurement; // Deep ocean depth
    hc: GeoDataMeasurement; // Coastal depth
    d: GeoDataMeasurement;  // Distance to shore
    source?: string;
  } | null;
  topography: {
    coastal_slope?: GeoDataMeasurement;
    altitude: {
      coastal?: number;
      center: number;
      max_surrounding?: number;
      unit: string;
    };
    manning_n: { min: number; max: number };
    terrain_type: string;
  };
  atmosphere: {
    summer: {
      wind_direction: number;
      wind_speed: GeoDataMeasurement;
      tropopause: GeoDataMeasurement;
    };
    winter: {
      wind_direction: number;
      wind_speed: GeoDataMeasurement;
      tropopause: GeoDataMeasurement;
    };
    igra_station?: string;
  };
}

// -------------------------------------------------------------
// DATABASE (First batch of primary targets)
// -------------------------------------------------------------
const db: CityGeodata[] = [
  {
    id: "jp-hiroshima",
    name: "Hiroshima",
    country: "JP",
    category: "historical",
    coordinates: { lat: 34.3853, lon: 132.4553 },
    bathymetry: {
      h0: { min: 40, max: 60, unit: "m" },
      hc: { min: 3, max: 8, unit: "m" },
      d: { min: 15, max: 30, unit: "km" },
      source: "JODC/GEBCO 2023"
    },
    topography: {
      coastal_slope: { min: 1, max: 2, unit: "%" },
      altitude: { coastal: 2, center: 5, max_surrounding: 300, unit: "m ASL" },
      manning_n: { min: 0.040, max: 0.060 },
      terrain_type: "delta"
    },
    atmosphere: {
      summer: {
        wind_direction: 225,
        wind_speed: { min: 10, max: 15, unit: "km/h" },
        tropopause: { min: 15.5, max: 16.5, unit: "km" }
      },
      winter: {
        wind_direction: 315,
        wind_speed: { min: 15, max: 20, unit: "km/h" },
        tropopause: { min: 10, max: 11, unit: "km" }
      },
      igra_station: "47765"
    }
  },
  {
    id: "jp-nagasaki",
    name: "Nagasaki",
    country: "JP",
    category: "historical",
    coordinates: { lat: 32.7503, lon: 129.8779 },
    bathymetry: {
      h0: { min: 150, max: 200, unit: "m" },
      hc: { min: 8, max: 15, unit: "m" },
      d: { min: 150, max: 200, unit: "km" },
      source: "JODC/GEBCO"
    },
    topography: {
      coastal_slope: { min: 5, max: 15, unit: "%" },
      altitude: { coastal: 5, center: 50, max_surrounding: 400, unit: "m ASL" },
      manning_n: { min: 0.045, max: 0.065 },
      terrain_type: "ria_valley"
    },
    atmosphere: {
      summer: {
        wind_direction: 200,
        wind_speed: { min: 8, max: 12, unit: "km/h" },
        tropopause: { min: 15.5, max: 16.5, unit: "km" }
      },
      winter: {
        wind_direction: 340,
        wind_speed: { min: 15, max: 25, unit: "km/h" },
        tropopause: { min: 10.5, max: 11.5, unit: "km" }
      },
      igra_station: "47817"
    }
  },
  {
    id: "mh-bikini",
    name: "Bikini Atoll",
    country: "MH",
    category: "historical",
    coordinates: { lat: 11.6065, lon: 165.3768 },
    bathymetry: {
      h0: { min: 4000, max: 5000, unit: "m" },
      hc: { min: 1, max: 5, unit: "m" },
      d: { min: 2, max: 5, unit: "km" }
    },
    topography: {
      coastal_slope: { min: 1, max: 3, unit: "%" },
      altitude: { center: 2, max_surrounding: 3, unit: "m ASL" },
      manning_n: { min: 0.025, max: 0.035 },
      terrain_type: "coral_atoll"
    },
    atmosphere: {
      summer: {
        wind_direction: 70,
        wind_speed: { min: 15, max: 25, unit: "km/h" },
        tropopause: { min: 16.5, max: 17.5, unit: "km" }
      },
      winter: {
        wind_direction: 70,
        wind_speed: { min: 15, max: 25, unit: "km/h" },
        tropopause: { min: 16.5, max: 17.5, unit: "km" }
      }
    }
  },
  {
    id: "ru-novayazemlya",
    name: "Novaya Zemlya",
    country: "RU",
    category: "historical",
    coordinates: { lat: 73.8058, lon: 54.8197 },
    bathymetry: {
      h0: { min: 200, max: 350, unit: "m" },
      hc: { min: 10, max: 30, unit: "m" },
      d: { min: 300, max: 500, unit: "km" }
    },
    topography: {
      coastal_slope: { min: 10, max: 30, unit: "%" },
      altitude: { coastal: 10, center: 100, max_surrounding: 500, unit: "m ASL" },
      manning_n: { min: 0.030, max: 0.045 },
      terrain_type: "arctic_tundra_cliff"
    },
    atmosphere: {
      summer: {
        wind_direction: 240,
        wind_speed: { min: 25, max: 40, unit: "km/h" },
        tropopause: { min: 8, max: 10, unit: "km" }
      },
      winter: {
        wind_direction: 240,
        wind_speed: { min: 25, max: 40, unit: "km/h" },
        tropopause: { min: 7, max: 9, unit: "km" }
      }
    }
  },
  {
    id: "us-nyc",
    name: "New York",
    country: "US",
    category: "geopolitical",
    coordinates: { lat: 40.7128, lon: -74.0060 },
    bathymetry: {
      h0: { min: 2000, max: 4000, unit: "m" },
      hc: { min: 5, max: 15, unit: "m" },
      d: { min: 150, max: 200, unit: "km" }
    },
    topography: {
      coastal_slope: { min: 1, max: 3, unit: "%" },
      altitude: { coastal: 3, center: 10, max_surrounding: 80, unit: "m ASL" },
      manning_n: { min: 0.060, max: 0.080 },
      terrain_type: "dense_urban_island"
    },
    atmosphere: {
      summer: {
        wind_direction: 210,
        wind_speed: { min: 15, max: 20, unit: "km/h" },
        tropopause: { min: 11, max: 13, unit: "km" }
      },
      winter: {
        wind_direction: 315,
        wind_speed: { min: 20, max: 30, unit: "km/h" },
        tropopause: { min: 9, max: 11, unit: "km" }
      },
      igra_station: "OKX"
    }
  },
  {
    id: "fr-paris",
    name: "Paris",
    country: "FR",
    category: "geopolitical",
    coordinates: { lat: 48.8566, lon: 2.3522 },
    bathymetry: null, // Inland city
    topography: {
      altitude: { coastal: 0, center: 34, max_surrounding: 130, unit: "m ASL" },
      manning_n: { min: 0.055, max: 0.075 },
      terrain_type: "dense_urban_river_basin"
    },
    atmosphere: {
      summer: {
        wind_direction: 230,
        wind_speed: { min: 15, max: 20, unit: "km/h" },
        tropopause: { min: 11, max: 12.5, unit: "km" }
      },
      winter: {
        wind_direction: 230,
        wind_speed: { min: 15, max: 20, unit: "km/h" },
        tropopause: { min: 9, max: 10.5, unit: "km" }
      },
      igra_station: "07145"
    }
  }
];

// -------------------------------------------------------------
// GENERATOR FUNCTIONS
// -------------------------------------------------------------
export function buildDatabase() {
  const outputDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Export as JSON
  const jsonPath = path.join(outputDir, 'geophysics.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ cities: db }, null, 2), 'utf-8');
  console.log(`✅ [JSON] Geophysical DB successfully generated at: ${jsonPath}`);

  // 2. Export as SQLite / PostgreSQL seed script (optional utility)
  const sqlPath = path.join(outputDir, 'geophysics_seed.sql');
  let sqlContent = `-- NukeMap 3D (Edu) Geophysical DB Seed Script
-- Generated automatically

CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(2) NOT NULL,
    category VARCHAR(50),
    lat DECIMAL(8,5) NOT NULL,
    lon DECIMAL(8,5) NOT NULL,
    terrain_type VARCHAR(100),
    altitude_center INT,
    manning_min DECIMAL(4,3),
    manning_max DECIMAL(4,3)
);

-- Note: In a full relational DB, bathymetry, topography, and atmosphere would be separated into linked tables.
-- For this seed, we inject the main data into the primary cities table.

`;

  db.forEach(city => {
    sqlContent += `INSERT INTO cities (id, name, country, category, lat, lon, terrain_type, altitude_center, manning_min, manning_max) 
VALUES ('${city.id}', '${city.name.replace(/'/g, "''")}', '${city.country}', '${city.category}', ${city.coordinates.lat}, ${city.coordinates.lon}, '${city.topography.terrain_type}', ${city.topography.altitude.center}, ${city.topography.manning_n.min}, ${city.topography.manning_n.max})
ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name, lat=EXCLUDED.lat, lon=EXCLUDED.lon;
`;
  });

  fs.writeFileSync(sqlPath, sqlContent, 'utf-8');
  console.log(`✅ [SQL]  Seed script successfully generated at: ${sqlPath}`);
  console.log(`\n📊 Total cities processed: ${db.length} (Template file ready for massive injection)\n`);
}

// Execute if run directly
import { fileURLToPath as _fileURLToPath } from 'url';
if (process.argv[1]?.endsWith('build-geodata.ts')) {
   buildDatabase();
}
