# Next.js + MongoDB Full-Stack Blog Platform

A modern full-stack blogging platform built with **Next.js (App Router)**, **React**, **Mongoose**, and **MongoDB**. Designed with an original dark & warm-paper theme, responsive layout, account authentication, and author-based CRUD permissions.

---

## ⚡ Features

### Core Capabilities
- **Browse & Read Posts:** Responsive grid view of all published articles with real-time tag filtering and search.
- **Account System:** Secure user registration and login using salted `bcryptjs` password hashing and signed JWT session tokens stored in HTTP-only cookies.
- **Authorized Post CRUD:**
  - Create new posts with titles, custom excerpts, cover images, tags, and content.
  - Authors have sole permission to edit or delete their own posts.
  - Server-side route handler verification ensures unauthorized users cannot modify or delete posts.
- **About Page:** Overview of system architecture, technology choices, and design implementation.

### Extended Features ("Ideas to Take It Further")
1. **Real-Time Search & Tag Filtering:** Search across post titles, excerpts, and body text with instant client-side query parameters and dynamic tag chips.
2. **Interactive Likes Counter:** Optimistic UI updates with atomic MongoDB `$inc` updates to handle concurrent likes.
3. **Discussion & Comments System:** Readers can leave comments under each post, stored in a relational Mongoose schema linked by post ID.
4. **Dark / Light Mode Theme:** Handcrafted dual theme switcher with custom CSS properties and `localStorage` persistence.
5. **SEO-Friendly Slugs & Reading Time:** Auto-generated clean URL slugs (`/posts/[slug]`) and algorithmic reading time estimation (`X min read`).
6. **Custom Assets & 404:** Custom SVG lightning favicon and styled 404 error page.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Frontend:** [React 18](https://react.dev/), TypeScript, Custom CSS Variables
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Security & Auth:** `bcryptjs`, `jsonwebtoken`, HTTP-only cookies

---

## 📋 Prerequisites

Before running the project locally, make sure you have:
- **Node.js:** v18.17.0 or higher (v20+ recommended)
- **npm:** v9 or higher
- **MongoDB Database:** Either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI or a local MongoDB service (`mongodb://localhost:27017/blog_db`).

---

## 🚀 Quickstart: Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/dakshesh123-rgb/nextjs-blog.git
cd nextjs-blog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and provide your MongoDB connection string and a random JWT secret:
```env
# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/blog_db?retryWrites=true&w=majority

# JWT Secret for cookie signing (min 32 characters recommended)
JWT_SECRET=replace_with_a_long_random_secret_key_1234567890

# Optional app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** `.env.local` is listed in `.gitignore` and is never committed to Git. Keep your real database credentials secure.

### 4. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗 Building for Production

To test the production build locally:

```bash
npm run build
npm run start
```

The optimized server will start at `http://localhost:3000`.

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/           # Login, Register, Logout, Me endpoints
│   │   └── posts/          # Posts CRUD, [slug] router, likes & comments
│   ├── about/              # About page (/about)
│   ├── login/              # Login form (/login)
│   ├── register/           # Register form (/register)
│   ├── posts/
│   │   ├── new/            # Create post form (/posts/new)
│   │   └── [slug]/
│   │       ├── page.tsx    # Single post reader (/posts/[slug])
│   │       └── edit/       # Edit post form (/posts/[slug]/edit)
│   ├── globals.css         # Theme styles & variables
│   ├── layout.tsx          # Root layout with Navbar & Footer
│   ├── not-found.tsx       # Custom 404 page
│   └── page.tsx            # Homepage with posts feed & search
├── components/
│   ├── CommentSection.tsx  # Post comments thread & submission
│   ├── Footer.tsx          # Site footer
│   ├── LikeButton.tsx      # Like counter with optimistic updates
│   ├── Navbar.tsx          # Sticky navigation & auth state
│   ├── SearchBar.tsx       # Search input & tag filter chips
│   └── ThemeToggle.tsx     # Dark/Light mode switcher
├── lib/
│   ├── auth.ts             # Password hashing & JWT helpers
│   └── mongodb.ts          # Cached Mongoose connection helper
├── models/
│   ├── Comment.ts          # Mongoose Comment model
│   ├── Post.ts             # Mongoose Post model with slug generator
│   └── User.ts             # Mongoose User model
├── public/
│   └── favicon.svg         # Custom SVG favicon
├── .env.example            # Template for environment variables
├── package.json
└── tsconfig.json
```

---

## 🔒 Security Best Practices

- **Zero Secrets in Git:** Sensitive keys and connection strings reside exclusively in local environment files (`.env.local`).
- **HTTP-Only Cookies:** Tokens are stored in `HttpOnly; SameSite=Lax` cookies, protecting sessions against cross-site scripting (XSS) extraction.
- **Server-Side Authorization:** Every `PUT` and `DELETE` operation verifies the request token and checks that `post.author === token.id` before executing the database query.
- **Password Protection:** Passwords are hashed with bcrypt (salt factor 10) before saving to MongoDB and never returned in user queries.
