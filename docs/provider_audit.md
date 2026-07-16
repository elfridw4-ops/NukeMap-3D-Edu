# Provider Audit — NUKEMAP EDU
> Architecture des contextes, providers d'état global, services géographiques et gestion de la simulation physique.

**Version :** 2.0  
**Statut :** Validé & Audité  
**Dernière mise à jour :** 2026-07-06  

---

## 1. Architecture Générale des Providers

NUKEMAP EDU repose sur une architecture découplée où l'état de la simulation physique est maintenu dans des contextes React ou des hooks stabilisés, servant de source de vérité pour le moteur cartographique (MapLibre + Deck.gl).

```
[ SimulationProvider ]
         │
         ├──► Partage de l'état physique (puissance kt, coordonnées de l'épicentre, type de détonation)
         │
         ├──► [ MapProvider (MapLibre GL) ]
         │         │
         │         └──► Rendu de la carte vectorielle de base
         │
         └──► [ DeckGL Overlay Layer ]
                   │
                   └──► Rendu des ondes de surpression et du panache de retombées (Fallout)
```

---

## 2. Inventaire des Contextes Applicatifs

### 2.1. `SimulationProvider` / `useSimulation`
*   **Rôle :** Coordonne tous les paramètres de l'ogive nucléaire, le calcul des effets physiques (surpression, thermique, rayonnements) et l'animation des vecteurs d'attaque (ICBM, SLBM, bombardier stratégique).
*   **Données exposées :**
    *   `yieldKt` (nombre) : puissance de l'ogive sélectionnée.
    *   `coordinates` (`[lng, lat]`) : épicentre de l'explosion.
    *   `detonationType` (`'air'` / `'surface'`) : altitude de détonation déterminant la forme des retombées (fallout).
    *   `activeStep` (enum) : état du cycle de simulation (`idle`, `launching`, `detonated`, `calculating`).
    *   `impactData` (objet de résultats) : population touchée, blessés, morts et rayons de destruction calculés.
*   **Persistance :** Synchronisation automatique avec `localStorage` pour conserver la dernière configuration utilisateur d'une session à l'autre.

---

## 3. Audit Technique & Historique des Bugs

### Bug 3.1 : Re-rendus infinis de la carte lors de la modification des paramètres d'ogive
*   **Description :** La modification du curseur de puissance `yieldKt` entraînait une instanciation multiple des couches Deck.gl et un scintillement (flickering) insupportable sur la carte.
*   **Analyse :** Les tableaux de dépendances du composant `Map.tsx` incluaient des objets non mémoïsés créés à la volée à chaque re-rendu du composant parent.
*   **Correction :** stabilisation des fonctions de calcul physique via `useMemo` et isolation des couches de rendu Deck.gl pour qu'elles ne se re-génèrent que lorsque `activeStep` ou les coordonnées de l'épicentre changent de façon sémantique (comparaison de primitives).
*   **Décision d'architecture :** Interdiction stricte d'injecter des objets ou des fonctions anonymes directes dans les props de `DeckGL` ou `MapLibre`.

### Bug 3.2 : Crash du calcul de fallout sur coordonnées polaires ou limites de grille
*   **Description :** Une simulation déclenchée près des pôles géographiques entraînait une division par zéro ou un débordement d'index lors de la projection des ellipses de retombées radioactives.
*   **Analyse :** La formule trigonométrique simplifiée de dérive des vents ne prenait pas en compte la déformation des méridiens à haute latitude.
*   **Correction :** Intégration d'un garde-fou (clamping) limitant la simulation entre les latitudes -85° et +85°, et normalisation des angles de vent via un repère géodésique local stable.

---

## 4. Recommandations de Maintenance

1.  **Mémoïsation stricte :** Garder les sélecteurs de cibles et les filtres de pays dans des constantes en dehors de l'arbre React ou mémoïsés avec `useMemo` à l'aide de clés de primitives (chaînes ID de villes) pour éviter tout re-calcul d'interface.
2.  **Gestion des erreurs d'API Cartographique :** Prévoir un fallback en cas de blocage réseau ou de surcharge de tuiles cartographiques, permettant d'afficher une carte schématique hors-ligne ou statique en SVG.
