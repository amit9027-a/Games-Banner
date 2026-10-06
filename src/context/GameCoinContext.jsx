import { createContext, useContext, useEffect, useState } from "react";

const GameCoinContext = createContext(null);

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

export function GameCoinProvider({ children }) {
  const [coins, setCoins] = useState(() => read("veloop_coins", 20));
  const [tokens, setTokens] = useState(() => read("veloop_tokens", 150));
  const [history, setHistory] = useState(() => read("veloop_history", []));

  useEffect(() => {
    localStorage.setItem("veloop_coins", JSON.stringify(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("veloop_tokens", JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem("veloop_history", JSON.stringify(history));
  }, [history]);

  const addCoins = (amount) => {
    setCoins((currentCoins) => currentCoins + Math.max(0, amount));
  };

  const spendTokens = (amount) => {
    if (tokens < amount) return false;

    setTokens((currentTokens) => currentTokens - amount);
    return true;
  };

  const redeemCoins = (amount) => {
    if (coins < amount) return false;

    setCoins((currentCoins) => currentCoins - amount);
    return true;
  };

  const addHistory = (item) => {
    setHistory((currentHistory) => [
      { ...item, date: new Date().toLocaleString() },
      ...currentHistory,
    ].slice(0, 20));
  };

  return (
    <GameCoinContext.Provider
      value={{
        coins,
        tokens,
        history,
        addCoins,
        spendTokens,
        redeemCoins,
        addHistory,
      }}
    >
      {children}
    </GameCoinContext.Provider>
  );
}

export const useGameCoin = () => useContext(GameCoinContext);