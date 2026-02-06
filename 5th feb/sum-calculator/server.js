const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/' && req.method === 'GET') {
    // Serve the HTML page
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  else if (pathname === '/api/calculate-sum' && req.method === 'POST') {
    // Calculate sum of 1 to 100000
    let sum = 0;
    for (let i = 1; i <= 100000; i++) {
      sum += i;
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      sum: sum, 
      status: 'task finished',
      message: `Sum of 1 to 100000 is: ${sum}`
    }));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Sum Calculator Server running on http://localhost:${PORT}`);
});
