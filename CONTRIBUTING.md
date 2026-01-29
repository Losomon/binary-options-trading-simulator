# 🤝 Contributing to Binary Options Trading Simulator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

---

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Git
- Code editor (VS Code recommended)

### Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/binary-options-trading-simulator.git
cd binary-options-trading-simulator

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/binary-options-trading-simulator.git
```

### Environment Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies
```

#### Frontend Setup
```bash
cd frontend
npm install
```

#### Database Setup
```bash
# Create PostgreSQL database
createdb binary_options_dev

# Copy environment template
cp backend/.env.example backend/.env

# Edit .env with your database credentials
# Run migrations
cd backend
alembic upgrade head
```

---

## 🔄 Development Workflow

### 1. Create a Branch
```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Branch Naming Conventions
- `feature/` - New features (e.g., `feature/rsi-indicator`)
- `fix/` - Bug fixes (e.g., `fix/calculation-error`)
- `docs/` - Documentation updates (e.g., `docs/api-guide`)
- `test/` - Test additions (e.g., `test/strategy-tests`)
- `refactor/` - Code refactoring (e.g., `refactor/indicator-base`)

### 2. Make Your Changes
- Write clean, readable code
- Follow coding standards (see below)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Backend tests
cd backend
pytest
pytest --cov=app tests/  # With coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage

# Linting
cd backend
black app/
flake8 app/

cd frontend
npm run lint
```

### 4. Commit Your Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add RSI indicator implementation

- Implement RSI calculation algorithm
- Add configurable period parameter
- Include unit tests with known values
- Update API endpoint documentation"
```

### Commit Message Guidelines
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- First line: brief summary (50 chars or less)
- Blank line after first line
- Detailed description if needed
- Reference issues: "Fixes #123" or "Relates to #456"

### 5. Push and Create PR
```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Fill out the PR template
```

---

## 💻 Coding Standards

### Python (Backend)

#### Style Guide
- Follow PEP 8
- Use Black for formatting (line length: 88)
- Use type hints for function signatures
- Use docstrings for classes and functions

```python
from typing import List, Optional

def calculate_sma(prices: List[float], period: int) -> Optional[float]:
    """
    Calculate Simple Moving Average.
    
    Args:
        prices: List of price values
        period: Number of periods for calculation
        
    Returns:
        SMA value or None if insufficient data
        
    Raises:
        ValueError: If period is less than 1
    """
    if period < 1:
        raise ValueError("Period must be at least 1")
    
    if len(prices) < period:
        return None
        
    return sum(prices[-period:]) / period
```

#### Project Structure
```python
# Good import structure
from typing import List, Dict, Optional
import numpy as np
import pandas as pd

from app.models.market_data import MarketData
from app.services.indicators.base import BaseIndicator
from app.core.config import settings

# Bad - avoid wildcard imports
from app.models import *
```

#### Error Handling
```python
# Good - specific exception handling
try:
    result = calculate_indicator(data)
except ValueError as e:
    logger.error(f"Invalid data: {e}")
    raise
except Exception as e:
    logger.exception("Unexpected error in calculation")
    raise

# Bad - catching all exceptions silently
try:
    result = calculate_indicator(data)
except:
    pass
```

### TypeScript/React (Frontend)

#### Style Guide
- Use TypeScript for type safety
- Use functional components with hooks
- Use meaningful component and variable names
- Follow Airbnb React style guide

```typescript
// Good component structure
interface IndicatorChartProps {
  data: MarketData[];
  indicators: string[];
  onIndicatorToggle: (indicator: string) => void;
}

export const IndicatorChart: React.FC<IndicatorChartProps> = ({
  data,
  indicators,
  onIndicatorToggle
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(14);
  
  // Component logic here
  
  return (
    <div className="indicator-chart">
      {/* JSX here */}
    </div>
  );
};
```

#### Hooks Usage
```typescript
// Good - custom hooks for reusable logic
function useMarketData(symbol: string) {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetchMarketData(symbol)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [symbol]);
  
  return { data, loading, error };
}
```

### SQL/Database

#### Naming Conventions
- Table names: lowercase, plural (e.g., `market_data`, `trading_signals`)
- Column names: lowercase, snake_case (e.g., `created_at`, `close_price`)
- Foreign keys: `{table_name}_id` (e.g., `strategy_id`)
- Indexes: `idx_{table}_{columns}` (e.g., `idx_market_data_symbol_timestamp`)

#### Migration Best Practices
```python
# Good - reversible migration
def upgrade():
    op.add_column('strategies', sa.Column('risk_level', sa.String(20)))
    op.create_index('idx_strategies_risk_level', 'strategies', ['risk_level'])

def downgrade():
    op.drop_index('idx_strategies_risk_level')
    op.drop_column('strategies', 'risk_level')
```

---

## 🧪 Testing Guidelines

### Backend Testing

#### Unit Tests
```python
import pytest
from app.services.indicators.rsi import RSIIndicator

class TestRSIIndicator:
    def test_rsi_calculation_standard_case(self):
        """Test RSI with known values."""
        prices = [44, 44.34, 44.09, 43.61, 44.33, 44.83, 45.10, 45.42]
        indicator = RSIIndicator(period=14)
        
        # Add more prices to get valid RSI
        # ...
        
        result = indicator.calculate(prices)
        assert result is not None
        assert 0 <= result <= 100
        assert abs(result - 70.46) < 0.1  # Known expected value
    
    def test_rsi_insufficient_data(self):
        """Test RSI returns None with insufficient data."""
        prices = [44, 44.34]
        indicator = RSIIndicator(period=14)
        
        result = indicator.calculate(prices)
        assert result is None
    
    def test_rsi_invalid_period(self):
        """Test RSI raises error with invalid period."""
        with pytest.raises(ValueError):
            RSIIndicator(period=0)
```

#### Integration Tests
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_calculate_indicator_endpoint():
    """Test indicator calculation API endpoint."""
    response = client.post(
        "/api/indicators/rsi",
        json={
            "symbol": "BTCUSD",
            "period": 14,
            "start_date": "2024-01-01",
            "end_date": "2024-01-31"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "values" in data
    assert len(data["values"]) > 0
```

### Frontend Testing

#### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { StrategySelector } from './StrategySelector';

describe('StrategySelector', () => {
  it('renders strategy options', () => {
    render(<StrategySelector strategies={mockStrategies} />);
    
    expect(screen.getByText('Trend Following')).toBeInTheDocument();
    expect(screen.getByText('Mean Reversion')).toBeInTheDocument();
  });
  
  it('calls onSelect when strategy is clicked', () => {
    const onSelect = jest.fn();
    render(<StrategySelector strategies={mockStrategies} onSelect={onSelect} />);
    
    fireEvent.click(screen.getByText('Trend Following'));
    
    expect(onSelect).toHaveBeenCalledWith('trend_following');
  });
});
```

### Test Coverage Requirements
- Backend: Minimum 80% coverage
- Frontend: Minimum 70% coverage
- All new features must include tests
- Critical paths require 100% coverage

---

## 🔀 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] Added tests for new features
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### PR Template
When creating a PR, please fill out this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123
Relates to #456

## Changes Made
- Added RSI indicator calculation
- Created API endpoint for RSI
- Added unit tests
- Updated API documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
- [ ] Branch is up to date
```

### Review Process
1. At least one maintainer must approve
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback addressed
5. Squash and merge for cleaner history

---

## 📝 Issue Guidelines

### Creating Issues

#### Bug Reports
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10]
- Python version: [e.g., 3.9.7]
- Browser: [e.g., Chrome 96]

**Screenshots**
[If applicable]

**Additional Context**
Any other relevant information
```

#### Feature Requests
```markdown
**Feature Description**
Clear description of the proposed feature

**Problem it Solves**
What problem does this address?

**Proposed Solution**
How should this work?

**Alternatives Considered**
What other approaches did you consider?

**Additional Context**
Any other relevant information
```

### Issue Labels
Use appropriate labels:
- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good-first-issue` - Good for newcomers
- `help-wanted` - Extra attention needed
- `question` - Further information requested

---

## 🎯 Development Priorities

### High Priority
- Core functionality (indicators, strategies, backtesting)
- Bug fixes
- Security issues
- Performance improvements

### Medium Priority
- Additional indicators
- UI improvements
- Documentation
- Test coverage

### Low Priority
- Nice-to-have features
- Code refactoring (unless needed)
- Experimental features

---

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

---

## 📞 Getting Help

- **Questions?** Open an issue with the `question` label
- **Stuck?** Ask in discussions or comments
- **Found a bug?** Open an issue with detailed information

---

## 📚 Additional Resources

- [Project README](README.md)
- [API Documentation](docs/api/README.md)
- [Architecture Guide](docs/architecture.md)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Writing Good Commit Messages](https://chris.beams.io/posts/git-commit/)

---

Thank you for contributing to Binary Options Trading Simulator! 🚀
