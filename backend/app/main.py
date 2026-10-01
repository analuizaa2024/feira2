"""Ponto de entrada da API. Rode com:  uvicorn app.main:app --reload"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.routers import empreendedoras, usuarios
from app.routers import autentificacao

app = FastAPI(title="Elas em Rede API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(autentificacao.router)
app.include_router(usuarios.router)
app.include_router(empreendedoras.router)
