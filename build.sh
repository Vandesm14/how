#!/usr/bin/bash
# Compile using Deno
deno compile --allow-net --allow-read --allow-write --allow-env --allow-run mod.ts

# Move binary to bin folder
mkdir -p bin
mv how bin/how

# Remove existing symlink
rm /home/shane/apps/bin/how

# Create symlink
ln -s /home/shane/dev/how/bin/how /home/shane/apps/bin/how
