🌐 __BlogFusion__

BlogFusion is a microservices-based blogging platform designed for scalability, security, and performance.
It allows users to create profiles, write blogs, post comments, and explore content with advanced filtering options.
The platform leverages TypeScript across backend services and frontend, ensuring type safety and maintainability.
___


## 📁 __Project Structure__
```
BlogFusion/  
├── services
│   ├── users        # User management service (MongoDB)
│   ├── blog         # Blog service (PostgreSQL + Redis)
│   ├── author       # Author service (PostgreSQL)
│
└── frontend         # Next.js (TypeScript) frontend         
```
___

🛠️ __Tech Stack__

🔹 Languages & Frameworks

        TypeScript (primary language across all services)
            
        Node.js (Express.js) – REST APIs for microservices
            
        Next.js (React + TypeScript) – Frontend with SSR & CSR

🔹 Databases

      MongoDB – User details (profiles, bios, social links)
      
      PostgreSQL – Blog details and author data
      
      Redis – Caching layer for blog queries

🔹 Messaging & Caching

      RabbitMQ – Cache invalidation and event-driven communication
      
      Redis – Improves data fetching latency

🔹 Security

      JWT (JSON Web Token) – Authentication & Authorization
      
      Bcrypt.js – Password hashing

🔹 UI / UX

      ShadCN UI – Component library for a modern and responsive design
___

## 📂 __Services Overview__

1️⃣ User Service (MongoDB + TypeScript)

- Manages user-related functionality.

- Stores user profiles with:

- Name

- Profile image

- Bio

- Social media links (LinkedIn, Instagram, Facebook)

__Features:__

- User registration & authentication (JWT)

- Profile update (only authenticated users)

- Secure password storage with hashing
___

2️⃣ __Blog Service__ (PostgreSQL + Redis + TypeScript)

- Handles blog storage and retrieval with caching.

- Stores:

- Blog title

- Description

- Blog type (Food, Tech, Lifestyle, etc.)

- Content

- __Features__:

- Redis caching for faster read performance

- RabbitMQ for cache invalidation when blog data changes

- Search & filtering by blog type, keyword, or author

- Public API for fetching blog data

___

3️⃣ __Author Service__ (PostgreSQL + TypeScript)

- Focuses on authoring and blog management.

- Authors can:

- Create blogs (title, description, type, content)

- Edit or delete their own blogs

- Post comments on blogs

__Features__:

- Only authenticated users can comment

- Users can delete their own comments

- Strict authorization – only authors can delete their blogs

___

## 🎨 Frontend (Next.js + TypeScript)

**Pages & Features:**

- **Login / Register** – User authentication  
  - Profile Page – Update and manage user profile  

- **UI Components** – Powered by ShadCN UI  
  - Blog Page – Displays all blogs with search & filter options  
  - Saved Blogs Page – Shows saved blogs (auth-only)  

- **Responsive Design** – Desktop & Mobile
 ___

## ⚙️ Workflow Overview

1. **User Service**
   - A user registers & logs in via the User Service.  
   - Authenticated users can update profiles.  

2. **Author Service**
   - An author creates blogs through the Author Service.  
   - Authenticated authors can create, edit, or delete blogs.  

3. **Blog Service (PostgreSQL + Redis)**
   - Blogs are stored in PostgreSQL and cached in Redis.  
   - RabbitMQ invalidates Redis cache when new blogs or comments are created/deleted.  

4. **Frontend (Next.js + TypeScript)**
   - Communicates with services through REST APIs.  
   - Features for authenticated users:  
     - Save blogs  
     - Post or delete comments

  ___

## ⚡ Key Features

- ✔️ **TypeScript-first development** – Type-safe across backend & frontend  
- ✔️ **Microservices architecture** – Separate services for users, blogs, and authors  
- ✔️ **Authentication & Authorization** – JWT-based authentication with role-based access  
- ✔️ **High performance** – Redis caching + RabbitMQ-based cache invalidation  
- ✔️ **Databases** – PostgreSQL for relational blog data, MongoDB for flexible user profiles  
- ✔️ **Modern Frontend** – Next.js with ShadCN UI for a clean and responsive design  
- ✔️ **Advanced Search** – Full blog search & filter system  
- ✔️ **Personalization** – Saved blogs and user profile management

  ___

  ## 📌 Future Improvements

- ✅ **Containerization** – Dockerize all services with Docker Compose  
- ✅ **Scalability** – Kubernetes deployment for scaling microservices  
- ✅ **Unified Access** – Implement API Gateway (GraphQL / Federation)  
- ✅ **Monitoring & Metrics** – Prometheus + Grafana integration  
- ✅ **Automation** – CI/CD pipeline with GitHub Actions  
___
## ▶️ Getting Started

### 🔧 Prerequisites

Make sure you have the following installed:

- **Node.js** (>= 18.x) + npm  
- **MongoDB**  
- **PostgreSQL**  
- **Redis**  
- **RabbitMQ**  
- **Next.js**  
___

⚙️ __Installation__

**Clone the repository:**

    git clone https://github.com/arpitkairati07/BlogFusion.git
    cd BlogFusion


**Install dependencies for each service and frontend:**

    cd services/users && npm install
    cd ../blog && npm install
    cd ../author && npm install
    cd ../../frontend && npm install
___

## 📷 Screens (Planned)

- 🔑 **Login / Register Page**  
- 📰 **Blog Listing with Filters**  
- 💾 **Saved Blogs Page**  
- 👤 **Profile Page**  







