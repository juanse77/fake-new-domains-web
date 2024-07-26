import zipfile
import sys

def unzip_file(zip_filepath, extract_to):
    with zipfile.ZipFile(zip_filepath, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
        print(f"Files extracted to: {extract_to}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python unzip_script.py <zip_filepath> <extract_to>")
        sys.exit(1)

    zip_filepath = sys.argv[1]
    extract_to = sys.argv[2]

    unzip_file(zip_filepath, extract_to)