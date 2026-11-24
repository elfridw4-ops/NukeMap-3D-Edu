export interface WorldRegionEntry {
  code: string;
  name: string;
  continent: 'Europe' | 'Asie' | 'Afrique' | 'Amérique du Nord' | 'Amérique du Sud' | 'Océanie';
  lat: number;
  lng: number;
  population: number;
  areaKm2: number;
}

export interface WorldLandmassPolygon {
  id: string;
  name: string;
  continent: string;
  ring: [number, number][]; // [lng, lat]
}

/**
 * Base démographique mondiale de référence (UN WPP 2024, ~8,11 milliards d'habitants).
 * Permet un calcul continental et planétaire 100 % fonctionnel hors ligne.
 */
export const OFFLINE_WORLD_REGIONS: WorldRegionEntry[] = [
  // ASIE (~4.78 Md)
  { code: 'IN', name: 'Inde', continent: 'Asie', lat: 21.15, lng: 79.09, population: 1441719852, areaKm2: 3287263 },
  { code: 'CN', name: 'Chine', continent: 'Asie', lat: 35.86, lng: 104.19, population: 1425178782, areaKm2: 9596961 },
  { code: 'ID', name: 'Indonésie', continent: 'Asie', lat: -2.54, lng: 118.01, population: 279798049, areaKm2: 1904569 },
  { code: 'PK', name: 'Pakistan', continent: 'Asie', lat: 30.37, lng: 69.34, population: 245209815, areaKm2: 881913 },
  { code: 'BD', name: 'Bangladesh', continent: 'Asie', lat: 23.68, lng: 90.35, population: 174701211, areaKm2: 147570 },
  { code: 'JP', name: 'Japon', continent: 'Asie', lat: 36.20, lng: 138.25, population: 122631432, areaKm2: 377975 },
  { code: 'PH', name: 'Philippines', continent: 'Asie', lat: 12.87, lng: 121.77, population: 119106224, areaKm2: 300000 },
  { code: 'VN', name: 'Vietnam', continent: 'Asie', lat: 14.05, lng: 108.27, population: 99497680, areaKm2: 331212 },
  { code: 'IR', name: 'Iran', continent: 'Asie', lat: 32.42, lng: 53.68, population: 89809781, areaKm2: 1648195 },
  { code: 'TR', name: 'Turquie', continent: 'Asie', lat: 38.96, lng: 35.24, population: 86260417, areaKm2: 783562 },
  { code: 'TH', name: 'Thaïlande', continent: 'Asie', lat: 15.87, lng: 100.99, population: 71885799, areaKm2: 513120 },
  { code: 'MM', name: 'Myanmar', continent: 'Asie', lat: 21.91, lng: 95.95, population: 54964694, areaKm2: 676578 },
  { code: 'KR', name: 'Corée du Sud', continent: 'Asie', lat: 35.90, lng: 127.76, population: 51741963, areaKm2: 100210 },
  { code: 'IQ', name: 'Irak', continent: 'Asie', lat: 33.22, lng: 43.67, population: 46523657, areaKm2: 438317 },
  { code: 'AF', name: 'Afghanistan', continent: 'Asie', lat: 33.93, lng: 67.70, population: 43372950, areaKm2: 652230 },
  { code: 'SA', name: 'Arabie saoudite', continent: 'Asie', lat: 23.88, lng: 45.07, population: 37473929, areaKm2: 2149690 },
  { code: 'UZ', name: 'Ouzbékistan', continent: 'Asie', lat: 41.37, lng: 64.58, population: 35652307, areaKm2: 447400 },
  { code: 'YE', name: 'Yémen', continent: 'Asie', lat: 15.55, lng: 48.51, population: 35219853, areaKm2: 527968 },
  { code: 'MY', name: 'Malaisie', continent: 'Asie', lat: 4.21, lng: 101.97, population: 34671895, areaKm2: 330803 },
  { code: 'NP', name: 'Népal', continent: 'Asie', lat: 28.39, lng: 84.12, population: 31240315, areaKm2: 147181 },
  { code: 'KP', name: 'Corée du Nord', continent: 'Asie', lat: 40.33, lng: 127.51, population: 26244582, areaKm2: 120538 },
  { code: 'SY', name: 'Syrie', continent: 'Asie', lat: 34.80, lng: 38.99, population: 24348053, areaKm2: 185180 },
  { code: 'TW', name: 'Taïwan', continent: 'Asie', lat: 23.69, lng: 120.96, population: 23950214, areaKm2: 36197 },
  { code: 'LK', name: 'Sri Lanka', continent: 'Asie', lat: 7.87, lng: 80.77, population: 21949268, areaKm2: 65610 },
  { code: 'KZ', name: 'Kazakhstan', continent: 'Asie', lat: 48.01, lng: 66.92, population: 19828165, areaKm2: 2724900 },
  { code: 'KH', name: 'Cambodge', continent: 'Asie', lat: 12.56, lng: 104.99, population: 17121847, areaKm2: 181035 },
  { code: 'JO', name: 'Jordanie', continent: 'Asie', lat: 30.58, lng: 36.23, population: 11384922, areaKm2: 89342 },
  { code: 'AZ', name: 'Azerbaïdjan', continent: 'Asie', lat: 40.14, lng: 47.57, population: 10462904, areaKm2: 86600 },
  { code: 'TJ', name: 'Tadjikistan', continent: 'Asie', lat: 38.86, lng: 71.27, population: 10331513, areaKm2: 143100 },
  { code: 'AE', name: 'Émirats arabes unis', continent: 'Asie', lat: 23.42, lng: 53.84, population: 9591853, areaKm2: 83600 },
  { code: 'IL', name: 'Israël', continent: 'Asie', lat: 31.04, lng: 34.85, population: 9311652, areaKm2: 20770 },
  { code: 'LA', name: 'Laos', continent: 'Asie', lat: 19.85, lng: 102.49, population: 7736681, areaKm2: 236800 },
  { code: 'KG', name: 'Kirghizistan', continent: 'Asie', lat: 41.20, lng: 74.76, population: 6839606, areaKm2: 199951 },
  { code: 'TM', name: 'Turkménistan', continent: 'Asie', lat: 38.96, lng: 59.55, population: 6598071, areaKm2: 488100 },
  { code: 'SG', name: 'Singapour', continent: 'Asie', lat: 1.35, lng: 103.81, population: 6052709, areaKm2: 728 },
  { code: 'PS', name: 'Palestine', continent: 'Asie', lat: 31.95, lng: 35.23, population: 5494963, areaKm2: 6020 },
  { code: 'LB', name: 'Liban', continent: 'Asie', lat: 33.85, lng: 35.86, population: 5219044, areaKm2: 10452 },
  { code: 'OM', name: 'Oman', continent: 'Asie', lat: 21.51, lng: 55.92, population: 4713553, areaKm2: 309500 },
  { code: 'KW', name: 'Koweït', continent: 'Asie', lat: 29.31, lng: 47.48, population: 4349380, areaKm2: 17818 },
  { code: 'GE', name: 'Géorgie', continent: 'Asie', lat: 42.31, lng: 43.35, population: 3717425, areaKm2: 69700 },
  { code: 'MN', name: 'Mongolie', continent: 'Asie', lat: 46.86, lng: 103.84, population: 3493629, areaKm2: 1564116 },
  { code: 'AM', name: 'Arménie', continent: 'Asie', lat: 40.06, lng: 45.03, population: 2777979, areaKm2: 29743 },
  { code: 'QA', name: 'Qatar', continent: 'Asie', lat: 25.35, lng: 51.18, population: 2737061, areaKm2: 11586 },
  { code: 'BH', name: 'Bahreïn', continent: 'Asie', lat: 26.06, lng: 50.55, population: 1498712, areaKm2: 778 },
  { code: 'TL', name: 'Timor oriental', continent: 'Asie', lat: -8.87, lng: 125.72, population: 1379883, areaKm2: 14874 },
  { code: 'CY', name: 'Chypre', continent: 'Asie', lat: 35.12, lng: 33.42, population: 1268467, areaKm2: 9251 },
  { code: 'BT', name: 'Bhoutan', continent: 'Asie', lat: 27.51, lng: 90.43, population: 792382, areaKm2: 38394 },
  { code: 'MV', name: 'Maldives', continent: 'Asie', lat: 3.20, lng: 73.22, population: 517887, areaKm2: 298 },
  { code: 'BN', name: 'Brunei', continent: 'Asie', lat: 4.53, lng: 114.72, population: 455858, areaKm2: 5765 },

  // AFRIQUE (~1.49 Md)
  { code: 'NG', name: 'Nigeria', continent: 'Afrique', lat: 9.08, lng: 8.67, population: 229152217, areaKm2: 923768 },
  { code: 'ET', name: 'Éthiopie', continent: 'Afrique', lat: 9.14, lng: 40.48, population: 129719719, areaKm2: 1104300 },
  { code: 'EG', name: 'Égypte', continent: 'Afrique', lat: 26.82, lng: 30.80, population: 114484252, areaKm2: 1002450 },
  { code: 'CD', name: 'RD Congo', continent: 'Afrique', lat: -4.03, lng: 21.75, population: 105625114, areaKm2: 2344858 },
  { code: 'TZ', name: 'Tanzanie', continent: 'Afrique', lat: -6.36, lng: 34.88, population: 69419073, areaKm2: 945087 },
  { code: 'ZA', name: 'Afrique du Sud', continent: 'Afrique', lat: -30.55, lng: 22.93, population: 61020221, areaKm2: 1221037 },
  { code: 'KE', name: 'Kenya', continent: 'Afrique', lat: -0.02, lng: 37.90, population: 56203030, areaKm2: 580367 },
  { code: 'UG', name: 'Ouganda', continent: 'Afrique', lat: 1.37, lng: 32.29, population: 49924252, areaKm2: 241038 },
  { code: 'SD', name: 'Soudan', continent: 'Afrique', lat: 12.86, lng: 30.21, population: 49358228, areaKm2: 1861484 },
  { code: 'DZ', name: 'Algérie', continent: 'Afrique', lat: 28.03, lng: 1.65, population: 46278751, areaKm2: 2381741 },
  { code: 'MA', name: 'Maroc', continent: 'Afrique', lat: 31.79, lng: -7.09, population: 38211459, areaKm2: 446550 },
  { code: 'AO', name: 'Angola', continent: 'Afrique', lat: -11.20, lng: 17.87, population: 37804634, areaKm2: 1246700 },
  { code: 'MZ', name: 'Mozambique', continent: 'Afrique', lat: -18.66, lng: 35.52, population: 34858402, areaKm2: 801590 },
  { code: 'GH', name: 'Ghana', continent: 'Afrique', lat: 7.94, lng: -1.02, population: 34777522, areaKm2: 238533 },
  { code: 'MG', name: 'Madagascar', continent: 'Afrique', lat: -18.76, lng: 46.86, population: 31056610, areaKm2: 587041 },
  { code: 'CI', name: 'Côte d’Ivoire', continent: 'Afrique', lat: 7.53, lng: -5.54, population: 29603302, areaKm2: 322463 },
  { code: 'CM', name: 'Cameroun', continent: 'Afrique', lat: 7.36, lng: 12.35, population: 29394433, areaKm2: 475442 },
  { code: 'NE', name: 'Niger', continent: 'Afrique', lat: 17.60, lng: 8.08, population: 28238972, areaKm2: 1267000 },
  { code: 'ML', name: 'Mali', continent: 'Afrique', lat: 17.57, lng: -3.99, population: 24015789, areaKm2: 1240192 },
  { code: 'BF', name: 'Burkina Faso', continent: 'Afrique', lat: 12.23, lng: -1.56, population: 23840247, areaKm2: 274200 },
  { code: 'MW', name: 'Malawi', continent: 'Afrique', lat: -13.25, lng: 34.30, population: 21475962, areaKm2: 118484 },
  { code: 'ZM', name: 'Zambie', continent: 'Afrique', lat: -13.13, lng: 27.84, population: 21134695, areaKm2: 752618 },
  { code: 'TD', name: 'Tchad', continent: 'Afrique', lat: 15.45, lng: 18.73, population: 18847148, areaKm2: 1284000 },
  { code: 'SO', name: 'Somalie', continent: 'Afrique', lat: 5.15, lng: 46.19, population: 18706922, areaKm2: 637657 },
  { code: 'SN', name: 'Sénégal', continent: 'Afrique', lat: 14.49, lng: -14.45, population: 18221567, areaKm2: 196722 },
  { code: 'ZW', name: 'Zimbabwe', continent: 'Afrique', lat: -19.01, lng: 29.15, population: 17020321, areaKm2: 390757 },
  { code: 'GN', name: 'Guinée', continent: 'Afrique', lat: 9.94, lng: -9.69, population: 14528770, areaKm2: 245857 },
  { code: 'RW', name: 'Rwanda', continent: 'Afrique', lat: -1.94, lng: 29.87, population: 14414910, areaKm2: 26338 },
  { code: 'BJ', name: 'Bénin', continent: 'Afrique', lat: 9.30, lng: 2.31, population: 14080072, areaKm2: 112622 },
  { code: 'BI', name: 'Burundi', continent: 'Afrique', lat: -3.37, lng: 29.91, population: 13591657, areaKm2: 27834 },
  { code: 'TN', name: 'Tunisie', continent: 'Afrique', lat: 33.88, lng: 9.53, population: 12564689, areaKm2: 163610 },
  { code: 'SS', name: 'Soudan du Sud', continent: 'Afrique', lat: 6.87, lng: 31.30, population: 11277092, areaKm2: 619745 },
  { code: 'TG', name: 'Togo', continent: 'Afrique', lat: 8.61, lng: 0.82, population: 9260864, areaKm2: 56785 },
  { code: 'SL', name: 'Sierra Leone', continent: 'Afrique', lat: 8.46, lng: -11.77, population: 8977972, areaKm2: 71740 },
  { code: 'LY', name: 'Libye', continent: 'Afrique', lat: 26.33, lng: 17.22, population: 6964197, areaKm2: 1759540 },
  { code: 'CG', name: 'Congo', continent: 'Afrique', lat: -0.22, lng: 15.82, population: 6244547, areaKm2: 342000 },
  { code: 'CF', name: 'Centrafrique', continent: 'Afrique', lat: 6.61, lng: 20.93, population: 5915627, areaKm2: 622984 },
  { code: 'LR', name: 'Liberia', continent: 'Afrique', lat: 6.42, lng: -9.42, population: 5536949, areaKm2: 111369 },
  { code: 'MR', name: 'Mauritanie', continent: 'Afrique', lat: 21.00, lng: -10.94, population: 4993922, areaKm2: 1030700 },
  { code: 'ER', name: 'Érythrée', continent: 'Afrique', lat: 15.17, lng: 39.78, population: 3817651, areaKm2: 117600 },
  { code: 'GM', name: 'Gambie', continent: 'Afrique', lat: 13.44, lng: -15.31, population: 2841803, areaKm2: 11295 },
  { code: 'BW', name: 'Botswana', continent: 'Afrique', lat: -22.32, lng: 24.68, population: 2719694, areaKm2: 581730 },
  { code: 'NA', name: 'Namibie', continent: 'Afrique', lat: -22.95, lng: 18.49, population: 2645805, areaKm2: 825615 },
  { code: 'GA', name: 'Gabon', continent: 'Afrique', lat: -0.80, lng: 11.60, population: 2484557, areaKm2: 267668 },
  { code: 'LS', name: 'Lesotho', continent: 'Afrique', lat: -29.60, lng: 28.23, population: 2356083, areaKm2: 30355 },
  { code: 'GW', name: 'Guinée-Bissau', continent: 'Afrique', lat: 11.80, lng: -15.18, population: 2197149, areaKm2: 36125 },
  { code: 'GQ', name: 'Guinée équatoriale', continent: 'Afrique', lat: 1.65, lng: 10.26, population: 1754993, areaKm2: 28051 },
  { code: 'MU', name: 'Maurice', continent: 'Afrique', lat: -20.34, lng: 57.55, population: 1301978, areaKm2: 2040 },
  { code: 'SZ', name: 'Eswatini', continent: 'Afrique', lat: -26.52, lng: 31.46, population: 1222075, areaKm2: 17364 },
  { code: 'DJ', name: 'Djibouti', continent: 'Afrique', lat: 11.82, lng: 42.59, population: 1152329, areaKm2: 23200 },
  { code: 'KM', name: 'Comores', continent: 'Afrique', lat: -11.64, lng: 43.33, population: 867605, areaKm2: 1862 },
  { code: 'CV', name: 'Cap-Vert', continent: 'Afrique', lat: 16.53, lng: -23.04, population: 604461, areaKm2: 4033 },

  // EUROPE (~742 M)
  { code: 'RU', name: 'Russie', continent: 'Europe', lat: 55.75, lng: 50.00, population: 143957079, areaKm2: 17098242 },
  { code: 'DE', name: 'Allemagne', continent: 'Europe', lat: 51.16, lng: 10.45, population: 83252474, areaKm2: 357022 },
  { code: 'GB', name: 'Royaume-Uni', continent: 'Europe', lat: 54.00, lng: -2.50, population: 67961439, areaKm2: 242495 },
  { code: 'FR', name: 'France', continent: 'Europe', lat: 46.60, lng: 2.21, population: 64881830, areaKm2: 551695 },
  { code: 'IT', name: 'Italie', continent: 'Europe', lat: 42.83, lng: 12.83, population: 58697744, areaKm2: 301340 },
  { code: 'ES', name: 'Espagne', continent: 'Europe', lat: 40.46, lng: -3.74, population: 47473373, areaKm2: 505992 },
  { code: 'PL', name: 'Pologne', continent: 'Europe', lat: 51.91, lng: 19.14, population: 40221726, areaKm2: 312696 },
  { code: 'UA', name: 'Ukraine', continent: 'Europe', lat: 48.37, lng: 31.16, population: 37937821, areaKm2: 603500 },
  { code: 'RO', name: 'Roumanie', continent: 'Europe', lat: 45.94, lng: 24.96, population: 19618996, areaKm2: 238391 },
  { code: 'NL', name: 'Pays-Bas', continent: 'Europe', lat: 52.13, lng: 5.29, population: 17671125, areaKm2: 41850 },
  { code: 'BE', name: 'Belgique', continent: 'Europe', lat: 50.50, lng: 4.46, population: 11715774, areaKm2: 30528 },
  { code: 'SE', name: 'Suède', continent: 'Europe', lat: 60.12, lng: 18.64, population: 10673669, areaKm2: 450295 },
  { code: 'CZ', name: 'Tchéquie', continent: 'Europe', lat: 49.81, lng: 15.47, population: 10503734, areaKm2: 78865 },
  { code: 'GR', name: 'Grèce', continent: 'Europe', lat: 39.07, lng: 21.82, population: 10302720, areaKm2: 131990 },
  { code: 'PT', name: 'Portugal', continent: 'Europe', lat: 39.39, lng: -8.22, population: 10223349, areaKm2: 92090 },
  { code: 'HU', name: 'Hongrie', continent: 'Europe', lat: 47.16, lng: 19.50, population: 9994993, areaKm2: 93028 },
  { code: 'BY', name: 'Biélorussie', continent: 'Europe', lat: 53.70, lng: 27.95, population: 9455037, areaKm2: 207600 },
  { code: 'AT', name: 'Autriche', continent: 'Europe', lat: 47.51, lng: 14.55, population: 8977139, areaKm2: 83871 },
  { code: 'CH', name: 'Suisse', continent: 'Europe', lat: 46.81, lng: 8.22, population: 8851431, areaKm2: 41284 },
  { code: 'RS', name: 'Serbie', continent: 'Europe', lat: 44.01, lng: 21.00, population: 7097028, areaKm2: 77474 },
  { code: 'BG', name: 'Bulgarie', continent: 'Europe', lat: 42.73, lng: 25.48, population: 6618615, areaKm2: 110879 },
  { code: 'DK', name: 'Danemark', continent: 'Europe', lat: 56.26, lng: 9.50, population: 5939695, areaKm2: 43094 },
  { code: 'FI', name: 'Finlande', continent: 'Europe', lat: 61.92, lng: 25.74, population: 5549886, areaKm2: 338424 },
  { code: 'NO', name: 'Norvège', continent: 'Europe', lat: 60.47, lng: 8.46, population: 5514477, areaKm2: 323802 },
  { code: 'SK', name: 'Slovaquie', continent: 'Europe', lat: 48.66, lng: 19.69, population: 5702832, areaKm2: 49037 },
  { code: 'IE', name: 'Irlande', continent: 'Europe', lat: 53.41, lng: -8.24, population: 5089478, areaKm2: 70273 },
  { code: 'HR', name: 'Croatie', continent: 'Europe', lat: 45.10, lng: 15.20, population: 3986627, areaKm2: 56594 },
  { code: 'MD', name: 'Moldavie', continent: 'Europe', lat: 47.41, lng: 28.36, population: 3329865, areaKm2: 33846 },
  { code: 'BA', name: 'Bosnie-Herzégovine', continent: 'Europe', lat: 43.91, lng: 17.67, population: 3194378, areaKm2: 51209 },
  { code: 'AL', name: 'Albanie', continent: 'Europe', lat: 41.15, lng: 20.16, population: 2826020, areaKm2: 28748 },
  { code: 'LT', name: 'Lituanie', continent: 'Europe', lat: 55.16, lng: 23.88, population: 2692798, areaKm2: 65300 },
  { code: 'MK', name: 'Macédoine du Nord', continent: 'Europe', lat: 41.60, lng: 21.74, population: 2082706, areaKm2: 25713 },
  { code: 'SI', name: 'Slovénie', continent: 'Europe', lat: 46.15, lng: 14.99, population: 2118965, areaKm2: 20273 },
  { code: 'LV', name: 'Lettonie', continent: 'Europe', lat: 56.87, lng: 24.60, population: 1810240, areaKm2: 64559 },
  { code: 'EE', name: 'Estonie', continent: 'Europe', lat: 58.59, lng: 25.01, population: 1319041, areaKm2: 45227 },
  { code: 'LU', name: 'Luxembourg', continent: 'Europe', lat: 49.81, lng: 6.12, population: 661594, areaKm2: 2586 },
  { code: 'ME', name: 'Monténégro', continent: 'Europe', lat: 42.70, lng: 19.37, population: 626102, areaKm2: 13812 },
  { code: 'IS', name: 'Islande', continent: 'Europe', lat: 64.96, lng: -19.02, population: 377689, areaKm2: 103000 },

  // AMÉRIQUE DU NORD & CENTRALE (~608 M)
  { code: 'US', name: 'États-Unis', continent: 'Amérique du Nord', lat: 39.82, lng: -98.57, population: 341814420, areaKm2: 9833517 },
  { code: 'MX', name: 'Mexique', continent: 'Amérique du Nord', lat: 23.63, lng: -102.55, population: 129388467, areaKm2: 1964375 },
  { code: 'CA', name: 'Canada', continent: 'Amérique du Nord', lat: 56.13, lng: -106.34, population: 39107046, areaKm2: 9984670 },
  { code: 'GT', name: 'Guatemala', continent: 'Amérique du Nord', lat: 15.78, lng: -90.23, population: 18358430, areaKm2: 108889 },
  { code: 'HT', name: 'Haïti', continent: 'Amérique du Nord', lat: 18.97, lng: -72.28, population: 11867030, areaKm2: 27750 },
  { code: 'DO', name: 'République dominicaine', continent: 'Amérique du Nord', lat: 18.73, lng: -70.16, population: 11434005, areaKm2: 48671 },
  { code: 'CU', name: 'Cuba', continent: 'Amérique du Nord', lat: 21.52, lng: -77.78, population: 11174587, areaKm2: 109884 },
  { code: 'HN', name: 'Honduras', continent: 'Amérique du Nord', lat: 15.19, lng: -86.24, population: 10759406, areaKm2: 112492 },
  { code: 'NI', name: 'Nicaragua', continent: 'Amérique du Nord', lat: 12.86, lng: -85.20, population: 7142529, areaKm2: 130373 },
  { code: 'SV', name: 'Salvador', continent: 'Amérique du Nord', lat: 13.79, lng: -88.89, population: 6396289, areaKm2: 21041 },
  { code: 'CR', name: 'Costa Rica', continent: 'Amérique du Nord', lat: 9.74, lng: -83.75, population: 5246714, areaKm2: 51100 },
  { code: 'PA', name: 'Panama', continent: 'Amérique du Nord', lat: 8.53, lng: -80.78, population: 4527961, areaKm2: 75417 },
  { code: 'PR', name: 'Porto Rico', continent: 'Amérique du Nord', lat: 18.22, lng: -66.59, population: 3264020, areaKm2: 9104 },
  { code: 'JM', name: 'Jamaïque', continent: 'Amérique du Nord', lat: 18.10, lng: -77.29, population: 2824738, areaKm2: 10991 },

  // AMÉRIQUE DU SUD (~442 M)
  { code: 'BR', name: 'Brésil', continent: 'Amérique du Sud', lat: -14.23, lng: -51.92, population: 217637297, areaKm2: 8515767 },
  { code: 'CO', name: 'Colombie', continent: 'Amérique du Sud', lat: 4.57, lng: -74.29, population: 52340774, areaKm2: 1141748 },
  { code: 'AR', name: 'Argentine', continent: 'Amérique du Sud', lat: -38.41, lng: -63.61, population: 46057866, areaKm2: 2780400 },
  { code: 'PE', name: 'Pérou', continent: 'Amérique du Sud', lat: -9.18, lng: -75.01, population: 34683444, areaKm2: 1285216 },
  { code: 'VE', name: 'Venezuela', continent: 'Amérique du Sud', lat: 6.42, lng: -66.58, population: 29395334, areaKm2: 916445 },
  { code: 'CL', name: 'Chili', continent: 'Amérique du Sud', lat: -35.67, lng: -71.54, population: 19658835, areaKm2: 756102 },
  { code: 'EC', name: 'Équateur', continent: 'Amérique du Sud', lat: -1.83, lng: -78.18, population: 18377367, areaKm2: 276841 },
  { code: 'BO', name: 'Bolivie', continent: 'Amérique du Sud', lat: -16.29, lng: -63.58, population: 12567336, areaKm2: 1098581 },
  { code: 'PY', name: 'Paraguay', continent: 'Amérique du Sud', lat: -23.44, lng: -58.44, population: 6947270, areaKm2: 406752 },
  { code: 'UY', name: 'Uruguay', continent: 'Amérique du Sud', lat: -32.52, lng: -55.76, population: 3423316, areaKm2: 176215 },
  { code: 'GY', name: 'Guyana', continent: 'Amérique du Sud', lat: 4.86, lng: -58.93, population: 819594, areaKm2: 214969 },
  { code: 'SR', name: 'Suriname', continent: 'Amérique du Sud', lat: 3.91, lng: -56.02, population: 628785, areaKm2: 163820 },

  // OCÉANIE (~45.5 M)
  { code: 'AU', name: 'Australie', continent: 'Océanie', lat: -25.27, lng: 133.77, population: 26699482, areaKm2: 7692024 },
  { code: 'PG', name: 'Papouasie-Nouvelle-Guinée', continent: 'Océanie', lat: -6.31, lng: 143.95, population: 10515788, areaKm2: 462840 },
  { code: 'NZ', name: 'Nouvelle-Zélande', continent: 'Océanie', lat: -40.90, lng: 174.88, population: 5269939, areaKm2: 270467 },
  { code: 'FJ', name: 'Fidji', continent: 'Océanie', lat: -17.71, lng: 178.06, population: 943072, areaKm2: 18272 },
  { code: 'SB', name: 'Îles Salomon', continent: 'Océanie', lat: -9.64, lng: 160.15, population: 756673, areaKm2: 28896 },
];

/**
 * Polygones simplifiés des masses continentales et grandes îles pour le fond cartographique
 * vectoriel hors ligne et la détection Terre / Océan sans connexion.
 */
export const WORLD_LANDMASS_POLYGONS: WorldLandmassPolygon[] = [
  {
    id: 'north-america',
    name: 'Amérique du Nord',
    continent: 'Amérique du Nord',
    ring: [
      [-168, 65], [-162, 71], [-135, 70], [-110, 74], [-82, 72], [-64, 62],
      [-55, 52], [-66, 44], [-75, 35], [-81, 25], [-89, 30], [-97, 26],
      [-96, 19], [-87, 21], [-83, 10], [-78, 8], [-85, 11], [-94, 15],
      [-105, 20], [-112, 28], [-117, 32], [-124, 40], [-125, 49], [-136, 58],
      [-152, 60], [-165, 55], [-168, 65],
    ],
  },
  {
    id: 'greenland',
    name: 'Groenland',
    continent: 'Amérique du Nord',
    ring: [
      [-52, 60], [-42, 60], [-22, 70], [-18, 81], [-35, 83], [-60, 81], [-72, 77], [-54, 68], [-52, 60],
    ],
  },
  {
    id: 'south-america',
    name: 'Amérique du Sud',
    continent: 'Amérique du Sud',
    ring: [
      [-78, 9], [-72, 12], [-62, 10], [-50, 1], [-35, -6], [-38, -14], [-42, -23],
      [-52, -33], [-62, -41], [-68, -54], [-73, -53], [-75, -45], [-71, -30],
      [-70, -18], [-81, -5], [-78, 9],
    ],
  },
  {
    id: 'europe',
    name: 'Europe',
    continent: 'Europe',
    ring: [
      [-9, 36], [-9, 43], [-2, 43], [-5, 48], [2, 51], [8, 54], [9, 57],
      [5, 61], [15, 69], [28, 71], [42, 68], [60, 68], [60, 50], [45, 44],
      [36, 45], [29, 41], [23, 38], [18, 40], [15, 38], [12, 42], [9, 44],
      [3, 42], [-2, 37], [-9, 36],
    ],
  },
  {
    id: 'uk-ireland',
    name: 'Îles Britanniques',
    continent: 'Europe',
    ring: [
      [-6, 50], [1.8, 51.2], [1.5, 53], [-2, 58], [-6, 58], [-10, 54], [-10, 51.5], [-6, 50],
    ],
  },
  {
    id: 'iceland',
    name: 'Islande',
    continent: 'Europe',
    ring: [
      [-24, 64], [-14, 64], [-14, 66.5], [-24, 66.5], [-24, 64],
    ],
  },
  {
    id: 'africa',
    name: 'Afrique',
    continent: 'Afrique',
    ring: [
      [-17, 15], [-13, 28], [-6, 36], [10, 37], [25, 32], [33, 31], [43, 12],
      [51, 12], [41, -2], [40, -11], [35, -24], [28, -33], [18, -35], [14, -22],
      [12, -6], [9, 4], [-8, 5], [-17, 15],
    ],
  },
  {
    id: 'madagascar',
    name: 'Madagascar',
    continent: 'Afrique',
    ring: [
      [44, -25], [47, -25], [50, -15], [49, -12], [44, -17], [44, -25],
    ],
  },
  {
    id: 'asia',
    name: 'Asie',
    continent: 'Asie',
    ring: [
      [27, 41], [36, 36], [35, 30], [43, 13], [59, 22], [56, 26], [49, 30],
      [62, 25], [68, 24], [77, 8], [80, 14], [90, 22], [98, 15], [103, 2],
      [104, 10], [109, 13], [108, 21], [121, 24], [122, 31], [120, 38],
      [126, 36], [129, 41], [138, 46], [142, 54], [160, 56], [176, 65],
      [170, 70], [135, 72], [105, 77], [75, 73], [60, 68], [60, 50],
      [48, 45], [38, 44], [27, 41],
    ],
  },
  {
    id: 'japan',
    name: 'Japon',
    continent: 'Asie',
    ring: [
      [130.0, 31.2], [132.8, 32.8], [135.8, 33.4], [139.8, 34.8], [140.9, 35.7],
      [141.6, 38.6], [145.6, 43.4], [141.9, 45.5], [139.8, 41.2], [136.6, 37.3],
      [132.4, 34.8], [129.6, 33.4], [130.0, 31.2],
    ],
  },
  {
    id: 'indonesia-sumatra-java-borneo',
    name: 'Archipel Indonésien',
    continent: 'Asie',
    ring: [
      [96, 5], [105, -6], [116, -8], [118, 4], [110, 2], [104, -2], [96, 5],
    ],
  },
  {
    id: 'australia',
    name: 'Australie',
    continent: 'Océanie',
    ring: [
      [114, -22], [122, -17], [131, -12], [137, -15], [142, -11], [146, -18],
      [153, -28], [150, -37], [141, -38], [130, -32], [115, -34], [114, -22],
    ],
  },
  {
    id: 'new-zealand',
    name: 'Nouvelle-Zélande',
    continent: 'Océanie',
    ring: [
      [166, -46], [173, -43], [178, -37], [173, -35], [170, -41], [166, -46],
    ],
  },
  {
    id: 'antarctica',
    name: 'Antarctique',
    continent: 'Antarctique',
    ring: [
      [-180, -72], [-120, -74], [-60, -64], [-40, -75], [0, -70], [60, -68],
      [120, -67], [170, -72], [180, -72], [180, -85], [-180, -85], [-180, -72],
    ],
  },
];

const WORLD_POP_STORAGE_KEY = 'nukemap_edu_world_pop_v1';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type WorldPopDatasetSource = 'api-live' | 'cached-api' | 'offline-db';

export interface WorldDemographicDataset {
  regions: WorldRegionEntry[];
  totalWorldPopulation: number;
  source: WorldPopDatasetSource;
  sourceLabel: string;
}

let inMemoryRegions: WorldRegionEntry[] | null = null;
let inMemorySource: WorldPopDatasetSource = 'offline-db';

function mapRestCountryContinent(region: string, subregion?: string): WorldRegionEntry['continent'] {
  if (region === 'Europe') return 'Europe';
  if (region === 'Asia') return 'Asie';
  if (region === 'Africa') return 'Afrique';
  if (region === 'Oceania') return 'Océanie';
  if (region === 'Americas') {
    if (subregion && subregion.toLowerCase().includes('south')) return 'Amérique du Sud';
    return 'Amérique du Nord';
  }
  return 'Asie';
}

function readCachedWorldRegions(): WorldRegionEntry[] | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(WORLD_POP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.regions) || parsed.regions.length < 100) return null;
    if (typeof parsed.savedAt === 'number' && Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      return null;
    }
    return parsed.regions;
  } catch {
    return null;
  }
}

export function getWorldDemographicDataset(): WorldDemographicDataset {
  const cached = !inMemoryRegions ? readCachedWorldRegions() : null;
  const regions = inMemoryRegions || cached || OFFLINE_WORLD_REGIONS;
  const source: WorldPopDatasetSource = inMemoryRegions
    ? inMemorySource
    : cached
      ? 'cached-api'
      : 'offline-db';

  const totalWorldPopulation = regions.reduce((sum, r) => sum + (r.population || 0), 0);
  const sourceLabel =
    source === 'api-live'
      ? 'REST Countries API (Live) + UN WPP'
      : source === 'cached-api'
        ? 'Cache Démographique Local (API Synchronisée)'
        : 'Base Démographique Mondiale Hors-Ligne (UN WPP)';

  return {
    regions,
    totalWorldPopulation,
    source,
    sourceLabel,
  };
}

/**
 * Synchronise la base démographique mondiale depuis l'API publique de la Banque Mondiale
 * (`SP.POP.TOTL`, CORS libre sans clé API) et persiste le résultat en cache local hors ligne.
 */
export async function syncWorldPopulationFromApi(signal?: AbortSignal): Promise<WorldDemographicDataset> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return getWorldDemographicDataset();
  }

  try {
    const res = await fetch(
      'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?mrnev=1&per_page=300&format=json',
      { signal, headers: { Accept: 'application/json' } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    const rows = Array.isArray(payload) && Array.isArray(payload[1]) ? payload[1] : [];
    if (rows.length === 0) {
      return getWorldDemographicDataset();
    }

    const livePopByCode = new Map<string, number>();
    for (const row of rows) {
      const code = typeof row?.country?.id === 'string' ? row.country.id.toUpperCase() : '';
      const pop = typeof row?.value === 'number' && Number.isFinite(row.value) ? row.value : 0;
      if (code && pop > 0) {
        livePopByCode.set(code, Math.round(pop));
      }
    }

    if (livePopByCode.size >= 100) {
      const merged: WorldRegionEntry[] = OFFLINE_WORLD_REGIONS.map((reg) => {
        const livePop = livePopByCode.get(reg.code);
        return livePop ? { ...reg, population: livePop } : reg;
      });

      inMemoryRegions = merged;
      inMemorySource = 'api-live';
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(
            WORLD_POP_STORAGE_KEY,
            JSON.stringify({ savedAt: Date.now(), regions: merged })
          );
        } catch {
          // Ignore quota exceeded
        }
      }
    }
  } catch {
    // Repli silencieux sur cache ou base hors ligne
  }

  return getWorldDemographicDataset();
}

function pointInPolygon(lng: number, lat: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Détermine hors ligne si une coordonnée [lat, lng] se situe sur une masse continentale.
 */
export function isCoordinateOnLand(lat: number, lng: number): boolean {
  for (const poly of WORLD_LANDMASS_POLYGONS) {
    if (pointInPolygon(lng, lat, poly.ring)) {
      return true;
    }
  }
  return false;
}
