#!/bin/bash
if [ -f .mapet.pid ]; then
  PID=$(cat .mapet.pid)
  kill $PID
  rm .mapet.pid
  echo "Mapet process (PID: $PID) stopped"
else
  echo "No running mapet process found"
fi