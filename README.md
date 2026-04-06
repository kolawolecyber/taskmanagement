# 🧠 Task Management System (Frontend)

## 📌 Overview

This is the frontend of a real-time Task Management System built using React (Vite) and Tailwind CSS.
It provides a clean and responsive interface for managing tasks, with real-time updates powered by WebSockets.

The application integrates with a secure backend API and demonstrates modern frontend engineering practices including state management, API abstraction, and authentication handling.

---

## 🚀 Features

* 🔐 User Authentication (Login & Register)
* 📋 Task Dashboard (View all tasks)
* ➕ Create Task
* ✏️ Update Task Status
* ❌ Delete Task
* 🔍 Filter Tasks (by status and assignee)
* ⚡ Real-time Updates (Socket.io)
* ⏳ Loading and Error States
* 📱 Responsive UI (Tailwind CSS)

---

## 🏗️ Tech Stack

* React (Vite)
* TypeScript
* Tailwind CSS (v4)
* Axios (API communication)
* Socket.io Client (real-time updates)
* React Router (navigation)

---

## 📁 Project Structure

```
src/
 ├── api/              # API abstraction layer
 ├── components/       # Reusable UI components
 ├── pages/            # Route pages (Dashboard, Login, Register)
 ├── socket/           # WebSocket configuration
 ├── App.tsx           # App entry and routing
```

---

## 🔐 Authentication Flow

* JWT token is stored in localStorage after login
* Axios interceptor attaches token to every request
* Protected routes restrict access to authenticated users only
* Automatic logout on invalid/expired token

---

## 🔄 Real-Time Architecture

* Socket connection is established only after successful login
* Listens for:

  * `taskCreated`
  * `taskUpdated`
  * `taskDeleted`
* UI updates instantly without manual refresh

---

## ⚙️ Setup Instructions

### 1. Clone repository

```
git clone <repo-url>
cd frontend
```

### 2. Install dependencies

```
npm install
```

### 3. Run development server

```
npm run dev
```

---

## 🌐 Environment Configuration

Ensure backend is running at:

```
http://localhost:5000
```

Update API base URL if needed in:

```
src/api/axios.ts
```

---

## ⚠️ Challenges & Engineering Decisions

### 1. Authentication State Consistency

One major challenge was handling authentication state across page reloads and API requests.

**Solution:**

* Centralized token handling using Axios interceptors
* Protected route abstraction to prevent unauthorized access
* Defensive checks to avoid undefined or invalid tokens

---

### 2. Real-Time Synchronization

Ensuring UI stays in sync with backend without excessive API calls.

**Solution:**

* Implemented Socket.io listeners for task events
* Triggered selective data refetch instead of full reload
* Controlled socket lifecycle (connect only after login)

---

### 3. Preventing UI Race Conditions

Rapid user actions (e.g., multiple clicks) could cause inconsistent state.

**Solution:**

* Disabled action buttons during API calls
* Introduced loading states per action

---

### 4. API Abstraction & Separation of Concerns

Avoiding tightly coupled UI and API logic.

**Solution:**

* Created a dedicated API layer
* Reused API functions across components
* Improved maintainability and readability

---

### 5. Handling Strict TypeScript Constraints

Dealing with `undefined` values and strict typing from API responses.

**Solution:**

* Implemented DTO mapping before API calls
* Ensured safe data handling across components

---

## 🧪 Future Improvements (Within Scope Awareness)

* Better user selection UI instead of manual ID input
* Pagination for large task lists
* Token refresh mechanism

---

## 👨‍💻 Author

Built as part of a full-stack engineering assessment focusing on clean architecture, security, and real-time systems.
