const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const booksFile = path.join(__dirname, 'books.json');

// Helper function to read books from JSON file
function getBooks() {
  try {
    const data = fs.readFileSync(booksFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper function to save books to JSON file
function saveBooks(books) {
  fs.writeFileSync(booksFile, JSON.stringify(books, null, 2));
}

// GET all books
app.get('/api/books', (req, res) => {
  const books = getBooks();
  res.json({ success: true, data: books });
});

// GET a specific book by id
app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  
  if (book) {
    res.json({ success: true, exists: true, message: 'Book found', data: book });
  } else {
    res.status(404).json({ success: false, exists: false, message: 'Book not found' });
  }
});

// Search for a book by title
app.get('/api/search', (req, res) => {
  const { title } = req.query;
  
  if (!title) {
    return res.status(400).json({ success: false, error: 'Please provide a title to search' });
  }
  
  const books = getBooks();
  const book = books.find(b => b.title.toLowerCase().includes(title.toLowerCase()));
  
  if (book) {
    res.json({ success: true, exists: true, message: 'Book found', data: book });
  } else {
    res.status(404).json({ success: false, exists: false, message: 'Book not found' });
  }
});

// POST - Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ success: false, error: 'Title and author are required' });
  }
  
  const books = getBooks();
  const newBook = {
    id: Math.max(...books.map(b => b.id), 0) + 1,
    title,
    author,
    year: year || new Date().getFullYear()
  };
  
  books.push(newBook);
  saveBooks(books);
  
  res.status(201).json({ success: true, message: 'Book added successfully', data: newBook });
});

// DELETE a book
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const books = getBooks();
  const index = books.findIndex(b => b.id === bookId);
  
  if (index !== -1) {
    const deletedBook = books.splice(index, 1);
    saveBooks(books);
    res.json({ success: true, message: 'Book deleted successfully', data: deletedBook[0] });
  } else {
    res.status(404).json({ success: false, message: 'Book not found' });
  }
});

// UPDATE a book
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author, year } = req.body;
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  
  if (book) {
    if (title) book.title = title;
    if (author) book.author = author;
    if (year) book.year = year;
    
    saveBooks(books);
    res.json({ success: true, message: 'Book updated successfully', data: book });
  } else {
    res.status(404).json({ success: false, message: 'Book not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ REST API Endpoints:`);
  console.log(`  - GET /api/books - Get all books`);
  console.log(`  - GET /api/books/:id - Get a specific book`);
  console.log(`  - GET /api/search?title=... - Search for a book`);
  console.log(`  - POST /api/books - Add a new book`);
  console.log(`  - PUT /api/books/:id - Update a book`);
  console.log(`  - DELETE /api/books/:id - Delete a book\n`);
});
