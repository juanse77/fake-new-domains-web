#!/bin/bash

if [ -z "$1" ]; then
  echo "Use: $0 <number-of-days>"
  echo "--Range of number of days from 1 to 4--"
  exit 1
fi

file_limit=$1

BASE_DIR=$(pwd)
mkdir -p "$BASE_DIR/temp"

input_file="$BASE_DIR/temp/New-Domains.html"
output_file="$BASE_DIR/temp/links.txt"
download_dir="$BASE_DIR/temp/downloads"
extracted_dir="$BASE_DIR/temp/extracted"
merged_file="$BASE_DIR/static/domain-names.txt"

echo -n "" > merged_file 

curl -o "$input_file" https://www.whoisds.com/newly-registered-domains

mkdir -p "$download_dir"
mkdir -p "$extracted_dir"

grep -oE 'https://www.whoisds.com//whois-database/newly-registered-domains[^"]*' "$input_file" > "$output_file"

count=0

while IFS= read -r url && [ "$count" -lt "$file_limit" ]; do
    count=$((count + 1))
    
    curl -o "$download_dir/file.zip" "$url" 
    python "$BASE_DIR/unzip.py" "$download_dir/file.zip" "$extracted_dir" > /dev/null 2>&1

    cat "$extracted_dir/domain-names.txt" >> "$merged_file"
done < "$output_file"

rm -rf "$download_dir" "$extracted_dir" 

num_of_domains=$(wc -l < "$merged_file")

echo "The database has been updated with the new domains of the last $file_limit day/s."
echo "$num_of_domains new domains have been loaded."
