# 🚀 Next.js + Express.js Full-Stack Boilerplate

This project is a modern full-stack web application starter built with **Next.js** for the frontend and **Express.js** for the backend. It provides a clean, scalable architecture for building production-ready applications with API routes, authentication, and database integration.

## 📦 Tech Stack

- **Frontend**: Next.js 15 (App Router), React
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based login and Registration, OAuth(Soon)
- **API**: RESTful endpoints with Express
- **State Management**: Redux
- **Styling**: Tailwind CSS

## 🔧 Features

- ✅ Clean folder structure (frontend in `client/`, backend in `server/`)
- ✅ Full user authentication flow (register/login with JWT)
- ✅ MongoDB integration using Mongoose
- ✅ Protected routes and dashboard logic
- ✅ Environment variable management with `.env`
- ✅ Eslint + Prettier config included
- ✅ Ready for deployment on Vercel / Railway / Render

## 📁 Folder Structure
```bash
├── app/
│   ├── pages/              # Next.js pages and API routes
│   ├── components/         # Reusable components (e.g., buttons, forms)
│   ├── styles/             # Tailwind CSS custom configurations and global styles
│   └── public/             # Static assets (e.g., images, icons)
├── server/
│   ├── controllers/        # Express.js controllers for API logic
│   ├── models/             # Mongoose models for MongoDB
│   ├── routes/             # Express.js API routes
│   ├── middleware/         # Authentication and other middleware functions
│   └── server.js           # Express.js server setup
├── .env                    # Environment variables (e.g., MongoDB URI, JWT secret)
├── .gitignore              # Files to ignore in git
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
```

## Quick Start

1. **Clone repository**
```bash
git clone https://github.com/yourusername/next-express-boilerplate.git
cd next-express-boilerplate
npm install
cd server && npm install && cd ..
cp .env.example .env
npm run dev
```
