#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to install Go
install_go() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command_exists brew; then
      brew install go
    else
      echo "Please install Homebrew first: https://brew.sh/"
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command_exists apt-get; then
      sudo apt-get update
      sudo apt-get install -y golang-go
    elif command_exists yum; then
      sudo yum install -y golang
    else
      echo "Unsupported package manager. Please install Go manually."
      exit 1
    fi
  else
    echo "Unsupported operating system. Please install Go manually."
    exit 1
  fi
}

# Function to install Node.js
install_node() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command_exists brew; then
      brew install node
    else
      echo "Please install Homebrew first: https://brew.sh/"
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command_exists apt-get; then
      curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
      sudo apt-get install -y nodejs
    elif command_exists yum; then
      curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
      sudo yum install -y nodejs
    else
      echo "Unsupported package manager. Please install Node.js manually."
      exit 1
    fi
  else
    echo "Unsupported operating system. Please install Node.js manually."
    exit 1
  fi
}

# Function to install SQLite
install_sqlite() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command_exists brew; then
      brew install sqlite
    else
      echo "Please install Homebrew first: https://brew.sh/"
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command_exists apt-get; then
      sudo apt-get update
      sudo apt-get install -y sqlite3
    elif command_exists yum; then
      sudo yum install -y sqlite
    else
      echo "Unsupported package manager. Please install SQLite manually."
      exit 1
    fi
  else
    echo "Unsupported operating system. Please install SQLite manually."
    exit 1
  fi
}

# Function to install DuckDB
install_duckdb() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command_exists brew; then
      brew install duckdb
    else
      echo "Please install Homebrew first: https://brew.sh/"
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command_exists apt-get; then
      sudo apt-get update
      sudo apt-get install -y duckdb
    elif command_exists yum; then
      sudo yum install -y duckdb
    else
      echo "Unsupported package manager. Please install DuckDB manually."
      exit 1
    fi
  else
    echo "Unsupported operating system. Please install DuckDB manually."
    exit 1
  fi
}

# Check and install dependencies
echo "Checking dependencies..."

# Check Go
if ! command_exists go; then
  echo "Installing Go..."
  install_go
fi

# Check Node.js
if ! command_exists node; then
  echo "Installing Node.js..."
  install_node
fi

# Check SQLite
if ! command_exists sqlite3; then
  echo "Installing SQLite..."
  install_sqlite
fi

# Check DuckDB
if ! command_exists duckdb; then
  echo "Installing DuckDB..."
  install_duckdb
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd ../backend
go mod download

# Setup databases
echo "Setting up databases..."
cd ../database
./setup.sh

echo "Installation complete!" 