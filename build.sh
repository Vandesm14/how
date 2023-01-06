#!/usr/bin/bash

# create a `bin` directory
mkdir -p ./bin

# compile deno programme into the `bin` directory
deno compile --check=all --allow-net --allow-read --allow-write --allow-env --allow-run --target=x86_64-unknown-linux-gnu -o=./bin/how mod.ts
deno compile --check=all --allow-net --allow-read --allow-write --allow-env --allow-run --target=x86_64-pc-windows-msvc -o=./bin/how.exe mod.ts
deno compile --check=all --allow-net --allow-read --allow-write --allow-env --allow-run --target=x86_64-apple-darwin -o=./bin/how.app mod.ts
deno compile --check=all --allow-net --allow-read --allow-write --allow-env --allow-run --target=aarch64-apple-darwin -o=./bin/how-arm.app mod.ts
