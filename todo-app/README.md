# Todo App (Express + SQLite)

Simple CRUD to-do app using an Express backend and SQLite persistence.

## Setup

1. Install dependencies:

   npm install

2. Start the server:

   npm start

3. Open http://localhost:3000 in your browser

## API

- GET /api/todos
- GET /api/todos/:id
- POST /api/todos { title, description?, due_date? }
- PUT /api/todos/:id { title, description, done, due_date }
- DELETE /api/todos/:id


This project serves a minimal static frontend from `public/` for convenience.