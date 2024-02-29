from typing import Annotated, List, Union
from fastapi import HTTPException, Depends, status, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models
import schemas
from fastapi import APIRouter
from database import get_db
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix='/products',
    tags=['Products']
)

def get_pagination_params(
    # offset must be greater than or equal to 0
    offset: int = Query(0, ge=0),
    # limit must be greater than 0
    limit: int = Query(10, gt=0)
):
    return {"offset": offset, "limit": limit}

def validate_product_input(data: schemas.CreateProduct):
    data = data.model_dump()

    if len(data['name']) > 600:
        return JSONResponse(status_code=400, content={"message": "Product name is too long"})
    
    if data['name'].isdigit():
        return JSONResponse(status_code=400, content={"message": "Product name cannot contain only numbers"})
    
    if data['price'] < 0:
        return JSONResponse(status_code=400, content={"message": "Product price cannot be less than 0"})

    return data
    

@router.get('', response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db), pagination: dict = Depends(get_pagination_params), category_id: Annotated[list, Query()] = []):
    offset = pagination["offset"]
    limit = pagination["limit"]
    products = db.query(models.Product).filter(models.Product.active)

    if len(category_id):
        products = products.filter(models.Product.category_id.in_(category_id))

    return products.offset(offset).limit(limit).all()

@router.post('', status_code=status.HTTP_201_CREATED, response_model=schemas.Product, responses={404: {"model": schemas.Message}, 400: {"model": schemas.Message}, 422: {"model": schemas.Message}})
def create_product(product_create: schemas.CreateProduct, db: Session = Depends(get_db)):
    try:
        data = validate_product_input(product_create)

        if isinstance(data, JSONResponse):
            return data
        
        new_product = models.Product(**data)

        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product
    
    except IntegrityError:
        return JSONResponse(status_code=404, content={"message": "Category does not exist"})

@router.put("/{product_id}", status_code=status.HTTP_200_OK, response_model=schemas.Product, responses={404: {"model": schemas.Message}, 400: {"model": schemas.Message}, 422: {"model": schemas.Message}})
def update_product(product_id: str, product_data: schemas.ProductBase, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        try: 
            data = validate_product_input(product_data)

            if isinstance(data, JSONResponse):
                return data
            
            if data['name'] is not None:
                product.name = data['name']
            if data['description'] is not None:
                product.description = data['description']
            if data['price'] is not None:
                product.price = data['price'] 
            if data['category_id'] is not None:
                product.category_id = data['category_id']
            
            db.commit()

            return product
        
        except IntegrityError:
            return JSONResponse(status_code=404, content={"message": "Category does not exist"})
    else:
        raise JSONResponse(status_code=404, content="Product does not exist")


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT, response_model=schemas.Product, responses={404: {"model": schemas.Message}})
def update_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product:
        product.active = False
        
        db.commit()

        return product
    else:
        raise JSONResponse(status_code=404, content="Product does not exist")