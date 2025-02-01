# prexel mono

prexel is a **pixel editor** designed for creating command-line welcome screens. This monorepo contains the following components:

- **Go API** - Backend service handling pixel data and user interactions.
- **React + TypeScript + Tailwind Client** - Web-based frontend for creating and managing pixel designs.
- **Rust CLI** - Command-line tool for exporting and displaying pixel-based welcome screens.

---

## 📁 Project Structure

```txt
prexel/
│── api/          # Go backend API
│── client/       # React TypeScript frontend with Tailwind CSS
│── cli/          # Rust CLI application
```

---

## 🚀 Getting Started

### **1️⃣ Prerequisites**

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (for client)
- [Go](https://golang.org/) (for API development)
- [Rust](https://www.rust-lang.org/) (for CLI tool)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### **2️⃣ Installation**

Clone the repository:

```sh
git clone hhttps://github.com/pintard/prexel.git
cd prexel
```

Install dependencies:

```sh
# Install client dependencies
cd client && npm install

# Install Go dependencies
cd ../api && go mod tidy

# Install Rust dependencies
cd ../cli && cargo build
```

### **3️⃣ Running the Applications**

#### **Backend (Go API)**

```sh
cd api
go run main.go
```

Server will be available at `http://localhost:8080`

#### **Frontend (React Client)**

```sh
cd client
npm run dev
```

Client will be available at `http://localhost:5173`

#### **CLI (Rust)**

```sh
cd cli
cargo run -- --help
```

This will display available CLI commands.

---

## 🛠️ Development

### **Linting & Formatting**

```sh
# Client (React + TypeScript)
npm run lint

# API (Go)
gofmt -w .

go vet ./...

# CLI (Rust)
cargo fmt
cargo clippy
```

### **Testing**

```sh
# Client (React Testing Library + Jest)
npm run test

# API (Go tests)
go test ./...

# CLI (Rust tests)
cargo test
```

---

## 📦 Deployment

### **Dockerized Setup**

To run all components in containers:

```sh
docker-compose up --build
```

### **Manual Deployment**

#### **Frontend**

```sh
npm run build
```

#### **Backend**

```sh
go build -o prexel-api
./prexel-api
```

#### **CLI**

```sh
cargo build --release
./target/release/prexel-cli
```

---

## 🛠️ Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-xyz`)
3. Commit changes (`git commit -m 'Add feature xyz'`)
4. Push to the branch (`git push origin feature-xyz`)
5. Create a pull request

---

## 📜 License

Prexel is licensed under the [MIT License](LICENSE).
