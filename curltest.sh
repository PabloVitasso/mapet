#!/bin/bash
set -e

echo "Testing POST http://localhost:3000/v1/chat/completions"

curl -k -X POST "http://localhost:3000/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer x" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "podaj żart"}],
    "max_tokens": 100,
    "temperature": 0.7
  }'