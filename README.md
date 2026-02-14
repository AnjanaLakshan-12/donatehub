# donatehub
DonateHub is a full-stack web application developed using Spring Boot to connects donors with verified organizations through public requests and transparent donation tracking.



# DonateHub Frontend - Setup & Run Guide

## Prerequisites

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **npm** (v7+) - comes with Node.js

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

## Troubleshooting

**Port already in use?** Vite will use the next available port automatically.


# ⚙️ DonateHub Backend – Setup & Run Guide

## 📌 Prerequisites

- Java (v17+)
- Maven (v3.6+)
- MySQL (v8.0+)

---

## 🚀 Setup Steps

### 1️⃣ Database Setup

Open MySQL and create the database:

```sql
CREATE DATABASE donatehub;

# ⚙️ DonateHub Backend – Setup & Run Guide

## 2️⃣ Configure Credentials

Update the following file:

src/main/resources/application.properties

Add your MySQL credentials:

spring.datasource.username=root
spring.datasource.password=your_password

3️⃣ Run the Server
mvn spring-boot:run


The API will be available at:

http://localhost:8080
📦 Available Backend Commands
mvn clean install    # Build project and download dependencies
mvn spring-boot:run  # Start backend server
mvn test             # Run backend unit tests
📚 Project Structure (Basic Overview)
donatehub/
│
├── controller/
├── service/
├── repository/
├── model/
├── config/
└── resources/
👨‍💻 Author

Anjana
Software Engineering Student
NSBM Green University