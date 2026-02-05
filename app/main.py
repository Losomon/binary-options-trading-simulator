from fastapi import FastAPI
from . import model
from .database import engine
from .api import auth

model.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Binary Options Trading Simulator API",
    description="Backend API for strategy simulation, indicators, and backtesting",
    version="0.1.0",
)

app.include_router(auth.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
