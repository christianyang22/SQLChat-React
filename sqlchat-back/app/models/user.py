from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    first_name      = Column(String, nullable=False)
    last_name       = Column(String, nullable=False)
    birth_date      = Column(Date, nullable=False)
    email           = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    connections = relationship("Connection", back_populates="owner")
    preferences = relationship("Preferences", back_populates="user", uselist=False)