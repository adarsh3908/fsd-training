const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// In-memory database (replace with real database in production)
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 5 },
  { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics', stock: 50 },
  { id: 3, name: 'Keyboard', price: 79.99, category: 'Electronics', stock: 30 },
  { id: 4, name: 'Monitor', price: 299.99, category: 'Electronics', stock: 10 }
];

// Helper function to generate new ID
const generateId = () => {
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

// ============ CRUD ROUTES ============

// CREATE - POST /api/products
app.post('/api/products', (req, res) => {
  const { name, price, category, stock } = req.body;

  // Validation
  if (!name || !price || !category || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: 'All fields (name, price, category, stock) are required'
    });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number'
    });
  }

  if (isNaN(stock) || stock < 0) {
    return res.status(400).json({
      success: false,
      message: 'Stock must be a non-negative number'
    });
  }

  const newProduct = {
    id: generateId(),
    name,
    price: parseFloat(price),
    category,
    stock: parseInt(stock)
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

// READ - GET /api/products (all products)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    total: products.length,
    data: products
  });
});

// READ - GET /api/products/:id (single product)
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: product
  });
});

// UPDATE - PUT /api/products/:id
app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const { name, price, category, stock } = req.body;

  // Validate if provided
  if (price !== undefined) {
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }
    product.price = parseFloat(price);
  }

  if (stock !== undefined) {
    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be a non-negative number'
      });
    }
    product.stock = parseInt(stock);
  }

  if (name) product.name = name;
  if (category) product.category = category;

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

// DELETE - DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const deletedProduct = products.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct
  });
});

// ============ FILTER & SEARCH ============

// GET /api/products/category/:category
app.get('/api/products/category/:category', (req, res) => {
  const filtered = products.filter(p =>
    p.category.toLowerCase() === req.params.category.toLowerCase()
  );

  res.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
});

// GET /api/search?query=...
app.get('/api/search', (req, res) => {
  const query = req.query.query?.toLowerCase();

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const results = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  res.json({
    success: true,
    total: results.length,
    data: results
  });
});

// ============ ERROR HANDLING ============

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ============ SERVER ============

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════╗
  ║   Product CRUD API Server Started  ║
  ║   http://localhost:${PORT}          ║
  ╚════════════════════════════════════╝
  `);
});
