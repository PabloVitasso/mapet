#!/bin/bash
./mapet.sh && sleep 10 && node test/api-whoareyou.test.js && ./stop.sh