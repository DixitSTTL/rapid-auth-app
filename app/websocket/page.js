'use client';

import { useState, useRef } from 'react';

export default function WebSocketDemo() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  const connect = () => {
    if (wsRef.current) return;

    try {
      const ws = new WebSocket('ws://localhost:8080');
      wsRef.current = ws;

      // Set a timeout for connection
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
          addMessage('Connection timeout. Make sure the WebSocket server is running.');
        }
      }, 5000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('Connected to WebSocket');
        setIsConnected(true);
        addMessage('Connected to WebSocket server');
      };

      ws.onmessage = (event) => {
        console.log('Received:', event.data);
        addMessage(`Server: ${event.data}`);
      };

    ws.onclose = () => {
      clearTimeout(connectionTimeout);
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      addMessage('Disconnected from WebSocket server');
      wsRef.current = null;
    };

    ws.onerror = (error) => {
      clearTimeout(connectionTimeout);
      console.error('WebSocket error:', error);
      addMessage(`WebSocket error: ${error.type || 'Unknown error'}. Make sure the server is running on port 8080.`);
    };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      addMessage('Failed to create WebSocket connection');
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && inputMessage.trim()) {
      wsRef.current.send(inputMessage);
      addMessage(`You: ${inputMessage}`);
      setInputMessage('');
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">WebSocket Demo</h1>

        {/* Connection Status */}
        <div className="mb-6 p-4 rounded-lg bg-slate-100 border border-slate-200">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
            <span className="text-sm font-medium text-slate-700">
              {isConnected ? 'Connected to WebSocket server' : 'Disconnected from WebSocket server'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <button
              onClick={connect}
              disabled={isConnected}
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
            >
              {isConnected ? 'Connected' : 'Connect'}
            </button>
            <button
              onClick={disconnect}
              disabled={!isConnected}
              className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
            >
              Disconnect
            </button>
          </div>

          {/* Message Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
              disabled={!isConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="border border-slate-200 rounded-lg p-4 h-96 overflow-y-auto bg-slate-50 mb-6">
          <h2 className="font-semibold mb-3 text-slate-700 sticky top-0 bg-slate-50 pb-2">Messages:</h2>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <p>No messages yet. Connect and send a message!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="text-sm p-3 bg-black rounded-lg border-l-4 border-indigo-500 shadow-sm">
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-slate-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="font-semibold mb-2 text-slate-800">📋 Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-700">
            <li>WebSocket server is running on port 8080</li>
            <li>Next.js app is running on port 3002</li>
            <li>Click &quot;Connect&quot; to connect to the WebSocket server</li>
            <li>Type a message and press Enter or click &quot;Send&quot;</li>
            <li>The server will echo your message back</li>
          </ol>
          <p className="mt-3 text-emerald-600 font-medium">
            ✅ Both servers are running. If you see connection errors, check the browser console for details.
          </p>
        </div>
      </div>
    </div>
  );
}