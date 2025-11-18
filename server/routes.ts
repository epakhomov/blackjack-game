import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, createDeck, calculateHandValue, determineWinner, createDeckExcludingCards } from "./storage";
import { gameActionSchema } from "@shared/schema";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerRoutes(app: Express): Promise<Server> {
      // JWT authentication middleware
      function authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ error: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          req.user = decoded;
          next();
        } catch (err) {
          return res.status(401).json({ error: "Invalid token" });
        }
      }

      // Example protected route
      app.get("/api/protected", authenticateJWT, (req, res) => {
        res.json({ message: "This is a protected route", user: req.user });
      });
    // In-memory user store (replace with DB in production)
    const users: Record<string, { id: string; email: string; password: string }> = {};
    const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

    // Registration endpoint
    app.post("/api/register", async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }
      if (users[email]) {
        return res.status(400).json({ error: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = Math.random().toString(36).substring(2);
      users[email] = { id, email, password: hashedPassword };
      res.json({ message: "Registration successful" });
    });

    // Login endpoint
    app.post("/api/login", async (req, res) => {
      const { email, password } = req.body;
      const user = users[email];
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    });
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
