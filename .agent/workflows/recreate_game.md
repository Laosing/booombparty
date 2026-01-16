---
description: Comprehensive plan to recreate the BombParty game
---

# Project: AI-Powered Word Bomb Game (BombParty Clone)

## Role & Objective

You are an expert full-stack game developer specializing in real-time updates and WebSocket-based applications. Your goal is to recreate a high-fidelity clone of the popular "BombParty" word game (as seen on JKLM.fun). This text serves as a comprehensive design specification and prompt for generating the application.

## Game Overview

"Word Bomb" is a fast-paced multiplayer "hot potato" typing game. Players take turns forming words containing a specific substring of letters (the "syllable" or "prompt") before a bomb explodes.

### Core Gameplay Loop

1. **Lobby**: Players join a room. They can spectate or click "Join Game".
2. **Start**: The round begins. A "bomb" timer starts ticking.
3. **Turn**:
   - A random player is selected.
   - A random syllable is displayed (e.g., "HA").
   - The player must type a valid English word containing "HA" (e.g., "HAT", "SHARK", "HALLWAY").
4. **Validation**:
   - Word must contain the syllable.
   - Word must be in the valid dictionary.
   - Word must NOT have been used in the current game (no repeats).
5. **Success**:
   - If valid, the bomb resets.
   - The turn passes to the next player.
   - A _new_ syllable is generated.
   - The timer potentially speeds up (optional).
6. **Failure (Explosion)**:
   - If the timer runs out, the bomb explodes.
   - The active player loses a "Life" (Heart).
   - If lives reach 0, the player is eliminated (or moves to last place/spectator).
7. **Winning**: The last player with lives remaining wins.

## Detailed Feature Specifications

### 1. Game Mechanics

- **Syllable Generation**:
  - Generate 2-3 letter substrings (e.g., "AB", "ING", "QU").
  - **CRITICAL**: The system must ensure the syllable is _possible_ (i.e., at least min_words exist in the dictionary containing it).
- **Dictionary**:
  - Use a comprehensive English dictionary (approx 200k+ words).
  - Fast lookup (O(1) time complexity desirable).
- **Lives System**: Default to 3 lives. Visualized as hearts.
- **Alphabet Bonus**:
  - Display the full alphabet (A-Z) on screen.
  - When a player uses a letter in a valid word, that letter "lights up" for them.
  - If a player lights up all 26 letters, they gain +1 Life.
- **Timer Mechanics**:
  - Visual fuse/countdown.
  - "Tick" sound effect increasing in tempo.
  - Timer duration can be set in lobby options (default 10-15s).

### 2. Networking & Real-time (WebSockets)

- **Technology Recommendation**: `PartyKit` (Cloudflare Workers) or `Socket.io` (Node.js).
- **State Management**: The Server is the single source of truth.
  - Server maintains: `CurrentPlayer`, `CurrentSyllable`, `TimerValue`, `Lives`, `WordHistory`.
  - Client sends: `SubmitWord`, `JoinRoom`.
  - Server broadcasts: `GameStateUpdate`, `TimeSync`, `ExplosionEvent`.
- **Latency Handling**: Client should predictively clear input upon "Enter" but wait for server confirmation to play the "Success" sound.

### 3. UI/UX & Aesthetics

- **Layout**:
  - **Center**: The key action area. Big input box, clear Syllable display, Bobbing Bomb animation.
  - **Sides/Bottom**: List of players, avatars, and their current lives/status.
  - **Chat**: A chat box for casual conversation separate from the game input.
- **Feedback**:
  - **Valid Word**: Green flash, satisfying "ding", bomb passes instantly.
  - **Invalid Word**: Red shake, "buzz" sound, error message (e.g., "Already used!", "NotInDictionary").
  - **Explosion**: Screen shake, explosion particles, avatar turns into a skeleton/ghost for a moment.
- **Avatars**: Simple identifiable icons or generated avatars for players.

### 4. Technical Constraints & Bonus Features

- **Strict Strictness**: Words usually must be >2 letters.
- **Anti-Cheat**: Rate limit inputs. Prevent copy-pasting massive blocks of text.
- **Mobile Support**: Virtual keyboard handling is critical (ensure input field stays visible).

## Implementation Workflow

// turbo

1.  **Setup**: Initialize a TypeScript project with a frontend (React/Vite) and a WebSocket backend (PartyKit recommended).
2.  **Dictionary**: Create a `DictionaryManager` class that loads a word list and has method `isValid(word, syllable)`.
3.  **Game State**: Create a `GameRoom` class on the server handling the queue of players and the turn logic.
4.  **Frontend**: Build the `GameCanvas` component that listens to socket events and renders the bomb/input.
5.  **Refinement**: precise timer sync and "smooth" animations for the bomb passing.
