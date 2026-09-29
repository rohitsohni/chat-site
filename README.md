<div align="center">
  <h1>Chat Site</h1>
  <h3>A full-stack real-time messaging platform with authentication, online presence, profiles, and image sharing.</h3>
  <a href="https://client-gilt-rho.vercel.app">
    <img height="42" src="https://img.shields.io/badge/Open_Site-2563EB?style=for-the-badge" alt="Open Site" />
  </a>
  <br><br>
  <img width="1280" height="720" alt="Chat Site signup screen" src="https://github.com/user-attachments/assets/cffd3747-696b-4802-9f00-ffd586dc05f9" />
</div>

## Project overview

This is a full-stack real-time chat website where users can create accounts, manage profiles, see who is online, and exchange text or image messages.

There are two parts:

```text
client -> frontend
server -> backend
```

## Technologies

### Frontend

- React - builds the interface
- Tailwind CSS - styling
- React Router - page navigation
- Axios - sends requests to the backend
- Context API - stores authentication and chat data
- Socket.IO Client - receives real-time events
- React Hot Toast - notifications
- Vite - runs and builds the frontend

### Backend

- Node.js and Express - API server
- MongoDB - database
- Mongoose - works with MongoDB
- JWT - login authentication
- bcryptjs - password security
- Socket.IO - real-time message delivery and online presence
- Cloudinary - stores profile pictures and chat images

## User features

A user can:

- Register and log in
- Update their name, biography, and profile picture
- View all other users in the sidebar
- See online users and last-seen information
- Search for a conversation
- Send and receive text messages
- Send and receive image messages
- View unread-message counts
- See when messages have been read
- Review shared images in the conversation panel
- Log out

## Frontend structure

```text
App.jsx -> controls routes and protected pages
AuthContext.jsx -> stores the user, token, socket, and online users
ChatContext.jsx -> stores conversations, messages, and unread counts
pages/ -> complete website pages
components/ -> reusable chat interface pieces
assets/ -> icons, backgrounds, and fallback images
index.css -> global styling
```

Important pages:

```text
LoginPage -> registration and login
HomePage -> main messaging screen
ProfilePage -> profile editing
```

Important components:

```text
Sidebar -> users, search, and unread counts
ChatContainer -> messages and message composer
RightSidebar -> selected-user details and shared images
```

## Backend structure

```text
server.js -> starts Express, connects Socket.IO, and registers routes
routes/ -> defines authentication and message API URLs
controllers/ -> contains user and message logic
models/ -> defines user and message database structure
middleware/ -> verifies JWT tokens
lib/ -> MongoDB, Cloudinary, and token helpers
```

## Database models

### User

Stores:

```text
email
full name
hashed password
profile picture
biography
last seen time
```

### Message

Stores:

```text
sender
receiver
text
image URL
seen status
created and updated times
```

## Main project flow

```text
User performs an action in React
|
v
Axios sends an authenticated request
|
v
Express route receives it
|
v
JWT middleware identifies the user
|
v
Controller reads or updates MongoDB
|
v
Socket.IO emits live events when needed
|
v
React updates the chat screen
```

## Authentication

When a user registers, bcryptjs hashes the password before MongoDB stores it.

When the user logs in, the backend returns a JWT token. The frontend stores it in localStorage and adds it to protected Axios requests.

The authentication middleware verifies the token and attaches the matching user to the request.

## Messaging logic

The backend:

- Loads every user except the signed-in user
- Counts unread messages for the sidebar
- Loads both directions of a selected conversation
- Marks received messages as seen
- Uploads attached images to Cloudinary
- Stores each message in MongoDB
- Emits new messages to the receiver through Socket.IO

The frontend also refreshes users and active conversations on short intervals so the interface stays current when a socket reconnects or a serverless deployment cannot keep a persistent connection.

## Online presence

Socket.IO maps each connected user ID to a socket ID and broadcasts the current online-user list.

The frontend also sends a presence update every 15 seconds. Users active within the recent presence window are treated as online.

## Image handling

Profile pictures and message images are sent as encoded image data. Cloudinary stores the uploaded files and returns secure image URLs. MongoDB stores those URLs instead of the complete image files.

## Shared state

`AuthContext.jsx` shares:

```text
logged-in user
JWT token
Axios instance
Socket.IO connection
online users
login, logout, and profile functions
```

`ChatContext.jsx` shares:

```text
users
selected user
messages
unread-message counts
message loading and sending functions
```

## Deployment

The frontend and backend are configured for separate Vercel deployments.

Environment variables contain:

- MongoDB connection
- JWT secret
- Cloudinary credentials
- Frontend backend URL

The GitHub workflow checks the frontend build and linting plus backend dependency installation when code is pushed.
