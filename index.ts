#!/usr/bin/env bun
const args = process.argv.slice(2);

let minutes = 30;
let loop = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--loop" || args[i] === "-l") {
    loop = true;
  } else {
    const parsed = parseInt(args[i], 10);
    if (!isNaN(parsed) && parsed > 0) {
      minutes = parsed;
    }
  }
}

if (minutes <= 0) {
  console.error("Please provide a valid number of minutes");
  process.exit(1);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function clear() {
  process.stdout.write("\r\x1b[K");
}

function playAlarm() {
  try {
    new Notification("Timer Complete!", {
      body: `${minutes} minute timer has finished.`,
    });
  } catch {}

  try {
    Bun.spawnSync(["powershell", "-c", "[console]::beep(1000,300)"]);
  } catch {
    console.log("\a\a\a");
  }
}

let currentInterval: ReturnType<typeof setInterval> | null = null;

function runTimer() {
  const totalSeconds = minutes * 60;
  let remaining = totalSeconds;

  console.log(`Timer set for ${minutes} minute(s). Starting...`);

  currentInterval = setInterval(() => {
    remaining--;
    clear();
    const progress = ((totalSeconds - remaining) / totalSeconds) * 30;
    const bar = "█".repeat(Math.min(Math.floor(progress), 30)).padEnd(30, "░");
    process.stdout.write(`\r${formatTime(remaining)} [${bar}]`);

    if (remaining <= 0) {
      clearInterval(currentInterval!);
      console.log(`\r${formatTime(0)} - Time's up!`);
      playAlarm();

      if (loop) {
        console.log("\nRestarting timer...\n");
        setTimeout(() => runTimer(), 1000);
      } else {
        promptUser();
      }
    }
  }, 1000);
}

async function promptUser() {
  console.log("\nWhat would you like to do?");
  console.log("  [r] - Restart timer");
  console.log("  [q] - Quit");

  const answer = await new Promise<string>((resolve) => {
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("> ", (result: string) => {
      rl.close();
      resolve(result);
    });
  });

  const choice = answer.trim().toLowerCase();

  if (choice === "r") {
    console.log();
    runTimer();
  } else if (choice === "q") {
    console.log("Goodbye!");
    process.exit(0);
  } else {
    console.log("Invalid option. Please enter 'r' or 'q'.");
    promptUser();
  }
}

process.on("SIGINT", () => {
  if (currentInterval) clearInterval(currentInterval);
  console.log("\nTimer cancelled.");
  process.exit(0);
});

runTimer();