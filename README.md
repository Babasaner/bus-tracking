# 🚌 Bus Tracking Web App — Suivi de Bus en Temps Réel

Une application web dynamique et performante de suivi de bus en temps réel. Conçue avec **Next.js**, **Node.js** et **Firebase/Firestore**, cette application permet de géolocaliser les bus, de suivre les itinéraires et de fournir des estimations de temps d'attente fluides et réactives pour les utilisateurs.

🔗 **Démo en production :** [bus-tracking-neon.vercel.app](https://bus-tracking-neon.vercel.app/)

---

## 🚀 Fonctionnalités Clés

- **⏱️ Suivi en Temps Réel (Real-time Tracking) :** Synchronisation instantanée des positions des bus grâce à Firebase Firestore (écouteurs de flux `onSnapshot`).
- **🗺️ Cartographie Interactive :** Intégration de cartes pour visualiser les lignes, les arrêts de bus et le déplacement des véhicules en direct.
- **⚛️ Gestion d'État Avancée :** Utilisation des `context` React et de `hooks` personnalisés pour partager efficacement la donnée de géolocalisation à travers toute l'application sans re-rendus inutiles.
- **🔒 Sécurité des Données :** Implémentation de règles de sécurité strictes via le fichier `firestore.rules` pour protéger l'accès aux données de tracking et aux configurations.
- **⚡ Performance & Typage :** Structuré entièrement en **TypeScript** avec Next.js pour un code robuste, scalable et à chargement rapide.

---

## 🛠️ Stack Technique

- **Framework Frontend :** [Next.js](https://nextjs.org/) (App Router & Server Components)
- **Backend / Real-time Database :** [Node.js](https://nodejs.org/) & [Firebase Firestore](https://firebase.google.com/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/) (Sûreté de typage de bout en bout)
- **Gestionnaire de paquets :** `pnpm` (pour des installations ultra-rapides et légères)
- **Styling :** Tailwind CSS & configuration PostCSS custom

---

## 📐 Structure du Projet

L'arborescence du projet suit une architecture modulaire et scalable pour séparer proprement la logique métier de l'interface graphique :

```text
├── app/                  # Pages et routage principal (Next.js App Router)
├── components/           # Composants UI (Cartes, listes de bus, indicateurs)
├── context/              # Contextes React pour la gestion d'état globale (ex: état du bus, utilisateur)
├── hooks/                # Hooks personnalisés (ex: useGeolocation, useBusStream)
├── lib/                  # Configuration des SDK tiers (Initialisation de Firebase, utilitaires)
├── public/               # Actifs statiques (Icônes de bus, marqueurs de carte)
├── styles/               # Fichiers de configuration CSS globaux
├── firestore.rules       # Règles de sécurité et permissions de la base de données Firestore
├── components.json       # Configuration des composants UI (Shadcn/ui ou custom)
├── tsconfig.json         # Configuration TypeScript stricte
└── next.config.mjs       # Configuration avancée de Next.js
