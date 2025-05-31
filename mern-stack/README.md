Three-Tier MERN Application with React.js, Node.js & MySQL

This repository contains a complete three-tier web application built using:

Frontend: React.js with Vite, axios
Backend: Node.js with Express, Sequelize ORM
Database: MySQL (can be hosted or local)

You can deploy this app on any Linux Server, especially AWS EC2 instances, along with a MySQL database (e.g., AWS RDS).

Run Locally with Docker Compose

You can run Frontend, Backend, MySQL, and PHPMyAdmin using Docker and Docker Compose for local development.

🐋 Prerequisites for Running with Docker:

Install Docker and Docker Compose.

Update your machine IP under the environment section of frontend in docker-compose.yml:
VITE_API_URL=http://<Your Machine IP>:3000

Run the stack:
docker-compose up

Access the apps:

Frontend: http://localhost:5000

Backend API: http://localhost:3000

PHPMyAdmin: http://localhost:8085

To stop:

docker-compose down

✅ Prerequisites for Running on Linux Server:
Linux server (Ubuntu recommended)
SSH access

MySQL database ready (local or hosted)
.env.example files available for frontend and backend

🚀 Deployment Steps

1. Update System
sudo apt update && sudo apt upgrade -y

2. Install Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v

3. Install PM2 (Process Manager)
sudo npm install pm2@latest -g
pm2 --version

4. Clone Repository
git clone https://github.com/mahadihassanrazib/full-stack-crud-project-with-react-node-mysql.git
cd full-stack-crud-project-with-react-node-mysql

5. Configure and Run Backend API
cd server
npm install
cp .env.example .env
nano .env  # Update DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE
pm2 start index.js --name api-server --watch --env PORT=3000
pm2 status
pm2 logs api-server

6. Configure and Run Frontend React App
cd ../frontend
npm install
cp .env.example .env
nano .env  # Update VITE_API_URL=http://your-backend-ip:3000
pm2 start npm --name "react-app" -- run dev -- --host 0.0.0.0
pm2 status
pm2 logs react-app

7. Access the Application
Backend API: http://your-server-ip:3000
Frontend: http://your-server-ip:5000
Make sure firewall and AWS Security Groups allow ports 3000, 5000, 8085 (PHPMyAdmin)

8. Check Running Processes and Logs
pm2 list
pm2 logs api-server
pm2 logs react-app
pm2 stop api-server
pm2 restart react-app

9. Optional: Setup PM2 to Start on Boot
pm2 startup
# Follow printed instructions
pm2 save

10. Run MySQL Locally with PHPMyAdmin using Docker Compose
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: crud_operations
      MYSQL_USER: myuser
      MYSQL_PASSWORD: mypassword
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
phpmyadmin:
    image: phpmyadmin/phpmyadmin:latest
    environment:
      PMA_HOST: mysql
      PMA_USER: root
      PMA_PASSWORD: rootpassword
    ports:
      - "8085:80"
    depends_on:
      - mysql
volumes:
  db_data:
docker-compose up -d
Access PHPMyAdmin at: http://localhost:8085

11. Connect to AWS RDS MySQL
sudo apt install mysql-client -y
mysql -h <RDS_endpoint> -u <username> -p
Run MySQL commands to verify connection:
SHOW DATABASES;
USE your_database;
SHOW TABLES;
SELECT * FROM users;

Testing & Validation Instructions (Assignment Requirements)

1. Verify Containers and Services Running
Run docker-compose ps or docker ps and screenshot containers with status Up.
Confirm backend APIs listening on ports 3000.
Confirm frontend app accessible on port 5000.
Confirm PHPMyAdmin on port 8085.

2. API Functionality Test
Use Postman or curl to test backend API endpoints:
curl http://localhost:3000/api/users
Verify JSON response with user data.

3. Database Verification
Login to PHPMyAdmin, verify that the users table exists with sample data.
For RDS, connect with MySQL client and run select queries.

4. Frontend Validation
Open http://localhost:5000 and confirm UI loads.
Perform CRUD operations on users through the UI and verify data is persisted in the database.

5. Load Balancer (if implemented)
If load balancer exists, test that requests rotate between backend instances.
Check logs from load balancer container for request distribution.

6. Logs Review
Check backend API logs via pm2 logs api-server or docker logs <container>.
Check frontend logs similarly.
Check Docker container logs with docker logs <container>.

7. Environment Variables Setup
Confirm .env files for both frontend and backend are correctly configured and secure (no hard-coded passwords).

What This Assignment Covers

Containerized full MERN stack application with multi-service Docker Compose.

Local and cloud deployment options (Docker Compose locally, Linux Server with PM2, AWS RDS).

Use of Sequelize ORM with MySQL for backend database access.

React frontend with Vite and environment variables for API URLs.

Use of PHPMyAdmin for database management.

Process management and log viewing using PM2.

Basic testing and validation of endpoints, frontend UI, and database persistence.

Optional setup for load balancing backend APIs (via Nginx).

Instructions to install dependencies and tools (Node, Docker, PM2).

Contributing 🤝
Feel free to contribute or report issues to improve this setup guide!

License 📄
MIT License – see LICENSE for details.

Original Author
Prem Chander Jebastian
