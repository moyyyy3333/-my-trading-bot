import axios from "axios";
import config from "./config.js";
import log from "./logger.js";

async function getActiveMarkets() {
  try {
    const resp = await axios.get(`${config.gammaHost}/markets`, {
      params: { closed: false, limit: 100, order: "volume24hr", ascending: false }
    });
    return resp.data || [];
  } catch (e) {
    log.error("Could not fetch markets");
    return [];
  }
}

async function getOrderBook(tokenId) {
  try {
    const resp = await axios.get(`https://clob.polymarket.com/order-book?token_id=${tokenId}`);
    return resp.data;
  } catch {
    return null;
  }
}

function extractBBO(book) {
  if (!book) return null;
  const bestAsk = book.asks?.[0]?.price ? parseFloat(book.asks[0].price) : 1;
  const askSize = book.asks?.[0]?.size ? parseFloat(book.asks[0].size) : 0;
  return { bestAsk, askSize };
}

export async function runSimpleScan() {
  log.info("Fetching active markets...");
  const markets = await getActiveMarkets();

  const opportunities = [];

  for (const market of markets) {
    try {
      const tokens = market.tokens || [];
      if (tokens.length !== 2) continue;

      const yesToken = tokens.find(t => t.outcome === "Yes") || tokens[0];
      const noToken = tokens.find(t => t.outcome === "No") || tokens[1];

      if (!yesToken?.token_id || !noToken?.token_id) continue;

      const [yesBook, noBook] = await Promise.all([
        getOrderBook(yesToken.token_id),
        getOrderBook(noToken.token_id)
      ]);

      const yesBBO = extractBBO(yesBook);
      const noBBO = extractBBO(noBook);
      if (!yesBBO || !noBBO) continue;

      const totalCost = yesBBO.bestAsk + noBBO.bestAsk;
      const edge = 1 - totalCost;

      if (edge > config.minArbEdge) {
        const maxSize = Math.min(yesBBO.askSize, noBBO.askSize, config.maxTradeSize / totalCost);

        opportunities.push({
          market: market.question || market.title || "Unknown Market",
          yesAsk: yesBBO.bestAsk,
          noAsk: noBBO.bestAsk,
          totalCost: totalCost,
          edge,
          edgePct: (edge * 100).toFixed(2),
          expectedProfit: (edge * Math.floor(maxSize)).toFixed(2),
        });
      }
    } catch (e) {
      // skip bad markets
    }
  }

  return opportunities.sort((a, b) => b.edge - a.edge);
}
