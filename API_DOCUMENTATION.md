# EventPlanner Backend API

Backend RESTful API pour l'application EventPlanner, développé avec Node.js, Express, PostgreSQL et Sequelize.

## 🚀 Quick Start

### Prérequis
- Node.js 18+
- PostgreSQL 15
- npm 10+

### Installation et démarrage

1. **Cloner et installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer l'environnement**
   Copier `.env.example` vers `.env` et renseigner les variables :
   ```env
   NODE_ENV=development
   PORT=4000
   DATABASE_URL=postgres://username:password@localhost:5432/event_planner
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES=1d
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Initialiser la base de données**
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

4. **Peupler avec des données de test**
   ```bash
   node src/seeders/demo-data.js
   ```

5. **Démarrer le serveur**
   ```bash
   npm run dev
   ```

L'API est accessible sur : `http://localhost:4000`

## 📋 Comptes de test

Après le seeding, vous pouvez utiliser ces comptes :

- **Admin** : `admin@eventplanner.com` / `password123`
- **Organizer** : `organizer@eventplanner.com` / `password123`  
- **Provider** : `provider@eventplanner.com` / `password123`

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/refresh-token` - Renouveler le token JWT

### Users
- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Modifier le profil
- `POST /api/users/upload-avatar` - Upload d'avatar
- `GET /api/users/notifications` - Notifications utilisateur

### Events
- `POST /api/events` - Créer un événement
- `GET /api/events` - Lister les événements
- `GET /api/events/:id` - Détails d'un événement
- `PUT /api/events/:id` - Modifier un événement
- `DELETE /api/events/:id` - Supprimer un événement

### Venues
- `POST /api/venues` - Créer un lieu
- `GET /api/venues` - Lister les lieux
- `GET /api/venues/search?q=terme` - Rechercher des lieux
- `GET /api/venues/:id` - Détails d'un lieu
- `PUT /api/venues/:id` - Modifier un lieu
- `DELETE /api/venues/:id` - Supprimer un lieu

### AI Assistant
- `POST /api/ai/recommendations` - Recommandations de lieux par IA
- `POST /api/ai/generate-quote` - Génération de devis par IA
- `POST /api/ai/analyze-requirements` - Analyse des besoins par IA

### Quotes
- `POST /api/quotes` - Créer un devis
- `GET /api/quotes` - Lister les devis
- `PUT /api/quotes/:id/accept` - Accepter un devis
- `PUT /api/quotes/:id/reject` - Rejeter un devis
- `PUT /api/quotes/:id/negotiate` - Négocier un devis

## 🧪 Tests avec Postman/Insomnia

### 1. Authentication Flow

**Register**
```http
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password123",
  "role": "organizer",
  "phone": "+1234567890"
}
```

**Login**
```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "organizer@eventplanner.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Create Event

```http
POST http://localhost:4000/api/events
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-09-15",
  "startTime": "09:00:00",
  "endTime": "18:00:00",
  "guestCount": 200,
  "budget": 15000
}
```

### 3. AI Venue Recommendations

```http
POST http://localhost:4000/api/ai/recommendations
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "guestCount": 200,
  "budgetMin": 2000,
  "budgetMax": 5000
}
```

### 4. Generate AI Quote

```http
POST http://localhost:4000/api/ai/generate-quote
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "venueId": 1,
  "eventId": 1
}
```

### 5. Search Venues

```http
GET http://localhost:4000/api/venues/search?q=ballroom&city=New York&minCapacity=100
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔧 Architecture

```
src/
├── config/         # Configuration base de données
├── models/         # Modèles Sequelize
├── migrations/     # Migrations base de données
├── seeders/        # Scripts de peuplement
├── routes/         # Routes Express
├── controllers/    # Contrôleurs
├── services/       # Logique métier
├── middlewares/    # Middlewares Express
├── utils/          # Utilitaires (OpenAI client)
└── index.js        # Point d'entrée de l'application
```

## 🤖 Fonctionnalités IA (OpenAI)

L'API intègre OpenAI GPT-4o-mini pour :

1. **Recommandations de lieux intelligentes** : Analyse les critères (nombre d'invités, budget) et recommande les 3 meilleurs lieux
2. **Génération automatique de devis** : Crée des devis détaillés avec ventilation des coûts
3. **Analyse des besoins d'événements** : Analyse les descriptions et fournit des recommandations

Latence moyenne : 2-3 secondes par requête IA

## 📊 Base de données

**Modèles principaux :**
- `Users` - Utilisateurs (admin, organizer, provider)
- `Events` - Événements 
- `Venues` - Lieux d'événements
- `Bookings` - Réservations
- `Quotes` - Devis
- `Messages` - Messages entre utilisateurs
- `Notifications` - Notifications système

## 🔒 Sécurité

- Authentification JWT avec expiration
- Hachage des mots de passe avec bcrypt (12 rounds)
- Validation des entrées
- Autorisations basées sur les rôles
- CORS configuré

## 📝 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🐛 Debugging

Pour debug en mode développement :
```bash
DEBUG=* npm run dev
```

Logs disponibles :
- Requêtes SQL Sequelize
- Erreurs complètes avec stack trace
- Connexions WebSocket

## 📈 Performance

- Connexion PostgreSQL avec pool de connexions
- Pagination sur tous les endpoints de listing
- Index sur les champs de recherche fréquents
- Cache potentiel pour les recommandations IA (Redis)

---

**Développé pour EventPlanner POC - 2025**
