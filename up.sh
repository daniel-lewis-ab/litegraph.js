#!/bin/bash

# Find all .js files recursively below the current working directory
find . -type f -name "*.js" | while read file; do
    # Apply lebab -t $1 command to each found .js file
    lebab -t $1 "$file"
done

