import os
from flask import Flask, request, jsonify, render_template
import subprocess

import datetime
import pytz

timezone = pytz.timezone('UTC')
last_update = "Database empty"

app = Flask(__name__)

def get_domains_by_pattern(pattern):
    domains_file_path = os.path.join(os.path.dirname(__file__), 'static', 'domain-names.txt')
    patterns_file_path = os.path.join(os.path.dirname(__file__), 'static', 'patterns.txt')

    patterns = []
    domains = []

    if os.path.exists(patterns_file_path):
        with open(patterns_file_path, 'r') as file:
            for line in file:
                patterns.append(line.strip())
            
            patterns.sort()
            patterns.insert(0, "Select the pattern to find")
            
    else:
        patterns.append("Patterns file not found")

    if os.path.exists(domains_file_path):
        with open(domains_file_path, 'r') as file:
            for line in file:
                if int(pattern) != 0 and patterns[int(pattern)] in line:
                    domains.append(line.strip())
    else:
        domains.append("Domains file not found")

    if len(domains) == 0:
        domains.append("No results")

    return domains, patterns


def get_new_domains(num_files):
    script_path = os.path.join(os.path.dirname(__file__), 'scripts', 'get-newly-domains.sh')
    if not os.path.exists(script_path):
        raise FileNotFoundError(f"Script not found: {script_path}")
    try:
        return subprocess.run([script_path, str(num_files)], capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        return e


@app.after_request
def add_security_headers(response):
    response.headers['X-Frame-Options'] = 'DENY'
    return response


@app.route('/', methods=['GET'])
def index():
    pattern_index = request.args.get('pattern', 0)
    domains, patterns = get_domains_by_pattern(pattern_index)
    
    return render_template(
        "index.html",
        domains=domains,
        patterns=patterns,
        selected_pattern=pattern_index,
        last_update=last_update
    )


@app.route('/run-script', methods=['POST'])
def run_script():
    global last_update

    data = request.json
    num_files = int(data.get('days') or '2')
    password = data.get('password', "")

    if password != "fake":
        return jsonify({
            'error': "Action not allowed"
        }), 403

    if num_files < 1 or num_files > 4:
        num_files = 1 

    result = get_new_domains(num_files)
    if isinstance(result, subprocess.CalledProcessError):
        return jsonify({
            'error': f"An error occurred: {result.stderr.strip()}"
        }), 500

    last_update = datetime.datetime.now(timezone).strftime("%A, %B %d, %Y %H:%M:%S %Z")

    return jsonify({
        'success': result.stdout.strip(),
        'last_update': last_update
    })


@app.route('/get_domains')
def get_domains():
    pattern_index = request.args.get('pattern')
    domains, _ = get_domains_by_pattern(pattern_index)

    return jsonify({'domains': domains})


if __name__ == '__main__':               
    app.run(debug=True, host="0.0.0.0")
