# Blackjack Game - Design Guidelines

## Design Approach
**Hybrid Approach**: Casino-inspired visual richness with utility-focused game interface. Draw inspiration from premium online casino games (888 Casino, PokerStars) for authentic casino aesthetics while prioritizing clear, efficient gameplay controls.

## Typography System
- **Primary Font**: Inter or Roboto (clean, highly legible for game information)
- **Accent Font**: Bebas Neue or Righteous (bold casino signage feel for titles/headers)
- **Hierarchy**:
  - Game Title: text-4xl to text-5xl, accent font, bold
  - Hand Values: text-3xl to text-4xl, primary font, semibold
  - Chip Balance: text-2xl, primary font, medium
  - Action Buttons: text-lg, primary font, semibold
  - Card Labels: text-sm, primary font, regular

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- Component padding: p-4 to p-8
- Section gaps: gap-4 to gap-6
- Card spacing: space-x-2 to space-x-4

**Game Table Layout**:
- Full viewport height (min-h-screen) centered game area
- max-w-6xl container for game content
- Vertical stack: Dealer area → Table center → Player area → Controls

## Component Library

### Game Table Container
- Centered layout with subtle depth (shadow-2xl)
- Rounded corners (rounded-2xl) for modern casino aesthetic
- Full bleed felt texture as background

### Card Display System
- **Card Dimensions**: Aspect ratio 2:3 (standard playing card)
- **Card Size**: w-20 to w-24 on desktop, w-16 on mobile
- **Card Stack**: Horizontal overlap using negative margins (-ml-8)
- **Card Shadow**: Drop shadow for depth (shadow-lg)
- **Card Flip Animation**: Minimal rotate animation on deal (300ms ease)

### Dealer Section (Top Third)
- Cards displayed horizontally centered
- Dealer hand value positioned above cards
- "Dealer" label with accent font
- Adequate spacing from top edge (pt-12)

### Player Section (Bottom Third)
- Cards displayed horizontally centered
- Player hand value positioned below cards
- "Player" label with accent font
- Visual emphasis (slightly larger cards than dealer)

### Control Panel (Bottom Fixed)
- Fixed bottom positioning with backdrop blur
- Horizontal button group with equal spacing (gap-4)
- Three primary actions: "Hit", "Stand", "New Game"
- Chip balance display prominently to the right
- Full-width container with px-8 py-6

### Button Specifications
- **Primary Action Buttons** (Hit/Stand): 
  - Large touch targets (px-8 py-4)
  - Rounded (rounded-xl)
  - Heavy font weight (font-bold)
  - Icon + text combination
- **Secondary Action** (New Game):
  - Outlined style
  - Same sizing as primary
- **Disabled State**: Reduced opacity (opacity-50)

### Status Messages
- Centered overlay for game outcomes (Win/Lose/Push/Blackjack!)
- Large, bold typography (text-6xl)
- Accent font for drama
- Fade-in animation (200ms)
- Positioned center of table area

### Chip Balance Tracker
- Persistent display in control panel
- Icon (poker chip) + numerical value
- Running total format: "$1,000"
- Highlight on change (subtle scale animation)

## Images

**Background Image**:
- Casino green felt texture (seamless, high quality)
- Full coverage of game table container
- Subtle grain/texture for authenticity
- No hero section needed - immediate gameplay focus

**Card Graphics**:
- Standard playing card designs (SVG preferred)
- Clean, readable suits and values
- Card back design for dealer's hidden card
- Use established card deck library (e.g., deck-of-cards package)

**Casino Elements**:
- Poker chip icon for balance display
- Subtle decorative corner elements (optional card suit symbols)

## Animations (Minimal, Purpose-Driven)
- Card deal: Quick slide-in from deck position (200ms)
- Card flip: Dealer reveal animation (300ms)
- Win/lose message: Fade and gentle scale entrance
- Chip balance: Subtle highlight pulse on change
- NO continuous background animations or distractions

## Interaction States
- Hover: Slight lift (translateY) on action buttons
- Active: Quick scale down (scale-95)
- Disabled: Reduced opacity with no pointer events
- Focus: Clear ring for keyboard navigation

## Responsive Behavior
- **Desktop (lg+)**: Full card size, horizontal layout
- **Tablet (md)**: Slightly reduced card size, maintain horizontal
- **Mobile (base)**: Smaller cards (w-14), compact spacing, full-width buttons stacked

## Accessibility
- Clear focus indicators on all interactive elements
- Adequate color contrast for text over felt background
- Screen reader announcements for game state changes
- Keyboard navigation for all actions (Space for Hit, Enter for Stand)
- ARIA labels for card values and game status