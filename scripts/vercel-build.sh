#!/bin/bash
set -e

if [ -f "vite.config.ts" ]; then
  echo "→ npm run build (landing root)"
  npm run build
elif [ -f "landing/vite.config.ts" ]; then
  echo "→ npm run build (monorepo root)"
  cd landing && npm run build
else
  echo "ERROR: vite.config.ts not found"
  exit 1
fi
