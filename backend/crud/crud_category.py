from typing import List
from fastapi import HTTPException, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import models
import schemas
from fastapi import APIRouter
from database import get_db

router = APIRouter(
    prefix='/categories',
    tags=['Categories']
)

@router.get('', response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()

    return categories


@router.post('', status_code=status.HTTP_201_CREATED, response_model=schemas.Category, responses={400: {"model": schemas.Message}, 422: {"model": schemas.Message}})
def create_categories(category_create: schemas.CreateCategory, db: Session = Depends(get_db)):
    data = category_create.model_dump()

    if len(data['name']) > 600:
        return JSONResponse(status_code=400, content={"message": "Category name is too long"})
    
    if data['name'].isdigit():
        return JSONResponse(status_code=400, content={"message": "Category name cannot contain only numbers"})
    
    new_category = models.Category(**data)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category