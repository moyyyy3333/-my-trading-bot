#!/usr/bin/env node

import config from "./config.js";
import log from "./logger.js";
import { runSimpleScan } from "./scanner.js";

log.banner();

async function main() {
  log.info("Starting simple simulation scan... (no real trades)");
  log.info("This will check for arbitrage opportunities on Polymarket.");

  const opportunities = await runSimpleScan();

  if (opportunities.length === 0) {
    log.warn("No strong arbitrage opportunities found right now.");
    log.info("Prediction markets move fast — try running again in a few minutes.");
  } else {
    log.success(`Found ${opportunities.length} potential opportunities!`);
    log.divider();

    opportunities.slice(0, 5).forEach((opp, i) => {
      log.arb(`Opportunity #${i + 1}`);
      log.stats("Market", opp.market);
      log.stats("YES Ask", `$${opp.yesAsk}`);
      log.stats("NO Ask", `$${opp.noAsk}`);
      log.stats("Total Cost", `$${opp.totalCost.toFixed(4)}`);
      log.stats("Edge", `${opp.edgePct}% → ~$${opp.expectedProfit} profit`, "green");
      log.divider();
    });

    log.info("In simulation mode — nothing was traded.");
    log.info("When you're ready for real trading, we'll add your wallet keys safely.");
  }

  log.info("Scan complete. Press Ctrl+C to exit.");
}

main().catch(err => {
  log.error(`Error: ${err.message}`);
});
