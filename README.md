# 🔍 Lost & Found — Campus Item Directory

> A full-stack MERN application designed for college campuses where students can report and discover lost or found items in one centralized, searchable place—eliminating the clutter of WhatsApp and social media groups.

---

## 📌 Project Overview

When students lose an item (such as an ID card, keys, notebook, or water bottle) and post it to a group chat, the message quickly gets buried under hundreds of texts. **Lost & Found** provides a dedicated, structured directory where:
- **Someone who lost an item** can browse items others have found before reporting theirs.
- **Someone who found an item** can browse items reported lost to identify and call the owner immediately.
- **Posters can manage listings**: update details, delete posts, or mark items as **Returned** with a single click.

---

## 🎨 Minimalist Design Philosophy

The user interface follows a modern, **distraction-free monochromatic aesthetic**:
- **Canvas & Typography**: Refined shades of grey (`#f9fafb`, `bg-neutral-50`, `bg-white`) paired with crisp charcoal and black typography (`text-neutral-900`, `text-neutral-500`).
- **Laser-Focused Actions ("One Page, One Work")**: Zero clutter, no overwhelming multi-column widgets or noisy gradients. Every screen is purpose-built for its exact job.
- **Color Accent Rules**:
  - 🔴 **Red (`bg-red-600`)**: Reserved for **Lost** items, tags, and reporting triggers.
  - 🟢 **Green (`bg-emerald-600`)**: Reserved for **Found** items, tags, and reporting triggers.
  - 🟡 **Gold (`bg-amber-500` / `text-amber-800`)**: Reserved for **Mark as Returned** action and the **Returned** status badge.

---

## 🗺️ 5-Screen User Flow

Following the project specification, the platform operates across 5 key screens:

```
Screen 1: Landing / Directory (/)
        │
        ├──> Screen 2: Login / Register (/login, /register)
        │           │
        │           ▼
        └──> Screen 3: Choice Page (/choice)
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
Screen 4: Lost Flow (/lost)    Screen 5: Found Flow (/found)
• Shows FOUND items first      • Shows LOST items first
• Spot immediate match?        • Spot owner's post? Call them!
• No match? Click:             • No match? Click:
  [+ Post Lost Item] (Red)       [+ Post Found Item] (Green)
```

1. **Screen 1 — Landing Directory (`/`)**: Overview with quick search, category filters, and immediate buttons to jump into the Lost or Found flow.
2. **Screen 2 — Login / Register (`/login`, `/register`)**: Minimalist auth forms with JWT token issuance; automatically redirects authenticated users directly to the Choice page.
3. **Screen 3 — Choice Page (`/choice`)**: Features **Two Big Buttons**:
   - 🔴 **"I Lost Something"** → Leads to Screen 4.
   - 🟢 **"I Found Something"** → Leads to Screen 5.
4. **Screen 4 — Lost Page (`/lost`)**:
   - Queries and displays all **Found items** (`type=found`) so the user can check if their item was already turned in.
   - Includes a red **`+ Post Lost Item`** button linking to the upload form prefilled to `type=lost`.
5. **Screen 5 — Found Page (`/found`)**:
   - Queries and displays all **Lost items** (`type=lost`) so the finder can spot if an owner posted searching for it and reach out.
   - Includes a green **`+ Post Found Item`** button linking to the upload form prefilled to `type=found`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS v4, Axios |
| **Backend** | Node.js, Express.js (v5) |
| **Database** | MongoDB Atlas with Mongoose (v9) |
| **Image Storage** | Cloudinary via `multer` and `multer-storage-cloudinary` |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), password hashing with `bcryptjs` |

---

## 👥 Team Roles & Responsibilities

| Member | Role | Deliverables |
| :--- | :--- | :--- |
| **Harsha Vardhini** | **Person 1: Auth & App Layout** | Git repository structure, User database model, JWT authentication routes (`POST /register`, `POST /login`, `GET /me`), auth verification middleware, React `AuthContext`, `ProtectedRoute`, and Login/Register pages. |
| **Manaswini** | **Person 2: Items & Core Feed** | Item database model, Cloudinary integration, item submission route (`POST /api/items`) with image uploading, Directory feed (`GET /api/items`) with search & category filtering, and Item Detail page (`GET /api/items/:id`). |
| **Ramana Yamini** | **Person 3: Owner Actions & Deployment** | Owner management APIs (`GET /api/items/mine`, `PUT /api/items/:id`, `DELETE /api/items/:id`, `PATCH /api/items/:id/returned`), My Posts dashboard, shared `StatusBadge` component, and MongoDB Atlas configuration. |

---

## 🗄️ Database Schemas

### User Schema (`server/models/User.js`)
```javascript
{
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true }, // Hashed with bcryptjs (salt 10)
  phone:     { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}
```

### Item Schema (`server/models/Item.js`)
```javascript
{
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category:    { type: String, required: true, enum: ['Bottle', 'ID Card', 'Phone', 'Books', 'Keys', 'Other'] },
  type:        { type: String, required: true, enum: ['lost', 'found'], lowercase: true },
  location:    { type: String, default: '' },
  date:        { type: Date, default: Date.now },
  imageUrl:    { type: String, default: '' }, // Cloudinary hosted secure URL
  contact:     { type: String, default: '' },
  status:      { type: String, enum: ['open', 'returned'], default: 'open' },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:   { type: Date, default: Date.now } // timestamps: true
}
```

---

## 🚀 API Route Specification

All endpoints are prefixed under `/api`.

| Method | Endpoint | Auth Required | Description | Owner |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register new user account; returns JWT token + user object | Person 1 |
| `POST` | `/api/auth/login` | No | Verify credentials; returns JWT token + user object | Person 1 |
| `GET` | `/api/auth/me` | **Yes** | Validate session token and return user profile | Person 1 |
| `POST` | `/api/items` | **Yes** | Post a new item with photo upload (`multipart/form-data`) | Person 2 |
| `GET` | `/api/items` | No | Fetch items with query filters (`?type=`, `?category=`, `?search=`) | Person 2 |
| `GET` | `/api/items/:id` | No | Fetch item details with populated `postedBy` name & contact | Person 2 |
| `GET` | `/api/items/mine` | **Yes** | Fetch all items posted by the logged-in user | Person 3 |
| `PUT` | `/api/items/:id` | **Yes** | Update item attributes (verified poster only, returns 403 otherwise) | Person 3 |
| `DELETE` | `/api/items/:id` | **Yes** | Delete item (verified poster only, returns 403 otherwise) | Person 3 |
| `PATCH` | `/api/items/:id/returned` | **Yes** | Mark item status as `returned` (verified poster only) | Person 3 |

> **Note**: In `server/server.js`, `routes/owner.js` is mounted before `routes/items.js` so `/api/items/mine` resolves without colliding with `/:id`.

---

## 📁 Repository Structure

```
lost_and_found/
├── .gitignore
├── README.md
│
├── client/
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   └── src/
│       ├── api/
│       │   └── axios.js               # Centralized Axios client with Bearer auth interceptor
│       ├── components/
│       │   ├── Filters.jsx            # Minimalist search, category & type pills
│       │   ├── ItemCard.jsx           # Clean card with image, title, location & date
│       │   ├── Navbar.jsx             # Sleek dark header with brand and navigation
│       │   ├── ProtectedRoute.jsx     # Route guard redirecting unauthenticated users
│       │   └── StatusBadge.jsx        # Badges for Lost (Red), Found (Green), Returned (Gold)
│       ├── context/
│       │   └── AuthContext.jsx        # User state, token persistence, login/logout methods
│       ├── pages/
│       │   ├── Choice.jsx             # Screen 3: Two Big Buttons (I Lost / I Found)
│       │   ├── FoundPage.jsx          # Screen 5: Lost items grid + '+ Post Found Item'
│       │   ├── Home.jsx               # Screen 1: Directory overview with search & filters
│       │   ├── ItemDetail.jsx         # Full-width photo, item details & direct contact
│       │   ├── Login.jsx              # Minimalist sign-in form -> navigates to /choice
│       │   ├── LostPage.jsx           # Screen 4: Found items grid + '+ Post Lost Item'
│       │   ├── MyPosts.jsx            # Screen 6: Owner dashboard with Gold 'Mark Returned'
│       │   ├── PostItem.jsx           # Clean upload form with Lost/Found toggle
│       │   └── Register.jsx           # Account creation form -> navigates to /choice
│       ├── App.jsx                    # Root routing configuration
│       ├── index.css                  # Tailwind CSS import & neutral background base
│       └── main.jsx                   # React DOM entry point
│
└── server/
    ├── .env.example
    ├── package.json
    ├── server.js                      # Express configuration, CORS, parsers, route mounting
    ├── config/
    │   └── cloudinary.js              # Cloudinary v2 & multer-storage-cloudinary setup
    ├── middleware/
    │   └── auth.js                    # JWT Bearer token authentication middleware
    ├── models/
    │   ├── Item.js                    # Mongoose item schema
    │   └── User.js                    # Mongoose user schema with password hashing
    └── routes/
        ├── auth.js                    # Register, login, me endpoints
        ├── items.js                   # Query list, get by ID, and Cloudinary upload POST
        └── owner.js                   # Owner endpoints: /mine, update, delete, returned
```

---

## 💻 Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Clone the Repository
```bash
git clone https://github.com/mj-creates/lost_and_found.git
cd lost_and_found
```

### 2. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```bash
cp server/.env.example server/.env
```

Populate `server/.env` with your credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lost_and_found?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_random_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Start Backend Server
In your first terminal:
```bash
cd server
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 4. Start Frontend Client
In your second terminal:
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification Checklist

- [x] **Registration & Authentication**: User registers, password is encrypted with bcrypt, JWT token is issued and stored in `localStorage`.
- [x] **Session Persistence**: Refreshing the browser preserves logged-in state via `/api/auth/me`.
- [x] **Choice Page Flow**: Signing in navigates directly to `/choice` featuring the Two Big Buttons.
- [x] **Cross-Search Logic**:
  - Clicking **"I Lost Something"** queries and displays **Found** items so the user checks for an existing turn-in before creating a duplicate post.
  - Clicking **"I Found Something"** queries and displays **Lost** items so the finder can locate and contact the owner immediately.
- [x] **Posting Items**: Uploading with a photo transfers the file to Cloudinary and attaches the secure URL to MongoDB.
- [x] **Owner Management**:
  - Poster can edit listing details.
  - Poster can mark items as **Returned** via gold action button.
  - Non-owners receive HTTP `403 Forbidden` if attempting to modify someone else's post.
  - Poster can delete items.
- [x] **Design Consistency**: Minimalist black/grey palette across all pages, reserving Red for Lost, Green for Found, and Gold for Return/Returned.
