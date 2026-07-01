# Charte Graphique — NUKEMAP EDU
> Simulateur scientifique & pédagogique 3D d'impacts physiques nucléaires ("Bunker Chic").

**Version :** 2.0  
**Thème :** Dark Mode exclusif (Bunker Tactique)  
**Dernière mise à jour :** 2026-07-01  

---

## Table des matières
1. [Vision & Identité "Bunker Chic"](#1-vision--identité-bunker-chic)
2. [Palette de Couleurs & Tokens Sémantiques](#2-palette-de-couleurs--tokens-sémantiques)
3. [Typographie & Échelle de Texte](#3-typographie--échelle-de-texte)
4. [Système d'Espacement & Marges](#4-système-despacement--marges)
5. [Border Radius & Géométrie](#5-border-radius--géométrie)
6. [Composants UI & États Interactifs](#6-composants-ui--états-interactifs)
7. [Spécifications du Logo](#7-spécifications-du-logo)
8. [Système d'Iconographie](#8-système-diconographie)
9. [Surfaces, Élévation & Profondeur](#9-surfaces-élévation--profondeur)
10. [Imagerie & Rendu 3D](#10-imagerie--rendu-3d)
11. [Layout & Grille Responsive](#11-layout--grille-responsive)
12. [Do's & Don'ts de Conception](#12-dos--donts-de-conception)
13. [Accessibilité & Conformité WCAG](#13-accessibilité--conformité-wcag)
14. [Tokens CSS — Quick Start](#tokens-css--quick-start)

---

## 1. Vision & Identité "Bunker Chic"

NUKEMAP EDU utilise l'approche esthétique **"Bunker Chic"**. Ce parti pris créatif et historique s'éloigne des designs colorés de la "tech grand public" pour imiter l'interface sobre, robuste et utilitaire d'un terminal militaire de défense froide ou d'une console de contrôle de crise. 

La charte graphique est délibérément austère : elle utilise de profonds fonds noirs pour minimiser la fatigue oculaire lors des sessions de simulation, des bordures nettes et des accents colorés hautement contrastés (sémantiques) qui font ressortir instantanément les ondes de surpression et de chaleur.

---

## 2. Palette de Couleurs & Tokens Sémantiques

Chaque couleur du projet remplit un objectif fonctionnel précis.

| Nom sémantique | Valeur HEX | Token CSS | Rôle primaire | Restrictions | Niveau d'autorité |
|---|---|---|---|---|---|
| **Void Black** | `#09090b` | `--color-void-black` | Fond de page principal (zinc-950). Évite la fatigue oculaire. | Ne jamais remplacer par un noir pur `#000000` sur les grands aplats. | Principale |
| **Tactical Charcoal** | `#18181b` | `--color-tactical-charcoal` | Fond des cartes et panneaux (zinc-900). | Ne pas utiliser comme couleur de texte. | Principale |
| **Bunker Border** | `#27272a` | `--color-bunker-border` | Bordures des sections et séparations (zinc-800). | Ne pas amincir à moins de `1px`. | Principale |
| **Blast Red** | `#ef4444` | `--color-blast-red` | Indicateur de surpression sévère (20 psi) et ICBM. | Ne pas utiliser pour du texte informatif standard. | Sémantique |
| **Thermal Orange** | `#f97316` | `--color-thermal-orange` | Zones thermiques (3e degré) et SLBM (Trident II). | À utiliser sur fond sombre uniquement pour lisibilité WCAG. | Sémantique |
| **Radiation Emerald** | `#10b981` | `--color-radiation-emerald` | Zones de retombées (fallout) et vecteur personnalisé. | Éviter d'associer directement au rouge sans séparateur. | Sémantique |
| **Shockwave Amber** | `#d97706` | `--color-shockwave-amber` | Zones de surpression modérée (5 psi). | Ne pas utiliser pour du texte secondaire. | Sémantique |
| **Ash Gray** | `#9ca3af` | `--color-ash-gray` | Limite de surpression légère (1 psi) et texte secondaire. | Ne pas descendre sous cette valeur pour le texte de petite taille. | Secondaire |
| **Signal White** | `#f4f4f5` | `--color-signal-white` | Texte principal et titres (zinc-100). | Ne pas appliquer sur fond clair. | Principale |

---

## 3. Typographie & Échelle de Texte

### Polices Utilisées

*   **Inter** (via Google Fonts) : La police d'interface primaire. Élégante, neutre, extrêmement lisible sur écran.
    *   *Substituts :* `ui-sans-serif`, `system-ui`, `sans-serif`
    *   *Poids utilisés :* `400` (Regular) pour le corps, `500` (Medium) pour les sous-titres, `600` (Semibold) pour les boutons, `700` (Bold) pour les titres.
    *   *Rationale :* Sa netteté à petite taille permet de lire facilement les métadonnées géographiques denses.
*   **JetBrains Mono** (via Google Fonts) : La police monospace dédiée aux données physiques et techniques.
    *   *Substituts :* `ui-monospace`, `SFMono-Regular`, `monospace`
    *   *Poids utilisés :* `400` (Regular) pour les données brutes, `500` (Medium) pour les coordonnées, `700` (Bold) pour les grands indicateurs chiffrés.
    *   *Rationale :* Renforce le côté utilitaire, "terminal militaire de calcul" et "recherche scientifique".

### Échelle Typographique

| Rôle | Taille en px | Line-height | Letter-spacing | Token CSS | Règle de tracking |
|---|---|---|---|---|---|
| **hero** | `48px` | `1.1` | `-0.02em` | `--text-hero` | Serré pour garder une silhouette compacte sur les grands écrans. |
| **display** | `30px` | `1.2` | `-0.01em` | `--text-display` | Légèrement resserré pour un rendu percutant. |
| **heading** | `20px` | `1.3` | `none` | `--text-heading` | Standard pour les titres de section de la Sidebar. |
| **subheading** | `14px` | `1.4` | `0.02em` | `--text-subheading` | Espacement léger pour améliorer la distinction des catégories. |
| **body** | `13px` | `1.5` | `none` | `--text-body` | Parfait équilibre pour lire les descriptions scientifiques complexes. |
| **caption** | `11px` | `1.4` | `none` | `--text-caption` | Écritures secondaires (ex: descriptions des ogives). |
| **label** | `10px` | `1.0` | `0.05em` | `--text-label` | Entièrement capitalisé pour l'aspect console technique. |

---

## 4. Système d'Espacement & Marges

L'unité de base est basée sur un pas de **4px** pour une grille précise.

*   **Unité de base :** `4px`
*   **Échelle complète :**
    *   `xs` : `4px` (gaps d'éléments internes)
    *   `sm` : `8px` (padding boutons, petites marges)
    *   `md` : `16px` (padding cartes, gaps de contrôles)
    *   `lg` : `24px` (marges de sections, padding Sidebar)
    *   `xl` : `32px` (grands espacements extérieurs)
*   **Densité visuelle :** **Compacte et dense**. En mode simulation, l'information doit être concentrée afin que l'utilisateur visualise simultanément le panneau de saisie et la carte géographique sans défilement excessif.

---

## 5. Border Radius & Géométrie

Le système favorise des angles **nets et modérément arrondis** pour conserver l'aspect d'une console rigide et pérenne.

*   **Boutons principaux & contrôles :** `8px` (Shorthand Tailwind : `rounded-lg`) -> `--radius-control`
*   **Cartes & Modales (Sidebar & PWA Banner) :** `12px` (Shorthand Tailwind : `rounded-xl`) -> `--radius-card`
*   **Sélecteurs & Inputs :** `8px` -> `--radius-input`
*   **Boutons flottants (Map controls) :** `9999px` (Pill/Circle) -> `--radius-pill`
*   **Règle globale :** La géométrie n'est pas "organique" ou "joueuse" ; aucun arrondi supérieur à `12px` n'est autorisé pour les cadres de fenêtres afin d'assurer l'esthétique instrumentale.

---

## 6. Composants UI & États Interactifs

### Bouton de Détonation / Lancement (CTA Majeur)
*   **Nom :** `ButtonDetonate`
*   **Rôle :** Déclencher la simulation nucléaire active.
*   **Background :** `#dc2626` (`--color-blast-red`)
*   **Couleur texte :** `#ffffff`
*   **Taille de police :** `14px` (Semibold, tracking `0.05em`, uppercase)
*   **Padding :** `12px 24px`
*   **Border-radius :** `8px`
*   **Ombre :** Red glow discret (`0 0 15px rgba(220, 38, 38, 0.3)`)

#### États de l'Élément

| État | Apparence visuelle / Changement |
|---|---|
| **Default** | Fond rouge, lettrage blanc, bordure nette. |
| **Hover** | `bg-red-500` (Changement de teinte vers le clair), augmentation de l'éclat de l'ombre de détonation (`scale-[1.01]`). |
| **Focus-visible** | Contour double-ring de couleur blanche avec un décalage de `2px` (`ring-2 ring-white ring-offset-2 ring-offset-zinc-950`). |
| **Active** | `scale-[0.98]` (effet d'enfoncement mécanique). |
| **Disabled** | Opacité `0.4`, curseur `not-allowed`, suppression du glow rouge. |
| **Loading** | `animate-pulse` avec affichage d'un spinner rotatif de 16px à la place du texte. |

---

## 7. Spécifications du Logo

Le logo de **NUKEMAP EDU** est un symbole fonctionnel composé d'un motif atomique stylisé fusionné avec un réticule de ciblage militaire.

*   **Variantes :**
    1.  *Principal (Complet) :* Logo atomique en rouge vif (`#ef4444`) accompagné du texte "NUKEMAP" en police Inter Bold blanche et "EDU" en rouge mono.
    2.  *Icone Seule :* Le réticule atomique seul, utilisé pour le favicon et la PWA (icon-512.png).
*   **Couleurs :** Accent atomique toujours en `#ef4444`, cercle externe en `#f4f4f5`.
*   **Zone de protection :** Espace libre équivalent à 50% de la largeur de l'icône tout autour du logotype.
*   **Interdictions :** Ne jamais appliquer d'ombres portées multicolores, ne pas déformer le ratio d'aspect, ne pas appliquer sur un fond de couleur vive autre que `#09090b`.

---

## 8. Système d'Iconographie

*   **Style :** Icônes de type "Line" (fines, filaires, vectorielles).
*   **Stroke (Épaisseur de trait) :** Toujours fixé à `1.5px` ou `2.0px` selon la taille pour garantir la lisibilité sur écran haute résolution.
*   **Tailles utilisées :**
    *   Petites icônes (dans les textes) : `12px`
    *   Icônes de contrôles standards (Sidebar) : `16px`
    *   Icônes de cartes et en-têtes : `20px`
*   **Couleurs autorisées :** Uniquement les tokens `--color-ash-gray`, `--color-blast-red`, `--color-signal-white` et `--color-radiation-emerald`.
*   **Source :** Bibliothèque `lucide-react`.

---

## 9. Surfaces, Élévation & Profondeur

Le système de profondeur n'utilise pas de flous importants ou d'ombres portées lourdes "flottantes", ce qui trahirait l'aspect instrumental en deux dimensions d'un écran de bunker tactique.

*   **Niveau de base (Carte / Arrière-plan) :** `#000000` (Fond de carte éteint ou sombre).
*   **Niveau de Surface 1 (Sidebar / Conteneur principal) :** `#09090b` (`--color-void-black`) avec bordure latérale solide de `1px` en `#27272a`.
*   **Niveau de Surface 2 (Cartes internes / Sections cliquables) :** `#141417` (légèrement plus clair pour créer du contraste).
*   **Règle d'Élévation :** La séparation des plans se fait par des contrastes de bordures solides de `1px` (`border-zinc-800/80`) plutôt que par des ombres portées douces.

---

## 10. Imagerie & Rendu 3D

*   **Types d'images autorisés :** Cartes vectorielles dynamiques, modèles géométriques en 3D (arcs balistiques, vagues de tsunami, cônes thermiques).
*   **Interdiction :** Aucune photo de stock réaliste. L'application doit conserver son sérieux éducatif.
*   **Rendu 3D (Deck.gl) :**
    *   Les couches d'impact nucléaire (boule de feu, onde de choc) sont rendues en cercles de couleurs semi-transparentes avec des opacités précisément définies (de `4%` pour le rayonnement thermique externe à `80%` pour la boule de feu).
    *   Les trajectoires des vecteurs utilisent des lignes d'arcs balistiques en 3D avec un maillage discret.

---

## 11. Layout & Grille Responsive

*   **Résolution cible bureau :** Optimisé pour un écran large (`1280px` et plus).
*   **Breakpoints principaux :**
    *   Mobile : `< 768px` (La Sidebar passe en panneau rétractable de type "Bottom Sheet" occupant `55vh` pour laisser la carte visible en haut).
    *   Desktop : `>= 768px` (Sidebar latérale fixe de `400px` de large à gauche, carte en plein écran).
*   **Max-width :** Plein écran (`100vw`) pour la zone d'expérience immersive de la carte.

---

## 12. Do's & Don'ts de Conception

### ✅ DO's
1.  **Do** utiliser la police *JetBrains Mono* pour toutes les valeurs numériques (puissance kt, distances, latitude, longitude).
2.  **Do** garder une bordure fine de `1px` de couleur `zinc-800` autour de toutes les cartes d'information pour la visibilité des blocs.
3.  **Do** afficher le code couleur sémantique correct pour les différents rayons d'impact (Rouge = Surchoc, Orange = Brûlure thermique, Vert = Retombées).
4.  **Do** désactiver l'interactivité de la carte pendant la phase de vol active du missile balistique pour renforcer l'effet de suspense.
5.  **Do** utiliser des animations fluides de transition avec `motion/react` lors de l'ouverture des panneaux techniques.
6.  **Do** maintenir le fond d'écran dans les tons sombres (`#09090b`) pour rehausser le contraste des ondes de choc.
7.  **Do** intégrer un état de repli clair ("Aucune cible sélectionnée") avant d'afficher le panneau de rapport d'impact.

### ❌ DON'Ts
1.  **Don't** utiliser de dégradés multicolores fluos et ludiques sur les conteneurs (exclure le style "cyberpunk rose/bleu").
2.  **Don't** ajouter d'ombres portées floues et diffuses sous les cartes qui donneraient un effet de lévitation hors-contexte.
3.  **Don't** utiliser d'images ou d'illustrations photo-réalistes de champignons atomiques réels afin d'éviter le sensationnalisme inapproprié.
4.  **Don't** utiliser de polices cursives, fantaisistes ou sérifées qui dénatureraient l'esprit sérieux et informatique de l'application.
5.  **Don't** réduire la taille des textes informatifs en dessous de `11px` pour préserver l'accessibilité sur terminal mobile.
6.  **Don't** masquer les coordonnées géographiques lors des frappes (les coordonnées géodésiques font partie intégrante de l'esthétique Bunker).
7.  **Don't** mélanger des arrondis larges (ex: `24px` ou `rounded-3xl`) avec l'esprit géométrique strict et rectiligne du Bunker.

---

## 13. Accessibilité & Conformité WCAG

*   **Contrastes calculés :**
    *   Texte blanc zinc-100 (`#f4f4f5`) sur fond zinc-950 (`#09090b`) : Ratio **18.2:1** (Niveau AAA).
    *   Texte secondaire zinc-400 (`#a1a1aa`) sur fond zinc-900 (`#18181b`) : Ratio **6.5:1** (Niveau AA).
    *   Bordure d'input zinc-800 (`#27272a`) sur fond zinc-950 : Démarcation mécanique claire.
*   **Niveau cible :** WCAG AA minimum pour l'intégralité du tableau de bord.
*   **Focus Visible :** Chaque élément interactif de saisie ou de choix de cible intègre une règle d'anneau de focus blanc net de `2px` (`outline-none focus:ring-2 focus:ring-red-500/50`).
*   **Motion :** Toutes les animations d'ondes thermiques et de suivi de missile respectent les préférences système de réduction de mouvement (`prefers-reduced-motion`) en se désactivant ou en devenant instantanées si l'utilisateur l'a spécifié dans son OS.

---

## Tokens CSS — Quick Start

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  /* Polices */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  /* Couleurs Sémantiques */
  --color-void-black: #09090b;
  --color-tactical-charcoal: #18181b;
  --color-bunker-border: #27272a;
  --color-blast-red: #ef4444;
  --color-thermal-orange: #f97316;
  --color-radiation-emerald: #10b981;
  --color-shockwave-amber: #d97706;
  
  /* Arrondis */
  --radius-control: 8px;
  --radius-card: 12px;
}
```
