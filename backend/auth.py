from passlib.context import CryptContext  # type: ignore

# Allow both bcrypt (old users) and argon2 (new users)
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    """Hash a password using argon2 by default"""
    return pwd_context.hash(password)

def veryfy_password(plain_password: str, hashed_password: str):
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)
