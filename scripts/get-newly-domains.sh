#!/bin/bash

if [ -z "$1" ]; then
  echo "Use: $0 <number-of-days>"
  echo "--Range of number of days from 1 to 4--"
  exit 1
fi

file_limit=$1

mkdir -p ~/temp

input_file="~/temp/New-Domains.html"
output_file="~/temp/links.txt"
download_dir="~/temp/downloads"
extracted_dir="~/temp/extracted"
merged_file="/app/static/domain-names.txt"

curl -o "~/temp/New-Domains.html" https://www.whoisds.com/newly-registered-domains

mkdir -p "$download_dir"
mkdir -p "$extracted_dir"

grep -oE 'https://www.whoisds.com//whois-database/newly-registered-domains[^"]*' "$input_file" > "$output_file"

> "$merged_file"

count=0

while IFS= read -r url && [ "$count" -lt "$file_limit" ]; do
    count=$((count + 1))
    
    curl -o "$download_dir/file.zip" "$url" 
    unzip -o "$download_dir/file.zip" -d "$extracted_dir" &> /dev/null

    cat "$extracted_dir/domain-names.txt" >> "$merged_file"
done < "$output_file"

rm -rf "$download_dir" "$extracted_dir" 

echo "The database has been updated with the new domains of the last $file_limit day/s"