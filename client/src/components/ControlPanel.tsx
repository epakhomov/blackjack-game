import { Button } from "@/components/ui/button";
import { Coins, Plus, Hand } from "lucide-react";

interface ControlPanelProps {
  chipBalance: number;
  gameStatus: string;
  onHit: () => void;
  onStand: () => void;
  onNewGame: () => void;
  disabled?: boolean;
}

export function ControlPanel({
  chipBalance,
  gameStatus,
  onHit,
  onStand,
  onNewGame,
  disabled = false,
}: ControlPanelProps) {
  const safeChipBalance = chipBalance ?? 0;
  const canPlayActions = gameStatus === "playing";
  const showNewGameButton = gameStatus === "betting" || gameStatus === "finished";

  return (
    <div className="w-full bg-black/40 backdrop-blur-md border-t-2 border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3" data-testid="display-chip-balance">
            <Coins className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
            <div className="text-center md:text-left">
              <div className="text-sm text-white/70">Chip Balance</div>
              <div className="text-2xl md:text-3xl font-bold text-secondary">
                ${safeChipBalance.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex gap-3 md:gap-4 w-full md:w-auto">
            {showNewGameButton ? (
              <Button
                size="lg"
                variant="outline"
                onClick={onNewGame}
                disabled={disabled}
                className="flex-1 md:flex-none px-12 py-6 text-lg font-bold bg-primary/20 hover:bg-primary/30 border-primary/50"
                data-testid="button-new-game"
              >
                NEW GAME
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={onHit}
                  disabled={!canPlayActions || disabled}
                  className="flex-1 md:flex-none px-8 py-6 text-lg font-bold"
                  data-testid="button-hit"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  HIT
                </Button>
                <Button
                  size="lg"
                  onClick={onStand}
                  disabled={!canPlayActions || disabled}
                  className="flex-1 md:flex-none px-8 py-6 text-lg font-bold"
                  data-testid="button-stand"
                >
                  <Hand className="w-5 h-5 mr-2" />
                  STAND
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
