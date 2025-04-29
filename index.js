const express = require("express");
const http = require("http");
const { server: WebSocketServer } = require("websocket");

const app = express();
const server = http.createServer(app); // One server for both Express and WebSocket

// Serve the index.html when the root route is accessed
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
server.listen(9091, () => console.log("Listening on port 9091 (HTTP + WebSocket)"));

// Initialize WebSocket server
const wsServer = new WebSocketServer({ httpServer: server });

const clients = {}; // Store connected clients
const games = {}; // Store ongoing games
const colors = ["#FF5733", "#33FF57", "#3357FF"]; // Player colors

// Handle incoming WebSocket requests
wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  const clientId = guid(); // Generate unique client ID
  clients[clientId] = { connection };

  // Send the client its ID upon connection
  connection.send(JSON.stringify({ method: "connect", clientId }));

  // Handle incoming messages from clients
  connection.on("message", (message) => {
    const result = JSON.parse(message.utf8Data);

    // Handle 'create' method to create a new game
    if (result.method === "create") {
      const gameId = guid(); // Generate unique game ID
      games[gameId] = {
        id: gameId,
        cells: 9, // Total cells in the game
        clients: [], // List of clients in the game
        state: {}, // Game state (cellId => {symbol, color})
      };

      // Send the game details back to the creator
      clients[clientId].connection.send(
        JSON.stringify({ method: "create", game: games[gameId] })
      );
    }

    // Handle join method to allow clients to join an existing game
    if (result.method === "join") {
      const game = games[result.gameId];
      if (!game || game.clients.length >= 3) return; // Limit of 3 players

      const symbol = { 0: "X", 1: "O", 2: "∆" }[game.clients.length]; // Assign symbol based on number of players
      const color = colors[game.clients.length]; // Assign color

      // Add client to the game
      game.clients.push({ clientId, symbol, color });

      // Notify all players in the game
      const payload = {
        method: "join",
        game: game,
        players: game.clients,
      };
      game.clients.forEach((c) =>
        clients[c.clientId].connection.send(JSON.stringify(payload))
      );
    }

    // Handle play method to update game state when a player makes a move
    if (result.method === "play") {
      const game = games[result.gameId];
      if (!game || game.state[result.cellId]) return; // Check if the cell is already taken

      // Update the game state with the new move
      game.state[result.cellId] = {
        symbol: result.symbol,
        color: result.color,
      };

      // Notify all players of the updated game state
      const payload = {
        method: "update",
        game: game,
        players: game.clients.map((c) => ({
          clientId: c.clientId,
          color: c.color,
        })),
      };
      game.clients.forEach((c) =>
        clients[c.clientId].connection.send(JSON.stringify(payload))
      );
    }
  });

  // Log when a client disconnects
  connection.on("close", () => console.log("Connection closed"));
});

/* 
 * Function to generate a unique identifier  
 */
function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}