# COMP3133 - Assignment 1: Employee Management System

**Student:** Soroush Salari
**Student ID:** 101537771
**Course:** COMP3133 - Full Stack Development II
**Date:** February 2026

## Description

A backend Employee Management System built with **NodeJS**, **Express**, **GraphQL (Apollo Server)**, and **MongoDB**. This API allows users to sign up, log in, and perform CRUD operations on employee records. Employee profile photos are stored on **Cloudinary**.

## Tech Stack

- Node.js & Express
- GraphQL (Apollo Server)
- MongoDB (Mongoose ODM)
- JWT Authentication
- Cloudinary (Image hosting)
- bcryptjs (Password hashing)

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/COMP3133_101537771_Assignment1.git
cd COMP3133_101537771_Assignment1
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/comp3133_101537771_Assignment1
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=4000
```

### 4. Start the server
```bash
npm start
```

The GraphQL playground will be available at `http://localhost:4000/graphql`

## GraphQL API Operations

### Mutations
| Operation | Description |
|-----------|-------------|
| `signup` | Create a new user account |
| `addEmployee` | Add a new employee with optional photo upload |
| `updateEmployee` | Update employee details by ID |
| `deleteEmployee` | Delete an employee by ID |

### Queries
| Operation | Description |
|-----------|-------------|
| `login` | Authenticate user with username/email and password |
| `getAllEmployees` | Retrieve all employee records |
| `searchEmployeeById` | Find an employee by their ID |
| `searchEmployeeByDesignationOrDepartment` | Filter employees by designation or department |

## Sample Test User
```
Username: admin
Email: admin@example.com
Password: password123
```

## API Examples

### Signup
```graphql
mutation {
  signup(username: "admin", email: "admin@example.com", password: "password123") {
    _id
    username
    email
  }
}
```

### Login
```graphql
query {
  login(usernameOrEmail: "admin", password: "password123") {
    token
    user {
      _id
      username
      email
    }
  }
}
```

### Add Employee
```graphql
mutation {
  addEmployee(
    first_name: "John"
    last_name: "Doe"
    email: "john.doe@example.com"
    gender: "Male"
    designation: "Software Engineer"
    salary: 75000
    date_of_joining: "2025-01-15"
    department: "Engineering"
  ) {
    _id
    first_name
    last_name
    email
    designation
    department
    salary
  }
}
```

### Get All Employees
```graphql
query {
  getAllEmployees {
    _id
    first_name
    last_name
    email
    designation
    department
    salary
  }
}
```

### Search Employee by ID
```graphql
query {
  searchEmployeeById(eid: "EMPLOYEE_ID_HERE") {
    _id
    first_name
    last_name
    email
    designation
    department
  }
}
```

### Update Employee
```graphql
mutation {
  updateEmployee(eid: "EMPLOYEE_ID_HERE", salary: 85000, designation: "Senior Software Engineer") {
    _id
    first_name
    last_name
    salary
    designation
  }
}
```

### Delete Employee
```graphql
mutation {
  deleteEmployee(eid: "EMPLOYEE_ID_HERE") {
    message
  }
}
```

### Search by Designation or Department
```graphql
query {
  searchEmployeeByDesignationOrDepartment(department: "Engineering") {
    _id
    first_name
    last_name
    designation
    department
  }
}
```
