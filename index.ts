#!/usr/bin/env bun
const args = process.argv.slice(2);
const minutes = args.length > 0 ? parseInt(args[0], 10) : 30;

if (isNaN(minutes) || minutes <= 0) {
  console.error("Please provide a valid number of minutes");
  process.exit(1);
}

const totalSeconds = minutes * 60;
let remaining = totalSeconds;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function clear() {
  process.stdout.write("\r\x1b[K");
}

console.log(`Timer set for ${minutes} minute(s). Starting...`);

const interval = setInterval(() => {
  remaining--;
  clear();
  const progress = ((totalSeconds - remaining) / totalSeconds) * 30;
  const bar = "█".repeat(Math.min(Math.floor(progress), 30)).padEnd(30, "░");
  process.stdout.write(`\r${formatTime(remaining)} [${bar}]`);
  
  if (remaining <= 0) {
    clear();
    console.log(`\r${formatTime(0)} - Time's up!`);
    clearInterval(interval);
    
    try {
      new Notification("Timer Complete!", {
        body: `${minutes} minute timer has finished.`,
      });
    } catch {
      console.log("\a");
    }
    
    process.exit(0);
  }
}, 1000);

process.on("SIGINT", () => {
  clearInterval(interval);
  console.log("\nTimer cancelled.");
  process.exit(0);
});
