import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  MapPin, 
  Wind, 
  Radio, 
  Zap, 
  Waves, 
  ChevronDown, 
  Award, 
  Compass, 
  HelpCircle, 
  Activity, 
  Globe, 
  ArrowRight,
  Info
} from 'lucide-react';

interface LandingPageProps {
  onLaunchSimulator: () => void;
}

export function LandingPage({ onLaunchSimulator }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // FAQ Data conforming to exact guidelines
  const faqs = [
    {
      q: "Comment l'application calcule-t-elle la zone d'impact ?",
      a: "NUKEMAP EDU résout de manière analytique et en temps réel les équations empiriques du domaine public issues du traité de référence de Samuel Glasstone et Philip J. Dolan (The Effects of Nuclear Weapons). Ces équations modélisent la décroissance de surpression barométrique (de 20 psi à 12 psi pour l'effondrement lourd, jusqu'à 1 psi pour les bris de vitres) et l'énergie thermique dissipée selon le cubage d'énergie de l'arme."
    },
    {
      q: "D'où proviennent les données géographiques et météorologiques ?",
      a: "Toutes les analyses s'appuient sur de vraies données dynamiques réelles. L'application interroge en direct l'API OpenStreetMap (via Overpass) pour capturer les coordonnées réelles des infrastructures sensibles (hôpitaux, écoles, axes de transport) sous l'emprise physique du souffle moléculaire, tandis que l'API Open-Meteo injecte l'orientation et la direction du vent en temps réel pour orienter l'ellipse de retombées radioactives."
    },
    {
      q: "Comment fonctionne le calculateur hydrodynamique de tsunami littoral ?",
      a: "Lorsqu'un impact a lieu à proximité ou au cœeur d'un plan d'eau, NUKEMAP EDU croise l'énergie cinétique dégagée avec la profondeur bathymétrique extraite automatiquement. En appliquant la loi de Green et l'approximation d'ondes d'Airy, l'algorithme calcule l'effet de shoaling sur le plateau continental, vous alertant si la configuration géométrique du rivage risque d'amplifier fatalement la vague côtière générée par le souffle aérien."
    },
    {
      q: "Est-ce un outil officiel de planification militaire ?",
      a: "Non. NUKEMAP EDU est exclusivement un outil à vocation pédagogique, académique et d'éducation géopolitique destiné à simplifier la compréhension globale des forces physiques complexes mises en jeu, sans jamais glorifier ni censurer la réalité brute de la dévastation humaine civile."
    }
  ];

  // Real-world cases conforming to physical validation guidelines
  const cases = [
    {
      role: "RECHERCHE ET GÉOPOLITIQUE",
      target: "Lycées & Universités",
      icon: <Compass className="w-5 h-5 text-red-500" />,
      title: "Anatomie d'une crise historique maritime",
      desc: "Un professeur de géostratégie simule l'effet d'entonnoir topographique de la baie de Nagasaki pour expliquer la dissymétrie d'impact physique causée par des reliefs collinaires abrupts face à un relief de plaine."
    },
    {
      role: "RÉSILIENCE ET PLANIFICATION CIVILE",
      target: "Architectes & Analystes de crise",
      icon: <Activity className="w-5 h-5 text-red-500" />,
      title: "Évaluation de la survie infrastructurelle",
      desc: "Un analyste étudie les niveaux d'affectation des centres de secours et héliports urbains soumis à une onde stationnaire d'overpressure de 5 psi, cartographiant instantanément les barrages routiers présumés par bris de débris."
    },
    {
      role: "SENSIBILISATION PUBLIC CITOYEN",
      target: "Générations futures",
      icon: <Globe className="w-5 h-5 text-red-500" />,
      title: "Modélisation des retombées atmosphériques actives",
      desc: "Un utilisateur curieux observe l'ellipse réelle des radiations (fallout) générée par le vent météo du jour au-dessus de son département, constatant l'effet de transport transfrontalier stochastique à haute altitude."
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 overflow-y-auto font-sans selection:bg-red-500 selection:text-white">
      {/* Absolute background radar/grid decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Tech line top overlay */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-red-600 via-zinc-800 to-red-600 opacity-80" />

      {/* Hero Header Section */}
      <header className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 flex flex-col items-center text-center z-10">
        
        {/* Bunker chic badge status */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-red-950/30 border border-red-900/50 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest text-red-400 uppercase font-semibold mb-6"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          CONSOLE D'ÉVALUATION PHYSIQUE CLASSE-EDU V2
        </motion.div>

        {/* Display Typography Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-sans font-bold tracking-tight text-zinc-100 max-w-4xl leading-[1.1]"
        >
          NUKEMAP EDU
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800 text-3xl md:text-5xl font-mono tracking-wide mt-3 font-semibold">
            VECTEURS &amp; PROPAGATION 3D
          </span>
        </motion.h1>

        {/* Detailed context caption for teenagers & experts alike */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed"
        >
          Visualisez les ondes d'overpressure brute, la propagation balistique elliptique, et les tsunamis de haut-fond côtiers grâce à un couplage temps réel unique entre calculs scientifiques et géodrapeau dynamique (météo &amp; infrastructures OSM).
        </motion.p>

        {/* Main call to actions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
        >
          <button
            type="button"
            onClick={onLaunchSimulator}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold tracking-widest uppercase p-4 px-8 rounded-lg shadow-xl hover:shadow-red-900/40 transition-all duration-300 cursor-pointer active:scale-95"
          >
            Lancer la Console de Simulation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a
            href="#features-explained"
            className="flex items-center justify-center gap-1 w-full sm:w-auto text-zinc-400 hover:text-white font-mono text-[11px] tracking-wider uppercase p-4 transition-colors"
          >
            Consulter les équations physiques
          </a>
        </motion.div>

        {/* Physical validation metric badges grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 border-t border-b border-zinc-900 py-6 w-full max-w-6xl text-left"
        >
          <div className="flex flex-col gap-1 p-2">
            <span className="text-xs text-zinc-500 font-mono">CODE EXPLICIT :</span>
            <span className="text-sm font-bold text-zinc-200 uppercase font-sans">Glasstone Modifié</span>
          </div>
          <div className="flex flex-col gap-1 p-2">
            <span className="text-xs text-zinc-500 font-mono">RUGOSITÉ DE SOL :</span>
            <span className="text-sm font-bold text-red-400 uppercase font-sans">Manning (n) dynamique</span>
          </div>
          <div className="flex flex-col gap-1 p-2">
            <span className="text-xs text-zinc-500 font-mono">DENSITÉ GÉOPHYSIQUE :</span>
            <span className="text-sm font-bold text-zinc-200 uppercase font-sans">OSM / DEM COUPLÉ</span>
          </div>
          <div className="flex flex-col gap-1 p-2">
            <span className="text-xs text-zinc-500 font-mono">ANALYSE HYDRODYNAMIQUE :</span>
            <span className="text-sm font-bold text-zinc-200 uppercase font-sans">Tsunamis de Green</span>
          </div>
        </motion.div>
      </header>

      {/* Crux: Problem Solved Banner */}
      <section className="relative py-12 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800/80 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="flex-1 flex flex-col gap-3">
              <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase">PROBLÈMATIQUE BRUTE</span>
              <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-white leading-tight">
                La surpression moléculaire n'est pas un cercle tridimensionnel abstrait.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mt-1">
                Les simulateurs traditionnels projettent des disques géométriques figés posés sur des cartes planes. En réalité, le relief collineux freine l'onde de choc, tandis qu'un éclat d'uranium au milieu de l'océan crée un gonflement brusque hydrodynamique dicté par le relief bathymétrique. NUKEMAP EDU résout ce manque de réalisme en confrontant les lois de thermodynamiques aux réelles métadonnées environnementales terrestres instantanées.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-3 w-full md:w-80 bg-zinc-950/70 border border-zinc-800 p-5 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300">
                <Info className="w-4 h-4 text-red-500 shrink-0" />
                VALEURS PHYSIQUES TANGIBLES
              </div>
              <ul className="flex flex-col gap-2 text-[11px] font-mono text-zinc-400">
                <li className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span>Tropopause polaire:</span>
                  <span className="text-zinc-200">~8.0 km</span>
                </li>
                <li className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span>Tropopause équatoriale:</span>
                  <span className="text-zinc-200">~17.0 km</span>
                </li>
                <li className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span>Onde destructrice:</span>
                  <span className="text-zinc-200 font-bold text-red-400">&gt;20 psi (Sévère)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features-explained" className="relative py-16 md:py-24 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-2 mb-16">
            <span className="text-xs font-mono tracking-widest text-red-500 font-bold uppercase">MODULES DE CALCUL</span>
            <h2 className="text-3xl font-sans font-bold tracking-tight text-white">Technologie de Modélisation Avancée</h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              L'architecture exploite quatre noyaux mathématiques couplés s'exécutant entièrement sur votre processeur machine décentralisé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="flex flex-col bg-zinc-950 border border-zinc-905 p-6 rounded-xl hover:border-red-900/50 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-red-500 group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 font-sans mt-5">Surpression de Souffle</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mt-2.5">
                Modélisation de l'expansion du plasma gazeux. De l'arrachage structurel blindé (20 psi) à l'éclatement des conduits pulmonaires (5 psi) et des vitres (1 psi) corrigés par la force d'atténuation urbaine stochastique.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col bg-zinc-950 border border-zinc-905 p-6 rounded-xl hover:border-red-900/50 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-red-500 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 font-sans mt-5">Thermique &amp; Isothermes</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mt-2.5">
                Calcul précis de l'émission photonique instantanée de chaleur. Détermination de la distance critique d'inflammation spontanée du bois de structure et des limites de brûlures de 1er, 2ème et 3ème degré.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col bg-zinc-950 border border-zinc-905 p-6 rounded-xl hover:border-red-900/50 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-red-500 group-hover:scale-110 transition-transform">
                <Waves className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 font-sans mt-5">Tsunami Côtier</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mt-2.5">
                Extraction asynchrone de la bathymétrie sous-marine. Modélise la hauteur d'onde stationnaire en appliquant la loi de Green à l'approche du littoral pour illustrer les risques inondations secondaires d'impacts côtiers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col bg-zinc-950 border border-zinc-905 p-6 rounded-xl hover:border-red-900/50 hover:shadow-xl hover:shadow-red-950/20 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-red-500 group-hover:scale-110 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 font-sans mt-5">Vents &amp; Nuage de Cendre</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mt-2.5">
                Couplage temps réel aux stations météo mondiales pour récupérer l'orientation des vents réels à l'altitude stratosphérique, étirant logiquement les ellipses d'irradiation ionisante (fallout).
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Human Cases Section */}
      <section className="relative py-16 md:py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-2 mb-16">
            <span className="text-xs font-mono tracking-widest text-red-500 font-bold uppercase">CONTEXTES COHÉRENTS</span>
            <h2 className="text-3xl font-sans font-bold tracking-tight text-white">Champs d'Applications Réels</h2>
            <p className="text-zinc-400 text-sm max-w-2xl">
              NUKEMAP EDU est calibré pour offrir une perspective pragmatique à tous les échelons d'apprentissage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cases.map((cs, idx) => (
              <div key={idx} className="flex flex-col bg-zinc-950/60 border border-zinc-900 p-6 rounded-xl hover:bg-zinc-900/30 transition-all">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-4 mb-4">
                  <div className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                    {cs.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-red-500 uppercase">{cs.role}</span>
                    <span className="text-xs text-zinc-400 font-medium">{cs.target}</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{cs.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{cs.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Step-by-Step explained */}
      <section className="relative py-16 md:py-24 bg-zinc-950/50 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="flex-1 flex flex-col gap-4">
              <span className="text-xs font-mono tracking-widest text-red-500 font-bold uppercase">PROTOCOLE OPÉRATIONNEL</span>
              <h2 className="text-3xl font-sans font-bold text-white tracking-tight leading-tight">Comment fonctionne la console ?</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mt-2">
                Le simulateur réagit à l'ergonomie physique pure. En sélectionnant un point terrestre, vous lancez une séquence cinématique asynchrone complète modélisant les phases suivantes.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onLaunchSimulator}
                  className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-mono text-xs font-bold tracking-wider uppercase p-3 px-6 rounded border border-zinc-800 transition-colors cursor-pointer"
                >
                  Accéder à la carte
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col gap-6 bg-zinc-950 border border-zinc-900 p-8 rounded-2xl relative">
              
              {/* Vertical link line decoration */}
              <div className="absolute left-[47px] top-12 bottom-12 w-[1px] bg-gradient-to-b from-red-600 to-zinc-800" />

              {/* Step 1 */}
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono font-bold text-red-400 shrink-0 z-10">
                  01
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-200 uppercase font-sans">Point GPS &amp; Vecteur balistique</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                    Sélectionnez la cible physique directement sur la carte vectorielle 2D/3D et déterminez le tonnage kilotonnes de l'ogive de rentrée.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono font-bold text-red-400 shrink-0 z-10">
                  02
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-200 uppercase font-sans">Enrichissement Topographique Synchrone</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                    Les API d'OpenStreetMap et d'Open-Meteo interrogent le relief altimétrique local, la bathymétrie d'eau et récoltent la direction météorologique des vents stratosphériques du jour.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono font-bold text-red-400 shrink-0 z-10">
                  03
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-200 uppercase font-sans">Onde de Propagation &amp; Rapport d'Affectation</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                    Suivez chronologiquement l'avancée physique de l'enveloppe sphérique (T+0s à T+20 min) et lisez le bilan d'infrastructures sensibles affectées (hôpitaux, écoles).
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="relative py-16 md:py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-2 mb-16">
            <span className="text-xs font-mono tracking-widest text-red-500 font-bold uppercase">FOIRE AUX QUESTIONS</span>
            <h2 className="text-3xl font-sans font-bold tracking-tight text-white">Précisions Scientifiques &amp; Techniques</h2>
            <p className="text-zinc-400 text-sm">
              Lisez les fondations mathématiques et logiques qui structurent notre algorithme de décalque d'effets physiques.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-lg overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left text-sm md:text-base font-bold text-zinc-200 font-sans hover:text-white transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-red-500' : ''}`} />
                </button>
                
                {activeFaq === idx && (
                  <div className="p-5 pt-0 border-t border-zinc-950/50 text-xs md:text-sm text-zinc-400 leading-relaxed font-sans bg-zinc-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center z-10 relative">
          <div className="w-12 h-12 rounded-full bg-red-950/30 border border-red-900/40 flex items-center justify-center text-red-500 mb-6">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight leading-tight">
            Accédez à la console de commandement militaire
          </h2>
          <p className="mt-4 text-zinc-400 text-sm max-w-xl leading-relaxed">
            Configurez n'importe quelle charge historique, lancez les vecteurs ICBM, et observez sans filtre le bilan de crise et la dispersion elliptique des retombées.
          </p>
          <div className="mt-8 w-full sm:w-auto">
            <button
              type="button"
              onClick={onLaunchSimulator}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold tracking-widest uppercase p-4.5 px-10 rounded-lg shadow-2xl transition-all duration-300 cursor-pointer active:scale-95"
            >
              ÉVALUER L'IMPACT DE GRANDE ÉCHELLE
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Humble Footer */}
      <footer className="relative border-t border-zinc-900 py-8 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase">
          <div className="flex items-center gap-2">
            <span>© 2026 NUKEMAP EDU PROJECT</span>
            <span>•</span>
            <span className="text-red-950 font-bold">STATUS: OPERATIONNAL</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-600">Base Physique de Glasstone &amp; Dolan (1977)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
