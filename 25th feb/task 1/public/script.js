// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

// Navigation
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons and sections
    navBtns.forEach(b => b.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // Add active class to clicked button and corresponding section
    btn.classList.add('active');
    const sectionId = btn.getAttribute('data-section');
    document.getElementById(sectionId).classList.add('active');
  });
});

// ===== VIEW ALL BOOKS =====
const refreshBtn = document.getElementById('refreshBtn');
const allBooksContainer = document.getElementById('allBooksContainer');

refreshBtn.addEventListener('click', loadAllBooks);

async function loadAllBooks() {
  try {
    refreshBtn.disabled = true;
    refreshBtn.textContent = '⏳ Loading...';
    
    const response = await fetch('/api/books');
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      allBooksContainer.innerHTML = result.data
        .map(
          book => `
        <div class="book-card">
          <div class="book-info">
            <h3>📖 ${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Year:</strong> ${book.year || 'N/A'}</p>
            <p><strong>ID:</strong> ${book.id}</p>
          </div>
          <div class="book-actions">
            <button class="btn btn-warning" onclick="editBook(${book.id})">✏️ Edit</button>
            <button class="btn btn-danger" onclick="deleteBook(${book.id})">🗑️ Delete</button>
          </div>
        </div>
      `
        )
        .join('');
    } else {
      allBooksContainer.innerHTML = '<p>No books found in database.</p>';
    }

    refreshBtn.disabled = false;
    refreshBtn.textContent = '🔄 Refresh';
  } catch (error) {
    allBooksContainer.innerHTML = `<p style="color: red;">Error loading books: ${error.message}</p>`;
    refreshBtn.disabled = false;
    refreshBtn.textContent = '🔄 Refresh';
  }
}

// Load books on page load
loadAllBooks();

// ===== SEARCH BOOK =====
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchResult = document.getElementById('searchResult');

searchBtn.addEventListener('click', searchBook);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBook();
});

async function searchBook() {
  const title = searchInput.value.trim();

  if (!title) {
    showResult(searchResult, 'Please enter a book title', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/search?title=${encodeURIComponent(title)}`);
    const result = await response.json();

    if (result.success) {
      const book = result.data;
      searchResult.innerHTML = `
        <div style="padding: 15px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px;">
          <h3>✅ Book Found!</h3>
          <p><strong>Title:</strong> ${book.title}</p>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Year:</strong> ${book.year}</p>
          <p><strong>ID:</strong> ${book.id}</p>
        </div>
      `;
      searchResult.classList.add('show', 'success');
    } else {
      searchResult.innerHTML = `
        <div style="padding: 15px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;">
          <h3>❌ Book Not Found</h3>
          <p>No book found with title containing "${title}"</p>
        </div>
      `;
      searchResult.classList.add('show', 'error');
    }
  } catch (error) {
    showResult(searchResult, `Error: ${error.message}`, 'error');
  }
}

// ===== ADD BOOK =====
const addBookForm = document.getElementById('addBookForm');
const addResult = document.getElementById('addResult');

addBookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('titleInput').value.trim();
  const author = document.getElementById('authorInput').value.trim();
  const year = document.getElementById('yearInput').value || null;

  if (!title || !author) {
    showResult(addResult, 'Please fill in all required fields', 'error');
    return;
  }

  try {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, year: year ? parseInt(year) : null })
    });

    const result = await response.json();

    if (result.success) {
      showResult(
        addResult,
        `✅ Success! Book "${result.data.title}" added with ID ${result.data.id}`,
        'success'
      );
      addBookForm.reset();
      loadAllBooks(); // Refresh the books list
    } else {
      showResult(addResult, `Error: ${result.error}`, 'error');
    }
  } catch (error) {
    showResult(addResult, `Error: ${error.message}`, 'error');
  }
});

// ===== DELETE BOOK =====
async function deleteBook(id) {
  if (!confirm('Are you sure you want to delete this book?')) return;

  try {
    const response = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    const result = await response.json();

    if (result.success) {
      alert(`✅ Book deleted successfully!`);
      loadAllBooks(); // Refresh the books list
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// ===== EDIT BOOK =====
function editBook(id) {
  const newTitle = prompt('Enter new title (or leave blank to keep current):');
  const newAuthor = prompt('Enter new author (or leave blank to keep current):');
  const newYear = prompt('Enter new year (or leave blank to keep current):');

  if (!newTitle && !newAuthor && !newYear) return;

  const updateData = {};
  if (newTitle) updateData.title = newTitle;
  if (newAuthor) updateData.author = newAuthor;
  if (newYear) updateData.year = parseInt(newYear);

  fetch(`/api/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert('✅ Book updated successfully!');
        loadAllBooks();
      } else {
        alert(`Error: ${result.message}`);
      }
    })
    .catch(error => alert(`Error: ${error.message}`));
}

// Helper function to show results
function showResult(element, message, type) {
  element.textContent = message;
  element.classList.add('show', type);
  element.classList.remove(type === 'success' ? 'error' : 'success');
  setTimeout(() => {
    element.classList.remove('show');
  }, 5000);
}
