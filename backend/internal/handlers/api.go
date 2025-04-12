package handlers

import (
	"encoding/json"
	"net/http"
	"runtime"
	"time"
)

type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp int64  `json:"timestamp"`
}

type MetricsResponse struct {
	Uptime      int64   `json:"uptime"`
	MemoryUsage float64 `json:"memory_usage"`
	NumGoroutine int    `json:"num_goroutine"`
	NumCPU      int     `json:"num_cpu"`
}

var startTime = time.Now()

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	response := HealthResponse{
		Status:    "ok",
		Timestamp: time.Now().Unix(),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func Metrics(w http.ResponseWriter, r *http.Request) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	response := MetricsResponse{
		Uptime:      int64(time.Since(startTime).Seconds()),
		MemoryUsage: float64(m.Alloc) / 1024 / 1024, // Convert to MB
		NumGoroutine: runtime.NumGoroutine(),
		NumCPU:      runtime.NumCPU(),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
} 