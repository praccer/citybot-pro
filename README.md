# CityBot-Pro — NOVA 🌆

> Le chatbot citoyen de la ville intelligente NeoVille | The intelligent citizen chatbot for NeoVille

## Contexte / Context

Nous sommes en 2032. NeoVille est une métropole pionnière entièrement numérisée. NOVA (Navigateur Officiel de la Ville Augmentée) est le chatbot citoyen intelligent accessible depuis le portail municipal. Les habitants peuvent signaler des problèmes urbains, consulter les services de la ville, et obtenir des réponses instantanées.

## Installation & Lancement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build
```

L'application sera disponible sur `http://localhost:5173`

## Routes implémentées

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Accueil citoyen avec services et signalements récents |
| `/chat` | Chat | Interface de chat avec NOVA |
| `/signalements` | Reports | Formulaire de signalement + historique |
| `/services` | Services | Liste des services municipaux |
| `/services/:id` | ServiceDetail | **Route dynamique** — détail d'un service |
| `/parametres` | Settings | Paramètres et personnalisation |
| `*` | NotFound | Page 404 personnalisée |

## Choix techniques

### Pourquoi useReducer plutôt que Redux ?

- **Légèreté** : useReducer est natif React, aucune dépendance externe nécessaire.
- **Adéquation** : Pour une application de taille moyenne, Redux apporterait une complexité inutile (store, actions, selectors, middleware).
- **Lisibilité** : Les reducers (chatReducer, reportsReducer) sont des fonctions pures simples, faciles à tester et à comprendre.
- **useContext** remplace le Provider Redux pour partager le profil citoyen globalement.

### Architecture

```
src/
├── components/        # Composants réutilisables
│   ├── Sidebar.jsx    # Navigation principale
│   ├── SkeletonLoader.jsx  # Indicateurs de chargement
│   └── Toast.jsx      # Notifications
├── pages/             # Vues de l'application
│   ├── Home.jsx       # Accueil citoyen
│   ├── Chat.jsx       # Chat avec NOVA
│   ├── Reports.jsx    # Signalements (useReducer)
│   ├── Services.jsx   # Liste services
│   ├── ServiceDetail.jsx  # Détail service (/services/:id)
│   ├── Settings.jsx   # Paramètres
│   └── NotFound.jsx   # 404
├── context/
│   └── UserContext.jsx    # Profil citoyen global
├── reducers/
│   ├── chatReducer.js     # État du chat
│   └── reportsReducer.js  # État des signalements
├── data/
│   └── citybot_mock_api.json  # Mock API REST simulée
├── App.jsx            # Router principal (React Router v6)
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux
```

### Simulation Mock API

- Toutes les données viennent de `citybot_mock_api.json`
- Les appels sont simulés avec `setTimeout` (800–1500ms) pour reproduire le comportement async
- Chaque appel gère : `isLoading`, skeleton loaders, et état d'erreur

## Fonctionnalités

- ✅ Accueil personnalisé avec nom du citoyen
- ✅ Chat libre avec NOVA (réponses contextuelles par catégorie)
- ✅ Skeleton loaders pendant le chargement
- ✅ Formulaire de signalement avec validation côté client
- ✅ Historique des signalements
- ✅ Navigation vers pages de détail services (`/services/:id`)
- ✅ Mode clair / sombre
- ✅ Langue française / anglaise
- ✅ Page 404 personnalisée
- ✅ Design responsive (sidebar réduite sur mobile)
