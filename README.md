# Lost & Found Website

> A full-stack MERN application where campus students post items they lost or found, search and filter listings in one place, and manage their own posts with status tracking.

---

## 📌 Project Overview

Lost & Found replaces cluttered WhatsApp and social media groups with a dedicated, searchable web platform.
* **Lost something?** Post it with item details, location, and a photo.
* **Found something?** Post it so the rightful owner can spot and claim it.
* **Browse & Search:** Instant text search and category filtering across all reported items.
* **Manage Posts:** Owners can update listings, remove them, or mark them as returned once handed back.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, React Router v7, Tailwind CSS v4, Axios
* **Backend:** Node.js, Express.js (v5)
* **Database:** MongoDB Atlas (Mongoose v9)
* **File & Image Storage:** Cloudinary via `multer` and `multer-storage-cloudinary`
* **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` password hashing

---

## 👥 Team Roles & Responsibilities

| Team Member | Role | Core Responsibilities |
| :--- | :--- | :--- |
| **Harsha Vardhini** | **Person 1 (Auth & App Base)** | Repository initialization, User model, JWT authentication routes (`/api/auth`), auth middleware, `AuthContext`, `ProtectedRoute`, and Login/Register pages. |
| **Manaswini** | **Person 2 (Items & Uploads)** | Item database schema, Cloudinary integration, item posting with photo upload (`POST /api/items`), Home feed with search and category filters, and Item Detail page. |
| **Ramana Yamini** | **Person 3 (Owner Actions & Deployment)** | Owner-only routes (`GET /mine`, `PUT /:id`, `DELETE /:id`, `PATCH /:id/returned`), My Posts management page, shared `StatusBadge` component, and MongoDB Atlas database setup. |

---

## 🚀 API Route Specification

| Method | Endpoint | Auth Required | Description | Owner |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/register` | No | Register a new user account and return JWT token | Person 1 |
| `POST` | `/api/auth/login` | No | Authenticate user and return JWT token | Person 1 |
| `GET` | `/api/auth/me` | **Yes** | Get profile of currently logged-in user | Person 1 |
| `POST` | `/api/items` | **Yes** | Post a new lost or found item with Cloudinary photo | Person 2 |
| `GET` | `/api/items` | No | Fetch all items (supports `?type=`, `?category=`, and `?search=`) | Person 2 |
| `GET` | `/api/items/:id` | No | Fetch a single item by ID with poster details populated | Person 2 |
| `GET` | `/api/items/mine` | **Yes** | Fetch all items posted by the logged-in user | Person 3 |
| `PUT` | `/api/items/:id` | **Yes** | Update item details (verified owner only) | Person 3 |
| `DELETE` | `/api/items/:id` | **Yes** | Delete item listing (verified owner only) | Person 3 |
| `PATCH` | `/api/items/:id/returned` | **Yes** | Mark item status as `returned` (verified owner only) | Person 3 |

---

## 💻 Local Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Git](https://git-scm.com/)
* A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
* A free [Cloudinary](https://cloudinary.com/) account

### 1. Clone the Repository
```bash
git clone https://github.com/mj-creates/lost_and_found.git
cd lost_and_found
```

### 2. Configure Environment Variables
Create a `.env` file in the `server/` directory:
```bash
cd server
cp .env.example .env
```
Fill in your credentials in `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Install Dependencies & Start Backend
In terminal 1:
```bash
cd server
npm install
npm run dev
# Server will run on http://localhost:5000
```

### 4. Install Dependencies & Start Frontend
In terminal 2:
```bash
cd client
npm install
npm run dev
# Client will run on http://localhost:5173
```

---

## 📱 Pages & Features

1. **Home Board (`/`)**: Displays all recently reported items in a responsive grid with instant title/description search, category dropdown, and type filter.
2. **Post Item (`/post`)**: Protected form allowing authenticated users to post with lost/found toggle, category, location, date, contact, and image upload.
3. **Item Details (`/item/:id`)**: Comprehensive view showing large photo, location, date, contact number, status badge, and poster details.
4. **My Posts (`/my-posts`)**: Owner dashboard to view personal posts, edit details in a prefilled modal, mark items as returned, or delete posts.
5. **Authentication (`/login`, `/register`)**: Form validation and token persistence with automatic session restoration.
