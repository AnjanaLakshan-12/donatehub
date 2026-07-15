# 🏨 Hotel ERP System

Hotel ERP System is a full-stack **Enterprise Resource Planning (ERP)** prototype developed for hotel operations management.  
It integrates key hotel business processes such as **customer management, room management, reservations, service charges, billing, invoice generation, maintenance requests, and role-based access control**.

This project was developed for the **Business Process and ERP Systems** group assignment.

---

## 📌 Project Overview

The Hotel ERP System supports daily hotel operations by connecting different business modules into one centralized platform.

The system helps hotel staff manage:

- Customers
- Rooms
- Reservations
- Guest service charges
- Invoices and payments
- Maintenance requests
- User roles and access permissions

The main goal of this project is to demonstrate **business process integration**, **ERP module design**, **database functionality**, and **cloud deployment using Microsoft Azure**.

---

## 🧩 Main ERP Modules

### 👤 1. Customer Management

- Add new customers
- View customer records
- Update customer details
- Search customers
- Delete customer records

---

### 🛏️ 2. Room Management

- View room inventory
- View room availability status
- Submit room maintenance reports
- Filter rooms by status, type, and floor

---

### 📅 3. Reservation Management

- Create room reservations
- Manage guest check-in and check-out
- Handle early checkout
- Submit cancellation requests to manager
- Track reservation status

---

### 🍽️ 4. Service Charge Management

- Add service charges for checked-in guests
- Support charges such as food, drinks, laundry, and room service
- Calculate service charge totals
- Link service charges to final invoice

---

### 🧾 5. Invoice Management

- Preview interim guest folio
- Generate final invoice after checkout
- Apply advance payment deductions
- Mark invoices as paid
- Select payment method:
  - Cash
  - Card
  - Online Transfer
- Download invoice PDF

---

### 🧑‍💼 6. Manager Panel

- View today’s arrivals
- View today’s departures
- View currently in-house guests
- View pending payments
- Approve or reject maintenance requests
- Review reservation cancellation requests
- Decide refund type for cancellations

---

### 🛠️ 7. Admin Dashboard

- Add app users
- Update user details and roles
- Activate or deactivate users
- Manage room administration
- View recent users
- View role and access overview

---

## 🔐 User Roles

The system includes role-based access control using the following roles:

```text
ADMIN
MANAGER
RECEPTIONIST
SERVICE_STAFF
