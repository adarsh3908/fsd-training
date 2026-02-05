const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MESSAGE_FILE = path.join(__dirname, 'message.txt');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    // Read and display message.txt
    fs.readFile(MESSAGE_FILE, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading message.txt: ' + err.message);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Reading content from message.txt`);
});
