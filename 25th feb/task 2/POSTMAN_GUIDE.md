# Task 2: Postman Testing Guide

## Overview
This API provides endpoints for managing Books and Users. You can test all endpoints using Postman.

## Base URL
```
http://localhost:3001
```

## Book Endpoints

### 1. Get All Books
- **Method:** GET
- **URL:** `http://localhost:3001/api/books`
- **Response:** Returns all books in the database

### 2. Get Book by ID
- **Method:** GET
- **URL:** `http://localhost:3001/api/books/1`
- **Response:** Returns a single book with ID 1

### 3. Search Book by Title ⭐
- **Method:** GET
- **URL:** `http://localhost:3001/api/books/search/Gatsby`
- **Description:** Search for books by title (case-insensitive)
- **Response:** Returns all matching books

### 4. Add New Book
- **Method:** POST
- **URL:** `http://localhost:3001/api/books`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "year": 1937
}
```

### 5. Delete Book
- **Method:** DELETE
- **URL:** `http://localhost:3001/api/books/1`
- **Response:** Deletes the book and returns the deleted book data

---

## User Endpoints

### 1. Get All Users
- **Method:** GET
- **URL:** `http://localhost:3001/api/users`
- **Response:** Returns all users in the database

### 2. Get User by ID
- **Method:** GET
- **URL:** `http://localhost:3001/api/users/1`
- **Response:** Returns a single user with ID 1

### 3. Search User by Name or Email
- **Method:** GET
- **URL:** `http://localhost:3001/api/users/search/john`
- **Description:** Search for users by name or email
- **Response:** Returns all matching users

### 4. Add New User ⭐
- **Method:** POST
- **URL:** `http://localhost:3001/api/users`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "Alice Wilson",
  "email": "alice@example.com",
  "role": "user"
}
```
- **Response:** Returns the newly created user with an auto-generated ID

### 5. Update User
- **Method:** PUT
- **URL:** `http://localhost:3001/api/users/1`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "admin"
}
```

### 6. Delete User ⭐
- **Method:** DELETE
- **URL:** `http://localhost:3001/api/users/2`
- **Response:** Deletes the user and returns the deleted user data

---

## Postman Step-by-Step Instructions

### Step 1: Open Postman
1. Download and install Postman from https://www.postman.com/downloads/
2. Open Postman

### Step 2: Create a New Request
1. Click "+" to create a new tab
2. Select the HTTP method (GET, POST, DELETE, etc.)
3. Enter the URL
4. Add headers and body if needed
5. Click "Send"

### Step 3: Test Search Book
1. Method: **GET**
2. URL: `http://localhost:3001/api/books/search/1984`
3. Click Send
4. You should see the book "1984" returned

### Step 4: Test Add User
1. Method: **POST**
2. URL: `http://localhost:3001/api/users`
3. Go to "Body" tab → Select "raw" → Select "JSON"
4. Enter:
```json
{
  "name": "Emma Stone",
  "email": "emma@example.com",
  "role": "user"
}
```
5. Click Send
6. You should see the new user with ID 4

### Step 5: Test Delete User
1. Method: **DELETE**
2. URL: `http://localhost:3001/api/users/2`
3. Click Send
4. You should see the deleted user info returned

---

## Sample Test Scenarios

### Scenario 1: Complete User Management
1. **GET** `/api/users` - View all users
2. **POST** `/api/users` - Add "Sarah Connor" with email "sarah@example.com"
3. **GET** `/api/users/search/sarah` - Find the newly added user
4. **PUT** `/api/users/4` - Update the user's role to "admin"
5. **DELETE** `/api/users/4` - Delete the user

### Scenario 2: Book Search and Add
1. **GET** `/api/books/search/Gatsby` - Search for "Gatsby"
2. **POST** `/api/books` - Add a new book "Dracula" by Bram Stoker (1897)
3. **GET** `/api/books` - View all books including the new one

---

## Success Indicators

✓ Search book returns correct matching books
✓ Adding user creates entry with unique ID and validates email
✓ Deleting user removes from database and shows deleted user info
✓ All endpoints return consistent JSON format with success/error messages

