# Benchmark results — 2026-11-04 (MagratheaPHP 3.0.0)

wrk: -t2 -c50 -d30s (after 5s warmup) — 1 vCPU / 512MB per container, PHP 8.3 + Apache, OPcache on, no DB
Host: AMD Ryzen 5 5500U, 12 threads. Median of 3 runs, per endpoint and per metric (raw runs below).

| Framework | Endpoint | p50 latency | p99 latency | Req/sec | Peak memory |
|-----------|----------|-------------|-------------|---------|-------------|
| magrathea | /hello | 50.87ms | 163.27ms | 1463.97 | 0.3 MB |
| magrathea | /planets | 51.34ms | 104.23ms | 1455.81 | 0.3 MB |
| slim | /hello | 48.96ms | 201.84ms | 1032.86 | 0.4 MB |
| slim | /planets | 49.22ms | 192.52ms | 1064.43 | 0.4 MB |
| laravel | /hello | 295.37ms | 901.62ms | 175.69 | 0.6 MB |
| laravel | /planets | 288.76ms | 899.71ms | 182.59 | 0.6 MB |
| symfony | /hello | 102.22ms | 501.33ms | 386.27 | 0.5 MB |
| symfony | /planets | 100.89ms | 499.30ms | 415.23 | 0.5 MB |

- magrathea: average 1459.9 req/s
- slim: average 1048.6 req/s
- laravel: average 179.1 req/s
- symfony: average 400.8 req/s

## Raw runs

### Run 1

| Framework | Endpoint | p50 latency | p99 latency | Req/sec | Peak memory |
|-----------|----------|-------------|-------------|---------|-------------|
| magrathea | /hello | 51.83ms | 163.27ms | 1450.12 | 0.3 MB |
| magrathea | /planets | 51.34ms | 122.84ms | 1389.64 | 0.3 MB |
| slim | /hello | 13.34ms | 1.09s | 986.06 | 0.4 MB |
| slim | /planets | 52.96ms | 196.54ms | 990.56 | 0.4 MB |
| laravel | /hello | 295.37ms | 899.48ms | 175.69 | 0.6 MB |
| laravel | /planets | 288.76ms | 845.35ms | 182.59 | 0.6 MB |
| symfony | /hello | 102.32ms | 501.33ms | 386.27 | 0.5 MB |
| symfony | /planets | 102.86ms | 467.01ms | 382.45 | 0.5 MB |

### Run 2

| Framework | Endpoint | p50 latency | p99 latency | Req/sec | Peak memory |
|-----------|----------|-------------|-------------|---------|-------------|
| magrathea | /hello | 49.74ms | 1.23s | 1472.42 | 0.3 MB |
| magrathea | /planets | 38.35ms | 103.84ms | 1485.75 | 0.3 MB |
| slim | /hello | 50.38ms | 201.84ms | 1032.86 | 0.4 MB |
| slim | /planets | 49.22ms | 192.52ms | 1064.43 | 0.4 MB |
| laravel | /hello | 295.54ms | 1.00s | 163.07 | 0.6 MB |
| laravel | /planets | 294.11ms | 899.71ms | 177.68 | 0.6 MB |
| symfony | /hello | 102.22ms | 498.36ms | 379.21 | 0.5 MB |
| symfony | /planets | 100.89ms | 500.49ms | 415.23 | 0.5 MB |

### Run 3

| Framework | Endpoint | p50 latency | p99 latency | Req/sec | Peak memory |
|-----------|----------|-------------|-------------|---------|-------------|
| magrathea | /hello | 50.87ms | 121.77ms | 1463.97 | 0.3 MB |
| magrathea | /planets | 51.87ms | 104.23ms | 1455.81 | 0.3 MB |
| slim | /hello | 48.96ms | 197.09ms | 1077.23 | 0.4 MB |
| slim | /planets | 49.09ms | 191.16ms | 1107.54 | 0.4 MB |
| laravel | /hello | 294.12ms | 901.62ms | 177.92 | 0.6 MB |
| laravel | /planets | 205.87ms | 903.20ms | 183.31 | 0.6 MB |
| symfony | /hello | 101.04ms | 502.40ms | 410.43 | 0.5 MB |
| symfony | /planets | 100.60ms | 499.30ms | 419.24 | 0.5 MB |
