const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const booksFile = path.join(__dirname, 'books.json');
const usersFile = path.join(__dirname, 'users.json');

// Helper functions to read/write JSON files
function readFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ============ BOOK ENDPOINTS ============

// GET all books
app.get('/api/books', (req, res) => {
  const books = readFile(booksFile);
  res.json({ success: true, message: 'All books retrieved', data: books });
});

// GET a specific book by ID
app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const books = readFile(booksFile);
  const book = books.find(b => b.id === bookId);
  
  if (book) {
    res.json({ success: true, message: 'Book found', data: book });
  } else {
    res.status(404).json({ success: false, message: 'Book not found' });
  }
});

// SEARCH book by title
app.get('/api/books/search/:title', (req, res) => {
  const title = req.params.title;
  const books = readFile(booksFile);
  const results = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  
  if (results.length > 0) {
    res.json({ success: true, message: `Found ${results.length} book(s)`, data: results });
  } else {
    res.status(404).json({ success: false, message: 'No books found matching that title' });
  }
});

// POST - Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ success: false, error: 'Title and author are required' });
  }
  
  const books = readFile(booksFile);
  const newBook = {
    id: Math.max(...books.map(b => b.id), 0) + 1,
    title,
    author,
    year: year || new Date().getFullYear()
  };
  
  books.push(newBook);
  writeFile(booksFile, books);
  
  res.status(201).json({ success: true, message: 'Book added successfully', data: newBook });
});

// DELETE a book
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const books = readFile(booksFile);
  const index = books.findIndex(b => b.id === bookId);
  
  if (index !== -1) {
    const deletedBook = books.splice(index, 1);
    writeFile(booksFile, books);
    res.json({ success: true, message: 'Book deleted successfully', data: deletedBook[0] });
  } else {
    res.status(404).json({ success: false, message: 'Book not found' });
  }
});

// ============ USER ENDPOINTS ============

// GET all users
app.get('/api/users', (req, res) => {
  const users = readFile(usersFile);
  res.json({ success: true, message: 'All users retrieved', data: users });
});

// GET a specific user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = readFile(usersFile);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    res.json({ success: true, message: 'User found', data: user });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// SEARCH user by name or email
app.get('/api/users/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const users = readFile(usersFile);
  const results = users.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  );
  
  if (results.length > 0) {
    res.json({ success: true, message: `Found ${results.length} user(s)`, data: results });
  } else {
    res.status(404).json({ success: false, message: 'No users found' });
  }
});

// POST - Add a new user
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }
  
  const users = readFile(usersFile);
  
  // Check if email already exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ success: false, error: 'Email already exists' });
  }
  
  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    name,
    email,
    role: role || 'user'
  };
  
  users.push(newUser);
  writeFile(usersFile, users);
  
  res.status(201).json({ success: true, message: 'User added successfully', data: newUser });
});

// PUT - Update a user
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, role } = req.body;
  const users = readFile(usersFile);
  const user = users.find(u => u.id === userId);
  
  if (user) {
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    
    writeFile(usersFile, users);
    res.json({ success: true, message: 'User updated successfully', data: user });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// DELETE a user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users = readFile(usersFile);
  const index = users.findIndex(u => u.id === userId);
  
  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    writeFile(usersFile, users);
    res.json({ success: true, message: 'User deleted successfully', data: deletedUser[0] });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running healthy' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Book Endpoints:`);
  console.log(`  - GET /api/books - Get all books`);
  console.log(`  - GET /api/books/:id - Get a specific book`);
  console.log(`  - GET /api/books/search/:title - Search for a book`);
  console.log(`  - POST /api/books - Add a new book`);
  console.log(`  - DELETE /api/books/:id - Delete a book`);
  console.log(`\n✓ User Endpoints:`);
  console.log(`  - GET /api/users - Get all users`);
  console.log(`  - GET /api/users/:id - Get a specific user`);
  console.log(`  - GET /api/users/search/:query - Search for users`);
  console.log(`  - POST /api/users - Add a new user`);
  console.log(`  - PUT /api/users/:id - Update a user`);
  console.log(`  - DELETE /api/users/:id - Delete a user\n`);
});
