# timer-cli

A terminal timer with progress bar, notifications, and loop functionality.

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd timer-cli

# Install dependencies
bun install
```

## Usage

```bash
# Run with default 30 minutes
bun start

# Run with custom duration (in minutes)
bun start 25
bun start 60

# Run with loop mode (auto-restart when timer completes)
bun start --loop
bun start 45 --loop

# Short form
bun start -l
```

## Options

- `<minutes>` - Timer duration in minutes (default: 30)
- `--loop`, `-l` - Loop the timer (restart automatically when done)

## Features

- Visual progress bar
- System notification when timer completes
- Audio alarm (beep)
- Interactive prompt after timer ends (restart or quit)
- Handles Ctrl+C to cancel

## Requirements

- [Bun](https://bun.sh/) runtime
