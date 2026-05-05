import time

start_time = time.time()
total_requests = 0
total_response_time = 0.0

def update_metrics(start):
    global total_requests, total_response_time
    elapsed = (time.time() - start) * 1000
    total_requests += 1
    total_response_time += elapsed

def get_metrics():
    uptime = int(time.time() - start_time)
    avg = round(total_response_time / total_requests, 2) if total_requests else 0
    return uptime, avg