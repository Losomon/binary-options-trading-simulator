from fastapi import FastAPI

app = FastAPI(
    title="Binary Options Trading Simulator API",
    description="Backend API for strategy simulation, indicators, and backtesting",
    version="0.1.0",
)

@app.get("/health")
def health_check():
    return {"status": "ok"}
