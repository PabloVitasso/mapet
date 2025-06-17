#!/bin/bash
# Firejail: izolacja filesystemu, brak seccomp
# Chrome: --no-sandbox (wymuszone przez pptr-gpt)
# Build step: ensure latest code is compiled
npm run build

# Check if port 3000 is in use
if lsof -i :3000 | grep LISTEN >/dev/null; then
  echo "ERROR: Port 3000 is already in use. Mapet will not start. call ./stop.sh" >&2
  exit 1
fi

LOGFILE="$(date +%Y.%m.%d)-mapet.log"
nohup env PUPPETEER_ARGS="--no-sandbox" firejail --profile=./pptr-gpt.profile node "$(cd "$(dirname "$0")"; pwd)/index.js" -s "$@" > "$LOGFILE" 2>&1 < /dev/null &
PID=$!
echo $PID > .mapet.pid
echo "Mapet started in background with PID: $PID, logging to $LOGFILE"