#!/bin/bash

echo "================================"
echo "🧪 Almuerza Ya Backend Test Suite"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
echo "🔍 Checking if backend is running on http://localhost:3000..."
if ! curl -s http://localhost:3000/api/v1/health > /dev/null; then
    echo -e "${RED}❌ Backend not running!${NC}"
    echo "Please start the backend first:"
    echo "  cd apps/backend && npm start:dev"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running${NC}"
echo ""

# Wait a moment for server to be ready
sleep 2

# Run tests
echo "🚀 Running API tests..."
echo ""

npm test -- --run test/*.spec.ts

echo ""
echo "================================"
echo "✅ Test suite completed"
echo "================================"
