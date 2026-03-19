// API Base URL
const API_URL = 'http://localhost:3002/api';
let isEditMode = false;
let editingProductId = null;

// DOM Elements
const productForm = document.getElementById('productForm');
const productIdInput = document.getElementById('productId');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productCategoryInput = document.getElementById('productCategory');
const productStockInput = document.getElementById('productStock');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const productsTableBody = document.getElementById('productsTableBody');
const productCountSpan = document.getElementById('productCount');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');
const successMessage = document.getElementById('successMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  attachEventListeners();
});

// Event Listeners
function attachEventListeners() {
  productForm.addEventListener('submit', handleFormSubmit);
  clearBtn.addEventListener('click', clearForm);
  searchBtn.addEventListener('click', handleSearch);
  resetBtn.addEventListener('click', resetSearch);
}

// Load all products
async function loadProducts() {
  showLoading(true);
  hideError();

  try {
    const response = await fetch(`${API_URL}/products`);
    const result = await response.json();

    if (result.success) {
      displayProducts(result.data);
      productCountSpan.textContent = result.data.length;
    } else {
      showError('Failed to load products');
    }
  } catch (error) {
    showError('Error connecting to server: ' + error.message);
  } finally {
    showLoading(false);
  }
}

// Display products in table
function displayProducts(products) {
  if (products.length === 0) {
    productsTableBody.innerHTML = '<tr><td colspan="6" class="no-data">No products found. Add one to get started!</td></tr>';
    return;
  }

  productsTableBody.innerHTML = products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.category}</td>
      <td>${product.stock}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);
  const category = productCategoryInput.value.trim();
  const stock = parseInt(productStockInput.value);

  if (!name || !price || !category || isNaN(stock)) {
    showError('Please fill all fields correctly');
    return;
  }

  if (isEditMode && editingProductId) {
    await updateProduct();
  } else {
    await createProduct(name, price, category, stock);
  }
}

// Create new product
async function createProduct(name, price, category, stock) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, category, stock })
    });

    const result = await response.json();

    if (result.success) {
      showSuccess('Product created successfully!');
      clearForm();
      loadProducts();
    } else {
      showError(result.message);
    }
  } catch (error) {
    showError('Error creating product: ' + error.message);
  }
}

// Edit product - Load data into form
async function editProduct(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const result = await response.json();

    if (result.success) {
      const product = result.data;
      productIdInput.value = product.id;
      productNameInput.value = product.name;
      productPriceInput.value = product.price;
      productCategoryInput.value = product.category;
      productStockInput.value = product.stock;

      isEditMode = true;
      editingProductId = product.id;
      submitBtn.textContent = 'Update Product';
      submitBtn.style.background = '#28a745';

      // Scroll to form
      document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } else {
      showError('Failed to load product');
    }
  } catch (error) {
    showError('Error loading product: ' + error.message);
  }
}

// Update product
async function updateProduct() {
  const id = editingProductId;
  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);
  const category = productCategoryInput.value.trim();
  const stock = parseInt(productStockInput.value);

  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, category, stock })
    });

    const result = await response.json();

    if (result.success) {
      showSuccess('Product updated successfully!');
      clearForm();
      loadProducts();
    } else {
      showError(result.message);
    }
  } catch (error) {
    showError('Error updating product: ' + error.message);
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (result.success) {
      showSuccess('Product deleted successfully!');
      loadProducts();
    } else {
      showError(result.message);
    }
  } catch (error) {
    showError('Error deleting product: ' + error.message);
  }
}

// Search products
async function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    showError('Please enter a search term');
    return;
  }

  showLoading(true);
  hideError();

  try {
    const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
    const result = await response.json();

    if (result.success) {
      displayProducts(result.data);
      productCountSpan.textContent = result.data.length;
      showSuccess(`Found ${result.data.length} product(s)`);
    } else {
      showError(result.message);
    }
  } catch (error) {
    showError('Error searching products: ' + error.message);
  } finally {
    showLoading(false);
  }
}

// Reset search and reload all products
function resetSearch() {
  searchInput.value = '';
  loadProducts();
  hideError();
}

// Clear form
function clearForm() {
  productForm.reset();
  productIdInput.value = '';
  isEditMode = false;
  editingProductId = null;
  submitBtn.textContent = 'Add Product';
  submitBtn.style.background = '';
}

// Show/Hide helpers
function showLoading(show) {
  loadingMessage.style.display = show ? 'block' : 'none';
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function hideError() {
  errorMessage.style.display = 'none';
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = 'block';

  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 3000);
}
