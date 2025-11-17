# 🎰 Blackjack Game

A fully-featured, web-based Blackjack card game with casino-style aesthetics. Built with React, TypeScript, and Node.js.

![Blackjack Game](https://img.shields.io/badge/Game-Blackjack-green) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

## ✨ Features

- **Classic Blackjack Gameplay**: Play against a dealer with authentic casino rules
- **Smart Dealer AI**: Dealer automatically hits on 16 and stands on 17
- **Chip Balance Tracking**: Start with $1,000 in chips and track your winnings
- **Instant Blackjack Detection**: Natural blackjacks are detected immediately
- **Beautiful Casino Design**: 
  - Green felt table background with gradient effects
  - Professional playing cards with suit symbols (♥ ♦ ♣ ♠)
  - Smooth card dealing animations
  - Dramatic win/loss overlay notifications
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Full Game Rules**:
  - Blackjack pays +$150
  - Win pays +$100
  - Loss costs -$100
  - Push (tie) pays $0
  - Automatic Ace value handling (11 or 1)

## 🎮 How to Play

1. Click **NEW GAME** to start a round
2. You and the dealer each receive 2 cards (dealer's second card is hidden)
3. Choose your action:
   - **HIT**: Take another card
   - **STAND**: End your turn and let the dealer play
4. Try to get as close to 21 as possible without going over
5. Beat the dealer's hand to win!

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI component library
- **Framer Motion** - Animations
- **TanStack Query** - Server state management
- **Wouter** - Client-side routing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **In-memory storage** - Game state management

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/epakhomov/blackjack-game.git
cd blackjack-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
blackjack-game/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── PlayingCard.tsx
│   │   │   ├── Hand.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── StatusOverlay.tsx
│   │   │   └── ui/        # Shadcn UI components
│   │   ├── pages/         # Page components
│   │   │   └── Blackjack.tsx
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Root component
│   └── index.html
├── server/                # Backend Express server
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Game logic and state
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Zod schemas for validation
└── package.json
```

## 🎯 Game Logic

### Card Values
- Number cards (2-10): Face value
- Face cards (J, Q, K): 10 points
- Ace: 11 or 1 (automatically calculated for best hand)

### Dealer Rules
- Dealer must hit on 16 or below
- Dealer must stand on 17 or above
- Dealer's second card is hidden until player stands

### Winning Conditions
- **Blackjack**: Natural 21 with first two cards (+$150)
- **Win**: Higher value than dealer without busting (+$100)
- **Push**: Same value as dealer ($0)
- **Bust**: Hand value exceeds 21 (-$100)
- **Dealer Wins**: Dealer has higher value (-$100)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - Type check with TypeScript

## 🎨 Design Philosophy

The game features a casino-inspired aesthetic with:
- Rich green felt table background
- Gold accent colors for premium feel
- Card animations for realistic dealing
- Clear typography with Righteous accent font
- Smooth transitions and hover effects
- Professional spacing and layout

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📝 License

This project is open source and available under the MIT License.

## 🎲 Future Enhancements

Potential features for future releases:
- Betting system with variable bet amounts
- Split hands functionality
- Double down option
- Insurance bets
- Multiple players
- Sound effects and music
- Game statistics and history
- Achievement system

---

**Enjoy the game and good luck at the tables!** 🎰♠️♥️♣️♦️
