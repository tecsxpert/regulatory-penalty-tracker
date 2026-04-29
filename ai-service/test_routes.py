import requests
import json

BASE_URL = "http://127.0.0.1:5000"


# Helper Function
def print_result(title, response):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)
    print("Status Code:", response.status_code)

    try:
        data = response.json()
        print(json.dumps(data, indent=4))
    except Exception:
        print(response.text)


# Test Health Route
def test_health():
    response = requests.get(f"{BASE_URL}/health")
    print_result("TESTING /health", response)



# Test Describe Route
def test_describe():
    payload = {
        "penalty_text": "RBI imposed a penalty on XYZ Bank for failing KYC compliance checks."
    }

    response = requests.post(
        f"{BASE_URL}/describe",
        json=payload
    )

    print_result("TESTING /describe", response)


# Test Recommend Route
def test_recommend():
    payload = {
        "penalty_text": "SEBI fined ABC Finance Ltd for delayed regulatory filings."
    }

    response = requests.post(
        f"{BASE_URL}/recommend",
        json=payload
    )

    print_result("TESTING /recommend", response)


# Test Generate Report Route
def test_generate_report():
    payload = {
        "penalty_text": "IRDAI imposed a penalty on DEF Insurance for claim settlement violations."
    }

    response = requests.post(
        f"{BASE_URL}/generate-report",
        json=payload
    )

    print_result("TESTING /generate-report", response)


# Run All Tests
if __name__ == "__main__":
    print("\nStarting API Route Tests...\n")

    test_health()
    test_describe()
    test_recommend()
    test_generate_report()

    print("\nAll tests completed.\n")