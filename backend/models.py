from database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, DateTime, ForeignKey, Boolean, text, Numeric
from sqlalchemy.orm import relationship
import datetime


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer,primary_key=True,nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True,nullable=False)
    name = Column(String, index=True, nullable=False)
    description = Column(String, index=True, nullable=False)
    price = Column(Numeric(precision=10, scale=2), nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    category = relationship("Category", back_populates="products")
