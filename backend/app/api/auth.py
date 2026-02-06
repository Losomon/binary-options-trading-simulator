from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from .. import model, utils, oauth2, schema
from ..database import get_db
from ..model import User, OTP
from ..sendemail import send_email

router = APIRouter(tags=["Auth"])

def create_otp(db: Session, user_id: int, email: str, purpose: str):
    code = str(random.randint(100000, 999999))

    # invalidate old OTPs of same purpose
    db.query(OTP).filter(
        OTP.user_id == user_id,
        OTP.purpose == purpose
    ).delete()

    otp = OTP(
        user_id=user_id,
        code=code,
        purpose=purpose,
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )

    db.add(otp)
    db.commit()

    send_email(code, email)

@router.post("/login")
def login_user(user: schema.Userlogin, db: Session = Depends(get_db)):
    user_data = db.query(User).filter(User.email == user.email).first()

    if not user_data:
        raise HTTPException(status_code=403, detail="Invalid credentials")

    if not utils.verify(user.password, user_data.password):
        raise HTTPException(status_code=403, detail="Invalid credentials")

    create_otp(db, user_data.id, user_data.email, "account_verification")

    return {
        "message": "OTP sent to email",
        "email": user_data.email
    }


@router.post("/register", status_code=201)
def register_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    data = user.dict()
    data["password"] = utils.hash(data["password"])

    new_user = User(**data)

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        create_otp(db, new_user.id, new_user.email, "account_verification")

        return {
            "message": "OTP sent for account verification",
            "email": new_user.email
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")


@router.post("/verify-otp")
def verify_otp(email: str = Body(...), code: str = Body(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = db.query(OTP).filter(
        OTP.user_id == user.id,
        OTP.code == code,
        OTP.purpose == "account_verification"
    ).first()

    if not otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > otp.expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")

    user.is_verified = True
    db.delete(otp)
    db.commit()

    access_token = oauth2.create_access_token({"user_id": user.id})

    return {
        "message": "OTP verified",
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/resend-otp")
def resend_otp(email: str = Body(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    create_otp(db, user.id, user.email, "account_verification")

    return {"message": "OTP resent"}

@router.post("/forgot-password")
def forgot_password(user: schema.UserForgotPassword, db: Session = Depends(get_db)):
    user_data = db.query(User).filter(User.email == user.email).first()

    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    create_otp(db, user_data.id, user_data.email, "password_reset")

    return {
        "message": "OTP sent for password reset",
        "email": user_data.email
    }

@router.post("/reset-password")
def reset_password(
    email: str = Body(...),
    otp_code: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = db.query(OTP).filter(
        OTP.user_id == user.id,
        OTP.code == otp_code,
        OTP.purpose == "password_reset"
    ).first()

    if not otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > otp.expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")

    user.password = utils.hash(new_password)
    db.delete(otp)
    db.commit()

    return {"message": "Password reset successful"}
