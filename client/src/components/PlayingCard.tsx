import { type Card } from "@shared/schema";
import { motion } from "framer-motion";

interface PlayingCardProps {
  card: Card;
  index?: number;
}

const suitSymbols = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const suitColors = {
  hearts: "text-red-600",
  diamonds: "text-red-600",
  clubs: "text-gray-900",
  spades: "text-gray-900",
};

export function PlayingCard({ card, index = 0 }: PlayingCardProps) {
  if (card.hidden) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.2 }}
        className="relative w-20 md:w-24 aspect-card rounded-md shadow-lg"
        data-testid={`card-hidden-${index}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-md border-2 border-blue-700">
          <div className="absolute inset-2 rounded-sm border border-blue-600/30">
            <div className="w-full h-full flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1 opacity-40">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2 h-3 bg-blue-600/50 rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const suitSymbol = suitSymbols[card.suit];
  const suitColor = suitColors[card.suit];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.2 }}
      className="relative w-20 md:w-24 aspect-card rounded-md shadow-lg"
      data-testid={`card-${card.rank}-${card.suit}`}
    >
      <div className="absolute inset-0 bg-white rounded-md border-2 border-gray-300">
        <div className="absolute inset-0 p-2 flex flex-col">
          <div className="flex flex-col items-start">
            <span className={`text-lg md:text-xl font-bold leading-none ${suitColor}`}>
              {card.rank}
            </span>
            <span className={`text-xl md:text-2xl leading-none ${suitColor}`}>
              {suitSymbol}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className={`text-4xl md:text-5xl ${suitColor}`}>
              {suitSymbol}
            </span>
          </div>
          <div className="flex flex-col items-end rotate-180">
            <span className={`text-lg md:text-xl font-bold leading-none ${suitColor}`}>
              {card.rank}
            </span>
            <span className={`text-xl md:text-2xl leading-none ${suitColor}`}>
              {suitSymbol}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
