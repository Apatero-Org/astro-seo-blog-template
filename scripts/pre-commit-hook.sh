#!/bin/bash

# Pre-commit hook for blog posts
# This script runs automatically before each commit to ensure
# sitemap and search index are up to date

echo "🔍 Pre-commit: Checking for new blog posts..."

# Check if any .mdx files in posts directory were added or modified
if git diff --cached --name-only | grep -q "public/data/posts/.*\.mdx$"; then
    echo "📝 Blog post changes detected!"
    echo "Running update-posts script..."

    # Run the update script
    npm run update-posts

    # Check if the script succeeded
    if [ $? -ne 0 ]; then
        echo "❌ Update script failed. Commit aborted."
        exit 1
    fi

    echo "✅ Post update completed successfully!"
else
    echo "✅ No blog post changes detected. Proceeding with commit."
fi

exit 0