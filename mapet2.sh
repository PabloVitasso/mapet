#!/bin/bash
LOGFILE="$(date +%Y.%m.%d)-mapet.log"
env PUPPETEER_ARGS="--no-sandbox" node "$(cd "$(dirname "$0")"; pwd)/index.js" -s "$@" > "$LOGFILE" 2>&1 < /dev/null