from sqlalchemy import Column, Integer, Boolean, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Preferences(Base):
    __tablename__ = "preferences"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    notifications = Column(Boolean, default=True, nullable=False)
    dark_theme    = Column(Boolean, default=True, nullable=False)
    language      = Column(String(2), default="en", nullable=False)

    user = relationship("User", back_populates="preferences")