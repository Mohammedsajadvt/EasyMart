# 🛍️ EasyMart — Enterprise Multi-Channel E-Commerce Ecosystem

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://easy-mart-phi.vercel.app)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org)
[![Node.js & Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)

An enterprise-grade, fully dynamic, multi-channel commerce platform connecting **Storefront Buyers**, **Administrative Dispatchers**, **Logistics Delivery Couriers**, and **Enterprise Sales Forces** into a unified, real-time MongoDB Atlas ecosystem.

---

## 🌐 Live Production Deployments

| Channel | Live Production URL | Purpose & Capabilities |
| :--- | :--- | :--- |
| **🛍️ Consumer Storefront** | [**easy-mart-phi.vercel.app**](https://easy-mart-phi.vercel.app) | Live product catalog, dynamic festival discounts, AI Customer Support Agent, shopping cart, instant checkout with referral tracking (`?ref=CODE`), and doorstep return requests. |
| **👑 Admin Control Tower** | [**easy-mart-fjk5.vercel.app**](https://easy-mart-fjk5.vercel.app) | Full product CRUD, category management, Amazon/Flipkart courier dispatching, GPS fleet monitoring, sales quota onboardings, and return/refund approvals. |
| **🚚 Delivery Driver Terminal** | [**easy-mart-vgp7.vercel.app**](https://easy-mart-vgp7.vercel.app) | Active trip manifest queue, warehouse pickup verification, real-time GPS telemetry, route navigation, and 4-digit customer handover security OTP verification. |
| **💼 Sales Force Web App** | [**easy-mart-lvrc.vercel.app**](https://easy-mart-lvrc.vercel.app) | Live revenue performance targets, 5% commission earnings, referral link generator, and direct B2B client lead bookings with celebratory animations. |
| **⚡ Backend API Cluster** | [**easymart-cew3.onrender.com**](https://easymart-cew3.onrender.com) | Central RESTful API powered by Node.js, Express, Mongoose, JWT, and CORS connected to MongoDB Atlas. |

---

## 🏛️ Platform Architecture

```mermaid
graph TD
    A[🛍️ Storefront Web App :5173] -->|Cart, Orders, Returns, AI Care| API[⚡ Central REST API :5000]
    B[👑 Admin Control Tower :5174] -->|Catalog, Dispatches, Quotas, Roles| API
    C[🚚 Delivery Terminal :5175] -->|Assigned Trips, Live GPS, OTP Drop-off| API
    D[💼 Sales Force App :5176] -->|Quota Metrics, Leads, Referrals| API
    API <--> DB[(🍃 MongoDB Atlas Cloud Shard)]
```

---

## ✨ Key System Capabilities

### 1. 🛍️ Dynamic Storefront & AI Customer Care
- **Dynamic Festival Engine**: Automatically highlights active festival campaigns (Diwali, Holi, Cyber Monday, Flash Sales) with customizable coupon codes and discount banners.
- **AI Support Agent**: Instant in-app assistant that looks up customer order histories, checks tracking codes, explains return policies, and suggests top catalog products.
- **Connected Referral Flow**: Listens for URL parameters (`?ref=SALES-CODE`) to automatically attribute customer checkouts to sales representatives.

### 2. 👑 Admin Control Tower & Amazon Logistics Model
- **Courier Assignment**: Assign any pending order to verified delivery couriers with pickup warehouse hub routing.
- **Dynamic Role Management**: Promotes accounts instantly across `Customer`, `Delivery Courier`, `Sales Executive`, and `Administrator` with automatic attribute bootstrapping.
- **Doorstep Returns & Refunds**: Handles customer return workflows from initial reverse pickup to final refund crediting.

### 3. 🚚 Delivery Driver Operations
- **Live Trip Queue**: Real-time dispatch manifests queried directly from MongoDB Atlas.
- **Security OTP Verification**: Requires the customer's dynamic 4-digit code before handing over packages, triggering celebratory feedback upon completion.
- **Duty Toggle & Telemetry**: Driver can switch between `Online` / `Offline` status with simulated GPS updates.

### 4. 💼 Sales Force Web App
- **Quota & Commission Tracking**: Live visual progress bars measuring revenue against monthly targets with real-time 5% commission calculation.
- **Direct Lead Booking**: Allows sales reps to enter direct client orders with instant quota attribution.

---

## 🛠️ Technology Stack

- **Frontend & Admin Apps**: React 19, Vite, Redux Toolkit, TailwindCSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Mongoose, JSON Web Tokens (JWT), Bcrypt.js, Morgan.
- **Database**: MongoDB Atlas Cloud Cluster.
- **Hosting & CI/CD**: Vercel (Frontends with `vercel.json` SPA rewrites) & Render (Node.js API).

---

## 💻 Local Development Setup

Clone the repository and run all services concurrently:

```bash
# Clone repository
git clone https://github.com/Mohammedsajadvt/EasyMart.git
cd EasyMart

# 1. Start Backend API (:5000)
cd backend && npm install && npm run dev

# 2. Start Storefront (:5173)
cd ../frontend && npm install && npm run dev

# 3. Start Admin Portal (:5174)
cd ../admin && npm install && npm run dev

# 4. Start Delivery Terminal (:5175)
cd ../delivery && npm install && npm run dev

# 5. Start Sales Web App (:5176)
cd ../sales && npm install && npm run dev
```

---

## 📄 License
MIT License © 2026 Mohammed Sajad VT. All rights reserved.
