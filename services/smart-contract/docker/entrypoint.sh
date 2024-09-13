#!/bin/bash

# Enable job control
set -m

npm run node &

# local-development-setup-data.json is mounted in docker compose
LOCAL_DEVELOPMENT_SETUP_DATA="$(cat /app/local-development-setup-data.json | tr -d '\n')" npm run setup:local

# Puts the hardhat ethereum node process in foreground
fg %1
