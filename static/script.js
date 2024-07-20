document.addEventListener("DOMContentLoaded", function() {
    const dropdown = document.getElementById('dropdown');
    const resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    const addButton = document.getElementById('add');
    const textarea = document.getElementById('results');
	const clearButton = document.getElementById('clear');
	const exportButton = document.getElementById('export');
	const updateButton = document.getElementById('update');
	const number_of_days = document.getElementById('days');


    dropdown.addEventListener('change', function() {
        const selectedPattern = dropdown.value;
        fetch(`/get_domains?pattern=${selectedPattern}`)
            .then(response => response.json())
            .then(data => updateTable(data.domains))
            .catch(error => console.error('Error fetching domains:', error));
    });

	updateButton.addEventListener('click', function() {
		fetch('/run-script', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ days: number_of_days.value }) // Datos que se envían al servidor
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
			alert('Database successfully updated.');
		})
		.catch((error) => {
			console.error('Error:', error);
			alert('It wasn\'t possible to update de database.');
		});
	});

    addButton.addEventListener('click', function() {
        const selectedDomains = getSelectedDomains();
        addDomainsToTextarea(selectedDomains);
    });

	clearButton.addEventListener('click', function() {
		textarea.value = "";
	});

	exportButton.addEventListener('click', function() {
		generateTxtFile();
	});

    function updateTable(domains) {
		
        while (resultsTable.firstChild) {
            resultsTable.removeChild(resultsTable.firstChild);
        }

        domains.forEach(domain => {
            const row = document.createElement('tr');

            const checkboxCell = document.createElement('td');
            checkboxCell.classList.add('checkbox');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = domain;
            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);

            const domainCell = document.createElement('td');
            domainCell.textContent = domain;
            row.appendChild(domainCell);

            resultsTable.appendChild(row);
        });
    }

    function getSelectedDomains() {
        const checkboxes = resultsTable.querySelectorAll('input[type="checkbox"]:checked');
        const selectedDomains = [];
        checkboxes.forEach(checkbox => {
            selectedDomains.push(checkbox.value);
        });
        return selectedDomains;
    }

    function addDomainsToTextarea(domains) {
        domains.forEach(domain => {
            textarea.value += domain + '\n';
        });
		textarea.value += '\n';
    }

	function generateTxtFile() {
	
		const blob = new Blob([textarea.value], { type: 'text/plain' });
		const link = document.createElement('a');
	
		link.href = URL.createObjectURL(blob);
		link.download = 'fake-domains.txt';
		
		link.click();
		URL.revokeObjectURL(link.href);
	}

});
