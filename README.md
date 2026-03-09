# LearnHub / EDXcellence

A full-stack modern e-learning platform (LMS) built with the MERN stack. It enables instructors to create and manage courses, and students to browse, enroll, review, and track their progress in various subjects. 

## Features

*   **Student Portal:**
    *   Browse and search for courses with advanced filtering.
    *   Shopping Cart system with order summary and promo code support.
    *   Enrollable courses with secure progression and video playback.
    *   Course reviews and ratings.
    *   Multi-type reactions for community engagement.
    *   Track course progress and take interactive quizzes.
*   **Instructor Dashboard:**
    *   Create, edit, and publish new courses.
    *   Upload course thumbnails and videos (uses Cloudinary).
*   **Admin Dashboard:**
    *   View platform analytics, total users, total enrollments, and revenue.
    *   Manage user roles and course lifecycles.
*   **Tech Highlights:**
    *   Fully responsive UI with smooth animations (Framer Motion).
    *   State management with Zustand and data fetching with React Query.
    *   Analytics and charts using Recharts.
    *   Secure JWT-based authentication and role-based access control.

## Tech Stack

*   **Frontend:** React 19, Vite, Tailwind CSS, Zustand, React Query, React Router DOM, Framer Motion, Recharts
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Mongoose)
*   **Authentication:** JWT, bcryptjs
*   **Media Storage:** Cloudinary, Multer

## Prerequisites

*   Node.js (v18+ recommended)
*   MongoDB database instance (local or Atlas)
*   Cloudinary account (for image/video storage)

## Setup Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/EDXcellence_Major_Project.git
    cd EDXcellence_Major_Project
    ```

2.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    # or npm install --legacy-peer-deps
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd ../server
    npm install
    ```

4.  **Environment Variables Configuration:**
    
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLIENT_URL=http://localhost:5173
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    NODE_ENV=development
    ```
    
    Create a `.env` file in the `client` directory:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

5.  **Start the Development Servers:**

    Open two separate terminals.
    
    Terminal 1 (Backend):
    ```bash
    cd server
    npm run dev
    ```

    Terminal 2 (Frontend):
    ```bash
    cd client
    npm run dev
    ```
    
    The application will be accessible at: `http://localhost:5173`

## API Documentation

The REST API utilizes standard HTTP methods and returns JSON responses. Most routes require a valid JWT token passed in the `Authorization: Bearer <token>` header.

### Base URL: `/api`

### Auth (`/api/auth`)
*   `POST /register` - Register a new user
*   `POST /login` - Login to an existing account
*   `GET /me` - Get current authenticated user details

### Users (`/api/users`)
*   `GET /` - Get all users (Admin only)
*   `GET /:id` - Get user by ID
*   `PUT /:id` - Update user details

### Courses (`/api/courses`)
*   `GET /` - Fetch all courses (supports search/filter queries)
*   `GET /:id` - Fetch single course details
*   `POST /` - Create a new course (Instructor/Admin)
*   `PUT /:id` - Update existing course (Instructor/Admin)
*   `DELETE /:id` - Delete a course (Instructor/Admin)

### Cart (`/api/cart`)
*   `GET /` - Get user's active cart
*   `POST /add` - Add course to cart
*   `DELETE /remove/:id` - Remove course from cart
*   `POST /checkout` - Process cart items to enrollments

### Enrollments (`/api/enrollments`)
*   `GET /my-enrollments` - Fetch all courses enrolled by the user
*   `POST /` - Enroll user in a specific course
*   `GET /:id` - Fetch enrollment details and progress

### Quizzes (`/api/quizzes`)
*   `GET /course/:courseId` - Fetch quizzes for a course
*   `POST /` - Create a new quiz (Instructor)
*   `POST /:id/submit` - Submit quiz answers for grading

### Reviews (`/api/reviews`)
*   `GET /course/:courseId` - Get reviews for a course
*   `POST /` - Post a new review for a course

### Progress (`/api/progress`)
*   `GET /:courseId` - Get student's progress in a course
*   `PUT /:courseId/module/:moduleId` - Mark a specific module/lesson as completed

### Admin (`/api/admin`)
*   `GET /stats` - Get overall platform stats (users, revenue, enrollments)

---

> Note: Error handling globally catches misrouted requests and returns standard JSON error objects with a `message` and `stack` trace (in development).