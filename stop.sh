#!/bin/bash
if [ -f .mapet.pid ]; then
  PID=$(cat .mapet.pid)
  kill $PID 2>/dev/null
  rm .mapet.pid
  echo "Mapet process (PID: $PID) stopped"
else
  echo "No running mapet process found"
fi

# Kill anything on port 3000
lsof -ti :3000 | xargs -r kill -9 2>/dev/null
lsof -ti :3000