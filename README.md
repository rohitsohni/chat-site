# Chat Site

Full-stack real-time chat application with authentication, profile management, online presence, image uploads, and one-to-one messaging.

## Live Demo

[Open Chat Site](https://client-gilt-rho.vercel.app)

## Project Highlights

- Built a React/Vite single-page application with protected chat, login, signup, and profile flows.
- Implemented a Node.js/Express API with MongoDB models for users and messages.
- Added JWT authentication and middleware-protected API routes.
- Integrated Socket.IO for live message delivery and online-user status.
- Added Cloudinary-backed profile and message image uploads.
- Included polling fallbacks for users, messages, and presence so the UI stays current after reconnects.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Media | Cloudinary |
| Deployment | Vercel |

## Folder Structure

```text
client/
  context/          Auth and chat state providers
  src/
    components/     Chat window, sidebar, and profile UI
    pages/          Home, login, and profile pages
    assets/         Images, icons, and demo profile data
server/
  controllers/      Auth, profile, user, and message handlers
  lib/              Database, Cloudinary, and socket helpers
  middleware/       JWT authentication middleware
  models/           Mongoose schemas for users and messages
  routes/           Express route definitions
```

## Main Features

- User registration, login, logout, and profile update
- One-to-one chat with live message delivery
- Online-user presence indicator
- Unseen message counts in the sidebar
- Image support in profiles and messages
- Responsive chat layout for desktop and mobile

## Local Setup

Clone the repository and install dependencies for both apps:

```bash
cd client
npm install

cd ../server
npm install
```

Create local environment files from the examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Set the required environment variables:

```text
client/.env
VITE_BACKEND_URL=http://localhost:5000

server/.env
PORT=5000
JWT_SECRET=replace-with-a-strong-secret
MONGODB_URI=mongodb://localhost:27017
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

Run the backend:

```bash
cd server
npm run server
```

Run the frontend in another terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Available Scripts

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
npm run server
npm start
```

## Interview Notes

- `client/context/AuthContext.jsx` manages authentication, token storage, Socket.IO connection setup, and online presence refresh.
- `client/context/ChatContext.jsx` manages selected conversations, messages, unseen counts, live subscriptions, and polling fallbacks.
- `server/server.js` wires Express, Socket.IO, CORS, routes, and the MongoDB connection.
- `server/controllers/messageController.js` handles message retrieval, sending, seen status, and image upload payloads.
- `server/middleware/auth.js` protects private API routes by validating JWT tokens.
