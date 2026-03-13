from app.database import Base

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, false, text, TIMESTAMP, true

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    is_active = Column(Boolean, default=true())
    