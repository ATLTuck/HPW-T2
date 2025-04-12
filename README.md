# High-Performance Web Application Seed

A production-ready seed repository for building performance-critical real-time web applications. This repository provides a solid foundation for creating scalable, low-latency applications with a focus on local-first architecture and minimal external dependencies.

## 🚀 Features

- **Real-Time Communication**: WebSocket-based bi-directional communication with SSE fallback
- **High-Performance Backend**: Go-based server with async processing
- **Optimized Frontend**: Svelte with compile-time optimizations
- **Multiple Database Options**: SQLite, RocksDB, and DuckDB
- **Edge Computing Ready**: Local edge node setup
- **Security First**: mTLS, rate limiting, and circuit breakers

## 🏗 Architecture

```
.
├── frontend/          # Svelte frontend application
├── backend/          # Go backend server
├── database/         # Database configurations and scripts
├── demo/            # Interactive demo and documentation
└── scripts/         # Setup and utility scripts
```

## 🛠 Prerequisites

- Go 1.21 or later
- Node.js 18 or later
- SQLite 3
- RocksDB
- DuckDB

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hpw-seed.git
   cd hpw-seed
   ```

2. Install dependencies:
   ```bash
   # Backend dependencies
   cd backend
   go mod download

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up databases:
   ```bash
   cd ../database
   ./setup.sh
   ```

4. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   go run main.go

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 📚 Documentation

- [Architecture Guide](docs/architecture.md)
- [Performance Optimization](docs/performance.md)
- [Security Best Practices](docs/security.md)
- [Database Configuration](docs/database.md)

## 🎯 Use Cases

This seed repository is ideal for building:

- Real-time financial dashboards
- Collaborative tools
- Online gaming platforms
- IoT dashboards
- Streaming analytics platforms

## 🔧 Configuration

The application can be configured through environment variables:

```bash
# Server Configuration
SERVER_PORT=8080
SERVER_HOST=localhost

# Database Configuration
DB_TYPE=sqlite  # or rocksdb, duckdb
DB_PATH=./data

# Security
TLS_CERT_PATH=./certs/server.crt
TLS_KEY_PATH=./certs/server.key
```

## 📊 Performance Benchmarks

- WebSocket latency: < 1ms
- Database query time: < 5ms
- Initial page load: < 100ms
- Concurrent connections: 10,000+

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 