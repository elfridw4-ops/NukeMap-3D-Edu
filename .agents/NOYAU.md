# NOYAU.md — Index Central & Routage
> Ce fichier fusionne ORCHESTRATEUR.md et ROUTAGE_ET_COMPATIBILITE_AGENTS.md.
> Navigation par balises : l'IA lit UNIQUEMENT la section §TAG pertinente.
> Lu via : GEMINI.md / CLAUDE.md / AGENTS.md selon l'environnement.

---

## §DEPART — Comment naviguer dans ce fichier

```
Intention détectée → lire §ROUTAGE → identifier l'agent → aller à §AGENTS[nom]
Situation de chaîne → lire §CHAINES
Commande directe → lire §COMMANDES
Conflit entre agents → lire §ARBITRAGE
Mode autonome → lire §AUTOAGENT (puis P-AUTOAGENT.md)
Coordination paiement/email/analytics → lire §CONSENTEMENT
```

---

## §ROUTAGE — Tableau de Routage par Intention

| # | Déclencheurs (mots-clés, demandes) | Commande | Agent principal | Section cible |
|---|---|---|---|---|
| 1 | audit frontend, XSS, DOM, tokens, sécurité client | `audit:front` | `SECURITY/AUDIT-SECURITE.md` §FRONTEND + `SECURITY/Antigravity_Analysts.md` | §AGENTS[audit-securite] |
| 2 | audit backend, API, base de données, auth, rôles, RBAC | `audit:back` | `SECURITY/AUDIT-SECURITE.md` §BACKEND | §AGENTS[audit-securite] |
| 3 | audit complet, vue 360°, check-up global, diagnostic projet | `audit:full` | Séquence : Antigravity → AUDIT-SECURITE → AUDIT-COHERENCE | §CHAINES[audit-complet] |
| 4 | cartographie projet, reconnaissance code, diagnostic initial | `audit:analysts` | `SECURITY/Antigravity_Analysts.md` | §AGENTS[analysts] |
| 5 | bug, erreur, crash, régression, ça ne marche pas, erreur 500/401 | `bug:investigate` / `code:debug` | `workflows/w-bug-investigation.md` + `CODE/Agents_Debug_Correction.md` | §AGENTS[debug] |
| 6 | audit panel admin, back-office, espace administrateur | `audit:admin` | `PANEL_ADMIN/Agents-audit-panel-admin.md` | §AGENTS[panel-admin-audit] |
| 7 | panel admin conception, back-office client non-développeur | `admin:conception` | `PANEL_ADMIN/Agents-conception-panel-admin-client.md` | §AGENTS[panel-admin-conception] |
| 8 | cohérence textes, labels, messages d'erreur, terminologie | `audit:coherence` | `SECURITY/AUDIT-COHERENCE.md` | §AGENTS[coherence] |
| 9 | intégrité logique, contrat fonctionnel, intention vs code | `logique:audit` / `logique:contrat` | `SECURITY/AGENT-CONTRAT-LOGIQUE.md` | §AGENTS[contrat-logique] |
| 10 | licences logicielles, CGU, CGV, EULA, juridique, OHADA, APDP | `licence:audit` | `SECURITY/AGENT-LICENCES.md` | §AGENTS[licences] |
| 11 | design system, charte graphique, direction artistique, anti-look IA | `da:setup` | `UI_UX/Agents_Direction_Artistique.md` | §CHAINES[nouveau-projet] |
| 12 | palettes de couleurs, harmonies chromatiques atelier | `palette:browse` | `UI_UX/Agents_Bibliotheque_Palettes.md` | §AGENTS[ui-ux] |
| 13 | typographies, google fonts, pairings typographiques | `typo:browse` | `UI_UX/Agents_Bibliotheque_Typographies.md` | §AGENTS[ui-ux] |
| 14 | analyse référence UI/UX/Motion, décorticage maquette/vidéo | `design:reference` | `UI_UX/Agents_Design_Reference.md` | §AGENTS[ui-ux] |
| 15 | nouveau projet vitrine, landing page, site marketing from scratch | `site:vitrine-from-scratch` | `UI_UX/Agents_Conception_Site_Immersif.md` | §CHAINES[nouveau-projet] |
| 16 | SaaS, e-commerce, portfolio, blog, outil from scratch | `site:app-from-scratch` | `UI_UX/Agents_General_Immersif.md` | §CHAINES[nouveau-projet] |
| 17 | refonte visuelle complète, redesign, repenser l'existant | `site:refonte` | `UI_UX/Agents_Refonte_Complete.md` | §AGENTS[refonte] |
| 18 | détourage, compositing, fonds génératifs, visuels | `visual:treatment` | `UI_UX/Agents_Traitement_Visuel.md` | §AGENTS[ui-ux] |
| 19 | standards d'interface web, accessibilité WCAG, micro-interactions | `ui:standards` | `UI_UX/Agents_Standards_Interface_Web.md` | §AGENTS[ui-ux] |
| 20 | animation 3D, Three.js, WebGL, shaders GLSL, React Three Fiber, WebGPU/TSL, GLTF/GLB, Spline 3D | `3d:animation` | `UI_UX/AGENTS_ANIMATION_3D.md` | §AGENTS[ui-ux] |
| 21 | vidéo IA, Veo 3, Omni Flash, prompt vidéo hero statique | `video:prompt` | `UI_UX/Agents_Generation_Video_IA.md` | §AGENTS[ui-ux] |
| 22 | gabarits de recréation, en construction, hero produit | `template:recreate` | `UI_UX/Directives_Recreation_Templates.md` | §AGENTS[ui-ux] |
| 23 | architecture backend en 10 blocs, schéma API, modèle serveur | `backend:conception` | `CODE/Agents_Conception_Backend.md` | §AGENTS[backend] |
| 24 | bibliothèque centrale prompts web, protocole 5 étapes | `code:core` | `CODE/AGENT-CORE.md` | §AGENTS[core] |
| 25 | prompts authentification, login, signup, oauth, session | `prompt:auth` | `CODE/AGENT-AUTH.md` | §AGENTS[core] |
| 26 | prompts navigation, header, sidebar, breadcrumb, drawer | `prompt:nav` | `CODE/AGENT-NAV.md` | §AGENTS[core] |
| 27 | prompts pages types, profil, dashboard, settings, 404 | `prompt:pages` | `CODE/AGENT-PAGES.md` | §AGENTS[core] |
| 28 | prompts composants UI immersifs, hero, modals, cards, tabs | `prompt:ui` | `CODE/AGENT-UI.md` | §AGENTS[core] |
| 29 | prompts formulaires, validation, multi-étapes, table de données | `prompt:forms` | `CODE/AGENT-FORMS.md` | §AGENTS[core] |
| 30 | prompts pieds de page, footers minimalistes ou complets | `prompt:footer` | `CODE/AGENT-FOOTERS.md` | §AGENTS[core] |
| 31 | prompts landing pages lead gen, conversion, saas | `prompt:lp` | `CODE/AGENT-LP.md` | §AGENTS[core] |
| 32 | prompts e-commerce, catalogue, produit, panier, checkout | `prompt:ecom` | `CODE/AGENT-ECOM.md` | §AGENTS[core] |
| 33 | prompts emails transactionnels, bienvenue, reset password | `prompt:email` | `CODE/AGENT-EMAIL.md` | §AGENTS[core] |
| 34 | prompts performance technique, skeletons, fallbacks, CLS | `prompt:perf` | `CODE/AGENT-PERF.md` | §AGENTS[core] |
| 35 | prompts densifiés haute conversion production critique | `prompt:dense` | `CODE/AGENT-DENSE.md` | §AGENTS[core] |
| 36 | revue de code senior, contrôle qualité, PR review | `code:review` | `CODE/Agents_Revue_Code.md` (ou `MONITORING/`) | §AGENTS[revue] |
| 37 | commenter le code, documentation explicative (pourquoi) | `code:comment` | `CODE/Agents_Commentaire_Code.md` (ou `MONITORING/`) | §AGENTS[commentaire] |
| 38 | debug ciblé cause racine, correction minimale traçable | `code:debug` | `CODE/Agents_Debug_Correction.md` (ou `MONITORING/`) | §AGENTS[debug] |
| 39 | paiement FedaPay, Mobile Money MTN/Moov/Orange, XOF | `fedapay:integrate` / `skill:fedapay` | `FINANCIAL_SYSTEME/Agents_Integration_Fedapay.md` | §AGENTS[fedapay] |
| 40 | simulation webhook FedaPay HMAC, test signature | `fedapay:test` | `.agents/tools/fedapay_test_webhook.js` | §COMMANDES |
| 41 | paiement Bictorys API, passerelle fiat/crypto Afrique | `bictorys:integrate` | `FINANCIAL_SYSTEME/AGENTS_INTEGRATION_BICTORYS.md` | §AGENTS[bictorys] |
| 42 | paiement SasPay API, passerelle Mobile Money | `saspay:integrate` | `FINANCIAL_SYSTEME/AGENTS_INTEGRATION_SASPAY.md` | §AGENTS[saspay] |
| 43 | stratégie pricing SaaS, 5 gates, matrice de décision | `pricing:strategy` / `skill:pricing` | `FINANCIAL_SYSTEME/AGENT-STRATEGIE-PRICING.md` | §AGENTS[pricing] |
| 44 | plan de test facturation et webhooks, scénarios sandbox | `billing:test` | `FINANCIAL_SYSTEME/TEST-BILLING-FEDAPAY.md` | §AGENTS[billing] |
| 45 | analytics GA4, Google Analytics 4, Consent Mode v2 | `analytics:ga4` | `ANALYTICS_AND_FEEDBACK_USER/AGENT-ANALYTICS-GA4.md` | §CONSENTEMENT |
| 46 | Microsoft Clarity, session replay, heatmaps | `analytics:clarity` | `ANALYTICS_AND_FEEDBACK_USER/AGENT-CLARITY.md` | §CONSENTEMENT |
| 47 | Resend emailing, email transactionnel et marketing | `email:resend` | `ANALYTICS_AND_FEEDBACK_USER/AGENT-EMAIL-RESEND.md` | §CONSENTEMENT |
| 48 | module feedback utilisateur, widget, admin feedback | `feedback:setup` | `ANALYTICS_AND_FEEDBACK_USER/AGENT-FEEDBACK.md` | §AGENTS[feedback] |
| 49 | llms.txt, agentic browsing, annotations WebMCP | `agentic:llms` | `ANALYTICS_AND_FEEDBACK_USER/Agentic-browsing.md` | §AGENTS[seo] |
| 50 | référencement SEO on-page, GEO, meta, sitemap, robots | `seo:audit` | `ANALYTICS_AND_FEEDBACK_USER/REFERENCEMENT.md` | §AGENTS[seo] |
| 51 | architecte documentaliste, 16 documents d'architecture | `doc:architect` | `HELPER_AND_DOCS/Documentation_Architect.md` | §AGENTS[doc] |
| 52 | nom de marque, brand naming, disponibilité domaine, prompt logo | `brand:naming` | `HELPER_AND_DOCS/AGENT-NOMMAGE.md` | §AGENTS[nommage] |
| 53 | guide de déploiement automatique deployment_guide.md | `deploy:instructions` | `HELPER_AND_DOCS/Agents_Deployment_Instructions.md` | §AGENTS[deploiement] |
| 54 | base de données, migration, schéma BDD, persistance | `bdd:review` | `workflows/w-database-change-review.md` | §AGENTS[workflows] |
| 55 | nouvelle fonctionnalité cadrée sans régression | `feature:build` | `workflows/w-feature-implementation.md` | §AGENTS[workflows] |
| 56 | release gate rapide pré-déploiement immédiat | `deploy:check` | `workflows/w-pre-deployment-check.md` | §AGENTS[workflows] |
| 57 | release readiness, aptitude mise en production | `release:check` | `workflows/w-production-readiness.md` | §AGENTS[workflows] |
| 58 | refactoring maîtrisé sans altération de comportement | `code:refactor` | `workflows/w-refactor-safely.md` | §AGENTS[workflows] |
| 59 | sécurité applicative web/mobile, OWASP, DevSecOps (93 skills) | `skill:[nom]` | `.agents/skills/README.md` | §AGENTS[skills] |
| 60 | design tokens, design system, composants web | `design:system` | `skills/design-system/SKILL.md` | §AGENTS[skills] |
| 61 | vidéo de lancement du projet avec narration | `/brag` / `/brag --voice` | `skills/brag/SKILL.md` | §AGENTS[skills] |
| 62 | voix de marque, identité de marque | `/brand` | `skills/brand/SKILL.md` | §AGENTS[skills] |
| 63 | présentations HTML stratégiques, slides interactives | `/slides` | `skills/slides/SKILL.md` | §AGENTS[skills] |
| 64 | UI styling shadcn/ui + Tailwind CSS | `design:styling` | `skills/ui-styling/SKILL.md` | §AGENTS[skills] |
| 65 | intelligence UI/UX pro max, 79 styles, 192 palettes, 22 stacks | `ui:pro-max` | `skills/ui-ux-pro-max/SKILL.md` | §AGENTS[skills] |
| 66 | sélecteur palette et typographie atelier | `skill:palette` | `skills/palette-and-typography-picker/SKILL.md` | §AGENTS[skills] |
| 67 | implémentation de motion design 2D/DOM/SVG/Canvas 2D, GSAP, ScrollTrigger, Framer Motion, Web Animations API | `motion:engineering` | `UI_UX/AGENT_MOTION_ENGINEERING.md` | §AGENTS[ui-ux] |
| 68 | audit visuel, comparaison captures/maquette, fidélité visuelle, contrôle rendu desktop/mobile | `visual:qa` | `UI_UX/AGENT_VISUAL_DESIGN_QA.md` | §AGENTS[ui-ux] |

---

## §CHAINES — Chaînes Types d'Agents

### §CHAINES[nouveau-projet] — Projet from scratch (hors panel admin)

```
[1] HELPER_AND_DOCS/AGENT-NOMMAGE.md (si nom non défini)
[2] UI_UX/Agents_Direction_Artistique.md (Mode A)
[3] UI_UX/Agents_Bibliotheque_Palettes.md + UI_UX/Agents_Bibliotheque_Typographies.md
[4] UI_UX/Agents_Design_Reference.md (si refs UI fournies)
[5a] UI_UX/Agents_Conception_Site_Immersif.md → vitrine / landing / marketing
 OU
[5b] UI_UX/Agents_General_Immersif.md → SaaS / e-commerce / portfolio / blog / outil
    (JAMAIS les deux sur le même projet — choisir au cadrage)
[6] CODE/Agents_Conception_Backend.md (si le projet a un backend)
[6bis] UI_UX/Agents_Standards_Interface_Web.md (Mode CRÉATION : définir les exigences comportementales, d'accessibilité et de qualité AVANT l'implémentation)
[7] CODE/AGENT-CORE.md + workflows/w-feature-implementation.md (construction structurée des features selon les exigences validées)
[8bis] UI_UX/AGENTS_ANIMATION_3D.md (si une scène 3D temps réel a été décidée ; possède toute la scène WebGL/WebGPU)
[8ter] UI_UX/AGENT_MOTION_ENGINEERING.md (si une chorégraphie 2D/DOM/SVG/Canvas 2D validée doit être implémentée ; exclut toute scène 3D)
[9] MONITORING/Agents_Revue_Code.md
[10] Séquence audit → §CHAINES[audit-complet]
[10bis] UI_UX/AGENT_VISUAL_DESIGN_QA.md (après stabilisation du code et de l'audit ; si le rendu peut être exécuté/capturé)
[11] HELPER_AND_DOCS/Agents_Deployment_Instructions.md
[12] workflows/w-pre-deployment-check.md (gate de vérification finale avant release)
[13] ANALYTICS_AND_FEEDBACK_USER/REFERENCEMENT.md + ANALYTICS_AND_FEEDBACK_USER/Agentic-browsing.md
    HELPER_AND_DOCS/Documentation_Architect.md tourne en continu
```

### §CHAINES[refonte] — Refonte visuelle existante

```
[1] UI_UX/Agents_Refonte_Complete.md pilote TOUT
    (il appelle DA, Palettes, Typos, Références, Traitement_Visuel, Standards ; Motion Engineering et Animation 3D si leurs scopes sont requis ; Visual QA par lot ; Revue, Commentaire, Debug)
Ne PAS lancer Agents_General_Immersif sur une refonte.
Ne PAS lancer la chaîne nouveau-projet sur une refonte.
```

### §CHAINES[refactor] — Refactoring sans régression

```
[1] workflows/w-refactor-safely.md (cadrage, reconnaissance, invariants, pas de rewrite)
[2] MONITORING/Agents_Revue_Code.md (contrôle qualité et conformité)
[3] SECURITY/AGENT-CONTRAT-LOGIQUE.md §VERIF (vérification intégrité vs contrat)
```

### §CHAINES[audit-complet] — Avant livraison / mise en prod

```
ORDRE OBLIGATOIRE — ne jamais inverser :
[1] SECURITY/Antigravity_Analysts.md (carte du projet)
[2] SECURITY/AUDIT-SECURITE.md (Global ou Frontend ou Backend selon périmètre)
[3] SECURITY/AUDIT-COHERENCE.md (après stabilisation code+sécurité)
Optionnel entre [1] et [3] : SECURITY/AGENT-CONTRAT-LOGIQUE.md (logique:audit)
Séquence annoncée dans le chat avant démarrage.
Attendre validation du rapport de chaque phase avant de passer à la suivante.
```

### §CHAINES[panel-admin] — Panel admin

```
Conception : PANEL_ADMIN/Agents-conception-panel-admin-client.md
Audit :      PANEL_ADMIN/Agents-audit-panel-admin.md
Ne pas lancer AGENT-CONTRAT-LOGIQUE sur le panel admin en même temps —
  scoper logique:audit au reste du projet.
```

### §CHAINES[backend] — Backend / API / Base de données

```
[1] CODE/Agents_Conception_Backend.md
[2] workflows/w-database-change-review.md (si changement de schéma / persistance / migration)
[3] MONITORING/Agents_Revue_Code.md
[4] SECURITY/AUDIT-SECURITE.md §BACKEND
Paiement ouest-africain → FINANCIAL_SYSTEME/Agents_Integration_Fedapay.md
```

### §CHAINES[validation-visuelle] — Contrôle de fidélité visuelle

```
[1] Récupérer le brief, la direction artistique validée, les références et les critères d'acceptation.
[2] Lancer le projet avec les commandes déjà présentes — ne pas modifier la configuration pour obtenir un démarrage artificiel.
[3] Capturer les vues demandées sur des viewports définis et dans des états reproductibles.
[4] UI_UX/AGENT_VISUAL_DESIGN_QA.md : comparer, localiser et documenter chaque écart avec preuve.
[5] Ne corriger que si l'utilisateur l'a explicitement demandé ; après correction, refaire les captures des zones touchées.
[6] Les constats d'accessibilité, de comportement ou de performance sont transmis à ui:standards / code:review, sans les ré-auditer ici.
```

---

## §AGENTS — Index Complet de Tous les Agents

### SECURITY/
| Agent | Commande | Rôle |
|---|---|---|
| `SECURITY/Antigravity_Analysts.md` | `audit:analysts` | Audit projet 4 phases (Reconnaissance→Inspection→Diagnostic→Restitution) — toujours en premier |
| `SECURITY/AUDIT-SECURITE.md` | `audit:securite` / `audit:front` / `audit:back` | Audit sécurité applicatif — sous-prompts Global/Frontend/Backend — score /100 |
| `SECURITY/AUDIT-COHERENCE.md` | `audit:coherence` | Cohérence textuelle — toujours en dernier dans la séquence |
| `SECURITY/AGENT-CONTRAT-LOGIQUE.md` | `logique:audit` / `logique:contrat [nom]` / `logique:verifier [nom]` | Intégrité intention↔implémentation — invocation manuelle uniquement |
| `SECURITY/Agents-audit-panel-admin.md` | `audit:admin` | Audit panel admin — fonctionnel + contrôle d'accès + UX |
| `SECURITY/AGENT-LICENCES.md` | `licence:audit` | Licences de code + CGU/CGV/EULA — cadre OHADA, APDP Bénin, OAPI |

### CODE/
| Agent | Commande | Rôle |
|---|---|---|
| `CODE/AGENT-CORE.md` | `code:core` | Bibliothèque de prompts web — protocole 5 étapes — charger en premier pour tout composant |
| `CODE/Agents_Conception_Backend.md` | `backend:conception` | Architecture backend en 10 blocs obligatoires |
| `CODE/Agents_Revue_Code.md` | `code:review` | Revue de code senior — À MODIFIER ABSOLUMENT / SOUHAITÉ / FACULTATIF |
| `CODE/Agents_Debug_Correction.md` | `code:debug` | Debug — cause racine obligatoire, fix minimal |
| `CODE/Agents_Commentaire_Code.md` | `code:comment` | Documentation du code — commente le pourquoi, jamais le quoi |
| `CODE/AGENT-AUTH.md` | `prompt:auth` | Module authentification, sessions, permissions, OAuth |
| `CODE/AGENT-NAV.md` | `prompt:nav` | Module menus, barres de navigation, headers, breadcrumbs, sidebars |
| `CODE/AGENT-PAGES.md` | `prompt:pages` | Module pages courantes, profils, tableaux de bord |
| `CODE/AGENT-UI.md` | `prompt:ui` | Module composants UI immersifs (hero, modals, cards, tabs) |
| `CODE/AGENT-FORMS.md` | `prompt:forms` | Module formulaires complexes, validation d'entrées, multi-étapes |
| `CODE/AGENT-FOOTERS.md` | `prompt:footer` | Module pieds de page complets |
| `CODE/AGENT-LP.md` | `prompt:lp` | Module landing pages à fort taux de conversion |
| `CODE/AGENT-ECOM.md` | `prompt:ecom` | Module e-commerce, catalogue, paniers, checkout |
| `CODE/AGENT-EMAIL.md` | `prompt:email` | Module templates d'emails transactionnels |
| `CODE/AGENT-PERF.md` | `prompt:perf` | Module optimisation performance, skeletons, gestion d'erreurs |
| `CODE/AGENT-DENSE.md` | `prompt:dense` | Module synthèse ultra-dense pour projets de grande envergure |

### UI_UX/
| Agent | Commande | Rôle |
|---|---|---|
| `UI_UX/Agents_Direction_Artistique.md` | `da:setup` | DA senior — Mode A (neuf) / Mode B (existant) — 31 techniques signature |
| `UI_UX/Agents_Bibliotheque_Palettes.md` | `palette:browse` | 7 familles de palettes — anti-répétition inter-projets |
| `UI_UX/Agents_Bibliotheque_Typographies.md` | `typo:browse` | Pairings typographiques — Source obligatoire pour toute nouvelle entrée |
| `UI_UX/Agents_Design_Reference.md` | `design:reference` | Analyse UI/UX/Motion d'une référence externe — 18 sections |
| `UI_UX/Agents_General_Immersif.md` | `site:app-from-scratch` | Conception SaaS / e-commerce / portfolio / blog / outil (from scratch) |
| `UI_UX/Agents_Conception_Site_Immersif.md` | `site:vitrine-from-scratch` | Conception vitrine / landing / marketing (from scratch) |
| `UI_UX/Agents_Refonte_Complete.md` | `site:refonte` | Chef d'orchestre refonte visuelle complète |
| `UI_UX/Agents_Traitement_Visuel.md` | `visual:treatment` | Détourage, compositing, fonds génératifs, prompts image |
| `UI_UX/Agents_Standards_Interface_Web.md` | `ui:standards` | Checklist comportement / accessibilité / performance / contenu — Mode CRÉATION ou AUDIT |
| `UI_UX/AGENTS_ANIMATION_3D.md` | `3d:animation` | Scènes 3D — Three.js/WebGL, R3F, GLSL, GLTF ; WebGPU/TSL évalué au cas par cas |
| `UI_UX/AGENT_MOTION_ENGINEERING.md` | `motion:engineering` | Implémentation des systèmes de mouvement 2D/DOM/SVG/Canvas 2D à partir d'une chorégraphie — exclut WebGL/3D |
| `UI_UX/AGENT_VISUAL_DESIGN_QA.md` | `visual:qa` | Contrôle visuel indépendant par captures, comparaison aux références et rapport d'écarts — n'est pas un audit fonctionnel |
| `UI_UX/Agents_Generation_Video_IA.md` | `video:prompt` | Prompts vidéo (Veo 3) — asset statique uniquement, jamais appel API runtime |
| `UI_UX/Directives_Recreation_Templates.md` | `template:recreate` | 3 gabarits de recréation : "en construction", hero produit, hero portfolio |

### FINANCIAL_SYSTEME/
| Agent | Commande | Rôle |
|---|---|---|
| `FINANCIAL_SYSTEME/Agents_Integration_Fedapay.md` | `fedapay:integrate` / `skill:fedapay` | Intégration FedaPay — source unique paiement Afrique de l'Ouest — tarifs §18, géo §19 |
| `FINANCIAL_SYSTEME/AGENTS_INTEGRATION_BICTORYS.md` | `bictorys:integrate` | Intégration Bictorys — API de paiement |
| `FINANCIAL_SYSTEME/AGENTS_INTEGRATION_SASPAY.md` | `saspay:integrate` | Intégration SasPay — API de paiement |
| `FINANCIAL_SYSTEME/AGENT-STRATEGIE-PRICING.md` | `pricing:strategy` / `skill:pricing` | Challenger SaaS/PM/UX — stratégie tarifaire — lit les frais réels dans Fedapay §18 |
| `FINANCIAL_SYSTEME/TEST-BILLING-FEDAPAY.md` | `billing:test` | Plan de validation des flux de facturation et tests FedaPay |

### PANEL_ADMIN/
| Agent | Commande | Rôle |
|---|---|---|
| `PANEL_ADMIN/Agents-audit-panel-admin.md` | `audit:admin` | Audit panel admin — fonctionnel + contrôle d'accès + UX |
| `PANEL_ADMIN/Agents-conception-panel-admin-client.md` | `admin:conception` | Panel admin from scratch pour client non-développeur |

### ANALYTICS_AND_FEEDBACK_USER/
| Agent | Commande | Rôle |
|---|---|---|
| `ANALYTICS_AND_FEEDBACK_USER/AGENT-ANALYTICS-GA4.md` | `analytics:ga4` | Audit + intégration GA4, Consent Mode v2 |
| `ANALYTICS_AND_FEEDBACK_USER/AGENT-CLARITY.md` | `analytics:clarity` | Audit + intégration Microsoft Clarity (session replay / heatmap) |
| `ANALYTICS_AND_FEEDBACK_USER/AGENT-EMAIL-RESEND.md` | `email:resend` | Audit + intégration Resend (transactionnel + marketing) |
| `ANALYTICS_AND_FEEDBACK_USER/AGENT-FEEDBACK.md` | `feedback:setup` | Système de feedback utilisateur + panel admin dédié |
| `ANALYTICS_AND_FEEDBACK_USER/Agentic-browsing.md` | `agentic:llms` | Fichiers llms.txt + WebMCP |
| `ANALYTICS_AND_FEEDBACK_USER/REFERENCEMENT.md` | `seo:audit` | Checklist SEO / GEO / données structurées |

### HELPER_AND_DOCS/
| Agent | Commande | Rôle |
|---|---|---|
| `HELPER_AND_DOCS/Documentation_Architect.md` | `doc:architect` | Architecte documentaliste — 16 documents obligatoires — tourne en continu |
| `HELPER_AND_DOCS/AGENT-NOMMAGE.md` | `brand:naming` | Nommage de marque (vérification web) + deux prompts logo |
| `HELPER_AND_DOCS/Agents_Deployment_Instructions.md` | `deploy:instructions` | Génère documentation de déploiement — propriétaire du contenu déploiement |
| `HELPER_AND_DOCS/Agents-conception-panel-admin-client.md` | `admin:conception` | Panel admin from scratch pour client non-développeur (référence croisée) |
| `HELPER_AND_DOCS/Template_Feedback.md` | — | Gabarit de recueil de retours utilisateurs |
| `HELPER_AND_DOCS/Template_Legal.md` | — | Gabarit mentions légales et politiques de confidentialité |
| `HELPER_AND_DOCS/Templates_Back Office.md` | — | Gabarit structurel d'administration |
| `HELPER_AND_DOCS/AGENT-PROMPTS.md` | — | **ARCHIVÉ** — doublon de AGENT-CORE + modules |

### MONITORING/
| Agent | Commande | Rôle |
|---|---|---|
| `MONITORING/Agents_Revue_Code.md` | `code:review` | Revue de code (alias, aussi dans `CODE/Agents_Revue_Code.md`) |
| `MONITORING/Agents_Debug_Correction.md` | `code:debug` | Debug (alias, aussi dans `CODE/Agents_Debug_Correction.md`) |
| `MONITORING/Agents_Commentaire_Code.md` | `code:comment` | Commentaire code (alias, aussi dans `CODE/Agents_Commentaire_Code.md`) |

### workflows/
| Workflow | Commande | Rôle |
|---|---|---|
| `workflows/w-bug-investigation.md` | `bug:investigate` | Investigation de bug en 6 phases |
| `workflows/w-full-project-audit.md` | `audit:full` | Audit projet complet |
| `workflows/w-production-readiness.md` | `release:check` | Aptitude à la mise en production |
| `workflows/w-security-audit.md` | `audit:securite` | Audit sécurité détaillé |
| `workflows/full-project-audit.md` | `audit:full` | Audit exhaustif complet |
| `workflows/security-audit.md` | `audit:securite` | Audit sécurité synthétique |
| `workflows/w-database-change-review.md` | `bdd:review` | Revue d'impact, compatibilité et sécurité des changements de schéma / BDD |
| `workflows/w-feature-implementation.md` | `feature:build` | Implémentation structurée d'une nouvelle fonctionnalité sans régression |
| `workflows/w-pre-deployment-check.md` | `deploy:check` | Gate rapide avant déploiement (Git, build, secrets, SEO, perfs) |
| `workflows/w-refactor-safely.md` | `code:refactor` | Refactoring maîtrisé sans altération de comportement |

### skills/
| Catégorie | Nb | Rôle | Activation |
|---|---|---|---|
| **Paiement & Monétisation** | 2 | `fedapay-integration`, `saas-pricing-strategy` | `skill:fedapay`, `skill:pricing` ou mots-clés |
| **Design & Typographie** | 6 | `design`, `design-system`, `banner-design`, `palette-and-typography-picker`, `ui-styling`, `ui-ux-pro-max` | `design:system`, `skill:palette`, `design:styling`, `ui:pro-max` ou mots-clés |
| **Vidéo/Marketing** | 3 | `brag` (vidéo lancement), `brand` (identité marque), `slides` (présentations) | `/brag`, `/brand`, `/slides` |
| **Sécurité applicative web/mobile** | 93 | Développement sécurisé, tests OWASP web/API/mobile, authentification, DevSecOps | Nommer la tâche ou `skill:[nom]` |

> Index complet et instructions : `.agents/skills/README.md`

---

## §COMMANDES — Commandes Directes Disponibles

### Protocoles & Système
| Commande | Action | Fichier |
|---|---|---|
| `autoagent:go` | Mode itération autonome | `PROTOCOLES/P-AUTOAGENT.md` |
| `autoagent:stop` | Arrêt du mode autonome | — |
| `init:project [dossier]` | Initialiser le protocole complet dans un nouveau projet | `.agents/tools/init_project.js` |
| `doc:init` | Initialiser le système documentaire vivant (16 documents docs/) | `.agents/tools/init_docs.js` |
| `rapport:voir` | Afficher le dernier rapport | `RAPPORT_AGENTS.md` |

### Sécurité & Audits
| Commande | Action | Fichier |
|---|---|---|
| `audit:analysts` | Audit initial projet 4 phases (Reconnaissance→Inspection→Diagnostic→Restitution) | `SECURITY/Antigravity_Analysts.md` |
| `audit:securite` | Audit sécurité applicatif global | `SECURITY/AUDIT-SECURITE.md` |
| `audit:front` | Audit sécurité frontend | `SECURITY/AUDIT-SECURITE.md §FRONTEND` |
| `audit:back` | Audit sécurité backend + API | `SECURITY/AUDIT-SECURITE.md §BACKEND` |
| `audit:admin` | Audit panel admin (fonctionnel + RBAC + UX) | `PANEL_ADMIN/Agents-audit-panel-admin.md` |
| `audit:coherence` | Cohérence textuelle et ergonomique | `SECURITY/AUDIT-COHERENCE.md` |
| `audit:full` | Audit exhaustif complet du projet | `workflows/w-full-project-audit.md` |
| `logique:audit` | Intégrité intention↔code complète | `SECURITY/AGENT-CONTRAT-LOGIQUE.md` |
| `logique:contrat [nom]` | Contrat d'intention préventif | `SECURITY/AGENT-CONTRAT-LOGIQUE.md §CONTRAT` |
| `logique:verifier [nom]` | Vérification code vs contrat | `SECURITY/AGENT-CONTRAT-LOGIQUE.md §VERIF` |
| `licence:audit` | Audit licences, CGU, CGV, EULA, cadre OHADA/APDP | `SECURITY/AGENT-LICENCES.md` |
| `skill:[nom]` | Activer un skill de sécurité OWASP/DevSecOps nommé | `.agents/skills/README.md` |

### Workflows & Cycle de Vie
| Commande | Action | Fichier |
|---|---|---|
| `bug:investigate` | Investigation méthodique de bug en 6 phases | `workflows/w-bug-investigation.md` |
| `bdd:review` | Revue de schéma BDD, migrations, sécurité et compatibilité | `workflows/w-database-change-review.md` |
| `feature:build` | Implémentation structurée d'une nouvelle fonctionnalité | `workflows/w-feature-implementation.md` |
| `code:refactor` | Refactoring sécurisé sans régression ni altération de comportement | `workflows/w-refactor-safely.md` |
| `deploy:check` | Gate rapide avant déploiement immédiat | `workflows/w-pre-deployment-check.md` |
| `release:check` | Aptitude complète à la mise en production | `workflows/w-production-readiness.md` |

### Code, Backend & Qualité
| Commande | Action | Fichier |
|---|---|---|
| `code:core` | Bibliothèque centrale de prompts web (protocole 5 étapes) | `CODE/AGENT-CORE.md` |
| `backend:conception` | Architecture backend en 10 blocs obligatoires | `CODE/Agents_Conception_Backend.md` |
| `code:review` | Revue de code senior (Bloquant / Souhaité / Facultatif) | `CODE/Agents_Revue_Code.md` |
| `code:debug` | Debug ciblé cause racine avec fix minimal traçable | `CODE/Agents_Debug_Correction.md` |
| `code:comment` | Documentation du code (pourquoi et invariants) | `CODE/Agents_Commentaire_Code.md` |

### Prompts de Composants Web (Modules CODE/)
| Commande | Action | Fichier |
|---|---|---|
| `prompt:auth` | Prompts authentification, sessions, permissions, OAuth | `CODE/AGENT-AUTH.md` |
| `prompt:nav` | Prompts menus, barres de navigation, headers, breadcrumbs, sidebars | `CODE/AGENT-NAV.md` |
| `prompt:pages` | Prompts pages courantes, profils, tableaux de bord, erreurs 404/500 | `CODE/AGENT-PAGES.md` |
| `prompt:ui` | Prompts composants UI immersifs (hero, modals, cards, tabs) | `CODE/AGENT-UI.md` |
| `prompt:forms` | Prompts formulaires complexes, validation d'entrées, multi-étapes | `CODE/AGENT-FORMS.md` |
| `prompt:footer` | Prompts pieds de page complets et légaux | `CODE/AGENT-FOOTERS.md` |
| `prompt:lp` | Prompts landing pages à fort taux de conversion | `CODE/AGENT-LP.md` |
| `prompt:ecom` | Prompts e-commerce, catalogue, paniers, checkout | `CODE/AGENT-ECOM.md` |
| `prompt:email` | Prompts templates d'emails transactionnels | `CODE/AGENT-EMAIL.md` |
| `prompt:perf` | Prompts optimisation performance, skeletons, gestion d'erreurs | `CODE/AGENT-PERF.md` |
| `prompt:dense` | Prompts synthèse ultra-dense pour projets d'envergure | `CODE/AGENT-DENSE.md` |

### UI / UX / Design & Motion
| Commande | Action | Fichier |
|---|---|---|
| `da:setup` | Direction artistique senior (Mode A neuf / Mode B existant) | `UI_UX/Agents_Direction_Artistique.md` |
| `palette:browse` | Bibliothèque de 7 familles de palettes chromatiques | `UI_UX/Agents_Bibliotheque_Palettes.md` |
| `typo:browse` | Bibliothèque de pairings typographiques Google Fonts | `UI_UX/Agents_Bibliotheque_Typographies.md` |
| `design:reference` | Analyse UI/UX/Motion d'une référence externe en 18 sections | `UI_UX/Agents_Design_Reference.md` |
| `site:vitrine-from-scratch` | Conception site vitrine / landing page / marketing from scratch | `UI_UX/Agents_Conception_Site_Immersif.md` |
| `site:app-from-scratch` | Conception SaaS / e-commerce / portfolio / outil from scratch | `UI_UX/Agents_General_Immersif.md` |
| `site:refonte` | Chef d'orchestre d'une refonte visuelle complète | `UI_UX/Agents_Refonte_Complete.md` |
| `visual:treatment` | Détourage, compositing, fonds génératifs, prompts image | `UI_UX/Agents_Traitement_Visuel.md` |
| `ui:standards` | Standards d'interface web, accessibilité WCAG, micro-interactions | `UI_UX/Agents_Standards_Interface_Web.md` |
| `3d:animation` | Scènes et animations 3D : Three.js, WebGL, R3F, GLSL, GLTF ; WebGPU/TSL si validé | `UI_UX/AGENTS_ANIMATION_3D.md` |
| `motion:engineering` | Implémentation motion 2D/DOM/SVG/Canvas 2D depuis une spécification de mouvement | `UI_UX/AGENT_MOTION_ENGINEERING.md` |
| `visual:qa` | Audit de fidélité visuelle par captures et comparaison aux références | `UI_UX/AGENT_VISUAL_DESIGN_QA.md` |
| `video:prompt` | Prompts vidéo IA (Veo 3, Omni Flash) asset statique | `UI_UX/Agents_Generation_Video_IA.md` |
| `template:recreate` | Directives et gabarits de recréation de templates | `UI_UX/Directives_Recreation_Templates.md` |
| `tokens:generate` | Générer des design tokens CSS / configuration Tailwind | `.agents/tools/generate_css_tokens.js` |
| `design:system` | Activer le skill design-system (tokens, specs, composants) | `skills/design-system/SKILL.md` |
| `design:styling` | Activer le skill UI styling shadcn/ui + Tailwind CSS | `skills/ui-styling/SKILL.md` |
| `ui:pro-max` | Activer le skill UI/UX pro max (79 styles, 192 palettes, 22 stacks) | `skills/ui-ux-pro-max/SKILL.md` |
| `skill:palette` | Activer le skill sélecteur de palette & typographie atelier | `skills/palette-and-typography-picker/SKILL.md` |

### Paiement & Systèmes Financiers
| Commande | Action | Fichier |
|---|---|---|
| `fedapay:integrate` / `skill:fedapay` | Intégration FedaPay (Mobile Money MTN/Moov/Orange & cartes, XOF) | `FINANCIAL_SYSTEME/Agents_Integration_Fedapay.md` |
| `fedapay:test` | Simuler une notification webhook FedaPay signée HMAC | `.agents/tools/fedapay_test_webhook.js` |
| `bictorys:integrate` | Intégration passerelle de paiement Bictorys (Afrique) | `FINANCIAL_SYSTEME/AGENTS_INTEGRATION_BICTORYS.md` |
| `saspay:integrate` | Intégration passerelle de paiement SasPay | `FINANCIAL_SYSTEME/AGENTS_INTEGRATION_SASPAY.md` |
| `pricing:strategy` / `skill:pricing` | Stratégie pricing SaaS, modèle 5 Gates et grille d'arbitrage | `FINANCIAL_SYSTEME/AGENT-STRATEGIE-PRICING.md` |
| `billing:test` | Plan de test des flux de facturation et webhooks FedaPay | `FINANCIAL_SYSTEME/TEST-BILLING-FEDAPAY.md` |

### Analytics, Feedback & SEO
| Commande | Action | Fichier |
|---|---|---|
| `analytics:ga4` | Audit et intégration Google Analytics 4 avec Consent Mode v2 | `ANALYTICS_AND_FEEDBACK_USER/AGENT-ANALYTICS-GA4.md` |
| `analytics:clarity` | Audit et intégration Microsoft Clarity (session replay & heatmaps) | `ANALYTICS_AND_FEEDBACK_USER/AGENT-CLARITY.md` |
| `email:resend` | Intégration emails transactionnels et marketing avec Resend | `ANALYTICS_AND_FEEDBACK_USER/AGENT-EMAIL-RESEND.md` |
| `feedback:setup` | Module de recueil de retours utilisateurs et panel dédié | `ANALYTICS_AND_FEEDBACK_USER/AGENT-FEEDBACK.md` |
| `agentic:llms` | Optimisation pour navigation par agents IA (llms.txt, WebMCP) | `ANALYTICS_AND_FEEDBACK_USER/Agentic-browsing.md` |
| `seo:audit` | Audit et checklist de référencement SEO / GEO / OpenGraph | `ANALYTICS_AND_FEEDBACK_USER/REFERENCEMENT.md` |

### Documentation & Administration
| Commande | Action | Fichier |
|---|---|---|
| `doc:architect` | Documentation complète d'architecture en 16 documents | `HELPER_AND_DOCS/Documentation_Architect.md` |
| `brand:naming` | Recherche de nom de marque, dispo domaine et prompts logo | `HELPER_AND_DOCS/AGENT-NOMMAGE.md` |
| `deploy:instructions` | Génération automatique des instructions de déploiement | `HELPER_AND_DOCS/Agents_Deployment_Instructions.md` |
| `admin:conception` | Conception de panel d'administration pour client non-développeur | `PANEL_ADMIN/Agents-conception-panel-admin-client.md` |

### Marketing & Présentations
| Commande | Action | Fichier |
|---|---|---|
| `/brag` | Générer une vidéo de lancement du projet avec Hyperframes | `skills/brag/SKILL.md` |
| `/brag --voice` | Vidéo de lancement avec voix de synthèse / narration | `skills/brag/SKILL.md` |
| `/brand` | Voix de marque, messaging et conformité identité | `skills/brand/SKILL.md` |
| `/slides` | Présentations HTML interactives et stratégiques (Chart.js) | `skills/slides/SKILL.md` |

---

## §ARBITRAGE — Règles de Précédence

```
Sécurité applicative (AUDIT-SECURITE)       ← Priorité absolue
        ↓
Architecture & Intégrité (CONTRAT-LOGIQUE)  ← Priorité structurelle
        ↓
Fonctionnel & Qualité (Antigravity_Analysts) ← Priorité fonctionnelle
        ↓
Design System & DA (Direction_Artistique)    ← Priorité visuelle
        ↓
Cohérence textuelle (AUDIT-COHERENCE)        ← Priorité finition
```

**Règles concrètes :**
- AUDIT-SECURITE gagne toujours sur AUDIT-COHERENCE — ne jamais harmoniser un message d'erreur qui réintroduirait une fuite d'info
- Antigravity_Analysts gagne sur AUDIT-COHERENCE pour tout ce qui touche architecture/config
- Si Antigravity et AUDIT-SECURITE se contredisent : AUDIT-SECURITE prévaut (grille de gravité fixe + preuve fichier:ligne)
- Jamais 3 agents d'audit en parallèle sur le même périmètre dans la même session
- Un finding dans 2 rapports → traité une fois, au niveau de l'agent le plus profond

**Conflit entre agents de conception :**
- Brief client explicite > défauts des agents
- Hiérarchie code : Sécurité > Accessibilité > Performance > Design system > Convention prompt
- `Agents_Conception_Site_Immersif` ≠ `Agents_General_Immersif` — mutuellement exclusifs sur un même projet
- `Agents_Refonte_Complete` ≠ `Agents_General_Immersif` — ne pas confondre refonte et création
- Sous `Agents_Refonte_Complete` : Mode B de Direction_Artistique est suspendu (test de non-reconnaissance prévaut)
- `AGENT_MOTION_ENGINEERING` implémente une chorégraphie déjà décidée ; il ne redéfinit ni la direction artistique, ni la structure, ni les timings sans demande explicite. Il ne traite pas Three.js, R3F, WebGL, GLSL, Spline ou les scènes 3D : router vers `3d:animation`.
- `AGENTS_ANIMATION_3D` possède toute la scène 3D temps réel (rendu, géométrie, matériaux, shaders, caméra, boucle, ressources et intégration R3F/WebGPU). `motion:engineering` ne modifie pas ces éléments.
- `AGENT_VISUAL_DESIGN_QA` contrôle la fidélité visuelle et les écarts de rendu ; `ui:standards` reste propriétaire des audits comportementaux, clavier, accessibilité, formulaires et performances générales. Les deux rapports peuvent se compléter, pas se substituer.
- Priorité en cas de conflit : sécurité > architecture > intégrité fonctionnelle et accessibilité > performance > fidélité visuelle > préférence esthétique. Un QA visuel ne justifie jamais de masquer un contenu, un focus ou une commande accessible.
- `visual:qa` ne corrige pas automatiquement : rapport d'abord, correction uniquement sur demande explicite. Ne pas lancer simultanément plusieurs agents pour comparer les mêmes captures et les mêmes critères.

---

## §CONSENTEMENT — Coordination Analytics / Email / Paiement

**Règle consentement :** Un seul gestionnaire de consentement par projet.
- Le premier agent traité (GA4 / Clarity / Resend marketing) devient propriétaire du gestionnaire
- Avant d'écrire dans layout racine : vérifier l'état — ne jamais écraser l'autre agent
- La bannière cookie relève de `ui-cookie` (AGENT-CORE) — jamais de GA4 ou Clarity directement
- Dashboard analytics interne → exclure du tracking Clarity (données business visibles)
- Emails transactionnels : pas de consentement requis
- Emails marketing : opt-in + désabonnement dans chaque envoi
- Retrait de consentement → couper GA4 ET Clarity simultanément (test QA des deux)

**Règle paiement :**
- FedaPay = source unique pour l'Afrique de l'Ouest (`FINANCIAL_SYSTEME/Agents_Integration_Fedapay.md`)
- Frais réels : Fedapay §18 — AGENT-STRATEGIE-PRICING lit ces frais, ne les réinvente pas
- Webhooks paiement : signature vérifiée par AUDIT-SECURITE
- Ne jamais faire confiance au retour client du SDK paiement
- Occident → Stripe — si ambiguïté géographique → demander avant d'intégrer

---

## §AUTOAGENT — Mode Itération Autonome

Voir `PROTOCOLES/P-AUTOAGENT.md` pour le protocole complet.

Résumé des décisions capitales (arrêt obligatoire même en mode autonome) :
1. Modèle IA (tout changement)
2. Suppression de données
3. Nouvelle dépendance critique
4. Déploiement en production
5. Erreur CRITICAL
6. Ambiguïté structurelle entre deux architectures

---

## §INCOH — Notes de Maintenance et Précautions

| # | Constat | Périmètre | Traitement |
|---|---|---|---|
| 1 | Résidus de collage dans `UI_UX/Agents_Direction_Artistique.md` et `UI_UX/Agents_Traitement_Visuel.md` | DA + Traitement Visuel | Nettoyé |
| 2 | Palette "Balcon & Tulipe" : `#84BF04` contraste sur fond clair | Bibliotheque Palettes | Utiliser variante contrastée pour accessibilité WCAG AA |
| 3 | Intégration FedaPay : SDK React dédoublé | Integration Fedapay | Prioriser implémentation unifiée sans duplication |
| 4 | Gate de livraison et renvois de sécurité backend | Conception Backend | Contrôlé par AUDIT-SECURITE et AGENT-CONTRAT-LOGIQUE |
| 5 | Placeholder structure légale `[STRUCTURE]` | Licences + Pricing | Documenté intentionnellement comme placeholder paramétrable |
| 6 | Spécialisation Motion Engineering / Visual QA | UI_UX | Ajout de deux agents à périmètre distinct ; routage intégré, sans remplacement des agents de création ou des Standards |
| 7 | Maintenance de l'agent 3D | UI_UX/AGENTS_ANIMATION_3D.md | Stack, WebGPU/TSL, cycle de rendu, textures, performance adaptative, gestion mémoire et contexte WebGL clarifiés ; seuils matériels non universels retirés |
