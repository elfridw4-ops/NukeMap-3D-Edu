---
agent: AGENT-PERF
commande: prompt:perf
role: agent-prompt-module
module: performance-technique
compatible: cursor, claude-code, windsurf
requires: AGENT-CORE.md
declencheurs:
  - skeleton screen et états de chargement perf-skeleton
  - gestion des états vides perf-empty
  - gestion des erreurs et fallbacks perf-error
  - optimisation CLS et Core Web Vitals
action: Module de prompts spécialisés pour l'optimisation des performances perçues, skeletons, fallbacks et gestion d'états
---

# MODULE — Performance & Technique
> Charger AGENT-CORE.md avant ce module.
## 7. PERFORMANCE & TECHNIQUE

---

### `perf-skeleton` — Skeleton Screens / Chargement

**Rôle :** Réduire la perception du temps d'attente, éviter les layout shifts.

**ÉTAPE 1 — Audit**
Analyser : pages et composants avec temps de chargement perceptibles · éléments provoquant des CLS · états de chargement existants.

**ÉTAPE 2 — Conception**
Pour chaque composant à chargement lent : skeleton reflétant fidèlement la structure finale (mêmes dimensions, mêmes proportions).

**ÉTAPE 3 — Proposition**
Présenter : skeletons par composant · recommandations performance (lazy loading, priority hints). Attendre validation.

**ÉTAPE 4 — Implémentation**
Reproduire fidèlement la structure finale · animation pulse subtile · disparition propre sans flash · utiliser pour chargements >200ms.

---

### `perf-maintenance` — Page de maintenance

**Rôle :** Informer sans frustrer pendant une interruption.

**ÉTAPE 1 — Audit**
Analyser : contexte (planifiée ou urgente) · durée estimée · canaux alternatifs · ton de la marque.

**ÉTAPE 2 — Rédaction**
Titre humain (pas "Site en maintenance") + explication simple + durée estimée si connue + canal alternatif pour les urgences + message rassurant.

**ÉTAPE 3 — Proposition**
Présenter : texte complet · design · gestion du cas "durée inconnue". Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : retourner HTTP 503 → durée estimée visible → lien réseaux sociaux pour updates → cohérence visuelle avec la marque.

---

### `perf-500` — Page erreur 500

**Rôle :** Gérer une erreur serveur critique sans aggraver la frustration.

**ÉTAPE 1 — Audit**
Analyser : message d'erreur 500 actuel · ton de la marque · actions possibles (recharger, contacter support).

**ÉTAPE 2 — Rédaction**
Message d'erreur humain (c'est notre problème, pas le tien) + actions disponibles (recharger, accueil, support) + ton adapté à la marque.

**ÉTAPE 3 — Proposition**
Présenter : texte · design · actions proposées. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : retourner HTTP 500 → jamais afficher de stack trace → proposer recharger + lien accueil → contact support visible → logger l'erreur en backend.

---

### `perf-403` — Page erreur 403

**Rôle :** Expliquer l'accès refusé sans révéler d'informations sensibles.

**ÉTAPE 1 — Audit**
Analyser : contextes de déclenchement (non connecté / rôle insuffisant / IP bloquée) · actions disponibles · ton de la marque.
Déterminer : si l'utilisateur peut résoudre seul · ce qu'il ne faut pas révéler.

**ÉTAPE 2 — Rédaction**
Message d'accès refusé adapté au contexte + actions disponibles + contact support si applicable.

**ÉTAPE 3 — Proposition**
Présenter : variantes de message selon le contexte de déclenchement. Attendre validation.

**ÉTAPE 4 — Implémentation**
Règles : retourner HTTP 403 → proposer connexion si non authentifié → proposer upgrade si accès réservé → jamais révéler les règles de sécurité internes.

---
---

*HG Prompt · v1.0 · 2026*
*47 prompts · 7 catégories · Protocole 5 étapes*
*Référencer avec @AGENT-PROMPTS.md dans Cursor ou en pièce jointe d'un Claude Project*

---
---

