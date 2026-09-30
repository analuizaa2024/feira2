"""Formato dos dados que a API recebe (o FastAPI valida automaticamente)."""
from typing import Optional

from pydantic import BaseModel


class CadastroIn(BaseModel):
    nome: str
    email: str
    senha: str


class LoginIn(BaseModel):
    email: str
    senha: str


class NegocioIn(BaseModel):
    nome_negocio: str
    categoria: Optional[str] = None
    descricao: Optional[str] = None
    problema: Optional[str] = None
    solucao: Optional[str] = None
    publico_alvo: Optional[str] = None
    fase: Optional[str] = None
    objetivo: Optional[str] = None
    diferencial: Optional[str] = None
