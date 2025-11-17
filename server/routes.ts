import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, createDeck, calculateHandValue, determineWinner, createDeckExcludingCards } from "./storage";
import { gameActionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/game", async (req, res) => {
    try {
      const gameState = await storage.getGameState();
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ error: "Failed to get game state" });
    }
  });

  app.post("/api/game/action", async (req, res) => {
    try {
      const validatedAction = gameActionSchema.parse(req.body);
      const gameState = await storage.getGameState();
      const { action } = validatedAction;

      if (action === "new_game") {
        const deck = createDeck();
        const playerHand = [deck.pop()!, deck.pop()!];
        let dealerHand = [deck.pop()!, { ...deck.pop()!, hidden: true }];

        const playerValue = calculateHandValue(playerHand);
        let dealerValue = calculateHandValue(dealerHand.filter(c => !c.hidden));

        const playerHasBlackjack = playerValue === 21 && playerHand.length === 2;
        const dealerFullValue = calculateHandValue(dealerHand.map(c => ({ ...c, hidden: false })));
        const dealerHasBlackjack = dealerFullValue === 21 && dealerHand.length === 2;

        if (playerHasBlackjack || dealerHasBlackjack) {
          dealerHand = dealerHand.map(c => ({ ...c, hidden: false }));
          dealerValue = dealerFullValue;
          
          const { result, chipChange } = determineWinner(
            playerValue,
            dealerValue,
            playerHand,
            dealerHand
          );

          const newState = {
            ...gameState,
            playerHand,
            dealerHand,
            deck,
            gameStatus: "finished" as const,
            result,
            chipBalance: gameState.chipBalance + chipChange,
            playerValue,
            dealerValue,
          };

          await storage.setGameState(newState);
          res.json(newState);
          return;
        }

        const newState = {
          ...gameState,
          playerHand,
          dealerHand,
          deck,
          gameStatus: "playing" as const,
          result: "",
          playerValue,
          dealerValue,
        };

        await storage.setGameState(newState);
        res.json(newState);
        return;
      }

      if (action === "hit") {
        if (gameState.gameStatus !== "playing") {
          return res.status(400).json({ error: "Cannot hit in current game state" });
        }

        let deck = [...gameState.deck];
        if (deck.length === 0) {
          const inPlayCards = [
            ...gameState.playerHand,
            ...gameState.dealerHand.map(c => ({ ...c, hidden: false }))
          ];
          deck = createDeckExcludingCards(inPlayCards);
        }

        const newCard = deck.pop();
        if (!newCard) {
          return res.status(500).json({ error: "Failed to deal card" });
        }

        const playerHand = [...gameState.playerHand, newCard];
        const playerValue = calculateHandValue(playerHand);

        if (playerValue > 21) {
          const dealerHand = gameState.dealerHand.map(c => ({ ...c, hidden: false }));
          const dealerValue = calculateHandValue(dealerHand);
          const { result, chipChange } = determineWinner(
            playerValue,
            dealerValue,
            playerHand,
            dealerHand
          );

          const newState = {
            ...gameState,
            playerHand,
            dealerHand,
            playerValue,
            dealerValue,
            deck,
            gameStatus: "finished" as const,
            result,
            chipBalance: gameState.chipBalance + chipChange,
          };

          await storage.setGameState(newState);
          res.json(newState);
          return;
        }

        const newState = {
          ...gameState,
          playerHand,
          playerValue,
          deck,
        };

        await storage.setGameState(newState);
        res.json(newState);
        return;
      }

      if (action === "stand") {
        if (gameState.gameStatus !== "playing") {
          return res.status(400).json({ error: "Cannot stand in current game state" });
        }

        let dealerHand = gameState.dealerHand.map(c => ({ ...c, hidden: false }));
        let dealerValue = calculateHandValue(dealerHand);
        let deck = [...gameState.deck];

        while (dealerValue < 17) {
          if (deck.length === 0) {
            const inPlayCards = [...gameState.playerHand, ...dealerHand];
            deck = createDeckExcludingCards(inPlayCards);
          }
          const newCard = deck.pop();
          if (!newCard) break;
          dealerHand = [...dealerHand, newCard];
          dealerValue = calculateHandValue(dealerHand);
        }

        const playerValue = gameState.playerValue;
        const { result, chipChange } = determineWinner(
          playerValue,
          dealerValue,
          gameState.playerHand,
          dealerHand
        );

        const newState = {
          ...gameState,
          dealerHand,
          dealerValue,
          deck,
          gameStatus: "finished" as const,
          result,
          chipBalance: gameState.chipBalance + chipChange,
        };

        await storage.setGameState(newState);
        res.json(newState);
        return;
      }

      res.status(400).json({ error: "Invalid action" });
    } catch (error) {
      console.error("Game action error:", error);
      res.status(500).json({ error: "Failed to process game action" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
