document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();  

    const keyword = document.getElementById('keywordInput').value.trim();
    if (!keyword) {
        alert('Please enter a keyword.');
        return;
    }

    const encodedKeyword = encodeURIComponent(keyword);

    // SPARQL query
    const query = `
        SELECT ?subject ?predicate ?object
        WHERE {
          {
            ?subject ?predicate ?object .
            FILTER(CONTAINS(STR(?subject), "${encodedKeyword}"))
          }
          UNION
          {
            ?subject ?predicate ?object .
            FILTER(CONTAINS(STR(?object), "${encodedKeyword}"))
          }
        }
    `;

    const endpointUrl = 'http://localhost:3030/experiment_dataset/sparql'; // Adjust if necessary

    fetch(endpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    })
    .then(response => response.json())
    .then(data => {
        // Process the results
        if (data.results && data.results.bindings) {
            let triplesHTML = '';  // Prepare HTML string

            data.results.bindings.forEach(binding => {
                const subject = binding.subject ? binding.subject.value : null;
                const predicate = binding.predicate ? binding.predicate.value : null;
                const object = binding.object ? binding.object.value : null;

                if (subject && predicate && object) {
                    // Determine if subject and object are Wikidata links
                    const isWikidataSubject = subject.includes("wikidata.org");
                    const isWikidataObject = object.includes("wikidata.org");

                    // Convert to human-readable format or keep it clickable if it's a Wikidata link
                    const humanReadableSubject = isWikidataSubject ? `<a href="${subject}" target="_blank">${subject.split('/').pop().replace(/%20/g, ' ')}</a>` : subject.split('/').pop().replace(/%20/g, ' ');
                    const humanReadableObject = isWikidataObject ? `<a href="${object}" target="_blank">${object.split('/').pop().replace(/%20/g, ' ')}</a>` : object.split('/').pop().replace(/%20/g, ' ');

                    // Add the result as an HTML row
                    triplesHTML += `<div><strong>Subject:</strong> ${humanReadableSubject} | <strong>Predicate:</strong> ${predicate} | <strong>Object:</strong> ${humanReadableObject}</div>`;
                }
            });

            // Display the results in the resultOutput element
            document.getElementById('resultOutput').innerHTML = triplesHTML || 'No results found.';
        } else {
            document.getElementById('resultOutput').textContent = 'No results found.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('resultOutput').textContent = 'Error fetching results. Check the console for details.';
    });
});



