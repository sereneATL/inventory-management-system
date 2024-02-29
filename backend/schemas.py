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
    category_id: int

class CreateProduct(ProductBase):
    class Config:
        from_attributes = True

class Product(ProductBase):
    id: int
    active: bool

    class Config:
        from_attributes = True

class Message(BaseModel):
    message: str
