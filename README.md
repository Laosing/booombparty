# 🎈 drewbox

drewbox is a collection of multiplayer games to play with your friends! Built with **React** and **PartyKit**, it offers real-time fun with zero setup.

## 🎮 Games Collection

Currently featuring:

- **BombParty**: A fast-paced word game where you must type a word containing a specific syllable before the bomb explodes!
- **WordChain**: Link words together where the next word must start with the last letter of the previous word.
- **Wordle**: A multiplayer take on the classic word guessing game.

## 🛠 Tech Stack

- **[PartyKit](https://partykit.io)**: For real-time serverless WebSocket infrastructure.
- **[React](https://react.dev)**: For the user interface.
- **[Vite](https://vitejs.dev)**: For fast development and building.
- **[DaisyUI](https://daisyui.com)** + **[Tailwind CSS](https://tailwindcss.com)**: For styling and themes.

## 🚀 Getting Started

### Development

To start the development environment locally:

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the development server (client + PartyKit server):

   ```bash
   pnpm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

> Note: The PartyKit server runs on port 1999, and the Vite client runs on port 5173.

### Deployment

To deploy your application to the PartyKit cloud:

```bash
pnpm run deploy
```

This command builds the client and deploys the server code to PartyKit.

## 📂 Project Structure

- **`app/`**: Client-side React application code.
  - **`components/`**: React components, including game implementations.
- **`party/`**: Server-side PartyKit code.
  - **`games/`**: Game logic handlers running on the server.
- **`shared/`**: Types and utilities shared between client and server.
