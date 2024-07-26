import time
import requests

URL = 'http://127.0.0.1:5000/run-script'
DATA = {"days": "2", "password": "fake"}

def execute_script():    
    response = requests.post(URL, json=DATA, verify=False)
    print("Respuesta del servidor:", response.text)


def main():
    while True:
        execute_script()
        time.sleep(86400)


if __name__ == "__main__":
    main()
