# 🛍️ EasyMart Multi-Application E-Commerce Platform

Enterprise-Grade Multi-Channel E-Commerce Ecosystem built with React, Redux Toolkit, Node.js, Express, MongoDB Atlas, and TailwindCSS.

---

## 🏛️ Ecosystem Overview

| Application | Directory | Port | Target Domain / Role |
| :--- | :--- | :--- | :--- |
| **Storefront Web App** | `/frontend` | `5173` | Customer shopping, flash sales, festival offers, AI customer care, and checkout. |
| **Admin Control Tower** | `/admin` | `5174` | Product catalog, dispatch management, GPS fleet tracking, and return approvals. |
| **Delivery Driver Terminal** | `/delivery` | `5175` | Courier pickup, real-time GPS telemetry, route navigation, and customer OTP verification. |
| **Sales Force Web App** | `/sales` | `5176` | Sales quota tracking, referral link attribution (`?ref=CODE`), and deal closing. |
| **Central REST API** | `/backend` | `5000` | Express + Mongoose API connected to MongoDB Atlas. |

---

## 🚀 Step 1: Push to GitHub

Run these commands in your project root terminal (`c:\Users\CORE I7\Documents\EasyMart`):

```bash
# 1. Initialize Git repository
git init

# 2. Add all clean project files (node_modules & .env are automatically ignored)
git add .

# 3. Create initial commit
git commit -m "feat: complete EasyMart dynamic multi-app ecosystem"

# 4. Create a new repository on GitHub (e.g. 'easymart-platform')
# Then link and push your main branch:
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/easymart-platform.git
git push -u origin main
```

---

## ☁️ Step 2: Host Backend API

You can deploy the backend on **Render**, **Railway**, or **Vercel**:

### Option A: Render.com (Recommended for Node/Express Servers)
1. Go to [Render Dashboard](https://dashboard.render.com/) ➔ Click **New Web Service**.
2. Connect your GitHub repository `easymart-platform`.
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node src/server.js`
6. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `easymart_production_jwt_secret_2026`
   - `NODE_ENV`: `production`
7. Click **Deploy**. Note your live API URL (e.g., `https://easymart-api.onrender.com`).

---

## ⚡ Step 3: Host the 4 Frontend Apps on Vercel

Since all 4 apps live in the same repository, create **4 separate projects on Vercel** pointing to the repository with different root directories:

### 1. Storefront (`/frontend`)
- **Project Name**: `easymart-store`
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Environment Variable**:
  - `VITE_API_URL`: `https://easymart-api.onrender.com/api`

### 2. Admin Portal (`/admin`)
- **Project Name**: `easymart-admin`
- **Root Directory**: `admin`
- **Framework Preset**: `Vite`
- **Environment Variable**:
  - `VITE_API_URL`: `https://easymart-api.onrender.com/api`

### 3. Delivery Terminal (`/delivery`)
- **Project Name**: `easymart-delivery`
- **Root Directory**: `delivery`
- **Framework Preset**: `Vite`
- **Environment Variable**:
  - `VITE_API_URL`: `https://easymart-api.onrender.com/api`

### 4. Sales Force Web App (`/sales`)
- **Project Name**: `easymart-sales`
- **Root Directory**: `sales`
- **Framework Preset**: `Vite`
- **Environment Variable**:
  - `VITE_API_URL`: `https://easymart-api.onrender.com/api`

---

## 🛡️ Production Health & Seed Checklist
Once deployed, seed initial categories and catalog products by visiting your live admin portal:
`https://your-admin-url.vercel.app/database` ➔ Click **Seed Catalog & Categories**.
