from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Connection(Base):
    __tablename__ = "connections"

    id       = Column(Integer, primary_key=True, index=True)
    name     = Column(String, nullable=False)

    host     = Column(String, nullable=False)
    port     = Column(Integer, nullable=False)
    user     = Column(String, nullable=False)
    password = Column(String, nullable=False)
    database = Column(String, nullable=False)
    engine   = Column(String, nullable=False, default="postgres")

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner    = relationship("User", back_populates="connections")