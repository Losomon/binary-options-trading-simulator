from sqlalchemy import Column, DateTime, Integer, String, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.types import TIMESTAMP as TimeStamp
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone_number = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(TimeStamp(timezone=True), nullable=False, server_default=text("now()"))

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class OTP(Base):
    __tablename__ = "otps"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    code = Column(String)
    purpose = Column(String, nullable=False)  
    expires_at = Column(DateTime, default=datetime.utcnow() + timedelta(minutes=5))
    created_at = Column(TimeStamp(timezone=True), nullable=False, server_default=text("now()"))