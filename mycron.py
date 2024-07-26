import os
import subprocess
import time


def execute_script():
    current_directory = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.join(current_directory, "scripts",
                               "get-newly-domains.sh")

    result = subprocess.run([script_path, '2'], capture_output=True, text=True)

    if result.returncode == 0:
        print(f"get-newly-domains.sh: {result.stdout}")
    else:
        print(f"get-newly-domains.sh: {result.stderr}")


def main():
    while True:
        execute_script()
        time.sleep(86400)


if __name__ == "__main__":
    main()
