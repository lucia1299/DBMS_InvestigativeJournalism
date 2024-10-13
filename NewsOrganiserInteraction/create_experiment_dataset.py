import requests

# Fuseki server management URL
fuseki_admin_url = 'http://localhost:3030/$/datasets'
dataset_name = 'experiment_dataset'  # Replace with your desired dataset name

# Create the dataset
create_dataset_url = f'{fuseki_admin_url}?dbName={dataset_name}&dbType=tdb2'
response = requests.post(create_dataset_url)

if response.status_code == 200:
    print(f"Dataset '{dataset_name}' created successfully!")
else:
    print(f"Failed to create dataset: {response.status_code} - {response.text}")
    exit()  # Exit if dataset creation failed

# URL to upload RDF data to the created dataset
fuseki_data_url = f'http://localhost:3030/{dataset_name}/data'