# Blackjack Game

## Overview

A web-based Blackjack card game application where players compete against a dealer. Built with a modern TypeScript stack featuring React on the frontend and Express on the backend. The game implements classic Blackjack rules including hit, stand, blackjack detection, and chip balance tracking. Features a casino-inspired UI with card animations and real-time game state management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite as the build tool

**UI Component Library**: Shadcn/ui (Radix UI primitives) with the "new-york" style preset
- Comprehensive component system including dialogs, buttons, cards, forms, and navigation
- Tailwind CSS for styling with custom design tokens
- CSS variables for theming support with light/dark mode capability

**State Management**: 
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks for UI interactions
- Query client configured with conservative refetch policies (no window focus refetch, infinite stale time)

**Routing**: Wouter for lightweight client-side routing

**Animation**: Framer Motion for card dealing animations and status overlays

**Design System**:
- Typography: Inter/Roboto (primary), Bebas Neue/Righteous (accent/headers)
- Casino-inspired aesthetic with felt textures and premium visual effects
- Responsive design with mobile-first breakpoints
- Custom aspect ratio for playing cards (2:3)
- Tailwind spacing primitives (units of 2, 4, 6, 8)

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful endpoints
- `GET /api/game` - Retrieve current game state
- `POST /api/game/action` - Execute game actions (new_game, hit, stand)

**Game Logic**: Server-side implementation
- Deck creation and shuffling algorithms
- Hand value calculation with Ace handling (1 or 11)
- Winner determination logic
- Blackjack detection for both player and dealer
- Dealer AI (automated play on stand)

**Data Storage**: In-memory storage (MemStorage class)
- Implements IStorage interface for potential future database integration
- Stores complete game state including hands, deck, chip balance, and game status
- Session-based state persistence

**Request/Response Flow**:
- JSON body parsing with raw body preservation for verification
- Request logging middleware for API calls with duration tracking
- Zod schema validation for incoming game actions
- Structured error handling with appropriate HTTP status codes

### Data Model

**Game State Schema** (Zod validated):
- `playerHand`: Array of card objects
- `dealerHand`: Array of card objects (supports hidden cards)
- `deck`: Remaining cards in the deck
- `gameStatus`: Enum of "betting" | "playing" | "dealer_turn" | "finished"
- `result`: Enum of "win" | "lose" | "push" | "blackjack" | ""
- `chipBalance`: Player's current chip count (starts at 1000)
- `playerValue`: Calculated hand value
- `dealerValue`: Calculated hand value (excluding hidden cards during play)

**Card Schema**:
- `suit`: "hearts" | "diamonds" | "clubs" | "spades"
- `rank`: "A" | "2"-"10" | "J" | "Q" | "K"
- `hidden`: Optional boolean for dealer's face-down card

**Game Actions**: Type-safe actions validated via Zod
- `new_game`: Starts a fresh game with new deck
- `hit`: Deals another card to player
- `stand`: Ends player's turn and triggers dealer AI

### Development Tooling

**Build System**: 
- Vite for frontend with React plugin
- esbuild for backend bundling (ESM format)
- TypeScript compilation checking (noEmit mode)

**Path Aliases**:
- `@/*` → Client source files
- `@shared/*` → Shared schemas and types
- `@assets/*` → Static assets

**Development Environment**:
- Replit-specific plugins (cartographer, dev banner, runtime error modal)
- Hot module replacement for frontend
- tsx for server-side TypeScript execution

**Type Safety**: Strict TypeScript configuration
- Strict mode enabled across entire codebase
- ESNext module resolution with bundler mode
- Shared type definitions between client and server via Zod schemas

### External Dependencies

**Database**: Drizzle ORM configured for PostgreSQL
- Neon Database serverless driver (`@neondatabase/serverless`)
- Schema location: `./shared/schema.ts`
- Migrations directory: `./migrations`
- Currently using in-memory storage, but infrastructure ready for database integration
- Connection pool management via Neon serverless

**UI Component Libraries**:
- Radix UI primitives (20+ component packages for accessible UI elements)
- cmdk for command palette functionality
- embla-carousel-react for potential carousel features
- lucide-react for icon system

**Form Management**:
- React Hook Form for form state
- Hookform resolvers for validation integration
- Drizzle-Zod for database schema to Zod validation

**Styling**:
- Tailwind CSS with PostCSS processing
- Autoprefixer for cross-browser compatibility
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional class utilities

**Date Handling**: date-fns for date manipulation and formatting

**Animation**: Framer Motion for declarative animations

**Fonts**: Google Fonts integration
- Architects Daughter
- DM Sans
- Fira Code
- Geist Mono