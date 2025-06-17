#!/bin/bash
# Firejail: izolacja filesystemu, brak seccomp
# Chrome: --no-sandbox (wymuszone przez pptr-gpt)
LOGFILE="$(date +%Y.%m.%d)-mapet.log"
nohup env PUPPETEER_ARGS="--no-sandbox" firejail --profile=./pptr-gpt.profile node "$(cd "$(dirname "$0")"; pwd)/index.js" -s "$@" > "$LOGFILE" 2>&1 < /dev/null &
PID=$!
echo $PID > .mapet.pid
echo "Mapet started in background with PID: $PID, logging to $LOGFILE"