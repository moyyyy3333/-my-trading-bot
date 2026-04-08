import dotenv from "dotenv";
dotenv.config();

const config = {
  gammaHost: "https://gamma-api.polymarket.com",
  mode: process.env.MODE || "simulate",
  isLive: (process.env.MODE || "simulate") === "live",
  maxTradeSize: parseFloat(process.env.MAX_TRADE_SIZE || "25"),
  minArbEdge: parseFloat(process.env.MIN_ARB_EDGE || "0.5") / 100,
  minMarketVolume: 50000,
};

export default config;
