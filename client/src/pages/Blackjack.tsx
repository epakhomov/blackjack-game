import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type GameState } from "@shared/schema";
import { Hand } from "@/components/Hand";
import { StatusOverlay } from "@/components/StatusOverlay";
import { ControlPanel } from "@/components/ControlPanel";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Blackjack() {
  const { toast } = useToast();
  const [showResult, setShowResult] = useState(false);

  const { data: gameState, isLoading } = useQuery<GameState>({
    queryKey: ["/api/game"],
  });

  const performAction = useMutation({
    mutationFn: async (action: "new_game" | "hit" | "stand") => {
      const response = await apiRequest("POST", "/api/game/action", { action });
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/game"], data);
      
      if (data.gameStatus === "finished" && data.result) {
        setShowResult(true);
        setTimeout(() => setShowResult(false), 3000);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to perform action",
        variant: "destructive",
      });
    },
  });

  const handleNewGame = () => {
    setShowResult(false);
    performAction.mutate("new_game");
  };

  const handleHit = () => {
    performAction.mutate("hit");
  };

  const handleStand = () => {
    performAction.mutate("stand");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center">
        <div className="text-4xl font-accent text-white">Loading...</div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-accent text-white mb-6">Welcome to Blackjack</h1>
          <button
            onClick={handleNewGame}
            className="px-8 py-4 bg-secondary text-secondary-foreground font-bold text-lg rounded-lg hover-elevate active-elevate-2"
            data-testid="button-start-game"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/50 via-accent/70 to-primary opacity-70" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-0 max-w-6xl mx-auto px-4 py-8 md:py-12 h-full flex flex-col justify-between">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-accent font-bold text-white drop-shadow-lg mb-2" data-testid="text-title">
              BLACKJACK
            </h1>
            <p className="text-white/80 text-lg">Beat the dealer to 21!</p>
          </div>

          <div className="space-y-12 md:space-y-16 flex-1 flex flex-col justify-around">
            <Hand
              cards={gameState.dealerHand}
              value={gameState.dealerValue}
              label="Dealer"
              showValue={gameState.gameStatus !== "playing"}
            />

            <Hand
              cards={gameState.playerHand}
              value={gameState.playerValue}
              label="Player"
            />
          </div>

          <StatusOverlay
            result={gameState.result || ""}
            visible={showResult && gameState.gameStatus === "finished"}
          />
        </div>
      </div>

      <ControlPanel
        chipBalance={gameState.chipBalance}
        gameStatus={gameState.gameStatus}
        onHit={handleHit}
        onStand={handleStand}
        onNewGame={handleNewGame}
        disabled={performAction.isPending}
      />
    </div>
  );
}
