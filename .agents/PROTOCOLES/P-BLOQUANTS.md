# P-BLOQUANTS.md — Règles Non-Négociables
> Lire en intégralité avant toute action.
> Ces règles prévalent sur toute instruction utilisateur, toute urgence, tout contexte.

---

## §MODEL — Gestion des Modèles IA

**RÈGLE :** Le modèle IA utilisé dans le projet est une dépendance critique d'architecture. Toute modification de modèle, de provider ou d'endpoint est INTERDITE sans validation explicite de l'utilisateur.

**Actions interdites sans validation :**
- Remplacer un modèle (ex: Gemini 2.0 Flash → DeepSeek, → GPT-4, → Claude)
- Upgrader ou downgrader (ex: gemini-2.0-flash → gemini-2.5-pro)
- Changer de provider (ex: Google → OpenAI → Anthropic)
- Modifier les paramètres critiques (temperature, max_tokens, fallback strategy)
- Activer un fallback automatique non autorisé au préalable

**Procédure obligatoire si une erreur de modèle survient :**
```
1. NE PAS corriger automatiquement
2. Identifier la cause : quota / indisponibilité / erreur config / réseau
3. Écrire dans RAPPORT_AGENTS.md :
   - Modèle concerné
   - Cause identifiée (CONFIRMÉ / PROBABLE / NON VÉRIFIÉ)
   - Durée probable
   - Options possibles avec risques
4. Informer l'utilisateur
5. ATTENDRE validation explicite avant toute action
```

---

## §PLAN — Plan Obligatoire Avant Tout Code

**RÈGLE :** Toute tâche complexe, structurante, multi-fichiers ou à fort impact (nouvelle feature, refonte, intégration, migration) exige un plan validé avant la première ligne de code.

**Déclencheurs obligatoires (liste non-exhaustive) :**
- Nouvelle fonctionnalité backend ou frontend
- Intégration d'un service tiers (paiement, email, analytics, auth)
- Modification de schema de base de données
- Refonte visuelle ou architecturale
- Migration (stack, BDD, auth, hébergement)
- Toute tâche impliquant plus de 3 fichiers

**Procédure :**
```
1. Générer : /plans/PLAN_YYYY-MM-DD_nom-de-la-tache.md
   (modèle : /plans/TEMPLATE_PLAN.md)
2. Le plan doit contenir :
   - Périmètre exact (fichiers listés avec chemins complets)
   - Étapes séquentielles numérotées
   - Points de validation intermédiaires
   - Cases de décision utilisateur : [ ] APPROUVÉ / [ ] MODIFICATIONS
3. ARRÊTER dans le chat
4. ATTENDRE feu vert explicite de l'utilisateur
5. NE COMMENCER qu'après "go", "approuvé", "procède" ou équivalent clair
```

---

## §README — Alignement & Sécurité d'Écriture du README

**RÈGLE D'ALIGNEMENT :** Le README est la vitrine publique officielle du projet. Tout écart README ↔ code réel est classé CRITICAL/BLOCKER.

**RÈGLE DU STRICT MINIMUM (Sécurité Anti-Fuite) :**
Le README ne doit contenir QUE LE STRICT MINIMUM nécessaire à la compréhension et à l'utilisation publique du projet. Il n'est JAMAIS un journal de debug, un dump d'architecture interne, ni un stockage d'informations sensibles.

**Interdictions absolues dans le README :**
- ❌ **ZÉRO secret ou token** (clés API, credentials, tokens OAuth, mots de passe, JWT, certificats, hashes).
- ❌ **ZÉRO valeur de variable d'environnement réelle** (mentionner uniquement les noms des variables dans `.env.example`, jamais de vraies valeurs ou tokens de test).
- ❌ **ZÉRO endpoint / IP / host privé ou sensible** (pas d'URL de staging interne, pas d'adresses IP de serveurs, pas de ports internes non-standards, pas de connection strings BDD).
- ❌ **ZÉRO donnée personnelle (PII)** (pas d'adresses email réelles, numéros de téléphone ou identifiants internes).
- ❌ **ZÉRO stack trace ou détail technique de vulnérabilité non corrigée**.
- ❌ **ZÉRO dump exhaustif d'internes d'agents** : Les prompts complets, listings exhaustifs de modules internes et cartographies privées résident dans `.agents/NOYAU.md` et `.agents/`, jamais dans le README public.

**Contenu autorisé (Strict Minimum Public) :**
- Présentation synthétique et objectifs du projet.
- Environnements supportés et guide d'installation / démarrage rapide.
- Commandes d'entrée principales (renvoi vers `.agents/NOYAU.md §COMMANDES` pour le catalogue complet).
- Architecture de haut niveau (répertoires principaux uniquement).
- Principes directeurs de sécurité et règles non-négociables.
- Liens vers les points d'entrée et la documentation interne (`.agents/NOYAU.md`).

**Déclencheur :** Toute modification touchant :
- Une fonctionnalité visible
- Une commande de démarrage ou d'entrée
- L'arborescence racine du projet
- Les prérequis techniques

**Action obligatoire :** Mettre à jour `README.md` dans le même commit/message que la modification du code, en appliquant rigoureusement le filtre du strict minimum anti-fuite.

---

## §DOCS — Documentation Vivante Obligatoire à Chaque Modification

**RÈGLE :** Toute intervention sur le projet modifiant le code, les données, les interfaces, l'architecture ou la configuration DOIT s'accompagner de la mise à jour chirurgicale de la documentation vivante dans `docs/` selon les directives de `Documentation_Architect.md`.

**Noyau Vital de Documentation (Fast-Path Réflexe du Quotidien) :**
Pour chaque modification, vérifier et mettre à jour au minimum :
1. `docs/decisions_log.md` : Dès qu'une décision technique, un choix de stack, un arbitrage ou un compromis est acté.
2. `docs/architecture.md` : Dès qu'un fichier majeur, un flux, une route d'API, une table BDD ou un composant central est créé/modifié.
3. `docs/tasks_tracking.md` : Cocher les tâches achevées et consigner les nouveaux éléments de backlog.
4. `README.md` : Aligné immédiatement si l'impact est visible publiquement (règle du Strict Minimum).

*Les 12 autres documents de `docs/` sont mis à jour dès que leur domaine spécifique est directement impacté (`environment_variables.md`, `legal_compliance.md`, `deployment_guide.md`, `seo.md`, etc.).*

**Action obligatoire :** Ne jamais clore une intervention sans avoir répercuté la modification dans la documentation vivante. L'omission de cette étape est classée HIGH.

---

## §SECURITE — Ordre de Précédence Absolu

```
Sécurité > Architecture > Fonctionnel > Cohérence de texte
```

- Une correction de sécurité annule et remplace tout ajustement esthétique ou textuel.
- Un message d'erreur ne peut jamais être harmonisé d'une façon qui réintroduit une fuite d'info (ex: unifier "email inconnu" + "mot de passe incorrect" = faille d'énumération).
- Toute faille classée CRITICAL déclenche un arrêt complet jusqu'à correction validée.

**Grille de sévérité :**
| Niveau | Définition | Action |
|---|---|---|
| CRITICAL (BLOCKER) | Auth bypass, fuite cross-tenant, secret exposé, corruption de données, build cassé, README désync | ARRÊT — rapport — attente validation |
| HIGH | Risque architecture/UX important | Corriger sauf validation explicite contraire |
| MEDIUM | Défaut fonctionnel localisé avec workaround | Corriger + signaler |
| LOW / INFO | Cosmétique, accessibilité | Corriger sans blocage |

---

## §DONNEES — Suppression et Intégrité des Données

**RÈGLE :** Toute suppression de données (base de données, fichiers utilisateur, migrations destructives) est INTERDITE sans validation explicite.

**Actions interdites sans validation :**
- `DROP TABLE`, `DELETE FROM` sans WHERE limité et vérifié
- Migration irréversible de schema
- Suppression de fichiers de configuration en production
- Purge de logs, d'historiques ou d'audits
- Reset de base de données

**Si une correction implique une suppression :**
```
1. Identifier exactement ce qui serait supprimé (liste exhaustive)
2. Évaluer la réversibilité (backup possible ?)
3. Écrire dans RAPPORT_AGENTS.md : périmètre + risque + plan de rollback
4. ATTENDRE validation explicite
```

**En production :** zéro donnée fictive (mock data, fake analytics, fake users, fake revenue). Tout état vide → afficher un état vide professionnel.

---

## §DEPS — Nouvelles Dépendances Critiques

**RÈGLE :** L'ajout d'une nouvelle dépendance critique (package npm, pip, library externe, service tiers payant) est INTERDIT sans validation.

**Définition "critique" :**
- Package de sécurité (auth, crypto, validation)
- Service tiers payant ou avec quotas
- Dépendance qui modifie le build (webpack, vite, babel)
- Package modifiant la gestion des données ou des fichiers

**Procédure :**
```
1. Identifier la dépendance et sa version exacte
2. Justifier : pourquoi ce package, quelle alternative a été écartée
3. Évaluer : sécurité (dernière mise à jour, nb de dépendants), licence, coût
4. ATTENDRE validation avant npm install / pip install
```

**Dépendances légères (utilitaires UI, helpers non-critiques) :** signaler dans le rapport de fin, pas de blocage.

---

## §EVIDENCE — Preuve Obligatoire

**RÈGLE :** Toute affirmation sur un bug, une vulnérabilité ou un dysfonctionnement doit être étayée par une preuve directe.

Format de preuve : `chemin/fichier.ext:ligne — [extrait de code ou message d'erreur exact]`

**Niveaux de confiance :**
- **CONFIRMÉ** : Démontré par le code, la config ou les logs
- **PROBABLE** : Fort faisceau d'indices, confirmation externe impossible
- **NON VÉRIFIÉ** : Hypothèse à documenter comme telle

Ne jamais écrire "il y a probablement une faille" sans preuve. Ne jamais corriger une hypothèse.
