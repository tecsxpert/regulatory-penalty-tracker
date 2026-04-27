import requests

base_url = "http://127.0.0.1:5000"

data = {
    "penalty_text": "Late GST filing penalty"
}

# Test describe
describe_response = requests.post(
    f"{base_url}/describe",
    json=data
)

print("DESCRIBE:")
print(describe_response.json())

print("-" * 50)

# Test recommend
recommend_response = requests.post(
    f"{base_url}/recommend",
    json=data
)

print("RECOMMEND:")
print(recommend_response.json())