const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3002;

// Function to calculate sum using a loop
function calculateSumLoop(limit) {
  let sum = 0;
  for (let i = 1; i <= limit; i++) {
    sum += i;
  }
  return sum;
}

// Function to calculate sum using mathematical formula (n * (n + 1) / 2)
function calculateSumFormula(limit) {
  return (limit * (limit + 1)) / 2;
}

// Function to calculate sum using reduce
function calculateSumReduce(limit) {
  const arr = Array.from({ length: limit }, (_, i) => i + 1);
  return arr.reduce((sum, num) => sum + num, 0);
}

// Function to perform non-blocking calculation with timeouts
function performNonBlockingCalculation(limit) {
  console.log('Request received - Starting setTimeout BEFORE calculation...');
  
  // setTimeout BEFORE calculation (2 seconds)
  setTimeout(() => {
    console.log('setTimeout BEFORE completed - Starting calculation...');
    
    // Calculate sum using all methods
    const resultLoop = calculateSumLoop(limit);
    console.log(`Loop method result: ${resultLoop}`);
    
    const resultFormula = calculateSumFormula(limit);
    console.log(`Formula method result: ${resultFormula}`);
    
    const resultReduce = calculateSumReduce(limit);
    console.log(`Reduce method result: ${resultReduce}`);
    
    console.log('Calculation completed - Starting setTimeout AFTER...');
    console.log('All methods match:', resultLoop === resultFormula && resultFormula === resultReduce);
    
    // setTimeout AFTER calculation (2 seconds)
    setTimeout(() => {
      console.log('setTimeout AFTER completed - Response would be sent here');
    }, 2000);
  }, 2000);
}

// Function to handle calculation requests (sends response immediately)
function handleCalculationRequest(res, limit = 100000) {
  console.log('Request received at', new Date().toISOString());
  
  // Send immediate response first (non-blocking)
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    sum: limit > 100000 ? 'calculating...' : calculateSumFormula(limit),
    status: 'task finished',
    message: `Non-blocking calculation started (2s before + calculation + 2s after)`,
    startTime: new Date().toISOString()
  }));
  
  console.log('Response sent immediately to client (non-blocking)');
  
  // Start non-blocking calculation in background
  setTimeout(() => {
    performNonBlockingCalculation(limit);
  }, 0); // 0 delay - pushed to event loop
}

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
    handleCalculationRequest(res);
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Sum Calculator with Non-Blocking Timeouts running on http://localhost:${PORT}`);
  console.log('Pattern: setTimeout BEFORE (2s) -> Calculate -> setTimeout AFTER (2s)');
  console.log('Response sent immediately (non-blocking)');
});
