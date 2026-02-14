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



#Here is the backend guide written in the exact same simple, clean style as your frontend documentation.

DonateHub Backend - Setup & Run Guide
Prerequisites
Java (v17+) - Download

Maven (v3.6+) - Download

MySQL (v8.0+) - [suspicious link removed]

Setup Steps
1. Database Setup
Open MySQL and create the database:

SQL
CREATE DATABASE donatehub;
2. Configure Credentials
Update src/main/resources/application.properties with your MySQL username and password:

Properties
spring.datasource.username=root
spring.datasource.password=your_password
3. Run the Server
Bash
mvn spring-boot:run
The API will be available at http://localhost:8080

Available Commands
Bash
mvn clean install   # Build project and download dependencies
mvn spring-boot:run # Start the backend server
mvn test            # Run backend unit tests