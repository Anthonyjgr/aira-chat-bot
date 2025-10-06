Perfect — here’s your **fully formatted, GitHub-ready README.md**, upgraded for visual polish, branding impact, and senior-level presentation 👇

---

<h1 align="center">🤖 Aira Chat Bot</h1>

<p align="center">
  <em>A modern AI chat assistant prototype built with Domain-Driven Architecture, React, TypeScript, and Zustand.</em>
</p>

<p align="center">
  <a href="https://airachatbot-eta.vercel.app/" target="_blank"><b>🌐 Live Demo</b></a> •
  <a href="https://github.com/Anthonyjgr/aira-chat-bot" target="_blank"><b>💻 GitHub Repository</b></a>
</p>

---

## 🧠 Overview

**Aira** is a conversational AI assistant simulation designed as a real-world, production-grade prototype — not just a coding challenge.
It demonstrates robust architecture, thoughtful UX, realistic error handling, and clean scalability principles under a **Domain-Driven Design (DDD)** approach.

> 🧩 The result: a cohesive, well-typed, resilient system that feels like a real product.

---

## ✨ Key Features

### 💬 Conversations & Messaging

* Load, create, and update conversations using a fully typed mock API
* Send and receive messages (AI simulated via `mockApi.simulateAIResponse`)
* Auto-scroll to the latest message
* Smooth “typing” indicator while waiting for AI response
* Retry failed AI responses inline

### ⚡ Error Handling & Resilience

* 10 % simulated API failure rate with intelligent retries
* Full-screen modals for recoverable errors
* Retry buttons for both **conversations** and **messages**
* Toast notifications for transient failures

### 🧱 Architecture & TypeScript

* Domain-Driven folder structure (`auth`, `chat`, `conversations`, `ui`)
* Strongly typed stores, props, and responses
* TypeScript-based `mockApi` with realistic delay and error simulation
* Path aliases (`@/`) via Vite + TS configuration

### 🎨 UI & UX

* Clean, responsive interface (desktop ↔ mobile)
* Sidebar drawer on mobile (WhatsApp-style)
* Dark / light theme toggle with persistence
* 3D integration via **Spline**
* Smooth motion animations with **Framer Motion**

### 🔒 Authentication

* Login / Register with mock backend
* Protected routes (`/dashboard`, `/chat/:id`, `/profile`)
* Session persistence and auto-recovery

### 🧰 Developer Experience

* Modular hooks: `useAIResponse`, `useSendMessage`, `useUIStore`
* Centralized stores with **Zustand**
* Full mock typing and reusable domain services

---

## 🧩 Extras

* Modern landing page introducing the Aira product
* Responsive loader screens and “empty state” placeholders
* Toast notifications for every critical interaction
* Elegant Framer Motion transitions between states

---

## ⚙️ Tech Stack

| Category         | Technology                            |
| ---------------- | ------------------------------------- |
| Framework        | **React 19 + TypeScript**             |
| Bundler          | **Vite 7**                            |
| State Management | **Zustand 5**                         |
| Styling          | **Tailwind CSS 4.1 + Vite Plugin**    |
| Routing          | **React Router 7.9**                  |
| UI / Icons       | **Lucide React 0.544**                |
| Animations       | **Framer Motion ( motion 12 )**       |
| Notifications    | **React Toastify 11**                 |
| 3D Integration   | **@splinetool/react-spline 4.1**      |
| Utilities        | **NanoID 5**, **TypeScript 5.9**      |
| Linting          | **ESLint 9 + TypeScript-ESLint 8.45** |
| Deployment       | **Vercel**                            |

---

## 🧠 Architectural Decisions

### Domain-Driven Design (DDD)

Each feature is self-contained within its **domain** (`auth`, `chat`, `conversations`, `ui`), holding its own:

* Components
* Zustand store
* Hooks
* Types & services

This separation improves scalability, readability, and team onboarding.

### Refactored Mock API

The mock backend was rewritten and fully typed:

* Added stricter token validation (`isValidToken`)
* Added `updateConversation` endpoint
* Enhanced typing for `User`, `Conversation`, `Message`
* Introduced consistent error simulation for resilience testing

### 🧩 Design Decision — `updateConversation`

A dedicated endpoint was introduced instead of reusing `updateProfile`:

1. **RESTful consistency** — avoids mixing user & conversation resources
2. **Maintainability** — isolates logic for easier scaling
3. **Clarity** — explicit intent for collaborators
4. **Real-world alignment** — mimics production PATCH `/conversations/:id`

> ✅ Prioritized architectural integrity and long-term maintainability over quick implementation.

---

## 🧠 Product Thinking

This challenge was approached like a **real product cycle**:

* Built a minimal **brand identity** (`Aira`)
* Designed a modern **landing page** to set context
* Ensured **UX consistency** across mobile & desktop
* Balanced code quality, architecture, and visual polish

> 💡 *The goal wasn’t just to “make it work,” but to make it feel real.*

---

## 🧰 Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/Anthonyjgr/aira-chat-bot.git
cd aira-chat-bot

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌐 Deployment

* **Live App:** [https://airachatbot-eta.vercel.app/](https://airachatbot-eta.vercel.app/)
* **Public Repo:** [https://github.com/Anthonyjgr/aira-chat-bot](https://github.com/Anthonyjgr/aira-chat-bot)

---

## 🔭 Future Enhancements

* [ ] Skeleton / spinner loading states
* [ ] ESLint + Prettier unified config
* [ ] Unit / integration tests for stores and mock API

---

## 👨‍💻 Author

**Anthony Guzmán R.**
Full Stack Developer | Product-Oriented Engineer | CTO @ JDigital Group Solutions
📧 [anthonyjgr28@gmail.com](mailto:anthonyjgr28@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/anthony-guzman-840449135/)
🔗 [GitHub](https://github.com/Anthonyjgr)

---

<p align="center">Made with ❤️, architecture, and attention to detail.</p>

---

Would you like me to include a **header banner image** (with your Aira avatar + brand color background) at the top of the README for GitHub display? It would make the repo presentation look more like a polished product page.
