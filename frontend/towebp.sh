#!/bin/bash

# Converts all image files within a directory to webp. You can specify the location of the files
# and the desired quality.

# Check if the directory path and quality are provided as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <directory> <quality>"
    exit 1
fi

# Check if the quality is a valid integer between 0 and 100
if ! [[ "$2" =~ ^[0-9]+$ ]] || [ "$2" -lt 0 ] || [ "$2" -gt 100 ]; then
    echo "Quality must be an integer between 0 and 100"
    exit 1
fi

# Change to the specified directory
cd "$1" || exit

# Initialize variables for storing sizes
size_not_webp=0
size_webp=0

# Loop through all the files in the directory
for file in *; do
    # Check if the file is an image
    if [ -f "$file" ] && file --mime-type "$file" | grep -q "image"; then
        # Calculate the size of the image file in bytes
        size=$(stat -c "%s" "$file")

        # Check if the file is already in WebP format
        if file --mime-type "$file" | grep -q "image/webp"; then
            size_webp=$((size_webp + size))
        else
            # Convert the image to WebP using cwebp with specified quality
            cwebp -q "$2" "$file" -o "${file%.*}.webp"
            size_not_webp=$((size_not_webp + size))
            echo "Converted $file to WebP with quality $2"
        fi
    fi
done

# Convert the sizes to kilobytes (KB) and add padding
size_not_webp_kb=$(printf "%'d" $((size_not_webp / 1024)))
size_webp_kb=$(printf "%'d" $((size_webp / 1024)))

# Print the sum of sizes with padding
echo -e "\e[1;32mConversion complete!\e[0m"
echo "Total size of non-WebP images: ${size_not_webp_kb} KB"
echo "Total size of WebP images: ${size_webp_kb} KB"
