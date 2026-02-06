from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash(password: str) -> str:
    # pre-hash to avoid bcrypt 72-byte limit
    sha = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.hash(sha)

def verify(plain_password: str, hashed_password: str) -> bool:
    sha = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return pwd_context.verify(sha, hashed_password)
