#!/bin/bash
# make sure you are in test/ subdirectory

./mapet.sh && sleep 10 
node test/api-whoareyou.test.js 
node test/openai-completions.test.js 
./stop.sh
