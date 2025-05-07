# 🚀 JSNxt-Boilerplate - Next.js + Express.js Full-Stack Boilerplate

This project is a modern full-stack web application starter built with **Next.js** for the frontend and **Express.js** for the backend. It provides a clean, scalable architecture for building production-ready applications with API routes, authentication, and database integration.

[![CI](https://github.com/shadowofleaf96/jsnxt-boilerplate/actions/workflows/main.yaml/badge.svg?branch=mySQL)](https://github.com/shadowofleaf96/jsnxt-boilerplate/actions/workflows/main.yaml)

## 📦 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose or MySQL with Sequelize
- **Authentication**: JWT-based login and registration, Google OAuth
- **API**: RESTful endpoints with Express
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom configuration
- **Internationalization**: I18n (English, French, Arabic) with dynamic locale routing
- **Form Validation**:
  - **Frontend**: Zod + React Hook Form
  - **Backend**: Joi
- **Security Middleware**: Helmet, hpp, express-useragent, express-rate-limit
- **Testing**: Jest + React Testing Library (optional setup)
- **Linting/Formatting**: ESLint + Prettier

---

## 🔧 Features

- ✅ Clean modular folder structure
  - `client/`: Next.js frontend
  - `server/`: Express.js backend
  - Well-defined separation of concerns and scalable architecture
- ✅ Next.js App Router with dynamic routing and layout support
- ✅ Full user authentication flow
  - JWT (register, login, reset password)
  - Google OAuth with secure callback and token handling
- ✅ Role-Based Access Control (RBAC)
  - Admin, User roles
  - Middleware protection on both frontend and backend
- ✅ MongoDB integration using Mongoose (default)
- ✅ MySQL integration using Sequelize (`mysql` branch)
- ✅ Protected admin dashboard and pages
- ✅ Internationalization (i18n)
  - `en`, `fr`, `ar`
  - Dynamic locale middleware that auto-redirects
  - Locale-specific content and translations stored in JSON
  - RTL support for Arabic
  - Flag icon language switcher
- ✅ Responsive UI built with Tailwind CSS
  - Mobile-first design
  - Reusable components with animation
- ✅ Environment variables managed with `.env`
- ✅ Static file handling (`public/` and `uploads/`)
- ✅ Image optimization using Next.js `<Image />` component
- ✅ Middleware handling for routing and locale detection
- ✅ ESLint and Prettier for code quality and consistency
- ✅ TypeScript types and interfaces for both frontend and backend
- ✅ Form validation
  - Frontend: Strong type-safe validation using `Zod` integrated with `React Hook Form`
  - Backend: Schema validation using `Joi` for request bodies
- ✅ Security enhancements:
  - `Helmet` for HTTP headers
  - `hpp` for HTTP parameter pollution
  - `express-useragent` for device detection
  - `express-rate-limit` for rate limiting
- ✅ Ready for deployment on:
  - **Vercel** (frontend)
  - **Railway / Render / Heroku** (backend)
  - Includes basic Dockerfile (multi-stage)

## 📁 Client Folder Structure

```bash
├── public/                 # Static assets (e.g., images, icons, fonts)
├── src/
│   ├── app/                # Application routes and layouts using Next.js App Router
│   │   ├── [locale]/       # Dynamic locale directories (e.g., en, fr, ar) containing localized pages and components
│   │   └── utils/          # Utility functions and helpers specific to routing or middleware
│   ├── components/         # Reusable UI components (e.g., buttons, forms, modals)
│   ├── redux/              # Redux store configuration, slices, and related logic
│   ├── styles/             # Global and modular styles (e.g., Tailwind CSS configurations, custom CSS files)
│   └── types/              # TypeScript type definitions and interfaces
├── .env                    # Environment variables (e.g., API keys, database URIs)
├── .gitignore              # Specifies files and directories to be ignored by Git
├── .prettierignore         # Specifies files and directories to be ignored by Prettier
├── .prettierrc.json        # Configuration file for Prettier code formatter
├── eslint.config.mjs       # ESLint configuration for linting and code quality
├── jest.config.ts          # Jest configuration for testing
├── next-env.d.ts           # TypeScript declarations for Next.js
├── next.config.ts          # Next.js configuration file
├── package-lock.json       # Automatically generated for package versions consistency
├── package.json            # Project metadata and dependencies
├── postcss.config.mjs      # Configuration for PostCSS (e.g., Tailwind CSS processing)
├── README.md               # Project overview and documentation
├── tailwind.config.js      # Tailwind CSS configuration file
└── tsconfig.json           # TypeScript compiler configuration
```

## 📁 Server Folder Structure

```bash

├── config/                 # Configuration files (e.g., database connections, environment variables)
├── controllers/            # Route handlers containing business logic for each endpoint
├── middleware/             # Custom middleware functions (e.g., authentication, error handling)
├── models/                 # Database models and schemas (e.g., Mongoose models)
├── public/                 # Publicly accessible static assets (e.g., images, CSS, JavaScript files)
├── routes/                 # API route definitions, mapping URLs to controllers
├── types/                  # TypeScript type definitions and interfaces
├── uploads/                # Directory for storing uploaded files (e.g., user uploads)
├── utils/                  # Utility functions and helper modules
├── .env                    # Environment variables (e.g., API keys, database URIs)
├── .gitignore              # Specifies files and directories to be ignored by Git
├── .prettierignore         # Specifies files and directories to be ignored by Prettier
├── .prettierrc.json        # Configuration file for Prettier code formatter
├── eslint.config.mjs       # ESLint configuration for linting and code quality
├── index.ts                # Entry point of the application, initializes and starts the Express server
├── package-lock.json       # Automatically generated for locking dependencies versions
├── package.json            # Project metadata, scripts, and dependencies
└── tsconfig.json           # TypeScript compiler configuration
```

## Quick Start

1. **Clone repository**

```bash
git clone https://github.com/yourusername/next-express-boilerplate.git
cd next-express-boilerplate
cd client && npm install && npm run dev
cd server && npm install && npm run dev
**Don't forget about env for Frontend and Backend**
```

Feel free to fork and contribute!
Made with ❤️ by Shadow Of Leaf
