const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Sample data
let items = [
  { id: 1, name: 'Item 1', description: 'First item' },
  { id: 2, name: 'Item 2', description: 'Second item' },
  { id: 3, name: 'Item 3', description: 'Third item' }
];

// ============ ROUTES ============

// GET - Retrieve all items
app.get('/api/items', (req, res) => {
  res.json({ success: true, data: items });
});

// GET - Retrieve a specific item by ID
app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  res.json({ success: true, data: item });
});

// POST - Create a new item
app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({ success: false, message: 'Name and description are required' });
  }
  
  const newItem = {
    id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
    name,
    description
  };
  
  items.push(newItem);
  res.status(201).json({ success: true, message: 'Item created', data: newItem });
});

// PUT - Update an existing item
app.put('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  
  const { name, description } = req.body;
  if (name) item.name = name;
  if (description) item.description = description;
  
  res.json({ success: true, message: 'Item updated', data: item });
});

// DELETE - Remove an item
app.delete('/api/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  
  const deletedItem = items.splice(index, 1);
  res.json({ success: true, message: 'Item deleted', data: deletedItem[0] });
});

// ============ HOME ROUTE ============

// Serve the home page (index.html from public folder)
app.get('/', (req, res) => {
  res.send(`
    <h1>Express Server Running</h1>
    <p>Visit <a href="http://localhost:${PORT}/api/items">/api/items</a> to see all items</p>
  `);
});

// ============ ERROR HANDLING ============

// 404 - Page not found
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ============ SERVER ============

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
