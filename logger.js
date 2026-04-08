import chalk from "chalk";

const time = () => new Date().toISOString().slice(11, 19);

const log = {
  info: (msg) => console.log(chalk.gray(`[${time()}]`) + " " + chalk.white(msg)),
  success: (msg) => console.log(chalk.gray(`[${time()}]`) + " " + chalk.green("✓ " + msg)),
  warn: (msg) => console.log(chalk.gray(`[${time()}]`) + " " + chalk.yellow("⚠ " + msg)),
  error: (msg) => console.log(chalk.gray(`[${time()}]`) + " " + chalk.red("✗ " + msg)),
  arb: (msg) => console.log(chalk.gray(`[${time()}]`) + " " + chalk.greenBright("🔒 ARB: " + msg)),
  divider: () => console.log(chalk.gray("─".repeat(60))),
  stats: (label, value, color = "white") => {
    const c = chalk[color] || chalk.white;
    console.log(chalk.gray(`  ${label.padEnd(20)}`) + c(value));
  },
  banner: () => {
    console.log(chalk.greenBright(`
╔══════════════════════════════════════════════╗
║     🟢 SIMPLE POLYMARKET SCANNER v1.0       ║
║        Simulation Mode — No Real Trades     ║
╚══════════════════════════════════════════════╝
    `));
  }
};

export default log;
