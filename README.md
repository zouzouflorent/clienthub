# ClientHub - Gestion de Clients et Tickets

Application web full-stack de gestion de relation client (CRM) avec système de ticketing intégré. Solution moderne et performante permettant aux entreprises de gérer efficacement leur base clients et leurs demandes de support en temps réel.

## Description du Projet

ClientHub est une application SaaS complète développée pour simplifier la gestion des clients et le suivi des tickets de support. L'application offre une interface intuitive et réactive, permettant aux équipes de support de gérer leurs interactions clients de manière centralisée et efficace.

### Cas d'usage
- Gestion de portefeuille clients pour PME et startups
- Système de ticketing pour équipes de support technique
- Suivi des demandes clients en temps réel
- Tableau de bord centralisé pour la gestion de la relation client

## Fonctionnalités

### Authentification & Sécurité
- Système d'authentification complet (inscription/connexion)
- � Protection des routes et données utilisateur
- Gestion de session persistante

### Gestion des Clients
- Ajout de nouveaux clients avec informations complètes (nom, email, téléphone)
- � Liste dynamique et interactive des clients
- Suppression de clients avec confirmation
- Sélection rapide pour accéder aux tickets associés

### Système de Tickets
- Création de tickets liés à un client spécifique
- Gestion du statut des tickets (ouvert/fermé)
- Affichage en temps réel des mises à jour
- Synchronisation automatique entre utilisateurs

### Interface Utilisateur
- Design moderne et professionnel avec Tailwind CSS
- Interface responsive (mobile, tablette, desktop)
- Navigation fluide et intuitive
- Expérience utilisateur optimisée

## Technologies & Architecture

### Frontend
- **React 19** - Framework JavaScript moderne avec hooks
- **Vite** - Build tool ultra-rapide pour le développement
- **Tailwind CSS 4** - Framework CSS utility-first pour un design moderne
- **React Hooks** - Gestion d'état avec useState, useEffect

### Backend & Services
- **Firebase Authentication** - Gestion sécurisée des utilisateurs
- **Cloud Firestore** - Base de données NoSQL en temps réel
- **Firebase Functions** - Fonctions serverless pour la logique backend
- **Firebase Hosting** - Hébergement web performant et sécurisé

### Outils de Développement
- **ESLint** - Linting et qualité du code
- **Rolldown-Vite** - Bundler optimisé
- **Git & GitHub** - Contrôle de version et collaboration

### Architecture
- Architecture composant React modulaire et réutilisable
- Séparation des préoccupations (UI, logique, services)
- Gestion d'état locale avec React Hooks
- Communication temps réel avec Firestore listeners
- Authentification basée sur les tokens JWT (Firebase)

## Prérequis

- Node.js 18+
- npm ou yarn
- Compte Firebase

## Installation

1. Cloner le repository
```bash
git clone <votre-repo>
cd clienthub
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer Firebase
   - Créer un projet sur [Firebase Console](https://console.firebase.google.com)
   - Activer Authentication (Email/Password)
   - Créer une base Firestore
   - Copier les credentials Firebase

4. Configurer les variables d'environnement
```bash
cp .env.example .env
```

Éditer `.env` avec vos credentials Firebase :
```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

## Utilisation

### Développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`

### Build de production
```bash
npm run build
```

### Preview du build
```bash
npm run preview
```

## Firebase Functions (Optionnel)

Les fonctions cloud sont disponibles dans le dossier `functions/`.

### Installation
```bash
cd functions
npm install
```

### Déploiement
```bash
npm run deploy
```

## Structure du Projet

```
clienthub/
├── src/
│   ├── components/
│   │   ├── Auth.jsx          # Composant d'authentification
│   │   ├── Clients.jsx       # Gestion des clients
│   │   └── Tickets.jsx       # Gestion des tickets
│   ├── App.jsx               # Composant principal
│   ├── firebase.js           # Configuration Firebase
│   ├── main.jsx              # Point d'entrée
│   └── style.css             # Styles Tailwind
├── functions/                # Firebase Cloud Functions
├── public/                   # Fichiers statiques
└── dist/                     # Build de production
```

## Composants Principaux

### Auth.jsx
Composant d'authentification gérant l'inscription et la connexion des utilisateurs.
- Formulaire dynamique (login/register)
- Validation des champs
- Gestion des erreurs avec feedback utilisateur
- Intégration Firebase Authentication

### Clients.jsx
Composant central de gestion des clients.
- Formulaire d'ajout avec validation
- Liste interactive avec sélection
- Suppression avec mise à jour en temps réel
- Affichage conditionnel des tickets du client sélectionné
- Synchronisation automatique avec Firestore

### Tickets.jsx
Composant de gestion des tickets de support.
- Création de tickets liés à un client
- Filtrage automatique par clientId
- Changement de statut (ouvert → fermé)
- Mise à jour en temps réel via Firestore listeners
- Interface claire avec code couleur par statut

## Points Techniques Notables

- **Temps Réel**: Utilisation de `onSnapshot` pour la synchronisation instantanée
- **Optimisation**: Nettoyage des listeners avec `useEffect` cleanup
- **Validation**: Vérification des champs avant soumission
- **UX**: Feedback visuel immédiat sur toutes les actions
- **Sécurité**: Authentification requise pour toutes les opérations
- **Performance**: Queries Firestore optimisées avec `where` clauses

## Sécurité

- Authentification requise pour accéder à l'application
- Variables d'environnement pour les credentials Firebase
- Règles Firestore à configurer (recommandé)

### Règles Firestore recommandées
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Dépannage

### Erreur de build
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problèmes Firebase
- Vérifier que les services sont activés dans Firebase Console
- Vérifier les variables d'environnement dans `.env`
- Vérifier les règles Firestore

## License

MIT

## Compétences Démontrées

Ce projet met en avant les compétences suivantes :

### Développement Frontend
- Maîtrise de React et des hooks modernes
- Création d'interfaces utilisateur réactives et intuitives
- Gestion d'état et cycle de vie des composants
- Styling moderne avec Tailwind CSS

### Développement Backend
- Intégration de services Firebase (Auth, Firestore, Functions)
- Architecture serverless et cloud
- Gestion de base de données NoSQL
- Sécurisation des données et authentification

### Bonnes Pratiques
- Code modulaire et réutilisable
- Gestion des erreurs et validation des données
- Optimisation des performances
- Architecture scalable et maintenable
- Contrôle de version avec Git

### DevOps
- Configuration d'environnements de développement
- Build et déploiement automatisés
- Gestion des variables d'environnement
- Hébergement et mise en production

## Résultats & Impact

- Application full-stack fonctionnelle et déployée
- Interface utilisateur moderne et responsive
- Synchronisation temps réel entre utilisateurs
- Architecture scalable prête pour la production
- Code propre et bien structuré

## Évolutions Futures

- [ ] Système de notifications push
- [ ] Filtres et recherche avancée
- [ ] Statistiques et tableaux de bord analytiques
- [ ] Export de données (PDF, CSV)
- [ ] Système de commentaires sur les tickets
- [ ] Gestion des priorités et assignations
- [ ] Mode sombre
- [ ] Internationalisation (i18n)

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
