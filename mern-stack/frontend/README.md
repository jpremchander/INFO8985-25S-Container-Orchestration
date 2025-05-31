# MERN Stack Docker Compose Setup (INFO8985 - Lab 1)

This project sets up a full MERN (MySQL, Express/Node.js, React, Nginx) stack using **Docker Compose** to meet all requirements for INFO8985 Lab 1.

---

## 🚀 Features Implemented

### ✅ Multiple Services

* **MySQL** container with data persistence
* **phpMyAdmin** GUI accessible at `http://localhost:8081`
* **PostgreSQL** with **pgAdmin4** (accessible at `http://localhost:5050`)

### ✅ Persistent Data

* Volumes attached to MySQL and PostgreSQL to preserve data

### ✅ App with Dependencies

* **Node.js backend API** (Express) with MySQL connection
* **ReactJS frontend** connects to backend

### ✅ Multi-Stage Build

* Multi-stage Dockerfiles used for both frontend and backend to reduce image size

### ✅ Scaling and Load Balancing

* 3 replicas of **backend API**
* Nginx container load balances requests across replicas

---

## 📂 Project Structure

```
mern-stack/
├── backend-api/       # Node.js Express API
├── frontend-app/      # React app
├── nginx.conf         # Load balancing config
├── docker-compose.yml # Compose file
└── README.md          # This file
```

---

## ⚙️ How to Run

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd mern-stack
```

2. **Run the services**

```bash
docker-compose up --build -d
```

3. **Access Services in Browser**

* React frontend: [http://localhost:5000](http://localhost:5000)
* Node.js backend API: [http://localhost:3000](http://localhost:3000)
* phpMyAdmin: [http://localhost:8081](http://localhost:8081)
* pgAdmin4: [http://localhost:5050](http://localhost:5050)

---

## 🧪 Seed Sample Data

Seed logic is included in the backend container (see `backend-api/init.js`). It automatically inserts sample data if the table is empty.

You can confirm by accessing the API:

```bash
curl http://localhost:3000
```

Expected output:

```json
[
  {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
]
```

---

## 🖼️ Screenshots to Submit

1. `docker-compose up` showing healthy services
2. Browser view of:

   * `localhost:8081` → phpMyAdmin
   * `localhost:3000` → API returns data
   * `localhost:5000` → React frontend
   * `localhost:5050` → pgAdmin4

---

## ✅ Completed Requirements

* [x] Multiple services (MySQL, phpMyAdmin, PostgreSQL, pgAdmin4)
* [x] Persistent volumes
* [x] App dependency management (PostgreSQL starts before pgAdmin)
* [x] Multi-stage builds
* [x] Scaling with Docker Compose
* [x] Load balancing with Nginx
* [x] Screenshot evidence
