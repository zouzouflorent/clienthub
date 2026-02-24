# 🎯 ClientHub - Gestion de Clients et Tickets

Application web moderne de gestion de clients et de tickets de support, construite avec React, Firebase et Tailwind CSS.

## ✨ Fonctionnalités

- 🔐 Authentification utilisateur (inscription/connexion)
- 👥 Gestion complète des clients (ajout, suppression, liste)
- 🎫 Système de tickets par client
- 📊 Interface intuitive et responsive
- ⚡ Temps réel avec Firestore
- 🎨 Design moderne avec Tailwind CSS

## 🛠️ Technologies

- **Frontend**: React 19, Vite
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Styling**: Tailwind CSS 4
- **Build**: Rolldown-Vite

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Compte Firebase

## 🚀 Installation

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

## 🎮 Utilisation

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

## 🔥 Firebase Functions (Optionnel)

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

## 📁 Structure du Projet

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

## 🎨 Composants Principaux

### Auth
Gère l'inscription et la connexion des utilisateurs avec Firebase Authentication.

### Clients
- Ajouter de nouveaux clients
- Afficher la liste des clients
- Supprimer des clients
- Sélectionner un client pour voir ses tickets

### Tickets
- Créer des tickets pour un client spécifique
- Marquer les tickets comme fermés
- Affichage en temps réel

## 🔒 Sécurité

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

## 🐛 Dépannage

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

## 📝 License

MIT

## 👨‍💻 Auteur

Votre nom

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
