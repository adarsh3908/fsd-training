const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3004;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  // Only serve index.html on root path
  if (req.url === '/') {
    const filePath = path.join(PUBLIC_DIR, 'index.html');
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        // 500 Internal Server Error
        console.error(`Server error: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else {
    // 404 Not Found for any other path
    console.log(`File not found: ${req.url}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`File Server running on http://localhost:${PORT}`);
  console.log('Only serving index.html on /');
  console.log('All other requests will return 404');
});
