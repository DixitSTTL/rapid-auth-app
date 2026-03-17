const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server started on port 8080');

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send a welcome message
  ws.send('Welcome to the demo WebSocket server!');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    // Echo the message back
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket demo server is running...');