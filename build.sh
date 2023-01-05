#!/usr/bin/bash
# Compile using Deno
deno compile --allow-net --allow-read --allow-write --allow-env --allow-run mod.ts

# Move binary to bin folder
mkdir -p bin
mv how bin/how