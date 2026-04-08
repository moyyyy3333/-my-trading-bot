#!/bin/bash
echo "Installing dependencies..."
npm install
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ .env created"
fi
echo ""
echo "✅ Ready! Now run: npm run scan"
