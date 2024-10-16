# Courtly

**College ID**: IIT2021191

## Table of Contents
- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [Deployment Instructions](#deployment-instructions)
- [Assumptions and Limitations](#assumptions-and-limitations)
- [Links](#links)

## Introduction
This project is a web application that enables users to manage and book sports courts. It provides an intuitive interface for scheduling, managing bookings, and viewing court availability in real-time.

## Tech Stack

### Frontend
- **Vite + React** - Next Generation Frontend Tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Express** - Web application framework
- **Mongoose** - MongoDB object modeling
- **JSON Web Token** - Authentication
- **bcryptjs** - Password hashing
- **body-parser** - Request parsing middleware
- **dotenv** - Environment configuration

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (version 16.x or higher)
- MongoDB (version 5.0 or higher)
- npm (version 8.x or higher) or yarn
- Git for version control
- A modern web browser

## Setup Instructions

### 1. Clone the repository:
```bash
git clone https://github.com/0Kaju12/Booking-App.git
cd Booking-App
```

### 2. Frontend Setup:

#### Install dependencies:
```bash
cd frontend
npm install
```

#### Setup Vite and React:
```bash
# If starting a new project
npm create vite@latest my-project -- --template react
cd my-project

# Install dependencies
npm install
```

#### Setup Tailwind CSS:
```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Configure Tailwind CSS
# In tailwind.config.js:
```
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Add Tailwind directives:
In your `./src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Backend Setup:

#### Install dependencies:
```bash
cd backend
npm install express mongoose dotenv jsonwebtoken bcryptjs body-parser cors
```

#### Create backend structure:
```bash
mkdir config controllers middlewares models routes
touch server.js .env
```

#### Configure environment variables:
Create a `.env` file in the backend root:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
```

## Running the Project

### Start the backend server:
```bash
cd backend
npm start
```

### Start the Vite development server:
```bash
cd frontend
npm run dev
```

Access the application:
- Frontend: `http://localhost:5173` (Vite default port)
- Backend API: `http://localhost:5000`

## Deployment Instructions

### Backend Deployment
1. **Prepare for production:**
   ```bash
   cd backend
   npm run build
   ```

2. **Configure production environment:**
   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

### Frontend Deployment (Vite)
1. **Build the production version:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Preview the build locally:**
   ```bash
   npm run preview
   ```

3. **Deploy to hosting service:**
   - Vercel: Connect your GitHub repository and configure build settings
   - Netlify: Upload the `dist` folder or connect your repository
   - GitHub Pages: Configure deployment from the `dist` branch

## API Endpoints

### Authentication
```
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
GET /api/auth/profile - Get user profile (Protected)
```

### Resources
```
GET /api/resources - Get all resources
POST /api/resources - Create new resource (Protected)
PUT /api/resources/:id - Update resource (Protected)
DELETE /api/resources/:id - Delete resource (Protected)
```

## Assumptions and Limitations

### Assumptions
* Users have basic familiarity with React, Node.js, and MongoDB
* Modern browser support with JavaScript enabled
* Stable internet connection for real-time features

### Limitations
* Covering only interger time slots.
* The current implementation may not handle all edge cases or errors gracefullyconnections
* While basic validation is implemented, more complex validation rules may be necessary to ensure data integrity and prevent invalid data from being stored in the databa
* The current architecture may face performance issues with a significant increase in user load or data volume

### Known Issues
* Date Format Handling: Only 'DD-MM-YYYY' format is supported; other formats may cause errors.
* Timezone Differences: Date and time inconsistencies may occur due to user timezones.
* Mobile Responsiveness: The app may not display well on all mobile devices

* Inconsistent Error Messages

## Links


* **Frontend Deployment:** [https://unrivaled-rugelach-c1dc24.netlify.app/](https://your-frontend.vercel.app)
* **Backend API:** [https://booking-app-oolj.onrender.com](https://api.your-project.com)
