import config from "./config.js";
import log from "./logger.js";
import { runScan } from "./scanner.js";

console.log("🤖 Starting Simple Trading Scanner...");

async function start() {
  log.info("Scanning Polymarket right now...");

  const results = await runScan();

  if (results.length === 0) {
    log.info("No good opportunities right now. We'll keep checking.");
  } else {
    log.success(`Found ${results.length} opportunities!`);
    results.forEach((r, i) => {
      log.stats(`#${i+1}`, `${r.market} — ${r.edge}% edge`);
    });
  }

  console.log("\nPress Ctrl+C to stop");
}

start();
