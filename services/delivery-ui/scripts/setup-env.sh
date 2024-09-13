#!/bin/sh

echo "Attempting to setup environment for the delivery ui"

# Initialize the envObjectStr variable
envObjectStr="window.__env__ = {\n"

# Iterate over environment variables
for key in $(printenv | awk -F= '{print $1}' | grep '^VITE_'); do
  value=$(printenv "$key")
  envObjectStr="${envObjectStr}  ${key}: '${value}',\n"
  echo "${key}=${value}"
done

# Close the object literal
envObjectStr="${envObjectStr}};"

# Write the string to the env.js file
echo -e "$envObjectStr" > /usr/share/nginx/html/env.js

echo "env.js successfully created from environment"
