import datetime
from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str

class CreateCategory(CategoryBase):
    class Config:
        from_attributes = True

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: str
    price: float

class CreateProduct(ProductBase):
    category_id: int
    class Config:
        from_attributes = True

class Product(ProductBase):
    id: int
    active: bool
    created_at: datetime.datetime
    updated_at: datetime.datetime
    category: Category 

    class Config:
        from_attributes = True

class Message(BaseModel):
    message: str
