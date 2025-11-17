import { motion, AnimatePresence } from "framer-motion";

interface StatusOverlayProps {
  result: string;
  visible: boolean;
}

const resultText = {
  win: "YOU WIN!",
  lose: "DEALER WINS",
  push: "PUSH",
  blackjack: "BLACKJACK!",
};

const resultColors = {
  win: "text-green-400",
  lose: "text-red-400",
  push: "text-yellow-400",
  blackjack: "text-secondary",
};

export function StatusOverlay({ result, visible }: StatusOverlayProps) {
  if (!result || !visible) return null;

  const text = resultText[result as keyof typeof resultText] || "";
  const color = resultColors[result as keyof typeof resultColors] || "text-white";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          data-testid="overlay-status"
        >
          <div className="bg-black/60 backdrop-blur-sm px-12 py-8 rounded-2xl">
            <h1 className={`text-5xl md:text-7xl font-accent font-bold ${color} drop-shadow-lg`} data-testid="text-result">
              {text}
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
