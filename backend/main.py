from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi_pagination import add_pagination
from database import Base, engine
from crud import crud_category, crud_product
from config import settings
import ast
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

add_pagination(app)

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    data = ast.literal_eval(exc_str)[0]
    return JSONResponse(status_code=422, content={"message": f"{data['msg']} - {data['loc']}"})

app.include_router(crud_category.router, prefix=settings.API_V1_STR)
app.include_router(crud_product.router, prefix=settings.API_V1_STR)

