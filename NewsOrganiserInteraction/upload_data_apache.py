import requests

# URL to upload RDF data to the created dataset
fuseki_data_url = f'http://localhost:3030/experiment_dataset/data'

# Path to the TTL file you want to upload
ttl_file_path = 'graph_turtle_from_json (1).ttl'

# Open the TTL file in binary mode
with open(ttl_file_path, 'rb') as ttl_file:
    # Set the headers for the request
    headers = {
        'Content-Type': 'text/turtle'  # MIME type for Turtle files
    }

    # Send the POST request with the TTL file
    response = requests.post(fuseki_data_url, headers=headers, data=ttl_file)

# Check the response status
if response.status_code == 200:
    print(f"TTL file uploaded successfully to dataset 'experiment_dataset'!")
else:
    print(f"Failed to upload TTL file: {response.status_code} - {response.text}")
