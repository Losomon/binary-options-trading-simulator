from pydantic import BaseModel, EmailStr



class UserCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: EmailStr
    password: str


class Userlogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        from_attributes = True


class tokenResponse(BaseModel):
    access_token: str
    token_type: str


class tokenData(BaseModel):
    user_id: int

class UserForgotPassword(BaseModel):
        email: EmailStr

        class Config:
            from_attributes = True

class UserResetPassword(BaseModel):
        email: EmailStr
        otp: str
        new_password: str

        class Config:
            from_attributes = True

class OTPVerifyRequest(BaseModel):
        code: str