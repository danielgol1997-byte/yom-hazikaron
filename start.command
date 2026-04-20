#!/bin/bash
cd "$(dirname "$0")"
PORT=8080

# Kill any existing server on that port
lsof -ti:$PORT | xargs kill -9 2>/dev/null

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║       יום הזיכרון 2026               ║"
echo "  ║                                      ║"
echo "  ║  Server running at localhost:$PORT    ║"
echo "  ║  Press Ctrl+C to stop                ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Open in Chrome after a brief delay
(sleep 1 && open -a "Google Chrome" "http://localhost:$PORT") &

# Start a simple Python HTTP server
python3 -m http.server $PORT
