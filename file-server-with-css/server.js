const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  try {
    // Default to index.html if root is requested
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(PUBLIC_DIR, filePath);

    // Security: Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Read the file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // File not found
          console.log(`File not found: ${filePath}`);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found - File does not exist');
        } else {
          // Internal server error
          console.error(`Server error: ${err.message}`);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
        }
      } else {
        // File found - determine content type
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.js') contentType = 'text/javascript';
        if (ext === '.json') contentType = 'application/json';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        console.log(`Served: ${filePath}`);
      }
    });
  } catch (err) {
    // Unexpected error
    console.error(`Unexpected error: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`File Server with CSS running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${PUBLIC_DIR}`);
  console.log('Supports: HTML, CSS, JS, JSON, Images');
  console.log('Error Handling:');
  console.log('  - 404: File not found');
  console.log('  - 500: Internal server error');
});
