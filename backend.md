# Backend Implementation Guide – EventPlanner (POC)

> This document provides sequential, unambiguous instructions for standing up the **Node.js + Express** backend described in the functional specification. Follow each step in order on your local machine.

## 0. Prerequisites

- **Node.js v18+** and **npm v10+** installed.
- **PostgreSQL 15** running locally with a super‑user account.
- A terminal capable of running *bash* commands.
- (Optional) **Postman** or **Insomnia** for ad‑hoc API testing.

## 1. Repository bootstrap

1. Open a terminal and navigate to the workspace directory you share with the front‑end team.
2. Run
   ```bash
   npx degit expressjs/express event-planner-backend (deja fait)
   cd event-planner-backend (you are already in the project directory)
   npm init -y
   ```
3. Install core runtime dependencies:
   ```bash
   npm i express pg sequelize sequelize-cli bcrypt jsonwebtoken dotenv cors socket.io \
        @socket.io/redis-adapter openai uuid
   ```
4. Install development helpers:
   ```bash
   npm i -D nodemon
   ```
5. Add a `dev` script in **package.json**:
   ```json
   "scripts": {
     "dev": "nodemon src/index.js"
   }
   ```

## 2. Project structure

Create the following tree under **event-planner-backend/** (the *mkdir -p* command will create nested folders):

```bash
mkdir -p src/{config,models,migrations,seeders,routes,controllers,services,middlewares,sockets,utils}
touch src/index.js
```

## 3. Environment variables

Create **.env** at the repo root:

```
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://<user>:<password>@localhost:5432/event_planner
JWT_SECRET=supersecret
JWT_EXPIRES=1d
OPENAI_API_KEY=<your_openai_key>
```

**Never** commit this file.

## 4. Database schema and migrations

1. Initialise Sequelize:
   ```bash
   npx sequelize-cli init
   ```
2. Drop the default `config/config.json` and replace it with **src/config/database.js** that reads from `process.env.DATABASE_URL`.
3. Use the models described in §4 “Modèle de données” of the specificationfileciteturn1file6. Create a migration for **each** table (`Users`, `Events`, `Venues`, `Bookings`, `Quotes`, `Messages`, `Notifications`).
4. Run
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   ```

## 5. Core middleware

In **src/middlewares/**

- **auth.js** – verifies JWT and attaches `req.user`.
- **validate.js** – lightweight payload validator using `express-validator` (optional).
- **errorHandler.js** – central error formatter (send `{ status, message }`).

## 6. Feature modules (implement *in the order below*)

For every module create **route**, **controller**, **service**, **model** as needed.

| # | Module        | Routes (prefix /api)                                                    | Notes                                                                      |
| - | ------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1 | Auth          | `/auth/register`, `/auth/login`, `/auth/refresh-token`                  | Hash password with bcrypt, issue JWT; follow spec 5.1fileciteturn1file2 |
| 2 | Users         | `/users/profile`, `/users/upload-avatar`, `/users/notifications`        | Avatar to local `/uploads/`; skip email for POC                            |
| 3 | Events        | `/events` CRUD                                                          | Link `organizer_id` FK                                                     |
| 4 | Venues        | `/venues` CRUD + `/venues/search`                                       | Simple `ILIKE` search                                                      |
| 5 | AI            | `/ai/analyze-requirements`, `/ai/recommendations`, `/ai/generate-quote` | OpenAI GPT‑4o‑mini: ranks venues & crafts quotes                           |
| 6 | Quotes        | `/quotes` CRUD + actions `/accept`,`/reject`,`/negotiate`               |                                                                            |
| 7 | Bookings      | `/bookings` CRUD + `/bookings/:id/contract`                             | For POC, generate dummy PDF via `pdfkit` (optional)                        |
| 8 | Messages      | `/messages` (list & post) + WebSocket channel `chat:<conversationId>`   |                                                                            |
| 9 | Notifications | handled via WebSocket `notification:<userId>`                           |                                                                            |

Each controller should call a service file that does DB work via Sequelize.

## 7. Real‑time communication

1. In **src/index.js** initialise `http` + `socket.io`.
2. On connection, authenticate the socket with the client’s JWT.
3. Wire namespaces:
   - `/chat` – bidirectional messages
   - `/notifications` – one‑way pushes

## 8. AI service powered by OpenAI

1. **Install the SDK** (already added in dependencies).
2. **Client wrapper** – create **src/utils/openaiClient.js**:
   ```js
   import OpenAI from 'openai';
   export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   ```
3. **Service logic** – replace **src/services/aiService.js**:
   ```js
   import { openai } from '../utils/openaiClient.js';
   import db from '../models/index.js';
   import { Op } from 'sequelize';

   // 8.1 Venue recommendations
   export async function recommendVenues ({ guestCount, budgetMin, budgetMax }) {
     // Fetch up to 10 matching venues
     const candidates = await db.Venue.findAll({
       where: { capacity: { [Op.gte]: guestCount } },
       order: [['price_per_day', 'ASC']],
       limit: 10,
     });

     // Build prompt for GPT‑4o‑mini
     const system = 'You are an expert event‑planning assistant. Return the 3 most suitable venues as a JSON array of their IDs only.';
     const user = `Guest count: ${guestCount}
   ```

Budget: \${budgetMin}-\${budgetMax} Venues: \${candidates.map(v => `${v.id}:${v.name} (cap ${v.capacity}, $${v.price_per_day}/day)`).join('; ')}\`;

```
 const completion = await openai.chat.completions.create({
   model: 'gpt-4o-mini',
   messages: [
     { role: 'system', content: system },
     { role: 'user', content: user }
   ],
   temperature: 0.2,
   max_tokens: 128,
 });

 let orderedIds;
 try {
   orderedIds = JSON.parse(completion.choices[0].message.content);
 } catch (e) {
   orderedIds = candidates.slice(0, 3).map(v => v.id); // Fallback
 }
 return db.Venue.findAll({ where: { id: orderedIds.slice(0, 3) } });
```

}

// 8.2 Quote generation export async function generateQuote ({ venueId, eventId }) { const venue = await db.Venue.findByPk(venueId); const event = await db.Event.findByPk(eventId);

```
 const system = 'You are an AI that drafts short JSON quotes for events.';
 const user = `Prepare a breakdown for event \"${event.name}\" on ${event.date} at venue \"${venue.name}\" ($${venue.price_per_day}/day). Output fields: items[], subtotal, vat (15%), total.`;

 const completion = await openai.chat.completions.create({
   model: 'gpt-4o-mini',
   messages: [
     { role: 'system', content: system },
     { role: 'user', content: user }
   ],
   temperature: 0.1,
   max_tokens: 256,
 });

 return JSON.parse(completion.choices[0].message.content);
```

}

````
4. **Controller wiring** – in **src/controllers/aiController.js**:
```js
import { recommendVenues, generateQuote } from '../services/aiService.js';

export const getRecommendations = async (req, res, next) => {
  const { guestCount, budgetMin, budgetMax } = req.body;
  try {
    const venues = await recommendVenues({ guestCount, budgetMin, budgetMax });
    res.json(venues);
  } catch (err) { next(err); }
};

export const postQuote = async (req, res, next) => {
  const { venueId, eventId } = req.body;
  try {
    const quote = await generateQuote({ venueId, eventId });
    res.json(quote);
  } catch (err) { next(err); }
};
````

5. **Routes** – update **src/routes/ai.js**:
   ```js
   import express from 'express';
   import { getRecommendations, postQuote } from '../controllers/aiController.js';
   const router = express.Router();
   router.post('/recommendations', getRecommendations);
   router.post('/generate-quote', postQuote);
   export default router;
   ```
6. **Integration latency** averages **2‑3 s**. Consider caching by event‑hash in Redis for high volume.

## 9. Seeding script Seeding script

Add **src/seeders/demo-data.js** that inserts:

- 1 admin, 1 organizer, 1 provider
- 5 sample venues

Run with `node src/seeders/demo-data.js`.

## 10. Run the server

```bash
npm run dev
```

The API is now live at `http://localhost:4000/api`.


