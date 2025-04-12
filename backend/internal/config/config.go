package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	ServerAddress string
	Environment   string
	LogLevel      string
	RateLimit     int
	RateWindow    time.Duration
	DBType        string
	DBPath        string
	TLSCertPath   string
	TLSKeyPath    string
}

func Load() (*Config, error) {
	cfg := &Config{
		ServerAddress: getEnv("SERVER_ADDRESS", ":8080"),
		Environment:   getEnv("ENVIRONMENT", "development"),
		LogLevel:      getEnv("LOG_LEVEL", "info"),
		RateLimit:     getEnvAsInt("RATE_LIMIT", 100),
		RateWindow:    getEnvAsDuration("RATE_WINDOW", time.Minute),
		DBType:        getEnv("DB_TYPE", "sqlite"),
		DBPath:        getEnv("DB_PATH", "./data"),
		TLSCertPath:   getEnv("TLS_CERT_PATH", ""),
		TLSKeyPath:    getEnv("TLS_KEY_PATH", ""),
	}

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
} 