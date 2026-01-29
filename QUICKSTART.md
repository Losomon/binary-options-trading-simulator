# 🚀 Quick Start Guide

Get up and running with the Binary Options Trading Simulator in under 10 minutes!

---

## ⚡ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Python 3.9+** installed ([Download](https://www.python.org/downloads/))
- [ ] **Node.js 16+** and npm installed ([Download](https://nodejs.org/))
- [ ] **PostgreSQL 13+** installed ([Download](https://www.postgresql.org/download/))
- [ ] **Git** installed ([Download](https://git-scm.com/downloads))
- [ ] A code editor (VS Code recommended)

### Verify Installations

```bash
python --version  # Should be 3.9 or higher
node --version    # Should be 16 or higher
npm --version     # Should be 7 or higher
psql --version    # Should be 13 or higher
git --version     # Should be 2.x
```

---

## 📥 Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/binary-options-trading-simulator.git

# Navigate into the project
cd binary-options-trading-simulator
```

---

## 🗄️ Step 2: Database Setup

### Create Database

```bash
# On macOS/Linux
sudo -u postgres psql
CREATE DATABASE binary_options_dev;
CREATE USER trader WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE binary_options_dev TO trader;
\q

# On Windows (using pgAdmin or psql)
psql -U postgres
CREATE DATABASE binary_options_dev;
CREATE USER trader WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE binary_options_dev TO trader;
\q
```

---

## 🐍 Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# Update the following line in .env:
# DATABASE_URL=postgresql://trader:your_secure_password@localhost:5432/binary_options_dev
```

### Run Database Migrations

```bash
# Still in backend directory with venv activated
alembic upgrade head
```

---

## ⚛️ Step 4: Frontend Setup

```bash
# Open a new terminal window
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default should work)
# REACT_APP_API_URL=http://localhost:8000
```

---

## 🎮 Step 5: Run the Application

### Terminal 1 - Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Terminal 2 - Frontend

```bash
cd frontend
npm start
```

You should see:
```
Compiled successfully!

You can now view binary-options-simulator in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## ✅ Step 6: Verify Installation

### Backend Health Check

Open your browser and visit:
```
http://localhost:8000/health
```

You should see:
```json
{
  "status": "healthy",
  "version": "0.1.0"
}
```

### Frontend

Open your browser and visit:
```
http://localhost:3000
```

You should see the application dashboard!

### API Documentation

Visit the auto-generated API docs:
```
http://localhost:8000/docs
```

---

## 🧪 Step 7: Run Tests (Optional)

### Backend Tests

```bash
cd backend
source venv/bin/activate
pytest
```

Expected output:
```
============================= test session starts ==============================
collected 0 items (0.00s)

============================= 0 passed in 0.50s ================================
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 🐳 Alternative: Docker Setup (Advanced)

If you prefer using Docker:

```bash
# Make sure Docker and Docker Compose are installed
docker --version
docker-compose --version

# Build and run all services
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# Database: localhost:5432
```

---

## 📝 Next Steps

Now that you're set up:

1. **Explore the Code**
   - Check out `backend/app/services/indicators/` for indicator implementations
   - Look at `frontend/src/components/` for UI components

2. **Read the Documentation**
   - [API Documentation](docs/api/README.md)
   - [Strategy Development Guide](docs/strategies/README.md)
   - [Contributing Guidelines](CONTRIBUTING.md)

3. **Start Contributing**
   - Pick a `good-first-issue` from the [Issues](https://github.com/YOUR_USERNAME/binary-options-trading-simulator/issues)
   - Read [CONTRIBUTING.md](CONTRIBUTING.md)
   - Create your first Pull Request!

4. **Join the Community**
   - Star the repository ⭐
   - Watch for updates 👀
   - Join discussions 💬

---

## 🆘 Troubleshooting

### Common Issues

#### Issue: "Module not found" error in Python
```bash
# Solution: Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

#### Issue: Database connection error
```bash
# Solution: Check PostgreSQL is running
sudo service postgresql status  # Linux
brew services list              # macOS
# Check Services on Windows

# Verify credentials in .env match database
```

#### Issue: Port 8000 or 3000 already in use
```bash
# Solution: Change ports in configuration
# Backend: Edit uvicorn command to use different port
uvicorn app.main:app --reload --port 8001

# Frontend: Create .env with:
PORT=3001
```

#### Issue: npm install fails
```bash
# Solution: Clear npm cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Useful Commands

### Backend

```bash
# Run server
uvicorn app.main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=app tests/

# Format code
black app/

# Lint code
flake8 app/

# Create new migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Frontend

```bash
# Run development server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🎯 Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test your changes**
   ```bash
   pytest  # Backend
   npm test  # Frontend
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in the template
   - Request review

---

## 📧 Need Help?

- **Documentation Issues?** Open an issue labeled `documentation`
- **Bug Found?** Open an issue labeled `bug`
- **Feature Idea?** Open an issue labeled `enhancement`
- **Questions?** Open a discussion

---

Happy coding! 🚀 Welcome to the Binary Options Trading Simulator project!
