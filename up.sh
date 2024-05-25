#!/bin/bash

# Find .js files in the specified directories
find ./src ./editor -type f -name "*.js" | while read file; do
    # Apply lebab -t $1 command to each found .js file
    lebab -t $1 "$file" -o "$file"
done
