---
agent: Directives_Recreation_Templates
commande: template:recreate
declencheurs:
  - gabarits de recréation
  - page en construction
  - hero produit
  - hero portfolio
action: Gabarits structurels réutilisables avec slots paramétrables pour pages d'attente et sections hero sans invention
---

# DIRECTIVES DE RECRÉATION — Templates réutilisables
# 3 designs analysés → specs génériques, slots [ENTRE CROCHETS] à remplir au moment de l'usage réel.
# Aucun contenu de projet inventé ici. Copier ce bloc dans le projet concerné, remplir les slots, coder.

---

## 1. PAGE "EN CONSTRUCTION"

Source : illustration stock 3D (personnage BTP + panneau) — PAS une réf de design d'interface,
juste un gabarit de contenu à convertir en vrai composant web. Ne jamais utiliser l'image stock
elle-même (droits tiers) — reconstruire en CSS/SVG ou générer un visuel original.

### Structure
```
- Fond plein cadre, couleur unique ou dégradé doux (pas de photo stock)
- Icône/illustration centrale originale (voir prompt génération ci-dessous)
- Titre : "[NOM PROJET] arrive bientôt" ou équivalent
- Sous-titre optionnel : "[DATE DE LANCEMENT ESTIMÉE]" ou "Revenez bientôt"
- Optionnel : champ email "être notifié au lancement" (si collecte de leads voulue)
- Optionnel : icônes réseaux sociaux du projet
```

### Slots à remplir
```
[NOM PROJET]           → nom réel du site/app
[DATE LANCEMENT]        → si connue, sinon omettre plutôt qu'inventer
[COULEUR ACCENT]        → piocher Agents_Bibliotheque_Palettes.md selon le sujet réel du projet
[EMAIL COLLECTE ?]      → oui/non selon besoin réel
```

### Prompt de génération d'icône (si illustration voulue, pas juste texte)
```
Icône plate minimaliste style [outline/duotone/flat], sujet : chantier/construction en cours,
palette [2 couleurs de la palette du projet], fond transparent, pas de personnage 3D réaliste
(éviter le style stock daté), format carré, usage web.
```

### Stack
HTML/CSS pur ou composant React unique, aucune dépendance lourde. Animation légère possible
(pulse doux sur l'icône, respecte prefers-reduced-motion — Agents_Standards_Interface_Web.md
Section 2).

---

## 2. HERO PRODUIT — TITRE GÉANT COMME FOND TYPOGRAPHIQUE

Basé sur : design_reference_europa-vin-typo-geante.md — principe transposable à tout produit/
service avec un nom court (1-2 mots).

### Structure (slots)
```
- Cadre plein cadre, bordure épaisse couleur [ACCENT UNIQUE]
- Titre = [NOM PRODUIT/SERVICE, 1-2 mots max] en display condensé très gras, majuscules,
  occupe 80-100% largeur du cadre, sert de FOND à la composition (pas juste un titre au-dessus)
- Photo/visuel du produit détouré, posé en diagonale, chevauchant le titre (devant certaines
  lettres, éventuellement un élément décoratif derrière une partie du produit)
- Badge optionnel (ex: "NOUVEAU", "PROMO") en coin haut-droit, forme sticker/tampon
- Bloc description courte + CTA pilule sous le titre, aligné à gauche
```

### Slots à remplir
```
[NOM PRODUIT/SERVICE]   → OBLIGATOIRE court (1-2 mots), sinon le titre géant devient illisible
[ACCENT UNIQUE]         → UNE seule couleur (cadre+titre+CTA), piocher bibliothèque palettes
[VISUEL PRODUIT]        → photo réelle détourée, jamais générée/inventée si produit réel existe
[TEXTE DESCRIPTION]     → réel, jamais lorem
[CTA LIBELLÉ]           → action réelle ("Commander", "Voir l'offre"...)
```

### Règle dure (Section 14-16 du fichier source)
Vérifier qu'un texte SECONDAIRE garde le nom produit lisible normalement ailleurs sur la page
(SEO/accessibilité) — le titre géant est un élément graphique, pas le seul porteur du nom.
Si nom > 2 mots → ABANDONNER ce pattern, ne pas le forcer.

### Stack
Titre en position absolue, z-index intermédiaire entre fond et image produit (PNG détouré).
Cadre en border CSS épais. Voir Agents_Traitement_Visuel.md Section 2-3 pour le détourage/compositing.

---

## 3. HERO PORTFOLIO — SUJET DUOTONE + CERCLE + CAROUSEL MINIMAL

Basé sur : design_reference_statue-rouge-portfolio.md — transposable à tout portfolio créatif
(design, photo, dev, freelance) qui veut une identité forte à 1 seule couleur.

### Structure (slots)
```
- Carte/fenêtre à coins arrondis sur fond noir/anthracite
- Nav : logo à gauche, liens centrés [3 LIENS RÉELS]
- Bloc texte gauche : mention petite [TAGLINE COURTE], titre 1 mot énorme [MOT-CLÉ MÉTIER],
  description courte, lien "[CTA TEXTE]" + flèche
- Sujet à droite : photo/visuel du travail ou portrait, teinté dans LA MÊME couleur accent que
  le reste (duotone total, pas juste un filtre sur le fond), posé devant un cercle plein de
  la même teinte
- Indicateur carousel minimal en bas-gauche : "01 ——— [NOMBRE TOTAL]"
```

### Slots à remplir
```
[3 LIENS RÉELS]         → nav réelle du portfolio (ex: About/Work/Contact)
[TAGLINE COURTE]        → réelle, pas générique
[MOT-CLÉ MÉTIER]        → le métier/mot fort à afficher en gros (1 mot)
[CTA TEXTE]             → ex: "Voir plus"
[ACCENT UNIQUE]         → 1 seule couleur pour logo+cercle+duotone sujet
[VISUEL SUJET]          → vrai travail/portrait, jamais une sculpture/stock à droit tiers
[NOMBRE TOTAL SLIDES]   → si carousel réel, sinon retirer l'indicateur entièrement
```

### Règle dure
Duotone appliqué au sujet ET au graphisme (logo, cercle) — jamais un accent posé sur le fond seul
pendant que le sujet reste en couleurs naturelles (perd la cohérence qui fait la force du pattern).
Ne jamais reproduire une œuvre d'art/sculpture existante en photo — utiliser le vrai visuel du
travail du portfolio ou un portrait réel.

### Stack
Sujet en CSS filter (hue-rotate/saturate) ou retouche pré-faite pour le duotone. Cercle en
`<div>` `border-radius:50%` en z-index inférieur au sujet. Indicateur carousel en composant
réutilisable (props: slide actif, total).

---

## RAPPEL — QUAND UN VRAI PROJET ARRIVE

```
1. Remplir les slots ci-dessus avec le contenu RÉEL du projet (jamais inventer)
2. Piocher palette/typo dans Agents_Bibliotheque_Palettes.md / Agents_Bibliotheque_Typographies.md
   selon le sujet réel — jamais recopier les couleurs des réfs sources
3. Croiser contre Agents_Direction_Artistique.md Section 3 (3 looks génériques proscrits)
4. Si le nom/mot-clé ne colle pas au pattern (trop long, pas de visuel produit détourable) →
   abandonner le template plutôt que le forcer
```
