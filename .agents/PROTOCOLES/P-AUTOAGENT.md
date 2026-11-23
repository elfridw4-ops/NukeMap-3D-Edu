# P-AUTOAGENT.md — Mode Itération Autonome
> Activé par la commande : `autoagent:go`
> L'agent enchaîne les tâches sans attendre de confirmation sauf pour les décisions capitales.

---

## ACTIVATION

```
autoagent:go [description optionnelle de l'objectif]
```

Exemples valides :
- `autoagent:go` — l'agent analyse le contexte et enchaîne
- `autoagent:go audit complet avant prod` — séquence d'audit complète
- `autoagent:go implémenter le panel admin` — séquence conception → build → audit

---

## RÈGLES DU MODE AUTONOME

### Ce que l'agent fait SANS demander :
- Lire tous les fichiers nécessaires
- Enchaîner les agents selon `NOYAU.md §CHAINES`
- Appliquer les corrections MEDIUM et LOW
- Mettre à jour la documentation (`README.md` si code modifié)
- Écrire dans `RAPPORT_AGENTS.md` après chaque étape
- Passer d'un agent au suivant selon la chaîne

### Ce que l'agent demande OBLIGATOIREMENT avant d'agir :
1. **Modèle IA** : toute modification → P-BLOQUANTS.md §MODEL → ARRÊT
2. **Suppression de données** : toute suppression → P-BLOQUANTS.md §DONNEES → ARRÊT
3. **Nouvelle dépendance critique** → P-BLOQUANTS.md §DEPS → ARRÊT
4. **Déploiement en production** → présenter le checklist release → ARRÊT
5. **Erreur CRITICAL détectée** → P-FIX-IT.md §CRITICAL → ARRÊT
6. **Erreur HIGH** → P-FIX-IT.md §HIGH → plan → ARRÊT
7. **Ambiguïté structurelle** : si deux options d'architecture sont également valides → présenter les 2 avec risques → ARRÊT

---

## SÉQUENCE D'EXÉCUTION AUTONOME

```
autoagent:go reçu
      ↓
[A] Analyse du contexte
    → Lire package.json / structure du projet
    → Identifier la tâche principale
    → Consulter NOYAU.md §CHAINES pour la séquence appropriée
      ↓
[B] Pour chaque agent dans la chaîne :
    → Vérifier si une décision capitale est requise (liste ci-dessus)
      → OUI : ARRÊT + message clair + attente
      → NON : exécuter
    → Écrire résultat intermédiaire dans RAPPORT_AGENTS.md
    → Passer à l'agent suivant
      ↓
[C] Fin de chaîne
    → Rapport final complet dans RAPPORT_AGENTS.md
    → Message de synthèse dans le chat
```

---

## FORMAT D'ANNONCE AU DÉMARRAGE

```
AUTOAGENT:GO — Démarrage [YYYY-MM-DDTHH:MM:SS+01:00]

Objectif détecté : [description]
Séquence prévue :
  1. [Agent A] — [rôle]
  2. [Agent B] — [rôle]
  3. [Agent C] — [rôle]

Décisions capitales identifiées (si applicable) :
  → [liste ou "aucune"]

Démarrage sans attente sur les étapes non-capitales.
```

---

## ARRÊT DU MODE AUTONOME

L'agent sort du mode autonome et attend l'utilisateur quand :
- Une décision capitale est atteinte (voir liste ci-dessus)
- La commande `autoagent:stop` est reçue
- Une erreur CRITICAL est détectée
- La chaîne est complète

---

## RÈGLE PAIEMENT PAR DÉFAUT (en mode autonome)

Si le contexte contient du paiement et que le provider n'est pas spécifié :

```
Signaux Afrique de l'Ouest (bénin, togo, sénégal, côte d'ivoire, xof, fcfa)
→ FedaPay → .agents/FINANCIAL_SYSTÈME/Agents_Integration_Fedapay.md

Signaux Occident (eur, usd, gbp, stripe, europe, usa)
→ Stripe

Ambiguïté → ARRÊT + demande avant intégration
```
