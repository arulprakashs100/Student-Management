# 🎓 Student Management System

A Full Stack Student Management System developed using **Spring Boot**, **PostgreSQL**, **HTML**, **CSS**, and **JavaScript**.

This application provides separate portals for **Students** and **Staff** to manage student records efficiently.

---

## 📌 Project Overview

The Student Management System is a web-based application that simplifies student data management in educational institutions.

Students can register, log in, and view their personal information, while staff members can manage student records through a secure dashboard.

---

## 🚀 Technologies Used

### Backend
- Java 26
- Spring Boot
- Spring MVC
- Spring Data JPA
- Maven

### Frontend
- HTML5
- CSS3
- JavaScript

### Database
- PostgreSQL

### IDE
- IntelliJ IDEA

---

## ✨ Features

### 👨‍🎓 Student Module

- Student Registration
- Student Login
- View Personal Profile
- Logout

---

### 👨‍🏫 Staff Module

- Staff Registration
- Staff Login
- Staff Dashboard
- Add Student
- View Students
- Update Student
- Delete Student
- Search Student
- View Staff Details
- Logout

---

## 📂 Project Structure

```
student-management-system
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── config
│   └── StudentApplication.java
│
├── frontend
│   ├── css
│   ├── js
│   ├── images
│   ├── index.html
│   ├── student-login.html
│   ├── student-register.html
│   ├── student-dashboard.html
│   ├── staff-login.html
│   ├── staff-register.html
│   └── staff-dashboard.html
│
└── README.md
```

---

## 🏗️ System Architecture

```
Frontend
(HTML, CSS, JavaScript)
          │
          ▼
Spring Boot REST API
          │
          ▼
Controller
          │
          ▼
Service
          │
          ▼
Repository
          │
          ▼
PostgreSQL Database
```

---

## 📋 Functional Modules

### Home Page

- Student Portal
- Staff Portal

### Student Portal

- Register
- Login
- Dashboard
- View Profile

### Staff Portal

- Register
- Login
- Dashboard
- Add Student
- View Students
- Update Student
- Delete Student
- Search Student
- Staff Details
- Logout

---

## 🗄️ Database

Database Name

```
studentdb
```

Tables

```
students
staff
```

---

## 📸 Screenshots

### Home Page

- Student Portal
- Staff Portal

### Student Module

- Login
- Registration
- Dashboard

### Staff Module

- Login
- Registration
- Dashboard

### Student CRUD Operations

- Add Student
- View Students
- Update Student
- Delete Student
- Search Student

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/student-management-system.git
```

### Open Project

Open the project in IntelliJ IDEA.

### Configure Database

Create PostgreSQL database

```sql
CREATE DATABASE studentdb;
```

Update `application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/studentdb
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```

### Run the Project

```bash
mvn spring-boot:run
```

Backend URL

```
http://localhost:8080
```

---

## 📚 REST APIs

### Student APIs

| Method | Endpoint | Description |
|----------|--------------------|----------------|
| GET | /students | View Students |
| GET | /students/{id} | View Student |
| POST | /students | Add Student |
| PUT | /students/{id} | Update Student |
| DELETE | /students/{id} | Delete Student |

---

## 🎯 Learning Outcomes

This project helped me gain practical knowledge in:

- Spring Boot
- REST APIs
- Spring Data JPA
- PostgreSQL
- MVC Architecture
- CRUD Operations
- Frontend Development
- Backend Development
- Full Stack Java Development

---

## 🔮 Future Enhancements

- JWT Authentication
- Password Encryption
- Email Verification
- Forgot Password
- Student Photo Upload
- Attendance Management
- Marks Management
- PDF Report Generation
- Excel Export
- Admin Module
- Dashboard Charts
- Notifications

---

## 👨‍💻 Author

**Arul Prakash S**

Aspiring Java Full Stack Developer

GitHub: https://github.com/arulprakashs100

LinkedIn: https://linkedin.com/in/your-profile

---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It motivates me to build and share more projects.
