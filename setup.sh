#!/bin/bash
npm install
cp .env.example .env
echo "✅ Setup complete! Now edit .env with your keys, then run:"
echo "npm run scan"
chmod +x setup.sh
