# Charte Graphique & Guide d'Identité Visuelle : NUKEMAP EDU

---

## 1. Identité de Marque & Ton Visuel
NUKEMAP EDU adopte une thématique esthétique appelée **"Bunker Chic"** ou **"Brutalisme Tactique"**. Ce choix design s'inspire des consoles d'état-major de crise militaire, des interfaces radar ou des tableaux de gestion de menaces radioactives des années 80, couplé à une finition épurée et moderne à fort contraste.

Le ton visuel se veut **austère, factuel, hautement scientifique et sans compromis**. L'usage de dégradés flashy ou de couleurs pastel "fun" est proscrit pour préserver l'aspect dramatique, objectif et informatif des réalités physiques modélisées.

---

## 2. Le Logo & Ses Variantes

### Identifiant Principal
L'emblème associe un noyau d'atome stylisé encerclant une mire orthogonale de repérage de cible géographique :
- **Usage recommandé** : Placé en haut à gauche des consoles avec l'étiquette sémantique `EDU` flanquée d'un liseré gris de délimitation technique.
- **Taille minimale d'intégration** : `32x32px` pour conserver la lisibilité des axes radar internes.

### Lignes Directrices d'Usage
*   **Sur fond sombre (Default)** : Logo monochrome blanc ou bicolore blanc & rouge vermillon (`#ef4444`).
*   **Sur fond clair (Proscrit)** : Aucun usage clair n'est toléré afin de respecter l'ambiance ténébreuse propice aux consoles de commandement radar d'abris atomiques.

---

## 3. Palette de Couleurs

### Couleurs Principales (Fondation & Structure)
| Couleur | Code Hexadécimal | Usage Sémantique |
| :--- | :--- | :--- |
| **Bunker Noir** | `#09090b` (`zinc-950`) | Arrière-plan global, enveloppe de base |
| **Obsidienne** | `#18181b` (`zinc-900`) | Cartes secondaires, bordures d'inputs, sidebar |
| **Gris Acier** | `#27272a` (`zinc-800`) | Bordures principales, délimiteurs, glissières |
| **Béton Brut** | `#71717a` (`zinc-500`) | Textes de métadonnées, légendes des graphes |
| **Blanc Cendré** | `#f4f4f5` (`zinc-100`) | Titres, données actives prioritaires |

### Couleurs Sémantiques (Seuils de Danger)
| Niveau de Menace | Code Hexadécimal | Condition d'Application |
| :--- | :--- | :--- |
| **Danger Absolu / Plasma** | `#ef4444` (`red-500`) | Boule de feu, limite d'onde à 20 psi, boutons CTA |
| **Alerte Intermédiaire** | `#f97316` (`orange-500`) | Brûlures du 3e degré, onde à 5 psi, traînée balistique |
| **Risque Modéré** | `#eab308` (`yellow-500`) | Onde à 1 psi, bris de vitres, vitesse de tsunami côtier |
| **Sécurité relative** | `#10b981` (`emerald-500`) | Zone hors de danger immédiat, statut sain |

---

## 4. Typographie

L'alliance typographique s'appuie sur deux familles de caractères Google Fonts :

1.  **Police Principale (UI & Corps de Texte) : Inter**
    *   *Usage* : Boutons, menus, paragraphes explicatifs, cas pratiques.
    *   *Poids préconisés* : `Regular (400)` pour le lissé de lecture, `Medium (500)` et `Bold (700)` pour la découpe d'actions.
2.  **Police de Télémétrie (Données, Graphes, Minuteries) : JetBrains Mono**
    *   *Usage* : Compteur de temps `T+0.00s`, coordonnées GPS, calculs de tsunamis, en-têtes de télémétrie.
    *   *Caractéristique* : Espacement régulier des caractères évitant les sauts de glissements lors du rafraîchissement d'indicateurs de données réactifs.

---

## 5. Règles d'Interface & Composants Stylisés

### Boutons d'Action Militaires
*   **Bordures de Coupe** : Arrondis modérés (`rounded-lg` soit `8px`) évoquant la rigidité des touches de panneaux de commande réels.
*   **États d'interaction** :
    *   *Default* : Couleur vermillon mate `#dc2626` ou anthricite brute `#27272a`.
    *   *Hover* : Légère surbrillance photonique (`box-shadow: 0 0 15px rgba(239, 68, 68, 0.4)`).
    *   *Active* : Effet d'enfoncement mécanique par échelle discrète (`scale-95`).

### Espacements de Grille (Layout Rule)
Toute l'application est structurée selon un pas géométrique de **8px** (Saut de grille `px-4`, `py-6`, `pb-8`) :
- Écarter systématiquement les statistiques physiques de la map pour préserver des marges claires.
- Éviter d'étaler trop de textes dans la sidebar pour ne pas saturer l'utilisateur face à la complexité des indicateurs de surpression.

---

## 6. Iconographie
*   **Bibliothèque exclusive** : `lucide-react`.
*   **Directives de style** : Icônes vectorielles fines à épaisseur constante de `1.5px` ou `2.0px`. Aucun effet d'ombre interne, aucune couleur 3D de dégradé. Uniformité des formats des icônes pour chaque widget de paramétrage.
