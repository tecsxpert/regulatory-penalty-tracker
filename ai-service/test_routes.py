import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"


def print_result(title, response, elapsed):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)
    print("Status Code:", response.status_code)
    print("Response Time:", round(elapsed, 2), "seconds")

    try:
        print(json.dumps(response.json(), indent=4))
    except:
        print(response.text)


def test_health():
    start = time.time()
    response = requests.get(f"{BASE_URL}/health")
    elapsed = time.time() - start
    print_result("TESTING /health", response, elapsed)


def test_describe():
    payload = {
        "penalty_text": "RBI imposed a penalty on XYZ Bank for failing KYC compliance checks."
    }

    start = time.time()
    response = requests.post(f"{BASE_URL}/describe", json=payload)
    elapsed = time.time() - start
    print_result("TESTING /describe", response, elapsed)


def test_recommend():
    payload = {
        "penalty_text": "SEBI fined ABC Finance Ltd for delayed regulatory filings."
    }

    start = time.time()
    response = requests.post(f"{BASE_URL}/recommend", json=payload)
    elapsed = time.time() - start
    print_result("TESTING /recommend", response, elapsed)


def test_generate_report():
    payload = {
        "penalty_text": "IRDAI imposed a penalty on DEF Insurance for claim settlement violations."
    }

    start = time.time()
    response = requests.post(f"{BASE_URL}/generate-report", json=payload)
    elapsed = time.time() - start
    print_result("TESTING /generate-report", response, elapsed)


if __name__ == "__main__":
    print("\nStarting API Route Tests...\n")

    test_health()
    test_describe()
    test_recommend()
    test_generate_report()

    print("\nAll tests completed.\n")