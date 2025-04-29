# Multiplayer Tic Tac Toe using WebSockets
Welcome to the Multiplayer Tic Tac Toe game built using WebSockets! This game allows players to join a game room, play Tic Tac Toe in real-time, and enjoy an interactive multiplayer experience.

![image](https://github.com/user-attachments/assets/177ab6bd-1903-4bf2-b4cd-942282efa77f)


- Real-time interaction with players.

- Players can either create a new game or join an existing game using a Game ID.

- The game board adjusts based on the number of players (3x3 or 4x4).

- Symbols (X, O, ∆) and colors are dynamically assigned to players.

- Moves are broadcasted in real-time to all connected players.

## Features
- WebSocket Connection: Real-time updates for game state and moves.

- Dynamic Board Size: Adjusts the game board to accommodate up to 3 players.

- Player Information: Displays player IDs, symbols, and colors.

- Game Creation & Joining: Easily create a new game or join an existing one using a Game ID.

- Secure WebSocket (WSS): Encrypted communication between the client and server.

## Installation
To run this project locally, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/tarashdeepsingh/WSpractice.git
cd WSpractice
```

2. Install dependencies:
```bash
npm install
```

3. Start server:
```bash
node index.js
```

4. Open the game:
```bash
http://localhost:9091
```
5. Use NGROK for temporary deployment
- You can use NGROK for temporary deployment to play with your friends.
- For that replace

`let ws = new WebSocket("ws://" + window.location.host);`

with a web socket secure connection

`let ws = new WebSocket("wss://" + window.location.host);`
