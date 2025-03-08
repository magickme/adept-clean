#!/bin/bash

# Check if input file is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 input.mp4"
    exit 1
fi

input=$1
filename=$(basename -- "$input")
filename_noext="${filename%.*}"

# Create WebM version (VP9)
ffmpeg -i "$input" \
    -c:v libvpx-vp9 \
    -b:v 1M \
    -deadline good \
    -cpu-used 2 \
    -c:a libopus \
    -b:a 128k \
    "${filename_noext}_compressed.webm"

# Create MP4 version (H.264)
ffmpeg -i "$input" \
    -c:v libx264 \
    -crf 23 \
    -preset medium \
    -c:a aac \
    -b:a 128k \
    "${filename_noext}_compressed.mp4"

# Create poster image
ffmpeg -i "$input" \
    -vframes 1 \
    -q:v 2 \
    "${filename_noext}_poster.jpg"

echo "Compression complete!"
echo "Output files:"
echo "- ${filename_noext}_compressed.webm"
echo "- ${filename_noext}_compressed.mp4"
echo "- ${filename_noext}_poster.jpg" 