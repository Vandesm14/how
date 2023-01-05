#!/usr/bin/bash

# create a `bin` directory
mkdir -p ./bin
# compile deno programme into the `bin` directory
deno compile --check=all --allow-net --allow-read --allow-write --allow-env --allow-run -o=./bin/how mod.ts
