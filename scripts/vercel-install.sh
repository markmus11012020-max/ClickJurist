#!/bin/bash
set -e

# Работает и из корня репо, и если Root Directory = landing
if [ -f "package-lock.json" ]; then
  echo "→ npm ci (landing root)"
  npm ci
elif [ -f "landing/package-lock.json" ]; then
  echo "→ npm ci (monorepo root)"
  cd landing && npm ci
else
  echo "ERROR: package-lock.json not found"
  exit 1
fi
