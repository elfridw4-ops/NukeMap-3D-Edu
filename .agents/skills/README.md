# Skills actifs — Index des 244 skills

> Répertoire : `.agents/skills/`
> Skills actifs : **244** — 104 (sécurité applicative web/mobile, produit) + 140 restaurés depuis l'archive (forensics/IR, IA/LLM, Zero Trust/IAM, vulns web avancées).
> Activation : décrire le besoin dans le chat ou invoquer `skill:[nom-exact-du-skill]`.

## Périmètre

Cet index énumère tous les dossiers de skills actifs présents directement dans `.agents/skills/`. Le sous-dossier `.agents/skills/_archive/` contient les skills conservés localement mais archivés; il est ignoré par Git et ne fait pas partie de l'index actif.

Les 93 skills de cybersécurité retenus concernent le développement sécurisé, l'audit et les tests autorisés de sites, d'applications web, d'API et d'applications mobiles, ainsi que la sécurité du code et des pipelines de livraison. Chaque lien ouvre le `SKILL.md` qui contient les instructions complètes.

## Comment utiliser un skill

### Décrire le besoin

```text
"Je veux tester les contrôles d'accès de mon API REST"
→ testing-api-for-broken-object-level-authorization

"Aide-moi à auditer la sécurité de mon application Android"
→ conducting-mobile-app-penetration-test
```

### Activer un skill par son nom

```text
skill:testing-jwt-token-security
skill:performing-web-application-penetration-test
skill:conducting-mobile-app-penetration-test
design:system
skill:fedapay
```

## Sécurité applicative web, API et mobile (93 skills)

### Analyse, conception sécurisée et livraison

| Skill | Instructions |
|---|---|
| `building-devsecops-pipeline-with-gitlab-ci` | [SKILL.md](./building-devsecops-pipeline-with-gitlab-ci/SKILL.md) |
| `configuring-oauth2-authorization-flow` | [SKILL.md](./configuring-oauth2-authorization-flow/SKILL.md) |
| `configuring-tls-1-3-for-secure-communications` | [SKILL.md](./configuring-tls-1-3-for-secure-communications/SKILL.md) |
| `detecting-dependency-confusion` | [SKILL.md](./detecting-dependency-confusion/SKILL.md) |
| `implementing-aes-encryption-for-data-at-rest` | [SKILL.md](./implementing-aes-encryption-for-data-at-rest/SKILL.md) |
| `implementing-devsecops-security-scanning` | [SKILL.md](./implementing-devsecops-security-scanning/SKILL.md) |
| `implementing-github-advanced-security-for-code-scanning` | [SKILL.md](./implementing-github-advanced-security-for-code-scanning/SKILL.md) |
| `implementing-hardware-security-key-authentication` | [SKILL.md](./implementing-hardware-security-key-authentication/SKILL.md) |
| `implementing-jwt-signing-and-verification` | [SKILL.md](./implementing-jwt-signing-and-verification/SKILL.md) |
| `implementing-mtls-for-zero-trust-services` | [SKILL.md](./implementing-mtls-for-zero-trust-services/SKILL.md) |
| `implementing-passwordless-authentication-with-fido2` | [SKILL.md](./implementing-passwordless-authentication-with-fido2/SKILL.md) |
| `implementing-runtime-application-self-protection` | [SKILL.md](./implementing-runtime-application-self-protection/SKILL.md) |
| `implementing-secret-scanning-with-gitleaks` | [SKILL.md](./implementing-secret-scanning-with-gitleaks/SKILL.md) |
| `implementing-secrets-scanning-in-ci-cd` | [SKILL.md](./implementing-secrets-scanning-in-ci-cd/SKILL.md) |
| `implementing-semgrep-for-custom-sast-rules` | [SKILL.md](./implementing-semgrep-for-custom-sast-rules/SKILL.md) |
| `implementing-web-application-logging-with-modsecurity` | [SKILL.md](./implementing-web-application-logging-with-modsecurity/SKILL.md) |
| `integrating-dast-with-owasp-zap-in-pipeline` | [SKILL.md](./integrating-dast-with-owasp-zap-in-pipeline/SKILL.md) |
| `integrating-sast-into-github-actions-pipeline` | [SKILL.md](./integrating-sast-into-github-actions-pipeline/SKILL.md) |
| `performing-cryptographic-audit-of-application` | [SKILL.md](./performing-cryptographic-audit-of-application/SKILL.md) |
| `performing-jwt-none-algorithm-attack` | [SKILL.md](./performing-jwt-none-algorithm-attack/SKILL.md) |
| `performing-oauth-scope-minimization-review` | [SKILL.md](./performing-oauth-scope-minimization-review/SKILL.md) |
| `performing-serverless-function-security-review` | [SKILL.md](./performing-serverless-function-security-review/SKILL.md) |
| `performing-ssl-tls-security-assessment` | [SKILL.md](./performing-ssl-tls-security-assessment/SKILL.md) |
| `performing-threat-modeling-with-owasp-threat-dragon` | [SKILL.md](./performing-threat-modeling-with-owasp-threat-dragon/SKILL.md) |
| `securing-github-actions-workflows` | [SKILL.md](./securing-github-actions-workflows/SKILL.md) |
| `securing-serverless-functions` | [SKILL.md](./securing-serverless-functions/SKILL.md) |
| `testing-for-json-web-token-vulnerabilities` | [SKILL.md](./testing-for-json-web-token-vulnerabilities/SKILL.md) |
| `testing-jwt-token-security` | [SKILL.md](./testing-jwt-token-security/SKILL.md) |
| `testing-oauth2-implementation-flaws` | [SKILL.md](./testing-oauth2-implementation-flaws/SKILL.md) |

### Sécurité des API et services backend

| Skill | Instructions |
|---|---|
| `conducting-api-security-testing` | [SKILL.md](./conducting-api-security-testing/SKILL.md) |
| `exploiting-api-injection-vulnerabilities` | [SKILL.md](./exploiting-api-injection-vulnerabilities/SKILL.md) |
| `exploiting-broken-function-level-authorization` | [SKILL.md](./exploiting-broken-function-level-authorization/SKILL.md) |
| `exploiting-excessive-data-exposure-in-api` | [SKILL.md](./exploiting-excessive-data-exposure-in-api/SKILL.md) |
| `exploiting-idor-vulnerabilities` | [SKILL.md](./exploiting-idor-vulnerabilities/SKILL.md) |
| `exploiting-mass-assignment-in-rest-apis` | [SKILL.md](./exploiting-mass-assignment-in-rest-apis/SKILL.md) |
| `exploiting-nosql-injection-vulnerabilities` | [SKILL.md](./exploiting-nosql-injection-vulnerabilities/SKILL.md) |
| `exploiting-oauth-misconfiguration` | [SKILL.md](./exploiting-oauth-misconfiguration/SKILL.md) |
| `exploiting-websocket-vulnerabilities` | [SKILL.md](./exploiting-websocket-vulnerabilities/SKILL.md) |
| `implementing-api-abuse-detection-with-rate-limiting` | [SKILL.md](./implementing-api-abuse-detection-with-rate-limiting/SKILL.md) |
| `implementing-api-gateway-security-controls` | [SKILL.md](./implementing-api-gateway-security-controls/SKILL.md) |
| `implementing-api-key-security-controls` | [SKILL.md](./implementing-api-key-security-controls/SKILL.md) |
| `implementing-api-rate-limiting-and-throttling` | [SKILL.md](./implementing-api-rate-limiting-and-throttling/SKILL.md) |
| `implementing-api-schema-validation-security` | [SKILL.md](./implementing-api-schema-validation-security/SKILL.md) |
| `performing-api-fuzzing-with-restler` | [SKILL.md](./performing-api-fuzzing-with-restler/SKILL.md) |
| `performing-api-inventory-and-discovery` | [SKILL.md](./performing-api-inventory-and-discovery/SKILL.md) |
| `performing-api-rate-limiting-bypass` | [SKILL.md](./performing-api-rate-limiting-bypass/SKILL.md) |
| `performing-api-security-testing-with-postman` | [SKILL.md](./performing-api-security-testing-with-postman/SKILL.md) |
| `performing-graphql-depth-limit-attack` | [SKILL.md](./performing-graphql-depth-limit-attack/SKILL.md) |
| `performing-graphql-introspection-attack` | [SKILL.md](./performing-graphql-introspection-attack/SKILL.md) |
| `performing-graphql-security-assessment` | [SKILL.md](./performing-graphql-security-assessment/SKILL.md) |
| `performing-soap-web-service-security-testing` | [SKILL.md](./performing-soap-web-service-security-testing/SKILL.md) |
| `securing-api-gateway-with-aws-waf` | [SKILL.md](./securing-api-gateway-with-aws-waf/SKILL.md) |
| `testing-api-authentication-weaknesses` | [SKILL.md](./testing-api-authentication-weaknesses/SKILL.md) |
| `testing-api-for-broken-object-level-authorization` | [SKILL.md](./testing-api-for-broken-object-level-authorization/SKILL.md) |
| `testing-api-for-mass-assignment-vulnerability` | [SKILL.md](./testing-api-for-mass-assignment-vulnerability/SKILL.md) |
| `testing-api-security-with-owasp-top-10` | [SKILL.md](./testing-api-security-with-owasp-top-10/SKILL.md) |
| `testing-websocket-api-security` | [SKILL.md](./testing-websocket-api-security/SKILL.md) |

### Tests de sécurité des applications web

| Skill | Instructions |
|---|---|
| `exploiting-insecure-deserialization` | [SKILL.md](./exploiting-insecure-deserialization/SKILL.md) |
| `exploiting-jwt-algorithm-confusion-attack` | [SKILL.md](./exploiting-jwt-algorithm-confusion-attack/SKILL.md) |
| `exploiting-prototype-pollution-in-javascript` | [SKILL.md](./exploiting-prototype-pollution-in-javascript/SKILL.md) |
| `exploiting-sql-injection-vulnerabilities` | [SKILL.md](./exploiting-sql-injection-vulnerabilities/SKILL.md) |
| `exploiting-sql-injection-with-sqlmap` | [SKILL.md](./exploiting-sql-injection-with-sqlmap/SKILL.md) |
| `exploiting-template-injection-vulnerabilities` | [SKILL.md](./exploiting-template-injection-vulnerabilities/SKILL.md) |
| `performing-blind-ssrf-exploitation` | [SKILL.md](./performing-blind-ssrf-exploitation/SKILL.md) |
| `performing-clickjacking-attack-test` | [SKILL.md](./performing-clickjacking-attack-test/SKILL.md) |
| `performing-csrf-attack-simulation` | [SKILL.md](./performing-csrf-attack-simulation/SKILL.md) |
| `performing-directory-traversal-testing` | [SKILL.md](./performing-directory-traversal-testing/SKILL.md) |
| `performing-second-order-sql-injection` | [SKILL.md](./performing-second-order-sql-injection/SKILL.md) |
| `performing-ssrf-vulnerability-exploitation` | [SKILL.md](./performing-ssrf-vulnerability-exploitation/SKILL.md) |
| `performing-web-application-penetration-test` | [SKILL.md](./performing-web-application-penetration-test/SKILL.md) |
| `performing-web-application-vulnerability-triage` | [SKILL.md](./performing-web-application-vulnerability-triage/SKILL.md) |
| `performing-web-cache-deception-attack` | [SKILL.md](./performing-web-cache-deception-attack/SKILL.md) |
| `performing-web-cache-poisoning-attack` | [SKILL.md](./performing-web-cache-poisoning-attack/SKILL.md) |
| `testing-cors-misconfiguration` | [SKILL.md](./testing-cors-misconfiguration/SKILL.md) |
| `testing-for-broken-access-control` | [SKILL.md](./testing-for-broken-access-control/SKILL.md) |
| `testing-for-email-header-injection` | [SKILL.md](./testing-for-email-header-injection/SKILL.md) |
| `testing-for-host-header-injection` | [SKILL.md](./testing-for-host-header-injection/SKILL.md) |
| `testing-for-open-redirect-vulnerabilities` | [SKILL.md](./testing-for-open-redirect-vulnerabilities/SKILL.md) |
| `testing-for-sensitive-data-exposure` | [SKILL.md](./testing-for-sensitive-data-exposure/SKILL.md) |
| `testing-for-xml-injection-vulnerabilities` | [SKILL.md](./testing-for-xml-injection-vulnerabilities/SKILL.md) |
| `testing-for-xss-vulnerabilities` | [SKILL.md](./testing-for-xss-vulnerabilities/SKILL.md) |
| `testing-for-xss-vulnerabilities-with-burpsuite` | [SKILL.md](./testing-for-xss-vulnerabilities-with-burpsuite/SKILL.md) |
| `testing-for-xxe-injection-vulnerabilities` | [SKILL.md](./testing-for-xxe-injection-vulnerabilities/SKILL.md) |

### Sécurité des applications mobiles

| Skill | Instructions |
|---|---|
| `analyzing-ios-app-security-with-objection` | [SKILL.md](./analyzing-ios-app-security-with-objection/SKILL.md) |
| `conducting-mobile-app-penetration-test` | [SKILL.md](./conducting-mobile-app-penetration-test/SKILL.md) |
| `exploiting-insecure-data-storage-in-mobile` | [SKILL.md](./exploiting-insecure-data-storage-in-mobile/SKILL.md) |
| `intercepting-mobile-traffic-with-burpsuite` | [SKILL.md](./intercepting-mobile-traffic-with-burpsuite/SKILL.md) |
| `performing-android-app-static-analysis-with-mobsf` | [SKILL.md](./performing-android-app-static-analysis-with-mobsf/SKILL.md) |
| `performing-dynamic-analysis-of-android-app` | [SKILL.md](./performing-dynamic-analysis-of-android-app/SKILL.md) |
| `performing-ios-app-security-assessment` | [SKILL.md](./performing-ios-app-security-assessment/SKILL.md) |
| `performing-mobile-app-certificate-pinning-bypass` | [SKILL.md](./performing-mobile-app-certificate-pinning-bypass/SKILL.md) |
| `testing-android-intents-for-vulnerabilities` | [SKILL.md](./testing-android-intents-for-vulnerabilities/SKILL.md) |
| `testing-mobile-api-authentication` | [SKILL.md](./testing-mobile-api-authentication/SKILL.md) |

## Autres skills produit (11)

### Paiement et monétisation

| Skill | Commande | Description |
|---|---|---|
| `fedapay-integration` | `skill:fedapay` | Intégration FedaPay : Mobile Money et cartes, webhooks signés et idempotence |
| `saas-pricing-strategy` | `skill:pricing` | Stratégie tarifaire SaaS, quotas et plans |

### Design et typographie

| Skill | Commande | Description |
|---|---|---|
| `palette-and-typography-picker` | `skill:palette` | Palettes, pairings typographiques et design tokens |
| `design` | `design:[tâche]` | Direction artistique, maquettes et analyse UI/UX |
| `design-system` | `design:system` | Tokens, composants, typographies et espacements |
| `banner-design` | `design:banner` | Bannières et visuels promotionnels |

### Vidéo et marketing

| Skill | Commande | Description |
|---|---|---|
| `brag` | `/brag` | Vidéo de lancement du projet |
| `brand` | `/brand` | Identité, voix et cohérence de marque |
| `slides` | `/slides` | Présentations HTML stratégiques |

## Vulnérabilités Web Avancées (restaurés depuis archive)

| Skill | Instructions |
|---|---|
| `testing-for-business-logic-vulnerabilities` | [SKILL.md](./testing-for-business-logic-vulnerabilities/SKILL.md) |
| `exploiting-http-request-smuggling` | [SKILL.md](./exploiting-http-request-smuggling/SKILL.md) |
| `exploiting-race-condition-vulnerabilities` | [SKILL.md](./exploiting-race-condition-vulnerabilities/SKILL.md) |
| `exploiting-type-juggling-vulnerabilities` | [SKILL.md](./exploiting-type-juggling-vulnerabilities/SKILL.md) |
| `performing-content-security-policy-bypass` | [SKILL.md](./performing-content-security-policy-bypass/SKILL.md) |
| `performing-http-parameter-pollution-attack` | [SKILL.md](./performing-http-parameter-pollution-attack/SKILL.md) |
| `performing-security-headers-audit` | [SKILL.md](./performing-security-headers-audit/SKILL.md) |
| `performing-ssl-stripping-attack` | [SKILL.md](./performing-ssl-stripping-attack/SKILL.md) |
| `performing-subdomain-enumeration-with-subfinder` | [SKILL.md](./performing-subdomain-enumeration-with-subfinder/SKILL.md) |
| `performing-dns-enumeration-and-zone-transfer` | [SKILL.md](./performing-dns-enumeration-and-zone-transfer/SKILL.md) |
| `performing-steganography-detection` | [SKILL.md](./performing-steganography-detection/SKILL.md) |
| `performing-vlan-hopping-attack` | [SKILL.md](./performing-vlan-hopping-attack/SKILL.md) |
| `exploiting-broken-link-hijacking` | [SKILL.md](./exploiting-broken-link-hijacking/SKILL.md) |
| `exploiting-deeplink-vulnerabilities` | [SKILL.md](./exploiting-deeplink-vulnerabilities/SKILL.md) |
| `bypassing-authentication-with-forced-browsing` | [SKILL.md](./bypassing-authentication-with-forced-browsing/SKILL.md) |
| `exploiting-bgp-hijacking-vulnerabilities` | [SKILL.md](./exploiting-bgp-hijacking-vulnerabilities/SKILL.md) |
| `exploiting-ipv6-vulnerabilities` | [SKILL.md](./exploiting-ipv6-vulnerabilities/SKILL.md) |

## Forensics & Incident Response (restaurés depuis archive)

| Skill | Instructions |
|---|---|
| `building-incident-response-playbook` | [SKILL.md](./building-incident-response-playbook/SKILL.md) |
| `building-incident-response-dashboard` | [SKILL.md](./building-incident-response-dashboard/SKILL.md) |
| `building-incident-timeline-with-timesketch` | [SKILL.md](./building-incident-timeline-with-timesketch/SKILL.md) |
| `building-malware-incident-communication-template` | [SKILL.md](./building-malware-incident-communication-template/SKILL.md) |
| `building-ransomware-playbook-with-cisa-framework` | [SKILL.md](./building-ransomware-playbook-with-cisa-framework/SKILL.md) |
| `building-super-timelines-with-plaso` | [SKILL.md](./building-super-timelines-with-plaso/SKILL.md) |
| `containing-active-breach` | [SKILL.md](./containing-active-breach/SKILL.md) |
| `conducting-cloud-incident-response` | [SKILL.md](./conducting-cloud-incident-response/SKILL.md) |
| `conducting-malware-incident-response` | [SKILL.md](./conducting-malware-incident-response/SKILL.md) |
| `conducting-phishing-incident-response` | [SKILL.md](./conducting-phishing-incident-response/SKILL.md) |
| `conducting-memory-forensics-with-volatility` | [SKILL.md](./conducting-memory-forensics-with-volatility/SKILL.md) |
| `collecting-volatile-evidence-from-compromised-host` | [SKILL.md](./collecting-volatile-evidence-from-compromised-host/SKILL.md) |
| `eradicating-malware-from-infected-systems` | [SKILL.md](./eradicating-malware-from-infected-systems/SKILL.md) |
| `generating-forensic-timelines-with-hayabusa` | [SKILL.md](./generating-forensic-timelines-with-hayabusa/SKILL.md) |
| `investigating-ransomware-attack-artifacts` | [SKILL.md](./investigating-ransomware-attack-artifacts/SKILL.md) |
| `performing-ransomware-response` | [SKILL.md](./performing-ransomware-response/SKILL.md) |
| `testing-ransomware-recovery-procedures` | [SKILL.md](./testing-ransomware-recovery-procedures/SKILL.md) |
| `performing-cloud-forensics-investigation` | [SKILL.md](./performing-cloud-forensics-investigation/SKILL.md) |
| `performing-cloud-forensics-with-aws-cloudtrail` | [SKILL.md](./performing-cloud-forensics-with-aws-cloudtrail/SKILL.md) |
| `performing-cloud-incident-containment-procedures` | [SKILL.md](./performing-cloud-incident-containment-procedures/SKILL.md) |
| `performing-cloud-log-forensics-with-athena` | [SKILL.md](./performing-cloud-log-forensics-with-athena/SKILL.md) |
| `performing-cloud-native-forensics-with-falco` | [SKILL.md](./performing-cloud-native-forensics-with-falco/SKILL.md) |
| `performing-cloud-storage-forensic-acquisition` | [SKILL.md](./performing-cloud-storage-forensic-acquisition/SKILL.md) |
| `performing-disk-forensics-investigation` | [SKILL.md](./performing-disk-forensics-investigation/SKILL.md) |
| `performing-endpoint-forensics-investigation` | [SKILL.md](./performing-endpoint-forensics-investigation/SKILL.md) |
| `performing-linux-log-forensics-investigation` | [SKILL.md](./performing-linux-log-forensics-investigation/SKILL.md) |
| `performing-log-analysis-for-forensic-investigation` | [SKILL.md](./performing-log-analysis-for-forensic-investigation/SKILL.md) |
| `performing-malware-hash-enrichment-with-virustotal` | [SKILL.md](./performing-malware-hash-enrichment-with-virustotal/SKILL.md) |
| `performing-malware-ioc-extraction` | [SKILL.md](./performing-malware-ioc-extraction/SKILL.md) |
| `performing-malware-persistence-investigation` | [SKILL.md](./performing-malware-persistence-investigation/SKILL.md) |
| `performing-malware-triage-with-yara` | [SKILL.md](./performing-malware-triage-with-yara/SKILL.md) |
| `performing-memory-forensics-with-volatility3` | [SKILL.md](./performing-memory-forensics-with-volatility3/SKILL.md) |
| `performing-memory-forensics-with-volatility3-plugins` | [SKILL.md](./performing-memory-forensics-with-volatility3-plugins/SKILL.md) |
| `performing-mobile-device-forensics-with-cellebrite` | [SKILL.md](./performing-mobile-device-forensics-with-cellebrite/SKILL.md) |
| `performing-network-forensics-with-wireshark` | [SKILL.md](./performing-network-forensics-with-wireshark/SKILL.md) |
| `performing-sqlite-database-forensics` | [SKILL.md](./performing-sqlite-database-forensics/SKILL.md) |
| `performing-timeline-reconstruction-with-plaso` | [SKILL.md](./performing-timeline-reconstruction-with-plaso/SKILL.md) |
| `performing-ioc-enrichment-automation` | [SKILL.md](./performing-ioc-enrichment-automation/SKILL.md) |
| `automating-ioc-enrichment` | [SKILL.md](./automating-ioc-enrichment/SKILL.md) |
| `building-ioc-enrichment-pipeline-with-opencti` | [SKILL.md](./building-ioc-enrichment-pipeline-with-opencti/SKILL.md) |
| `parsing-artifacts-with-eric-zimmerman-tools` | [SKILL.md](./parsing-artifacts-with-eric-zimmerman-tools/SKILL.md) |
| `extracting-browser-history-artifacts` | [SKILL.md](./extracting-browser-history-artifacts/SKILL.md) |
| `extracting-credentials-from-memory-dump` | [SKILL.md](./extracting-credentials-from-memory-dump/SKILL.md) |
| `extracting-memory-artifacts-with-rekall` | [SKILL.md](./extracting-memory-artifacts-with-rekall/SKILL.md) |
| `extracting-windows-event-logs-artifacts` | [SKILL.md](./extracting-windows-event-logs-artifacts/SKILL.md) |
| `analyzing-memory-dumps-with-volatility` | [SKILL.md](./analyzing-memory-dumps-with-volatility/SKILL.md) |
| `analyzing-memory-forensics-with-lime-and-volatility` | [SKILL.md](./analyzing-memory-forensics-with-lime-and-volatility/SKILL.md) |
| `analyzing-docker-container-forensics` | [SKILL.md](./analyzing-docker-container-forensics/SKILL.md) |
| `analyzing-linux-system-artifacts` | [SKILL.md](./analyzing-linux-system-artifacts/SKILL.md) |
| `analyzing-malware-persistence-with-autoruns` | [SKILL.md](./analyzing-malware-persistence-with-autoruns/SKILL.md) |
| `analyzing-windows-registry-for-artifacts` | [SKILL.md](./analyzing-windows-registry-for-artifacts/SKILL.md) |
| `analyzing-windows-amcache-artifacts` | [SKILL.md](./analyzing-windows-amcache-artifacts/SKILL.md) |
| `analyzing-supply-chain-malware-artifacts` | [SKILL.md](./analyzing-supply-chain-malware-artifacts/SKILL.md) |
| `analyzing-cloud-storage-access-patterns` | [SKILL.md](./analyzing-cloud-storage-access-patterns/SKILL.md) |

## IA / LLM Securite (restaures depuis archive)

| Skill | Instructions |
|---|---|
| `testing-for-system-prompt-leakage` | [SKILL.md](./testing-for-system-prompt-leakage/SKILL.md) |
| `testing-prompt-injection-in-rag-pipelines` | [SKILL.md](./testing-prompt-injection-in-rag-pipelines/SKILL.md) |
| `detecting-ai-model-prompt-injection-attacks` | [SKILL.md](./detecting-ai-model-prompt-injection-attacks/SKILL.md) |
| `detecting-indirect-prompt-injection` | [SKILL.md](./detecting-indirect-prompt-injection/SKILL.md) |
| `detecting-model-extraction-attacks` | [SKILL.md](./detecting-model-extraction-attacks/SKILL.md) |
| `defending-llms-with-guardrails` | [SKILL.md](./defending-llms-with-guardrails/SKILL.md) |
| `implementing-llm-guardrails-for-security` | [SKILL.md](./implementing-llm-guardrails-for-security/SKILL.md) |
| `assessing-vector-and-embedding-weaknesses` | [SKILL.md](./assessing-vector-and-embedding-weaknesses/SKILL.md) |
| `continuous-llm-red-teaming-with-promptfoo` | [SKILL.md](./continuous-llm-red-teaming-with-promptfoo/SKILL.md) |
| `red-teaming-llms-with-garak` | [SKILL.md](./red-teaming-llms-with-garak/SKILL.md) |
| `orchestrating-llm-attacks-with-pyrit` | [SKILL.md](./orchestrating-llm-attacks-with-pyrit/SKILL.md) |

## Zero Trust & IAM (restaures depuis archive)

| Skill | Instructions |
|---|---|
| `implementing-zero-trust-for-saas-applications` | [SKILL.md](./implementing-zero-trust-for-saas-applications/SKILL.md) |
| `implementing-zero-trust-in-cloud` | [SKILL.md](./implementing-zero-trust-in-cloud/SKILL.md) |
| `implementing-zero-trust-network-access` | [SKILL.md](./implementing-zero-trust-network-access/SKILL.md) |
| `implementing-zero-trust-network-access-with-zscaler` | [SKILL.md](./implementing-zero-trust-network-access-with-zscaler/SKILL.md) |
| `implementing-zero-trust-with-beyondcorp` | [SKILL.md](./implementing-zero-trust-with-beyondcorp/SKILL.md) |
| `implementing-zero-trust-with-hashicorp-boundary` | [SKILL.md](./implementing-zero-trust-with-hashicorp-boundary/SKILL.md) |
| `implementing-beyondcorp-zero-trust-access-model` | [SKILL.md](./implementing-beyondcorp-zero-trust-access-model/SKILL.md) |
| `implementing-cisa-zero-trust-maturity-model` | [SKILL.md](./implementing-cisa-zero-trust-maturity-model/SKILL.md) |
| `implementing-device-posture-assessment-in-zero-trust` | [SKILL.md](./implementing-device-posture-assessment-in-zero-trust/SKILL.md) |
| `implementing-identity-verification-for-zero-trust` | [SKILL.md](./implementing-identity-verification-for-zero-trust/SKILL.md) |
| `implementing-browser-isolation-for-zero-trust` | [SKILL.md](./implementing-browser-isolation-for-zero-trust/SKILL.md) |
| `configuring-aws-verified-access-for-ztna` | [SKILL.md](./configuring-aws-verified-access-for-ztna/SKILL.md) |
| `configuring-zscaler-private-access-for-ztna` | [SKILL.md](./configuring-zscaler-private-access-for-ztna/SKILL.md) |
| `configuring-microsegmentation-for-zero-trust` | [SKILL.md](./configuring-microsegmentation-for-zero-trust/SKILL.md) |
| `deploying-cloudflare-access-for-zero-trust` | [SKILL.md](./deploying-cloudflare-access-for-zero-trust/SKILL.md) |
| `deploying-tailscale-for-zero-trust-vpn` | [SKILL.md](./deploying-tailscale-for-zero-trust-vpn/SKILL.md) |
| `implementing-just-in-time-access-provisioning` | [SKILL.md](./implementing-just-in-time-access-provisioning/SKILL.md) |
| `implementing-zero-standing-privilege-with-cyberark` | [SKILL.md](./implementing-zero-standing-privilege-with-cyberark/SKILL.md) |
| `implementing-privileged-access-management-with-cyberark` | [SKILL.md](./implementing-privileged-access-management-with-cyberark/SKILL.md) |
| `implementing-privileged-access-workstation` | [SKILL.md](./implementing-privileged-access-workstation/SKILL.md) |
| `implementing-privileged-session-monitoring` | [SKILL.md](./implementing-privileged-session-monitoring/SKILL.md) |
| `implementing-pam-for-database-access` | [SKILL.md](./implementing-pam-for-database-access/SKILL.md) |
| `implementing-delinea-secret-server-for-pam` | [SKILL.md](./implementing-delinea-secret-server-for-pam/SKILL.md) |
| `implementing-saml-sso-with-okta` | [SKILL.md](./implementing-saml-sso-with-okta/SKILL.md) |
| `implementing-scim-provisioning-with-okta` | [SKILL.md](./implementing-scim-provisioning-with-okta/SKILL.md) |
| `managing-cloud-identity-with-okta` | [SKILL.md](./managing-cloud-identity-with-okta/SKILL.md) |
| `building-identity-federation-with-saml-azure-ad` | [SKILL.md](./building-identity-federation-with-saml-azure-ad/SKILL.md) |
| `building-identity-governance-lifecycle-process` | [SKILL.md](./building-identity-governance-lifecycle-process/SKILL.md) |
| `implementing-identity-governance-with-sailpoint` | [SKILL.md](./implementing-identity-governance-with-sailpoint/SKILL.md) |
| `implementing-azure-ad-privileged-identity-management` | [SKILL.md](./implementing-azure-ad-privileged-identity-management/SKILL.md) |
| `implementing-conditional-access-policies-azure-ad` | [SKILL.md](./implementing-conditional-access-policies-azure-ad/SKILL.md) |
| `implementing-passwordless-auth-with-microsoft-entra` | [SKILL.md](./implementing-passwordless-auth-with-microsoft-entra/SKILL.md) |
| `auditing-entra-id-with-aadinternals` | [SKILL.md](./auditing-entra-id-with-aadinternals/SKILL.md) |
| `attacking-entra-id-with-roadtools` | [SKILL.md](./attacking-entra-id-with-roadtools/SKILL.md) |
| `detecting-entra-offensive-tools-in-graph-logs` | [SKILL.md](./detecting-entra-offensive-tools-in-graph-logs/SKILL.md) |
| `building-role-mining-for-rbac-optimization` | [SKILL.md](./building-role-mining-for-rbac-optimization/SKILL.md) |
| `performing-access-review-and-certification` | [SKILL.md](./performing-access-review-and-certification/SKILL.md) |
| `performing-access-recertification-with-saviynt` | [SKILL.md](./performing-access-recertification-with-saviynt/SKILL.md) |
| `performing-entitlement-review-with-sailpoint-iiq` | [SKILL.md](./performing-entitlement-review-with-sailpoint-iiq/SKILL.md) |
| `performing-privileged-account-access-review` | [SKILL.md](./performing-privileged-account-access-review/SKILL.md) |
| `configuring-hsm-for-key-storage` | [SKILL.md](./configuring-hsm-for-key-storage/SKILL.md) |
| `implementing-code-signing-for-artifacts` | [SKILL.md](./implementing-code-signing-for-artifacts/SKILL.md) |
| `implementing-zero-trust-dns-with-nextdns` | [SKILL.md](./implementing-zero-trust-dns-with-nextdns/SKILL.md) |
| `implementing-syslog-centralization-with-rsyslog` | [SKILL.md](./implementing-syslog-centralization-with-rsyslog/SKILL.md) |
| `implementing-runtime-security-with-tetragon` | [SKILL.md](./implementing-runtime-security-with-tetragon/SKILL.md) |
| `implementing-mitre-attack-coverage-mapping` | [SKILL.md](./implementing-mitre-attack-coverage-mapping/SKILL.md) |

## Notes

- Chaque skill actif est documenté dans son propre `SKILL.md`.
- L'archive locale (`.agents/skills/_archive/`) contient ~585 skills restants non activés (forensics Windows avancés, OT/SCADA/ICS, Red Team AD, threat hunting avancé).
- Pour retrouver un skill actif, rechercher son nom dans cet index ou utiliser `skill:[nom-exact-du-dossier]`.
- Pour restaurer un skill de l'archive, déplacer son dossier vers `.agents/skills/` et ajouter l'entrée dans cet index.
