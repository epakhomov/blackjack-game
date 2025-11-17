import { type Card } from "@shared/schema";
import { PlayingCard } from "./PlayingCard";

interface HandProps {
  cards: Card[];
  value: number;
  label: string;
  showValue?: boolean;
}

export function Hand({ cards, value, label, showValue = true }: HandProps) {
  const safeCards = cards || [];
  
  return (
    <div className="flex flex-col items-center gap-4" data-testid={`hand-${label.toLowerCase()}`}>
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-accent font-bold text-white mb-1" data-testid={`text-${label.toLowerCase()}-label`}>
          {label}
        </h2>
        {showValue && safeCards.length > 0 && (
          <div className="text-3xl md:text-4xl font-semibold text-white" data-testid={`text-${label.toLowerCase()}-value`}>
            {value}
          </div>
        )}
      </div>
      <div className="flex gap-2 md:gap-3">
        {safeCards.length === 0 ? (
          <div className="w-20 md:w-24 aspect-card rounded-md border-2 border-dashed border-white/20 flex items-center justify-center">
            <span className="text-white/40 text-sm">Empty</span>
          </div>
        ) : (
          safeCards.map((card, index) => (
            <div
              key={`${card.suit}-${card.rank}-${index}`}
              style={{ marginLeft: index > 0 ? '-2rem' : '0' }}
            >
              <PlayingCard card={card} index={index} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
