#!/bin/sh

# This script sets up various backend services, seeds the database with initial data, and prepares them for development.

while [ $# -gt 0 ]; do
  if [[ $1 == "--"* ]]; then
      v="${1/--/}"
      declare "$v"="$2"
      shift
  fi
  shift
done

if [[ -z $env ]]; then
  echo "You need to provide --env variable. It can be \`dev\` or \`prod\`."
  exit 1
fi

docker exec dp-${env}-delivery-service dotnet delivery-service-api-scripts.dll setup-for-local-development
docker exec --env LOCAL_DEVELOPMENT_SETUP_DATA="$(cat ./scripts/startup/local-development-setup-data.json | tr -d '\n')" dp-${env}-blockchain-service bun run ./src/setup-for-local-development.ts