document.addEventListener("DOMContentLoaded", function() {

	addedDomains = [];
    keys = new Set();

    const dropdown = document.getElementById('dropdown');
    const resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    const addButton = document.getElementById('add');
    const textarea = document.getElementById('results');
	const clearButton = document.getElementById('clear');
	const exportButton = document.getElementById('export');
	const updateButton = document.getElementById('update');
	const number_of_days = document.getElementById('days');
    const last_update = document.getElementById('last_update');

    dropdown.addEventListener('change', function() {
        const selectedPattern = dropdown.value;
        fetch(`/get_domains?pattern=${selectedPattern}`)
            .then(response => response.json())
            .then(data => updateTable(data.domains))
            .catch(error => console.error('Error fetching domains:', error));
    });

	updateButton.addEventListener('click', function() {
    	let password = prompt("Please, enter the password:");
        if(password === null) return;
    	document.getElementById('gifContainer').style.display = 'flex';

		fetch('/run-script', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({password: password, days: number_of_days.value })
		})
		.then(response => response.json())
		.then(data => {
			console.log('Success:', data);
			if(data.error){
				alert(data.error);
			}else{
				alert(data.success);
                last_update.innerHTML = "Domain - Last update: " + data.last_update; 
			}
		})
		.catch((error) => {
			console.error('Error:', error);
			alert('It wasn\'t possible to update de database.');
		}).finally(() => {
			document.getElementById('gifContainer').style.display = 'none';
		});
	});

    number_of_days.addEventListener('input', function() {
        if(number_of_days.value !== ""){
            updateButton.disabled = false;
        }else{
            updateButton.disabled = true;
        }
    });

    addButton.addEventListener('click', function() {
        const selectedDomains = getSelectedDomains();
		addedDomains.push(...selectedDomains);
		
        deleteSelectedRows();
        addDomainsToTextarea(selectedDomains);

        activateCheckboxEvents();
    });

	clearButton.addEventListener('click', function() {
		addedDomains = [];
        keys = new Set();
		textarea.value = "";

		let event = new Event('change');
		dropdown.dispatchEvent(event)
        exportButton.disabled = true;
        clearButton.disabled = true;
	});

	exportButton.addEventListener('click', function() {
		generateTxtFile();
	});

    function updateTable(domains) {
		
        while (resultsTable.firstChild) {
            resultsTable.removeChild(resultsTable.firstChild);
        }

        domains.forEach(domain => {
			const auxAddedDomains = addedDomains.map(elem => elem.value);
            
            if(!auxAddedDomains.includes(domain)) {
				const row = document.createElement('tr');

				const checkboxCell = document.createElement('td');
				checkboxCell.classList.add('checkbox');
				const checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.value = domain;
                checkbox.className = 'selected';
				checkboxCell.appendChild(checkbox);
				row.appendChild(checkboxCell);

				const domainCell = document.createElement('td');
				domainCell.textContent = domain;
				row.appendChild(domainCell);

				resultsTable.appendChild(row);

                if(domain === "No results") {
                    checkbox.disabled = true;
                    checkboxCell.style = "background-color: rgb(249, 245, 240);"
                    domainCell.style = "background-color: rgb(249, 245, 240);"
                } else {
                    row.className = "domain-row";
                }
			}
            
        });

        activateCheckboxEvents();
        activateRowSelection();
    }

	function deleteSelectedRows() {
		let table = document.getElementById('results-table');
		let rows = table.getElementsByTagName('tr');

		for (var i = rows.length - 1; i >= 0; i--) {
			let checkbox = rows[i].getElementsByTagName('input')[0];

			if (checkbox && checkbox.checked) {
				table.deleteRow(i);
			}
		}
	}

    function getSelectedDomains() {
        const checkboxes = resultsTable.querySelectorAll('input[type="checkbox"]:checked');
        
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        const key = selectedOption.getAttribute("data-domain");

        const selectedDomains = [];

        keys.add(key);

        checkboxes.forEach(checkbox => {
            selectedDomains.push({key: key, value: checkbox.value});
        });

        return selectedDomains;
    }

    function addDomainsToTextarea(domains) {
        if(domains.length > 0){
            textarea.value = "";
            exportButton.disabled = false;

            keys.forEach(key => {
                textarea.value += `[+]____ ${key} ____[+]\n`;

                aux_domains = getDomainsByKey(key);
                
                aux_domains.forEach(aux_domain => {
                    textarea.value += aux_domain + '\n';
                });
                
            });

            textarea.value += '\n';
            clearButton.disabled = false;
        }
    }
    
    function getDomainsByKey(key) {
        return addedDomains.filter(elem => elem.key === key).map(elem => elem.value);
    }
    
	function generateTxtFile() {

        const blob = new Blob([textarea.value], { type: 'text/plain' });
        const link = document.createElement('a');
    
        link.href = URL.createObjectURL(blob);
        link.download = 'fake-domains.txt';
        
        link.click();
        URL.revokeObjectURL(link.href);
		
	}

    function activateCheckboxEvents() {
        const checkboxes = document.querySelectorAll('.selected');

        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                let all_disabled = true;

                checkboxes.forEach(function(cb) {
                    if(cb.checked){
                        all_disabled = false;
                    }
                });

                addButton.disabled = all_disabled;

            });

        });        

        addButton.disabled = true;
    }

    function activateRowSelection() {
        const domainRows = document.querySelectorAll('.domain-row');

        domainRows.forEach(function(row) {
            row.addEventListener('click', function(event) {

                if (event.target.type !== 'checkbox') {
                    let checkbox = row.querySelector('.selected');

                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;

                        var changeEvent = new Event('change');
                        checkbox.dispatchEvent(changeEvent);
                    }
                }

            });

        });
    }

});
