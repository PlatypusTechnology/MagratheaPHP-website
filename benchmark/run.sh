#!/usr/bin/env bash
# Benchmarks MagratheaPHP 3 vs Slim, Laravel and Symfony.
# Usage: ./run.sh            (build + bench everything)
#        DURATION=60s ./run.sh
set -euo pipefail
cd "$(dirname "$0")"

DURATION="${DURATION:-30s}"
WARMUP="${WARMUP:-5s}"
CONNECTIONS="${CONNECTIONS:-50}"
THREADS="${THREADS:-2}"

APPS=(magrathea slim laravel symfony)
declare -A PORTS=([magrathea]=8081 [slim]=8082 [laravel]=8083 [symfony]=8084)
ENDPOINTS=(hello planets)

wrk_run() {
  if command -v wrk >/dev/null 2>&1; then
    wrk "$@"
  else
    docker run --rm --network host williamyeh/wrk "$@"
  fi
}

echo "==> Building containers (first run downloads a lot; grab a coffee)"
docker compose build
docker compose up -d

echo "==> Waiting for apps to answer"
for app in "${APPS[@]}"; do
  port="${PORTS[$app]}"
  for i in $(seq 1 30); do
    if curl -sf "http://localhost:${port}/hello" >/dev/null 2>&1; then
      echo "    ${app} up on :${port}"
      break
    fi
    if [ "$i" -eq 30 ]; then
      echo "    ERROR: ${app} never came up on :${port}" >&2
      docker compose logs "$app" | tail -20 >&2
      exit 1
    fi
    sleep 1
  done
done

RESULTS_FILE="results.md"
{
  echo "# Benchmark results — $(date -u '+%Y-%m-%d %H:%M UTC')"
  echo ""
  echo "wrk: -t${THREADS} -c${CONNECTIONS} -d${DURATION} (after ${WARMUP} warmup) — 1 vCPU / 512MB per container, PHP 8.3 + Apache, OPcache on, no DB"
  echo ""
  echo "| Framework | Endpoint | p50 latency | p99 latency | Req/sec | Peak memory |"
  echo "|-----------|----------|-------------|-------------|---------|-------------|"
} > "$RESULTS_FILE"

for app in "${APPS[@]}"; do
  port="${PORTS[$app]}"
  for ep in "${ENDPOINTS[@]}"; do
    url="http://localhost:${port}/${ep}"
    echo "==> ${app} /${ep} : warmup ${WARMUP}"
    wrk_run -t"$THREADS" -c"$CONNECTIONS" -d"$WARMUP" "$url" >/dev/null

    echo "==> ${app} /${ep} : measuring ${DURATION}"
    out="$(wrk_run -t"$THREADS" -c"$CONNECTIONS" -d"$DURATION" --latency "$url")"
    echo "$out"

    p50="$(echo "$out" | awk '$1=="50%"{print $2}')"
    p99="$(echo "$out" | awk '$1=="99%"{print $2}')"
    rps="$(echo "$out" | awk '/^Requests\/sec/{print $2}')"

    mem_bytes="$(curl -s -o /dev/null -D - "$url" | tr -d '\r' | awk -F': ' 'tolower($1)=="x-peak-mem"{print $2}')"
    if [ -n "$mem_bytes" ]; then
      mem="$(awk "BEGIN{printf \"%.1f MB\", ${mem_bytes}/1048576}")"
    else
      mem="n/a"
    fi

    echo "| ${app} | /${ep} | ${p50:-?} | ${p99:-?} | ${rps:-?} | ${mem} |" >> "$RESULTS_FILE"
  done
done

echo ""
echo "==> Done. Results written to benchmark/${RESULTS_FILE}:"
echo ""
cat "$RESULTS_FILE"
echo ""
echo "Containers are still running (ports 8081-8084)."
echo "Stop them with: docker compose down"
