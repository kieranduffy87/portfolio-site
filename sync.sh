#!/bin/bash

# Portfolio Project Sync Launcher
# Automatically syncs project images and videos from ~/Downloads/projects/

cd "$(dirname "$0")"

echo "🚀 Starting Portfolio Project Sync..."
echo ""

# Check if project-sync.js exists
if [ ! -f "project-sync.js" ]; then
    echo "❌ Error: project-sync.js not found in portfolio directory"
    exit 1
fi

# Run the sync script
if [ "$1" = "watch" ] || [ "$1" = "w" ]; then
    echo "📂 Watching for new projects (press Ctrl+C to stop)..."
    node project-sync.js
else
    echo "📂 Running one-time sync..."
    node project-sync.js &
    SYNC_PID=$!

    # Wait a few seconds for the scan to complete
    sleep 3

    # Kill the watcher
    kill $SYNC_PID 2>/dev/null
    wait $SYNC_PID 2>/dev/null

    echo ""
    echo "✅ Sync complete!"
fi
