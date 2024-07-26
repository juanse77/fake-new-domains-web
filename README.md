# Fake New Domains:

## Overview:

Fake New Domains is an application designed to protect against phishing by detecting newly created domains and facilitating the creation of blacklists to prevent fraudulent sites efficiently. This tool helps users explore detected occurrences among newly created domains and prepares blacklists for potential fraudulent domains in the most agile way possible.

## Features:

- **Phishing Detection**: Identify newly registered domains that may be used for phishing attacks.
- **Domain Patterns**: Select and analyze specific domain patterns.
- **Blacklist Creation**: Easily create and manage blacklists of suspicious domains.
- **Automated Updates**: Automatically fetch and update the list of new domains.

## Usage:

### Web Interface:

1. Use the dropdown menu to select the domain pattern you want to analyze.
2. Click on "Add Selected" to add domains to the list.
3. Use the buttons to export the selected domains o clear the list.

## Contributing:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## How to try:
You can use docker, to do that you only have to execute the followed command:

```bash
docker pull juanse77/fake-new-domains-web:latest
docker run --rm -p 5000:5000 juanse77/fake-new-domains-web:latest
```

Now, you can access to the application in http://localhost:5000

## License:

This project is licensed under the MIT License.

## Contact

For any questions or support, please contact [juanse77-ccdani@hotmail.com](mailto:juanse77-ccdani@hotmail.com).

&copy; 2024 Fake New Domains
